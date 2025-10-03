import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import { red } from '@mui/material/colors';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

import { usePermissionStore } from 'src/zustand/permission.zustand';

import { Form, RHFSelect } from 'src/components/hook-form';
// ----------------------------------------------------------------------

export function PermissionDeleteDialog({ open, onClose, data, onDelete }) {
  const defaultValues = {
    role: '',
  };
  const roleCurrent = usePermissionStore((state) => state.roleCurrent);
  const roleOptions = data
    .filter((item) => item._id !== roleCurrent?._id)
    .map((item) => ({ value: item._id, label: item.name }));

  const roleGroupSchema = Yup.object().shape({
    role: Yup.string().required('Quyền mới là bắt buộc'),
  });
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(roleGroupSchema),
  });

  const { reset, handleSubmit } = methods;

  const onSubmit = handleSubmit(async (value) => {
    onDelete(value.role);
    onClose();
    reset({ role: '' });
  });

  const handleClose = () => {
    reset({ role: '' });
    onClose();
  };
  return (
    <Dialog
      maxWidth={false}
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: { maxWidth: 50, pt: 3, minWidth: 500 },
      }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <Box sx={{ px: 4, display: 'flex', flexDirection: 'column' }}>
          <DialogTitle
            sx={{
              p: 0,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            Xóa quyền
          </DialogTitle>
          <Typography sx={{ fontSize: 15, color: '#637381', my: 1 }}>
            Quyền{' '}
            <Box
              component="span"
              sx={{ color: (theme) =>  theme.vars.palette.primary.main, fontWeight: 'bold' }}
            >
              {roleCurrent && roleCurrent?.name}
            </Box>{' '}
            đang có nhân viên sử dụng. Nếu muốn xóa quyền vui lòng chuyển nhân viên đến quyền mới.
          </Typography>

          <RHFSelect
            name="role"
            label="Quyền mới"
            InputLabelProps={{ shrink: true }}
            sx={{
              mt: 1,
              '& .MuiFormLabel-asterisk': {
                color: red[500],
              },
            }}
            required
          >
            {roleOptions.map((role) => (
              <MenuItem key={role.value} value={role.value}>
                {role.label}
              </MenuItem>
            ))}
          </RHFSelect>

          <DialogActions sx={{ px: 0 }}>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'flex-end',
                mt: 'auto',
              }}
            >
              <Button onClick={handleClose} variant="contained" color="error">
                Hủy
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Đồng ý
              </Button>
            </Box>
          </DialogActions>
        </Box>
      </Form>
    </Dialog>
  );
}
