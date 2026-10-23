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
import { Box, Button, Typography } from "@mui/material";

export function CallTranscript({
  transcript,
  recordingUrl,
  loading,
  failed,
  onRetry
}: {
  transcript: string;
  recordingUrl: string;
  loading: boolean;
  failed: boolean;
  onRetry: () => void;
}) {
  return (
    <Box sx={{ px: 2, pb: 2 }}>
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "base.05",
          mb: 0.75
        }}
      >
        Transcript
      </Typography>
      <Typography
        sx={{
          fontSize: 14,
          lineHeight: 1.6,
          color: "#fff",
          whiteSpace: "pre-wrap"
        }}
      >
        {transcript ||
          (loading
            ? "Loading transcript…"
            : failed
              ? "Could not load this transcript."
              : "No words were captured on this call.")}
      </Typography>
      {failed && <Button onClick={onRetry}>Retry</Button>}
      {recordingUrl ? (
        <Typography sx={{ mt: 1, fontSize: 13 }}>
          <Box
            component="a"
            href={recordingUrl}
            target="_blank"
            rel="noreferrer"
            sx={{ color: "brand.main" }}
          >
            Open recording
          </Box>
        </Typography>
      ) : null}
    </Box>
  );
}
