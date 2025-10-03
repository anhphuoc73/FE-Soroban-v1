import React, { useState } from 'react';

import Menu from '@mui/material/Menu';
import List from '@mui/material/List';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import { useAddTagOnConversation } from 'src/actions/chat';

import { CustomPopover } from 'src/components/custom-popover';

import COLORS from '../../../theme/core/colors.json';
import { ChatDialogAddTag } from './chat-dialog-add-tag';
import { Icon, ICON_NAME } from '../../../components/svg-color';

export function ChatTagsDropdown({ anchorEl, onClose, conversationsTags, conversationTags, conversationId }) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const { mutate, isLoading } = useAddTagOnConversation();

  const options = conversationsTags.filter((tag) => {
    let isUnique = true;
    conversationTags.forEach((conversationTag) => {
      if (tag._id === conversationTag._id) {
        isUnique = false;
      }
    });
    return isUnique;
  });

  // Filter options based on search input

  const filteredOptions = options.filter((option) =>
    option.title.toLowerCase().includes(search.toLowerCase())
  );

  const handelAddTag = (tag) => {
    const data = {
      conversation_id: conversationId,
      tag_id: tag._id,
    };
    mutate(data);
    onClose();
  }

  return (
    <>
      <CustomPopover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        slotProps={{ arrow: { placement: 'top-right' } }}
      >
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={onClose}
          slotProps={{
            paper: {
              sx: {
                minWidth: 220,
                borderRadius: 1,
                boxShadow: 3,
                p: 1,
              },
            },
          }}
        >
          {/* Search Input */}
          <TextField
            variant="outlined"
            placeholder="Tìm kiếm nhãn"
            size="small"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              mb: 1,
              '& .MuiOutlinedInput-root': {
                fontSize: 14,
                '& fieldset': { borderColor: '#ddd' },
                '&:hover fieldset': { borderColor: '#aaa' },
                '&.Mui-focused fieldset': { borderColor: '#007bff' },
              },
            }}
          />

          {/* "Thêm mới" Button */}
          <MenuItem
            sx={{
              color: COLORS.primary.main,
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'space-between',
              '&:hover': { backgroundColor: 'rgba(0, 123, 255, 0.1)' },
            }}
            onClick={() => setOpen(true)}
          >
            Thêm mới {/* <IconButton size="small"> */}
            <Icon
              name={ICON_NAME.add}
              color={COLORS.primary.main}
              sx={{ display: 'flex', alignItems: 'center', width: '16px', height: '16px' }}
            />
            {/* </IconButton> */}
          </MenuItem>

          {/* List of Filtered Items */}
          <List dense disablePadding>
            {filteredOptions?.map((option, index) => (
              <ListItemButton
                key={index}
                onClick={() => handelAddTag(option)}
                sx={{ borderRadius: 1, px: 2 }}
              >
                <ListItemText primary={option.title} />
              </ListItemButton>
            ))}
          </List>
        </Menu>
      </CustomPopover>
      <ChatDialogAddTag open={open} onClose={() => setOpen(false)} />
    </>
  );
}
