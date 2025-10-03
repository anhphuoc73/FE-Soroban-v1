import { FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import Box from '@mui/material/Box';



export function CustomSelectBasic({
  grid = { xs: 12, md: 6 },  // mặc định chiếm nửa dòng
  label, 
  value, 
  onChange, 
  options = [], 
  error = "" 
}) {

  return (
    <Grid item xs={grid.xs} md={grid.md}>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth margin="normal" error={!!error}>
          <InputLabel id={`${label}-label`}>{label}</InputLabel>
          <Select
            labelId={`${label}-label`}
            value={value}
            onChange={onChange}
            label={label}
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