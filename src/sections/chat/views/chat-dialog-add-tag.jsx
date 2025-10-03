import { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { SketchPicker } from 'react-color';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { useAddTag } from 'src/actions/chat';

export function ChatDialogAddTag({ open, onClose, infoTag }) {
  const [sketchPickerColor, setSketchPickerColor] = useState('#37d67a');
  const [titleTag, setTitleTag] = useState(infoTag?.title || '');
  const [discriptionTag, setDiscriptionTag] = useState(infoTag?.discription || '');
  const [errorTittle, setErrorTittle] = useState(false);

  const { mutate, isLoading } = useAddTag();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClickOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handelSaveTag = () => {
    if (titleTag === '' || titleTag.length > 50) {
      setErrorTittle(true);
    } else {
      const data = {
        title: titleTag,
        discription: discriptionTag,
        color: sketchPickerColor,
      };
      console.log('data', data);
      mutate(data);
      onClose();
      // Reset all state
      setTitleTag('');
      setDiscriptionTag('');
      setSketchPickerColor('#37d67a');
    }
  };

  const openPopover = Boolean(anchorEl);
  const id = openPopover ? 'simple-popover' : undefined;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', fontSize: 18 }}>
        {infoTag?.title ? 'Cập nhật nhãn hội thoại' : 'Thêm mới nhãn hội thoại'}
      </DialogTitle>
      <Divider sx={{ borderStyle: 'dashed' }} />
      <DialogContent sx={{ px: 3, pb: 2, mt: 2 }} spacing={2}>
        <Stack direction="row" sx={{ justifyContent: 'center', alignItems: 'center' }} spacing={1}>
          <TextField
            fullWidth
            error={errorTittle}
            onChange={(e) => {
              setTitleTag(e.target.value);
              if (e.target.value !== '') {
                setErrorTittle(false);
              }
            }}
            variant="outlined"
            sx={{ mb: 2, mt: 1 }}
            defaultValue={titleTag}
            label={
              <span>
                Tên nhãn<span style={{ color: 'red' }}> *</span>
              </span>
            }
            helperText={
              errorTittle
                ? titleTag === ''
                  ? 'Tên nhãn không được để trống'
                  : titleTag.length > 50
                    ? 'Tên nhãn không được quá 50 ký tự'
                    : ''
                : ''
            }
          />
          <Card
            aria-describedby={id}
            onClick={handleClickOpenPopover}
            sx={{
              mb: 1,
              width: 55,
              height: 54,
              border: '1px solid #ddd',
              borderRadius: 1,
              backgroundColor: `${sketchPickerColor}`,
            }}
          >
            {}
          </Card>
          <Popover
            id={id}
            open={openPopover}
            anchorEl={anchorEl}
            onClose={handleClosePopover}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <SketchPicker
              onChange={(color) => {
                setSketchPickerColor(color.hex);
              }}
              color={sketchPickerColor}
            />
          </Popover>
        </Stack>

        <TextField
          fullWidth
          label="Mô tả"
          onChange={(e) => setDiscriptionTag(e.target.value)}
          defaultValue={discriptionTag}
          multiline
          minRows={3}
          variant="outlined"
        />
      </DialogContent>
      <Box display="flex" justifyContent="flex-end" gap={2} sx={{ px: 3, pb: 3 }}>
        <Button variant="contained" color="error" onClick={onClose}>
          Đóng
        </Button>
        <Button variant="contained" color="primary" onClick={() => handelSaveTag()}>
          Lưu lại
        </Button>
      </Box>
    </Dialog>
  );
}
