/*
// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import FindPassword from "./pages/FindPassword.jsx";
import MainPage from "./pages/MainPage.jsx";
import Private from "./pages/Private.jsx";
import Public from "./pages/Public.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/find-password" element={<FindPassword />} />
      <Route path="/private" element={<Private />} />
      <Route path="/Public" element={<Public />} />
    </Routes>
  );
}

export default App;
*/

// src/App.jsx 테스트
import React from "react";
import LeftSidebar from "./components/LeftSidebar.module";

function App() {
  return (
    <div>
      <h1>🔥 테스트용 페이지입니다</h1>
      <LeftSidebar />
    </div>
  );
}

export default App;
