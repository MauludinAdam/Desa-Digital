import api from "./api";

export const getProfileVillage = () => {
    return api.get('/profile');
}

export const updateProfileVillage = (data) => {
    return api.post('/profile', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
}