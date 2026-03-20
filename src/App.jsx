
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./index";
import Login from "./auth/login";
import Registro from "./auth/registro";
import Home from "./pages/home";
import Jugadores from "./pages/jugadores";
import Juegos from "./pages/juegos";
import Tabla from './pages/tabla';

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/jugadores" element={<Jugadores />} />
        <Route path="/juegos" element={<Juegos />} />
        <Route path="/tabla" element={<Tabla />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
