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

export function CenterDeleteView({ listAdminQuery, isOpenDelete, setIsOpenDelete, id }) {
  
  const handleClose = () => {
    setIsOpenDelete(false);
  };
  const deleteAdminMutation = useMutation({
    mutationFn: AdminApi.deleteAdmin
  })

 
  
  const handleSubmit = () => {
    deleteAdminMutation.mutate(id,{
      onSuccess: () => {
          toast.success('Xóa trung tâm điều hành thành công', { duration: 2000 });
          listAdminQuery.refetch()
        },
      }
    )
    // handleClose();
  };

  
 
  return (
    <Dialog open={isOpenDelete} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle>Xóa thông tin trung tâm điều hành</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom sx={{pb: 2}}>
            Bạn có muốn xóa trung tâm điều hành
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Đồng ý
        </Button>
      </DialogActions>
    </Dialog>
  );
}
