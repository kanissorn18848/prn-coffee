const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxEe7hZVjMtQaDWyfNaQD_IsJGBWX6EvN7tRZWJeDUS9q2HSWMIEiTR-GZvoXWYGzvp-g/exec";

async function apiFetch(url, options) {
  const response = await fetch(url, options);
  if (options && options.mode === "no-cors") return null;
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

document.addEventListener("DOMContentLoaded", () => {
  checkDailyStock();
  updateSummary();

  document
    .getElementById("customer-name")
    .addEventListener("input", updateSummary);
  document
    .getElementById("student-id")
    .addEventListener("input", updateSummary);
  document
    .getElementById("menu-item")
    .addEventListener("change", updateSummary);
  document
    .getElementById("sweetness")
    .addEventListener("change", updateSummary);
  document.getElementById("notes").addEventListener("input", updateSummary);
  document.getElementById("submit-btn").addEventListener("click", submitOrder);
  document.getElementById("clear-btn").addEventListener("click", clearForm);

  document
    .querySelectorAll(
      'input[name="temp"], input[name="extra"], input[name="oat"], input[name="container"]',
    )
    .forEach((el) => el.addEventListener("change", updateSummary));
});
