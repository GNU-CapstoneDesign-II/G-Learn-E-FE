// src/api/workbookApi.js
// 문제 풀이 aPI
import axios from "./axiosInstance";


export const fetchWorkbook = async (workbookId) => {
    const res = await axios.get(`/api/workbook/${workbookId}/solve`);
    return res.data.data;
};


/**
 * 임시 저장 API
 * @param {string|number} workbookId - 문제집 ID
 * @param {Array} userAttempts - [{ problemId: number, submitAnswer: string[] }]
 * @param {string} token - 사용자 인증 토큰
 * @returns {Promise<any>}
 */
export const saveSolveLog = async (workbookId, userAttempts) => {
    const res = await axios.patch(
        `/api/solve-log/workbook/${workbookId}`,
        { userAttempts }
    );
    return res.data;
};


/**
 * 채점 API
 * @param {string|number} workbookId - 문제집 ID
 * @param {Array} userAttempts - [{ problemId: number, submitAnswer: string[] }]
 * @param {string} token - 사용자 인증 토큰
 * @returns {Promise<any>}
 */
export const gradeWorkbook = async (workbookId, userAttempts) => {
    console.log(userAttempts);
    const res = await axios.post(
        `/api/workbook/${workbookId}/grade`,
        { userAttempts }
    );
    return res.data;
};

/**
 * 채점 결과 삭제 API
 * @param {string|number} workbookId - 문제집 ID
 * @param {string} token - 사용자 인증 토큰
 * @returns {Promise<any>}
 */
export const resetSolveLog = async (workbookId) => {
    const res = await axios.delete(`/api/solve-log/workbook/${workbookId}`);
    return res.data;
};
