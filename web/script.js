// ----------------------
// Retrieve Coffee Inventory
// ----------------------
const getInventory = async () => {
  try {
    // ✅ Your deployed getCoffee function URL
    const results = await axios.get(
      "https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-affa240d-cb2d-4b4e-83cf-bc2106647cb1/cloud/getCoffee"
    );

    results.data.forEach(item => {
      const { pic, name, description, price } = item;

      const table = document.getElementById("product-table");
      const newRow = table.insertRow(-1);
      const picCell = newRow.insertCell();
      const nameCell = newRow.insertCell();
      const priceCell = newRow.insertCell();

      const picLink = document.createElement("img");
      picLink.src = pic;
      picLink.classList.add("product-image");

      const nameText = document.createElement("h2");
      nameText.innerHTML = name;

      const descriptionText = document.createTextNode(description);
      const priceText = document.createElement("h3");
      priceText.innerHTML = "$" + price;

      const addToCart = document.createElement("button");
      addToCart.classList.add("addToCart");
      addToCart.innerHTML = "Add to cart";
      addToCart.name = name;
      addToCart.value = price;

      picCell.appendChild(picLink);
      nameCell.appendChild(nameText);
      nameCell.appendChild(descriptionText);
      nameCell.appendChild(priceText);
      priceCell.appendChild(addToCart);

      const cartButtons = document.querySelectorAll(".addToCart");
      cartButtons.forEach(item => {
        item.addEventListener("click", cartHandler);
      });
    });
  } catch (err) {
    console.error("❌ Failed to fetch coffee inventory:", err);
  }
};

getInventory();

// ----------------------
// Shopping Cart Handler
// ----------------------
let order = [];
const cartHandler = function () {
  const addItem = { name: this.name, price: this.value };
  const currentQuantity = parseInt(
    document.getElementById("order-quantity").innerHTML
  );
  const updatedQuantity = currentQuantity + 1;
  document.getElementById("order-quantity").innerHTML = updatedQuantity;

  order.push(addItem);
  localStorage.setItem("order", JSON.stringify(order));

  const total = Number(localStorage.getItem("total"));
  const itemValue = Number(this.value);
  const newTotal = total ? itemValue + total : itemValue;
  localStorage.setItem("total", newTotal);
};

// ----------------------
// Email Subscription Handler
// ----------------------
const subscribeButton = document.getElementById("subscribe");

const subscribeHandler = async function () {
  try {
    const email = document.getElementById("email").value;

    // ✅ Your deployed postEmail function URL
    const emailUrl =
      "https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-affa240d-cb2d-4b4e-83cf-bc2106647cb1/cloud/postEmail" +
      "?email=" +
      email;

    await axios.post(emailUrl);

    localStorage.setItem("subscribe", email);
    document.getElementById("email").value = "";

    const emailForm = document.getElementById("email-form");
    const message = "✅ You have been successfully added to our email list.";
    const successMessage = document.createTextNode(message);
    emailForm.appendChild(successMessage);
  } catch (err) {
    console.error("❌ Failed to subscribe email:", err);
  }
};

subscribeButton.addEventListener("click", subscribeHandler);

// ----------------------
// Shopping Cart Modal Handler
// ----------------------
$("#myModal").on("shown.bs.modal", function () {
  $("#myInput").trigger("focus");
});

const container = document.getElementById("testModal");
const modal = new bootstrap.Modal(container);

document.getElementById("btnShow").addEventListener("click", function () {
  modal.show();
  $("#modal-table tr:not(:first)").remove();

  const orderData = JSON.parse(localStorage.getItem("order")) || [];
  const table = document.getElementById("modal-table");

  orderData.forEach(item => {
    const { name, price } = item;
    const newRow = table.insertRow(-1);
    const nameCell = newRow.insertCell();
    const priceCell = newRow.insertCell();

    const nameText = document.createElement("p");
    nameText.innerHTML = name;

    const priceText = document.createElement("p");
    priceText.innerHTML = "$" + price;

    nameCell.appendChild(nameText);
    priceCell.appendChild(priceText);
  });

  const grandTotal = localStorage.getItem("total") || 0;
  const newRow = table.insertRow(-1);
  const totalCell = newRow.insertCell();
  const grandTotalCell = newRow.insertCell();

  const totalText = document.createElement("h3");
  totalText.innerHTML = "Grand total:";
  const grandTotalText = document.createElement("h3");
  grandTotalText.innerHTML = "$" + grandTotal;

  totalCell.appendChild(totalText);
  grandTotalCell.appendChild(grandTotalText);
});

