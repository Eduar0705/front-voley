import React from 'react';
import '../assets/navigation.css';

export default function Asside({ activeTab, setActiveTab, menuItems, footerText = "Voley Sistems" }) {
    if (!menuItems) return null;

    return (
        <aside className="navigation-sidebar">
            <div className="nav-header">
                <h3>Menú</h3>
            </div>
            <nav className="nav-content">
                <ul className="nav-list">
                    {menuItems.map((item) => (
                        <li
                            key={item.id}
                            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.id)}
                        >
                            <i className={item.icon}></i>
                            <span>{item.label}</span>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="nav-footer">
                <p>{footerText}</p>
            </div>
        </aside>
    );
}
