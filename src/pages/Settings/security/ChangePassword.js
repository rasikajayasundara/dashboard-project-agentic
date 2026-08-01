import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changePasswordAction } from "../../../store/changePasswordSlice";
import { SNACKBAR_TYPES, snackbarAction } from "../../../store/snackbarSlice";
import { loginAction } from "../../../store/LoginSlice";
import { authAction } from "../../../store/authSlice";
import ButtonStyled from "../../../components/ButtonStyled";
import FormField, { FormInput, InputWrapper, InputSlot } from "../../../components/FormField";
import { CardTitle, CardSubtitle } from "../component.styles";
import { Form } from "./changePassword.styles";

function ChangePassword() {
  const [form, setForm] = useState({ current: "", new: "", confirm: "" });
  const [errors, setErrors] = useState({ current: "", new: "", confirm: "" });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading    = useSelector((_) => _?.changePassword?.isLoading);
  const changeError  = useSelector((_) => _?.changePassword?.error);
  const changeSuccess = useSelector((_) => _?.changePassword?.success);

  useEffect(() => {
    if (changeError) {
      dispatch(snackbarAction.showSnackbar({
        message: changeError,
        type: SNACKBAR_TYPES.ERROR,
      }));
    }
  }, [changeError, dispatch]);

  useEffect(() => {
    if (changeSuccess) {
      dispatch(snackbarAction.showSnackbar({
        message: "Password changed successfully! You'll be logged out — please log in again.",
        type: SNACKBAR_TYPES.SUCCESS,
      }));
      setForm({ current: "", new: "", confirm: "" });

      const timer = setTimeout(() => {
        dispatch(loginAction.loginReset());
        dispatch(authAction.logoutStart());
        navigate("/login");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [changeSuccess, dispatch, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateField = (name, value) => {
    if (!value || value.trim() === "") return "This field is required.";

    if (name === "new") {
      const checks = [];
      if (value.length < 8)        checks.push("at least 8 characters");
      if (!/[a-z]/.test(value))    checks.push("a lowercase letter");
      if (!/[A-Z]/.test(value))    checks.push("an uppercase letter");
      if (!/[0-9]/.test(value))    checks.push("a number");
      if (checks.length) return `Include ${checks.join(", ")}.`;
    }

    if (name === "confirm" && value !== form.new)
      return "Confirmation does not match the new password.";

    return "";
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {
      current: validateField("current", form.current),
      new:     validateField("new",     form.new),
      confirm: validateField("confirm", form.confirm),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some((v) => v)) return;
    dispatch(changePasswordAction.changePasswordStart({ current: form.current, new: form.new }));
  };

  return (
    <div>
      <CardTitle>Change Password</CardTitle>
      <CardSubtitle>
        Update your password regularly to keep your account secure.
        <br />
        Please enter your current password, then create a new one following your
        organization's password policy.
      </CardSubtitle>
      <Form onSubmit={handleSubmit}>
        <div>
          <FormField label="Current Password" error={errors.current}>
            <InputWrapper>
              <FormInput
                type={show.current ? "text" : "password"} name="current"
                value={form.current} onChange={handleChange} onBlur={handleBlur}
                placeholder="Current Password" autoComplete="current-password"
                $error={!!errors.current} $hasEnd
              />
              <InputSlot $end $clickable onClick={() => setShow((s) => ({ ...s, current: !s.current }))}>
                <i className={`bi bi-eye${show.current ? "" : "-slash"}`} />
              </InputSlot>
            </InputWrapper>
          </FormField>
        </div>
        <div>
          <FormField label="New Password" error={errors.new}>
            <InputWrapper>
              <FormInput
                type={show.new ? "text" : "password"} name="new"
                value={form.new} onChange={handleChange} onBlur={handleBlur}
                placeholder="New Password" autoComplete="new-password"
                $error={!!errors.new} $hasEnd
              />
              <InputSlot $end $clickable onClick={() => setShow((s) => ({ ...s, new: !s.new }))}>
                <i className={`bi bi-eye${show.new ? "" : "-slash"}`} />
              </InputSlot>
            </InputWrapper>
          </FormField>
        </div>
        <div>
          <FormField label="Confirm New Password" error={errors.confirm}>
            <InputWrapper>
              <FormInput
                type={show.confirm ? "text" : "password"} name="confirm"
                value={form.confirm} onChange={handleChange} onBlur={handleBlur}
                placeholder="Confirm New Password" autoComplete="new-password"
                $error={!!errors.confirm} $hasEnd
              />
              <InputSlot $end $clickable onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}>
                <i className={`bi bi-eye${show.confirm ? "" : "-slash"}`} />
              </InputSlot>
            </InputWrapper>
          </FormField>
        </div>
        <div>
        <ButtonStyled
          variant="primary" type="submit" fullWidth
          disabled={
            isLoading ||
            Object.values(errors).some((v) => v) ||
            !form.current || !form.new || !form.confirm
          }
        >
          {isLoading ? "Changing..." : "Change Password"}
        </ButtonStyled>
        </div>
      </Form>
    </div>
  );
}

export default ChangePassword;
