/**
 * Copyright (C) 2025 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * Licensed under the MIT License.
 */
import type { ReactNode } from "react";
import { Box, Button, Typography, styled } from "@mui/material";
import { Page } from "~/core/components/general/page/page";
import { GoBackButton } from "~/core/components/design-system/ui/go-back/go-back";
import { PRODUCT_NAME } from "~/core/brand/product";

const Hero = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 24,
  marginTop: 16,
  marginBottom: 24,
  flexWrap: "wrap"
}));

const Shell = styled(Box)(() => ({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(240px, 300px)",
  gap: 24,
  alignItems: "start",
  "@media (max-width: 719px)": {
    gridTemplateColumns: "1fr"
  }
}));

const FormBoard = styled(Box)(({ theme }) => ({
  borderRadius: 20,
  padding: 24,
  background: theme.palette.bg.muted,
  border: `1px solid ${theme.palette.base["07"]}`
}));

const SideBoard = styled(Box)(({ theme }) => ({
  borderRadius: 20,
  padding: 20,
  background: theme.palette.bg.muted,
  border: `1px solid ${theme.palette.base["07"]}`,
  position: "sticky",
  top: 16,
  display: "flex",
  flexDirection: "column",
  gap: 12,
  "@media (max-width: 719px)": {
    display: "none"
  }
}));

export function ApplicationStudioLayout({
  title,
  description,
  onBack,
  backLabel = "Back to applications",
  actions,
  sideHint = "Autopilot: AI talks on the live call. External: your server handles the call. Save before a test call on a new app.",
  children
}: {
  title: string;
  description: string;
  onBack: () => void;
  backLabel?: string;
  actions: ReactNode;
  sideHint?: string;
  children: ReactNode;
}) {
  return (
    <Page>
      <GoBackButton label={backLabel} onClick={onBack} />
      <Hero>
        <Box sx={{ minWidth: 0, maxWidth: 640 }}>
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
            {PRODUCT_NAME}
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
            {title}
          </Typography>
          <Typography sx={{ mt: 1, color: "base.04", fontSize: 14 }}>
            {description}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "none",
            "@media (max-width: 719px)": {
              display: "flex",
              flexDirection: "column",
              gap: 1
            }
          }}
        >
          {actions}
        </Box>
      </Hero>
      <Shell>
        <FormBoard>{children}</FormBoard>
        <SideBoard>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "base.05"
            }}
          >
            Actions
          </Typography>
          {actions}
          <Typography sx={{ fontSize: 12, color: "base.05", mt: 1 }}>
            {sideHint}
          </Typography>
        </SideBoard>
      </Shell>
    </Page>
  );
}

export const studioActionButtonSx = {
  textTransform: "none" as const,
  fontWeight: 600,
  borderRadius: 2,
  width: "100%"
};

export const StudioPrimaryButton = styled(Button)(() => ({
  ...studioActionButtonSx,
  backgroundColor: "#4C6FFF",
  color: "#fff",
  "&:hover": { backgroundColor: "#6EA8FF" },
  "&.Mui-disabled": {
    backgroundColor: "rgba(76,111,255,0.35)",
    color: "rgba(255,255,255,0.7)"
  }
}));
