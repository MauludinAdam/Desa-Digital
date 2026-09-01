import api from "./api";

export const getOccupations = (params) => {
    return api.get("/occupation", {
        params
    });
};

export const getOccupationOptions = () => {
    return api.get("/occupation");
};

export const creaetOccupation = (data) => {
    return api.post('/occupation', data);
} 

export const updateOccupation = (id, data) => {
    return api.put(`/occupation/${id}`, data);
}

export const deleteOccupation = (id, data) => {
    return api.delete(`/occupation/${id}`, data);
}