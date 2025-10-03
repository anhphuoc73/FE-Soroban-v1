import { useState, useEffect, useCallback } from 'react';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { useResponsive } from 'src/hooks/use-responsive';

import { getContrastingTextColor } from 'src/utils/color-darker';

import { useClearTagOnConversation } from 'src/actions/chat';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import COLORS from '../../../theme/core/colors.json';
import { ChatHeaderSkeleton } from './chat-skeleton';
import { ChatTagsDropdown } from './chat-tags-dropdown';
import { Icon, ICON_NAME } from '../../../components/svg-color';

// ----------------------------------------------------------------------

export function ChatHeaderDetail({
  participants,
  loading,
  conversationIsClosed,
  conversationTags,
  conversationsTags,
  conversationId
}) {
  const popover = usePopover();

  const lgUp = useResponsive('up', 'lg');

  const { mutate, isLoading } = useClearTagOnConversation();

  const singleParticipant = participants;

  const [status, setStatus] = useState({});

  const [anchorElTagsDropDown, setAnchorElTagsDropDown] = useState(false);

  useEffect(() => {
    setStatus(
      conversationIsClosed === 1
        ? { label: 'Đã đóng', color: COLORS.error.main }
        : { label: 'Đang mở', color: COLORS.success.main }
    );
  }, [conversationIsClosed]);

  const handleChangeStatus = useCallback(
    (newValue) => {
      popover.onClose();
      // Chèn api cập nhật đóng mở cuộc trò chuyện
      console.log('newValue', newValue);
      setStatus(newValue);
    },
    [popover]
  );

  const participantsTestData = [
    {
      id: '8864c717-587d-472a-929a-8e5f298024da-0',
      role: 'admin',
      status: 'online',
      name: 'Jaydon Frankie',
      email: 'demo@minimals.cc',
      phoneNumber: '+40 777666555',
      address: '90210 Broadway Blvd',
      avatarUrl: 'https://api-dev-minimal-v610.pages.dev/assets/images/avatar/avatar-25.webp',
      lastActivity: '2025-02-17T02:11:17+00:00',
    },
    {
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
      role: 'Data Analyst',
      email: 'lenna.bergnaum27@hotmail.com',
      name: 'Cristopher Cardenas',
      lastActivity: '2025-02-10T20:12:17+00:00',
      address: '279 Karolann Ports Apt. 774 - Prescott Valley, WV / 53905',
      avatarUrl: 'https://api-dev-minimal-v610.pages.dev/assets/images/avatar/avatar-7.webp',
      phoneNumber: '+33 1 23456789',
      status: 'alway',
    },
    {
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
      role: 'Product Owner',
      email: 'luella.ryan33@gmail.com',
      name: 'Melanie Noble',
      lastActivity: '2025-02-09T19:12:17+00:00',
      address: '96607 Claire Square Suite 591 - St. Louis Park, HI / 40802',
      avatarUrl: 'https://api-dev-minimal-v610.pages.dev/assets/images/avatar/avatar-8.webp',
      phoneNumber: '+81 3 1234 5678',
      status: 'online',
    },
    {
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b9',
      role: 'Graphic Designer',
      email: 'joana.simonis84@gmail.com',
      name: 'Chase Day',
      lastActivity: '2025-02-08T18:12:17+00:00',
      address: '9388 Auer Station Suite 573 - Honolulu, AK / 98024',
      avatarUrl: 'https://api-dev-minimal-v610.pages.dev/assets/images/avatar/avatar-9.webp',
      phoneNumber: '+86 10 1234 5678',
      status: 'offline',
    },
    {
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b10',
      role: 'Operations Manager',
      email: 'marjolaine.white94@gmail.com',
      name: 'Shawn Manning',
      lastActivity: '2025-02-07T17:12:17+00:00',
      address: '47665 Adaline Squares Suite 510 - Blacksburg, NE / 53515',
      avatarUrl: 'https://api-dev-minimal-v610.pages.dev/assets/images/avatar/avatar-10.webp',
      phoneNumber: '+55 11 2345-6789',
      status: 'online',
    },
    {
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b11',
      role: 'Customer Support Specialist',
      email: 'vergie.block82@hotmail.com',
      name: 'Soren Durham',
      lastActivity: '2025-02-06T16:12:17+00:00',
      address: '989 Vernice Flats Apt. 183 - Billings, NV / 04147',
      avatarUrl: 'https://api-dev-minimal-v610.pages.dev/assets/images/avatar/avatar-11.webp',
      phoneNumber: '+27 11 123 4567',
      status: 'offline',
    },
  ];

  const renderGroup = (
    <AvatarGroup max={3} sx={{ [`& .${avatarGroupClasses.avatar}`]: { width: 32, height: 32 } }}>
      {participantsTestData.map((participant) => (
        <Avatar key={participant.id} alt={participant.name} src={participant.avatarUrl} />
      ))}
    </AvatarGroup>
  );

  const renderInfoSocial = (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar
        src={singleParticipant?.avatar}
        alt={singleParticipant?.name}
        sx={{ width: '50px', height: '50px' }}
      />
      <ListItemText
        primary={singleParticipant?.name}
        secondary={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={0.5}>
            {conversationTags?.map((tag) => (
              <Chip
                key={tag._id}
                label={tag.title}
                onDelete={() => mutate({ conversation_id: conversationId, tag_id: tag._id })}
                sx={{
                  height: 28,
                  backgroundColor: tag.color
                    ? `rgba(${parseInt(tag.color.slice(1, 3), 16)}, ${parseInt(tag.color.slice(3, 5), 16)}, ${parseInt(tag.color.slice(5, 7), 16)}, 0.3)`
                    : '',
                  color: getContrastingTextColor(tag.color),
                  '&:hover': {
                    backgroundColor: tag.color
                      ? `rgba(${parseInt(tag.color.slice(1, 3), 16)}, ${parseInt(tag.color.slice(3, 5), 16)}, ${parseInt(tag.color.slice(5, 7), 16)}, 0.3)`
                      : '',
                  },
                }}
              />
            ))}
            <IconButton
              sx={{ p: 0.5, ml: 1, width: 28, height: 28 }}
              onClick={(e) => setAnchorElTagsDropDown(e.currentTarget)}
            >
              <Icon
                name={ICON_NAME.add}
                sx={{ display: 'flex', alignItems: 'center', width: '16px', height: '16px' }}
              />
            </IconButton>
          </Stack>
        }
        secondaryTypographyProps={{
          variant: 'caption',
          color: 'text.secondary',
          sx: { display: 'flex', alignItems: 'center', ml: -0.3 },
        }}
      />
    </Stack>
  );

  if (loading) {
    return <ChatHeaderSkeleton />;
  }

  return (
    <>
      {renderInfoSocial}

      <Stack
        direction="row"
        flexGrow={1}
        justifyContent="flex-end"
        sx={{ pr: 1, mr: lgUp ? '359px' : 0 }}
      >
        {renderGroup}

        <Button
          size="small"
          variant="outlined"
          sx={{ mt: 0.3, ml: 1 }}
          endIcon={<Iconify icon="eva:arrow-ios-downward-fill" width={16} />}
          onClick={popover.onOpen}
        >
          <Typography variant="bold" sx={{ color: status.color }}>
            {status.label}
          </Typography>
        </Button>
      </Stack>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'top-right' } }}
      >
        <MenuList sx={{ py: 0 }}>
          {['Đang mở', 'Đã đóng'].map((option) => (
            <MenuItem
              key={option}
              selected={status.label === option}
              onClick={() => {
                handleChangeStatus(status);
              }}
            >
              {option}
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>

      <ChatTagsDropdown
        anchorEl={anchorElTagsDropDown}
        onClose={() => setAnchorElTagsDropDown(false)}
        conversationsTags={conversationsTags}
        conversationTags={conversationTags}
        conversationId={conversationId}
      />
    </>
  );
}
