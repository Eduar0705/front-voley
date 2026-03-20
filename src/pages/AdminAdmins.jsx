import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { authService } from '../service/auth.service';

export default function AdminAdmins() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAdmins();
    }, []);

    const loadAdmins = async () => {
        try {
            const data = await authService.getAdmins();
            setAdmins(data);
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Error al cargar',
                text: 'No se pudieron cargar los administradores',
                icon: 'error',
                ...modalTheme
            });
        } finally {
            setLoading(false);
        }
    };

    // Tema consistente para todos los modales
    const modalTheme = {
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
    };

    const handleAddAdmin = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Nuevo Administrador',
            html: `
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <input id="swal-user" class="swal2-input" placeholder="Usuario" autocomplete="off">
                    <input id="swal-pass" type="password" class="swal2-input" placeholder="Contraseña" autocomplete="new-password">
                </div>
            `,
            ...modalTheme,
            showCancelButton: true,
            focusConfirm: false,
            preConfirm: () => {
                const usuario = document.getElementById('swal-user').value.trim();
                const clave = document.getElementById('swal-pass').value;

                if (!usuario || !clave) {
                    Swal.showValidationMessage('Ambos campos son requeridos');
                    return false;
                }
                if (clave.length < 4) {
                    Swal.showValidationMessage('La contraseña debe tener al menos 4 caracteres');
                    return false;
                }
                return { usuario, clave };
            }
        });

        if (formValues) {
            try {
                Swal.fire({ title: 'Creando...', allowOutsideClick: false, didOpen: () => Swal.showLoading(), ...modalTheme });
                await authService.createAdmin(formValues);
                Swal.fire({ title: 'Administrador creado', icon: 'success', timer: 1500, showConfirmButton: false, ...modalTheme });
                loadAdmins();
            } catch (error) {
                Swal.fire({ title: 'Error', text: error.message, icon: 'error', ...modalTheme });
            }
        }
    };

    const handleEditAdmin = async (admin) => {
        const { value: formValues } = await Swal.fire({
            title: 'Editar Administrador',
            html: `
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <input id="swal-user" class="swal2-input" placeholder="Usuario" autocomplete="off">
                    <input id="swal-pass" type="password" class="swal2-input" placeholder="Nueva contraseña (opcional)" autocomplete="new-password">
                </div>
            `,
            ...modalTheme,
            showCancelButton: true,
            focusConfirm: false,
            didOpen: () => {
                // Forma segura de setear el valor (evita XSS)
                document.getElementById('swal-user').value = admin.usuario;
            },
            preConfirm: () => {
                const usuario = document.getElementById('swal-user').value.trim();
                const clave = document.getElementById('swal-pass').value;

                if (!usuario) {
                    Swal.showValidationMessage('El usuario es requerido');
                    return false;
                }
                if (clave && clave.length < 4) {
                    Swal.showValidationMessage('La contraseña debe tener al menos 4 caracteres');
                    return false;
                }
                return { usuario, clave: clave || undefined };
            }
        });

        if (formValues) {
            try {
                Swal.fire({ title: 'Actualizando...', allowOutsideClick: false, didOpen: () => Swal.showLoading(), ...modalTheme });
                await authService.updateAdmin(admin.id, formValues);
                Swal.fire({ title: 'Actualizado correctamente', icon: 'success', timer: 1500, showConfirmButton: false, ...modalTheme });
                loadAdmins();
            } catch (error) {
                Swal.fire({ title: 'Error', text: error.message, icon: 'error', ...modalTheme });
            }
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar administrador?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            ...modalTheme,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Sí, eliminar'
        });

        if (result.isConfirmed) {
            try {
                Swal.fire({ title: 'Eliminando...', allowOutsideClick: false, didOpen: () => Swal.showLoading(), ...modalTheme });
                await authService.deleteAdmin(id);
                Swal.fire({ title: 'Eliminado', icon: 'success', timer: 1500, showConfirmButton: false, ...modalTheme });
                loadAdmins();
            } catch (error) {
                Swal.fire({ title: 'Error', text: error.message, icon: 'error', ...modalTheme });
            }
        }
    };

    if (loading) return <div className="loading-spinner">Cargando...</div>;

    return (
        <div className="home-page">
            <header className="dashboard-header responsive-header">
                <div className="team-info">
                    <h1>Gestión de Administradores</h1>
                    <p>Crea y gestiona cuentas con acceso al panel</p>
                </div>
                <button className="btn btn-primary" onClick={handleAddAdmin}>
                    <i className="fas fa-plus"></i> Nuevo Admin
                </button>
            </header>

            <section className="players-section">
                {admins.length === 0 ? (
                    <div className="empty-state">
                        <i className="fas fa-users-cog"></i>
                        <p>No hay administradores registrados</p>
                    </div>
                ) : (
                    <div className="players-table-container">
                        <table className="players-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Usuario</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.map(a => (
                                    <tr key={a.id} className="player-row">
                                        <td data-label="ID">{a.id}</td>
                                        <td data-label="Usuario">{a.usuario}</td>
                                        <td className="actions-cell" data-label="Acciones">
                                            <button className="btn-edit" onClick={() => handleEditAdmin(a)} title="Editar">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="btn-delete" onClick={() => handleDelete(a.id)} title="Eliminar">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}