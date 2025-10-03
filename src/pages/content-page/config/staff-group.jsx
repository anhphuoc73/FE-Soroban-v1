import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ConfigGroupStaff } from 'src/sections/config/views/config-staff-group';

// ----------------------------------------------------------------------

const metadata = { title: `${CONFIG.appName} | Nhóm nhân viên ` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ConfigGroupStaff />
    </>
  );
}
