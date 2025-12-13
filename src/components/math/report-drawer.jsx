import * as React from "react";
import {
  Box,
  Drawer,
  Button,
  Divider,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from "@mui/material";
import { Iconify } from "src/components/iconify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "src/fonts/Roboto-Regular.js"; 

export function ReportDrawer({ 
  report, 
  setReport, 
  content, 
  infoReport, 
  setLogMath, 
  logMath, 
  numberQuestion,
  caculation, 
  keyLesson
 }) {
  
  const toggleDrawer = (newOpen) => () => {
     setReport(newOpen);

    // ✅ Khi Drawer đóng thì xóa localStorage logFingerMath
    if (!newOpen) {
      if(infoReport?.mathTypeName === "FingerMath"){
        if(logMath.length >= +numberQuestion){
          localStorage.removeItem("logFingerMath");
          setLogMath([])
        }
        
      }
      if(infoReport?.mathTypeName === "Soroban"){
        if(logMath.length >= +numberQuestion){
          localStorage.removeItem("logSorobanMath");
          setLogMath([])
        }
      }
    }
  };

  const correctCount = React.useMemo(
    () => content?.filter((item) => item.result === 1).length || 0,
    [content]
  );

  const wrongCount = React.useMemo(
    () => content?.filter((item) => item.result === 0).length || 0,
    [content]
  );

  // ✅ Thông tin tổng hợp
  const summary = {
    date: "27/10/2025",
    name: infoReport?.fullname,
    subject: infoReport?.mathTypeName,
    level: infoReport?.valueLesson,
    operations: "+ ; -",
    timePerQuestion: infoReport?.timePerCalculation,
    digits1: infoReport?.firstNumber,
    digits2: infoReport?.secondNumber,
    totalQuestions: infoReport?.numberQuestion,
    expressionLength: infoReport?.calculationLength,
    correct: 0,
    wrong: 4,
  };

  // ✅ Hàm xuất PDF
   const handleExportPDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    // --- Đặt font tiếng Việt (Roboto-Regular.js đã import ở đầu file)
    doc.setFont("Roboto-Regular", "normal");
    doc.setFontSize(20);

    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text("PHIẾU RÈN LUYỆN", pageWidth / 2, 50, { align: "center" });

    doc.setFontSize(13);
    let y = 80;

  // --- Thông tin tổng hợp ---
    const infoLeft = [
      `Ngày báo cáo: ${summary.date}`,
      `Họ tên: ${summary.name}`,
      `Cấp độ: ${summary.level}`,
      `Phép tính: ${summary.operations}`,
      `Thời gian: ${summary.timePerQuestion} (giây/1 phép tính)`,
      `Kết quả đúng: ${correctCount}/${summary.totalQuestions} đúng`
    ];

    const infoRight = [
      `Môn thi: ${summary.subject}`,
      `Chữ số 1: ${summary.digits1}`,
      `Chữ số 2: ${summary.digits2}`,
      `Tổng số câu: ${summary.totalQuestions}`,
      `Độ dài phép tính: ${summary.expressionLength}`,
      `Kết quả sai: ${wrongCount}/${summary.totalQuestions} sai`,
    ];

    // --- Hai cột thông tin ---
    infoLeft.forEach((line, i) => {
      doc.text(line, 50, y + i * 18);
    });
    infoRight.forEach((line, i) => {
      doc.text(line, pageWidth / 2 + 20, y + i * 18);
    });

    // --- Bảng dữ liệu ---
    y += 130;
    doc.setFontSize(15);
    doc.text("DỮ LIỆU CHI TIẾT", 50, y);

    const tableData = content.map((row, idx) => [
      idx + 1,
      row.expression,
      row.resultExpression,
      row.inputResult,
      row.result ? "Đúng" : "Sai",
    ]);

    doc.setFont("Roboto-Regular", "normal");

    // --- gọi autoTable với force font cho head bằng didParseCell
    autoTable(doc, {
      head: [["STT", "Biểu thức", "Kết quả đúng", "Kết quả nhập", "Kết quả"]],
      body: tableData,
      startY: y + 10,
      styles: {
        font: "Roboto-Regular",
        fontSize: 11,
        cellPadding: 4,
        overflow: "linebreak",
      },
      headStyles: {
        // dùng normal nếu bạn chưa import font bold
        font: "Roboto-Regular",
        fontStyle: "normal",
        fillColor: [240, 240, 240],
        textColor: 20,
      },
      bodyStyles: {
        font: "Roboto-Regular",
        textColor: 20,
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 40 },
        1: { cellWidth: 140 },
        2: { cellWidth: 110 },
        3: { cellWidth: 110 },
        4: { halign: "center", cellWidth: 70 },
      },
      // BẮT BUỘC: ép autoTable áp dụng đúng font cho từng ô
      didParseCell: function (data) {
        // data.section === 'head' | 'body' | 'foot'
        if (data.section === "head") {
          data.cell.styles.font = "Roboto-Regular";
          data.cell.styles.fontStyle = "normal"; // đổi sang 'bold' chỉ khi bạn import font bold
        } else {
          data.cell.styles.font = "Roboto-Regular";
          data.cell.styles.fontStyle = "normal";
        }
      },
      didDrawPage: () => {
        // Giữ font giữa các trang
        doc.setFont("Roboto-Regular", "normal");
      },
    });

    // --- Xuất file ---
    const safeName = summary.name?.replace(/[^\p{L}\p{N}_-]/gu, "_") || "hoc_sinh";
    doc.save(`BaoCao_${safeName}_${summary.date}.pdf`);
  };



  // ✅ Nội dung Drawer
  const DrawerList = (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1000px",
        display: "flex",
        flexDirection: "column",
        p: 3,
        flexGrow: 1,
        overflowX: "hidden",
        margin: "0 auto",
      }}
      role="presentation"
    >
      {/* Tiêu đề */}
      <Typography
        sx={{
          fontSize: 28,
          fontWeight: "bold",
          color: "primary.main",
          mb: 2,
          textAlign: "center",
        }}
      >
        PHIẾU RÈN LUYỆN
      </Typography>

      {/* Thông tin */}
      <Box
        sx={{
          backgroundColor: "#fafafa",
          borderRadius: 2,
          p: 2,
          mb: 3,
          border: "1px solid #eee",
        }}
      >
        <Grid container spacing={1.5}>
          <Grid item xs={6}><Typography>Ngày báo cáo: <b>{summary.date}</b></Typography></Grid>
          <Grid item xs={6}><Typography>Họ tên: <b>{summary.name}</b></Typography></Grid>
          <Grid item xs={6}><Typography>Môn thi: <b>{summary.subject}</b></Typography></Grid>
          <Grid item xs={6}><Typography>Cấp độ: <b>{summary.level}</b></Typography></Grid>
          <Grid item xs={6}><Typography>Phép tính: <b>{summary.operations}</b></Typography></Grid>
          <Grid item xs={6}><Typography>Thời gian: <b>{summary.timePerQuestion} (giây/1 phép tính)</b></Typography></Grid>
          <Grid item xs={6}><Typography>Số chữ số 1: <b>{summary.digits1}</b></Typography></Grid>
          <Grid item xs={6}><Typography>Số chữ số 2: <b>{summary.digits2}</b></Typography></Grid>
          <Grid item xs={6}><Typography>Tổng số câu: <b>{summary.totalQuestions}</b></Typography></Grid>
          <Grid item xs={6}><Typography>Độ dài phép tính: <b>{summary.expressionLength}</b></Typography></Grid>
          <Grid item xs={6}><Typography>Số câu đúng: <b>{correctCount}/{summary.totalQuestions}</b></Typography></Grid>
          <Grid item xs={6}><Typography>Số câu sai: <b>{wrongCount}/{summary.totalQuestions}</b></Typography></Grid>
        </Grid>
      </Box>

      {/* Bảng */}
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        Dữ liệu chi tiết:
      </Typography>

      {content && content.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            maxHeight: "60vh",
            overflowY: "auto",
            width: "100%",
          }}
        >
          <Table
            stickyHeader
            sx={{
              minWidth: "950px",
              "& .MuiTableCell-root": {
                fontSize: 16,
                py: 2,
                px: 2,
              },
              "& .MuiTableHead-root .MuiTableCell-root": {
                backgroundColor: "#f3f3f3",
                fontWeight: "bold",
                fontSize: 17,
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Biểu thức</TableCell>
                <TableCell>Kết quả đúng</TableCell>
                <TableCell>Kết quả nhập</TableCell>
                <TableCell>Kết quả</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {content.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{idx + 1}</TableCell>
                  {/* <TableCell>{row.expression}</TableCell> */}
                  <TableCell>
                    {(() => {
                      const allowed = [500, 501, 503, 504];

                      // caculation === 1 -> render HTML bình thường (hiện được mũ)
                      if (caculation === 1) {
                        return <span dangerouslySetInnerHTML={{ __html: row.expression }} />;
                      }

                      // caculation === 2 -> thay bằng bình phương / lập phương nếu đúng keyLesson
                      if (caculation === 2 && allowed.includes(keyLesson)) {
                        const match = row.expression.match(/(\d+)<sup>(\d+)<\/sup>/);

                        if (match) {
                          const base = match[1];
                          const exp = match[2];

                          if (exp === "2") return `${base} bình phương = ?`;
                          if (exp === "3") return `${base} lập phương = ?`;
                        }
                      }

                      // mặc định -> vẫn render HTML (để hiện mũ)
                      return <span dangerouslySetInnerHTML={{ __html: row.expression }} />;
                    })()}
                  </TableCell>

                  <TableCell>{row.resultExpression}</TableCell>
                  <TableCell>{row.inputResult}</TableCell>
                  <TableCell
                    sx={{
                      color: row.result ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {row.result ? "✅ Đúng" : "❌ Sai"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography textAlign="center" mt={2}>
          Không có dữ liệu để hiển thị
        </Typography>
      )}
    </Box>
  );

  return (
    <Box>
      <Drawer
        anchor="right"
        open={report}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: {
              xs: "90vw",
              sm: "80vw",
              md: "75vw",
              lg: "1000px",
            },
            maxWidth: "1000px",
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            backgroundColor: "primary.main",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Iconify icon="mdi:chart-bar" width={26} />
            <Typography variant="h6" fontWeight={600}>
              Báo cáo thống kê
            </Typography>
          </Box>
          {caculation === 1 && (
            <Button
              onClick={handleExportPDF}
              variant="contained"
              color="secondary"
              sx={{
                backgroundColor: "#fff",
                color: "primary.main",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#e0e0e0" },
              }}
            >
              Xuất PDF
            </Button>
          )}
          
        </Box>

        <Divider />
        {DrawerList}

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            textAlign: "center",
            borderTop: "1px solid #eee",
          }}
        >
          <Button
            variant="contained"
            fullWidth
            onClick={toggleDrawer(false)}
            sx={{
              fontWeight: 600,
              py: 1.2,
              backgroundColor: "primary.main",
              "&:hover": { backgroundColor: "primary.dark" },
            }}
          >
            Đóng
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}
