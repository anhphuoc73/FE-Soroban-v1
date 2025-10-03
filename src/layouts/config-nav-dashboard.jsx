import { paths } from 'src/routes/paths';

import { Icon, ICON_NAME } from '../components/svg-color';



// ----------------------------------------------------------------------

export const navMenu = [
  /**
   * Overview
   */
  {
    subheader: '',
    items: [
      {
        id: 'content',
        title: 'Trang chủ',
        path: paths.content.root,
        icon: (
          <Icon
            name={ICON_NAME.home}
            sx={{ display: 'flex', alignItems: 'center', mr: 1, width: '18px' }}
          />
        ),
      },
      {
        id: 'fingermath',
        title: 'Finger Math',
        path: paths.content.fingermath,
        icon: (
          <Icon
            name={ICON_NAME.report}
            sx={{ display: 'flex', alignItems: 'center', mr: 1, width: '18px' }}
          />
        ),
      },
      {
        id: 'soroban',
        title: 'Soroban',
        path: paths.content.soroban,
        icon: (
          <Icon
            name={ICON_NAME.report}
            sx={{ display: 'flex', alignItems: 'center', mr: 1, width: '18px' }}
          />
        ),
      },
      {
        id: 'user',
        title: 'Tài khoản',
        path: paths.content.user,
        icon: (
          <Icon
            name={ICON_NAME.ticket}
            sx={{ display: 'flex', alignItems: 'center', mr: 1, width: '18px' }}
          />
        ),
      },
    ],
  },
];
