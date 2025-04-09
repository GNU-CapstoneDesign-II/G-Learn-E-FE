import React from "react";
import { Link } from "react-router-dom"; 
import styles from "./Navbar.module.css";
import logoImage from "../assets/logo.png";

function Navbar() {
  return (
    <>
      <header className={styles.navbar}>
        <div className={styles.navbarInner}>
          {/* 왼쪽 영역: 로고 + 메뉴 */}
          <div className={styles.navbarLeft}>
            <Link to="/">
              <img src={logoImage} alt="G-Learn-E Logo" className={styles.logo} />
            </Link>
            <nav className={styles.menu}>
              <Link to="/generate">문제 생성</Link>
              <span>|</span>
              <Link to="/list">문제집 리스트</Link>
              <span>|</span>
              <Link to="/ranking">랭킹</Link>
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
            <Link to="/login" className={styles.loginButton}>
              Login / Sign up
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
