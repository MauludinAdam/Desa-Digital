import api from "./api";

// export const getHeadOfFamilies = (params = {}) => {
//   return api.get("/head-of-family", {
//     params,
//   });
// };

export const getHeadOfFamilies = (params = {}) => {
  return api.get("/head-of-family/all/paginated", {
    params,
  });
};
