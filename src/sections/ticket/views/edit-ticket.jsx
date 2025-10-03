import dayjs from 'dayjs';
import * as Yup from 'yup';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Collapse from '@mui/material/Collapse';
import RadioGroup from '@mui/material/RadioGroup';
import { styled, useTheme } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Autocomplete, Button, TextField, Typography } from '@mui/material';
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';

import AddClassify from './add-classify';
import { useTabs } from '../../../hooks/use-tabs';
import { TicketApi } from '../../../apis/ticket-api';
import { useBoolean } from '../../../hooks/use-boolean';
import { useRouter } from '../../../routes/hooks/index';
import { RHFTextField } from '../../../components/hook-form/index';
import { CustomTabs } from '../../../components/custom-tabs/index';
import { Icon, ICON_NAME } from '../../../components/svg-color/index';
import CustomSnackbar from '../../../components/snackbar/custom-snackbar';
import { FormField, InputView } from '../../../utils/render-input.jsx';
import IconButton from '@mui/material/IconButton';
import { CloseIcon } from 'yet-another-react-lightbox';

export default function EditTickets({ onClickToggle, open }) {
  const theme = useTheme();
  const collapse = useBoolean(true);
  const router = useRouter();
  const [searchParams] = useSearchParams();
  const [selected, setSelected] = useState('medium');
  const [openClassify, setOpenClassify] = useState(false);
  const id = searchParams.get('id');
  const fileInputRef = useRef(null);
  const [showAlert, setShowAlert] = useState(false);
  const [file, setFile] = useState([]);
  const queryClient = useQueryClient();
  const listCustomer = [
    {
      _id: '12',
      full_name: 'Hải Phong',
    },
  ];

  const listStaus = [
    {
      _id: 'new',
      label: 'Mới tạo',
    },
    {
      _id: 'expired',
      label: 'Quá hạn',
    },
    {
      _id: 'process',
      label: 'Đang xử lý',
    },
    {
      _id: 'success',
      label: 'Hoàn thành',
    },
  ]

  const priorityOptions = [
    {
      value: 'medium',
      label: 'Bình thường',
      bgColor: '#fff8dd',
      textColor: '#d0af12',
      iconBg: '#d0af12',
      iconName: ICON_NAME.ticketMedium,
    },
    {
      value: 'hight',
      label: 'Cao',
      bgColor: '#ffbfaa',
      textColor: 'red',
      iconBg: '#FF6A6A',
      iconName: ICON_NAME.ticketHigh,
    },
    {
      value: 'low',
      label: 'Thấp',
      bgColor: '#dbead5',
      textColor: 'green',
      iconBg: '#63B8FF',
      iconName: ICON_NAME.ticketLow,
    },
  ];

  const formEdit = Yup.object().shape({
    nameTicket: Yup.string().required('Tên phiếu ghi là bắt buộc'),
    typeTicket: Yup.object().nullable().required('Phân loại là bắt buộc'),
    customer: Yup.object().nullable().required('Khách hàng là bắt buộc'),
    employee: Yup.object().nullable().required('Giao cho nhân viên là bắt buộc'),
    dateExpire: Yup.date().nullable().required('Ngày hết hạn là bắt buộc'),
    timeNotify: Yup.string().required('Nhắc nhở trước là bắt buộc'),
  });

  const defaultValues = useMemo(
    () => ({
      nameTicket: '',
      typeTicket: null,
      description: '',
      customer: null,
      employee: null,
      dateExpire: null,
      timeNotify: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(formEdit),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
  } = methods;

  const ticketDetailQuery = useQuery({
    queryKey: ['ticket', { id }],
    queryFn: () => TicketApi.getDetailTicket({ id }),
    keepPreviousData: true,
    enabled: open,
  });

  const typeTicketsQuery = useQuery({
    queryKey: ['type-ticket'],
    queryFn: () => TicketApi.getTypeTicket(),
    keepPreviousData: true,
    enabled: open,
  });

  const typeTicketList = useMemo(
    () => typeTicketsQuery.data?.data?.metadata?.data || [],
    [typeTicketsQuery.data]
  );

  const listTicket = useMemo(
    () => ticketDetailQuery.data?.data?.metadata?.data || [],
    [ticketDetailQuery.data]
  );

  const options = [{ name: 'Thêm mới', _id: 'addClassify' }, ...typeTicketList];

  const tabsList = [
    { value: 'info', label: 'Thông tin khách hàng' },
    { value: 'chat', label: 'Trò chuyện' },
  ];

  const tabs = useTabs(tabsList[0]?.value || '');
  const usersQuery = useQuery({
    queryKey: ['get-users'],
    queryFn: () => TicketApi.getAllUsers(),
    keepPreviousData: true,
    enabled: open,
  });

  const sendFormEditKpi = useMutation({
    mutationFn: (body) => TicketApi.editTicket(body),
  });

  const usersList = useMemo(() => usersQuery.data?.data?.metadata?.data || [], [usersQuery.data]);
  const UploadButton = styled(Button)({
    border: '2px solid #00A650',
    color: '#00A650',
    textTransform: 'none',
    fontWeight: 'bold',
    borderRadius: '10px',
    padding: '3px 15px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    '&:hover': {
      backgroundColor: 'rgba(0, 166, 80, 0.1)',
    },
  });

  const handleFileChange = (event) => {
    const selectedFile = Array.from(event.target.files);
    const filteredFiles = selectedFile.filter(item => item.size <= 20 * 1024 * 1024);
    if (filteredFiles.length !== selectedFile.length) {
      alert("Một số file bị loại bỏ do vượt quá 20MB!");
      return;
    }

    setFile((prevFiles = []) => [...prevFiles, ...filteredFiles]);
  };

  const handleRemoveFile = (index) => {
    setFile(file.filter((_, i) => i !== index));
  };

  const handleBack =useCallback(() => {
    router.push(`/content/ticket/`);
  }, [router]);

  const onSubmit = handleSubmit(async (data) => {
    const formDataEdit = new FormData();
    formDataEdit.append('nameTicket', data.nameTicket);
    formDataEdit.append('typeTicket', data.typeTicket._id);
    formDataEdit.append('description', data.description);
    formDataEdit.append('customer', data.customer._id);
    formDataEdit.append('employee', data.employee._id);
    formDataEdit.append('dateExpire', data.dateExpire);
    formDataEdit.append('timeNotify', data.timeNotify);
    formDataEdit.append('selected', selected);
    formDataEdit.append('status', data.status._id);
    formDataEdit.append('_id',id);
    if (file) {
      // formData.append("file", file); // Gửi file lên API
      for (let i = 0; i < file.length; i++) {
        formDataEdit.append('file', file[i]); // Phải cùng key với `upload.array("file")`
      }
    }
    sendFormEditKpi.mutate(
      formDataEdit,
      {
        onSuccess: (e) => {
          if (e.data.metadata.status === 200) {
            queryClient.refetchQueries({ queryKey: ['ticket'] });
            setShowAlert(true);
            reset(defaultValues);
            onClickToggle();
            setFile(null);
          } else {
            setShowAlert(false);
          }
        },
      }
    );
  })

  useEffect(() => {
    if (typeTicketList.length) {
      const valueTypeTickets = options.find((option) =>
        listTicket.type_ticket?.includes(option._id)
      );
      setValue('typeTicket', valueTypeTickets);
    }
    if (usersList.length) {
      const valueEmployee = usersList.find((option) => listTicket.employee?.includes(option._id));
      const valueCustomer = listCustomer.find((option) => listTicket.customer?.includes(option._id));
      const valueStatus = listStaus.find((option) => listTicket.status?.includes(option._id));
      setValue('employee', valueEmployee);
      setValue('customer', valueCustomer);
      setValue('status', valueStatus);
    }
    setValue('nameTicket', listTicket.name);
    setValue('description', listTicket.description);
    setValue('timeNotify', listTicket.time_notify);
    setValue('dateExpire', dayjs(listTicket.date_expire));

    setSelected(listTicket.level);
  }, [listTicket, typeTicketList, setValue]);
  const styles = {pt:'25px',pl:'8px'}
  const configFormField = [
    {
      id: 'nameTicket',
      label: 'Tên phiếu ghi',
      type: FormField.TEXT_FIELD_REQUIRED,
      span: 1,
      sx:{width:'95%'},
    },
    {
      id: 'typeTicket',
      label: 'Phân loại',
      type: FormField.AUTOCOMPLETE_SPECIAL,
      span: 1,
      sx:{width:'100%'},
      data:options
    },
    {
      id: 'description',
      label: 'Mô tả',
      type: FormField.TEXT_FIELD_AREA,
      span: 2,
    },
    {
      id: 'customer',
      label: 'Khách hàng',
      type: FormField.AUTOCOMPLETE,
      span: 2,
      data:listCustomer,
      key:"full_name",
      value:"_id"
    },
    {
      id: 'employee',
      label: 'Giao cho',
      type: FormField.AUTOCOMPLETE,
      span: 2,
      data:usersList,
      key:"full_name",
      value:"_id"
    },
    {
      id: 'dateExpire',
      label: 'Ngày hết hạn',
      type: FormField.DATE_TIME_PICKER,
      span: 1,
      sx:{width:'95%'},
    },
    {
      id: 'timeNotify',
      label: 'Nhắc nhở trước',
      type: FormField.NUMBER,
      span: 1,
      sx:{width:'100%'},
    }
  ]
  const renderActions = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '0px',
          [`@media (min-width: 1600px)`]: {
            marginTop: '100px', // Khi màn hình lớn hơn 15.6 inch (1366px)
          },
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
    </Box>
  );

  const renderDetails = (
    <>
      <Button
        sx={{ fontWeight: 'bold',mb:"15px"}}
        onClick={() => handleBack()}
      >
        <Icon
          name={ICON_NAME.arrowLeft}
          sx={{
            display: 'flex',
            alignItems: 'center',
            mr: 2,
            width: '8px',
          }}
        />
        Quay lại
      </Button>
      <Box sx={{ display: 'flex' }}>
        <Box
          sx={{
            width: '59%',
            borderRadius: '20px',
            backgroundColor: '#FFFFFF',
            boxShadow: 3,
            mr: '40px',
          }}
        >
          <List sx={{ padding: '25px' }}>
            <Box display='flex' sx={{width:"100%"}}>
              <Typography sx={{ marginBottom: '25px' }} variant="h6">
                Thông tin phiếu ghi
              </Typography>
              <Box sx={{ ml: "auto" }}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Autocomplete
                      {...field}
                      disablePortal
                      options={listStaus}
                      getOptionLabel={(option) => option.label}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      onChange={(event, newValue) => field.onChange(newValue)}
                      value={field.value || null}
                      sx={{
                        minWidth: '160px',
                        '& label': {
                          transform: 'translate(14px, 8px) scale(1)',
                        },
                        '&.Mui-focused label, &.MuiAutocomplete-hasClearIcon label': {
                          transform: 'translate(14px, -9px) scale(0.75)',
                        },
                        '& .MuiInputBase-root': {
                          padding: '1px 39px 1px 5px !important',
                          flexWrap: 'nowrap',
                        },
                        '& .MuiOutlinedInput-root': {
                          color: field.value
                            ? field.value._id.toLowerCase() === 'process'
                              ? 'orange'
                              : field.value._id.toLowerCase() === 'success'
                                ? 'blue'
                                : field.value._id.toLowerCase() === 'expired'
                                  ? 'red'
                                  : 'green'
                            : 'green',
                        },
                      }}
                      renderInput={(params) => (
                        <TextField {...params} error={!!fieldState.error} helperText={fieldState.error?.message} />
                      )}
                    />
                  )}
                />
              </Box>
            </Box>

            <Box
              sx={{
                borderBottom: '1px dashed #ccc',
                width: 'calc(100% + 50px)',
                margin: '0 -26px 20px',
              }}
            />
            <Box display="flex" sx={{ marginBottom: '25px',ml:"10px" }} >
              <RadioGroup
                row
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                sx={{ gap: '10px' }}
              >
                {priorityOptions.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={
                      <Radio
                        sx={{
                          display: 'none',
                        }}
                      />
                    }
                    label={
                      <Box
                        sx={{
                          backgroundColor: selected === option.value ? option.bgColor : 'white',
                          color: selected === option.value ? option.textColor : 'black',
                          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
                          borderRadius: 1,
                          padding: '8px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Icon
                          name={option.iconName}
                          sx={{
                            width: '18px',
                            backgroundColor: option.iconBg,
                          }}
                        />
                        {option.label}
                      </Box>
                    }
                  />
                ))}
              </RadioGroup>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ width: '100%', mt: '-17px' }}>
              <InputView control={control} configFormField={configFormField} styles={styles} setOpenClassify={setOpenClassify} />
            </Box>
            <Box sx={{ width: "100%", marginTop: "25px", display: "flex", alignItems: "center" }}>
              <UploadButton component="label" sx={{ display: "flex", alignItems: "center" }}>
                <Icon
                  name={ICON_NAME.upload}
                  sx={{ display: "flex", alignItems: "center", mr: 1, width: "18px" }}
                />
                Dung lượng file tối đa 20MB
                <input type="file" multiple hidden onChange={handleFileChange} />
              </UploadButton>
              {file?.slice(0, 2).map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "16px",
                    padding: "5px 10px",
                    width: "fit-content",
                    ml: "10px",
                  }}
                >
                  <Typography sx={{ fontSize: "14px", fontWeight: "bold", mr: 1 }}>
                    {item.name}
                  </Typography>
                  <IconButton
                    onClick={() => handleRemoveFile(index)}
                    sx={{
                      backgroundColor: "#c8c8c8",
                      fontSize: "10px",
                      width: "30px",
                      height: "30px",
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              ))}

              {/* Hiển thị nếu có nhiều hơn 2 file */}
              {file?.length > 2 && (
                <Typography sx={{ ml: "10px", fontSize: "14px", fontWeight: "bold" }}>
                  +{file.length - 2} file nữa
                </Typography>
              )}
            </Box>
            {renderActions}
          </List>
        </Box>
        <Box sx={{ width: '40%', borderRadius: '20px', backgroundColor: '#FFFFFF', boxShadow: 3 }}>
          <Typography sx={{ padding: '25px' }} variant="h6">
            Chi tiết khách hàng
          </Typography>
          <Collapse in={collapse.value}>
            <Stack spacing={2}>
              <Box
                sx={{ maxWidth: { md: '100%', xs: '100%' }, '& .MuiTabs-root': { borderRadius: 0 } }}
              >
                <CustomTabs
                  value={tabs.value}
                  onChange={tabs.onChange}
                  variant="fullWidth"
                  slotProps={{ tab: { borderRadius: '10px' } }}
                >
                  {tabsList.map((tab) => (
                    <Tab key={tab.value} value={tab.value} label={tab.label} />
                  ))}
                </CustomTabs>
              </Box>
              {tabs.value === 'info' && (
                <Box sx={{ pl: '25px', pt: '12px', pr: '25px', minHeight: 50 }}>
                  <RHFTextField
                    name="nameCustomer"
                    sx={{ width: '100%' }}
                    label={<span>Họ tên</span>}
                  />
                  <RHFTextField
                    name="phoneCustomer"
                    sx={{ width: '100%', mt: '25px' }}
                    label={<span>Số điện thoại</span>}
                  />
                  <RHFTextField
                    name="manager"
                    sx={{ width: '100%', mt: '25px' }}
                    label={<span>Người phụ trách</span>}
                  />
                  <RHFTextField
                    name="address"
                    sx={{ width: '100%', mt: '25px' }}
                    label={<span>Địa chỉ</span>}
                  />
                  <RHFTextField
                    name="c_nguon"
                    sx={{ width: '100%', mt: '25px' }}
                    label={<span>Nguồn</span>}
                  />
                </Box>
              )}

              {tabs.value === 'chat' && <Box sx={{ p: 2, minHeight: 50 }}>456</Box>}
            </Stack>
          </Collapse>
        </Box>
        <AddClassify open={openClassify} onClose={() => setOpenClassify(false)} />
      </Box>
      <CustomSnackbar
        open={showAlert}
        onClose={() => setShowAlert(false)}
        message="Thêm mới phân loại phiếu ghi thành công!"
        severity="success"
      />
    </>
  );
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{renderDetails}</form>
    </FormProvider>
  );
}
EditTickets.propTypes = {
  onClickToggle: PropTypes.func,
  open: PropTypes.bool,
};
