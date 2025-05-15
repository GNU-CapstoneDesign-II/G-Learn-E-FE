// src/components/common/UploadPopup.jsx
import React, { useState, useEffect } from "react";
import {
    getColleges,
    getDepartments,
    getSubjects,
    uploadWorkbook,
} from "../../api/workbookApi.js";

/**
 * @param {{
 *   selectedWorkbooks: { id: number, name: string }[], // ← [{id, name}] 배열
 *   onClose: () => void
 * }} props
 */
export default function UploadPopup({ selectedWorkbooks = [], onClose }) {
    /* ------------------------------------------------------------------ */
    /* 상태                                                                 */
    /* ------------------------------------------------------------------ */
    const [step, setStep] = useState(0);           // 현재 몇 번째 문제집 설정 중?
    const [colleges, setColleges] = useState([]);  // 단과대 리스트
    const [departments, setDepartments] = useState([]); // 학과 리스트
    const [subjects, setSubjects] = useState([]);  // 과목 리스트
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSummary, setUploadSummary] = useState(null);

    // 문제집별 선택 결과  [{collegeId,name, …}] 형태
    const [selections, setSelections] = useState(
        Array.isArray(selectedWorkbooks)
            ? selectedWorkbooks.map(() => ({
                collegeId: null,
                collegeName: "",
                departmentId: null,
                departmentName: "",
                subjectId: null,
                subjectName: "",
            }))
            : []
    );

    /* ------------------------------------------------------------------ */
    /* 단과대 리스트 최초 로드                                              */
    /* ------------------------------------------------------------------ */
    useEffect(() => {
        getColleges()
            .then((res) => setColleges(res.data.data || []))
            .catch(() => setColleges([]));
    }, []);

    /* ------------------------------------------------------------------ */
    /* step 이 바뀔 때 학과·과목 로드                                       */
    /* ------------------------------------------------------------------ */
    useEffect(() => {
        const sel = selections[step];
        if (!sel) return;

        /* 학과 로드 */
        if (sel.collegeId) {
            getDepartments(sel.collegeId)
                .then((res) => setDepartments(res.data.data || []))
                .catch(() => setDepartments([]));
        } else {
            setDepartments([]);
        }

        /* 과목 로드 */
        if (sel.departmentId) {
            getSubjects(sel.departmentId)
                .then((res) => setSubjects(res.data.data || []))
                .catch(() => setSubjects([]));
        } else {
            setSubjects([]);
        }
    }, [step, selections]);

    /* ------------------------------------------------------------------ */
    /* 선택 변경 핸들러                                                     */
    /* ------------------------------------------------------------------ */
    const updateSelection = (patch) =>
        setSelections((prev) => {
            const next = [...prev];
            next[step] = { ...next[step], ...patch };
            return next;
        });

    /* 단과대 선택 */
    const handleCollegeChange = (id) => {
        const found = colleges.find((c) => String(c.id) === String(id));
        updateSelection({
            collegeId: id || null,
            collegeName: found?.collegeName || "",
            departmentId: null,
            departmentName: "",
            subjectId: null,
            subjectName: "",
        });
    };

    /* 학과 선택 */
    const handleDeptChange = (id) => {
        const found = departments.find((d) => String(d.id) === String(id));
        updateSelection({
            departmentId: id || null,
            departmentName: found?.departmentName || "",
            subjectId: null,
            subjectName: "",
        });
    };

    /* 과목 선택 */
    const handleSubjChange = (id) => {
        const found = subjects.find((s) => String(s.id) === String(id));
        updateSelection({
            subjectId: id || null,
            subjectName: found?.subjectName || "",
        });
    };

    /* ------------------------------------------------------------------ */
    /* 업로드 실행                                                          */
    /* ------------------------------------------------------------------ */
    const handleUploadAll = async () => {
        if (isUploading) return;
        setIsUploading(true);
        const results = [];
        for (let i = 0; i < selections.length; i++) {
            const { id, name } = selectedWorkbooks[i];
            const { collegeName, departmentName, subjectName } = selections[i];
            try {
                await uploadWorkbook(id, selections[i].collegeId, selections[i].departmentId, selections[i].subjectId);
                results.push({ success: true });
            } catch (err) {
                results.push({
                    success: false,
                    name,
                    path: `${collegeName} ▸ ${departmentName} ▸ ${subjectName}`
                });
            }
        }
        setIsUploading(false);
        // 요약 상태 설정
        const successCount = results.filter(r => r.success).length;
        const failures = results.filter(r => !r.success);
        setUploadSummary({ total: selections.length, successCount, failures });
    };

    /* ------------------------------------------------------------------ */
    /* JSX                                                                 */
    /* ------------------------------------------------------------------ */
    const currSel = selections[step] || {};
    const currWb = selectedWorkbooks[step] || {};

    // 업로드 요약 뷰
    if (uploadSummary) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-[600px] max-h-[90vh] overflow-auto relative">
                    <h3 className="text-lg font-semibold mb-4">업로드 결과</h3>
                    <p className="mb-2">
                        총 {uploadSummary.total}건 중 <span className="font-medium text-green-600">{uploadSummary.successCount}</span>건 성공,{' '}
                        <span className="font-medium text-red-600">{uploadSummary.failures.length}</span>건 실패
                    </p>
                    {uploadSummary.failures.length > 0 && (
                        <ul className="list-disc list-inside mb-4 text-sm">
                            {uploadSummary.failures.map((f, idx) => (
                                <li key={idx}>
                                    <span className="font-medium">{f.name}</span> — {f.path}
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-[#5f360a] text-white rounded"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[600px] max-h-[90vh] overflow-auto relative">
                {/* ────────── 단계별 입력 ────────── */}
                {step < selections.length ? (
                    <>
                        <h3 className="text-lg font-semibold mb-3">
                            &lt;{currWb.name}&gt; 업로드 위치 지정
                        </h3>

                        {/* 단과대 */}
                        <select
                            className="w-full border px-2 py-1 rounded mb-3"
                            value={currSel.collegeId || ""}
                            onChange={(e) => handleCollegeChange(e.target.value)}
                        >
                            <option value="">단과대 선택</option>
                            {colleges.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.collegeName}
                                </option>
                            ))}
                        </select>

                        {/* 학과 */}
                        <select
                            className="w-full border px-2 py-1 rounded mb-3"
                            value={currSel.departmentId || ""}
                            onChange={(e) => handleDeptChange(e.target.value)}
                            disabled={!currSel.collegeId}
                        >
                            <option value="">학과 선택</option>
                            {departments.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.departmentName}
                                </option>
                            ))}
                        </select>

                        {/* 과목 */}
                        <select
                            className="w-full border px-2 py-1 rounded mb-6"
                            value={currSel.subjectId || ""}
                            onChange={(e) => handleSubjChange(e.target.value)}
                            disabled={!currSel.departmentId}
                        >
                            <option value="">과목 선택</option>
                            {subjects.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.subjectName}
                                </option>
                            ))}
                        </select>

                        {/* 이전/다음 */}
                        <div className="flex justify-between">
                            <button
                                onClick={step === 0 ? onClose : () => setStep(step - 1)}
                                className="px-4 py-2 border rounded hover:bg-gray-100"
                            >
                                이전
                            </button>
                            <button
                                onClick={() => setStep(step + 1)}
                                disabled={!currSel.subjectId}
                                className="px-4 py-2 bg-[#5f360a] text-white rounded disabled:opacity-50"
                            >
                                다음
                            </button>
                        </div>
                    </>
                ) : (
                    /* ────────── 최종 확인 ────────── */
                    <>
                        <h3 className="text-lg font-semibold mb-3">업로드 경로 확인</h3>
                        <ul className="space-y-2 max-h-60 overflow-auto mb-4 pr-2">
                            {selectedWorkbooks.map((wb, idx) => {
                                const sel = selections[idx];
                                return (
                                    <li key={wb.id} className="text-sm leading-snug">
                                        <span className="font-medium text-[#5f360a]">{wb.name}</span>{" "}
                                        — {sel.collegeName} ▸ {sel.departmentName} ▸ {sel.subjectName}
                                    </li>
                                );
                            })}
                        </ul>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setStep(step - 1)}
                                className="px-4 py-2 border rounded hover:bg-gray-100"
                            >
                                이전
                            </button>
                            <button
                                onClick={handleUploadAll}
                                disabled={isUploading}
                                className="px-4 py-2 bg-[#5f360a] text-white rounded disabled:opacity-50"
                            >
                                {isUploading ? "업로드 중…" : "업로드"}
                            </button>
                        </div>
                    </>
                )}

                {/* 닫기 */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
