import logo from '../../assets/logo.png'; // 경로 확인!

export default function ProblemNavbar() {
    return (
        <div className="relative w-full bg-white shadow-sm border-b border-[#e2e2e2] px-6 py-3">
            {/* 왼쪽: 닫기 버튼 */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2">
                <button className="text-[#5c4033] text-2xl font-bold">✕</button>
            </div>

            {/* 가운데: 로고 */}
            <div className="flex justify-center">
                <img src={logo} alt="G-Learn-E Logo" className="h-8 mx-auto" />
            </div>

            {/* 오른쪽: 버튼들 */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-3">
                {['다시 풀기', '문제 편집', '채점하기', '임시 저장'].map((label, idx) => (
                    <button
                        key={idx}
                        className="px-4 py-1 border border-[#5c4033] rounded-full text-sm text-[#5c4033] hover:bg-[#f8f1ea]"
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>

    );
}
