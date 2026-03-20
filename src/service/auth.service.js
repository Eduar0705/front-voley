import api from './api.service';

const login = async (cedula, clave) => {
    try {
        const response = await api.post('/auth/login', { cedula, clave });
        if (response.data.success) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error de conexión' };
    }
};

const logout = () => {
    localStorage.removeItem('user');
};

const updateClave = async (id, data) => {
    try {
        const response = await api.put(`/auth/update-clave/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al actualizar contraseña' };
    }
};

const getCurrentUser = () => {
    try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        return null;
    }
};

export const authService = {
    login,
    logout,
    getCurrentUser,
    updateClave
};
