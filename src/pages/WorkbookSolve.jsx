// src/pages/WorkbookSolve.jsx
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
    fetchWorkbook,
    saveSolveLog,
    gradeWorkbook,
    resetSolveLog,
} from '../api/problemSolveApi';
import ProblemCard from '../components/problem/ProblemCard';
import ProblemNavbar from '../components/problem/ProblemNavbar';
import ConfirmModal from '../components/common/ConfirmModal';

export default function WorkbookSolve() {
    const [workbook, setWorkbook] = useState(null);
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const { workbookId } = useParams();
    const hasFetched = useRef(false); // 중복 요청 방지용
    const [layoutMode, setLayoutMode] = useState('grid'); // 보기 방식

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchWorkbook(workbookId).then(({ workbook, problems }) => {
            const initialized = problems.map((p) => {
                const attempt = p.userAttempt ?? {};
                const hasSubmitAnswer = Array.isArray(attempt.submitAnswer) && attempt.submitAnswer.length > 0;

                if (hasSubmitAnswer) return { ...p, userAttempt: attempt };

                const blankCount =
                    p.problem.type === 'BLANK'
                        ? p.problem.title.split('[[BLANK]]').length - 1
                        : 0;

                const defaultAnswer =
                    p.problem.type === 'BLANK'
                        ? Array(blankCount).fill('')
                        : p.problem.type === 'DESCRIPTIVE'
                            ? ['']
                            : [];

                return {
                    ...p,
                    userAttempt: { submitAnswer: defaultAnswer },
                };
            });

            setWorkbook(workbook);
            setProblems(initialized);
        });
    }, [workbookId]);

    const handleUserAttemptChange = (problemId, submitAnswer) => {
        setProblems((prev) =>
            prev.map((p) =>
                p.problem.id === problemId
                    ? { ...p, userAttempt: { ...(p.userAttempt || {}), submitAnswer } }
                    : p
            )
        );
    };

    const handleTempSave = async () => {
        try {
            const saveData = problems.map((p) => ({
                problemId: p.problem.id,
                submitAnswer: p.userAttempt?.submitAnswer ?? [],
            }));
            await saveSolveLog(workbookId, saveData);
            alert('임시 저장 완료!');
        } catch (err) {
            console.error(err);
            alert('임시 저장 실패: ' + err.message);
        }
    };

    const handleGrade = async () => {
        try {
            setLoading(true);
            const attempts = problems.map((p) => ({
                problemId: p.problem.id,
                submitAnswer: p.userAttempt?.submitAnswer ?? [],
            }));
            await gradeWorkbook(workbookId, attempts);
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert('채점 실패: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setShowConfirm(true);
    };

    const confirmReset = async () => {
        try {
            setLoading(true);
            await resetSolveLog(workbookId);
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert('다시 풀기 실패: ' + err.message);
        } finally {
            setLoading(false);
            setShowConfirm(false);
        }
    };

    const itemsPerRow = layoutMode === 'grid' ? 2 : 1;
    const chunkedProblems = [];
    for (let i = 0; i < problems.length; i += itemsPerRow) {
        chunkedProblems.push(problems.slice(i, i + itemsPerRow));
    }

    return (
        <div className="relative min-h-screen bg-[#f8f1ea]">
            <ProblemNavbar
                onTempSave={handleTempSave}
                onGrade={handleGrade}
                onReset={handleReset}
                isSolved={workbook?.isSolved}
                layoutMode={layoutMode}
                onLayoutChange={setLayoutMode}
            />

            {loading && (
                <div className="absolute inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
                    <div className="text-white text-xl font-bold animate-pulse">채점 중...</div>
                </div>
            )}

            {showConfirm && (
                <ConfirmModal
                    message={'선택한 문제 풀이를 초기화하시겠습니까?\n이 작업은 되돌릴 수 없습니다.'}
                    onCancel={() => setShowConfirm(false)}
                    onConfirm={confirmReset}
                />
            )}

            <div className="px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* <h1 className="text-2xl font-bold text-[#5c4033] mb-8">
                        문제집: {workbook?.name}
                    </h1> */}
                    {workbook?.isSolved && (
                        <div className="mb-6 text-[#5c4033] text-base font-medium">
                            <span className="text-green-600 font-semibold">정답 {workbook.correctCount}</span>{' '}
                            <span className="text-red-500 font-semibold ml-4">오답 {workbook.wrongCount}</span>{' '}
                            <span className="ml-4">
                                총 {workbook.correctCount + workbook.wrongCount}문제 중 {workbook.correctCount}개 정답
                            </span>
                        </div>
                    )}

                    <div className="space-y-6">
                        {chunkedProblems.map((row, idx) => (
                            <div
                                key={idx}
                                // list 모드면 1열, grid 모드면 md:2열
                                className={`grid grid-cols-1 ${layoutMode === 'grid' ? 'md:grid-cols-2' : ''} gap-6`}
                            >
                                {row.map((p, i) => {
                                    const isCorrect = p.userAttempt?.isCorrect;
                                    const borderColor =
                                        workbook?.isSolved
                                            ? isCorrect
                                                ? 'border-green-500 border-2'
                                                : 'border-red-500 border-2'
                                            : 'border-[#e2e2e2]';

                                    return (
                                        <div
                                            key={i}
                                            className={`bg-white rounded-2xl shadow-md border ${borderColor} p-6 h-fit`}
                                        >
                                            <ProblemCard
                                                problem={p.problem}
                                                userAttempt={p.userAttempt}
                                                onUserAttemptChange={handleUserAttemptChange}
                                                isSolved={workbook?.isSolved}
                                            />
                                        </div>
                                    );
                                })}
                                {row.length < itemsPerRow && (
                                    <div className="bg-gray-100 rounded-2xl border border-dashed border-gray-300 p-6 h-fit" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
