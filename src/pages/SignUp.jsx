import React, { useState } from "react";
import Navbar from "../components/Navbar.module.jsx";
import styles from "./SignUp.module.css";

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
      <div className={styles.signupPage}>
        <div className={styles.signupWrapper}>
          <div className={styles.signupContainer}>
            <h1 className={styles.signupTitle}>회원가입</h1>
            <p className={styles.signupDescription}>
              회원 가입을 하시면 <strong>지런이</strong>의 서비스를 이용 하실 수 있습니다.<br />
              지런이는 여러분의 여정을 항상 응원합니다.
            </p>

            <form className={styles.signupForm}>
              <label className={styles.signupLabel} htmlFor="name">이름</label>
              <div className={styles.signupRow}>
                <input type="text" placeholder="이름" />
              </div>

              <label className={styles.signupLabel} htmlFor="nickname">닉네임</label>
              <div className={styles.signupRow}>
                <input id="nickname" type="text" placeholder="닉네임" />
                <button
                  type="button"
                  className={styles.signupButton}
                  onClick={handleCheckNickname}
                >
                  중복 확인
                </button>
              </div>

              <label className={styles.signupLabel} htmlFor="affiliation">소속 대학 및 학과</label>
              <div className={styles.signupRow}>
                <div className={styles.customSelectWrapper}>
                  <select className={styles.customSelect} defaultValue="" required>
                    <option value="" disabled>단과대학</option>
                    <option value="공대">공과대학</option>
                    <option value="인문대학">인문대학</option>
                    <option value="자연대학">자연대학</option>
                    <option value="IT공과대학">IT 공과대학</option>
                  </select>
                  <span className={styles.customArrow}>▼</span>
                </div>

                <div className={styles.customSelectWrapper}>
                  <select className={styles.customSelect} defaultValue="" required>
                    <option value="" disabled>학과</option>
                    <option value="컴퓨터">컴퓨터공학과</option>
                    <option value="경영">경영학과</option>
                  </select>
                  <span className={styles.customArrow}>▼</span>
                </div>
              </div>

              <label className={styles.signupLabel} htmlFor="email">email</label>
              <div className={styles.signupRow}>
                <input id="email" type="email" placeholder="학교 이메일" />
                <button
                  type="button"
                  className={styles.signupButton}
                  onClick={handleSendCode}
                >
                  인증코드<br />전송
                </button>
              </div>

              <div className={styles.signupRow}>
                <input type="text" placeholder="인증코드 입력" />
                <button
                  type="button"
                  className={styles.signupButton}
                  onClick={handleVerify}
                >
                  인증 확인
                </button>
              </div>

              <label className={styles.signupLabel} htmlFor="password">비밀번호</label>
              <input type="password" placeholder="비밀번호" />
              <input type="password" placeholder="비밀번호 확인" />

              <button type="submit" className={styles.submitButton}>
                회원가입
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
