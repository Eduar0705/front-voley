import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../service/auth.service';
import '../assets/Navbar.css';

export default function Navbar() {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <nav className="captain-navbar">
            <div className="navbar-brand" onClick={() => navigate('/')}>
                <img src="/balon.png" alt="Logo" className="navbar-logo" />
                <span className="brand-text">Voley<span>Sistems</span></span>
            </div>
            <div className="navbar-actions">
                <div className="user-profile">
                    <i className="fas fa-user-circle"></i>
                    <span>{user?.nombre}</span>
                </div>
                <button onClick={handleLogout} className="logout-btn">
                    <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
                </button>
            </div>
        </nav>
    );
}
