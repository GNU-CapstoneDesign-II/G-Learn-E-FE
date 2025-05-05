import React, { useReducer, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getColleges,
    getDepartments,
    getSubjects,
    getGeneralSubjects,
} from "../api/Workbook";

const generalCategories = ["인문", "자연", "사회"];
const years = ["1학년", "2학년", "3학년", "4학년"];

const initialState = { main: "", sub: "", year: "", subject: "" };

function reducer(state, action) {
    switch (action.type) {
        case "SET_MAIN":
            return { ...state, main: action.value, sub: "", year: "", subject: "" };
        case "SET_SUB":
            return { ...state, sub: action.value, year: "", subject: "" };
        case "SET_YEAR":
            return { ...state, year: action.value };
        case "SET_SUBJECT":
            return { ...state, subject: action.value };
        default:
            return state;
    }
}

export default function LeftSidebar() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [selectedTab, setSelectedTab] = useState("private");
    const [colleges, setColleges] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const navigate = useNavigate();

    const isGeneral = state.main === "교양";

    const filteredColleges = Array.isArray(colleges)
        ? colleges.filter((college) => college.name !== "교양")
        : [];

    useEffect(() => {
        getColleges().then((res) => setColleges(res.data.data)).catch(console.error);
    }, []);

    useEffect(() => {
        if (!state.main) return;
        if (isGeneral) setDepartments([]);
        else {
            getDepartments(state.main)
                .then((res) => setDepartments(res.data.data))
                .catch(console.error);
        }
    }, [state.main]);

    useEffect(() => {
        if (!state.sub) return;
        const fetchSubjects = async () => {
            try {
                if (isGeneral) {
                    const res = await getGeneralSubjects(state.sub);
                    setSubjects(res.data.data);
                } else {
                    const res = await getSubjects(state.sub);
                    setSubjects(res.data.data);
                }
            } catch (err) {
                console.error(err);
                setSubjects([]);
            }
        };
        fetchSubjects();
    }, [state.sub, state.main]);

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
        navigate(`/${tab}`);
    };

    return (
        <div className="fixed top-[60px] left-0 w-[200px] h-[calc(100vh-60px)] border-r border-[#E6CEBA] pr-4 bg-white flex flex-col gap-2 text-[#5f360a] text-sm z-10">
            {/* 탭 버튼 */}
            <div className="pt-12 flex flex-col gap-2 ">

                {/* 👤 Private 버튼 */}
                <button
                    onClick={() => handleTabClick("private")}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-r-full ${selectedTab === "private" ? "bg-[#f8f1e7]" : ""
                        }`}
                >
                    {/* 세로 이중 줄 (버튼 안에 조건부 렌더링) */}
                    {selectedTab === "private" && (
                        <div className="absolute left-0 top-0 h-full w-[6px]">
                            <div className="absolute left-0 top-0 h-full w-[2px] bg-[#5F360A]" />
                            <div className="absolute left-[2px] top-0 h-full w-[2px] bg-[#CCBEAE]" />
                        </div>
                    )}
                    <span role="img" aria-label="private">👤</span> private
                </button>

                {/* 🧑‍🤝‍🧑 Public 버튼 */}
                <button
                    onClick={() => handleTabClick("public")}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-r-full ${selectedTab === "public" ? "bg-[#f8f1e7]" : ""
                        }`}
                >
                    {selectedTab === "public" && (
                        <div className="absolute left-0 top-0 h-full w-[6px]">
                            <div className="absolute left-0 top-0 h-full w-[2px] bg-[#5F360A]" />
                            <div className="absolute left-[2px] top-0 h-full w-[2px] bg-[#CCBEAE]" />
                        </div>
                    )}
                    <span role="img" aria-label="public">🧑‍🤝‍🧑</span> public
                </button>

            </div>


            {/* 필터 영역 (public 전용) */}
            {selectedTab === "public" && (
                <div className="bg-[#f8f1e7] rounded-xl px-4 py-3 mt-4 flex flex-col gap-2">
                    {/* 교양/대학 */}
                    <div className="relative">
                        <select
                            value={state.main}
                            onChange={(e) => dispatch({ type: "SET_MAIN", value: e.target.value })}
                            className="w-full border px-3 py-1 rounded text-sm appearance-none"
                        >
                            <option value="" disabled>교양/대학</option>
                            <option value="교양">교양</option>
                            {filteredColleges.map((college) => (
                                <option key={college.id} value={college.id}>
                                    {college.name}
                                </option>
                            ))}
                        </select>
                        <span className="absolute right-2 top-1/2 -translate-y-1 text-xs">▾</span>
                    </div>

                    {/* 영역/학과 */}
                    {state.main && (
                        <div className="relative">
                            <select
                                value={state.sub}
                                onChange={(e) => dispatch({ type: "SET_SUB", value: e.target.value })}
                                className="w-full border px-3 py-1 rounded text-sm appearance-none"
                            >
                                <option value="" disabled>{isGeneral ? "영역" : "학과"}</option>
                                {(isGeneral ? generalCategories : departments).map((item) => (
                                    <option key={item.id || item} value={item.id || item}>
                                        {isGeneral ? item : item.departmentName}
                                    </option>
                                ))}
                            </select>
                            <span className="absolute right-2 top-1/2 -translate-y-1 text-xs">▾</span>
                        </div>
                    )}

                    {/* 학년 */}
                    {!isGeneral && state.sub && (
                        <div className="relative">
                            <select
                                value={state.year}
                                onChange={(e) => dispatch({ type: "SET_YEAR", value: e.target.value })}
                                className="w-full border px-3 py-1 rounded text-sm appearance-none"
                            >
                                <option value="" disabled>학년</option>
                                {years.map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                            <span className="absolute right-2 top-1/2 -translate-y-1 text-xs">▾</span>
                        </div>
                    )}

                    {/* 과목 */}
                    {state.sub && (
                        <div className="relative">
                            <select
                                value={state.subject}
                                onChange={(e) => dispatch({ type: "SET_SUBJECT", value: e.target.value })}
                                className="w-full border px-3 py-1 rounded text-sm appearance-none"
                            >
                                <option value="" disabled>과목명</option>
                                {subjects.map((subject) => (
                                    <option key={subject.id} value={subject.id}>
                                        {`${subject.subjectName} (${subject.grade})`}
                                    </option>
                                ))}
                            </select>
                            <span className="absolute right-2 top-1/2 -translate-y-1 text-xs">▾</span>
                        </div>
                    )}

                    <button className="bg-[#5f360a] text-white text-sm px-4 py-1 rounded mt-2">
                        검색
                    </button>
                </div>
            )}
        </div>
    );
}
