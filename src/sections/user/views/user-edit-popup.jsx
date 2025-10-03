import { useEffect, useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  FormControlLabel,
  Checkbox,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { AdminApi } from 'src/apis/admin-api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { CenterApi } from 'src/apis/center-api';
import { UserApi } from 'src/apis/user-api';

import { getProfileFromLS } from '../../../utils/auth';

export function UserEditView({ isOpenEdit, setIsOpenEdit, paramEdit, listUserQuery }) {
  
  const [formData, setFormData] = useState({
    teacherId: "",
    fullname: '',
    phone: '',
    address:'',
    expiredDate:'',
    active: '',
    position: '',
    birthDay: ''
  });
    
  const positionAuth = getProfileFromLS()?.position;

  const [errors, setErrors] = useState({});

  const fields = [
    { key: 'fullname', label: 'Họ tên' },
    { key: 'birthDay', label: 'Sinh nhật', type: 'date' },
    { key: 'phone', label: 'Số điện thoại', type: 'tel' },
    { key: 'address', label: 'Địa chỉ cụ thể' },
    { key: 'expiredDate', label: 'Ngày hết hạn', type: 'date' },
    { key: 'active', label: 'Trạng thái', type: 'checkbox' }
    
  ];

  // Mở dialog
  const handleClickOpen = () => {
    setIsOpenEdit(true);
  };

  // Đóng dialog
  const handleClose = () => {
    setIsOpenEdit(false);
  };

  // Cập nhật giá trị trong form
  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };


  const updateAdminMutation = useMutation({
    mutationFn: UserApi.updateUser
  })

  
  const handleSubmit = () => {
    const payload = {
      ...formData,
      expiredDate: dayjs(formData.expiredDate)
        .hour(23)
        .minute(59)
        .second(59)
        .format('YYYY-MM-DD HH:mm:ss'),
      birthDay: dayjs(formData.birthDay).format('YYYY-MM-DD'),
      id: paramEdit?.id
    };
    updateAdminMutation.mutate({...payload, id: paramEdit?.id},{
      onSuccess: () => {
          toast.success('cập nhật user thành công', { duration: 2000 });
          listUserQuery.refetch()
        },
      }
    )
    handleClose();
  };

  const handleChangeTeacher = (event) => {
    setFormData(prev => ({
      ...prev,
      teacherId: event.target.value
    }));
  };

  useEffect(() => {
    setFormData({
      fullname: paramEdit?.fullname,
      phone: paramEdit?.phone,
      teacherId: paramEdit?.teacherId,
      address: paramEdit?.address,
      expiredDate: new Date (paramEdit?.expired_date),
      birthDay: new Date (paramEdit?.birth_day),
      active: paramEdit?.active || 0,
      position: paramEdit?.position
    })
  }, [isOpenEdit, paramEdit])

  const getListUserTeacherQuery = useQuery({
    queryKey: ['get-list-user-teacher'],
    queryFn: UserApi.getListUserTeacher,
    enabled: positionAuth === 3,
  });
  const getListUserTeacher = getListUserTeacherQuery?.data?.data?.metadata || [];
  
  return (
    <Dialog open={isOpenEdit} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle>Cập nhật thông tin</DialogTitle>
      <DialogContent>
        {/* <Typography variant="body1" gutterBottom sx={{pb: 2}}>
            <></>
        </Typography> */}
        {/* Chia thành 2 cột */}
        <Grid container spacing={2} sx={{pt: 2}}>

          { positionAuth === 3 && formData.position === 5 &&(
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="school-select-label">Chọn giáo viên</InputLabel>
                <Select
                  labelId="school-select-label"
                  value={formData.teacherId || ""}
                  onChange={handleChangeTeacher}
                  disabled={formData.position === 4 || formData.position === 3} // chỉ enable khi position = 3
                  label="Chọn giáo viên"
                >
                  {getListUserTeacher.map((UserTeacher) => (
                    <MenuItem key={UserTeacher.teacherId} value={UserTeacher.teacherId}>
                      {UserTeacher.fullname}
                    </MenuItem>
                  ))}
                </Select>

              </FormControl>
            </Grid>
          )}
          

          { positionAuth === 2 && (
            fields.map((field) => (
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
                      label={field.label} // thêm label để hiển thị khi chưa có value
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
                          placeholder: formData[field.key] ? "" : field.label, // placeholder khi rỗng
                        },
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
                  type={field.type}
                />
              )}
            </Grid>
            ))
          )}

          {positionAuth === 3 && (
            <Grid item xs={12} sm={6}>
              <Stack>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Ngày sinh"
                    value={formData.birthDay ? dayjs(formData.birthDay) : null}
                    onChange={(newValue) =>
                      setFormData({
                        ...formData,
                        birthDay: newValue
                      })
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        placeholder: formData.birthDay ? "" : "Ngày sinh",
                      },
                    }}
                  />
                </LocalizationProvider>
              </Stack>
            </Grid>
          )}
          
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleClose}
            sx={{
              backgroundColor: "#d32f2f",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#e57373", // đỏ nhạt hơn khi hover
              },
            }}>Hủy</Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#118D57",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#1aa36a", // xanh nhạt hơn khi hover
            },
          }}>Đồng ý</Button>
      </DialogActions>
    </Dialog>
  );
}
