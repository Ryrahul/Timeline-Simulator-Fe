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
    if (error.response?.status === 401) {
      // Redirect to login page
      localStorage.removeItem("accountState"); // Optional: Clear account state
      window.location.href = "/login"; // Change to your login route
    }
    return Promise.reject(error);
  }
);
