/* ──────────────────────────────────────────────────────────────
   src/components/main/PrivateMain.jsx
────────────────────────────────────────────────────────────── */
import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import FolderListWithDnD from "../FolderListWithDnD.jsx";
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

const ItemTypes = { FOLDER: "folder", WORKBOOK: "workbook" };

export default function PrivateMain() {
  /* ────────── 상태 ────────── */
  const [folderData, setFolderData] = useState({
    id: null,
    name: "private",
    parentId: null,
    childFolders: [],
    childWorkbooks: [],
  });
  const [loading, setLoading] = useState(true);

  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);      // ↱ ID 배열
  const [sortOption, setSortOption] = useState("최신순");

  const [showUploadPopup, setShowUploadPopup] = useState(false);

  /* ────────── 폴더 로드 ────────── */
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

  /* ────────── 새 폴더 생성 ────────── */
  const handleCreateFolder = async () => {
    const name = prompt("새 폴더 이름");
    if (!name?.trim()) return;
    await createPrivateFolder({ name: name.trim(), parentId: folderData.id });
    loadFolder(folderData.id);
  };

  /* ────────── DnD(상위 폴더로 이동) ────────── */
  useDrop({
    accept: [ItemTypes.FOLDER, ItemTypes.WORKBOOK],
    drop: (item, monitor) => {
      const targetId = folderData.parentId ?? 0;
      const mover =
        monitor.getItemType() === ItemTypes.FOLDER ? moveFolder : moveWorkbook;
      mover(item.id, targetId).then(() => loadFolder(targetId));
    },
  });

  if (loading)
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center">
        로딩 중…
      </div>
    );

  /* ────────── 선택 모드 토글 ────────── */
  const handleToggleAll = () => {
    if (!isSelectMode) {
      // 선택모드 진입
      setIsSelectMode(true);
      setSelectedIds([]);
    } else {
      // 이미 선택모드라면 전체 선택/해제
      const allIds = folderData.childWorkbooks.map((w) => w.id);
      setSelectedIds(selectedIds.length === allIds.length ? [] : allIds);
    }
  };

  /* 개별 워크북 선택/해제 */
  const handleSelectItem = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* ────────── UploadPopup 에 넘겨줄 [{id,name}] 만들기 ────────── */
  const selectedWorkbooks = folderData.childWorkbooks
    .filter((w) => selectedIds.includes(w.id))
    .map((w) => ({ id: w.id, name: w.name }));

  /* ────────── 뷰 ────────── */
  return (
    <main className="ml-[200px] mt-[125px] flex-1 p-8 relative">
      <FolderListWithDnD
        /* 헤더용 props */
        selectedFolder={folderData}
        selectedItems={selectedIds}
        sortOption={sortOption}
        onSortChange={setSortOption}
        onBack={() => loadFolder(folderData.parentId)}
        onToggleAll={handleToggleAll}
        isSelectMode={isSelectMode}
        onUpload={() => setShowUploadPopup(true)}
        /* 그리드용 props */
        currentFolder={folderData}
        folders={folderData.childFolders}
        workbooks={folderData.childWorkbooks}
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
        onAddFolder={handleCreateFolder}
        onSelectItem={handleSelectItem}
      />

      {/* 업로드 팝업 */}
      {showUploadPopup && (
        <UploadPopup
          selectedWorkbooks={selectedWorkbooks}
          onClose={() => setShowUploadPopup(false)}
        />
      )}
    </main>
  );
}
