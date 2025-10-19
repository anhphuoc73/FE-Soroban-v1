import { Grid, TextField } from "@mui/material";

export function CustomNumberInput({
  grid = { xs: 12, md: 6 },
  label,
  value,
  onChange,
  error = "",
  placeholder,
}) {
  const handleChange = (e) => {
    const val = e.target.value;

    // Cho phép trống hoặc số >= 0
    if (val === "" || (/^\d+$/.test(val) && Number(val) >= 0)) {
      onChange({
        ...e,
        target: { ...e.target, value: val === "" ? "" : val },
      });
    }
  };

  return (
    <Grid item xs={grid.xs} md={grid.md}>
      <TextField
        fullWidth
        // Dùng type="text" để không tự ép về 0
        type="text"
        label={label}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        error={Boolean(error)}
        helperText={error || " "}
        margin="normal"
        inputProps={{
          inputMode: "numeric", // vẫn mở bàn phím số trên di động
          pattern: "[0-9]*",
          onKeyDown: (e) => {
            if (["e", "E", "+", "-", ".", ","].includes(e.key)) {
              e.preventDefault();
            }
          },
        }}
        sx={{
          "& .MuiFormHelperText-root": {
            marginLeft: "0",
            fontSize: "0.8rem",
            color: error ? "error.main" : "text.secondary",
          },
        }}
      />
    </Grid>
  );
}
