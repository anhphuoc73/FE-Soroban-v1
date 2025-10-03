import http from 'src/utils/http';

import { endpoints } from 'src/constants/endpoints';

export const CenterApi = {
  addCenter(body) {
    return http.post(`${endpoints.center.addCenter}`, body);
  },
  listCenter(params) {
    return http.get(`${endpoints.center.listCenter}`, { params });
  },
  updateCenter(body) {
    return http.put(`${endpoints.center.updateCenter}`, body);
  },
  deleteCenter(body) {
    return http.delete(`${endpoints.center.deleteCenter}`,  { data: body });
  },
  getListCenter(params) {
    return http.get(`${endpoints.center.getListCenter}`, { params });
  }

};
