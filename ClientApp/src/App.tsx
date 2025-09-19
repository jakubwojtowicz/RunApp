import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TrainingPlanPage from './pages/TrainingPlanPage';
import Navbar from './components/Navbar';
import { TrainingProvider } from "./context/TrainingPlanContext";

function App() {
    return (
        <TrainingProvider>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/plan" element={<TrainingPlanPage />} />
            </Routes>
        </TrainingProvider>
    );
}

export default App;
