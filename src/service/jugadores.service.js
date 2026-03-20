import api from './api.service';

const getJugadores = async () => {
    try {
        const response = await api.get('/jugadores');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener los jugadores' };
    }
};

const getJugadoresByEquipo = async (equipo_id) => {
    try {
        const response = await api.get(`/jugadores/equipo/${equipo_id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener los jugadores del equipo' };
    }
};

const addJugador = async (playerData) => {
    try {
        const response = await api.post('/jugadores', playerData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al agregar el jugador' };
    }
};

const updateJugador = async (id, playerData) => {
    try {
        const response = await api.put(`/jugadores/${id}`, playerData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al actualizar el jugador' };
    }
};

const deleteJugador = async (id) => {
    try {
        const response = await api.delete(`/jugadores/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al eliminar el jugador' };
    }
};

export const jugadoresService = {
    getJugadores,
    getJugadoresByEquipo,
    addJugador,
    updateJugador,
    deleteJugador
};
