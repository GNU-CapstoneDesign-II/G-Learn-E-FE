// src/components/common/WorkbookDetailPopup.jsx
import React from "react";

export default function WorkbookDetailPopup({ workbook, onClose, onEdit }) {
  if (!workbook) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-auto p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white border border-[#e9e1d8] rounded-[2.5rem] shadow-xl w-[95vw] max-w-lg max-h-[90vh] p-8 overflow-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ✕
        </button>

        {/* 타이틀 */}
        <h2 className="text-2xl md:text-3xl font-semibold text-[#5f360a] text-center mb-8 pb-3 border-b-2 border-[#BDA68A]">
          {workbook.name}
        </h2>

        {/* 정보 필드 */}
        <div className="mt-6 space-y-5 text-[#5f360a] text-base">
          <div className="flex items-center">
            <span className="w-28 font-medium">교과목 명:</span>
            <span className="flex-1">{workbook.subjectName}</span>
          </div>
          <div className="flex items-center">
            <span className="w-28 font-medium">교수님:</span>
            <span className="flex-1">{workbook.professor}</span>
          </div>
          <div className="flex items-center">
            <span className="w-28 font-medium">퀴즈생성자:</span>
            <span className="flex-1">{workbook.user}</span>
          </div>
          <div className="flex items-center">
            <span className="w-28 font-medium">범위:</span>
            <span className="flex-1">{workbook.range}</span>
          </div>
          <div className="flex items-center">
            <span className="w-28 font-medium">문제수:</span>
            <span className="flex-1">{workbook.questionCount}</span>
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={() => onEdit(workbook.id)}
            className="px-6 py-2 border border-[#BDA68A] text-[#5f360a] rounded-full hover:bg-[#F5EFE9] transition"
          >
            정보 편집
          </button>
          <button
            onClick={() => {/* 나의 풀이 로직 */}}
            className="px-6 py-2 border border-[#BDA68A] text-[#5f360a] rounded-full hover:bg-[#F5EFE9] transition"
          >
            나의 풀이
          </button>
          <button
            onClick={() => window.open(`/solve/${workbook.id}`, "_blank", "noopener,noreferrer")}
            className="px-6 py-2 bg-[#BDA68A] text-white rounded-full hover:bg-[#A78A64] transition"
          >
            문제 풀기
          </button>
        </div>
      </div>
    </div>
  );
}
