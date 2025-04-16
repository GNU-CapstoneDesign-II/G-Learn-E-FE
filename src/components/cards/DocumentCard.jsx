import React from "react";
import { FileText } from "lucide-react"; // 대체 아이콘용 (optional)
// import Checkbox from "../UseInPages/Checkbox.jsx"; // 필요 시 복원

export default function DocumentCard({ title, isSelected, isSelectMode, onToggleSelect, onClick }) {
    return (
        <div
            className="flex flex-col items-center w-[70px] cursor-pointer group"
            onClick={onClick}
        >
            <div className="w-[70px] h-[90px] p-3 rounded-[12px] bg-white relative flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-200">
                {/* 체크박스 */}
                {isSelectMode && (
                    <div className="absolute top-1 right-1">
                        {/* 추후 커스텀 체크박스 넣을 수 있음 */}
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                                e.stopPropagation();
                                onToggleSelect();
                            }}
                            className="w-4 h-4 text-[#5F360A] accent-[#5F360A]"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                )}

                {/* 문서 아이콘 */}
                <div className="bg-[#f8f1e7] rounded-full w-[42px] h-[42px] flex items-center justify-center">
                    <FileText className="text-[#C7B39C] w-6 h-6" strokeWidth={1.5} />
                </div>
            </div>

            {/* 제목 */}
            <span className="text-[13px] font-semibold text-[#5f360a] text-center mt-1.5 leading-tight">
                {title}
            </span>
        </div>
    );
}
