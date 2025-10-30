/* eslint-disable no-shadow */
import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";

export default function ShowCalculatorInterval({ showNumber, timePerCalculation, soundEnabled }) {
  console.log("soundEnabled", soundEnabled)
  useEffect(() => {
    if (!showNumber[0]) return;

    const numberFile = `/number/${showNumber[0]}.mp3`;
    const defaultFile = `/number/tit.mp3`;
    // Kiểm tra file số có tồn tại
    fetch(numberFile, { method: "HEAD" })
      .then((res) => {
        let soundFile = "";
        
        if(timePerCalculation < 1000){
          soundFile = defaultFile
        }else{
          console.log("timePerCalculation", timePerCalculation)
          if(+soundEnabled === 1){
            soundFile = res.ok ? numberFile : defaultFile;
          }else{
            soundFile = defaultFile
          }
        }
        const fileToPlay = soundFile
        const audio = new Audio(fileToPlay);

        // Nếu timePerCalculation < 1000, phát nhanh gấp đôi
        if (timePerCalculation < 1000) {
          audio.playbackRate = 2.0;
        }

        audio.play().catch((err) => console.error("Không phát được âm thanh:", err));

        // Dừng audio khi component unmount hoặc thay đổi showNumber
        return () => {
          audio.pause();
          audio.currentTime = 0;
        };
      })
      .catch((err) => {
        console.error("Lỗi kiểm tra file:", err);
        const audio = new Audio(defaultFile);
        audio.play().catch((err) => console.error("Không phát được âm thanh:", err));
        return () => {
          audio.pause();
          audio.currentTime = 0;
        };
      });
    }, [showNumber, timePerCalculation]);
  return (
    <Box
      sx={{
        height: "calc(100vh - 380px)",
        border: "2px dashed rgb(5, 94, 39)",
        borderRadius: 2,
        padding: 2,
        marginBottom: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: 'url("/assets/background/elephan.png")',
      }}
    >
      <Typography
        sx={{
          flexGrow: 1,
          fontSize: {
            xs: 80,
            sm: 100,
            md: 200,
            lg: 300,
          },
          fontWeight: 500,
          background: "linear-gradient(90deg, #ff4b4b, #ff6666, #ff9999)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          zIndex: 1000,
        }}
      >
        {showNumber[0]}
      </Typography>
    </Box>
  );
}
