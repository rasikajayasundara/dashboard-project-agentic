import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import InvoiceTable from "./invoiceTable";

const InvoiceTab = ({ project, projectData }) => {
  const { id: projectId } = useParams();
  const budgets   = useSelector((s) => s?.projectBudget?.budgets) || [];
  const clientId  = projectData?.clientId;
  const billingContact = projectData?.clientContactName;

  return (
    <InvoiceTable
      clientId={clientId}
      projectId={projectId}
      clientName={projectData?.clientName}
      billingContact={billingContact}
      projectNo={projectData?.projectNo}
      projectName={projectData?.projectName}
      budgets={budgets}
    />
  );
};

export default InvoiceTab;
