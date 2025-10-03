import { useQuery } from '@tanstack/react-query';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks/index';

import { useResponsive } from 'src/hooks/use-responsive';

import { today } from 'src/utils/format-time';

import { ChatApi } from 'src/apis/chat-api';
import useChatStore from 'src/zustand/chat.zustand';
import { createConversation } from 'src/actions/chat';

import { Iconify } from 'src/components/iconify/index';
import { Scrollbar } from 'src/components/scrollbar/index';
import { usePopover, CustomPopover } from 'src/components/custom-popover/index';

import { useMockedUser } from 'src/auth/hooks';

import { ToggleButton } from '../styles';
import { ChatNavItem } from './chat-nav-item';
import ChatFilterForm from './chat-filter-form';
import { ChatNavItemSkeleton } from './chat-skeleton';
import { ChatNavSearchResults } from './chat-nav-search-results';
import { initialConversation } from '../../../utils/chat/initial-conversation';

// ----------------------------------------------------------------------

const NAV_WIDTH = 320;

const NAV_COLLAPSE_WIDTH = 96;

export function ChatNav({
  loading,
  contacts,
  collapseNav,
  conversations,
  selectedConversationId,
  conversationsHasMore,
  fetchNextPage,
  conversationsTags
}) {
  const scrollRef = useRef();
  const popover = usePopover();
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');
  const { user } = useMockedUser();
  const { setFilterConversations } = useChatStore();

  const filterConversationsLocal = JSON.parse(localStorage.getItem('filterConversations'));

  useEffect(() => {
    const handleFilterConversation = () => {
      const filter = {
        ...(filterConversationsLocal?.status.includes('unanswered') && { is_read: 0 }),
        ...(filterConversationsLocal?.status.includes('closed') &&
          !filterConversationsLocal?.status.includes('open') && { is_closed: 1 }),
        ...(!filterConversationsLocal?.status.includes('closed') &&
          filterConversationsLocal?.status.includes('open') && { is_closed: 0 }),
        ...(filterConversationsLocal?.channels?.length > 0 && {
          platform: filterConversationsLocal?.channels,
        }),
        ...(filterConversationsLocal?.channels.includes('zalo') &&
          filterConversationsLocal?.selectedZalo?.length > 0 && {
            oa_id: filterConversationsLocal?.selectedZalo.map((item) => item?.oa_id),
          }),
        ...(filterConversationsLocal?.channels.includes('livechat') &&
          filterConversationsLocal?.selectedLiveChat?.length > 0 && {
            website_id: filterConversationsLocal?.selectedLiveChat.map((item) => item?.website_id),
          }),
        ...(filterConversationsLocal?.channels.includes('facebook') &&
          filterConversationsLocal?.selectedFacebook?.length > 0 && {
            page_id: filterConversationsLocal?.selectedFacebook.map((item) => item?.page_id),
          }),
      };
      setFilterConversations(filter);
    };
    handleFilterConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isResetFilter, setIsResetFilter] = useState(false);

  const {
    openMobile,
    onOpenMobile,
    onCloseMobile,
    onCloseDesktop,
    collapseDesktop,
    // onCollapseDesktop,
  } = collapseNav;

  const [searchContacts, setSearchContacts] = useState({
    query: '',
    results: [],
  });

  const listSocialQuery = useQuery({
    queryKey: ['listSocial'],
    queryFn: () => ChatApi.getListSocial(),
    keepPreviousData: true,
  });

  const _socials = listSocialQuery.data?.data?.metadata || [];
  // current user
  const myContact = useMemo(
    () => ({
      id: `${user?.id}`,
      role: `${user?.role}`,
      email: `${user?.email}`,
      address: `${user?.address}`,
      name: `${user?.displayName}`,
      lastActivity: today(),
      avatarUrl: `${user?.photoURL}`,
      phoneNumber: `${user?.phoneNumber}`,
      status: 'online',
    }),
    [user]
  );

  useEffect(() => {
    if (!mdUp) {
      onCloseDesktop();
    }
  }, [onCloseDesktop, mdUp]);

  // Processing infinite scroll

  const handleScroll = useCallback(
    async (e) => {
      const { target } = e;
      const isBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 10; // Better accuracy

      if (isBottom && conversationsHasMore) {
        const previousScrollOffset = target.scrollTop;

        fetchNextPage(); // Ensure this is awaited to load new data before updating the scroll

        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = previousScrollOffset; // Maintain scroll position
          }
        }, 0);
      }
    },
    [conversationsHasMore, fetchNextPage] // Ensure dependencies are updated correctly
  );

  // Attach the scroll listener
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
    }
    return () => scrollElement?.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleSearchContacts = useCallback(
    (inputValue) => {
      setSearchContacts((prevState) => ({ ...prevState, query: inputValue }));

      if (inputValue) {
        const results = contacts.filter((contact) =>
          contact.name.toLowerCase().includes(inputValue)
        );

        setSearchContacts((prevState) => ({ ...prevState, results }));
      }
    },
    [contacts]
  );

  const handleClickAwaySearch = useCallback(() => {
    setSearchContacts({ query: '', results: [] });
  }, []);

  const handleClickResult = useCallback(
    async (result) => {
      handleClickAwaySearch();
      console.log(result)
      const linkTo = (id) => router.push(`${paths.dashboard.chat}?id=${id}`);

      try {
        // Check if the conversation already exists
        if (conversations?.allIds.includes(result.id)) {
          linkTo(result.id);
          return;
        }

        // Find the recipient in contacts
        const recipient = contacts.find((contact) => contact.id === result.id);
        if (!recipient) {
          console.error('Recipient not found');
          return;
        }

        // Prepare conversation data
        const { conversationData } = initialConversation({
          recipients: [recipient],
          me: myContact,
        });

        // Create a new conversation
        const res = await createConversation(conversationData);

        if (!res || !res.conversation) {
          console.error('Failed to create conversation');
        }

        // Navigate to the new conversation
        linkTo(res.conversation.id);
      } catch (error) {
        console.error('Error handling click result:', error);
      }
    },
    [contacts, conversations?.allIds, handleClickAwaySearch, myContact, router]
  );

  const renderLoading = <ChatNavItemSkeleton />;

  const renderList = (
    <nav>
      <Box component="ul">
        {conversations?.allIds.map((conversationId) => (
          <ChatNavItem
            key={conversationId}
            collapse={collapseDesktop}
            conversation={conversations?.byId[conversationId]}
            selected={conversationId === selectedConversationId}
            onCloseMobile={onCloseMobile}
          />
        ))}
      </Box>
    </nav>
  );

  const renderListResults = (
    <ChatNavSearchResults
      query={searchContacts.query}
      results={searchContacts.results}
      onClickResult={handleClickResult}
    />
  );

  const renderSearchInput = (
    <ClickAwayListener onClickAway={handleClickAwaySearch}>
      <TextField
        fullWidth
        value={searchContacts.query}
        size="small"
        onChange={(event) => handleSearchContacts(event.target.value)}
        placeholder="Tìm kiếm hội thoại..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
        sx={{ mt: 2.5 }}
      />
    </ClickAwayListener>
  );

  const renderContent = (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          // flex: 1,
          p: 2.5,
          pt: 1,
          pb: 2,
          borderBottom: '1px solid #e9ecee',
          '& .MuiFormControl-root': {
            marginTop: 1,
          },
        }}
      >
        {!collapseDesktop && renderSearchInput}
        <IconButton sx={{ ml: 1.5, mt: 1 }} onClick={popover.onOpen}>
          <Badge badgeContent="" color="error" variant="dot" invisible={!filterConversationsLocal}>
            <Iconify
              width={22}
              icon="solar:filter-bold"
              sx={{ color: '#667085', cursor: 'pointer' }}
            />
          </Badge>
        </IconButton>
      </Box>

      {loading ? (
        renderLoading
      ) : (
        <Scrollbar scrollableNodeProps={{ ref: scrollRef }} sx={{ pb: 1 }}>
          {/* {searchContacts.query && !!conversations.allIds.length ? renderListResults : renderList} */}
          {renderList}
        </Scrollbar>
      )}
    </>
  );

  const renderHeadFilter = (
    <>
      <Box display="flex" alignItems="center" sx={{ py: 2, pr: 1, pl: 2.5, width: '350px' }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Lọc
        </Typography>

        <Tooltip title="Reset">
          <IconButton
            onClick={() => {
              localStorage.removeItem('filterConversations');
              setIsResetFilter(true);
            }}
          >
            <Iconify icon="solar:restart-bold" />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />
    </>
  );

  return (
    <>
      <ToggleButton onClick={onOpenMobile} sx={{ display: { md: 'none' } }}>
        <Iconify width={16} icon="solar:users-group-rounded-bold" />
      </ToggleButton>

      <Stack
        sx={{
          minHeight: 0,
          flex: '1 1 auto',
          width: NAV_WIDTH,
          display: { xs: 'none', md: 'flex' },
          borderRight: (theme) => `solid 1px ${theme.vars.palette.divider}`,
          transition: (theme) =>
            theme.transitions.create(['width'], {
              duration: theme.transitions.duration.shorter,
            }),
          ...(collapseDesktop && { width: NAV_COLLAPSE_WIDTH }),
        }}
      >
        {renderContent}
      </Stack>

      <Drawer
        open={openMobile}
        onClose={onCloseMobile}
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: NAV_WIDTH } }}
      >
        {renderContent}
      </Drawer>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'top-left' } }}
      >
        <Box sx={{ width: '350px' }}>
          {renderHeadFilter}
          <ChatFilterForm
            _socials={_socials}
            filterConversationsLocal={filterConversationsLocal}
            isResetFilter={isResetFilter}
            setIsResetFilter={setIsResetFilter}
            conversationsTags={conversationsTags}
          />
        </Box>
      </CustomPopover>
    </>
  );
}
