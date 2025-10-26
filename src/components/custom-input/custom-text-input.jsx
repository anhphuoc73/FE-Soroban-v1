import { Grid, TextField } from "@mui/material";
import { useState } from "react";

export function CustomTextInput({
  grid = { xs: 12, md: 6 },
  label,
  value,
  onChange,
  error = "",
  placeholder,
  required = false,
}) {
  const [localError, setLocalError] = useState("");

  const handleChange = (e) => {
    const val = e.target.value;

    // ✅ Nếu là required mà để trống => báo lỗi
    if (required && val.trim() === "") {
      setLocalError("Trường này không được để trống");
    } else {
      setLocalError("");
    }

    onChange({
      ...e,
      target: { ...e.target, value: val },
    });
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
        sx={{
          mt: 0.1,
          mb: 0.1,
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
