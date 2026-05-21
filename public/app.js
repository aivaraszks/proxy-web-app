/**
 * * Deeplink template: replace YOUR_APP_SCHEME with your real custom scheme (e.g. myproduct).
 * * {userId} and {email} are substituted when the form is submitted.
 */
const DEEPLINK_TEMPLATE = "YOUR_APP_SCHEME://open?userId={userId}&email={email}";

function randomUserId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "u_" + Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
}

function buildDeeplink(userId, email) {
  const enc = encodeURIComponent(email.trim());
  return DEEPLINK_TEMPLATE.replace("{userId}", encodeURIComponent(userId)).replace("{email}", enc);
}

const form = document.getElementById("form");
const emailInput = document.getElementById("email");
const statusEl = document.getElementById("status");
const fallback = document.getElementById("fallback");
const deeplinkAnchor = document.getElementById("deeplink");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  if (!emailInput.checkValidity() || !email) {
    emailInput.reportValidity();
    return;
  }

  const userId = randomUserId();
  const link = buildDeeplink(userId, email);

  statusEl.hidden = false;
  statusEl.textContent = "User id: " + userId;

  deeplinkAnchor.href = link;
  fallback.hidden = false;

  window.location.href = link;
});
