import { useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import { Iconify } from "../iconify";

export function ResultMathView({ numberQuestion, logMath }) {
  const [resultArray, setResultArray] = useState([]);

useEffect(() => {
  const newResultArray = Array.from({ length: numberQuestion }).reduce((acc, _, i) => {
    const item = logMath[i];

    if (!item) {
      acc.push(2); // chưa làm
    } else if (item.result === 1) {
      acc.push(1); // đúng
    } else if (item.result === 0) {
      acc.push(0); // sai
    } else {
      // eslint-disable-next-line no-lonely-if
      if (i > 0 && acc[i - 1] === 2) {
        acc.push(0); 
      } else {
        acc.push(2);
      }
    }

    return acc;
  }, []);

  setResultArray(newResultArray);
}, [logMath, numberQuestion]);


  const renderIcon = (status, index) => {
    switch (status) {
      case 1:
        return (
          <IconButton key={index}>
            <Iconify width={35} color="success.dark" icon="lets-icons:check-ring" />
          </IconButton>
        );
      case 0:
        return (
          <IconButton key={index}>
            <Iconify width={35} color="error.dark" icon="humbleicons:times-circle" />
          </IconButton>
        );
      case 2:
      default:
        return (
          <IconButton key={index}>
            <Iconify width={35} color="grey.500" icon="ri:circle-line" />
          </IconButton>
        );
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: 1,
        boxShadow: 3,
        p: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        height: "100%",
        maxHeight: 14 * 60, // 13 icon * chiều cao ước lượng mỗi icon 50px
        overflowY: "auto",
      }}
    >
      {resultArray.map((status, i) => renderIcon(status, i))}
    </Box>

  );
}
