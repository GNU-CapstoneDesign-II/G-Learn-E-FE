import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import LeftSidebar from '../components/LeftSideBar';
import "../pages/Public.css"

const Public = () => {
    const [filters, setFilters] = useState({
        school: '',
        major: '',
        grade: '',
        subject: '',
    });

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = () => {
        console.log('검색 필터:', filters);
        // API 호출 or workbook.js 연동
    };

    return (
        <div>
            <h1>Public 페이지</h1>
            <select name="school" onChange={handleChange}>
                <option value="">학교 선택</option>
                <option value="고등학교">고등학교</option>
                <option value="대학교">대학교</option>
            </select>
            <select name="major" onChange={handleChange}>
                <option value="">학과 선택</option>
                <option value="문과">문과</option>
                <option value="이과">이과</option>
            </select>
            <select name="grade" onChange={handleChange}>
                <option value="">학년 선택</option>
                <option value="1">1학년</option>
                <option value="2">2학년</option>
            </select>
            <select name="subject" onChange={handleChange}>
                <option value="">과목 선택</option>
                <option value="수학">수학</option>
                <option value="영어">영어</option>
            </select>

            <button onClick={handleSearch}>검색</button>
        </div>
    );
};

export default Public;
