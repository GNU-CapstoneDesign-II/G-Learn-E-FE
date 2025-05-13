// src/components/common/InputPopup.jsx
import React, { useState, useEffect, useRef } from "react";

export default function InputPopup({
  title,           // e.g. "새 폴더 이름"
  defaultValue = "", 
  placeholder = "",
  onConfirm,       // (value: string) => void
  onCancel,        // () => void
}) {
  const [value, setValue] = useState(defaultValue);
  const ref = useRef(null);

  // 오픈 시 자동 포커스
  useEffect(() => {
    ref.current?.focus();
  }, []);

  // ESC 키로 닫기
  useEffect(() => {
    const onKey = e => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div
        className="bg-[#fefbf9] border border-[#e9e1d8] rounded-[2rem] shadow-xl px-10 py-8 w-[400px] text-center"
        onClick={e => e.stopPropagation()}
      >
        <p className="text-[#5c4033] text-base font-semibold mb-4">
          {title}
        </p>

        <input
          ref={ref}
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={e => setValue(e.target.value)}
          className="w-full mb-6 px-4 py-2 border border-[#d4c3b3] rounded text-sm focus:outline-none"
        />

        <div className="flex justify-center gap-6">
          <button
            onClick={onCancel}
            className="px-6 py-1.5 text-sm border border-[#5c4033] text-[#5c4033] rounded-full hover:bg-[#f3e8df]"
          >
            취소
          </button>
          <button
            onClick={() => onConfirm(value.trim())}
            className="px-6 py-1.5 text-sm border border-[#5c4033] text-white rounded-full bg-[#5c4033] hover:bg-[#d6b498] hover:border-[#d6b498]"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
