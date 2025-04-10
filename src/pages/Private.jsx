import React, { useState } from "react";
import Navbar from "../components/Navbar.module";
import LeftSideBar from "../components/LeftSideBar.module";
import FolderCard from "../components/cards/FolderCard.module";
import DocumentCard from "../components/cards/DocumentCard.module";
import AddCard from "../components/cards/AddCard.module";
import "./Private.css"; // ✅ 일반 CSS

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
            <div className="container">
                <main className="main">
                    <h2 className="title">private</h2>

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
                            <div className="folderHeader">
                                <button onClick={() => setSelectedFolder(null)}>◀ 뒤로</button>
                                <h3>{selectedFolder.name}</h3>
                            </div>

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
