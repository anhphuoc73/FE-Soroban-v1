import { useTabs } from 'src/hooks/use-tabs';
import { Grid, Tab, Box, Card } from "@mui/material";
import Tabs from '@mui/material/Tabs';
import { Iconify } from 'src/components/iconify';
import { Icon, ICON_NAME } from 'src/components/svg-color/index';
import { MainContainer } from 'src/layouts/content-page';
import { UserListView } from "./views/user-list";
import { UserAddView } from './views/user-add';


import { getProfileFromLS } from '../../utils/auth';


// const TABS = [
//   { value: 'list', label: 'Danh sách tài khoản', icon: <Icon name={ICON_NAME.report} sx={{ display: 'flex', alignItems: 'center', mr: 1, width: '18px' }} /> },
//   { value: 'add', label: 'Thêm tài khoản', icon: <Icon name={ICON_NAME.chat} sx={{ display: 'flex', alignItems: 'center', mr: 1, width: '18px' }} /> },
// ];
export function UserView() {
  const tabs = useTabs('list');

  const profile = getProfileFromLS();
  const TABS = [
    { 
        value: 'list', 
        label: 'Danh sách tài khoản', 
        icon: (
          <Icon 
            name={ICON_NAME.report} 
            sx={{ display: 'flex', alignItems: 'center', mr: 1, width: '18px' }} 
          />
        ) 
    },
    ...(profile?.position === 2 
      ? [{
          value: 'add',
          label: 'Thêm tài khoản',
          icon: (
            <Icon 
              name={ICON_NAME.chat} 
              sx={{ display: 'flex', alignItems: 'center', mr: 1, width: '18px' }} 
            />
          )
        }]
      : [])
  ];
 
  const renderTabContent = () => {
    switch (tabs.value) {
      case 'list':
        return <UserListView />;
      case 'add':
        return <UserAddView />;
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
