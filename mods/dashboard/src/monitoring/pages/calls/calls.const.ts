/**
 * Copyright (C) 2025 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * Licensed under the MIT License.
 */

export const CALLS_SEARCHABLE_FIELDS = [
  { label: "Call ID", value: "ref" },
  { label: "Status", value: "status" },
  { label: "Direction", value: "direction" },
  { label: "From", value: "from" },
  { label: "To", value: "to" },
  { label: "Type", value: "type" },
  { label: "Duration", value: "duration" }
];

export const STATUS_LABELS: Record<string, string> = Object.freeze({
  // Proto default (0) when hangupCause was never written for the CDR
  UNKNOWN: "No hangup cause",
  NORMAL_CLEARING: "Completed",
  CALL_REJECTED: "Rejected",
  UNALLOCATED: "Unallocated",
  NO_USER_RESPONSE: "No response",
  NO_ROUTE_DESTINATION: "No destination",
  NO_ANSWER: "No answer",
  USER_BUSY: "Busy",
  NOT_ACCEPTABLE_HERE: "Not acceptable",
  SERVICE_UNAVAILABLE: "Unavailable",
  INVALID_NUMBER_FORMAT: "Invalid number"
});

export const DIRECTION_LABELS: Record<string, string> = Object.freeze({
  INTRA_NETWORK: "Intra Network",
  FROM_PSTN: "From PSTN",
  TO_PSTN: "To PSTN"
});

export const TYPE_LABELS: Record<string, string> = Object.freeze({
  SIP_ORIGINATED: "SIP Originated",
  API_ORIGINATED: "API Originated"
});

export function formatCallDuration(duration: number): string {
  if (duration < 60) {
    return `${duration}s`;
  }
  if (duration < 3600) {
    return `${Math.floor(duration / 60)}m`;
  }
  return "60m+";
}
