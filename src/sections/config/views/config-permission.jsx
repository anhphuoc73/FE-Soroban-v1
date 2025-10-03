import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';

import { useBoolean } from 'src/hooks/use-boolean';

import { formatDate } from 'src/utils/format-time';

import { RoleApi } from 'src/apis/role-api';
import { UserApi } from 'src/apis/user-api';
import { usePermissionStore } from 'src/zustand/permission.zustand';

// ----------------------------------------------------------------------
import { toast } from 'src/components/snackbar';
import { Icon, ICON_NAME } from 'src/components/svg-color';
import { ConfirmDialog } from 'src/components/custom-dialog';
import {
  Table,
  useTable,
  TableToolbar,
  RenderCellTitle,
  RenderCellAction,
  TablePaginationCustom,
  RenderCellTitleTooltip,
} from 'src/components/table';

import { PermissionAddPopover } from './permission-add-popover';
import { PermissionDeleteDialog } from './permission-delete-dialog';

const actionButtonList = [
  {
    id: 1,
    label: 'Thêm quyền',
    icon: <Icon name={ICON_NAME.add} sx={{ width: '16px !important' }} />,
  },
];

export const ConfigPermission = () => {
  const [filters, setFilters] = useState('');

  const table = useTable({ defaultRowsPerPage: 10 });

  const drawer = useBoolean();
  const deleteRole = useBoolean();
  const confirm = useBoolean();

  const setIds = usePermissionStore((state) => state.setIds);
  const resetAll = usePermissionStore((state) => state.resetAll);
  const deleteId = usePermissionStore((state) => state.deleteId);
  const setRoleCurrent = usePermissionStore((state) => state.setRoleCurrent);

  const deleteRoleMutation = useMutation({
    mutationFn: (body) => RoleApi.deleteRole(body),
  });

  const defaultValue = {
    page: table.page + 1,
    limit: table.rowsPerPage,
    search: filters,
  };

  const defaultValueAll = {
    page: table.page + 1,
    limit: 100,
    search: filters,
  };

  const getRoleListQuery = useQuery({
    queryKey: ['roles', defaultValue],
    queryFn: () => RoleApi.list(defaultValue),
    keepPreviousData: true,
  });

  const getRoleListAllQuery = useQuery({
    queryKey: ['roles', defaultValueAll],
    queryFn: () => RoleApi.list(defaultValueAll),
    keepPreviousData: true,
  });

  const metadata = getRoleListQuery.data?.data?.metadata || {};
  const data = (metadata.data || []).map((role) => ({
    id: role._id,
    ...role,
  }));

  const metadataAll = getRoleListAllQuery.data?.data?.metadata || {};
  const dataAll = (metadataAll.data || []).map((role) => ({
    id: role._id,
    ...role,
  }));

  const total = metadata.total || 0;

  useQuery({
    queryKey: ['role', deleteId],
    queryFn: async () => {
      const res = await UserApi.getUserByRoleId(deleteId);
      const userList = res?.data?.metadata;
      if (userList && userList.length > 0) {
        deleteRole.onTrue();
      } else {
        confirm.onTrue();
      }
      return res;
    },
    enabled: !!deleteId,
  });

  const columns = [
    {
      field: 'name',
      headerName: 'Phân quyền',
      minWidth: 240,
      hideAble: false,
      renderCell: (params) => (
        <RenderCellTitleTooltip
          onClick={() => handleUpdatePermission(params.row._id)}
          sx={{
            cursor: 'pointer',
            fontWeight: 'bold',
            color: (theme) => theme.vars.palette.primary.main,
          }}
          isPL
          title={params.row.name}
        />
      ),
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'createdAt',
      headerName: 'Ngày tạo',
      minWidth: 200,
      filterable: false,
      sortable: true,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellTitle title={formatDate(params.row.createdAt)} />,
    },
    {
      field: 'updatedAt',
      headerName: 'Ngày cập nhật cuối',
      filterable: false,
      sortable: true,
      disableColumnMenu: true,
      minWidth: 240,
      renderCell: (params) => <RenderCellTitle title={formatDate(params.row.updatedAt)} />,
    },
    {
      field: 'updated_by',
      headerName: 'Người cập nhật cuối',
      minWidth: 220,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      flex: 1,
      renderCell: (params) => <RenderCellTitleTooltip title={params.row.updated_by} />,
    },
    {
      field: 'description',
      headerName: 'Mô tả',
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      minWidth: 260,
      flex: 1,
      renderCell: (params) => <RenderCellTitleTooltip title={params.row.description} />,
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
          onDeleteRow={() => handleDeleteRole(params.row)}
          onUpdateRow={() => handleUpdatePermission(params.row._id)}
          key={params.row._id}
        />
      ),
    },
  ];

  const handleUpdatePermission = (id) => {
    drawer.onTrue();
    setIds({ updateId: id });
  };

  const handleDeleteRole = (role) => {
    setIds({ deleteId: role._id });
    setRoleCurrent(role);
  };

  const handleCloseConfirmDialog = () => {
    confirm.onFalse();
    setIds({ deleteId: '' });
  };

  const handleCloseDeleteDialog = () => {
    deleteRole.onFalse();
    setIds({ deleteId: '' });
  };

  const handleConfirmDeleteRole = async (id) => {
    try {
      const res = await deleteRoleMutation.mutateAsync({ role_id: deleteId, new_role_id: id });
      if (res.data.status === 200) {
        toast.error('Xóa quyền thành công', {
          duration: 2000,
          style: { whiteSpace: 'nowrap' },
        });
        getRoleListQuery.refetch();
        getRoleListAllQuery.refetch();
        resetAll();
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa quyền', { duration: 2000 });
    }
  };

  const handleFilters = useCallback(
    (value) => {
      table.onResetPage();
      setFilters(value);
    },
    [table]
  );

  const actionButton = {
    1: drawer.onTrue,
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
          onFilters={handleFilters}
          actionButtonList={actionButtonList}
          actionButton={actionButton}
        />
        <Table columns={columns} rows={data} loading={getRoleListQuery.isPending} />

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
      <PermissionAddPopover open={drawer.value} onClose={drawer.onFalse} />

      <ConfirmDialog
        open={confirm.value}
        onClose={handleCloseConfirmDialog}
        title="Xóa quyền"
        content="Bạn có muốn xóa quyền này không?"
        action={
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleConfirmDeleteRole();
              handleCloseConfirmDialog();
            }}
          >
            Xóa
          </Button>
        }
      />

      <PermissionDeleteDialog
        open={deleteRole.value}
        data={dataAll}
        onDelete={handleConfirmDeleteRole}
        onClose={handleCloseDeleteDialog}
      />
    </>
  );
};
