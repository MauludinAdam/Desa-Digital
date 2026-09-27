import api from "./api";

export const getPermissions = () => {
    return api.get('/permissions');
}

export const updateRolePermissions = (id, permissions) => {
    return api.put(`/roles/${id}/permissions`, {
        permissions
    })
}