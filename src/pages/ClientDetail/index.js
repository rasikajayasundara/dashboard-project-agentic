import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../../constants/common";
import { formatCurrency } from "../../utils/format";
import Layout from "../../components/Layout";
import StatCard from "../../components/Statcard";
import { StatsGrid } from "../../components/Statcard/component.styles";
import { TabBarContainer, TabButton } from "../../components/TabBar";
import { clientAction } from "../../store/clientSlice";
import ClientHeader from "./ClientHeader";
import ClientOverview from "./Overview";
import ClientProjects from "./Projects";
import ClientInvoices from "./Invoices";
import { PageWrapper, TabContent, LoadingWrapper } from "./component.styles";

const TABS = ["overview", "projects", "invoices"];

const TAB_ICONS = {
  overview: "bi-speedometer2",
  projects: "bi-folder",
  invoices: "bi-receipt",
};

export default function ClientDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { clientInfo, clientStat, isLoadingDetail } = useSelector((state) => state.clients);
  const [selectedTab, setSelectedTab] = useState("overview");

  useEffect(() => {
    dispatch(clientAction.clientDetailStart(id));
    dispatch(clientAction.clientProjectsStart(id));
    dispatch(clientAction.clientInvoicesStart(id));
  }, [dispatch, id]);

  const client = { ...clientInfo, ...clientStat };

  const STAT_CARDS = [
    { label: "Lifetime Value",  value: formatCurrency(clientStat.lifetimeValue ?? 0), icon: "bi-graph-up",      color: colors.accentBlue  },
    { label: "Outstanding",     value: formatCurrency(clientStat.outstanding ?? 0),    icon: "bi-receipt",       color: colors.accentAmber },
    { label: "Active Projects", value: `${clientStat.activeProjects ?? 0}`,            icon: "bi-folder",        color: colors.accentGreen },
    { label: "Avg Pay Time",    value: `${clientStat.avgPayTime ?? 0} days`,           icon: "bi-clock-history", color: colors.accentRed   },
  ];

  const renderTabContent = () => {
    switch (selectedTab) {
      case "overview":  return <ClientOverview />;
      case "projects":  return <ClientProjects />;
      case "invoices":  return <ClientInvoices />;
      default:          return null;
    }
  };

  if (isLoadingDetail) {
    return (
      <Layout>
        <PageWrapper>
          <LoadingWrapper>
            <div className="spinner-border text-secondary" role="status" />
          </LoadingWrapper>
        </PageWrapper>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageWrapper>
        {/* Client profile card */}
        <ClientHeader client={client} />

        {/* Stat cards */}
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

        {/* Tab nav */}
        <TabBarContainer style={{ marginTop: 24 }}>
          {TABS.map((tab) => (
            <TabButton key={tab} $active={selectedTab === tab} onClick={() => setSelectedTab(tab)}>
              <i className={`bi ${TAB_ICONS[tab]}`} />
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </TabButton>
          ))}
        </TabBarContainer>

        {/* Tab content */}
        <TabContent>{renderTabContent()}</TabContent>
      </PageWrapper>
    </Layout>
  );
}
