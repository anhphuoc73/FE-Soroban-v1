import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import { Tooltip } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks/index';

import { useResponsive } from 'src/hooks/use-responsive';

import { fToNow } from 'src/utils/format-time';

import { getNavItem } from '../../../utils/chat/get-nav-item';

// ----------------------------------------------------------------------

export function ChatNavItem({ selected, collapse, conversation, onCloseMobile }) {
  const mdUp = useResponsive('up', 'md');

  const router = useRouter();
  const {
    displayName,
    displayText,
    participants,
    lastActivity,
    isRead,
    conversation_id,
    platform,
    isPlatformSender,
  } = getNavItem({ conversation });
  const singleParticipant = participants[0];

  const { name, avatarUrl, status, nameResponse, avatarResponse } = singleParticipant;

  const handleClickConversation = useCallback(async () => {
    try {
      if (!mdUp) {
        onCloseMobile();
      }

      router.push(`${paths.content.chat}?id=${conversation_id}&platform=${platform}`);
    } catch (error) {
      console.error(error);
    }
  }, [conversation_id, mdUp, onCloseMobile, router, platform]);

  const renderSingle = (
    <Badge key={status} variant={status} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
      <Avatar alt={name} src={avatarUrl} sx={{ width: 48, height: 48 }} />
    </Badge>
  );

  return (
    <Box component="li" sx={{ display: 'flex' }}>
      <ListItemButton
        onClick={handleClickConversation}
        sx={{
          py: 1.5,
          px: 2.5,
          gap: 2,
          ...(selected && { bgcolor: 'action.selected' }),
        }}
      >
        <Badge
          color="error"
          overlap="circular"
          badgeContent={collapse ? conversation.unreadCount : 0}
        >
          {renderSingle}
        </Badge>

        {!collapse && (
          <>
            <ListItemText
              primary={displayName}
              primaryTypographyProps={{ noWrap: true, component: 'span', variant: 'subtitle2' }}
              secondary={displayText}
              secondaryTypographyProps={{
                noWrap: true,
                component: 'span',
                variant: !isRead ? 'subtitle2' : 'body2',
                color: !isRead ? 'text.primary' : 'text.secondary',
              }}
            />

            <Stack alignItems="flex-end" sx={{ alignSelf: 'stretch' }} spacing={0}>
              <Typography
                noWrap
                variant="body2"
                component="span"
                sx={{ mb: '8px', fontSize: 12, color: 'text.disabled' }}
              >
                {fToNow(lastActivity)}
              </Typography>

              {!isRead && !isPlatformSender ? (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    bgcolor: 'info.main',
                    borderRadius: '50%',
                  }}
                />
              ) : isPlatformSender ? (
                <Tooltip title={nameResponse} arrow>
                  <Avatar alt={nameResponse} src={avatarResponse} sx={{ width: 22, height: 22 }} />
                </Tooltip>
              ) : null}
            </Stack>
          </>
        )}
      </ListItemButton>
    </Box>
  );
}
