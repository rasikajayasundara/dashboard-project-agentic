// Shared CSV export — every list page passes its currently filtered/sorted
// raw data array plus a small column spec; this handles escaping and the
// browser download. Column `accessor` receives one raw row object (not a
// DataTable row — DataTable's row cells can hold JSX, so pages export from
// their own filtered array, the same one they pass into DataTable).

function csvEscapeCell(value) {
  const str = value == null ? "" : String(value);
  return /[",\r\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

const BOM = "﻿"; // Excel opens the file as UTF-8 instead of mangling accented characters.

export function exportToCsv(filename, columns, rows) {
  const header = columns.map((c) => csvEscapeCell(c.label)).join(",");
  const lines = rows.map((row) =>
    columns.map((c) => csvEscapeCell(c.accessor(row))).join(",")
  );
  const csv = BOM + [header, ...lines].join("\r\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
