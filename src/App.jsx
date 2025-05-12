// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import FindPassword from "./pages/FindPassword.jsx";
import MainPage from "./pages/MainPage.jsx";
import WorkbookSolve from "./pages/WorkbookSolve.jsx";
import ProblemGenerator from "./pages/ProblemGenerator.jsx";
import FolderPage from "./pages/FolderPage.jsx";
import Ranking from "./pages/Ranking.jsx";
import Mypage from './pages/MyPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/find-password" element={<FindPassword />} />
      <Route path="/solve/:workbookId" element={<WorkbookSolve />} />
      <Route path="/generate-problem" element={<ProblemGenerator />} />
      <Route path="/folder" element={<FolderPage />} />
      <Route path="/ranking" element={<Ranking />} />
      <Route path="/mypage" element={<Mypage />} />
    </Routes>
  );
}

export default App;
