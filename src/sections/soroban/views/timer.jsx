import { Box, Button, Typography, TextField, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { Iconify } from 'src/components/iconify';

export function Timer({initialTime, setInitialTime, equal, setEqual, start, setStart}) { 
    // eslint-disable-next-line consistent-return
    // useEffect(() => {
    //     if(!equal){
    //         if (initialTime <= 0) {
    //             setEqual(true);
    //             setStart(false);
    //         }; 
    //         const timmerId = setInterval(() => {
    //             setInitialTime((prev) => prev - 1);
                
    //         }, 1000); 
    //         // eslint-disable-next-line consistent-return
    //         return () => clearInterval(timmerId); 
    //     }
        
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [equal, initialTime]);

    useEffect(() => {
        if (!equal && start) {
            if (initialTime <= 0) {
            setEqual(true);
            setStart(false);
            return;
            }

            const timerId = setInterval(() => {
            setInitialTime((prev) => {
                const next = prev - 1;
                if (next >= 0) playNumberSound(next);
                return next;
            });
            }, 1000);

            // eslint-disable-next-line consistent-return
            return () => clearInterval(timerId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [equal, initialTime, start]);
    
    const playNumberSound = (num) => {
        const soundPath = `/number/${num}.mp3`;
        try {
            const audio = new Audio(soundPath);
            audio.playbackRate = 1.2; // tốc độ phát nhanh hơn 1 chút
            audio.volume = 1.0;       // âm lượng tối đa
            audio.play().catch((err) => console.warn("Không phát được âm thanh:", err));
            // eslint-disable-next-line no-undef
            audioRef.current = audio;
        } catch (error) {
            console.error("Lỗi khi phát âm thanh:", error);
        }
    };

   

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

