// src/pages/FolderPage.jsx
import React, { useState, useReducer, useEffect, useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Navbar from "../components/Navbar.jsx";
import PrivateMain from "../components/folder/PrivateMain.jsx";
import PublicMain from "../components/folder/PublicMain.jsx";
import {
  getColleges,
  getDepartments,
  getSubjects
} from "../api/workbookApi.js";

// ────────────── LeftSidebar (inlined) ──────────────
const initialFilterState = { main: "", sub: "", year: "", subject: "" };
function filterReducer(state, action) {
  switch (action.type) {
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

function LeftSidebar({ selectedTab, onTabChange }) {
  const [state, dispatch] = useReducer(filterReducer, initialFilterState);
  const [colleges, setColleges] = useState([]);
  const [liberal, setLiberal] = useState(null);
  const [lv2, setLv2] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);

  const isGeneral =
    liberal && String(state.main) === String(liberal.id);

  // ① 단과대 + 교양 로드
  useEffect(() => {
    Promise.all([getColleges(true), getColleges(false)])
      .then(([cRes, lRes]) => {
        setColleges(cRes.data.data || []);
        setLiberal((lRes.data.data || [])[0] || null);
      })
      .catch(console.error);
  }, []);

  // ② main → 학과/영역
  useEffect(() => {
    if (!state.main) return;
    getDepartments(state.main)
      .then(res => setLv2(res.data.data || []))
      .catch(() => setLv2([]));
    setSubjects([]);
    setGrades([]);
  }, [state.main]);

  // ③ sub → 과목 목록 + 학년 세팅
  useEffect(() => {
    if (!state.sub) return;
    getSubjects(state.sub)
      .then(res => {
        const list = res.data.data || [];
        setSubjects(list);
        if (!isGeneral) {
          setGrades(
            Array.from(new Set(list.map(s => s.grade).filter(Boolean))).sort()
          );
        }
      })
      .catch(() => {
        setSubjects([]);
        setGrades([]);
      });
  }, [state.sub, isGeneral]);

  const filteredSubjects = useMemo(() => {
    if (isGeneral || !state.year) return subjects;
    return subjects.filter(s => String(s.grade) === state.year);
  }, [subjects, isGeneral, state.year]);

  const sync = (type, value) => dispatch({ type, value });
  const handleTab = t => onTabChange(t);

  return (
    <div className="fixed mt-[65px] left-0 w-[200px] h-[calc(100vh-60px)] border-r border-[#E6CEBA] bg-white text-sm">
      {/* 탭 */}
      <div className="pt-12 flex flex-col gap-2 pr-4">
        {["private", "public"].map(t => (
          <button
            key={t}
            onClick={() => handleTab(t)}
            className={`px-4 py-2 rounded-r-full flex items-center gap-2 ${selectedTab === t ? "bg-[#f8f1e7]" : ""
              }`}
          >
            {t === "private" ? "👤 private" : "🧑‍🤝‍🧑 public"}
          </button>
        ))}
      </div>

      {/* Public 필터 */}
      {selectedTab === "public" && (
        <div className="bg-[#f8f1e7] mt-2 mr-4 p-3 rounded-xl flex flex-col gap-2">
          {/* ① 교양/단과대 */}
          <select
            value={state.main}
            onChange={e => sync("SET_MAIN", e.target.value)}
            className="border px-3 py-1 rounded"
          >
            <option value="">교양/단과대 선택</option>
            {liberal && (
              <option value={liberal.id}>{liberal.collegeName}</option>
            )}
            {colleges.map(c => (
              <option key={c.id} value={c.id}>
                {c.collegeName}
              </option>
            ))}
          </select>

          {/* ② 학과/영역 */}
          {state.main && (
            <select
              value={state.sub}
              onChange={e => sync("SET_SUB", e.target.value)}
              className="border px-3 py-1 rounded"
            >
              <option value="">{isGeneral ? "영역" : "학과"} 선택</option>
              {lv2.map(d => (
                <option key={d.id} value={d.id}>
                  {isGeneral ? d : d.departmentName}
                </option>
              ))}
            </select>
          )}

          {/* ③ 학년 (단과대만) */}
          {!isGeneral && state.sub && grades.length > 0 && (
            <select
              value={state.year}
              onChange={e => sync("SET_YEAR", e.target.value)}
              className="border px-3 py-1 rounded"
            >
              <option value="">학년 선택</option>
              {grades.map(g => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          )}

          {/* ④ 과목명 */}
          {state.sub && (

            <select
              value={state.subject}
              onChange={e => sync("SET_SUBJECT", e.target.value)}
              className="border px-3 py-1 rounded"
            >
              <option value="">과목명 선택</option>
              {filteredSubjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.subjectName}
                  {s.grade && ` (${s.grade})`}
                </option>
              ))}
            </select>
          )}
          <button className="mt-2 px-4 py-1 bg-[#AC957B] text-white rounded shadow hover:bg-[#5F360A] transition">
            검색
          </button>
        </div>

      )}
    </div>

  );
}

// ────────────── FolderPage ──────────────
export default function FolderPage() {
  const [tab, setTab] = useState("private");
  const MainComponent = tab === "private" ? PrivateMain : PublicMain;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-[#F9F4ED] font-sans relative">
        <Navbar />
        <div className="flex">
          <LeftSidebar selectedTab={tab} onTabChange={setTab} />
          <MainComponent />
        </div>
      </div>
    </DndProvider>
  );
}
