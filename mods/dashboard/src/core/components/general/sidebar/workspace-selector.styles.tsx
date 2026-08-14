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
import { Box, Paper, styled } from "@mui/material";

export const WorkspaceTrigger = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 12px",
  cursor: "pointer",
  width: "100%",
  borderRadius: "14px",
  border: `1px solid ${theme.palette.base["07"]}`,
  backgroundColor: theme.palette.bg.muted,
  fontSize: "10px",
  fontFamily: "Poppins",
  fontWeight: 500,
  color: theme.palette.base["02"],
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  "&:hover": {
    borderColor: theme.palette.brand.main
  }
}));

export const WorkspaceOption = styled(Box)(({ theme }) => ({
  padding: "10px 12px",
  color: theme.palette.base["03"],
  fontSize: "13px",
  fontWeight: 500,
  cursor: "pointer",
  borderRadius: "10px",
  margin: "2px 6px",
  transition: "background-color 0.2s ease-in-out",
  position: "relative",

  "&:last-child": {
    borderBottom: "none"
  },

  "&:hover": {
    backgroundColor: "rgba(76,111,255,0.1)"
  },

  "&[data-selected='true']": {
    backgroundColor: "rgba(76,111,255,0.16)",
    color: theme.palette.base["01"]
  },

  "&[data-selected='true']:before": {
    content: "none"
  }
}));

export const WorkspaceUnifiedDropdown = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "0",
  left: "0",
  right: "0",
  zIndex: 1300,
  borderRadius: "14px",
  border: `1px solid ${theme.palette.base["07"]}`,
  boxShadow: "0px 12px 32px rgba(0, 0, 0, 0.28)",
  backgroundColor: theme.palette.bg.muted,
  overflow: "hidden",
  width: "100%",
  paddingBottom: "8px",
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.bg.muted
  })
}));
