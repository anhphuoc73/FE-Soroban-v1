import { useLocation } from 'react-router';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import { useRouter } from 'src/routes/hooks';

import { _account } from 'src/layouts/config-nav-account';

import { AccountDrawer } from 'src/components/account-drawer';

import { useTabs } from '../../hooks/use-tabs';
import { CustomTabsNav } from '../custom-tabs';
import COLORS from '../../theme/core/colors.json';

export default function NavDynamicIsland({ data }) {
  const router = useRouter();
  const location = useLocation();
  const tabs = useTabs(
    data[0].items.find(
      (item) =>
        location.pathname === item.path || location.pathname.split('content/')[1].includes(item.id)
    )
  );

  const handleTabChange = (event, newValue) => {
    tabs.onChange(event, newValue);
    router.push(newValue.path);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: COLORS.primary.main,
        borderRadius: '50px',
        padding: '8px',
        width: '100%',
        maxWidth: 'fit-content',
        margin: 'auto',
        position: 'relative',
        minHeight: '30px',
      }}
    >
      <CustomTabsNav
        sx={{ backgroundColor: 'transparent', borderRadius: '50px', height: '40px' }}
        variant="fullWidth"
        value={tabs.value}
        onChange={handleTabChange}
      >
        {data[0].items.map((tab) => (
          <Tab
            sx={{
              borderRadius: '50px',
              width: 'fit-content',
              whiteSpace: 'nowrap',
              color: 'white',
            }}
            key={tab.id}
            iconPosition="start"
            value={tab}
            label={tab.title}
            icon={tab.icon}
          />
        ))}
      </CustomTabsNav>

      <AccountDrawer sx={{ width: 46, height: 46, marginLeft: '32px' }} data={_account} />
    </Box>
  );
}
