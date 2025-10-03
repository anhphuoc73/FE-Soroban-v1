import { Alert, Snackbar } from "@mui/material";

const CustomSnackbar = ({ open, onClose, message, severity = "success", autoHideDuration = 3000 }) => (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }} // Hiển thị góc phải trên
    >
      <Alert severity={severity} onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  );

export default CustomSnackbar;
