// src/pages/Ranking.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import logoImageBack from '../assets/image-logo-background.png';

const tabConfig = [
  { label: '유저별',           value: 'user'           },
  { label: '학과 전체 랭킹',    value: 'department'     },
  { label: '학과 내 유저',      value: 'departmentUser' },
  { label: '단과대 전체 랭킹',   value: 'college'        },
  { label: '단과대 내 유저',    value: 'collegeUser'    },
];

function Ranking() {
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

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      setError(null);
      setTotalPages(1);

      // 1) URL 결정
      let url = '/api/ranking/';
      switch (activeTab) {
        case 'user':           url += 'user'; break;
        case 'department':     url += 'department'; break;
        case 'departmentUser': url += `department/${departmentId}`; break;
        case 'college':        url += 'college'; break;
        case 'collegeUser':    url += `college/${collegeId}`; break;
        default:               url += 'user';
      }

      try {
        const res = await axios.get(url, { params: { page: currentPage } });

        // 2) data 추출 (data 필드 없으면 res.data 자체를 사용)
        const raw = res.data?.data ?? res.data;
        // raw가 객체가 아닐 경우에도 안전하게 빈 객체로
        const data = raw && typeof raw === 'object' ? raw : {};

        // 3) 리스트와 페이지 수 분기
        let list = [];
        if (isUserTab) {
          list = Array.isArray(data.rankings) ? data.rankings : [];
        } else if (isDeptTab) {
          list = Array.isArray(data.departments) ? data.departments : [];
        } else if (isCollegeTab) {
          list = Array.isArray(data.colleges) ? data.colleges : [];
        }
        const pages = typeof data.totalPages === 'number' ? data.totalPages : 1;

        setRankings(list);
        setTotalPages(pages);
      } catch (e) {
        console.error(e);
        setError('랭킹을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [activeTab, departmentId, collegeId, currentPage]);

  return (
    <div className="min-h-screen w-screen bg-[rgba(243,233,220,0.5)]">
      <Navbar />

      <div className="relative pt-[65px]">
        <img
          src={logoImageBack}
          alt="Background Logo"
          className="absolute top-1/2 left-1/2 w-[320px] h-auto
                     transform -translate-x-1/2 -translate-y-1/2"
        />

        <div className="relative z-10 px-10 py-20">
          {/* 탭 버튼 */}
          <div className="mb-6 flex flex-wrap gap-4">
            {tabConfig.map(tab => (
              <button
                key={tab.value}
                className={`px-4 py-2 border-b-2 transition-all ${
                  activeTab === tab.value
                    ? 'border-brown font-bold text-brown'
                    : 'border-transparent text-gray-500'
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
                          {isUserTab && u.profileImage != null && (
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

              {/* ↓ 페이지 네비게이션: 화면 하단 중앙 고정 */}
              <div
                className="fixed bottom-8 left-1/2 transform -translate-x-1/2 
                           flex gap-2"
              >
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === i 
                        ? 'bg-brown text-white' 
                        : 'text-gray-600'
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
    </div>
  );
}

export default Ranking;