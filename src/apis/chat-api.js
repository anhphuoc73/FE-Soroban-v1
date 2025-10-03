import http from 'src/utils/http';

import { endpoints } from 'src/constants/endpoints';

export const ChatApi = {
    getConversations(params) {
        return http.get(endpoints.chat.getConversations, { params });
    },
    getListSocial(params) {
        return http.get(endpoints.chat.getListSocial, { params });
    },
    getConversation(params) {
        if (params.conversation_id !== '') {
            return http.get(endpoints.chat.getConversation, { params });
        }
        return [];
    },
    getTags(params) {
        return http.get(endpoints.chat.getTags, { params });
    },
    clearTagOnConversation(body) {
        return http.post(endpoints.chat.clearTagOnConversation, body);
    },
    addTagOnConversation(body) {
        return http.post(endpoints.chat.addTagOnConversation, body);
    },
    addTag(body) {
        return http.post(endpoints.chat.addTag, body);
    },
};
