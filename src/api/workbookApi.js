import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const fetchWorkbook = async (workbookId, token) => {
    const res = await axios.get(`${API_BASE_URL}/workbook/${workbookId}/solve`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.data;
};

/**
 * 임시 저장 API
 * @param {string|number} workbookId - 문제집 ID
 * @param {Array} userAttempts - [{ problemId: number, submitAnswer: string[] }]
 * @param {string} token - 사용자 인증 토큰
 * @returns {Promise<any>}
 */
export const saveSolveLog = async (workbookId, userAttempts, token) => {
    const res = await axios.patch(
        `${API_BASE_URL}/solve-log/workbook/${workbookId}`,
        { userAttempts },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
    );

    return res.data; // 필요하면 .data.data 도 가능
};


/**
 * 채점 API
 * @param {string|number} workbookId - 문제집 ID
 * @param {Array} userAttempts - [{ problemId: number, submitAnswer: string[] }]
 * @param {string} token - 사용자 인증 토큰
 * @returns {Promise<any>}
 */
export const gradeWorkbook = async (workbookId, userAttempts, token) => {
    const res = await axios.post(
        `${API_BASE_URL}/workbook/${workbookId}/grade`,
        { userAttempts },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
};

/**
 * 채점 결과 삭제 API
 * @param {string|number} workbookId - 문제집 ID
 * @param {string} token - 사용자 인증 토큰
 * @returns {Promise<any>}
 */
export const resetSolveLog = async (workbookId, token) => {
    const res = await axios.delete(
        `${API_BASE_URL}/solve-log/workbook/${workbookId}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return res.data;
};
