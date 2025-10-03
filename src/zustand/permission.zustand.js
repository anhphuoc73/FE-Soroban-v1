import { create } from 'zustand';

export const usePermissionStore = create((set) => ({
  permissions: {},
  roleInfo: {},
  updateId: '',
  deleteId: '',
  roleCurrent: null,
  setRoleCurrent: (value) => set({ roleCurrent: value }),
  setPermissions: (newPermissions) =>
    set((state) => ({
      permissions: { ...state.permissions, ...newPermissions },
    })),
  setRoleInfo: (newRoleInfo) =>
    set((state) => ({
      roleInfo: { ...state.roleInfo, ...newRoleInfo },
    })),
  setIds: ({ updateId, deleteId }) =>
    set({
      updateId: updateId ?? '',
      deleteId: deleteId ?? '',
    }),
  resetPermissions: () => set({ permissions: {} }),
  resetRoleInfo: () => set({ roleInfo: {} }),
  resetAll: () => set({ permissions: {}, updateId: '', deleteId: '', roleInfo: {} }),
}));
