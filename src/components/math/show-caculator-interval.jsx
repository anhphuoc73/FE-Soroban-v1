/* eslint-disable no-shadow */
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

export default function ShowCalculatorInterval({
  showNumber,
  timePerCalculation,
  soundEnabled,
  caculation,
  keyLesson
}) {
  const [gradient, setGradient] = useState(
    "linear-gradient(90deg, #ff4b4b, #ff6666, #ff9999)" // đỏ mặc định
  );

  useEffect(() => {
    if(caculation == 1){
      if (!showNumber[0]) return;

      setGradient((prev) =>
        prev.includes("#ff4b4b")
          ? "linear-gradient(90deg, #0033cc, #0055ff, #3399ff)" 
          : "linear-gradient(90deg, #ff4b4b, #ff6666, #ff9999)"
      );

      //Phát âm thanh
      const numberFile = `/number/${showNumber[0]}.mp3`;
      const defaultFile = `/number/tit.mp3`;

      fetch(numberFile, { method: "HEAD" })
        .then((res) => {
          let soundFile = "";

          if (timePerCalculation < 1000) {
            soundFile = defaultFile;
          } else {
            if (+soundEnabled === 1) {
              soundFile = res.ok ? numberFile : defaultFile;
            } else {
              soundFile = defaultFile;
            }
          }

          const audio = new Audio(soundFile);

          if (timePerCalculation < 1000) {
            audio.playbackRate = 2.0; // phát nhanh gấp đôi
          }

          audio.play().catch((err) => console.error("Không phát được âm thanh:", err));

          // cleanup khi số đổi hoặc component unmount
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
    }else{
      if (!showNumber[0]) return;

      setGradient((prev) =>
        prev.includes("#ff4b4b")
          ? "linear-gradient(90deg, #0033cc, #0055ff, #3399ff)" 
          : "linear-gradient(90deg, #ff4b4b, #ff6666, #ff9999)"
      );

      //Phát âm thanh
      const numberFile = `/number/${showNumber[0]}.mp3`;
      const defaultFile = `/number/tit.mp3`;

      fetch(numberFile, { method: "HEAD" })
        .then((res) => {
          let soundFile = "";

          if (timePerCalculation < 1000) {
            soundFile = defaultFile;
          } else {
            if (+soundEnabled === 1) {
              soundFile = res.ok ? numberFile : defaultFile;
            } else {
              soundFile = defaultFile;
            }
          }

          const audio = new Audio(soundFile);

          if (timePerCalculation < 1000) {
            audio.playbackRate = 2.0; // phát nhanh gấp đôi
          }

          audio.play().catch((err) => console.error("Không phát được âm thanh:", err));

          // cleanup khi số đổi hoặc component unmount
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
    }
    
  }, [showNumber, timePerCalculation, soundEnabled]);

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
          background: gradient,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          transition: "background 0.5s ease",
          zIndex: 1000,
        }}
      >
        {caculation == 1 ? (
          showNumber[0]   // chỉ hiện số
        ) : (
          keyLesson === 500 || keyLesson === 501 ||   keyLesson === 503 || keyLesson === 504 ? (
              <span dangerouslySetInnerHTML={{ __html: showNumber }} />
          ) : (
              showNumber[0]   
          )
        )}
      </Typography>

    </Box>
  );
}
