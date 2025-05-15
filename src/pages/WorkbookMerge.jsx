// src/pages/WorkbookEdit.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import EditNavbar from "../components/EditNavbar.jsx";
import ProblemCard from "../components/problem/ProblemCard.jsx";
import MergeConfirmDialog from "../components/workbookmerge/MergeConfirmDialog.jsx";
import { fetchMergeProblems, mergeWorkbook } from "../api/WorkbookMergeApi.js";
import ConfirmPopup from "../components//common/ConfirmPopup.jsx";

const WorkbookEdit = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { ids = [], titles = [] } = state || {};

    /* ───────────────────────────────────────────────
     * ① 병합 대상 워크북 ID 목록·편집/병합 모드 판정
     * ─────────────────────────────────────────────── */
    const idList = Array.isArray(ids) ? ids : [];

    /* ───────────────────────────────────────────────
     * ② 화면 상태
     * ─────────────────────────────────────────────── */
    const [problems, setProblems] = useState([]);   // 모든 문제
    const [selected, setSelected] = useState([]);   // 선택된 문제 id
    const [loading, setLoading] = useState(true);
    const [showMergeModal, setShow] = useState(false);

    const [confirm, setConfirm] = useState(null);
    const [navCallback, setNavCallback] = useState(null);

    /* ───────────────────────────────────────────────
     * ③ 문제 로드
     * ─────────────────────────────────────────────── */
    useEffect(() => {
        if (idList.length === 0) return navigate("/folder");

        setLoading(true);
        fetchMergeProblems(idList)
            .then(list => {
                setProblems(list);
                setSelected([]);
            })
            .catch(err => {
                console.error(err);
                alert("문제 불러오기 실패");
                navigate("/folder");
            })
            .finally(() => setLoading(false));
    }, [idList, navigate]);

    /* ───────────────────────────────────────────────
     * ④ 문제 선택 토글
     * ─────────────────────────────────────────────── */
    const toggle = id =>
        setSelected(cur =>
            cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id]
        );

    /* ──────────── ① 선택 삭제 버튼 ──────────── */
    const handleDelete = () => {
        if (selected.length === 0) {
            alert("삭제할 문제를 선택하세요.");
            return;
        }
        // 화면에서만 우선 제거(백엔드 반영은 이후 저장 시 mergeWorkbook 에 포함 X)
        setProblems(cur => {
            // 1) 선택되지 않은 문제만 남기기
            const remain = cur.filter(p => !selected.includes(p.id));

            // 2) problemNumber를 1,2,3… 순서로 재설정
            return remain.map((p, idx) => ({
                ...p,
                problemNumber: idx + 1          // ★ 여기!
            }));
        });
        setSelected([]);          // 선택 상태 초기화
    };
    /* ───────────────────────────────────────────────
     * ⑤ 저장 / 병합 버튼
     * ─────────────────────────────────────────────── */
    const handleSave = () => {
        if (selected.length > 30) {
            alert("문제 수가 너무 많습니다. 전체 문제를 30개 이하로 설정해주세요.");
            return;
        }

        const selectedProblems = problems.filter(p => selected.includes(p.id));
        if (selectedProblems.length === 0) {
            alert("편집할 문제를 하나 이상 선택하세요.");
            return;
        }
        setShow(true);
    };

    /* ───────────────────────────────────────────────
     * ⑥ 병합 다이얼로그 확인
     * ─────────────────────────────────────────────── */
    const handleMergeConfirm = newTitle => {
        const trimmed = newTitle.trim();
        if (!trimmed) {
            alert("새 문제집 제목을 입력해주세요.");
            return;
        }

        const selectedProblems = problems.filter(p => selected.includes(p.id));
        mergeWorkbook(trimmed, selectedProblems)
            .then(createdWorkbook => {
                setShow(false);
                navigate("/folder", { state: { newWorkbook: createdWorkbook } });
            })
            .catch(e => alert(e.message));
    };

    /* ───────────────────────────────────────────────
     * ⑦ Render
     * ─────────────────────────────────────────────── */
    return (
        <div className="min-h-screen bg-[#FAF5EF]">
            {/* 상단 저장/병합 네비게이션 */}
            <EditNavbar
                onSaveClick={handleSave}
                onDeleteClick={handleDelete}
                isDirty={true}
                onNavigateConfirm={cb => setNavCallback(() => cb)}
            />

            {/* 문제 리스트 */}
            <div className="pt-16 px-6 pb-8 max-w-5xl mx-auto">
                {loading ? (
                    <div className="flex justify-center py-20 text-gray-500">로딩 중…</div>
                ) : (
                    <div className="grid grid-cols-2 gap-6 items-start">
                        {problems.map(p => (
                            <div
                                key={p.id}
                                className={`
                  relative bg-white rounded-lg shadow p-4 cursor-pointer transition
                  border-4
                  ${selected.includes(p.id)
                                        ? "border-[#8B623F]"
                                        : "border-gray-300 hover:shadow-md"
                                    }
                `}
                                onClick={() => toggle(p.id)}
                            >
                                <div className="pointer-events-none">
                                    <ProblemCard
                                        problem={p}
                                        userAttempt={null}
                                        onUserAttemptChange={() => { }}
                                        isSolved={true}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
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

                {/* 병합 제목 입력 다이얼로그 */}
                <MergeConfirmDialog
                    isOpen={showMergeModal}
                    idList={idList}
                    titleList={titles}
                    selectedCount={selected.length}
                    onCancel={() => setShow(false)}
                    onConfirm={handleMergeConfirm}
                />
            </div>
        </div>
    );
};

export default WorkbookEdit;
