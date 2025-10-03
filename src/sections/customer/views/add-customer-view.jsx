import * as Yup from 'yup';
import * as React from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Drawer from '@mui/material/Drawer';
import {Grid, Button, Typography} from '@mui/material';

import COLORS from '../../../theme/core/colors.json';
import {RHFTextField} from "../../../components/hook-form/index";

// Region code example generate form input -----------------------
const FormField = {
  TEXT_FIELD: 'text_field',
  TEXT_FIELD_REQUIRED: 'text_field_required',
  DATE_TIME_PICKER: 'date_time_picker',
  SELECT: 'select'
}

const configFormField = [
  {
    id: 'fullName',
    label: 'Họ tên',
    type: FormField.TEXT_FIELD_REQUIRED,
    span: 2
  },
  {
    id: 'phoneNumber',
    label: 'Số điện thoại',
    type: FormField.TEXT_FIELD_REQUIRED,
    span: 1
  },
  {
    id: 'email',
    label: 'email',
    type: FormField.TEXT_FIELD,
    span: 1
  },
  {
    id: 'manager',
    label: 'Người quản lý',
    type: FormField.TEXT_FIELD,
    span: 2
  },
]

// eslint-disable-next-line no-extend-native,func-names
String.prototype.generateComponentUI = function(id, label) {
  switch (this) {
    case FormField.TEXT_FIELD_REQUIRED:
    case FormField.TEXT_FIELD:
      return(
        <RHFTextField
          name={id}
          label={
            <span>
              { label } {this === FormField.TEXT_FIELD_REQUIRED ? <span style={{ color: 'red' }}>*</span> : null}
            </span>
          }
        />
      )
    case FormField.SELECT:
      return (
        <></>
      )
    default:
      return (
        <></>
      )
  }
}
//----------------------------------------------------------------

export function AddCustomerView({ open, toggleDrawer }) {
  const defaultValues = {};
  const objectSchemaCustomer = Yup.object().shape({
    fullName: Yup.string().nonNullable().required('Vui lòng điền họ tên'),
    phoneNumber: Yup.string().nonNullable().required('Vui lòng điền số điện thoại'),
    manager: Yup.object().nonNullable().required('Vui lòng chọn người quản lý'),
  });
  const methods = useForm({ resolver: yupResolver(objectSchemaCustomer), defaultValues });

  const addCustomer = () => {
    // TODO Core Here
  };

  const contentAddCustomerForm = (
    <Box
      sx={{
        width: '650px',
        borderRadius: '20px',
        backgroundColor: 'white',
      }}
    >
      <List sx={{ padding: '24px', pb: '60px' }}>
        <Typography sx={{ marginBottom: '24px' }} variant="h6">
          Thêm mới khách hàng
        </Typography>
        <Box
          sx={{
            borderBottom: '1px dashed #ccc',
            width: 'calc(100% + 60px)',
            margin: '0 -30px 20px',
          }}
        />
        {/* TODO Add Child Components */}
        <Box sx={{ flexGrow: 1, p: '8px' }}>
          <Grid container spacing={2} columns={2}>
            {configFormField.map((item) => (
              <Grid key={item.id} xs={item.span} sx={{ p: '4px' }}>
                {item.type.generateComponentUI(item.id, item.label)}
              </Grid>
            ))}
          </Grid>
        </Box>
      </List>
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
      onClose={toggleDrawer}
    >
      <FormProvider {...methods}>
        <form>{contentAddCustomerForm}</form>
      </FormProvider>

      <Box
        sx={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          display: 'flex',
          gap: '10px',
        }}
      >
        <Button
          variant="contained"
          sx={{ backgroundColor: COLORS.error.main }}
          onClick={toggleDrawer}
        >
          Đóng
        </Button>
        <Button type="submit" variant="contained" sx={{ backgroundColor: COLORS.primary.main }}>
          Lưu lại
        </Button>
      </Box>
    </Drawer>
  );
}
