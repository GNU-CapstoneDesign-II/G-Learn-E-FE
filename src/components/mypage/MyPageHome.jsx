// src/components/mypage/MyPageHome.jsx
import React from 'react';
import level from '../../assets/Level_Icon/level_0to10.png';


const MyPageHome = () => {
    const userData = {
        id: 0,
        email: 'm11d29v3p@gnu.ac.kr',
        nickname: 'jjalajak',
        profileImage: 0,
        level: 5,
        exp: 0,
        className: '흙지렁이',
        department: 'GNU - IT 공과대학 - 컴퓨터공학부',
        avatarUrl: '/profile.png',
        rank: 10,
        createdCount: 3,
        solvedCount: 2,
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* ───────── 블럭 ① : 프로필 카드 ───────── */}
            <section className="bg-white rounded-3xl px-10 py-12 shadow-lg text-center">
                <div className="inline-block rounded-full bg-[#f5f1eb] p-6 mb-6">
                    {/* 원본 비율 유지 */}
                    <img
                        src={userData.avatarUrl}
                        alt="profile emoji"
                        className="w-24 h-auto object-contain"
                    />
                </div>
                <h2 className="text-3xl font-bold text-[#5F360A] mb-2">
                    {userData.nickname}님, 환영합니다!
                </h2>
                <p className="text-sm text-[#9a8b7c] font-medium mb-6">
                    {userData.department}
                </p>
                <p className="text-sm text-[#5F360A]/70">
                    정보 및 설정을 관리하여 지런이를 이용하실 수 있습니다.
                </p>
            </section>

            {/* ───────── 블럭 ② + ③ : 하단 카드 2개 (수평) ───────── */}
            <div className="flex flex-col md:flex-row gap-8">
                {/* 블럭 ② : 레벨 정보 */}
                <section className="flex-1 bg-white rounded-3xl p-8 flex items-center gap-6 shadow-lg">
                    <img
                        src={level}
                        alt="level icon"
                        className="w-16 h-auto object-contain"
                    />
                    <h3 className="text-xl font-bold text-[#5F360A]">
                        Lv.&nbsp;{userData.level}&nbsp;{userData.className}
                    </h3>
                </section>

                {/* 블럭 ③ : 통계(랭킹·문제집) */}
                <section className="flex-1 bg-white rounded-3xl p-8 flex justify-around items-center shadow-lg text-center">
                    {/* ⓐ 랭킹 */}
                    <div className="px-4">
                        <p className="text-4xl font-bold text-[#5F360A]">{userData.rank}</p>
                        <p className="mt-2 text-sm text-[#5F360A]/70">나의 랭킹</p>
                    </div>
                    {/* 세로 구분선 */}
                    <div className="hidden md:block w-px h-12 bg-[#e0d5c5]" />
                    {/* ⓑ 만든 문제집 수 */}
                    <div className="px-4">
                        <p className="text-4xl font-bold text-[#5F360A]">
                            {userData.createdCount}
                        </p>
                        <p className="mt-2 text-sm text-[#5F360A]/70">만든 문제 수</p>
                    </div>
                    <div className="hidden md:block w-px h-12 bg-[#e0d5c5]" />
                    {/* ⓒ 푼 문제집 수 */}
                    <div className="px-4">
                        <p className="text-4xl font-bold text-[#5F360A]">
                            {userData.solvedCount}
                        </p>
                        <p className="mt-2 text-sm text-[#5F360A]/70">푼 문제 수</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MyPageHome;
