/* ──────────────────────────────────────────────────────────────
   src/pages/FolderPage.jsx
────────────────────────────────────────────────────────────── */
import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Navbar from "../components/Navbar.jsx";
import LeftSidebar from "../components/LeftSidebar.jsx";

import PrivateMain from "../components/folder/PrivateMain.jsx";
import PublicMain from "../components/folder/PublicMain.jsx";

export default function FolderPage() {
  const [tab, setTab] = useState("private");

  const MainComponent = tab === "private" ? PrivateMain : PublicMain;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-[#F9F4ED] font-sans relative">
        <Navbar />
        <div className="flex">
          <LeftSidebar selectedTab={tab} setSelectedTab={setTab} />
          <MainComponent />
        </div>
      </div>
    </DndProvider>
  );
}