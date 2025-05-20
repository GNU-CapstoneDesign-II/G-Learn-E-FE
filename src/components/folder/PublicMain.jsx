import React, { useState, useEffect, useMemo } from "react";
import { useDrop } from "react-dnd";
import FolderListWithDnD from "./FolderListWithDnD.jsx";
import UploadPopup from "../common/UploadPopup.jsx";
import { copyWorkbookToPrivate } from "../../api/publicFolderApi";
import {
  getColleges,
  getDepartments,
  getSubjects,
} from "../../api/workbookApi";

export default function PublicMain({
  selectedCollege = null,
  selectedDepartment = null,
  selectedSubject = null,
  page = 0,
  size = 20,
  sort = "name",
  order = "asc",
  handleBack,
  setSelectedCollege,
  setSelectedDepartment,
  setSelectedSubject,

}) {
  const [items, setItems] = useState([]);
  const [workbooks, setWorkbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("name");
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showCopyPopup, setShowCopyPopup] = useState(false);

  const filterDepth = selectedSubject
    ? 3
    : selectedDepartment
      ? 2
      : selectedCollege
        ? 1
        : 0;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (filterDepth === 0) {
          const [collegeRes, liberalRes] = await Promise.all([
            getColleges(false),
            getColleges(true),
          ]);
          const colleges = (collegeRes.data.data || []).map((c) => ({
            id: c.id,
            name: c.collegeName,
            type: "college",
          }));
          const liberal = (liberalRes.data.data || [])[0];
          const list = liberal
            ? [...colleges, { id: liberal.id, name: liberal.collegeName, type: "college" }]
            : colleges;
          setItems(list);
        } else if (filterDepth === 1 && selectedCollege) {
          const res = await getDepartments(selectedCollege.id);
          setItems((res.data.data || []).map((d) => ({
            id: d.id,
            name: d.departmentName,
            type: "department",
          })));
        } else if (filterDepth === 2 && selectedDepartment) {
          const res = await getSubjects(selectedDepartment.id);
          const grouped = Array.from(
            new Set((res.data.data || []).map((s) => s.grade).filter(Boolean))
          ).sort();
          setItems(grouped.map((g) => ({
            id: g,
            name: `${g}`,
            type: "grade",
          })));
        } else if (filterDepth === 3 && selectedDepartment) {
          const res = await getSubjects(selectedDepartment.id);
          const subjectList = res.data.data || [];
          const grade = selectedSubject?.id; // id = grade value
          const filtered = subjectList.filter((s) => String(s.grade) === String(grade));
          setItems(filtered.map((s) => ({
            id: s.id,
            name: s.subjectName,
            type: "subject", // ← 이걸로 onFolderClick도 가능하게
          })));
        }
        setIsSelectMode(false);
        setSelectedIds([]);
      } catch (err) {
        console.error("Public 폴더링 로딩 실패:", err);
        setItems([]);
        setWorkbooks([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedCollege, selectedDepartment, selectedSubject, filterDepth]);

  const sortedWorkbooks = useMemo(() => {
    if (sortOption !== "name") return workbooks;
    return [...workbooks].sort((a, b) =>
      (a.name ?? "").localeCompare(b.name ?? "")
    );
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
    return parts.length ? parts.join(" - ") : "Public";
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
              ? selectedSubject?.id
              : filterDepth === 2
                ? selectedDepartment?.id
                : filterDepth === 1
                  ? selectedCollege?.id
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
        onDownload={() => setShowCopyPopup(true)}
        currentFolder={{ id: null }}
        folders={items}
        workbooks={sortedWorkbooks}
        onRefresh={() => { }}
        onFolderClick={(id) => {
          const folder = items.find(f => f.id === id);
          if (!folder) return;
          switch (folder.type) {
            case "college":
              setSelectedCollege({ id: folder.id, name: folder.name });
              sidebarRef.current?.setMain(folder.id);
              break;
            case "department":
              setSelectedDepartment({ id: folder.id, name: folder.name });
              sidebarRef.current?.setSub(folder.id);
              break;
            case "grade":
              setSelectedSubject({ id: folder.id, name: folder.name });
              sidebarRef.current?.setSubject(folder.id);
              break;
          }
        }}
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
