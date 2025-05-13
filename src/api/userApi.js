// src/api/userApi.js
import axiosInstance from "./axiosInstance";

/**
 * 유저 풀이 통계 조회
 * @returns {Promise<{
 *   ranking: number;
 *   createdWorkbooks: number;
 *   solvedWorkbooks: number;
 * }>}
 */
export async function getSolvingStatistics() {
    try {
        const response = await axiosInstance.get("/api/user/solving-statistics");
        // 서버가 반환하는 { code, message, data } 중 data만 꺼내서 리턴
        return response.data.data;
    } catch (error) {
        console.error("풀이 통계 조회 중 에러:", error);
        throw error;
    }
}


/**
 * 유저 정보 수정
 */
export async function updateUserInfo(userInfo) {
    try {
        const response = await axiosInstance.patch("/api/user", userInfo);
        return response.data.data;
    } catch (error) {
        console.error("유저 정보 수정 중 에러:", error);
        throw error;
    }
}