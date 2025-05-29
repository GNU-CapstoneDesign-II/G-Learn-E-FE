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
    <aside className="fixed w-[200px] h-[calc(100vh-65px)] sticky top-[65px] border-r border-[#E6CEBA] bg-white text-sm">
      <ul className="list-none m-0 p-0 space-y-2 pr-4 pt-14">
        {menuItems.map(({ label, key }) => {
          const isActive = activeTab === key;
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => onTabChange(key)}
                className={
                  isActive
                    ? `${baseBtn} bg-[#f8f1e7] font-bold text-[#774300] border-[#5f360a] rounded-tr-2xl rounded-br-2xl `
                    : `${baseBtn} font-medium text-[#5f360a] border-transparent hover:bg-[#FBF8F5] hover:text-[#3e2504] hover:border-[#c8a079] rounded-tr-2xl rounded-br-2xl `
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
