import React from "react";
import { PlusSquare } from "lucide-react"; //

export default function AddCard({ onClick }) {
    return (
        <div
            onClick={onClick}
            className="flex flex-col items-center w-[70px] cursor-pointer group"
        >
            <div className="w-[70px] h-[90px] p-3 rounded-[12px] border border-dashed border-[#af9a84] bg-white flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                {/* 아이콘 */}
                <div className="text-[#af9a84] text-2xl select-none">
                    {/* prettier icon or fallback to "+" */}
                    <PlusSquare className="w-7 h-7" strokeWidth={1.8} />
                    {/* 또는: <span className="text-3xl">+</span> */}
                </div>
            </div>
            <span className="text-[13px] font-medium text-[#5f360a] text-center mt-1.5 leading-tight">
                추가하기
            </span>
        </div>
    );
}
