import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Menu from '../components/Menu';
import { tablaService } from '../service/tabla.service';
import '../assets/tabla.css'

export default function Tabla() {
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStandings = async () => {
            try {
                const data = await tablaService.getStandings();
                setStandings(data);
            } catch (err) {
                setError('No se pudo cargar la tabla de posiciones');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStandings();
    }, []);

    return (
        <main className="main-index">
            <Header />
            <Menu />
            
            <div className="tabla-page animate-fade">
                <header className="page-header">
                    <h1>Tabla de Posiciones</h1>
                    <p>Clasificación oficial del torneo de Voley</p>
                </header>

                {loading ? (
                    <div className="loading-container">Cargando clasificación...</div>
                ) : error ? (
                    <div className="error-container">{error}</div>
                ) : (
                    <div className="table-container">
                        <div className="standings-table">
                            <div className="table-header">
                                <div className="col pos">POS.</div>
                                <div className="col equipo">EQUIPO</div>
                                <div className="col val">PJ</div>
                                <div className="col val">PG</div>
                                <div className="col val pts">PUNTOS</div>
                            </div>
                            
                            <div className="table-body">
                                {standings.length > 0 ? standings.map((item, index) => (
                                    <div key={item.id} className="table-row">
                                        <div className="col pos">
                                            {String(index + 1).padStart(2, '0')}
                                        </div>
                                        <div className="col equipo">
                                            <div className="team-cell">
                                                <img src={item.logo || '/balon.png'} alt={item.nombre} className="team-mini-logo" />
                                                <span>{item.nombre}</span>
                                            </div>
                                        </div>
                                        <div className="col val">{String(item.pj).padStart(2, '0')}</div>
                                        <div className="col val">{String(item.pg).padStart(2, '0')}</div>
                                        <div className="col val pts">{String(item.puntos).padStart(2, '0')}</div>
                                    </div>
                                )) : (
                                    <div className="empty-message">Aún no hay resultados registrados.</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
