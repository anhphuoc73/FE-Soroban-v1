import { z as zod } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import React, { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { RoleApi } from 'src/apis/role-api';
import { usePermissionStore } from 'src/zustand/permission.zustand';

import { Form } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';

import PermissionAddForm from './permission-add-edit-form';
import { PermissionCollapse } from './permission-collapse';

const permissionCategories = [
  {
    id: uuidv4(),
    title: 'Báo cáo',
    isTabs: true,
    tabsList: [
      { value: 'call', label: 'Cuộc gọi' },
      { value: 'chat', label: 'Trò chuyện' },
      { value: 'ticket', label: 'Phiếu ghi' },
      { value: 'sms/zns', label: 'SMS/ZNS' },
    ],
    tabs: {
      call: [
        {
          module: 'report-call',
          id: uuidv4(),
          value: 'view',
          label: 'Xem',
          children: [
            { id: uuidv4(), value: 'view_all', label: 'Tất cả' },
            { id: uuidv4(), value: 'view_group', label: 'Báo cáo cuộc gọi nhân sự nhóm tôi' },
            { id: uuidv4(), value: 'view_individual', label: 'Báo cáo cuộc gọi chỉ của tôi' },
          ],
        },
        {
          module: 'report-call',
          id: uuidv4(),
          value: 'export',
          label: 'Tải báo cáo',
        },
      ],
      chat: [
        {
          module: 'report-chat',
          id: uuidv4(),
          value: 'view',
          label: 'Xem',
          children: [
            { id: uuidv4(), value: 'view_all', label: 'Tất cả' },
            { id: uuidv4(), value: 'view_group', label: 'Báo cáo trò chuyện nhân sự nhóm tôi' },
            { id: uuidv4(), value: 'view_individual', label: 'Báo cáo trò chuyện chỉ của tôi' },
          ],
        },
        {
          module: 'report-chat',
          id: uuidv4(),
          value: 'export',
          label: 'Tải báo cáo',
        },
      ],
      ticket: [
        {
          module: 'report-ticket',
          id: uuidv4(),
          value: 'view',
          label: 'Xem',
          children: [
            { id: uuidv4(), value: 'view_all', label: 'Tất cả' },
            { id: uuidv4(), value: 'view_group', label: 'Báo cáo phiếu ghi nhân sự nhóm tôi' },
            { id: uuidv4(), value: 'view_individual', label: 'Báo cáo phiếu ghi chỉ của tôi' },
          ],
        },
        {
          module: 'report-ticket',
          id: uuidv4(),
          value: 'export',
          label: 'Tải báo cáo',
        },
      ],
      'sms/zns': [
        {
          module: 'report-sms/zns',
          id: uuidv4(),
          value: 'view',
          label: 'Xem',
        },
        {
          module: 'report-sms/zns',
          id: uuidv4(),
          value: 'export',
          label: 'Tải báo cáo',
        },
      ],
    },
  },
  {
    id: uuidv4(),
    title: 'Tin nhắn',
    isTabs: false,
    tabsList: [],
    rules: [
      {
        module: 'message',
        id: uuidv4(),
        value: 'view',
        label: 'Xem',
        children: [
          { id: uuidv4(), value: 'view_all', label: 'Tất cả', module: 'report-call' },
          { id: uuidv4(), value: 'view_group', label: 'Tin nhắn nhân sự nhóm tôi' },
          { id: uuidv4(), value: 'view_individual', label: 'Tin nhắn chỉ của tôi' },
        ],
      },
    ],
  },
  {
    id: uuidv4(),
    title: 'Khách hàng',
    isTabs: false,
    tabsList: [],
    rules: [
      {
        module: 'customer',
        id: uuidv4(),
        value: 'view',
        label: 'Xem',
        children: [
          { id: uuidv4(), value: 'view_all', label: 'Tất cả' },
          { id: uuidv4(), value: 'view_group', label: 'Khách hàng của nhân sự nhóm tôi quản lý' },
          { id: uuidv4(), value: 'view_individual', label: 'Khách hàng của tôi quản lý' },
          { id: uuidv4(), value: 'view_unmanaged', label: 'Khách hàng chưa được quản lý' },
        ],
      },
      {
        module: 'customer',
        id: uuidv4(),
        value: 'create',
        label: 'Thêm',
      },
      {
        module: 'customer',
        id: uuidv4(),
        value: 'update',
        label: 'Sửa',
      },
      {
        module: 'customer',
        id: uuidv4(),
        value: 'delete',
        label: 'Xóa',
      },
      {
        module: 'customer',
        id: uuidv4(),
        value: 'transfer_customers',
        label: 'Chuyển khách hàng',
      },
      {
        module: 'customer',
        id: uuidv4(),
        value: 'export',
        label: 'Tải lên',
      },
      {
        module: 'customer',
        id: uuidv4(),
        value: 'import',
        label: 'Tải xuống',
      },
    ],
  },
  {
    module: 'ticket',
    id: uuidv4(),
    title: 'Phiếu ghi',
    isTabs: false,
    tabsList: [],
    rules: [
      {
        id: uuidv4(),
        value: 'view',
        module: 'ticket',
        label: 'Xem',
        children: [
          { id: uuidv4(), value: 'view_all', label: 'Tất cả' },
          { id: uuidv4(), value: 'view_group', label: 'Phiếu ghi của nhân sự nhóm tôi' },
          { id: uuidv4(), value: 'view_individual', label: 'Phiếu ghi của tôi' },
        ],
      },
      {
        module: 'ticket',
        id: uuidv4(),
        value: 'create',
        label: 'Thêm',
      },
      {
        module: 'ticket',
        id: uuidv4(),
        value: 'update',
        label: 'Sửa',
      },
      {
        module: 'ticket',
        id: uuidv4(),
        value: 'delete',
        label: 'Xóa',
      },
    ],
  },
  {
    id: uuidv4(),
    title: 'SMS/ZNS',
    isTabs: false,
    tabsList: [],
    rules: [
      {
        module: 'sms/zns',
        id: uuidv4(),
        value: 'view',
        label: 'Xem',
      },
      {
        module: 'sms/zns',
        id: uuidv4(),
        value: 'create',
        label: 'Thêm',
      },
      {
        module: 'sms/zns',
        id: uuidv4(),
        value: 'update',
        label: 'Sửa',
      },
      {
        module: 'sms/zns',
        id: uuidv4(),
        value: 'delete',
        label: 'Xóa',
      },
    ],
  },
  {
    id: uuidv4(),
    title: 'Cấu hình',
    isTabs: true,
    tabsList: [
      { value: 'staff', label: 'Nhân viên và phân quyền' },
      { value: 'conversation', label: 'Hội thoại' },
      { value: 'live_chat', label: 'Live chat' },
      { value: 'other', label: 'Khác' },
    ],
    tabs: {
      staff: {
        0: 'Nhóm nhân viên',
        1: 'Nhân viên',
        rules: [
          [
            {
              module: 'config-group-staff',
              id: uuidv4(),
              value: 'view',
              label: 'Xem',
              children: [
                { id: uuidv4(), value: 'view_all', label: 'Tất cả' },
                { id: uuidv4(), value: 'view_group', label: 'Nhân sự nhóm tôi' },
              ],
            },
            {
              module: 'config-group-staff',
              id: uuidv4(),
              value: 'create',
              label: 'Thêm',
            },
            {
              module: 'config-group-staff',
              id: uuidv4(),
              value: 'update',
              label: 'Sửa',
            },
            {
              module: 'config-group-staff',
              id: uuidv4(),
              value: 'delete',
              label: 'Xóa',
            },
          ],
          [
            {
              module: 'config-staff',
              id: uuidv4(),
              value: 'view',
              label: 'Xem',
              children: [
                { id: uuidv4(), value: 'view_all', label: 'Tất cả' },
                { id: uuidv4(), value: 'view_group', label: 'Nhân sự nhóm tôi' },
                { id: uuidv4(), value: 'view_individual', label: 'Chỉ mình tôi' },
              ],
            },
            {
              module: 'config-staff',
              id: uuidv4(),
              value: 'create',
              label: 'Thêm',
            },
            {
              module: 'config-staff',
              id: uuidv4(),
              value: 'update',
              label: 'Sửa',
            },
            {
              module: 'config-staff',
              id: uuidv4(),
              value: 'delete',
              label: 'Xóa',
            },
          ],
        ],
      },
      conversation: {
        0: 'Kênh tương tác',
        1: 'Tin nhắn mẫu',
        2: 'Phân phối hội thoại',
        3: 'Nhãn hội thoại',
        rules: [
          [
            {
              module: 'config-conversation-channel',
              id: uuidv4(),
              value: 'view',
              label: 'Xem',
            },
            {
              module: 'config-conversation-channel',

              id: uuidv4(),
              value: 'create',
              label: 'Thêm',
            },
            {
              module: 'config-conversation-channel',
              id: uuidv4(),
              value: 'update',
              label: 'Sửa',
            },
            {
              module: 'config-conversation-channel',
              id: uuidv4(),
              value: 'delete',
              label: 'Xóa',
            },
          ],
          [
            {
              module: 'config-conversation-message',
              id: uuidv4(),
              value: 'view',
              label: 'Xem',
            },
            {
              module: 'config-conversation-message',

              id: uuidv4(),
              value: 'create',
              label: 'Thêm',
            },
            {
              module: 'config-conversation-message',

              id: uuidv4(),
              value: 'update',
              label: 'Sửa',
            },
            {
              module: 'config-conversation-message',
              id: uuidv4(),
              value: 'delete',
              label: 'Xóa',
            },
          ],
          [
            {
              module: 'config-conversation-reply',
              id: uuidv4(),
              value: 'view',
              label: 'Xem',
            },
            {
              module: 'config-conversation-reply',
              id: uuidv4(),
              value: 'create',
              label: 'Thêm',
            },
            {
              module: 'config-conversation-reply',
              id: uuidv4(),
              value: 'update',
              label: 'Sửa',
            },
            {
              module: 'config-conversation-reply',
              id: uuidv4(),
              value: 'delete',
              label: 'Xóa',
            },
          ],
          [
            {
              module: 'config-conversation-tag',
              id: uuidv4(),
              value: 'view',
              label: 'Xem',
            },
            {
              module: 'config-conversation-tag',
              id: uuidv4(),
              value: 'create',
              label: 'Thêm',
            },
            {
              module: 'config-conversation-tag',
              id: uuidv4(),
              value: 'update',
              label: 'Sửa',
            },
            {
              module: 'config-conversation-tag',
              id: uuidv4(),
              value: 'delete',
              label: 'Xóa',
            },
          ],
        ],
      },
      live_chat: {
        0: 'Cửa sổ chat',
        1: 'Tích hợp Web',
        rules: [
          [
            {
              module: 'config-live-chat-window',
              id: uuidv4(),
              value: 'view',
              label: 'Xem',
            },

            {
              module: 'config-live-chat-window',
              id: uuidv4(),
              value: 'update',
              label: 'Sửa',
            },
          ],
          [
            {
              module: 'config-live-chat-web',
              id: uuidv4(),
              value: 'view',
              label: 'Xem',
            },
            {
              module: 'config-live-chat-web',
              id: uuidv4(),
              value: 'create',
              label: 'Thêm',
            },
            {
              module: 'config-live-chat-web',
              id: uuidv4(),
              value: 'update',
              label: 'Sửa',
            },
            {
              module: 'config-live-chat-web',
              id: uuidv4(),
              value: 'delete',
              label: 'Xóa',
            },
          ],
        ],
      },
      other: {
        0: 'Trường dữ liệu',
        1: 'Mẫu tin nhắn SMS/ZNS',
        2: 'Máy nhánh',
        rules: [
          [
            {
              module: 'config-data-field',
              id: uuidv4(),
              value: 'view',
              label: 'Xem',
            },
            {
              module: 'config-data-field',
              id: uuidv4(),
              value: 'create',
              label: 'Thêm',
            },
            {
              module: 'config-data-field',
              id: uuidv4(),
              value: 'update',
              label: 'Sửa',
            },
            {
              module: 'config-data-field',
              id: uuidv4(),
              value: 'delete',
              label: 'Xóa',
            },
          ],
          [
            {
              module: 'config-sms-template',
              id: uuidv4(),
              value: 'view',
              label: 'Xem',
            },
            {
              module: 'config-sms-template',
              id: uuidv4(),
              value: 'create',
              label: 'Thêm',
            },
            {
              module: 'config-sms-template',
              id: uuidv4(),
              value: 'update',
              label: 'Sửa',
            },
            {
              module: 'config-sms-template',
              id: uuidv4(),
              value: 'delete',
              label: 'Xóa',
            },
          ],
          [
            {
              module: 'config-sms-extension',
              id: uuidv4(),
              value: 'view',
              label: 'Xem',
              children: [
                { id: uuidv4(), value: 'view_all', label: 'Tất cả' },
                { id: uuidv4(), value: 'view_group', label: 'Máy nhánh nhân sự nhóm tôi' },
                { id: uuidv4(), value: 'view_individual', label: 'Máy nhánh chỉ của tôi' },
              ],
            },
          ],
        ],
      },
    },
  },
];
export const permissionAddFormSchema = zod.object({
  name: zod.string().nonempty('Tên quyền là bắt buộc'),
  description: zod.string().optional(),
});
const renderActions = (onClose, loading, onSubmit) => (
  <Box
    sx={{
      display: 'flex',
      gap: 2,
      justifyContent: 'flex-end',
      p: 3,
      mt: 'auto',
    }}
  >
    <Button onClick={onClose} variant="contained" color="error">
      Đóng
    </Button>
    <LoadingButton
      onClick={onSubmit}
      form="permission-form"
      type="submit"
      variant="contained"
      color="primary"
    >
      Lưu lại
    </LoadingButton>
  </Box>
);

const renderPermissionAddDetails = () => (
  <Stack
    flexGrow={1}
    sx={{
      width: 1,
      minWidth: 0,
      borderRadius: 1.5,
    }}
  >
    <PermissionAddForm />
  </Stack>
);

export function PermissionAddPopover({ open, onClose }) {
  const queryClient = useQueryClient();
  const memoizedPermissionAddDetails = useMemo(() => renderPermissionAddDetails(), []);

  const permissionState = usePermissionStore((state) => state.permissions);
  const setRoleInfo = usePermissionStore((state) => state.setRoleInfo);
  const roleInfo = usePermissionStore((state) => state.roleInfo);
  const setPermissionState = usePermissionStore((state) => state.setPermissions);
  const resetPermission = usePermissionStore((state) => state.resetPermissions);
  const updateId = usePermissionStore((state) => state.updateId);
  const resetAll = usePermissionStore((state) => state.resetAll);

  const defaultValues = {
    name: roleInfo?.name ?? '',
    description: roleInfo?.description ?? '',
  };

  const methods = useForm({
    resolver: zodResolver(permissionAddFormSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const createRoleMutation = useMutation({
    mutationFn: (body) => RoleApi.createRole(body),
  });

  const updateRoleMutation = useMutation({
    mutationFn: (body) => RoleApi.updateRole({ updateId, ...body }),
  });

  const getRoleByIdQuery = useQuery({
    queryKey: ['role', updateId],
    queryFn: () => RoleApi.getRoleById(updateId),
    enabled: !!updateId,
  });
  const roleById = getRoleByIdQuery?.data?.data?.metadata;

  useEffect(() => {
    if (roleById) {
      const permissions = roleById?.permissions || [];
      const result = convertPermissionsToRoleFormat(permissions);

      setPermissionState(result);
      setRoleInfo({ name: roleById.name, description: roleById.description });
    }
  }, [roleById, setPermissionState, setRoleInfo]);

  useEffect(() => {
    if (roleInfo) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleInfo, reset]);

  const onSubmit = handleSubmit(async (data) => {
    const permissionEntries = Object.entries(permissionState);

    const permissionActions = permissionEntries.flatMap(
      ([subject, { actions = [], view, children }]) => {
        const updatedActions =
          view && !children
            ? actions.includes('view_all')
              ? actions
              : [...actions, 'view_all']
            : actions;

        return updatedActions.map((action) => ({ action, subject }));
      }
    );

    if (!permissionActions.length) {
      toast.error('Vui lòng chọn ít nhất một quyền', {
        duration: 2000,
        style: { whiteSpace: 'nowrap' },
      });
      return;
    }

    const payload = {
      ...data,
      permissions: permissionActions,
    };

    try {
      if (updateId) {
        await updateRoleMutation.mutateAsync(payload);
        toast.success('cập nhật quyền thành công', { duration: 2000 });
      } else {
        await createRoleMutation.mutateAsync(payload);
        toast.success('Tạo quyền thành công', { duration: 2000 });
      }
      queryClient.refetchQueries({ queryKey: ['roles'] });
      handleClose();
    } catch (error) {
      if (updateId) {
        toast.error('Có lỗi xảy ra cập nhật quyền', { duration: 2000 });
      } else {
        toast.error('Có lỗi xảy ra khi tạo quyền', { duration: 2000 });
      }
    }
  });

  const handleClose = () => {
    resetPermission();
    reset();
    onClose();
    resetAll();
  };

  function convertPermissionsToRoleFormat(permissions) {
    const roleFormat = {};

    permissions.forEach(({ action, subject }) => {
      if (!roleFormat[subject]) {
        roleFormat[subject] = {
          view: false,
          actions: [],
          children: false,
        };
      }

      roleFormat[subject].actions.push(action);
    });

    Object.keys(roleFormat).forEach((subject) => {
      const { actions } = roleFormat[subject];
      roleFormat[subject].children = actions.some((action) =>
        ['view_all', 'view_group', 'view_individual', 'view_unmanaged'].includes(action)
      );
      roleFormat[subject].view = actions.some((action) =>
        ['view_all', 'view_group', 'view_individual', 'view_unmanaged'].includes(action)
      );
    });

    return roleFormat;
  }

  return (
    <Drawer
      backdrop="true"
      open={open}
      onClose={handleClose}
      anchor="right"
      sx={{
        '& .MuiDrawer-paper': {
          borderRadius: '20px',
          marginRight: '10px',
          marginTop: '7px',
          height: '98.5%',
          backgroundColor: 'white',
          '& .MuiList-root': {
            backgroundColor: 'white',
          },
        },
      }}
      PaperProps={{
        sx: {
          width: {
            lg: 760,
            sm: 600,
            xs: 450,
          },
        },
      }}
    >
      <Box sx={{ px: 4, py: 2 }}>
        <Typography sx={{ fontWeight: 'bold', fontSize: 18 }}>{updateId ? "Cập nhật phân quyền": "Thêm mới phân quyền"}</Typography>
      </Box>
      <Divider sx={{ borderStyle: 'dashed' }} />
      <Box sx={{ overflowY: 'auto' }}>
        <Form id="permission-form" methods={methods} onSubmit={onSubmit}>
          <Stack
            spacing={3}
            sx={{
              px: 4,
              borderRadius: 2,
              position: 'relative',
            }}
          >
            <Stack spacing={1} direction="row">
              {memoizedPermissionAddDetails}
            </Stack>
          </Stack>

          {permissionCategories.map((item, index) => (
            <PermissionCollapse key={item.id} permission={item} index={index} />
          ))}
        </Form>
      </Box>
      {renderActions(handleClose, isSubmitting, onSubmit)}
    </Drawer>
  );
}
