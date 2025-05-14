// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import PublicRoute from "./utils/PublicRoute.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import FindPassword from "./pages/FindPassword.jsx";
import MainPage from "./pages/MainPage.jsx";
import WorkbookSolve from "./pages/WorkbookSolve.jsx";
import ProblemGenerator from "./pages/ProblemGenerator.jsx";
import FolderPage from "./pages/FolderPage.jsx";
import Ranking from "./pages/Ranking.jsx";
import Mypage from './pages/MyPage.jsx';
import WorkbookEdit from './pages/WorkbookEdit.jsx'
import WorkbookMerge from './pages/WorkbookMerge.jsx';

function App() {
  return (
    <Routes>
      {/* 토큰 없을 때만 접근 가능한 라우트 */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/find-password" element={<FindPassword />} />
      </Route>

      {/* 토큰 있어야만 접근 가능한 라우트 */}
      <Route element={<ProtectedRoute />}>
        <Route path="/solve/:workbookId" element={<WorkbookSolve />} />
        <Route path="/generate-problem" element={<ProblemGenerator />} />
        <Route path="/folder" element={<FolderPage />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/edit/:ids" element={<WorkbookEdit />} />
      </Route>

      {/* 그 외 리디렉트 */}
      <Route path="*" element={<MainPage />} />
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/find-password" element={<FindPassword />} />
      <Route path="/solve/:workbookId" element={<WorkbookSolve />} />
      <Route path="/generate-problem" element={<ProblemGenerator />} />
      <Route path="/folder" element={<FolderPage />} />
      <Route path="/ranking" element={<Ranking />} />
      <Route path="/mypage" element={<Mypage />} />
      <Route path="/merge" element={<WorkbookMerge />} />
    </Routes>
  );
}

export default App;
