import { useState } from "react";
import ToggleSwitch from "../../../components/ToggleSwitch";
import { NotifPage, NotifGroup, NotifGroupTitle, NotifRow } from "../component.styles";

const NOTIF_GROUPS = [
  {
    title: "Projects",
    items: [
      { key: "newProject",      label: "New project assigned",   description: "When a project is assigned to you"               },
      { key: "projectUpdated",  label: "Project status updated", description: "When a project you're on changes status"          },
      { key: "projectDeadline", label: "Deadline approaching",   description: "48 hours before a project deadline"               },
    ],
  },
  {
    title: "Assignments",
    items: [
      { key: "taskAssigned",  label: "Task assigned to me", description: "When a task is assigned to you"                   },
      { key: "taskCompleted", label: "Task completed",      description: "When a task you assigned is completed"             },
      { key: "taskOverdue",   label: "Task overdue",        description: "When your assigned task passes its due date"       },
    ],
  },
  {
    title: "Timesheets",
    items: [
      { key: "timesheetSubmitted", label: "Timesheet submitted", description: "When a team member submits a timesheet" },
      { key: "timesheetApproved",  label: "Timesheet approved",  description: "When your timesheet is approved"        },
      { key: "timesheetRejected",  label: "Timesheet rejected",  description: "When your timesheet is rejected"        },
    ],
  },
  {
    title: "System",
    items: [
      { key: "systemMaintenance", label: "System maintenance", description: "Scheduled downtime and maintenance notices"       },
      { key: "newFeatures",       label: "New features",       description: "Product updates and new feature announcements"    },
    ],
  },
];

const DEFAULT_STATE = {
  newProject: true,  projectUpdated: false, projectDeadline: true,
  taskAssigned: true, taskCompleted: false, taskOverdue: true,
  timesheetSubmitted: true, timesheetApproved: true, timesheetRejected: false,
  systemMaintenance: false, newFeatures: true,
};

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState(DEFAULT_STATE);

  const handleChange = (key, value) =>
    setNotifications((prev) => ({ ...prev, [key]: value }));

  return (
    <NotifPage>
      {NOTIF_GROUPS.map((group) => (
        <NotifGroup key={group.title}>
          <NotifGroupTitle>{group.title}</NotifGroupTitle>
          {group.items.map((item) => (
            <NotifRow key={item.key}>
              <ToggleSwitch
                checked={notifications[item.key]}
                onChange={(val) => handleChange(item.key, val)}
                label={item.label}
                description={item.description}
              />
            </NotifRow>
          ))}
        </NotifGroup>
      ))}
    </NotifPage>
  );
}
