import { Grid, TextField } from "@mui/material";
import { useState } from "react";

export function CustomFloatInput({
  grid = { xs: 12, md: 6 },
  label,
  value,
  onChange,
  error = "",
  placeholder,
  requiredMessage = "Giá trị phải là số thực dương lớn hơn 0",
}) {
  const [localError, setLocalError] = useState("");

  const handleChange = (e) => {
    const val = e.target.value.trim();

    // ✅ Cho phép rỗng hoặc số thực dương (vd: 1, 1.5, 0.25)
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      const num = Number(val);

      // ✅ Nếu rỗng hoặc <= 0 thì báo lỗi
      // eslint-disable-next-line no-restricted-globals
      if (val === "" || isNaN(num) || num <= 0) {
        setLocalError(requiredMessage);
      } else {
        setLocalError("");
      }

      onChange({
        ...e,
        target: { ...e.target, value: val },
      });
    }
  };

  const showError = localError || error;

  return (
    <Grid item xs={grid.xs} md={grid.md}>
      <TextField
        fullWidth
        type="text"
        label={label}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        error={Boolean(showError)}
        helperText={showError || " "}
        margin="normal"
        inputProps={{
          inputMode: "decimal", // mở bàn phím có dấu thập phân trên mobile
          pattern: "[0-9.]*",
          onKeyDown: (e) => {
            if (["e", "E", "+", "-", ","].includes(e.key)) {
              e.preventDefault();
            }
          },
        }}
        sx={{
          mt: 0.1, // margin-top nhỏ hơn (mặc định ~2)
          mb: 0.1, // margin-bottom nhỏ hơn
          "& .MuiFormHelperText-root": {
            marginLeft: 0,
            fontSize: "0.8rem",
            color: showError ? "error.main" : "text.secondary",
          },
        }}
      />
    </Grid>
  );
}
