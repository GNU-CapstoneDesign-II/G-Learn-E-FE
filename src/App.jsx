// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import FindPassword from "./pages/FindPassword.jsx";
import MainPage from "./pages/MainPage.jsx";
import WorkbookSolve from "./pages/WorkbookSolve.jsx";
import ProblemGenerator from "./pages/ProblemGenerator.jsx";
import Private from "./pages/Private.jsx";


function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/find-password" element={<FindPassword />} />
      <Route path="/solve/:workbookId" element={<WorkbookSolve />} />
      <Route path="/generate-problem" element={<ProblemGenerator />} />
      <Route path="/private" element={<Private />} />
    </Routes>
  );
}

export default App;