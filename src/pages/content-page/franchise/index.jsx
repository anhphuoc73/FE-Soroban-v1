import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
// import { ReportView } from '../../../sections/report/index';

import { FranchiseView } from '../../../sections/franchise/index';

const metadata = { title: `Report | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <FranchiseView />
    </>
  );
}
