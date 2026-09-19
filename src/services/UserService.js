import api from "./api";

export const getMe = () => {
    return api.get('/me');
}

export const updateMe = (data) => {
    return api.put('/me', data);
}

export const forgotPassword = (data) => {
    return api.post('/forgot-password', data);
}

export const resetPassword = (data) => {
    return api.post('/reset-password', data);
}

export const getUser = (params = {}) => {
    return api.get('/user', {
        params,
    })
}

export const createUser = (data) => {
    return api.post('/user', data);
}

export const updateStatusUser = (id, status) => {
    return api.put(`/user/${id}/status`, {
        status: status
    });
}