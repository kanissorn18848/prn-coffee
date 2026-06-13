async function fetchStockStatus() {
  const response = await fetch(SCRIPT_URL);
  return response.json();
}

function applyBusinessStatus() {
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
    submitBtn.style.background = "#ccc";
    submitBtn.innerText = "Orders Currently Disabled";
    stockDisplay.innerText = "We'll be back soon...";
  }
}

async function checkDailyStock() {
  if (!isShopOpen) {
    document.getElementById("cups-left").innerText = "We'll be back soon...";
    return;
  }

  try {
    const status = await fetchStockStatus();
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
    console.log("Could not load stock status");
  }
}
