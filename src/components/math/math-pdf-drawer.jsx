import React from "react";
import { jsPDF } from "jspdf";
import { Drawer, Button, Box, Typography } from "@mui/material";
import { getProfileFromLS } from "src/utils/auth";
import "src/fonts/Roboto-Regular.js"; // ✅ Import font
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { info } from "src/theme/core";

export default function MathPDFDrawer({ open, onClose, exercises, infoDownload }) {
  //console.log("infoDownload infoDownload", infoDownload)
  const profileLocalStorage = getProfileFromLS();
  const centerName =
    profileLocalStorage?.centerName ||
    "PHIẾU RÈN LUYỆN";

  // 🧮 Hàm tính kết quả
  const calcResult = (arr) => {
    let total = parseInt(arr[0]);
    for (let i = 1; i < arr.length; i++) {
      const op = arr[i][0];
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

  const exportPDF = () => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  // ===== FONT =====
  doc.setFont("Roboto-Regular");
  doc.setFontSize(14);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  /* ===== TIÊU ĐỀ ===== */
  doc.setFontSize(20);
  doc.text(centerName, pageWidth / 2, 50, { align: "center" });

  /* ===== THÔNG TIN ===== */
  doc.setFontSize(13);
  doc.text(`Họ tên: ${infoDownload?.fullname ?? ""}`, 60, 80);
  doc.text(`Tên giáo viên: ${infoDownload?.teachername ?? ""}`, 60, 100);
  doc.text(`Cấp độ: ${infoDownload?.valueLesson ?? ""}`, 60, 120);

  /* ===== GẠCH PHÂN CÁCH ===== */
  const separatorY = 150;
  doc.line(50, separatorY, pageWidth - 50, separatorY);

  /* ===== CONFIG ===== */
  const startX = 60;
  let startY = separatorY + 20;
  const colWidth = 100;
  const lineHeight = 18;
  const perRow = 5;
  const rowPadding = 16; // khoảng thở giữa các bài

  /* ===== BÀI TOÁN ===== */
  for (let i = 0; i < exercises.length; i += perRow) {
    const rowExercises = exercises.slice(i, i + perRow);

    // số dòng lớn nhất trong hàng (+1 dòng kết quả)
    const maxLines = Math.max(
      ...rowExercises.map(ex => ex.length + 1)
    );

    rowExercises.forEach((ex, colIndex) => {
      const rightAlignX =
        startX + (colIndex + 1) * colWidth - 10;

      let y = startY;

      // vẽ các số
      ex.forEach(item => {
        doc.text(String(item), rightAlignX, y, { align: "right" });
        y += lineHeight;
      });

      // ===== gạch kết quả (sát số cuối) =====
      const underlineY = y - lineHeight * 0.5;

      doc.line(
        rightAlignX - 40,
        underlineY,
        rightAlignX,
        underlineY
      );
    });

    // ===== gạch ngang dưới hàng =====
    const contentHeight = maxLines * lineHeight;

    doc.line(
      startX - 10,
      startY + contentHeight,
      startX + perRow * colWidth - 30,
      startY + contentHeight
    );

    // ===== sang hàng mới (có padding) =====
    startY += contentHeight + rowPadding;

    // ===== sang trang =====
    if (startY > pageHeight - 100) {
      doc.addPage();
      startY = 80;
    }
  }

  doc.save("baitoan.pdf");
};

  

  // const exportPDF = () => {
  //   const doc = new jsPDF({ unit: "pt", format: "a4" });

  //   doc.setFont("Roboto-Regular");
  //   doc.setFontSize(14);

  //   const pageWidth = doc.internal.pageSize.getWidth();
  //   const pageHeight = doc.internal.pageSize.getHeight();

  //   /* ===== TIÊU ĐỀ ===== */
  //   doc.setFontSize(20);
  //   doc.text(centerName, pageWidth / 2, 50, { align: "center" });

  //   /* ===== THÔNG TIN ===== */
  //   doc.setFontSize(13);
  //   doc.text(`Họ tên: ${infoDownload?.fullname ?? ""}`, 60, 80);
  //   doc.text(`Tên giáo viên: ${infoDownload?.teachername ?? ""}`, 60, 100);
  //   doc.text(`Cấp độ: ${infoDownload?.valueLesson ?? ""}`, 60, 120);

  //   /* ===== GẠCH PHÂN CÁCH ===== */
  //   const separatorY = 150;
  //   doc.line(50, separatorY, pageWidth - 50, separatorY);

  //   /* ===== BÀI TOÁN ===== */
  //   const startX = 60;
  //   let startY = separatorY + 30; // ⭐ sát lên
  //   const colWidth = 100;
  //   const lineHeight = 18;
  //   const perRow = 5;
  //   const rowHeight = 5 * lineHeight + 30;

  //   exercises.forEach((ex, index) => {
  //     const colIndex = index % perRow;
  //     const rightAlignX = startX + (colIndex + 1) * colWidth - 10;

  //     let y = startY;

  //     ex.forEach((item) => {
  //       doc.text(String(item), rightAlignX, y, { align: "right" });
  //       y += lineHeight;
  //     });

  //     doc.line(rightAlignX - 40, y - 4, rightAlignX, y - 4);

  //     // ✅ KẾT THÚC 1 HÀNG
  //     if ((index + 1) % perRow === 0) {
  //       const rowBottomY = startY + 5 * lineHeight + 10;
  //       doc.line(
  //         startX - 10,
  //         rowBottomY,
  //         startX + perRow * colWidth - 30,
  //         rowBottomY
  //       );

  //       startY += rowHeight; // ⭐ CHỈ TĂNG Ở ĐÂY

  //       if (startY > pageHeight - 120) {
  //         doc.addPage();
  //         startY = 80;
  //       }
  //     }
  //   });

  //   doc.save("baitoan.pdf");
  // };


// const exportPDF = () => {
//   const doc = new jsPDF({ unit: "pt", format: "a4" });

//   doc.setFont("Roboto-Regular");
//   doc.setFontSize(14);

//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();

//   /* ===== TIÊU ĐỀ ===== */
//   doc.setFontSize(20);
//   doc.text(centerName, pageWidth / 2, 50, { align: "center" });

//   /* ===== THÔNG TIN ===== */
//   doc.setFontSize(13);
//   doc.text(`Họ tên: ${infoDownload?.fullname ?? ""}`, 60, 80);
//   doc.text(`Tên giáo viên: ${infoDownload?.teachername ?? ""}`, 60, 100);
//   doc.text(`Cấp độ: ${infoDownload?.valueLesson ?? ""}`, 60, 120);

//   /* ===== GẠCH PHÂN CÁCH ===== */
//   const separatorY = 150;
//   doc.line(50, separatorY, pageWidth - 50, separatorY);

//   /* ===== CONFIG ===== */
//   const startX = 60;
//   let startY = separatorY + 20;
//   const colWidth = 100;
//   const lineHeight = 18;
//   const perRow = 5;
//   const rowPadding = 16; // ⭐ THÊM KHOẢNG THỞ

//   /* ===== BÀI TOÁN ===== */
//   for (let i = 0; i < exercises.length; i += perRow) {
//     const rowExercises = exercises.slice(i, i + perRow);

//     const maxLines = Math.max(
//       ...rowExercises.map(ex => ex.length + 1) // +1 dòng kết quả
//     );

//     rowExercises.forEach((ex, colIndex) => {
//       const rightAlignX =
//         startX + (colIndex + 1) * colWidth - 10;

//       let y = startY;

//       ex.forEach(item => {
//         doc.text(String(item), rightAlignX, y, { align: "right" });
//         y += lineHeight;
//       });

//       // gạch ghi kết quả
//       doc.line(
//         rightAlignX - 40,
//         y + 4,
//         rightAlignX,
//         y + 4
//       );
//     });

//     // gạch ngang dưới bài toán
//     const contentHeight = maxLines * lineHeight;

//     doc.line(
//       startX - 10,
//       startY + contentHeight,
//       startX + perRow * colWidth - 30,
//       startY + contentHeight
//     );

//     // ⭐ cộng thêm padding để KHÔNG dính nhau
//     startY += contentHeight + rowPadding;

//     // sang trang
//     if (startY > pageHeight - 100) {
//       doc.addPage();
//       startY = 80;
//     }
//   }

//   doc.save("baitoan.pdf");
// };



  const exportExcel = () => {
    const data = [];

    // Tiêu đề
    data.push(["PHIẾU RÈN LUYỆN"]);
    data.push([`Họ tên: ${infoDownload?.fullname || ""}`]);
    data.push([`Tên giáo viên: ${infoDownload?.teachername || ""}`]);
    data.push([`Cấp độ: ${infoDownload?.valueLesson || ""}`]);
    data.push([]);

    const maxColsPerRow = 20; // 20 cột mỗi nhóm
    const rowsPerExercise = Math.max(...exercises.map(ex => ex.length));

    let currentCol = 0;

    // Trả về số nguyên (KHÔNG thêm dấu + ở đây)
    const formatNumber = (num) => {
      if (num === "" || num === null || num === undefined) return "";
      const n = Number(num);
      if (isNaN(n)) return num; // nếu không phải số
      return n;
    };

    // Chuẩn bị dữ liệu 2D
    exercises.forEach((exercise, exerciseIndex) => {
      // Nếu vượt quá 20 cột → xuống nhóm mới
      if (exerciseIndex % maxColsPerRow === 0) {
        if (exerciseIndex !== 0) {
          data.push([]);
          data.push([]);
        }

        // Tạo block mới
        for (let r = 0; r < rowsPerExercise; r++) {
          data.push(new Array(maxColsPerRow).fill(""));
        }

        currentCol = 0;
      }

      // Ghi từng dòng
      for (let r = 0; r < rowsPerExercise; r++) {
        const rowIndex = data.length - rowsPerExercise + r;
        data[rowIndex][currentCol] = formatNumber(exercise[r] ?? "");
      }

      currentCol++;
    });

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const headerRowCount = 4; // số dòng cần trộn

    worksheet["!merges"] = worksheet["!merges"] || [];

    for (let r = 0; r < headerRowCount; r++) {
      worksheet["!merges"].push({
        s: { r, c: 0 },
        e: { r, c: maxColsPerRow - 1 },
      });
    }

    // Styling
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let R = 0; R <= range.e.r; ++R) {
      for (let C = 0; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = worksheet[cellAddress];
        if (!cell) continue;

        if (R === 0) {
          // Tiêu đề
          cell.s = {
            font: { bold: true, sz: 18, color: { rgb: "1F497D" } },
            alignment: { horizontal: "center", vertical: "center" },
          };
        } else if (R > 1) {
          // Nếu là số → để Excel hiểu đúng
          if (!isNaN(cell.v) && cell.v !== "") {
            cell.t = "n"; // ép kiểu number
          }

          // Style chung
          cell.s = {
            font: { sz: 13 },
            alignment: {
              horizontal: "right",
              vertical: "center",
            },
            border: {
              top: { style: "thin", color: { rgb: "DDDDDD" } },
              bottom: { style: "thin", color: { rgb: "DDDDDD" } },
              left: { style: "thin", color: { rgb: "DDDDDD" } },
              right: { style: "thin", color: { rgb: "DDDDDD" } },
            },
            // ⭐ Quan trọng: Excel tự thêm dấu + và căn thẳng hàng
            numFmt: "+0;-0;0",
          };
        }
      }
    }

    // Set width
    worksheet["!cols"] = Array(maxColsPerRow).fill({ wch: 8 });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bài tập");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "baitoan.xlsx");
  };


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
      <Button
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          minWidth: "36px",
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          backgroundColor: "#f44336",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "16px",
          "&:hover": {
            backgroundColor: "#d32f2f",
          },
        }}
      >
    ×
  </Button>
      <Box>
        <Typography variant="h6" gutterBottom>
          📘 Danh sách bài toán
        </Typography>
        <Box>
        <Button
          variant="contained"
          onClick={exportPDF}
          sx={{
            backgroundColor: "#1976d2",
            color: "#fff",
            textTransform: "none",
            mr: 1,
          }}
        >
          📄 PDF
        </Button>
        <Button
          variant="contained"
          onClick={exportExcel}
          sx={{
            backgroundColor: "#118d57",
            color: "#fff",
            textTransform: "none",
          }}
        >
          📊 Excel
        </Button>
      </Box>

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

        {/* <Button
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
            ml: 1,
          }}
        >
          📄 Xuất Excel
        </Button> */}
      </Box>
    </Drawer>
  );
}
