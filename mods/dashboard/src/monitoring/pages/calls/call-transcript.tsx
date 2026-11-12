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
import { useMemo } from "react";
import {
  parseCallTranscript,
  transcriptRoleLabel
} from "./parse-call-transcript";

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
  const turns = useMemo(() => parseCallTranscript(transcript), [transcript]);

  const emptyMessage = loading
    ? "Loading transcript…"
    : failed
      ? "Could not load this transcript."
      : "No words were captured on this call.";

  return (
    <Box sx={{ px: 2, pb: 2 }}>
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "base.05",
          mb: 1.25
        }}
      >
        Transcript
      </Typography>

      {turns.length === 0 ? (
        <Typography
          sx={{
            fontSize: 14,
            lineHeight: 1.6,
            color: "#0b1433",
            whiteSpace: "pre-wrap"
          }}
        >
          {emptyMessage}
        </Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.25,
            p: 1.5,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "base.07",
            bgcolor: "rgba(36, 87, 214, 0.04)"
          }}
        >
          {turns.map((turn, index) => {
            const isAgent = turn.role === "ai";
            const isCaller = turn.role === "human";
            return (
              <Box
                key={`${turn.role}-${index}`}
                sx={{
                  display: "flex",
                  justifyContent: isCaller ? "flex-end" : "flex-start"
                }}
              >
                <Box
                  sx={{
                    maxWidth: "92%",
                    px: 1.5,
                    py: 1.1,
                    borderRadius: 2,
                    bgcolor: isAgent
                      ? "rgba(36, 87, 214, 0.12)"
                      : isCaller
                        ? "#ffffff"
                        : "rgba(11, 20, 51, 0.04)",
                    border: "1px solid",
                    borderColor: isAgent
                      ? "rgba(36, 87, 214, 0.28)"
                      : "base.07",
                    boxShadow: isCaller
                      ? "0 1px 2px rgba(11, 20, 51, 0.06)"
                      : "none"
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: isAgent ? "brand.main" : "base.05",
                      mb: 0.4
                    }}
                  >
                    {transcriptRoleLabel(turn.role)}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 14,
                      lineHeight: 1.55,
                      color: "#0b1433",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word"
                    }}
                  >
                    {turn.text}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}

      {failed && <Button onClick={onRetry}>Retry</Button>}
      {recordingUrl ? (
        <Typography sx={{ mt: 1.25, fontSize: 13 }}>
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
