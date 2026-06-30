import http from "k6/http";
import { check, group, sleep } from "k6";

const bAndBBaseUrl = __ENV.B_AND_B_BASE_URL || "https://automationintesting.online";
const restfulBookerBaseUrl = __ENV.RESTFUL_BOOKER_BASE_URL || "https://restful-booker.herokuapp.com";

export const options = {
  vus: 1,
  duration: "30s",
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<1500"]
  }
};

export default function () {
  group("B&B homepage availability entry point", () => {
    const response = http.get(bAndBBaseUrl);

    check(response, {
      "homepage responds with 200": (res) => res.status === 200,
      "homepage contains availability copy": (res) =>
        /check availability|availability/i.test(res.body)
    });
  });

  group("Restful Booker booking boundary", () => {
    const response = http.get(`${restfulBookerBaseUrl}/booking`);

    check(response, {
      "booking endpoint responds with 200": (res) => res.status === 200,
      "booking endpoint returns JSON": (res) =>
        String(res.headers["Content-Type"] || "").includes("application/json")
    });
  });

  sleep(1);
}
