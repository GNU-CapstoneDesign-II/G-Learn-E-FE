import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Navbar from "../components/Navbar.module.jsx";

import PrivateSidebar from "../components/folder/PrivateSidebar";
import PublicSidebar  from "../components/folder/PublicSidebar";
import PrivateMain    from "../components/folder/PrivateMain";
import PublicMain     from "../components/folder/PublicMain";

export default function FolderPage() {
  const [tab, setTab] = useState("private");          // 기본 = Private

  const Sidebar = tab === "private" ? PrivateSidebar : PublicSidebar;
  const Main    = tab === "private" ? PrivateMain    : PublicMain;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-[#F9F4ED] font-sans relative">
        <Navbar />
        <div className="flex">
          <Sidebar tab={tab} setTab={setTab} />
          <Main />
        </div>
      </div>
    </DndProvider>
  );
}
