// src/pages/WorkbookEdit.jsx
import React, {
  useState, useEffect, useLayoutEffect, useRef, useContext,
} from "react";
import { useParams, UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";
import EditNavbar from "../components/EditNavbar.jsx";
import ProblemCard from "../components/problem/ProblemCard.jsx";
import UpIcon from "../assets/arrow-up.png";
import DownIcon from "../assets/arrow-down.png";
import { fetchProblems, updateProblems } from "../api/workbookEditApi.js";
import ConfirmPopup from "../components/common/ConfirmPopup.jsx";
import InformationPopup from "../components/common/InformationPopup.jsx";

export default function WorkbookEdit() {
  const { ids } = useParams();
  const workbookId = Number(ids);

  const [problems, setProblems] = useState([]);
  const [editingId, setEditingId] = useState(null);         // 현재 편집 중 카드 id
  const [selectedIds, setSelectedIds] = useState([]);       // 삭제 선택용
  const [maxHeight, setMaxHeight] = useState(0);            // 카드 높이 정렬
  const problemRefs = useRef({});

  const [infoMsg, setInfoMsg] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [navCallback, setNavCallback] = useState(null);



  /* ─── 1) 문제 로드 ─────────────────────────────────────────── */
  useEffect(() => {
    fetchProblems(workbookId).then(fetched =>
      setProblems(
        fetched.map((p, i) => ({
          ...p,
          problemNumber: i + 1,
          /* 편집 아닌 상태에서도 카드에 답이 채워지도록 userAttempt 초기화 */
          userAttempt: { submitAnswer: p.answers ?? [] },
        }))
      )
    );
  }, [workbookId]);

  /* ─── 2) 카드 최대 높이 계산 ──────────────────────────────── */
  useLayoutEffect(() => {
    const recalc = () => {
      const heights = Object.values(problemRefs.current).map(
        el => el?.offsetHeight || 0
      );
      setMaxHeight(heights.length ? Math.max(...heights) : 0);
    };
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [problems]);

  /* ─── 3) 카드 이동(순서) ──────────────────────────────────── */
  const move = (idx, dir) => {
    setProblems(prev => {
      const arr = [...prev];
      const [moved] = arr.splice(idx, 1);
      arr.splice(idx + dir, 0, moved);
      return arr.map((p, i) => ({ ...p, problemNumber: i + 1 }));
    });
    const movedId = problems[idx].id;
    setTimeout(() => {
      problemRefs.current[movedId]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 0);
    setIsDirty(true);
  };

  /* ─── 4) 로컬 수정 로직 ──────────────────────────────────── */
  const updateTitle = (id, txt) => {
    setProblems(pv => pv.map(p =>
      p.id === id ? { ...p, title: txt } : p
    ));
    setIsDirty(true);
  };
  const updateAnswer = (id, arr) => {
    setProblems(pv =>
      pv.map(p =>
        p.id === id
          ? { ...p, answers: arr, userAttempt: { submitAnswer: arr } }
          : p
      )
    );
    setIsDirty(true);
  };
  const updateExplanation = (id, txt) => {
    setProblems(pv =>
      pv.map(p => (p.id === id ? { ...p, explanation: txt } : p))
    );
    setIsDirty(true);
  };



  /* ─── 5) 카드 다중 선택/삭제 ─────────────────────────────── */
  const toggleSelect = id =>
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    const nums = problems
      .filter(p => selectedIds.includes(p.id))
      .map(p => p.problemNumber)
      .join(", ");
    setConfirm({
      msg: `문제 번호 ${nums}번을 정말 삭제할까요?`,
      onYes: () => {
        setProblems(prev => {
          const filtered = prev.filter(p => !selectedIds.includes(p.id));
          return filtered.map((p, i) => ({ ...p, problemNumber: i + 1 }));
        });
        setSelectedIds([]);
        setInfoMsg("선택한 문제가 삭제되었습니다.");
      },
    });
    setIsDirty(true);
  };

  /* ─── 6) 최종 저장 ───────────────────────────────────────── */
  const handleFinalSave = () => {
    setConfirm({
      msg: "모든 변경 사항을 저장할까요?",
      onYes: async () => {
        await updateProblems(workbookId, problems);
        setEditingId(null);
        setIsDirty(false);
        setInfoMsg("최종 저장되었습니다.");
      },
    });
  };

  /* ─── 7) 렌더링 ───────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#FFFDF9]">

      {confirm && (
        <ConfirmPopup
          message={confirm.msg}
          onConfirm={() => {
            confirm.onYes();
            setConfirm(null);
          }}
          onCancel={() => setConfirm(null)}
        />
      )}

      {infoMsg && (
        <InformationPopup
          message={infoMsg}
          onClose={() => setInfoMsg(null)}
        />
      )}

      {navCallback && (
        <ConfirmPopup
          message="저장하지 않은 변경 내용이 모두 사라집니다. 정말 나가시겠습니까?"
          onConfirm={() => {
            navCallback();      // 실제 이동
            setNavCallback(null);
          }}
          onCancel={() => setNavCallback(null)}
        />
      )}

      <EditNavbar
        onSaveClick={handleFinalSave}
        onDeleteClick={handleDeleteSelected}
        isDirty={isDirty}
        onNavigateConfirm={cb => setNavCallback(() => cb)}
      />

      <div className="pt-16 p-6 space-y-8">
        {problems.map((p, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === problems.length - 1;
          const isEdit = editingId === p.id;
          const isSelected = selectedIds.includes(p.id);

          return (
            <div
              key={p.id}
              ref={el => (problemRefs.current[p.id] = el)}
              className="relative"
              onClick={() => !isEdit && toggleSelect(p.id)}
            >
              <div
                className={`flex rounded-2xl overflow-hidden ${isSelected
                  ? "border-4 border-[#8B623F]"
                  : "border border-[#EDE1D2]"
                  }`}
                style={{
                  height: maxHeight ? `${maxHeight}px` : "auto",
                }}
              >
                {/* ───── Left 45% : ProblemCard ───── */}
                <div
                  className={`w-[45%] p-6 ${!isEdit ? "pointer-events-none" : ""
                    }`}
                >
                  {/* 제목 편집 (빈칸 문제 제외) */}
                  {isEdit && p.type !== "BLANK" && (
                    <input
                      value={p.title}
                      onChange={e => updateTitle(p.id, e.target.value)}
                      className="w-full mb-4 px-3 py-2 border rounded-lg text-sm"
                    />
                  )}

                  <ProblemCard
                    problem={p}
                    userAttempt={p.userAttempt}
                    onUserAttemptChange={(probId, arr) => {
                      if (!isEdit) return;
                      updateAnswer(probId, arr);
                    }}
                    isSolved={!isEdit} /* 편집 아닐 땐 답 입력금지 */
                  />
                </div>

                {/* ───── Middle 45% : Explanation ───── */}
                <div className="w-[45%] p-4 bg-[#FFF4E5] flex flex-col">
                  {isEdit ? (
                    <textarea
                      value={p.explanation}
                      onChange={e =>
                        updateExplanation(p.id, e.target.value)
                      }
                      placeholder="해설을 입력하세요"
                      className="flex-1 p-2 border border-[#DACEC0] rounded-lg resize-none"
                    />
                  ) : (
                    <p className="text-sm whitespace-pre-line">
                      {p.explanation || "—"}
                    </p>
                  )}
                </div>

                {/* ───── Right 10% : Controls ───── */}
                <div className="w-[10%] relative">
                  {!isFirst && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        move(idx, -1);
                      }}
                      className="absolute top-10 left-1/2 -translate-x-1/2 p-2"
                    >
                      <img
                        src={UpIcon}
                        alt="위로 이동"
                        className="w-12 h-12"
                      />
                    </button>
                  )}

                  {/* 편집 / 완료 토글 */}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setEditingId(isEdit ? null : p.id);
                    }}
                    className={`absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 
                      px-4 py-1.5 rounded-full text-xs font-medium ${isEdit
                        ? "bg-[#8B623F] text-white"
                        : "bg-[#F0E8DF] text-[#5C4033]"
                      }`}
                  >
                    {isEdit ? "완료" : "문제 편집"}
                  </button>

                  {!isLast && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        move(idx, +1);
                      }}
                      className="absolute bottom-10 left-1/2 -translate-x-1/2 p-2"
                    >
                      <img
                        src={DownIcon}
                        alt="아래로 이동"
                        className="w-12 h-12"
                      />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
