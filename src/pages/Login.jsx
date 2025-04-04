// src/pages/Login.jsx
import React from "react";
import Navbar from "/Users/canotlivewithoutyou/G-Learn-E-FE/src/components/Navbar.module.jsx"; 
import "/Users/canotlivewithoutyou/G-Learn-E-FE/src/pages/Login.css";

export default function Login() {
    return (
        
      <div className="login-page">
        <Navbar/>

        <div className="login-wrapper">
            <div className="login-container">
            <h1 className="login-title">로그인</h1>
            <p className="login-description">
                로그인 하시면 <strong>지런이</strong>의 서비스를 이용 하실 수 있습니다. <br />
                아직 회원이 아니시라면 회원가입을 해주세요.
            </p>
  
            <div className="login-form">
            <label className="login-label" htmlFor="email">email</label>
            <input id="email" type="email" placeholder="학교 이메일" className="login-input" />
            
            <label className="login-label" htmlFor="password">password</label>
            <input id="password" type="password" placeholder="비밀번호" className="login-input" />

            <button className="login-button">로그인</button>
            </div>
  
            <div className="login-footer">
                <button className="login-link">신규 회원가입</button>
                <span>|</span>
                <button className="login-link">비밀번호 찾기</button>
            </div>

            </div>
        </div>
      </div>
    );
  }