// src/pages/Ranking.jsx
import React, { useState, useEffect } from 'react';
import {
  getUserRanking,
  getDepartmentRanking,
  getDepartmentUserRanking,
  getCollegeRanking,
  getCollegeUserRanking,
} from '../api/rankingApi';
import goldMedal from "../assets/medal/gold.png";
import silverMedal from '../assets/medal/silver.png';
import bronzeMedal from '../assets/medal/bronze.png';

import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import logoImageBack from '../assets/image-logo-background.png';
import { useAuth } from '../contexts/AuthContext.jsx';
import LevelIcon from '../components/common/LevelIcon.jsx';

const tabConfig = [
  { label: '유저별', value: 'user' },
  { label: '학과별', value: 'department' },
  { label: '내 학과', value: 'departmentUser' },
  { label: '단과대별', value: 'college' },
  { label: '내 단과대', value: 'collegeUser' },
];

export default function Ranking() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('user');
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const isUserTab = ['user', 'departmentUser', 'collegeUser'].includes(activeTab);
  const isDeptTab = activeTab === 'department';
  const isCollegeTab = activeTab === 'college';

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      setError(null);

      try {
        let data;
        switch (activeTab) {
          case 'user':
            data = await getUserRanking(currentPage);
            break;
          case 'department':
            data = await getDepartmentRanking(currentPage);
            break;
          case 'departmentUser':
            data = await getDepartmentUserRanking(user.department.id, currentPage);
            break;
          case 'college':
            data = await getCollegeRanking(currentPage);
            break;
          case 'collegeUser':
            data = await getCollegeUserRanking(user.college.id, currentPage);
            break;
          default:
            data = await getUserRanking(currentPage);
        }

        // service 함수가 { rankings?, departments?, colleges?, totalPages } 형태 리턴
        const list = data.rankings
          ?? data.departments
          ?? data.colleges
          ?? [];
        setRankings(list);
        setTotalPages(data.totalPages ?? 1);

      } catch (e) {
        console.error(e);
        setError('랭킹을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [activeTab, currentPage]);

  return (
    <div className="flex mb-[30px] flex-col min-h-screen w-full bg-[rgba(243,233,220,0.5)]">
      <Navbar />

      {/* 백그라운드 로고 */}
      <div className="absolute inset-0 flex items-center mt-[120px] justify-center pointer-events-none">
        <img
          src={logoImageBack}
          alt="Background Logo"
          className="w-[320px] h-auto"
        />
      </div>

      {/* 실제 컨텐츠 */}
      <div className="relative z-10 pt-[90px] flex-grow overflow-auto">
        <div className="w-full max-w-[1400px] mx-auto px-4">
          {/* 탭 버튼 */}
          <div className="flex flex-wrap">
            {tabConfig.map(tab => (
              <button
                key={tab.value}
                className={`px-4 py-2 border-b-2 transition-all hover:bg-lightbrown/20 ${activeTab === tab.value
                  ? 'border-brown font-bold text-brown'
                  : 'border-transparent text-gray-500 hover:border-brown'
                  }`}
                onClick={() => { setActiveTab(tab.value); setCurrentPage(0); }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 에러 */}
          {error && <p className="text-center text-red-500">{error}</p>}

          {/* 랭킹 테이블 */}
          {!loading && !error && (
            <>
              <div className="overflow-x-auto">
                <table className=" width: 20% min-w-full border-collapse text-center">
                  <thead className="bg-white">
                    <tr className="text-darkbrown border-b-2 border-lightbrown/20">
                      <th className="w-1/5 p-4">등수</th>
                      <th className="w-1/5 p-4">
                        {isDeptTab && '학과명'}
                        {isCollegeTab && '단과대명'}
                        {isUserTab && '닉네임'}
                      </th>
                      <th className="w-1/5 p-4">레벨</th>
                      <th className="w-1/5 p-4">만든 문제</th>
                      <th className="w-1/5 p-4">푼 문제</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.map((u, i) => (
                      <tr key={u.id} className="h-16 border-b border-lightbrown/20">
                        <td className="p-4 text-center font-bold">
                          <div className="relative inline-block">
                            {/* 1. 숫자용 박스: 고정 폭, 가운데 정렬 */}
                            <span className="inline-block text-darkbrown w-6 text-center">{u.ranking}</span>

                            {/* 2. 아이콘: 숫자 박스 왼쪽에 절대 위치 */}
                            {i === 0 && (
                              <img
                                src={goldMedal}
                                alt="Gold Medal"
                                className="absolute right-4 top-1/2 w-5 h-5 transform -translate-y-1/2 -translate-x-full"
                              />
                            )}
                            {i === 1 && (
                              <img
                                src={silverMedal}
                                alt="Silver Medal"
                                className="absolute right-4 top-1/2 w-5 h-5 transform -translate-y-1/2 -translate-x-full"
                              />

                            )}
                            {i === 2 && (
                              <img
                                src={bronzeMedal}
                                alt="Bronze Medal"
                                className="absolute right-4 top-1/2 w-5 h-5 transform -translate-y-1/2 -translate-x-full"
                              />
                            )}
                          </div>
                        </td>

                        <td className="p-4 text-center align-middle text-darkbrown font-semibold">
                          {/*
                          {i === 0 && <span className="text-2xl">👑</span>}
                          {isUserTab && (
                            // 프로필 이미지 없어서 대체로 유저 레벨 아이콘 사용함
                            // <img
                            //   src={`/images/profiles/${u.profileImage}.png`}
                            //   alt="프로필"
                            //   className="w-6 h-6 rounded-full"
                            // />
                            <LevelIcon level={u.level} size={30} />
                          )}*/}
                          <span className="font-semibold">
                            {isDeptTab && u.name}
                            {isCollegeTab && u.name}
                            {isUserTab && u.nickname}
                          </span>
                        </td>
                        {/* <td className="p-4 text-center text-darkbrown font-bold">{u.level}</td> */}
                        <td className="p-4 h-full flex items-center justify-center text-darkbrown font-bold"><LevelIcon level={u.level} size={30} /></td>
                        <td className="p-4 text-center text-darkbrown font-bold">{u.createdWorkbooks}</td>
                        <td className="p-4 text-center text-darkbrown font-bold">{u.solvedWorkbooks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 페이지 네비게이션 */}
              <div className="flex justify-center gap-2 mt-12">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-3 py-1 border rounded ${currentPage === i
                      ? 'bg-brown text-white'
                      : 'text-brown hover:bg-lightbrown/20'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </>
          )}

        </div>
      </div>


      {/*<footer className="bg-[#B3977B] px-4 md:px-8 py-8 text-white">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <p className="text-xs md:text-sm">경상국립대학교 컴퓨터공학과 전공종합설계 PBL</p>
            <button onClick={scrollToTop} type="button" className="flex items-center space-x-1 text-sm md:text-base">
              <span>Back Top ︿</span>
            </button>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs md:text-sm">지도교수 : 김건우 | 팀원 : 최원영 박지원 김수현 강지우</p>
            <p className="text-2xl md:text-3xl font-namdhinggo tracking-wider select-none">G-Learn-E</p>
          </div>
        </div>
                    </footer>*/}
    </div >

  );
}
