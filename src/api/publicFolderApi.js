// src/api/publicFolderApi.js
import axiosInstance from "./axiosInstance";

/**
 * Public 폴더 데이터를 조회합니다.
 * @param {number|null} folderId - null이면 루트 폴더
 * @param {{
 *   main?: string,
 *   sub?: string,
 *   year?: string,
 *   subject?: string
 * }} filter - 필터 조건
 * @returns {Promise<{
 *   id: number | null,
 *   name: string,
 *   parentId: number | null,
 *   childFolders: { id: number, name: string }[],
 *   childWorkbooks: { id: number, name: string, createdAt?: string }[]
 * }>}
 */
export function fetchPublicFolder(folderId = null, filter = {}) {
    const params = { ...filter };
    const url = folderId != null
        ? `/api/folder/public/${folderId}`
        : `/api/folder/public`;
    return axiosInstance.get(url, { params }).then(res => res.data.data);
}

/**
 * Public → Private 문제집 복사
 * @param {number} workbookId
 * @returns {Promise<any>}
 */
export function copyWorkbookToPrivate(workbookId) {
    return axiosInstance.post(`/api/workbook/${workbookId}/upload`).then(res => res.data);
}
