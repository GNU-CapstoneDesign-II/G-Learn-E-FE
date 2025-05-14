// src/components/folder/PublicMain.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDrop } from "react-dnd";
import FolderListWithDnD from "./FolderListWithDnD.jsx";
import UploadPopup from "../common/UploadPopup.jsx";
import { copyWorkbookToPrivate } from "../../api/publicFolderApi";
import {
  getPublicWorkbooks,
  getPublicWorkbooksByCollege,
  getPublicWorkbooksByDepartment,
  getPublicWorkbooksBySubject,
} from "../../api/publicWorkbooksApi";

export default function PublicMain({
  selectedCollege,
  selectedDepartment,
  selectedSubject,
  filterDepth,
  page,
  size,
  sort,
  order,
}) {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);

  const [workbooks, setWorkbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("name");
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showCopyPopup, setShowCopyPopup] = useState(false);

  // 1) 필터 깊이에 따라 다른 엔드포인트 호출
  const loadWorkbooks = async () => {
    setLoading(true);
    try {
      let res;
      switch (filterDepth) {
        case 0:
          res = await getPublicWorkbooks(page, size, sort, order);
          break;
        case 1:
          res = await getPublicWorkbooksByCollege(
            selectedCollege.id,
            page,
            size,
            sort,
            order
          );
          break;
        case 2:
          res = await getPublicWorkbooksByDepartment(
            selectedDepartment.id,
            page,
            size,
            sort,
            order
          );
          break;
        case 3:
          res = await getPublicWorkbooksBySubject(
            selectedSubject.id,
            page,
            size,
            sort,
            order
          );
          break;
        default:
          res = { data: { data: [] } };
      }
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
  }, [filterDepth, page, size, sort, order]);

  // 2) 이름 정렬 시 null 안전 처리
  const sortedWorkbooks = useMemo(() => {
    const arr = [...workbooks];
    if (sortOption === "name") {
      return arr.sort((a, b) => {
        const nameA = a.name ?? "";
        const nameB = b.name ?? "";
        return nameA.localeCompare(nameB);
      });
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

  const makeTitle = () => {
    const parts = [
      selectedCollege?.name,
      selectedDepartment?.name,
      selectedSubject?.name,
    ].filter(Boolean);
    return parts.length > 0
      ? parts.join(" - ")
      : "Public";    // depth 0일 땐 “Public” 출력
  };

  // 3) 뒤로가기: 현재 가장 깊은 필터만 삭제해서 한 단계씩 위로 이동
  const handleBack = () => {
    const p = new URLSearchParams(search);
    if (p.has("subject")) {
      p.delete("subject");
      if (p.has("year")) p.delete("year");     // subject → department로 바로
    } else if (p.has("year")) {
      p.delete("year");                         // year → department
    } else if (p.has("sub")) {
      p.delete("sub");                          // department → college
    } else if (p.has("main")) {
      p.delete("main");                         // college → 루트
    }
    navigate(`/folder?${p.toString()}`);
  };

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
        onUpload={() => setShowCopyPopup(true)}
        currentFolder={{ id: null }}
        folders={[]}
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
