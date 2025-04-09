import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DefaultLayout from './layouts/DefaultLayout';
import SolveLayout from './layouts/SolveLayout';
import Home from './pages/Home';

function App() {

    return (
        <Routes>
            <Route element={<DefaultLayout />}>
                <Route path="/" element={<Home />} />
                {/* 공통 레이아웃을 쓰는 페이지들 */}
            </Route>

            {/* <Route element={<SolveLayout />}>
                <Route path="/solve" element={<SolvePage />} />
            </Route> */}
        </Routes>
    );
}

export default App;
