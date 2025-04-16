import React, { useState } from "react";
import Navbar from "../components/Navbar.jsx";

export default function SignUp() {
  const [emailSent, setEmailSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [nicknameChecked, setNicknameChecked] = useState(false);

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

  const handleCheckNickname = () => {
    const nickname = document.getElementById("nickname").value;
    if (!nickname) {
      alert("닉네임을 입력해주세요.");
      return;
    }
    setNicknameChecked(true);
    alert(`닉네임 "${nickname}"은 사용 가능합니다!`);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#f8f1e7] font-['Noto_Sans_KR'] text-[#5F360A] py-10 px-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold border-b-2 border-[#5F360A] inline-block pb-1 mb-4">
            회원가입
          </h1>
          <p className="text-sm text-[#9A7E5F] leading-relaxed mb-10">
            회원 가입을 하시면 <strong>지런이</strong>의 서비스를 이용 하실 수 있습니다.
            <br />
            지런이는 여러분의 여정을 항상 응원합니다.
          </p>

          <form className="flex flex-col gap-5 text-left">
            {/* 이름 */}
            <div>
              <label className="block text-sm mb-1">이름</label>
              <input
                type="text"
                placeholder="이름"
                className="w-full border border-[#5F360A] px-4 py-2 rounded focus:outline-none"
              />
            </div>

            {/* 닉네임 + 중복확인 */}
            <div>
              <label htmlFor="nickname" className="block text-sm mb-1">닉네임</label>
              <div className="flex gap-2">
                <input
                  id="nickname"
                  type="text"
                  placeholder="닉네임"
                  className="flex-1 border border-[#5F360A] px-4 py-2 rounded focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCheckNickname}
                  className="bg-[#A57C4A] text-white text-sm px-3 py-2 rounded hover:bg-[#86613b]"
                >
                  중복 확인
                </button>
              </div>
            </div>

            {/* 소속 대학 및 학과 */}
            <div>
              <label className="block text-sm mb-1">소속 대학 및 학과</label>
              <div className="flex gap-2">
                {/* 단과대학 */}
                <div className="relative flex-1">
                  <select
                    className="appearance-none w-full border border-[#5F360A] bg-[#f8f1e7] text-[#5F360A] px-4 py-2 pr-10 rounded focus:outline-none"
                    defaultValue=""
                  >
                    <option disabled value="">단과대학</option>
                    <option>공과대학</option>
                    <option>인문대학</option>
                    <option>자연대학</option>
                    <option>IT 공과대학</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#5F360A]">
                    ▼
                  </div>
                </div>

                {/* 학과 */}
                <div className="relative flex-1">
                  <select
                    className="appearance-none w-full border border-[#5F360A] bg-[#f8f1e7] text-[#5F360A] px-4 py-2 pr-10 rounded focus:outline-none"
                    defaultValue=""
                  >
                    <option disabled value="">학과</option>
                    <option>컴퓨터공학과</option>
                    <option>경영학과</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#5F360A]">
                    ▼
                  </div>
                </div>
              </div>
            </div>


            {/* 이메일 인증 */}
            <div>
              <label htmlFor="email" className="block text-sm mb-1">email</label>
              <div className="flex gap-2">
                <input
                  id="email"
                  type="email"
                  placeholder="학교 이메일"
                  className="flex-1 border border-[#5F360A] px-4 py-2 rounded focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  className="bg-[#A57C4A] text-white text-sm px-3 py-2 rounded hover:bg-[#86613b]"
                >
                  인증코드 전송
                </button>
              </div>
              <input
                id="verify-code"
                type="text"
                placeholder="인증코드 입력"
                className="mt-3 w-full border border-[#5F360A] px-4 py-2 rounded focus:outline-none"
              />
            </div>

            {/* 비밀번호 */}
            <div>
              <label htmlFor="password" className="block text-sm mb-1">비밀번호</label>
              <input
                type="password"
                placeholder="비밀번호"
                className="w-full border border-[#5F360A] px-4 py-2 rounded focus:outline-none"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="비밀번호 확인"
                className="w-full border border-[#5F360A] px-4 py-2 rounded focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#A57C4A] text-white py-2 rounded mt-2 hover:bg-[#86613b]"
            >
              회원가입
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
