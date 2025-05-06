import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import logoImageBack from '../assets/image-logo-background.png';

const Ranking = () => {
  const [activeTab, setActiveTab] = useState('user'); // ✅ 기본은 유저별

  // ✅ 탭별 데이터
  const data = {
    user: [
      { id: 1, nickname: '가람', level: 60, madeProblems: 25, solvedProblems: 60 },
      { id: 2, nickname: '나래', level: 35, madeProblems: 18, solvedProblems: 45 },
    ],
    daily: [
      { id: 1, nickname: '지런이', level: 46, madeProblems: 20, solvedProblems: 50 },
      { id: 2, nickname: '지우', level: 20, madeProblems: 12, solvedProblems: 30 },
    ],
    weekly: [
      { id: 1, nickname: '철수', level: 40, madeProblems: 18, solvedProblems: 48 },
      { id: 2, nickname: '영희', level: 25, madeProblems: 10, solvedProblems: 28 },
    ],
    monthly: [
      { id: 1, nickname: '민수', level: 55, madeProblems: 30, solvedProblems: 70 },
      { id: 2, nickname: '수지', level: 22, madeProblems: 15, solvedProblems: 33 },
    ],
    major: [
      { id: 1, nickname: '컴퓨터공학과', level: 70, madeProblems: 40, solvedProblems: 80 },
      { id: 2, nickname: '전자공학과', level: 50, madeProblems: 22, solvedProblems: 55 },
    ],
  };

  const rankings = data[activeTab]; // ✅ 현재 탭에 맞는 데이터 가져오기

  return (
    <div>
      <Navbar />

      <div className="relative min-h-screen w-screen bg-[rgba(243,233,220,0.5)] pt-24 p-10">
        
        {/* ✅ 배경 로고 */}
        <img
          src={logoImageBack}
          alt="G-Learn-E Background Logo"
          className="absolute top-1/2 left-1/2 w-[320px] h-auto transform -translate-x-1/2 -translate-y-1/2"
        />

        <div className="relative z-10 px-10 py-20">

          {/* ✅ 탭 버튼 */}
          <div className="mb-4 flex gap-4 flex-wrap">
            {[
              { label: '유저별', value: 'user' },
              { label: '일간', value: 'daily' },
              { label: '주간', value: 'weekly' },
              { label: '월간', value: 'monthly' },
              { label: '학과별', value: 'major' },
            ].map((tab) => (
              <button
                key={tab.value}
                className={`px-4 py-2 border-b-2 transition-all ${
                  activeTab === tab.value
                    ? 'border-brown font-bold text-brown'
                    : 'border-transparent text-gray-500'
                }`}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ✅ 테이블 */}
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-center">
              <thead className="bg-white">
                <tr className="border-b border-gray-300">
                  <th className="p-4">등수</th>
                  {/* ✅ 'nickname' 대신 학과명 표시 */}
                  <th className="p-4">
                    {activeTab === 'major' ? '학과명' : '닉네임'}
                  </th>
                  <th className="p-4">레벨</th>
                  <th className="p-4">만든 문제</th>
                  <th className="p-4">푼 문제</th>
                </tr>
              </thead>

              <tbody>
                {rankings.map((user, index) => (
                  <tr
                    key={user.id}
                    className={"border-b border-gray-300 h-16"}
                  >
                    {/* ✅ 등수에 금/은/동 색 적용 */}
                    <td
                      className={`p-4 text-right font-bold ${
                        index === 0
                          ? 'text-yellow-500'
                          : index === 1
                          ? 'text-gray-400'
                          : index === 2
                          ? 'text-orange-500'
                          : ''
                      }`}
                    >
                      {index + 1}
                    </td>

                    {/* 닉네임 또는 학과명: 왼쪽 정렬 */}
                    <td className="p-4 flex items-center justify-start gap-2">
                      {index === 0 && <span className="text-2xl mr-1">👑</span>}
                      <span className="text-2xl ml-1">🪱</span>
                      <span className="font-semibold">{user.nickname}</span>
                    </td>

                    {/* 레벨: 가운데 정렬 */}
                    <td className="p-4 text-center text-[#3ADBFF]">{user.level}</td>

                    {/* 만든 문제: 오른쪽 정렬 */}
                    <td className="p-4 text-right">{user.madeProblems}</td>

                    {/* 푼 문제: 오른쪽 정렬 */}
                    <td className="p-4 text-right">{user.solvedProblems}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Ranking;