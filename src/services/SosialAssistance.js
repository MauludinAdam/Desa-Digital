import api from "./api";

export const getSosialAssistances = (params = {}) => {
    return api.get('/sosial-assistance', {
        params
    });
}

export const getSosialAssistance = (id, data) => {
    return api.get(`/sosial-assistance/${id}`, data);
}

export const getSosialAssistanceOptions = (data) => {
    return api.get('/sosial-assistance', data);
}

export const createSosialAssistance = (data) => {
    return api.post('/sosial-assistance', data);
}

export const updateSosialAssistance = (id, data) => {
    return api.put(`/sosial-assistance/${id}`, data);
}

export const deleteSosialAssistance = (id, data) => {
    return api.delete(`/sosial-assistance/${id}`, data);
}

export const deleteSosialAssistanaceRecipient = (id, data) => {
    return api.delete(`/sosial-assistance-applicant/${id}`, data);
} 