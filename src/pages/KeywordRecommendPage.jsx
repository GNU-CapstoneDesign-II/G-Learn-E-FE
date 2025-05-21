import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getRelativeKeywordWorkbooks } from "../api/workbookApi"; // ✱ 새 API 호출 함수
import Navbar from "../components/Navbar";

export default function KeywordRecommendPage() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);

  /* 쿼리 파라미터 */
  const kw   = params.get("kw")   ?? "";
  const page = parseInt(params.get("page") ?? "0", 10);
  const size = parseInt(params.get("size") ?? "10", 10);

  /* 상태 */
  const [results, setResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  /* 데이터 로드 */
  useEffect(() => {
    if (!kw) return;
    setLoading(true);

    getRelativeKeywordWorkbooks(kw, page, size)
      .then((res) => {
        const list = res.data.data || [];
        setResults(
          list.map((w) => ({
            id: w.id,
            name: w.name,
            professor: w.professor,
            year: w.courseYear,
            semester: w.semester,
            createdAt: w.createdAt,
            like: w.likeCount,
            dislike: w.dislikeCount,
          }))
        );
        setTotalCount(list.length); // ✱ API에 total 값이 있으면 교체
      })
      .catch((err) => console.error("연관 키워드 조회 실패:", err))
      .finally(() => setLoading(false));
  }, [kw, page, size]);

  const handleParamChange = (key, value) => {
    params.set(key, value);
    if (key !== "page") params.set("page", "0");
    navigate(`/keyword?${params.toString()}`);
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / size));

  return (
    <>
      <Navbar initialSearch={kw} />
      <main className="mt-[65px] p-8 min-h-screen bg-[#F9F4ED]">
        {/* 키워드 정보 */}
        <div className="bg-white border border-[#E6CEBA] rounded-lg p-6 mb-6 shadow">
          <p className="text-sm text-[#7B5A38]">
            키워드
            <span className="text-red-600 font-bold"> "{kw}" </span>
            와(과) 연관된 문제집은
            <span className="font-bold text-[#5F360A]">
              {" "}
              {totalCount.toLocaleString()}건
            </span>
            입니다.
          </p>
        </div>

        {/* 결과 */}
        {loading ? (
          <div>로딩 중…</div>
        ) : results.length === 0 ? (
          <div className="text-center text-[#9A7E5F]">검색 결과가 없습니다.</div>
        ) : (
          <>
            <div className="space-y-6">
              {results.map((wb) => (
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
                    교수: {wb.professor ?? "-"} / {wb.year}년 {wb.semester}학기 /
                    생성일: {wb.createdAt ? new Date(wb.createdAt).toLocaleDateString() : "-"}
                  </div>
                  <div className="text-xs text-[#9A7E5F] mt-1">
                    👍 {wb.like} &nbsp;|&nbsp; 👎 {wb.dislike}
                  </div>
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            <div className="mt-8 flex justify-center gap-2 text-sm">
              <button
                onClick={() =>
                  handleParamChange("page", Math.max(0, page - 1))
                }
                disabled={page === 0}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                ◀ 이전
              </button>
              <span className="px-3 py-1 text-[#5F360A] font-semibold">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() =>
                  handleParamChange("page", Math.min(totalPages - 1, page + 1))
                }
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
