// src/components/FolderListWithDnD.jsx
import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useNavigate } from "react-router-dom";
import Checkbox from "./Checkbox.jsx";
import { moveWorkbook, moveFolder } from "../../api/privateFolderApi.js";
import ContextMenu from "../common/ContextMenu";
import workbookImg from "../../assets/workbook.png";
import folderImg from "../../assets/folder.png";
import WorkbookProfilePopup from "../common/WorkbookProfilePopup.jsx";

const ItemTypes = { FOLDER: "folder", WORKBOOK: "workbook" };

export default function FolderListWithDnD({
  mode = "private",
  filterDepth = 0,
  /* ── 상단 툴바 props ── */
  selectedFolder,
  selectedItems,
  sortOption,
  onSortChange,
  onBack,
  onToggleAll,
  isSelectMode,
  onUpload,
  /* ── 리스트 렌더링 props ── */
  currentFolder,
  folders,
  workbooks,
  onRefresh,
  onFolderClick,
  onRename,
  onDeleteFolder,
  onDeleteWorkbook,
  onRenameWorkbook,
  onAddFolder,
  onSelectItem,
  onDownload,
}) {
  const navigate = useNavigate();
  const isPublic = mode === "public";
  const isRoot = isPublic ? filterDepth === 0 : selectedFolder?.parentId == null;
  const [popupId, setPopupId] = useState(null);

  const MENU_ITEM_HEIGHT = 40;
  const MENU_WIDTH = 140;

  const [ctxMenu, setCtxMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    type: null,
    id: null,
  });

  const handleContextMenu = (e, type, id) => {
    if (isPublic) return;
    e.preventDefault();

    const itemCount = type === ItemTypes.WORKBOOK ? 3 : 2;
    const menuHeight = itemCount * MENU_ITEM_HEIGHT;

    let x = e.clientX + 2;
    let y = e.clientY + 2;
    if (x + MENU_WIDTH > window.innerWidth) x = e.clientX - MENU_WIDTH - 2;
    if (y + menuHeight > window.innerHeight) y = e.clientY - menuHeight - 2;
    if (x < 0) x = 8;
    if (y < 0) y = 8;

    setCtxMenu({ visible: true, x, y, type, id });
  };

  const closeContextMenu = () =>
    setCtxMenu((cm) => ({ ...cm, visible: false }));

  const handleRenameContext = () => {
    if (ctxMenu.type === ItemTypes.FOLDER) {
      onRename(ctxMenu.id);
    } else {
      onRenameWorkbook(ctxMenu.id);
    }
    closeContextMenu();
  };

  const handleEditContext = () => {
    if (ctxMenu.type === ItemTypes.WORKBOOK) {
      navigate(`/edit/${ctxMenu.id}`);
    }
    closeContextMenu();
  };

  const handleDeleteContext = () => {
    if (ctxMenu.type === ItemTypes.FOLDER) {
      onDeleteFolder(ctxMenu.id);
    } else {
      onDeleteWorkbook(ctxMenu.id);
    }
    closeContextMenu();
  };

  const [{ isOver, canDrop }, dropToParent] = useDrop({
    accept: [ItemTypes.FOLDER, ItemTypes.WORKBOOK],
    drop: (item, monitor) => {
      if (selectedFolder.parentId == null) return;
      if (isPublic) return;
      const mover =
        monitor.getItemType() === ItemTypes.FOLDER
          ? moveFolder
          : moveWorkbook;
      mover(item.id, selectedFolder.parentId).then(onRefresh);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const selectedTitles = workbooks
    .filter((wb) => selectedItems.includes(wb.id))
    .map((wb) => wb.name);

  return (
    <>
      <header
        ref={dropToParent}
        className="fixed top-[66px] left-[200px] w-[calc(100%-200px)] flex items-center justify-between px-6 py-3 border-b border-[#e5d5c5] bg-[#fdf9f4] z-30 hover:bg-[#f0ede8] transition-colors"
      >
        <div className="flex items-center gap-3">
          {!isRoot && typeof onBack === "function" && (
            <button
              onClick={onBack}
              className="text-xl text-[#5f360a] hover:opacity-70"
            >
              ◀
            </button>
          )}
          <h2 className="text-lg font-semibold text-[#5f360a]">
            <span>{selectedFolder?.name ?? ""}</span>
            {(isOver || canDrop) && !isRoot && !isPublic && (
              <span className="ml-5 px-2 py-1 bg-[#AC957B] text-white text-xs rounded">
                상위 폴더로 이동
              </span>
            )}
          </h2>
        </div>

        <div className="flex items-center gap-3 text-sm text-[#5f360a]">
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none border px-3 py-1 pr-6 rounded text-sm"
            >
              <option value="name">이름</option>
              <option value="recentUse">최근 사용일</option>
              <option value="createdAt">추가된 날짜</option>
              <option value="modifiedAt">수정일</option>
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs">
              ▼
            </span>
          </div>

          {isSelectMode && (
            <>
              {isPublic ? (
                <button
                  onClick={onDownload}
                  className="bg-[#AC957B] text-white px-3 py-1 rounded hover:bg-[#5F360A] transition-colors"
                >
                  다운로드
                </button>
              ) : (
                <>
                  <button
                    onClick={onUpload}
                    className="bg-[#AC957B] text-white px-3 py-1 rounded hover:bg-[#5F360A] transition-colors"
                  >
                    업로드
                  </button>
                  <button
                    onClick={() =>
                      navigate("/merge", {
                        state: { ids: selectedItems, titles: selectedTitles },
                      })
                    }
                    className="bg-[#AC957B] text-white px-3 py-1 rounded hover:bg-[#5F360A] transition-colors"
                  >
                    합치기
                  </button>
                </>
              )}
              <span>{selectedItems.length}개 선택</span>
            </>
          )}
          <Checkbox checked={isSelectMode} onChange={onToggleAll} />
        </div>
      </header>

      <div className="flex flex-wrap gap-6 items-start">
        {Array.from(
          new Map(
            folders.map((f) => [`${f.type}-${f.id}-${f.name}`, f])
          ).values()
        ).map((f) => (
          <FolderItem
            key={`folder-${f.type}-${f.id}-${f.name}`}
            folder={f}
            onRefresh={onRefresh}
            onFolderClick={onFolderClick}
            onRename={onRename}
            onDelete={onDeleteFolder}
            onContextMenu={(e) =>
              handleContextMenu(e, ItemTypes.FOLDER, f.id)
            }
            isPublic={isPublic}
          />
        ))}

        {workbooks.map((wb) => (
          <WorkbookItem
            key={wb.id}
            workbook={wb}
            currentFolder={currentFolder}
            isSelectMode={isSelectMode}
            selected={selectedItems.includes(wb.id)}
            onSelect={onSelectItem}
            onRefresh={onRefresh}
            onDelete={onDeleteWorkbook}
            onRename={onRenameWorkbook}
            onContextMenu={(e) =>
              handleContextMenu(e, ItemTypes.WORKBOOK, wb.id)
            }
            isPublic={isPublic}
            onOpenPopup={setPopupId}
          />
        ))}

        {!isPublic && <AddFolderCard onClick={onAddFolder} />}
      </div>

      {ctxMenu.visible && (
        <ContextMenu
          x={ctxMenu.x}
          y={ctxMenu.y}
          options={[
            { label: "이름 변경", onClick: handleRenameContext },
            ...(ctxMenu.type === ItemTypes.WORKBOOK
              ? [{ label: "문제집 편집", onClick: handleEditContext }]
              : []),
            { label: "삭제", onClick: handleDeleteContext },
          ]}
          onClose={closeContextMenu}
        />
      )}

      {popupId && (
        <WorkbookProfilePopup
          workbookId={popupId}
          isPublic={isPublic}
          onClose={() => setPopupId(null)}
          onUpdated={() => {
            setPopupId(null);
            onRefresh();
          }}
        />
      )}
    </>
  );
}

// ─── FolderItem ───────────────────────────────────────────────────────────────
function FolderItem({ folder, onRefresh, onFolderClick, onRename, onContextMenu, isPublic }) {
  const [, drag] = useDrag({ type: ItemTypes.FOLDER, item: { id: folder.id } });
  const [, drop] = useDrop({
    accept: [ItemTypes.FOLDER, ItemTypes.WORKBOOK],
    drop: (item, monitor) => {
      if (item.id === folder.id) return;
      if (isPublic) return;
      const mover =
        monitor.getItemType() === ItemTypes.FOLDER ? moveFolder : moveWorkbook;
      mover(item.id, folder.id).then(onRefresh);
    },
  });

  const handleRename = (e) => {
    e.preventDefault();
    onRename(folder.id);
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      className="relative flex flex-col items-center w-20 cursor-pointer group"
      onClick={() => onFolderClick(folder.id)}
      onDoubleClick={handleRename}
      onContextMenu={onContextMenu}
    >
      <div className="relative w-[80px] h-[60px]">
        <img
          src={folderImg}
          alt="Folder"
          className="absolute top-1/2 left-1/2 w-15 h-15 transform -translate-x-1/2 -translate-y-1/2 object-contain"
        />
      </div>
      <span className="mt-2 text-sm font-medium text-[#5f360a] text-center break-words">
        {folder.name}
      </span>
    </div>
  );
}

// ─── AddFolderCard ────────────────────────────────────────────────────────────
function AddFolderCard({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center w-20 cursor-pointer group"
    >
      <div className="relative w-[80px] h-[80px] border-2 border-dashed border-[#DACEC0] rounded-md flex items-center justify-center group-hover:bg-[#F5EFE9] transition-colors">
        <span className="text-3xl text-[#DAC6A6]">＋</span>
      </div>
      <span className="mt-2 text-sm text-[#5f360a] opacity-70">추가하기</span>
    </div>
  );
}

// ─── WorkbookItem ─────────────────────────────────────────────────────────────
function WorkbookItem({
  workbook,
  currentFolder,
  isSelectMode,
  selected,
  onSelect,
  onRefresh,
  onRename,
  onContextMenu,
  onOpenPopup,
}) {
  const navigate = useNavigate();
  const [, drag] = useDrag({ type: ItemTypes.WORKBOOK, item: { id: workbook.id } });
  const [, drop] = useDrop({
    accept: ItemTypes.WORKBOOK,
    drop: () => moveWorkbook(workbook.id, currentFolder.id).then(onRefresh),
  });

  const handleRename = (e) => {
    e.preventDefault();
    onRename(workbook.id);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (isSelectMode) {
      onSelect(workbook.id);
    } else {
      onOpenPopup(workbook.id);
    }
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      className="relative flex flex-col items-center w-24 cursor-pointer group"
      onClick={handleClick}
      onDoubleClick={handleRename}
      onContextMenu={onContextMenu}
    >
      {isSelectMode && (
        <div className="absolute top-0.5 left-3 z-10 transform scale-75">
          <Checkbox checked={selected} onChange={() => onSelect(workbook.id)} />
        </div>
      )}
      <div className="relative w-[80px] h-[80px] bg-white border border-[#DACEC0] rounded-lg flex items-center justify-center shadow-sm transition-shadow hover:shadow-md">
        <div className="absolute top-1/2 left-1/2 bg-[#F3E9DC] rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <img src={workbookImg} alt="Workbook" className="w-10 h-10 object-contain" />
        </div>
      </div>
      <span className="mt-2 text-xs text-[#5f360a] text-center break-words">
        {workbook.name}
      </span>
    </div>
  );
}
