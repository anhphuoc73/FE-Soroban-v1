import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { TicketView } from 'src/sections/ticket';
const metadata = { title: `Ticket | ${CONFIG.appName}` };
export default function Page({ title, isEdit }) {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TicketView title={title} isEdit={isEdit} />
    </>
  );
}
