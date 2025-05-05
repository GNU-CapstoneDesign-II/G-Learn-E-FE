// src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/logo.png';
import statIcon1 from '../assets/statistic1.png';
import level from '../assets/Level_Icon/level_0to10.png';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { user, loading, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  /** 드롭다운 외부 클릭 시 닫기 */
  useEffect(() => {
    const handleClickOutside = e =>
      dropdownRef.current && !dropdownRef.current.contains(e.target) && setDropdownOpen(false);
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 h-20 bg-white border-b-2 border-[#DACEC0]
                       flex items-center px-6 font-['Noto_Sans_KR'] z-20">
      {/* 좌·우 끝 정렬 래퍼 */}
      <div className="flex items-center justify-between w-full">
        {/* ───────── 왼쪽: 로고 + 메뉴 ───────── */}
        <div className="flex items-center gap-6">
          <Link to="/">
            <img src={logoImage} alt="G‑Learn‑E Logo" className="h-10 object-contain" />
          </Link>

          <nav className="flex gap-4 text-[14px] text-[#B3977B]">
            <Link to="/generate-problem" className="hover:text-[#5F360A]">문제 생성</Link>
            <span className="text-[#d0b9a0]">|</span>
            <Link to="/folder" className="hover:text-[#5F360A]">문제집 리스트</Link>
            <span className="text-[#d0b9a0]">|</span>
            <Link to="/ranking" className="hover:text-[#5F360A]">랭킹</Link>
          </nav>
        </div>

        {/* ───────── 오른쪽: 검색 + 알림 + 드롭다운 / 로그인 ───────── */}
        <div className="flex items-center gap-4">
          {/* 검색창 */}
          <div className="flex items-center gap-1 bg-[#faf3ec] rounded-lg py-2 px-3 text-[14px] text-[#ae8c6d]">
            🔍
            <input
              type="text"
              placeholder="Search for something!"
              className="bg-transparent outline-none w-36 text-[#774300] placeholder:text-[#ae8c6d]"
            />
          </div>

          {/* 알림 아이콘 */}
          <div className="relative text-[18px] bg-[#faf3ec] py-1.5 px-2.5 rounded-lg">
            🔔
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[#ff5a5a]" />
          </div>

          {/* 로그인 or 프로필 드롭다운 */}
          {!loading && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(prev => !prev)}
                className="flex items-center gap-2"
              >
                <img src={level} alt="profile" className="w-[50px] h-auto object-contain" />
                <p className="text-sm text-[#774300]">{user.nickname}님</p>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white border-4 border-[#E8E2DA]
                                rounded-2xl shadow-lg p-6 z-50">
                  {/* 프로필 정보 */}
                  <div className="text-center mb-5">
                    <img src={level} alt="profile" className="w-[50px] h-auto object-contain mx-auto" />
                    <p className="mt-2 font-bold text-[#5F360A]">
                      안녕하세요, {user.nickname}님!
                    </p>
                    <span className="block text-[12px] text-[#A58D7B] mt-1">
                      GNU - IT 공과대학 - 컴퓨터공학부
                    </span>
                  </div>

                  <hr className="h-px bg-[#E8E2DA] mb-4" />

                  <ul className="space-y-2 text-[14px] text-[#774300]">
                    <li>
                      <Link
                        to="/mypage"
                        className="flex items-center gap-2 hover:bg-[#F4EDE6]
                                   rounded-lg p-2"
                      >
                        <img src={statIcon1} alt="통계 아이콘" className="w-5 h-5" />
                        My Learning Journey
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/settings"
                        className="flex items-center gap-2 hover:bg-[#F4EDE6]
                                   rounded-lg p-2"
                      >
                        ⚙️ Settings
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/faq"
                        className="flex items-center gap-2 hover:bg-[#F4EDE6]
                                   rounded-lg p-2"
                      >
                        ❓ FAQ
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={logout}
                        className="flex items-center gap-2 text-[#D44747]
                                   hover:bg-[#F4EDE6] rounded-lg p-2 w-full"
                      >
                        🚪 Log Out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-[14px] text-[#ae8c6d] hover:text-[#5F360A]">
              Login&nbsp;/&nbsp;Sign&nbsp;up
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
