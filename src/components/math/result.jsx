import { useEffect, useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { Iconify } from "../iconify";

export function ResultMathView({ numberQuestion, logMath }) {
  const [resultArray, setResultArray] = useState([]);

  useEffect(() => {
    const newResultArray = Array.from({ length: numberQuestion }).reduce(
      (acc, _, i) => {
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
      },
      []
    );

    setResultArray(newResultArray);
  }, [logMath, numberQuestion]);

  const renderIcon = (status, index) => {
    let iconProps = {};

    switch (status) {
      case 1:
        iconProps = { color: "success.dark", icon: "lets-icons:check-ring" };
        break;
      case 0:
        iconProps = { color: "error.dark", icon: "humbleicons:times-circle" };
        break;
      default:
        iconProps = { color: "grey.500", icon: "ri:circle-line" };
        break;
    }

    return (
      <Box
        key={index}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Typography
          variant="body2"
          sx={{ width: 20, textAlign: "right", color: "text.secondary" }}
        >
          {index + 1}.
        </Typography>
        <IconButton size="small">
          <Iconify width={35} {...iconProps} />
        </IconButton>
      </Box>
    );
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
        alignItems: "flex-start",
        gap: 1,
        height: "100%",
        maxHeight: 14 * 60, // tối đa 14 biểu tượng
        overflowY: "auto",
      }}
    >
      {resultArray.map((status, i) => renderIcon(status, i))}
    </Box>
  );
}
