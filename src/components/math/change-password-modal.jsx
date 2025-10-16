import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { UserApi } from 'src/apis/user-api';

export default function ChangePasswordModal({ open, onClose }) {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updatePasswordMutation = useMutation({
      mutationFn: UserApi.updatePassword    
  })

  const handleSubmit = async () => {
    const { currentPassword, newPassword, confirmPassword } = form;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error(`Vui lòng nhập đầy đủ thông tin.`, { duration: 2000 });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(`Mật khẩu mới và xác nhận không khớp.`, { duration: 2000 });
      return;
    }

    try {
      setLoading(true);
      // eslint-disable-next-line prefer-const
      let param = {
        // eslint-disable-next-line object-shorthand
        newPassword: newPassword,
        oldPassword: confirmPassword
      }
      updatePasswordMutation.mutate({...param},{
              onSuccess: (response) => {
                toast.success(`Cập nhật mật khẩu thành công!`, { duration: 4000 });
                setLoading(false);
                onClose();
                setForm({
                  currentPassword: "",
                  newPassword:"",
                  confirmPassword: ""
                })
              },
          }
      )
    } catch (err) {
      toast.error(`Có lỗi xảy ra khi cập nhật mật khẩu.`, { duration: 2000 });
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Đổi mật khẩu</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Mật khẩu hiện tại"
            type={showPassword ? 'text' : 'password'}
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Mật khẩu mới"
            type={showPassword ? 'text' : 'password'}
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Xác nhận mật khẩu mới"
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
