// export function ReportCallViewHistoryFilter(){
//   return (
//     <>
//
//     </>
//   )
// }


import {useState}  from 'react';
import Box from '@mui/material/Box';
// import Drawer from '@mui/material/Drawer';
// import Button from '@mui/material/Button';
import { Drawer, Select, MenuItem, Button, List, TextField, Typography, Checkbox, ListItemText } from '@mui/material';
// import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';

import { Icon, ICON_NAME } from 'src/components/svg-color/index';




export function ReportCallViewHistoryFilter({ open, onClickToggle }) {
  const [extension, setExtension] = useState([]);
  const [type, setType] = useState([]);
  const [disponsition, setDisponsition] = useState([]);

  const changeExtension = (event) => {
    const value = event.target.value;
    setExtension(typeof value === 'string' ? value.split(',') : value);
  };
  const changeType = (event) => {
    const value = event.target.value;
    setType(typeof value === 'string' ? value.split(',') : value);
  }
  const changeDisponsition = (event) => {
    const value = event.target.value;
    setDisponsition(typeof value === 'string' ? value.split(',') : value);
  }

  const itemExtension = [
    { value: '100', label: '100' },
    { value: '101', label: '101' },
    { value: '102', label: '102' },
    { value: '103', label: '103' },
    { value: '104', label: '104' },
    { value: '105', label: '105' },
  ];
  const itemType = [
    { value: 'inbound', label: 'Gọi vào' },
    { value: 'outbound', label: 'Gọi ra' },
    { value: 'local', label: 'Gọi nội bộ' },
  ];
  const itemDisponsition = [
    { value: 'ANSWERED', label: 'Trả lời' },
    { value: 'NO ANSWER', label: 'Không nghe máy' },
    { value: 'MISSED', label: 'Gọi nhỡ' },
    { value: 'BUSY', label: 'Máy bận' },
    { value: 'FAILED', label: 'Gọi lỗi' },
  ]


  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClickToggle}
      sx={{
        borderRadius: '10px',
        borderBottomLeftRadius: '10px',
        '& .MuiDrawer-paper': {
          borderRadius: '10px',
          marginRight: '10px',
          marginTop: '5px',
          height: '100%',
          backgroundColor: 'white',
          '&::-webkit-scrollbar': {
            display: 'none',
            overflow: "hidden",
          },
          "& .MuiList-root": {
            backgroundColor: "white",
          },
        },
      }}
    >
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        paddingBottom: "20px"
      }}>
        <Box sx={{ width: 450, flexGrow: 1 }}>
          <List sx={{ padding: '25px' }}>
            <Box sx={{ display: "fex", justifyContent:"space-between"}}>
              <Box>
                <Typography sx={{ marginBottom: '15px' }} variant="h6">
                  Lọc
                </Typography>
              </Box>
              <Box>
                <Icon name={ICON_NAME.add} sx={{ width: '16px !important' }} />
              </Box>
            </Box>
            <Box
              sx={{
                borderBottom: '1px dashed #ccc',
                width: 'calc(100% + 60px)',
                margin: '0 -30px 20px',
              }}
            />
            <Box sx={{ marginTop: '15px' }} xs={12} sm={6} md={3} lg={3} xl={3}>
              <Typography sx={{ marginBottom: '15px' }} variant="h6">
                Thời gian
              </Typography>
              <TextField
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: (theme) => theme.vars.palette.grey[200], // Màu viền khi focus
                    },
                    '&:hover fieldset': {
                      borderColor: (theme) => theme.vars.palette.grey[200], // Màu viền khi hover
                    },
                  },
                }}
              />
            </Box>
            <Box sx={{ marginTop: '15px' }} xs={12} sm={6} md={3} lg={3} xl={3}>
              <Typography sx={{ marginBottom: '10px' }} variant="h6">
                Trạng thái
              </Typography>
              <Select
                fullWidth
                labelId="select-label"
                multiple
                value={disponsition}
                onChange={changeDisponsition}
                renderValue={(selected) => selected.join(', ') || 'Chọn máy nhánh'}
                displayEmpty
                MenuProps={{
                  PaperProps: {
                    style: {
                      overflowY: 'auto', // Kích hoạt cuộn dọc
                    },
                  },
                }}
              >
                {itemDisponsition.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    <Checkbox checked={disponsition.indexOf(item.value) > -1} />
                    <ListItemText primary={item.label} />
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box sx={{ marginTop: '15px' }} xs={12} sm={6} md={3} lg={3} xl={3}>
              <Typography sx={{ marginBottom: '10px' }} variant="h6">
                Loại cuộc gọi
              </Typography>
              <Select
                fullWidth
                labelId="select-label"
                multiple
                value={type}
                onChange={changeType}
                renderValue={(selected) => selected.join(', ') || 'Chọn máy nhánh'}
                displayEmpty
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200, // Chiều cao tối đa của menu
                      overflowY: 'auto', // Kích hoạt cuộn dọc
                    },
                  },
                }}
              >
                {itemType.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    <Checkbox checked={type.indexOf(item.value) > -1} />
                    <ListItemText primary={item.label} />
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box sx={{ marginTop: '15px' }} xs={12} sm={6} md={3} lg={3} xl={3}>
              <Typography sx={{ marginBottom: '10px' }} variant="h6">
                Máy nhánh
              </Typography>
              <Select
                fullWidth
                labelId="select-label"
                multiple
                value={extension}
                onChange={changeExtension}
                renderValue={(selected) => selected.join(', ') || 'Chọn máy nhánh'}
                displayEmpty
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200, // Chiều cao tối đa của menu
                      overflowY: 'auto', // Kích hoạt cuộn dọc
                    },
                  },
                }}
              >
                {itemExtension.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    <Checkbox checked={extension.indexOf(item.value) > -1} />
                    <ListItemText primary={item.label} />
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box sx={{ marginTop: '15px' }} xs={12} sm={6} md={3} lg={3} xl={3}>
              <Typography sx={{ marginBottom: '15px' }} variant="h6">
                Số gọi
              </Typography>
              <TextField
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: (theme) => theme.vars.palette.grey[200], // Màu viền khi focus
                    },
                    '&:hover fieldset': {
                      borderColor: (theme) => theme.vars.palette.grey[200], // Màu viền khi hover
                    },
                  },
                }} />
            </Box>
            <Box sx={{ marginTop: '15px' }} xs={12} sm={6} md={3} lg={3} xl={3}>
              <Typography sx={{ marginBottom: '15px' }} variant="h6">
                Số nhận
              </Typography>
              <TextField
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: (theme) => theme.vars.palette.grey[200], // Màu viền khi focus
                    },
                    '&:hover fieldset': {
                      borderColor: (theme) => theme.vars.palette.grey[200], // Màu viền khi hover
                    },
                  },
                }} />
            </Box>
          </List>
        </Box>
        <Box sx={{ padding: '15px', display: 'flex', justifyContent: 'flex-end'}}>
          <Button onClick={onClickToggle} sx={{
            marginRight: '10px',
            backgroundColor: (theme)  => theme.vars.palette.error.main,
            "&:hover":{
              backgroundColor: (theme)  => theme.vars.palette.error.dark,
            },
            color: (theme)  => theme.vars.palette.common.white,

          }}>Hủy</Button>
          <Button variant="contained"
            sx={{
              backgroundColor: (theme)  => theme.vars.palette.primary.light,
              "&:hover":{
                backgroundColor: (theme)  => theme.vars.palette.primary.dark,
              },
              color: (theme)  => theme.vars.palette.common.white,
            }}
          >Lọc</Button>
        </Box>
      </Box>

    </Drawer>
  );
}


