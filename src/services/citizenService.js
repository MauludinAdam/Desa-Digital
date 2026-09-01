import api from "./api";

export const getCitizens = (params = {}) => {
    return api.get("/citizen", {
        params, 
    });
};

export const getHeadOfFamilyOptions = () => {
    return api.get('/citizen/head-of-family-options');
}

export const getCitizenOptions = () => {
    return api.get("/citizen");
};

export const createCitizen = (data) => {
    return api.post("/citizen", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },  
    });
};

export const detailCitizen = (id) => {
    return api.get(`/citizen/${id}`);
};

export const getCitizen = (id) => {
    return api.get(`/citizen/${id}`);
};

export const updateCitizen = (id, data) => {
    return api.post(`/citizen/${id}`, data);
};

export const deleteCitizen = (id) => {
    return api.delete(`/citizen/${id}`)
}