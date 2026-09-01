import api from "./api";

export const getLetters = (params = {}) => {
    return api.get('/letter', {
        params
    });
}

export const getLetterOptions = () => {
    return api.get('/letter');
}

export const createLetter = (data) => {
    return api.post('/letter', data);
}

export const updateLetter = (id, data) => {
    return api.put(`/letter/${id}`, data);
}

export const detailLetter = (id, data) => {
    return api.get(`/letter/${id}`, data);
}

export const approvedLetter = (id) => {
    return api.patch(`/letter/${id}/approved`);
}

export const rejectedLetter = (id, data) => {
    return api.patch(`/letter/${id}/rejected`, data);
}