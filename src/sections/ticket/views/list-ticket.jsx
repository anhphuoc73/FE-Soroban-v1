import * as React from "react";
import { useMemo, useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation,useQueryClient } from '@tanstack/react-query';

import { Box } from '@mui/material';
// eslint-disable-next-line import/extensions
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import { ConfirmDialog } from 'src/components/custom-dialog';

import Card from '@mui/material/Card';
import AddTickets from './add-ticket';
import { TicketApi } from '../../../apis/ticket-api';
import SearchToolbar from '../toolbar/search-tool-bar';
import { useBoolean } from '../../../hooks/use-boolean';
import { useRouter } from '../../../routes/hooks/index';
import { Icon, ICON_NAME } from '../../../components/svg-color/index';
import CustomSnackbar from '../../../components/snackbar/custom-snackbar';
import { useTable, TablePaginationCustom, TableToolbar, Table } from '../../../components/table/index';
import {
  RenderCellTitle,
  RenderStatusTitle,
  RenderCellIconTitle,
  RenderCellTitleDateTime,
} from '../toolbar/render-title';
import FilterTicket from './filter-ticket';


export default function DataTable({title}) {
  const table = useTable({ defaultRowsPerPage: 10 });
  const [filters, setFilters] = React.useState('');
  const [open, setOpen] = useState(false);
  const confirm = useBoolean();
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  const [idTicket, setIdTicket] = React.useState('');
  const queryClient = useQueryClient();

  const toggleDrawer = () => {
    setOpen((value) => !value);
  };

  const toggleDrawerFilter = () => {
    setOpenFilter((value) => !value);
  };
  const [defaultValue, setDefaultValue] = useState({
    page: table.page + 1,
    limit: table.rowsPerPage,
    search: '',
    searchGroup: '',
  });

  const ticketsQuery = useQuery({
    queryKey: ['ticket',  defaultValue ],
    queryFn: () => TicketApi.getTicket(defaultValue),
    keepPreviousData: true,
  });

  const metadata = ticketsQuery.data?.data?.metadata || {};
  const ticketList = (metadata.data?.data|| []).map((ticket) => ({
    id: ticket._id,
    ...ticket,
  }));
  const total =  useMemo(() => ticketsQuery.data?.data?.metadata?.data.total || [], [ticketsQuery.data]);
  const sendFormDeleteTicket = useMutation({
    mutationFn: (body) => TicketApi.deleteTicket(body),
  });

  const handleDeleteEmployee = async (newState) => {
    try {
      const res = await sendFormDeleteTicket.mutateAsync({
        id: newState,
      });
      if (res.data.status === 200) {
        setShowAlert(true);
        await queryClient.refetchQueries({ queryKey: ['ticket'] });
      } else {
        setShowAlert(false);
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleDelete = async (event) => {
    confirm.onTrue();
    setIdTicket(event);
  };

  const handleEdit =useCallback((id) => {
    router.push(`/content/ticket/edit-ticket?id=${id}`);
  }, [router]);

  const handleFilters = useCallback(
    (value) => {
      table.onResetPage();
      setDefaultValue((prev) => ({
        ...prev,
        search: value, // Cập nhật filters vào search trong defaultValue
        page: 1, // Reset lại trang về 1 khi lọc dữ liệu
      }));
    },
    [table]
  );
  useEffect(() => {
    setDefaultValue((prev) => ({
      ...prev,
      page:table.page + 1,
    }));
  }, [filters, table.page]);
  const actionButtonList = [
    {
      id: 1,
      label: 'Thêm mới',
      icon: <Icon name={ICON_NAME.add} sx={{ width: '16px !important' }} />,
    },
  ];

  const actionButton = {
    1: toggleDrawer,
  };
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      headerAlign: 'center',
      align: 'center',
      minWidth: 30,
      renderCell: (params) => <RenderCellTitle title={params.row.ticket_id} />, // ✅ Truy cập đúng dữ liệu
      filterable: false,
      sortable: true,
      disableColumnMenu: true,
    },
    {
      field: 'tenPhieuGhi',
      headerName: 'Tên phiếu ghi',
      flex: 1,
      minWidth: 230,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <RenderCellIconTitle title={params.row.name} level={params.row.level} />
      ), // ✅ Truy cập đúng dữ liệu
    },
    {
      field: 'phanLoai',
      headerName: 'Phân loại',
      headerAlign: 'center',
      align: 'center',
      width: 230,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellTitle title={params.row.nameTypeTicket} />, // ✅ Truy cập đúng dữ liệu
    },
    {
      field: 'trangThai',
      headerName: 'Trạng thái',
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      width: 160,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <RenderStatusTitle disposition={params.row.status} />, // ✅ Truy cập đúng dữ liệu
    },
    {
      field: 'giaoCho',
      headerName: 'Giao cho',
      minWidth: 240,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellTitle title={params.row.nameEmploy} />, // ✅ Truy cập đúng dữ liệu
    },
    {
      field: 'khachHang',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Khách hàng',
      minWidth: 240,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellTitle title={params.row.nameContact} />, // ✅ Truy cập đúng dữ liệu
    },
    {
      field: 'hanCuoi',
      headerName: 'Hạn cuối',
      minWidth: 250,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellTitleDateTime title={params.row.date_expire} />, // ✅ Truy cập đúng dữ liệu
    },
    {
      field: 'actions',
      headerName: 'Tác vụ',
      align: 'center',
      headerAlign: 'center',
      width: 200,
      // flex: 1,
      renderCell: (params) => (
        <Box sx={{ py: 1,}}>
          <Tooltip title="Xem chi tiết" placement="top" arrow>
            <IconButton onClick={() => handleEdit(params.row._id)}>
              <Icon
                name={ICON_NAME.edit}
                sx={{ display: 'flex',  width: '16px'}}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa" placement="top" arrow>
            <IconButton
              sx={{
                color: 'red',
              }}
              onClick={() => handleDelete(params.row._id)}
            >
              <Icon name={ICON_NAME.delete} sx={{ display: 'flex', width: '16px' }} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];
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
          isFilter
          onFilters={handleFilters}
          actionButtonList={actionButtonList}
          actionButton={actionButton}
          onClickFilter={toggleDrawerFilter}

        />
        <Table columns={columns} rows={ticketList}  />

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
      <AddTickets onClickToggle={toggleDrawer} open={open} />
      <FilterTicket onClickToggle={toggleDrawerFilter} open={openFilter} setDefaultValue={setDefaultValue} />
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Xóa nhân viên"
        content="Bạn có muốn xóa nhân viên này không?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteEmployee(idTicket);
              confirm.onFalse();
            }}
          >
            Xóa
          </Button>
        }
      />
      <CustomSnackbar
        open={showAlert}
        onClose={() => setShowAlert(false)}
        message="Xóa phiếu ghi thành công!"
        severity="success"
      />
    </>
  );
}
