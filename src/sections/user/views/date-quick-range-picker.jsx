import * as React from 'react';
import { Box, TextField, Typography, Button } from '@mui/material';
import dayjs from 'dayjs';
import moment from 'moment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { subDays, startOfWeek, startOfMonth, subWeeks, subMonths } from 'date-fns';
import { useEffect, useState } from 'react';
import 'dayjs/locale/vi';
import { useBoolean } from '../../../hooks/use-boolean';

const quickSelectOptions = [
  { label: 'Hôm nay', action: () => new Date(), key: 'today' },
  { label: 'Hôm qua', action: () => subDays(new Date(), 1), key: 'yesterday' },
  { label: 'Tuần này', action: () => startOfWeek(new Date()), key: 'thisWeek' },
  { label: 'Tuần trước', action: () => startOfWeek(subWeeks(new Date(), 1)), key: 'lastWeek' },
  { label: 'Tháng này', action: () => startOfMonth(new Date()), key: 'thisMonth' },
  { label: 'Tháng trước', action: () => startOfMonth(subMonths(new Date(), 1)), key: 'lastMonth' },
];
export function DateQuickRangePicker({date, setDate}) {
  const open = useBoolean();
  const [dateRange, setDateRange] = useState(moment(date.startDate.$d).format("HH:mm DD/MM/YYYY") + '   -   ' + moment(date.endDate.$d).format("HH:mm DD/MM/YYYY"));
  const [openStartDate, setOpenStartDate] = React.useState(false);
  const [openEndDate, setOpenEndDate] = React.useState(false);
  const maxDateTimeStartDay = dayjs();
  const minDateTimeEndDay = date.startDate;
  const maxDateTimeEndDay = dayjs();
  const handleClickStartDate = () => {
    setOpenStartDate(true);
  };
  const handleCloseStartDate = () => {
    setOpenStartDate(false);
  };
  const handleClickEndDate = () => {
    setOpenEndDate(true);
  };
  const handleCloseEndDate = () => {
    setOpenEndDate(false);
  };
  useEffect(() => {
    setDateRange( moment(date.startDate.$d).format("HH:mm DD/MM/YYYY") + '   -   ' + moment(date.endDate.$d).format("HH:mm DD/MM/YYYY"));
  }, [date.startDate, date.endDate]);

  const handleQuickSelect = (option) => {
    let selectedDate;
    switch (option.key) {
      case 'today':
        selectedDate = option.action();
        setDate({
          startDate: dayjs().startOf('day'),
          endDate: dayjs().endOf('day')
        })
        break;
      case 'yesterday':
        selectedDate = option.action();
        setDate({
          startDate: dayjs().subtract(1, 'day').startOf('day'),
          endDate: dayjs().subtract(1, 'day').endOf('day')
        })
        break;
      case 'thisWeek':
        selectedDate = option.action();
        setDate({
          startDate: dayjs().startOf('week'),
          endDate: dayjs().endOf('week')
        })
        break;
      case 'lastWeek':
        selectedDate = option.action();
        setDate({
          startDate: dayjs().subtract(1, 'week').startOf('week'),
          endDate: dayjs().subtract(1, 'week').endOf('week')
        })
        break;
      case 'thisMonth':
        selectedDate = option.action();
        setDate({
          startDate: dayjs().startOf('month'),
          endDate: dayjs().endOf('month')
        })
        break;
      case 'lastMonth':
        selectedDate = option.action();
        setDate({
          startDate: dayjs().subtract(1, 'month').startOf('month'),
          endDate: dayjs().subtract(1, 'month').endOf('month')
        })
        break;
      default:
        console.log('Lựa chọn không hợp lệ');
        break;
    }
  }


  const handleOnChangeDate = (value, key) => {
    setDate(pre=> ({...pre, [key]: value}))
  }

  return (
    <Box sx={{position: "relative"}}>
      <TextField
          value={dateRange}
          onClick={open.onToggle}
          sx={{
            width: "17%",
          }} />
      {open.value  &&
        <Box sx={{position:  "absolute", top: 60, left: 0, zIndex: "99", borderRadius:"10px", p:1, background: (theme) => theme.vars.palette.grey[200]}}>
          <Box sx={{p:1}}>
            <Typography>Khoảng thời gian</Typography>
          </Box>
          <Box sx={{p:1}}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{display: "flex", alignItems: "center", border: (theme) => `1px solid ${theme.vars.palette.grey[500]}`, width: 302, borderRadius: "10px"}}>
                <Box onClick={handleClickStartDate} sx={{
                  width: 150,
                  background: openStartDate ? (theme) => theme.vars.palette.grey[300] : 'transparent',
                  borderRadius: '10px 0 0 10px',
                }}>
                  <DateTimePicker
                    sx={{
                      "& .MuiInputAdornment-root.MuiInputAdornment-positionEnd": {
                        display:"none"
                      },
                      "& fieldset": {
                        display:"none"
                      },
                      "& input" : {
                        textAlign: "center",
                      },
                      alignItems: "center",
                      "& .css-1w1m4cp-MuiInputBase-root-MuiOutlinedInput-root":{
                        padding: 0,
                      },
                      "& .css-ollqk8-MuiInputBase-input-MuiOutlinedInput-input":{
                        paddingLeft: 0
                      },
                      "& .css-1u7d6x9-MuiPaper-root-MuiPickersPopper-paper": {
                        margin:"10px"
                      }
                    }}
                    value={date.startDate}
                    format="HH:mm DD/MM/YYYY"
                    onChange={(newValue) => handleOnChangeDate(newValue, "startDate")}
                    // onChange={ handleOnChangeDate}
                    open={openStartDate}
                    onOpen={handleClickStartDate}
                    onClose={handleCloseStartDate}
                    // onAccept={handleDateAcceptStartDate}
                    maxDateTime={maxDateTimeStartDay}
                    monthsPerRow={3}
                  />
                </Box>
                <Box sx={{
                  width: 10,
                  height: "1.8px",
                  display: "flex",
                  alignItems: "center" ,
                  backgroundColor: (theme) => theme.vars.palette.grey[500],
                }}
                />
                <Box onClick={handleClickEndDate} sx={{
                  width: 150,
                  background: openEndDate ? (theme) => theme.vars.palette.grey[300] : 'transparent',
                  borderRadius: '0 10px 10px 0',
                }}>
                  <DateTimePicker
                    sx={{
                      "& .MuiInputAdornment-root.MuiInputAdornment-positionEnd": {
                        display:"none"
                      },
                      "& fieldset": {
                        display:"none"
                      },
                      "& input" : {
                        textAlign: "center",
                      },
                      alignItems: "center",
                      "& .css-1w1m4cp-MuiInputBase-root-MuiOutlinedInput-root":{
                        padding: 0,
                      },
                      "& .css-ollqk8-MuiInputBase-input-MuiOutlinedInput-input":{
                        paddingLeft: 0
                      },



                    }}
                    value={date.endDate}
                    format="HH:mm DD/MM/YYYY"
                    onChange={(newValue) => handleOnChangeDate(newValue, "endDate")}
                    open={openEndDate}
                    // onOpen={handleClickEndDate}
                    // onClose={handleCloseEndDate}
                    minDateTime={minDateTimeEndDay} // Vô hiệu hóa các ngày trước ngày hiện tại
                    maxDateTime={maxDateTimeEndDay} // Cho phép chọn tối đa đến 7 ngày sau
                  />
                </Box>
              </Box>
            </LocalizationProvider>
          </Box>
          <Box sx={{p:1,display: 'flex', gap: '10px', marginTop: '10px'}}>
            {quickSelectOptions.map((option, index) => (
              <Button
                key={index}
                variant="contained"
                onClick={() => handleQuickSelect(option)}
                sx={{
                  background:(theme) => theme.vars.palette.grey[400],
                  color: (theme) => theme.vars.palette.common.black,
                  fontWeight: 500,
                  '&:hover': {
                    background:(theme) => theme.vars.palette.grey[500],
                    color: (theme) => theme.vars.palette.common.white,
                    fontWeight: 500,
                  },

                }}
              >
                {option.label}
              </Button>
            ))}
          </Box>
        </Box>
      }
    </Box>


  );
}






