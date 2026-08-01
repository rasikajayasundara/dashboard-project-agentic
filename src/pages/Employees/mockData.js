export const COLUMNS = [
  { key: "pm", label: "pm", sortable: true, index: 0 },
  { key: "role", label: "Role + Dept", sortable: true, index: 1 },
  { key: "manager", label: "Manager", sortable: true, index: 2 },
  { key: "workload", label: "Workload (This wk)", sortable: true, index: 3 },
  { key: "projects", label: "Projects", sortable: true, index: 4 },
  { key: "tasksOpen", label: "Tasks Open", sortable: true, index: 5 },
  { key: "hrsWk", label: "Hrs/Wk", sortable: true, index: 6 },
  { key: "billable", label: "Billable %", sortable: true, index: 7 },
  { key: "status", label: "Status", sortable: true, index: 8 },
];

export const Data = [
  {
    employeeId: "",
    row: [
      { value: "Rasika Jayasundara", type: "pm", subLabel: "EMP-8842" },
      {
        value: "Senior Front-end Engineer",
        type: "text",
        subLabel: "Engineering",
      },
      { value: "Sarah Jenkins", type: "text", subLabel: "" },
      { value: 108, type: "progress", subLabel: "%" },
      { value: 3, type: "number", subLabel: "" },
      { value: 5, type: "number", subLabel: "" },
      { value: 43, type: "number", subLabel: "/hr" },
      { value: 82, type: "progress", subLabel: "%" },
      { value: "Overloaded", type: "status", subLabel: "" },
    ],
  },

  {
    employeeId: "",
    row: [
      { value: "Sarah Jenkins", type: "pm", subLabel: "EMP-8838" },
      { value: "Engineering Manager", type: "text", subLabel: "Engineering" },
      { value: "Tom Reeves", type: "text", subLabel: "" },
      { value: 95, type: "progress", subLabel: "%" },
      { value: 5, type: "number", subLabel: "" },
      { value: 3, type: "number", subLabel: "" },
      { value: 38, type: "number", subLabel: "/hr" },
      { value: 60, type: "progress", subLabel: "%" },
      { value: "On track", type: "status", subLabel: "" },
    ],
  },

  {
    employeeId: "",
    row: [
      { value: "Mele Tepou", type: "pm", subLabel: "EMP-8851" },
      { value: "Product Manager", type: "text", subLabel: "Product" },
      { value: "Tom Reeves", type: "text", subLabel: "" },
      { value: 102, type: "progress", subLabel: "%" },
      { value: 4, type: "number", subLabel: "" },
      { value: 7, type: "number", subLabel: "" },
      { value: 41, type: "number", subLabel: "/hr" },
      { value: 75, type: "progress", subLabel: "%" },
      { value: "Overrun 1.5h", type: "status", subLabel: "" },
    ],
  },

  {
    employeeId: "",
    row: [
      { value: "Aroha Smith", type: "pm", subLabel: "EMP-8829" },
      { value: "Lead Designer", type: "text", subLabel: "Design" },
      { value: "Kiri Rata", type: "text", subLabel: "" },
      { value: 100, type: "progress", subLabel: "%" },
      { value: 4, type: "number", subLabel: "" },
      { value: 6, type: "number", subLabel: "" },
      { value: 40, type: "number", subLabel: "/hr" },
      { value: 88, type: "progress", subLabel: "%" },
      { value: "On track", type: "status", subLabel: "" },
    ],
  },

  {
    employeeId: "",
    row: [
      { value: "Rangi Patel", type: "pm", subLabel: "EMP-8820" },
      { value: "Back-end Engineer", type: "text", subLabel: "Engineering" },
      { value: "Sarah Jenkins", type: "text", subLabel: "" },
      { value: 90, type: "progress", subLabel: "%" },
      { value: 3, type: "number", subLabel: "" },
      { value: 4, type: "number", subLabel: "" },
      { value: 36, type: "number", subLabel: "/hr" },
      { value: 85, type: "progress", subLabel: "%" },
      { value: "On track", type: "status", subLabel: "" },
    ],
  },

  {
    employeeId: "",
    row: [
      { value: "Sione Vuki", type: "pm", subLabel: "EMP-8844" },
      { value: "Full-stack Engineer", type: "text", subLabel: "Engineering" },
      { value: "Sarah Jenkins", type: "text", subLabel: "" },
      { value: 117, type: "progress", subLabel: "%" },
      { value: 2, type: "number", subLabel: "" },
      { value: 9, type: "number", subLabel: "" },
      { value: 47, type: "number", subLabel: "/hr" },
      { value: 78, type: "progress", subLabel: "%" },
      { value: "Overrun 6h", type: "status", subLabel: "" },
    ],
  },

  {
    employeeId: "",
    row: [
      { value: "Kiri Rata", type: "pm", subLabel: "EMP-8833" },
      { value: "Design Director", type: "text", subLabel: "Design" },
      { value: "Tom Reeves", type: "text", subLabel: "" },
      { value: 88, type: "progress", subLabel: "%" },
      { value: 6, type: "number", subLabel: "" },
      { value: 2, type: "number", subLabel: "" },
      { value: 35, type: "number", subLabel: "/hr" },
      { value: 50, type: "progress", subLabel: "%" },
      { value: "On track", type: "status", subLabel: "" },
    ],
  },

  {
    employeeId: "",
    row: [
      { value: "Jade Whitfield", type: "pm", subLabel: "EMP-8825" },
      { value: "Junior Designer", type: "text", subLabel: "Design" },
      { value: "Kiri Rata", type: "text", subLabel: "" },
      { value: 80, type: "progress", subLabel: "%" },
      { value: 2, type: "number", subLabel: "" },
      { value: 3, type: "number", subLabel: "" },
      { value: 32, type: "number", subLabel: "/hr" },
      { value: 70, type: "progress", subLabel: "%" },
      { value: "On track", type: "status", subLabel: "" },
    ],
  },
];
