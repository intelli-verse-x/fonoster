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
import { Box, styled } from "@mui/material";
import { Typography } from "../../design-system/ui/typography/typography";

export const SidebarContainer = styled(Box)(({ theme }) => ({
  height: "100%",

  "& .MuiDrawer-paper": {
    backgroundColor: theme.palette.bg.app,
    color: theme.palette.base["03"],
    borderRight: `solid 1px ${theme.palette.base["07"]}`,
    width: "264px",
    height: "100%",
    boxSizing: "border-box",
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.bg.app,
      borderRight: `solid 1px ${theme.palette.base["07"]}`
    })
  }
}));

export const SidebarWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
  backgroundColor: theme.palette.bg.app,
  gap: "12px",
  flexGrow: 1,
  padding: "12px 10px 16px",
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.bg.app
  })
}));

export const SidebarContent = styled("nav")(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "12px"
}));

export const SidebarNavigation = styled("ul")(() => ({
  display: "flex",
  flexDirection: "column",
  listStyle: "none",
  padding: 0,
  margin: 0,
  gap: "2px"
}));

export const SidebarFooter = styled(Box)(({ theme }) => ({
  marginTop: "auto",
  padding: "8px 12px",
  fontSize: "0.7rem",
  color: theme.palette.base["05"]
}));

export const SidebarNavItemRoot = styled("li")(() => ({
  display: "flex",
  flexDirection: "column",
  listStyle: "none",
  cursor: "pointer",
  margin: 0,
  padding: 0
}));

export const SidebarNavItemContent = styled(Box)(({ theme }) => ({
  color: theme.palette.base["04"],
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  position: "relative",
  padding: "9px 12px",
  borderRadius: "10px",
  transition: "background-color 0.15s ease, color 0.15s ease",

  "&:hover": {
    backgroundColor: "rgba(76,111,255,0.08)",
    color: theme.palette.base["02"]
  },

  "&[data-selected='true']": {
    color: theme.palette.base["01"],
    backgroundColor: "rgba(76,111,255,0.16)"
  }
}));

export const SidebarNavItemText = styled(Typography)(() => ({
  position: "relative",
  fontWeight: 500,
  fontSize: "13px !important",

  "&[data-selected='true']:before": {
    content: "none"
  }
}));

export const SidebarNavItemSubMenu = styled("ul")(() => ({
  display: "flex",
  flexDirection: "column",
  listStyle: "none",
  padding: 0,
  margin: 0
}));
