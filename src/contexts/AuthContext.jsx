// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { clearTokens, getAccessToken } from '../utils/authToken';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1) 앱 첫 로딩에 토큰이 있으면 프로필 동기화
    useEffect(() => {
        if (!getAccessToken()) {
            setLoading(false);
            return;
        }

        axiosInstance
            .get('/api/user')                  // BASE_URL + /api/user
            .then(res => setUser(res.data.data))
            .catch(() => {
                clearTokens();
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    // 2) 로그인: 토큰 세팅 → 프로필 호출
    const login = async () => {
        const res = await axiosInstance.get('/api/user');
        setUser(res.data.data);
        return res.data.data;
    };

    // 3) 로그아웃: 토큰·상태 클리어
    const logout = async () => {
        try {
            // 1) 서버에 로그아웃 요청 (리프레시 토큰 무효화)
            await axiosInstance.delete('/api/auth/logout');
        } catch (e) {
            console.warn('Logout API 호출 중 오류', e);
        } finally {
            // 2) 클라이언트 측 토큰 및 상태 초기화
            clearTokens();
            setUser(null);
            // 3) 로그인 페이지로 리다이렉트
            window.location.href = '/';
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
