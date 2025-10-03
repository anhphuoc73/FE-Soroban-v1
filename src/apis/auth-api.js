import http from 'src/utils/http';

import { endpoints } from 'src/constants/endpoints';

export const AuthApi = {
  login(body) {
    return http.post(endpoints.auth.login, body);
  },
};
