import { useSelector } from "react-redux";

export function usePermission(can) {
  const permissions = useSelector((s) => s?.login?.permissions);

  if (!can) return true;
  if (Array.isArray(can)) return can.every((key) => !!permissions?.[key]);
  return !!permissions?.[can];
}
