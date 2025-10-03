import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CustomerView } from '../../../sections/customer';
import { LoadingScreen } from '../../../components/loading-screen';

const metadata = { title: `Customer | ${CONFIG.appName}` };

export default function Page({ isSaved = false }) {
  const [showComponent, setShowComponent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowComponent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      {showComponent ? <CustomerView isSaved={isSaved} /> : <LoadingScreen />}
    </>
  );
}
