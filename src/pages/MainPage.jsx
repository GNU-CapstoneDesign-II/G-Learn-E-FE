import React from "react";
import { motion } from "framer-motion";
import logoImage from "../assets/image-logo.png";
import textLogoImage from "../assets/text-logo.png";
import Navbar from "../components/Navbar.jsx";

export default function MainPage() {
  const sectionWrapper = "min-h-[80vh] py-10 w-full flex items-center";

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  const staggerParent = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.35,
      },
    },
  };

  const fadeUpItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const fadeWithDelay = (delay) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.5, ease: "easeOut", delay },
  });

  return (
    <>
      <Navbar />
      <div className="pt-[65px] font-sans text-darkbrown h-screen">
        {/* Hero Section */}
        <section className={`${sectionWrapper} bg-white`}>
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12 px-4 md:px-8">
            
            {/* 텍스트 영역 */}
            <div className="space-y-6">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerParent}
              >
                <motion.h1 className="text-4xl md:text-5xl font-namdhinggo mb-3 flex flex-wrap">
                  <motion.span variants={fadeUpItem} className="text-darkbrown">G</motion.span>
                  <motion.span variants={fadeUpItem} className="text-darkbrown/20">NU –&nbsp;</motion.span>
                  <motion.span variants={fadeUpItem} className="text-darkbrown">Learn</motion.span>
                  <motion.span variants={fadeUpItem} className="text-darkbrown/20">ing – Journ</motion.span>
                  <motion.span variants={fadeUpItem} className="text-darkbrown">E</motion.span>
                  <motion.span variants={fadeUpItem} className="text-darkbrown/20">y</motion.span>
                </motion.h1>

                <motion.h2
                  className="text-2xl md:text-3xl font-namdhinggo text-darkbrown"
                  variants={staggerParent}
                >
                  <motion.span variants={fadeUpItem}>지식의 여정을 향해, </motion.span>
                  <motion.span variants={fadeUpItem}>멈추지 않고 Run!</motion.span>
                </motion.h2>
              </motion.div>

              <p className="text-base md:text-lg leading-[1.7] text-darkbrown/60">
                배움은 끝없는 여정입니다.<br />
                지식은 정리될 때 단단해지고, 반복될 때 익숙해지며, 이해될 때 비로소 나의 것이 됩니다.<br />
                필요한 개념을 찾고, 문제를 풀며 더 깊이 익혀가는 과정, 그 여정을 <span className="text-darkbrown font-medium">지런이</span>가 함께합니다.
              </p>
            </div>

            {/* 이미지 영역 */}
            <div className="w-full max-w-[400px] mx-auto aspect-[148/93]">
              <img
                src={logoImage}
                alt="G-Learn-E 로고"
                className="w-full h-full object-contain"
                loading="eager"
              />
            </div>
          </div>
        </section>

        {/* 소개 섹션 */}
        <section
          className={sectionWrapper}
          style={{
            background:
              "radial-gradient(circle at center, rgba(225,190,160,0.75) 0%, rgba(243,233,220,0.5) 70%)",
          }}
        >
          <div className="max-w-[960px] mx-auto px-4 text-center">
            <motion.img
              {...fadeWithDelay(0.2)}
              src={textLogoImage}
              alt="G-Learn-E"
              className="mx-auto mb-6 w-full max-w-[700px] h-auto"
            />
            <motion.p {...fadeWithDelay(0.3)} className="text-xl md:text-2xl text-darkbrown font-medium mb-4">
              지런이는 경상국립대학교 학생들을 위한 맞춤형 학습 플랫폼입니다.
            </motion.p>
            <motion.p {...fadeWithDelay(0.4)} className="text-base md:text-lg leading-[1.7] text-darkbrown/60 mb-4">
              고등학생처럼 기성 문제집에 의존할 수 없는 대학생들을 위해,<br />
              지런이는 당신이 공부한 자료에서 문제를 생성하고, 연습하며 학습을 완성할 수 있도록 돕습니다.<br />
              같은 목표를 가진 학생들과 문제를 공유하며, 배움을 더 넓고 깊게 확장하세요.
            </motion.p>
            <motion.p {...fadeWithDelay(0.5)} className="text-xs md:text-sm leading-[1.5] text-[#C2AE97]">
              For college students who can't rely on ready-made workbooks, like high school students,<br />
              G-Learn-E helps you create problems, practice, and complete learning from the materials you study.<br />
              Share problems with students who share the same goals, and expand your learning wider and deeper.
            </motion.p>
          </div>
        </section>

        {/* 인용 섹션 1 */}
        <section className={`${sectionWrapper} bg-white px-4 md:px-16`}>
          <div className="w-full max-w-[960px] text-left">
            <div className="border-l-4 border-darkbrown">
              <div className="border-l-2 border-darkbrown/30 pl-4 mb-8">
                <motion.p {...fadeWithDelay(0.2)} className="text-3xl md:text-5xl font-semibold text-darkbrown leading-snug md:leading-[4rem]">
                  배움이 스쳐 지나가지 않도록,<br />
                  한 번 더 생각하고 문제로 풀어보세요.
                </motion.p>
              </div>
            </div>
            <motion.p {...fadeWithDelay(0.3)} className="text-base md:text-lg text-darkbrown/60 leading-normal">
              지런이가 당신의 학습 자료를 문제로 변환하고,<br />
              연습과 이해를 돕는 새로운 학습 경험을 제공합니다.
            </motion.p>
          </div>
        </section>

        {/* 인용 섹션 2 */}
        <section className={`${sectionWrapper} bg-[rgba(243,233,220,0.5)] justify-end px-4 md:px-16`}>
          <div className="w-full max-w-[960px] text-right">
            <div className="border-r-4 border-darkbrown">
              <div className="border-r-2 border-darkbrown/30 pr-4 mb-8">
                <motion.p {...fadeWithDelay(0.2)} className="text-3xl md:text-5xl font-semibold text-darkbrown leading-snug md:leading-[4rem]">
                  배움은 혼자만의 길이 아닙니다.<br />
                  같은 목표를 가진 학생들과 문제를 나누고 함께 풀어가며,<br />
                  우리는 더 깊이 이해하고 성장합니다.
                </motion.p>
              </div>
            </div>
            <motion.p {...fadeWithDelay(0.3)} className="text-base md:text-lg leading-normal text-darkbrown/60">
              경상국립대학교 학생들과 생성된 문제를 공유하고,<br />
              같이 고민하며 배움을 더욱 단단하게 만들어 보세요.
            </motion.p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#B3977B] px-4 md:px-8 py-8 text-white">
          <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <p className="text-xs md:text-sm">경상국립대학교 컴퓨터공학과 전공종합설계 PBL</p>
              <button onClick={scrollToTop} type="button" className="flex items-center space-x-1 text-sm md:text-base hover:underline">
                <span>Back Top ︿</span>
              </button>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs md:text-sm">지도교수 : 김건우 | 팀원 : 최원영 박지원 김수현 강지우</p>
              <p className="text-2xl md:text-3xl font-namdhinggo tracking-wider select-none">G-Learn-E</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
