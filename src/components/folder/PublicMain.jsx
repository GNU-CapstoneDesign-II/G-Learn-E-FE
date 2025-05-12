import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useDrop } from "react-dnd";
import FolderListWithDnD from "./FolderListWithDnD.jsx";
import UploadPopup from "../common/UploadPopup.jsx";

/* ------------------------------------------------------------------ */
/* ⛔ 아직 API 없다면 주석 유지, 붙일 때 주석 해제 --------------------- */
// import {
//   fetchPublicFolder,
//   movePublicFolder,
//   movePublicWorkbook,
//   copyWorkbookToPrivate,
// } from "../../api/publicFolderApi";
/* ------------------------------------------------------------------ */

export default function PublicMain() {
  /* ---------------- URL 쿼리 → 필터 ---------------- */
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const filter = {
    main: params.get("main") ?? "",
    sub: params.get("sub") ?? "",
    year: params.get("year") ?? "",
    subject: params.get("subject") ?? "",
  };

  /* ---------------- 더미 데이터 ---------------- */
  const [folderData /*, setFolderData */] = useState({
    id: null,
    name: "public",
    parentId: null,
    childFolders: [
      { id: "f1", name: "자료구조" },
      { id: "f2", name: "운영체제" },
    ],
    childWorkbooks: [
      { id: "w1", name: "알고리즘 기출" },
      { id: "w2", name: "컴퓨터네트워크 문제집" },
    ],
  });

  /* ------------------------------------------------------------------ */
  /* ⛔ 로딩 & fetch 로직 – API 붙일 때 활성화 -------------------------- */
  // const [loading, setLoading] = useState(true);
  //
  // const loadFolder = async (id = null) => {
  //   setLoading(true);
  //   const data = await fetchPublicFolder(id, filter);
  //   setFolderData(data);
  //   setLoading(false);
  // };
  //
  // useEffect(() => {
  //   loadFolder();
  // }, [filter.main, filter.sub, filter.year, filter.subject]);
  /* ------------------------------------------------------------------ */

  const [sortOption, setSortOption] = useState("name");
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showCopyPopup, setShowCopyPopup] = useState(false);

  /* ---------------- 정렬 ---------------- */
  const sortedFolders = useMemo(() => {
    const arr = [...folderData.childFolders];
    if (sortOption === "name") arr.sort((a, b) => a.name.localeCompare(b.name));
    return arr;
  }, [folderData.childFolders, sortOption]);

  const sortedWorkbooks = useMemo(() => {
    const arr = [...folderData.childWorkbooks];
    if (sortOption === "name") arr.sort((a, b) => a.name.localeCompare(b.name));
    return arr;
  }, [folderData.childWorkbooks, sortOption]);

  /* ---------------- 선택 모드 ---------------- */
  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    if (isSelectMode) setSelectedIds([]);
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* ---------------- DnD 드롭(no-op) ---------------- */
  useDrop({
    accept: ["folder", "workbook"],
    drop: () => {
      /* console.log("DnD drop – API 붙이면 이동 로직 추가"); */
    },
  });

  /* ---------------- 렌더 ---------------- */
  // if (loading) return <div className="flex-1 flex items-center justify-center">로딩 중…</div>;

  return (
    <main className="ml-[200px] mt-[125px] flex-1 p-8 relative">
      <FolderListWithDnD
        /* 상단 툴바 */
        selectedFolder={folderData}
        selectedItems={selectedIds}
        sortOption={sortOption}
        onSortChange={setSortOption}
        onBack={() => {/* loadFolder(folderData.parentId); */ }}
        onToggleAll={toggleSelectMode}
        isSelectMode={isSelectMode}
        onUpload={() => setShowCopyPopup(true)}  // “담기” 버튼
        /* 리스트 */
        currentFolder={folderData}
        folders={sortedFolders}
        workbooks={sortedWorkbooks}
        onRefresh={() => {/* loadFolder(folderData.id); */ }}
        onFolderClick={(id) => !isSelectMode /* && loadFolder(id) */}
        /* 읽기 전용 → 다음 세 개는 No-op */
        onRename={() => { }}
        onDeleteFolder={() => { }}
        onDeleteWorkbook={() => { }}
        onRenameWorkbook={() => { }}
        onAddFolder={null}
        onSelectItem={handleSelect}
      />

      {/* “내 문제집 담기” 팝업 – UI만 먼저 */}
      {showCopyPopup && (
        <UploadPopup
          mode="copyToPrivate"
          selectedWorkbooks={folderData.childWorkbooks.filter((w) =>
            selectedIds.includes(w.id)
          )}
          onConfirm={async () => {
            /* await Promise.all(selectedIds.map(id => copyWorkbookToPrivate(id))); */
            setShowCopyPopup(false);
            setSelectedIds([]);
          }}
          onClose={() => setShowCopyPopup(false)}
        />
      )}
    </main>
  );
}
