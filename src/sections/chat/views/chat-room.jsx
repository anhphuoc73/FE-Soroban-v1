import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';

import { Scrollbar } from 'src/components/scrollbar';

import { ChatRoomSkeleton } from './chat-skeleton';
import { ChatRoomSingle } from './chat-room-single';

// ----------------------------------------------------------------------

const NAV_WIDTH = 360;

const NAV_DRAWER_WIDTH = 360;

export function ChatRoom({ collapseNav, participants, messages, loading, platform }) {
  const { collapseDesktop, openMobile, onCloseMobile } = collapseNav;

  const attachments = messages.map((msg) => msg.attachments).flat(1) || [];

  const getSingleParticipantByMessage = () => {
    const message = messages[0];

    const isFromSender = (id, compareId) => id !== compareId;

    if (platform === 'facebook') {
      return isFromSender(message?.from_id, message?.page_id)
        ? {
            uid_fb: message?.from_id,
            name: message?.from_display_name,
            avatarUrl: message?.from_avatar,
          }
        : { uid_fb: message?.to_id, name: message?.to_display_name, avatarUrl: message?.to_avatar };
    }

    if (platform === 'zalo') {
      return isFromSender(message?.from_id, message?.oa_id)
        ? {
            uid_zl: message?.from_id,
            name: message?.from_display_name,
            avatarUrl: message?.from_avatar,
          }
        : { uid_zl: message?.to_id, name: message?.to_display_name, avatarUrl: message?.to_avatar };
    }

    return isFromSender(message?.from_id, message?.website_id)
      ? {
          uid_lv: message?.from_id,
          name: message?.from_display_name,
          avatarUrl: message?.from_avatar,
        }
      : { uid_lv: message?.to_id, name: message?.to_display_name, avatarUrl: message?.to_avatar };
  };
  const singleParticipant = getSingleParticipantByMessage();
  const renderContent = loading ? (
    <ChatRoomSkeleton />
  ) : (
    <Scrollbar>
      <div>
        <ChatRoomSingle participant={singleParticipant} />

        {/* <ChatRoomTicket attachments={attachments} /> */}
      </div>
    </Scrollbar>
  );

  return (
    <>
      <Stack
        sx={{
          minHeight: 0,
          mt: '-72px',
          flex: '1 1 auto',
          width: NAV_WIDTH,
          display: { xs: 'none', lg: 'flex' },
          borderLeft: (theme) => `solid 1px ${theme.vars.palette.divider}`,
          transition: (theme) =>
            theme.transitions.create(['width'], {
              duration: theme.transitions.duration.shorter,
            }),
          ...(collapseDesktop && { width: 0 }),
          bgcolor: 'background.default',
        }}
      >
        {!collapseDesktop && renderContent}
      </Stack>

      <Drawer
        anchor="right"
        open={openMobile}
        onClose={onCloseMobile}
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: NAV_DRAWER_WIDTH } }}
      >
        {renderContent}
      </Drawer>
    </>
  );
}
