// src/api/userApi.js
import axiosInstance from "./axiosInstance";
import qs from "qs";

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


/** 오답 키워드 TOP-N */
export async function getWrongKeywords(topN = 10) {
  const { data } = await axiosInstance.get(
    `/api/user/topN-wrong-keywords`,
    { params: { topN } }
  );
  return data.data.keywords; // [{ keyword, count }]
}

/** 오답률 높은 문제집 TOP-N */
export async function getWrongWorkbooks(topN = 10) {
  const { data } = await axiosInstance.get(
    `/api/user/topN-wrong-workbooks`,
    { params: { topN } }
  );
  return data.data.workbooks; // [{ workbookId, name, wrongRate, wrongCount, totalCount }]
}

/**
 * 활동 로그 (GitHub 잔디용)
 * @param {string[]} types  - ex) ["PROBLEM_SOLVED","PROBLEM_WRONG"]
 * @param {number}   days   - 최근 n일 (기본 30)
 * @return [{ date:'2025-05-01', count:3 }, ...]
 */
export async function getActivityLog(types, days = 30) {
  const { data } = await axiosInstance.get("/api/user/activity-log", {
    params: { types, days },                 // { types: ['SOLVED','WRONG'] }
    paramsSerializer: (p) =>
      qs.stringify(p, { arrayFormat: "repeat" }) // types=SOLVED&types=WRONG
  });
  return data.data.activityLog;
}


/**
 * 블랙리스트 조회
 * @param {'BLOCK'|'HIDE'} blacklistType
 * @returns {Promise<AxiosResponse<ApiResponse<BlacklistResponse>>>}
 */
export function getBlacklist(blacklistType = "BLOCK") {
  return axiosInstance.get("/api/user/blacklist", {
    params: { blacklistType },
  });
}

/**
 * 블랙리스트 삭제
 * @param {number} targetId
 * @param {'BLOCK'|'HIDE'} blacklistType
 * @returns {Promise<AxiosResponse<ApiResponse<null>>>}
 */
export function removeBlacklist(targetId, blacklistType = "BLOCK") {
  return axiosInstance.delete("/api/user/blacklist", {
    data: { targetId, blacklistType },
  });
}