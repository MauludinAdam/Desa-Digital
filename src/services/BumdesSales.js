import api from "./api";

export const generateInvoiceBumdesSales = () => {
    return api.get('/bumdes-sales/generate-invoice')
}

export const getBumdesSaleses = (params = {}) => {
    return api.get('/bumdes-sales', {
        params,
    });
}

export const createBumdesSales = (data) => {
    return api.post('/bumdes-sales', data);
} 

export const getBumdesSales = (id) => {
    return api.get(`/bumdes-sales/${id}`);
}

export const updateBumdesSalse = (id, data) => {
    return api.post(`/bumdes-sales/${id}`, data);
}

export const deleteBumdesSales = (id) => {
    return api.delete(`/bumdes-sales/${id}`);
}

export const exportBumdesSales = () => {
    return api.get('/bumdes-sales/export-excel', {
        responseType: 'blob'
    })         
}
