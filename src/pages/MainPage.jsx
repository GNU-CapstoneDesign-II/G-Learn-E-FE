import React from "react";
import Navbar from "../components/Navbar.module.jsx";
import styles from "../pages/MainPage.module.css";

export default function MainPage() {
    return (
        <>
            <Navbar />
            <div className={styles.mainPage}>
                {/* Hero Section */}
                <section className={`${styles.heroSection} ${styles.sectionWhite}`}>  
                    <div className={styles.container}>
                        <section className={styles.heroSection}>
                            <div className={styles.heroLeft}>
                                <img src="src/assets/hero-slogan.png" alt="GNU - Learning - Journey" />
                                <img src="src/assets/sub-slogan.png" alt="지식의 여정 Run!" />
                                <img src="src/assets/sub-description.png" alt="본문 문장" />
                            </div>
                            <div className={styles.heroRight}>
                                <img src="src/assets/image-logo.png" alt="로고 이미지" />
                            </div>
                        </section>
                    </div>
                </section>

                {/* 소개 섹션 */}
                <section className={`${styles.introSection} ${styles.sectionCream} ${styles.introCircleBg}`}>  
                    <div className={styles.container}>
                        <img src="src/assets/text-logo.png" alt="G-Learn-E" />
                        <p className={styles.introText}>
                            지런이는 경상국립대학교 학생들을 위한 맞춤형 학습 플랫폼입니다.<br />
                        </p>
                        <p className={styles.introSubtext}>
                            고등학생처럼 기성 문제집에 의존할 수 없는 대학생들을 위해,<br />
                            지런이는 당신이 공부한 자료에서 문제를 생성하고, 연습하며 학습을 완성할 수 있도록 돕습니다.<br />
                            같은 목표를 가진 학생들과 문제를 공유하며, 배움을 더 넓고 깊게 확장하세요.
                        </p>
                        <p className={styles.introSubtextBottom}>
                            For college students who can't rely on ready-made workbooks, like high school students,<br />
                            G-Learn-E helps you create problems, practice, and complete learning from the materials you study.<br />
                            Share problems with students who share the same goals, and expand your learning wider and deeper.<br />
                        </p>
                    </div>
                </section>

                {/* 명언 섹션 1 */}
                <section className={`${styles.quoteSection} ${styles.sectionWhite}`}>  
                    <div className={styles.container}>
                        <section className={`${styles.quoteSection} ${styles.light}`}>  
                            <blockquote>
                                배움이 스쳐 지나가지 않도록, <br />
                                한 번 더 생각하고 문제로 풀어보세요.
                            </blockquote>
                            <p className={styles.quoteSubtext}>
                                지런이가 당신의 학습 자료를 문제로 변환하고,<br />
                                연습과 이해를 돕는 새로운 학습 경험을 제공합니다.
                            </p>
                        </section>
                    </div>
                </section>

                {/* 명언 섹션 2 */}
                <section className={`${styles.quoteSection} ${styles.light} ${styles.sectionCream}`}>  
                    <div className={styles.container}>
                        <section className={styles.quoteSection}>
                            <blockquote>
                                배움은 혼자만의 길이 아닙니다.<br />
                                같은 목표를 가진 학생들과 문제를 나누고 함께 풀어가며,<br />
                                우리는 더 깊이 이해하고 성장합니다.
                            </blockquote>
                            <p className={styles.quoteSubtext}>
                                경상국립대학교 학생들과 생성된 문제를 공유하고,<br />
                                같이 고민하며 배움을 더욱 단단하게 만들어 보세요.
                            </p>
                        </section>
                    </div>
                </section>

                {/* Footer */}
                <div className={styles.container}>
                    <footer className={styles.mainFooter}>
                        <p>경상국립대학교 컴퓨터공학과 전공종합설계 PBL</p>
                        <p>지도교수 : 김건우 | 팀원 : 최원영 박지원 김수현 강지우</p>
                        <div className={styles.footerLogo}>G-Learn-E</div>
                    </footer>
                </div>
            </div>
        </>
    );
}
