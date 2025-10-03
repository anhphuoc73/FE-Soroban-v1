import { create } from 'zustand';

const useChatStore = create((set) => ({
    conversation: {},
    setConversation: (value) => set({ conversation: value }),
    filterConversations: {},
    setFilterConversations: (value) => set({ filterConversations: value }),
    haveFilterConversations: false,
    setHaveFilterConversations: (value) => set({ haveFilterConversations: value }),
    addMessage: (conversationId, message) => set((state) => {
        const conversation = state.conversations[conversationId] || [];
        return {
            conversations: {
                ...state.conversations,
                [conversationId]: [...conversation, message]
            }
        };
    }),
    clearMessages: (conversationId) => set((state) => ({
        conversations: {
            ...state.conversations,
            [conversationId]: []
        }
    })),
    listMessages: (conversationId) => (state) => state.conversations[conversationId] || []
}));

export default useChatStore;