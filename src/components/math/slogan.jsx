import { Box, Typography } from "@mui/material";

export function Slogan() {
  const words = ["TƯ", "DUY", "TỐT", "-", "TÍNH", "TOÁN", "NHANH"];

  return (
    <Box
      sx={{
        backgroundColor: "#ffebee",     // nền đỏ nhạt
        border: "2px solid #d32f2f",    // viền đỏ
        borderRadius: 2,
        padding: "8px 16px",
        display: "flex",
        flexDirection: "column",        // 👈 xếp theo chiều dọc
        alignItems: "center",
        justifyContent: "center",
        width: "120px",
      }}
    >
      {words.map((word, index) => (
        <Typography
          key={index}
          sx={{
            fontSize: { xs: "18px", md: "26px" },
            fontWeight: "bold",
            letterSpacing: 0.5,
            color: "#b71c1c",
          }}
        >
          {word}
        </Typography>
      ))}
    </Box>
  );
}
