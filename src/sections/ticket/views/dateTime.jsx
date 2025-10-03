import React, { useState } from "react";
import { Box, Button, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const DateRangePicker = () => {
  const [fromDate, setFromDate] = useState(dayjs("2025-01-02T00:00:00"));
  const [toDate, setToDate] = useState(dayjs("2025-02-20T00:00:00"));
  const [mode, setMode] = useState("date-time"); // Chế độ Ngày hoặc Ngày giờ

  const handleSuggestion = (type) => {
    const now = dayjs();
    switch (type) {
      case "today":
        setFromDate(now.startOf("day"));
        setToDate(now.endOf("day"));
        break;
      case "yesterday":
        setFromDate(now.subtract(1, "day").startOf("day"));
        setToDate(now.subtract(1, "day").endOf("day"));
        break;
      case "thisWeek":
        setFromDate(now.startOf("week"));
        setToDate(now.endOf("week"));
        break;
      case "lastWeek":
        setFromDate(now.subtract(1, "week").startOf("week"));
        setToDate(now.subtract(1, "week").endOf("week"));
        break;
      case "thisMonth":
        setFromDate(now.startOf("month"));
        setToDate(now.endOf("month"));
        break;
      case "lastMonth":
        setFromDate(now.subtract(1, "month").startOf("month"));
        setToDate(now.subtract(1, "month").endOf("month"));
        break;
      default:
        break;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          width: 500,
          p: 3,
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Ngày tạo
          </Typography>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(e, newMode) => newMode && setMode(newMode)}
            size="small"
          >
            <ToggleButton value="date">Ngày</ToggleButton>
            <ToggleButton value="date-time">Ngày giờ</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Date Range Picker */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            border: "1px solid #ccc",
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
          }}
        >
          <DateTimePicker
            value={fromDate}
            onChange={setFromDate}
            format="HH:mm DD/MM/YYYY"
            hideOpenPickerButton
            slotProps={{ textField: { variant: "standard", size: "small", sx: { width: 130 } } }}
          />
          <Typography>→</Typography>
          <DateTimePicker
            value={toDate}
            onChange={setToDate}
            format="HH:mm DD/MM/YYYY"
            hideOpenPickerButton
            slotProps={{ textField: { variant: "standard", size: "small", sx: { width: 130 } } }}
          />
          {/* <CalendarMonthIcon sx={{ color: "#666" }} /> */}
        </Box>

        {/* Suggested Date Buttons */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
          {[
            { label: "Hôm nay", type: "today" },
            { label: "Hôm qua", type: "yesterday" },
            { label: "Tuần này", type: "thisWeek" },
            { label: "Tuần trước", type: "lastWeek" },
            { label: "Tháng này", type: "thisMonth" },
            { label: "Tháng trước", type: "lastMonth" },
          ].map((item) => (
            <Button
              key={item.type}
              variant="outlined"
              size="small"
              onClick={() => handleSuggestion(item.type)}
              sx={{ textTransform: "none", fontSize: "0.875rem" }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button variant="contained" color="primary" sx={{ textTransform: "none", mr: 1 }}>
            Áp dụng
          </Button>
          <Button variant="outlined" sx={{ textTransform: "none" }}>
            Đóng
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default DateRangePicker;
