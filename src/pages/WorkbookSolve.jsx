import { useEffect, useState } from 'react';
import { fetchWorkbook } from '../api/workbookApi';
import { useParams } from "react-router-dom";
import ProblemCard from '../components/problem/ProblemCard';
import ProblemNavbar from '../components/problem/ProblemNavbar';

export default function WorkbookSolve() {
    const [workbook, setWorkbook] = useState(null);
    const [problems, setProblems] = useState([]);
    const { workbookId } = useParams();
    // 실제로는 로그인 상태에서 가져오기
    const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwidG9rZW5UeXBlIjoiYWNjZXNzIiwiaWF0IjoxNzQ0MzgyMjMxLCJleHAiOjE3NDQzODU4MzF9.LxmqPUaZKdCWKFfo3USgstU6QylaEs6MdUSaGmOvLq9brvm8Vg8nEGLrJpRheP9ZEv1yxuuxbn9bQmZG-YzmZw';

    useEffect(() => {
        fetchWorkbook(workbookId, token).then(({ workbook, problems }) => {
            setWorkbook(workbook);
            setProblems(problems);
        });
    }, []);


    // 2개씩 묶기
    const chunkedProblems = [];
    for (let i = 0; i < problems.length; i += 2) {
        chunkedProblems.push(problems.slice(i, i + 2));
    }

    return (
        <div className="min-h-screen bg-[#f8f1ea]">
            <ProblemNavbar />

            <div className="px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold text-[#5c4033] mb-8">
                        문제집: {workbook?.name}
                    </h1>

                    <div className="space-y-6">
                        {chunkedProblems.map((pair, idx) => (
                            <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pair.map((p, i) => (
                                    // h-fit 하면 문제 카드 내용물에 맞춰서 높이가 조절됨. 양 옆 카드의 높이를 맞추려면 제거해야됨
                                    <div key={i} className="bg-white rounded-2xl shadow-md border border-[#e2e2e2] p-6 h-fit">
                                        <ProblemCard problem={p.problem} userAttempt={p.userAttepmt} />
                                    </div>
                                ))}
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
