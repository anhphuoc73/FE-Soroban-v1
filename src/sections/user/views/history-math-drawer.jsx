import { Drawer, Box, Typography, IconButton, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Close } from '@mui/icons-material';

export default function HistoryMath({ open, onClose, idStaff }) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm')); // dưới 600px
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 600px - 900px
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg')); // 900px - 1200px
  const isLg = useMediaQuery(theme.breakpoints.up('lg')); // từ 1200px trở lên

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: {
            xs: '100vw',  // full màn hình trên mobile
            sm: '100vw',  // vẫn full màn hình tablet nhỏ
            md: '90vw',   // gần full trên laptop
            lg: '80vw',   // rộng 80% trên desktop lớn
          },
          height: '100vh',  // luôn full chiều cao
          borderRadius: 0,
          p: { xs: 1.5, sm: 2, md: 3 }, // padding responsive
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight="bold">
          Lịch sử làm bài tập
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      {/* Nội dung bên trong */}
      <Box>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Mã nhân viên: <b>{idStaff}</b>
        </Typography>

        {/* Gọi API hoặc hiển thị dữ liệu ở đây */}
      </Box>
    </Drawer>
  );
}
