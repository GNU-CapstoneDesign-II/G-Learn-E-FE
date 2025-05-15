// src/components/common/InfoEditPopup.jsx
import React, { useState } from "react";
import { InputField, SelectField } from "../pages/SignUp"; // InputField, SelectField가 export된 파일

export default function InfoEditPopup({ workbook, onClose, onSave }) {
  if (!workbook) return null;

  // ① 로컬 상태로 초기값 세팅
  const [subjectName, setSubjectName] = useState(workbook.subjectName || "");
  const [professor, setProfessor]     = useState(workbook.professor     || "");
  const [year, setYear]               = useState(workbook.year          || "");
  const [semester, setSemester]       = useState(workbook.semester      || "");
  const [examType, setExamType]       = useState(workbook.examType      || "중간");

  // ② 셀렉트 옵션
  const yearOptions = [
    { value: "1", label: "1학년" },
    { value: "2", label: "2학년" },
    { value: "3", label: "3학년" },
    { value: "4", label: "4학년" },
  ];
  const semesterOptions = [
    { value: "1", label: "1학기" },
    { value: "2", label: "2학기" },
  ];

  // ③ 저장 핸들러
  const handleSave = () => {
    onSave({ subjectName, professor, year, semester, examType });
    onClose();
  };

  return (
    // 바깥 클릭 → onClose
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* 클릭 전파 차단 */}
      <div
        className="relative bg-white border border-[#BDA68A] rounded-[2rem] shadow-xl w-[90vw] max-w-lg p-6"
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* 타이틀 */}
        <h2 className="text-xl font-semibold text-[#5F360A] text-center mb-6">
          {workbook.name}
        </h2>

        {/* 교과목 명 / 교수님 */}
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

        {/* 수강년도 & 수강학기 */}
        <div className="flex gap-4 mt-4">
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

        {/* 범위 라디오 */}
        <div className="mt-4 flex items-center gap-6 text-[#5F360A]">
          {["중간","기말","전범위","기타"].map(type => (
            <label key={type} className="flex items-center gap-1">
              <input
                type="radio"
                name="examType"
                value={type}
                checked={examType === type}
                onChange={e => setExamType(e.target.value)}
                className="accent-[#BDA68A]"
              />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>

        {/* 저장 버튼 */}
        <div className="mt-6 text-center">
          <button
            onClick={handleSave}
            className="px-6 py-2 border border-[#BDA68A] text-[#5F360A] rounded-full hover:bg-[#F5EFE9] transition"
          >
            변경사항 저장
          </button>
        </div>
      </div>
    </div>
  );
}
