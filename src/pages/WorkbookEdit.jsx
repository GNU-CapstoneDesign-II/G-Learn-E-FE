import React, {
    useState,
    useEffect,
    useLayoutEffect,
    useRef
} from 'react';
import { useParams } from 'react-router-dom';
import EditNavbar from '../components/EditNavbar.jsx';
import ProblemCard from '../components/problem/ProblemCard.jsx';
import UpIcon from '../assets/arrow-up.png';
import DownIcon from '../assets/arrow-down.png';
import { fetchProblems, updateProblems } from '../api/WorkbookEditApi.js';

export default function WorkbookEdit() {
    const { ids } = useParams();
    const workbookId = Number(ids);

    const [problems, setProblems] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [maxHeight, setMaxHeight] = useState(0);
    const problemRefs = useRef({});

    // Load problems
    useEffect(() => {
        fetchProblems(workbookId).then(fetched =>
            setProblems(
                fetched.map((p, i) => ({ ...p, problemNumber: i + 1 }))
            )
        );
    }, [workbookId]);

    // Calculate max card height
    useLayoutEffect(() => {
        const recalc = () => {
            const heights = Object.values(problemRefs.current).map(
                el => el?.offsetHeight || 0
            );
            const max = heights.length ? Math.max(...heights) : 0;
            setMaxHeight(max);
        };
        recalc();
        window.addEventListener('resize', recalc);
        return () => window.removeEventListener('resize', recalc);
    }, [problems]);

    // Move order
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
                behavior: 'smooth',
                block: 'center'
            });
        }, 0);
    };

    // Local updates
    const updateAnswer = (id, ans) => {
        setProblems(pv =>
            pv.map(p => (p.id === id ? { ...p, answers: [ans] } : p))
        );
    };
    const updateExplanation = (id, txt) => {
        setProblems(pv =>
            pv.map(p => (p.id === id ? { ...p, explanation: txt } : p))
        );
    };

    // Final save to backend
    const handleFinalSave = async () => {
        await updateProblems(workbookId, problems);
        setEditingId(null);
        alert('최종 저장되었습니다.');
    };

    // Select/deselect cards
    const toggleSelect = id => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    // Delete selected cards
    const handleDeleteSelected = () => {
        setProblems(prev => {
            const filtered = prev.filter(p => !selectedIds.includes(p.id));
            return filtered.map((p, i) => ({ ...p, problemNumber: i + 1 }));
        });
        setSelectedIds([]);
    };

    return (
        <div className="min-h-screen bg-[#FFFDF9]">
            <EditNavbar
                onSaveClick={handleFinalSave}
                onDeleteClick={handleDeleteSelected}
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
                                className={`flex rounded-2xl overflow-hidden ${isSelected ? 'border-4 border-[#8B623F]' : 'border border-[#EDE1D2]'
                                    }`}
                                style={{ height: maxHeight ? `${maxHeight}px` : 'auto' }}
                            >
                                {/* Left 45%: ProblemCard */}
                                <div className={`w-[45%] p-6 ${!isEdit ? 'pointer-events-none' : ''}`}>
                                    <ProblemCard
                                        problem={p}
                                        userAttempt={p.answers[0]}
                                        onUserAttemptChange={val => {
                                            if (!isEdit) return;
                                            const answerValue = typeof val === 'number' ? p.options[val] : val;
                                            updateAnswer(p.id, answerValue);
                                        }}
                                        isSolved={false}
                                    />
                                </div>

                                {/* Middle 45%: Answer & Explanation */}
                                <div className="w-[45%] p-4 bg-[#FFF4E5] flex flex-col">
                                    {!isEdit ? (
                                        <>
                                            <p className="font-semibold mb-2">정답: {p.answers[0] ?? '—'}</p>
                                            <p className="text-sm whitespace-pre-line">{p.explanation || '—'}</p>
                                        </>
                                    ) : (
                                        <textarea
                                            value={p.explanation}
                                            onChange={e => updateExplanation(p.id, e.target.value)}
                                            placeholder="해설을 입력하세요"
                                            className="flex-1 p-2 border border-[#DACEC0] rounded-lg resize-none"
                                        />
                                    )}
                                </div>

                                {/* Right 10%: Controls */}
                                <div className="w-[10%] relative">
                                    {!isFirst && (
                                        <button
                                            onClick={e => { e.stopPropagation(); move(idx, -1); }}
                                            className="absolute top-10 left-1/2 transform -translate-x-1/2 p-2"
                                        >
                                            <img src={UpIcon} alt="위로 이동" className="w-12 h-12" />
                                        </button>
                                    )}

                                    <button
                                        onClick={e => { e.stopPropagation(); setEditingId(isEdit ? null : p.id); }}
                                        className={`absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-full text-sm font-medium ${isEdit ? 'top-1/2 -translate-y-1/2' : 'top-1/2 -translate-y-1/2'} px-2 py-1 rounded-full text-xs font-medium ${isEdit ? 'bg-[#8B623F] text-white' : 'bg-[#F0E8DF] text-[#5C4033]'}`}
                                    >
                                        {isEdit ? '완료' : '문제 편집'}
                                    </button>

                                    {!isLast && (
                                        <button
                                            onClick={e => { e.stopPropagation(); move(idx, +1); }}
                                            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 p-2"
                                        >
                                            <img src={DownIcon} alt="아래로 이동" className="w-12 h-12" />
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
