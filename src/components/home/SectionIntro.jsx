import React from 'react';
import LogoImg from '../../assets/G_Learn_E_Logo.png';


function SectionIntro() {
    return (
        <section style={styles.section}>
            <div style={styles.content}>
                <div>
                    <h1 style={{ ...styles.whiteText, ...styles.title }}><span style={styles.brownText}>G</span>NU<span style={styles.brownText}> - Learn</span>ing <span style={styles.brownText}>-</span> Journ<span style={styles.brownText}>E</span>y</h1>
                    <h3 style={{...styles.brownText, ...styles.subtitle}}>지식의 여정을 함께, 멈추지 말고 Run!</h3>
                    <p style={styles.grayText}>배움은 끝없는 여정입니다.</p>
                    <p style={styles.grayText}>지식은 정리될 때 단단해지고, 반복될 때 익숙해지며, 이해될 때 비로소 나의 것이 됩니다.</p>
                    <p style={styles.grayText}>필요한 개념을 찾고, 문제를 풀며 더 깊이 익혀가는 과정, 그 여정을 <span style={styles.brownText}>지런이</span>가 함께합니다.</p>
                </div>
                <div>
                    <img src={LogoImg} alt="G-Learn-E 로고" style={styles.logo} />
                </div>
            </div>
        </section>
    );
}

const styles = {
    section: {
        height: '100vh',
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid #eee',
    },
    content: {
        display: 'flex',
        justifyContent: 'center',
        width: '90%',
        maxWidth: '1600px',
        alignItems: 'center',
        gap: '40px',
    },
    logo: {
        width: '100%',
        maxWidth: '600px',
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
    title: {
        fontSize: '48px',
        fontWeight: 'bold',
        marginBottom: '12px',
    },
    subtitle: {
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '20px',
    }
};

export default SectionIntro;