import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { authService } from '../service/auth.service';
import '../assets/login.css';

export default function AdminLogin() {
    const [usuario, setUsuario] = useState('');
    const [clave, setClave] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await authService.adminLogin(usuario, clave);
            if (res.success) {
                Swal.fire({
                    title: '¡Bienvenido Admin!',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    background: '#1e293b',
                    color: '#fff'
                });
                navigate('/admin/dashboard');
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.message || 'Credenciales inválidas',
                icon: 'error',
                background: '#1e293b',
                color: '#fff'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card animate-fade">
                <div className="login-header">
                    <img src="/balon.png" alt="Logo" className="login-logo" />
                    <h1>Panel Administrador</h1>
                    <p>Ingresa tus credenciales de gestión</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Usuario</label>
                        <div className="input-with-icon">
                            <i className="fas fa-user-shield"></i>
                            <input 
                                type="text" 
                                placeholder="Admin User" 
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                required 
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Contraseña</label>
                        <div className="input-with-icon">
                            <i className="fas fa-lock"></i>
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                value={clave}
                                onChange={(e) => setClave(e.target.value)}
                                required 
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Verificando...' : 'Iniciar Sesión'}
                    </button>

                    <button 
                        type="button" 
                        className="btn-back" 
                        onClick={() => navigate('/login')}
                        style={{marginTop: '1rem'}}
                    >
                        <i className="fas fa-arrow-left"></i> Volver al Login Capitán
                    </button>
                </form>
            </div>
        </div>
    );
}
