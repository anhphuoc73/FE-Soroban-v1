import { Drawer, Box, Typography, Button, Divider, List, ListItem } from "@mui/material";

export function ResultDrawer({ open, onClose, total, correct, wrong, data = [] }) {
  return (
    <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        sx={{
            "& .MuiDrawer-paper": {
                width: {
                xs: "80%",   // mobile: chiếm 80% màn hình
                sm: "60%",   // tablet: chiếm 60%
                md: "40%",   // desktop nhỏ: chiếm 40%
                lg: "30%",   // desktop lớn: chiếm 30%
                },
                maxWidth: 600, // giới hạn max chiều rộng để không quá to
                borderRadius: {
                xs: 0, // mobile full width không cần bo góc
                sm: "12px 0 0 12px", // tablet trở lên bo góc
                },
                p: 3,
                display: "flex",
                flexDirection: "column",
            },
        }}
    >
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <Typography variant="h6" gutterBottom>
          Kết quả bài tập
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography>Tổng số câu hỏi: {total}</Typography>
        <Typography color="success.main">Số câu đúng: {correct}</Typography>
        <Typography color="error.main">Số câu sai: {wrong}</Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom>
          Chi tiết từng câu:
        </Typography>
        <List dense>
          {data.map((item) => (
            <ListItem key={item.id} sx={{ display: "block", mb: 1 }}>
              <Typography variant="body2">
                <b>Câu {item.id}:</b> {item.expression} = {item.resultExpression}
              </Typography>
              <Typography variant="body2">
                👉 Bạn nhập:{" "}
                {item.inputResult !== undefined ? item.inputResult : "Chưa làm"}{" "}
                ({item.result === 1 ? "✅ Đúng" : "❌ Sai"})
              </Typography>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ mt: "auto", pt: 2 }}>
        <Button
          onClick={onClose}
          fullWidth
          variant="contained"
          sx={{ backgroundColor: "#118D57" }}
        >
          Đóng
        </Button>
      </Box>
    </Drawer>
  );
}
