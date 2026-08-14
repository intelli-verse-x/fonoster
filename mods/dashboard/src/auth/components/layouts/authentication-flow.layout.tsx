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
import { Outlet } from "react-router";
import { AuthenticationFlowHeader as LayoutHeader } from "./authentication-flow.header";
import type { Route } from "./+types/authentication-flow.layout";
import { getUnauthenticatedSession } from "~/auth/services/sessions/session.server";
import { Typography } from "~/core/components/design-system/ui/typography/typography";
import { PRODUCT_NAME, PRODUCT_PARENT, PRODUCT_TAGLINE } from "~/core/brand/product";

export const shouldRevalidate = () => true;

export async function loader({ request }: Route.LoaderArgs) {
  return await getUnauthenticatedSession(request.headers.get("Cookie"));
}

export default function AuthenticationFlowLayout() {
  return (
    <LayoutRoot>
      <BrandPanel>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "brand.main",
            mb: 2
          }}
        >
          {PRODUCT_PARENT}
        </Typography>
        <Typography
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontSize: { xs: 32, md: 44 },
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: "#F4F7FF"
          }}
        >
          {PRODUCT_NAME}
        </Typography>
        <Typography sx={{ mt: 2, color: "base.04", fontSize: 16, maxWidth: 420 }}>
          {PRODUCT_TAGLINE}
        </Typography>
        <Box sx={{ mt: 5, display: "flex", flexDirection: "column", gap: 1.5 }}>
          {["Voice applications", "Numbers and SIP", "API keys in one workspace"].map(
            (item) => (
              <Typography key={item} sx={{ color: "base.03", fontSize: 14 }}>
                {item}
              </Typography>
            )
          )}
        </Box>
      </BrandPanel>
      <FormPanel>
        <LayoutHeader />
        <LayoutContent>
          <FormCard>
            <Outlet />
          </FormCard>
        </LayoutContent>
      </FormPanel>
    </LayoutRoot>
  );
}

export const LayoutRoot = styled(Box)(() => ({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 0.95fr)",
  height: "100%",
  overflow: "hidden",
  backgroundColor: "#0C1018",
  "@media (max-width: 899px)": {
    gridTemplateColumns: "1fr"
  }
}));

const BrandPanel = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: "48px 56px",
  background:
    "linear-gradient(160deg, rgba(76,111,255,0.28) 0%, #141A24 45%, #0C1018 100%)",
  borderRight: `1px solid ${theme.palette.base["07"]}`,
  "@media (max-width: 899px)": {
    display: "none"
  }
}));

const FormPanel = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  overflow: "auto",
  backgroundColor: "#0C1018"
}));

export const LayoutContent = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "32px 24px 48px",
  flexGrow: 1
}));

const FormCard = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: 440,
  padding: "32px 28px",
  borderRadius: 24,
  border: `1px solid ${theme.palette.base["07"]}`,
  backgroundColor: theme.palette.bg.muted
}));
