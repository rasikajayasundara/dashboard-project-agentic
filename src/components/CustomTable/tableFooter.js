import ButtonStyled from "../ButtonStyled";
import { FooterWrapper, FooterInfo, PaginationGroup } from "./component.styles";

const TableFooter = ({ page, totalPages, onClick, pageSize, sorted }) => {
  return (
    <>
      <FooterInfo>
        Showing {Math.min((page - 1) * pageSize + 1, sorted.length)}–
        {Math.min(page * pageSize, sorted.length)} of {sorted.length} projects
      </FooterInfo>

      <PaginationGroup>
        <ButtonStyled
          variant="secondary"
          onClick={() => onClick((p) => p - 1)}
          disabled={page === 1}
        >
          ‹
        </ButtonStyled>
        {Array.from({ length: totalPages }, (_, k) => k + 1).map((p) => (
          <ButtonStyled
            key={p}
            active={p === page ? 1 : 0}
            onClick={() => onClick(p)}
          >
            {p}
          </ButtonStyled>
        ))}
        <ButtonStyled
          variant="secondary"
          onClick={() => onClick((p) => p + 1)}
          disabled={page === totalPages}
        >
          ›
        </ButtonStyled>
      </PaginationGroup>
    </>
  );
};

export default TableFooter;
