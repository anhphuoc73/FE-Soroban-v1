import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { UserView } from '../../../sections/user/index';

const metadata = { title: `Report | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UserView />
    </>
  );
}
