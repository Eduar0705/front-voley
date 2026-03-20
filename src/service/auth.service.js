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

const adminLogin = async (usuario, clave) => {
    try {
        const response = await api.post('/auth/admin-login', { usuario, clave });
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

const getAdmins = async () => {
    try {
        const response = await api.get('/auth/admins');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener admins' };
    }
};

const createAdmin = async (data) => {
    try {
        const response = await api.post('/auth/admins', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al crear admin' };
    }
};

const updateAdmin = async (id, data) => {
    try {
        const response = await api.put(`/auth/admins/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al actualizar admin' };
    }
};

const deleteAdmin = async (id) => {
    try {
        const response = await api.delete(`/auth/admins/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al eliminar admin' };
    }
};

export const authService = {
    login,
    adminLogin,
    getAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    logout,
    getCurrentUser,
    updateClave
};
