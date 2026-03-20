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

const getEquipos = async () => {
    try {
        const response = await api.get('/registro/equipos'); // Reusing existing registration list if available or adding new logic
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener lista de equipos' };
    }
};

const getStandings = async () => {
    try {
        const response = await api.get('/equipos/standings');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener tabla de posiciones' };
    }
};

const deleteEquipo = async (id) => {
    try {
        const response = await api.delete(`/equipos/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al eliminar el equipo' };
    }
};

export const equiposService = {
    getEquipoStats,
    getEquipo,
    getEquipos,
    getStandings,
    updateEquipo,
    deleteEquipo
};
