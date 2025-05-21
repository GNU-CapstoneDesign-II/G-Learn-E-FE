// src/api/axiosInstance.js
import axios from "axios";
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "../utils/authToken";

// 백엔드 API 주소 (직접 명시)
// const BASE_URL = "http://3.39.155.100:8080";
const BASE_URL = "http://localhost:8080";

const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

const AUTH_REQUIRED_PREFIXES = ["/api/"];
const AUTH_EXCLUDE_URLS = [
    "/api/auth/login",
    "/api/auth/signup",
    "/api/auth/email-code",
    "/api/auth/email-code/verify",

    "/api/auth/password-reset-code",
    "/api/auth/password-reset-code/verify",
    "/api/auth/password/reset",
];

instance.interceptors.request.use((config) => {
    const token = getAccessToken();
    const url = config.url;

    const needsAuth =
        AUTH_REQUIRED_PREFIXES.some((prefix) => url.startsWith(prefix)) &&
        !AUTH_EXCLUDE_URLS.includes(url); // ✅ 예외 처리

    if (token && needsAuth) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
});


instance.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = getRefreshToken();
                if (!refreshToken) throw new Error("No refresh token");

                const res = await axios.patch(`${BASE_URL}/api/auth/reissue`, null, {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`,
                    },
                });

                const newAccessToken = res.data?.data?.accessToken;
                if (!newAccessToken) throw new Error("No access token");

                setTokens({ accessToken: newAccessToken, refreshToken });
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                return instance(originalRequest);
            } catch (e) {
                clearTokens();
                window.location.href = "/login";
                return Promise.reject(e);
            }
        }

        return Promise.reject(error);
    }
);

export default instance;
