// src/components/WorkbookDetailPopup.jsx
import React, { useState, useEffect, useCallback } from "react";
import { fetchWorkbookDetail, voteWorkbook } from "../api/privateFolderApi";
import { resetSolveLog } from "../api/problemSolveApi";
import { SEMESTER_LABELS, EXAM_TYPE_LABELS } from "./popupConstants";

export default function WorkbookDetailPopup({ workbookId, isPublic, isSolved, onClose, onEdit }) {
  const [workbook, setWorkbook] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [loading, setLoading] = useState(false);

  // 새 풀이로 시작: 기존 로그를 지우고 팝업
  const handleStartFresh = useCallback(async () => {
    if (!workbook) return;
    setLoading(true);
    try {
      // 1) 기존 임시 저장 / 채점 기록 삭제
      await resetSolveLog(workbook.id);
      // 2) 새 창으로 열기
      window.open(
        `/solve/${workbook.id}?popup=true`,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (err) {
      console.error("새 풀이 시작 중 오류:", err);
      alert("새 문제 풀이 시작에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [workbook]);

  // 나의 풀이 보기: 저장된(실은 채점된) 풀이가 없으면 경고
  const handleViewMySolve = useCallback(() => {
    if (!isSolved) {
      alert("저장된 풀이가 없습니다.");
      return;
    }
    window.open(`/solve/${workbookId}?popup=true`, "_blank");
  }, [isSolved, workbookId]);

  // 워크북 상세 정보 로드
  useEffect(() => {
    if (!workbookId) return;
    let cancelled = false;

    (async () => {
      try {
        const data = await fetchWorkbookDetail(workbookId);
        if (!cancelled) {
          setWorkbook(data);
          setLikes(data.likeCount);
          setDislikes(data.dislikeCount);
        }
      } catch (err) {
        console.error("워크북 상세 정보를 불러오는데 실패했습니다.", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [workbookId]);

  const handleVote = useCallback(
    async (type) => {
      if (loading || !workbook) return;
      setLoading(true);
      try {
        const { likeCount, dislikeCount } = await voteWorkbook(
          workbook.id,
          type
        );
        setLikes(likeCount);
        setDislikes(dislikeCount);
      } catch (err) {
        console.error(err);
        console.error("vote 실패 응답 data:", err.response?.data);
        alert("투표 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    },
    [workbook, loading]
  );

  if (!workbook) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-auto p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white border border-[#e9e1d8] rounded-[2.5rem] shadow-xl w-[95vw] max-w-lg max-h-[90vh] p-8 overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ✕
        </button>

        {/* 타이틀 */}
        <h2 className="text-2xl md:text-3xl font-semibold text-[#5f360a] text-center pb-3 border-b-2 border-[#BDA68A]">
          {workbook.name}
        </h2>

        {/* 정보 필드 */}
        <div className="mt-8 space-y-5 text-[#5f360a] text-base">
          <div className="flex items-center">
            <span className="w-28 font-medium">교수님:</span>
            <span className="flex-1">{workbook.professor}</span>
          </div>
          <div className="flex items-center">
            <span className="w-28 font-medium">시험범위:</span>
            <span className="flex-1">{EXAM_TYPE_LABELS[workbook.examType] ?? workbook.examType}</span>
          </div>
          <div className="flex items-center">
            <span className="w-28 font-medium">커버이미지 ID:</span>
            <span className="flex-1">{workbook.coverImage}</span>
          </div>
          <div className="flex items-center">
            <span className="w-28 font-medium">수강연도:</span>
            <span className="flex-1">{workbook.courseYear}년</span>
          </div>
          <div className="flex items-center">
            <span className="w-28 font-medium">학기:</span>
            <span className="flex-1">{SEMESTER_LABELS[workbook.semester] ?? workbook.semester}</span>
          </div>
          <div className="flex items-center">
            <span className="w-28 font-medium">생성일:</span>
            <span className="flex-1">
              {new Date(workbook.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        {isPublic && (
          <div className="mt-8 flex justify-end">
            {/* 좋아요/싫어요 버튼 */}
            <div className="flex items-center border border-gray-300 rounded-full divide-x divide-gray-300 bg-white">
              <button
                onClick={() => handleVote("LIKE")}
                disabled={loading}
                className="flex items-center space-x-1 px-6 py-2 hover:bg-gray-100 transition disabled:opacity-50 rounded-l-full"
              >
                <span className="text-xl">👍</span>
                <span className="font-medium">{likes}</span>
              </button>
              <button
                onClick={() => handleVote("DISLIKE")}
                disabled={loading}
                className="flex items-center space-x-1 px-6 py-2 hover:bg-gray-100 transition disabled:opacity-50 rounded-r-full"
              >
                <span className="text-xl">👎</span>
                <span className="font-medium">{dislikes}</span>
              </button>
            </div>
          </div>
        )}

        {/* 버튼 그룹 */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={() => onEdit(workbook.id)}
            className="px-6 py-2 border border-[#BDA68A] text-[#5f360a] rounded-full hover:bg-[#F5EFE9] transition"
          >
            정보 편집
          </button>
          {/* 채점된 경우에만 내 풀이 보기 */}
          <button
            onClick={handleViewMySolve}
            className="px-6 py-2 border border-[#BDA68A] text-[#5f360a] rounded-full hover:bg-[#F5EFE9] transition"
          >
            나의 풀이
          </button>

          {/* 항상 새 풀이로 시작 */}
          <button
            onClick={handleStartFresh}
            disabled={loading}
            className="px-6 py-2 bg-[#BDA68A] text-white rounded-full hover:bg-[#A78A64] transition disabled:opacity-50"
          >
            문제 풀기
          </button>
        </div>
      </div>
    </div>
  );
}
