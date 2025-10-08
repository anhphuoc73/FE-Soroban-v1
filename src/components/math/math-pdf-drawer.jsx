import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { jsPDF } from "jspdf";
import { Drawer, Button, Box, Typography } from "@mui/material";

export default function MathPDFDrawer({ open, onClose, exercises }) {
  // 🧮 Hàm tính kết quả
  const calcResult = (arr) => {
    // eslint-disable-next-line radix
    let total = parseInt(arr[0]);
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i < arr.length; i++) {
      const op = arr[i][0];
      // eslint-disable-next-line radix
      const num = parseInt(arr[i].slice(1));
      total = op === "+" ? total + num : total - num;
    }
    return total;
  };

  // 📋 Component xem trước
  const Preview = ({ ex }) => {
    const result = calcResult(ex);
    const nums = ex.map((x) => x.replace(/[+-]/, ""));
    const maxLen = Math.max(...nums.map((x) => x.length), String(result).length);

    return (
      <Box
        sx={{
          fontFamily: "monospace",
          mb: 2,
          display: "inline-block",
          minWidth: 80,
          textAlign: "right",
        }}
      >
        {ex.map((item, idx) => (
          <Typography key={idx} sx={{ lineHeight: "20px" }}>
            {item}
          </Typography>
        ))}
        <Box
          sx={{
            borderTop: "1px solid #000",
            width: 40,
            mt: 0.5,
            ml: "auto",
          }}
        />
        <Box sx={{ height: 10 }} />
      </Box>
    );
  };

  // 📄 Xuất ra file PDF
const exportPDF = () => {
  // eslint-disable-next-line new-cap
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  doc.setFont("courier");
  doc.setFontSize(14);

  const startX = 60;
  let startY = 80;
  const colWidth = 100; // khoảng cách giữa các bài
  const lineHeight = 18;
  const perRow = 5;
  const rowHeight = 100;
  const pageHeight = doc.internal.pageSize.getHeight();

  exercises.forEach((ex, index) => {
    const rowIndex = Math.floor(index / perRow);
    const colIndex = index % perRow;

    // điểm cuối bên phải của cột (để căn phải)
    const rightAlignX = startX + (colIndex + 1) * colWidth - 10;

    const calcY = startY + rowIndex * rowHeight;
    let y = calcY;

    // In từng dòng phép tính, căn phải
    ex.forEach((item) => {
      doc.text(item, rightAlignX, y, { align: "right" });
      y += lineHeight;
    });

    // Gạch ngang (nơi bé điền kết quả)
    doc.line(rightAlignX - 40, y - 4, rightAlignX, y - 4);

    // Khi in xong 1 hàng (5 bài)
    if ((index + 1) % perRow === 0) {
      const rowBottomY = calcY + 5 * lineHeight + 20;
      doc.line(startX - 10, rowBottomY, startX + perRow * colWidth - 30, rowBottomY);
      startY += rowHeight;

      // Nếu gần hết trang thì thêm trang mới
      if (startY > pageHeight - 100) {
        doc.addPage();
        startY = 80;
      }
    }
  });
  doc.save("baitoan.pdf");
};






  // 🧱 Render Drawer
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "80vw", sm: "70vw", md: "50vw" },
          height: "100vh",
          padding: 3,
        },
      }}
    >
      <Box>
        <Typography variant="h6" gutterBottom>
          📘 Danh sách bài toán
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: 2,
            mb: 3,
          }}
        >
          {exercises.map((ex, idx) => (
            <Preview key={idx} ex={ex} />
          ))}
        </Box>

        <Button
          variant="contained"
          onClick={exportPDF}
          sx={{
            backgroundColor: "#1976d2",
            color: "#fff",
            textTransform: "none",
          }}
        >
          📄 Xuất PDF
        </Button>
      </Box>
    </Drawer>
  );
}
