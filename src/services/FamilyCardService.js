import api from "./api";

export const getFamilyCards = (params = {}) => {
    return api.get('/family-card', {
        params,
    });
};

export const getFamilyCardOptions = () => {
    return api.get("/family-card");
};

export const createFamilycard = (data) => {
    return api.post('/family-card', data);
}

export const detailFamilyCard = (id) => {
    return api.get(`/family-card/${id}`);
}

export const updateFamilyCard = (id, data) => {
    return api.post(`/family-card/${id}`, data);
}

export const deleteFamilyCard = (id) => {
    return api.delete(`/family-card/${id}`)
}