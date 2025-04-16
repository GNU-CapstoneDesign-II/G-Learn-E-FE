import React from "react";
import Checkbox from "./Checkbox.jsx";

export default function PrivateHeader({
    selectedFolder,
    selectedItems,
    sortOption,
    onSortChange,
    isSelectMode,
    onClearSelection,
    onBack,
    onToggleAll,
}) {
    const totalCount = selectedFolder ? 3 : 4; // 예시 (props로 전달 가능)

    return (
        <div className="w-full flex items-center justify-between px-6 py-3 border-b border-[#e5d5c5] bg-[#fdf9f4]">
            {/* 왼쪽 영역 */}
            <div className="flex items-center gap-3">
                {selectedFolder ? (
                    <>
                        <button
                            className="text-xl text-[#5f360a] hover:opacity-70"
                            onClick={onBack}
                        >
                            ◀
                        </button>
                        <h2 className="text-lg font-semibold text-[#5f360a]">
                            {selectedFolder.name}
                        </h2>
                    </>
                ) : (
                    <h2 className="text-lg font-semibold text-[#5f360a]">private</h2>
                )}
            </div>

            {/* 오른쪽 영역 */}
            <div className="flex items-center gap-3 text-sm text-[#5f360a]">
                {/* 정렬 셀렉트 */}
                <div className="relative">
                    <select
                        className="appearance-none border px-3 py-1 rounded pr-6 text-sm"
                        value={sortOption}
                        onChange={(e) => onSortChange(e.target.value)}
                    >
                        <option value="최신순">최신순</option>
                        <option value="오래된순">오래된순</option>
                        <option value="업로드순">업로드순</option>
                    </select>
                    <span className="absolute right-2 top-1/2 -translate-y-1 text-xs">▼</span>
                </div>

                {/* 선택 모드일 경우 */}
                {isSelectMode && (
                    <>
                        <button className="bg-[#5f360a] text-white px-3 py-1 rounded hover:opacity-90">
                            업로드
                        </button>
                        <button className="bg-[#5f360a] text-white px-3 py-1 rounded hover:opacity-90">
                            합치기
                        </button>
                        <button className="bg-[#5f360a] text-white px-3 py-1 rounded hover:opacity-90">
                            이동
                        </button>
                        <button className="bg-[#5f360a] text-white px-3 py-1 rounded hover:opacity-90">
                            삭제
                        </button>
                        <span className="text-[#5f360a]">{selectedItems.length}개 선택</span>
                    </>
                )}

                {/* 전체 선택 체크박스 */}
                <Checkbox
                    checked={selectedItems.length === totalCount}
                    onChange={onToggleAll}
                />
            </div>
        </div>
    );
}
