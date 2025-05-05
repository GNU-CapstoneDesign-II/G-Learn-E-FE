import React, { useState } from "react";
import Navbar from "../components/Navbar.jsx";


export default function FindPassword() {
    const [emailSent, setEmailSent] = useState(false);
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [passwordMatch, setPasswordMatch] = useState(true);

    const handleSendCode = () => {
        setEmailSent(true);
        setVerified(false);
        setError("");
        alert("인증 메일이 전송되었습니다!");
    };

    const handleVerify = () => {
        if (emailSent) {
            setVerified(true);
            setError("");
            alert("인증이 완료되었습니다!");
        } else {
            setVerified(false);
            setError("❗ 인증이 진행되지 않았습니다.");
        }
    };

    const handleSubmit = (e) => {
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
        alert("비밀번호가 성공적으로 변경되었습니다!");
    };

    return (
        <>
            <Navbar />
            <div className="pt-40 pb-40 min-h-screen bg-[#f8f1e7] text-[#5F360A] py-10">
                <div className="max-w-md mx-auto px-4">
                    <div className="text-center">
                        <h1 className="inline-block text-3xl font-semibold border-b-2 border-[#5F360A] pb-1 mb-10">
                            비밀번호 찾기
                        </h1>
                    </div>

                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                        {/* 이름 */}
                        <div>
                            <label htmlFor="name" className="block text-sm mb-1">이름</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="이름"
                                className="w-full border border-[#5F360A] px-4 py-2 rounded focus:outline-none"
                            />
                        </div>

                        {/* 이메일 + 코드 전송 버튼 */}
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
                            className="w-full border border-[#5F360A] px-4 py-2 rounded focus:outline-none"
                        />

                        {/* 인증하기 버튼 */}
                        <button
                            type="button"
                            onClick={handleVerify}
                            className="w-full bg-[#AC957B] text-white py-2 rounded hover:bg-[#432707]"
                        >
                            인증 하기
                        </button>

                        {/* 인증 실패 메시지 */}
                        {error && <p className="text-sm text-red-500">{error}</p>}

                        <hr className="my-4 border-[#ddd]" />

                        {/* 비밀번호 변경 섹션 */}
                        {verified && (
                            <>
                                <div>
                                    <label htmlFor="password" className="block text-sm mb-1">password</label>
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="비밀번호"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full border border-[#5F360A] px-4 py-2 rounded focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="confirm-password" className="block text-sm mb-1">password</label>
                                    <input
                                        id="confirm-password"
                                        type="password"
                                        placeholder="비밀번호 확인"
                                        value={passwordCheck}
                                        onChange={(e) => setPasswordCheck(e.target.value)}
                                        className={`w-full border px-4 py-2 rounded focus:outline-none ${!passwordMatch ? "border-red-500" : "border-[#5F360A]"
                                            }`}
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
