import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';

import { layoutClasses } from 'src/layouts/classes';

import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

export function Main({ children, isNavHorizontal, sx, ...other }) {
  return (
    <Box
      component="main"
      className={layoutClasses.main}
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        ...(isNavHorizontal && {
          '--layout-dashboard-content-pt': '24px',
        }),
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}

// ----------------------------------------------------------------------

// export function MainNoScrollContainer({ sx, children, disablePadding, maxWidth = 'lg', ...other }) {
//   const theme = useTheme();

//   const settings = useSettingsContext();

//   const layoutQuery = 'lg';

//   return (
//     <Container
//       className={layoutClasses.content}
//       maxWidth={settings.compactLayout ? maxWidth : false}
//       sx={{
//         display: 'flex',
//         flex: '1 1 auto',
//         flexDirection: 'column',
//         pt: 'var(--layout-dashboard-content-pt)',
//         pb: 'var(--layout-dashboard-content-pb)',
//         [theme.breakpoints.up(layoutQuery)]: {
//           px: 'var(--layout-dashboard-content-px)',
//         },
//         ...(disablePadding && {
//           p: {
//             xs: 0,
//             sm: 0,
//             md: 0,
//             lg: 0,
//             xl: 0,
//           },
//         }),
//         ...sx,
//       }}
//       {...other}
//     >
//       {children}
//     </Container>
//   );
// }

export function MainNoScrollContainer({ sx, children, disablePadding, maxWidth = 'lg', ...other }) {
  const theme = useTheme();
  const settings = useSettingsContext();
  const layoutQuery = 'lg';

  return (
    <Container
      className={layoutClasses.content}
      maxWidth={settings.compactLayout ? maxWidth : false}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: '0 0 auto',
        width: '100%',
        height: '100%',
        m: 0,
        p: 0,
        boxSizing: 'border-box',
        overflow: 'hidden', // ⬅️ ẩn cả scroll ngang & dọc
        pt: 'var(--layout-dashboard-content-pt)',
        pb: 'var(--layout-dashboard-content-pb)',
        [theme.breakpoints.up(layoutQuery)]: {
          px: 'var(--layout-dashboard-content-px)',
        },
        ...(disablePadding && {
          p: { xs: 0, sm: 0, md: 0, lg: 0, xl: 0 },
        }),
        ...sx,
      }}
      {...other}
    >
      {children}
    </Container>
  );
}

