// src/api/publicFolderApi.js
import axiosInstance from "./axiosInstance";

/**
 * 특정 과목(subjectId)의 문제집 목록을 조회합니다.
 * @param {string|number} subjectId
 * @returns {Promise<{
 *   id: number,
 *   name: string,
 *   createdAt: string,
 *   isUploaded: boolean
 * }[]>}
 */
export function fetchPublicWorkbooks(subjectId) {
    return axiosInstance
        .get(`/api/folder/public/workbooks/${subjectId}`)
        .then(res => res.data.data);
}

/**
 * Public → Private 문제집 복사
 * @param {number} workbookId
 * @returns {Promise<any>}
 */
export function copyWorkbookToPrivate(workbookId) {
    return axiosInstance
        .post(`/api/workbook/${workbookId}/upload`)
        .then(res => res.data);
}
