// src/components/common/WorkbookProfilePopup.jsx
import React, { useEffect, useState } from "react";
import { getWorkbookProfile, getWorkbookSolveLog, updateWorkbook, voteWorkbook } from "../../api/workbookApi"; // 헬퍼에 정의해두면 import 정리 OK
import clsx from "clsx";

export default function WorkbookProfilePopup({ workbookId, isPublic, onClose }) {
  /* ── 상태 ── */
  const [profile, setProfile] = useState(null);   // WorkbookProfileResponse
  const [solveLog, setSolveLog] = useState(null); // SolveLogResponse
  const [editing, setEditing]   = useState(false);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* ── 로드 ── */
  useEffect(() => {
    Promise.all([
      getWorkbookProfile(workbookId),
      getWorkbookSolveLog(workbookId),
    ])
      .then(([p, s]) => {
        setProfile(p.data.data);
        setSolveLog(s.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [workbookId]);

  const isOwner = !isPublic; // 개인 = 무조건 소유자
  const canVote = isPublic && !isOwner;

  /* ── 편집 핸들 ── */
  const startEdit = () => {
    setEditForm({
      name:        profile.name,
      professor:   profile.professor,
      examType:    profile.examType,
      courseYear:  profile.courseYear,
      semester:    profile.semester,
    });
    setEditing(true);
  };

  const saveEdit = () => {
    setSubmitting(true);
    updateWorkbook(workbookId, editForm)
      .then(res => {
        setProfile(res.data.data);
        setEditing(false);
      })
      .finally(() => setSubmitting(false));
  };

  /* ── 좋아요/싫어요 ── */
  const vote = voteType => {
    if (!canVote) return;
    voteWorkbook(workbookId, voteType)
      .then(res => setProfile(res.data.data))
      .catch(console.error);
  };

  if (loading) return null; // or 스켈레톤

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-[480px] max-w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        {/* 제목 */}
        <h2 className="text-2xl font-bold text-[#5F360A]">
          {editing ? (
            <input
              className="w-full border px-2 py-1 rounded"
              value={editForm.name}
              onChange={e => setEditForm({ ...editForm, name: e.target.value })}
            />
          ) : (
            profile.name
          )}
        </h2>

        {/* 교수 / 시험 정보 */}
        <div className="space-y-2 text-sm text-[#5F360A]">
          {editing ? (
            <>
              <input
                className="w-full border px-2 py-1 rounded"
                value={editForm.professor}
                placeholder="교수명"
                onChange={e =>
                  setEditForm({ ...editForm, professor: e.target.value })
                }
              />
              <select
                className="w-full border px-2 py-1 rounded"
                value={editForm.examType}
                onChange={e =>
                  setEditForm({ ...editForm, examType: e.target.value })
                }
              >
                <option value="MIDDLE">중간</option>
                <option value="FINAL">기말</option>
                <option value="OTHER">기타</option>
              </select>
              {/* 연도 / 학기 */}
              <input
                type="number"
                className="w-full border px-2 py-1 rounded"
                value={editForm.courseYear}
                onChange={e =>
                  setEditForm({ ...editForm, courseYear: e.target.value })
                }
              />
              <select
                className="w-full border px-2 py-1 rounded"
                value={editForm.semester}
                onChange={e =>
                  setEditForm({ ...editForm, semester: e.target.value })
                }
              >
                <option value="SPRING">1학기</option>
                <option value="FALL">2학기</option>
              </select>
            </>
          ) : (
            <>
              <p>교수: {profile.professor ?? "-"}</p>
              <p>
                시험: {profile.examType} / {profile.courseYear}년{" "}
                {profile.semester}
              </p>
              <p>문제 수: {profile.problemCount}</p>
            </>
          )}
        </div>

        {/* 좋아요/싫어요 */}
        {isPublic && (
          <div className="flex items-center gap-6">
            <button
              disabled={!canVote}
              className={clsx(
                "flex items-center gap-1",
                !canVote && "opacity-40"
              )}
              onClick={() => vote("LIKE")}
            >
              👍 {profile.likeCount}
            </button>
            <button
              disabled={!canVote}
              className={clsx(
                "flex items-center gap-1",
                !canVote && "opacity-40"
              )}
              onClick={() => vote("DISLIKE")}
            >
              👎 {profile.dislikeCount}
            </button>
          </div>
        )}

        {/* 풀이 로그 간략 */}
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
                  window.location.href = `/solve/${workbookId}`;
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
