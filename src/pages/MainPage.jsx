import React from "react";
import Navbar from "../components/Navbar.jsx";


export default function MainPage() {
    return (
        <>
            <Navbar />
            <div className="font-['Noto_Sans_KR'] text-[#5F360A]">
                {/* Hero Section */}
                <section className="w-full bg-white py-[200px]">
                    <div className="max-w-[1200px] mx-auto flex justify-between items-start flex-wrap px-4 gap-12">
                        {/* 텍스트 + 설명 */}
                        <div className="flex flex-col gap-4 max-w-xl">
                            <img
                                src="src/assets/hero-slogan.png"
                                alt="GNU - Learning - Journey"
                                className="w-full max-w-[520px]"
                            />
                            <img
                                src="src/assets/sub-slogan.png"
                                alt="지식의 여정 Run!"
                                className="w-full max-w-[520px]"
                            />
                            <img
                                src="src/assets/sub-description.png"
                                alt="본문 문장"
                                className="w-full max-w-[460px]"
                            />
                        </div>

                        {/* 로고 이미지 */}
                        <div className="flex justify-center items-center flex-1">
                            <img
                                src="src/assets/image-logo.png"
                                alt="로고 이미지"
                                className="w-full max-w-[420px]"
                            />
                        </div>
                    </div>
                </section>

                {/* 소개 섹션 */}
                <section className="bg-[#F9F4ED] bg-[radial-gradient(circle_at_center,_rgba(215,184,154,0.45)_0%,_#f8f1e7_70%)] py-[160px] text-center px-4">
                    <div className="max-w-[900px] mx-auto">
                        <img
                            src="src/assets/text-logo.png"
                            alt="G-Learn-E"
                            className="mx-auto mb-6"
                        />
                        <p className="text-[22px] text-[#6e3f1e] font-semibold mb-5">
                            지런이는 경상국립대학교 학생들을 위한 맞춤형 학습 플랫폼입니다.
                        </p>
                        <p className="text-[15px] text-[#9A7E5F] leading-[1.7] mb-4">
                            고등학생처럼 기성 문제집에 의존할 수 없는 대학생들을 위해,<br />
                            지런이는 당신이 공부한 자료에서 문제를 생성하고, 연습하며 학습을 완성할 수 있도록 돕습니다.<br />
                            같은 목표를 가진 학생들과 문제를 공유하며, 배움을 더 넓고 깊게 확장하세요.
                        </p>
                        <p className="text-[10px] text-[#C2AE97] leading-[1.5]">
                            For college students who can't rely on ready-made workbooks, like high school students,<br />
                            G-Learn-E helps you create problems, practice, and complete learning from the materials you study.<br />
                            Share problems with students who share the same goals, and expand your learning wider and deeper.
                        </p>
                    </div>
                </section>

                {/* 명언 섹션 1 */}
                <section className="bg-white py-[160px] px-4">
                    <div className="max-w-[960px] mx-auto">
                        <blockquote className="text-xl font-semibold text-[#5F360A] leading-relaxed mb-4">
                            배움이 스쳐 지나가지 않도록, <br />
                            한 번 더 생각하고 문제로 풀어보세요.
                        </blockquote>
                        <p className="text-[#9A7E5F] text-sm leading-relaxed">
                            지런이가 당신의 학습 자료를 문제로 변환하고, <br />
                            연습과 이해를 돕는 새로운 학습 경험을 제공합니다.
                        </p>
                    </div>
                </section>

                {/* 명언 섹션 2 */}
                <section className="bg-[#F9F4ED] py-[160px] px-4">
                    <div className="max-w-[960px] mx-auto text-right">
                        <blockquote className="text-xl font-semibold text-[#5F360A] leading-relaxed mb-4 border-r-4 pr-4 border-[#5F360A] inline-block text-left">
                            배움은 혼자만의 길이 아닙니다. <br />
                            같은 목표를 가진 학생들과 문제를 나누고 함께 풀어가며, <br />
                            우리는 더 깊이 이해하고 성장합니다.
                        </blockquote>
                        <p className="text-[#9A7E5F] text-sm leading-relaxed text-left">
                            경상국립대학교 학생들과 생성된 문제를 공유하고, <br />
                            같이 고민하며 배움을 더욱 단단하게 만들어 보세요.
                        </p>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-[#f8f1e7] py-10 text-[#5F360A] text-center text-xs border-t border-[#e7d6c4] px-4">
                    <div className="max-w-[960px] mx-auto">
                        <p>경상국립대학교 컴퓨터공학과 전공종합설계 PBL</p>
                        <p className="mt-1">
                            지도교수 : 김건우 | 팀원 : 최원영 박지원 김수현 강지우
                        </p>
                        <div className="mt-6 text-[20px] font-bold">G-Learn-E</div>
                    </div>
                </footer>
            </div>
        </>
    );
}
