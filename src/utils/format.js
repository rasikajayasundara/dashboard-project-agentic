export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  const numericAmount = Number(amount);

  if (isNaN(numericAmount)) return ''; // Handle invalid input gracefully

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(numericAmount);
  };

export function getInitials(name) {
  if (!name) return "";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

// Backend timestamps come back as either "YYYY-MM-DD HH:mm:ss" or ISO
// "YYYY-MM-DDTHH:mm:ss.sssZ" depending on the endpoint - take the date part
// regardless of which separator is used.
export function formatDateOnly(value) {
  if (!value) return "";
  return value.split(/[ T]/)[0];
}