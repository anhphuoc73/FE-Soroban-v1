import * as React from 'react';
import { useState } from 'react';

import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import { formatDate } from '../../utils/format-time';
import { dataCustomer } from '../../_mock/_customer';
import SearchToolbar from '../ticket/toolbar/search-tool-bar';
import { Icon, ICON_NAME } from '../../components/svg-color/index';
import { RenderCellTitle, TablePaginationCustom } from '../../components/table/index';

const columnsTableCustomer = [
  {
    field: 'id',
    headerName: 'ID',
    headerAlign: 'center',
    align: 'center',
    minWidth: 30,
    renderCell: (params) => <RenderCellTitle title={params.row.id} />,
    filterable: false,
    sortable: true,
    disableColumnMenu: true,
  },
  {
    field: 'fullName',
    headerName: 'Họ tên',
    width: 230,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) => <RenderCellTitle title={params.row.fullName} />,
  },
  {
    field: 'phoneNumber',
    headerName: 'Số điện thoại',
    headerAlign: 'center',
    align: 'center',
    width: 230,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) => <RenderCellTitle title={params.row.phoneNumber} />,
  },
  {
    field: 'status',
    headerName: 'Trạng thái',
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    width: 160,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => <RenderCellTitle title={params.row.status} />,
  },
  {
    field: 'sourceCreated',
    headerName: 'Nguồn tạo',
    width: 140,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) => <RenderCellTitle title={params.row.sourceCreated} />,
  },
  {
    field: 'manager',
    headerName: 'Người quản lý',
    align: 'center',
    headerAlign: 'center',
    minWidth: 140,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) => <RenderCellTitle title={params.row.manager} />,
  },
  {
    field: 'creator',
    headerName: 'Người tạo',
    minWidth: 170,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) => <RenderCellTitle title={params.row.creator} />,
  },
  {
    field: 'latestUpdate',
    headerName: 'Ngày cập nhật lần cuối',
    minWidth: 170,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) => <RenderCellTitle title={formatDate(params.row.latestUpdate)} />,
  },
  {
    field: 'menuAction',
    headerName: 'Tác vụ',
    align: 'center',
    headerAlign: 'center',
    flex: 1,
    renderCell: (params) => (
      <>
        <Tooltip title="Gọi điện" placement="top" arrow>
          <IconButton sx={{ color: 'green' }}>
            <Icon name={ICON_NAME.activePhone} sx={{ width: '20px', height: '20px' }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Chỉnh sửa" placement="top" arrow>
          <IconButton>
            <Icon name={ICON_NAME.edit} sx={{ width: '20px', height: '20px' }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Xoá" placement="top" arrow>
          <IconButton sx={{ color: 'red' }}>
            <Icon name={ICON_NAME.delete} sx={{ width: '20px', height: '20px' }} />
          </IconButton>
        </Tooltip>
      </>
    ),
  },
];

export function CustomerView({ isSaved = false }) {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const total = 50;
  const isLoading = false;

  const transferManager = () => {
    // TODO Code Here
  };

  const setupDisplayDynamicFieldContact = () => {
    // TODO Code Here
  };

  const deleteContactSelected = () => {
    // TODO Code Here
  };

  return (
    <Box
      sx={{
        width: 1,
        minHeight: 400,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <SearchToolbar />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tooltip title="Chuyển người quản lý" placement="top">
            <IconButton
              sx={{ color: 'green', height: '50px', width: '50px' }}
              onClick={transferManager}
            >
              <Icon
                name={ICON_NAME.transferManager}
                sx={{ display: 'flex', alignItems: 'center', width: '26px' }}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="Cấu hình hiển thị trường danh bạ" placement="top">
            <IconButton sx={{ height: '50px', width: '50px' }} onClick={transferManager}>
              <Icon
                name={ICON_NAME.burger}
                sx={{ display: 'flex', alignItems: 'center', width: '20px' }}
                onClick={setupDisplayDynamicFieldContact}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa danh bạ đã chọn" placement="top">
            <IconButton
              sx={{ color: 'red', height: '50px', width: '50px' }}
              onClick={transferManager}
            >
              <Icon
                name={ICON_NAME.delete}
                sx={{ display: 'flex', alignItems: 'center', width: '20px' }}
                onClick={deleteContactSelected}
              />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <DataGrid
        disableRowSelectionOnClick
        disableColumnReorder
        getRowHeight={() => 60}
        rows={dataCustomer}
        columns={columnsTableCustomer}
        loading={isLoading}
        pageSizeOptions={[10, 25]}
        localeText={{
          toolbarColumns: '',
        }}
        sx={{
          '& .MuiDataGrid-toolbarContainer': {
            padding: '22px',
          },
          '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within, & .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within':
            {
              outline: 'none',
            },
          '& .MuiDataGrid-root .MuiDataGrid-cell': {
            borderTop: 'none',
          },
          '& .MuiDataGrid-columnHeader:nth-of-type(1) .MuiDataGrid-columnHeaderTitleContainer': {
            paddingLeft: '10px !important',
          },
          '& .MuiDataGrid-virtualScroller': {
            overflowY: 'hidden',
          },
          minHeight: '400px',
        }}
        hideFooterPagination
      />

      <TablePaginationCustom
        count={total}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
        labelRowsPerPage="Số hàng mỗi trang"
        labelDisplayedRows={({ from, to, count }) => `${from} - ${to} trong ${count}`}
      />
    </Box>
  );
}
