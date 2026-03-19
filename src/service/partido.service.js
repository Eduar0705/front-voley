import api from './api.service';

const getPartidos = async () => {
    try {
        const response = await api.get('/juegos');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener los partidos' };
    }
};

export const partidoService = {
    getPartidos
};
