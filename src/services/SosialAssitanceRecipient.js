import api from "./api";

export const getSosialAssistanceRecipients = (params = {}) => {
    return api.get('/sosial-assistance-applicant', {
        params
    });
}

export const getSosialAssistanceRecipient = () => {
    return api.get('/sosial-assistnace-app');
}

export const detailSosialAssistanceRecipient = (id) => {
    return api.get(`/sosial-assistance-applicant/${id}`);
}

export const createSosialAssistanceRecipient = (data) => {
    return api.post('/sosial-assistance-applicant', data);
}

export const updateSosialAssistanceRecipient = (id, data) => {
    return api.put(`/sosial-assistance-applicant/${id}`, data);
}

export const deleteSosialAssistanceRecipient = (id, data) => {
    return api.delete(`/sosial-assistance-applicant/${id}`, data);
}

export const approvedSosialAsistanceRecipient = (id) => {
    return api.patch(`/sosial-assistance-applicant/${id}/approved`);
}

export const rejectedSosialAssistanceRecipient = (id, data) => {
    return api.patch(`/sosial-assistance-applicant/${id}/rejected`, data);
}

export const uploadTransferProof = (id, data) => {
    return api.post(`/sosial-assistance-applicant/${id}/upload`, data,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}