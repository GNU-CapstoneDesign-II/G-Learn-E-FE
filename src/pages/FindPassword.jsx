// src/pages/FindPassword.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import InformationPopup from "../components/common/InformationPopup.jsx";
import {
  issuePasswordResetEmailCode,
  verifyPasswordResetEmailCode,
  resetPassword,
} from "../api/authApi.js";

export default function FindPassword() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);

  // Popup state
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const handleClosePopup = () => {
    setShowPopup(false);
    if (shouldNavigate) {
      navigate("/login");
    }
    setShouldNavigate(false);
  };

  const handleSendCode = async () => {
    try {
      setError("");
      await issuePasswordResetEmailCode(email);
      setEmailSent(true);
      setVerified(false);
      setPopupMessage("인증 메일이 전송되었습니다!");
      setShowPopup(true);
    } catch (err) {
      setError(err.response?.data?.message || "인증 메일 전송에 실패했습니다.");
    }
  };

  const handleVerify = async () => {
    if (!emailSent) {
      setError("❗ 인증이 진행되지 않았습니다.");
      setVerified(false);
      return;
    }
    try {
      setError("");
      const res = await verifyPasswordResetEmailCode(email, authCode);
      const token = res.data.data.emailAuthToken;
      setResetToken(token);
      setVerified(true);
      setPopupMessage("인증이 완료되었습니다!");
      setShowPopup(true);
    } catch (err) {
      setError(err.response?.data?.message || "인증 코드 검증에 실패했습니다.");
      setVerified(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!verified) {
      setError("❗ 인증이 진행되지 않았습니다.");
      return;
    }
    if (password !== passwordCheck) {
      setPasswordMatch(false);
      return;
    }
    setPasswordMatch(true);

    try {
      setError("");
      await resetPassword(name, email, password, passwordCheck, resetToken);
      setPopupMessage("비밀번호가 성공적으로 변경되었습니다!");
      setShouldNavigate(true);
      setShowPopup(true);
    } catch (err) {
      setError(err.response?.data?.message || "비밀번호 변경에 실패했습니다.");
    }
  };

  return (
    <>
      <Navbar />
      {showPopup && (
        <InformationPopup
          message={popupMessage}
          onClose={handleClosePopup}
        />
      )}
      <div className="pt-40 pb-40 min-h-screen bg-[#f8f1e7] text-[#5F360A]">
        <div className="max-w-md mx-auto px-4">
          <h1 className="text-center text-3xl font-semibold border-b-2 border-[#5F360A] pb-1 mb-10">
            비밀번호 찾기
          </h1>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {/* 이름 */}
            <div>
              <label htmlFor="name" className="block text-sm mb-1">이름</label>
              <input
                id="name"
                type="text"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-[#5F360A] px-4 py-2 rounded focus:outline-none"
                required
              />
            </div>

            {/* 이메일 + 전송 */}
            <div>
              <label htmlFor="email" className="block text-sm mb-1">Email</label>
              <div className="flex gap-2">
                <input
                  id="email"
                  type="email"
                  placeholder="학교 이메일"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 border border-[#5F360A] px-4 py-2 rounded focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  className="bg-[#AC957B] text-white px-3 py-2 text-sm rounded hover:bg-[#432707]"
                >
                  인증코드 전송
                </button>
              </div>
            </div>

            {/* 인증코드 입력 */}
            <input
              type="text"
              placeholder="인증코드 입력"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              className="w-full border border-[#5F360A] px-4 py-2 rounded focus:outline-none"
            />
            <button
              type="button"
              onClick={handleVerify}
              className="w-full bg-[#AC957B] text-white py-2 rounded hover:bg-[#432707]"
            >
              인증 하기
            </button>
            {error && <p className="text-sm text-red-500">{error}</p>}

            <hr className="my-4 border-[#ddd]" />

            {/* 비밀번호 재설정 섹션 */}
            {verified && (
              <>
                <div>
                  <label htmlFor="password" className="block text-sm mb-1">Password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-[#5F360A] px-4 py-2 rounded focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm mb-1">Password 확인</label>
                  <input
                    id="confirm-password"
                    type="password"
                    placeholder="비밀번호 확인"
                    value={passwordCheck}
                    onChange={(e) => setPasswordCheck(e.target.value)}
                    className={`w-full border px-4 py-2 rounded focus:outline-none ${
                      !passwordMatch ? "border-red-500" : "border-[#5F360A]"
                    }`}
                    required
                  />
                </div>
                {!passwordMatch && (
                  <p className="text-sm text-red-500">❗ 비밀번호가 일치하지 않습니다.</p>
                )}
                <button
                  type="submit"
                  className="w-full bg-[#AC957B] text-white py-2 rounded hover:bg-[#432707] mt-2"
                >
                  비밀번호 변경
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
