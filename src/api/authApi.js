// src/api/authApi.js
import axios from "./axiosInstance.js";

export const login = async (email, password) => {
    const res = await axios.post("/api/auth/login", { email, password });
    return res.data.data; // { accessToken, refreshToken }
};

export const issueEmailAuthCode = async (email) => {
    const res = await axios.get(`/api/auth/email-code?email=${email}`);
    return res; // { message }
}

export const verifyEmailAuthCode = async (email, authCode) => {
    const res = await axios.post("/api/auth/email-code/verify", { email, authCode });
    return res; // { message }
};




// 비밀번호 초기화 관련
export const issuePasswordResetEmailCode = async (email) => {
    const res = await axios.get(`/api/auth/password-reset-code?email=${email}`);
    return res; // { message }
}


export const verifyPasswordResetEmailCode = async (email, authCode) => {
    const res = await axios.post("/api/auth/password-reset-code/verify", { email, authCode });
    return res;
    /*
    {
      "code": 200,
      "message": "비밀번호 찾기 이메일 인증 코드 검증 성공. 유효 시간: 30분",
      "data": {
        "emailAuthToken": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjaXJjbGV6ZXJvQGdudS5hYy5rciIsInRva2VuVHlwZSI6InBhc3N3b3JkLXJlc2V0IiwiaWF0IjoxNzQ2ODk0Njc1LCJleHAiOjE3NDY4OTY0NzV9.Bz7BJUVWrQBeHr7gpTlqxye0ThGEY2XDahEG_IBrOD0YFo--ioXS-lVWBb6ijuAzepez1bbh9xLq8-xhw_xjpg"
      }
    }
    */
};

export const changePassword = async (oldPassword, newPassword, newPasswordConfirm) => {
    const res = await axios.patch("/api/auth/password", { oldPassword, newPassword, newPasswordConfirm });
    return res; // { message }
};

export const resetPassword = async (name, email, password, passwordConfirm, resetToken) => {
    const res = await axios.patch("/api/auth/password/reset",
        { name, email, password, passwordConfirm },
        {
            headers: {
                Authorization: `Bearer ${resetToken}`,
            }
        }
    );
    return res; // { message }
}