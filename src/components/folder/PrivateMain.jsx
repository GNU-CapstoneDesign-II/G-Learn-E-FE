// src/components/main/PrivateMain.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useDrop } from "react-dnd";
import FolderListWithDnD from "./FolderListWithDnD.jsx";
import ConfirmPopup from "../common/ConfirmPopup.jsx";
import InformationPopup from "../common/InformationPopup.jsx";
import UploadPopup from "../common/UploadPopup.jsx";
import InputPopup from "../common/InputPopup.jsx";
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

  // —— 팝업 관리 state ——
  const [modal, setModal] = useState({
    type: null,   // "renameFolder" | "renameWorkbook" | "deleteFolder" | "deleteWorkbook" | "addFolder"
    id: null,     // 대상 id (rename/delete 시)
  });
  const [infoMsg, setInfoMsg] = useState(null);

  // 팝업 핸들러들
  const openRenameFolder = id =>
    setModal({ type: "renameFolder", id });
  const openRenameWorkbook = id =>
    setModal({ type: "renameWorkbook", id });
  const openDeleteFolder = id =>
    setModal({ type: "deleteFolder", id });
  const openDeleteWorkbook = id =>
    setModal({ type: "deleteWorkbook", id });
  const openAddFolder = () =>
    setModal({ type: "addFolder" });

  const closeModal = () =>
    setModal({ type: null, id: null });

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

  // 팝업 확인 액션
  const handleConfirm = async value => {
    try {
      switch (modal.type) {
        case "renameFolder":
          await renameFolder(modal.id, value);
          setInfoMsg("폴더 이름이 변경되었습니다.");
          break;
        case "renameWorkbook":
          await renameWorkbook(modal.id, value);
          setInfoMsg("문제집 이름이 변경되었습니다.");
          break;
        case "addFolder":
          await createPrivateFolder({ name: value, parentId: folderData.id });
          setInfoMsg("새 폴더가 생성되었습니다.");
          break;
        case "deleteFolder":
          await deleteFolder(modal.id);
          setInfoMsg("폴더가 삭제되었습니다.");
          break;
        case "deleteWorkbook":
          await deleteWorkbook(folderData.id, modal.id);
          setInfoMsg("문제집이 삭제되었습니다.");
          break;
      }
      closeModal();
      loadFolder(folderData.id);
    } catch (err) {
      setInfoMsg("오류가 발생했습니다.");
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
        onRename={openRenameFolder}
        onRenameWorkbook={openRenameWorkbook}
        onDeleteFolder={openDeleteFolder}
        onDeleteWorkbook={openDeleteWorkbook}
        onAddFolder={openAddFolder}
        onSelectItem={handleSelectItem}
      />

      {showUploadPopup && (
        <UploadPopup
          selectedWorkbooks={selectedWorkbooks}
          onClose={() => setShowUploadPopup(false)}
        />
      )}

      {/* 1) 이름 변경 & 새 폴더용 InputPopup */}
      {(modal.type === "renameFolder" ||
        modal.type === "renameWorkbook" ||
        modal.type === "addFolder") && (
        <InputPopup
          title={
            modal.type === "addFolder"
              ? "새 폴더 이름"
              : modal.type === "renameFolder"
              ? "폴더 이름 변경"
              : "문제집 이름 변경"
          }
          defaultValue={
            modal.type === "renameFolder"
              ? folderData.childFolders.find(f => f.id === modal.id)?.name
              : modal.type === "renameWorkbook"
              ? folderData.childWorkbooks.find(w => w.id === modal.id)?.name
              : ""
          }
          placeholder="이름을 입력하세요"
          onConfirm={handleConfirm}
          onCancel={closeModal}
        />
      )}

      {/* 2) 삭제 확인용 ConfirmPopup */}
      {(modal.type === "deleteFolder" || modal.type === "deleteWorkbook") && (
        <ConfirmPopup
          message={
            modal.type === "deleteFolder"
              ? "폴더를 정말 삭제하시겠습니까?"
              : "문제집을 정말 삭제하시겠습니까?"
          }
          onConfirm={() => handleConfirm()}
          onCancel={closeModal}
        />
      )}

      {/* 3) 결과 안내용 InformationPopup */}
      {infoMsg && (
        <InformationPopup
          message={infoMsg}
          onClose={() => setInfoMsg(null)}
        />
      )}
    </main>
  );
}
