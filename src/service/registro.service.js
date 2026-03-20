import api from './api.service';

const registrarEquipo = async (formData) => {
    try {
        const response = await api.post('/registro', formData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al registrar el equipo' };
    }
};

export const registroService = {
    registrarEquipo
};
