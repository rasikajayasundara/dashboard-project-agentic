import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AVATAR_PALETTES } from "../../../constants/common";
import { getInitials } from "../../../utils/format";
import TextField from "../../../components/TextField";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { FormSelectDropdown } from "../../../components/FormField";
import { rolesPermissionsAction } from "../../../store/rolesPermissionsSlice";
import { metadataAction } from "../../../store/metadataSlice";
import {
  UserListSearch, UserListScroll, UserRow, UserAvatar,
  UserRowText, UserRowName, UserRowSubtext, JobTitleRoleSelectWrap,
} from "./roles.styles";

function getPalette(name = "") {
  const code = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_PALETTES[code % AVATAR_PALETTES.length];
}

export default function OrganisationJobRoles() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  const jobTitles      = useSelector((s) => s?.metadata?.jobTitles) || [];
  const departments    = useSelector((s) => s?.metadata?.departments) || [];
  const roles          = useSelector((s) => s?.rolesPermissions?.roles) || [];
  const isLoadingRoles = useSelector((s) => s?.rolesPermissions?.isLoadingRoles);
  const isUpdatingJobTitleRole = useSelector((s) => s?.metadata?.isUpdatingJobTitleRole);

  const [pendingChange, setPendingChange] = useState(null);

  useEffect(() => {
    // Guard on isLoadingRoles too: the "System User Roles" sub-tab (mounted by default
    // alongside this one) may already have an identical fetch in flight — re-dispatching
    // here would cancel and restart it (fetchRolesStart is a takeLatest), doubling the wait.
    if ((!roles || roles.length === 0) && !isLoadingRoles) dispatch(rolesPermissionsAction.fetchRolesStart());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const departmentById = departments.reduce((acc, d) => ({ ...acc, [d.departmentId]: d.departmentName }), {});
  const roleOptions = roles.map((r) => ({ label: r.roleName, value: r.roleId }));

  const handleRoleSelect = (jt, newRoleId) => {
    if (String(newRoleId) === String(jt.roleId)) return;
    const newRoleName = roleOptions.find((o) => String(o.value) === String(newRoleId))?.label || "";
    setPendingChange({ jobTitleId: jt.jobTitleId, jobTitleName: jt.jobTitleName, newRoleId, newRoleName });
  };

  const filteredJobTitles = jobTitles.filter((jt) =>
    jt.jobTitleName.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div>
      <UserListSearch>
        <TextField
          placeholder="Search job titles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          startSlot={<i className="bi bi-search" />}
        />
      </UserListSearch>
      <UserListScroll>
        {filteredJobTitles.map((jt) => {
          const palette = getPalette(jt.jobTitleName);
          return (
            <UserRow as="div" key={jt.jobTitleId}>
              <UserAvatar $bg={palette.bg} $border={palette.border} $textColor={palette.textColor}>
                {getInitials(jt.jobTitleName)}
              </UserAvatar>
              <UserRowText>
                <UserRowName>{jt.jobTitleName}</UserRowName>
                <UserRowSubtext>{departmentById[jt.departmentId] || "—"}</UserRowSubtext>
              </UserRowText>
              <JobTitleRoleSelectWrap>
                <FormSelectDropdown
                  value={jt.roleId}
                  onChange={(newRoleId) => handleRoleSelect(jt, newRoleId)}
                  options={roleOptions}
                  disabled={isUpdatingJobTitleRole}
                />
              </JobTitleRoleSelectWrap>
            </UserRow>
          );
        })}
      </UserListScroll>
      {pendingChange && (
        <ConfirmDialog
          title="Change job title role?"
          message={`Change the role for "${pendingChange.jobTitleName}" to "${pendingChange.newRoleName}"? This will update every employee currently assigned this job title.`}
          confirmLabel="Change Role"
          variant="info"
          onConfirm={() => {
            dispatch(metadataAction.updateJobTitleRoleStart({ jobTitleId: pendingChange.jobTitleId, roleId: pendingChange.newRoleId }));
            setPendingChange(null);
          }}
          onCancel={() => setPendingChange(null)}
        />
      )}
    </div>
  );
}
