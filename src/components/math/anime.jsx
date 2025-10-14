import { Box } from '@mui/material';

export function Anime() {
     const images = [
        '/dolphin/1.jpg',
        '/dolphin/2.jpg',
        '/dolphin/3.jpg',
        '/dolphin/4.jpg',
        '/dolphin/6.jpg',
    ];
    const randomIndex = Math.floor(Math.random() * images.length);
    const randomSrc = images[randomIndex];
  return (
    <Box
      component="img"
      src={randomSrc}
      alt="anime"
      sx={{
        width: { xs: 120, md: 200 },
        height: { xs: 120, md: 200 },
        borderRadius: '50%',
        objectFit: 'cover',
        border: '3px solid',
        borderColor: 'success.dark',
      }}
    />
  );
}







// import { Box, Button, Typography, TextField, IconButton } from '@mui/material';
// import { useEffect, useState } from 'react';
// import { Iconify } from 'src/components/iconify';

// export function Anime() { 
//     return (
//         <Button
//             variant="outlined"
//             sx={{
//                 borderRadius: '50%',
//                 width: { xs: '80px', md: '120px' }, // nhỏ hơn trên mobile
//                 height: { xs: '80px', md: '120px' },
//                 fontSize: { xs: '30px', md: '50px' },
//                 borderColor: 'success.dark',
//                 color: 'success.dark',
//             }}
//         >
//             111111111111
//         </Button>
//     )
// }

