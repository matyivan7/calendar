import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import PrivateRoute from "./api/PrivateRoute.jsx";
import './index.css'
import MyCalendar from "./pages/Calendar.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />

            <Route path="/login" element={<Login />} />
            <Route path="/calendar_register_10" element={<Register />} />

            <Route
                path="/home"
                element={
                    <PrivateRoute>
                        <Home />
                    </PrivateRoute>
                }
            />

            <Route
                path="/calendar"
                element={
                    <PrivateRoute>
                        <MyCalendar />
                    </PrivateRoute>
                }
            />

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </BrowserRouter>
);
