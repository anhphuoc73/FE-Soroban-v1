import { Drawer, Box, Typography, IconButton, useMediaQuery, Card, List, ListItem } from '@mui/material';

import { useTheme } from '@mui/material/styles';
import { Close } from '@mui/icons-material';
// import { RenderCellDate } from 'src/components/table';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ConfigMathApi } from 'src/apis/configMath-api';
import { DataGrid } from '@mui/x-data-grid';

import {
  Table,
  useTable,
  TableToolbar,
  RenderCellTitle,
  RenderCellDate,
  RenderCellAction,
  RenderCellDetailMathAction,
  TablePaginationCustom,
  RenderCellTitleTooltip,
  RenderCellActive,
  RenderCellPosition,
// eslint-disable-next-line import/no-duplicates
} from 'src/components/table/index'

export default function HistoryDetailMath({ open, onClose, dataMath }) {
  console.log("dataMath", dataMath)
  const theme = useTheme();
  const [searching, setSearching] = useState('');
  const [filters, setFilters] = useState({});
  const table = useTable({ defaultRowsPerPage: 10 });
  // const defaultValue = {
  //   page: table.page + 1,
  //   limit: table.rowsPerPage,
  //   search: searching,
  //   filters,
  //   userId: idStaff
  // }

  // const columns = [
  //   {
  //     field: 'createdAt',
  //     headerName: 'Ngày làm',
  //     minWidth: 200,
  //     filterable: false,
  //     sortable: true,
  //     disableColumnMenu: true,
  //     renderCell: (params) => (
  //       <RenderCellDate
  //         title={params.row.createdAt}
  //       />
  //     ),
  //   },
  //   {
  //     field: 'totalCorrect',
  //     headerName: 'Số câu đúng',
  //     minWidth: 200,
  //     filterable: false,
  //     sortable: true,
  //     disableColumnMenu: true,
  //     renderCell: (params) => (
  //       <RenderCellTitle
  //         title={params.row.totalCorrect}
  //       />
  //     ),
  //   },
  //   {
  //     field: 'totalWrong',
  //     headerName: 'Số câu sai',
  //     minWidth: 200,
  //     filterable: false,
  //     sortable: true,
  //     disableColumnMenu: true,
  //     renderCell: (params) => (
  //       <RenderCellTitle
  //         title={params.row.totalWrong}
  //       />
  //     ),
  //   },
  //   {
  //     type: 'actions',
  //     field: 'actions',
  //     headerName: 'Tác vụ ',
  //     align: 'center',
  //     headerAlign: 'center',
  //     width: 200,
  //     sortable: false,
  //     filterable: false,
  //     disableColumnMenu: true,
  //     renderCell: (params) => (
  //       <RenderCellDetailMathAction
  //         // onOpenEdit={() => handleOpenEdit(params.row)}
  //         onOpenDetailHistoryMath={() => handleOpenDetailHistoryMath(params.row)}
  //         // params={params.row}
  //       />
  //     ),
  //   },
  // ];

  // const listHistoryMathQuery = useQuery({
  //   queryKey: ['history-math',defaultValue],
  //   queryFn: () => ConfigMathApi.historyMathByUser(defaultValue),
  //   // enabled: !!idStaff
  // })

  // const data = (listHistoryMathQuery?.data?.data?.metadata?.data.map(item => ({
  //   id: item._id,
  //   ...item
  // }))) || []
  // const total = listHistoryMathQuery?.data?.data?.metadata?.total || 0

  

 

  

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: {
            xs: '100vw',  // full màn hình trên mobile
            sm: '100vw',  // vẫn full màn hình tablet nhỏ
            md: '80vw',   // gần full trên laptop
            lg: '70vw',   // rộng 80% trên desktop lớn
          },
          height: '100vh',  // luôn full chiều cao
          borderRadius: 0,
          p: { xs: 1.5, sm: 2, md: 3 }, // padding responsive
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight="bold">
          Chi tiết lịch sử làm bài tập
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

   
        
      
        <List dense>
          {Array.isArray(dataMath) && dataMath.length > 0 ? (
            dataMath.map((item, index) => (
              <ListItem
                key={item._id || index}
                sx={{
                  display: "block",
                  mb: 1.5,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: item.result === 1 ? "success.lighter" : "error.lighter",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <Typography variant="body2" fontWeight={600}>
                  Câu {index + 1}: {item.expression} = {item.resultExpression}
                </Typography>

                <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                  <Typography variant="body2">
                    👉 Bạn nhập:{" "}
                    {item.inputResult !== undefined ? item.inputResult : "Trống"}
                  </Typography>

                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color={item.result === 1 ? "success.main" : "error.main"}
                  >
                    {item.result === 1 ? "✅ Đúng" : "❌ Sai"}
                  </Typography>
                </Box>
              </ListItem>
            ))
          ) : (
            <Typography variant="body2">Không có dữ liệu phép tính</Typography>
          )}
          </List>


  
    </Drawer>
  );
}
