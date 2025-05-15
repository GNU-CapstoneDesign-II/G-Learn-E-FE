// src/components/mypage/MyPageHome.jsx
import React from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { getSolvingStatistics } from '../../api/userApi.js';
import LevelIcon from '../common/LevelIcon.jsx';


const MyPageHome = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [className, setClassName] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        getSolvingStatistics()
            .then(data => setStats(data))
            .catch(err => setError(err.message));
    }, []);

    useEffect(() => {
        if (user.level < 10) setClassName('흙지렁이');
        else if (user.level < 20) setClassName('실버지렁이');
        else if (user.level < 30) setClassName('골드지렁이');
        else if (user.level < 40) setClassName('플래티넘지렁이');
        else if (user.level < 50) setClassName('다이아몬드지렁이');
    }, [user.level]);

    useEffect(() => {
        // 이거 나중에 어떻게 구현할지 의논하기
        if (user.profileImage === 0) setProfileImage('/profile.png');
        else setProfileImage('/profile.png');
    }, [user.profileImage]);


    if (!stats) return null;


    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* ───────── 블럭 ① : 프로필 카드 ───────── */}
            <section className="bg-white rounded-3xl px-10 py-12 shadow-lg text-center">
                <div className="inline-block rounded-full bg-[#f5f1eb] p-6 mb-6">
                    {/* 원본 비율 유지 */}
                    <img
                        src={profileImage}
                        alt="profile emoji"
                        className="w-24 h-auto object-contain"
                    />
                </div>
                <h2 className="text-3xl font-bold text-[#5F360A] mb-2">
                    {user.nickname}님, 환영합니다!
                </h2>
                <p className="text-sm text-[#9a8b7c] font-medium mb-6">
                    GNU - {user.college.collegeName} - {user.department.departmentName}
                </p>
                <p className="text-sm text-[#5F360A]/70">
                    정보 및 설정을 관리하여 지런이를 이용하실 수 있습니다.
                </p>
            </section>

            {/* ───────── 블럭 ② + ③ : 하단 카드 2개 (수평) ───────── */}
            <div className="flex flex-col md:flex-row gap-8">
                {/* 블럭 ② : 레벨 정보 */}
                <section className="flex-1 bg-white rounded-3xl p-8 flex items-center justify-between shadow-lg">
                    {/* 랭킹 */}
                    <div className="px-4 text-center">
                        <p className="text-4xl font-bold text-[#5F360A]">{stats.ranking}</p>
                        <p className="mt-2 text-sm text-[#5F360A]/70">나의 랭킹</p>
                    </div>
                    <div className="hidden md:block w-px h-12 bg-[#e0d5c5]" />
                    {/* 왼쪽: 아이콘 + 레벨 */}
                    <div className="flex items-center gap-6">
                        <LevelIcon level={user.level} size={80} />
                        <h3 className="text-xl font-bold text-[#5F360A]">
                            {/* Lv.&nbsp;{user.level}&nbsp; */}
                            {className}
                        </h3>
                    </div>

                    {/* 오른쪽: 경험치 */}
                    <div className="text-right">
                        <p className="text-sm text-gray-500">현재 경험치</p>
                        <p className="mt-1 text-lg font-semibold text-[#5F360A]">
                            {user.exp} / {user.expLimit}
                        </p>
                    </div>
                </section>

                {/* 블럭 ③ : 통계(랭킹·문제집) */}
                <section className="flex-1 bg-white rounded-3xl p-8 flex justify-around items-center shadow-lg text-center">
                    {/* 만든 문제집 수 */}
                    <div className="px-4">
                        <p className="text-4xl font-bold text-[#5F360A]">
                            {stats.createdWorkbooks}
                        </p>
                        <p className="mt-2 text-sm text-[#5F360A]/70">만든 문제집</p>
                    </div>
                    <div className="hidden md:block w-px h-12 bg-[#e0d5c5]" />
                    {/* 업로드 문제집 수 */}
                    <div className="px-4">
                        <p className="text-4xl font-bold text-[#5F360A]">
                            {stats.uploadedWorkbooks}
                        </p>
                        <p className="mt-2 text-sm text-[#5F360A]/70">업로드 문제집</p>
                    </div>
                    <div className="hidden md:block w-px h-12 bg-[#e0d5c5]" />
                    {/* 푼 문제집 수 */}
                    <div className="px-4">
                        <p className="text-4xl font-bold text-[#5F360A]">
                            {stats.solvedWorkbooks}
                        </p>
                        <p className="mt-2 text-sm text-[#5F360A]/70">푼 문제집</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MyPageHome;
