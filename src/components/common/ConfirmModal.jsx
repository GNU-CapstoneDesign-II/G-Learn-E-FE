export default function ConfirmModal({ message, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-[#fefbf9] border border-[#e9e1d8] rounded-[2rem] shadow-xl px-10 py-8 w-[360px] text-center">
                <p className="text-[#5c4033] text-base font-semibold mb-6 whitespace-pre-wrap">
                    {message}
                </p>

                <div className="flex justify-center gap-6">
                    <button
                        onClick={onCancel}
                        className="px-6 py-1.5 text-sm border border-[#5c4033] text-[#5c4033] rounded-full hover:bg-[#f3e8df]"
                    >
                        취소
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-1.5 text-sm border border-[#5c4033] text-[#5c4033] rounded-full hover:bg-[#f3e8df]"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
}
