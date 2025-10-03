import http from 'src/utils/http';

import { endpoints } from 'src/constants/endpoints';

export const RoleApi = {
  createRole(body) {
    return http.post(endpoints.role.root, body);
  },

  list(params) {
    return http.get(endpoints.role.root, { params });
  },

  getRoleById(id) {
    return http.get(`${endpoints.role.root}/${id}`);
  },

  updateRole(body) {
    return http.put(`${endpoints.role.root}/${body.updateId}`, body);
  },

  deleteRole(body) {
    return http.delete(`${endpoints.role.root}`, { data: body });
  },
};
