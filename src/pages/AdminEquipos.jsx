import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { equiposService } from '../service/equipos.service';
import { jugadoresService } from '../service/jugadores.service';
import Modal from '../components/Modal';

export default function AdminEquipos() {
    const [equipos, setEquipos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
    const [selectedEquipo, setSelectedEquipo] = useState(null);
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        loadEquipos();
    }, []);

    const loadEquipos = async () => {
        try {
            const data = await equiposService.getEquipos();
            setEquipos(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (equipo) => {
        const { value: formValues } = await Swal.fire({
            title: 'Editar Equipo',
            html: `
                <div style="text-align: left; margin-bottom: 0.5rem;"><label>Nombre del Equipo</label></div>
                <input id="swal-nombre" class="swal2-input" value="${equipo.nombre}">
                
                <div style="text-align: left; margin: 1.5rem 0 0.5rem;"><label>Logo del Equipo</label></div>
                <div class="logo-preview-container" style="margin-bottom: 1rem;">
                    <img id="logo-preview" src="${equipo.logo || '/balon.png'}" alt="Preview" style="max-height: 100px; border-radius: 8px;">
                </div>
                <input type="file" id="swal-logo" class="swal2-file" accept="image/*" style="width: 100%;">
                
                <div style="margin-top: 2rem;">
                    <button id="manage-players-btn" class="swal2-confirm swal2-styled" style="background-color: #3b82f6;">
                        <i class="fas fa-users"></i> Administrar Jugadores
                    </button>
                </div>
            `,
            background: '#1e293b', color: '#fff',
            showCancelButton: true,
            confirmButtonText: 'Guardar Cambios',
            didOpen: () => {
                const fileInput = document.getElementById('swal-logo');
                const preview = document.getElementById('logo-preview');
                const manageBtn = document.getElementById('manage-players-btn');

                fileInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => preview.src = e.target.result;
                        reader.readAsDataURL(file);
                    }
                });

                manageBtn.addEventListener('click', () => {
                    Swal.close();
                    handleShowPlayers(equipo);
                });
            },
            preConfirm: () => {
                const nombre = document.getElementById('swal-nombre').value;
                const fileInput = document.getElementById('swal-logo');
                
                if (!nombre) {
                    Swal.showValidationMessage('El nombre es obligatorio');
                    return false;
                }

                const formData = new FormData();
                formData.append('nombre', nombre);
                if (fileInput.files[0]) {
                    formData.append('logo', fileInput.files[0]);
                } else {
                    formData.append('logo', equipo.logo || '');
                }
                return formData;
            }
        });

        if (formValues) {
            try {
                await equiposService.updateEquipo(equipo.id, formValues);
                Swal.fire({ title: 'Actualizado', icon: 'success', background: '#1e293b', color: '#fff' });
                loadEquipos();
            } catch (error) {
                Swal.fire({ title: 'Error', text: error.message, icon: 'error', background: '#1e293b', color: '#fff' });
            }
        }
    };

    const handleShowPlayers = async (equipo) => {
        setSelectedEquipo(equipo);
        try {
            Swal.fire({ title: 'Cargando jugadores...', allowOutsideClick: false, didOpen: () => Swal.showLoading(), background: '#1e293b', color: '#fff' });
            const data = await jugadoresService.getJugadoresByEquipo(equipo.id);
            setPlayers(data);
            Swal.close();
            setIsPlayerModalOpen(true);
        } catch (error) {
            Swal.fire({ title: 'Error', text: error.message, icon: 'error' });
        }
    };

    const handleSavePlayer = async (id, nombre, apellido) => {
        try {
            await jugadoresService.updateJugador(id, { nombre, apellido });
            // Local update
            setPlayers(players.map(p => p.id === id ? { ...p, nombre, apellido } : p));
            Swal.fire({ title: 'Actualizado', icon: 'success', timer: 1000, showConfirmButton: false, background: '#1e293b', color: '#fff' });
        } catch (error) {
            Swal.fire({ title: 'Error', text: error.message, icon: 'error', background: '#1e293b', color: '#fff' });
        }
    };

    const handleDeletePlayer = async (id) => {
        const res = await Swal.fire({
            title: '¿Confirmas la eliminación?',
            icon: 'warning', showCancelButton: true, background: '#1e293b', color: '#fff'
        });
        if (res.isConfirmed) {
            try {
                await jugadoresService.deleteJugador(id);
                setPlayers(players.filter(p => p.id !== id));
            } catch (error) {
                Swal.fire({ title: 'Error', text: error.message, icon: 'error', background: '#1e293b', color: '#fff' });
            }
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar equipo?',
            text: 'Esto borrará a todos los jugadores asociados.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            background: '#1e293b', color: '#fff'
        });
        if (result.isConfirmed) {
            try {
                await equiposService.deleteEquipo(id);
                loadEquipos();
            } catch (error) {
                Swal.fire({ title: 'Error', text: error.message, icon: 'error' });
            }
        }
    };

    if (loading) return <div>Cargando equipos...</div>;

    return (
        <div className="home-page">
            <header className="dashboard-header responsive-header">
                <div className="team-info">
                    <h1>Gestión de Equipos</h1>
                    <p>Administra la información de todos los equipos registrados</p>
                </div>
            </header>

            <section className="players-section">
                <div className="players-table-container">
                    <table className="players-table">
                        <thead>
                            <tr>
                                <th>Logo</th>
                                <th>Nombre</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {equipos.map(e => (
                                <tr key={e.id} className="player-row">
                                    <td data-label="Logo">
                                        <img src={e.logo || '/balon.png'} alt="Logo" style={{width:40, height:40, borderRadius:'50%'}} />
                                    </td>
                                    <td data-label="Nombre">{e.nombre}</td>
                                    <td className="actions-cell" data-label="Acciones">
                                        <button className="btn-edit" onClick={() => handleEdit(e)}><i className="fas fa-edit"></i></button>
                                        <button className="btn-delete" onClick={() => handleDelete(e.id)}><i className="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Players Management Modal */}
            <Modal
                isOpen={isPlayerModalOpen}
                onClose={() => setIsPlayerModalOpen(false)}
                title={`Jugadores de ${selectedEquipo?.nombre}`}
            >
                <div style={{maxHeight: '400px', overflowY: 'auto'}}>
                    <table className="players-table" style={{width: '100%', borderCollapse: 'collapse'}}>
                        <thead>
                            <tr style={{color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase'}}>
                                <th style={{padding: '10px', borderBottom: '1px solid #334155'}}>Nombre</th>
                                <th style={{padding: '10px', borderBottom: '1px solid #334155'}}>Apellido</th>
                                <th style={{padding: '10px', borderBottom: '1px solid #334155'}}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map(p => (
                                <tr key={p.id}>
                                    <td style={{padding: '10px'}}>
                                        <input 
                                            id={`p-nombre-${p.id}`} 
                                            className="swal2-input" 
                                            defaultValue={p.nombre} 
                                            style={{margin:0, fontSize: '0.9rem', padding: '0.5rem', width: '100%'}}
                                        />
                                    </td>
                                    <td style={{padding: '10px'}}>
                                        <input 
                                            id={`p-apellido-${p.id}`} 
                                            className="swal2-input" 
                                            defaultValue={p.apellido} 
                                            style={{margin:0, fontSize: '0.9rem', padding: '0.5rem', width: '100%'}}
                                        />
                                    </td>
                                    <td style={{padding: '10px', display: 'flex', gap: '5px'}}>
                                        <button 
                                            onClick={() => handleSavePlayer(p.id, document.getElementById(`p-nombre-${p.id}`).value, document.getElementById(`p-apellido-${p.id}`).value)} 
                                            className="btn-edit" 
                                            title="Guardar"
                                        >
                                            <i className="fas fa-save"></i>
                                        </button>
                                        <button 
                                            onClick={() => handleDeletePlayer(p.id)} 
                                            className="btn-delete" 
                                            title="Eliminar"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Modal>
        </div>
    );
}
