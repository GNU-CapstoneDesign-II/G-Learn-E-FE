import React, { useState } from "react";
import Navbar from "../components/Navbar.module";
import LeftSideBar from "../components/LeftSideBar.module";
import FolderCard from "../components/cards/FolderCard.module";
import DocumentCard from "../components/cards/DocumentCard.module";
import AddCard from "../components/cards/AddCard.module";
import "./Private.css";
import PrivateHeader from "../components/UseInPages/PrivateHeader.module";

export default function Private() {
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isSelectMode, setIsSelectMode] = useState(false);


    const folders = [
        { id: 1, name: "운영체제" },
        { id: 2, name: "컴시개" },
        { id: 3, name: "인공지능" },
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
            // 체크 모드 진입
            setIsSelectMode(true);
        } else {
            // 체크 모드 종료 + 선택 해제
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
            <LeftSideBar />
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

            <div className="container">
                <main className="main">
                    {!selectedFolder && (
                        <div className="grid">
                            {folders.map((folder) => (
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
                            <AddCard onClick={() => alert("폴더 추가")} />
                        </div>
                    )}

                    {selectedFolder && (
                        <>
                            <div className="grid">
                                {documents.map((doc) => (
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
                                <AddCard onClick={() => alert("문서 추가")} />
                            </div>
                        </>
                    )}
                </main>
            </div>
        </>
    );
}