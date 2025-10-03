
import { Box } from '@mui/material';
import { Icon, ICON_NAME } from 'src/components/svg-color/index';
import Button from '@mui/material/Button';



import { useState, useCallback, useEffect } from 'react';
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
  RenderCellActive,
} from 'src/components/table/index';

import { AdminApi } from 'src/apis/admin-api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AdminEditView } from './admin-edit-popup';
import moment from 'moment';
import { AdminDeleteView } from './admin-delete-popup';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { toast } from 'sonner';
import { useBoolean } from 'src/hooks/use-boolean';

const actionButtonList = [
  {
    id: 1,
    label: 'Thêm quyền',
    icon: <Icon name={ICON_NAME.add} sx={{ width: '16px !important' }} />,
  },
];

export function AdminListView(){
  const [isOpenFilter, setIsOpenFilter] = useState(false)

  const confirm = useBoolean();
  const [isOpenEdit, setIsOpenEdit] = useState(false)
  const [paramEdit, setParamEdit] = useState({})

  const [isOpenDelete, setIsOpenDelete] = useState(false)
  const [id, setId] = useState({})

  const [filters, setFilters] = useState('');

  const table = useTable({ defaultRowsPerPage: 10 });

  const columns = [
    {
      field: 'admin_name',
      headerName: 'Trung tâm điều hành',
      minWidth: 250,
      filterable: false,
      sortable: true,
      disableColumnMenu: true,
      renderCell: (params) => (
        <RenderCellTitle
          title={params.row.admin_name}
        />
      ),
    },
    {
      field: 'fullname',
      headerName: 'Họ tên',
      minWidth: 200,
      filterable: false,
      sortable: true,
      disableColumnMenu: true,
      renderCell: (params) => (
        <RenderCellTitle
          title={params.row.fullname}
        />
      ),
    },
    {
      field: 'phone',
      headerName: 'Điện thoại',
      minWidth: 200,
      filterable: false,
      sortable: true,
      disableColumnMenu: true,
      renderCell: (params) => (
        <RenderCellTitle
          title={params.row.phone}
        />
      ),
    },
    {
      field: 'address',
      headerName: 'Địa chỉ',
      minWidth: 200,
      filterable: false,
      sortable: true,
      disableColumnMenu: true,
      renderCell: (params) => (
        <RenderCellTitle
          title={params.row.address}
        />
      ),
    },
    {
      field: 'create_date',
      headerName: 'Ngày khởi tạo',
      minWidth: 200,
      filterable: false,
      sortable: true,
      disableColumnMenu: true,
      renderCell: (params) => (
        <RenderCellTitle
          title={params.row.create_date}
        />
      ),
    },
    {
      field: 'expired_date',
      headerName: 'Ngày hết hạn',
      minWidth: 200,
      filterable: false,
      sortable: true,
      disableColumnMenu: true,
      renderCell: (params) => (
        <RenderCellTitle
          title={params.row.expired_date}
        />
      ),
    },
    {
      field: 'active',
      headerName: 'Trạng thái',
      minWidth: 200,
      filterable: false,
      sortable: true,
      disableColumnMenu: true,
      renderCell: (params) => (
        <RenderCellActive
          title={params.row.active}
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
        <RenderCellAction
          onOpenEdit={() => handleOpenEdit(params.row)}
          onOpenDelete={() => handleOpenDelete(params.row)}
          // onDeleteRow={() => handleDeleteRoleGroup(params.row)}
          // onUpdateRow={() => handleUpdatePermission(params.row._id)}
          key={params.row._id}
        />
      ),
    },
    

    
  ];
  const defaultValue = {
    page: table.page + 1,
    limit: table.rowsPerPage,
    search:filters
  }


  const deleteAdminMutation = useMutation({
    mutationFn: AdminApi.deleteAdmin
  })

  const listAdminQuery = useQuery({
    queryKey: ['admin-list',defaultValue],
    queryFn: () => AdminApi.listAdmin(defaultValue)
  })

  const data = (listAdminQuery?.data?.data?.metadata?.admin.map(item => ({
    id: item._id,
    ...item
  }))) || []
  const total = listAdminQuery?.data?.data?.metadata?.total || 0


  const handleOpenEdit = (params) => {
    setIsOpenEdit(true)
    params.expired_date = moment(params?.expired_date).format('YYYY-MM-DD')
    params.create_date = moment(params?.create_date).format('YYYY-MM-DD')
    setParamEdit(params)
  }

  const handleOpenDelete = (params) => {
    confirm.onTrue()
    setId({id: params._id})
  }

  const handleOnClickToggle = () => {
    setIsOpenFilter(prev => !prev)
  }
  const handleFilters = useCallback(
    (value) => {
      table.onResetPage();
      setFilters(value);
    },
    [table]
  );
 

 
  
  const handleSubmit = () => {
    deleteAdminMutation.mutate(id,{
      onSuccess: () => {
          toast.success('Xóa trung tâm điều hành thành công', { duration: 2000 });
          listAdminQuery.refetch()
        },
      }
    )
  };
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
          actionButtonList={[]}
          onClickFilter={handleOnClickToggle}
          onFilters={handleFilters}
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
        {/* <ReportCallViewHistoryFilter open={isOpenFilter} onClickToggle={handleOnClickToggle}   /> */}
      </Card>
      <AdminEditView listAdminQuery={listAdminQuery} isOpenEdit={isOpenEdit} setIsOpenEdit={setIsOpenEdit} paramEdit={paramEdit} />
        
      <ConfirmDialog
        open={confirm.value}
        onClose={ confirm.onFalse}
        title="Xóa quản trị admin"
        content="Bạn có muốn xóa quản trị admin này?"
        action={
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleSubmit();
              confirm.onFalse();
            }}
          >
            Đồng ý
          </Button>
        }
      />
      
      {/* <AdminDeleteView listAdminQuery={listAdminQuery}  isOpenDelete={isOpenDelete} setIsOpenDelete={setIsOpenDelete} id={id} /> */}
    
    </>
  )
}



