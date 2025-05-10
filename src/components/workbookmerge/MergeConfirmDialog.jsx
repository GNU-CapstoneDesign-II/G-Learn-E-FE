// src/components/MergeConfirmDialog.jsx
import React, { useState } from 'react';

const MergeConfirmDialog = ({
    isOpen,
    idList,
    selectedCount,
    onCancel,
    onConfirm,      // 이제 onConfirm(title)를 호출합니다.
}) => {
    const [title, setTitle] = useState('');

    if (!isOpen) return null;
    const midIndex = Math.floor(idList.length / 2);

    const handleConfirm = () => {
        onConfirm(title);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40">
            <div className="bg-[#F5F1E8] p-4 rounded-2xl">
                <div className="bg-white rounded-xl p-6 w-96">
                    {/* 테이블 */}
                    <table className="w-full text-[#5C4033] mb-6">
                        <thead>
                            <tr className="border-b border-[#D9D1E]">
                                <th className="text-base font-medium pb-2 text-center">문제집</th>
                                <th className="text-base font-medium pb-2 text-center">문제 개수</th>
                            </tr>
                        </thead>
                        <tbody>
                            {idList.map((id, idx) => (
                                <tr key={id} className="h-8">
                                    <td className="text-center">{`문제집 ${id}`}</td>
                                    <td className="text-center">
                                        {idx === midIndex ? selectedCount : ''}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* 제목 입력 필드 */}
                    <div className="bg-[#F5F1E8] flex items-center rounded-xl px-4 py-3 mb-6">
                        <span className="text-[#8B623F] font-medium mr-4">제목</span>
                        <div className="w-px h-6 bg-[#E4DAC8] mr-4" />
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="문제집 제목을 쓰세요"
                            className="flex-1 bg-transparent placeholder-[#A89A8E] text-sm focus:outline-none"
                        />
                    </div>

                    {/* 버튼들 */}
                    <div className="flex justify-center space-x-8">
                        <button
                            onClick={onCancel}
                            className="px-8 py-2 border border-[#8B623F] text-[#8B623F] rounded-full hover:bg-[#F9F1E8] transition"
                        >
                            취소
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="px-8 py-2 border border-red-500 text-red-500 rounded-full hover:bg-red-50 transition"
                        >
                            확인
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MergeConfirmDialog;