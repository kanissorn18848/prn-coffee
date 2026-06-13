function updateSummary() {
  const menu = document.getElementById("menu-item");
  const drinkName = menu.value;
  const basePrice = parseInt(
    menu.options[menu.selectedIndex].getAttribute("data-price"),
  );

  const type = document.querySelector('input[name="temp"]:checked').value;
  const extra = document.querySelector('input[name="extra"]:checked').value;
  const oat = document.querySelector('input[name="oat"]:checked').value;
  const sweetness = document.getElementById("sweetness").value;

  let finalPrice = basePrice;
  if (type === "Cold") finalPrice += 5;
  if (extra === "Yes") finalPrice += 5;
  if (oat === "Yes") finalPrice += 5;

  document.getElementById("sum-drink").innerText = drinkName;
  document.getElementById("sum-options").innerText =
    `${type} | Sweetness: ${sweetness}`;
  document.getElementById("sum-extra").innerText = extra;
  document.getElementById("sum-oat").innerText = oat;
  document.getElementById("sum-total").innerText = `${finalPrice} baht`;

  return { drinkName, type, extra, oat, finalPrice };
}

function clearForm() {
  document.getElementById("customer-name").value = "";
  document.getElementById("menu-item").selectedIndex = 0;
  document.querySelector('input[name="temp"][value="Cold"]').checked = true;
  document.querySelector('input[name="extra"][value="No"]').checked = true;
  document.getElementById("sweetness").selectedIndex = 0;
  document.getElementById("notes").value = "";
  document.querySelector('input[name="oat"][value="No"]').checked = true;
  updateSummary();
}

async function submitOrder() {
  const name = document.getElementById("customer-name").value;
  const summary = updateSummary();

  if (!name) {
    alert("Please enter your name.");
    return;
  }

  const btn = document.getElementById("submit-btn");
  btn.innerText = "Verifying order status...";
  btn.disabled = true;

  try {
    const status = await fetchStockStatus();
    if (status.isSoldOut) {
      alert(
        "Sorry! Someone just grabbed the last cup. We are now sold out for today.",
      );
      window.location.reload();
      return;
    }
  } catch (e) {
    console.error("Stock check failed, but proceeding anyway.");
  }

  const data = {
    customer: name,
    menuItem: summary.drinkName,
    type: summary.type,
    extraShot: summary.extra,
    oatMilk: summary.oat,
    sweetness: document.getElementById("sweetness").value,
    notes: document.getElementById("notes").value,
    total: summary.finalPrice + " baht",
  };

  btn.innerText = "Finalizing Order...";

  fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(data),
  })
    .then(() => {
      alert(
        "Order sent! Thank you, " + name + ". See you tomorrow at the class!",
      );
      window.location.reload();
    })
    .catch(() => {
      alert("Error sending order. Please try again.");
      btn.disabled = false;
      btn.innerText = "Place Order";
    });
}
