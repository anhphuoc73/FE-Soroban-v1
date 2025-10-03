import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { CollapseButton } from '../styles';
import COLORS from '../../../theme/core/colors.json';
import { Icon, ICON_NAME } from '../../../components/svg-color';

// ----------------------------------------------------------------------

export function ChatRoomSingle({ participant }) {
  const collapse = useBoolean(true);

  const renderInfo = (
    <Stack alignItems="center" sx={{ py: 5 }}>
      <Avatar
        alt={participant?.name}
        src={participant?.avatarUrl}
        sx={{ width: 96, height: 96, mb: 2 }}
      />
      <Typography variant="subtitle1">{participant?.name}</Typography>
      <Stack direction="row" flexGrow={1}>
        <IconButton>
          <Icon
            name={ICON_NAME.inactivePhone}
            sx={{ color: COLORS.success.main, width: 22, height: 22 }}
          />
        </IconButton>
        <IconButton>
          <Icon
            name={ICON_NAME.ticket}
            sx={{ color: COLORS.warning.main, width: 26, height: 26 }}
          />
        </IconButton>
      </Stack>
    </Stack>
  );

  const renderContact = (
    <Stack spacing={2} sx={{ px: 2, py: 2.5 }}>
      <TextField label="Họ tên" />
    </Stack>
  );

  return (
    <>
      {renderInfo}

      <CollapseButton selected={collapse.value} onClick={collapse.onToggle}>
        Thông tin khách hàng
      </CollapseButton>

      <Collapse in={collapse.value}>{renderContact}</Collapse>
    </>
  );
}
