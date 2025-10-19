import React, { useRef, useEffect } from "react";
import { Box, TextField, IconButton, Tooltip } from "@mui/material";
import { Iconify } from "../iconify"; // tuỳ đường dẫn của bạn

export default function ActionMath({
  resultEqua,
  handleOnchangeEqua,
  handleEqual,
  handleCreateCalculation,
  handleNoti,
  equal,
  start,
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
      {/* Ô nhập */}
      {/* <TextField
        inputRef={inputRef}
        label="Trả lời"
        variant="outlined"
        type="number"
        value={resultEqua}
        onChange={handleOnchangeEqua}
        // disabled={equal}
        autoFocus={!equal}
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

      <TextField
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
      />

      {/* Nhóm 3 nút nằm trên 1 hàng */}
      <Box display="flex" gap={2}>
        <Tooltip title="Trả lời" arrow>
          <span>
            <IconButton onClick={handleEqual} disabled={equal}>
              <Iconify
                width={50}
                icon="akar-icons:equal"
                color={equal ? "action.disabled" : "success.dark"}
              />
            </IconButton>
          </span>
        </Tooltip>

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

        <Tooltip title="Chi tiết phép tính" arrow>
          <span>
            <IconButton onClick={handleNoti}>
              <Iconify width={50} color="success.dark" icon="mynaui:notification-solid" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
}
