import React, { useEffect, useMemo, useState } from "react";
import {
    getWrongKeywords,
    getWrongWorkbooks,
    getActivityLog,
} from "../../api/userApi.js";
import HeatmapSVG from "./HeatmapSVG.jsx"; // 헬퍼 컴포넌트
import BubbleChart from "./BubbleChart.jsx";
import { useNavigate } from "react-router-dom";
import WorkbookProfilePopup from "../common/WorkbookProfilePopup.jsx";

const BUBBLE_W = 600;   // ⬅︎ 필요에 따라 폭·높이만 바꿔주세요
const BUBBLE_H = 400;

/* ────────────────────────── 헬퍼 ────────────────────────── */
// 간단한 circle-packing: 큰 원부터 무작위 배치, 충돌시 재시도
const randNorm = () => {
    let u = 0,
        v = 0;
    while (!u) u = Math.random();
    while (!v) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};
function packBubbles(items, width, height, padding = 4, minR = 8) {
    const placed = [];
    const maxIter = 4000;
    const maxR = Math.max(...items.map((d) => d.r));
    const cx = width / 2,
        cy = height / 2;

    items.forEach((item) => {
        let r = item.r;
        let success = false;
        while (r >= minR && !success) {
            item.r = r;                        // 시도할 반지름 적용
            const ratio = r / maxR;
            const sigmaX = (width / 3) * (1 - 0.7 * ratio);
            const sigmaY = (height / 3) * (1 - 0.7 * ratio);

            for (let i = 0; i < maxIter; i++) {
                item.x = cx + randNorm() * sigmaX;
                item.y = cy + randNorm() * sigmaY;

                item.x = Math.max(r, Math.min(width - r, item.x));
                item.y = Math.max(r, Math.min(height - r, item.y));

                const overlaps = placed.some(
                    (p) => Math.hypot(item.x - p.x, item.y - p.y) < p.r + r + padding
                );
                if (!overlaps) {
                    placed.push({ ...item });      // 성공
                    success = true;
                    break;
                }
            }
            if (!success) r *= 0.9;            // 10% 줄여 재도전
        }
        /* r < minR 인 경우도 실패 없이 종료 → 아주 빽빽한 데이터에도 모든 키워드가 출력 */
        if (!success) {
            item.r = minR;
            // 마지막으로 아무 위치나 찍더라도 배열 끝에 넣기
            item.x = Math.random() * (width - 2 * minR) + minR;
            item.y = Math.random() * (height - 2 * minR) + minR;
            placed.push({ ...item });
        }
    });
    return placed;
}

const randBrown = () => {
    const h = 25 + Math.random() * 10; // Hue 25-35
    const s = 30 + Math.random() * 20; // Sat 30-50%
    const l = 60 + Math.random() * 15; // Light 60-75%
    return `hsl(${h} ${s}% ${l}%)`;
};

// 날짜 → YYYY-MM-DD
const fmt = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;      // 로컬 타임존 그대로
};

// 활동 로그를 최근 N주(열) × 7일(행) 매트릭스로 변환
function buildHeatmap(raw, days) {
    const map = Object.fromEntries(raw.map((d) => [d.date, d.count]));
    const end = new Date();               // 오늘
    end.setHours(0, 0, 0, 0);
    const start = new Date(end);
    start.setDate(start.getDate() - (days));

    const weeks = [];
    let currentWeek = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        currentWeek.push({ date: fmt(d), count: map[fmt(d)] || 0 });
        if (d.getDay() === 6) {             // 토요일 → 주 마감
            weeks.push(currentWeek);
            currentWeek = [];
        }
    }
    if (currentWeek.length) weeks.push(currentWeek);
    return weeks;
}

/* ────────────────────────── 메인 컴포넌트 ────────────────────────── */
export default function MyPageStatistics() {
    const navigate = useNavigate();
    const [popupInfo, setPopupInfo] = useState(null); // 문제집 프로필 팝업
    const [keywords, setKeywords] = useState([]);
    const [workbooks, setWorkbooks] = useState([]);
    const [heatmap, setHeatmap] = useState([]);
    const [loading, setLoading] = useState(true);
    const daysFromJan1 = Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 1)) / 864e5
    );

    /* 최초 1회 데이터 로딩 */
    useEffect(() => {
        (async () => {
            try {
                const [k, w, a] = await Promise.all([
                    getWrongKeywords(10),          // 키워드 TOP 10
                    getWrongWorkbooks(10),         // 문제집 TOP 10

                    getActivityLog(["SOLVED_WORKBOOK"], daysFromJan1), // 1월부터의 활동 로그
                    /*
                        LOGIN("로그인"),
              LOGOUT("로그아웃"),
              SIGNUP("회원가입"),
              PASSWORD_RESET("비밀번호 재설정"),
              EMAIL_VERIFICATION("이메일 인증"),
              PROFILE_UPDATE("프로필 수정"),
              COLLEGE_UPDATE("대학 변경"),
              DEPARTMENT_UPDATE("학과 변경"),
              WORKBOOK_CREATE("문제집 생성"),
              WORKBOOK_UPDATE("문제집 수정"),
              SOLVED_WORKBOOK("문제집 풀이"),
              WORKBOOK_UPLOAD("문제집 업로드");
                    */
                ]);
                setKeywords(k);
                setWorkbooks(w);
                setHeatmap(buildHeatmap(a, daysFromJan1));
                console.log("활동 로그:", a);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    /* 버블 chart용 위치 계산 (데이터 바뀔 때마다 재계산) */
    const packedKeywords = useMemo(() => {
        if (!keywords.length) return [];
        const max = Math.max(...keywords.map((k) => k.count));
        const baseR = 24;
        const scale = 56;
        const items = keywords
            .map((k) => ({
                ...k,
                r: baseR + (k.count / max) * scale,
                fill: randBrown(),
            }))
            .sort((a, b) => b.r - a.r); // 큰 원 먼저 배치
        return packBubbles(items, BUBBLE_W, BUBBLE_H);
    }, [keywords]);

    if (loading) return <p className="text-center">통계 로딩 중...</p>;

    return (
        <>
            {popupInfo && (
                <WorkbookProfilePopup
                    workbookId={popupInfo.id}
                    isPublic={popupInfo.isPublic}
                    onClose={() => setPopupInfo(null)}
                    showVote={popupInfo.showVote}
                />
            )}
            <div className="space-y-12 max-w-6xl mx-auto">
                {/* ───────── ① 오답 키워드 버블 ───────── */}
                <section className="bg-white rounded-3xl p-10 shadow-lg">
                    <h3 className="text-xl font-bold text-[#5F360A] mb-6">
                        자주 틀린 키워드
                    </h3>
                    <BubbleChart
                        nodes={packedKeywords}   // ← 위치·반지름·색까지 계산된 배열
                        width={BUBBLE_W}
                        height={BUBBLE_H}
                    />

                </section>

                {/* ───────── ② 오답률 높은 문제집 표 ───────── */}
                <section className="bg-white rounded-3xl p-10 shadow-lg">
                    <h3 className="text-xl font-bold text-[#5F360A] mb-6">
                        오답률 높은 문제집
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead>
                                <tr className="text-[#5F360A] border-b border-[#e0d5c5]">
                                    <th className="py-2 px-3">문제집 이름</th>
                                    <th className="py-2 px-3">오답률</th>
                                    <th className="py-2 px-3">오답 / 총문제</th>
                                </tr>
                            </thead>
                            <tbody>
                                {workbooks.map((w) => (
                                    // 문제집 틀린 개수가 0개 이상인 경우만 표시
                                    w.wrongCount > 0 &&
                                    <tr
                                        key={w.workbookId}
                                        onClick={() => {
                                            setPopupInfo({ id: w.workbookId, isPublic: true, showVote: false });
                                        }}
                                        // onClick={() => navigate(`/solve/${w.workbookId}`)}
                                        className="border-b border-[#f5f1eb] hover:bg-[#fefbf7]"
                                    >
                                        <td className="py-2 px-3">{w.name}</td>
                                        <td className="py-2 px-3 font-medium text-[#B45F04]">
                                            {(w.wrongRate * 100).toFixed(1)}%
                                        </td>
                                        <td className="py-2 px-3">
                                            {w.wrongCount} / {w.totalCount}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* ───────── ③ 활동 로그 Heatmap ───────── */}
                <section className="bg-white rounded-3xl p-10 shadow-lg">
                    <h3 className="text-xl font-bold text-[#5F360A] mb-6">
                        최근 활동 기록
                    </h3>
                    <div className="overflow-x-auto">
                        <HeatmapSVG
                            weeks={heatmap}
                            startDate={new Date(new Date().getFullYear(), 0, 1)} // 최근 90일 시작점
                        />
                    </div>
                </section>
            </div>
        </>
    );
}
