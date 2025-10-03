import * as React from 'react';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro/DateTimeRangePicker';




export default function DateTimeRangePickerNoLicense({localeTextStart, localeTextEnd}) {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        // Use XPath to find the div containing the specific text
        const xpath = "//div[contains(text(), 'MUI X Missing license key')]";
        const result = document.evaluate(
          xpath,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        );

        // Remove the element if it exists
        if (result.singleNodeValue) {
          result.singleNodeValue.remove();
        }
      }, 500);
    }
  }, [open]);
  const handleOpen = (event) => {
    setOpen(true); // Manually trigger picker opening
    if (event.target) {
      console.log(`Clicked on: ${event.target}`);
    }
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DateTimeRangePicker']}>
          <DateTimeRangePicker
            localeText={{ start: localeTextStart, end: localeTextEnd,  }}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            slotProps={{
              textField: ({ position }) => ({
                onClick: handleOpen, // Capture click and open picker
                ariaLabel: position === 'start' ? 'Check-in' : 'Check-out',
              }),
            }}
          />
        </DemoContainer>
      </LocalizationProvider>


    </>

  );
}
