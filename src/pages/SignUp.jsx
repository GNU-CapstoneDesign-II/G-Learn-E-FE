import React, { useState } from "react";
import Navbar from "../components/Navbar.jsx";

export default function SignUp() {
  const [emailSent, setEmailSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!college || !department) {
      alert("단과대학과 학과를 모두 선택해주세요.");
      return;
    }
    // 기타 유효성 검사 추가 가능
    alert("회원가입이 완료되었습니다!");
  };

  return (
    <>
      <Navbar />
      <div className="pt-40 pb-40 min-h-screen bg-[#f8f1e7] text-[#5F360A] py-10 px-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-3xl font-bold border-b-2 border-[#5F360A] inline-block pb-1 mb-4">회원가입</h1>
          <p className="text-sm text-[#9A7E5F] leading-relaxed mb-10">
            회원 가입을 하시면 <strong>지런이</strong>의 서비스를 이용 하실 수 있습니다.
            <br />지런이는 여러분의 여정을 항상 응원합니다.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
            {/* 이름 */}
            <div>
              <label className="block text-sm mb-1">이름</label>
              <input type="text" placeholder="이름" className="w-full border border-[#5F360A] px-4 py-2 rounded focus:outline-none" />
            </div>

            {/* 닉네임 */}
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
                  className="bg-[#AC957B] text-white text-sm px-3 py-2 rounded hover:bg-[#5F360A]"
                >
                  중복 확인
                </button>
              </div>
            </div>

            {/* 단과대학 & 학과 */}
            <div>
              <label className="block text-sm mb-1">소속 대학 및 학과</label>
              <div className="flex gap-2">
                {/* 단과대학 */}
                <div className="relative flex-1">
                  <select
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className={`appearance-none w-full border border-[#5F360A] bg-white px-4 py-2 pr-10 rounded focus:outline-none
                    ${college === "" ? "text-gray-400" : "text-[#5F360A]"}`}
                  >
                    <option disabled value="">단과대학</option>
                    <option>공과대학</option>
                    <option>인문대학</option>
                    <option>자연대학</option>
                    <option>IT 공과대학</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#5F360A]">▼</div>
                </div>

                {/* 학과 */}
                <div className="relative flex-1">
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className={`appearance-none w-full border border-[#5F360A] bg-white px-4 py-2 pr-10 rounded focus:outline-none
                    ${department === "" ? "text-gray-400" : "text-[#5F360A]"}`}
                  >
                    <option disabled value="">학과</option>
                    <option>컴퓨터공학과</option>
                    <option>경영학과</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#5F360A]">▼</div>
                </div>
              </div>
            </div>

            {/* 이메일 */}
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
                  className="bg-[#AC957B] text-white text-sm px-3 py-2 rounded hover:bg-[#5F360A]"
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

            {/* 제출 */}
            <button
              type="submit"
              className="w-full bg-[#AC957B] text-white py-2 rounded mt-2 hover:bg-[#5F360A]"
            >
              회원가입
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
