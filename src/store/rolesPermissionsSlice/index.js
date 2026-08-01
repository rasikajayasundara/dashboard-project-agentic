import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoadingPermissions: false,
  permissionGroups: {},
  isLoadingRoles: false,
  roles: [],
  isSavingRolePermissions: false,
  error: "",
};

const rolesPermissionsSlice = createSlice({
  name: "rolesPermissions",
  initialState,
  reducers: {
    fetchPermissionsStart(state) {
      state.isLoadingPermissions = true;
      state.error = "";
    },
    fetchPermissionsSuccess(state, action) {
      state.isLoadingPermissions = false;
      state.permissionGroups = action.payload;
    },
    fetchPermissionsFailed(state, action) {
      state.isLoadingPermissions = false;
      state.error = action.payload;
    },
    fetchRolesStart(state) {
      state.isLoadingRoles = true;
      state.error = "";
    },
    fetchRolesSuccess(state, action) {
      state.isLoadingRoles = false;
      state.roles = action.payload;
    },
    fetchRolesFailed(state, action) {
      state.isLoadingRoles = false;
      state.error = action.payload;
    },
    updateRolePermissionsStart(state) {
      state.isSavingRolePermissions = true;
      state.error = "";
    },
    updateRolePermissionsSuccess(state, action) {
      state.isSavingRolePermissions = false;
      const updatedRole = action.payload;
      state.roles = state.roles.map((role) =>
        role.roleId === updatedRole.roleId ? { ...role, ...updatedRole } : role
      );
    },
    updateRolePermissionsFailed(state, action) {
      state.isSavingRolePermissions = false;
      state.error = action.payload;
    },
  },
});

export const { actions: rolesPermissionsAction, reducer: rolesPermissionsReducer } = rolesPermissionsSlice;
