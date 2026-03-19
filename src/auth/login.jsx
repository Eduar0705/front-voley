import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { authService } from "../service/auth.service";
import '../assets/login.css'

export default function Login() {
    const navigate = useNavigate();
    const [cedula, setCedula] = useState('');
    const [clave, setClave] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await authService.login(cedula, clave);
            if (data.success) {
                navigate('/home');
            }
        } catch (err) {
            Swal.fire({
                title: 'Error',
                text: err.message || 'Cédula o clave incorrecta',
                icon: 'error',
                background: '#0f172a',
                color: '#f8fafc',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page animate-fade">
            <div className="login-card">
                <div className="login-header">
                    <img src="/balon.png" alt="Logo" className="login-logo" />
                    <h1>Bienvenido de nuevo</h1>
                    <p>Ingresa tus datos para continuar</p>
                </div>
                
                <form className="login-form" onSubmit={handleSubmit}>
                    {/* Inline error removed in favor of Swal.fire */}
                    
                    <div className="form-group">
                        <label htmlFor="cedula">Cédula</label>
                        <div className="input-with-icon">
                            <i className="fas fa-id-card"></i>
                            <input 
                                type="text" 
                                id="cedula" 
                                placeholder="Ej: 12.345.678" 
                                required 
                                value={cedula}
                                onChange={(e) => setCedula(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="clave">Clave</label>
                        <div className="input-with-icon">
                            <i className="fas fa-lock"></i>
                            <input 
                                type="password" 
                                id="clave" 
                                placeholder="••••••••" 
                                required 
                                value={clave}
                                onChange={(e) => setClave(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-options">
                        <label className="checkbox-container">
                            <input type="checkbox" />
                            <span className="checkmark"></span>
                            Recordarme
                        </label>
                        <a href="#" className="forgot-password">¿Olvidaste tu clave?</a>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar al Sistema'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>¿No tienes un equipo? <Link to="/registro">Regístrate aquí</Link></p>
                    <button onClick={() => navigate('/')} className="btn-back">
                        <i className="fas fa-arrow-left"></i> Volver al Inicio
                    </button>
                </div>
            </div>
        </div>
    );
}