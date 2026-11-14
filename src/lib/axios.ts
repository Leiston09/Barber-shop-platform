import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL, timeout: 15000 });
api.interceptors.request.use(config => {
  const token = localStorage.getItem("AUTH_TOKEN");
  if (token) config.headers.Authorization = "Bearer " + token;
  else delete config.headers.Authorization;
  return config;
});
api.interceptors.response.use(
  response => {
    const used = response.config.headers.Authorization;
    if (used && used !== "Bearer " + localStorage.getItem("AUTH_TOKEN")) {
      return Promise.reject(new axios.CanceledError("La sesion cambio durante la solicitud"));
    }
    return response;
  },
  error => {
    const used = error.config?.headers?.Authorization;
    const current = localStorage.getItem("AUTH_TOKEN");
    const path = error.config?.url || "";
    const publicAuth = path.startsWith("/auth/") && path !== "/auth/user" &&
      !path.startsWith("/auth/users") && path !== "/auth/clients";
    if (!publicAuth && used && used === "Bearer " + current &&
        (error.response?.status === 401 || error.response?.data?.blocked === true)) {
      localStorage.removeItem("AUTH_TOKEN");
      window.dispatchEvent(new Event("appsalon:session-invalid"));
    }
    return Promise.reject(error);
  },
);
export default api;
