/* eslint-disable import/order */
import { useTabs } from 'src/hooks/use-tabs';
// eslint-disable-next-line perfectionist/sort-imports
import { MainContainer } from "../../layouts/content-page/index";
import { Tab, Box } from "@mui/material";
import Tabs from '@mui/material/Tabs';
import { Icon, ICON_NAME } from 'src/components/svg-color/index';
import { SorobanPracticeView } from './views/soroban-math-practice';
import { SorobanSettingView } from './views/soroban-math-setting';




// const TABS = [
//   { value: 'practice', label: 'Luyện tập', icon: <Icon name={ICON_NAME.report} sx={{ display: 'flex', alignItems: 'center', mr: 1, width: '18px' }} /> },
//   { value: 'setting', label: 'Thiết lập tham số', icon: <Icon name={ICON_NAME.chat} sx={{ display: 'flex', alignItems: 'center', mr: 1, width: '18px' }} /> },
// ];
const TABS = [
  { 
    value: 'practice', 
    label: 'Luyện tập', 
    icon: <Icon name={ICON_NAME.report} sx={{ display: 'flex', alignItems: 'center', mr: 1, width: '18px' }} /> 
  },
  { 
    value: 'setting', 
    label: 'Thiết lập tham số', 
    icon: <Icon name={ICON_NAME.chat} sx={{ display: 'flex', alignItems: 'center', mr: 1, width: '18px' }} /> 
  },
];

export function SorobanView() {
  const tabs = useTabs('practice');
  const renderTabContent = () => {
    switch (tabs.value) {
      case 'practice':
        return <SorobanPracticeView />;
      case 'setting':
        return <SorobanSettingView />;
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
