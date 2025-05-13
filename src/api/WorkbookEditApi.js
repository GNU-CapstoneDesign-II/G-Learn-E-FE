import axios from './axiosInstance';

/**
 * 주어진 workbookId에 속한 모든 문제를 조회합니다.
 * GET /api/workbook/{workbookId}/problems
 */
export const fetchProblems = async (workbookId) => {
    const res = await axios.get(`/api/workbook/${workbookId}/problems`);
    return res.data.data.problems;
};

/**
 * 주어진 workbookId에 대해 문제집의 문제를 업데이트합니다.
 * PATCH /api/workbook/{workbookId}/problems
 */
export const updateProblems = async (workbookId, problems) => {
    const payload = { problems };
    const res = await axios.patch(`/api/workbook/${workbookId}/problems`, payload);
    return res.data;
};
