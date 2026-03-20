import api from './api.service';

const getEquipoStats = async (id) => {
    try {
        const response = await api.get(`/equipos/${id}/stats`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener estadísticas del equipo' };
    }
};

const updateEquipo = async (id, formData) => {
    try {
        const response = await api.put(`/equipos/${id}`, formData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al actualizar el equipo' };
    }
};

const getEquipo = async (id) => {
    try {
        const response = await api.get(`/equipos/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener datos del equipo' };
    }
};

export const equiposService = {
    getEquipoStats,
    getEquipo,
    updateEquipo
};
