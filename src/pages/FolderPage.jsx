// src/pages/FolderPage.jsx
import React, { useState, useReducer, useEffect, useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useRef } from "react";
import Navbar from "../components/Navbar.jsx";
import PrivateMain from "../components/folder/PrivateMain.jsx";
import PublicMain from "../components/folder/PublicMain.jsx";
import {
  getColleges,
  getDepartments,
  getSubjects,
} from "../api/workbookApi";

import privateIcon from "../assets/private.png";
import publicIcon from "../assets/public.png";

// ────────────── LeftSidebar (inlined) ──────────────
const initialFilterState = { main: "", sub: "", year: "", subject: "" };
function filterReducer(state, action) {
  switch (action.type) {
    case "RESET":
      return initialFilterState;
    case "SET_MAIN":
      return { main: action.value, sub: "", year: "", subject: "" };
    case "SET_SUB":
      return { ...state, sub: action.value, year: "", subject: "" };
    case "SET_YEAR":
      return { ...state, year: action.value, subject: "" };
    case "SET_SUBJECT":
      return { ...state, subject: action.value };
    default:
      return state;
  }
}

function LeftSidebar({
  selectedTab,
  onTabChange,
  onCollegeSelect,
  onDepartmentSelect,
  onSubjectSelect,
  filterDepth,
}) {
  const [state, dispatch] = useReducer(filterReducer, initialFilterState);
  const prevDepth = useRef(filterDepth);
  const [colleges, setColleges] = useState([]);
  const [liberal, setLiberal] = useState(null);
  const [lv2, setLv2] = useState([]);        // 학과 or 교양영역
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const isGeneral = liberal && String(state.main) === String(liberal.id);

  useEffect(() => {
    if (filterDepth < prevDepth.current) {
      if (prevDepth.current === 3 && filterDepth === 2) {
        dispatch({ type: "SET_SUBJECT", value: "" });
        dispatch({ type: "SET_YEAR", value: "" });
      } else if (prevDepth.current === 2 && filterDepth === 1) {
        dispatch({ type: "SET_SUB", value: "" });
        dispatch({ type: "SET_YEAR", value: "" });
        dispatch({ type: "SET_SUBJECT", value: "" });
      } else if (filterDepth === 0) {
        dispatch({ type: "RESET" });
      }
    }
    prevDepth.current = filterDepth;
  }, [filterDepth]);

  /* ① 단과대 + 교양 로드 */
  useEffect(() => {
    Promise.all([getColleges(true), getColleges(false)])
      .then(([cRes, lRes]) => {
        setColleges(cRes.data.data || []);
        setLiberal((lRes.data.data || [])[0] || null);
      })
      .catch(console.error);
  }, []);

  /* ② main → 학과/영역 */
  useEffect(() => {
    if (!state.main) return;
    getDepartments(state.main)
      .then((res) => setLv2(res.data.data || []))
      .catch(() => setLv2([]));
    setSubjects([]);
    setGrades([]);
  }, [state.main]);

  /* ③ sub → 과목 목록 + 학년 세팅 */
  useEffect(() => {
    if (!state.sub) return;
    getSubjects(state.sub)
      .then((res) => {
        const list = res.data.data || [];
        setSubjects(list);
        if (!isGeneral) {
          setGrades(
            Array.from(new Set(list.map((s) => s.grade).filter(Boolean))).sort()
          );
        }
      })
      .catch(() => {
        setSubjects([]);
        setGrades([]);
      });
  }, [state.sub, isGeneral]);

  /* ④ Sidebar에서 선택한 값 → 부모에게 전달 */
  useEffect(() => {
    // 단과대/교양
    const selMain = [...colleges, liberal]
      .filter(Boolean)
      .find((c) => String(c.id) === state.main);
    onCollegeSelect(
      selMain ? { id: selMain.id, name: selMain.collegeName } : null
    );

    // 학과/영역
    const selDept = lv2.find((d) => String(d.id) === state.sub);
    onDepartmentSelect(
      selDept
        ? {
          id: selDept.id,
          name: isGeneral ? selDept : selDept.departmentName,
        }
        : null
    );

    // 과목
    const selSubj = subjects.find((s) => String(s.id) === state.subject);
    onSubjectSelect(
      selSubj ? { id: selSubj.id, name: selSubj.subjectName } : null
    );
  }, [state, colleges, liberal, lv2, subjects, isGeneral]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ⑤ 과목 리스트 필터(학년) */
  const filteredSubjects = useMemo(() => {
    if (isGeneral || !state.year) return subjects;
    return subjects.filter((s) => String(s.grade) === state.year);
  }, [subjects, isGeneral, state.year]);

  const sync = (type, value) => dispatch({ type, value });

  // 2) 탭 정보 배열 정의
  const tabs = [
    { key: "private", label: "Private", icon: privateIcon },
    { key: "public", label: "Public", icon: publicIcon },
  ];

  return (
    <div className="fixed mt-[65px] left-0 w-[200px] h-[calc(100vh-60px)] border-r border-[#E6CEBA] bg-white text-sm">
      {/* 탭 */}
      <div className="pt-12 flex flex-col gap-2">
        {tabs.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            className={`
              px-4 py-2 rounded-r-full flex items-center gap-2
              ${selectedTab === key ? "bg-[#f8f1e7]" : ""}
            `}
          >
            {/* 3) 이모지 대신 이미지 렌더링 */}
            <img
              src={icon}
              alt={label}
              className="w-5 h-5 flex-shrink-0"
            />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Public 필터 */}
      {selectedTab === "public" && (
        <div className="bg-[#f8f1e7] mt-2 mr-4 p-3 rounded-xl flex flex-col gap-2">
          {/* 단과대/교양 선택 */}
          <select
            value={state.main}
            onChange={(e) => sync("SET_MAIN", e.target.value)}
            className="border px-3 py-1 rounded"
          >
            <option value="">교양/단과대 선택</option>
            {liberal && (
              <option value={liberal.id}>{liberal.collegeName}</option>
            )}
            {colleges.map((c) => (
              <option key={c.id} value={c.id}>
                {c.collegeName}
              </option>
            ))}
          </select>

          {/* 학과/영역 선택 */}
          {state.main && (
            <select
              value={state.sub}
              onChange={(e) => sync("SET_SUB", e.target.value)}
              className="border px-3 py-1 rounded"
            >
              <option value="">{isGeneral ? "영역" : "학과"} 선택</option>
              {lv2.map((d) => (
                <option key={d.id} value={d.id}>
                  {isGeneral ? d : d.departmentName}
                </option>
              ))}
            </select>
          )}

          {/* 학년 선택 */}
          {!isGeneral && state.sub && grades.length > 0 && (
            <select
              value={state.year}
              onChange={(e) => sync("SET_YEAR", e.target.value)}
              className="border px-3 py-1 rounded"
            >
              <option value="">학년 선택</option>
              {grades.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          )}

          {/* 과목 선택 */}
          {state.sub && (
            <select
              value={state.subject}
              onChange={(e) => sync("SET_SUBJECT", e.target.value)}
              className="border px-3 py-1 rounded"
            >
              <option value="">과목명 선택</option>
              {filteredSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.subjectName}
                  {s.grade ? ` (${s.grade})` : ""}
                </option>
              ))}
            </select>
          )}
        </div>
      )}
    </div>
  );
}

/* ───────────── FolderPage ───────────── */
export default function FolderPage() {
  /* 탭 상태 */
  const [tab, setTab] = useState("private");

  /* Public 필터 선택값 */
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  /* 페이징·정렬 상태 */
  const [page, setPage] = useState(0);
  const [size] = useState(25);
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const handleBack = () => {
    if (selectedSubject) {
      setSelectedSubject(null); // 과목 → 학과로
    } else if (selectedDepartment) {
      setSelectedDepartment(null); // 학과 → 단과대
    } else if (selectedCollege) {
      setSelectedCollege(null); // 단과대 → root
    }
  };
  /* filterDepth 계산 (subject→3, department→2, college→1, root→0) */
  const filterDepth = selectedSubject
    ? 3
    : selectedDepartment
      ? 2
      : selectedCollege
        ? 1
        : 0;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-[#F9F4ED] font-sans relative">
        <Navbar />

        <div className="flex">
          {/* 왼쪽 사이드바 */}
          <LeftSidebar
            selectedTab={tab}
            onTabChange={setTab}
            onCollegeSelect={setSelectedCollege}
            onDepartmentSelect={setSelectedDepartment}
            onSubjectSelect={setSelectedSubject}
            filterDepth={filterDepth}
          />

          {/* 메인 영역 */}
          {tab === "private" ? (
            <PrivateMain />
          ) : (
            <PublicMain
              selectedCollege={selectedCollege}
              selectedDepartment={selectedDepartment}
              selectedSubject={selectedSubject}
              filterDepth={filterDepth}
              page={page}
              size={size}
              sort={sort}
              order={order}
              handleBack={handleBack}
            />
          )}
        </div>
      </div>
    </DndProvider>
  );
}
