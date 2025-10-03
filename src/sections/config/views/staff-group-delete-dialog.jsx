import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// ----------------------------------------------------------------------

export function StaffGroupDeleteDialog({ open, onClose, data, onDelete }) {
  return (
    <Dialog
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 500, py: 3, px: 4, width: 500 },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <DialogTitle
          sx={{
            p: (theme) => theme.spacing(0, 0, 2, 0),
            fontSize: { xs: 17, md: 20 },
            fontWeight: 700,
          }}
        >
          Xóa nhóm nhân viên
        </DialogTitle>

        <DialogContent dividers sx={{ pb: 0, border: 'none', px: 0, overflow: 'hidden' }}>
          <Typography sx={{ fontSize: 15, color: '#637381' }}>
            Nhóm nhân viên{' '}
            <Box
              component="span"
              sx={{ color: (theme) => theme.vars.palette.primary.main, fontWeight: 'bold' }}
            >
              Kinh doanh
            </Box>{' '}
            đang tồn tại nhân viên. Vui lòng loại bỏ nhân viên ra khỏi nhóm trước khi xóa.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 0, pb: 0 }}>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'flex-end',
              mt: 'auto',
            }}
          >
            <Button onClick={onClose} type="submit" variant="contained" color="primary">
              Đồng ý
            </Button>
          </Box>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
