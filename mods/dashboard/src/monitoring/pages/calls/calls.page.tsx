/**
 * Copyright (C) 2025 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * Licensed under the MIT License.
 */
import type { Route } from "./+types/calls.page";
import { useCallback, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
  styled
} from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CallMadeOutlinedIcon from "@mui/icons-material/CallMadeOutlined";
import { mkConfig, generateCsv, download } from "export-to-csv";
import type { CallDetailRecord } from "@fonoster/types";

import { Page } from "~/core/components/general/page/page";
import { CALLS_PAGE_SIZE } from "~/core/shared/page-sizes.const";
import {
  CALLS_SEARCHABLE_FIELDS,
  DIRECTION_LABELS,
  STATUS_LABELS,
  TYPE_LABELS,
  formatCallDuration
} from "./calls.const";
import { useResourceTable } from "~/core/hooks/use-resource-table";
import { useCalls } from "../../services/calls.service";
import { PRODUCT_NAME } from "~/core/brand/product";
import { ResourceListSkeleton } from "~/core/brand/studio-skeletons";
import { toast } from "~/core/components/design-system/ui/toaster/toaster";

export function meta(_: Route.MetaArgs) {
  return [
    { title: `Monitoring | ${PRODUCT_NAME}` },
    {
      name: "description",
      content:
        "Call logs for this workspace — who called, where it went, and how long it lasted."
    }
  ];
}

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "voice-studio-call-logs"
});

const Hero = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 24,
  marginBottom: 24,
  flexWrap: "wrap"
}));

const Board = styled(Box)(({ theme }) => ({
  borderRadius: 20,
  padding: 8,
  background: theme.palette.bg.muted,
  border: `1px solid ${theme.palette.base["07"]}`,
  overflow: "hidden"
}));

const Toolbar = styled(Box)(() => ({
  display: "flex",
  gap: 12,
  alignItems: "center",
  flexWrap: "wrap",
  padding: "8px 8px 12px"
}));

const LedgerHeader = styled(Box)(() => ({
  display: "none",
  gridTemplateColumns:
    "132px minmax(160px, 1.4fr) 100px 110px 64px minmax(90px, 0.9fr)",
  gap: 12,
  padding: "10px 16px",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  "@media (min-width: 720px)": {
    display: "grid"
  }
}));

const LedgerRow = styled(Box)(() => ({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 10,
  padding: "14px 16px",
  borderBottom: "1px solid rgba(255,255,255,0.04)",
  transition: "background 120ms ease",
  "&:last-of-type": {
    borderBottom: "none"
  },
  "&:hover": {
    background: "rgba(76,111,255,0.08)"
  },
  "@media (min-width: 720px)": {
    gridTemplateColumns:
      "132px minmax(160px, 1.4fr) 100px 110px 64px minmax(90px, 0.9fr)",
    alignItems: "center",
    gap: 12,
    padding: "12px 16px"
  }
}));

const fieldSelectSx = {
  minWidth: 140,
  height: 40,
  color: "#fff",
  fontSize: 13,
  fontFamily: "Poppins",
  borderRadius: "10px",
  backgroundColor: "#141A24",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#333333"
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#4C6FFF"
  },
  "& .MuiSvgIcon-root": { color: "#C2C2C2" }
};

const searchSx = {
  flex: 1,
  minWidth: 180,
  "& .MuiOutlinedInput-root": {
    height: 40,
    borderRadius: "10px",
    color: "#fff",
    fontSize: 13,
    backgroundColor: "#141A24",
    "& fieldset": { borderColor: "#333333" },
    "&:hover fieldset": { borderColor: "#4C6FFF" }
  }
};

function statusTone(status: string): { bg: string; color: string } {
  switch (status) {
    case "NORMAL_CLEARING":
      return { bg: "rgba(46, 204, 113, 0.16)", color: "#6EE7A8" };
    case "NO_ANSWER":
    case "USER_BUSY":
    case "NO_USER_RESPONSE":
      return { bg: "rgba(245, 166, 35, 0.16)", color: "#F5C16C" };
    case "CALL_REJECTED":
    case "UNALLOCATED":
    case "NO_ROUTE_DESTINATION":
    case "NOT_ACCEPTABLE_HERE":
    case "SERVICE_UNAVAILABLE":
    case "INVALID_NUMBER_FORMAT":
      return { bg: "rgba(255, 99, 99, 0.14)", color: "#FF8E8E" };
    default:
      return { bg: "rgba(141, 141, 141, 0.18)", color: "#C2C2C2" };
  }
}

function shortId(ref: string): string {
  if (!ref) return "—";
  if (ref.length <= 12) return ref;
  return `${ref.slice(0, 8)}…${ref.slice(-4)}`;
}

export default function Calls() {
  const [pageToken, setPageToken] = useState<string | undefined>(undefined);

  const { data, nextPageToken, isLoading } = useCalls({
    pageSize: CALLS_PAGE_SIZE,
    pageToken
  });

  const {
    filteredData,
    searchBy,
    setSearchBy,
    handleNextPage,
    handlePrevPage,
    handleSearch,
    prevTokens
  } = useResourceTable({
    data,
    pageSize: CALLS_PAGE_SIZE,
    pageToken,
    setPageToken,
    searchableFields: CALLS_SEARCHABLE_FIELDS,
    defaultSearchBy: "from"
  });

  const handleExportData = useCallback(() => {
    if (!data || data.length === 0) {
      toast(
        "No call logs to export yet. Make a call in this workspace to generate logs."
      );
      return;
    }

    const normalizedData = data.map((record) => ({
      ...record,
      startedAt:
        record.startedAt instanceof Date
          ? record.startedAt.toISOString()
          : record.startedAt,
      endedAt:
        record.endedAt instanceof Date
          ? record.endedAt.toISOString()
          : record.endedAt
    }));

    const csv = generateCsv(csvConfig)(normalizedData);
    download(csvConfig)(csv);
  }, [data]);

  return (
    <Page>
      <Hero>
        <Box>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "brand.main",
              mb: 1
            }}
          >
            Workspace
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: { xs: 28, md: 36 },
              fontWeight: 600,
              letterSpacing: "-0.03em",
              color: "#fff"
            }}
          >
            Monitoring
          </Typography>
          <Typography
            sx={{ mt: 1, color: "base.04", fontSize: 14, maxWidth: 560 }}
          >
            A live ledger of calls in this workspace — scan status, route, and
            duration without the old dense table.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<FileDownloadOutlinedIcon />}
          onClick={handleExportData}
          disabled={isLoading}
          sx={{
            bgcolor: "brand.main",
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            px: 2,
            "&:hover": { bgcolor: "brand.04" },
            "&.Mui-disabled": {
              bgcolor: "rgba(76,111,255,0.35)",
              color: "rgba(255,255,255,0.7)"
            }
          }}
        >
          {isLoading ? "Loading…" : "Export CSV"}
        </Button>
      </Hero>

      <Board>
        <Toolbar>
          <Select
            size="small"
            value={searchBy}
            onChange={(e) => setSearchBy(String(e.target.value))}
            sx={fieldSelectSx}
          >
            {CALLS_SEARCHABLE_FIELDS.map((field) => (
              <MenuItem key={field.value} value={field.value}>
                {field.label}
              </MenuItem>
            ))}
          </Select>
          <TextField
            size="small"
            placeholder="Search calls"
            onChange={(e) => handleSearch(e.target.value)}
            sx={searchSx}
          />
          <Box
            sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <IconButton
              size="small"
              onClick={handlePrevPage}
              disabled={!prevTokens.length}
              sx={{ color: "base.04" }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleNextPage(nextPageToken)}
              disabled={!nextPageToken}
              sx={{ color: "base.04" }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
            <Typography sx={{ fontSize: 12, color: "base.05", pr: 1 }}>
              {isLoading ? "…" : `${filteredData.length} calls`}
            </Typography>
          </Box>
        </Toolbar>

        {isLoading && <ResourceListSkeleton />}

        {!isLoading && filteredData.length === 0 && (
          <Box sx={{ px: 2, py: 6, textAlign: "center" }}>
            <CallMadeOutlinedIcon sx={{ color: "base.06", fontSize: 32, mb: 1 }} />
            <Typography sx={{ color: "base.04", fontSize: 14, fontWeight: 600 }}>
              No calls yet
            </Typography>
            <Typography sx={{ color: "base.05", fontSize: 13, mt: 0.5 }}>
              When this workspace places or receives calls, they show up here.
            </Typography>
          </Box>
        )}

        {!isLoading && filteredData.length > 0 && (
          <>
            <LedgerHeader>
              {(
                ["Status", "Route", "Direction", "Type", "Duration", "Call ID"] as const
              ).map((label) => (
                <Typography
                  key={label}
                  sx={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#8D8D8D"
                  }}
                >
                  {label}
                </Typography>
              ))}
            </LedgerHeader>

            {filteredData.map((call: CallDetailRecord) => {
              // Proto enum 0 is UNKNOWN; avoid treating numeric 0 as missing.
              const statusKey =
                call.status === undefined || call.status === null
                  ? "UNKNOWN"
                  : String(call.status);
              const statusLabel =
                STATUS_LABELS[statusKey] || statusKey || "No hangup cause";
              const tone = statusTone(statusKey);
              const direction =
                DIRECTION_LABELS[String(call.direction)] ||
                call.direction ||
                "—";
              const type =
                TYPE_LABELS[String(call.type)] || call.type || "—";
              const duration = formatCallDuration(Number(call.duration) || 0);

              return (
                <LedgerRow key={call.ref}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "fit-content",
                      px: 1.25,
                      py: 0.5,
                      borderRadius: "999px",
                      bgcolor: tone.bg,
                      color: tone.color,
                      fontSize: 12,
                      fontWeight: 600,
                      lineHeight: 1.2
                    }}
                  >
                    {statusLabel}
                  </Box>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: 14,
                        color: "#fff",
                        wordBreak: "break-all"
                      }}
                    >
                      {call.from || "—"}
                      <Box
                        component="span"
                        sx={{ color: "base.05", mx: 0.75, fontWeight: 500 }}
                      >
                        →
                      </Box>
                      {call.to || "—"}
                    </Typography>
                    <Typography
                      sx={{
                        display: { xs: "block", sm: "none" },
                        mt: 0.5,
                        fontSize: 12,
                        color: "base.05"
                      }}
                    >
                      {direction} · {type} · {duration}
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      display: { xs: "none", sm: "block" },
                      fontSize: 13,
                      color: "base.03"
                    }}
                  >
                    {direction}
                  </Typography>
                  <Typography
                    sx={{
                      display: { xs: "none", sm: "block" },
                      fontSize: 13,
                      color: "base.03"
                    }}
                  >
                    {type}
                  </Typography>
                  <Typography
                    sx={{
                      display: { xs: "none", sm: "block" },
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#fff",
                      fontVariantNumeric: "tabular-nums"
                    }}
                  >
                    {duration}
                  </Typography>
                  <Typography
                    title={call.ref}
                    sx={{
                      fontSize: 12,
                      color: "base.05",
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, monospace",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {shortId(call.ref)}
                  </Typography>
                </LedgerRow>
              );
            })}
          </>
        )}
      </Board>
    </Page>
  );
}
