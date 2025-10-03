import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { varAlpha } from 'src/theme/styles';
import {MainContainer} from 'src/layouts/content-page';

// ----------------------------------------------------------------------

export function BlankView({ title = 'Blank' }) {
  return (
    <MainContainer maxWidth="xl">
      <Typography variant="h4"> {title} </Typography>
      <Button   color="error" variant='contained'>heelo</Button>
      <Box
        sx={{
          mt: 5,
          width: 1,
          height: 320,
          borderRadius: 2,
          bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
          border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
        }}
      />
    </MainContainer>
  );
}
