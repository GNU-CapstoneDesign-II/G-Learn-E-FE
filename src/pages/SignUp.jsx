import React from "react";
import Navbar from "../components/Navbar.module.jsx";
import "../pages/SignUp.css";

export default function SignUp() {
  return (
    <div className="signup-page">
      <Navbar />
      <div className="signup-wrapper">
        <div className="signup-container">
          <h1 className="signup-title">회원가입</h1>
          <p className="signup-description">
            회원 가입을 하시면 <strong>지런이</strong>의 서비스를 이용 하실 수 있습니다.<br />
            지런이는 여러분의 여정을 항상 응원합니다.
          </p>

          <form className="signup-form">
            <div className="signup-row">
              <input type="text" placeholder="이름" />
              <input type="text" placeholder="닉네임" />
            </div>
            <div className="signup-row">
              <div className="custom-select-wrapper">
                <select className="custom-select" defaultValue="" required>
                  <option value="" disabled>단과대학</option>
                  <option value="공대">공과대학</option>
                  <option value="인문대학">인문대학</option>
                  <option value="자연대학">자연대학</option>
                  <option value="IT공과대학">IT 공과대학</option>
                </select>
                <span className="custom-arrow">▼</span>
              </div>

              <div className="custom-select-wrapper">
                <select className="custom-select" defaultValue="" required>
                  <option value="" disabled>학과</option>
                  <option value="컴퓨터">컴퓨터공학과</option>
                  <option value="경영">경영학과</option>
                </select>
                <span className="custom-arrow">▼</span>
              </div>
            </div>

            <div className="signup-row email-row">
              <input type="email" placeholder="학교 이메일" />
            </div>

            <input type="text" placeholder="인증코드 입력" />
            <input type="password" placeholder="비밀번호" />
            <input type="password" placeholder="비밀번호 확인" />

            <button className="submit-button">회원가입</button>
          </form>
        </div>
      </div>
    </div>
  );
}
