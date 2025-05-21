// src/api/workbookApi.js
import axios from "./axiosInstance";

// 👉 단과대/교양 목록 가져오기
export const getColleges = () => {
  return axios.get("/api/folder/public/colleges");
};

export const getCollegesWith = (isCollege) => {
  return axios.get(`/api/folder/public/colleges?isCollege=${isCollege}`);
};

// 👉 특정 단과대학의 학과 목록 가져오기 or 교양이라면 교양 과목 목록 가져오기
export const getDepartments = (collegeId) => {
  return axios.get(`/api/folder/public/departments/${collegeId}`);
};

// 👉 특정 학과의 과목 목록 가져오기
export const getSubjects = (departmentId) => {
  return axios.get(`/api/folder/public/subjects/${departmentId}`);
};

// 👉 교양 영역 과목 가져오기 (만약 별도 처리 필요 시)
export const getGeneralSubjects = (category) => {
  return axios.get(`/api/folder/public/subjects/${category}`);
};

export const uploadWorkbook = (
  workbookId,
  collegeId,
  departmentId,
  subjectId
) => {
  return axios.post(
    `/api/workbook/${workbookId}/upload`,
    { collegeId, departmentId, subjectId } // ← 객체 형태로
  );
};

export const getRelativeKeywordWorkbooks = (keyword, page = 0, size = 10) =>
  axios.get("/api/workbook/relative-keyword", {
    params: { keyword, page, size },
  });

/**
 * 워크북 생성 요청
 *
 * @param {string} summaryText
 * @param {File|null} pdfFile
 * @param {File|null} audioFile
 * @param {string[]} selectedTypes
 * @param {object} typeOptions
 * @param {string} difficulty
 * @returns {Promise<number>} 새로 생성된 workbook ID
 */
export async function generateWorkbook({
  summaryText,
  pdfFile = null,
  audioFile = null,
  selectedTypes,
  typeOptions,
  difficulty,
}) {
  const formData = new FormData();

  // content
  formData.append("content.summaryText", summaryText);
  if (pdfFile) formData.append("content.pdfFile", pdfFile);
  if (audioFile) formData.append("content.audioFile", audioFile);

  // difficulty
  formData.append("difficulty", difficulty);

  // questionTypes
  const q = {
    multipleChoice: {
      enable: selectedTypes.includes("객관식"),
      numQuestions:
        typeOptions["객관식"].questionCount === "custom"
          ? Number(typeOptions["객관식"].customQuestionCount) || 0
          : Number(typeOptions["객관식"].questionCount),
      numOptions: typeOptions["객관식"].optionCount,
    },
    ox: {
      enable: selectedTypes.includes("O/X 퀴즈"),
      numQuestions:
        typeOptions["O/X 퀴즈"].questionCount === "custom"
          ? Number(typeOptions["O/X 퀴즈"].customQuestionCount) || 0
          : Number(typeOptions["O/X 퀴즈"].questionCount),
    },
    fillInTheBlank: {
      enable: selectedTypes.includes("빈칸 채우기"),
      numQuestions:
        typeOptions["빈칸 채우기"].questionCount === "custom"
          ? Number(typeOptions["빈칸 채우기"].customQuestionCount) || 0
          : Number(typeOptions["빈칸 채우기"].questionCount),
    },
    descriptive: {
      enable: selectedTypes.includes("주관식"),
      numQuestions:
        typeOptions["주관식"].questionCount === "custom"
          ? Number(typeOptions["주관식"].customQuestionCount) || 0
          : Number(typeOptions["주관식"].questionCount),
    },
  };

  Object.entries(q).forEach(([key, val]) => {
    formData.append(`questionTypes.${key}.enable`, String(val.enable));
    formData.append(
      `questionTypes.${key}.numQuestions`,
      String(val.numQuestions)
    );
    if (key === "multipleChoice") {
      formData.append(
        `questionTypes.${key}.numOptions`,
        String(val.numOptions)
      );
    }
  });

  const { data } = await axios.post("/api/workbook/generate", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  console.log(data);
  return data.data.id;
}


export const getWorkbookProfile = (workbookId) =>
  axios.get(`/api/workbook/${workbookId}`);

export const getWorkbookSolveLog = (workbookId) =>
  axios.get(`/api/solve-log/workbook/${workbookId}`);

/** payload 예시
 * {
 *   name: "자료구조 기말",
 *   professor: "김교수",
 *   examType: "FINAL",        // "MIDDLE" | "FINAL" | "OTHER"
 *   courseYear: 2025,
 *   semester: "FALL"          // "SPRING" | "FALL" | "SUMMER" | …
 * }
 */
export const updateWorkbook = (workbookId, payload) =>
  axios.patch(`/api/workbook/${workbookId}`, payload);

/* ────────────────── 좋아요 / 싫어요 투표 (공개 · 내가 만든 게 아닐 때) ── */
/** voteType: "LIKE" | "DISLIKE" */
export const voteWorkbook = (workbookId, voteType) =>
  axios.post(`/api/workbook/${workbookId}/vote`, { voteType });