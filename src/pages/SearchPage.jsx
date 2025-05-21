// src/pages/SearchPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchWorkbooks } from "../api/publicWorkbooksApi";
import Navbar from "../components/Navbar";

export default function SearchPage() {
    /* ── ① URL 파라미터 → 상태 ── */
    const { search } = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(search);

    const kw = params.get("keyword") ?? "";
    const range = params.get("range") ?? "all";     // all | private | public
    const type = params.get("type") ?? "total";
    const page = params.get("page") || 0;
    const size = params.get("size") || 25;
    const sort = params.get("sort") ?? "relevance";
    const order = params.get("order") ?? "desc";

    /* ── ② 결과 상태 ── */
    const [privateRows, setPrivateRows] = useState([]);
    const [publicRows, setPublicRows] = useState([]);
    const [pageInfo, setPageInfo] = useState({ total: 0, pages: 0 });
    const [loading, setLoading] = useState(false);

    /* ── ③ API 호출 ── */
    useEffect(() => {
        if (!kw) return;
        setLoading(true);

        searchWorkbooks({ keyword: kw, range, type, page, size, sort, order })
            .then(({ data }) => {
                const res = data.data;                      // SearchResponse

                const priv = res.privateWorkbooks ?? [];
                const publ = res.publicWorkbooks ?? [];

                /* private·public 모두 받을 때를 대비해 분리 저장 */
                setPrivateRows(
                    priv.map(({ workbook, folder }) => ({
                        id: workbook.id,
                        name: workbook.name,
                        createdAt: workbook.createdAt,
                        folderName: folder?.name,
                    }))
                );

                setPublicRows(
                    publ.map(({ workbook, author, paths }) => ({
                        id: workbook.id,
                        name: workbook.name,
                        createdAt: workbook.createdAt,
                        author: author.nickname,
                        downloaded: workbook.downloaded,
                        pathChain: paths ? `${paths[0].collegeName} > ${paths[0].departmentName} > ${paths[0].subjectName}` : "(경로없음)",
                    }))
                );

                /* 페이지 정보 (range별로 구분) */
                const pg =
                    range === "private"
                        ? res.privatePageInfo
                        : range === "public"
                            ? res.publicPageInfo
                            : {
                                totalElements:
                                    (res.privatePageInfo?.totalElements || 0) +
                                    (res.publicPageInfo?.totalElements || 0),
                                totalPages: Math.max(
                                    res.privatePageInfo?.totalPages || 0,
                                    res.publicPageInfo?.totalPages || 0
                                ),
                            };
                setPageInfo({ total: pg.totalElements, pages: pg.totalPages });
            })
            .catch(err => console.error("검색 실패:", err))
            .finally(() => setLoading(false));
    }, [kw, range, type, page, size, sort, order]);

    /* ── ④ URL 파라미터 수정 유틸 ── */
    const setParam = (k, v) => {
        params.set(k, v);
        if (k !== "page") params.set("page", "0");
        navigate(`/search?${params.toString()}`);
    };

    /* ── ⑤ 렌더링 ── */
    const Pagination = () => (
        <div className="mt-8 flex justify-center gap-2 text-sm">
            <button
                onClick={() => setParam("page", Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-3 py-1 border rounded disabled:opacity-40"
            >
                ◀ 이전
            </button>
            <span className="px-3 py-1 text-[#5F360A] font-semibold">
                {page + 1} / {Math.max(1, pageInfo.pages)}
            </span>
            <button
                onClick={() => setParam("page", Math.min(pageInfo.pages - 1, page + 1))}
                disabled={page + 1 >= pageInfo.pages}
                className="px-3 py-1 border rounded disabled:opacity-40"
            >
                다음 ▶
            </button>
        </div>
    );

    const Card = ({ wb, isPublic }) => (
        <div
            key={wb.id}
            className="bg-white border border-[#E6CEBA] rounded-md p-4 shadow-sm"
        >
            <div
                onClick={() => navigate(`/solve/${wb.id}`)}
                className="cursor-pointer hover:underline text-[#5F360A] font-semibold"
            >
                {wb.name}
            </div>
            <div className="text-xs text-[#9A7E5F] mt-1">
                {/* {isPublic
          ? `작성자: ${wb.author}`
          : wb.folderName
          ? `폴더: ${wb.folderName}`
          : "내 워크북"} */}
                {isPublic
                    ? `경로: ${wb.pathChain} / 작성자: ${wb.author}`
                    : wb.folderName
                        ? `폴더: ${wb.folderName}`
                        : "내 워크북"}
                {" / "}생성일:{" "}
                {wb.createdAt ? new Date(wb.createdAt).toLocaleDateString() : "-"}
            </div>
        </div>
    );

    return (
        <>
            <Navbar initialSearch={kw} />
            <main className="mt-[65px] p-8 min-h-screen bg-[#F9F4ED]">
                {/* 검색어 & 총 건수 */}
                <div className="bg-white border border-[#E6CEBA] rounded-lg p-6 mb-6 shadow">
                    <p className="text-sm text-[#7B5A38]">
                        검색어{" "}
                        <span className="text-red-600 font-bold">"{kw}"</span>에 대한
                        검색결과는 총
                        <span className="font-bold text-[#5F360A]">
                            {" "}
                            {pageInfo.total?.toLocaleString() ?? 0}건
                        </span>{" "}
                        입니다.
                    </p>
                </div>

                {/* 정렬·필터 */}
                <div className="mb-4 flex items-center gap-4 flex-wrap text-sm">
                    {/* 정렬 기준 */}
                    <label className="text-[#5F360A] flex items-center gap-2">
                        정렬
                        <select
                            value={sort}
                            onChange={e => setParam("sort", e.target.value)}
                            className="border px-3 py-1 rounded"
                        >
                            <option value="relevance">연관도</option>
                            <option value="createdAt">생성일</option>
                            <option value="title">제목</option>
                            <option value="author">작성자</option>
                        </select>
                    </label>

                    {/* 공개 범위 */}
                    <label className="text-[#5F360A] flex items-center gap-2">
                        범위
                        <select
                            value={range}
                            onChange={e => setParam("range", e.target.value)}
                            className="border px-3 py-1 rounded"
                        >
                            <option value="all">전체</option>
                            <option value="private">내 문제집</option>
                            <option value="public">공개 문제집</option>
                        </select>
                    </label>

                    {/* 검색 대상 */}
                    <label className="text-[#5F360A] flex items-center gap-2">
                        대상
                        <select
                            value={type}
                            onChange={e => setParam("type", e.target.value)}
                            className="border px-3 py-1 rounded"
                        >
                            <option value="total">전체</option>
                            <option value="title">제목</option>
                            <option value="author">작성자</option>
                            <option value="content">내용</option>
                        </select>
                    </label>
                </div>

                {/* 결과 영역 */}
                {loading ? (
                    <div>로딩 중…</div>
                ) : pageInfo.total === 0 ? (
                    <div className="text-center text-[#9A7E5F]">검색 결과가 없습니다.</div>
                ) : range === "all" ? (
                    /* 좌: private / 우: public */
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Private */}
                        <div className="space-y-6">
                            <h4 className="font-bold text-[#5F360A] mb-2">내 워크북</h4>
                            {privateRows.map(wb => (
                                <Card key={wb.id} wb={wb} isPublic={false} />
                            ))}
                        </div>

                        {/* Public */}
                        <div className="space-y-6">
                            <h4 className="font-bold text-[#5F360A] mb-2">공개 워크북</h4>
                            {publicRows.map(wb => (
                                <Card key={wb.id} wb={wb} isPublic />
                            ))}
                        </div>
                    </div>
                ) : (
                    /* 단일 영역 */
                    <>
                        <div className="space-y-6">
                            {(range === "private" ? privateRows : publicRows).map(wb => (
                                <Card
                                    key={wb.id}
                                    wb={wb}
                                    isPublic={range === "public"}
                                />
                            ))}
                        </div>
                        <Pagination />
                    </>
                )}
            </main>
        </>
    );
}