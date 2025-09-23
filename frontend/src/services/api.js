// services/: API services dùng Axios + SWR.
import axios from "axios";
const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BACKEND,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const refreshToken = async () => {
  try {
    const res = await api.post("auth/refresh");
    const accessToken = res.data?.access_token;
    if (!accessToken) {
      throw new Error("No access token returned");
    }
    localStorage.setItem("access_token", accessToken);
    return accessToken;
  } catch (error) {
    console.error("Refresh token failed:", error);
    if (error.code === "ECONNABORTED") {
      alert("Máy chủ không phản hồi sau 10 giây. Vui lòng thử lại sau.");
    }
    throw error;
  }
};

axiosClient.interceptors.request.use((config) => {
  if (
    config.url !== "auth/login" &&
    config.url !== "auth/register" &&
    config.url !== "auth/refresh"
  ) {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
let isRefreshing = false;
let queue = [];

axiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const originalReq = error.config;
    const code = error.response?.data?.errorCode;
    if (code === "TOKEN_EXPIRED" || error.response.status === 401) {
      if (!originalReq._retry) {
        originalReq._retry = true;
        if (!isRefreshing) {
          localStorage.removeItem("access_token");
          isRefreshing = true;
          return refreshToken()
            .then((newToken) => {
              localStorage.setItem("access_token", newToken);
              isRefreshing = false;
              queue.forEach((cb) => cb(newToken));
              queue = [];
              originalReq.headers.Authorization = `Bearer ${newToken}`;
              return axiosClient(originalReq);
            })
            .catch((err) => {
              queue = [];
              alert("hết phiên vui lòng đăng nhập lại");
              window.location.href = "/auth/login";
              return Promise.reject(err);
            });
        }
        return new Promise((resolve) => {
          queue.push((token) => {
            originalReq.headers.Authorization = `Bearer ${token}`;
            resolve(axiosClient(originalReq));
          });
        });
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
