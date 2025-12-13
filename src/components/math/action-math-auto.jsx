import React, { useRef, useEffect } from "react";
import { Box, TextField, IconButton, Tooltip, Typography } from "@mui/material";
import { Iconify } from "../iconify"; // tuỳ đường dẫn của bạn

export default function ActionMath({
  resultEqua,
  handleOnchangeEqua,
  handleEqual,
  handleCreateCalculation,
  handleResetCreateCaculation,
  handleNoti,
  handleReport,
  equal,
  start,
  infoReport
}) {
  const inputRef = useRef(null);

  // focus mỗi khi equal chuyển từ true -> false
  useEffect(() => {
    if (!equal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [equal]);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      marginTop={4}
      sx={{
        flexDirection: { xs: "column", md: "row" }, // mobile: dọc, desktop: ngang
        gap: 2,
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        sx={{ minWidth: 120 }}
      >
        <Typography fontWeight="bold">Số hạng 1: {infoReport?.firstNumber}</Typography>
        <Typography fontWeight="bold">Số hạng 2: {infoReport?.secondNumber}</Typography>
      </Box>
      {/* <TextField
        inputRef={inputRef}
        label="Trả lời"
        variant="outlined"
        type="number"
        value={resultEqua}
        onChange={handleOnchangeEqua}
        autoFocus={!equal}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();

            if (!equal) {
              // Nếu chưa trả lời → gọi hàm trả lời
              handleEqual();
            } else if (!start) {
              // Nếu đã trả lời và chưa bắt đầu → gọi hàm tạo phép tính mới
              handleCreateCalculation();
            }
          }
        }}
        sx={{
          textAlign: "center",
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "success.dark",
          },
          "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "success.dark",
          },
        }}
      /> */}

      {/* Nhóm 3 nút nằm trên 1 hàng */}
      <Box display="flex" gap={2}>
        {/* <Tooltip title="Trả lời" arrow>
          <span>
            <IconButton onClick={handleEqual} disabled={equal}>
              <Iconify
                width={50}
                icon="akar-icons:equal"
                color={equal ? "action.disabled" : "success.dark"}
              />
            </IconButton>
          </span>
        </Tooltip> */}

        <Tooltip title="Bắt đầu" arrow>
          <span>
            <IconButton onClick={handleCreateCalculation} disabled={start}>
              <Iconify
                width={50}
                icon="carbon:next-outline"
                color={start ? "action.disabled" : "success.dark"}
              />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Làm lại" arrow>
          <span>
            <IconButton onClick={handleResetCreateCaculation}>
              <Iconify
                width={50}
                icon="carbon:restart"
                color={"success.dark"}
              />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Chi tiết phép tính" arrow>
          <span>
            <IconButton onClick={handleNoti}>
              <Iconify width={50} color="success.dark" icon="mynaui:notification-solid" />
            </IconButton>
          </span>
        </Tooltip>

        {/* <Tooltip title="Báo cáo" arrow>
          <span>
            <IconButton onClick={handleReport} >
              <Iconify width={50} color="success.dark" icon="mdi:chart-bar" />
            </IconButton>
          </span>
        </Tooltip> */}
        

      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        sx={{ minWidth: 120 }}
      >
        <Typography fontWeight="bold">Cấp độ: {infoReport?.valueLesson}</Typography>
        <Typography fontWeight="bold">Độ dài phép tính: {infoReport?.calculationLength}</Typography>
      </Box>


      </Box>
    </Box>
  );
}
