import React, { useState, useRef } from 'react';

const PdfUploadModal = ({ onClose, onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
      onClose();
    } else {
      alert('PDF 파일만 업로드 가능합니다.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
      onClose();
    } else {
      alert('PDF 파일만 업로드 가능합니다.');
    }
  };

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center"
      onClick={onClose} // ✅ 외부 클릭 닫기
    >
      <div
        className={`relative w-[400px] h-[300px] bg-white rounded-[1.5rem] p-6 flex flex-col items-center justify-center text-center shadow transition-all duration-300 ${
          isDragging ? 'border-4 border-dashed border-blue-400' : 'border'
        }`}
        onClick={(e) => e.stopPropagation()} // ✅ 내부 클릭 방지
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <button
          className="absolute top-3 right-4 text-gray-500 text-xl cursor-pointer"
          onClick={onClose}
        >
          ✖
        </button>

        <p className="text-lg mb-4">
          여기로 PDF 파일을 드래그하거나<br />아래 버튼을 클릭해주세요
        </p>

        <input
          type="file"
          accept="application/pdf"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-brown text-white rounded-full text-base font-semibold cursor-pointer hover:bg-opacity-80"
        >
          파일 선택
        </button>
      </div>
    </div>
  );
};

export default PdfUploadModal;