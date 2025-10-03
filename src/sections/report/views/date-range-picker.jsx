import React, { useState } from 'react';
import { TextField, Box, Button, Popover } from '@mui/material';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

export function DateRangePicker() {
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Format date to "ngày-tháng-năm"
  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const quickSuggestion = [
    {id: "today",value:"Hôm nay"},
    {id: "yesterday",value:"Hôm qua"},
    {id: "thisweek",value:"Tuần này"},
    {id: "lastweek",value:"Tuần trước"},
    {id: "thismonth",value:"Tháng này"},
    {id: "lastmonth",value:"Tháng trước"},
  ];

  const test = () => {
    alert("Tôi test thử")
  }

  return (
        <Box sx={{pl: "20px", pr:"20px", position: 'relative' }} >
          <Box sx={{
              borderRadius: "10px",
              background: (theme)=> theme.vars.palette.common.white,
              position: 'absolute',
              top:55, zIndex: 99999,
              left: 0,
              boxShadow: (theme)=> theme.customShadows.z8  ,
              pl: "20px", pr:"20px",
            }}>
            <Box sx={{ zIndex: 99999,  }}>
              {open && (
               <>
                 <Box sx={{pt:"20px" }} onClick={test} sx={{cursor: 'pointer'}}>
                   <Box
                     sx={{
                       display: 'inline-flex',
                       alignItems: 'center',
                       justifyContent: 'space-between',
                       padding: '10px 20px',
                       borderRadius: '8px',
                       boxShadow: 1,
                       border: '1px solid #1976d2',
                       width: 1
                     }}
                   >
                     <TitleDataPicker title="00:00:00 18/02/2025" />
                     <Typography
                       variant="body1"
                       sx={{
                         margin: '0 10px',
                         display: 'flex',
                         alignItems: 'center',
                         fontWeight: 900,
                         fontSize: '1.2rem',
                       }}
                     >
                       &#8594;
                     </Typography>
                     <TitleDataPicker title="00:00:00 18/02/2025" />
                     <Button variant="outlined" sx={{ marginLeft: '10px' }}>
                       <span role="img" aria-label="calendar">🗓️</span> {/* Biểu tượng lịch */}
                     </Button>
                   </Box>
                 </Box>
                 <Box sx={{ py: 2 }}>
                   <Typography sx={{color: (theme)=> theme.vars.palette.grey[500]}}>
                     Gợi ý nhanh
                   </Typography>
                 </Box>
                 <Stack sx={{ mb: 2}} direction="row" spacing={1}>
                   <QuickSuggestion quickSuggestion={quickSuggestion} />
                 </Stack>
               </>
              )}
            </Box>
          < /Box>
        </Box>

  );
}


const TitleDataPicker = ({ title })=> (
  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', color: (theme) => theme.vars.palette.grey[500] }}>
    {title}
  </Typography>
)

const QuickSuggestion = (quickSuggestion) => {
  quickSuggestion.map((item) => (
    <Button key={item.id} sx={{ background: (theme) => theme.vars.palette.grey[300],whiteSpace: 'nowrap' }}>
      {item.value}
    </Button>
  ))
}




