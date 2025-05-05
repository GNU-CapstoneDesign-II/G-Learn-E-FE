import axios from "./axiosInstance";

// 👉 단과대 목록 가져오기
export const getColleges = () => {
  return axios.get("/api/folder/public/colleges");
};

// 👉 특정 단과대학의 학과 목록 가져오기
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
  difficulty
}) {
  const formData = new FormData();

  // content
  formData.append('content.summaryText', summaryText);
  if (pdfFile)   formData.append('content.pdfFile', pdfFile);
  if (audioFile) formData.append('content.audioFile', audioFile);

  // difficulty
  formData.append('difficulty', difficulty);

  // questionTypes
  const q = {
    multipleChoice: {
      enable: selectedTypes.includes('객관식'),
      numQuestions:
        typeOptions['객관식'].questionCount === 'custom'
          ? Number(typeOptions['객관식'].customQuestionCount) || 0
          : Number(typeOptions['객관식'].questionCount),
      numOptions: typeOptions['객관식'].optionCount
    },
    ox: {
      enable: selectedTypes.includes('O/X 퀴즈'),
      numQuestions:
        typeOptions['O/X 퀴즈'].questionCount === 'custom'
          ? Number(typeOptions['O/X 퀴즈'].customQuestionCount) || 0
          : Number(typeOptions['O/X 퀴즈'].questionCount)
    },
    fillInTheBlank: {
      enable: selectedTypes.includes('빈칸 채우기'),
      numQuestions:
        typeOptions['빈칸 채우기'].questionCount === 'custom'
          ? Number(typeOptions['빈칸 채우기'].customQuestionCount) || 0
          : Number(typeOptions['빈칸 채우기'].questionCount)
    },
    descriptive: {
      enable: selectedTypes.includes('주관식'),
      numQuestions:
        typeOptions['주관식'].questionCount === 'custom'
          ? Number(typeOptions['주관식'].customQuestionCount) || 0
          : Number(typeOptions['주관식'].questionCount)
    }
  };

  Object.entries(q).forEach(([key, val]) => {
    formData.append(`questionTypes.${key}.enable`, String(val.enable));
    formData.append(`questionTypes.${key}.numQuestions`, String(val.numQuestions));
    if (key === 'multipleChoice') {
      formData.append(`questionTypes.${key}.numOptions`, String(val.numOptions));
    }
  });

  const { data } = await axios.post(
    '/api/workbook/generate',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  console.log(data);
  return data.data.id;
}