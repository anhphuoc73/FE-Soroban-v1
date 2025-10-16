import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
// import { ReportView } from '../../../sections/report/index';

import { SorobanView } from '../../../sections/soroban/index';

const metadata = { title: `Soroban ` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SorobanView />
    </>
  );
}
