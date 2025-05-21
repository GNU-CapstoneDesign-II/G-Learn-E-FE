// src/pages/Mypage.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import MyPageSidebar from '../components/mypage/MyPageSidebar.jsx';
import MyPageHome from '../components/mypage/MyPageHome.jsx';
import MyPageInfo from '../components/mypage/MyPageInfo.jsx';
import MyPageStatistics from '../components/mypage/MyPageStatistics.jsx';

const Mypage = () => {
    const [activeTab, setActiveTab] = useState('home');

    return (
        // 전체 페이지: 세로 플렉스 & 화면 가득
        <div className="flex flex-col min-h-screen">
            {/* 상단바 */}
            <Navbar />
            {/* <header className="h-20 shrink-0 sticky top-0 z-20">
                
            </header> */}

            {/* 사이드바 + 메인 */}
            <div className="flex flex-1 mt-[65px]"> {/* mt-20 == 80px(상단바 높이) */}
                <MyPageSidebar activeTab={activeTab} onTabChange={setActiveTab} />

                <main className="flex-1 p-8 bg-[#fefbf7] min-h-[calc(100vh-80px)]">
                    <div className="space-y-12 max-w-6xl mx-auto w-full">
                        {activeTab === 'home' && <MyPageHome />}
                        {activeTab === 'info' && <MyPageInfo />}
                        {activeTab === 'statistics' && <MyPageStatistics />}
                        {activeTab === 'withdraw' && (
                            <div>
                                <p>정말 탈퇴하시겠습니까?</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Mypage;
