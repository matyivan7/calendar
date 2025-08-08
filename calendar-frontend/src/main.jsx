import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import PrivateRoute from "./api/PrivateRoute.jsx";
import MyCalendar from "./pages/Calendar.jsx";
import NotFound from "./pages/NotFound.jsx";
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

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

            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
    </BrowserRouter>
);
