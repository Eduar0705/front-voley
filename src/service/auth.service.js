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

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

export const authService = {
    login,
    logout,
    getCurrentUser
};
