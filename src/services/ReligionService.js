import api from "./api";

export const getReligions = () => {
    return api.get("/religion", {
        params,
    });
};

export const getReligionOption = () => {
    return api.get('/religion');
}