/**
 * Copyright (C) 2025 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * Licensed under the MIT License.
 */
import type { Route } from "./+types/domains.page";
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
import { DOMAINS_SEARCHABLE_FIELDS } from "./domains.const";
import { useResourceTable } from "~/core/hooks/use-resource-table";
import { useDomains, useDeleteDomain } from "../../services/domains.service";
import { useNavigate } from "react-router";
import { useWorkspaceId } from "~/workspaces/hooks/use-workspace-id";
import { PRODUCT_NAME } from "~/core/brand/product";
import { ResourceListSkeleton } from "~/core/brand/studio-skeletons";
import type { Domain } from "@fonoster/types";

export function meta(_: Route.MetaArgs) {
  return [
    { title: `Domains | ${PRODUCT_NAME}` },
    {
      name: "description",
      content:
        "A domain groups SIP agents (desk phones, apps) so they can call each other."
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

const DomainRow = styled(Box)(() => ({
  display: "flex",
  alignItems: "flex-start",
  gap: 8,
  padding: "16px 8px 16px 16px",
  borderRadius: 16,
  cursor: "pointer",
  "&:hover": {
    background: "rgba(76,111,255,0.1)"
  },
  "&:hover .domain-open-icon": {
    color: "#fff",
    backgroundColor: "rgba(76,111,255,0.16)"
  },
  "&:active .domain-open-chevron": {
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

function aclName(domain: Domain) {
  return domain.accessControlList?.name || "Not set";
}

function egressLabel(domain: Domain) {
  const policies = domain.egressPolicies || [];
  if (policies.length === 0) return "None";
  return `${policies.length} ${policies.length === 1 ? "rule" : "rules"}`;
}

export default function DomainsList() {
  const navigate = useNavigate();
  const workspaceId = useWorkspaceId();
  const [pageToken, setPageToken] = useState<string | undefined>(undefined);

  const { data, nextPageToken, isLoading } = useDomains({
    pageSize: PAGE_SIZE,
    pageToken
  });

  const { mutateAsync: deleteDomain } = useDeleteDomain();

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
    deleteResource: deleteDomain,
    searchableFields: DOMAINS_SEARCHABLE_FIELDS,
    defaultSearchBy: "name"
  });

  const onOpen = useCallback(
    (ref: string) => {
      navigate(`/workspaces/${workspaceId}/sip-network/domains/${ref}/edit`, {
        viewTransition: true
      });
    },
    [navigate, workspaceId]
  );

  const onCreate = useCallback(() => {
    navigate(`/workspaces/${workspaceId}/sip-network/domains/create`, {
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
            Domains
          </Typography>
          <Typography sx={{ mt: 1, color: "base.04", fontSize: 14, maxWidth: 560 }}>
            A domain is a group for SIP agents (desk phones, softphones). The
            URI is the internal address they register to.
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
          Create domain
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
            {DOMAINS_SEARCHABLE_FIELDS.map((field) => (
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
            No domains yet. Create one so agents can register.
          </Typography>
        )}

        {!isLoading &&
          filteredData.map((domain) => (
            <DomainRow
              key={domain.ref}
              role="link"
              tabIndex={0}
              onClick={() => onOpen(domain.ref)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onOpen(domain.ref);
                }
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ mb: 1.5 }}>
                  <FieldLabel>Domain name</FieldLabel>
                  <Typography sx={{ fontWeight: 600, fontSize: 16, color: "#fff" }}>
                    {domain.name}
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
                    <FieldLabel>Domain URI</FieldLabel>
                    <Typography
                      sx={{
                        fontSize: 13,
                        color: "#fff",
                        fontWeight: 600,
                        wordBreak: "break-all"
                      }}
                    >
                      {domain.domainUri || "Not set"}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "base.05" }}>
                      Internal address agents register to
                    </Typography>
                  </Box>
                  <Box>
                    <FieldLabel>Who can join (ACL)</FieldLabel>
                    <Typography sx={{ fontSize: 13, color: "#fff" }}>
                      {aclName(domain)}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "base.05" }}>
                      Allowed and blocked IPs
                    </Typography>
                  </Box>
                  <Box>
                    <FieldLabel>Outbound rules</FieldLabel>
                    <Typography sx={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>
                      {egressLabel(domain)}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "base.05" }}>
                      Which numbers to use when calling out
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <IconButton
                size="small"
                aria-label="Delete domain"
                onClick={(e) => {
                  e.stopPropagation();
                  void handleDelete([domain]);
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
                className="domain-open-icon"
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
                  className="domain-open-chevron"
                  sx={{
                    fontSize: 20,
                    transition: "transform 160ms ease"
                  }}
                />
              </Box>
            </DomainRow>
          ))}
      </Board>
    </Page>
  );
}
