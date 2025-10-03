import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';

import { keyBy } from 'src/utils/helper';
import axios, { fetcher, endpoints } from 'src/utils/axios';

import { ChatApi } from 'src/apis/chat-api';

// ----------------------------------------------------------------------

const enableServer = false;

const CHART_ENDPOINT = endpoints.chat;

const swrOptions = {
  revalidateIfStale: enableServer,
  revalidateOnFocus: enableServer,
  revalidateOnReconnect: enableServer,
};

// ----------------------------------------------------------------------

export function useGetContacts() {
  const url = [CHART_ENDPOINT, { params: { endpoint: 'contacts' } }];

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      contacts: data?.contacts || [],
      contactsLoading: isLoading,
      contactsError: error,
      contactsValidating: isValidating,
      contactsEmpty: !isLoading && !data?.contacts.length,
    }),
    [data?.contacts, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetConversations(params) {
  const {
    data,
    isLoading,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['conversations', params],
    queryFn: ({ pageParam = 0 }) =>
      ChatApi.getConversations({ ...params, skp: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.flatMap((page) => page.data?.metadata?.conversations).length;
      return lastPage?.data?.metadata?.has_more ? totalFetched : undefined;
    },
    initialPageParam: 0, // Start with skp = 0
  });

  // Merge all pages into a single conversation list
  const memoizedValue = useMemo(() => {
    const allConversations = data?.pages.flatMap((page) => page?.data?.metadata?.conversations) || [];
    const byId = allConversations.length ? keyBy(allConversations, '_id') : {};
    const allIds = Object.keys(byId);

    return {
      conversations: { byId, allIds },
      conversationsLoading: isLoading,
      conversationsError: error,
      conversationsValidating: isFetching,
      conversationsEmpty: !isLoading && !allIds.length,
      conversationsTotal: data?.pages?.[0]?.data?.metadata?.total_count,
      conversationsHasMore: hasNextPage, // Now correctly tied to `has_more`
      fetchNextPage, // Function to load more data
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, isLoading, isFetching, hasNextPage]);

  return memoizedValue;
}

export function useGetTagsConversation() {
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['conversations_tags'],
    queryFn: () => ChatApi.getTags(),
  });
  const memoizedValue = useMemo(() => {
    const dataTags = data?.data?.metadata;

    return {
      conversationsTags: dataTags,
      conversationsTagsLoading: isLoading,
      conversationsTagsError: error,
      conversationsTagsValidating: isFetching,
      conversationsTagsEmpty: !isLoading && !dataTags.length,
    };
  }, [data, error, isLoading, isFetching]);

  return memoizedValue;
}

// ----------------------------------------------------------------------


export function useGetConversation(params) {
  const {
    data,
    isLoading,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['conversation', params],
    queryFn: ({ pageParam = 0 }) =>
      ChatApi.getConversation({ ...params, skp: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.flatMap((page) => page.data?.metadata?.messages).length;
      return lastPage?.data?.metadata?.has_more ? totalFetched : undefined;
    },
    initialPageParam: 0, // Start with skp = 0
  });

  // Merge all pages into a single conversation list
  // const memoizedValue = useMemo(() => {
  //   const allMessages = data?.pages.flatMap((page) => page?.data?.metadata?.messages) || [];
  //   return {
  //     conversation: allMessages,
  //     conversationLoading: isLoading,
  //     conversationError: error,
  //     conversationValidating: isFetching,
  //     conversationTotal: data?.pages?.[0]?.data?.metadata?.total_count,
  //     infoSocial: data?.pages?.[0]?.data?.metadata?.info_social,
  //     conversationIsClosed: data?.pages?.[0]?.data?.metadata?.is_closed,
  //     conversationTags: data?.pages?.[0]?.data?.metadata?.tags,
  //     conversationHasMore: hasNextPage, // Now correctly tied to `has_more`
  //     fetchNextPageMessage: fetchNextPage, // Function to load more data
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [data, error, isLoading, isFetching, hasNextPage]);
  const memoizedValue = useMemo(() => {
    const allMessages = data?.pages
      .map((page) => page?.data?.metadata?.messages || [])
      .reduce((acc, messages) => [...messages, ...acc], []); // Ghép tin nhắn vào đầu

    return {
      conversation: allMessages, // Không cần reverse FE nữa
      conversationLoading: isLoading,
      conversationError: error,
      conversationValidating: isFetching,
      conversationTotal: data?.pages?.[0]?.data?.metadata?.total_count,
      infoSocial: data?.pages?.[0]?.data?.metadata?.info_social,
      conversationIsClosed: data?.pages?.[0]?.data?.metadata?.is_closed,
      conversationTags: data?.pages?.[0]?.data?.metadata?.tags,
      conversationHasMore: hasNextPage,
      fetchNextPageMessage: fetchNextPage,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, isLoading, isFetching, hasNextPage]);

  return memoizedValue;
}

// ----------------------------------------------------------------------


// export async function clearTagOnConversation(conversationId, tagId) {

export function useClearTagOnConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversation_id, tag_id }) => ChatApi.clearTagOnConversation({ conversation_id, tag_id }),

    onError: (error) => {
      // An error happened!
      console.error('Failed to clear tag:', error);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(['conversation']); // Re-fetch conversation after success
    }
  });
}

export function useAddTagOnConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversation_id, tag_id }) => ChatApi.addTagOnConversation({ conversation_id, tag_id }),

    onError: (error) => {
      // An error happened!
      console.error('Failed to add tag:', error);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(['conversation']); // Re-fetch conversation after success
    }
  });
}

export function useAddTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ title, color, discription }) => ChatApi.addTag({ title, color, discription }),

    onError: (error) => {
      // An error happened!
      console.error('Failed to add tag:', error);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(['conversations_tags']); // Re-fetch conversation after success
    }
  });
}

export async function sendMessage(conversationId, messageData) {
  const conversationsUrl = [CHART_ENDPOINT, { params: { endpoint: 'conversations' } }];

  const conversationUrl = [
    CHART_ENDPOINT,
    { params: { conversationId, endpoint: 'conversation' } },
  ];

  /**
   * Work on server
   */
  if (enableServer) {
    const data = { conversationId, messageData };
    await axios.put(CHART_ENDPOINT, data);
  }

  /**
   * Work in local
   */
  mutate(
    conversationUrl,
    (currentData) => {
      const currentConversation = currentData.conversation;

      const conversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, messageData],
      };

      return { ...currentData, conversation };
    },
    false
  );

  mutate(
    conversationsUrl,
    (currentData) => {
      const currentConversations = currentData.conversations;

      const conversations = currentConversations.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, messages: [...conversation.messages, messageData] }
          : conversation
      );

      return { ...currentData, conversations };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function createConversation(conversationData) {
  const url = [CHART_ENDPOINT, { params: { endpoint: 'conversations' } }];

  /**
   * Work on server
   */
  const data = { conversationData };
  const res = await axios.post(CHART_ENDPOINT, data);

  /**
   * Work in local
   */
  mutate(
    url,
    (currentData) => {
      const currentConversations = currentData.conversations;

      const conversations = [...currentConversations, conversationData];

      return { ...currentData, conversations };
    },
    false
  );

  return res.data;
}

// ----------------------------------------------------------------------

export async function clickConversation(conversationId) {
  /**
   * Work on server
   */
  if (enableServer) {
    await axios.get(CHART_ENDPOINT, { params: { conversationId, endpoint: 'mark-as-seen' } });
  }

  /**
   * Work in local
   */
  mutate(
    [CHART_ENDPOINT, { params: { endpoint: 'conversations' } }],
    (currentData) => {
      const currentConversations = currentData.conversations;

      const conversations = currentConversations.map((conversation) =>
        conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation
      );

      return { ...currentData, conversations };
    },
    false
  );
}
