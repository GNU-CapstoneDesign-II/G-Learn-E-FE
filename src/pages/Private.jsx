import React, { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import LeftSideBar from "../components/LeftSideBar.jsx";
import FolderCard from "../components/cards/FolderCard.jsx";
import DocumentCard from "../components/cards/DocumentCard.jsx";
import AddCard from "../components/cards/AddCard.jsx";
import PrivateHeader from "../components/UseInPages/PrivateHeader.jsx";

export default function Private() {
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isSelectMode, setIsSelectMode] = useState(false);

    const folders = [
        { id: 1, name: "운영체제" },
        { id: 2, name: "컴시개" },
        { id: 3, name: "인공지능" },
        { id: 4, name: "알고리즘" },
    ];

    const documents = [
        { id: 1, title: "2024 운영체제 중간" },
        { id: 2, title: "2024 운영체제 기말" },
    ];

    const isSelected = (id) => selectedItems.includes(id);

    const handleToggleSelect = (id) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleToggleAll = () => {
        if (!isSelectMode) {
            setIsSelectMode(true);
        } else {
            setIsSelectMode(false);
            setSelectedItems([]);
        }
    };

    const clearSelection = () => {
        setSelectedItems([]);
        setIsSelectMode(false);
    };

    return (
        <>
            <Navbar />

            {/* 전체 화면 레이아웃 */}
            <div className="pt-[64px] min-h-screen flex bg-[#f8f1e7] text-[#5F360A]">
                {/* 고정 사이드바 */}
                <LeftSideBar />

                {/* 오른쪽 컨텐츠 - 사이드바 고려해서 margin-left 줌 */}
                <div className="flex-1 ml-[200px] p-6">
                    <PrivateHeader
                        selectedFolder={selectedFolder}
                        selectedItems={selectedItems}
                        isSelectMode={isSelectMode}
                        onBack={() => {
                            setSelectedFolder(null);
                            clearSelection();
                        }}
                        sortOption="최신순"
                        onSortChange={(v) => console.log(v)}
                        onClearSelection={clearSelection}
                        onToggleAll={handleToggleAll}
                    />

                    <main className="mt-10">
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-6">
                            {!selectedFolder &&
                                folders.map((folder) => (
                                    <FolderCard
                                        key={folder.id}
                                        folder={folder}
                                        isSelected={isSelected(folder.id)}
                                        isSelectMode={isSelectMode}
                                        onToggleSelect={() => handleToggleSelect(folder.id)}
                                        onClick={() => {
                                            if (!isSelectMode) setSelectedFolder(folder);
                                            else handleToggleSelect(folder.id);
                                        }}
                                    />
                                ))}
                            {selectedFolder &&
                                documents.map((doc) => (
                                    <DocumentCard
                                        key={doc.id}
                                        title={doc.title}
                                        isSelected={isSelected(doc.id)}
                                        isSelectMode={isSelectMode}
                                        onToggleSelect={() => handleToggleSelect(doc.id)}
                                        onClick={() => {
                                            if (!isSelectMode) alert("문서 열기");
                                            else handleToggleSelect(doc.id);
                                        }}
                                    />
                                ))}

                            <AddCard onClick={() => alert("추가하기")} />
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
