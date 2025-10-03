import { m } from 'framer-motion';

import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { varHover } from 'src/components/animate';

import { Icon, ICON_NAME } from '../svg-color';
import { Iconify } from '../iconify';

import { getProfileFromLS } from '../../utils/auth';




// ----------------------------------------------------------------------
export function RenderCellTitleTooltip({ title, isPL, sx, onClick }) {
  return (
    <Tooltip title={typeof title === 'string' ? title : ''} placement="top" arrow>
      <Typography
        onClick={onClick}
        sx={{
          py: 2,
          fontSize: 14,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: 'block',
          whiteSpace: 'nowrap', // Chặn xuống dòng
          pl: isPL ? '10px' : 0,
          fontWeight: 500,
          ...sx,
        }}
      >
        {title === 'undefined' ? '' : title}
      </Typography>
    </Tooltip>
  );
}
// ----------------------------------------------------------------------
export function RenderCellTitle({ title, isPL }) {
  return (
    <Typography
      sx={{ py: 2, fontSize: 14, pl: isPL ? '10px' : 0, letterSpace: 'nowrap', fontWeight: 500 }}
    >
      {title}
    </Typography>
  );
}
export function RenderCellPosition({ position, isPL, onClick }) {
  const getPositionLabel = (pos) => {
    switch (pos) {
      case 2:
        return "Admin";
      case 3:
        return "Trung tâm";
      case 4:
        return "Giáo viên";
      case 5:
        return "Học viên";
      default:
        return "Không xác định";
    }
  };

  const getButtonColor = (pos) => {
    switch (pos) {
      case 3: // Trung tâm
        return { backgroundColor: "#118D57", color: "#fff" };
      case 4: // Giáo viên
        return { backgroundColor: "#d32f2f", color: "#fff" };
      case 5: // Học viên
        return { backgroundColor: "#fbc02d", color: "#fff" };
      default:
        return {};
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <Button
        variant="contained"
        size="small"
        sx={{
          textTransform: "none",
          fontSize: 14,
          fontWeight: 500,
          px: 2,
          py: 0.5,
          whiteSpace: "nowrap",
          ...getButtonColor(position),
        }}
        onClick={onClick}
      >
        {getPositionLabel(position)}
      </Button>
    </Box>
  );
}
export function RenderCellActive({ title, isPL, onClick }) {
  const isActive = title === 1;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <Button
        variant="contained"
        size="small"
        sx={{
          textTransform: "none",
          fontSize: 14,
          fontWeight: 500,
          px: 2,
          py: 0.5,
          whiteSpace: "nowrap",
          backgroundColor: isActive ? "green" : "red",
          color: "#fff",
          transition: "background-color 0.3s ease",
          "&:hover": {
            backgroundColor: isActive ? "#4caf50" : "#f44336", // màu khác khi hover
          },
          "&:active": {
            backgroundColor: isActive ? "#2e7d32" : "#c62828", // khi nhấn giữ
          },
        }}
        onClick={onClick}
      >
        {isActive ? "Đã kích hoạt" : "Chưa kích hoạt"}
      </Button>
    </Box>
  );
}

export function RenderCellStatus() {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="flex-end"
      sx={{ fontSize: 14, outline: 'none' }}
    >
      <Switch defaultChecked />
    </Stack>
  );
}

export function RenderCellAction({ onOpenEdit, onOpenDelete, params }) {
  // console.log("params", params)
  const profile = getProfileFromLS()
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="flex-end"
      sx={{ fontSize: 14, outline: 'none' }}
    >
      {profile?.position === 2 && (
        <Tooltip title="Cập nhật" placement="top" arrow>
          <IconButton
            component={m.button}
            variants={varHover(1.2)}
            whileTap="tap"
            whileHover="hover"
            onMouseUp={onOpenEdit}
          >
            <Iconify icon="solar:pen-bold" width={18} />
          </IconButton>
        </Tooltip>
      )}

      {profile?.position === 3 && params.position === 5 && (
        <Tooltip title="Cập nhật" placement="top" arrow>
          <IconButton
            component={m.button}
            variants={varHover(1.2)}
            whileTap="tap"
            whileHover="hover"
            onMouseUp={onOpenEdit}
          >
            <Iconify icon="solar:pen-bold" width={18} />
          </IconButton>
        </Tooltip>
      )}
      
     
      {/* <Tooltip title="Xóa" placement="top" arrow>
        <IconButton
          component={m.button}
          variants={varHover(1.2)}
          whileTap="tap"
          whileHover="hover"
          onMouseUp={onOpenDelete}
          sx={{ color: 'red' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" width={18} />
        </IconButton>
      </Tooltip> */}
    </Stack>
  );
}
