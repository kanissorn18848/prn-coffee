async function fetchStockStatus() {
  return apiFetch(SCRIPT_URL);
}

function applyBusinessStatus(isShopOpen) {
  const dot = document.getElementById("status-dot");
  const text = document.getElementById("status-text");
  const submitBtn = document.getElementById("submit-btn");
  const stockDisplay = document.getElementById("cups-left");

  if (isShopOpen) {
    dot.className = "dot open";
    text.innerText = "Open for order!";
    text.className = "text-open";
    submitBtn.disabled = false;
  } else {
    dot.className = "dot closed";
    text.innerText = "Shop is closed 🙏";
    text.className = "text-closed";
    submitBtn.disabled = true;
    submitBtn.innerText = "Orders Currently Disabled";
    stockDisplay.innerText = "We'll be back soon...";
  }
}

function renderShopHours(schedule, announcement) {
  const el = document.getElementById("shop-hours");
  if (!el) return;
  let html = "";
  if (schedule) html += `<strong>🕒 Tomorrow's Schedule</strong> ${schedule}`;
  if (announcement) {
    if (schedule) html += "<br />";
    html += `📢 <i>${announcement}</i> 🚀`;
  }
  el.innerHTML = html;
}

async function checkDailyStock() {
  try {
    const status = await fetchStockStatus();

    applyBusinessStatus(status.isShopOpen);
    renderShopHours(status.schedule, status.announcement);

    if (!status.isShopOpen) return;

    const display = document.getElementById("cups-left");
    const submitBtn = document.getElementById("submit-btn");

    if (status.isSoldOut) {
      display.innerText = "❌ Sold out for today!";
      submitBtn.disabled = true;
      submitBtn.innerText = "Check back tomorrow";
    } else {
      display.innerText = `☕ ${status.remaining} cups left for tomorrow`;
    }
  } catch (e) {
    console.error("Could not load stock status", e);
    applyBusinessStatus(false);
    document.getElementById("cups-left").innerText = "Stock info unavailable";
  }
}
