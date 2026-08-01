import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../../components/DataTable";
import OptionsMenu from "../../../components/OptionsMenu";
import ConfirmDialog from "../../../components/ConfirmDialog";
import EmptyState from "../../../components/EmptyState";
import PermissionGate from "../../../components/PermissionGate";
import { usePermission } from "../../../hooks/usePermission";
import { formatCurrency } from "../../../utils/format";
import { projectBudgetAction } from "../../../store/projectBudgetSlice";
import { projectExpenseAction } from "../../../store/projectExpenseSlice";
import AttachmentPreviewModal from "../../../components/AttachmentPreviewModal";
import AddExpense from "./modals/AddExpense";
import EditExpense from "./modals/EditExpense";
import { normalizeAttachments, isPdfAttachment } from "./constants";
import {
  TableHeader, TableTitle, TableHint,
  AddExpenseBtn, AmountPrimary, MutedDash, AttachBtn,
} from "./component.styles";

const EXPENSE_COLUMNS = [
  { key: "title",      label: "Title",      sortable: false, index: 0 },
  { key: "type",       label: "Type",       sortable: false, index: 1 },
  { key: "budget",     label: "Budget",     sortable: false, index: 2 },
  { key: "mileage",    label: "Mileage",    sortable: false, index: 3 },
  { key: "cost",       label: "Cost",       sortable: false, index: 4, align: "right" },
  { key: "attachment", label: "Attachment", sortable: false, index: 5 },
  { key: "actions",    label: "",           sortable: false, index: 6 },
];

// The API now expands `attachments` into { id, name, link } objects (previously bare IDs) —
// use that name/url directly when present. Older/partial shapes (a bare ID with no name/url)
// fall back to the same-session cache of just-uploaded metadata, and finally to a disabled
// button rather than guessing a URL or crashing.
function resolveAttachment(expense, cache) {
  const attachments = normalizeAttachments(expense.attachments);
  if (attachments.length === 0) return null;
  const first = attachments[0];
  if (first.name && first.url) {
    return { documentId: first.documentId, name: first.name, url: first.url };
  }
  return cache[first.documentId] || null;
}

export default function Expenses() {
  const { id: pid } = useParams();
  const dispatch = useDispatch();
  const canExpensesUpdate = usePermission("canExpensesUpdate");
  const canExpensesDelete = usePermission("canExpensesDelete");
  const budgets = useSelector((s) => s?.projectBudget?.budgets) || [];
  const expenses = useSelector((s) => s?.projectExpense?.expenses) || [];

  useEffect(() => {
    if (pid) dispatch(projectBudgetAction.fetchBudgetsStart(pid));
  }, [dispatch, pid]);

  useEffect(() => {
    if (pid) dispatch(projectExpenseAction.fetchExpensesStart(pid));
  }, [dispatch, pid]);

  const [showAdd, setShowAdd] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const [previewExpense, setPreviewExpense] = useState(null);
  const [confirmDeleteExpense, setConfirmDeleteExpense] = useState(null);

  // Caches just-uploaded attachment metadata (keyed by documentId) so a row's attachment
  // preview works immediately in the same session, without waiting for a refetch — see
  // resolveAttachment() above for why the GET response alone isn't enough.
  const [attachmentCache, setAttachmentCache] = useState({});
  const cacheAttachment = (documentId, meta) => {
    setAttachmentCache((prev) => ({ ...prev, [documentId]: meta }));
  };

  const handleDelete = () => {
    if (!confirmDeleteExpense) return;
    dispatch(projectExpenseAction.deleteExpenseStart(confirmDeleteExpense.expenseId));
    setConfirmDeleteExpense(null);
  };

  const budgetName = (budgetId) =>
    budgets.find((b) => String(b.budgetId) === String(budgetId))?.budgetName;

  // Only budgets set up for expense tracking (budgetType === "Expenses") are valid
  // targets for an expense — Time budgets aren't selectable here.
  const expenseBudgets = budgets.filter(
    (b) => String(b.budgetType || "").toLowerCase() === "expenses"
  );

  const handleOpenAdd = () => {
    if (pid) dispatch(projectBudgetAction.fetchBudgetsStart(pid));
    setShowAdd(true);
  };

  const expensesForUI = expenses.map((expense) => ({
    ...expense,
    title: expense.expenseName,
    km: expense.type === "mileage" ? Number(expense.value) : null,
    cost: expense.type === "cost" ? Number(expense.value) : null,
    amount: Number(expense.amount),
    attachment: resolveAttachment(expense, attachmentCache),
  }));

  const tableData = expensesForUI.map((expense) => ({
    rowId: expense.expenseId,
    row: [
      { value: expense.title, type: "stacked", subLabel: expense.description || undefined },
      { value: expense.type === "mileage" ? "Mileage" : "Cost", type: "badge" },
      { value: budgetName(expense.budgetId) || <MutedDash>—</MutedDash>, type: "text" },
      { value: expense.type === "mileage" ? `${expense.km} km` : <MutedDash>—</MutedDash>, type: "text" },
      { value: <AmountPrimary>{formatCurrency(expense.amount)}</AmountPrimary>, type: "text" },
      {
        value: (
          <AttachBtn
            type="button"
            disabled={!expense.attachment}
            title={expense.attachment ? "Preview attachment" : "No attachment"}
            aria-label={expense.attachment ? "Preview attachment" : "No attachment"}
            onClick={() => setPreviewExpense(expense)}
          >
            <i className="bi bi-eye" />
          </AttachBtn>
        ),
        type: "text",
      },
      {
        value: (
          <OptionsMenu
            items={[
              { icon: "bi-pencil", label: "Edit Expense", onClick: () => setEditExpense(expense), show: canExpensesUpdate },
              {
                icon: "bi-trash",
                label: "Delete Expense",
                onClick: () => setConfirmDeleteExpense(expense),
                danger: true,
                dividerBefore: true,
                show: canExpensesDelete,
              },
            ]}
          />
        ),
        type: "text",
      },
    ],
  }));

  return (
    <div>
      <DataTable
        tabBarSlot={
          <TableHeader>
            <div>
              <TableTitle>Expenses</TableTitle>
              <TableHint>Mileage and out-of-pocket costs logged against this project</TableHint>
            </div>
            <PermissionGate can="canExpensesAdd">
              <AddExpenseBtn type="button" onClick={handleOpenAdd}>
                <i className="bi bi-plus-lg" />
                Add Expense
              </AddExpenseBtn>
            </PermissionGate>
          </TableHeader>
        }
        columns={EXPENSE_COLUMNS}
        data={tableData}
        hideActionCol
        emptyState={
          <EmptyState
            icon="bi-cash-stack"
            title="No expenses yet"
            subtitle="Log mileage or out-of-pocket costs for this project."
          />
        }
      />

      {showAdd && (
        <AddExpense budgets={expenseBudgets} onUploaded={cacheAttachment} onClose={() => setShowAdd(false)} />
      )}

      {editExpense && (
        <EditExpense
          expense={editExpense}
          budgets={expenseBudgets}
          onUploaded={cacheAttachment}
          onClose={() => setEditExpense(null)}
        />
      )}

      {previewExpense && (
        <AttachmentPreviewModal
          title={previewExpense.title}
          attachment={previewExpense.attachment}
          kind={isPdfAttachment(previewExpense.attachment) ? "pdf" : "image"}
          onClose={() => setPreviewExpense(null)}
        />
      )}

      {confirmDeleteExpense && (
        <ConfirmDialog
          title="Delete Expense"
          message={`Permanently delete "${confirmDeleteExpense.title}"? This cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDeleteExpense(null)}
        />
      )}
    </div>
  );
}
