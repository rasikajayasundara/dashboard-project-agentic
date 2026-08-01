import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AVATAR_PALETTES } from "../../../constants/common";
import { employeesAction } from "../../../store/employeesSlice";
import DonutChart from "../../../components/DonutChart";
import OptionsMenu from "../../../components/OptionsMenu";
import ConfirmDialog from "../../../components/ConfirmDialog";
import StatusBadge from "../../../components/StatusBadge";
import { usePermission } from "../../../hooks/usePermission";
import EditEmployee from "../modals/EditEmployee";
import {
  HeaderCard, Left, AvatarCircle, InfoBlock, NameRow, Name, RoleText,
  ResendButton, ContactRow, ContactChip, Divider,
  MetricsSection, MetricItem, MetricLabel,
} from "./component.styles";

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(firstName = "", lastName = "") {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function getPalette(name = "") {
  const code = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_PALETTES[code % AVATAR_PALETTES.length];
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function EmployeeHeader({ employee = {}, isOwnProfile = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showEdit,    setShowEdit]    = useState(false);
  const [showDelete,  setShowDelete]  = useState(false);
  const [showResendConfirm, setShowResendConfirm] = useState(false);

  const canEmployeeUpdate = usePermission("canEmployeeUpdate");
  const canEmployeeDelete = usePermission("canEmployeeDelete");
  const isSubmitting = useSelector((s) => s?.employees?.isSubmitting);

  const {
    firstName       = "—",
    lastName        = "",
    role            = "",
    status          = "",
    email           = "",
    phone           = "",
    location        = "",
    manager         = "",
    startDate       = "",
    deliveryRate    = 0,
    billableRatio   = 0,
    billable        = false,
    billableRate    = 0,
  } = employee;

  const palette  = getPalette(`${firstName}${lastName}`);
  const initials = getInitials(firstName, lastName);
  const isPending = status === "Pending";
  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <HeaderCard>
      <Left>
        {/* Avatar */}
        <AvatarCircle $bg={palette.bg} $border={palette.border} $textColor={palette.textColor}>
          {initials}
        </AvatarCircle>

        {/* Name + role + contacts */}
        <InfoBlock>
          <NameRow>
            <Name>{firstName} {lastName}</Name>
            {role && <RoleText>· {role}</RoleText>}
            {status && <StatusBadge status={status} />}
            {isPending && canEmployeeUpdate && (
              <ResendButton
                type="button"
                disabled={isSubmitting}
                onClick={() => setShowResendConfirm(true)}
              >
                {isSubmitting ? "Sending..." : "Resend Activation"}
              </ResendButton>
            )}
          </NameRow>

          <ContactRow>
            {email    && <ContactChip><i className="bi bi-envelope" />{email}</ContactChip>}
            {phone    && <ContactChip><i className="bi bi-telephone" />{phone}</ContactChip>}
            {location && <ContactChip><i className="bi bi-geo-alt" />{location}</ContactChip>}
            {manager  && <ContactChip><i className="bi bi-person" />Manager: {manager}</ContactChip>}
            {startDate && <ContactChip><i className="bi bi-calendar3" />Joined {startDate}</ContactChip>}
            {!!billable && (isOwnProfile || canEmployeeUpdate) && <ContactChip><i className="bi bi-currency-dollar" />Billable Rate: ${billableRate}/hr</ContactChip>}
          </ContactRow>
        </InfoBlock>
      </Left>

      <Divider />

      {/* Metrics */}
      <MetricsSection>
        <MetricItem>
          <DonutChart
            percent={deliveryRate}
            size={72}
            strokeWidth={7}
            spentColor="#22c55e"
            remainingColor="#dcfce7"
            label="on-time"
          />
          <MetricLabel>Delivery rate</MetricLabel>
        </MetricItem>

        <MetricItem>
          <DonutChart
            percent={billableRatio}
            size={72}
            strokeWidth={7}
            spentColor="#f97316"
            remainingColor="#ffedd5"
            label="of target"
          />
          <MetricLabel>Billable ratio</MetricLabel>
        </MetricItem>
      </MetricsSection>

      {/* Options menu */}
      <OptionsMenu items={isOwnProfile ? [
        { icon: "bi-pencil", label: "Edit Profile", onClick: () => setShowEdit(true) },
      ] : [
        { icon: "bi-pencil",  label: "Edit Employee",    onClick: () => setShowEdit(true),   show: canEmployeeUpdate },
        { icon: "bi-trash",   label: "Delete Employee",   onClick: () => setShowDelete(true),  danger: true, dividerBefore: true, show: canEmployeeDelete },
      ]} />

      {showEdit && (
        <EditEmployee employee={employee} isOwnProfile={isOwnProfile} onClose={() => setShowEdit(false)} />
      )}

      {showDelete && (
        <ConfirmDialog
          title="Delete Employee"
          message={`Permanently delete ${fullName}? This cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={() => {
            dispatch(employeesAction.deleteEmployeeStart(employee.id));
            setShowDelete(false);
            navigate("/employees");
          }}
          onCancel={() => setShowDelete(false)}
        />
      )}

      {showResendConfirm && (
        <ConfirmDialog
          title="Resend Activation"
          message={`Resend the activation email to ${fullName}?`}
          confirmLabel="Resend"
          variant="info"
          onConfirm={() => {
            dispatch(employeesAction.resendActivationStart(employee.id));
            setShowResendConfirm(false);
          }}
          onCancel={() => setShowResendConfirm(false)}
        />
      )}
    </HeaderCard>
  );
}
