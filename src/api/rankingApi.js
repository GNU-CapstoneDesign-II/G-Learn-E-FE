// src/api/rankingApi.js
import axiosInstance from './axiosInstance';

// 공통: 페이지 번호와 사이즈
const DEFAULT_PARAMS = (page, size = 10) => ({ params: { page, size } });

export async function getUserRanking(page) {
  const res = await axiosInstance.get('/api/user/ranking/user', DEFAULT_PARAMS(page));
  return res.data.data;
}

export async function getDepartmentRanking(page) {
  const res = await axiosInstance.get('/api/user/ranking/department', DEFAULT_PARAMS(page));
  return res.data.data;
}

export async function getDepartmentUserRanking(departmentId, page) {
  const res = await axiosInstance.get(
    `/api/user/ranking/department/${departmentId}`,
    DEFAULT_PARAMS(page)
  );
  return res.data.data;
}

export async function getCollegeRanking(page) {
  const res = await axiosInstance.get('/api/user/ranking/college', DEFAULT_PARAMS(page));
  return res.data.data;
}

export async function getCollegeUserRanking(collegeId, page) {
  const res = await axiosInstance.get(
    `/api/user/ranking/college/${collegeId}`,
    DEFAULT_PARAMS(page)
  );
  return res.data.data;
}