import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { registroService } from '../service/registro.service';
import '../assets/login.css'

export default function Registro() {
    const navigate = useNavigate();

    // State for Captain
    const [capitan, setCapitan] = useState({
        nombre: '',
        carrera: '',
        cedula: '',
        equipo: '',
        logo: null
    });

    // State for Players (Min 6, Max 10)
    const [jugadores, setJugadores] = useState(
        Array(6).fill({ nombre: '', apellido: '' })
    );

    const [errors, setErrors] = useState({});

    const handleCapitanChange = (e) => {
        const { id, value, files } = e.target;
        if (id === 'logo') {
            setCapitan(prev => ({ ...prev, logo: files[0] }));
        } else {
            setCapitan(prev => ({ ...prev, [id]: value }));
        }
    };

    const handlePlayerChange = (index, field, value) => {
        const newJugadores = [...jugadores];
        newJugadores[index] = { ...newJugadores[index], [field]: value };
        setJugadores(newJugadores);
    };

    const addPlayer = () => {
        if (jugadores.length < 10) {
            setJugadores([...jugadores, { nombre: '', apellido: '' }]);
        }
    };

    const removePlayer = (index) => {
        if (jugadores.length > 6) {
            const newJugadores = jugadores.filter((_, i) => i !== index);
            setJugadores(newJugadores);
        }
    };

    const validateForm = () => {
        let newErrors = {};
        if (!capitan.nombre) newErrors.capNombre = "El nombre es obligatorio";
        if (!capitan.carrera) newErrors.capCarrera = "La carrera es obligatoria";
        if (!capitan.cedula) newErrors.capCedula = "La cédula es obligatoria";
        if (!capitan.equipo) newErrors.capEquipo = "El nombre del equipo es obligatorio";

        jugadores.forEach((j, index) => {
            if (!j.nombre || !j.apellido) {
                newErrors[`player${index}`] = "Faltan datos del jugador";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        if (validateForm()) {
            setLoading(true);
            try {
                const formData = new FormData();
                // Serializamos los objetos como JSON strings para que Multer los reciba correctamente
                formData.append('capitan', JSON.stringify({
                    nombre: capitan.nombre,
                    carrera: capitan.carrera,
                    cedula: capitan.cedula,
                    equipo: capitan.equipo
                }));
                formData.append('jugadores', JSON.stringify(jugadores));
                
                if (capitan.logo) {
                    formData.append('logo', capitan.logo);
                }

                const data = await registroService.registrarEquipo(formData);
                if (data.success) {
                    Swal.fire({
                        title: '¡Registro Exitoso!',
                        text: 'Tu equipo ha sido inscrito correctamente.',
                        icon: 'success',
                        background: '#0f172a',
                        color: '#f8fafc',
                        confirmButtonColor: '#2563eb',
                        showClass: { popup: 'animate__animated animate__fadeInDown' },
                        hideClass: { popup: 'animate__animated animate__fadeOutUp' }
                    });
                    navigate('/login');
                }
            } catch (err) {
                setSubmitError(err.message || 'Error al registrar el equipo');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="registro-page animate-fade">
            <div className="registro-container">
                <div className="registro-card">
                    <div className="login-header">
                        <img src="/balon.png" alt="Logo" className="login-logo" />
                        <h1>Registra tu Equipo</h1>
                        <p>Completa la información para participar en el torneo</p>
                    </div>

                    <form onSubmit={handleSubmit} className="registro-form">
                        {submitError && <div className="error-message">{submitError}</div>}
                        {/* SECCIÓN CAPITÁN */}
                        <div className="form-section">
                            <h2 className="section-title"><i className="fas fa-crown"></i> Datos del Capitán</h2>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Nombre Completo</label>
                                    <input type="text" id="nombre" value={capitan.nombre} onChange={handleCapitanChange} placeholder="Nombre del capitán" />
                                </div>
                                <div className="form-group">
                                    <label>Cédula</label>
                                    <input type="text" id="cedula" value={capitan.cedula} onChange={handleCapitanChange} placeholder="V-12.345.678" />
                                </div>
                                <div className="form-group">
                                    <label>Carrera</label>
                                    <input type="text" id="carrera" value={capitan.carrera} onChange={handleCapitanChange} placeholder="Ej: Informática" />
                                </div>
                                <div className="form-group">
                                    <label>Nombre del Equipo</label>
                                    <input type="text" id="equipo" value={capitan.equipo} onChange={handleCapitanChange} placeholder="Nombre de tu equipo" />
                                </div>
                                <div className="form-group full-width">
                                    <label>Logo del Equipo (Opcional)</label>
                                    <div className="file-input-wrapper">
                                        <input type="file" id="logo" accept="image/*" onChange={handleCapitanChange} />
                                        <span>{capitan.logo ? capitan.logo.name : 'Seleccionar imagen...'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECCIÓN JUGADORES */}
                        <div className="form-section">
                            <div className="section-header">
                                <h2 className="section-title"><i className="fas fa-users"></i> Lista de Jugadores</h2>
                                <span className="player-count">{jugadores.length} / 10</span>
                            </div>
                            <p className="section-subtitle">Mínimo 6 / Máximo 10 jugadores</p>

                            <div className="players-list">
                                {jugadores.map((player, index) => (
                                    <div key={index} className="player-row animate-fade">
                                        <span className="player-num">{index + 1}</span>
                                        <input
                                            type="text"
                                            placeholder="Nombre"
                                            value={player.nombre}
                                            onChange={(e) => handlePlayerChange(index, 'nombre', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Apellido"
                                            value={player.apellido}
                                            onChange={(e) => handlePlayerChange(index, 'apellido', e.target.value)}
                                        />
                                        {jugadores.length > 6 && (
                                            <button type="button" onClick={() => removePlayer(index)} className="btn-remove">
                                                <i className="fas fa-times"></i>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {jugadores.length < 10 && (
                                <button type="button" onClick={addPlayer} className="btn-add-player">
                                    <i className="fas fa-plus"></i> Añadir Jugador
                                </button>
                            )}
                        </div>

                        <div className="registro-actions">
                            <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Registrando...' : 'Finalizar Registro'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}