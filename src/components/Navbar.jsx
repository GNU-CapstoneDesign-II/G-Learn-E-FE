import React from "react";
import { Link } from "react-router-dom";
import logoImage from "../assets/logo.png";

function Navbar() {
  return (
    <header className="w-full border-b border-[#e7d6c4] bg-white">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between py-4 px-6">
        {/* 왼쪽 영역: 로고 + 메뉴 */}
        <div className="flex items-center gap-8">
          <Link to="/">
            <img src={logoImage} alt="G-Learn-E Logo" className="h-10 object-contain" />
          </Link>

          <nav className="flex items-center gap-4 text-[#9A7E5F] text-sm font-medium">
            <Link to="/generate">문제 생성</Link>
            <span>|</span>
            <Link to="/private">문제집 리스트</Link>
            <span>|</span>
            <Link to="/ranking">랭킹</Link>
          </nav>
        </div>

        {/* 오른쪽 영역: 검색, 알림, 로그인 */}
        <div className="flex items-center gap-6">
          {/* 검색창 */}
          <div className="flex items-center bg-[#f8f1e7] px-4 py-2 rounded-md text-[#9A7E5F] text-sm w-[260px]">
            <span className="mr-2">🔍</span>
            <input
              type="text"
              placeholder="Search for something!"
              className="bg-transparent outline-none w-full placeholder-[#9A7E5F]"
            />
          </div>

          {/* 알림 아이콘 */}
          <div className="relative bg-[#f8f1e7] rounded-md p-2 text-[#9A7E5F] text-lg">
            🔔
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>

          {/* 로그인 */}
          <Link to="/login" className="text-[#9A7E5F] text-sm hover:underline">
            Login / Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
