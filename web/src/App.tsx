import { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { lightTheme, darkTheme } from "./theme";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import SalesPage from "./pages/SalesPage";
import InventoryPage from "./pages/InventoryPage";
import ReportsPage from "./pages/ReportsPage";
import AdminPage from "./pages/AdminPage";
import OrdersPage from "./pages/OrdersPage";
import CustomersPage from "./pages/CustomersPage";
import ExpensesPage from "./pages/ExpensesPage";
import ChatPage from "./pages/ChatPage";
import SystemOrganizationsPage from "./pages/SystemOrganizationsPage";
import SystemUsersPage from "./pages/SystemUsersPage";

// ── Dark mode context ─────────────────────────────────────────────────────────
interface ThemeCtx {
  isDark: boolean;
  toggle: () => void;
}
const DarkModeContext = createContext<ThemeCtx>({ isDark: false, toggle: () => {} });
export const useDarkMode = () => useContext(DarkModeContext);

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  return token ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("web_darkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("web_darkMode", String(isDark));
  }, [isDark]);

  const toggle = () => setIsDark((p) => !p);
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <DarkModeContext.Provider value={{ isDark, toggle }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="sales" element={<SalesPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="expenses" element={<ExpensesPage />} />
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="admin" element={<AdminPage />} />
              <Route path="organizations" element={<SystemOrganizationsPage />} />
              <Route path="users" element={<SystemUsersPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </DarkModeContext.Provider>
  );
}

export default App;
