import { useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks/index';

import { CONFIG } from 'src/config-global';
import useChatStore from 'src/zustand/chat.zustand';
import { MainContainer } from 'src/layouts/content-page/index';
import {
  useGetContacts,
  useGetConversation,
  useGetConversations,
  useGetTagsConversation,
} from 'src/actions/chat';

import { EmptyContent } from 'src/components/empty-content/index';

import { useMockedUser } from 'src/auth/hooks/index';

import { Layout } from './layout';
import { ChatNav } from './views/chat-nav';
import { ChatRoom } from './views/chat-room';
import { ChatMessageList } from './views/chat-message-list';
import { ChatMessageInput } from './views/chat-message-input';
import { ChatHeaderDetail } from './views/chat-header-detail';
// import { ChatHeaderCompose } from '../chat-header-compose';
import { useCollapseNav } from '../../hooks/chat/use-collapse-nav';

// ----------------------------------------------------------------------

export function ChatView() {
  const router = useRouter();

  const { user } = useMockedUser();

  const { contacts } = useGetContacts();

  const searchParams = useSearchParams();

  const selectedConversationId = searchParams.get('id') || '';
  const selectedConversationPlatform = searchParams.get('platform') || '';

  const [recipients, setRecipients] = useState([]);

  const { filterConversations } = useChatStore();
  const { conversations, conversationsLoading, conversationsHasMore, fetchNextPage } =
    useGetConversations(filterConversations);

  const {
    conversation,
    conversationError,
    conversationLoading,
    infoSocial,
    conversationIsClosed,
    conversationTags,
    fetchNextPageMessage,
    conversationHasMore
  } = useGetConversation({
    conversation_id: selectedConversationId,
    platform: selectedConversationPlatform,
  });

  const { conversationsTags } = useGetTagsConversation();

  const roomNav = useCollapseNav();

  const conversationsNav = useCollapseNav();

  const participants = conversation ? infoSocial : {};

  useEffect(() => {
    if (conversationError || !selectedConversationId) {
      router.push(paths.content.chat);
    }
  }, [conversationError, router, selectedConversationId]);

  const handleAddRecipients = useCallback((selected) => {
    setRecipients(selected);
  }, []);

  return (
    <MainContainer
      maxWidth={false}
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        '& .MuiContainer-root': { pt: '30px' },
      }}
    >
      <Layout
        sx={{
          minHeight: 0,
          flex: '1 1 0',
          borderRadius: 2,
          position: 'relative',
          bgcolor: 'background.paper',
          boxShadow: (theme) => theme.customShadows.card,
        }}
        slots={{
          header: selectedConversationId ? (
            <ChatHeaderDetail
              collapseNav={roomNav}
              participants={participants}
              loading={conversationLoading}
              conversationIsClosed={conversationIsClosed}
              conversationTags={conversationTags}
              conversationsTags={conversationsTags}
              conversationId={selectedConversationId}
            />
          ) : // <ChatHeaderCompose contacts={contacts} onAddRecipients={handleAddRecipients} />
          null,
          nav: (
            <ChatNav
              contacts={contacts}
              conversations={conversations}
              loading={conversationsLoading}
              selectedConversationId={selectedConversationId}
              collapseNav={conversationsNav}
              conversationsHasMore={conversationsHasMore}
              fetchNextPage={fetchNextPage}
              conversationsTags={conversationsTags}
            />
          ),
          main: (
            <>
              {selectedConversationId ? (
                <ChatMessageList
                  messages={conversation ?? []}
                  participants={participants}
                  loading={conversationLoading}
                  conversationHasMore={conversationHasMore}
                  fetchNextPageMessage={fetchNextPageMessage}
                />
              ) : (
                <EmptyContent
                  imgUrl={`${CONFIG.assetsDir}/assets/icons/empty/ic-chat-active.svg`}
                  title="Good morning!"
                  description="Write something awesome..."
                />
              )}

              <ChatMessageInput
                recipients={recipients}
                onAddRecipients={handleAddRecipients}
                selectedConversationId={selectedConversationId}
                disabled={!recipients.length && !selectedConversationId}
              />
            </>
          ),
          details: selectedConversationId && (
            <ChatRoom
              collapseNav={roomNav}
              participants={participants}
              loading={conversationLoading}
              messages={conversation ?? []}
              platform={selectedConversationPlatform}
            />
          ),
        }}
      />
    </MainContainer>
  );
}
