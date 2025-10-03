import { CONFIG } from 'src/config-global';
import { stylesMode } from 'src/theme/styles';

import { Main } from './main';
import { HeaderSection } from '../core/header-section';
import { LayoutSection } from '../core/layout-section';

// ----------------------------------------------------------------------

export function AuthCenteredLayout({ sx, children, header }) {
  const layoutQuery = 'md';

  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
      headerSection={
        <HeaderSection
          disableElevation
          layoutQuery={layoutQuery}
          slotProps={{ container: { maxWidth: false } }}
          sx={{ position: { [layoutQuery]: 'fixed' }, ...header?.sx }}
        />
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={null}
      /** **************************************
       * Style
       *************************************** */
      cssVars={{ '--layout-auth-content-width': '420px' }}
      sx={{
        '&::before': {
          width: 1,
          height: 1,
          zIndex: -1,
          content: "''",
          position: 'fixed',
          backgroundSize: {
            sm: "cover",
            md: "contain",
          },
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundImage: {
            sm: `url(${CONFIG.assetsDir}/assets/background/background-3-blur.webp)`,
            md: `url(${CONFIG.assetsDir}/assets/background/background.svg)`
          },
          [stylesMode.dark]: { opacity: 0.08 },
        },
        ...sx,
      }}
    >
      <Main layoutQuery={layoutQuery}>{children}</Main>
    </LayoutSection>
  );
}
