import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';
const accessToken = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwidG9rZW5UeXBlIjoiYWNjZXNzIiwiaWF0IjoxNzQ1OTkxNjc0LCJleHAiOjE3NDU5OTUyNzR9.FGpRKW7Sy_GckzYgGxobmrt0B9MFty_r4C0nbliJN-S0wnLZhAQsjq6JpbRHBMiTmpeqXgUhj33QB2twxAm9Gw';

// 한글 → 백엔드 key 매핑
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
  summaryText,       // 요약 텍스트
  pdfFile,           // 선택된 PDF 파일
  audioFile,         // 선택된 음성 파일
  selectedTypes,     // 사용자가 선택한 문제 유형
  typeOptions,       // 문제 유형별 옵션 (문제 수, 보기 수 등)
  selectedDifficulty // 난이도
}) => {
  const formData = new FormData();

  // ✅ content - summaryText, pdf, audio
  formData.append('content.summaryText', summaryText ?? '');
  if (pdfFile) formData.append('content.pdfFile', pdfFile);
  if (audioFile) formData.append('content.audioFile', audioFile);

  // ✅ 난이도
  formData.append('difficulty', selectedDifficulty);

  // ✅ 모든 문제 유형 포함 (선택 안 해도 false로 보내야 백엔드 바인딩 성공)
  const allTypes = ['객관식', 'O/X 퀴즈', '빈칸 채우기', '주관식'];
  allTypes.forEach((type) => {
    const key = getTypeKey(type);
    const option = typeOptions[type] || {};
    const isSelected = selectedTypes.includes(type);

    // 문제 수
    const count =
      option.questionCount === 'custom'
        ? Number(option.customQuestionCount) || 0
        : Number(option.questionCount) || 0;

    // 필수 필드 전송
    formData.append(`questionTypes.${key}.enable`, isSelected ? 'true' : 'false');
    formData.append(`questionTypes.${key}.numQuestions`, count.toString());

    // 객관식인 경우 보기 수 포함
    if (key === 'multipleChoice') {
      const numOptions = option.optionCount ? Number(option.optionCount) : 0;
      formData.append(`questionTypes.${key}.numOptions`, numOptions.toString());
    }
  });

  // ✅ Axios 요청
  const response = await axios.post(`${API_BASE_URL}/api/workbook/generate`, formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};