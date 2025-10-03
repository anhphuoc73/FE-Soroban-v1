import { useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { useAuthContext } from 'src/auth/hooks';
import { useMutation } from '@tanstack/react-query';
import { AuthApi } from 'src/apis/auth-api';
import { AdminApi } from 'src/apis/admin-api';
import { toast } from 'sonner';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import axios from 'axios';


export function AdminAddView() {
  const [formData, setFormData] = useState({
    adminName: '',
    fullname: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    address: '',
    expiredDate: ''
  });

  const { user} = useAuthContext();
  const token = user.accessToken
  // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjlmN2QwYmE1ZTcyMTkzOWVlOTkzYyIsImlhdCI6MTc0NDQ1NTE2NiwiZXhwIjoxNzQ0NzE0MzY2fQ.ejdZ1GdK-Bo6CxHcjL_ZPzXlWsLAS5X9ADU4meVAIJA"
  const [errors, setErrors] = useState({});

  const fields = [
    { key: 'adminName', label: 'Trung tâm điều hành' },
    { key: 'fullname', label: 'Họ và tên' },
    { key: 'phone', label: 'Số điện thoại', type: 'tel' },
    { key: 'province', label: 'Tỉnh/Thành phố' },
    { key: 'district', label: 'Quận/Huyện' },
    { key: 'ward', label: 'Phường/Xã' },
    { key: 'address', label: 'Địa chỉ cụ thể' },
    { key: 'expiredDate', label: 'Ngày hết hạn', type: 'date' }
  ];

  const handleChange = (key) => (event) => {
    let value = event.target.value;
    if (key === 'phone') {
      value = value.replace(/\D/g, ''); // Chỉ giữ lại số
    }
    setFormData({ ...formData, [key]: value });
    setErrors({ ...errors, [key]: '' }); // Reset lỗi nếu người dùng bắt đầu nhập lại
  };

  const validate = () => {
    const newErrors = {};
    fields.forEach((field) => {
      const value = formData[field.key];
      if (!value || value.trim() === '') {
        newErrors[field.key] = `${field.label} là bắt buộc`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addAdminMutation = useMutation({
    mutationFn: AdminApi.addAdmin
  })

  const handleSubmit = () => {
    addAdminMutation.mutate(formData,
      {
        onSuccess: () => {
          toast.success('Thêm admin thành công', { duration: 2000 });
        },
        onError: () => {
          toast.error('Thêm admin thất bại');
        }
      }
    )
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Thêm mới Admin
        </Typography>

        <Grid container spacing={2}>
          {/* {fields.map((field) => (
            <Grid item xs={12} sm={field.key === 'address' ? 6 : 6} key={field.key}>
              <TextField
                fullWidth
                label={field.type === 'date' ? undefined : field.label} // 👈 bỏ label nếu là date
                value={formData[field.key]}
                onChange={handleChange(field.key)}
                required
                type={field.type || 'text'}
                error={Boolean(errors[field.key])}
                helperText={errors[field.key] || ''}
                InputLabelProps={field.type === 'date' ? { shrink: true } : undefined} // 👈 để tránh floating label lỗi khi không có label
                placeholder={field.type === 'date' ? field.label : ''} // 👈 nếu muốn hiển thị label kiểu placeholder
              />
            </Grid>
          ))} */}

          {fields.map((field) => (
            <Grid item xs={12} sm={6} key={field.key}>
              {field.type === 'checkbox' ? (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData[field.key] === 1}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [field.key]: e.target.checked ? 1 : 0
                        })
                      }
                    />
                  }
                  label={field.label}
                />
              ) : field.type === 'date' ? (
                <Stack>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={formData[field.key] ? dayjs(formData[field.key]) : null}
                      onChange={(newValue) =>
                        setFormData({
                          ...formData,
                          [field.key]: newValue
                        })
                      }
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          placeholder: field.label,
                          InputLabelProps: { shrink: true },
                          error: Boolean(errors[field.key]),
                          helperText: errors[field.key] || ''
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Stack>
              ) : (
                <TextField
                  fullWidth
                  label={field.label}
                  value={formData[field.key]}
                  onChange={handleChange(field.key)}
                  required={field.required}
                  type={field.type || 'text'}
                  error={Boolean(errors[field.key])}
                  helperText={errors[field.key] || ''}
                />
              )}
            </Grid>
          ))}
        </Grid>

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={handleSubmit}
        >
          Thêm admin
        </Button>
      </CardContent>
    </Card>
  );
}
