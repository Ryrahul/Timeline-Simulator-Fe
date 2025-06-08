import axios from "axios";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_ENDPOINT,
});

export function setAxiosAuthHeader(token: string) {
  axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

axiosClient.interceptors.request.use(
  (config) => {
    const accountState = localStorage.getItem("accountState");
    if (accountState) {
      const { token } = JSON.parse(accountState);
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Defensive check

    if (
      error.response?.status === 401 &&
      error.config?.url &&
      !error.config.url.includes("/auth/login") &&
      !error.config.url.includes("/auth/signup")
    ) {
      localStorage.removeItem("accountState");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
