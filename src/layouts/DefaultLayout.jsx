import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';
import Home from '../pages/Home';

function DefaultLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Home /> {/* 자식 페이지(Home 등)가 여기 렌더링됨 */}
      </main>
      <Footer />
    </div>
  );
}

export default DefaultLayout;
