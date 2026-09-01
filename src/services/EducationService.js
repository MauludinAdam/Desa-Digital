import api from "./api";

export const getEducations = (params) => {
    return api.get("/education", {
        params,
    });
};

export const getEducationOptions = () => {
    return api.get("/education");
};

export const createEducation = (data) => {
    return api.post('/education', data);
} 

export const updateEducation = (id, data) => {
    return api.put(`/education/${id}`, data);
}

export const deleteEducation = (id, data) => {
    return api.delete(`/education/${id}`, data);
}