import api from "./api";

export const getBumdesProducts = (params = {}) => {
    return api.get('/bumdes-product', {
        params,
    });
};

export const getBumdesProduct = (id) => {
    return api.get(`/bumdes-product/${id}`);
}

export const createBumdesProduct = (data) => {
    return api.post('/bumdes-product', data);
}

export const updateBumdesProduct = (id, data) => {
    return api.post(`/bumdes-product/${id}`, data);
}

export const deleteBumdesProduct = (id) => {
    return api.delete(`/bumdes-product/${id}`);
}

export const generateBarcodeNumber = () => {
    return api.get('/bumdes-product/generate-barcode');
}

export const findProductByBarcode = (barcode) => {
    return api.get(`/bumdes-product/barcode/${barcode}`)
}