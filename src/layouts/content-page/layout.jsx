import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import { iconButtonClasses } from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useBoolean } from 'src/hooks/use-boolean';

import { _contacts, _notifications } from 'src/_mock';

import { Logo } from 'src/components/logo';
import { useSettingsContext } from 'src/components/settings';
import NavDynamicIsland from 'src/components/custom-nav/nav-dynamic-island';

import { Main } from './main';
import { layoutClasses } from '../classes';
import { useNavColorVars } from './styles';
import { navMenu } from '../config-nav-dashboard';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';
import { MenuButton } from '../../components/menu-button';
import { NavMobile } from '../../components/custom-nav/nav-mobile';
import { ContactsPopover } from '../../components/contacts-popover';
import { NavVertical } from '../../components/custom-nav/nav-vertical';
import { NotificationsDrawer } from '../../components/notifications-drawer';

// ----------------------------------------------------------------------

export function ContentLayout({ sx, children, header, data }) {
  const theme = useTheme();

  const mobileNavOpen = useBoolean();

  const settings = useSettingsContext();

  const navColorVars = useNavColorVars(theme, settings);

  const layoutQuery = 'lg';

  const navData = data?.nav ?? navMenu;

  const isNavMini = settings.navLayout === 'mini';
  const isNavHorizontal = settings.navLayout === 'horizontal';
  const isNavVertical = isNavMini || settings.navLayout === 'vertical';

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
 
  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
      headerSection={
        <HeaderSection
          layoutQuery={layoutQuery}
          disableElevation={isNavVertical}
          slotProps={{
            toolbar: {
              sx: {
                ...(isNavHorizontal && {
                  bgcolor: 'var(--layout-nav-bg)',
                  [`& .${iconButtonClasses.root}`]: {
                    color: 'var(--layout-nav-text-secondary-color)',
                  },
                  [theme.breakpoints.up(layoutQuery)]: {
                    height: 'var(--layout-nav-horizontal-height)',
                  },
                }),
              },
            },
            container: {
              maxWidth: false,
              sx: {
                ...(isNavVertical && { px: { [layoutQuery]: 5 } }),
              },
            },
          }}
          sx={header?.sx}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            // bottomArea: isNavHorizontal ? (
            //   <NavHorizontal
            //     data={navData}
            //     layoutQuery={layoutQuery}
            //     cssVars={navColorVars.section}
            //   />
            //   // <NavDynamicIsland />
            // ) : null,
            leftArea: (
              <>
                {/* -- Nav mobile -- */}
                <MenuButton
                  onClick={mobileNavOpen.onTrue}
                  sx={{
                    mr: 1,
                    ml: -1,
                    [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
                  }}
                />
                <NavMobile
                  data={navData}
                  open={mobileNavOpen.value}
                  onClose={mobileNavOpen.onFalse}
                  cssVars={navColorVars.section}
                />
                {/* -- Logo -- */}
                {isNavHorizontal && (
                  <Logo
                    sx={{
                      display: 'none',
                      [theme.breakpoints.up(layoutQuery)]: {
                        display: 'inline-flex',
                      },
                    }}
                  />
                )}
                {/* -- Divider -- */}
                {/* {isNavHorizontal && (
                  <StyledDivider
                    sx={{
                      [theme.breakpoints.up(layoutQuery)]: { display: 'flex' },
                    }}
                  />
                )} */}
                {/* -- Workspace popover -- */}
                {/* <WorkspacesPopover
                  data={_workspaces}
                  sx={{ color: 'var(--layout-nav-text-primary-color)' }}
                /> */}
              </>
            ),
            // centerArea: isNavHorizontal ? <NavDynamicIsland data={navData} /> : <Logo />,

            centerArea: 
              isNavHorizontal && !isMobile 
                ? <NavDynamicIsland data={navData} /> 
                : <Logo />,

            rightArea: (
              <Box display="flex" alignItems="center" gap={{ xs: 0, sm: 0.75 }}>
                {/* -- Searchbar -- */}
                {/* <Searchbar data={navData} /> */}
                {/* -- Language popover -- */}
                {/* <LanguagePopover
                  data={[
                    { value: 'en', label: 'English', countryCode: 'GB' },
                    { value: 'fr', label: 'French', countryCode: 'FR' },
                    { value: 'vi', label: 'Vietnamese', countryCode: 'VN' },
                    { value: 'cn', label: 'Chinese', countryCode: 'CN' },
                    { value: 'ar', label: 'Arabic', countryCode: 'SA' },
                  ]}
                /> */}
                {/* -- Notifications popover -- */}
                {/* <NotificationsDrawer data={_notifications} /> */}
                {/* -- Contacts popover -- */}
                {/* <ContactsPopover data={_contacts} /> */}
                {/* -- Settings button -- */}
                {/* <SettingsButton /> */}
                {/* -- Account drawer -- */}
                {/* <AccountDrawer data={_account} /> */}
              </Box>
            ),
          }}
        />
      }
      /** **************************************
       * Sidebar
       *************************************** */
      sidebarSection={
        isNavHorizontal ? null : (
          <NavVertical
            data={navData}
            isNavMini={isNavMini}
            layoutQuery={layoutQuery}
            cssVars={navColorVars.section}
            onToggleNav={() =>
              settings.onUpdateField(
                'navLayout',
                settings.navLayout === 'vertical' ? 'mini' : 'vertical'
              )
            }
          />
        )
      }

      

      /** **************************************
       * Footer
       *************************************** */
      footerSection={null}
      /** **************************************
       * Style
       *************************************** */
      cssVars={{
        ...navColorVars.layout,
        '--layout-transition-easing': 'linear',
        '--layout-transition-duration': '120ms',
        '--layout-nav-mini-width': '88px',
        '--layout-nav-vertical-width': '300px',
        '--layout-nav-horizontal-height': '80px',
        '--layout-dashboard-content-pt': theme.spacing(1),
        '--layout-dashboard-content-pb': theme.spacing(8),
        '--layout-dashboard-content-px': theme.spacing(5),
      }}
      sx={{
        [`& .${layoutClasses.hasSidebar}`]: {
          [theme.breakpoints.up(layoutQuery)]: {
            transition: theme.transitions.create(['padding-left'], {
              easing: 'var(--layout-transition-easing)',
              duration: 'var(--layout-transition-duration)',
            }),
            pl: isNavMini ? 'var(--layout-nav-mini-width)' : 'var(--layout-nav-vertical-width)',
          },
        },
        ...sx,
      }}
    >
      <Main isNavHorizontal={isNavHorizontal}>{children}</Main>
    </LayoutSection>
  );
}
