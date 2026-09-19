import api from "./api";

export const getBumdesSalesItems = (params = {}) => {
    return api.get('/bumdes-sales-item', {
        params
    });
};