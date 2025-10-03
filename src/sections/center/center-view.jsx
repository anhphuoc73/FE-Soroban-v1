import { useTabs } from 'src/hooks/use-tabs';
import { Grid, Tab, Box, Card } from "@mui/material";
import Tabs from '@mui/material/Tabs';
import { Iconify } from 'src/components/iconify';
import { Icon, ICON_NAME } from 'src/components/svg-color/index';
import { MainContainer } from 'src/layouts/content-page';
import { CenterListView } from "./views/center-list";
import { CenterAddView } from './views/center-add';


const TABS = [
  { value: 'list', label: 'Danh sách trung tâm', icon: <Icon name={ICON_NAME.report} sx={{ display: 'flex', alignItems: 'center', mr: 1, width: '18px' }} /> },
  { value: 'add', label: 'Thêm trung tâm', icon: <Icon name={ICON_NAME.chat} sx={{ display: 'flex', alignItems: 'center', mr: 1, width: '18px' }} /> },
];
export function CenterView() {
  const tabs = useTabs('list');
  const renderTabContent = () => {
    switch (tabs.value) {
      case 'list':
        return <CenterListView />;
      case 'add':
        return <CenterAddView />;
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
