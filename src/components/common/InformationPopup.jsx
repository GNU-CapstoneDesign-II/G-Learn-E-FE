// src/components/common/InformationPopup.jsx
import React from 'react';

export default function InformationPopup({ message, onClose }) {
  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-[rgba(60,60,60,0.5)] flex justify-center items-center z-[999]"
      onClick={onClose}
    >
      <div
        className="w-[380px] bg-white rounded-[1.5rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.2)] relative z-[1000] text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-black text-base mb-6 whitespace-pre-wrap">
          {message}
        </p>
        <button
          onClick={onClose}
          className="px-6 py-2 text-base font-bold bg-brown text-white rounded-full"
        >
          확인
        </button>
      </div>
    </div>
  );
}
