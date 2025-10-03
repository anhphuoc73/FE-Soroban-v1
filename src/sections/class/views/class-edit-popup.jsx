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
  Stack
} from '@mui/material';
import { AdminApi } from 'src/apis/admin-api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { ClassApi } from 'src/apis/class-api';

export function ClassEditView({ isOpenEdit, setIsOpenEdit, paramEdit, listCenterQuery }) {
  
  const [formData, setFormData] = useState({
    teacherId: '',
    className: '',
  });

  const fields = [
    { key: 'teacherId', label: 'Giáo viên phụ trách' },
    { key: 'className', label: 'Tên lớp' }
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
    mutationFn: ClassApi.updateCenter
  })

  
  const handleSubmit = () => {
    const payload = {
      ...formData,
      expiredDate: dayjs(formData.expiredDate)
        .hour(23)
        .minute(59)
        .second(59)
        .format('YYYY-MM-DD HH:mm:ss'),
      id: paramEdit?.id
    };
    
    
    updateAdminMutation.mutate({...payload, id: paramEdit?.id},{
      onSuccess: () => {
          toast.success('cập nhật trung tâm điều hành thành công', { duration: 2000 });
          listCenterQuery.refetch()
        },
      }
    )
    handleClose();
  };

  useEffect(() => {
    setFormData({
      schoolName: paramEdit?.school_name,
      principal: paramEdit?.principal,
      phone: paramEdit?.phone,
      province: paramEdit?.province,
      district: paramEdit?.district,
      ward: paramEdit?.ward,
      address: paramEdit?.address,
      expiredDate: new Date (paramEdit?.expired_date),
      active: paramEdit?.active || 0
    })
  }, [isOpenEdit, paramEdit])
 
  return (
    <Dialog open={isOpenEdit} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle>Cập nhật thông tin trung tâm điều hành</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom sx={{pb: 2}}>
            Cập nhật lại thông tin
        </Typography>
        {/* Chia thành 2 cột */}
        <Grid container spacing={2}>
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
                      fullWidth 
                      value={formData[field.key] ? dayjs(formData[field.key]) : null}
                      onChange={(newValue) =>
                        setFormData({
                          ...formData,
                          [field.key]: newValue
                        })
                      }
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
          ))}
        

        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        {/* <Button variant="contained" onClick={handleSubmit}>
          Đồng ý
        </Button> */}
      </DialogActions>
    </Dialog>
  );
}
