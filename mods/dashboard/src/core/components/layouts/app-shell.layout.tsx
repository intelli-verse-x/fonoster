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
import { Outlet, useLocation, useNavigate } from "react-router";
import { styled } from "@mui/material";
import { useEffect } from "react";
import { AppShellSidebar } from "./app-shell.sidebar";
import { useAuth } from "~/auth/hooks/use-auth";
import { isBrandHiddenPath } from "~/core/brand/hidden-voice-studio-nav";
import { useWorkspaceId } from "~/workspaces/hooks/use-workspace-id";

export default function AppShellLayout() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const workspaceId = useWorkspaceId();

  useEffect(() => {
    if (!workspaceId || !isBrandHiddenPath(pathname, user?.email)) return;
    navigate(`/workspaces/${workspaceId}/monitoring`, { replace: true });
  }, [pathname, workspaceId, user?.email, navigate]);

  return (
    <AppShellContainer>
      <AppShellSidebar />
      <AppShellMain>
        <AppShellMainContent>
          <Outlet />
        </AppShellMainContent>
      </AppShellMain>
    </AppShellContainer>
  );
}

export const AppShellContainer = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "264px 1fr",
  gridTemplateRows: "1fr",
  width: "100%",
  height: "100%",
  flexGrow: 1,
  overflow: "hidden",
  backgroundColor: theme.palette.bg.surface
}));

export const AppShellMain = styled("main")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  overflow: "auto",
  backgroundColor: theme.palette.bg.surface
}));

export const AppShellMainContent = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  backgroundColor: theme.palette.bg.surface,
  height: "100%",
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.bg.surface
  })
}));
