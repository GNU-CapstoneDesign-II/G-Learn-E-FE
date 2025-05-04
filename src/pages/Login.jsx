// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.module.jsx";
import styles from "../pages/Login.module.css";
import { login as loginApi } from "../api/authApi";
import { setTokens } from "../utils/authToken";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { accessToken, refreshToken } = await loginApi(email, password);
      setTokens({ accessToken, refreshToken });
      await authLogin();
      navigate("/");
    } catch (err) {
      console.error("로그인 실패", err);
      setErrorMsg("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <><Navbar />
      <div className={styles.loginPage}>
        <div className={styles.loginWrapper}>
          <div className={styles.loginContainer}>
            <h1 className={styles.loginTitle}>로그인</h1>
            <p className={styles.loginDescription}>
              로그인 하시면 <strong className={styles.highlight}>지런이</strong>의 서비스를 이용하실 수 있습니다. <br />
              아직 회원이 아니시라면 회원가입을 해주세요.
            </p>

            <form className={styles.loginForm} onSubmit={handleLogin}>
              <label className={styles.loginLabel} htmlFor="email">
                email
              </label>
              <input
                id="email"
                type="email"
                placeholder="학교 이메일"
                className={styles.loginInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label className={styles.loginLabel} htmlFor="password">
                password
              </label>
              <input
                id="password"
                type="password"
                placeholder="비밀번호"
                className={styles.loginInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button type="submit" className={styles.loginButton}>
                로그인
              </button>

              {errorMsg && <p className={styles.loginError}>{errorMsg}</p>}
            </form>

            <div className={styles.loginFooter}>
              <button className={styles.loginLink} onClick={() => navigate("/signup")}>신규 회원가입</button>
              <span>|</span>
              <button className={styles.loginLink} onClick={() => navigate("/find-password")}>비밀번호 찾기</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}