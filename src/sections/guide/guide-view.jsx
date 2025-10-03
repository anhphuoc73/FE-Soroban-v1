import { useTabs } from 'src/hooks/use-tabs';
import { MainContainer } from "../../layouts/content-page/index";
import { Grid, Tab, Box, Card } from "@mui/material";
import Tabs from '@mui/material/Tabs';
import { Iconify } from 'src/components/iconify';
import { Icon, ICON_NAME } from 'src/components/svg-color/index';

import { ReportCallView } from "./views/report-call-view";
import { ReportChatView } from "./views/report-chat-view";
import { ReportTicketView } from "./views/report-ticket-view";
import { ReportOttView } from "./views/report-ott-view";

// const TABS = [
//   { value: 'call', label: 'Cuộc gọi' },
//   { value: 'chat', label: 'Tin nhắn' },
//   { value: 'ticket', label: 'Phiếu ghi' },
//   { value: 'ott', label: 'SMS/ZNS' },
// ];

const TABS = [
  { value: 'call', label: 'Cuộc gọi', icon: <Icon name={ICON_NAME.report} sx={{ display: 'flex', alignItems: 'center', mr: 1, width: '18px' }} /> },
  { value: 'chat', label: 'Trò chuyện', icon: <Icon name={ICON_NAME.chat} sx={{ display: 'flex', alignItems: 'center', mr: 1, width: '18px' }} /> },
  { value: 'ticket', label: 'Phiếu ghi', icon: <Icon name={ICON_NAME.ticket} sx={{ display: 'flex', alignItems: 'center', mr: 1, width: '18px' }} /> },
  { value: 'ott', label: 'SMS/ZNS', icon: <Icon name={ICON_NAME.sms} sx={{ display: 'flex', alignItems: 'center', mr: 1, width: '18px' }} /> },

];
export function GuideView() {
  const tabs = useTabs('call');
  const renderTabContent = () => {
    switch (tabs.value) {
      case 'call':
        return <ReportCallView />;
      case 'chat':
        return <ReportChatView />;
      case 'ticket':
        return <ReportTicketView />;
      case 'ott':
        return <ReportOttView />;
      default:
        return null;
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent={{ xs: 'flex-start', md: 'flex-start' }}
        sx={{
          width: 1,
          bottom: 0,
          zIndex: 9,
          bgcolor: 'background.paper',
          paddingLeft:"40px",
          boxShadow: 3,
        }}
      >
        <Tabs value={tabs.value} onChange={tabs.onChange}>
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
          ))}
        </Tabs>
      </Box>
      <MainContainer maxWidth={false}  sx={{ display: 'flex', flex: '0 0 auto', flexDirection: 'column', paddingTop: "25px" }} >
        {renderTabContent()}
      </MainContainer>
    </Box>


  );
}
