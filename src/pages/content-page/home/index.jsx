import { Box } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { BlankView } from 'src/sections/blank/view';

const metadata = { title: `Trang chủ` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <Box
        sx={{
          backgroundImage: 'url("/logo/sieu-chi-dau-tri.jpg")', // đường dẫn ảnh nền
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 3
        }}
      >
        {/* Nội dung trang */}
        {/* <BlankView title="Home" /> */}
      </Box>
      

      {/* <BlankView title="Home" /> */}
    </>
  );
}
