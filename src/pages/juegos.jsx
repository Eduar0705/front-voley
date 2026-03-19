import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Menu from '../components/Menu';
import { partidoService } from '../service/partido.service';
import '../assets/juegos.css'

export default function Juegos() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const data = await partidoService.getPartidos();
                setMatches(data);
            } catch (err) {
                setError('No se pudieron cargar los juegos');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();
    }, []);

    return (
        <main className="main-index">
            <Header />
            <Menu />
            
            <div className="juegos-page animate-fade">
                <header className="page-header">
                    <h1>Calendario de Juegos</h1>
                    <p>Sigue los resultados y próximos encuentros del torneo</p>
                </header>

                {loading ? (
                    <div className="loading-container">Cargando partidos...</div>
                ) : error ? (
                    <div className="error-container">{error}</div>
                ) : (
                    <div className="matches-grid">
                        {matches.length > 0 ? matches.map(match => (
                            <div key={match.id} className="match-card">
                                <span className={`match-status status-${match.status}`}>
                                    {match.status === 'live' ? '• En Vivo' : 
                                     match.status === 'upcoming' ? 'Próximo' : 'Finalizado'}
                                </span>

                                <div className="match-teams">
                                    <div className="team">
                                        <img src={match.equipoA_logo || '/balon.png'} alt={match.equipoA_nombre} className="team-logo" />
                                        <span className="team-name">{match.equipoA_nombre}</span>
                                    </div>

                                    <div className="match-score">
                                        <span>{match.scoreA}</span>
                                        <div className="score-divider"></div>
                                        <span>{match.scoreB}</span>
                                    </div>

                                    <div className="team">
                                        <img src={match.equipoB_logo || '/balon.png'} alt={match.equipoB_nombre} className="team-logo" />
                                        <span className="team-name">{match.equipoB_nombre}</span>
                                    </div>
                                </div>

                                <div className="match-info">
                                    <span className="match-detail">
                                        <i className="far fa-clock"></i> {match.detalle || 'Por definir'}
                                    </span>
                                    <span className="match-detail">
                                        <i className="far fa-calendar-alt"></i> {new Date(match.fecha).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <div className="empty-message">No hay partidos programados por ahora.</div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}