 const validateForm = (data,requiredFields) => {
    const errors = {};

    requiredFields.forEach((field) => {
     
      if (!data[field] || data[field].toString().trim() === '') {
        errors[field] = 'This field is required';
      }
    });
    return errors;
  };




export function IsValidEmail(email) {
  if (typeof email !== "string") return false;

  // Overall sanity + length limits (typical)
  if (email.length < 6 || email.length > 254) return false;

  const at = email.indexOf("@");
  if (at <= 0 || at !== email.lastIndexOf("@") || at === email.length - 1) return false;

  const local = email.slice(0, at);
  const domain = email.slice(at + 1);

  // Local part rules
  if (local.length > 64) return false;
  if (!/^[A-Za-z0-9._%+-]+$/.test(local)) return false;      // NO "&" etc.
  if (local.startsWith(".") || local.endsWith(".")) return false;
  if (/\.\./.test(local)) return false;                      // no consecutive dots

  // Domain rules
  const labels = domain.split(".");
  if (labels.length < 2) return false;

  // Each label: alnum, hyphens allowed inside, 1–63 chars, no leading/trailing hyphen
  const labelRe = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/;
  for (let i = 0; i < labels.length - 1; i++) {
    const lbl = labels[i];
    if (!labelRe.test(lbl)) return false;
  }

  // TLD: letters only, 2–24 chars (reject numeric or mixed like ".123" or ".1a")
  const tld = labels[labels.length - 1];
  if (!/^[A-Za-z]{2,24}$/.test(tld)) return false;

  return true;
}

  
  
// utils/statusHTML.js
export function StatusHTML({ code }) {
  const map = {
    0: { cls: "text-secondary", label: "Draft", icon: "bi bi-pencil-square" },
    1: { cls: "text-warning",   label: "Pending", icon: "bi bi-hourglass-split" },
    2: { cls: "text-success",   label: "Approved", icon: "bi bi-check-circle" },
    3: { cls: "text-danger",    label: "Rejected", icon: "bi bi-x-circle" },
     "draft": { cls: "text-secondary", label: "Draft", icon: "bi bi-pencil-square" },
    "pending": { cls: "text-warning",   label: "Pending", icon: "bi bi-hourglass-split" },
   "approved": { cls: "text-success",   label: "Approved", icon: "bi bi-check-circle" },
   "rejected": { cls: "text-danger",    label: "Rejected", icon: "bi bi-x-circle" },
  };
  const { cls, label, icon } = map[code] ?? { cls: "text-muted", label: "Unknown", icon: "bi bi-question-circle" };

  return (
    <span className={cls}>
      {label} <i className={icon} />
    </span>
  );
}


export function StatusForTimesheet({ code }) {
  const map = {
    0: { cls: "text-secondary", label: "Not Submitted", icon: "bi bi-hourglass" },
    1: { cls: "text-warning",   label: "Pending Approval", icon: "bi bi-hourglass" },
    2: { cls: "text-success",   label: "Approved", icon: "bi bi-check" },
    3: { cls: "text-danger",    label: "Rejected", icon: "bi bi-exclamation" },
     "draft": { cls: "text-secondary", label: "Draft", icon: "bi bi-pencil-square" },
    "pending": { cls: "text-warning",   label: "Pending", icon: "bi bi-hourglass-split" },
   "approved": { cls: "text-success",   label: "Approved", icon: "bi bi-check-circle" },
   "rejected": { cls: "text-danger",    label: "Rejected", icon: "bi bi-x-circle" },
  };
  const { cls, label, icon } = map[code] ?? { cls: "text-muted", label: "Not Submitted", icon: "" };

  return (
    <span className={cls}>
      {label} <i className={icon} />
    </span>
  );
}

export function StatusForTask({ code }) {
  const map = {
    "pending": { cls: "text-warning",   label: "Not Completed", icon: "bi bi-hourglass-split" },
   "complete": { cls: "text-success",   label: "Completed", icon: "bi bi-check" },
  };
  const { cls, label, icon } = map[code] ?? { cls: "text-muted", label: "...", icon: "" };

  return (
    <span className={cls}>
      {label} <i className={icon} />
    </span>
  );
}



  export default validateForm;