/**
 * Copyright (C) 2025 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * Licensed under the MIT License.
 */
import type { Route } from "./+types/api-keys.page";
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
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { Page } from "~/core/components/general/page/page";
import { PAGE_SIZE } from "~/core/shared/page-sizes.const";
import { API_KEYS_SEARCHABLE_FIELDS } from "./api-keys.const";
import { useResourceTable } from "~/core/hooks/use-resource-table";
import { useApiKeys, useDeleteApiKey } from "../../services/api-keys.service";
import { useNavigate } from "react-router";
import { useWorkspaceId } from "~/workspaces/hooks/use-workspace-id";
import { PRODUCT_NAME } from "~/core/brand/product";
import { ResourceListSkeleton } from "~/core/brand/studio-skeletons";
import type { ApiKey } from "~/api-keys/services/api-keys.interfaces";
import { ROLE_LABELS } from "~/workspaces/pages/[workspace]/members/members.constants";

export function meta(_: Route.MetaArgs) {
  return [
    { title: `API Keys | ${PRODUCT_NAME}` },
    {
      name: "description",
      content:
        "API keys let apps call Voice Studio APIs for this workspace. Secrets are shown only once when you create a key."
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

const ApiKeyRow = styled(Box)(() => ({
  display: "flex",
  alignItems: "flex-start",
  gap: 8,
  padding: "16px 8px 16px 16px",
  borderRadius: 16,
  "&:hover": {
    background: "rgba(76,111,255,0.1)"
  }
}));

const FieldLabel = styled(Typography)(() => ({
  fontSize: "10px !important",
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#8D8D8D"
}));

export default function ApiKeysList() {
  const navigate = useNavigate();
  const workspaceId = useWorkspaceId();
  const [pageToken, setPageToken] = useState<string | undefined>(undefined);

  const { data, nextPageToken, isLoading } = useApiKeys({
    pageSize: PAGE_SIZE,
    pageToken
  });

  const { mutateAsync: deleteApiKey } = useDeleteApiKey();

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
    deleteResource: deleteApiKey,
    searchableFields: API_KEYS_SEARCHABLE_FIELDS,
    defaultSearchBy: "ref"
  });

  const onCreate = useCallback(() => {
    navigate(`/workspaces/${workspaceId}/api-keys/create`);
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
            Workspace
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
            API Keys
          </Typography>
          <Typography sx={{ mt: 1, color: "base.04", fontSize: 14, maxWidth: 560 }}>
            Keys that let apps call Voice Studio APIs for this workspace. The
            secret is shown only once when you create a key.
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
          Create API key
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
            {API_KEYS_SEARCHABLE_FIELDS.map((field) => (
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
            No API keys yet. Create one so an app can call APIs in this workspace.
          </Typography>
        )}

        {!isLoading &&
          filteredData.map((apiKey: ApiKey) => (
            <ApiKeyRow key={apiKey.ref}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ mb: 1.5 }}>
                  <FieldLabel>Access key ID</FieldLabel>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: 16,
                      color: "#fff",
                      wordBreak: "break-all"
                    }}
                  >
                    {apiKey.accessKeyId}
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
                    <FieldLabel>Role</FieldLabel>
                    <Typography sx={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>
                      {ROLE_LABELS[apiKey.role] || apiKey.role || "Not set"}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "base.05" }}>
                      What this key is allowed to do
                    </Typography>
                  </Box>
                  <Box>
                    <FieldLabel>Secret</FieldLabel>
                    <Typography sx={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>
                      Hidden
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "base.05" }}>
                      Shown only once at create time
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <IconButton
                size="small"
                aria-label="Delete API key"
                onClick={() => {
                  void handleDelete([apiKey]);
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
            </ApiKeyRow>
          ))}
      </Board>
    </Page>
  );
}
