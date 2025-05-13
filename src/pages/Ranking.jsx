// src/pages/Ranking.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import logoImageBack from '../assets/image-logo-background.png';

const tabConfig = [
  { label: '유저별',           value: 'user'           },
  { label: '학과별',    value: 'department'     },
  { label: '내 학과',      value: 'departmentUser' },
  { label: '단과대별',   value: 'college'        },
  { label: '내 단과대',    value: 'collegeUser'    },
];

export default function Ranking() {
  const [activeTab, setActiveTab]     = useState('user');
  const [rankings, setRankings]       = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages]   = useState(1);

  const { departmentId, collegeId }   = useParams();
  const isUserTab    = ['user','departmentUser','collegeUser'].includes(activeTab);
  const isDeptTab    = activeTab === 'department';
  const isCollegeTab = activeTab === 'college';

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

// 테스트용 샘플 20개 데이터
const sampleUserRankings = [
  { id: 1,  ranking: 1,  profileImage: null, nickname: '유저1',  level: 20, createdWorkbooks: 8,  solvedWorkbooks: 48 },
  { id: 2,  ranking: 2,  profileImage: null, nickname: '유저2',  level: 19, createdWorkbooks: 7,  solvedWorkbooks: 46 },
  { id: 3,  ranking: 3,  profileImage: null, nickname: '유저3',  level: 18, createdWorkbooks: 6,  solvedWorkbooks: 44 },
  { id: 4,  ranking: 4,  profileImage: null, nickname: '유저4',  level: 17, createdWorkbooks: 5,  solvedWorkbooks: 42 },
  { id: 5,  ranking: 5,  profileImage: null, nickname: '유저5',  level: 16, createdWorkbooks: 4,  solvedWorkbooks: 40 },
  { id: 6,  ranking: 6,  profileImage: null, nickname: '유저6',  level: 15, createdWorkbooks: 3,  solvedWorkbooks: 38 },
  { id: 7,  ranking: 7,  profileImage: null, nickname: '유저7',  level: 14, createdWorkbooks: 2,  solvedWorkbooks: 36 },
  { id: 8,  ranking: 8,  profileImage: null, nickname: '유저8',  level: 13, createdWorkbooks: 1,  solvedWorkbooks: 34 },
  { id: 9,  ranking: 9,  profileImage: null, nickname: '유저9',  level: 12, createdWorkbooks: 0,  solvedWorkbooks: 32 },
  { id: 10, ranking: 10, profileImage: null, nickname: '유저10', level: 11, createdWorkbooks: 5,  solvedWorkbooks: 30 },
];


  useEffect(() => {
    // const fetchRankings = async () => {
    //   setLoading(true);
    //   setError(null);
    //   setTotalPages(1);

    //   let url = '/api/ranking/';
    //   switch (activeTab) {
    //     case 'user':           url += 'user'; break;
    //     case 'department':     url += 'department'; break;
    //     case 'departmentUser': url += `department/${departmentId}`; break;
    //     case 'college':        url += 'college'; break;
    //     case 'collegeUser':    url += `college/${collegeId}`; break;
    //     default:               url += 'user';
    //   }

    //   try {
    //     const res = await axios.get(url, { params: { page: currentPage } });
    //     const raw = res.data?.data ?? res.data;
    //     const data = raw && typeof raw === 'object' ? raw : {};

    //     let list = [];
    //     if (isUserTab) {
    //       list = Array.isArray(data.rankings) ? data.rankings : [];
    //     } else if (isDeptTab) {
    //       list = Array.isArray(data.departments) ? data.departments : [];
    //     } else if (isCollegeTab) {
    //       list = Array.isArray(data.colleges) ? data.colleges : [];
    //     }
    //     const pages = typeof data.totalPages === 'number' ? data.totalPages : 1;

    //     setRankings(list);
    //     setTotalPages(pages);
    //   } catch (e) {
    //     console.error(e);
    //     setError('랭킹을 불러오는 중 오류가 발생했습니다.');
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchRankings();
    // 실제 API 대신 샘플 데이터로 세팅
    setRankings(sampleUserRankings);
    setTotalPages(1);
    setLoading(false);
    setError(null);
  }, []);

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

      {/* 실제 컨텐츠 */}
      <div className="relative z-10 p-40 flex-grow overflow-auto">
        {/* 탭 버튼 */}
        <div className="mb-6 flex flex-wrap">
          {tabConfig.map(tab => (
            <button
              key={tab.value}
              className={`px-4 py-2 border-b-2 transition-all hover:bg-lightbrown/20 ${
                activeTab === tab.value
                  ? 'border-brown font-bold text-brown'
                  : 'border-transparent text-gray-500 hover:border-brown'
              }`}
              onClick={() => { setActiveTab(tab.value); setCurrentPage(0); }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 로딩 / 에러 */}
        {loading && <p className="text-center">로딩 중…</p>}
        {error   && <p className="text-center text-red-500">{error}</p>}

        {/* 랭킹 테이블 */}
        {!loading && !error && (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-center">
                <thead className="bg-white">
                  <tr className="border-b border-gray-300">
                    <th className="p-4">등수</th>
                    <th className="p-4">
                      {isDeptTab && '학과명'}
                      {isCollegeTab && '단과대명'}
                      {isUserTab && '닉네임'}
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
                        {isUserTab && u.profileImage && (
                          <img
                            src={`/images/profiles/${u.profileImage}.png`}
                            alt="프로필"
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        <span className="font-semibold">
                          {isDeptTab && u.name}
                          {isCollegeTab && u.name}
                          {isUserTab && u.nickname}
                        </span>
                      </td>
                      <td className="p-4 text-center text-[#3ADBFF]">{u.level}</td>
                      <td className="p-4 text-right">{u.createdWorkbooks}</td>
                      <td className="p-4 text-right">{u.solvedWorkbooks}</td>
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
                  className={`px-3 py-1 border rounded ${
                    currentPage === i 
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

      {/* Footer */}
      <footer className="bg-[#B3977B] px-5 md:px-8 py-8 text-white">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
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
      </footer>
    </div>
  );
}
