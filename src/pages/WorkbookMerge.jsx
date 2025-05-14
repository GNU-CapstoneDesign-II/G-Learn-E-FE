// src/pages/WorkbookEdit.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import EditNavbar from '../components/EditNavbar.jsx';
import ProblemCard from '../components/problem/ProblemCard.jsx';
import MergeConfirmDialog from '../components/workbookmerge/MergeConfirmDialog.jsx';
import {
    fetchMergeProblems,
    updateWorkbookProblems,
    createMergedWorkbook,
} from '../api/WorkbookMergeApi.js';

const WorkbookEdit = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { ids: paramIds } = useParams();

    // URL 파라미터나 location.state.ids 중 하나에서 idString 결정
    const idString = paramIds
        ? paramIds
        : Array.isArray(state?.ids)
            ? state.ids.join(',')
            : '';
    const idList = idString ? idString.split(',').map(n => +n) : [];
    const isMerge = idList.length > 1;
    const targetWorkbookId = idList[0];

    const [problems, setProblems] = useState([]);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMergeModal, setShowMergeModal] = useState(false);

    // 문제 로드
    useEffect(() => {
        if (!idString) return navigate('/folder');
        setLoading(true);
        fetchMergeProblems(idList)
            .then(list => {
                setProblems(list);
                setSelected([]);
            })
            .catch(err => {
                console.error(err);
                alert('문제 불러오기 실패');
            })
            .finally(() => setLoading(false));
    }, [idString, navigate]);

    // 개별 토글
    const toggle = id => {
        setSelected(cur =>
            cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id]
        );
    };

    // 저장/병합 버튼
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

    // 다이얼로그에서 넘어온 제목으로 새 워크북 생성
    const handleMergeConfirm = newTitle => {
        if (!newTitle.trim()) {
            return alert('새 문제집 제목을 입력해주세요.');
        }
        createMergedWorkbook(newTitle.trim(), selected)
            .then(createdWorkbook => {
                setShowMergeModal(false);
                // 생성된 워크북을 state 로 넘겨서 폴더 페이지에서 즉시 리스트에 추가 가능
                navigate('/folder', { state: { newWorkbook: createdWorkbook } });
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
                  relative bg-white rounded-lg shadow p-4 cursor-pointer transition
                  border-4
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
                                        isSolved={true}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <MergeConfirmDialog
                    isOpen={showMergeModal}
                    idList={idList}
                    selectedCount={selected.length}
                    onCancel={() => setShowMergeModal(false)}
                    onConfirm={handleMergeConfirm}
                />
            </div>
        </div>
    );
};

export default WorkbookEdit;
