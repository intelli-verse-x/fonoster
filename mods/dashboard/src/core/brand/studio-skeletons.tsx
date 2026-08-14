/**
 * Copyright (C) 2025 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * Licensed under the MIT License.
 */
import { Box, Skeleton, styled } from "@mui/material";
import { Page } from "~/core/components/general/page/page";

const bone = {
  bgcolor: "rgba(76,111,255,0.16)",
  "&::after": {
    background:
      "linear-gradient(90deg, transparent, rgba(110,168,255,0.22), transparent)"
  }
};

const Card = styled(Box)(() => ({
  padding: "16px 16px 16px 16px",
  borderRadius: 16
}));

export function ResourceListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <Box aria-busy="true" aria-label="Loading list">
      {Array.from({ length: rows }).map((_, index) => (
        <Card key={index}>
          <Skeleton
            variant="rounded"
            width={88}
            height={8}
            animation="wave"
            sx={{ ...bone, mb: 1.2 }}
          />
          <Skeleton
            variant="rounded"
            width={index % 2 === 0 ? 220 : 180}
            height={18}
            animation="wave"
            sx={{ ...bone, mb: 2 }}
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 12
            }}
          >
            {[0, 1, 2, 3].map((col) => (
              <Box key={col}>
                <Skeleton
                  variant="rounded"
                  width={72}
                  height={8}
                  animation="wave"
                  sx={{ ...bone, mb: 1 }}
                />
                <Skeleton
                  variant="rounded"
                  width="80%"
                  height={14}
                  animation="wave"
                  sx={bone}
                />
                <Skeleton
                  variant="rounded"
                  width="55%"
                  height={10}
                  animation="wave"
                  sx={{ ...bone, mt: 0.8 }}
                />
              </Box>
            ))}
          </Box>
        </Card>
      ))}
    </Box>
  );
}

export function StudioFormSkeleton() {
  return (
    <Page aria-busy="true" aria-label="Loading details">
      <Skeleton
        variant="rounded"
        width={140}
        height={14}
        animation="wave"
        sx={{ ...bone, mt: 2, mb: 3 }}
      />
      <Skeleton
        variant="rounded"
        width={120}
        height={10}
        animation="wave"
        sx={{ ...bone, mb: 1.5 }}
      />
      <Skeleton
        variant="rounded"
        width={280}
        height={36}
        animation="wave"
        sx={{ ...bone, mb: 1 }}
      />
      <Skeleton
        variant="rounded"
        width={420}
        height={14}
        animation="wave"
        sx={{ ...bone, mb: 3 }}
      />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(240px, 300px)",
          gap: 24,
          "@media (max-width: 719px)": {
            gridTemplateColumns: "1fr"
          }
        }}
      >
        <Box
          sx={{
            borderRadius: 5,
            p: 3,
            bgcolor: "bg.muted",
            border: "1px solid",
            borderColor: "base.07"
          }}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rounded"
              height={48}
              animation="wave"
              sx={{ ...bone, mb: 2, borderRadius: 2 }}
            />
          ))}
        </Box>
        <Box
          sx={{
            borderRadius: 5,
            p: 2.5,
            bgcolor: "bg.muted",
            border: "1px solid",
            borderColor: "base.07",
            height: "fit-content"
          }}
        >
          <Skeleton
            variant="rounded"
            width={72}
            height={10}
            animation="wave"
            sx={{ ...bone, mb: 2 }}
          />
          <Skeleton
            variant="rounded"
            height={40}
            animation="wave"
            sx={{ ...bone, mb: 1.5, borderRadius: 2 }}
          />
          <Skeleton
            variant="rounded"
            height={12}
            animation="wave"
            sx={bone}
          />
        </Box>
      </Box>
    </Page>
  );
}
