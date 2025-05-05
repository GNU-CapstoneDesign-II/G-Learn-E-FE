import React from "react";

const FolderIcon = () => (
    <svg viewBox="0 0 120 110" xmlns="http://www.w3.org/2000/svg" className="w-[70px] h-[70px]">
        {/* 덮개 포함 외곽 */}
        <path
            d="M10 40 Q10 25, 25 25 H50 Q55 25, 60 35 H110 Q115 35, 115 45 V95 Q115 100, 110 100 H15 Q10 100, 10 95 Z"
            fill="#e5ccb3"
            stroke="#7c5e3c"
            strokeWidth="1.5"
        />
        {/* 본체 내부 박스 */}
        <rect
            x="10"
            y="48"
            width="105"
            height="52"
            rx="4"
            ry="4"
            fill="#c7a681"
            stroke="#7c5e3c"
            strokeWidth="1"
        />
    </svg>
);

export default function FolderCard({ folder, isSelected, isSelectMode, onToggleSelect, onClick }) {
    return (
        <div className="relative flex flex-col items-center cursor-pointer group w-[80px]" onClick={onClick}>
            {/* 체크박스 (선택 모드 시에만 표시) */}
            {isSelectMode && (
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                        e.stopPropagation();
                        onToggleSelect();
                    }}
                    className="absolute top-1 left-1 w-4 h-4 text-[#5F360A] accent-[#5F360A]"
                    onClick={(e) => e.stopPropagation()}
                />
            )}

            <FolderIcon />

            <span className="text-[13px] font-semibold text-[#5F360A] text-center mt-1">
                {folder.name}
            </span>
        </div>
    );
}
