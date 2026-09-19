import api from "./api";

export const getBumdes = () => {
    return api.get('/bumdes');
}

export const createBumdes = (data) => {
    return api.post('/bumdes', data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}

export const updateBumdes = (data) => {
    return api.post('/bumdes', data, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
};