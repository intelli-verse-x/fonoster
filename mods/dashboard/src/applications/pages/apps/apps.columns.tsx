/*
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
import type { ColumnDef } from "@tanstack/react-table";
import type { Application } from "@fonoster/types";
import { toTitleCase } from "../../../core/helpers/to-title-case";
import { formatEngineName } from "../../../core/helpers/format-engine-name";

/**
 * Column definitions for rendering a table of Fonoster Applications using TanStack Table.
 *
 * Each column maps a property of the `Application` object to a table header and cell.
 * This configuration enables sorting, filtering, and custom rendering in table UIs.
 */
export const columns: ColumnDef<Application>[] = [
  {
    id: "name",
    header: "Name",
    accessorKey: "name"
  },
  {
    id: "appType",
    header: "Type",
    accessorKey: "type",
    cell: ({ row }) => toTitleCase(row.getValue("appType"))
  },
  {
    id: "textToSpeech",
    header: "Text to Speech",
    accessorKey: "textToSpeech.productRef",
    cell: ({ row }) =>
      formatEngineName(row.original.textToSpeech?.productRef, "tts.")
  },
  {
    id: "speechToText",
    header: "Speech to Text",
    accessorKey: "speechToText.productRef",
    cell: ({ row }) =>
      formatEngineName(row.original.speechToText?.productRef, "stt.")
  },
  {
    id: "intelligence",
    header: "Intelligence",
    accessorKey: "intelligence.productRef",
    cell: ({ row }) =>
      formatEngineName(row.original.intelligence?.productRef, "llm.")
  },
  {
    id: "ref",
    header: "Ref",
    accessorKey: "ref"
  }
];
