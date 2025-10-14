import http from 'src/utils/http';

import { endpoints } from 'src/constants/endpoints';

export const ConfigMathApi = {
  updateConfigFingerMath(body) {
    return http.put(`${endpoints.configMath.fingerMath}`, body);
  },
  createPracticeFingerMath(body) {
    return http.post(`${endpoints.configMath.createPracticeFingerMath}`, body);
  },
  createPracticeFingerMathList(body) {
    return http.post(`${endpoints.configMath.createPracticeFingerMathList}`, body);
  },
  savePracticeFingerMath(body) {
    return http.post(`${endpoints.configMath.savePracticeFingerMath}`, body);
  },

  
  
  

};
