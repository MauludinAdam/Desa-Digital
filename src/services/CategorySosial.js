import api from "./api";

export const getCategorySosial = (params = {}) => {
    return api.get('/sosial-assistance-category',{
        params
    });
}

export const getCategorySosialOptions = (data) => {
    return api.get('/sosial-assistance-category', data);
}

export const createCategorySosial = (data) => {
    return api.post('/sosial-assistance-category', data);
}

export const updateCategorySosial = (id, data) => {
    return api.put(`/sosial-assistance-category/${id}`, data);
}

export const deleteCategorySosial = (id, data) => {
    return api.delete(`/sosial-assistance-category/${id}`, data);
}