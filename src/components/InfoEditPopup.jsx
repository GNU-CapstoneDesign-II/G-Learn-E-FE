// src/components/InfoEditPopup.jsx
import React, { useState } from "react";
import { InputField, SelectField } from "../pages/SignUp"; // InputField, SelectField가 export된 파일
import ConfirmPopup from "./common/ConfirmPopup";

export default function InfoEditPopup({ workbook, onClose, onSave }) {
  if (!workbook) return null;

  // 로컬 상태 초기값 (백엔드 프로퍼티명과 일치)
  const [name, setName]               = useState(workbook.name             || "");
  const [professor, setProfessor]     = useState(workbook.professor       || "");
  const [examType, setExamType]       = useState(workbook.examType        || "중간");
  const [courseYear, setCourseYear]   = useState(String(workbook.courseYear) || "");
  const [semester, setSemester]       = useState(workbook.semester        || "");
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  // 학사년도 옵션 (현재 연도 기준 최근 5년)
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

  // 변경사항 유무 확인
  const isDirty = () => (
    name        !== (workbook.name             || "") ||
    professor   !== (workbook.professor       || "") ||
    courseYear  !== String(workbook.courseYear || "") ||
    semester    !== (workbook.semester        || "") ||
    examType    !== (workbook.examType        || "중간")
  );

  // 닫기 버튼 핸들러
  const handleCloseClick = () => {
    if (isDirty()) setShowConfirmClose(true);
    else onClose();
  };

  const handleConfirmClose = () => {
    setShowConfirmClose(false);
    onClose();
  };
  const handleCancelClose = () => setShowConfirmClose(false);

  // 저장 핸들러: backend payload 필드명과 일치시켜 전달
  const handleSave = () => {
    onSave({
      name,
      professor,
      examType,
      coverImage: workbook.coverImage,
      courseYear: Number(courseYear),
      semester,
    });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto p-4">
        <div
          className="relative bg-white border border-[#e9e1d8] rounded-[2.5rem] shadow-xl w-[95vw] max-w-lg max-h-[90vh] p-8 overflow-auto"
        >
          {/* 닫기 버튼 */}
          <button
            onClick={handleCloseClick}
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
              label="과목명"
              name="name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <InputField
              label="교수님"
              name="professor"
              value={professor}
              onChange={e => setProfessor(e.target.value)}
            />

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm mb-1">학사년도</label>
                <SelectField
                  placeholder="선택"
                  value={courseYear}
                  options={yearOptions}
                  onChange={e => setCourseYear(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-1">학기</label>
                <SelectField
                  placeholder="선택"
                  value={semester}
                  options={semesterOptions}
                  onChange={e => setSemester(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-6">
              {['중간','기말','전체','기타'].map(type => (
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

      {/* 변경사항 미저장 시 닫기 확인 팝업 */}
      {showConfirmClose && (
        <ConfirmPopup
          message="저장하지 않은 변경사항은 사라집니다. 닫으시겠습니까?"
          onConfirm={handleConfirmClose}
          onCancel={handleCancelClose}
        />
      )}
    </>
  );
}
