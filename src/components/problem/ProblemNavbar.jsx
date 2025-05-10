// src/components/problem/ProblemNavbar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import gridIcon from '../../assets/grid-mode-icon.png';
import listIcon from '../../assets/list-mode-icon.png';


export default function ProblemNavbar({ onTempSave, onGrade, onReset, isSolved, layoutMode, onLayoutChange }) {
    const navigate = useNavigate();

    return (
        <div className="relative w-full bg-white shadow-sm border-b border-[#e2e2e2] px-6 py-3">
            {/* 왼쪽: 닫기 버튼 */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2">
                <button
                    onClick={() => navigate(-1)}
                    className="text-[#5c4033] text-2xl font-bold focus:outline-none"
                    aria-label="뒤로가기"
                >
                    ✕
                </button>
            </div>

            {/* 가운데: 로고 */}
            <div className="flex justify-center">
                <img
                    src={logo}
                    alt="G-Learn-E Logo"
                    className="h-8 mx-auto cursor-pointer"
                    onClick={() => navigate('/')}
                />
            </div>

            {/* 오른쪽: 버튼들 */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">

                {/* 레이아웃 전환 토글 */}
                <div className="flex border border-[#5c4033] rounded-lg overflow-hidden">
                    <button
                        onClick={() => onLayoutChange('grid')}
                        className={`p-2 ${layoutMode === 'grid' ? 'bg-[#5c4033] text-white' : 'text-[#5c4033] hover:bg-[#f8f1ea]'}`}
                    >
                        <img src={gridIcon} alt="그리드 보기" className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onLayoutChange('list')}
                        className={`p-2 ${layoutMode === 'list' ? 'bg-[#5c4033] text-white' : 'text-[#5c4033] hover:bg-[#f8f1ea]'}`}
                    >
                        <img src={listIcon} alt="리스트 보기" className="w-4 h-4" />
                    </button>
                </div>

                {isSolved && (
                    <button
                        className="px-4 py-1 border border-[#5c4033] rounded-full text-sm text-[#5c4033] hover:bg-[#f8f1ea] focus:outline-none"
                        onClick={onReset}
                    >
                        다시 풀기
                    </button>
                )}

                {!isSolved && (
                    <>
                        <button
                            className="px-4 py-1 border border-[#5c4033] rounded-full text-sm text-[#5c4033] hover:bg-[#f8f1ea] focus:outline-none"
                            onClick={onGrade}
                        >
                            채점하기
                        </button>
                        <button
                            className="px-4 py-1 border border-[#5c4033] rounded-full text-sm text-[#5c4033] hover:bg-[#f8f1ea] focus:outline-none"
                            onClick={onTempSave}
                        >
                            임시 저장
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}