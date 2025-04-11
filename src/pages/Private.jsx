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

    const folders = [
        { id: 1, name: "운영체제" },
        { id: 2, name: "컴시개" },
        { id: 3, name: "인공지능" },
    ];

    const documents = [
        { id: 1, title: "2024 운영체제 중간" },
        { id: 2, title: "2024 운영체제 기말" },
    ];

    return (
        <>
            <Navbar />
            <LeftSideBar />
            <PrivateHeader
                selectedFolder={selectedFolder}
                selectedItems={[]} // 또는 상태로 관리해도 좋아요
                sortOption="최신순"
                onSortChange={(v) => console.log("정렬 변경:", v)}
                onClearSelection={() => console.log("선택 해제")}
                onBack={() => setSelectedFolder(null)}
            />

            <div className="container">
                <main className="main">
                    {!selectedFolder && (
                        <div className="grid">
                            {folders.map((folder) => (
                                <FolderCard
                                    key={folder.id}
                                    folder={folder}
                                    onClick={() => setSelectedFolder(folder)}
                                />
                            ))}
                            <AddCard onClick={() => alert("폴더 추가")} />
                        </div>
                    )}

                    {selectedFolder && (
                        <>
                            <div className="grid">
                                {documents.map((doc) => (
                                    <DocumentCard key={doc.id} title={doc.title} />
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
