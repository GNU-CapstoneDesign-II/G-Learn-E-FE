/* ───────────── HeatmapSVG.jsx ─────────────
 *  ▷ 1 ~ 6 월 : 1 행, 7 ~ 12 월 : 2 행
 *  ▷ 오늘(포함) 이후 날짜는 셀·테두리 모두 출력하지 않음
 *  ▷ GitHub Heatmap 좌표계 완전 호환
 *  ▷ 외부 라이브러리 ZERO
 * ---------------------------------------- */

import React, { useMemo } from "react";

/* ===== 설정 ===== */
const CELL = 32;                  // 셀 한 변(px)
const GAP = 2;                   // 셀 간격(px)
const LEFT = 65;                  // 좌측 여백(연도 라벨)
const GRID_LEFT = 70;   // ← 셀·테두리 시작 X, 원하는 만큼 키워서 오른쪽으로
const TOP = 16;                   // 상단 여백(월 라벨)
const YEAR_FONT = 40;
const MONTH_FONT = 15;
const DOW_FONT = 12;

/* 두 줄(행) 사이 높이 : 7 행(일~토) + GAP & 여백 */
const ROW_H = 7 * (CELL + GAP) + TOP + 8;

/* 레벨 → 색상 */
const SCALE = ["#e9e3da", "#d5c7b6", "#c0ab96", "#a88c73", "#5F360A"];
const level = (c) => (c === 0 ? 0 : c < 2 ? 1 : c < 4 ? 2 : c < 6 ? 3 : 4);

/* 빈칸 해치 */
const EMPTY_PATTERN = (
    <pattern id="heat_empty" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="4" stroke="#d5c7b6" strokeWidth="1" />
    </pattern>
);

/* 오늘 00:00:00 */
const today = (() => {
    const d = new Date();
    d.setHours(23, 59, 59, 59);
    return d;
})();

/* ───────────────── monthPath ─────────────────
   block(0|1) = 행(0=Jan~Jun, 1=Jul~Dec)
   w0/w1Shift = 블록 내부 주 인덱스 (0부터)
*/
function monthPath(first, last, baseSunday, block, w0Shift, w1Shift) {
    /* today 이후 달은 테두리 없음 */
    if (first > today) return "";

    /* 현재 달 → 말일 대신 today 사용 */
    const realLast = last > today ? today : last;

    const d0 = first.getDay();
    const d1 = realLast.getDay();
    const SC = CELL + GAP;

    /* 좌표 헬퍼 : 블록 오프셋을 더함 */
    const col = (w) => GRID_LEFT + GAP + w * SC;
    const row = (d) => block * ROW_H + TOP + GAP + d * SC;

    return (
        `M${col(w0Shift + 1)},${row(d0)}` + // 시작
        `H${col(w0Shift)}` +               // ←
        `V${row(7)}` +                     // ↓
        `H${col(w1Shift)}` +               // →
        `V${row(d1 + 1)}` +                // ↑
        `H${col(w1Shift + 1)}` +           // →
        `V${row(0)}` +                     // ↑
        `H${col(w0Shift + 1)}` +           // ←
        "Z"
    );
}

export default function HeatmapSVG({ weeks, startDate }) {
    console.log("weeks", weeks);
    console.log("startDate", startDate);
    /* ─ baseSunday : 가장 왼쪽 열(week) 기준 일요일 ─ */
    const baseSunday = new Date(startDate);
    baseSunday.setHours(0, 0, 0, 0);
    baseSunday.setDate(baseSunday.getDate() - baseSunday.getDay());

    const year = new Date(startDate).getFullYear();

    /* 7 월 1 일이 속한 주 index → 블록 분할 기준 */
    const firstWeekOfJul = Math.floor((new Date(year, 6, 1) - baseSunday) / 864e5 / 7);

    /* ========== 셀 ========== */
    const cells = useMemo(() => {
        const list = [];
        weeks.forEach((week, wi) =>
            week.forEach((cell) => {
                const di = new Date(cell.date).getDay();
                const dateObj = new Date(cell.date);
                if (dateObj > today) return;                         // ▶ 오늘 이후 skip

                const month = dateObj.getMonth();
                const block = month < 6 ? 0 : 1;
                const wShift = block === 0 ? wi : wi - firstWeekOfJul;

                const x = GRID_LEFT + GAP + wShift * (CELL + GAP);
                const y = block * ROW_H + TOP + GAP + di * (CELL + GAP);

                const fill = cell.count === 0 ? "url(#heat_empty)" : SCALE[level(cell.count)];

                list.push(
                    <rect
                        key={cell.date}
                        x={x}
                        y={y}
                        width={CELL}
                        height={CELL}
                        rx={CELL * 0.1}
                        fill={fill}
                        stroke="#ffffff"
                        strokeWidth={0.6}
                    >
                        <title>{`${cell.date} : ${cell.count}`}</title>
                    </rect>
                );
            })
        );
        return list;
    }, [weeks, firstWeekOfJul]);

    /* ========== 월 라벨·테두리 ========== */
    const months = useMemo(() => {
        const MONTH_MS = 30 * 24 * 60 * 60 * 1e3;
        const list = [];
        for (let m = 0; m < 12; m++) {
            const first = new Date(year, m, 1);
            const last = new Date(year, m + 1, 0);

            if (first > today) break;                             // ▶ 오늘 이후 달 skip

            /* w index (베이스는 전체 주) */
            const monthLast = last > today ? today : last;

            const w0 = Math.floor((first - baseSunday) / 864e5 / 7);
            const w1 = Math.floor((monthLast - baseSunday) / 864e5 / 7);

            const block = m < 6 ? 0 : 1;
            const w0Shift = block === 0 ? w0 : w0 - firstWeekOfJul;
            const w1Shift = block === 0 ? w1 : w1 - firstWeekOfJul;

            list.push({
                name: first.toLocaleString("en-US", { month: "short" }),
                path: monthPath(first, monthLast, baseSunday, block, w0Shift, w1Shift),
                xPos: GRID_LEFT + GAP + w0Shift * (CELL + GAP),
                yPos: block * ROW_H + TOP - 1,
            });
        }
        return list;
    }, [startDate, firstWeekOfJul]);

    /* ========== SVG 크기 ========== */
    const widthBlocks = [
        firstWeekOfJul,                        // Jan~Jun 주 수
        weeks.length - firstWeekOfJul,         // Jul~Dec 주 수
    ];
    const width =
        GRID_LEFT + GAP + Math.max(...widthBlocks) * (CELL + GAP);
    const height = ROW_H * 2;                // 두 블록

    /* ========== 요일 라벨 ========== */
    const dow = ["S", "M", "T", "W", "T", "F", "S"];

    /* ========== 렌더 ========== */
    return (
        <svg
            width="100%"
            viewBox={`0 0 ${width} ${height}`}
            style={{ maxWidth: width, overflow: "visible" }}
        >
            <defs>{EMPTY_PATTERN}</defs>

            {/* 셀 */}
            {cells}

            {/* 월 테두리 */}
            {months.map((m) => (
                m.path && (
                    <path
                        key={m.name}
                        d={m.path}
                        fill="none"
                        stroke="#c9c9c9"
                        strokeWidth="0.6"
                    />
                )
            ))}

            {/* 월 라벨 */}
            {months.map((m) => (
                <text
                    key={m.name}
                    x={m.xPos + CELL + 3}
                    y={m.yPos}
                    fill="#888"
                    fontSize={MONTH_FONT}
                >
                    {m.name}
                </text>
            ))}

            {/* 연도 라벨 (세로) */}
            <text
                x={LEFT / 2}
                y={height / 2}
                fill="#dfdfdf"
                fontSize={YEAR_FONT}
                textAnchor="middle"
                transform={`rotate(-90 ${LEFT / 2} ${height / 2})`}
            >
                {year}
            </text>

            {/* 요일 라벨(좌측) – 두 블록 모두 그리기 */}
            {dow.flatMap((d, i) => [
                <text
                    key={`${d}-0`}
                    x={LEFT - 4}
                    y={TOP + GAP + i * (CELL + GAP) + CELL / 1.5}
                    fontSize={DOW_FONT}
                    fill="#888"
                    textAnchor="end"
                >
                    {d}
                </text>,
                <text
                    key={`${d}-1`}
                    x={LEFT - 4}
                    y={ROW_H + TOP + GAP + i * (CELL + GAP) + CELL / 1.5}
                    fontSize={DOW_FONT}
                    fill="#888"
                    textAnchor="end"
                >
                    {d}
                </text>,
            ])}
        </svg>
    );
}
