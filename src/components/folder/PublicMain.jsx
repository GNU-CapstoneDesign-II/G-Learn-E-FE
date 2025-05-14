// src/components/folder/PublicMain.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDrop } from "react-dnd";
import FolderListWithDnD from "./FolderListWithDnD.jsx";
import UploadPopup from "../common/UploadPopup.jsx";
import { copyWorkbookToPrivate } from "../../api/publicFolderApi";
import axios from "../../api/axiosInstance";

export default function PublicMain({
  selectedCollege,
  selectedDepartment,
  selectedSubject,
  filterDepth,
}) {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const subjectId = params.get("subject");

  const [workbooks, setWorkbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("name");
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showCopyPopup, setShowCopyPopup] = useState(false);

  // 문제집 목록 불러오기
  const loadWorkbooks = async () => {
    if (!subjectId) {
      setWorkbooks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`/api/folder/public/workbooks/${subjectId}`);
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

  useEffect(() => {
    loadWorkbooks();
  }, [subjectId]);

  // 정렬된 문제집
  const sortedWorkbooks = useMemo(() => {
    const arr = [...workbooks];
    if (sortOption === "name") {
      return arr.sort((a, b) => a.name.localeCompare(b.name));
    }
    return arr;
  }, [workbooks, sortOption]);

  const toggleSelectMode = () => {
    setIsSelectMode((m) => !m);
    if (isSelectMode) setSelectedIds([]);
  };
  const handleSelect = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  // 상단바에 표시할 타이틀
  const makeTitle = () => {
    return (
      [
        selectedCollege?.name,
        selectedDepartment?.name,
        selectedSubject?.name,
      ]
        .filter(Boolean)
        .join(" - ") || "public"
    );
  };

  // 뒤로가기: URL 쿼리에서 depth 에 맞춰 하나씩 삭제
  const handleBack = () => {
    const p = new URLSearchParams(search);
    if (p.has("subject")) p.delete("subject");
    else if (p.has("department")) p.delete("department");
    else if (p.has("college")) p.delete("college");
    navigate(`/folder?${p.toString()}`);
  };

  // DnD 드롭존 (no-op)
  useDrop({ accept: ["folder", "workbook"], drop: () => { } });

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
              ? selectedSubject.id
              : filterDepth === 2
                ? selectedDepartment.id
                : filterDepth === 1
                  ? selectedCollege.id
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
        onUpload={() => setShowCopyPopup(true)}  // 복사(내문제집 담기)
        currentFolder={{ id: null }}
        folders={[]}  // public 에선 폴더 개념 없으니 빈 배열
        workbooks={sortedWorkbooks}
        onRefresh={loadWorkbooks}
        onFolderClick={() => { }}
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
