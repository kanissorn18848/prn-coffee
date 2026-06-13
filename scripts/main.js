const isShopOpen = false; // true = Open, false = Closed

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxEe7hZVjMtQaDWyfNaQD_IsJGBWX6EvN7tRZWJeDUS9q2HSWMIEiTR-GZvoXWYGzvp-g/exec";

document.addEventListener("DOMContentLoaded", () => {
  applyBusinessStatus();
  checkDailyStock();
  updateSummary();

  document
    .getElementById("customer-name")
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
      'input[name="temp"], input[name="extra"], input[name="oat"]',
    )
    .forEach((el) => el.addEventListener("change", updateSummary));
});
