import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
// eslint-disable-next-line import/no-unresolved
import { Iconify } from 'src/components/iconify';
import { Typography } from '@mui/material';

export function ShowCaculator({open, setOpen, stringNumber}) {
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
  <Box
    sx={{
      width: {
        xs: "80vw",   // mobile: 80% màn hình
        sm: "70vw",   // tablet
        md: "50vw",   // desktop vừa
        lg: "40vw",   // desktop lớn
      },
      maxWidth: "550px",
      display: "flex",
      flexDirection: "column",
      pt: 3,
      pl: 3,
      pr: 3,
      whiteSpace: "normal",   // cho phép xuống dòng
      wordWrap: "break-word", // tự cắt từ nếu quá dài
      overflowX: "hidden",    // không scroll ngang
    }}
    role="presentation"
    onClick={toggleDrawer(false)}
  >
    <Typography
      sx={{
        fontSize: 30,
        fontWeight: "bold",
        color: "success.dark",
        whiteSpace: "normal",   // quan trọng: xuống dòng
        wordBreak: "break-word" // cắt từ dài
      }}
    >
      {stringNumber}
    </Typography>
  </Box>
);


  return (
    <Box>
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: {
              xs: "80vw",   // màn hình nhỏ: 80% chiều rộng
              sm: "70vw",   // sm trở lên: 70%
              md: "50vw",   // md trở lên: 50%
              lg: "40vw",   // lg trở lên: 40%
            },
            maxWidth: "550px", // vẫn giữ giới hạn trên
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
          },
        }}
      >
        {DrawerList}
      </Drawer>
    </Box>
  );
}