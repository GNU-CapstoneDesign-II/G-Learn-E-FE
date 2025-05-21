// src/components/mypage/MyPageSidebar.jsx
import React from 'react';

const MyPageSidebar = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { label: '홈', key: 'home' },
    { label: '내 정보', key: 'info' },
    { label: '통계', key: 'statistics' },
    { label: '회원 탈퇴', key: 'withdraw' },
  ];

  const baseBtn =
    'block w-full text-left py-3 px-6 transition-colors border-l-4';

  return (
    <aside className="w-[180px] h-[calc(100vh-65px)] sticky top-[65px] bg-[#fdf7f0]
                 border-r border-[#e7d7c7] pt-8 box-border">
      <ul className="list-none m-0 p-0 space-y-2">
        {menuItems.map(({ label, key }) => {
          const isActive = activeTab === key;
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => onTabChange(key)}
                className={
                  isActive
                    ? `${baseBtn} bg-[#fff5e9] font-bold text-[#774300] border-[#b3763c]`
                    : `${baseBtn} font-medium text-[#5f360a] border-transparent hover:bg-[#f0e0d0] hover:text-[#3e2504] hover:border-[#c8a079]`
                }
              >
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default MyPageSidebar;
