import { memo } from "react";
import { Box, Typography } from "@mui/material";
import { PRODUCT_NAME } from "~/core/brand/product";
import { LogoMark } from "./logo-mark";

export const LogoLarge = memo(() => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <LogoMark size={28} />
      <Typography
        component="span"
        sx={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
          fontSize: "18px",
          letterSpacing: "-0.02em",
          lineHeight: 1,
          color: "#0b1433"
        }}
      >
        {PRODUCT_NAME}
      </Typography>
    </Box>
  );
});

LogoLarge.displayName = "LogoLarge";
