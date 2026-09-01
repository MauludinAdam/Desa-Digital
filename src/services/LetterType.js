import api from "./api";

export const getLetterType = (params) => {
    return api.get('/letter-type', {
        params
    });
}

export const getLetterTypeOptions = () => {
    return api.get("/letter-type");
}

export const createLetterType = (data) => {
    return api.post('/letter-type', data);
}

export const updateLetterType = (id, data) => {
    return api.put(`/letter-type/${id}`, data);
}

export const deleteLetterType = (id, data) => {
    return api.delete(`/letter-type/${id}`, data);
}