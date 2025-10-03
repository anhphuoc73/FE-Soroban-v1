import * as React from 'react';
import { Controller } from 'react-hook-form';

import { styled, useTheme } from '@mui/material/styles';
import { Grid, TextField, Autocomplete, Popper } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';

import {RHFTextField} from "../components/hook-form/index";
import { Icon,ICON_NAME } from '../components/svg-color/index';

export const FormField = {
  TEXT_FIELD: 'text_field',
  TEXT_FIELD_REQUIRED: 'text_field_required',
  TEXT_FIELD_AREA: 'text_field_area',
  DATE_TIME_PICKER: 'date_time_picker',
  AUTOCOMPLETE: 'AUTOCOMPLETE',
  AUTOCOMPLETE_SPECIAL: 'AUTOCOMPLETE_SPECIAL',
  NUMBER: 'NUMBER',
}
const customPopper = styled(Popper)({
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Điều chỉnh shadow theo ý muốn
  borderRadius: "8px",
  backgroundColor: "#fff",
});
// eslint-disable-next-line no-extend-native,func-names
String.prototype.generateComponentUI = function(id, label,key,value,control,data,sx,setOpenClassify,theme) {
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
          sx={sx}
        />
      )
      case FormField.TEXT_FIELD_AREA:
      return(
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField {...field} fullWidth multiline rows={4}
               label={`Mô tả (${field.value?.length || 0}/500 kí tự)`}
               onChange={(e) => {
                 if (e.target.value.length <= 500) {
                   field.onChange(e); // Chỉ cập nhật nếu chưa đạt 500 ký tự
                 }
               }}
            />
          )}
        />
      )
    case FormField.AUTOCOMPLETE:
      return (
        <Controller
          name={id}
          control={control}
          render={({ field, fieldState }) => (
            <Autocomplete
              {...field}
              disablePortal
              options={data}
              getOptionLabel={(option) =>
                option.email ? `${option[key]} - ${option.email}` : `${option[key]}`
              }
              isOptionEqualToValue={(option, item) => !item || option[value] === item[value]}
              sx={sx}
              onChange={(event, newValue) => field.onChange(newValue)}
              PopperComponent={customPopper}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={
                    <span>
                        {label} <span style={{ color: 'red' }}>*</span>
                      </span>
                  }
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          )}
        />
      )
    case FormField.NUMBER:
      return (
        <RHFTextField
          name={id}
          type="tel"
          label={
            <span>
              {label} <span style={{ color: 'red' }}>*</span>
            </span>
          }
          InputProps={{
            endAdornment: (
              <span style={{ display: 'flex', alignItems: 'center', marginLeft: 4 }}>
                <span style={{ fontSize: '1.9em' }}>{'<'}</span>
                <span style={{ margin: '0 4px', fontSize: '0.9em' }}>Phút</span>
                <span style={{ fontSize: '1.9em' }}>{'>'}</span>
              </span>
            ),
            inputProps: {
              inputMode: 'numeric',
              pattern: '[0-9]*',
              onKeyPress: (event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              },
            },
          }}
        />
      );
    case FormField.AUTOCOMPLETE_SPECIAL:
      return (
        <Controller
          name={id}
          control={control}
          render={({ field, fieldState }) => (
            <Autocomplete
              {...field}
              disablePortal
              options={data}
              getOptionLabel={(option) => option.name || ''}
              isOptionEqualToValue={(option, item) => option._id === item._id}
              value={data.find((opt) => opt._id === field.value?._id) || null}
              PopperComponent={customPopper}
              ListboxProps={{
                style: {
                  maxHeight: '200px',
                  overflowY: 'auto',
                },
              }}
              renderOption={(props, option) => (
                <li
                  {...props}
                  key={option._id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    color:
                      option._id === 'addClassify' ? theme.vars.palette.primary.main : 'inherit',
                  }}
                >
                  {option.name}
                  {option._id === 'addClassify' && (
                    <Icon
                      name={ICON_NAME.add}
                      sx={{ display: 'flex', alignItems: 'center', width: '15px', ml: 8 }}
                    />
                  )}
                </li>
              )}
              onChange={(event, newValue) => {
                if (newValue?._id === 'addClassify') {
                  setOpenClassify(true);
                } else {
                  field.onChange(newValue);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={
                    <span>
                      Phân loại <span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          )}
        />
      );
    case FormField.DATE_TIME_PICKER:
      return (
        <Controller
          name={id}
          control={control}
          rules={{ required: 'Ngày hết hạn là bắt buộc' }}
          render={({ field, fieldState }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
              <MobileDateTimePicker
                {...field}
                sx={sx}
                label={
                  <span>
                    {label} <span style={{ color: 'red' }}>*</span>
                  </span>
                }
                onChange={(date) => field.onChange(date)}
                slotProps={{
                  textField: {
                    error: !!fieldState.error,
                    helperText: fieldState.error?.message,
                  },
                }}
              />
            </LocalizationProvider>
          )}
        />
      )
    default:
      return (
        <></>
      )
  }
}
//----------------------------------------------------------------

export function InputView({ open, toggleDrawer,control,configFormField,styles,setOpenClassify  }) {
  const theme = useTheme();
  return (
    <Grid container spacing={1} columns={2}>
      {configFormField.map((i) => (
        <Grid key={i.id} xs={i.span} sx={styles}>
          {i.type.generateComponentUI(i.id, i.label,i.key,i.value,control,i.data,i.sx,setOpenClassify,theme)}
        </Grid>
      ))}
    </Grid>
  );
}
