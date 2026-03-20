import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { partidoService } from '../service/partido.service';
import { equiposService } from '../service/equipos.service';
import { jugadoresService } from '../service/jugadores.service';
import Modal from '../components/Modal';

export default function AdminPartidos() {
    const [partidos, setPartidos] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPartido, setSelectedPartido] = useState(null);
    const [matchPlayers, setMatchPlayers] = useState([]);
    const [formValues, setFormValues] = useState({
        scoreA: 0,
        scoreB: 0,
        status: 'upcoming',
        mvp_id: '',
        armador_id: '',
        atacante_id: '',
        receptor_id: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [pData, eData] = await Promise.all([
                partidoService.getPartidos(),
                equiposService.getEquipos()
            ]);
            setPartidos(pData);
            setEquipos(eData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateMatch = async () => {
        if (equipos.length < 2) {
            Swal.fire({ title: 'Error', text: 'Se necesitan al menos 2 equipos', icon: 'error' });
            return;
        }

        const { value: values } = await Swal.fire({
            title: 'Programar Partido',
            html: `
                <select id="swal-eqA" class="swal2-input">
                    <option value="">Equipo Local</option>
                    ${equipos.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('')}
                </select>
                <select id="swal-eqB" class="swal2-input">
                    <option value="">Equipo Visitante</option>
                    ${equipos.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('')}
                </select>
                <input id="swal-fecha" type="datetime-local" class="swal2-input">
                <input id="swal-detalle" class="swal2-input" placeholder="Detalle (Opcional)">
            `,
            background: '#1e293b', color: '#fff',
            preConfirm: () => {
                const eqA = document.getElementById('swal-eqA').value;
                const eqB = document.getElementById('swal-eqB').value;
                if (eqA === eqB) {
                    Swal.showValidationMessage('Los equipos deben ser diferentes');
                    return false;
                }
                return {
                    equipoA_id: eqA,
                    equipoB_id: eqB,
                    fecha: document.getElementById('swal-fecha').value,
                    detalle: document.getElementById('swal-detalle').value
                };
            }
        });

        if (values && values.equipoA_id && values.equipoB_id && values.fecha) {
            try {
                await partidoService.createPartido(values);
                Swal.fire({ title: 'Creado', icon: 'success' });
                loadData();
            } catch (error) {
                Swal.fire({ title: 'Error', text: error.message, icon: 'error' });
            }
        }
    };

    const handleSetResult = async (partido) => {
        setSelectedPartido(partido);
        setFormValues({
            scoreA: partido.scoreA || 0,
            scoreB: partido.scoreB || 0,
            status: partido.status || 'upcoming',
            mvp_id: partido.mvp_id || '',
            armador_id: partido.armador_id || '',
            atacante_id: partido.atacante_id || '',
            receptor_id: partido.receptor_id || ''
        });

        try {
            Swal.fire({ title: 'Cargando jugadores...', allowOutsideClick: false, didOpen: () => Swal.showLoading(), background: '#1e293b', color: '#fff' });
            const [playersA, playersB] = await Promise.all([
                jugadoresService.getJugadoresByEquipo(partido.equipoA_id),
                jugadoresService.getJugadoresByEquipo(partido.equipoB_id)
            ]);
            setMatchPlayers([...playersA, ...playersB]);
            Swal.close();
            setIsModalOpen(true);
        } catch (error) {
            Swal.fire({ title: 'Error', text: 'Error al cargar jugadores', icon: 'error' });
        }
    };

    const handleSaveResult = async () => {
        try {
            await partidoService.updatePartido(selectedPartido.id, {
                ...formValues,
                detalle: selectedPartido.detalle,
                fecha: selectedPartido.fecha
            });
            setIsModalOpen(false);
            Swal.fire({ title: '¡Éxito!', text: 'Resultado actualizado correctamente', icon: 'success', background: '#1e293b', color: '#fff' });
            loadData();
        } catch (error) {
            Swal.fire({ title: 'Error', text: error.message, icon: 'error', background: '#1e293b', color: '#fff' });
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar partido?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            background: '#1e293b', color: '#fff'
        });
        if (result.isConfirmed) {
            try {
                await partidoService.deletePartido(id);
                loadData();
            } catch (error) {
                Swal.fire({ title: 'Error', text: error.message, icon: 'error' });
            }
        }
    };

    if (loading) return <div>Cargando gestión...</div>;

    return (
        <div className="home-page">
            <header className="dashboard-header responsive-header">
                <div className="team-info">
                    <h1>Gestión de Partidos</h1>
                    <p>Programa nuevos encuentros y actualiza los marcadores</p>
                </div>
                <button className="btn btn-primary" onClick={handleCreateMatch}>
                    <i className="fas fa-calendar-plus"></i> Programar Partido
                </button>
            </header>

            <section className="players-section">
                <div className="players-table-container">
                    <table className="players-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Encuentro</th>
                                <th>Resultado</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {partidos.map(p => (
                                <tr key={p.id} className="player-row">
                                    <td data-label="Fecha">{new Date(p.fecha).toLocaleDateString()}</td>
                                    <td data-label="Encuentro">
                                        <div style={{display:'flex', alignItems:'center', gap:'0.5rem', justifyContent:'center'}}>
                                            <span>{p.equipoA_nombre}</span>
                                            <span style={{color:'#64748b'}}>vs</span>
                                            <span>{p.equipoB_nombre}</span>
                                        </div>
                                    </td>
                                    <td data-label="Resultado" style={{fontWeight:'700'}}>
                                        {p.status === 'finished' ? `${p.scoreA} - ${p.scoreB}` : 'TBD'}
                                    </td>
                                    <td data-label="Estado">
                                        <span className={`player-count-badge ${p.status === 'finished' ? 'won' : 'upcoming'}`} 
                                              style={{background: p.status === 'finished' ? '#22c55e' : '#334155', color:'#fff'}}>
                                            {p.status === 'finished' ? 'Finalizado' : 'Próximamente'}
                                        </span>
                                    </td>
                                    <td className="actions-cell" data-label="Acciones">
                                        <button className="btn-edit" onClick={() => handleSetResult(p)} title="Set Resultado"><i className="fas fa-trophy"></i></button>
                                        <button className="btn-delete" onClick={() => handleDelete(p.id)}><i className="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Match Result Modal */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title="Ingresar Resultado y Premios"
                footer={(
                    <>
                        <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                        <button className="btn btn-primary" onClick={handleSaveResult}>Guardar Cambios</button>
                    </>
                )}
            >
                {selectedPartido && (
                    <div className="modal-match-form">
                        <div className="swal-match-scores" style={{marginBottom: '2rem'}}>
                            <div className="team-score">
                                <p style={{fontWeight: 700, color: '#f8fafc'}}>{selectedPartido.equipoA_nombre}</p>
                                <input 
                                    type="number" 
                                    className="swal2-input" 
                                    value={formValues.scoreA}
                                    onChange={(e) => setFormValues({...formValues, scoreA: e.target.value})}
                                    style={{margin: '0.5rem 0', textAlign: 'center'}}
                                />
                            </div>
                            <div className="vs-divider" style={{alignSelf: 'center', fontSize: '1.2rem', fontWeight: 700, color: '#3b82f6'}}>VS</div>
                            <div className="team-score">
                                <p style={{fontWeight: 700, color: '#f8fafc'}}>{selectedPartido.equipoB_nombre}</p>
                                <input 
                                    type="number" 
                                    className="swal2-input" 
                                    value={formValues.scoreB}
                                    onChange={(e) => setFormValues({...formValues, scoreB: e.target.value})}
                                    style={{margin: '0.5rem 0', textAlign: 'center'}}
                                />
                            </div>
                        </div>

                        <div className="awards-section" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem'}}>
                            <div className="award-field">
                                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem'}}>Mejor Jugador (MVP)</label>
                                <select 
                                    className="swal2-input" 
                                    style={{width: '100%', margin: 0}}
                                    value={formValues.mvp_id}
                                    onChange={(e) => setFormValues({...formValues, mvp_id: e.target.value})}
                                >
                                    <option value="">Seleccionar...</option>
                                    {matchPlayers.map(j => <option key={j.id} value={j.id}>{j.nombre} {j.apellido}</option>)}
                                </select>
                            </div>
                            <div className="award-field">
                                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem'}}>Mejor Armador</label>
                                <select 
                                    className="swal2-input" 
                                    style={{width: '100%', margin: 0}}
                                    value={formValues.armador_id}
                                    onChange={(e) => setFormValues({...formValues, armador_id: e.target.value})}
                                >
                                    <option value="">Seleccionar...</option>
                                    {matchPlayers.map(j => <option key={j.id} value={j.id}>{j.nombre} {j.apellido}</option>)}
                                </select>
                            </div>
                            <div className="award-field">
                                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem'}}>Mejor Atacante</label>
                                <select 
                                    className="swal2-input" 
                                    style={{width: '100%', margin: 0}}
                                    value={formValues.atacante_id}
                                    onChange={(e) => setFormValues({...formValues, atacante_id: e.target.value})}
                                >
                                    <option value="">Seleccionar...</option>
                                    {matchPlayers.map(j => <option key={j.id} value={j.id}>{j.nombre} {j.apellido}</option>)}
                                </select>
                            </div>
                            <div className="award-field">
                                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem'}}>Mejor Receptor</label>
                                <select 
                                    className="swal2-input" 
                                    style={{width: '100%', margin: 0}}
                                    value={formValues.receptor_id}
                                    onChange={(e) => setFormValues({...formValues, receptor_id: e.target.value})}
                                >
                                    <option value="">Seleccionar...</option>
                                    {matchPlayers.map(j => <option key={j.id} value={j.id}>{j.nombre} {j.apellido}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="status-section">
                            <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem'}}>Estado del Partido</label>
                            <select 
                                className="swal2-input" 
                                style={{width: '100%', margin: 0}}
                                value={formValues.status}
                                onChange={(e) => setFormValues({...formValues, status: e.target.value})}
                            >
                                <option value="finished">Finalizado</option>
                                <option value="upcoming">Pendiente</option>
                            </select>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
