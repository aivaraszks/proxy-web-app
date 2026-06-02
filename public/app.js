// * Matrix auth callback on the app (same URI shape as: adb shell am start -a VIEW -d "…" com.seca.myanalytics).
const APP_DEEPLINK_BASE = "com.seca.myanalytics://myAnalytics/auth/matrix/callback";
// const APP_DEEPLINK_BASE = "com.seca.myanalytics://myAnalytics/auth/matrix/login/callback"; // In case we sue two different callback urls

// * OAuth-style query params for local debugging (edit to match your flow).
const CALLBACK_CODE = "test";
const CALLBACK_STATE = "test";
const CALLBACK_ID_TOKEN = "some-id-token";

/**
 * @returns {string}
 */
function buildOpenAppHref() {
  const params = new URLSearchParams();
  params.set("code", CALLBACK_CODE);
  params.set("state", CALLBACK_STATE);
  params.set("id_token", CALLBACK_ID_TOKEN);
  return `${APP_DEEPLINK_BASE}?${params.toString()}`;
}

const form = document.getElementById("form");
const emailInput = document.getElementById("email");
const openAppLink = document.getElementById("open-app");

function syncOpenAppHref() {
  const email = emailInput.value.trim();
  if (emailInput.checkValidity() && email) {
    openAppLink.href = buildOpenAppHref();
  } else {
    openAppLink.href = "#";
  }
}

emailInput.addEventListener("input", syncOpenAppHref);
emailInput.addEventListener("change", syncOpenAppHref);

form.addEventListener("submit", (e) => {
  e.preventDefault();
});

openAppLink.addEventListener("click", (e) => {
  const email = emailInput.value.trim();
  if (!emailInput.checkValidity() || !email) {
    e.preventDefault();
    emailInput.reportValidity();
  }
});

syncOpenAppHref();
