import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AVATAR_PALETTES } from "../../../constants/common";
import { getInitials } from "../../../utils/format";
import TextField from "../../../components/TextField";
import ButtonStyled from "../../../components/ButtonStyled";
import { rolesPermissionsAction } from "../../../store/rolesPermissionsSlice";
import { snackbarAction, SNACKBAR_TYPES } from "../../../store/snackbarSlice";
import {
  RolesSplit, UserListPane, UserListSearch, UserListScroll,
  UserRow, UserAvatar, UserRowText, UserRowName, UserRowSubtext,
  PermissionPane, PermissionPaneHeader, PermissionPaneName, PermissionPaneRole,
  PermissionPaneScroll, PermissionGroup, PermissionGroupTitle, PermissionGrid,
  PermissionChip, PermissionCheckbox, PermissionLabel, SaveBar,
} from "./roles.styles";

function getPalette(name = "") {
  const code = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_PALETTES[code % AVATAR_PALETTES.length];
}

function titleCase(key = "") {
  return key
    .split(/[_\s]+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function sameIds(a, b) {
  if (a.size !== b.size) return false;
  for (const id of a) if (!b.has(id)) return false;
  return true;
}

export default function SystemUserRoles() {
  const dispatch = useDispatch();
  const {
    roles, isLoadingRoles,
    permissionGroups, isLoadingPermissions,
    isSavingRolePermissions, error,
  } = useSelector((s) => s?.rolesPermissions) || {};

  const [search, setSearch] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [workingPermissionIds, setWorkingPermissionIds] = useState(new Set());

  useEffect(() => {
    if (!roles || roles.length === 0) dispatch(rolesPermissionsAction.fetchRolesStart());
    if (!permissionGroups || Object.keys(permissionGroups).length === 0) {
      dispatch(rolesPermissionsAction.fetchPermissionsStart());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (!selectedRoleId && roles && roles.length > 0) {
      setSelectedRoleId(roles[0].roleId);
    }
  }, [roles, selectedRoleId]);

  const selectedRole = useMemo(
    () => (roles || []).find((r) => r.roleId === selectedRoleId),
    [roles, selectedRoleId]
  );

  const savedPermissionIds = useMemo(() => {
    const ids = (selectedRole?.permissions || []).map((p) => p.permissionId);
    return new Set(ids);
  }, [selectedRole]);

  useEffect(() => {
    setWorkingPermissionIds(new Set(savedPermissionIds));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoleId, selectedRole?.permissions]);

  const isDirty = !sameIds(workingPermissionIds, savedPermissionIds);

  const filteredRoles = (roles || []).filter((role) =>
    role.roleName.toLowerCase().includes(search.trim().toLowerCase())
  );

  const handleSelectRole = (roleId) => {
    if (roleId === selectedRoleId) return;
    if (isDirty) {
      dispatch(snackbarAction.showSnackbar({
        message: "Save or cancel your changes before switching roles.",
        type: SNACKBAR_TYPES.WARNING,
      }));
      return;
    }
    setSelectedRoleId(roleId);
  };

  const togglePermission = (id) =>
    setWorkingPermissionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const handleCancel = () => setWorkingPermissionIds(new Set(savedPermissionIds));

  const handleSave = () => {
    if (!selectedRoleId) return;
    dispatch(rolesPermissionsAction.updateRolePermissionsStart({
      roleId: selectedRoleId,
      permissionIds: Array.from(workingPermissionIds),
    }));
  };

  const listLoading = (isLoadingRoles || isLoadingPermissions) && (roles || []).length === 0;
  const rolesLoadFailed = !!error && !isLoadingRoles && (roles || []).length === 0;
  const permissionsLoadFailed = !!error && !isLoadingPermissions && Object.keys(permissionGroups || {}).length === 0;

  const handleRetry = () => {
    dispatch(rolesPermissionsAction.fetchRolesStart());
    dispatch(rolesPermissionsAction.fetchPermissionsStart());
  };

  return (
    <RolesSplit>
      <UserListPane>
        <UserListSearch>
          <TextField
            placeholder="Search roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startSlot={<i className="bi bi-search" />}
          />
        </UserListSearch>
        <UserListScroll>
          {rolesLoadFailed ? (
            <div className="text-center py-3 text-danger">
              <i className="bi bi-exclamation-triangle d-block mb-1" />
              Failed to load roles
              <ButtonStyled variant="secondary" onClick={handleRetry} className="d-block mx-auto mt-2">
                Retry
              </ButtonStyled>
            </div>
          ) : listLoading ? (
            <div className="text-center py-3">Loading...</div>
          ) : (
            filteredRoles.map((role) => {
              const palette = getPalette(role.roleName);
              const active = role.roleId === selectedRoleId;
              const permCount = (role.permissions || []).length;
              return (
                <UserRow key={role.roleId} $active={active} onClick={() => handleSelectRole(role.roleId)}>
                  <UserAvatar $bg={palette.bg} $border={palette.border} $textColor={palette.textColor}>
                    {getInitials(role.roleName)}
                  </UserAvatar>
                  <UserRowText>
                    <UserRowName $active={active}>{role.roleName}</UserRowName>
                    <UserRowSubtext>{permCount} permission{permCount === 1 ? "" : "s"}</UserRowSubtext>
                  </UserRowText>
                </UserRow>
              );
            })
          )}
        </UserListScroll>
      </UserListPane>

      <PermissionPane>
        <PermissionPaneHeader>
          <PermissionPaneName>{selectedRole?.roleName || ""}</PermissionPaneName>
          <PermissionPaneRole>{(selectedRole?.permissions || []).length} permissions assigned</PermissionPaneRole>
        </PermissionPaneHeader>

        <PermissionPaneScroll>
          {permissionsLoadFailed ? (
            <div className="text-center py-3 text-danger">
              <i className="bi bi-exclamation-triangle d-block mb-1" />
              Failed to load permissions
              <ButtonStyled variant="secondary" onClick={handleRetry} className="d-block mx-auto mt-2">
                Retry
              </ButtonStyled>
            </div>
          ) : isLoadingPermissions && Object.keys(permissionGroups || {}).length === 0 ? (
            <div className="text-center py-3">Loading...</div>
          ) : (
            Object.entries(permissionGroups || {}).map(([groupKey, items]) => (
              <PermissionGroup key={groupKey}>
                <PermissionGroupTitle>{titleCase(groupKey)}</PermissionGroupTitle>
                <PermissionGrid>
                  {(items || []).map((item) => {
                    const checked = workingPermissionIds.has(item.id);
                    return (
                      <PermissionChip key={item.id} $checked={checked}>
                        <PermissionCheckbox
                          checked={checked}
                          onChange={() => togglePermission(item.id)}
                        />
                        <PermissionLabel $checked={checked}>{item.permissionName}</PermissionLabel>
                      </PermissionChip>
                    );
                  })}
                </PermissionGrid>
              </PermissionGroup>
            ))
          )}
        </PermissionPaneScroll>

        <SaveBar>
          <ButtonStyled variant="secondary" onClick={handleCancel} disabled={!isDirty}>
            Cancel
          </ButtonStyled>
          <ButtonStyled onClick={handleSave} disabled={!isDirty || isSavingRolePermissions}>
            {isSavingRolePermissions ? "Saving..." : "Save Changes"}
          </ButtonStyled>
        </SaveBar>
      </PermissionPane>
    </RolesSplit>
  );
}
