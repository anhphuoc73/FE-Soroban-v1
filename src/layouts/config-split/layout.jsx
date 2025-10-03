import { memo } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';

import { navDataConfig } from 'src/layouts/config-nav-config';

import { NavSectionVertical } from 'src/components/nav-section';

import { MainContainer } from '../content-page';

// ----------------------------------------------------------------------

export const ConfigLayout = memo(({ children }) => (
  <MainContainer maxWidth="100%">
    <Grid container spacing={5}>
      <Grid xs={12} sm={5} md={4} lg={3}>
        {navDataConfig.map((item, index) => (
          <Box
            key={index}
            sx={{
              boxShadow: (theme) => theme.customShadows.card,
              borderRadius: 2,
              py: 1,
              mt: index === 0 ? 0 : 3,
            }}
          >
            <NavSectionVertical
              data={item}
              sx={{
                px: 2,
                flex: '1 1 auto',
                '--nav-bullet-light-color': 'unset',
                '--nav-bullet-dark-color': 'unset',
                '& .MuiCollapse-vertical': { padding: 0 },
                '& .mnl__nav__ul': { paddingLeft: 0 },
                '& a.mnl__nav__item': { paddingLeft: '5.5px' },
                '& .mnl__nav__item__title': { fontWeight: 'bold !important ' },
              }}
            />
          </Box>
        ))}
      </Grid>

      <Grid xs={12} sm={7} md={8} lg={9}>
        {children}
      </Grid>
    </Grid>
  </MainContainer>
));
