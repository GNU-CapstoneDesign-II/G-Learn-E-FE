import React from "react";
import { Link } from "react-router-dom";
import logoImage from "../assets/logo.png";

function Navbar() {
  return (
    // ✅ 상단 고정을 위한 핵심 속성들:
    // - fixed: 항상 고정
    // - top-0 left-0: 화면 최상단, 좌측에 위치
    // - z-50: 다른 요소보다 위에 보이게
    <header className="fixed top-0 left-0 w-full z-50 border-b border-[#e7d6c4] bg-white">
      {/* ✅ 페이지 최대 너비 제한 + 좌우 padding + 세로 중앙 정렬 */}
      {/* h-[60px]: 상단바 전체 높이 고정 */}
      <div className="max-w-[1280px] mx-auto flex items-center justify-between h-[60px] px-6">
        {/* ⬅️ 왼쪽: 로고 + 메뉴 */}
        <div className="flex items-center gap-8">
          <Link to="/">
            {/* h-10: 로고 높이 제한, object-contain: 비율 유지 */}
            <img src={logoImage} alt="G-Learn-E Logo" className="h-10 object-contain" />
          </Link>

          {/* 메뉴 링크: 자연스러운 여백과 글꼴 설정 */}
          <nav className="flex items-center gap-4 text-[#9A7E5F] text-sm font-medium">
            <Link to="/generate">문제 생성</Link>
            <span>|</span>
            <Link to="/private">문제집 리스트</Link>
            <span>|</span>
            <Link to="/ranking">랭킹</Link>
          </nav>
        </div>

        {/* ➡️ 오른쪽: 검색창 + 알림 + 로그인 */}
        <div className="flex items-center gap-6">
          {/* 🔍 검색창 영역: 연한 배경 + 둥근 테두리 */}
          <div className="flex items-center bg-[#f8f1e7] px-4 py-2 rounded-md text-[#9A7E5F] text-sm w-[260px]">
            <span className="mr-2">🔍</span>
            <input
              type="text"
              placeholder="Search for something!"
              className="bg-transparent outline-none w-full placeholder-[#9A7E5F]"
            />
          </div>

          {/* 🔔 알림 아이콘: 배경과 원형 빨간 점 */}
          <div className="relative bg-[#f8f1e7] rounded-md p-2 text-[#9A7E5F] text-lg">
            🔔
            {/* 빨간 알림 점 (새 알림 표시용) */}
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>

          {/* 로그인 링크 */}
          <Link to="/login" className="text-[#9A7E5F] text-sm hover:underline">
            Login / Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
