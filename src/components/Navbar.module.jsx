// src/components/Navbar.jsx
import React from "react";
import styles from "./Navbar.module.css";
import logoImage from "/Users/canotlivewithoutyou/G-Learn-E-FE/src/assets/logo.png"; 

function Navbar() {
  return (
    <>
      <header className={styles.navbar}>
        <div className={styles.navbarInner}>
          {/* 왼쪽 영역: 로고 + 메뉴 */}
          <div className={styles.navbarLeft}>
            <img src={logoImage} alt="G-Learn-E Logo" className={styles.logo} />
            <nav className={styles.menu}>
              <a href="#">문제 생성</a>
              <span>|</span>
              <a href="#">문제집 리스트</a>
              <span>|</span>
              <a href="#">랭킹</a>
            </nav>
          </div>

          {/* 오른쪽 영역: 검색창, 알림, 로그인 */}
          <div className={styles.navbarRight}>
            {/* 검색창 */}
            <div className={styles.searchBox}>
              <span className={styles.icon}>🔍</span>
              <input type="text" placeholder="Search for something!" />
            </div>

            {/* 알림 아이콘 */}
            <div className={styles.alarmIcon}>
              🔔
              <span className={styles.alarmDot} />
            </div>

            {/* 로그인 버튼 */}
            <button className={styles.loginButton}>Login / Sign up</button>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
