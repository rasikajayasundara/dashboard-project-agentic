import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_CHARS_RE = /^[+\d\s()-]+$/;

/**
 * useFormValidation
 *
 * @param {Object} [initialValues={}] — { fieldName: defaultValue, ... } (defaults to {} when omitted, null, or undefined)
 * @param {Object} rules          — { fieldName: { required, type, minLength, label }, ... }
 *
 * Supported rule keys:
 *   required   {boolean}  — field must not be empty
 *   type       {string}   — "email" validates format, "phone" validates digit count (7-15) and allowed characters
 *   minLength  {number}   — minimum character count
 *   label      {string}   — used in error messages (falls back to fieldName)
 *   minField   {string}   — another field name; this field's value must not be before it (ISO date strings)
 *   maxField   {string}   — another field name; this field's value must not be after it (ISO date strings)
 *   minDate    {string}   — static ISO date lower bound (e.g. a value from outside `values`)
 *   maxDate    {string}   — static ISO date upper bound
 *   minLabel   {string}   — human-readable name for the minField/minDate bound, used in the error message
 *   maxLabel   {string}   — human-readable name for the maxField/maxDate bound, used in the error message
 */
export default function useFormValidation(initialValues = {}, rules = {}) {
  const safeInitialValues = initialValues ?? {};
  const [values, setValues] = useState(safeInitialValues);
  const [errors, setErrors] = useState({});

  function handleChange(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validate() {
    const next = {};

    Object.entries(rules).forEach(([field, rule]) => {
      const val   = (values[field] ?? "").toString().trim();
      const label = rule.label || field;

      if (rule.required && !val) {
        next[field] = `${label} is required`;
        return;
      }

      if (val && rule.type === "email" && !EMAIL_RE.test(val)) {
        next[field] = `Enter a valid email address`;
        return;
      }

      if (val && rule.type === "phone") {
        const digits = val.replace(/\D/g, "");
        if (!PHONE_CHARS_RE.test(val) || digits.length < 7 || digits.length > 15) {
          next[field] = `Enter a valid phone number`;
          return;
        }
      }

      if (val && rule.minLength && val.length < rule.minLength) {
        next[field] = `${label} must be at least ${rule.minLength} characters`;
        return;
      }

      if (val && rule.minField && values[rule.minField]) {
        const otherVal = values[rule.minField].toString().trim();
        if (otherVal && val < otherVal) {
          next[field] = `${label} cannot be before ${rule.minLabel || rule.minField}`;
          return;
        }
      }

      if (val && rule.minDate && val < rule.minDate) {
        next[field] = `${label} cannot be before ${rule.minLabel || "the allowed date"}`;
        return;
      }

      if (val && rule.maxField && values[rule.maxField]) {
        const otherVal = values[rule.maxField].toString().trim();
        if (otherVal && val > otherVal) {
          next[field] = `${label} cannot be after ${rule.maxLabel || rule.maxField}`;
          return;
        }
      }

      if (val && rule.maxDate && val > rule.maxDate) {
        next[field] = `${label} cannot be after ${rule.maxLabel || "the allowed date"}`;
      }
    });

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function reset() {
    setValues(safeInitialValues);
    setErrors({});
  }

  return { values, errors, handleChange, validate, reset };
}
