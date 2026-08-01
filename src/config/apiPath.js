// login Auth Varification API
export const AUTH_LOGIN = "auth/login";
export const AUTH_REFRESH_TOKEN = "auth/refresh";
export const AUTH_LOGOUT = "auth/logout";

//forgot password related apis
export const FORGOT_PASS_REQUEST = "auth/forgot-password";
export const FORGOT_PASS_AUTH_TOKEN = "auth/validate-reset-otp";
export const FORGOT_PASS_CHANGE = "auth/reset-password";

//reset password related APIS
export const VALIDATE_ACTIVATION_TOKEN = "auth/validate-activation-token";
export const ADD_NEW_PASSWORD = "auth/add-new-password";

//change password (logged-in user, Settings > Security)
export const CHANGE_PASSWORD = "auth/change-password";

//Notification API
export const NOTIFICATIONS_LIST = "notifications";
export const NOTIFICATIONS_RECENT = "notifications/recent";
export const NOTIFICATION_MARK_READ_PREFIX = "notifications/";
export const NOTIFICATION_MARK_READ_SUFFIX = "/read";

//Project Related APIS
export const FATCH_CLIENT_PROJECTS =
  "projects/project_list_by_client?client_id=";
export const FETCH_PROJECTS = "projects";
export const PROJECT_DETAILS = "projects/";
export const PROJECT_DETAILS_PID = `projects/project_detail?pid=`;
export const CREATE_NEW_PROJECT = "projects/add";
export const PROJECT_UPDATE_PREFIX = "projects/";
export const PROJECT_STATUS_CHANGE = "projects/project_status_change";
export const PROJECT_STATUS_UPDATE_PREFIX = "projects/";
export const PROJECT_STATUS_UPDATE_SUFFIX = "/status";
export const PROJECTS_BY_CLIENT_PREFIX = "projects/";
export const PROJECTS_BY_CLIENT_SUFFIX = "/byClient";
export const PROJECTS_BY_EMPLOYEE_PREFIX = "projects/";
export const PROJECTS_BY_EMPLOYEE_SUFFIX = "/byEmployee";
export const MY_PROJECTS = "projects/myProjects";
export const PROJECT_TEAM_PREFIX = "projects/";
export const PROJECT_TEAM_SUFFIX = "/users";
export const PROJECT_GENERAL_STATS_PREFIX = "projects/";
export const PROJECT_GENERAL_STATS_SUFFIX = "/generalStats";

//employee related APIS
export const FETCH_EMPLOYEES_BY_TYPE = "employees/basic?userType=";
export const FETCH_EMPLOYEES_BASIC = "employees/basic?userType=ALL";
export const FETCH_EMPLOYEES_LIST = "employees";
export const EMPLOYEE_DETAILS = "employees/";
export const ADD_EMPLOYEE = "employees/addNewEmployee";
export const DELETE_EMPLOYEE = `employees/delete_employee`;
export const EDIT_EMPLOYEE = "employees/edit_employee";
export const EMPLOYEE_DETAILS_EMPID = "employees/employee_details?empid=";
export const RESEND_ACTIVATION = "employees/resend-activation";

//client related APIS
// GET/PUT/DELETE all hit clients/{clientId} - same path, different verb.
export const CLIENT_DETAILS = "clients/";
export const CLIENTS_DETAILS_LIST = "clients";
export const ADD_CLIENT = "clients/addClient";

//budget related APIS
export const NEW_BUDGET = "budgets/new_budget";
export const BUDGET_STATUS = "budgets/budget_status";
export const DELETE_BUDGET = "budgets/delete_budget";
export const ADD_NEW_BUDGET = "budgets/new_budget";
export const EDIT_BUDGET = "budgets/edit_budget";
export const BUDGET_LIST = "budgets/budget_list?pid=";
export const BUDGETS_BY_PROJECT_PREFIX = "budgets/";
export const BUDGETS_BY_PROJECT_SUFFIX = "/byProject";
export const BUDGET_STATUS_UPDATE_PREFIX = "budgets/";
export const BUDGET_STATUS_UPDATE_SUFFIX = "/status";
export const ADD_BUDGET = "budgets/addNewBudget";
export const UPDATE_BUDGET_PREFIX = "budgets/";
export const UPDATE_BUDGET_SUFFIX = "";
export const DELETE_BUDGET_PREFIX = "budgets/";
export const DELETE_BUDGET_SUFFIX = "";

//task related APIS
export const EDIT_TASK = "tasks/edit_task";
export const DELETE_TASK_PREFIX = "tasks/";
export const DELETE_TASK_SUFFIX = "";
export const ADD_TASK = "tasks/add_task";
export const ADD_TASK_NEW = "tasks/add";
export const UPDATE_TASK_PREFIX = "tasks/";
export const UPDATE_TASK_SUFFIX = "";
export const TASKS_BY_PROJECT_PREFIX = "tasks/";
export const TASKS_BY_PROJECT_SUFFIX = "/byProject";

//permission related api

export const ADD_PERMISSION = "permission/create_permission";
export const PERMISSION_LIST = "permission/list_permission";
export const PERMISSIONS_LIST = "config/permissions";

//roles related api

export const ROLE_LIST = "roles/list_role";
export const ADD_NEW_USER_ROLE = "roles/add_role";
export const ROLES_LIST = "config/roles";
export const UPDATE_ROLE_PERMISSIONS_PREFIX = "config/roles/";
export const UPDATE_ROLE_PERMISSIONS_SUFFIX = "/permissions";

// task allocation to employee
export const TASK_EDIT_FOR_EMPLOYEE = "allocations/edit_assign_task";
export const TASK_FOR_EMPLOYEE = "allocations/assign_task";
export const DELETE_TASK_ALLOCATION = "allocations/delete_assign_task";
export const MY_TASK_LIST = "allocations/my_tasks";
export const GET_ALL_EMP_TASK = "/allocations/tasks?emp_id=";
export const TASKS_BY_EMPLOYEE_PREFIX = "taskAss/";
export const TASKS_BY_EMPLOYEE_SUFFIX = "/byUser";
export const MY_TASK_ASSIGNMENTS = "taskAss/myTaskAss";
export const TASK_ASSIGNMENT_STATUS_SUFFIX = "/status";
export const ADD_TASK_ASSIGNMENT = "taskAss/add";
export const TASK_ASSIGNMENT_PREFIX = "taskAss/";
export const GET_ALL_EMP_TIMESHEET = "timesheets/weekly_timesheets?emp_id=";
export const GET_EACH_EMP_TIMESHEET =
  "timesheets/weekly_timesheet_records_emp?";

export const TIMESHEETS_BY_EMPLOYEE_PREFIX = "timesheets/";
export const TIMESHEETS_BY_EMPLOYEE_SUFFIX = "/byUser";
export const TIME_ENTRIES_PREFIX = "timesheets/timeEntries/";
export const LOG_TIME_TASKS_PREFIX = "timesheets/";
export const LOG_TIME_TASKS_SUFFIX = "/tasks/";

export const MY_TIMESHEETS = "timesheets/me";
export const MY_TIME_ENTRIES_PREFIX = "timesheets/myTimeEntries/";
export const MY_LOG_TIME_TASKS_PREFIX = "timesheets/me/tasks/";

export const MY_TIMESHEET_GRAPH = "timesheets/me/graph";
export const TIMESHEET_GRAPH_PREFIX = "timesheets/";
export const TIMESHEET_GRAPH_SUFFIX = "/graph";

// timesheet related apis

export const SAVE_TIME_ENTRIES = "timesheets/entries";
export const DELETE_TIME_ENTRY_PREFIX = "timesheets/entries/";
export const EMP_TIME_LOG = "timesheets/log_time";
export const EMP_WEEKLY_TIMESHEET = "timesheets/weekly_timesheets";
export const EMP_WEEK_RECORD =
  "timesheets/weekly_timesheet_records?week_start=";
export const SUBMIT_TIMESHEET = "timesheets/submit";
export const TIMESHEET_RECORD = "timesheets/record_time";
export const MY_PROFILE = "employees/me/profile";

export const ROLE_LIST_1 = "roles/list_role?level=1";

export const TIMESHEETS_FOR_REVIEW = "timesheets/forReview";
export const REVIEW_TIMESHEET = "timesheets/review";

// settings / reference metadata
export const SETTINGS_METADATA = "settings/metadata";
export const JOB_TITLE_ROLE_UPDATE_PREFIX = "config/job-titles/";
export const JOB_TITLE_ROLE_UPDATE_SUFFIX = "/role";

//invoice related APIs
export const INVOICES_LIST = "invoices";
export const INVOICE_LIST = "invoices/invoice_list";
export const NEW_INVOICE = "invoices/new_invoice";
export const CREATE_INVOICE = "invoices/add";
export const INVOICE_DETAIL = "invoices/";
export const EDIT_INVOICE = "invoices/edit_invoice";
export const DELETE_INVOICE = "invoices/";
export const INVOICES_BY_CLIENT_PREFIX = "invoices/";
export const INVOICES_BY_CLIENT_SUFFIX = "/byClient";
export const INVOICES_BY_PROJECT_PREFIX = "invoices/";
export const INVOICES_BY_PROJECT_SUFFIX = "/byProject";
export const INVOICE_STATUS_PREFIX = "invoices/";
export const INVOICE_STATUS_SUFFIX = "/status";

// documents / upload related APIs
export const DOCUMENT_UPLOAD = "documents/upload";
export const STORAGE_UPLOAD = "storage/upload";

//expense related APIs
export const EXPENSES_BY_PROJECT_PREFIX = "expenses/";
export const EXPENSES_BY_PROJECT_SUFFIX = "/byProject";
export const ADD_EXPENSE = "expenses/addNewExpense";
export const UPDATE_EXPENSE_PREFIX = "expenses/";
export const DELETE_EXPENSE_PREFIX = "expenses/";

// Dashboard APIs (prefix with REACT_APP_ANALYTICS_BASE_URL)
// Project Analytics
export const ANALYTICS_PROJECTS_SUMMARY = "/projects/summary";
export const ANALYTICS_PROJECTS_LIST = "/projects";
export const ANALYTICS_PROJECTS_LEADERBOARD = "/projects/manager-leaderboard";
export const ANALYTICS_PROJECTS_TIMELINE = "/projects/timeline";
export const ANALYTICS_PROJECTS_RISKS = "/projects/risks";

// Company Overview
export const ANALYTICS_COMPANY_OVERVIEW = "/company/overview";
export const ANALYTICS_COMPANY_LOCATIONS = "/company/locations";
export const ANALYTICS_COMPANY_REVENUE = "/company/revenue";
export const ANALYTICS_COMPANY_FINANCIAL_TRENDS = "/company/financial-trends";
export const ANALYTICS_COMPANY_INVOICES_OUTSTANDING =
  "/company/invoices-outstanding";
