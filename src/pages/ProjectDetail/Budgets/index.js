import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { formatCurrency } from "../../../utils/format";
import { projectBudgetAction } from "../../../store/projectBudgetSlice";
import ProgressBar from "../../../components/Progressbar";
import OptionsMenu from "../../../components/OptionsMenu";
import ConfirmDialog from "../../../components/ConfirmDialog";
import PermissionGate from "../../../components/PermissionGate";
import EmptyState from "../../../components/EmptyState";
import { usePermission } from "../../../hooks/usePermission";
import AddBudget from "./modals/AddBudget";
import EditBudget from "./modals/EditBudget";
import {
  BudgetWrapper, TableCard, TableHeader, TableTitle, TableHint, AddBudgetBtn,
  BudgetTable, Thead, Th, Tr, Td,
  BudgetId, BudgetName, TypeBadge, TaskChip, ProgressCell,
  SpentMeta, AmountPrimary,
  TotalRow, TotalLabelTd, TotalAmountTd, TotalEndTd, TotalAmount, EmptyCell, Toggle,
} from "./component.styles";

export default function BudgetList({ data }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: pid } = useParams();
  const { budgets, isLoading, statusUpdatingIds, deletingBudgetId } = useSelector((s) => s?.projectBudget) || {};

  const canBudgetEdit   = usePermission("canBudgetEdit");
  const canBudgetDelete = usePermission("canBudgetDelete");

  useEffect(() => {
    if (pid) dispatch(projectBudgetAction.fetchBudgetsStart(pid));
  }, [dispatch, pid]);

  const rows = budgets || [];
  const total = rows.reduce((sum, b) => sum + Number(b.budgetAmount || 0), 0);

  const [showAdd,            setShowAdd]            = useState(false);
  const [showEdit,           setShowEdit]           = useState(false);
  const [editBudget,         setEditBudget]         = useState(null);
  const [confirmDeleteBudgetId, setConfirmDeleteBudgetId] = useState(null);

  const openEdit = (budget) => {
    setEditBudget(budget);
    setShowEdit(true);
  };

  const handleDelete = () => {
    if (confirmDeleteBudgetId) {
      dispatch(projectBudgetAction.deleteBudgetStart(confirmDeleteBudgetId));
      setConfirmDeleteBudgetId(null);
    }
  };

  return (
    <BudgetWrapper>
      <TableCard>
        <TableHeader>
          <div>
            <TableTitle>Budget Breakdown</TableTitle>
            <TableHint>Cost and time budgets allocated to this project</TableHint>
          </div>
          <PermissionGate can="canBudgetAdd">
            <AddBudgetBtn onClick={() => setShowAdd(true)}>
              <i className="bi bi-plus-lg" />
              Add Budget
            </AddBudgetBtn>
          </PermissionGate>
        </TableHeader>

        <BudgetTable>
          <Thead>
            <tr>
              <Th>Active</Th>
              <Th>Budget ID</Th>
              <Th>Budget Name</Th>
              <Th>Type</Th>
              <Th>Tasks</Th>
              <Th>Progress</Th>
              <Th $right>Budget Amount</Th>
              <Th />
            </tr>
          </Thead>
          <tbody>
            {isLoading ? (
              <tr>
                <EmptyCell colSpan={8}>
                  Loading budgets…
                </EmptyCell>
              </tr>
            ) : rows.length > 0 ? (
              rows.map((budget) => {
                const burnPct     = Number(budget.spentPercentage) || 0;
                const spentAmt    = Number(budget.burntAmount) || 0;
                const taskCount   = budget.taskCount || 0;
                const isExpenseBudget = String(budget.budgetType || "").toLowerCase() === "expenses";

                return (
                  <Tr key={budget.budgetId}>
                    <Td>
                      <Toggle
                        htmlFor={`budget_active_${budget.budgetId}`}
                        $disabled={!canBudgetEdit}
                        title={!canBudgetEdit ? "You don't have permission to edit this budget" : undefined}
                      >
                        <input
                          type="checkbox"
                          id={`budget_active_${budget.budgetId}`}
                          checked={budget.status === 1}
                          onChange={() => dispatch(projectBudgetAction.updateBudgetStatusStart({ budgetId: budget.budgetId, status: budget.status === 1 ? "inactive" : "active" }))}
                          disabled={!canBudgetEdit || statusUpdatingIds.includes(budget.budgetId)}
                        />
                        <span />
                      </Toggle>
                    </Td>

                    <Td>
                      <BudgetId>BD{String(budget.budgetId).padStart(5, "0")}</BudgetId>
                    </Td>

                    <Td style={{ minWidth: 220 }}>
                      <BudgetName>{budget.budgetName}</BudgetName>
                    </Td>

                    <Td>
                      <TypeBadge>{budget.budgetType}</TypeBadge>
                    </Td>

                    <Td>
                      {isExpenseBudget ? (
                        <TaskChip onClick={() => navigate(`/project/${pid}?tab=expenses`)}>
                          <i className="bi bi-cash-stack" />
                          Expenses
                        </TaskChip>
                      ) : (
                        <TaskChip
                          onClick={() => navigate(`/project/${pid}?tab=tasks&budgetId=${budget.budgetId}`)}
                        >
                          <i className="bi bi-list-check" />
                          {taskCount} {taskCount === 1 ? "task" : "tasks"}
                        </TaskChip>
                      )}
                    </Td>

                    <Td style={{ minWidth: 200 }}>
                      <ProgressCell>
                        <ProgressBar value={burnPct} showLabel={false} height={6} />
                        <SpentMeta>
                          <span>{formatCurrency(spentAmt)} of {formatCurrency(Number(budget.budgetAmount))}</span>
                          <span>{burnPct}%</span>
                        </SpentMeta>
                      </ProgressCell>
                    </Td>

                    <Td $right>
                      <AmountPrimary>{formatCurrency(Number(budget.budgetAmount))}</AmountPrimary>
                    </Td>

                    <Td onClick={(e) => e.stopPropagation()}>
                      <OptionsMenu
                        items={[
                          { icon: "bi-pencil", label: "Edit Budget",   onClick: () => openEdit(budget), show: canBudgetEdit },
                          { icon: "bi-trash",  label: "Delete Budget", onClick: () => setConfirmDeleteBudgetId(budget.budgetId), danger: true, dividerBefore: true, disabled: deletingBudgetId !== null, show: canBudgetDelete },
                        ]}
                      />
                    </Td>
                  </Tr>
                );
              })
            ) : (
              <tr>
                <EmptyCell colSpan={8}>
                  <EmptyState
                    icon="bi-wallet2"
                    title="No budgets yet"
                    subtitle="Break the project into budgets to start tracking spend against the total."
                  />
                </EmptyCell>
              </tr>
            )}
          </tbody>
          <tfoot>
            <TotalRow>
              <TotalLabelTd colSpan={6}>Total Budget Amount</TotalLabelTd>
              <TotalAmountTd>
                <TotalAmount>{formatCurrency(total)}</TotalAmount>
              </TotalAmountTd>
              <TotalEndTd />
            </TotalRow>
          </tfoot>
        </BudgetTable>
      </TableCard>

      {showAdd && (
        <AddBudget projectId={pid} onClose={() => setShowAdd(false)} />
      )}

      {showEdit && editBudget && (
        <EditBudget budget={editBudget} onClose={() => setShowEdit(false)} />
      )}

      {confirmDeleteBudgetId && (
        <ConfirmDialog
          title="Delete Budget"
          message={`Permanently delete budget "${budgets.find(b => b.budgetId === confirmDeleteBudgetId)?.budgetName}"? All associated tasks and data will be removed. This cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDeleteBudgetId(null)}
        />
      )}
    </BudgetWrapper>
  );
}
