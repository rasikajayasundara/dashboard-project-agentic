import React from "react";
import { colors } from "../../constants/common";
import Layout from "../../components/Layout";
import StatCard from "../../components/Statcard";
import { StatsGrid } from "../../components/Statcard/component.styles";
import {
  PageWrapper, PageHeader, TitleRow, Title, Subtitle,
  EmptyState, EmptyIcon, EmptyTitle, EmptyText,
} from "./component.styles";

// ── Mock stats ────────────────────────────────────────────────────────────────
// TODO: replace with Redux selector

const STAT_CARDS = [
  { label: "Active Projects",   value: 0, icon: "bi-folder",   color: colors.accentBlue  },
  { label: "Open Tasks",        value: 0, icon: "bi-list-task", color: colors.accentGreen },
  { label: "Pending Invoices",  value: 0, icon: "bi-receipt",  color: colors.accentAmber },
  { label: "Team Members",      value: 0, icon: "bi-people",   color: colors.accentRed   },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function Dashboard() {
  return (
    <Layout>
      <PageWrapper>
        <PageHeader>
          <div>
            <TitleRow>
              <Title>Dashboard</Title>
            </TitleRow>
            <Subtitle>Overview of your projects, tasks, and team — coming soon</Subtitle>
          </div>
        </PageHeader>

        <StatsGrid>
          {STAT_CARDS.map((card, i) => (
            <StatCard
              key={card.label}
              label={card.label}
              value={card.value}
              icon={<i className={`bi ${card.icon}`} />}
              iconColor={card.color}
              index={i}
            />
          ))}
        </StatsGrid>

        <EmptyState>
          <EmptyIcon>
            <i className="bi bi-bar-chart-line" />
          </EmptyIcon>
          <EmptyTitle>No dashboard data yet</EmptyTitle>
          <EmptyText>Charts and activity will appear here once data is connected.</EmptyText>
        </EmptyState>
      </PageWrapper>
    </Layout>
  );
}
