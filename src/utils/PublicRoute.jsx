// src/utils/ProtectedRoute.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import InformationPopup from "../components/common/InformationPopup.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function PublicRoute() {
  const { isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!loading && isLoggedIn) {
      setShowPopup(true);
    }
  }, [loading, isLoggedIn]);

  if (loading) {
    return null; // 로딩 스피너를 넣어도 좋습니다
  }

  if (isLoggedIn && showPopup) {
    return (
      <InformationPopup
        message="이미 로그인된 상태입니다."
        onClose={() => {
          setShowPopup(false);
          navigate("/", { replace: true });
        }}
      />
    );
  }

  return <Outlet />;
}