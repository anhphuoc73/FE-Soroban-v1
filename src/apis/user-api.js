import http from 'src/utils/http';

import { endpoints } from 'src/constants/endpoints';

export const UserApi = {
  getMe() {
    return http.get(endpoints.user.me);
  },

  getUserByRoleId(id) {
    return http.get(`${endpoints.user.root}/${id}`);
  },


  addUser(body) {
    return http.post(`${endpoints.user.addUser}`, body);
  },
  listUser(params) {
    return http.get(`${endpoints.user.listUser}`, { params });
  },
  updateUser(body) {
    return http.put(`${endpoints.user.updateUser}`, body);
  },
  deleteUser(body) {
    return http.delete(`${endpoints.user.deleteUser}`,  { data: body });
  },
  getListUserCenter(params) {
    return http.get(`${endpoints.user.getListUserCenter}`, { params });
  },
  getListUserTeacher() {
    return http.get(`${endpoints.user.getListUserTeacher}`);
  }
  

};
