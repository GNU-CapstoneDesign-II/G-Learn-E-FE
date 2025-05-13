import React, { useReducer, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LeftSidebar.module.css";
import {
    getColleges,
    getDepartments,
    getSubjects,
    getGeneralSubjects,
} from "../api/Workbook.js";

// 📌 고정 데이터
const generalCategories = ["인문", "자연", "사회"];
const years = ["1학년", "2학년", "3학년", "4학년"];

// 📌 초기 상태
const initialState = {
    main: "",
    sub: "",
    year: "",
    subject: "",
};

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

    // ✅ "교양" 항목 중복 방지를 위해 colleges에서 제거
    const filteredColleges = Array.isArray(colleges)
        ? colleges.filter((college) => college.name !== "교양")
        : [];

    // 👉 단과대학 목록 불러오기
    useEffect(() => {
        getColleges()
            .then((res) => setColleges(res.data.data))
            .catch(console.error);
    }, []);

    // 👉 학과 목록 불러오기
    useEffect(() => {
        if (!state.main) return;

        if (isGeneral) {
            setDepartments([]); // 교양일 경우 영역만 사용
        } else {
            getDepartments(state.main)
                .then((res) => setDepartments(res.data.data))
                .catch(console.error);
        }
    }, [state.main]);

    // 👉 과목 목록 불러오기
    useEffect(() => {
        if (!state.sub) return;

        const fetchSubjects = async () => {
            try {
                if (isGeneral) {
                    const res = await getGeneralSubjects(state.sub);
                    setSubjects(res.data.data);
                } else {
                    const res = await getSubjects(state.sub); // ✅ 학과 id만 넘김
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
        navigate(`/${tab}`); // ✅ 페이지 이동 처리
    };

    return (
        <div className={styles["sidebar-filter"]}>
            <div className={styles["tab-toggle"]}>
                <button
                    className={selectedTab === "private" ? styles.active : ""}
                    onClick={() => handleTabClick("private")} // ✅ 변경
                >
                    <span>👤</span> private
                </button>
                <div />
                <button
                    className={selectedTab === "public" ? styles.active : ""}
                    onClick={() => handleTabClick("public")} // ✅ 변경
                >
                    <span>🧑‍🤝‍🧑</span> public
                </button>
            </div>
            {selectedTab === "public" && (
                <>
                    <h3 className={styles["menu-title"]}>public</h3>

                    <div className={styles["custom-select-wrapper"]}>
                        <select
                            className={styles["custom-select"]}
                            value={state.main}
                            onChange={(e) => dispatch({ type: "SET_MAIN", value: e.target.value })}
                            required
                        >
                            <option value="" disabled>교양/대학</option>
                            <option value="교양">교양</option> {/* ✅ 직접 고정 추가 */}
                            {filteredColleges.map((college) => (
                                <option key={college.id} value={college.id}>
                                    {college.name}
                                </option>
                            ))}
                        </select>
                        <span className={styles["custom-arrow"]}>▾</span>
                    </div>

                    {state.main && (
                        <div className={styles["custom-select-wrapper"]}>
                            <select
                                className={styles["custom-select"]}
                                value={state.sub}
                                onChange={(e) => dispatch({ type: "SET_SUB", value: e.target.value })}
                            >
                                <option value="" disabled>{isGeneral ? "영역" : "학과"}</option>
                                {(isGeneral ? generalCategories : departments).map((item) => (
                                    <option key={item.id || item} value={item.id || item}>
                                        {isGeneral ? item : item.departmentName}
                                    </option>
                                ))}

                            </select>
                            <span className={styles["custom-arrow"]}>▾</span>
                        </div>
                    )}

                    {!isGeneral && state.sub && (
                        <div className={styles["custom-select-wrapper"]}>
                            <select
                                className={styles["custom-select"]}
                                value={state.year}
                                onChange={(e) => dispatch({ type: "SET_YEAR", value: e.target.value })}
                            >
                                <option value="" disabled>학년</option>
                                {years.map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                            <span className={styles["custom-arrow"]}>▾</span>
                        </div>
                    )}

                    {state.sub && (
                        <div className={styles["custom-select-wrapper"]}>
                            <select
                                className={styles["custom-select"]}
                                value={state.subject}
                                onChange={(e) => dispatch({ type: "SET_SUBJECT", value: e.target.value })}
                            >
                                <option value="" disabled>과목명</option>
                                {subjects.map((subject) => (
                                    <option key={subject.id} value={subject.id}>
                                        {`${subject.subjectName} (${subject.grade})`}
                                    </option>
                                ))}
                            </select>
                            <span className={styles["custom-arrow"]}>▾</span>
                        </div>
                    )}

                    <button className={styles["search-button"]}>검색</button>
                </>
            )}
        </div>
    );
};
