/* eslint-disable no-shadow */
import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";

export default function ShowCalculatorInterval({ showNumber, timePerCalculation }) {
  useEffect(() => {
    let audio;

    if (showNumber !== undefined && showNumber !== null && showNumber !== "") {
      const filePath =
        timePerCalculation >= 1000
          ? `/number/${showNumber}.mp3`
          : `/number/tit.mp3`;

      const audio = new Audio(filePath);

      // Nếu là số thì phát nhanh gấp đôi
      if (timePerCalculation < 1000) {
        audio.playbackRate = 2.0;
      }

      audio.play().catch((err) => {
        console.error("Không phát được âm thanh:", err);
      });
    }


    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
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
          background:
            "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          zIndex: 1000,
        }}
      >
        {showNumber}
      </Typography>
    </Box>
  );
}
