/* ──────────────────────────────────────────────────────────────
   src/pages/Private.jsx
────────────────────────────────────────────────────────────── */
import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrop } from "react-dnd";
import Navbar from "../components/Navbar.module.jsx";
import bgLogo from "../assets/image-logo.png";
import {
    fetchPrivateFolder,
    createPrivateFolder,
    moveFolder,
    moveWorkbook,
    renameFolder,
    deleteFolder,
    deleteWorkbook,
    renameWorkbook,
} from "../api/privateFolderApi";
import FolderListWithDnD from "../components/FolderListWithDnD";
import FolderCreatePopup from "../components/common/FolderCreatePopup";

const ItemTypes = { FOLDER: "folder", WORKBOOK: "workbook" };

export default function Private() {
    return (
        <DndProvider backend={HTML5Backend}>
            <PrivateBody />
        </DndProvider>
    );
}

function PrivateBody() {
    const [tab, setTab] = useState("private");
    const [folderData, setFolderData] = useState({
        id: null,
        name: "private",
        parentId: null,
        childFolders: [],
        childWorkbooks: [],
    });
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);

    /* 폴더 로드 */
    const loadFolder = async (id = null) => {
        setLoading(true);
        try {
            const data = await fetchPrivateFolder(id);
            setFolderData(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadFolder(); }, []);

    /* 폴더 생성 */
    const handleCreateFolder = async (name) => {
        await createPrivateFolder({ name, parentId: folderData.id });
        setShowPopup(false);
        loadFolder(folderData.id);
    };

    /* 현재 폴더 이름 변경 */
    const handleRenameCurrent = async () => {
        if (!folderData.id) return;        // 루트 제외
        const newName = prompt("새 폴더 이름", folderData.name);
        if (!newName?.trim() || newName === folderData.name) return;
        await renameFolder(folderData.id, newName.trim());
        loadFolder(folderData.id);
    };

    /* 현재 폴더 삭제 */
    const handleDeleteCurrent = async () => {
        if (!folderData.id) return;
        if (!window.confirm("현재 폴더를 삭제할까요?")) return;
        await deleteFolder(folderData.id);
        loadFolder(folderData.parentId);   // 상위로 이동
    };

    /* 헤더 드롭존(상위 폴더 이동) */
    const [, headerDropRef] = useDrop({
        accept: [ItemTypes.FOLDER, ItemTypes.WORKBOOK],
        drop: (item, monitor) => {
            const targetId = folderData.parentId || 0;
            if (monitor.getItemType() === ItemTypes.FOLDER) {
                moveFolder(item.id, targetId).then(() => loadFolder(targetId));
            } else {
                moveWorkbook(item.id, targetId).then(() => loadFolder(targetId));
            }
        },
    });

    if (loading)
        return <div className="min-h-screen flex items-center justify-center">로딩 중…</div>;

    return (
        <div className="min-h-screen bg-[#F9F4ED] font-sans relative">
            <Navbar />

            <div className="flex">
                {/* --------------- 사이드바 --------------- */}
                <aside className="fixed top-[80px] left-0 w-[200px] h-[calc(100vh-80px)] bg-white border-r-2 border-[#E6CEBA] p-5 flex flex-col">
                    {["private", "public"].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`flex items-center gap-2 mb-6 h-10 px-3 rounded-r-full transition-colors ${tab === t
                                    ? "bg-[#FBF8F5] text-[#5f360a] font-semibold border-l-4 border-[#5f360a]"
                                    : "text-[#704214] border-l-2 border-[#a1724c] hover:bg-[#FBF8F5]"
                                }`}
                        >
                            <span>{t === "private" ? "👤" : "🧑‍🤝‍🧑"}</span>{t}
                        </button>
                    ))}
                </aside>

                {/* --------------- 메인 --------------- */}
                <main className="ml-[200px] mt-[80px] flex-1 p-8">
                    {/* 헤더(폴더명) */}
                    <div ref={headerDropRef} className="flex items-center mb-6 gap-2">
                        {folderData.parentId !== null && (
                            <button onClick={() => loadFolder(folderData.parentId)} className="text-2xl text-[#5f360a]">
                                &lt;
                            </button>
                        )}

                        <h1 className="text-2xl font-semibold text-[#5f360a] lowercase">
                            {folderData.name}
                        </h1>

                        {/* 이름 변경 / 삭제 (루트 제외) */}
                        {folderData.id && (
                            <>
                                <button
                                    onClick={handleRenameCurrent}
                                    className="px-3 py-1 text-xs border border-[#bba999] rounded-full text-[#5f360a] hover:bg-[#f1ece7]"
                                >
                                    이름 변경
                                </button>
                                <button
                                    onClick={handleDeleteCurrent}
                                    className="px-3 py-1 text-xs border border-[#d66] text-[#d66] rounded-full hover:bg-[#fdeeee]"
                                >
                                    삭제
                                </button>
                            </>
                        )}

                        <button
                            onClick={() => setShowPopup(true)}
                            className="ml-auto px-4 py-2 bg-[#E0CCB3] text-white rounded-full hover:bg-[#d4b8a3]"
                        >
                            폴더 추가
                        </button>
                    </div>

                    <div className="border-b-2 border-[#DACEC0] mb-6" />

                    {/* 폴더 + 문제집 그리드 */}
                    <FolderListWithDnD
                        currentFolder={folderData}
                        folders={folderData.childFolders}
                        workbooks={folderData.childWorkbooks}
                        onRefresh={() => loadFolder(folderData.id)}
                        onFolderClick={(id) => loadFolder(id)}
                        onRename={async (id) => {
                            const newName = prompt("새 폴더 이름을 입력하세요");
                            if (!newName) return;
                            await renameFolder(id, newName);
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
                        onRenameWorkbook={async (wid) => {          /* ★ 추가 */
                            const newName = prompt("새 문제집 이름을 입력하세요");
                            if (!newName) return;
                            await renameWorkbook(wid, newName);
                            loadFolder(folderData.id);
                        }}
                    />
                    {/* 배경 로고 */}
                    <img
                        src={bgLogo}
                        alt=""
                        className="pointer-events-none absolute top-1/2 left-1/2
                       w-48 opacity-10 transform -translate-x-1/2 -translate-y-1/2"
                    />
                </main>
            </div>

            {/* 새 폴더 팝업 */}
            <FolderCreatePopup
                visible={showPopup}
                onCancel={() => setShowPopup(false)}
                onCreate={handleCreateFolder}
            />
        </div>
    );
}
