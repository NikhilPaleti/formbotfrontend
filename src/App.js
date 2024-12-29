import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Workspace from './components/Workspace';
import Settings from './components/Settings';
import { DarkModeProvider } from './DarkModeContext';
import FormBot from './components/FormBot';
import Answer from './components/Answer';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check for JWT token in local storage
        const token = localStorage.getItem('fp1_user_jwt');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <DarkModeProvider>
            <Router>
                <Routes>
                    <Route path="/" element={isLoggedIn ? <Workspace /> : <LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/workspace" element={<Workspace />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/answer/:formbotId" element={<Answer />} />
                    <Route path="/formbot/:formbotId" element={<FormBot />} />
                </Routes>
            </Router>
        </DarkModeProvider>
    );
}

export default App;


