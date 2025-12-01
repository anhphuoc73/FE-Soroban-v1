import { FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import Box from '@mui/material/Box';

export function CustomSelectBasic({
  grid = { xs: 12, md: 6 },
  label, 
  value, 
  onChange, 
  options = [], 
  error = "",
  disabled = false,
}) {

  return (
    <Grid item xs={grid.xs} md={grid.md}>
      <Box sx={{ minWidth: 120 }}>
        <FormControl 
          fullWidth 
          margin="normal" 
          error={!!error}  
          disabled={disabled}
          sx={{ mt: 1, mb: 2 }}
        >
          <InputLabel id={`${label}-label`}>{label}</InputLabel>

          <Select
            labelId={`${label}-label`}
            value={value}
            onChange={onChange}
            label={label}
            disabled={disabled}
            sx={{
              "&.Mui-disabled": {
                color: "#555",                  // chữ sậm
              },
              "& .MuiSelect-icon": {
                color: disabled ? "#555" : "inherit", // icon sậm
              },
              backgroundColor: disabled ? "#f1f1f1" : "white", // nền xám nhẹ
            }}
          >
            {options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>

          {error && <Typography color="error">{error}</Typography>}
        </FormControl>
      </Box>
    </Grid>
  );
}
