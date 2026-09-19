import api from "./api";

export const getBumdesUnits = (params = {}) => {
    return api.get('/bumdes-unit', {
        params,
    });
};

export const getBumdesUnitOptions = () => {
    return api.get('/bumdes-unit');
}

export const getBumdesUnit = (id) => {
    return api.get(`/bumdes-unit/${id}`);
}

export const createBumdeUnit = (data) => {
    return api.post('/bumdes-unit', data);
}

export const updateBumdesUnit = (id, data) => {
    return api.post(`/bumdes-unit/${id}`, data);
}

export const deleteBumdesUnit = (id) => {
    return api.delete(`/bumdes-unit/${id}`);
}