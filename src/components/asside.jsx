import React from 'react';
import '../assets/Asside.css';

export default function Asside({ activeTab, setActiveTab }) {
    const menuItems = [
        { id: 'dashboard', label: 'Home', icon: 'fas fa-chart-line' },
        { id: 'equipo', label: 'Mi Equipo', icon: 'fas fa-users-cog' },
        { id: 'config', label: 'Ajustes', icon: 'fas fa-sliders-h' }
    ];

    return (
        <aside className="captain-sidebar">
            <div className="sidebar-header">
                <h3>Menú Principal</h3>
            </div>
            <nav className="sidebar-nav">
                <ul className="sidebar-list">
                    {menuItems.map(item => (
                        <li 
                            key={item.id}
                            className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.id)}
                        >
                            <i className={item.icon}></i>
                            <span>{item.label}</span>
                            {activeTab === item.id && <div className="active-indicator"></div>}
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="sidebar-footer">
                <p>© 2026 Voley Sistems</p>
            </div>
        </aside>
    );
}
