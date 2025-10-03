import * as React from 'react';
import { useLocation } from 'react-router-dom';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import {useState} from "react";
import { useTabs } from '../../hooks/use-tabs';
import { navCustomer } from '../config-nav-customer';
import { useRouter } from '../../routes/hooks/index';
import { MainContainer } from '../content-page/index';
import { CustomTabs } from '../../components/custom-tabs/index';
import { Icon, ICON_NAME } from '../../components/svg-color/index';
import {AddCustomerView} from "../../sections/customer/views/add-customer-view";

export function CustomerLayout({ children }) {
  const router = useRouter();
  const location = useLocation();
  const tabs = useTabs(location.pathname);
  const [isOpen, toggleDrawer] = useState(false)

  const handleTabChange = (event, newValue) => {
    tabs.onChange(event, newValue);
    router.push(newValue);
  };

  const toggleDrawerAddContact = () => {
    console.log('ahihi')
    toggleDrawer((newValue) => !newValue)
  };

  const downloadContact = () => {
    // TODO Code Here
  };

  const uploadContact = () => {
    // TODO Code Here
  };

  return (
    <MainContainer maxWidth="100%">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Box sx={{ width: '20%' }}>
          <CustomTabs
            value={tabs.value}
            onChange={handleTabChange}
            variant="fullWidth"
            slotProps={{ tab: { px: 0 } }}
            sx={{
              borderRadius: '12px',
              '& .MuiButtonBase-root': {
                borderRadius: '12px',
                padding: '4px 4px',
              },
            }}
          >
            {navCustomer.map((tab) => (
              <Tab
                key={tab.id}
                value={tab.path}
                label={tab.title}
                sx={{
                  borderRadius: '12px',
                  '& .MuiButtonBase-root': {
                    borderRadius: '12px',
                    padding: '4px 4px',
                  },
                }}
              />
            ))}
          </CustomTabs>
        </Box>

        <Box>
          <Button
            color="primary"
            sx={{ height: '40px', mr: '8px' }}
            variant="contained"
            onClick={toggleDrawerAddContact}
          >
            <Icon
              name={ICON_NAME.add}
              sx={{ display: 'flex', alignItems: 'center', width: '16px', mr: '10px' }}
            />
            Thêm mới
          </Button>
          <Button
            color="primary"
            sx={{ height: '40px', mr: '8px' }}
            variant="contained"
            onClick={uploadContact}
          >
            <Icon
              name={ICON_NAME.upload}
              sx={{ display: 'flex', alignItems: 'center', width: '16px', mr: '10px' }}
            />
            Tải lên
          </Button>
          <Button
            color="primary"
            sx={{ height: '40px' }}
            variant="contained"
            onClick={downloadContact}
          >
            <Icon
              name={ICON_NAME.download}
              sx={{ display: 'flex', alignItems: 'center', width: '16px', mr: '10px' }}
            />
            Tải xuống
          </Button>
        </Box>
      </Box>

      {children}

      <AddCustomerView open={isOpen} toggleDrawer={toggleDrawerAddContact}/>
    </MainContainer>
  );
}
