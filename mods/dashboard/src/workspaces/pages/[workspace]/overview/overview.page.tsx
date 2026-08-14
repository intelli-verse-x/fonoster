import { Box, Button, Typography, styled } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { Route } from "./+types/overview.page";
import { Page } from "~/core/components/general/page/page";
import { useNavigate } from "react-router";
import { useWorkspaceId } from "~/workspaces/hooks/use-workspace-id";
import { useCallback, useMemo } from "react";
import { useAuth } from "~/auth/hooks/use-auth";
import { useApiKeys } from "~/api-keys/services/api-keys.service";
import { PRODUCT_NAME } from "~/core/brand/product";
import { workspaceCreatorName } from "~/workspaces/helpers/workspace-creator";

export function meta(_: Route.MetaArgs) {
  return [{ title: `Workspace | ${PRODUCT_NAME}` }];
}

const Shell = styled(Box)(() => ({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.2fr) minmax(260px, 0.8fr)",
  gap: "24px",
  alignItems: "stretch",
  minHeight: 420,
  "@media (max-width: 899px)": {
    gridTemplateColumns: "1fr"
  }
}));

const Hero = styled(Box)(({ theme }) => ({
  borderRadius: 24,
  padding: "36px 32px",
  minHeight: 420,
  display: "flex",
  flexDirection: "column",
  background:
    "linear-gradient(160deg, rgba(76,111,255,0.28) 0%, #141A24 45%, #0C1018 100%)",
  border: `1px solid ${theme.palette.base["07"]}`
}));

const Board = styled(Box)(({ theme }) => ({
  borderRadius: 24,
  padding: "8px",
  background: theme.palette.bg.muted,
  border: `1px solid ${theme.palette.base["07"]}`,
  display: "flex",
  flexDirection: "column"
}));

const BoardRow = styled("button")(({ theme }) => ({
  appearance: "none",
  border: "none",
  background: "transparent",
  color: "inherit",
  textAlign: "left",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "18px 16px",
  borderRadius: 16,
  fontFamily: "inherit",
  "&:hover": {
    background: "rgba(76,111,255,0.1)"
  }
}));

export default function Overview() {
  const workspaceId = useWorkspaceId();
  const { currentWorkspace, user } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading } = useApiKeys();

  const go = useCallback(
    (path: string) =>
      navigate(`/workspaces/${workspaceId}/${path}`, { viewTransition: true }),
    [navigate, workspaceId]
  );

  const title = currentWorkspace?.name ?? "Workspace";
  const creator = currentWorkspace
    ? workspaceCreatorName(currentWorkspace, user)
    : null;
  const created = currentWorkspace?.createdAt
    ? new Date(currentWorkspace.createdAt).toLocaleDateString()
    : null;

  const keyCount = data.length;
  const expiringCount = useMemo(
    () =>
      data.filter(
        (key) =>
          key.expiresAt &&
          new Date(key.expiresAt).getTime() > 0 &&
          new Date(key.expiresAt).getTime() - Date.now() <
            7 * 24 * 60 * 60 * 1000
      ).length,
    [data]
  );

  return (
    <Page>
      <Shell>
        <Hero>
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
            {PRODUCT_NAME}
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: { xs: 32, md: 42 },
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "base.01"
            }}
          >
            {title}
          </Typography>
          <Typography sx={{ mt: 1.5, color: "base.05", fontSize: 14 }}>
            {[creator && `Created by ${creator}`, created]
              .filter(Boolean)
              .join(" · ")}
          </Typography>
          <Box sx={{ display: "flex", gap: 3, mt: 4 }}>
            <Box>
              <Typography sx={{ fontSize: 28, fontWeight: 600, color: "base.01" }}>
                {isLoading ? "—" : keyCount}
              </Typography>
              <Typography sx={{ fontSize: 12, color: "base.05" }}>
                API keys
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: 28, fontWeight: 600, color: "base.01" }}>
                {isLoading ? "—" : expiringCount}
              </Typography>
              <Typography sx={{ fontSize: 12, color: "base.05" }}>
                Expiring soon
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mt: "auto", pt: 4, display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={() => go("applications")}
              sx={{
                bgcolor: "brand.main",
                color: "#fff",
                textTransform: "none",
                fontWeight: 600,
                px: 2.5,
                borderRadius: 2,
                "&:hover": { bgcolor: "brand.04" }
              }}
            >
              Open applications
            </Button>
            <Button
              variant="outlined"
              onClick={() => go("settings")}
              sx={{
                borderColor: "base.07",
                color: "base.03",
                textTransform: "none",
                borderRadius: 2
              }}
            >
              Settings
            </Button>
          </Box>
        </Hero>

        <Board>
          <Typography
            sx={{
              px: 2,
              pt: 1.5,
              pb: 0.5,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "base.05"
            }}
          >
            Workspace board
          </Typography>
          <BoardRow type="button" onClick={() => go("members")}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 15, color: "#fff" }}>
                Members
              </Typography>
              <Typography sx={{ fontSize: 12, color: "base.05" }}>
                Invite teammates and roles
              </Typography>
            </Box>
            <ChevronRightIcon sx={{ color: "base.05", fontSize: 20 }} />
          </BoardRow>
          <BoardRow type="button" onClick={() => go("api-keys")}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 15, color: "#fff" }}>
                API keys
              </Typography>
              <Typography sx={{ fontSize: 12, color: "base.05" }}>
                {isLoading ? "Loading…" : `${keyCount} active`}
              </Typography>
            </Box>
            <ChevronRightIcon sx={{ color: "base.05", fontSize: 20 }} />
          </BoardRow>
          <BoardRow type="button" onClick={() => go("api-keys")}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 15, color: "#fff" }}>
                Key alerts
              </Typography>
              <Typography sx={{ fontSize: 12, color: "base.05" }}>
                {isLoading
                  ? "Loading…"
                  : expiringCount === 0
                    ? "Nothing expiring in 7 days"
                    : `${expiringCount} expiring in 7 days`}
              </Typography>
            </Box>
            <ChevronRightIcon sx={{ color: "base.05", fontSize: 20 }} />
          </BoardRow>
          <BoardRow type="button" onClick={() => go("sip-network/numbers")}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 15, color: "#fff" }}>
                SIP network
              </Typography>
              <Typography sx={{ fontSize: 12, color: "base.05" }}>
                Numbers, trunks, and agents
              </Typography>
            </Box>
            <ChevronRightIcon sx={{ color: "base.05", fontSize: 20 }} />
          </BoardRow>
        </Board>
      </Shell>
    </Page>
  );
}
