import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TrainingPlanPage from './pages/TrainingPlanPage';
import Navbar from './components/Navbar';

function App() {
    return (
        <>
        <Navbar />
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/plan" element={<TrainingPlanPage />} />
        </Routes>
         </>
    );

}

export default App;
