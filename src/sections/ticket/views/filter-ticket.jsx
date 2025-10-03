import * as React from 'react';
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useQuery, } from '@tanstack/react-query';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Autocomplete, Button, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TicketApi } from '../../../apis/ticket-api';

export default function FilterTicket({ onClickToggle, open ,setDefaultValue }) {
  const theme = useTheme();

  const listStatus = [
    { value: 'new', label: 'Mới tạo' },
    { value: 'process', label: 'Đang xử lý' },
    { value: 'success', label: 'Hoàn thành' },
    { value: 'expired', label: 'Quá hạn' },
  ];

  const listLevel = [
    { value: 'low', label: 'Thấp' },
    { value: 'medium', label: 'Bình thường' },
    { value: 'hight', label: 'Cao' },
  ];

  const listCustomer = [
    {
      _id: '12',
      full_name: 'Hải Phong',
    },
  ];

  const defaultValues = useMemo(
    () => ({
      nameTicket: '',
      typeTicket: null,
      level: null,
      employee: null,
      dateExpire: null,
      status: null,
    }),
    []
  );

  const typeTicketsQuery = useQuery({
    queryKey: ['type-ticket'],
    queryFn: () => TicketApi.getTypeTicket(),
    keepPreviousData: true,
    enabled: open,
  });

  const usersQuery = useQuery({
    queryKey: ['get-users'],
    queryFn: () => TicketApi.getAllUsers(),
    keepPreviousData: true,
    enabled: open,
  });

  const usersList = useMemo(() => usersQuery.data?.data?.metadata?.data || [], [usersQuery.data]);

  const typeTicketList = useMemo(
    () => typeTicketsQuery.data?.data?.metadata?.data || [],
    [typeTicketsQuery.data]
  );

  const methods = useForm({
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
  } = methods;

  const onSubmit = (data) => {
    console.log('Dữ liệu form:', data);
    setDefaultValue((prevFilters) => ({
      ...prevFilters,
      status: data.status?.map((item) => item.value) || [],
      typeTicket: data.typeTicket?.map((item) => item._id),
      level: data.level?.map((item) => item.value),
      employee: data.employee?.map((item) => item._id),
      createDate : data.createDate?.$d.getTime()/1000,
    }));
  };
  const renderActions = (
    <Box
      sx={{
        position: 'absolute',
        bottom: 20,
        right:30,
        backgroundColor: '#FFFFFF',
        padding: '',
        marginTop: '100px',
        zIndex: 10, // Đảm bảo hiển thị trên các phần khác
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
        <Button
          variant="contained"
          sx={{ backgroundColor: '#EF4036', mr: '10px' }}
          onClick={onClickToggle}
        >
          Đóng
        </Button>
        <Button type="submit" variant="contained" sx={{ backgroundColor: '#303187' }}>
          Lưu lại
        </Button>
    </Box>
  );
  const renderDetails = (
    <Box sx={{ width: '100%',maxHeight: '85vh',overflowY: 'auto',overflowX: 'hidden', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>
      <Typography sx={{ padding: '25px' }} variant="h6">
        Lọc
      </Typography>
      <Box
        sx={{
          borderBottom: '1px dashed #ccc',
          width: 'calc(100% + 60px)',
          margin: '0 -30px 20px',
        }}
      />
      <Stack spacing={2}>
        <Box sx={{ pl: '25px', pt: '12px', pr: '25px', minHeight: 50 }}>

          <Controller
            name="status"
            control={methods.control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                multiple
                options={listStatus}
                getOptionLabel={(option) => option.label}
                value={Array.isArray(field.value) ? field.value : []}
                onChange={(event, newValue) => field.onChange(newValue || [])}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                renderInput={(params) => (
                  <TextField {...params} label="Trạng thái" variant="outlined" />
                )}
                sx={{
                  '.MuiAutocomplete-tag': {
                    backgroundColor: theme.vars.palette.primary.main,
                  },
                }}
              />
            )}
          />

          <Controller
            name="typeTicket"
            control={methods.control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                multiple
                options={typeTicketList}
                value={Array.isArray(field.value) ? field.value : []}
                onChange={(event, newValue) => field.onChange(newValue || [])}
                getOptionLabel={(option) => option.name || ''}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderInput={(params) => (
                  <TextField {...params} label="Phân loại phiếu ghi" variant="outlined" />
                )}
                sx={{
                  '.MuiAutocomplete-tag': {
                    backgroundColor: theme.vars.palette.primary.main,
                  },
                  mt: '25px',
                }}
                ListboxProps={{
                  style: {
                    maxHeight: '200px',
                    overflowY: 'auto',
                  },
                }}
              />
            )}
          />

          <Controller
            name="level"
            control={methods.control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                multiple
                options={listLevel}
                getOptionLabel={(option) => option.label}
                value={Array.isArray(field.value) ? field.value : []}
                onChange={(event, newValue) => field.onChange(newValue || [])}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                renderInput={(params) => (
                  <TextField {...params} label="Mức độ ưu tiên" variant="outlined" />
                )}
                sx={{
                  '.MuiAutocomplete-tag': {
                    backgroundColor: theme.vars.palette.primary.main,
                  },
                  mt: '25px',
                }}
              />
            )}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="createDate"
              control={methods.control}
              render={({ field }) => (
                <DateTimePicker
                  {...field}
                  sx={{ mt: '25px', width: '100%' }}
                  label="Ngày khởi tạo"
                  onChange={(newValue) => field.onChange(newValue || [])}
                  format="DD/MM/YYYY HH:mm:ss"
                  views={['year', 'month', 'day', 'hours', 'minutes','seconds']}
                />
              )}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="endDate"
              control={methods.control}
              render={({ field }) => (
                <DateTimePicker
                  {...field}
                  sx={{ mt: '25px', width: '100%' }}
                  label="Hạn cuối"
                  onChange={(newValue) => field.onChange(newValue || [])}
                  format="DD/MM/YYYY HH:mm:ss"
                  views={['year', 'month', 'day', 'hours', 'minutes','seconds']}
                />
              )}
            />
          </LocalizationProvider>

          <Controller
            name="employee"
            control={methods.control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                multiple
                options={usersList}
                getOptionLabel={(option) => `${option.full_name} - ${option.email || ''}`}
                value={Array.isArray(field.value) ? field.value : []}
                onChange={(event, newValue) => field.onChange(newValue || [])}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderInput={(params) => (
                  <TextField {...params} label="Giao cho" variant="outlined" />
                )}
                sx={{
                  '.MuiAutocomplete-tag': {
                    backgroundColor: theme.vars.palette.primary.main,
                  },
                  mt: '25px',
                }}
              />
            )}
          />
          {renderActions}
        </Box>
      </Stack>
    </Box>
  );
  return (
    <Drawer
      sx={{
        borderRadius: '10px',
        borderBottomLeftRadius: '10px',
        '& .MuiDrawer-paper': {
          borderRadius: '20px',
          marginRight: '10px',
          marginTop: '5px',
          height: '98.5%',
          width: '30%',
          backgroundColor: 'white',
          '&::-webkit-scrollbar': {
            display: 'none',
            overflow: 'hidden',
          },
          '& .MuiList-root': {
            backgroundColor: 'white',
          },
        },
      }}
      anchor="right"
      open={open}
      onClose={onClickToggle}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {renderDetails}
        </form>
      </FormProvider>
    </Drawer>
);
}
FilterTicket.propTypes = {
  onClickToggle: PropTypes.func,
  setDefaultValue: PropTypes.func,
  open: PropTypes.bool,
};
