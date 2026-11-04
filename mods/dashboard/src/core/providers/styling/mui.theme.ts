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
import { createTheme } from "@mui/material/styles";

/** Admin sky light tokens — shared with IntelliVerse Admin Console. */
const skyLight = {
  bg: {
    app: "#f7f9ff",
    surface: "#ffffff",
    muted: "#f2f6ff"
  },
  // Text scale stays dark enough for WCAG on #f7f9ff / #fff.
  // Borders/surfaces live in 06–08 (do not put border colors in 03–05).
  base: {
    "01": "#0b1433",
    "02": "#16214a",
    "03": "#3d4a6b",
    "04": "#5e6b8c",
    "05": "#6b7a99",
    "06": "#c7d2e8",
    "07": "#e6ecf8",
    "08": "#ffffff",
    main: "#5e6b8c"
  },
  brand: {
    "01": "#ffffff",
    "02": "#e8efff",
    "03": "#9db6f0",
    "04": "#2457d6",
    "05": "#7a5bff",
    "06": "#c63fe0",
    "07": "#0b1433",
    main: "#2457d6"
  },
  background: {
    default: "#f7f9ff",
    paper: "#ffffff"
  },
  text: {
    primary: "#0b1433",
    secondary: "#5e6b8c"
  },
  divider: "#e6ecf8"
};

export const theme = createTheme({
  typography: {
    fontFamily:
      "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
  },
  colorSchemes: {
    light: {
      palette: skyLight
    },
    // Light-only product: keep dark scheme identical so stale localStorage stays readable.
    dark: {
      palette: skyLight
    }
  }
});
