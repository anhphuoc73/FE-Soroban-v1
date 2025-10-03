import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ConfigPermissionView } from 'src/sections/config/index';

// ----------------------------------------------------------------------

const metadata = { title: `${CONFIG.appName} | Phân quyền ` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ConfigPermissionView />
    </>
  );
}
