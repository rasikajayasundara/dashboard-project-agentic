import styled, { keyframes } from "styled-components";
import { fontSize } from "../../constants/common";

export const expandDown = keyframes`
  from { clip-path: inset(0 0 100% 0 round 14px); opacity: 0.6; }
  to   { clip-path: inset(0 0 0%   0 round 14px); opacity: 1;   }
`;

export const Wrapper = styled.div`
  position: relative;
`;

export const BellBtn = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  cursor: pointer;
  color: #374151;
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
    color: #111827;
  }
`;

export const CountBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  background: #ef4444;
  border-radius: 999px;
  border: 2px solid #fff;
  font-size: ${fontSize.badge};
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
`;

export const Panel = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 340px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
  z-index: 300;
  overflow: hidden;
  animation: ${expandDown} 0.22s cubic-bezier(0.16, 1, 0.3, 1) both;
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 12px;
  border-bottom: 1px solid #f3f4f6;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PanelTitle = styled.span`
  font-size: ${fontSize.header};
  font-weight: 700;
  color: #111827;
`;

export const UnreadBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: #eff6ff;
  color: #2563eb;
  font-size: ${fontSize.badge};
  font-weight: 700;
  border-radius: 999px;
`;

export const MarkAllBtn = styled.button`
  font-size: ${fontSize.general};
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: inherit;

  &:hover { color: #2563eb; }
`;

export const NotifList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 6px 0;
  max-height: 340px;
  overflow-y: auto;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
`;

export const NotifItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 16px;
  cursor: pointer;
  border-left: 3px solid ${({ $unread }) => ($unread ? "#2563eb" : "transparent")};
  background: ${({ $unread }) => ($unread ? "#f8faff" : "transparent")};
  transition: background 0.12s;

  &:hover { background: #f3f4f6; }
`;

export const IconCircle = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const NotifBody = styled.div`
  flex: 1;
  min-width: 0;
`;

export const NotifTitle = styled.div`
  font-size: ${fontSize.general};
  font-weight: ${({ $unread }) => ($unread ? "700" : "400")};
  color: ${({ $unread }) => ($unread ? "#111827" : "#374151")};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const NotifDesc = styled.div`
  font-size: ${fontSize.subtitle};
  color: #6b7280;
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const NotifTime = styled.div`
  font-size: ${fontSize.subtitle};
  color: #9ca3af;
  margin-top: 4px;
`;

export const UnreadDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #2563eb;
  flex-shrink: 0;
  margin-top: 5px;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 36px 16px;
  gap: 8px;
  color: #9ca3af;
`;

export const EmptyText = styled.div`
  font-size: ${fontSize.highlight};
  font-weight: 500;
  color: #6b7280;
`;

export const EmptySubText = styled.div`
  font-size: ${fontSize.subtitle};
  color: #9ca3af;
`;

export const PanelFooter = styled.div`
  border-top: 1px solid #f3f4f6;
  padding: 10px 16px;
  text-align: center;
`;

export const ViewAllBtn = styled.button`
  font-size: ${fontSize.general};
  color: #2563eb;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: 500;

  &:hover { text-decoration: underline; }
`;
