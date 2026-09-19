import api from "./api";

export const getDashboardBumdes = () => {
    return api.get('/dashboard-bumdes')
}