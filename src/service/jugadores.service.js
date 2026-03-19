import api from './api.service';

const getJugadores = async () => {
    try {
        const response = await api.get('/jugadores');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener los jugadores' };
    }
};

export const jugadoresService = {
    getJugadores
};
