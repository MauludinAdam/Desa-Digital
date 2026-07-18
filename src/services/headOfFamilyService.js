import api from "./api";

// script ini untuk menampilkan data dari backend
export const getHeadOfFamilies = (params = {}) => {
  return api.get("/head-of-family/all/paginated", {
    params,
  });
};

// script ini untuk create data dari frontend ke backend dengan method post
export const createHeadOfFamily = (data) => {
  return api.post("/head-of-family", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// script ini menampilkan detail profile head of family dari backend ke frontend
export const detailHeadOfFamily = (id) => {
  return api.get(`/head-of-family/${id}`);
};

// script edit kepala keluarga ambil dari backend
export const getHeadOfFamily = (id) => {
  return api.get(`/head-of-family/${id}`);
};

// script update kelapa keluarga ambil api dari backend
export const updateHeadOfFamily = (id, data) => {
  return api.post(`/head-of-family/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// untuk delete satu per satu data
export const deleteHeadOfFamily = (id) => {
  return api.delete(`/head-of-family/${id}`);
};

// ini untuk delete all data dengan checkbox
export const deleteSelectedHeadOfFamily = (ids) => {
  return api.delete("/head-of-family/delete-selected", {
    data: {
      ids,
    },
  });
};
