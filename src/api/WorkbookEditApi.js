// src/api/workbookApi.js
import axios from './axiosInstance';

/**
 * 주어진 workbook id 목록에 속한 모든 문제를 조회합니다.
 * GET /api/workbook/merge?ids=1&ids=2&ids=3...
 * @param {number[]} ids
 * @returns {Promise<Object[]>} problems
 */
export const fetchMergeProblems = async (ids) => {
    // URLSearchParams 로 ids 파라미터 배열 처리
    const params = new URLSearchParams();
    ids.forEach(id => params.append('ids', id));

    const res = await axios.get('/api/workbook/merge', { params });
    // res.data.data.problems 형태로 반환됨
    return res.data.data.problems;
};

/**
 * 선택된 문제 ID들로 새 문제집을 만듭니다.
 * POST /api/workbook
 * @param {string} title
 * @param {number[]} problemIds
 * @returns {Promise<Object>} createdWorkbook
 */
export const createMergedWorkbook = async (title, problemIds) => {
    const payload = { title, problemIds };
    const res = await axios.post('/api/workbook', payload);
    // res.data.data 에 새로 생성된 워크북 정보가 들어있다고 가정
    return res.data.data;
};

/**
 * 워크북의 문제 리스트를 교체(업데이트)합니다.
 * PATCH /api/workbook/{workbookId}/problems
 * @param {number|string} workbookId
 * @param {number[]} problemIds
 * @returns {Promise<Object>} updatedWorkbook
 */
export const updateWorkbookProblems = async (workbookId, problemIds) => {
    const payload = { problemIds };
    const res = await axios.patch(
        `/api/workbook/${workbookId}/problems`,
        payload
    );
    // res.data.data 에 업데이트된 워크북 정보
    return res.data.data;
};
