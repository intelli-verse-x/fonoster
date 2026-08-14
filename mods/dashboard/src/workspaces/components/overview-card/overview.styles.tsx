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
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

export const OverviewCardRoot = styled(Box)(({ theme }) => ({
  display: "flex",
  width: "100%",
  minHeight: "108px",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "20px 18px",
  borderRadius: "16px",
  border: `1px solid ${theme.palette.base["07"]}`,
  gap: "14px",
  cursor: "pointer",
  backgroundColor: theme.palette.bg.muted,
  transition: "border-color 0.2s ease, transform 0.2s ease",

  "&:hover": {
    borderColor: theme.palette.brand.main,
    transform: "translateY(-1px)"
  }
}));

export const OverviewCardRootIcon = styled(Box)(({ theme }) => ({
  display: "flex",
  backgroundColor: "rgba(76, 111, 255, 0.18)",
  padding: "10px",
  borderRadius: "10px",
  color: theme.palette.brand.main,
  flexShrink: 0
}));

export const OverviewCardRootLabel = styled(Box)(() => ({
  flexGrow: 1,
  padding: "0px"
}));
