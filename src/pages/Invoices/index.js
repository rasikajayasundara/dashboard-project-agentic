import Layout from "../../components/Layout";
import InvoiceTable from "../ProjectDetail/Invoice/invoiceTable";
import {
  PageWrapper, PageHeader, TitleRow, Title, TitleBadge, Subtitle,
} from "../Projects/component.styles";

export default function InvoiceList() {
  return (
    <Layout>
      <PageWrapper>
        <PageHeader>
          <TitleRow>
            <Title>
              Invoices
            </Title>
            <Subtitle>Track billing, payment status and outstanding balances</Subtitle>
          </TitleRow>
        </PageHeader>

        {/* InvoiceTable with no projectId → fetches the global invoice list (GET /invoices) */}
        <InvoiceTable />
      </PageWrapper>
    </Layout>
  );
}
