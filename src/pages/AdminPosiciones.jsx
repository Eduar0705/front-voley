import React, { useState, useEffect } from 'react';
import { tablaService } from '../service/tabla.service';

export default function AdminPosiciones() {
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStandings();
    }, []);

    const fetchStandings = async () => {
        try {
            const data = await tablaService.getStandings();
            setStandings(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Cargando tabla...</div>;

    return (
        <div className="home-page">
            <header className="dashboard-header">
                <div className="team-info">
                    <h1>Tabla de Posiciones Global</h1>
                    <p>Estado actual del torneo y puntuaciones</p>
                </div>
            </header>

            <section className="players-section">
                <div className="players-table-container">
                    <table className="players-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Equipo</th>
                                <th>PJ</th>
                                <th>PG</th>
                                <th>PE</th>
                                <th>PP</th>
                                <th>Pts</th>
                            </tr>
                        </thead>
                        <tbody>
                            {standings.map((item, index) => (
                                <tr key={item.id} className="player-row">
                                    <td data-label="Posición">{index + 1}</td>
                                    <td data-label="Equipo">
                                        <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
                                            <img src={item.logo || '/balon.png'} alt="Logo" style={{width:30, height:30, borderRadius:'50%'}} />
                                            {item.nombre}
                                        </div>
                                    </td>
                                    <td data-label="PJ">{item.pj}</td>
                                    <td data-label="PG">{item.pg}</td>
                                    <td data-label="PE">{item.pe}</td>
                                    <td data-label="PP">{item.pp}</td>
                                    <td data-label="Pts" style={{fontWeight:'700', color:'#ef4444'}}>{item.pts}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
