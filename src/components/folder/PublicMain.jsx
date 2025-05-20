import React, { useState, useEffect, useMemo } from "react";
import { useDrop } from "react-dnd";
import FolderListWithDnD from "./FolderListWithDnD.jsx";
import UploadPopup from "../common/UploadPopup.jsx";
import { copyWorkbookToPrivate } from "../../api/publicFolderApi";
import {
  getPublicWorkbooks,
  getPublicWorkbooksByCollege,
  getPublicWorkbooksByDepartment,
  getPublicWorkbooksBySubject,
} from "../../api/publicWorkbooksApi";

/**
 * 완전 제어형 PublicMain
 *  - college / department / subject를 prop 그대로 사용
 */
export default function PublicMain({
  /* === 필터 값들 (부모가 제어) === */
  selectedCollege = null,
  selectedDepartment = null,
  selectedSubject = null,

  /* === 페이징·정렬 (부모가 제어하거나 초기값만) === */
  page = 0,
  size = 20,
  sort = "name",
  order = "asc",
}) {
  const isPublic = true;   // 항상 public
  /* ───────── 기타 UI 상태 ───────── */
  const [workbooks, setWorkbooks]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [sortOption, setSortOption]     = useState("name");      // 클라이언트측 이름 정렬
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds]   = useState([]);
  const [showCopyPopup, setShowCopyPopup] = useState(false);

  /* ───────── 필터 깊이 계산 ───────── */
  const filterDepth = selectedSubject
    ? 3
    : selectedDepartment
    ? 2
    : selectedCollege
    ? 1
    : 0;

  /* ───────── 워크북 로딩 ───────── */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        let res;
        switch (filterDepth) {
          case 0:
            res = await getPublicWorkbooks(page, size, sort, order);
            break;
          case 1:
            res = await getPublicWorkbooksByCollege(
              selectedCollege.id,
              page,
              size,
              sort,
              order
            );
            break;
          case 2:
            res = await getPublicWorkbooksByDepartment(
              selectedDepartment.id,
              page,
              size,
              sort,
              order
            );
            break;
          case 3:
            res = await getPublicWorkbooksBySubject(
              selectedSubject.id,
              page,
              size,
              sort,
              order
            );
            break;
          default:
            res = { data: { data: [] } };
        }
        setWorkbooks(res.data.data || []);
        setIsSelectMode(false);
        setSelectedIds([]);
      } catch (err) {
        console.error("문제집 불러오기 실패:", err);
        setWorkbooks([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [
    selectedCollege,
    selectedDepartment,
    selectedSubject,
    page,
    size,
    sort,
    order,
    filterDepth,
  ]);

  /* ───────── 이름 정렬(Null‑safe) ───────── */
  const sortedWorkbooks = useMemo(() => {
    if (sortOption !== "name") return workbooks;
    return [...workbooks].sort((a, b) =>
      (a.name ?? "").localeCompare(b.name ?? "")
    );
  }, [workbooks, sortOption]);

  /* ───────── 선택 모드 토글 / 선택 관리 ───────── */
  const toggleSelectMode = () => {
    setIsSelectMode((m) => !m);
    if (isSelectMode) setSelectedIds([]);
  };
  const handleSelect = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  /* ───────── 폴더명 생성 ───────── */
  const makeTitle = () => {
    const parts = [
      selectedCollege?.name,
      selectedDepartment?.name,
      selectedSubject?.name,
    ].filter(Boolean);
    return parts.length ? parts.join(" - ") : "Public";
  };

  /* ───────── 뒤로가기(부모 state 조작 필요하면 prop으로 전달하세요) ───────── */
  // 현재 구조에선 PublicMain이 단독으로 filter를 줄일 방법이 없으므로
  // handleBack을 부모에서 내려주도록 바꾸거나, 선택 로직을 Sidebar에서만 처리합니다.
  const handleBack = () => {}; // 필요 시 props로 받아서 사용

  /* ───────── DnD 장애 방지용 빈 drop 영역 ───────── */
  useDrop({ accept: ["folder", "workbook"], drop: () => {} });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">로딩 중…</div>
    );
  }

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
        folders={[]}
        workbooks={sortedWorkbooks}
        onRefresh={() => {}}
        onFolderClick={() => {}}
        onRename={() => {}}
        onDeleteFolder={() => {}}
        onDeleteWorkbook={() => {}}
        onRenameWorkbook={() => {}}
        onAddFolder={null}
        onSelectItem={handleSelect}
      />

      {/* 사본 만들기 팝업 */}
      {showCopyPopup && (
        <UploadPopup
          mode="copyToPrivate"
          selectedWorkbooks={workbooks.filter((w) =>
            selectedIds.includes(w.id)
          )}
          onConfirm={async () => {
            await Promise.all(
              selectedIds.map((id) => copyWorkbookToPrivate(id))
            );
            setShowCopyPopup(false);
            setSelectedIds([]);
          }}
          onClose={() => setShowCopyPopup(false)}
        />
      )}
    </main>
  );
}
