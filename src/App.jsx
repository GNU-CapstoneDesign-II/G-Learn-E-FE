/*
// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import FindPassword from "./pages/FindPassword.jsx";
import MainPage from "./pages/MainPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/find-password" element={<FindPassword />} />
    </Routes>
  );
}

export default App;



*/



/*
// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import FindPassword from "./pages/FindPassword.jsx";
import MainPage from "./pages/MainPage.jsx";
import Private from "./pages/Private.jsx";


function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/find-password" element={<FindPassword />} />
      <Route path="/private" element={<Private />} />
    </Routes>
  );
}

export default App;
*/


/*
// src/App.jsx 테스트 (테스트용_ 삭제하지 말아주세요.)
import React from "react";
import LeftSidebar from "./components/LeftSideBar.module";

function App() {
  return (
    <div>
      <h1>🔥 테스트용 페이지입니다</h1>
      <LeftSidebar />
    </div>
  );
}

export default App;

*/


/*
// cards컴포넌트 테스트용 - 삭제하지 마세요. 
import React from "react";
import FolderCard from "./components/cards/FolderCard.module";
import DocumentCard from "./components/cards/DocumentCard.module"; // ✅ 추
import AddCard from "./components/cards/AddCard.module";

function App() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>🔥 카드 컴포넌트 테스트</h1>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-end" }}>
        <FolderCard
          folder={{ id: 1, name: "운영체제" }}
          onClick={() => alert("운영체제 폴더 클릭됨!")}
        />
        <DocumentCard title="2024 운영체제 중간" />
        <AddCard onClick={() => console.log("추가하기 클릭됨")} />

      </div>
    </div>
  );
}

export default App;

*/

// src/App.jsx 테스트 (테스트용_ 삭제하지 말아주세요.)
import React from "react";
import Private from "./pages/Private";
function App() {
  return (
    <div>
      <Private />
    </div>
  );
}

export default App;
