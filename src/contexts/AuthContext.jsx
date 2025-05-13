// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { clearTokens, getAccessToken } from '../utils/authToken';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 초기 토큰 유무 확인 및 프로필 동기화
    useEffect(() => {
        const token = getAccessToken();
        if (!token) {
            setLoading(false);
            return;
        }
        axiosInstance
            .get("/api/user")
            .then((res) => setUser(res.data.data))
            .catch(() => {
                clearTokens();
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    // 로그인 (토큰 세팅 + 프로필 동기화)
    const login = async () => {
        const res = await axiosInstance.get('/api/user');
        setUser(res.data.data);
        return res.data.data;
    };

    // 로그아웃
    const logout = async () => {
        try {
            await axiosInstance.delete("/api/auth/logout");
        } catch (e) {
            console.warn("Logout API 호출 중 오류", e);
        } finally {
            clearTokens();
            setUser(null);
            window.location.href = "/";
        }
    };

    const isLoggedIn = Boolean(user);

    return (
        <AuthContext.Provider
            value={{ user, isLoggedIn, loading, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}