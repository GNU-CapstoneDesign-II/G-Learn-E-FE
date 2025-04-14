// src/api/axiosInstance.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-api.com',
  withCredentials: true, // 리프레시 토큰용 쿠키 포함
});

// 요청 인터셉터: accessToken 자동 삽입
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('accessToken');

    // 로그인/회원가입/토큰재발급 등은 토큰 없이 요청
    const isAuthFree =
      config.url.includes('/auth/login') ||
      config.url.includes('/auth/register') ||
      config.url.includes('/auth/reissue');

    if (!isAuthFree && token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 발생 시 토큰 재발급 → 원래 요청 재시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          'https://your-api.com/auth/reissue',
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        sessionStorage.setItem('accessToken', newAccessToken);

        // 토큰 다시 설정하고 원래 요청 재시도
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // 재발급 실패 시 로그아웃 처리
        sessionStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
