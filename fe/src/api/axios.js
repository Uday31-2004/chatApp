import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ex: http://localhost:5000
  withCredentials: true, // Sends cookies (refresh token)
});

// ⚡ Auto Attach Access Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 🔁 Auto Refresh Token On 401
let refreshingPromise = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalReq = error.config;
    if (error.response?.status === 401 && !originalReq.__retry) {
      originalReq.__retry = true;

      if (!refreshingPromise) {
        refreshingPromise = api.post("/auth/refresh").finally(() => {
          refreshingPromise = null;
        });
      }

      const { data } = await refreshingPromise;
      localStorage.setItem("access_token", data.accessToken);

      originalReq.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(originalReq);
    }
    return Promise.reject(error);
  }
);

export default api;
