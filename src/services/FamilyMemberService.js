import api from "./api";

export const getFamilyMembers = (id) => {
    return api.get('/family-member', {
        params: {
            family_member_id: id
        }
    });
}

export const createFamilyMember = (data) => {
    return api.post('/family-member', data);
};

export const updateFamilyMember = (id, data) => {
    return api.put(`/family-member/${id}`, data);
};

export const deleteFamilyMember = (id) => {
    return api.delete(`/family-member/${id}`);
}