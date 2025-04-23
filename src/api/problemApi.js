import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';
const accessToken = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwidG9rZW5UeXBlIjoiYWNjZXNzIiwiaWF0IjoxNzQ1Mzk3MDIzLCJleHAiOjE3NDU0MDA2MjN9.IX-C9s_JM0MV2KwjBILOk5Uet1-DO-4OrKe2EtOh70ZW40G_EeUiGYqGrdSHL4Le3x58yWHyXO0enRGL1_YBFA';

const getTypeKey = (kor) => {
  const map = {
    '객관식': 'multipleChoice',
    'O/X 퀴즈': 'ox',
    '주관식': 'descriptive',
    '빈칸 채우기': 'fillInTheBlank',
  };
  return map[kor] || kor;
};

export const generateProblems = async ({
  summaryText,       // ✅ 요약 텍스트
  pdfFile,           // ✅ 선택된 PDF 파일
  audioFile,         // ✅ 선택된 음성 파일
  selectedTypes,
  typeOptions,
  selectedDifficulty,
}) => {
  const formData = new FormData();

  // ✅ Content 내부 필드
  formData.append('content.summaryText', summaryText ?? '');

  if (pdfFile) {
    formData.append('content.pdfFile', pdfFile);
  }

  if (audioFile) {
    formData.append('content.audioFile', audioFile);
  }

  // ✅ 난이도
  formData.append('difficulty', selectedDifficulty);

  // ✅ 문제 유형
  selectedTypes.forEach((type) => {
    const key = getTypeKey(type);
    const option = typeOptions[type];
    const count =
      option.questionCount === 'custom'
        ? Number(option.customQuestionCount) || 0
        : Number(option.questionCount);

    formData.append(`questionTypes.${key}.enable`, 'true');
    formData.append(`questionTypes.${key}.numQuestions`, count.toString());

    if (option.optionCount) {
      formData.append(`questionTypes.${key}.numOptions`, Number(option.optionCount).toString());
    }
  });

  const response = await axios.post(`${API_BASE_URL}/api/workbook/generate`, formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};