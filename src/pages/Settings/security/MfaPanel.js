import { useState } from "react";
import { colors } from "../../../constants/common";
import ButtonStyled from "../../../components/ButtonStyled";
import ToggleSwitch from "../../../components/ToggleSwitch";
import {
  CardTitle, CardSubtitle, CardDivider, MfaStatusBadge,
} from "../component.styles";

export default function MfaPanel() {
  const [mfaEnabled, setMfaEnabled] = useState(false);

  return (
    <>
      <CardTitle>Multi-Factor Authentication</CardTitle>
      <CardSubtitle>Add an extra layer of security to your account</CardSubtitle>

      <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
        <MfaStatusBadge $enabled={mfaEnabled}>
          <i className={`bi ${mfaEnabled ? "bi-check-circle" : "bi-x-circle"}`} />
          {mfaEnabled ? "Enabled" : "Disabled"}
        </MfaStatusBadge>
      </div>

      <ToggleSwitch
        checked={mfaEnabled}
        onChange={setMfaEnabled}
        label="Enable MFA"
        description="Protect your account with an authenticator app or SMS code on every login"
      />

      {mfaEnabled && (
        <>
          <CardDivider />
          <CardSubtitle style={{ marginBottom: 12 }}>
            Scan this QR code with your authenticator app
          </CardSubtitle>
          <div style={{
            width: 120, height: 120, background: colors.borderLight,
            borderRadius: 8, display: "flex", alignItems: "center",
            justifyContent: "center", marginBottom: 16,
          }}>
            <i className="bi bi-qr-code" style={{ fontSize: 48, color: colors.textMuted }} />
          </div>
          <ButtonStyled variant="secondary">View Backup Codes</ButtonStyled>
        </>
      )}
    </>
  );
}
