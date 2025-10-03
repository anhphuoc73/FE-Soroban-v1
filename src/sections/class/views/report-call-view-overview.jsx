import React, { useState } from 'react';
import  {Grid, Box, FormControl, InputLabel, Select, MenuItem, TextField   } from '@mui/material'
import { CharOverviewDispositionCallView, CharOverviewTypeCallView } from './char-overview-call-view';
import DateTimeRangePickerNoLicense from '../../../components/date-range-picker-no-license';


import dayjs from 'dayjs';
import { DateQuickRangePicker } from '../../../components/date-range-picker/date-quick-range-picker';

export function ReportCalViewOverview(){
  const [age, setAge] = useState('');
  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const [date, setDate] = useState({
    startDate: dayjs().startOf('day'),
    endDate: dayjs().endOf('day')
  })
  return(
    <>
      <Box>
        <DateQuickRangePicker date={date} setDate={setDate} />
      </Box>


      {/* <Box sx={{ display: 'flex', justifyContent: 'center' }}> */}
      {/*   <Box sx={{ width: { xs: '100%', sm: '100%', md: '80%' } }}> */}
      {/*     <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', spacing: 2 }}> */}
      {/*       <Box sx={{ flex: 1, maxWidth: { xs: '100%', sm: '100%', md: '33.33%' } }}> */}
      {/*         <Box> */}
      {/*           <DateTimeRangePickerNoLicense localeTextStart="" localeTextEnd=""/> */}
      {/*         </Box> */}
      {/*       </Box> */}
      {/*     </Box> */}
      {/*   </Box> */}
      {/* </Box> */}

      <Grid container spacing={2} sx={{ mb: 2, marginTop: 3 }} >
        <Grid item xs={12} sm={12} md={12}>
          <CharOverviewDispositionCallView
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
              ],

              series: [
                {
                  name: '2023',
                  data: [
                    {
                      name: 'Tổng cuộc gọi',
                      data: [51, 35, 37],
                    },
                    {
                      name: 'Trả lời',
                      data: [16, 23, 54],
                    },
                    {
                      name: 'Không trả lời',
                      data: [26, 53, 44],
                    },
                    {
                      name: 'Gọi nhỡ',
                      data: [36, 83, 34],
                    },
                    {
                      name: 'Máy bận',
                      data: [46, 93, 24],
                    },
                    {
                      name: 'Gọi lỗi',
                      data: [76, 23, 14],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={4}>
              <CharOverviewTypeCallView
                title="Gọi ra"
                percent={2.6}
                total={18765}
                chart={{
                  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'May', 'Jun', 'Jul', 'Aug'],
                  series: [15, 18, 12, 51, 68, 11, 39, 37, 12, 12, 12, 12],
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <CharOverviewTypeCallView
                title="Gọi vào"
                percent={2.6}
                total={18765}
                chart={{
                  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'May', 'Jun', 'Jul', 'Aug'],
                  series: [15, 18, 12, 51, 68, 11, 39, 37, 12, 12, 12, 12],
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <CharOverviewTypeCallView
                title="Gọi nội bộ"
                percent={2.6}
                total={18765}
                chart={{
                  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'May', 'Jun', 'Jul', 'Aug'],
                  series: [15, 18, 12, 51, 68, 11, 39, 37, 12, 12, 12, 12],
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
