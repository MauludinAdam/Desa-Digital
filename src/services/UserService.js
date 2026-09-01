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