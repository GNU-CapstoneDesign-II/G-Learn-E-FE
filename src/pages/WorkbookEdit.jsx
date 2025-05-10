// src/pages/WorkbookEdit.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import EditNavbar from '../components/EditNavbar.jsx';
import ProblemCard from '../components/problem/ProblemCard.jsx';
import {
    fetchMergeProblems,
    updateWorkbookProblems,
    createMergedWorkbook,
} from '../api/WorkbookEditApi.js';

const WorkbookEdit = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { ids: paramIds } = useParams();

    // paramIds or state.ids → 문자열
    const idString = paramIds
        ? paramIds
        : Array.isArray(state?.ids)
            ? state.ids.join(',')
            : '';

    // 숫자 배열
    const idList = idString ? idString.split(',').map(n => +n) : [];
    const isMerge = idList.length > 1;
    const targetWorkbookId = idList[0];

    const [problems, setProblems] = useState([]);
    const [selected, setSelected] = useState([]);           // 초기에는 아무것도 선택 안 됨
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [showMergeModal, setShowMergeModal] = useState(false);

    useEffect(() => {
        if (!idString) {
            navigate('/folder');
            return;
        }
        setLoading(true);
        fetchMergeProblems(idList)
            .then(list => {
                setProblems(list);
                setSelected([]);                               // 로드 후 선택 초기화
            })
            .catch(err => {
                console.error(err);
                alert('문제 불러오기 실패');
            })
            .finally(() => setLoading(false));
    }, [idString, navigate]);

    const toggle = id => {
        setSelected(cur =>
            cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id]
        );
    };

    const handleSave = () => {
        if (selected.length > 30) {
            return alert('문제 수가 너무 많습니다. 전체 문제를 30개 이하로 설정해주세요.');
        }
        if (isMerge) {
            setShowMergeModal(true);
        } else {
            updateWorkbookProblems(targetWorkbookId, selected)
                .then(() => navigate('/folder'))
                .catch(e => alert(e.message));
        }
    };

    const handleMergeConfirm = () => {
        if (!title.trim()) return alert('새 문제집 제목을 입력해주세요.');
        createMergedWorkbook(title, selected)
            .then(() => {
                setShowMergeModal(false);
                navigate('/folder');
            })
            .catch(e => alert(e.message));
    };

    return (
        <div className="min-h-screen bg-[#FAF5EF]">
            <EditNavbar onSaveClick={handleSave} />

            <div className="pt-16 px-6 pb-8 max-w-5xl mx-auto">
                {loading ? (
                    <div className="flex justify-center py-20 text-gray-500">
                        로딩 중…
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-6 items-start">
                        {problems.map(p => (
                            <div
                                key={p.id}
                                className={`
                                    relative bg-white rounded-lg shadow p-4 cursor-pointer transition border-4
                                    ${selected.includes(p.id)
                                        ? 'border-[#8B623F]'
                                        : 'border-gray-300 hover:shadow-md'}
                `}
                                onClick={() => toggle(p.id)}
                            >
                                <div className="pointer-events-none">
                                    <ProblemCard
                                        problem={p}
                                        userAttempt={null}
                                        onUserAttemptChange={() => { }}
                                        isSolved={false}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showMergeModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40">
                        <div className="bg-white rounded-lg p-6 w-80">
                            <p className="mb-4 text-gray-700">
                                문제집 {idList.join(', ')}을(를) 합치시겠습니까? <br />
                                선택된 문제: {selected.length}문제
                            </p>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none"
                                placeholder="새 문제집 제목을 입력하세요"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setShowMergeModal(false)}
                                    className="px-4 py-1 border border-[#8B623F] text-[#8B623F] rounded hover:bg-[#F9F1E8]"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleMergeConfirm}
                                    className="px-4 py-1 bg-[#8B623F] text-white rounded hover:bg-[#A0795B]"
                                >
                                    생성
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkbookEdit;
