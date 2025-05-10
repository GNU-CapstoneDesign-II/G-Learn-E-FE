import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import logo from '../assets/logo.png';    // ← assets/logo.png

const EditNavbar = ({ onSaveClick }) => {
    const navigate = useNavigate();

    return (
        <header className="fixed top-0 left-0 w-full h-14 bg-[#FDF8F2] border-b border-[#E9E3DA] z-20 flex items-center justify-between px-4">
            {/* 좌측 닫기 */}
            <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-[#E9E3DA] transition"
            >
                <X size={20} className="text-[#8B623F]" />
            </button>

            {/* 중앙 로고 */}
            <img src={logo} alt="G-Learn-E" className="h-8 object-contain" />

            {/* 우측 저장 */}
            <button
                onClick={onSaveClick}
                className="px-4 py-1 bg-[#8B623F] text-white rounded-[8px] hover:bg-[#A0795B] transition"
            >
                저장
            </button>
        </header>
    );
};

export default EditNavbar;
