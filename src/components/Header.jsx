import { Link } from "react-router-dom";
import '../assets/Header.css'

export default function Header() {
    return (
        <header className="header-index">
            <div className="header-container">
                <div className="logo">
                    <img src="/balon.png" alt="Voley Logo" className="logo-img" />
                    <span className="logo-text">Voley<span>Iujo</span></span>
                </div>
                <div className="header-actions">
                    <Link to="/login" className="btn btn-secondary">Iniciar Sesión</Link>
                    <Link to="/registro" className="btn btn-primary">Registrar Equipo</Link>
                </div>
            </div>
        </header>
    );
}