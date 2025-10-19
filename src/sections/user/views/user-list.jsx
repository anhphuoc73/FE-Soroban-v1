
import { Box } from '@mui/material'
import { Icon, ICON_NAME } from 'src/components/svg-color/index'
import Button from '@mui/material/Button'



import { useState, useCallback, useEffect } from 'react'
import Card from '@mui/material/Card'
import { formatDate } from 'src/utils/format-time'
import {
  Table,
  useTable,
  TableToolbar,
  RenderCellTitle,
  RenderCellAction,
  TablePaginationCustom,
  RenderCellTitleTooltip,
  RenderCellActive,
  RenderCellPosition,
} from 'src/components/table/index'

import { AdminApi } from 'src/apis/admin-api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner';
import moment from 'moment'
import { CenterApi } from 'src/apis/center-api'
import { ConfirmDialog } from 'src/components/custom-dialog'
import { useBoolean } from 'src/hooks/use-boolean'
import { UserApi } from 'src/apis/user-api'
import { UserEditView } from './user-edit-popup'

import { getProfileFromLS } from '../../../utils/auth'
import { FilterUser } from './fillter-user'
import HistoryMath from './history-math-drawer'

const actionButtonList = [
  {
    id: 1,
    label: 'Thêm quyền',
    icon: <Icon name={ICON_NAME.add} sx={{ width: '16px !important' }} />,
  },
];

export function UserListView(){
  const profile = getProfileFromLS()
  const [isOpenFilter, setIsOpenFilter] = useState(false)

  const [openHistory, setOpenHistory] = useState(false);
  const [closeHistory, setCloseHistory] = useState(true);
  const [staffId, setStaffId] = useState(null);

  const [isOpenEdit, setIsOpenEdit] = useState(false)
  const [paramEdit, setParamEdit] = useState({})
  const confirm = useBoolean();
  const [isOpenDelete, setIsOpenDelete] = useState(false)
  const [id, setId] = useState({})

  const [filters, setFilters] = useState({});

  const [searching, setSearching] = useState('');

  const table = useTable({ defaultRowsPerPage: 10 });

  const columns = [
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
      field: 'position',
      headerName: 'Vị trí',
      minWidth: 200,
      filterable: false,
      sortable: true,
      disableColumnMenu: true,
      renderCell: (params) => (
        <RenderCellPosition
          position={params.row.position}
        />
      ),
    },
    {
      field: 'centerName',
      headerName: 'Trung tâm',
      minWidth: 200,
      filterable: false,
      sortable: true,
      disableColumnMenu: true,
      renderCell: (params) => (
        <RenderCellTitle
          title={params.row.centerName}
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
          onOpenHistoryMath={() => handleOpenHistoryMath(params.row)}
          params={params.row}
        />
      ),
    },
  ];
  
  const deleteUserMutation = useMutation({
    mutationFn: UserApi.deleteUser
  })

  const defaultValue = {
    page: table.page + 1,
    limit: table.rowsPerPage,
    search: searching,
    filters
  }

  const listUserQuery = useQuery({
    queryKey: ['user-list',defaultValue],
    queryFn: () => UserApi.listUser(defaultValue),
    enabled: profile?.position !== 5,
  })

  
  const data = (listUserQuery?.data?.data?.metadata?.data.map(item => ({
    id: item._id,
    ...item
  }))) || []

 
  
  const total = listUserQuery?.data?.data?.metadata?.total || 0


  const handleOpenEdit = (params) => {
    setIsOpenEdit(true)
    params.expired_date = moment(params?.expired_date).format('YYYY-MM-DD')
    params.create_date = moment(params?.create_date).format('YYYY-MM-DD')
    setParamEdit(params)
  }
  const handleOpenHistoryMath = (params) => {
    setOpenHistory(true)
    setCloseHistory(false)
    setStaffId(params?.id)
  }
  const handleCloseHistoryMath = () => {
    setOpenHistory(false);
    setStaffId(null);
  };

  const handleOpenDelete = (params) => {
    confirm.onTrue();
    setId({id: params._id})
  }

  const handleOnClickToggle = () => {
    setIsOpenFilter(prev => !prev)
  }
  const handleSearching = useCallback(
    (value) => {
      table.onResetPage();
      // setFilters(value);
      setSearching(value);
    },
    [table]
  );
   
    
  const handleSubmit = () => {
    deleteUserMutation.mutate(id,{
      onSuccess: () => {
          toast.success('Xóa user thành công', { duration: 2000 });
          listUserQuery.refetch()
        },
      }
    )
  }
  
  return (
    <>
      <FilterUser filters={filters} setFilters={setFilters}  />
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
          onClickFilter={handleOnClickToggle}
          onFilters={handleSearching}
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

      <UserEditView listUserQuery={listUserQuery} isOpenEdit={isOpenEdit} setIsOpenEdit={setIsOpenEdit} paramEdit={paramEdit} />
      <ConfirmDialog
        open={confirm.value}
        onClose={ confirm.onFalse}
        title="Xóa user"
        content="Bạn có muốn xóa user này không ?"
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
      <HistoryMath open={openHistory} onClose={handleCloseHistoryMath}  idStaff={staffId}  />
    </>
  )
}



