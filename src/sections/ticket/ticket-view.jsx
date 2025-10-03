import Box from '@mui/material/Box';
import { MainContainer } from 'src/layouts/content-page';
import ListTicket from './views/list-ticket';
import EditTicket from './views/edit-ticket';
// ----------------------------------------------------------------------
export function TicketView({ title = 'Blank', isEdit = false }) {
  return (
    <MainContainer maxWidth="100%">
      <Box
        sx={{
          width: 1,
          minHeight: 400,
          borderRadius: 2,
          boxShadow: isEdit === true ? 'none' : 3,
        }}
      >
        {isEdit === true ? <EditTicket /> : <ListTicket />}
      </Box>
    </MainContainer>
  );
}
