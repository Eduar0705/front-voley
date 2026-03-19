import api from './api.service';

const registrarEquipo = async (capitan, jugadores) => {
    try {
        const response = await api.post('/registro', { capitan, jugadores });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al registrar el equipo' };
    }
};

export const registroService = {
    registrarEquipo
};
