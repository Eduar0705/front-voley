import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Navbar from '../components/navbar';
import Asside from '../components/asside';
import { authService } from '../service/auth.service';
import { jugadoresService } from '../service/jugadores.service';
import { equiposService } from '../service/equipos.service';
import '../assets/home.css';

export default function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);
    
    // Shared state
    const [players, setPlayers] = useState([]);
    const [stats, setStats] = useState({ won: 0, lost: 0, mvp: null });
    const [equipo, setEquipo] = useState(null);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setUser(currentUser);
        loadAllData(currentUser.equipo_id);
    }, [navigate]);

    const loadAllData = async (equipoId) => {
        setLoading(true);
        try {
            const [playersData, statsData, equipoData] = await Promise.all([
                jugadoresService.getJugadoresByEquipo(equipoId),
                equiposService.getEquipoStats(equipoId),
                equiposService.getEquipo(equipoId)
            ]);
            setPlayers(playersData || []);
            setStats(statsData || { won: 0, lost: 0, mvp: null });
            setEquipo(equipoData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        if (loading) return <div className="loading-container"><div className="animate-pulse">Cargando datos...</div></div>;
        
        switch (activeTab) {
            case 'dashboard':
                return <DashboardView stats={stats} equipo={equipo} playersCount={players.length} />;
            case 'equipo':
                return (
                    <EquipoView 
                        players={players} 
                        user={user} 
                        fetchPlayers={() => loadAllData(user.equipo_id)} 
                    />
                );
            case 'config':
                return <ConfigView equipo={equipo} onUpdate={() => loadAllData(user.equipo_id)} />;
            default:
                return <DashboardView stats={stats} equipo={equipo} playersCount={players.length} />;
        }
    };

    if (!user || !equipo) return <div className="loading-screen">Cargando perfil...</div>;

    const captainItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-chart-line' },
        { id: 'equipo', label: 'Mi Equipo', icon: 'fas fa-users' },
        { id: 'config', label: 'Configuración', icon: 'fas fa-cog' }
    ];

    return (
        <div className="home-layout">
            <Navbar />
            <div className="home-container">
                <Asside 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    menuItems={captainItems}
                    footerText={`Equipo: ${equipo.nombre}`}
                />
                <main className="main-content">
                    <div className="animate-fade">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
}

// --- Views ---

function DashboardView({ stats, equipo, playersCount }) {
    return (
        <div className="home-page">
            <header className="dashboard-header">
                <div className="team-info">
                    <h1>Estadísticas de {equipo.nombre}</h1>
                    <p>Resumen general del desempeño de tu equipo</p>
                </div>
                <div className="team-badge">
                    <img src={equipo.logo || '/balon.png'} alt="Logo" className="team-logo-small" />
                </div>
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon won">
                        <i className="fas fa-trophy"></i>
                    </div>
                    <div className="stat-info">
                        <h3>Partidos Ganados</h3>
                        <div className="stat-value">{stats.won}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon lost">
                        <i className="fas fa-times-circle"></i>
                    </div>
                    <div className="stat-info">
                        <h3>Partidos Perdidos</h3>
                        <div className="stat-value">{stats.lost}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon mvp">
                        <i className="fas fa-award"></i>
                    </div>
                    <div className="stat-info">
                        <h3>Mejor Jugador (MVPs)</h3>
                        <div className="stat-value">
                            {stats.awards?.mvps || 0}
                        </div>
                        <div className="stat-subvalue">
                            {stats.mvp ? `${stats.mvp.nombre} (${stats.mvp.total_mvps})` : 'Sin premios'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="awards-summary-grid">
                <div className="award-summary-card">
                    <i className="fas fa-hands-helping"></i>
                    <span>Armadores</span>
                    <strong>{stats.awards?.armadores || 0}</strong>
                </div>
                <div className="award-summary-card">
                    <i className="fas fa-bolt"></i>
                    <span>Atacantes</span>
                    <strong>{stats.awards?.atacantes || 0}</strong>
                </div>
                <div className="award-summary-card">
                    <i className="fas fa-shield-alt"></i>
                    <span>Receptores</span>
                    <strong>{stats.awards?.receptores || 0}</strong>
                </div>
            </div>

            <div className="players-section">
                <div className="players-list-header">
                    <h2><i className="fas fa-info-circle"></i> Información del Equipo</h2>
                </div>
                <div className="info-content">
                    <p>Actualmente tienes <strong>{playersCount}</strong> jugadores registrados.</p>
                    <p>Recuerda mantener entre 6 y 10 para poder participar en los torneos.</p>
                </div>
            </div>
        </div>
    );
}

function EquipoView({ players, user, fetchPlayers }) {
    const handleAddPlayer = async () => {
        if (players.length >= 10) {
            Swal.fire({ title: 'Límite alcanzado', text: 'Máximo 10 jugadores', icon: 'warning', background: '#1e293b', color: '#f8fafc' });
            return;
        }

        const { value: formValues } = await Swal.fire({
            title: 'Agregar Jugador',
            html: '<input id="swal-input1" class="swal2-input" placeholder="Nombre"><input id="swal-input2" class="swal2-input" placeholder="Apellido">',
            background: '#1e293b', color: '#f8fafc', confirmButtonColor: '#ef4444',
            preConfirm: () => ({
                nombre: document.getElementById('swal-input1').value,
                apellido: document.getElementById('swal-input2').value
            })
        });

        if (formValues && formValues.nombre && formValues.apellido) {
            try {
                await jugadoresService.addJugador({ ...formValues, equipo_id: user.equipo_id });
                Swal.fire({ title: '¡Éxito!', icon: 'success', background: '#1e293b', color: '#f8fafc', timer: 1500 });
                fetchPlayers();
            } catch (error) {
                Swal.fire({ title: 'Error', text: error.message, icon: 'error', background: '#1e293b', color: '#f8fafc' });
            }
        }
    };

    const handleEditPlayer = async (player) => {
        const { value: formValues } = await Swal.fire({
            title: 'Editar Jugador',
            html: `<input id="swal-input1" class="swal2-input" value="${player.nombre}"><input id="swal-input2" class="swal2-input" value="${player.apellido}">`,
            background: '#1e293b', color: '#f8fafc', confirmButtonColor: '#ef4444',
            preConfirm: () => ({
                nombre: document.getElementById('swal-input1').value,
                apellido: document.getElementById('swal-input2').value
            })
        });

        if (formValues) {
            try {
                await jugadoresService.updateJugador(player.id, formValues);
                fetchPlayers();
                Swal.fire({ title: 'Actualizado', icon: 'success', background: '#1e293b', color: '#f8fafc', timer: 1500 });
            } catch (error) {
                Swal.fire({ title: 'Error', text: error.message, icon: 'error', background: '#1e293b', color: '#f8fafc' });
            }
        }
    };

    const handleDeletePlayer = async (id) => {
        if (players.length <= 6) {
            Swal.fire({ title: 'Acción bloqueada', text: 'Mínimo 6 jugadores requeridos', icon: 'error', background: '#1e293b', color: '#f8fafc' });
            return;
        }

        const res = await Swal.fire({
            title: '¿Confirmas la eliminación?',
            icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', background: '#1e293b', color: '#f8fafc'
        });

        if (res.isConfirmed) {
            try {
                await jugadoresService.deleteJugador(id);
                fetchPlayers();
            } catch (error) {
                Swal.fire({ title: 'Error', text: error.message, icon: 'error', background: '#1e293b', color: '#f8fafc' });
            }
        }
    };

    return (
        <div className="home-page">
            <header className="dashboard-header responsive-header">
                <div className="team-info">
                    <h1>Gestión de Jugadores</h1>
                    <p>Agrega, edita o elimina integrantes de tu equipo</p>
                </div>
                <button className="btn btn-primary" onClick={handleAddPlayer}>
                    <i className="fas fa-plus"></i> Agregar Nuevo
                </button>
            </header>

            <section className="players-section">
                <div className="players-list-header">
                    <h2>Mi Plantilla <span className="player-count-badge">{players.length} / 10</span></h2>
                </div>

                <div className="players-table-container">
                    <table className="players-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Puntos</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map(p => (
                                <tr key={p.id} className="player-row">
                                    <td data-label="Nombre">{p.nombre}</td>
                                    <td data-label="Apellido">{p.apellido}</td>
                                    <td data-label="Puntos">{p.puntos || 0}</td>
                                    <td className="actions-cell" data-label="Acciones">
                                        <button className="btn-edit" onClick={() => handleEditPlayer(p)}><i className="fas fa-edit"></i></button>
                                        <button className="btn-delete" onClick={() => handleDeletePlayer(p.id)}><i className="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

function ConfigView({ equipo, onUpdate }) {
    const [nombre, setNombre] = useState(equipo.nombre);
    const [logoPreview, setLogoPreview] = useState(equipo.logo || '');
    const [logoFile, setLogoFile] = useState(null);

    const [claveActual, setClaveActual] = useState('');
    const [nuevaClave, setNuevaClave] = useState('');
    const [confirmarClave, setConfirmarClave] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('nombre', nombre);
            if (logoFile) {
                formData.append('logo', logoFile);
            } else {
                formData.append('logo', equipo.logo || '');
            }

            await equiposService.updateEquipo(equipo.id, formData);
            Swal.fire({ title: 'Éxito', text: 'Perfil actualizado correctamente', icon: 'success', background: '#1e293b', color: '#f8fafc' });
            onUpdate();
        } catch (error) {
            Swal.fire({ title: 'Error', text: error.message, icon: 'error', background: '#1e293b', color: '#f8fafc' });
        }
    };

    const handleSubmitClave = async (e) => {
        e.preventDefault();
        if (nuevaClave !== confirmarClave) {
            Swal.fire({ title: 'Error', text: 'Las contraseñas nuevas no coinciden', icon: 'error', background: '#1e293b', color: '#f8fafc' });
            return;
        }

        try {
            const user = authService.getCurrentUser();
            await authService.updateClave(user.id, { claveActual, nuevaClave });
            Swal.fire({ title: 'Éxito', text: 'Contraseña actualizada correctamente', icon: 'success', background: '#1e293b', color: '#f8fafc' });
            setClaveActual('');
            setNuevaClave('');
            setConfirmarClave('');
        } catch (error) {
            Swal.fire({ title: 'Error', text: error.message, icon: 'error', background: '#1e293b', color: '#f8fafc' });
        }
    };

    return (
        <div className="home-page">
            <header className="dashboard-header">
                <div className="team-info">
                    <h1>Configuración</h1>
                    <p>Gestiona tu perfil y seguridad</p>
                </div>
            </header>

            <div className="config-grid">
                <div className="config-card">
                    <h2><i className="fas fa-id-card"></i> Perfil del Equipo</h2>
                    <form className="config-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nombre del Equipo</label>
                            <input 
                                type="text" 
                                value={nombre} 
                                onChange={e => setNombre(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Logo del Equipo</label>
                            <div className="file-input-wrapper">
                                <input 
                                    type="file" 
                                    onChange={handleFileChange} 
                                    accept="image/*"
                                />
                                <span>{logoFile ? logoFile.name : (equipo.logo ? 'Cambiar imagen...' : 'Seleccionar imagen...')}</span>
                            </div>
                        </div>

                        <div className="logo-preview-container">
                            <img src={logoPreview || '/balon.png'} alt="Preview" className="logo-preview" />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block">
                            Guardar Cambios
                        </button>
                    </form>
                </div>

                <div className="config-card">
                    <h2><i className="fas fa-lock"></i> Seguridad</h2>
                    <form className="config-form" onSubmit={handleSubmitClave}>
                        <div className="form-group">
                            <label>Contraseña Actual</label>
                            <input 
                                type="password" 
                                value={claveActual} 
                                onChange={e => setClaveActual(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Nueva Contraseña</label>
                            <input 
                                type="password" 
                                value={nuevaClave} 
                                onChange={e => setNuevaClave(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirmar Nueva Contraseña</label>
                            <input 
                                type="password" 
                                value={confirmarClave} 
                                onChange={e => setConfirmarClave(e.target.value)} 
                                required 
                            />
                        </div>

                        <button type="submit" className="btn btn-secondary btn-block" style={{marginTop: '1.5rem'}}>
                            Actualizar Contraseña
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}