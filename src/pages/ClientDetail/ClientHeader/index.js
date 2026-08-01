import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { colors, AVATAR_PALETTES } from "../../../constants/common";
import { getInitials, formatCurrency, formatDateOnly } from "../../../utils/format";
import { clientAction } from "../../../store/clientSlice";
import OptionsMenu from "../../../components/OptionsMenu";
import ConfirmDialog from "../../../components/ConfirmDialog";
import StatusBadge from "../../../components/StatusBadge";
import { usePermission } from "../../../hooks/usePermission";
import EditClient from "../modals/EditClient";
import {
  HeaderCard, Left, LogoSquare, InfoBlock, NameRow, Name,
  ContactRow, ContactChip, Divider,
  MetricsSection, MetricBlock, MetricLabel, MetricValue,
} from "./component.styles";

// ── Helpers ───────────────────────────────────────────────────────────────────

function getPalette(name = "") {
  const code = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_PALETTES[code % AVATAR_PALETTES.length];
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ClientHeader({ client = {} }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showEdit,    setShowEdit]    = useState(false);
  const [showDelete,  setShowDelete]  = useState(false);

  const canClientUpdate = usePermission("canClientUpdate");
  const canClientDelete = usePermission("canClientDelete");

  const {
    name          = "—",
    status        = 1,
    email         = "",
    phone         = "",
    contactName   = "",
    location      = "",
    accountManager = "",
    since         = "",
    lifetimeValue = 0,
    outstanding   = 0,
  } = client;

  const initials  = getInitials(name) || "?";
  const palette   = getPalette(name);
  const isActive  = status === 1;

  return (
    <HeaderCard>
      <Left>
        {/* Company logo square */}
        <LogoSquare $bg={palette.bg} $border={palette.border} $textColor={palette.textColor}>
          {initials}
        </LogoSquare>

        {/* Name + badges + contact chips */}
        <InfoBlock>
          <NameRow>
            <Name>{name}</Name>
            {isActive && <StatusBadge status="Active" />}
          </NameRow>

          <ContactRow>
            {contactName && <ContactChip><i className="bi bi-person-circle" />{contactName}</ContactChip>}
            {email    && <ContactChip><i className="bi bi-envelope" />{email}</ContactChip>}
            {phone    && <ContactChip><i className="bi bi-telephone" />{phone}</ContactChip>}
            {location && <ContactChip><i className="bi bi-geo-alt" />{location}</ContactChip>}
            {accountManager && <ContactChip><i className="bi bi-person" />AM: {accountManager}</ContactChip>}
            {since    && <ContactChip><i className="bi bi-calendar3" />Since {formatDateOnly(since)}</ContactChip>}
          </ContactRow>
        </InfoBlock>
      </Left>

      <Divider />

      {/* Financial metrics */}
      <MetricsSection>
        <MetricBlock>
          <MetricLabel>Lifetime Value</MetricLabel>
          <MetricValue>{lifetimeValue ? formatCurrency(lifetimeValue) : "—"}</MetricValue>
        </MetricBlock>

        <MetricBlock>
          <MetricLabel>Outstanding</MetricLabel>
          <MetricValue $color={outstanding ? colors.accentAmber : colors.textMuted}>
            {outstanding ? formatCurrency(outstanding) : "—"}
          </MetricValue>
        </MetricBlock>
      </MetricsSection>

      {/* Options menu */}
      <OptionsMenu items={[
        { icon: "bi-pencil",  label: "Edit Client",   onClick: () => setShowEdit(true),    show: canClientUpdate },
        { icon: "bi-trash",   label: "Delete Client",  onClick: () => setShowDelete(true),  danger: true, dividerBefore: true, show: canClientDelete },
      ]} />

      {showEdit && (
        <EditClient client={client} onClose={() => setShowEdit(false)} />
      )}

      {showDelete && (
        <ConfirmDialog
          title="Delete Client"
          message={`Permanently delete ${name}? This cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={() => {
            dispatch(clientAction.deleteClientStart(client.id));
            setShowDelete(false);
            navigate("/clients");
          }}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </HeaderCard>
  );
}
