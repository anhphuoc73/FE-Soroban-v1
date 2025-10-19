import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { jsPDF } from "jspdf";
import { Drawer, Button, Box, Typography } from "@mui/material";
import { getProfileFromLS } from "src/utils/auth";

// eslint-disable-next-line import/no-extraneous-dependencies
import * as XLSX from "xlsx";
// eslint-disable-next-line import/no-extraneous-dependencies
import { saveAs } from "file-saver";

export default function MathPDFDrawer({ open, onClose, exercises }) {
  const profileLocalStorage = getProfileFromLS()
  const centerName = profileLocalStorage?.centerName || "TRUNG TÂM TOÁN TƯ DUY VINA SOROBAN"
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

  const title = centerName;
  const titleText = removeVietnameseTones(title); // ✅ bỏ dấu

  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFontSize(20);
  doc.text(titleText, pageWidth / 2, 50, { align: "center" }); // In tiêu đề không dấu

  const startX = 60;
  let startY = 100; // đẩy xuống dưới tiêu đề
  const colWidth = 100;
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



const exportExcel = () => {

  const data = [];

  // ✅ Tiêu đề
  data.push(["Toán tư duy Soroban"]);
  data.push([]); // dòng trống

  // ✅ Header
  data.push(["STT", "Bài toán"]);

  // ✅ Thêm nội dung bài toán
  exercises.forEach((ex, index) => {
    data.push([index + 1, ex.join(" ")]);
  });

  // ✅ Tạo worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // ✅ Merge tiêu đề
  worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];

  // ✅ Style cho toàn bảng
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  // eslint-disable-next-line no-plusplus
  for (let R = 0; R <= range.e.r; ++R) {
    // eslint-disable-next-line no-plusplus
    for (let C = 0; C <= range.e.c; ++C) {
      const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
      // eslint-disable-next-line no-continue
      if (!cell) continue;

      // Style cho tiêu đề
      if (R === 0) {
        cell.s = {
          font: { bold: true, sz: 18, color: { rgb: "1F497D" } },
          alignment: { horizontal: "center", vertical: "center" },
        };
      } else if (R === 2) {
        // Header
        cell.s = {
          font: { bold: true, sz: 13 },
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            top: { style: "thin", color: { rgb: "AAAAAA" } },
            bottom: { style: "thin", color: { rgb: "AAAAAA" } },
            left: { style: "thin", color: { rgb: "AAAAAA" } },
            right: { style: "thin", color: { rgb: "AAAAAA" } },
          },
        };
      } else if (R > 2) {
        // Nội dung
        cell.s = {
          font: { sz: 12 },
          alignment: { horizontal: C === 0 ? "center" : "left", vertical: "center" },
          border: {
            top: { style: "thin", color: { rgb: "DDDDDD" } },
            bottom: { style: "thin", color: { rgb: "DDDDDD" } },
            left: { style: "thin", color: { rgb: "DDDDDD" } },
            right: { style: "thin", color: { rgb: "DDDDDD" } },
          },
        };
      }
    }
  }

  // ✅ Đặt độ rộng cột
  worksheet["!cols"] = [{ wch: 5 }, { wch: 25 }];

  // ✅ Xuất file
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Bài tập");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, "baitoan.xlsx");
};



function removeVietnameseTones(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

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
        <Button
          variant="contained"
          onClick={exportExcel}
          sx={{
            backgroundColor: "#118d57",
            color: "#fff",
            textTransform: "none",
            ml: 1
          }}
        >
          📄 Xuất Excel
        </Button>
      </Box>
    </Drawer>
  );
}
