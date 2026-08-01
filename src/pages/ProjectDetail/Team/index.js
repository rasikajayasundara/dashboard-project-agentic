import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { colors, AVATAR_PALETTES } from "../../../constants/common";
import { projectTeamAction } from "../../../store/projectTeamSlice";
import EmptyState from "../../../components/EmptyState";
import {
  TeamTabWrapper,
  EmptyStateCard,
  MemberCard,
  MemberCardHeader,
  MemberAvatar,
  MemberInfo,
  MemberName,
  MemberRole,
  HoursSection,
  HoursBarTrack,
  HoursBarLayer,
  HoursBarMeta,
  TaskStatRow,
  TaskStat,
  TaskStatNum,
  TaskStatLabel,
  Chevron,
  TaskListWrapper,
  TaskTable,
  TaskTableHead,
  TaskTh,
  TaskTd,
  TaskIdChip,
  TaskNameText,
  StatusPill,
  TaskProgressBar,
  TaskProgressFill,
} from "./component.styles";

const getPalette = (name = "") => {
  const code = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_PALETTES[code % AVATAR_PALETTES.length];
};

const getInitials = (name = "") =>
  name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const fmtDate = (iso = "") => {
  if (!iso) return "—";
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return "—";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${day} ${months[month - 1]}`;
};

const STATUS_LABEL = {
  done: "Done",
  inprogress: "In Progress",
  due: "Due",
  "at risk": "At Risk",
};

const STATUS_ICON = {
  done: "bi-check-circle-fill",
  inprogress: "bi-circle-half",
  due: "bi-exclamation-triangle-fill",
  "at risk": "bi-exclamation-circle-fill",
};

export default function TeamTab() {
  const dispatch = useDispatch();
  const { id: pid } = useParams();
  const { members, isLoading } = useSelector((s) => s?.projectTeam) || {};

  useEffect(() => {
    if (pid) dispatch(projectTeamAction.fetchTeamStart(pid));
  }, [dispatch, pid]);

  const [expanded, setExpanded] = useState({});
  const toggle = (employeeId) => setExpanded((prev) => ({ ...prev, [employeeId]: !prev[employeeId] }));

  const rows = members || [];

  if (isLoading && rows.length === 0) {
    return (
      <TeamTabWrapper>
        <div className="text-center text-muted py-4">Loading team members…</div>
      </TeamTabWrapper>
    );
  }

  if (!isLoading && rows.length === 0) {
    return (
      <TeamTabWrapper>
        <EmptyStateCard>
          <EmptyState
            icon="bi-people"
            title="No team members assigned"
            subtitle="Assign people to tasks to see their workload and progress here."
          />
        </EmptyStateCard>
      </TeamTabWrapper>
    );
  }

  return (
    <TeamTabWrapper>
      {rows.map((member) => {
        const tasks = member.tasks || [];
        const allocatedHrs = tasks.reduce((sum, t) => sum + (Number(t.allocatedHours) || 0), 0);
        const workedHrs = tasks.reduce((sum, t) => sum + (Number(t.workedHours) || 0), 0);

        const palette    = getPalette(member.name);
        const memberHrsPct = allocatedHrs > 0 ? Math.min(Math.round((workedHrs / allocatedHrs) * 100), 100) : 0;
        const tasksTotal = tasks.length;
        const tasksDone  = tasks.filter((t) => t.status === "done").length;
        const tasksDue   = tasks.filter((t) => t.status === "due").length;
        const isOpen     = !!expanded[member.employeeId];

        return (
          <MemberCard key={member.employeeId}>
            <MemberCardHeader onClick={() => toggle(member.employeeId)}>
              {/* Avatar */}
              <MemberAvatar $bg={palette.bg} $color={palette.textColor} $border={palette.border}>
                {getInitials(member.name)}
              </MemberAvatar>

              {/* Name + Role */}
              <MemberInfo>
                <MemberName>{member.name}</MemberName>
                <MemberRole>{member.jobTitle}</MemberRole>
              </MemberInfo>

              {/* Allocated vs worked bar */}
              <HoursSection>
                <HoursBarTrack>
                  <HoursBarLayer $pct={memberHrsPct} $color={colors.accentBlue} />
                </HoursBarTrack>
                <HoursBarMeta>
                  <span>{workedHrs}h of {allocatedHrs}h</span>
                  <span>{memberHrsPct}%</span>
                </HoursBarMeta>
              </HoursSection>

              {/* Task counts */}
              <TaskStatRow>
                <TaskStat>
                  <TaskStatNum>{tasksTotal}</TaskStatNum>
                  <TaskStatLabel>assigned</TaskStatLabel>
                </TaskStat>
                <TaskStat>
                  <TaskStatNum $color={colors.accentGreen}>{tasksDone}</TaskStatNum>
                  <TaskStatLabel>done</TaskStatLabel>
                </TaskStat>
                <TaskStat>
                  <TaskStatNum $color={tasksDue > 0 ? colors.accentRed : colors.textMuted}>{tasksDue}</TaskStatNum>
                  <TaskStatLabel>due</TaskStatLabel>
                </TaskStat>
              </TaskStatRow>

              <Chevron className="bi bi-chevron-down" $open={isOpen} />
            </MemberCardHeader>

            {/* Expanded task list */}
            {isOpen && (
              <TaskListWrapper>
                <TaskTable>
                  <TaskTableHead>
                    <tr>
                      <TaskTh>ID</TaskTh>
                      <TaskTh>Task</TaskTh>
                      <TaskTh>Status</TaskTh>
                      <TaskTh>Allocated</TaskTh>
                      <TaskTh>Logged</TaskTh>
                      <TaskTh>Progress</TaskTh>
                      <TaskTh>Due</TaskTh>
                    </tr>
                  </TaskTableHead>
                  <tbody>
                    {tasks.map((task) => {
                      const allocHrs = Number(task.allocatedHours) || 0;
                      const loggedHrs = Number(task.workedHours) || 0;
                      const isDone  = task.status === "done";
                      const isOver  = loggedHrs > allocHrs;
                      const logPct  = allocHrs > 0
                        ? Math.round((loggedHrs / allocHrs) * 100)
                        : 0;

                      return (
                        <tr key={task.id}>
                          <TaskTd>
                            <TaskIdChip>T{String(task.id).padStart(5, "0")}</TaskIdChip>
                          </TaskTd>
                          <TaskTd>
                            <TaskNameText $done={isDone}>{task.name}</TaskNameText>
                          </TaskTd>
                          <TaskTd>
                            <StatusPill $status={task.status}>
                              <i className={`bi ${STATUS_ICON[task.status]}`} />
                              {STATUS_LABEL[task.status]}
                            </StatusPill>
                          </TaskTd>
                          <TaskTd>{allocHrs}h</TaskTd>
                          <TaskTd
                            style={{
                              color:      isOver ? colors.accentRed : colors.textPrimary,
                              fontWeight: isOver ? 600 : 400,
                            }}
                          >
                            {loggedHrs}h
                          </TaskTd>
                          <TaskTd>
                            <TaskProgressBar>
                              <TaskProgressFill $pct={logPct} $over={isOver} />
                            </TaskProgressBar>
                          </TaskTd>
                          <TaskTd
                            style={{
                              color:      task.status === "due" ? colors.accentRed : colors.textSecondary,
                              fontWeight: task.status === "due" ? 600 : 400,
                            }}
                          >
                            {task.dueDate ? fmtDate(task.dueDate) : "—"}
                          </TaskTd>
                        </tr>
                      );
                    })}
                  </tbody>
                </TaskTable>
              </TaskListWrapper>
            )}
          </MemberCard>
        );
      })}
    </TeamTabWrapper>
  );
}
