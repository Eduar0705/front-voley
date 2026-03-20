import api from './api.service';

const getPartidos = async () => {
    try {
        const response = await api.get('/juegos');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener los partidos' };
    }
};

const createPartido = async (data) => {
    try {
        const response = await api.post('/juegos', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al crear el partido' };
    }
};

const updatePartido = async (id, data) => {
    try {
        const response = await api.put(`/juegos/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al actualizar el partido' };
    }
};

const deletePartido = async (id) => {
    try {
        const response = await api.delete(`/juegos/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al eliminar el partido' };
    }
};

export const partidoService = {
    getPartidos,
    createPartido,
    updatePartido,
    deletePartido
};
