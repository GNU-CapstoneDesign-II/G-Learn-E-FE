// src/utils/ProtectedRoute.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import InformationPopup from "../components/common/InformationPopup.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function ProtectedRoute() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setShowPopup(true);
    }
  }, [isLoggedIn]);

  // 아직 로그인하지 않았으면 팝업만 띄우고, 로그인 후엔 Outlet 렌더
  if (!isLoggedIn) {
    return (
      showPopup && (
        <InformationPopup
          message="로그인한 사용자만 접근할 수 있는 페이지입니다."
          onClose={() => {
            setShowPopup(false);
            // 원래 가려던 페이지 대신 로그인 페이지로
            navigate("/login", { replace: true, state: { from: location } });
          }}
        />
      )
    );
  }

  return <Outlet />;
}