/**
 * Copyright (C) 2025 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * This file is part of Fonoster
 *
 * Licensed under the MIT License (the "License");
 * you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *    https://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { INFLUXDB_CALLS_BUCKET, InfluxDBClient } from "@fonoster/common";
import { getLogger } from "@fonoster/logger";
import { CallDetailRecord } from "@fonoster/types";
import { flux } from "@influxdata/influxdb-client";

const logger = getLogger({ service: "apiserver", filePath: __filename });
type TranscriptRow = {
  ref?: string;
  _time?: string;
  transcript?: string;
  recordingUrl?: string;
};

// Influx CDRs may contain epoch seconds or milliseconds; legacy exports also
// contain ISO timestamps. Never guess a duration from the number of words.
function epochSeconds(value: unknown): number {
  if (value == null || value === "" || typeof value === "boolean") return 0;
  const n = Number(value);
  if (!Number.isFinite(n)) {
    const ms = typeof value === "string" ? Date.parse(value) : NaN;
    return Number.isFinite(ms) && ms > 0 ? Math.round(ms / 1000) : 0;
  }
  if (n <= 0) return 0;
  return Math.round(
    n / (n >= 1e17 ? 1e9 : n >= 1e14 ? 1e6 : n > 9999999999 ? 1e3 : 1)
  );
}

export async function attachCallTranscripts(
  influxdb: InfluxDBClient,
  items: CallDetailRecord[]
): Promise<CallDetailRecord[]> {
  if (!items.length) return items;
  const query = flux`from(bucket: "${INFLUXDB_CALLS_BUCKET}")
    |> range(start: -30d)
    |> filter(fn: (r) => r._measurement == "call_transcript")
    |> pivot(rowKey: ["ref", "_time"], columnKey: ["_field"], valueColumn: "_value")
    |> group(columns: ["ref"])
    |> sort(columns: ["_time"], desc: true)
    |> limit(n: 1)`;
  let rows: TranscriptRow[] = [];
  try {
    rows = (await influxdb.collectRows(query)) as TranscriptRow[];
  } catch (error) {
    logger.warn("call transcripts were not loaded", { error });
    return items;
  }
  const byRef = new Map<string, TranscriptRow>();
  for (const row of rows) {
    const ref = String(row.ref || "").trim();
    const previous = byRef.get(ref);
    if (
      ref &&
      (!previous ||
        Date.parse(row._time || "") > Date.parse(previous._time || ""))
    )
      byRef.set(ref, row);
  }
  return items.map((item) => {
    const extra = byRef.get(String(item.ref || ""));
    if (!extra) return item;
    const start = epochSeconds(item.startedAt);
    const end = epochSeconds(item.endedAt);
    let duration =
      start > 0 && end > start ? end - start : Number(item.duration) || 0;
    const recordingTimestamp = String(extra.recordingUrl || "").match(
      /_(\d+(?:\.\d+)?)\.wav$/
    );
    const recordingEnd = recordingTimestamp ? Number(recordingTimestamp[1]) : 0;
    if (duration === 0 && start > 0 && recordingEnd > start)
      duration = Math.round(recordingEnd - start);
    const saved = epochSeconds(extra._time);
    // This estimate includes persistence lag; do not invent a hangup cause or endedAt.
    if (duration === 0 && start > 0 && saved > start)
      duration = Math.min(14400, saved - start);
    return {
      ...item,
      duration,
      transcript: String(extra.transcript || ""),
      recordingUrl: String(extra.recordingUrl || "")
    };
  });
}
