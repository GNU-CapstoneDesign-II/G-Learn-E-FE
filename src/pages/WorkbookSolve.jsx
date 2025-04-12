import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    fetchWorkbook,
    saveSolveLog,
    gradeWorkbook,
    resetSolveLog,
} from '../api/workbookApi';
import ProblemCard from '../components/problem/ProblemCard';
import ProblemNavbar from '../components/problem/ProblemNavbar';
import ConfirmModal from '../components/common/ConfirmModal';

export default function WorkbookSolve() {
    const [workbook, setWorkbook] = useState(null);
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const { workbookId } = useParams();
    const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwidG9rZW5UeXBlIjoiYWNjZXNzIiwiaWF0IjoxNzQ0NDY4ODMzLCJleHAiOjE3NDQ0NzI0MzN9.I0RpOveslIH8yQgn7K-I4OEC87sdvu6JT-WM04z3UX4C0dfRCVWmNQnZ_um9FAeHpgfKkXFOdEojNhNYW2Dajg';

    useEffect(() => {
        fetchWorkbook(workbookId, token).then(({ workbook, problems }) => {
            const initialized = problems.map((p) => {
                const attempt = p.userAttempt ?? {};

                const hasSubmitAnswer =
                    Array.isArray(attempt.submitAnswer) && attempt.submitAnswer.length > 0;

                if (hasSubmitAnswer) return { ...p, userAttempt: attempt };

                const blankCount =
                    p.problem.type === 'BLANK'
                        ? p.problem.title.split('[[$BLANK$]]').length - 1
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

            await saveSolveLog(workbookId, saveData, token);
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

            await gradeWorkbook(workbookId, attempts, token);
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
            await resetSolveLog(workbookId, token);
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert('다시 풀기 실패: ' + err.message);
        } finally {
            setLoading(false);
            setShowConfirm(false);
        }
    };

    const chunkedProblems = [];
    for (let i = 0; i < problems.length; i += 2) {
        chunkedProblems.push(problems.slice(i, i + 2));
    }

    return (
        <div className="relative min-h-screen bg-[#f8f1ea]">
            <ProblemNavbar
                onTempSave={handleTempSave}
                onGrade={handleGrade}
                onReset={handleReset}
                isSolved={workbook?.isSolved}
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
                    <h1 className="text-2xl font-bold text-[#5c4033] mb-8">
                        문제집: {workbook?.name}
                    </h1>
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
                        {chunkedProblems.map((pair, idx) => (
                            <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pair.map((p, i) => {
                                    const isCorrect = p.userAttempt?.isCorrect;
                                    const borderColor =
                                        workbook?.isSolved === true
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
                                {pair.length === 1 && (
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
