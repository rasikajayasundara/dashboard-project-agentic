// Set per-deploy via REACT_APP_ENVIRONMENT — hardcoded in each
// .github/workflows/deploy-*.yml (one value per environment, so no secret/
// variable management needed) and in the local .env for `npm start`.
export const APP_ENV = process.env.REACT_APP_ENVIRONMENT || "development";

export const IS_DEVELOPMENT = APP_ENV === "development";
export const IS_UAT = APP_ENV === "uat";
export const IS_SANDBOX = APP_ENV === "sandbox";
