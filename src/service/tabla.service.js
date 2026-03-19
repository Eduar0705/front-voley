import api from './api.service';

const getStandings = async () => {
    try {
        const response = await api.get('/tabla');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener la tabla de posiciones' };
    }
};

export const tablaService = {
    getStandings
};
