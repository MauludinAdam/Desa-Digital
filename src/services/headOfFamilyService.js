import api from "./api";

export const getHeadOfFamilies = (params = {}) => {
  return api.get("/head-of-family/all/paginated", {
    params,
  });
};

export const createHeadOfFamily = (data) => {
  return api.post("/head-of-family", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
