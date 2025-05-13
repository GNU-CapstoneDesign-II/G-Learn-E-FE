import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2 } from 'lucide-react';
import logo from '../assets/logo.png';

const EditNavbar = ({ onSaveClick, onDeleteClick }) => {
    const navigate = useNavigate();

    return (
        <header className="fixed top-0 left-0 w-full h-14 bg-[#FDF8F2] border-b border-[#E9E3DA] z-20 flex items-center justify-between px-4">
            {/* 좌측: 뒤로 가기 */}
            <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-[#E9E3DA] transition"
            >
                <X size={20} className="text-[#8B623F]" />
            </button>

            {/* 중앙: 로고 */}
            <img src={logo} alt="G-Learn-E" className="h-8 object-contain" />

            {/* 우측: 선택 삭제 + 저장 */}
            <div className="flex items-center space-x-3">
                <button
                    onClick={onDeleteClick}
                    className="flex items-center px-4 py-1 border border-[#8B623F] text-[#8B623F] rounded-full hover:bg-[#FDF2E9] transition"
                >
                    <Trash2 size={16} className="mr-2" />
                    선택 삭제
                </button>
                <button
                    onClick={onSaveClick}
                    className="px-4 py-1 bg-[#8B623F] text-white rounded-full hover:bg-[#A0795B] transition"
                >
                    저장
                </button>
            </div>
        </header>
    );
};

export default EditNavbar;
