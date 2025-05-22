import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import ConfirmPopup from "../common/ConfirmPopup.jsx";
import InformationPopup from "../common/InformationPopup.jsx";
// import { withdrawUser } from "../../api/userApi.js"; // 나중에 연결

export default function MyPageWithdraw() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [reasons, setReasons] = useState({
        contentLack: false,
        poorExplanation: false,
        lowQuality: false,
        other: false,
    });
    const [otherText, setOtherText] = useState("");
    const [password, setPassword] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [info, setInfo] = useState({ open: false, msg: "" });

    const handleReasonChange = (e) => {
        const { name, checked } = e.target;
        setReasons((prev) => ({ ...prev, [name]: checked }));
    };

    const handleConfirm = () => {
        setShowConfirm(true);
    };

    const handleWithdraw = async () => {
        setShowConfirm(false);
        try {
            // const selected = Object.entries(reasons)
            //   .filter(([, v]) => v)
            //   .map(([key]) =>
            //     key === "other"
            //       ? otherText.trim()
            //       : key === "contentLack"
            //       ? "원하는 콘텐츠가 부족해요."
            //       : key === "poorExplanation"
            //       ? "해설이 별로예요."
            //       : "문제의 퀄리티가 떨어져요."
            //   );
            // await withdrawUser({ password, reasons: selected });
            setInfo({ open: true, msg: "탈퇴가 완료되었습니다." });
            logout();
            navigate("/", { replace: true });
        } catch (err) {
            setInfo({
                open: true,
                msg: err.response?.data?.message || "탈퇴 중 오류가 발생했습니다.",
            });
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
            {showConfirm && (
                <ConfirmPopup
                    message="정말 탈퇴하시겠습니까?"
                    onCancel={() => setShowConfirm(false)}
                    onConfirm={handleWithdraw}
                />
            )}
            {info.open && (
                <InformationPopup
                    message={info.msg}
                    onClose={() => setInfo({ open: false, msg: "" })}
                />
            )}

            <h2 className="text-3xl font-bold text-[#5F360A] mb-4">
                회원 탈퇴 안내
            </h2>
            <p className="text-[#5F360A]/80 mb-8">
                그동안 G-Learn-E를 이용해주셔서 감사합니다.
            </p>

            {/* 복귀 불가 안내 */}
            <section className="mb-8">
                <p className="font-semibold text-[#5F360A] mb-2">
                    탈퇴하시면 다음 정보는 복귀되지 않습니다.
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 text-[#5F360A]/80">
                    <li>문제 풀이 기록 및 통계</li>
                    <li>생성한 문제 및 문제집</li>
                    <li>랭킹 및 모드 정보 등</li>
                </ul>
            </section>

            {/* 탈퇴 사유 */}
            <section className="mb-8">
                <p className="font-semibold text-[#5F360A] mb-2">
                    탈퇴하시는 이유를 알려주시면, 서비스 개선에 큰 도움이 됩니다.
                </p>
                <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="contentLack"
                            checked={reasons.contentLack}
                            onChange={handleReasonChange}
                        />
                        원하는 콘텐츠가 부족해요.
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="poorExplanation"
                            checked={reasons.poorExplanation}
                            onChange={handleReasonChange}
                        />
                        해설이 별로예요.
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="lowQuality"
                            checked={reasons.lowQuality}
                            onChange={handleReasonChange}
                        />
                        문제의 퀄리티가 떨어져요.
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="other"
                            checked={reasons.other}
                            onChange={handleReasonChange}
                        />
                        기타
                    </label>
                    {reasons.other && (
                        <input
                            type="text"
                            placeholder="입력..."
                            value={otherText}
                            onChange={(e) => setOtherText(e.target.value)}
                            className="border-2 border-[#b9a997] rounded-xl px-4 py-2 w-64"
                        />
                    )}
                </div>
            </section>

            {/* 비밀번호 확인 */}
            <section className="mb-8">
                <p className="font-semibold text-[#5F360A] mb-2">
                    탈퇴 처리를 위해 비밀번호를 다시 입력해 주세요.
                </p>
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-2 border-[#b9a997] rounded-xl w-full h-12 px-4 focus:outline-none"
                />
            </section>

            <button
                onClick={handleConfirm}
                disabled={!password}
                className="w-full bg-[#b9a997] text-white rounded-xl py-3 disabled:opacity-50"
            >
                탈퇴하기
            </button>
        </div>
    );
}
