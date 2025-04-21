import React from 'react';
import { Link } from 'react-router-dom';
import LogoIcon from '../assets/G_Learn_E_Logo.png';
import LogoText from '../assets/G_Learn_E_Logo_ENG.png';

function Header() {
    return (
        <header style={styles.header}>
            <Link to="/" style={styles.logoContainer}>
                <img src={LogoIcon} alt="G-Learn Logo" style={styles.logoImage} />
                <img src={LogoText} alt="G-Learn Text" style={styles.logoImageText} />
            </Link>
            <div>
                <button style={styles.button}>로그인</button>
                <button style={styles.button}>회원가입</button>
            </div>
        </header>
    );
}

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center', // ✅ 수직 정렬
        padding: '12px 20px',
        backgroundColor: '#ffffff',
        borderBottom: '2px solid #C08552',
        boxSizing: 'border-box',
        height: '64px', // ✅ 고정 높이 (예시값)
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        height: '100%', // ✅ 헤더 높이에 맞춤
    },
    logoImage: {
        maxHeight: '100%', // ✅ 이미지가 헤더 안 넘도록 제한
        display: 'block',
        marginRight: '8px',
    },
    logoImageText: {
        maxHeight: '80%', // ✅ 글자 로고는 살짝 작게
        display: 'block',
    },
    button: {
        marginLeft: '10px',
        padding: '8px 14px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        backgroundColor: '#f9f9f9',
        cursor: 'pointer',
    },
};

export default Header;
