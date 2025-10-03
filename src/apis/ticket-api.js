import http from 'src/utils/http';

import { endpoints } from 'src/constants/endpoints';

export const TicketApi = {
  addTypeTicket(body) {
    return http.post(endpoints.ticket.addTypeTicket, body);
  },
  getTypeTicket(params) {
    return http.get(endpoints.ticket.getTypeTicket, { params });
  },
  addTicket(body) {
    return http.post(endpoints.ticket.addTicket, body, { headers: { "Content-Type": "multipart/form-data" }, });
  },
  getTicket(params) {
    return http.get(endpoints.ticket.getTicket, { params });
  },
  deleteTicket(body) {
    return http.post(endpoints.ticket.deleteTicket, body);
  },
  getDetailTicket(params) {
    return http.get(endpoints.ticket.getDetailTicket, { params });
  },
  getAllUsers(params) {
    return http.get(endpoints.ticket.getAllUsers, { params });
  },
  editTicket(body) {
    return http.post(endpoints.ticket.editTicket, body, { headers: { "Content-Type": "multipart/form-data" }, });
  },
};
