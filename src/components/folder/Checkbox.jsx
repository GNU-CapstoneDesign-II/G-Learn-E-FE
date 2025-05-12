import React from "react";

export default function Checkbox({ checked, onChange }) {
    return (
        <label
            className="inline-flex items-center justify-center cursor-pointer w-[20px] h-[20px]"
            onClick={(e) => e.stopPropagation()}
        >
            {/* 실제 input은 visually hidden */}
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="hidden"
            />
            {/* 커스텀 박스 */}
            <span
                className={`w-[20px] h-[20px] text-[14px] rounded-[4px] flex items-center justify-center transition-all duration-200
          ${checked
                        ? "bg-[#5f360a] text-white border-none"
                        : "bg-white text-[#5f360a] border border-[#5f360a]"
                    }
        `}
            >
                {checked ? "✓" : "✓"}
            </span>
        </label>
    );
}
