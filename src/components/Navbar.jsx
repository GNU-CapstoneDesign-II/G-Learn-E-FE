// src/components/Navbar.jsx
import React from "react";
import logoImage from "/Users/canotlivewithoutyou/G-Learn-E-FE/src/assets/logo.png"; 

function Navbar() {
  return (
    <>
      <style>{`
        .menu a {
            color: #B3977B; 
            text-decoration: none;
            font-size: 14px;
        }
        
        .menu a:hover {
            color: #5F360A; 
        }
        
        .menu span {
            color: #d0b9a0;
            padding: 0 4px;
        }

        .navbar {
          width: 100%;
          background-color: #FFFFFF;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 16px 40px;
          border-bottom: 1px solid #eee;
          font-family: 'Noto Sans KR', sans-serif;
        }
        .navbar-inner {
            width: 100%;
            min-width: 1280px;
            margin: 0 auto;
            padding: 16px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .navbar-left {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .navbar-right {
          margin-right: 12px; 
        }

        .logo {
          height: 40px;
          object-fit: contain;
        }
        .menu {
          display: flex;
          gap: 16px;
          font-size: 14px;
          color: #ae8c6d;
        }
        .menu span {
          color: #d0b9a0;
        }
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .search-box {
          background-color: #faf3ec;
          border-radius: 10px;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #ae8c6d;
        }
        .search-box input {
          border: none;
          background: transparent;
          outline: none;
          font-size: 14px;
          color: #774300;
        }
        .alarm-icon {
          position: relative;
          font-size: 18px;
          background-color: #faf3ec;
          padding: 6px 10px;
          border-radius: 10px;
        }
        .alarm-dot {
          position: absolute;
          top: 2px;
          right: 2px;
          background-color: #ff5a5a;
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .login-button {
          background: none;
          border: none;
          font-size: 14px;
          color: #ae8c6d;
          cursor: pointer;
        }
      `}</style>

      <header className="navbar">
        <div className="navbar-inner">
            <div className="navbar-left">
                <img src={logoImage} alt="G-Learn-E Logo" className="logo" />
                <nav className="menu">
                    <a href="#">문제 생성</a>
                    <span>|</span>
                    <a href="#">문제집 리스트</a>
                    <span>|</span>
                    <a href="#">랭킹</a>
                </nav>
            </div>

            <div className="navbar-right">
            <div className="search-box">
                <span className="icon">🔍</span>
                <input type="text" placeholder="Search for something!" />
            </div>
            <div className="alarm-icon">
                🔔
                <span className="alarm-dot" />
            </div>
            <button className="login-button">Login / Sign up</button>
            </div>
        </div>
    </header>
    </>
    );
}

export default Navbar;
