import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const styleTextField = {
  '& .MuiFormLabel-asterisk': {
    color: 'red',
  },

  '& .MuiChip-root': {
    backgroundColor: (theme) => theme.vars.palette.primary.main,
  },
};
export const configStaffGroupSchema = zod.object({
  name: zod.string().nonempty('Tên quyền là bắt buộc'),
  description: zod.string().optional(),
  extension: zod.array(zod.object({ value: zod.string(), label: zod.string() })).optional()
});

const extensionList = [
  { label: '123', value: '1237' },
  { label: '324', value: '3248' },
  { label: '435', value: '4359' },
  { label: '123451', value: '123450' },
  { label: '123452', value: '123451' },
  { label: '123453', value: '123452' },
  { label: '123454', value: '123453' },
  { label: '123455', value: '123454' },
  { label: '123456', value: '1234556' },
  { label: '123457', value: '12345666' },
  { label: '123458', value: '12345666' },
];
export default function StaffGroupDialog({ open, onClose, ...other }) {
  const defaultValues = {
    name: '',
    description: '',
    extension: [],
  };
  const methods = useForm({
    resolver: zodResolver(configStaffGroupSchema),
    defaultValues,
  });

  const { handleSubmit, reset, setError } = methods;

  const onSubmit = handleSubmit(async (data) => {
    
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      maxWidth={false}
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: { maxWidth: 550, py: 3, px: 4, width: 550 },
      }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <DialogTitle
            sx={{
              p: (theme) => theme.spacing(0, 0, 2, 0),
              fontSize: { xs: 17, md: 20 },
              fontWeight: 700,
            }}
          >
            Thêm mới nhóm nhân viên
          </DialogTitle>

          <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none', px: 0, overflow: 'hidden' }}>
            <Stack spacing={2}>
              <Field.Text
                name="name"
                label="Tên nhóm nhân viên"
                sx={{
                  '& .MuiFormLabel-asterisk': {
                    color: 'red',
                  },
                }}
                required
              />

              <Field.Autocomplete
                label="Thêm mới nhóm nhân viên"
                name="extension"
                options={extensionList.map((option) => option)}
                sx={styleTextField}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                getOptionLabel={(option) => option.label}
                multiple
                renderOption={(props, option) => (
                  <li {...props} key={option.value}>
                    {option.label}
                  </li>
                )}
              />
              <Field.Text name="description" label="Mô tả" multiline rows={4} />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 0, pb: 0 }}>
            <Button variant="contained" color="error" onClick={onClose}>
              Hủy
            </Button>
            <Button
              variant="contained"
              type="submit"
              // onClick={handleUpload}
              color="primary"
            >
              Lưu lại
            </Button>
          </DialogActions>
        </Box>
      </Form>
    </Dialog>
  );
}
