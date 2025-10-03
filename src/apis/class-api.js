import http from 'src/utils/http';

import { endpoints } from 'src/constants/endpoints';

export const ClassApi = {
  addClass(body) {
    return http.post(`${endpoints.class.addClass}`, body);
  },
  // listCenter(params) {
  //   return http.get(`${endpoints.center.listCenter}`, { params });
  // },
  // updateCenter(body) {
  //   return http.put(`${endpoints.center.updateCenter}`, body);
  // },
  // deleteCenter(body) {
  //   return http.delete(`${endpoints.center.deleteCenter}`,  { data: body });
  // },
  listClass(params) {
    return http.get(`${endpoints.class.getListClass}`, { params });
  }

};
