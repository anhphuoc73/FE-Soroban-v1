import { useRef, useState, useEffect, useCallback } from 'react';

// // ----------------------------------------------------------------------
export function useMessagesScroll(messages, conversationHasMore, fetchNextPageMessage) {
  const messagesEndRef = useRef(null);
  const [heightScroll, setHeightScroll] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Cuộn xuống cuối khi có tin nhắn mới
  const scrollToBottom = useCallback(() => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight - heightScroll;
    // messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    setHeightScroll(messagesEndRef.current.scrollHeight)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  // Xử lý sự kiện cuộn lên trên để load more
  const handleScroll = useCallback(
    async (e) => {
      if (messagesEndRef.current.scrollTop === 0 && conversationHasMore) {
        setIsFirstLoad(false);
        fetchNextPageMessage(); // Ensure this is awaited to load new data before updating the scroll
      }
    },
    [conversationHasMore, fetchNextPageMessage] // Ensure dependencies are updated correctly
  );

  useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    const scrollElement = messagesEndRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
    }
    return () => scrollElement?.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
  return { messagesEndRef };
}
