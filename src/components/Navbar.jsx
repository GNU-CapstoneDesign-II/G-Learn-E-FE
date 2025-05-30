// src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import logoImage from "../assets/logo.png";
import statIcon1 from "../assets/statistic.png";
import FAQ from "../assets/QnA.png"
import setting from "../assets/setting.png"
import logoutIcon from "../assets/logout.png"
import alarm from "../assets/alarm.png"
import search from "../assets/search.png"
import { useAuth } from "../contexts/AuthContext";
import LevelIcon from "./common/LevelIcon";
import { useNavigate } from "react-router-dom";


function Navbar({ initialSearch = "" }) {
  const { user, loading, logout } = useAuth();

  const [searchInput, setSearchInput] = useState(initialSearch);
  const navigate = useNavigate();
  /* ───── 프로필 드롭다운 상태 ───── */
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  /* 드롭다운 외부 클릭 시 자동 닫기 */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-[#e7d6c4]">
      {/* 상단바 컨테이너 */}
      <div className="w-full flex justify-between items-center h-[65px] px-[25px]">
        {/* ───────── 왼쪽 영역: 로고 + 메뉴 ───────── */}
        <div className="flex items-center gap-6">
          <Link to="/">
            <img src={logoImage} alt="G-Learn-E Logo" className="h-10 object-contain" />
          </Link>

          <nav className="flex items-center gap-4 font-medium" style={{ fontSize: "13.5px", color: "#9A7E5F" }}>
            <Link to="/generate-problem" className="hover:text-[#5F360A]">문제 생성</Link>
            <span>|</span>
            <Link to="/folder" className="hover:text-[#5F360A]">문제집 리스트</Link>
            <span>|</span>
            <Link to="/ranking" className="hover:text-[#5F360A]">랭킹</Link>
          </nav>
        </div>

        {/* ───────── 오른쪽 영역: 검색창 + 알림 + 로그인/프로필 ───────── */}
        <div className="flex items-center gap-6">
          {/* 🔍 검색창 */}
          <div className="flex items-center bg-[#f8f1e7] px-4 py-2 rounded-md text-[#9A7E5F] text-sm w-[260px]">
            <span className="mr-2"><img src={search} alt="검색 아이콘" className="w-5 h-5 object-contain" /></span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchInput.trim()) {
                  navigate(`/search?keyword=${encodeURIComponent(searchInput.trim())}`);
                }
              }}
              placeholder="Search for something!"
              className="bg-transparent outline-none w-full placeholder-[#9A7E5F]"
            />

          </div>

          {/*
          
          <div className="relative bg-[#f8f1e7] rounded-md p-2 text-[#9A7E5F] text-lg">
            <img src={alarm} alt="알람 아이콘" className="w-5 h-5 object-contain" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
          </div>
          /*}

          {/* 로그인 상태별 분기 */}
          {!loading && user ? (
            /* ───── 로그인됨: 프로필 드롭다운 ───── */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2"
              >
                <LevelIcon level={user.level} size={45} />
                <span className="text-sm text-[#5F360A]">{user.nickname}님</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white border-4 border-[#e7d6c4] rounded-2xl shadow-lg p-6 z-50">
                  {/* 프로필 헤더 */}
                  <div className="text-center mb-5">
                    <LevelIcon level={user.level} size={60} />
                    <p className="mt-2 font-bold text-[#5F360A]">안녕하세요, {user.nickname}님!</p>
                    {/* 학교·학부 정보는 추후 DB 연동 시 교체 */}
                    <span className="block text-xs text-[#9A7E5F] mt-1">
                      GNU - {user.college.collegeName} - {user.department.departmentName}
                    </span>
                  </div>

                  <hr className="h-px bg-[#e7d6c4] mb-4" />

                  {/* 드롭다운 메뉴 */}
                  <ul className="space-y-2 text-sm text-[#5F360A]">
                    <li>
                      <Link
                        to="/mypage"
                        className="flex items-center gap-2 hover:bg-[#f8f1e7] rounded-lg p-2"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <img src={statIcon1} alt="통계 아이콘" className="w-5 h-5" />
                        My Learning Journey
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/settings"
                        className="flex items-center gap-2 hover:bg-[#f8f1e7] rounded-lg p-2"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <img src={setting} alt="설정 아이콘" className="w-5 h-5" />
                        Settings
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/faq"
                        className="flex items-center gap-2 hover:bg-[#f8f1e7] rounded-lg p-2"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <img src={FAQ} alt="FAQ 아이콘" className="w-5 h-5" />
                        FAQ
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={logout}
                        className="flex items-center gap-2 hover:bg-[#f8f1e7] rounded-lg p-2 w-full"
                      >
                        <img src={logoutIcon} alt="로그아웃 아이콘" className="w-5 h-5" />
                        Log Out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            /* ───── 비로그인: 로그인/가입 링크 ───── */
            <Link to="/login" className="text-[#9A7E5F] text-sm hover:underline whitespace-nowrap">
              Login&nbsp;/&nbsp;Sign&nbsp;up
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
