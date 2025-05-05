// src/components/FolderListWithDnD.jsx
import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { useNavigate } from "react-router-dom";
import { moveWorkbook, moveFolder } from "../api/privateFolderApi";

const ItemTypes = { FOLDER: "folder", WORKBOOK: "workbook" };

export default function FolderListWithDnD({
  currentFolder,
  folders,
  workbooks,
  onRefresh,
  onFolderClick,
  onRename,
  onDeleteFolder,
  onDeleteWorkbook,
  onRenameWorkbook,
}) {
  return (
    <div className="flex flex-wrap gap-6">
      {/* 폴더 리스트 */}
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

      {/* 문제집 리스트 */}
      {workbooks.map((wb) => (
        <WorkbookItem
          key={wb.id}
          workbook={wb}
          currentFolder={currentFolder}
          onRefresh={onRefresh}
          onDelete={onDeleteWorkbook}
          onRename={onRenameWorkbook}
        />
      ))}
    </div>
  );
}

function FolderItem({ folder, onRefresh, onFolderClick, onRename, onDelete }) {
  const [, drag] = useDrag({ type: ItemTypes.FOLDER, item: { id: folder.id } });
  const [, drop] = useDrop({
    accept: [ItemTypes.FOLDER, ItemTypes.WORKBOOK],
    drop: (item, monitor) => {
      if (monitor.getItemType() === ItemTypes.FOLDER) {
        moveFolder(item.id, folder.id).then(onRefresh);
      } else {
        moveWorkbook(item.id, folder.id).then(onRefresh);
      }
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

function WorkbookItem({ workbook, currentFolder, onRefresh, onDelete, onRename }) {
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

  return (
    <div
      ref={(node) => drag(drop(node))}
      className="relative flex flex-col items-center w-24 cursor-pointer group"
      onClick={() => navigate(`/solve/${workbook.id}`)}
      onDoubleClick={handleRename}
      onContextMenu={handleRename}
    >
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
