/**
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
import type { Route } from "./+types/trunks.page";
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
import { TRUNKS_SEARCHABLE_FIELDS } from "./trunks.const";
import { useTrunks, useDeleteTrunk } from "../../services/trunks.service";
import { useResourceTable } from "~/core/hooks/use-resource-table";
import { useNavigate } from "react-router";
import { useWorkspaceId } from "~/workspaces/hooks/use-workspace-id";
import { PRODUCT_NAME } from "~/core/brand/product";
import type { Trunk } from "@fonoster/types";

export function meta(_: Route.MetaArgs) {
  return [
    { title: `Trunks | ${PRODUCT_NAME}` },
    {
      name: "description",
      content:
        "Connect Voice Studio to your phone company for inbound and outbound calls."
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

const TrunkRow = styled(Box)(() => ({
  display: "flex",
  alignItems: "flex-start",
  gap: 8,
  padding: "16px 8px 16px 16px",
  borderRadius: 16,
  cursor: "pointer",
  "&:hover": {
    background: "rgba(76,111,255,0.1)"
  },
  "&:hover .trunk-open-icon": {
    color: "#fff",
    backgroundColor: "rgba(76,111,255,0.16)"
  },
  "&:active .trunk-open-chevron": {
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

function outboundCount(trunk: Trunk) {
  const uris = trunk.uris;
  return Array.isArray(uris) ? uris.length : 0;
}

export default function TrunksList() {
  const navigate = useNavigate();
  const workspaceId = useWorkspaceId();
  const [pageToken, setPageToken] = useState<string | undefined>(undefined);

  const { data, nextPageToken, isLoading } = useTrunks({
    pageSize: PAGE_SIZE,
    pageToken
  });

  const { mutateAsync: deleteTrunk } = useDeleteTrunk();

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
    deleteResource: deleteTrunk,
    searchableFields: TRUNKS_SEARCHABLE_FIELDS,
    defaultSearchBy: "name"
  });

  const onOpen = useCallback(
    (ref: string) => {
      navigate(`/workspaces/${workspaceId}/sip-network/trunks/${ref}/edit`, {
        viewTransition: true
      });
    },
    [navigate, workspaceId]
  );

  const onCreate = useCallback(() => {
    navigate(`/workspaces/${workspaceId}/sip-network/trunks/create`, {
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
            Trunks
          </Typography>
          <Typography sx={{ mt: 1, color: "base.04", fontSize: 14, maxWidth: 560 }}>
            A trunk is the pipe to your phone company (Telnyx, Twilio, and so
            on). Inbound is calls coming in. Outbound is calls going out.
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
          Create trunk
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
            {TRUNKS_SEARCHABLE_FIELDS.map((field) => (
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

        {isLoading && (
          <Typography sx={{ px: 2, py: 4, color: "base.05", fontSize: 13 }}>
            Loading…
          </Typography>
        )}

        {!isLoading && filteredData.length === 0 && (
          <Typography sx={{ px: 2, py: 4, color: "base.05", fontSize: 13 }}>
            No trunks yet. Create one to connect a phone company.
          </Typography>
        )}

        {filteredData.map((trunk) => {
          const outbound = outboundCount(trunk);
          return (
            <TrunkRow
              key={trunk.ref}
              role="link"
              tabIndex={0}
              onClick={() => onOpen(trunk.ref)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onOpen(trunk.ref);
                }
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ mb: 1.5 }}>
                  <FieldLabel>Trunk name</FieldLabel>
                  <Typography sx={{ fontWeight: 600, fontSize: 16, color: "#fff" }}>
                    {trunk.name}
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
                    <FieldLabel>Inbound SIP URI</FieldLabel>
                    <Typography
                      sx={{
                        fontSize: 13,
                        color: "#fff",
                        wordBreak: "break-all"
                      }}
                    >
                      {trunk.inboundUri || "Not set"}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "base.05" }}>
                      Address for calls coming in
                    </Typography>
                  </Box>
                  <Box>
                    <FieldLabel>Outbound SIP URIs</FieldLabel>
                    <Typography sx={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>
                      {outbound === 0
                        ? "None"
                        : `${outbound} ${outbound === 1 ? "route" : "routes"}`}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "base.05" }}>
                      Where outbound calls are sent
                    </Typography>
                  </Box>
                  <Box>
                    <FieldLabel>Send register</FieldLabel>
                    <Typography sx={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>
                      {trunk.sendRegister ? "On" : "Off"}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "base.05" }}>
                      {trunk.sendRegister
                        ? "Trunk signs in with the provider"
                        : "No SIP REGISTER (coming soon if you need it)"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <IconButton
                size="small"
                aria-label="Delete trunk"
                onClick={(e) => {
                  e.stopPropagation();
                  void handleDelete([trunk]);
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
                className="trunk-open-icon"
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
                  className="trunk-open-chevron"
                  sx={{
                    fontSize: 20,
                    transition: "transform 160ms ease"
                  }}
                />
              </Box>
            </TrunkRow>
          );
        })}
      </Board>
    </Page>
  );
}
