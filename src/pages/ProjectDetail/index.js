import { useEffect, useRef, useState, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import General from "./General";
import Budget from "./Budgets";
import Task from "./Task";
import InvoiceTab from "./Invoice";
import TeamTab from "./Team";
import Documents from "./Documents";
import Expenses from "./Expenses";
import ConfirmDialog from "../../components/ConfirmDialog";
import EditProject from "../Projects/modals/EditProject";
import { useDispatch, useSelector } from "react-redux";
import { projectAction } from "../../store/projectSlice";
import ProjectHeader from "./ProjectHeader";
import FullPageLoader from "../../components/FullPageLoader";
import { projectDetailAction } from "../../store/projectDetailSlice";
import Layout from "../../components/Layout";
import { usePermission } from "../../hooks/usePermission";
import { TabBarContainer, TabButton } from "../../components/TabBar";
import { PageWrapper } from "./component.styles";

const TAB_ICONS = {
  general: "bi-grid",
  budget: "bi-pie-chart",
  tasks: "bi-check2-square",
  team: "bi-people",
  documents: "bi-file-earmark-text",
  expenses: "bi-cash-stack",
  invoices: "bi-receipt",
};

const LoadingWrapper = styled.div`
  display: flex; justify-content: center; align-items: center; height: 60vh;
`;

// Small inline loader for tab bodies
function TabLoader() {
  return (
    <LoadingWrapper className="py-5">
      <div className="spinner-border text-secondary" role="status" />
    </LoadingWrapper>
  );
}

export default function ProjectDetail() {
  const navigate = useNavigate();
  const { id: pid } = useParams();
  const dispatch = useDispatch();

  // ---------- Redux state (hooks at top, always called) ----------
  const {
    isLoading,
    projectDetails: projectData,
    projectDocs,
  } = useSelector((s) => s?.projectDetails);

  const { isAuthenticating } = useSelector((state) => state.login);
  const { editProject, deleteProject, completeProject } = useSelector((state) => state?.project) || {};
  const editSavedAt = editProject?.savedAt;
  const deleteSavedAt = deleteProject?.savedAt;
  const completeSavedAt = completeProject?.savedAt;

  const budgetCount  = Number(projectData?.budgetCount)  || 0;
  const invoiceCount = Number(projectData?.invoiceCount) || 0;
  const willArchive  = budgetCount > 0 || invoiceCount > 0;

  const [checkUp, setCheckUp] = useState(false);
  const canEditProject   = usePermission("canProjectUpdate");
  const canDeleteProject = usePermission("canProjectDelete");
  const canBudgetRead    = usePermission("canBudgetRead");
  const canTaskRead      = usePermission("canTaskRead");
  const canInvoicesRead  = usePermission("canInvoiceRead");
  const canExpensesRead  = usePermission("canExpensesRead");

  // ---------- Local UI state (hooks at top, always called) ----------
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "general";
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const [update, setUpdate] = useState(false);

  // Update selected tab when URL query changes
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && tabFromUrl !== selectedTab) {
      setSelectedTab(tabFromUrl);
    }
  }, [searchParams]);

  const [showModalEdit, setShowModalEdit]       = useState(false);
  const [showModalRemove, setShowModalRemove]   = useState(false);
  const [showModalComplete, setShowModalComplete] = useState(false);

  // Tracks which project's tab content has already been shown once, so a
  // background refetch (isLoading flipping true again, e.g. after an edit)
  // doesn't unmount/remount the tab and re-fire its own data effects
  // (team, general stats) a second time. Set as soon as content is shown for
  // this pid — not gated on projectData, since projectData only arrives after
  // the loading flag has already flipped true once.
  const shownForPidRef = useRef(null);
  const showTabLoader = isLoading && shownForPidRef.current !== pid;
  if (!showTabLoader) {
    shownForPidRef.current = pid;
  }

  useEffect(() => {
    if (pid) {
      dispatch(projectDetailAction.fetchProjectDetailStart(pid));
    }
  }, [dispatch, pid, update, checkUp]);

  // Refetch project detail after a successful edit so header/tabs reflect the save
  useEffect(() => {
    if (editSavedAt && pid) {
      dispatch(projectDetailAction.fetchProjectDetailStart(pid));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editSavedAt]);

  // Close the delete/archive modal and navigate away after a successful delete/archive
  useEffect(() => {
    if (deleteSavedAt) {
      setShowModalRemove(false);
      setTimeout(() => {
        navigate("/projects");
        dispatch(projectAction.resetDeleteProject());
      }, 1500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteSavedAt]);

  // Close the complete modal and refetch project detail after a successful status update
  useEffect(() => {
    if (completeSavedAt && pid) {
      setShowModalComplete(false);
      dispatch(projectDetailAction.fetchProjectDetailStart(pid));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completeSavedAt]);

  // Clear any stale delete/archive/complete result from a previous project when this page mounts fresh
  useEffect(() => {
    dispatch(projectAction.resetDeleteProject());
    dispatch(projectAction.resetCompleteProject());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pid]);

  const visibleTabs = useMemo(() => {
    const tabs = ["general"];
    if (canBudgetRead) tabs.push("budget");
    if (canTaskRead) tabs.push("tasks");
    if (canTaskRead) tabs.push("team");
    tabs.push("documents");
    if (canExpensesRead) tabs.push("expenses");
    if (canInvoicesRead) tabs.push("invoices");
    return tabs;
  }, [canBudgetRead, canTaskRead, canInvoicesRead, canExpensesRead]);

  useEffect(() => {
    if (!visibleTabs.includes(selectedTab)) {
      setSelectedTab(visibleTabs[0]);
    }
  }, [visibleTabs, selectedTab]);

  const handleOpenModalEdit = () => setShowModalEdit(true);

  const handleOpenModalRemove = () => setShowModalRemove(true);
  const handleCloseModalRemove = () => setShowModalRemove(false);

  const handleRemoveProject = () => {
    dispatch(projectAction.deleteProjectStart({
      projectId: pid,
      successMessage: willArchive ? "Project archived successfully" : "Project deleted successfully",
    }));
  };

  const handleOpenModalComplete = () => setShowModalComplete(true);
  const handleCloseModalComplete = () => setShowModalComplete(false);
  const handleCompleteProject = () => {
    dispatch(projectAction.completeProjectStart({ projectId: pid }));
  };

  if (isAuthenticating) {
    return <FullPageLoader />;
  }

  const refreshProjectData = () => {
    dispatch(projectDetailAction.fetchProjectDetailStart(pid));
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case "general":
        return <General data={projectData} />;

      case "budget":
        return (
          <Budget
            data={projectData}
            refreshProjectData={refreshProjectData}
          />
        );

      case "tasks":
        return (
          <Task
            data={projectData}
            update={update}
            setUpdate={setUpdate}
            refreshProjectData={refreshProjectData}
            focusBudgetId={searchParams.get("budgetId")}
          />
        );

      case "team":
        return <TeamTab data={projectData} />;

      case "documents":
        return <Documents data={projectData} projectDocs={projectDocs} />;

      case "expenses":
        return <Expenses data={projectData} />;

      case "invoices":
        return <InvoiceTab projectData={projectData} project={projectData} />;

      default:
        return null;
    }
  };

  return (
    <Layout>
      <PageWrapper>
        <ProjectHeader
          project={projectData ?? {}}
          onEdit={handleOpenModalEdit}
          onDelete={handleOpenModalRemove}
          onComplete={handleOpenModalComplete}
          canEdit={canEditProject}
          canDelete={canDeleteProject}
        />

        {/* Tab nav */}
        <TabBarContainer>
          {visibleTabs.map((tab) => (
            <TabButton key={tab} $active={selectedTab === tab} onClick={() => setSelectedTab(tab)}>
              <i className={`bi ${TAB_ICONS[tab]}`} />
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </TabButton>
          ))}
        </TabBarContainer>

        {/* Tab content */}
        <div style={{ paddingTop: 20 }}>
          {showTabLoader ? <TabLoader /> : renderTabContent()}
        </div>


        {/* Edit Project Modal */}
        {showModalEdit && (
          <EditProject
            project={{ ...projectData, projectDocs }}
            onClose={() => setShowModalEdit(false)}
          />
        )}

        {/* Delete / Archive Project */}
        {showModalRemove && (
          <ConfirmDialog
            title={willArchive ? "Archive Project" : "Delete Project"}
            message={
              willArchive
                ? "This project has existing budgets or invoices, so it will be archived instead of permanently deleted. It will be moved to the archive, become read-only, and hidden from the active projects list."
                : "Permanently delete this project? All data including budgets, tasks, invoices and team assignments will be removed. This cannot be undone."
            }
            confirmLabel={willArchive ? "Archive" : "Delete"}
            variant="danger"
            onConfirm={handleRemoveProject}
            onCancel={handleCloseModalRemove}
          />
        )}

        {/* Mark Project as Completed */}
        {showModalComplete && (
          <ConfirmDialog
            title="Mark Project as Completed"
            message="Mark this project as completed? Its status will change to Completed and it will no longer appear as active."
            confirmLabel="Mark Completed"
            variant="success"
            onConfirm={handleCompleteProject}
            onCancel={handleCloseModalComplete}
          />
        )}
      </PageWrapper>
    </Layout>
  );
}
