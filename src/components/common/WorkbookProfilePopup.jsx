import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getWorkbookProfile,
  getWorkbookSolveLog,
  updateWorkbook,
  voteWorkbook,
} from "../../api/workbookApi";
import clsx from "clsx";

const EXAM_OPTIONS = [
  { value: "ALL", label: "전체" },
  { value: "MIDDLE", label: "중간고사" },
  { value: "FINAL", label: "기말고사" },
  { value: "OTHER", label: "기타" },
];
const SEMESTER_OPTIONS = [
  { value: "SPRING", label: "1학기" },
  { value: "SUMMER", label: "여름계절" },
  { value: "FALL", label: "2학기" },
  { value: "WINTER", label: "겨울계절" },
  { value: "OTHER", label: "기타" },
];

// enum 값 → 한글 라벨
const toLabel = (value, list) =>
  list.find((o) => o.value === value)?.label ?? value;

export default function WorkbookProfilePopup({
  workbookId,
  isPublic,
  onClose,
  onUpdated,     // ★ 변경된 워크북을 부모에게 알려주는 콜백
  showVote = true,
}) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [solveLog, setSolveLog] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([getWorkbookProfile(workbookId), getWorkbookSolveLog(workbookId)])
      .then(([p, s]) => {
        setProfile(p.data.data);
        setSolveLog(s.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [workbookId]);

  const isOwner = !isPublic;
  const canVote = isPublic && !isOwner;

  const startEdit = () => {
    setEditForm({
      name: profile.name,
      professor: profile.professor,
      examType:
        EXAM_OPTIONS.find((o) => o.label === profile.examType)?.value ??
        profile.examType,
      semester:
        SEMESTER_OPTIONS.find((o) => o.label === profile.semester)?.value ??
        profile.semester,
      courseYear: profile.courseYear,
    });
    setEditing(true);
  };

  const saveEdit = () => {
    setSubmitting(true);
    const toEnum = (val, list) => list.find((o) => o.value === val)?.value ?? val;
    const payload = {
      name: editForm.name.trim(),
      professor: editForm.professor.trim() || null,
      examType: toEnum(editForm.examType, EXAM_OPTIONS),
      semester: toEnum(editForm.semester, SEMESTER_OPTIONS),
      courseYear:
        editForm.courseYear === "" || editForm.courseYear == null
          ? profile.courseYear
          : Number(editForm.courseYear),
    };
    Object.keys(payload).forEach((k) => payload[k] == null && delete payload[k]);

    updateWorkbook(workbookId, payload)
      .then((res) => {
        const p = res.data.data;
        const patched = {
          id: p.id,
          name: p.name,
          professor: p.professor,
          examType: toLabel(p.examType, EXAM_OPTIONS),
          semester: toLabel(p.semester, SEMESTER_OPTIONS),
          coverImage: p.coverImage,
          createdAt: p.createdAt,
          courseYear: p.courseYear,
          problemCount: p.problemCount,
          likeCount: p.likeCount,
          dislikeCount: p.dislikeCount,
        };
        setProfile({
          ...p,
          examType: toLabel(p.examType, EXAM_OPTIONS),
          semester: toLabel(p.semester, SEMESTER_OPTIONS),
        });
        // ★ 부모에게 변경된 워크북 정보 전달
        onUpdated?.(patched);
        setEditing(false);
      })
      .finally(() => setSubmitting(false));
  };

  const vote = (voteType) => {
    if (!canVote || !showVote) return;
    voteWorkbook(workbookId, voteType)
      .then((res) => {
        setProfile(res.data.data);
        onUpdated?.({
          id: res.data.data.id,
          likeCount: res.data.data.likeCount,
          dislikeCount: res.data.data.dislikeCount,
        });
      })
      .catch(console.error);
  };

  if (loading) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-[480px] max-w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        {/* 제목 */}
        <div>
          <div className="text-2xl font-bold text-[#5F360A]">
            {editing ? (
              <input
                className="w-full border px-2 py-1 rounded"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />
            ) : (
              profile.name
            )}
          </div>
          <div className="text-sm text-[#7B5A38] text-right">
            생성자: {profile.author.nickname}
          </div>
        </div>

        {/* 교수 / 시험 정보 */}
        <div className="space-y-2 text-sm text-[#5F360A]">
          {editing ? (
            <>
              <input
                className="w-full border px-2 py-1 rounded"
                value={editForm.professor}
                placeholder="교수명"
                onChange={(e) =>
                  setEditForm({ ...editForm, professor: e.target.value })
                }
              />
              <select
                className="w-full border px-2 py-1 rounded"
                value={editForm.examType}
                onChange={(e) =>
                  setEditForm({ ...editForm, examType: e.target.value })
                }
              >
                {EXAM_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                className="w-full border px-2 py-1 rounded"
                value={editForm.courseYear}
                onChange={(e) =>
                  setEditForm({ ...editForm, courseYear: e.target.value })
                }
              />
              <select
                className="w-full border px-2 py-1 rounded"
                value={editForm.semester}
                onChange={(e) =>
                  setEditForm({ ...editForm, semester: e.target.value })
                }
              >
                {SEMESTER_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <>
              <p>교수: {profile.professor ?? "-"}</p>
              <p>시험 유형: {profile.examType}</p>
              <p>
                {profile.courseYear}년 {profile.semester} 학기
              </p>
              <p>문제 수: {profile.problemCount}</p>
            </>
          )}
        </div>

        {/* 좋아요/싫어요 */}
        {isPublic && showVote && (
          <div className="flex items-center gap-6">
            <button
              disabled={!canVote}
              className={clsx("flex items-center gap-1", !canVote && "opacity-40")}
              onClick={() => vote("LIKE")}
            >
              👍 {profile.likeCount}
            </button>
            <button
              disabled={!canVote}
              className={clsx("flex items-center gap-1", !canVote && "opacity-40")}
              onClick={() => vote("DISLIKE")}
            >
              👎 {profile.dislikeCount}
            </button>
          </div>
        )}

        {/* 풀이 로그 */}
        <div className="text-xs text-[#7B5A38]">
          풀이 상태: {solveLog.status}
          {solveLog.status === "COMPLETED" &&
            ` / 정답 ${solveLog.correctCount}, 오답 ${solveLog.wrongCount}`}
        </div>

        {/* 푸터 버튼 */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-1 border rounded"
              >
                취소
              </button>
              <button
                disabled={submitting}
                onClick={saveEdit}
                className="px-4 py-1 bg-[#5F360A] text-white rounded"
              >
                저장
              </button>
            </>
          ) : (
            <>
              <button onClick={onClose} className="px-4 py-1 border rounded">
                닫기
              </button>
              {!isPublic && (
                <button
                  onClick={startEdit}
                  className="px-4 py-1 border rounded"
                >
                  정보편집
                </button>
              )}
              <button
                onClick={() => {
                  onClose();
                  navigate(`/solve/${workbookId}`);
                }}
                className="px-4 py-1 bg-[#b9a997] text-white rounded"
              >
                문제 풀이
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
