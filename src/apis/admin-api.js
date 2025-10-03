import http from 'src/utils/http';

import { endpoints } from 'src/constants/endpoints';

export const AdminApi = {
  addAdmin(body) {
    return http.post(`${endpoints.admin.addAdmin}`, body);
  },
  listAdmin(params) {
    return http.get(`${endpoints.admin.listAdmin}`, { params });
  },
  updateAdmin(body) {
    return http.put(`${endpoints.admin.updateAdmin}`, body);
  },
  deleteAdmin(body) {
    return http.delete(`${endpoints.admin.deleteAdmin}`,  { data: body });
  }

};
