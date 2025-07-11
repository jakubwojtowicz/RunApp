import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PlanPage from './pages/PlanPage';
import HistoryPage from './pages/HistoryPage';
import Navbar from './components/Navbar';

function App() {
    return (
        <>
        <Navbar />
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/plan" element={<PlanPage />} />
        </Routes>
         </>
    );

}

export default App;
