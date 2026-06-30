export const config = {
  bAndBBaseUrl:
    process.env.B_AND_B_BASE_URL ?? "https://automationintesting.online",

  restfulBookerBaseUrl:
    process.env.RESTFUL_BOOKER_BASE_URL ?? "https://restful-booker.herokuapp.com",

  adminUsername:
    process.env.ADMIN_USERNAME ?? "admin",

  adminPassword:
    process.env.ADMIN_PASSWORD ?? "password"
};