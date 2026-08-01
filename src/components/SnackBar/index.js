import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


import { CloseBtn, SnackbarBox, Wrapper } from "./component.styles";
import { snackbarAction } from "../../store/snackbarSlice";


const Snackbar = () => {
  const dispatch = useDispatch();
  const { open, message, type } = useSelector((state) => state.snackbar);

  const handleClose = () => {
    dispatch(snackbarAction.hideSnackbar());
  };

  useEffect(() => {
    if (open) {
      const timer = setTimeout(handleClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!open) return null;

  return (
    <Wrapper>
      <SnackbarBox type={type}>
        {message}
        <CloseBtn onClick={handleClose}>×</CloseBtn>
      </SnackbarBox>
    </Wrapper>
  );
};

export default Snackbar;
