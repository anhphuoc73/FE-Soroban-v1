import axios from 'axios';

import { HttpStatusCode } from 'src/constants/http-code-status';

export function isAxiosError(error) {
  return axios.isAxiosError(error);
}

export function isAxiosUnprocessableEntityError(error) {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity;
}

export function isAxiosUnauthorizedError(error) {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized;
}

export function isAxiosConflictError(error) {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Conflict;
}
