import { paths } from 'src/routes/paths';

import { Icon, ICON_NAME } from 'src/components/svg-color';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export const navDataConfigFirst = [
  /**
   * Overview
   */
  {
    items: [
      {
        id: 'permission',
        title: 'NHÂN VIÊN VÀ PHÂN QUYỀN',
        path: paths.content.config.root,
        children: [
          {
            title: 'Phân quyền',
            path: paths.content.config.permission,
            icon: (
              <Icon
                name={ICON_NAME.permission}
                sx={{ display: 'flex', alignItems: 'center', mr: 1, width: '18px !important' }}
              />
            ),
          },
          {
            title: 'Nhóm nhân viên',
            path: paths.content.config.staffGroup,
            icon: (
              <Icon
                name={ICON_NAME.groupStaff}
                sx={{ display: 'flex', alignItems: 'center', mr: 1, width: '20px !important' }}
              />
            ),
          },
          {
            title: 'Nhân viên',
            path: paths.content.config.staff,
            icon: (
              <Icon
                name={ICON_NAME.staff}
                sx={{ display: 'flex', alignItems: 'center', mr: 1, width: '16px !important' }}
              />
            ),
          },
        ],
      },
    ],
  },
];

export const navDataConfigSecond = [
  /**
   * Overview
   */
  {
    items: [
      {
        id: 'conversation',
        title: 'HỘI THOẠI',
        path: paths.content.config.root,
        children: [
          {
            title: 'Kênh tương tác',
            path: paths.content.config.interactiveChannel,
            icon: (
              <Icon
                name={ICON_NAME.channel}
                sx={{ display: 'flex', alignItems: 'center', mr: 1, width: '18px !important' }}
              />
            ),
          },
          {
            title: 'Tin nhắn mẫu',
            path: paths.content.config.templateMessage,
            icon: (
              <Icon
                name={ICON_NAME.sms}
                sx={{ display: 'flex', alignItems: 'center', mr: 1, width: '18px !important' }}
              />
            ),
          },
          {
            title: 'Phân phối hội thoại',
            path: paths.content.config.conversationDistribution,
            icon: (
              <Icon
                name={ICON_NAME.distribution}
                sx={{ display: 'flex', alignItems: 'center', mr: 1, width: '18px !important' }}
              />
            ),
          },
          {
            title: 'Nhãn hội thoại',
            path: paths.content.config.conversationTag,
            icon: (
              <Icon
                name={ICON_NAME.tag}
                sx={{ display: 'flex', alignItems: 'center', mr: 1, width: '18px !important' }}
              />
            ),
          },
        ],
      },
    ],
  },
];

export const navDataConfigThird = [
  /**
   * Overview
   */
  {
    items: [
      {
        id: 'permission',
        title: 'LIVE CHAT',
        path: paths.content.config.root,
        children: [
          {
            title: 'Cửa sổ chat',
            path: paths.content.config.chatWindow,
            icon: (
              <Icon
                name={ICON_NAME.windowChat}
                sx={{ display: 'flex', alignItems: 'center', mr: 1, width: '18px !important' }}
              />
            ),
          },
          {
            title: 'Tích hợp Web',
            path: paths.content.config.webIntegration,
            icon: (
              <Icon
                name={ICON_NAME.integrationWeb}
                sx={{ display: 'flex', alignItems: 'center', mr: 1, width: '20px !important' }}
              />
            ),
          },
        ],
      },
    ],
  },
];

export const navDataConfigFourth = [
  /**
   * Overview
   */
  {
    items: [
      {
        id: 'permission',
        title: 'KHÁC',
        path: paths.content.config.root,
        children: [
          {
            title: 'Trường dữ liệu',
            path: paths.content.config.dataField,
            icon: (
              <Icon
                name={ICON_NAME.fieldContact}
                sx={{ display: 'flex', alignItems: 'center', mr: 1, width: '16px !important' }}
              />
            ),
          },
          {
            title: 'Mẫu tin nhắn SMS/ZNS',
            path: paths.content.config.smsZnsTemplate,
            icon: (
              <Icon
                name={ICON_NAME.chat}
                sx={{ display: 'flex', alignItems: 'center', mr: 1, width: '18px !important' }}
              />
            ),
          },
          {
            title: 'Máy nhánh',
            path: paths.content.config.branchDevice,
            icon: (
              <Icon
                name={ICON_NAME.extension}
                sx={{ display: 'flex', alignItems: 'center', mr: 1, width: '18px !important' }}
              />
            ),
          },
        ],
      },
    ],
  },
];

export const navDataConfig = [
  navDataConfigFirst,
  navDataConfigSecond,
  navDataConfigThird,
  navDataConfigFourth,
];
