import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { authService } from '../service/auth.service';

export default function AdminConfig() {
    const [user, setUser] = useState(null);
    const [usuario, setUsuario] = useState('');
    const [clave, setClave] = useState('');
    const [confirmarClave, setConfirmarClave] = useState('');

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setUsuario(currentUser.usuario);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (clave && clave !== confirmarClave) {
            Swal.fire({ title: 'Error', text: 'Las contraseñas no coinciden', icon: 'error' });
            return;
        }

        try {
            await authService.updateAdmin(user.id, { usuario, clave });
            Swal.fire({ title: '¡Éxito!', text: 'Perfil actualizado. Debes iniciar sesión nuevamente si cambiaste tus credenciales.', icon: 'success' });
            if (clave || usuario !== user.usuario) {
                authService.logout();
                window.location.href = '/admin/login';
            }
        } catch (error) {
            Swal.fire({ title: 'Error', text: error.message, icon: 'error' });
        }
    };

    if (!user) return <div>Cargando...</div>;

    return (
        <div className="home-page">
            <header className="dashboard-header">
                <div className="team-info">
                    <h1>Configuración de Cuenta</h1>
                    <p>Cambia tu nombre de usuario y contraseña de administrador</p>
                </div>
            </header>

            <div className="config-grid">
                <div className="config-card">
                    <h2><i className="fas fa-user-cog"></i> Mis Datos</h2>
                    <form className="config-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Usuario Administrador</label>
                            <input
                                type="text"
                                value={usuario}
                                onChange={e => setUsuario(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Nueva Contraseña (Dejar en blanco para mantener)</label>
                            <input
                                type="password"
                                value={clave}
                                onChange={e => setClave(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirmar Nueva Contraseña</label>
                            <input
                                type="password"
                                value={confirmarClave}
                                onChange={e => setConfirmarClave(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '1.5rem' }}>
                            Guardar Cambios
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
