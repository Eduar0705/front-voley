import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Menu from '../components/Menu';
import { jugadoresService } from '../service/jugadores.service';
import '../assets/jugadores.css'

export default function Jugadores() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const data = await jugadoresService.getJugadores();
                setTeams(data);
            } catch (err) {
                setError('No se pudieron cargar los equipos y jugadores');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTeams();
    }, []);

    return (
        <main className="main-index">
            <Header />
            <Menu />
            
            <div className="jugadores-page animate-fade">
                <header className="page-header">
                    <h1>Directorio de Equipos</h1>
                    <p>Conoce los equipos participantes y sus integrantes</p>
                </header>

                {loading ? (
                    <div className="loading-container">Cargando equipos...</div>
                ) : error ? (
                    <div className="error-container">{error}</div>
                ) : (
                    <div className="teams-grid">
                        {teams.length > 0 ? teams.map(team => (
                            <div key={team.id} className="team-card">
                                <div className="team-card-header">
                                    <div className="team-logo-container">
                                        <img src={team.logo || '/balon.png'} alt={team.nombre} className="team-card-logo" />
                                    </div>
                                    <div className="team-card-info">
                                        <h2 className="team-card-name">{team.nombre}</h2>
                                        <span className="team-card-count">{team.jugadores.length} Jugadores</span>
                                    </div>
                                </div>

                                <div className="team-card-members">
                                    <h3>Integrantes:</h3>
                                    <ul className="members-list">
                                        {team.jugadores.map(player => (
                                            <li key={player.id} className="member-item">
                                                <i className="fas fa-user-circle"></i>
                                                <span className="member-name">{player.nombre} {player.apellido}</span>
                                                <div className="member-quick-stats">
                                                    <span>{player.puntos} Pts</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )) : (
                            <div className="empty-message">No se encontraron equipos registrados.</div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}