import http from 'src/utils/http';

import { endpoints } from 'src/constants/endpoints';

export const ConfigMathApi = {
  updateConfigFingerMath(body) {
    return http.put(`${endpoints.configMath.fingerMath}`, body);
  },
  createPacticeFingerMath(body) {
    return http.post(`${endpoints.configMath.createPracticeFingerMath}`, body);
  },
  savePacticeFingerMath(body) {
    return http.post(`${endpoints.configMath.savePracticeFingerMath}`, body);
  },
  
  

};
