
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
} from 'src/components/table/index'

import { AdminApi } from 'src/apis/admin-api'
import { useMutation, useQuery } from '@tanstack/react-query'



import { toast } from 'sonner';
// import { CenterDeleteView } from './center-delete-popup'
import moment from 'moment'
import { CenterApi } from 'src/apis/center-api'
import { ConfirmDialog } from 'src/components/custom-dialog'
import { useBoolean } from 'src/hooks/use-boolean'
import { ClassApi } from 'src/apis/class-api'

import { ClassEditView } from './class-edit-popup'

const actionButtonList = [
  {
    id: 1,
    label: 'Thêm quyền',
    icon: <Icon name={ICON_NAME.add} sx={{ width: '16px !important' }} />,
  },
]

export function ClassListView(){
  const [isOpenFilter, setIsOpenFilter] = useState(false)

  const [isOpenEdit, setIsOpenEdit] = useState(false)
  const [paramEdit, setParamEdit] = useState({})
  const confirm = useBoolean();
  const [isOpenDelete, setIsOpenDelete] = useState(false)
  const [id, setId] = useState({})

  const [filters, setFilters] = useState('');

  const table = useTable({ defaultRowsPerPage: 10 });

  const columns = [
    {
      field: 'fullname',
      headerName: 'Giáo viên phụ trách',
      minWidth: 300,
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
      field: 'className',
      headerName: 'Lớp',
      minWidth: 300,
      filterable: false,
      sortable: true,
      disableColumnMenu: true,
      renderCell: (params) => (
        <RenderCellTitle
          title={params.row.className}
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
  const deleteCenterMutation = useMutation({
    mutationFn: CenterApi.deleteCenter
  })


  const listClassQuery = useQuery({
    queryKey: ['class-list', defaultValue],
    queryFn: () => ClassApi.listClass(defaultValue)
  })

  const data = (listClassQuery?.data?.data?.metadata?.data.map(item => ({
    id: item._id,
    ...item
  }))) || []
  
  const total = listClassQuery?.data?.data?.metadata?.total || 0


  const handleOpenEdit = (params) => {
    setIsOpenEdit(true)
    params.expired_date = moment(params?.expired_date).format('YYYY-MM-DD')
    params.create_date = moment(params?.create_date).format('YYYY-MM-DD')
    setParamEdit(params)
  }

  const handleOpenDelete = (params) => {
    confirm.onTrue();
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
      deleteCenterMutation.mutate(id,{
        onSuccess: () => {
            toast.success('Xóa trung tâm điều hành thành công', { duration: 2000 });
            // listCenterQuery.refetch()
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

        {/* <TablePaginationCustom
          count={total}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang"
          labelDisplayedRows={({ from, to, count }) => `${from} - ${to} trong ${count}`}
        /> */}
      </Card>

      <ClassEditView 
        listCenterQuery={listClassQuery} 
        isOpenEdit={isOpenEdit} 
        setIsOpenEdit={setIsOpenEdit} 
        paramEdit={paramEdit} 
      />
      
      {/* <ConfirmDialog
        open={confirm.value}
        onClose={ confirm.onFalse}
        title="Xóa nhóm nhân viên"
        content="Bạn có muốn xóa nhóm nhân viên này không ?"
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
      /> */}
      {/* <CenterDeleteView listCenterQuery={listCenterQuery}  isOpenDelete={isOpenDelete} setIsOpenDelete={setIsOpenDelete} id={id} /> */}
    </>
  )
}



