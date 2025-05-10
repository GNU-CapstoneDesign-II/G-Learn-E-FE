// src/utils/ProtectedRoute.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import InformationPopup from "../components/common/InformationPopup.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function ProtectedRoute() {
  const { isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      setShowPopup(true);
    }
  }, [loading, isLoggedIn]);

  if (loading) {
    return null; // 로딩 스피너를 넣어도 좋습니다
  }

  if (!isLoggedIn && showPopup) {
    return (
      <InformationPopup
        message="로그인한 사용자만 접근할 수 있는 페이지입니다."
        onClose={() => {
          setShowPopup(false);
          navigate("/login", { replace: true, state: { from: location } });
        }}
      />
    );
  }

  return <Outlet />;
}