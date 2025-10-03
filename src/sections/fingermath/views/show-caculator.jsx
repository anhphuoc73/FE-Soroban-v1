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
    <Box sx={{ width: 550, display:"flex", pt: 3, pl: 3, pr:3 }} role="presentation" onClick={toggleDrawer(false)}>
        <Typography sx={{
            fontSize: 30,
            fontWeight: "bold",
            color: "success.dark"
        }}>{stringNumber}</Typography>
    </Box>
  );

  return (
    <div>
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}