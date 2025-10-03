import { forwardRef } from 'react';

import Box from '@mui/material/Box';

import { svgColorClasses } from './classes';
import { CONFIG } from '../../config-global';

// ----------------------------------------------------------------------

const SvgColor = forwardRef(({ src, width = 24, height, className, sx, ...other }, ref) => (
  <Box
    ref={ref}
    component="span"
    className={svgColorClasses.root.concat(className ? ` ${className}` : '')}
    sx={{
      width,
      flexShrink: 0,
      height: height ?? width,
      display: 'inline-flex',
      bgcolor: 'currentColor',
      mask: `url(${src}) no-repeat center / contain`,
      WebkitMask: `url(${src}) no-repeat center / contain`,
      ...sx,
    }}
    {...other}
  />
));

export const ICON_NAME = {
  home: 'icon-home',
  activePhone: 'icon-active-phone',
  add: 'icon-add',
  arrowDown: 'icon-arrow-down',
  arrowLeft: 'icon-arrow-left',
  arrowRight: 'icon-arrow-right',
  bell: 'icon-bell',
  burger: 'icon-burger',
  channel: 'icon-channel',
  chat: 'icon-chat',
  customer: 'icon-customer',
  delete: 'icon-delete',
  distribution: 'icon-distribution',
  download: 'icon-download',
  downloadTemplateFile: 'icon-download-template-file',
  edit: 'icon-edit',
  extension: 'icon-extension',
  fieldContact: 'icon-field-contact',
  filter: 'icon-filter',
  groupStaff: 'icon-group-staff',
  inactivePhone: 'icon-inactive-phone',
  information: 'icon-information',
  integrationWeb: 'icon-integration-web',
  menuActionDownload: 'icon-menu-action-download',
  permission: 'icon-permission',
  play: 'icon-play',
  report: 'icon-report',
  search: 'icon-search',
  setting: 'icon-setting',
  sms: 'icon-sms',
  staff: 'icon-staff',
  tag: 'icon-tag',
  thumbnailPhone: 'icon-thumbnail-phone',
  ticket: 'icon-ticket',
  ticketNormal: 'icon-ticket-normal',
  upload: 'icon-upload',
  windowChat: 'icon-window-chat',
  facebook: 'logo-facebook',
  liveChat: 'logo-live-chat',
  uploadFile: 'logo-upload-file',
  zalo: 'logo-zalo',
  calendar: 'icon-calendar',
  ticketLow: 'icon-ticket-low',
  ticketHigh: 'icon-ticket-high',
  ticketMedium: 'icon-ticket-medium',
  attachment: 'icon-attachment',
  chart: 'icon-chart',
  close: 'icon-close',
  check: 'icon-check',
  connected: 'icon-connected',
  copy: 'icon-copy',
  disconnected: 'icon-disconnected',
  emoji: 'icon-emoji',
  filtering: 'icon-filtering',
  hidden: 'icon-hidden',
  link: 'icon-link',
  more: 'icon-more',
  refresh: 'icon-refresh',
  sendChat: 'icon-send-chat',
  switch: 'icon-switch',
  transferManager: 'icon-transfer-manager',
  bubbleChatSample: 'logo-bubble-chat-sample',
};

export const Icon = ({ name, sx, ...other }) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/resources/${name}.svg`} sx={sx} {...other} />
);
