import { createTheme, alpha } from "@mui/material/styles";

const primary = "#1e3c72";
const primaryLight = "#2a5298";
const accent = "#6366f1";

function createAppTheme(mode: "light" | "dark") {
  const isDark = mode === "dark";
  return createTheme({
    palette: {
      mode,
      primary: { main: primary, light: primaryLight, dark: "#152a52" },
      secondary: { main: accent },
      success: { main: "#10b981" },
      warning: { main: "#f59e0b" },
      error: { main: "#ef4444" },
      background: {
        default: isDark ? "#0f172a" : "#f0f4f8",
        paper: isDark ? "#1e293b" : "#ffffff",
      },
      text: {
        primary: isDark ? "#f1f5f9" : "#0f172a",
        secondary: isDark ? "#94a3b8" : "#64748b",
      },
      divider: isDark ? "#334155" : "#e2e8f0",
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 700, letterSpacing: "-0.02em" },
      h5: { fontWeight: 700, letterSpacing: "-0.01em" },
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 600 },
      button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 10, boxShadow: "none" },
          contained: {
            background: `linear-gradient(135deg, ${primary}, ${primaryLight})`,
            "&:hover": {
              background: `linear-gradient(135deg, ${primaryLight}, ${primary})`,
              boxShadow: "0 4px 12px rgba(30,60,114,0.35)",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: isDark
              ? "0 1px 3px rgba(0,0,0,0.3)"
              : "0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)",
            border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            "& .MuiTableCell-head": {
              backgroundColor: isDark ? "#1e293b" : "#f8fafc",
              fontWeight: 600,
              color: isDark ? "#94a3b8" : "#475569",
              fontSize: "0.8125rem",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            },
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:last-child td": { borderBottom: 0 },
            "&:hover": { backgroundColor: isDark ? alpha("#ffffff", 0.04) : alpha("#000", 0.02) },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600 },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: { borderRadius: 16 },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": { borderRadius: 10 },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: { height: 3, borderRadius: "3px 3px 0 0" },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: { fontWeight: 600, minHeight: 48 },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            background: isDark
              ? `linear-gradient(180deg, #1e293b 0%, #0f172a 100%)`
              : `linear-gradient(180deg, ${primary} 0%, ${primaryLight} 100%)`,
            color: "#fff",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? "#1e293b" : "#ffffff",
            color: isDark ? "#f1f5f9" : "#0f172a",
          },
        },
      },
    },
  });
}

export const lightTheme = createAppTheme("light");
export const darkTheme = createAppTheme("dark");

// Keep backward compat
export const theme = lightTheme;

export const sidebarGradient = `linear-gradient(180deg, ${primary} 0%, ${primaryLight} 100%)`;
export const cardGradients = {
  indigo: `linear-gradient(135deg, ${alpha(accent, 0.12)}, ${alpha(accent, 0.04)})`,
  green: `linear-gradient(135deg, ${alpha("#10b981", 0.12)}, ${alpha("#10b981", 0.04)})`,
  amber: `linear-gradient(135deg, ${alpha("#f59e0b", 0.12)}, ${alpha("#f59e0b", 0.04)})`,
  rose: `linear-gradient(135deg, ${alpha("#ef4444", 0.12)}, ${alpha("#ef4444", 0.04)})`,
};
