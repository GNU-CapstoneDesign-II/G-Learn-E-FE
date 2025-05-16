// src/components/common/InfoEditPopup.jsx
import React, { useState, useEffect, useRef } from "react";
import { InputField, SelectField } from "../pages/SignUp"; // InputField, SelectField가 export된 파일

export default function InfoEditPopup({ workbook, onClose, onSave }) {
  if (!workbook) return null;

  // 로컬 상태 초기값
  const [subjectName, setSubjectName] = useState(workbook.subjectName || "");
  const [professor, setProfessor]     = useState(workbook.professor     || "");
  const [year, setYear]               = useState(workbook.year          || "");
  const [semester, setSemester]       = useState(workbook.semester      || "");
  const [examType, setExamType]       = useState(workbook.examType      || "중간");

  // ① 학사년도 옵션 (현재 연도 기준 최근 5년)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const y = currentYear - i;
    return { value: String(y), label: `${y}년` };
  });

  const semesterOptions = [
    { value: "1", label: "1학기" },
    { value: "2", label: "2학기" },
    { value: "S", label: "여름계절학기" },
    { value: "W", label: "겨울계절학기" },
  ];

  const handleSave = () => {
    onSave({ subjectName, professor, year, semester, examType });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto p-4">
      <div className="relative bg-white border border-[#e9e1d8] rounded-[2.5rem] shadow-xl w-[95vw] max-w-lg max-h-[90vh] p-8 overflow-auto">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ✕
        </button>

        {/* 타이틀 */}
        <h2 className="text-xl md:text-2xl font-semibold text-[#5F360A] text-center mb-8">
          {workbook.name}
        </h2>

        {/* 필드 그룹 */}
        <div className="space-y-5 text-[#5F360A] text-base">
          <InputField
            label="교과목 명"
            name="subjectName"
            value={subjectName}
            onChange={e => setSubjectName(e.target.value)}
          />
          <InputField
            label="교수님"
            name="professor"
            value={professor}
            onChange={e => setProfessor(e.target.value)}
          />

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm mb-1">수강년도</label>
              <SelectField
                placeholder="선택"
                value={year}
                options={yearOptions}
                onChange={e => setYear(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm mb-1">수강학기</label>
              <SelectField
                placeholder="선택"
                value={semester}
                options={semesterOptions}
                onChange={e => setSemester(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-10">
            {['중간','기말','전범위','기타'].map(type => (
              <label key={type} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="examType"
                  value={type}
                  checked={examType === type}
                  onChange={e => setExamType(e.target.value)}
                  className="accent-[#BDA68A]"
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSave}
            className="px-6 py-2 border border-[#BDA68A] text-[#5f360a] rounded-full hover:bg-[#F5EFE9] transition"
          >
            변경사항 저장
          </button>
        </div>
      </div>
    </div>
  );
}
