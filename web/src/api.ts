import axios from "axios";

const api = axios.create({
  // In containers the web server proxies /api to the backend.  Set
  // VITE_API_BASE_URL when the API is hosted somewhere else.
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const adminActiveOrg = localStorage.getItem("admin_active_org");
  if (adminActiveOrg) {
    config.headers["x-organization-id"] = adminActiveOrg;
  }

  return config;
});

export default api;
