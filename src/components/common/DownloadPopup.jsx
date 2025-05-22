import React from "react";

/**
 * DownloadPopup 모달 컴포넌트
 * mode: "confirm" | "result" | "cancelled" | "exists"
 * selectedCount: 선택된 문제집 개수
 * result: { success: number, fail: number }
 */
export default function DownloadPopup({
    mode,
    selectedCount,
    result,
    onConfirm,
    onClose,
}) {
    let message;
    let buttons;

    switch (mode) {
        case "confirm":
            message = `선택한 ${selectedCount}문제집을 Private으로 다운로드하시겠습니까?`;
            buttons = (
                <>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-[#AC957B] rounded-full text-[#5f360a] hover:bg-[#F5EFE9] transition"
                    >
                        취소
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-[#AC957B] text-white rounded-full hover:bg-[#5F360A] transition"
                    >
                        확인
                    </button>
                </>
            );
            break;

        case "result":
            // 다운로드 직후에만 표시할 간단한 통계창
            return (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl w-[320px] text-center shadow-md">
                        <p className="text-base text-[#5f360a] mb-6">
                            총 {selectedCount}개 중<br />
                            ✓ {result.success}개 성공, ✕ {result.fail}개 실패
                        </p>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-[#AC957B] rounded-full text-[#5f360a] hover:bg-[#F5EFE9] transition"
                        >
                            확인
                        </button>
                    </div>
                </div>
            );

        case "cancelled":
            message = "문제 업로드를 취소했습니다.";
            buttons = (
                <button
                    onClick={onClose}
                    className="px-4 py-2 border border-[#AC957B] rounded-full text-[#5f360a] hover:bg-[#F5EFE9] transition"
                >
                    확인
                </button>
            );
            break;

        case "exists":
            message = "문제가 이미 업로드되어 있습니다.";
            buttons = (
                <button
                    onClick={onClose}
                    className="px-4 py-2 border border-[#AC957B] rounded-full text-[#5f360a] hover:bg-[#F5EFE9] transition"
                >
                    확인
                </button>
            );
            break;

        default:
            return null;
    }

    // confirm / cancelled / exists 모드 공통 렌더링
    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl w-[320px] text-center shadow-md">
                <p className="text-base text-[#5f360a] mb-6">{message}</p>
                <div className="flex justify-center gap-4">{buttons}</div>
            </div>
        </div>
    );
}
