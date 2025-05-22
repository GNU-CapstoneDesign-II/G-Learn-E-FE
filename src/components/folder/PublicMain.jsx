// src/pages/PublicMain.jsx
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useTransition,
} from "react";
import { useDrop } from "react-dnd";
import FolderListWithDnD from "./FolderListWithDnD.jsx";
import UploadPopup from "../common/UploadPopup.jsx";
import { copyWorkbookToPrivate } from "../../api/publicFolderApi";

import {
  // 공개 워크북 조회 API들
  getPublicWorkbooks,
  getPublicWorkbooksByCollege,
  getPublicWorkbooksByDepartment,
  getPublicWorkbooksBySubject,
} from "../../api/publicWorkbooksApi";

import {
  // 폴더(단과·학과·과목) 조회 API
  getColleges,
  getDepartments,
  getSubjects,
} from "../../api/workbookApi";

export default function PublicMain({
  /* ───────────────── props (부모에서 전달) ───────────────── */
  selectedCollege = null,          // { id, name } | null
  selectedDepartment = null,       // { id, name } | null
  selectedSubject = null,          // { id, name } | null
  selectedYear = "",
  page = 0,
  size = 20,
  sort = "name",
  order = "asc",
  handleBack,
  setSelectedCollege,
  setSelectedDepartment,
  setSelectedSubject,
  sidebarRef,
}) {
  /* ───────────────── state ───────────────── */
  const [items, setItems] = useState([]);       // 왼쪽 폴더(단과·학과·과목) 리스트
  const [workbooks, setWorkbooks] = useState([]);       // 문제집 리스트
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("name");
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showCopyPopup, setShowCopyPopup] = useState(false);
  const [history, setHistory] = useState([]);

  /* ❖ useTransition  – isPending은 쓰지 않으므로 생략 */
  const [, startTransition] = useTransition();

  /* ❖ filterDepth: 0(루트) → 1(단과) → 2(학과) → 3(과목) */
  const filterDepth = selectedSubject
    ? 3
    : selectedDepartment
      ? 2
      : selectedCollege
        ? 1
        : 0;

  /* ───────────────── 1) 공개 워크북 로딩 ───────────────── */
  useEffect(() => {
    const fetchWorkbooks = async () => {
      try {
        setLoading(true);
        let res;

        if (filterDepth === 0) {
          res = await getPublicWorkbooks(page, size, sort, order);
        } else if (filterDepth === 1 && selectedCollege) {
          res = await getPublicWorkbooksByCollege(
            selectedCollege.id, page, size, sort, order,
          );
        } else if (filterDepth === 2 && selectedDepartment) {
          res = await getPublicWorkbooksByDepartment(
            selectedDepartment.id, page, size, sort, order,
          );
        } else if (filterDepth === 3 && selectedSubject) {
          res = await getPublicWorkbooksBySubject(
            selectedSubject.id, page, size, sort, order,
          );
        }

        setWorkbooks(res?.data?.data?.publicWorkbooks ?? []);
      } catch (err) {
        console.error("공개 워크북 로딩 실패:", err);
        setWorkbooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkbooks();
  }, [
    filterDepth,
    selectedCollege,
    selectedDepartment,
    selectedSubject,
    page,
    size,
    sort,
    order,
  ]);

  /* ───────────────── 2) 폴더(단과·학과·과목) 로딩 ───────────────── */
  useEffect(() => {
    const loadFolders = async () => {
      try {
        setLoading(true);

        if (filterDepth === 0) {
          /* 루트: 단과대 + 교양 */
          const [collegeRes, liberalRes] = await Promise.all([
            getColleges(false),
            getColleges(true),
          ]);
          const colleges = (collegeRes.data.data || []).map(c => ({
            id: c.id,
            name: c.collegeName,
            type: "college",
          }));
          const liberal = (liberalRes.data.data || [])[0];
          setItems(
            liberal
              ? [...colleges, { id: liberal.id, name: liberal.collegeName, type: "college" }]
              : colleges,
          );
        } else if (filterDepth === 1 && selectedCollege) {
          /* 단과 안: 학과/교양 영역 */
          const res = await getDepartments(selectedCollege.id);
          setItems((res.data.data || []).map(d => ({
            id: d.id,
            name: d.departmentName,
            type: "department",
          })));
        } else if (filterDepth === 2 && selectedDepartment) {
          const res = await getSubjects(selectedDepartment.id);
          const list = res.data.data || [];
          // 선택된 학년이 있으면 grade 필드와 매칭되는 과목만 남깁니다.
          const filtered = selectedYear
            ? list.filter(s => String(s.grade) === selectedYear)
            : list;
          setItems(filtered.map(s => ({
            id: s.id,
            name: s.subjectName,
            type: "subject",
          })));
        } else {
          /* 과목 선택 이후는 더 이상 하위 폴더 없음 */
          setItems([]);
        }

        setIsSelectMode(false);
        setSelectedIds([]);
      } catch (err) {
        console.error("공개 폴더링 로딩 실패:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadFolders();
  }, [selectedCollege, selectedDepartment, selectedSubject, filterDepth, selectedYear]);

  /* ───────────────── 3) 클라이언트 정렬 ───────────────── */
  const sortedWorkbooks = useMemo(() => {
    if (sortOption !== "name") return workbooks;
    return [...workbooks].sort((a, b) =>
      (a.name ?? "").localeCompare(b.name ?? ""),
    );
  }, [workbooks, sortOption]);

  /* ───────────────── 4) 선택·다운로드 핸들러 ───────────────── */
  const toggleSelectMode = () => {
    setIsSelectMode(m => !m);
    if (isSelectMode) setSelectedIds([]);
  };
  const handleSelect = id =>
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );

  /* ❖ 현재 경로 타이틀 */
  const makeTitle = () =>
    [selectedCollege?.name, selectedDepartment?.name, selectedSubject?.name]
      .filter(Boolean)
      .join(" - ") || "Public";

  /* ───────────────── 5) 폴더 클릭 시 이동 ───────────────── */
  const handleFolderClick = useCallback(
    id => {
      const folder = items.find(f => f.id === id);
      if (!folder) return;

      startTransition(() => {
        setHistory(prev => [
          ...prev,
          { college: selectedCollege, department: selectedDepartment, subject: selectedSubject },
        ]);

        switch (folder.type) {
          case "college":
            setSelectedCollege({ id: folder.id, name: folder.name });
            sidebarRef?.current?.setMain?.(String(folder.id));
            setSelectedDepartment(null);
            setSelectedSubject(null);

            break;
          case "department":
            setSelectedDepartment({ id: folder.id, name: folder.name });
            sidebarRef?.current?.setSub?.(String(folder.id));
            setSelectedSubject(null);
            break;
          case "subject": // ❖ grade 단계 삭제 → 바로 subject
            setSelectedSubject({ id: folder.id, name: folder.name });
            sidebarRef?.current?.setSubject?.(String(folder.id));
            break;
          default:
            break;
        }
      });
    },
    [
      items,
      selectedCollege,
      selectedDepartment,
      selectedSubject,
      setSelectedCollege,
      setSelectedDepartment,
      setSelectedSubject,
      sidebarRef,
      startTransition,
    ],
  );

  /* ───────────────── 로딩 스피너 ───────────────── */
  if (loading) {
    return <div className="flex-1 flex items-center justify-center">로딩 중…</div>;
  }

  /* ───────────────── JSX ───────────────── */
  return (
    <main className="ml-[200px] mt-[125px] flex-1 p-8 relative">
      <FolderListWithDnD
        mode="public"
        filterDepth={filterDepth}
        selectedFolder={{
          id:
            filterDepth === 3
              ? selectedSubject?.id
              : filterDepth === 2
                ? selectedDepartment?.id
                : filterDepth === 1
                  ? selectedCollege?.id
                  : null,
          name: makeTitle(),
          parentId: filterDepth > 0 ? true : null,
        }}
        selectedItems={selectedIds}
        sortOption={sortOption}
        onSortChange={setSortOption}
        onBack={handleBack}
        onToggleAll={toggleSelectMode}
        isSelectMode={isSelectMode}
        onDownload={() => setShowCopyPopup(true)}
        currentFolder={{ id: null }}
        folders={items}
        workbooks={filterDepth === 3 ? sortedWorkbooks : []}
        onRefresh={() => { }}
        onFolderClick={handleFolderClick}
        onRename={() => { }}
        onDeleteFolder={() => { }}
        onDeleteWorkbook={() => { }}
        onRenameWorkbook={() => { }}
        onAddFolder={null}
        onSelectItem={handleSelect}
      />

      {/* 공개 → 내 워크북 복사 팝업 */}
      {showCopyPopup && (
        <UploadPopup
          mode="copyToPrivate"
          selectedWorkbooks={workbooks.filter(w => selectedIds.includes(w.id))}
          onConfirm={async () => {
            await Promise.all(selectedIds.map(id => copyWorkbookToPrivate(id)));
            setShowCopyPopup(false);
            setSelectedIds([]);
          }}
          onClose={() => setShowCopyPopup(false)}
        />
      )}
    </main>
  );
}
