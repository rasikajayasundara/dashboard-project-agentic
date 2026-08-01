import { colors } from "../../../constants/common";
import {
  CardTitle, CardSubtitle,
  ActivityList, ActivityItem, ActivityDot, ActivityContent,
  ActivityAction, ActivityMeta,
} from "../component.styles";

// TODO: replace with Redux selector (state.auth.activityLog)
const ACTIVITY_LOG = [
  { id: 1, action: "Password changed",     meta: "Today at 9:01 AM · Chrome · Wellington, NZ",  color: colors.accentBlue  },
  { id: 2, action: "Logged in",            meta: "Today at 9:42 AM · Chrome · Wellington, NZ",  color: colors.accentGreen },
  { id: 3, action: "MFA disabled",         meta: "Jun 8 at 3:15 PM · Safari · Auckland, NZ",    color: colors.accentAmber },
  { id: 4, action: "Failed login attempt", meta: "Jun 7 at 11:20 PM · Unknown · Singapore",     color: colors.accentRed   },
  { id: 5, action: "Logged in",            meta: "Jun 7 at 8:30 AM · Firefox · Wellington, NZ", color: colors.accentGreen },
];

export default function ActivityLogPanel() {
  return (
    <>
      <CardTitle>Activity Log</CardTitle>
      <CardSubtitle>Recent account actions and login events</CardSubtitle>
      <ActivityList>
        {ACTIVITY_LOG.map((item) => (
          <ActivityItem key={item.id}>
            <ActivityDot $color={item.color} />
            <ActivityContent>
              <ActivityAction>{item.action}</ActivityAction>
              <ActivityMeta>{item.meta}</ActivityMeta>
            </ActivityContent>
          </ActivityItem>
        ))}
      </ActivityList>
    </>
  );
}
