/**
 * Copyright (C) 2025 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * Licensed under the MIT License.
 */
import type { Route } from "./+types/agents.page";
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
import AddIcon from "@mui/icons-material/Add";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { Page } from "~/core/components/general/page/page";
import { PAGE_SIZE } from "~/core/shared/page-sizes.const";
import { AGENTS_SEARCHABLE_FIELDS } from "./agents.const";
import { useResourceTable } from "~/core/hooks/use-resource-table";
import { useAgents, useDeleteAgent } from "../../services/agents.service";
import { useNavigate } from "react-router";
import { useWorkspaceId } from "~/workspaces/hooks/use-workspace-id";
import { PRODUCT_NAME } from "~/core/brand/product";
import { ResourceListSkeleton } from "~/core/brand/studio-skeletons";
import type { Agent } from "@fonoster/types";

export function meta(_: Route.MetaArgs) {
  return [
    { title: `Agents | ${PRODUCT_NAME}` },
    {
      name: "description",
      content:
        "An agent is a SIP phone or app that registers to a domain so it can place and receive calls."
    }
  ];
}

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
  border: `1px solid ${theme.palette.base["07"]}`
}));

const Toolbar = styled(Box)(() => ({
  display: "flex",
  gap: 12,
  alignItems: "center",
  flexWrap: "wrap",
  padding: "8px 8px 12px"
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

const AgentRow = styled(Box)(() => ({
  display: "flex",
  alignItems: "flex-start",
  gap: 8,
  padding: "16px 8px 16px 16px",
  borderRadius: 16,
  cursor: "pointer",
  "&:hover": {
    background: "rgba(76,111,255,0.1)"
  },
  "&:hover .agent-open-icon": {
    color: "#fff",
    backgroundColor: "rgba(76,111,255,0.16)"
  },
  "&:active .agent-open-chevron": {
    transform: "translateX(6px)"
  }
}));

const FieldLabel = styled(Typography)(() => ({
  fontSize: "10px !important",
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#8D8D8D"
}));

export default function AgentsList() {
  const navigate = useNavigate();
  const workspaceId = useWorkspaceId();
  const [pageToken, setPageToken] = useState<string | undefined>(undefined);

  const { data, nextPageToken, isLoading } = useAgents({
    pageSize: PAGE_SIZE,
    pageToken
  });

  const { mutateAsync: deleteAgent } = useDeleteAgent();

  const {
    filteredData,
    searchBy,
    setSearchBy,
    handleNextPage,
    handlePrevPage,
    handleSearch,
    handleDelete,
    prevTokens
  } = useResourceTable({
    data,
    pageSize: PAGE_SIZE,
    pageToken,
    setPageToken,
    deleteResource: deleteAgent,
    searchableFields: AGENTS_SEARCHABLE_FIELDS,
    defaultSearchBy: "name"
  });

  const onOpen = useCallback(
    (ref: string) => {
      navigate(`/workspaces/${workspaceId}/sip-network/agents/${ref}/edit`, {
        viewTransition: true
      });
    },
    [navigate, workspaceId]
  );

  const onCreate = useCallback(() => {
    navigate(`/workspaces/${workspaceId}/sip-network/agents/create`, {
      viewTransition: true
    });
  }, [navigate, workspaceId]);

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
            SIP Network
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
            Agents
          </Typography>
          <Typography sx={{ mt: 1, color: "base.04", fontSize: 14, maxWidth: 560 }}>
            An agent is a SIP phone or app. Agents in the same domain can call
            each other. Username is what the phone uses to sign in.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreate}
          sx={{
            bgcolor: "brand.main",
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            px: 2,
            "&:hover": { bgcolor: "brand.04" }
          }}
        >
          Create agent
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
            {AGENTS_SEARCHABLE_FIELDS.map((field) => (
              <MenuItem key={field.value} value={field.value}>
                {field.label}
              </MenuItem>
            ))}
          </Select>
          <TextField
            size="small"
            placeholder="Search"
            onChange={(e) => handleSearch(e.target.value)}
            sx={searchSx}
          />
          <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 0.5 }}>
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
              {isLoading ? "…" : `${filteredData.length} in this view`}
            </Typography>
          </Box>
        </Toolbar>

        {isLoading && <ResourceListSkeleton />}

        {!isLoading && filteredData.length === 0 && (
          <Typography sx={{ px: 2, py: 4, color: "base.05", fontSize: 13 }}>
            No agents yet. Create one so a phone can register to a domain.
          </Typography>
        )}

        {!isLoading &&
          filteredData.map((agent: Agent) => (
            <AgentRow
              key={agent.ref}
              role="link"
              tabIndex={0}
              onClick={() => onOpen(agent.ref)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onOpen(agent.ref);
                }
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ mb: 1.5 }}>
                  <FieldLabel>Agent name</FieldLabel>
                  <Typography sx={{ fontWeight: 600, fontSize: 16, color: "#fff" }}>
                    {agent.name}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: 12
                  }}
                >
                  <Box>
                    <FieldLabel>Username</FieldLabel>
                    <Typography sx={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>
                      {agent.username || "Not set"}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "base.05" }}>
                      What the phone uses to sign in
                    </Typography>
                  </Box>
                  <Box>
                    <FieldLabel>Domain</FieldLabel>
                    <Typography
                      sx={{
                        fontSize: 13,
                        color: "#fff",
                        wordBreak: "break-all"
                      }}
                    >
                      {agent.domain?.name || agent.domain?.domainUri || "Not set"}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "base.05" }}>
                      {agent.domain?.domainUri || "Where this agent registers"}
                    </Typography>
                  </Box>
                  <Box>
                    <FieldLabel>Status</FieldLabel>
                    <Typography sx={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>
                      {agent.enabled ? "On" : "Off"}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "base.05" }}>
                      {agent.enabled
                        ? "Can register and take calls"
                        : "Cannot register right now"}
                    </Typography>
                  </Box>
                  <Box>
                    <FieldLabel>Privacy</FieldLabel>
                    <Typography sx={{ fontSize: 13, color: "#fff" }}>
                      {agent.privacy || "Not set"}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "base.05" }}>
                      Caller ID hiding on outbound calls
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <IconButton
                size="small"
                aria-label="Delete agent"
                onClick={(e) => {
                  e.stopPropagation();
                  void handleDelete([agent]);
                }}
                sx={{
                  color: "base.05",
                  mt: 0.5,
                  borderRadius: "8px",
                  "&:hover": {
                    color: "#fff",
                    bgcolor: "rgba(76,111,255,0.16)"
                  }
                }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
              <Box
                className="agent-open-icon"
                sx={{
                  mt: 0.5,
                  mr: 1,
                  width: 34,
                  height: 34,
                  flexShrink: 0,
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "base.05"
                }}
              >
                <ChevronRightIcon
                  className="agent-open-chevron"
                  sx={{
                    fontSize: 20,
                    transition: "transform 160ms ease"
                  }}
                />
              </Box>
            </AgentRow>
          ))}
      </Board>
    </Page>
  );
}
