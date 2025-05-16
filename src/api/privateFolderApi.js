// src/api/privateFolderApi.js
import axiosInstance from './axiosInstance';

/**
 * 최상위 루트 또는 특정 폴더의 정보를 가져옵니다.
 * @param {number|null} folderId
 * @returns {Promise<{
 *   id: number,
 *   name: string,
 *   parentId: number|null,
 *   childFolders: { id: number, name: string, createdAt: string }[],
 *   childWorkbooks: { id: number, name: string, coverImage: any, createdAt: string, isUploaded: boolean }[]
 * }>}
 */
export function fetchPrivateFolder(folderId = null) {
    const url = folderId != null
        ? `/api/folder/private/${folderId}`
        : `/api/folder/private`;
    return axiosInstance.get(url).then(res => res.data.data);
}

/**
 * private 폴더 생성
 * @param {{ name: string, parentId: number|null }} payload
 * @returns {Promise<{ id: number, name: string, parentId: number|null, createdAt: string }>}  
 */
export function createPrivateFolder({ name, parentId = null }) {
    return axiosInstance
        .post('/api/folder/private', { name, parentId })
        .then(res => res.data.data);
}

/**
 * 문제집을 다른 폴더로 이동합니다.
 * @param {number} workbookId
 * @param {number} targetFolderId
 * @returns {Promise<{ id: number, name: string, parentId: number|null, createdAt: string }>}
 */
export function moveWorkbook(workbookId, targetFolderId) {
    return axiosInstance
        .patch(
            `/api/folder/private/workbook/${workbookId}/move`,
            { targetFolderId }
        )
        .then(res => res.data.data);
}

/**
 * 폴더를 다른 폴더로 이동합니다.
 * @param {number} folderId
 * @param {number} targetFolderId
 * @returns {Promise<{ id: number, name: string, parentId: number|null, createdAt: string }>}
 */
export function moveFolder(folderId, targetFolderId) {
    return axiosInstance
        .patch(
            `/api/folder/private/${folderId}/move`,
            { targetFolderId }
        )
        .then(res => res.data.data);
}

/**
 * 폴더 이름을 변경합니다.
 * PATCH /api/folder/private/{folderId}/rename
 * @param {number} folderId
 * @param {string} newFolderName
 * @returns {Promise<{ id: number, name: string, parentId: number|null, createdAt: string }>}
 */
export function renameFolder(folderId, newFolderName) {
    return axiosInstance
        .patch(`/api/folder/private/${folderId}/rename`, { newFolderName })
        .then((res) => res.data.data);
}


/**
 * 폴더를 삭제합니다.
 * DELETE /api/folder/private/{folderId}
 * @param {number} folderId
 * @returns {Promise<{ id: number, name: string, parentId: number|null, createdAt: string }>}
 */
export function deleteFolder(folderId) {
    return axiosInstance.delete(`/api/folder/private/${folderId}`).then((res) => res.data.data);
}

/**
 * 문제집을 삭제합니다.
 * DELETE /api/folder/private/{folderId}/workbook/{workbookId}
 * @param {number} folderId
 * @param {number} workbookId
 * @returns {Promise<{ id: number, name: string, coverImage: any, createdAt: string, isUploaded: boolean }>}
 */
export function deleteWorkbook(folderId, workbookId) {
    return axiosInstance
        .delete(`/api/folder/private/${folderId}/workbook/${workbookId}`)
        .then((res) => res.data.data);
}

/**
 * 문제집 이름을 변경합니다.
 * PATCH /api/workbook/{workbookId}/rename
 * @param {number} workbookId
 * @param {string} newName
 * @returns {Promise<{ id: number, name: string, coverImage: any, createdAt: string, isUploaded: boolean }>}
 */
export function renameWorkbook(workbookId, newName) {
    return axiosInstance
        .patch(`/api/workbook/${workbookId}/rename`, { newName })
        .then((res) => res.data.data);
}

/**
 * 워크북 상세 정보를 가져옵니다.
 * GET /api/workbook/{workbookId}
 * @param {number} workbookId
 * @returns {Promise<{
 *   id: number,             // 문제집 ID
 *   name: string,           // 워크북 이름
 *   professor: string,      // 교수 이름
 *   examType: string,       // 시험 유형
 *   coverImage: number,     // 표지 이미지 (서버에선 Integer)
 *   courseYear: number,     // 수강 연도
 *   semester: string,       // 학기
 *   createdAt: string,      // 생성일 (ISO 문자열)
 *   problems: ProblemResponse[]  // 문제 목록
 * }>}
 */
export function fetchWorkbookDetail(workbookId) {
 return axiosInstance
   .get(`/api/workbook/${workbookId}`)
   .then(res => res.data.data);
}