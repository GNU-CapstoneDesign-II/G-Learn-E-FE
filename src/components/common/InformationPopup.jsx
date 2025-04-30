// src/components/common/InformationPopup.jsx
import React from 'react';

export default function InformationPopup({ message, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-[#fefbf9] border border-[#e9e1d8] rounded-[2rem] shadow-xl px-8 py-6 w-[320px] text-center">
        <p className="text-[#5c4033] text-base font-semibold mb-6 whitespace-pre-wrap">
          {message}
        </p>
        <button
          onClick={onClose}
          className="px-6 py-2 text-sm bg-[#5c4033] text-white rounded-full hover:bg-[#3e2f26]"
        >
          확인
        </button>
      </div>
    </div>
  );
}
