/* ──────────────────────────────────────────────────────────────
   src/components/common/FolderCreatePopup.jsx
   - InformationPopup 스타일을 그대로 활용하되
   - 폴더 이름 입력 인풋 + “취소 / 생성” 버튼을 제공
────────────────────────────────────────────────────────────── */
import React, { useState } from "react";

/**
 * props
 * ───────────────────────────────
 * visible      : boolean   팝업 노출 여부
 * onCancel     : () => void  취소(닫기) 콜백
 * onCreate     : (folderName: string) => void  생성 콜백
 */
export default function FolderCreatePopup({ visible, onCancel, onCreate }) {
  const [name, setName] = useState("");

  if (!visible) return null; // 렌더링 X

  const handleSubmit = () => {
    if (name.trim() === "") {
      alert("폴더 이름을 입력하세요.");
      return;
    }
    onCreate(name.trim());
    setName("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-[#fefbf9] border border-[#e9e1d8] rounded-[2rem] shadow-xl px-8 py-6 w-[340px]">
        <h2 className="text-[#5c4033] text-lg font-semibold mb-4 text-center">
          새 폴더 만들기
        </h2>

        {/* 입력 필드 */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="폴더 이름"
          className="w-full mb-6 px-4 py-2 border border-[#d9cfc5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c1ad9d]"
        />

        {/* 버튼 그룹 */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setName("");
              onCancel();
            }}
            className="px-5 py-2 text-sm bg-transparent text-[#5c4033] border border-[#5c4033] rounded-full hover:bg-[#ece8e4]"
          >
            취소
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-2 text-sm bg-[#5c4033] text-white rounded-full hover:bg-[#3e2f26]"
          >
            생성
          </button>
        </div>
      </div>
    </div>
  );
}
