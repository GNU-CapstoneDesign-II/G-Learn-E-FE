// src/api/WorkbookEditApi.js
import axios from './axiosInstance';

/**
 * 주어진 워크북 ID 리스트로부터 합칠 문제들을 조회합니다.
 * GET /api/workbook/merge?ids=1&ids=2&ids=3
 * 
 * @param {number[]} ids - 합치려는 원본 워크북 ID 목록
 * @returns {Promise<Object[]>} problems - 문제 객체 배열
 */
export const fetchMergeProblems = async (ids) => {
    const params = new URLSearchParams();
    ids.forEach(id => params.append('ids', id));
    const res = await axios.get('/api/workbook/merge', { params });
    return res.data.data.problems;
};

/**
* 문제 객체 배열을 받아 새 워크북으로 병합 생성합니다.
* POST /api/workbook/merge
* 
* Request body 예시:
* {
*   "title": "문제집 제목",
*   "problems": [
*     {
*       "id": 0,
*       "type": "string",
*       "title": "string",
*       "options": ["string"],
*       "answers": ["string"],
*       "explanation": "string"
*     }
*   ]
* }
* 
* @param {string} title - 새로 생성할 워크북 제목
* @param {Array<Object>} problems - 병합할 문제 객체 배열
* @returns {Promise<Object>} createdWorkbook - 생성된 워크북 정보
*/
export const mergeWorkbook = async (title, problems) => {
    const payload = { title, problems };
    const res = await axios.post('/api/workbook/merge', payload);
    return res.data.data.createdWorkbook;
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

/**
 * 주어진 workbook id 목록에 해당하는 워크북의 기본 정보를 조회합니다.
 * (백엔드에 GET /api/workbook/{id} 가 있다고 가정)
 * @param {number[]} ids
 * @returns {Promise<{id: number, title: string}[]>}
 */
export const fetchWorkbooks = async (ids) => {
    const promises = ids.map(id =>
        axios.get(`/api/workbook/${id}`)
            .then(res => res.data.data)
    );
    return Promise.all(promises);
};