import * as React from "react";
import {
  Box,
  Drawer,
  Button,
  Divider,
  Typography,
} from "@mui/material";
// eslint-disable-next-line import/no-unresolved
import { Iconify } from "src/components/iconify";

export function ShowCaculatorAuto({
  open,
  setOpen,
  stringNumber,
  caculation,
  keyLesson,
}) {
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  /* ===== CHUẨN HÓA CHUỖI HIỂN THỊ ===== */

  // Mode text thường
  const textDisplay = React.useMemo(() => {
    if (!stringNumber) return "";
    return stringNumber.replace(/=\s*(-?\d+)/g, "=$1\n");
  }, [stringNumber]);

  // Mode HTML
  const htmlDisplay = React.useMemo(() => {
    if (!stringNumber) return "";
    return stringNumber.replace(/=\s*(-?\d+)/g, "=$1<br/>");
  }, [stringNumber]);

  const DrawerList = (
    <Box
      sx={{
        width: {
          xs: "80vw",
          sm: "70vw",
          md: "50vw",
          lg: "40vw",
        },
        maxWidth: "550px",
        display: "flex",
        flexDirection: "column",
        pt: 3,
        pl: 3,
        pr: 3,
        whiteSpace: "normal",
        wordWrap: "break-word",
        overflowX: "hidden",
        flexGrow: 1,
      }}
      role="presentation"
    >
      <Typography
        sx={{
          fontSize: 30,
          fontWeight: "bold",
          color: "success.dark",
          whiteSpace: "pre-line", // ⭐ RẤT QUAN TRỌNG
          wordBreak: "break-word",
        }}
      >
        {caculation == 1 ? (
          textDisplay
        ) : (
          <span dangerouslySetInnerHTML={{ __html: htmlDisplay }} />
        )}
      </Typography>
    </Box>
  );

  return (
    <Box>
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: {
              xs: "80vw",
              sm: "70vw",
              md: "30vw",
              lg: "20vw",
            },
            maxWidth: "550px",
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* ===== HEADER ===== */}
        <Box
          sx={{
            p: 2,
            backgroundColor: "#118D57",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Trung tâm toán tư duy Vina Soroban
          </Typography>
        </Box>

        <Divider />

        {/* ===== NỘI DUNG ===== */}
        {DrawerList}

        {/* ===== NÚT ĐÓNG ===== */}
        <Box
          sx={{
            p: 2,
            textAlign: "center",
            borderTop: "1px solid #eee",
          }}
        >
          <Button
            variant="contained"
            onClick={toggleDrawer(false)}
            fullWidth
            sx={{
              fontWeight: 600,
              py: 1.2,
              backgroundColor: "#118D57",
            }}
          >
            Đóng
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}
