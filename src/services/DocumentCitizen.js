import api from "./api";

export const getCitizenAttachmans = (params = {}) => {
    return api.get('/citizen-document', {
        params,
    });    
};

export const createCitizenAttachman = (formData) => {
    return api.post('/citizen-document', formData , {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
}

export const updateCitizenAttachman = (id, formData) => {
    return api.post(`/citizen-document/${id}`, formData,{
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
}

export const deleteCitizenAttachman = (id, data) => {
    return api.delete(`/citizen-document/${id}`, data);
}
