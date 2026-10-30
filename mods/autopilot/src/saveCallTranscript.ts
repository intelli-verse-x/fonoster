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
import { getLogger } from "@fonoster/logger";

const logger = getLogger({ service: "autopilot", filePath: __filename });

function influxString(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n");
}

/**
 * Writes the spoken lines next to the call id so Monitoring can read them.
 * Skips quietly when Influx is not configured on this process.
 */
export async function saveCallTranscript(input: {
  callRef: string;
  transcript: string;
  recordingUrl: string;
}): Promise<void> {
  const base = String(process.env.INFLUXDB_URL || "")
    .trim()
    .replace(/\/$/, "");
  const token = String(process.env.INFLUXDB_TOKEN || "").trim();
  const org = String(process.env.INFLUXDB_ORG || "").trim();
  const bucket = String(process.env.INFLUXDB_CALLS_BUCKET || "").trim();
  const callRef = String(input.callRef || "").trim();
  if (!base || !token || !org || !bucket || !callRef) return;
  if (!/^[A-Za-z0-9-]+$/.test(callRef)) return;

  const line =
    `call_transcript,ref=${callRef} ` +
    `transcript="${influxString(input.transcript || "")}",` +
    `recordingUrl="${influxString(input.recordingUrl || "")}"`;

  const endpoint =
    `${base}/api/v2/write?org=${encodeURIComponent(org)}` +
    `&bucket=${encodeURIComponent(bucket)}&precision=ns`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "text/plain; charset=utf-8"
    },
    body: line
  });
  if (!response.ok) {
    const detail = await response.text();
    logger.warn("call transcript was not saved for monitoring", {
      callRef,
      status: response.status,
      detail: detail.slice(0, 180)
    });
  }
}
