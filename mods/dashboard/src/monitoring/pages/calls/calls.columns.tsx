/*
 * Copyright (C) 2025 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * Licensed under the MIT License.
 */
import type { ColumnDef } from "@tanstack/react-table";
import type { CallDetailRecord } from "@fonoster/types";
import {
  STATUS_LABELS,
  DIRECTION_LABELS,
  TYPE_LABELS,
  formatCallDuration
} from "./calls.const";

/** Kept for any table-based consumers; Monitoring list uses the studio card layout. */
export const columns: ColumnDef<CallDetailRecord>[] = [
  {
    id: "ref",
    header: "Call ID",
    accessorKey: "ref"
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => STATUS_LABELS[getValue() as string] || getValue()
  },
  {
    id: "direction",
    header: "Direction",
    accessorKey: "direction",
    cell: ({ getValue }) =>
      DIRECTION_LABELS[getValue() as string] || getValue()
  },
  {
    id: "from",
    header: "From",
    accessorKey: "from"
  },
  {
    id: "to",
    header: "To",
    accessorKey: "to"
  },
  {
    id: "type",
    header: "Call Type",
    accessorKey: "type",
    cell: ({ getValue }) => TYPE_LABELS[getValue() as string] || getValue()
  },
  {
    id: "duration",
    header: "Duration",
    accessorKey: "duration",
    cell: ({ getValue }) => formatCallDuration(Number(getValue()))
  }
];
