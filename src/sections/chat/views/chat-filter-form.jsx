import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { getContrastingTextColor } from 'src/utils/color-darker';

import useChatStore from 'src/zustand/chat.zustand';

import { Form, Field } from 'src/components/hook-form';

const ChatFilterForm = ({
  _socials,
  filterConversationsLocal,
  isResetFilter,
  setIsResetFilter,
  conversationsTags,
}) => {
  const { setFilterConversations } = useChatStore();
  const [status, setStatus] = useState(filterConversationsLocal?.status || []);
  const [channels, setChannels] = useState(filterConversationsLocal?.channels || []);
  const [selectedZalo, setSelectedZalo] = useState(filterConversationsLocal?.selectedZalo || []);
  const [selectedFacebook, setSelectedFacebook] = useState(
    filterConversationsLocal?.selectedFacebook || []
  );
  const [selectedLiveChat, setSelectedLiveChat] = useState(
    filterConversationsLocal?.selectedLiveChat || []
  );
  const [selectedTags, setSelectedTags] = useState(filterConversationsLocal?.selectedTags || []);

  const defaultValues = useMemo(() => ({}), []);

  const methods = useForm({
    mode: 'all',
    defaultValues,
  });

  const handleStatusChange = (event) => {
    const value = event.target.name;
    setStatus((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleChannelChange = (event) => {
    const value = event.target.name;
    setChannels((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  useEffect(() => {
    if (isResetFilter) {
      setIsResetFilter(false);
      setStatus([]);
      setChannels([]);
      setSelectedZalo([]);
      setSelectedLiveChat([]);
      setSelectedFacebook([]);
      setSelectedTags([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isResetFilter]);

  useEffect(() => {
    const handleFilterConversation = () => {
      const filter = {
        ...(status.includes('unanswered') && { is_read: 0 }),
        ...(status.includes('closed') && !status.includes('open') && { is_closed: 1 }),
        ...(!status.includes('closed') && status.includes('open') && { is_closed: 0 }),
        ...(channels?.length > 0 && { platform: channels }),
        ...(channels.includes('zalo') &&
          selectedZalo?.length > 0 && { oa_id: selectedZalo.map((item) => item?.oa_id) }),
        ...(channels.includes('livechat') &&
          selectedLiveChat?.length > 0 && {
            website_id: selectedLiveChat.map((item) => item?.website_id),
          }),
        ...(channels.includes('facebook') &&
          selectedFacebook?.length > 0 && {
            page_id: selectedFacebook.map((item) => item?.page_id),
          }),
        ...(selectedTags?.length > 0 && { tags: selectedTags.map((item) => item?._id) }),
      };
      setFilterConversations(filter);
      const filterToSaveLocal = {
        status,
        channels,
        selectedZalo,
        selectedLiveChat,
        selectedFacebook,
        selectedTags,
      };
      if (
        !status.length > 0 &&
        !channels.length > 0 &&
        !selectedZalo?.length > 0 &&
        !selectedLiveChat?.length > 0 &&
        !selectedFacebook?.length > 0 &&
        !selectedTags?.length > 0
      ) {
        // setFilterConversations({});
        return;
      }
      localStorage.setItem('filterConversations', JSON.stringify(filterToSaveLocal));
    };
    handleFilterConversation();
  }, [
    status,
    channels,
    selectedZalo,
    selectedLiveChat,
    selectedFacebook,
    setFilterConversations,
    selectedTags,
  ]);

  return (
    <Form methods={methods}>
      <Box sx={{ p: 2, maxWidth: 400 }}>
        {/* Trạng thái trò chuyện */}
        <Typography sx={{ fontWeight: 600, mb: 1 }}>Trạng thái trò chuyện</Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={status.includes('open')}
                onChange={handleStatusChange}
                name="open"
              />
            }
            label="Trò chuyện đang mở"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={status.includes('closed')}
                onChange={handleStatusChange}
                name="closed"
              />
            }
            label="Trò chuyện đã đóng"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={status.includes('unanswered')}
                onChange={handleStatusChange}
                name="unanswered"
              />
            }
            label="Trò chuyện chưa trả lời"
          />
        </FormGroup>

        {/* Kênh tương tác */}
        <Typography sx={{ fontWeight: 600, mt: 2, mb: 1 }}>Kênh tương tác</Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={channels.includes('livechat')}
                onChange={handleChannelChange}
                name="livechat"
              />
            }
            label="Live chat"
          />
          {channels.includes('livechat') && (
            <Field.Autocomplete
              multiple
              name="listLiveChat"
              placeholder="+ Websites"
              disableCloseOnSelect
              options={_socials?.livechat}
              value={selectedLiveChat}
              onChange={(event, newValue) => setSelectedLiveChat(newValue)}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderOption={(props, website) => (
                <li {...props} key={website._id}>
                  <Avatar
                    key={website._id}
                    alt={website.avatar}
                    src={website.avatar}
                    sx={{ mr: 1, width: 24, height: 24, flexShrink: 0 }}
                  />

                  {website.name}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected?.map((website, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={website._id}
                    size="small"
                    variant="soft"
                    label={website.name}
                    avatar={<Avatar alt={website.name} src={website.avatar} />}
                  />
                ))
              }
            />
          )}

          <FormControlLabel
            control={
              <Checkbox
                checked={channels.includes('zalo')}
                onChange={handleChannelChange}
                name="zalo"
              />
            }
            label="Zalo OA"
          />
          {channels.includes('zalo') && (
            <Field.Autocomplete
              multiple
              name="listZalo"
              placeholder="+ Zalo OA"
              disableCloseOnSelect
              options={_socials?.zalo}
              value={selectedZalo}
              onChange={(event, newValue) => setSelectedZalo(newValue)}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderOption={(props, zaloOa) => (
                <li {...props} key={zaloOa._id}>
                  <Avatar
                    key={zaloOa._id}
                    alt={zaloOa.avatar}
                    src={zaloOa.avatar}
                    sx={{ mr: 1, width: 24, height: 24, flexShrink: 0 }}
                  />

                  {zaloOa.name}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected?.map((zaloOa, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={zaloOa._id}
                    size="small"
                    variant="soft"
                    label={zaloOa.name}
                    avatar={<Avatar alt={zaloOa.name} src={zaloOa.avatar} />}
                  />
                ))
              }
            />
          )}
          <FormControlLabel
            control={
              <Checkbox
                checked={channels.includes('facebook')}
                onChange={handleChannelChange}
                name="facebook"
              />
            }
            label="Facebook"
          />
          {channels.includes('facebook') && (
            <Field.Autocomplete
              multiple
              name="listFanpage"
              placeholder="+ Fanpage"
              disableCloseOnSelect
              options={_socials?.facebook}
              value={selectedFacebook}
              onChange={(event, newValue) => setSelectedFacebook(newValue)}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderOption={(props, fanpage) => (
                <li {...props} key={fanpage._id}>
                  <Avatar
                    key={fanpage._id}
                    alt={fanpage.avatar}
                    src={fanpage.avatar}
                    sx={{ mr: 1, width: 24, height: 24, flexShrink: 0 }}
                  />

                  {fanpage.name}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected?.map((fanpage, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={fanpage._id}
                    size="small"
                    variant="soft"
                    label={fanpage.name}
                    avatar={<Avatar alt={fanpage.name} src={fanpage.avatar} />}
                  />
                ))
              }
            />
          )}
        </FormGroup>

        {/* Nhãn hội thoại */}
        <Typography sx={{ fontWeight: 600, mt: 2, mb: 1 }}>Nhãn hội thoại</Typography>
        <Typography sx={{ fontSize: 14, color: '#6b7280', mb: 1 }}>Nhãn áp dụng</Typography>
        <Field.Autocomplete
          multiple
          name="listTags"
          placeholder="+ Nhãn hội thoại"
          disableCloseOnSelect
          options={conversationsTags}
          value={selectedTags}
          onChange={(event, newValue) => setSelectedTags(newValue)}
          getOptionLabel={(option) => option.title}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          renderOption={(props, tag) => (
            <li {...props} key={tag._id}>
              {tag.title}
            </li>
          )}
          renderTags={(selected, getTagProps) =>
            selected?.map((tag, index) => (
              <Chip
                {...getTagProps({ index })}
                key={tag._id}
                label={tag.title}
                // onDelete={() => setSelectedTags(selectedTags.filter((t) => t !== tag))}
                sx={{
                  backgroundColor: tag.color
                    ? `rgba(${parseInt(tag.color.slice(1, 3), 16)}, ${parseInt(tag.color.slice(3, 5), 16)}, ${parseInt(tag.color.slice(5, 7), 16)}, 0.3)`
                    : '',
                  color: getContrastingTextColor(tag.color),
                  '&:hover': {
                    backgroundColor: tag.color
                      ? `rgba(${parseInt(tag.color.slice(1, 3), 16)}, ${parseInt(tag.color.slice(3, 5), 16)}, ${parseInt(tag.color.slice(5, 7), 16)}, 0.3)`
                      : '',
                  },
                  fontWeight: 500,
                }}
              />
            ))
          }
        />
      </Box>
    </Form>
  );
};

export default ChatFilterForm;
