// src/components/FolderListWithDnD.jsx
import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { useNavigate } from "react-router-dom";
import Checkbox from "./Checkbox.jsx";
import { moveWorkbook, moveFolder } from "../api/privateFolderApi.js";

const ItemTypes = { FOLDER: "folder", WORKBOOK: "workbook" };

export default function FolderListWithDnD({
  // 헤더용
  selectedFolder,
  selectedItems,
  sortOption,
  onSortChange,
  onBack,
  onToggleAll,
  isSelectMode,
  onUpload,
  // 그리드용
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
}) {
  const navigate = useNavigate();
  const isRoot = selectedFolder.parentId == null;

  return (
    <>
      {/* 헤더 */}
      <header className="fixed top-[61px] left-[200px] w-[calc(100%-200px)] flex items-center justify-between px-6 py-3 border-b border-[#e5d5c5] bg-[#fdf9f4] z-50">
        <div className="flex items-center gap-3">
          {!isRoot && (
            <button
              onClick={onBack}
              className="text-xl text-[#5f360a] hover:opacity-70"
            >
              ◀
            </button>
          )}
          <h2 className="text-lg font-semibold text-[#5f360a]">
            {selectedFolder.name}
          </h2>
        </div>

        <div className="flex items-center gap-3 text-sm text-[#5f360a]">
          {/* 정렬 */}
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none border px-3 py-1 pr-6 rounded text-sm"
            >
              <option value="최신순">최신순</option>
              <option value="오래된순">오래된순</option>
              <option value="업로드순">업로드순</option>
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs">
              ▼
            </span>
          </div>

          {/* 선택모드 툴바 */}
          {isSelectMode && (
            <>
              <button
                onClick={onUpload}
                className="bg-[#AC957B] text-white px-3 py-1 rounded hover:bg-[#5F360A] transition-colors"
              >
                업로드
              </button>
              <button
                onClick={() => navigate("/merge", { state: { ids: selectedItems } })}
                className="bg-[#AC957B] text-white px-3 py-1 rounded hover:bg-[#5F360A] transition-colors"
              >
                합치기
              </button>
              <span>{selectedItems.length}개 선택</span>
            </>
          )}

          {/* 전체 모드 전환 */}
          <Checkbox checked={isSelectMode} onChange={onToggleAll} />
        </div>
      </header>

      {/* 그리드 영역 */}
      <div className="flex flex-wrap gap-6">
        {folders.map((f) => (
          <FolderItem
            key={f.id}
            folder={f}
            onRefresh={onRefresh}
            onFolderClick={onFolderClick}
            onRename={onRename}
            onDelete={onDeleteFolder}
          />
        ))}

        <AddFolderCard onClick={onAddFolder} />

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
          />
        ))}
      </div>
    </>
  );
}

function FolderItem({ folder, onRefresh, onFolderClick, onRename, onDelete }) {
  const [, drag] = useDrag({ type: ItemTypes.FOLDER, item: { id: folder.id } });
  const [, drop] = useDrop({
    accept: [ItemTypes.FOLDER, ItemTypes.WORKBOOK],
    drop: (item, monitor) => {
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
      onContextMenu={handleRename}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(folder.id);
        }}
        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        title="삭제"
      >
        ×
      </button>

      <div className="relative w-[80px] h-[60px]">
        <div className="absolute top-0 left-0 w-[52px] h-[16px] bg-[#E0CCB3] border border-[#BDA68A] border-b-0 rounded-tl-md rounded-tr-md" />
        <div className="absolute top-[12px] left-0 w-full h-[48px] bg-[#C9A77F] border border-[#BDA68A] rounded-md" />
      </div>

      <span className="mt-2 text-sm font-medium text-[#5f360a] text-center break-words">
        {folder.name}
      </span>
    </div>
  );
}

function AddFolderCard({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center w-20 cursor-pointer group"
    >
      <div className="relative w-[80px] h-[60px] border-2 border-dashed border-[#DACEC0] rounded-md flex items-center justify-center group-hover:bg-[#F5EFE9] transition-colors">
        <span className="text-3xl text-[#DAC6A6]">＋</span>
      </div>
      <span className="mt-2 text-sm text-[#5f360a] opacity-70">추가하기</span>
    </div>
  );
}

function WorkbookItem({
  workbook,
  currentFolder,
  isSelectMode,
  selected,
  onSelect,
  onRefresh,
  onDelete,
  onRename,
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
      navigate(`/solve/${workbook.id}`);
    }
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      className="relative flex flex-col items-center w-24 cursor-pointer group"
      onClick={handleClick}
      onDoubleClick={handleRename}
      onContextMenu={handleRename}
    >
      {isSelectMode && (
        <div className="absolute top-0.5 left-3 z-10 transform scale-75">
          <Checkbox checked={selected} onChange={() => onSelect(workbook.id)} />
        </div>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(workbook.id);
        }}
        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        title="삭제"
      >
        ×
      </button>

      <div className="relative w-[80px] h-[80px] bg-white border border-[#DACEC0] rounded-lg flex items-center justify-center shadow-sm transition-shadow hover:shadow-md">
        <div className="absolute top-1/2 left-1/2 w-10 h-10 bg-[#F3E9DC] rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <span className="text-xl text-[#DAC6A6]">📄</span>
        </div>
      </div>

      <span className="mt-2 text-xs text-[#5f360a] text-center break-words">
        {workbook.name}
      </span>
    </div>
  );
}
