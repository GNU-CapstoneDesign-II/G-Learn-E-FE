import React from 'react';
import EngLogoImg from '../../assets/G_Learn_E_Logo_ENG.png'
import BrownEclipse from '../../assets/main_brown_eclipse.png'


function SectionMain() {
    return (
        <section style={styles.section}>
            <div style={styles.content}>
                <img src={EngLogoImg} alt="G-Learn-E 로고" style={styles.logo} />
                <h1 style={{ ...styles.brownText, ...styles.titleText }}>지런이는 경상국립대학교 학생들을 위한 맞춤형 학습 플랫폼입니다.</h1>
                <p style={{ ...styles.grayText, ...styles.contentText }}>고등학생처럼 기성 문제집에 의존할 수 없는 대학생들을 위해,</p>
                <p style={{ ...styles.grayText, ...styles.contentText }}>지런이는 당신이 공부한 자료에서 문제를 생성하고, 연습하며 학습을 완성할 수 있도록 돕습니다.</p>
                <p style={{ ...styles.grayText, ...styles.contentText }}>같은 목표를 가진 학생들과 문제를 공유하며, 배움을 더 넓고 깊게 확장하세요.</p>
            </div>
        </section>
    );
}

const styles = {
    section: {
        height: '100vh',
        backgroundColor: '#F9F4EE',
        backgroundImage: `url(${BrownEclipse})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '70%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid #eee',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '1200px',
        textAlign: 'center',
    },
    logo: {
        width: '100%',
        maxWidth: '700px',
        marginRight: '12px',
    },
    engLogo: {
        height: '40px',
    },
    whiteText: {
        color: '#DFD7CE',
    },
    grayText: {
        color: '#AB957F',
    },
    brownText: {
        color: '#5F360A',
    },
    titleText: {
        fontSize: '36px',
        fontWeight: 'bold',
        marginBottom: '16px',
    },
    contentText: {
        fontSize: '20px',
        marginBottom: '4px',
    }
};

export default SectionMain;