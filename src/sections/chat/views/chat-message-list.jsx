import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';

import { Scrollbar } from 'src/components/scrollbar/index';
import { Lightbox, useLightBox } from 'src/components/lightbox/index';

import { ChatMessageItem } from './chat-message-item';
import { useMessagesScroll } from '../../../hooks/chat/use-messages-scroll';

// ----------------------------------------------------------------------

export function ChatMessageList({
  messages = [],
  participants,
  loading,
  conversationHasMore,
  fetchNextPageMessage,
}) {
  const { messagesEndRef } = useMessagesScroll(messages, conversationHasMore, fetchNextPageMessage);
  const slides = messages
    .filter((message) => message.type === 'image')
    .map((message) => ({ src: message.message }));

  const lightbox = useLightBox(slides);

  if (loading) {
    return (
      <Stack sx={{ flex: '1 1 auto', position: 'relative' }}>
        <LinearProgress
          color="inherit"
          sx={{
            top: 0,
            left: 0,
            width: 1,
            height: 2,
            borderRadius: 0,
            position: 'absolute',
          }}
        />
      </Stack>
    );
  }

  return (
    <>
      <Scrollbar ref={messagesEndRef} sx={{ px: 3, pt: 5, pb: 3, flex: '1 1 auto' }}>
        {messages.map((message) => (
          <ChatMessageItem
            key={message._id}
            message={message}
            participants={participants}
            onOpenLightbox={() => lightbox.onOpen(message.message)}
          />
        ))}
      </Scrollbar>

      <Lightbox
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
        index={lightbox.selected}
      />
    </>
  );
}
