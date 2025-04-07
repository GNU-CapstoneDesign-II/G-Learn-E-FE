import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.module.jsx";
import "../pages/FindPassword.css";

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
        // navigate("/login");
    };

    return (
        <div className="find-page">
            <Navbar />

            <div className="find-wrapper">
                <div className="find-container">
                    <h1 className="find-title">비밀번호 찾기</h1>

                    <form className="find-form" onSubmit={handleSubmit}>
                        <label className="find-label" htmlFor="name">이름</label>
                        <input id="name" type="text" placeholder="이름" className="find-input" />

                        <label className="find-label" htmlFor="email">email</label>
                        <div className="email-row">
                            <input id="email" type="email" placeholder="학교 이메일" className="find-input" />
                            <button type="button" className="code-button" onClick={handleSendCode}>
                                인증코드 전송
                            </button>
                        </div>

                        <button type="button" className="verify-button" onClick={handleVerify}>
                            인증 하기
                        </button>

                        {error && (
                            <p className="error-message">{error}</p>
                        )}

                        <hr />

                        {verified && (
                            <>
                                <label className="find-label" htmlFor="password">password</label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="비밀번호"
                                    className="find-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <label className="find-label" htmlFor="confirm-password">password</label>
                                <input
                                    id="confirm-password"
                                    type="password"
                                    placeholder="비밀번호 확인"
                                    className="find-input"
                                    value={passwordCheck}
                                    onChange={(e) => setPasswordCheck(e.target.value)}
                                />

                                {!passwordMatch && (
                                    <p className="error-message">❗ 비밀번호가 일치하지 않습니다.</p>
                                )}

                                <button className="submit-button" type="submit">비밀번호 변경</button>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
