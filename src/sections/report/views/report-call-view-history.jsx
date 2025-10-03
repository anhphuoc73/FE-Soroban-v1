
import { Box } from '@mui/material';
// import { RenderCellTitle, RenderStatusTitle } from '../../ticket/toolbar/render-title';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { Iconify } from '../../../components/iconify/index';

import EmptyContent from '../../../components/table/table-empty-rows';
import GridSkeleton from '../../../components/table/table-skeleton';
import { DataGrid } from '@mui/x-data-grid';
import SearchToolbar  from '../../ticket/toolbar/search-tool-bar';
import { Icon, ICON_NAME } from 'src/components/svg-color/index';
import Button from '@mui/material/Button';

import { ReportCallViewHistoryFilter } from './report-call-view-history-filter';



import { useState, useCallback } from 'react';
import Card from '@mui/material/Card';
import { formatDate } from 'src/utils/format-time';
import {
  Table,
  useTable,
  TableToolbar,
  RenderCellTitle,
  RenderCellAction,
  TablePaginationCustom,
  RenderCellTitleTooltip,
} from 'src/components/table/index';

const actionButtonList = [
  {
    id: 1,
    label: 'Thêm quyền',
    icon: <Icon name={ICON_NAME.add} sx={{ width: '16px !important' }} />,
  },
];

export function ReportCallViewHistory(){
  const [isOpenFilter, setIsOpenFilter] = useState(false)

  const [filters, setFilters] = useState('');

  const table = useTable({ defaultRowsPerPage: 10 });

  const columns = [
    {
      field: 'calldate',
      headerName: 'Ngày gọi',
      minWidth: 200,
      filterable: false,
      sortable: true,
      disableColumnMenu: true,
      renderCell: (params) => (
        <RenderCellTitleTooltip
          title={params.row.calldate}
        />
      ),
    },
    {
      field: 'src',
      headerName: 'Số gội',
      minWidth: 200,
      filterable: false,
      sortable: true,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellTitle title={formatDate(params.row.src)} />,
    },
    {
      field: 'dst',
      headerName: 'Số nhận',
      filterable: false,
      sortable: true,
      disableColumnMenu: true,
      minWidth: 240,
      renderCell: (params) => <RenderCellTitle title={formatDate(params.row.dst)} />,
    },
    {
      field: 'duration',
      headerName: 'Thời lượng',
      minWidth: 220,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      flex: 1,
      renderCell: (params) => <RenderCellTitleTooltip title={params.row.duration} />,
    },
    {
      field: 'billsec',
      headerName: 'Đàm thoại',
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      minWidth: 260,
      flex: 1,
      renderCell: (params) => <RenderCellTitleTooltip title={params.row.billsec} />,
    },
    {
      field: 'waitime',
      headerName: 'Thời gian chờ',
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      minWidth: 260,
      flex: 1,
      renderCell: (params) => <RenderCellTitleTooltip title={params.row.waitime} />,
    },
    {
      field: 'type',
      headerName: 'Loại cuộc gọi',
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      minWidth: 260,
      flex: 1,
      renderCell: (params) => <RenderCellTitleTooltip title={params.row.type} />,
    },
    {
      field: 'disponsition',
      headerName: 'Trạng thái',
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      minWidth: 260,
      flex: 1,
      renderCell: (params) => <RenderCellTitleTooltip title={params.row.disponsition} />,
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: 'Tác vụ ',
      align: 'center',
      headerAlign: 'center',
      width: 130,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <RenderCellAction
          // onDeleteRow={() => handleDeleteRoleGroup(params.row)}
          // onUpdateRow={() => handleUpdatePermission(params.row._id)}
          key={params.row._id}
        />
      ),
    },
  ];

  const rows = [
    {
      id: "123",
      calldate:"11:11:11 13/02/2025",
      src: "999",
      dst: "0902312242",
      duration: "11:11:11",
      billsec: "11:11:11",
      waittime: "11:11:11",
      type: "Gọi ra",
      disponsition: "Trả lời",
    }
  ]


  const handleOnClickToggle = () => {
    setIsOpenFilter(prev => !prev)
  }

  return (
    <>
      <Card
        sx={{
          minHeight: '750px',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TableToolbar
          filters={filters}
          // onFilters={handleFilters}
          isFilter
          actionButtonList={actionButtonList}
          onClickFilter={handleOnClickToggle}
        />
        <Table rows={rows} columns={columns} />

        <TablePaginationCustom
          count={100}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang"
          labelDisplayedRows={({ from, to, count }) => `${from} - ${to} trong ${count}`}
        />

        <ReportCallViewHistoryFilter open={isOpenFilter} onClickToggle={handleOnClickToggle}   />
      </Card>
    </>
  )
}



