function sanitizeForSheets(value) {
  return value.trim().replace(/^[=+\-@\t\r]/, "'$&");
}

function updateSummary() {
  const menu = document.getElementById("menu-item");
  const drinkName = menu.value;
  const basePrice = parseInt(
    menu.options[menu.selectedIndex].getAttribute("data-price"),
    10,
  );

  const type = document.querySelector('input[name="temp"]:checked').value;
  const container = document.querySelector(
    'input[name="container"]:checked',
  ).value;
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
  document.getElementById("sum-container").innerText = container;
  document.getElementById("sum-extra").innerText = extra;
  document.getElementById("sum-oat").innerText = oat;
  document.getElementById("sum-total").innerText = `${finalPrice} baht`;

  return { drinkName, type, container, extra, oat, finalPrice };
}

function clearForm() {
  document.getElementById("customer-name").value = "";
  document.getElementById("student-id").value = "";
  document.getElementById("menu-item").selectedIndex = 0;
  document.querySelector('input[name="temp"][value="Cold"]').checked = true;
  document.querySelector('input[name="container"][value="Bottle"]').checked =
    true;
  document.querySelector('input[name="extra"][value="No"]').checked = true;
  document.getElementById("sweetness").selectedIndex = 0;
  document.getElementById("notes").value = "";
  document.querySelector('input[name="oat"][value="No"]').checked = true;
  updateSummary();
}

async function checkSoldOut() {
  try {
    const status = await fetchStockStatus();
    return status.isSoldOut;
  } catch (e) {
    console.error("Stock check failed, but proceeding anyway.", e);
    return false;
  }
}

async function submitOrder() {
  if (document.getElementById("hp-field").value !== "") return;

  const name = document.getElementById("customer-name").value.trim();
  const summary = updateSummary();

  if (!name) {
    alert("Please enter your name.");
    return;
  }

  const studentId = document.getElementById("student-id").value.trim();
  if (studentId && !/^[0-9]{7}$/.test(studentId)) {
    alert("Student ID must be exactly 7 digits.");
    return;
  }

  const btn = document.getElementById("submit-btn");
  btn.innerText = "Verifying order status...";
  btn.disabled = true;

  try {
    if (await checkSoldOut()) {
      alert(
        "Sorry! Someone just grabbed the last cup. We are now sold out for today.",
      );
      window.location.reload();
      return;
    }

    const data = {
      customer: sanitizeForSheets(name),
      studentId: sanitizeForSheets(studentId),
      menuItem: summary.drinkName,
      type: summary.type,
      container: summary.container,
      extraShot: summary.extra,
      oatMilk: summary.oat,
      sweetness: document.getElementById("sweetness").value,
      notes: sanitizeForSheets(document.getElementById("notes").value),
    };

    btn.innerText = "Finalizing Order...";

    await apiFetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(data),
    });

    alert(
      "Order sent! Thank you, " + name + ". See you tomorrow at the class!",
    );
    window.location.reload();
  } catch (e) {
    alert("Error sending order. Please try again.");
    btn.disabled = false;
    btn.innerText = "Place Order";
  }
}
