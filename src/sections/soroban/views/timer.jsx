import { Box, Button, Typography, TextField, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { Iconify } from 'src/components/iconify';

export function Timer({initialTime, setInitialTime, equal, setEqual, start, setStart}) { 
    // eslint-disable-next-line consistent-return
    useEffect(() => {
        if(!equal){
            if (initialTime <= 0) {
                setEqual(true);
                setStart(false);
            }; 
            const timmerId = setInterval(() => {
                setInitialTime((prev) => prev - 1);
                
            }, 1000); 
            // eslint-disable-next-line consistent-return
            return () => clearInterval(timmerId); 
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [equal, initialTime]);

   

    return (
        <Button
            variant="outlined"
            sx={{
                borderRadius: '50%',
                width: { xs: '80px', md: '120px' }, // nhỏ hơn trên mobile
                height: { xs: '80px', md: '120px' },
                fontSize: { xs: '30px', md: '50px' },
                borderColor: 'success.dark',
                color: 'success.dark',
            }}
        >
            {initialTime}
        </Button>
    )
}

