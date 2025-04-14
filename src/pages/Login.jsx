// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.module.jsx";
import "../pages/Login.css";
import { login } from "../api/authApi";
import { setTokens } from "../utils/authToken";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    try {
      const { accessToken, refreshToken } = await login(email, password);
      setTokens({ accessToken, refreshToken });
      navigate("/");
    } catch (err) {
      console.error("로그인 실패", err);
      setErrorMsg("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-page">
        <div className="login-wrapper">
          <div className="login-container">
            <h1 className="login-title">로그인</h1>
            <p className="login-description">
              로그인 하시면 <strong>지런이</strong>의 서비스를 이용하실 수 있습니다. <br />
              아직 회원이 아니시라면 회원가입을 해주세요.
            </p>

            <div className="login-form">
              <label className="login-label" htmlFor="email">email</label>
              <input
                id="email"
                type="email"
                placeholder="학교 이메일"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label className="login-label" htmlFor="password">password</label>
              <input
                id="password"
                type="password"
                placeholder="비밀번호"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button className="login-button" onClick={handleLogin}>로그인</button>

              {errorMsg && <p className="login-error">{errorMsg}</p>}
            </div>

            <div className="login-footer">
              <button className="login-link" onClick={() => navigate("/signup")}>신규 회원가입</button>
              <span>|</span>
              <button className="login-link" onClick={() => navigate("/find-password")}>비밀번호 찾기</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
