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
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  Radio
} from '@mui/material';
import { useAuthContext } from 'src/auth/hooks';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { UserApi } from 'src/apis/user-api';
import { CenterApi } from 'src/apis/center-api';

export function UserAddView() {
  const [formData, setFormData] = useState({
    centerName: '',
    centerId: '',
    adminName: '',
    fullname: '',
    phone: '',
    address: '',
    expiredDate: '',
    position: 3,
    birthDay: ""
  });

  const { user } = useAuthContext();
  const [errors, setErrors] = useState({});

  const fields = [
    { key: 'centerName', label: 'Tên trung tâm' },
    { key: 'fullname', label: 'Họ tên' },
    { key: 'phone', label: 'Số điện thoại', type: 'tel' },
    { key: 'birthDay', label: 'Sinh nhật', type: 'date' },
    { key: 'address', label: 'Địa chỉ cụ thể' },
    { key: 'expiredDate', label: 'Ngày hết hạn', type: 'date' },
    
  ];

  const handleChange = (key) => (event) => {
    let value = event.target.value;
    if (key === 'phone') {
      value = value.replace(/\D/g, '');
    }
    setFormData({ ...formData, [key]: value });
    setErrors({ ...errors, [key]: '' });
  };

  const validate = () => {
    const newErrors = {};
    fields.forEach((field) => {
      const value = formData[field.key];
      if (!value || value.toString().trim() === '') {
        if (field.key === 'centerName' && formData.position !== 2) return; // chỉ check nếu là position 2
        newErrors[field.key] = `${field.label} là bắt buộc`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addAdminMutation = useMutation({
    mutationFn: UserApi.addUser
  });

  const handleSubmit = () => {
    if (!validate()) return;

    addAdminMutation.mutate(formData, {
      onSuccess: (response) => {
        const message =   response?.data?.message || 'Thêm user thành công'; 
        toast.success(message, { duration: 2000 });
      },
      onError: (error) => {
        const message = error?.response?.data?.message  || 'Thêm user thất bại'; 
        toast.error(message);
      }
    });
  };

  const listUserCenterQuery = useQuery({
    queryKey: ['user-select-list-center'],
    queryFn: UserApi.getListUserCenter
  });

  const dataUserCenter = listUserCenterQuery?.data?.data?.metadata || [];


  const handleChangeCenter = (event) => {
    setFormData((prev) => ({
      ...prev,
      centerId: event.target.value, 
    }));
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Thêm mới tài khoản
        </Typography>

        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <FormLabel component="legend">Chọn vai trò</FormLabel>
          <RadioGroup
            row
            value={formData.position}
            onChange={(e) =>
              setFormData({ ...formData, position: parseInt(e.target.value, 10) })
            }
          >
            <FormControlLabel value={3} control={<Radio />} label="Trung tâm" />
            <FormControlLabel value={4} control={<Radio />} label="Giáo viên" />
            <FormControlLabel value={5} control={<Radio />} label="Học sinh" />
          </RadioGroup>
        </FormControl>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="school-select-label">Chọn trung tâm</InputLabel>
              <Select
                labelId="school-select-label"
                value={formData.centerId}
                label="Chọn trung tâm"
                onChange={handleChangeCenter}
                disabled={formData.position === 3} // disable khi là trung tâm
                sx={{
                  "&.Mui-disabled .MuiSelect-select": {
                    backgroundColor: "#f5f5f5",  // nền xám nhạt
                    WebkitTextFillColor: "#666", // chữ sẫm hơn
                  },
                  "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#999", // viền đậm hơn
                  },
                }}
              >
                {dataUserCenter.map((UserCenter) => (
                  <MenuItem key={UserCenter.id} value={UserCenter.id}>
                    {UserCenter.centerName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {fields.map((field) => (
            <Grid item xs={12} sm={6} key={field.key}>
              {field.key === 'centerName' && formData.position !== 3 ? (
                <TextField
                  fullWidth
                  label={field.label}
                  value={formData[field.key]}
                  onChange={handleChange(field.key)}
                  disabled
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#555", // chữ sẫm
                    },
                    "& .MuiOutlinedInput-root.Mui-disabled": {
                      backgroundColor: "#f0f0f0", // nền xám nhạt
                    },
                  }}
                />
              ) : field.type === 'date' ? (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label={field.label}   // ✅ thêm label chuẩn
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
                        error: Boolean(errors[field.key]),
                        helperText: errors[field.key] || ''
                      }
                    }}
                  />
                </LocalizationProvider>
              ) : (
                <TextField
                  fullWidth
                  label={field.label}
                  value={formData[field.key]}
                  onChange={handleChange(field.key)}
                  required={formData.position === 2 && field.key === 'centerName'}
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
          Thêm tài khoản
        </Button>
      </CardContent>
    </Card>
  );
}
