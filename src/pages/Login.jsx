import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";


export default function Login() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="pt-20 min-h-screen bg-[#f8f1e7] text-[#5F360A]">
        <div className="flex justify-center items-center pt-20">
          <div className="w-full max-w-md px-4 text-center">
            {/* 제목 */}
            <h1 className="text-3xl font-semibold border-b-2 border-[#5F360A] inline-block pb-1 mb-4">
              로그인
            </h1>

            {/* 설명 */}
            <p className="text-sm text-[#9A7E5F] leading-relaxed mb-10">
              로그인 하시면 <strong>지런이</strong>의 서비스를 이용 하실 수 있습니다. <br />
              아직 회원이 아니시라면 회원가입을 해주세요.
            </p>

            {/* 로그인 폼 */}
            <form className="flex flex-col gap-4 text-left">
              <div>
                <label htmlFor="email" className="block text-sm mb-1">email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="학교 이메일"
                  className="w-full border border-[#5F360A] px-4 py-2 rounded focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm mb-1">password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="비밀번호"
                  className="w-full border border-[#5F360A] px-4 py-2 rounded focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#AC957B] text-white py-2 mt-2 rounded hover:bg-[#5F360A] transition-colors"
              >
                로그인
              </button>
            </form>

            {/* 로그인 하단 링크 */}
            <div className="mt-8 flex justify-center items-center gap-3 text-sm text-[#9A7E5F]">
              <button onClick={() => navigate("/signup")} className="hover:underline">
                신규 회원가입
              </button>
              <span>|</span>
              <button onClick={() => navigate("/find-password")} className="hover:underline">
                비밀번호 찾기
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
