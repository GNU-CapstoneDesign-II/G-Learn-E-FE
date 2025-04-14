// src/api/authApi.js
import axios from "./axiosInstance";

export const login = async (email, password) => {
    const res = await axios.post("/api/auth/login", { email, password });
    return res.data.data; // { accessToken, refreshToken }
};
