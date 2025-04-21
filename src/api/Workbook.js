import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080"; // or 어디든

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
