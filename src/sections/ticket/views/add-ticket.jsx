import 'dayjs/locale/vi';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import * as React from 'react';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRef, useMemo, useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import Drawer from '@mui/material/Drawer';
import RadioGroup from '@mui/material/RadioGroup';
import { styled, useTheme } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Button, Typography } from '@mui/material';

import { TicketApi } from 'src/apis/ticket-api';

import { Icon, ICON_NAME } from 'src/components/svg-color';
import CustomSnackbar from 'src/components/snackbar/custom-snackbar';

import AddClassify from './add-classify';
import { FormField, InputView } from '../../../utils/render-input';
import IconButton from '@mui/material/IconButton';
import { CloseIcon } from 'yet-another-react-lightbox';

export default function AddTickets({ onClickToggle, open }) {
  dayjs.locale('vi');
  const theme = useTheme();
  const [selected, setSelected] = useState('medium');
  const fileInputRef = useRef(null);
  const [openClassify, setOpenClassify] = useState(false);
  const [file, setFile] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertFile, setShowAlertFile] = useState(false);
  const queryClient = useQueryClient();
  const listCustomer = [
    {
      value: '12',
      label: 'Hải Phong',
    },
  ];

  const priorityOptions = [
    {
      value: 'medium',
      label: 'Bình thường',
      bgColor: theme.vars.palette.warning[300],
      textColor: theme.vars.palette.warning[200],
      iconBg: theme.vars.palette.warning[200],
      iconName: ICON_NAME.ticketMedium,
    },
    {
      value: 'hight',
      label: 'Cao',
      bgColor: theme.vars.palette.error[300],
      textColor: 'red',
      iconBg: theme.vars.palette.error[200],
      iconName: ICON_NAME.ticketHigh,
    },
    {
      value: 'low',
      label: 'Thấp',
      bgColor: theme.vars.palette.info[300],
      textColor: 'green',
      iconBg: theme.vars.palette.info[200],
      iconName: ICON_NAME.ticketLow,
    },
  ];


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

  const options = [{ name: 'Thêm mới', _id: 'addClassify' }, ...typeTicketList];

  const usersQuery = useQuery({
    queryKey: ['get-users'],
    queryFn: () => TicketApi.getAllUsers(),
    keepPreviousData: true,
    enabled: open,
  });

  const usersList = useMemo(() => usersQuery.data?.data?.metadata?.data || [], [usersQuery.data]);

  const renderActions = (
      <Box
        sx={{
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
        <Button type="submit" variant="contained" color='primary'>
          Lưu lại
        </Button>
      </Box>
  );

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

  const formAdd = Yup.object().shape({
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
    resolver: yupResolver(formAdd),
    defaultValues,
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = methods;
  const sendFormAddKpi = useMutation({
    mutationFn: (body) => TicketApi.addTicket(body),
  });
  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append('nameTicket', data.nameTicket);
    formData.append('typeTicket', data.typeTicket._id);
    formData.append('description', data.description);
    formData.append('customer', data.customer.value);
    formData.append('employee', data.employee._id);
    formData.append('dateExpire', data.dateExpire);
    formData.append('timeNotify', data.timeNotify);
    formData.append('selected', selected);
    if (file) {
      // formData.append("file", file); // Gửi file lên API
      if (file.length >= 3) {
        setShowAlertFile(true);
        console.log("filefilefilefilefilefilefilefile",file);
        return;
      }
      for (let i = 0; i < file.length; i++) {
        formData.append('file', file[i]); // Phải cùng key với `upload.array("file")`
      }
    }
    // axios
    //   .post(`${CONFIG.serverUrl}/tickets/add-ticket`, formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //     },
    //   })
    //   .then((response) => {
    //     if (response.status === 200) {
    //       queryClient.refetchQueries({ queryKey: ['ticket'] });
    //       setShowAlert(true);
    //       reset(defaultValues);
    //       onClickToggle();
    //       setFile(null);
    //     } else {
    //       setShowAlert(false);
    //     }
    //   })
    //   .catch((error) => {
    //     console.error('Lỗi khi upload file:', error);
    //     setShowAlert(false);
    //   });
    sendFormAddKpi.mutate(
      formData,
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
  });
  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [defaultValues, open, reset]);


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
      key:"label",
      value:"value"
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
  const renderDetails = (
    <Box
      sx={{
        width: 650,
        borderRadius: '20px',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      {/* Nội dung chính có thể scroll */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto',overflowX: 'hidden', padding: '25px',
        "&::-webkit-scrollbar": {
          width: "5px",
        }, }}
      >
        <Typography sx={{ marginBottom: '25px' }} variant="h6">
          Thêm mới phiếu ghi
        </Typography>
        <Box
          sx={{
            borderBottom: '1px dashed #ccc',
            width: 'calc(100% + 60px)',
            margin: '0 -30px 20px',
          }}
        />
        <Box display="flex" sx={{ marginBottom: '25px', ml: '10px' }}>
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
                control={<Radio sx={{ display: 'none' }} />}
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
      </Box>
      {/* Giữ nút button cố định */}
      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          padding: '10px',
          backgroundColor:'#FFFFFF',
          overflowX:'hidden'
        }}
      >
        {renderActions}
      </Box>
    </Box>
  );
  return (
    <>
      <Drawer
        sx={{
          borderRadius: '10px',
          borderBottomLeftRadius: '10px',
          '& .MuiDrawer-paper': {
            borderRadius: '20px',
            marginRight: '10px',
            marginTop: '5px',
            height: '98.5%',
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
          <form onSubmit={methods.handleSubmit(onSubmit)}>{renderDetails}</form>
        </FormProvider>
      </Drawer>
      <AddClassify open={openClassify} onClose={() => setOpenClassify(false)} />
      <CustomSnackbar
        open={showAlert}
        onClose={() => setShowAlert(false)}
        message="Thêm mới phân loại phiếu ghi thành công!"
        severity="success"
      />
      <CustomSnackbar
        open={showAlertFile}
        onClose={() => setShowAlertFile(false)}
        message="Cho phép tải tôối đa 3 file đính kèm"
        severity="error"
      />
    </>
  );
}
AddTickets.propTypes = {
  onClickToggle: PropTypes.func,
  open: PropTypes.bool,
};
