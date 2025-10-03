import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function PermissionAddForm() {
  const renderDetails = (
    <Stack spacing={3} mt={3} sx={{ flex: 1 }}>
      <Field.Text
        name="name"
        label="Tên quyền"
        sx={{
          '& .MuiFormLabel-asterisk': {
            color: 'red',
          },
        }}
        required
      />
      <Field.Text name="description" label="Mô tả" multiline rows={4} />
    </Stack>
  );

  return <Box sx={{ display: 'flex', flexDirection: 'column' }}>{renderDetails}</Box>;
}
