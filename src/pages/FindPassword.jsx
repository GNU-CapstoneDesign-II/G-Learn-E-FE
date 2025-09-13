import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import InformationPopup from "../components/common/InformationPopup.jsx";
import {
  issuePasswordResetEmailCode,
  verifyPasswordResetEmailCode,
  resetPassword,
} from "../api/authApi.js";
// 유틸리티 함수 import
import { validatePassword, validatePasswordRule } from "../utils/passwordValidator.js";

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

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const errorMessage = validatePasswordRule({ password: newPassword });
    setError(errorMessage || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!verified) {
      setError("❗ 인증이 진행되지 않았습니다.");
      return;
    }

    const passwordError = validatePassword({
      password: password,
      passwordConfirm: passwordCheck,
    });

    if (passwordError) {
      setError(`❗ ${passwordError}`);
      return;
    }

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
      <div className="pt-40 pb-40 min-h-screen bg-[#f8f1e7] text-[#5F360A] py-10 px-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-3xl font-bold border-b-2 border-[#5F360A] inline-block pb-1 mb-4">비밀번호 찾기</h1>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm mb-1 text-left">이름</label>
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

            <div>
              <label htmlFor="email" className="block text-sm mb-1 text-left">Email</label>
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
            {/* 이메일/인증 관련 에러는 여기에 표시 */}
            {!verified && error && <p className="text-sm text-red-500">{error}</p>}


            <hr className="my-4 border-[#ddd]" />

            {verified && (
              <>
                <div>
                  <label htmlFor="password" className="block text-sm mb-1 text-left">비밀번호</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full border border-[#5F360A] px-4 py-2 rounded focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm mb-1 text-left">비밀번호 확인</label>
                  <input
                    id="confirm-password"
                    type="password"
                    placeholder="비밀번호 확인"
                    value={passwordCheck}
                    onChange={(e) => setPasswordCheck(e.target.value)}
                    className="w-full border border-[#5F360A] px-4 py-2 rounded focus:outline-none"
                    required
                  />
                </div>

                {/* 비밀번호 관련 에러는 여기에 표시되도록 위치 변경 */}
                {error && <p className="text-sm text-red-500 text-left mt-1">{error}</p>}

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

