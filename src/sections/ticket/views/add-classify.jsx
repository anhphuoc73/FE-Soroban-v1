// eslint-disable-next-line import/no-extraneous-dependencies
import * as Yup from 'yup';
import * as React from 'react';
import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Dialog, Button, DialogTitle, DialogContent } from '@mui/material';

import { TicketApi } from '../../../apis/ticket-api';
import CustomSnackbar from '../../../components/snackbar/custom-snackbar';

const formAdd = Yup.object().shape({
  name: Yup.string().required('Tên nhóm là bắt buộc'),
  description: Yup.string().max(500, 'Không được vượt quá 500 ký tự'),
});

const AddClassify = ({ open, onClose, currentProduct }) => {
  const [charCount, setCharCount] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const queryClient = useQueryClient();
  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      tags: [],
      subDescription: '',
      description: currentProduct?.description || '',
    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(formAdd),
    defaultValues,
  });

  const { handleSubmit, control, formState: { errors }, reset } = methods;

  const sendFormAddTypeKpi = useMutation({
    mutationFn: (body) => TicketApi.addTypeTicket(body),
  });
  const onSubmit = (data) => {
    console.log("Submitted Data:", data);
    sendFormAddTypeKpi.mutate(
      { data },
      {
        onSuccess: (e) => {
          if (e.data.metadata.status === 200) {
            queryClient.refetchQueries({ queryKey: ['type-ticket'] });
            setShowAlert(true);
            onClose()
            reset(defaultValues);
          } else {
            setShowAlert(false);
          }
        },
      }
    );
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ position: 'relative', paddingBottom: '20px' }}>
          Thêm mới phân loại phiếu ghi
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              borderBottom: '1px dashed #ccc',
            }}
          />
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {/* Input: Tên phân loại */}
            <Box sx={{ marginTop: '25px' }}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={{ width: '100%' }}
                    label={
                      <span>
                        Tên phân loại <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Box>
            <Box sx={{ marginTop: '20px' }}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={{ width: "100%" }}
                    label={`Mô tả (${charCount}/500 ký tự)`}
                    multiline
                    rows={2}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    onChange={(e) => {
                      field.onChange(e); // Đảm bảo cập nhật giá trị vào react-hook-form
                      setCharCount(e.target.value.length); // Cập nhật số ký tự
                    }}
                  />
                )}
              />
            </Box>

            {/* Buttons */}
            <Box sx={{ marginTop: '20px', textAlign: 'right', marginBottom: '25px' }}>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#EF4036', mr: '10px' }}
                onClick={onClose}
              >
                Đóng
              </Button>
              <Button type="submit" variant="contained" sx={{ backgroundColor: '#303187' }}>
                Lưu lại
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      <CustomSnackbar
        open={showAlert}
        onClose={() => setShowAlert(false)}
        message="Thêm mới phân loại phiếu ghi thành công!"
        severity="success"
      />

    </>

  );
};

export default AddClassify;
