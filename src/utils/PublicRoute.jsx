// src/utils/ProtectedRoute.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import InformationPopup from "../components/common/InformationPopup.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function PublicRoute() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      setShowPopup(true);
    }
  }, [isLoggedIn]);

  // 이미 로그인된 상태라면 팝업 띄우고, 확인 시 메인으로
  if (isLoggedIn) {
    return (
      showPopup && (
        <InformationPopup
          message="이미 로그인된 상태입니다."
          onClose={() => {
            setShowPopup(false);
            navigate("/", { replace: true });
          }}
        />
      )
    );
  }

  return <Outlet />;
}