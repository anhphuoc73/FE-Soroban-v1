import { useState } from 'react';
import { CustomTabs } from "../../../components/custom-tabs";
import { useTabs } from 'src/hooks/use-tabs';
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import { CharOverviewDispositionCallView, CharOverviewTypeCallView } from './char-overview-call-view';
import { ReportCalViewOverview } from './report-call-view-overview';
import { ReportCallViewHistory } from './report-call-view-history';
import { ReportCallViewStaff } from './report-call-view-staff';

const TABS = [
  { value: 'overview', label: 'Tổng quan' },
  { value: 'callhistory', label: 'Lịch sử cuộc gọi' },
  { value: 'listaccount', label: 'Nhân viên ' },
];

export function ReportCallView() {
  const tabs = useTabs('overview');
  const renderTabContent = () => {
    switch (tabs.value) {
      case 'overview':
        return <ReportCalViewOverview />;
      case 'callhistory':
        return <ReportCallViewHistory />;
      case 'listaccount':
        return <ReportCallViewStaff />;
      default:
        return null;
    }
  };
  return (
    <>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={12} md={3}>
          <CustomTabs
            value={tabs.value}
            onChange={tabs.onChange}
            variant="fullWidth"
            slotProps={{ tab: { px: 0 } }}
            sx={{
              backgroundColor: (theme) => theme.vars.palette.grey['300'],
              borderRadius: "10px",
              "& .MuiButtonBase-root" : {
                borderRadius: "10px",
                padding: "4px 4px"
              }
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                sx={{
                  backgroundColor: (theme) => tab.value === tabs.value ? theme.vars.palette.grey['100'] : theme.vars.palette.grey['300'],
                  marginRight: 0.5,
                  borderRadius: "10px",
                  "& .MuiButtonBase-root" : {
                    borderRadius: "10px",
                    padding: "4px 4px"
                  },
                  color: (theme) => theme.vars.palette.grey['700'],
                }}
              />
            ))}
          </CustomTabs>
        </Grid>
      </Grid>
      {/* <ReportCalViewOverview /> */}
      {/* <ReportCallViewHistory /> */}
      {/* <ReportCallViewStaff /> */}

      {renderTabContent()}

    </>
  );
}
