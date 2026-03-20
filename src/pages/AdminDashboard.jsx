import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Asside from '../components/asside';
import { authService } from '../service/auth.service';
import AdminPartidos from './AdminPartidos';
import AdminPosiciones from './AdminPosiciones';
import AdminAdmins from './AdminAdmins';
import AdminEquipos from './AdminEquipos';
import AdminConfig from './AdminConfig';
import '../assets/home.css';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('partidos');
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (!user || user.role !== 'admin') {
            navigate('/admin/login');
            return;
        }
        setAdmin(user);
    }, [navigate]);

    if (!admin) return <div className="loading-screen">Cargando panel...</div>;

    const renderContent = () => {
        switch (activeTab) {
            case 'partidos': return <AdminPartidos />;
            case 'posiciones': return <AdminPosiciones />;
            case 'admins': return <AdminAdmins />;
            case 'equipos': return <AdminEquipos />;
            case 'config': return <AdminConfig />;
            default: return <AdminPartidos />;
        }
    };

    const adminItems = [
        { id: 'partidos', label: 'Partidos', icon: 'fas fa-volleyball-ball' },
        { id: 'posiciones', label: 'Posiciones', icon: 'fas fa-list-ol' },
        { id: 'equipos', label: 'Equipos', icon: 'fas fa-users' },
        { id: 'admins', label: 'Adminis.', icon: 'fas fa-user-shield' },
        { id: 'config', label: 'Config.', icon: 'fas fa-cog' }
    ];

    return (
        <div className="home-layout">
            <Navbar />
            <div className="home-container">
                <Asside 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    menuItems={adminItems}
                    footerText="Voley Sistems Admin"
                />

                <main className="main-content">
                    <div className="animate-fade">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
}
