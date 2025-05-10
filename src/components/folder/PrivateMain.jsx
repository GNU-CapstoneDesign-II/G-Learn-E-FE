// src/components/main/PrivateMain.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useDrop } from "react-dnd";
import FolderListWithDnD from "./FolderListWithDnD.jsx";
import UploadPopup from "../common/UploadPopup.jsx";
import {
  fetchPrivateFolder,
  createPrivateFolder,
  moveFolder,
  moveWorkbook,
  renameFolder,
  deleteFolder,
  deleteWorkbook,
  renameWorkbook,
} from "../../api/privateFolderApi";

export default function PrivateMain() {
  const [folderData, setFolderData] = useState({
    id: null,
    name: "private",
    parentId: null,
    childFolders: [],
    childWorkbooks: [],
  });
  const [loading, setLoading] = useState(true);

  // 정렬 기준: name / recentUse / createdAt / modifiedAt
  const [sortOption, setSortOption] = useState("name");

  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showUploadPopup, setShowUploadPopup] = useState(false);

  // 폴더 데이터 로드
  const loadFolder = async (id = null) => {
    setLoading(true);
    try {
      const data = await fetchPrivateFolder(id);
      setFolderData(data);
      setIsSelectMode(false);
      setSelectedIds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFolder();
  }, []);

  // 정렬된 폴더 리스트
  const sortedFolders = useMemo(() => {
    const arr = [...folderData.childFolders];
    switch (sortOption) {
      case "name":
        return arr.sort((a, b) => a.name.localeCompare(b.name));
      case "recentUse":
        return arr.sort(
          (a, b) => new Date(b.lastUsedAt) - new Date(a.lastUsedAt)
        );
      case "createdAt":
        return arr.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "modifiedAt":
        return arr.sort(
          (a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt)
        );
      default:
        return arr;
    }
  }, [folderData.childFolders, sortOption]);

  // 정렬된 워크북 리스트
  const sortedWorkbooks = useMemo(() => {
    const arr = [...folderData.childWorkbooks];
    switch (sortOption) {
      case "name":
        return arr.sort((a, b) => a.name.localeCompare(b.name));
      case "recentUse":
        return arr.sort(
          (a, b) => new Date(b.lastUsedAt) - new Date(a.lastUsedAt)
        );
      case "createdAt":
        return arr.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "modifiedAt":
        return arr.sort(
          (a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt)
        );
      default:
        return arr;
    }
  }, [folderData.childWorkbooks, sortOption]);

  // 전체 토글
  const handleToggleAll = () => {
    if (!isSelectMode) {
      setIsSelectMode(true);
      setSelectedIds([]);
    } else {
      setIsSelectMode(false);
      setSelectedIds([]);
    }
  };

  // 개별 선택
  const handleSelectItem = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // 업로드 팝업용 데이터
  const selectedWorkbooks = folderData.childWorkbooks
    .filter((w) => selectedIds.includes(w.id))
    .map((w) => ({ id: w.id, name: w.name }));

  // DnD 드롭존
  useDrop({
    accept: ["folder", "workbook"],
    drop: (item, monitor) => {
      const targetId = folderData.parentId ?? 0;
      const mover =
        monitor.getItemType() === "folder" ? moveFolder : moveWorkbook;
      mover(item.id, targetId).then(() => loadFolder(targetId));
    },
  });

  if (loading) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center">
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
        onToggleAll={handleToggleAll}
        isSelectMode={isSelectMode}
        onUpload={() => setShowUploadPopup(true)}
        onBack={() => loadFolder(folderData.parentId)}
        /* 리스트 */
        currentFolder={folderData}
        folders={sortedFolders}
        workbooks={sortedWorkbooks}
        onRefresh={() => loadFolder(folderData.id)}
        onFolderClick={(id) => !isSelectMode && loadFolder(id)}
        onRename={async (id) => {
          const newName = prompt("새 폴더 이름", folderData.name);
          if (!newName?.trim()) return;
          await renameFolder(id, newName.trim());
          loadFolder(folderData.id);
        }}
        onDeleteFolder={async (id) => {
          if (!window.confirm("폴더를 삭제할까요?")) return;
          await deleteFolder(id);
          loadFolder(folderData.id);
        }}
        onDeleteWorkbook={async (wid) => {
          if (!window.confirm("문제집을 삭제할까요?")) return;
          await deleteWorkbook(folderData.id, wid);
          loadFolder(folderData.id);
        }}
        onRenameWorkbook={async (wid) => {
          const newName = prompt("새 문제집 이름");
          if (!newName?.trim()) return;
          await renameWorkbook(wid, newName.trim());
          loadFolder(folderData.id);
        }}
        onAddFolder={async () => {
          const name = prompt("새 폴더 이름");
          if (!name?.trim()) return;
          await createPrivateFolder({
            name: name.trim(),
            parentId: folderData.id,
          });
          loadFolder(folderData.id);
        }}
        onSelectItem={handleSelectItem}
      />

      {showUploadPopup && (
        <UploadPopup
          selectedWorkbooks={selectedWorkbooks}
          onClose={() => setShowUploadPopup(false)}
        />
      )}
    </main>
  );
}
