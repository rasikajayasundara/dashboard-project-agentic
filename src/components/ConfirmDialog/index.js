import { useCallback, useRef, useState } from "react";
import { Overlay, Dialog, IconWrap, Title, Message, CheckboxRow, CommentTextarea, Buttons, CancelBtn, ConfirmBtn, getVariant } from "./component.styles";

/**
 * ConfirmDialog — reusable confirmation prompt.
 *
 * Props:
 *   title           {string}                         — dialog heading
 *   message         {string}                         — supporting text
 *   confirmLabel    {string}                         — confirm button label (default "Confirm")
 *   cancelLabel     {string}                         — cancel button label  (default "Cancel")
 *   variant         {"info"|"success"|"danger"}      — controls color + icon (default "info" = blue)
 *   requireCheckbox {boolean}                        — if true, shows checkboxLabel as a checkbox and keeps confirm disabled until checked
 *   checkboxLabel   {string}                          — label shown next to the gating checkbox
 *   showComment     {boolean}                        — if true, shows a comment textarea
 *   commentValue    {string}                         — controlled value for the comment textarea
 *   onCommentChange {fn}                              — (value) => void, called on textarea change
 *   commentPlaceholder {string}                       — placeholder text for the textarea
 *   commentRequired {boolean}                         — if true (default), keeps confirm disabled until commentValue is non-blank
 *   onConfirm       {fn}                             — called when confirm is clicked
 *   onCancel        {fn}                             — called when cancel or overlay is clicked
 */
export default function ConfirmDialog({
  title        = "Are you sure?",
  message      = "",
  confirmLabel = "Confirm",
  cancelLabel  = "Cancel",
  variant      = "info",
  requireCheckbox = false,
  checkboxLabel   = "",
  showComment        = false,
  commentValue       = "",
  onCommentChange,
  commentPlaceholder = "",
  commentRequired     = true,
  onConfirm,
  onCancel,
}) {
  const { accent, icon } = getVariant(variant);
  const [checked, setChecked] = useState(false);
  const confirmDisabled =
    (requireCheckbox && !checked) ||
    (showComment && commentRequired && !commentValue.trim());

  const [shake, setShake] = useState(false);
  const [hasShaken, setHasShaken] = useState(false);
  const timeoutRef = useRef(null);

  const handleBackdropClick = useCallback((e) => {
    if (e.target !== e.currentTarget) return;
    setShake(true);
    setHasShaken(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShake(false), 300);
  }, []);

  return (
    <Overlay onClick={handleBackdropClick}>
      <Dialog $accent={accent} $shake={shake} $hasShaken={hasShaken} onClick={(e) => e.stopPropagation()}>

        <IconWrap $accent={accent}>
          <i className={`bi ${icon}`} />
        </IconWrap>

        <Title>{title}</Title>

        {message && <Message>{message}</Message>}

        {requireCheckbox && (
          <CheckboxRow>
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            {checkboxLabel}
          </CheckboxRow>
        )}

        {showComment && (
          <CommentTextarea
            rows={3}
            value={commentValue}
            onChange={(e) => onCommentChange?.(e.target.value)}
            placeholder={commentPlaceholder}
          />
        )}

        <Buttons>
          <CancelBtn onClick={onCancel}>{cancelLabel}</CancelBtn>
          <ConfirmBtn $accent={accent} onClick={onConfirm} disabled={confirmDisabled}>{confirmLabel}</ConfirmBtn>
        </Buttons>

      </Dialog>
    </Overlay>
  );
}
