import { Drawer, Box, Typography, IconButton, useMediaQuery, Card } from '@mui/material';

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
import HistoryDetailMath from './history-detail-math-drawer';


export default function HistoryMath({ open, onClose, idStaff }) {
  const theme = useTheme();
  const [searching, setSearching] = useState('');
  const [filters, setFilters] = useState({});

  const [openHistoryDetail, setOpenHistoryDetail] = useState(false);
  const [closeHistoryDetail, setCloseHistoryDetail] = useState(true);

  const [dataMath, setDataMath] = useState({})

  const table = useTable({ defaultRowsPerPage: 10 });
  const defaultValue = {
    page: table.page + 1,
    limit: table.rowsPerPage,
    search: searching,
    filters,
    userId: idStaff
  }

  const columns = [
    {
      field: 'createdAt',
      headerName: 'Ngày làm',
      minWidth: 200,
      filterable: false,
      sortable: true,
      disableColumnMenu: true,
      renderCell: (params) => (
        <RenderCellDate
          title={params.row.createdAt}
        />
      ),
    },
    {
      field: 'totalCorrect',
      headerName: 'Số câu đúng',
      minWidth: 200,
      filterable: false,
      sortable: true,
      disableColumnMenu: true,
      renderCell: (params) => (
        <RenderCellTitle
          title={params.row.totalCorrect}
        />
      ),
    },
    {
      field: 'totalWrong',
      headerName: 'Số câu sai',
      minWidth: 200,
      filterable: false,
      sortable: true,
      disableColumnMenu: true,
      renderCell: (params) => (
        <RenderCellTitle
          title={params.row.totalWrong}
        />
      ),
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: 'Tác vụ ',
      align: 'center',
      headerAlign: 'center',
      width: 200,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <RenderCellDetailMathAction
          // onOpenEdit={() => handleOpenEdit(params.row)}
          onOpenDetailHistoryMath={() => handleOpenDetailHistoryMath(params.row)}
          params={params.row}
        />
      ),
    },
  ];

  const listHistoryMathQuery = useQuery({
    queryKey: ['history-math',defaultValue],
    queryFn: () => ConfigMathApi.historyMathByUser(defaultValue),
    // enabled: !!idStaff
  })

  const data = (listHistoryMathQuery?.data?.data?.metadata?.data.map(item => ({
    id: item._id,
    ...item
  }))) || []
  const total = listHistoryMathQuery?.data?.data?.metadata?.total || 0

  
  const handleOpenDetailHistoryMath = (params) => {
    setOpenHistoryDetail(true)
    setCloseHistoryDetail(false)
    setDataMath(params?.math)
  }
  const handleCloseHistoryDetailMath = () => {
    setOpenHistoryDetail(false);
  }
 

  

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: {
              xs: '100vw',  // full màn hình trên mobile
              sm: '100vw',  // vẫn full màn hình tablet nhỏ
              md: '60vw',   // gần full trên laptop
              lg: '40vw',   // rộng 80% trên desktop lớn
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
            Lịch sử làm bài tập
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

    
          
        <Card
          sx={{
            minHeight: '750px',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
            <TableToolbar
              filters={searching}
              actionButtonList={[]}
              // onClickFilter={handleOnClickToggle}
              // onFilters={handleSearching}
            />
            <Table rows={data} columns={columns} />

            <TablePaginationCustom
              count={total}
              page={table.page}
              rowsPerPage={table.rowsPerPage}
              onPageChange={table.onChangePage}
              onRowsPerPageChange={table.onChangeRowsPerPage}
              labelRowsPerPage="Số hàng mỗi trang"
              labelDisplayedRows={({ from, to, count }) => `${from} - ${to} trong ${count}`}
            />
          
        </Card>
      </Drawer>
      <HistoryDetailMath open={openHistoryDetail} onClose={handleCloseHistoryDetailMath} dataMath={dataMath} />
    </>
    
  );
}
