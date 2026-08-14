/**
 * Copyright (C) 2025 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * Licensed under the MIT License.
 */
import type { Route } from "./+types/secrets.page";
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
import { SECRETS_SEARCHABLE_FIELDS } from "./secrets.const";
import { useResourceTable } from "~/core/hooks/use-resource-table";
import { useSecrets, useDeleteSecret } from "../../services/secrets.service";
import { useNavigate } from "react-router";
import { useWorkspaceId } from "~/workspaces/hooks/use-workspace-id";
import { PRODUCT_NAME } from "~/core/brand/product";
import { ResourceListSkeleton } from "~/core/brand/studio-skeletons";
import type { Secret } from "@fonoster/types";

export function meta(_: Route.MetaArgs) {
  return [
    { title: `Secrets | ${PRODUCT_NAME}` },
    {
      name: "description",
      content:
        "Encrypted values your apps and APIs can use in this workspace. The value is never shown in the list."
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

const SecretRow = styled(Box)(() => ({
  display: "flex",
  alignItems: "flex-start",
  gap: 8,
  padding: "16px 8px 16px 16px",
  borderRadius: 16,
  cursor: "pointer",
  "&:hover": {
    background: "rgba(76,111,255,0.1)"
  },
  "&:hover .secret-open-icon": {
    color: "#fff",
    backgroundColor: "rgba(76,111,255,0.16)"
  },
  "&:active .secret-open-chevron": {
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

export default function SecretsList() {
  const navigate = useNavigate();
  const workspaceId = useWorkspaceId();
  const [pageToken, setPageToken] = useState<string | undefined>(undefined);

  const { data, nextPageToken, isLoading } = useSecrets({
    pageSize: PAGE_SIZE,
    pageToken
  });

  const { mutateAsync: deleteSecret } = useDeleteSecret();

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
    deleteResource: deleteSecret,
    searchableFields: SECRETS_SEARCHABLE_FIELDS,
    defaultSearchBy: "name"
  });

  const onOpen = useCallback(
    (ref: string) => {
      navigate(`/workspaces/${workspaceId}/secrets/${ref}/edit`);
    },
    [navigate, workspaceId]
  );

  const onCreate = useCallback(() => {
    navigate(`/workspaces/${workspaceId}/secrets/create`);
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
            Secrets
          </Typography>
          <Typography sx={{ mt: 1, color: "base.04", fontSize: 14, maxWidth: 560 }}>
            Encrypted values your apps and APIs can use in this workspace. The
            stored value is never shown in this list.
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
          Create secret
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
            {SECRETS_SEARCHABLE_FIELDS.map((field) => (
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
            No secrets yet. Create one so an app or API can read an encrypted
            value.
          </Typography>
        )}

        {!isLoading &&
          filteredData.map((secret: Secret) => (
            <SecretRow
              key={secret.ref}
              role="link"
              tabIndex={0}
              onClick={() => onOpen(secret.ref)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onOpen(secret.ref);
                }
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ mb: 0.5 }}>
                  <FieldLabel>Secret name</FieldLabel>
                  <Typography sx={{ fontWeight: 600, fontSize: 16, color: "#fff" }}>
                    {secret.name}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 12, color: "base.05" }}>
                  Value is encrypted. Open to replace it.
                </Typography>
              </Box>
              <IconButton
                size="small"
                aria-label="Delete secret"
                onClick={(e) => {
                  e.stopPropagation();
                  void handleDelete([secret]);
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
                className="secret-open-icon"
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
                  className="secret-open-chevron"
                  sx={{
                    fontSize: 20,
                    transition: "transform 160ms ease"
                  }}
                />
              </Box>
            </SecretRow>
          ))}
      </Board>
    </Page>
  );
}
