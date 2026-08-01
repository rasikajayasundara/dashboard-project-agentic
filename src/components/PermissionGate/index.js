import { usePermission } from "../../hooks/usePermission";

export default function PermissionGate({ can, fallback = null, children }) {
  return usePermission(can) ? children : fallback;
}
