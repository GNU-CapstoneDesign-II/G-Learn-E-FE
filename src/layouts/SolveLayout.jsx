import React from 'react';

function SolveLayout({ children }) {
  return (
    <div>
      {/* 문제 풀이 전용 헤더 (또는 없음) */}
      <header>
        문제 풀이 모드
      </header>
      <main>{children}</main>
      {/* 푸터 없거나 다르게 */}
    </div>
  );
}

export default SolveLayout;
