// src/pages/SearchPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchWorkbooks } from "../api/publicWorkbooksApi";
import Navbar from "../components/Navbar";

export default function SearchPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);

    const keyword = params.get("keyword") ?? "";
    const range = params.get("range") ?? "all";
    const type = params.get("type") ?? "total";
    const page = parseInt(params.get("page") ?? "0", 10);
    const size = parseInt(params.get("size") ?? "25", 10);
    const sort = params.get("sort") ?? "relevance";
    const order = params.get("order") ?? "desc";

    const [results, setResults] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!keyword) return;
        setLoading(true);

        searchWorkbooks(keyword, range, type, page, size, sort, order)
            .then((res) => {
                const wbList = res.data.data?.publicWorkbooks || [];
                setResults(wbList.map(entry => ({
                    id: entry.workbook.id,
                    name: entry.workbook.name,
                    createdAt: entry.workbook.createdAt,
                    description: entry.workbook.description,
                    authorName: entry.author.nickname,
                })));
                setTotalCount(wbList.length);
            })
            .catch((err) => console.error("검색 실패:", err))
            .finally(() => setLoading(false));
    }, [keyword, range, type, page, size, sort, order]);

    const handleParamChange = (key, value) => {
        params.set(key, value);
        if (key !== "page") params.set("page", "0"); // 필터 변경 시 페이지 초기화
        navigate(`/search?${params.toString()}`);
    };

    const totalPages = Math.ceil(totalCount / size);

    return (
        <>
            <Navbar initialSearch={keyword} />
            <main className="mt-[65px] p-8 min-h-screen bg-[#F9F4ED]">
                {/* 검색어 요약 영역 */}
                <div className="bg-white border border-[#E6CEBA] rounded-lg p-6 mb-6 shadow">
                    <p className="text-sm text-[#7B5A38]">
                        검색어 <span className="text-red-600 font-bold">"{keyword}"</span>에 대한 검색결과는 총
                        <span className="font-bold text-[#5F360A]"> {totalCount.toLocaleString()}건</span> 입니다.
                    </p>
                </div>

                {/* 정렬 + 필터 */}
                <div className="mb-4 flex items-center gap-4 flex-wrap text-sm">
                    <div className="flex items-center gap-2">
                        <label className="text-[#5F360A]">정렬 기준</label>
                        <select
                            value={sort}
                            onChange={(e) => handleParamChange("sort", e.target.value)}
                            className="border px-3 py-1 rounded"
                        >
                            <option value="relevance">연관도</option>
                            <option value="createdAt">생성일</option>
                            <option value="title">제목</option>
                            <option value="author">작성자</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-[#5F360A]">공개 범위</label>
                        <select
                            value={range}
                            onChange={(e) => handleParamChange("range", e.target.value)}
                            className="border px-3 py-1 rounded"
                        >
                            <option value="all">전체</option>
                            <option value="public">공개</option>
                            <option value="private">비공개</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-[#5F360A]">검색 대상</label>
                        <select
                            value={type}
                            onChange={(e) => handleParamChange("type", e.target.value)}
                            className="border px-3 py-1 rounded"
                        >
                            <option value="total">전체</option>
                            <option value="title">제목</option>
                            <option value="author">작성자</option>
                            <option value="content">내용</option>
                        </select>
                    </div>
                </div>

                {/* 검색 결과 */}
                {loading ? (
                    <div>로딩 중…</div>
                ) : !Array.isArray(results) || results.length === 0 ? (
                    <div className="text-center text-[#9A7E5F]">검색 결과가 없습니다.</div>
                ) : (
                    <>
                        <div className="space-y-6">
                            {results.map((wb) => (
                                <div key={wb.id} className="bg-white border border-[#E6CEBA] rounded-md p-4 shadow-sm">
                                    <div
                                        onClick={() => navigate(`/solve/${wb.id}`)}
                                        className="cursor-pointer hover:underline text-[#5F360A] font-semibold text-base"
                                    >
                                        {wb.name}
                                    </div>
                                    <div className="text-xs text-[#9A7E5F] mt-1">
                                        작성자: {wb.authorName} / 생성일: {wb.createdAt ? new Date(wb.createdAt).toLocaleDateString() : "-"}
                                    </div>
                                    {/* <div className="text-sm text-[#5F360A] mt-2 line-clamp-2">
                                        {wb.description ?? "설명이 없습니다."}
                                    </div> */}
                                </div>
                            ))}
                        </div>

                        {/* 페이지네이션 */}
                        <div className="mt-8 flex justify-center gap-2 text-sm">
                            <button
                                onClick={() => handleParamChange("page", Math.max(0, page - 1))}
                                disabled={page === 0}
                                className="px-3 py-1 border rounded disabled:opacity-40"
                            >
                                ◀ 이전
                            </button>
                            <span className="px-3 py-1 text-[#5F360A] font-semibold">
                                {page + 1} / {totalPages}
                            </span>
                            <button
                                onClick={() => handleParamChange("page", Math.min(totalPages - 1, page + 1))}
                                disabled={page >= totalPages - 1}
                                className="px-3 py-1 border rounded disabled:opacity-40"
                            >
                                다음 ▶
                            </button>
                        </div>
                    </>
                )}
            </main>
        </>
    );
}