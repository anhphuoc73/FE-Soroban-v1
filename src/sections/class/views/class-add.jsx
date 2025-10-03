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
  MenuItem
} from '@mui/material';
import { useAuthContext } from 'src/auth/hooks';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AuthApi } from 'src/apis/auth-api';
import { AdminApi } from 'src/apis/admin-api';
import { toast } from 'sonner';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import axios from 'axios';
import { CenterApi } from 'src/apis/center-api';
import { UserApi } from 'src/apis/user-api';
import { ClassApi } from 'src/apis/class-api';


export function ClassAddView() {
  const [formData, setFormData] = useState({
    className: '',
    teacherId: ''
  });

  const { user} = useAuthContext();
  const token = user.accessToken
  // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjlmN2QwYmE1ZTcyMTkzOWVlOTkzYyIsImlhdCI6MTc0NDQ1NTE2NiwiZXhwIjoxNzQ0NzE0MzY2fQ.ejdZ1GdK-Bo6CxHcjL_ZPzXlWsLAS5X9ADU4meVAIJA"
  const [errors, setErrors] = useState({});


  const fields = [
    { key: 'className', label: 'Tên lớp' },
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
      if (!value || value.trim() === '') {
        newErrors[field.key] = `${field.label} là bắt buộc`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addClassMutation = useMutation({
    mutationFn: ClassApi.addClass
  })

  const handleSubmit = () => {
    addClassMutation.mutate(formData,
      {
        onSuccess: () => {
          toast.success('Thêm lớp thành công', { duration: 2000 });
        },
        onError: () => {
          toast.error('Thêm lớp thất bại');
        }
      }
    )
  }

  const listUserTeacherQuery = useQuery({
      queryKey: ['user-select-list-teacher'],
      queryFn: UserApi.getListUserTeacher
  });
  
  const dataUserTeacher = listUserTeacherQuery?.data?.data?.metadata || [];

  const handleChangeCenter = (event) => {
    setFormData((prev) => ({
      ...prev,
      teacherId: event.target.value, 
    }));
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Thêm mới lớp
        </Typography>

        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="school-select-label">Chọn giáo viên phụ trách</InputLabel>
              <Select
                labelId="school-select-label"
                value={formData.teacherId}
                label="Chọn giáo viên phụ trách"
                onChange={handleChangeCenter}
                disabled={formData.position === 2} // disable khi là trung tâm
              >
                {dataUserTeacher.map((UserTeacher) => (
                  <MenuItem key={UserTeacher.teacherId} value={UserTeacher.teacherId}>
                    {UserTeacher.fullname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
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
          Thêm lớp
        </Button>
      </CardContent>
    </Card>
  );
}
