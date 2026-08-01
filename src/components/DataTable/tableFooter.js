import { PageBtn } from "./component.styles";
import { fontSize } from "../../constants/common";

const getPageNumbers = (page, totalPages, maxVisible = 3) => {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  let start = Math.max(1, page - 1);
  let end = Math.min(totalPages, start + maxVisible - 1);
  start = Math.max(1, end - maxVisible + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

const TableFooter = ({ page, totalPages, onClick, pageSize, total, middleSlot }) => (
  <>
    <span style={{ fontSize: fontSize.general, color: "#9CA3AF", fontFamily: '"Inter", "Segoe UI", sans-serif' }}>
      Showing {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)} of {total}
    </span>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      {middleSlot}
      <div style={{ display: "flex", gap: 4 }}>
      <PageBtn
        onClick={() => onClick((p) => Math.max(1, p - 1))}
        disabled={page === 1}
      >
        ‹
      </PageBtn>
      {getPageNumbers(page, totalPages).map((p) => (
        <PageBtn
          key={p}
          $active={p === page}
          onClick={() => onClick(p)}
        >
          {p}
        </PageBtn>
      ))}
      <PageBtn
        onClick={() => onClick((p) => Math.min(totalPages, p + 1))}
        disabled={page === totalPages}
      >
        ›
      </PageBtn>
      </div>
    </div>
  </>
);

export default TableFooter;
