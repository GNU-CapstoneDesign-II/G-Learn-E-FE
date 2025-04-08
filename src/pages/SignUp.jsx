import React, { useState } from "react";
import Navbar from "../components/Navbar.module.jsx";
import "../pages/SignUp.css";

export default function SignUp() {
  const [emailSent, setEmailSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [nicknameChecked, setNicknameChecked] = useState(false); // ✅ 닉네임 확인 여부

  // 이메일 인증코드 전송
  const handleSendCode = () => {
    const email = document.getElementById("email").value;
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    setEmailSent(true);
    setVerified(false);
    setError("");
    alert("인증 메일이 전송되었습니다!");
  };

  // 인증코드 입력 확인 (프론트 임시 처리)
  const handleVerify = () => {
    const code = document.getElementById("verify-code").value;
    if (!emailSent) {
      setVerified(false);
      setError("❗ 인증이 진행되지 않았습니다.");
      return;
    }

    if (!code) {
      alert("인증 코드를 입력해주세요.");
      return;
    }

    setVerified(true);
    setError("");
    alert("인증이 완료되었습니다!");
  };

  // 닉네임 중복 확인
  const handleCheckNickname = () => {
    const nickname = document.getElementById("nickname").value;

    if (!nickname) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    // 실제 중복 체크는 API로 할 예정, 지금은 임시 통과 처리
    setNicknameChecked(true);
    alert(`닉네임 "${nickname}"은 사용 가능합니다!`);
  };


  return (
    <>
      <Navbar />
      <div className="signup-page">
        <div className="signup-wrapper">
          <div className="signup-container">
            <h1 className="signup-title">회원가입</h1>
            <p className="signup-description">
              회원 가입을 하시면 <strong>지런이</strong>의 서비스를 이용 하실 수 있습니다.<br />
              지런이는 여러분의 여정을 항상 응원합니다.
            </p>

            <form className="signup-form">
              <label className="signup-label" htmlFor="이름">이름</label>
              <div className="signup-row">
                <input type="text" placeholder="이름" />
              </div>
              <label className="signup-label" htmlFor="nickname">닉네임</label>
              <div className="signup-row">
                <input id="nickname" type="text" placeholder="닉네임" className="signup-form input" />
                <button type="button" className="signup-button" onClick={handleCheckNickname}>
                  중복 확인
                </button>
              </div>
              <label className="signup-label" htmlFor="소속">소속 대학 및 학과</label>
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

              <label className="signup-label" htmlFor="email">email</label>
              <div className="signup-row email-row">
                <input id="email" type="email" placeholder="학교 이메일" className="signup-form input" />
                <button type="button" className="signup-button" onClick={handleSendCode}>
                  인증코드 전송
                </button>
              </div>
              <input type="text" placeholder="인증코드 입력" />
              <label className="signup-label" htmlFor="비밀번호">비밀번호</label>
              <input type="password" placeholder="비밀번호" />
              <input type="password" placeholder="비밀번호 확인" />

              <button className="submit-button">회원가입</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
