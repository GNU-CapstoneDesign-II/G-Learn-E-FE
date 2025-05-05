import React, { useState, useRef } from 'react';

const FileUploadModal = ({ onClose, onFileSelect, fileType = 'pdf' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const acceptType =
    fileType === 'audio' ? 'audio/*' : 'application/pdf';

  const fileCheck = (file) => {
    if (!file) return false;
    if (fileType === 'audio') return file.type.startsWith('audio/');
    if (fileType === 'pdf') return file.type === 'application/pdf';
    return false;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (fileCheck(file)) {
      onFileSelect(file);
      onClose();
    } else {
      alert(`${fileType.toUpperCase()} 파일만 업로드 가능합니다.`);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (fileCheck(file)) {
      onFileSelect(file);
      onClose();
    } else {
      alert(`${fileType.toUpperCase()} 파일만 업로드 가능합니다.`);
    }
  };

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className={`relative w-[400px] h-[300px] bg-white rounded-[1.5rem] p-6 flex flex-col items-center justify-center text-center shadow transition-all duration-300 ${
          isDragging ? 'border-4 border-dashed border-blue-400' : 'border'
        }`}
        onClick={(e) => e.stopPropagation()}
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

        <p className="text-lg mb-4 leading-relaxed">
          여기로 {fileType.toUpperCase()} 파일을 드래그하거나<br />아래 버튼을 클릭해주세요
        </p>

        <input
          type="file"
          accept={acceptType}
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

export default FileUploadModal;