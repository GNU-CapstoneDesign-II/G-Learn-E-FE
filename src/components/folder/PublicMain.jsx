// src/components/folder/PublicMain.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useDrop } from "react-dnd";
import FolderListWithDnD from "./FolderListWithDnD.jsx";
import UploadPopup from "../common/UploadPopup.jsx";

import {
  fetchPublicFolder,
  copyWorkbookToPrivate,
} from "../../api/publicFolderApi";

export default function PublicMain() {
  // ───────── 쿼리 파라미터 → 필터 상태로 변환
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const filter = {
    main: params.get("main") ?? "",
    sub: params.get("sub") ?? "",
    year: params.get("year") ?? "",
    subject: params.get("subject") ?? "",
  };

  const [folderData, setFolderData] = useState({
    id: null,
    name: "public",
    parentId: null,
    childFolders: [],
    childWorkbooks: [],
  });
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("name");
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showCopyPopup, setShowCopyPopup] = useState(false);

  // ───────── API 호출
  const loadFolder = async (id = null) => {
    setLoading(true);
    try {
      const data = await fetchPublicFolder(id, filter);
      setFolderData(data);
      setIsSelectMode(false);
      setSelectedIds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFolder();
  }, [filter.main, filter.sub, filter.year, filter.subject]);

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

  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    if (isSelectMode) setSelectedIds([]);
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  useDrop({
    accept: ["folder", "workbook"],
    drop: () => {
      /* Public은 이동 기능 없음 */
    },
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        로딩 중…
      </div>
    );
  }

  return (
    <main className="ml-[200px] mt-[125px] flex-1 p-8 relative">
      <FolderListWithDnD
        /* 상단 툴바 */
        selectedFolder={folderData}
        selectedItems={selectedIds}
        sortOption={sortOption}
        onSortChange={setSortOption}
        onBack={() => loadFolder(folderData.parentId)}
        onToggleAll={toggleSelectMode}
        isSelectMode={isSelectMode}
        onUpload={() => setShowCopyPopup(true)} // “내 문제집 담기”
        /* 리스트 */
        currentFolder={folderData}
        folders={sortedFolders}
        workbooks={sortedWorkbooks}
        onRefresh={() => loadFolder(folderData.id)}
        onFolderClick={(id) => !isSelectMode && loadFolder(id)}
        /* 읽기 전용 (비활성화) */
        onRename={() => { }}
        onDeleteFolder={() => { }}
        onDeleteWorkbook={() => { }}
        onRenameWorkbook={() => { }}
        onAddFolder={null}
        onSelectItem={handleSelect}
      />

      {showCopyPopup && (
        <UploadPopup
          mode="copyToPrivate"
          selectedWorkbooks={folderData.childWorkbooks.filter((w) =>
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
