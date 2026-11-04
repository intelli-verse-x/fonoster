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
import Button from "@mui/material/Button";
import type {
  ButtonProps,
  ButtonPropsVariantOverrides,
  SxProps,
  Theme
} from "@mui/material";
import type { OverridableStringUnion } from "@mui/types";
import { styled } from "@mui/material/styles";
import { type CSSObject } from "@mui/system";

type ButtonVariant = Omit<
  OverridableStringUnion<
    "text" | "outlined" | "contained",
    ButtonPropsVariantOverrides
  >,
  "text"
>;

export interface ButtonAttributes {
  children?: React.ReactNode;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
  disabled?: boolean;
  type?: ButtonProps["type"];
  isFullWidth?: boolean;
  onClick?: ButtonProps["onClick"];
  endIcon?: ButtonProps["endIcon"];
  startIcon?: ButtonProps["startIcon"];
  sx?: SxProps<Theme>;
  danger?: boolean;
}

const sizeStyles = (size: ButtonProps["size"]): CSSObject => {
  if (size === "large") {
    return {
      fontSize: "11px",
      letterSpacing: "1.32px",
      padding: "8px 24px",
      minHeight: "37px",
      maxHeight: "37px"
    };
  }

  return {
    fontSize: "10px",
    letterSpacing: "0.5px",
    padding: "6px 20px",
    minHeight: "33px",
    maxHeight: "33px"
  };
};

const outlinedStyles = (theme: Theme, danger?: boolean): CSSObject[] => {
  if (danger) {
    return [
      {
        backgroundColor: "transparent",
        color: "#d32f2f",
        borderColor: "#d32f2f",
        border: "1px solid #d32f2f",
        "&:hover": {
          borderColor: "#b71c1c",
          color: "#b71c1c",
          backgroundColor: "transparent"
        }
      }
    ];
  }

  return [
    {
      backgroundColor: "transparent",
      color: theme.palette.base["03"],
      borderColor: `${theme.palette.base["03"]}`,
      border: `1px solid ${theme.palette.base["03"]}`
    }
  ];
};

const containedStyles = (theme: Theme, danger?: boolean): CSSObject[] => {
  if (danger) {
    return [
      {
        backgroundColor: "#d32f2f",
        color: "white",
        borderColor: "#d32f2f",
        "&:hover": {
          backgroundColor: "#b71c1c"
        },
        "&:disabled": {
          backgroundColor: "#d32f2f",
          opacity: 0.6
        }
      }
    ];
  }

  return [
    {
      backgroundColor: theme.palette.brand.main,
      backgroundImage:
        "linear-gradient(90deg, #2457d6 0%, #7a5bff 55%, #c63fe0 100%)",
      color: "#ffffff",
      borderColor: "transparent",
      "&:hover": {
        backgroundImage:
          "linear-gradient(90deg, #1a46b8 0%, #6848f0 55%, #b032cc 100%)",
        boxShadow: "0 8px 24px rgba(11, 20, 51, 0.16)"
      },
      "&:disabled": {
        backgroundImage:
          "linear-gradient(90deg, #2457d6 0%, #7a5bff 55%, #c63fe0 100%)",
        color: "#ffffff",
        opacity: 0.55
      }
    }
  ];
};

const variantStyles = (
  variant: ButtonVariant | undefined,
  theme: Theme,
  danger?: boolean
): CSSObject[] => {
  if (variant === "outlined") {
    return outlinedStyles(theme, danger);
  }

  return containedStyles(theme, danger);
};

export const StyledButton = styled(Button)<ButtonAttributes>(
  ({ theme, variant, size, disabled, danger }) => [
    {
      boxShadow: "none",
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      appearance: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      borderRadius: "100px",
      whiteSpace: "nowrap",
      fontFamily: "'Roboto Mono', sans-serif",
      fontFeatureSettings: "'liga' off, 'clig' off",
      fontStyle: "normal",
      fontWeight: 500,
      textTransform: "uppercase",
      userSelect: "none",
      transition: "all 0.2s ease-in-out",
      lineHeight: "normal",
      overflow: "hidden",
      textOverflow: "ellipsis",
      textDecoration: "none",
      minWidth: "fit-content",
      ...sizeStyles(size)
    },
    ...variantStyles(variant, theme, danger)
  ]
);
