import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { AdminView } from '../../../sections/admin/index';

const metadata = { title: `Report | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AdminView />
    </>
  );
}
