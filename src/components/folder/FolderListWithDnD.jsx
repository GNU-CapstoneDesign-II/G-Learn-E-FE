// src/components/folder/FolderListWithDnD.jsx
import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { useNavigate } from "react-router-dom";
import Checkbox from "./Checkbox.jsx";
import { moveWorkbook, moveFolder } from "../../api/privateFolderApi.js";

const ItemTypes = { FOLDER: "folder", WORKBOOK: "workbook" };

/**
 * @param {"private" | "public"} mode  ← 추가: 기본값 "private"
 */
export default function FolderListWithDnD({
  mode = "private",

  /* 상단 툴바 props */
  selectedFolder,
  selectedItems,
  sortOption,
  onSortChange,
  onBack,
  onToggleAll,
  isSelectMode,
  onUpload,          // private: 업로드   | public: 복사(내 문제집으로)
  onMerge,           // private 전용
  /* 렌더링 props */
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
  const isRoot =
    mode === "public"
      ? filterDepth === 0
      : selectedFolder?.parentId == null;
  const isPublic = mode === "public";

  return (
    <>
      {/* ─── 상단 툴바 ────────────────────────────────────────────── */}
      <header className="fixed top-[66px] left-[200px] w-[calc(100%-200px)] flex items-center justify-between px-6 py-3 border-b border-[#e5d5c5] bg-[#fdf9f4] z-30">
        {/* ← 뒤로가기 + 경로 */}
        <div className="flex items-center gap-3">
          {!isRoot && (
            <button onClick={onBack} className="text-xl text-[#5f360a] hover:opacity-70">
              ◀
            </button>
          )}
          <h2 className="text-lg font-semibold text-[#5f360a]">
            {selectedFolder?.name ?? ""}
          </h2>
        </div>

        {/* → 정렬 + 선택툴 */}
        <div className="flex items-center gap-3 text-sm text-[#5f360a]">
          {/* 정렬 */}
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

          {/* 선택 모드 툴바 */}
          {isSelectMode && (
            <>
              {/* private ▸ 업로드 / 합치기 , public ▸ 복사 */}
              {isPublic ? (
                <button
                  onClick={onUpload}   /* onUpload = copyToPrivate */
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
                    onClick={() => onMerge?.(selectedItems)}
                    className="bg-[#AC957B] text-white px-3 py-1 rounded hover:bg-[#5F360A] transition-colors"
                  >
                    합치기
                  </button>
                </>
              )}
              <span>{selectedItems.length}개 선택</span>
            </>
          )}

          {/* 선택 on/off */}
          <Checkbox checked={isSelectMode} onChange={onToggleAll} />
        </div>
      </header>

      {/* ─── 폴더 / 문제집 리스트 ───────────────────────────────── */}
      <div className="flex flex-wrap gap-6 items-center">
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

        {workbooks.map((wb) => (
          <WorkbookItem
            key={wb.id}
            workbook={wb}
            currentFolder={currentFolder}
            isPublic={isPublic}
            isSelectMode={isSelectMode}
            selected={selectedItems.includes(wb.id)}
            onSelect={onSelectItem}
            onRefresh={onRefresh}
            onDelete={onDeleteWorkbook}
            onRename={onRenameWorkbook}
          />
        ))}

        {/* 폴더 추가 카드: private 전용 */}
        {!isPublic && <AddFolderCard onClick={onAddFolder} />}
      </div>
    </>
  );
}

/* ───────────────────────── 폴더 카드 ───────────────────────── */
function FolderItem({ folder, onRefresh, onFolderClick, onRename, onDelete }) {
  const [, drag] = useDrag({ type: ItemTypes.FOLDER, item: { id: folder.id } });
  const [, drop] = useDrop({
    accept: [ItemTypes.FOLDER, ItemTypes.WORKBOOK],
    drop: (item, monitor) => {
      const mover = monitor.getItemType() === ItemTypes.FOLDER ? moveFolder : moveWorkbook;
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
      {/* 삭제 */}
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

      {/* 폴더 그림 */}
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

/* ───────────────────────── 폴더 추가 카드 ──────────────────── */
function AddFolderCard({ onClick }) {
  return (
    <div onClick={onClick} className="flex flex-col items-center w-20 cursor-pointer group">
      <div className="relative w-[80px] h-[80px] border-2 border-dashed border-[#DACEC0] rounded-md flex items-center justify-center group-hover:bg-[#F5EFE9] transition-colors">
        <span className="text-3xl text-[#DAC6A6]">＋</span>
      </div>
      <span className="mt-2 text-sm text-[#5f360a] opacity-70">추가하기</span>
    </div>
  );
}

/* ───────────────────────── 문제집 카드 ─────────────────────── */
function WorkbookItem({
  workbook,
  currentFolder,
  isPublic,
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
      {/* 선택 체크박스 */}
      {isSelectMode && (
        <div className="absolute top-0.5 left-3 z-10 transform scale-75">
          <Checkbox checked={selected} onChange={() => onSelect(workbook.id)} />
        </div>
      )}

      {/* 삭제 */}
      {!isPublic && (
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
      )}

      {/* 문제집 썸네일 */}
      <div className="relative w-[80px] h-[80px] bg-white border border-[#DACEC0] rounded-lg flex items-center justify-center shadow-sm transition-shadow hover:shadow-md">
        <div className="absolute top-1/2 left-1/2 w-10 h-10 bg-[#F3E9DC] rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <span className="text-xl text-[#DAC6A6]">📄</span>
        </div>
      </div>

      {/* 업로드됨 아이콘 (public 전용) */}
      {isPublic && workbook.isUploaded && (
        <span className="absolute bottom-1 right-1 text-blue-500 text-lg pointer-events-none">
          ⬇
        </span>
      )}

      <span className="mt-2 text-xs text-[#5f360a] text-center break-words">
        {workbook.name}
      </span>
    </div>
  );
}
