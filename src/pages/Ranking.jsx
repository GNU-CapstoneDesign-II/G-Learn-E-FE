// src/pages/Ranking.jsx
import React, { useState, useEffect } from 'react';
import {
  getUserRanking,
  getDepartmentRanking,
  getDepartmentUserRanking,
  getCollegeRanking,
  getCollegeUserRanking,
} from '../api/rankingApi';
import Navbar from '../components/Navbar.jsx';
import logoImageBack from '../assets/image-logo-background.png';
import { useAuth } from '../contexts/AuthContext.jsx';
import LevelIcon from '../components/common/LevelIcon.jsx';

const tabConfig = [
  { label: '유저별',     value: 'user' },
  { label: '학과별',     value: 'department' },
  { label: '내 학과',   value: 'departmentUser' },
  { label: '단과대별',   value: 'college' },
  { label: '내 단과대', value: 'collegeUser' },
];

export default function Ranking() {
  const { user } = useAuth();

  // UI 상태
  const [activeTab, setActiveTab]     = useState('user');
  const [rankings, setRankings]       = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  // 페이징 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages]   = useState(1);
  const [hasNextPage, setHasNextPage]         = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const isUserTab    = ['user','departmentUser','collegeUser'].includes(activeTab);
  const isDeptTab    = activeTab === 'department';
  const isCollegeTab = activeTab === 'college';

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(() => {
    async function fetchData() {
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

        // ▶ 변경된 부분: 항상 data.rankings 사용
        const {
          pageInfo: { totalPages, pageNumber, hasNextPage, hasPreviousPage },
          rankings: list
        } = data;

        setRankings(list);
        setTotalPages(totalPages);
        setHasNextPage(hasNextPage);
        setHasPreviousPage(hasPreviousPage);
        // 완전 동기화가 필요 없으면 이 줄은 없어도 됩니다.
        setCurrentPage(pageNumber);
      } catch (e) {
        console.error(e);
        setError('랭킹을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [activeTab, currentPage, user.department.id, user.college.id]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-[rgba(243,233,220,0.5)]">
      <Navbar />

      {/* 백그라운드 로고 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src={logoImageBack}
          alt="Background Logo"
          className="w-[320px] h-auto"
        />
      </div>

      {/* 컨텐츠 */}
      <div className="relative z-10 pt-[130px] flex-grow overflow-auto">
        <div className="w-full max-w-[1400px] mx-auto px-4">
          {/* 탭 */}
          <div className="flex flex-wrap mb-4">
            {tabConfig.map(tab => (
              <button
                key={tab.value}
                className={`px-4 py-2 border-b-2 transition-all hover:bg-lightbrown/20 ${
                  activeTab === tab.value
                    ? 'border-brown font-bold text-brown'
                    : 'border-transparent text-gray-500 hover:border-brown'
                }`}
                onClick={() => {
                  setActiveTab(tab.value);
                  setCurrentPage(0);
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 에러 */}
          {error && <p className="text-center text-red-500">{error}</p>}

          {/* 테이블 */}
          {!loading && !error && (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-center">
                  <thead className="bg-white">
                    <tr className="border-b border-gray-300">
                      <th className="p-4">등수</th>
                      <th className="p-4">
                        {isDeptTab ? '학과명' : isCollegeTab ? '단과대명' : '닉네임'}
                      </th>
                      <th className="p-4">레벨</th>
                      <th className="p-4">만든 문제</th>
                      <th className="p-4">푼 문제</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.map((u, i) => (
                      <tr key={u.id} className="h-16 border-b border-gray-300">
                        <td className={`p-4 text-right font-bold ${
                          i === 0 ? 'text-yellow-500'
                            : i === 1 ? 'text-gray-400'
                            : i === 2 ? 'text-orange-500'
                            : ''
                        }`}>
                          {u.ranking}
                        </td>
                        <td className="p-4 flex items-center justify-start gap-2">
                          {i === 0 && <span className="text-2xl">👑</span>}
                          {isUserTab && (
                            <LevelIcon level={u.level} size={30} />
                          )}
                          <span className="font-semibold">
                            {isUserTab && u.nickname}
                            {(isDeptTab || isCollegeTab) && u.name}
                          </span>
                        </td>
                        <td className="p-4 text-center text-[#00b3ff] font-bold">{u.level}</td>
                        <td className="p-4 text-right font-bold">{u.createdWorkbooks}</td>
                        <td className="p-4 text-right font-bold">{u.solvedWorkbooks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 페이지 네비게이션 */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                  {/* 이전 버튼: 첫 페이지가 아닐 때만 */}
                  {hasPreviousPage && (
                    <button
                      onClick={() => setCurrentPage(prev => prev - 1)}
                      className="px-3 py-1 text-gray-500"
                    >
                      이전
                    </button>
                  )}

                  {/* 페이지 번호 */}
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      aria-label={`페이지 ${i + 1}`}
                      onClick={() => setCurrentPage(i)}
                      className={` px-3 py-1 ${
                        currentPage === i
                          ? 'text-brown font-bold'                // 선택된 페이지는 갈색
                          : 'text-gray-500 hover:underline' // 나머지는 회색 + hover 시 밑줄
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  {/* 다음 버튼: 마지막 페이지가 아닐 때만 */}
                  {hasNextPage && (
                    <button
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="px-3 py-1 text-gray-500"
                    >
                      다음
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#B3977B] px-4 md:px-8 py-8 text-white">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <p className="text-xs md:text-sm">경상국립대학교 컴퓨터공학과 전공종합설계 PBL</p>
            <button onClick={scrollToTop} type="button" className="flex items-center space-x-1 text-sm md:text-base hover:underline">
              <span>Back Top ︿</span>
            </button>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs md:text-sm">지도교수 : 김건우 | 팀원 : 최원영 박지원 김수현 강지우</p>
            <p className="text-2xl md:text-3xl font-namdhinggo tracking-wider select-none">G-Learn-E</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
