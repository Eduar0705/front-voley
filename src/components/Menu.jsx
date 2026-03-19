import { Link } from "react-router-dom";
import '../assets/Menu.css'

export default function Menu() {
    return (
        <nav className="menu-index animate-fade">
            <div className="menu-container">
                <ul className="menu-list">
                    <li><Link to="/" className="menu-link"><i className="fas fa-home"></i> Inicio</Link></li>
                    <li><Link to="/juegos"><i className="fas fa-calendar-alt"></i> Partidos</Link></li>
                <li><Link to="/jugadores"><i className="fas fa-users"></i> Equipos</Link></li>
                <li><Link to="/tabla"><i className="fas fa-list-ol"></i> Clasificación</Link></li>
            </ul>
            </div>
        </nav>
    );
}