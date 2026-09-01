import api from "./api";

export const getLetterAttachman = () => {
    return api.get('/letter-attachment');
}

export const createLetterAttachman = (formData) => {
    return api.post('/letter-attachment', formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export const deleteLetterAttachman = (id, data) => {
    return api.delete(`/letter-attachment/${id}`, data);
}