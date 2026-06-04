import { db, storage } from "./firebase-config.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-storage.js";

import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  query,
  getDoc,
  orderBy,
  setDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";


// ============================================================
// TOAST NOTIFICATION HELPER
// ============================================================
function showToast(message) {
  const toast = document.getElementById("toast");
  const msg = toast.querySelector(".toast-msg");
  msg.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3500);
}


// ============================================================
// DOM ELEMENTS
// ============================================================
let iconCart = document.querySelector(".icon-cart");
let closeCart = document.querySelector(".close");
let body = document.querySelector("body");
let listCart = document.querySelector(".listCart");
let iconCartSpan = document.querySelector(".icon-cart span");
let listProductHTML = document.querySelector(".listProduct");
let checkoutContainer = document.querySelector(".checkout");
let checkoutList = document.querySelector(".checkout-list");
let totalPriceElement = document.querySelector(".total-price");
let closeCheckoutButton = document.querySelector(".close-checkout");
let overlay = document.querySelector(".overlay");
let cartOverlay = document.querySelector(".cart-overlay");


// ============================================================
// CART & PRODUCT DATA
// ============================================================
let carts = [];
let listProducts = [];


// ============================================================
// CART OPEN/CLOSE TOGGLE
// ============================================================
iconCart.addEventListener("click", () => {
  body.classList.toggle("showCart");
});

closeCart.addEventListener("click", () => {
  body.classList.toggle("showCart");
});

cartOverlay.addEventListener("click", () => {
  body.classList.remove("showCart");
});


// ============================================================
// SECTIONS DATA
// ============================================================
const sectionsContainer = document.querySelector(".sections");
let sectionsData = [];


async function loadSectionsAndItems() {
  const querySnapshot = await getDocs(collection(db, "sections"));
  sectionsContainer.innerHTML = "";
  sectionsData = [];
  listProducts = [];

  querySnapshot.forEach((doc) => {
    const section = doc.data();
    const items = section.items || [];

    sectionsData.push({
      sectionName: section.sectionName,
      items: items
    });

    const sectionDiv = document.createElement("div");
    sectionDiv.classList.add("section");

    const hr = document.createElement("div");
    hr.classList.add("section-line");
    const sectionTitle = document.createElement("h2");
    sectionTitle.classList.add("section-title");
    sectionTitle.textContent = section.sectionName;
    sectionDiv.appendChild(hr);
    sectionDiv.appendChild(sectionTitle);

    const listProductEl = document.createElement("div");
    listProductEl.classList.add("listProduct");

    items.forEach((item, itemIndex) => {
      const product_id = `${section.sectionName}-${itemIndex}`;

      listProducts.push({
        id: product_id,
        name: item.name.toLowerCase(),
        category: item.category.toLowerCase(),
        price: item.price,
        imageUrl: item.imageUrl,
        stock: item.stock
      });

      const productDiv = createProductCard(item, product_id);
      listProductEl.appendChild(productDiv);
    });

    sectionDiv.appendChild(listProductEl);
    sectionsContainer.appendChild(sectionDiv);
  });
}


// ============================================================
// CREATE PRODUCT CARD
// ============================================================
function createProductCard(item, product_id) {
  const productDiv = document.createElement("div");
  productDiv.classList.add("item");
  productDiv.innerHTML = `
    <img class="product-img" src="${item.imageUrl}" alt="${item.name}" loading="lazy">
    <div class="item-hover-tag">View Item</div>
    <h2>${item.name.length > 20 ? item.name.slice(0, 20) + '...' : item.name}</h2>
    <div class="price">$${item.price}</div>
  `;

  if (item.stock <= 0) {
    productDiv.classList.add("out-of-stock");
    productDiv.style.position = "relative";
    productDiv.style.pointerEvents = "none";
    const xOverlay = document.createElement("div");
    xOverlay.classList.add("out-of-stock-x");
    xOverlay.innerHTML = "&times;";
    productDiv.appendChild(xOverlay);
    const outOfStockText = document.createElement("p");
    outOfStockText.classList.add("out-of-stock-text");
    outOfStockText.textContent = "OUT OF STOCK";
    productDiv.appendChild(outOfStockText);
  }

  const modal = document.querySelector(".item-modal");
  const modalContent = document.querySelector(".item-modal-content");

  const showModal = () => {
    const existingInCart = carts.find(c => c.product_id === product_id);
    const alreadyInCart = existingInCart ? existingInCart.quantity : 0;
    const availableStock = item.stock - alreadyInCart;

    modalContent.innerHTML = `
      <span class="closerr">&times;</span>
      <div class="modal-grid">
        <div class="modal-left">
          <img src="${item.imageUrl}" alt="${item.name}">
        </div>
        <div class="modal-center">
          <h2>${item.name}</h2>
          <p>${item.description}</p>
        </div>
        <div class="modal-right">
          <div class="stock">Items Left: ${availableStock}</div>
          <div class="quantity">
            <span class="qty-btn" id="decreaseQty">-</span>
            <input type="number" id="quantity" min="1" max="${availableStock}" value="1" readonly>
            <span class="qty-btn" id="increaseQty">+</span>
          </div>
          <button class="proceed-btn"><span>Add to Cart</span></button>
        </div>
      </div>
    `;

    const qtyInput = document.getElementById("quantity");
    const increaseBtn = modalContent.querySelector("#increaseQty");
    const decreaseBtn = modalContent.querySelector("#decreaseQty");
    const maxLength = item.stock.toString().length;

    increaseBtn.addEventListener("click", () => {
      let v = parseInt(qtyInput.value) || 1;
      if (v < parseInt(qtyInput.max)) qtyInput.value = v + 1;
    });

    decreaseBtn.addEventListener("click", () => {
      let v = parseInt(qtyInput.value) || 1;
      if (v > parseInt(qtyInput.min)) qtyInput.value = v - 1;
    });

    qtyInput.setAttribute("maxlength", maxLength);

    const proceedBtn = modalContent.querySelector(".proceed-btn");
    const mclose = document.querySelector(".closerr");

    proceedBtn.addEventListener("click", () => {
      const quantity = parseInt(qtyInput.value);
      const existing = carts.find(c => c.product_id === product_id);
      const alreadyIn = existing ? existing.quantity : 0;
      const avail = item.stock - alreadyIn;

      if (isNaN(quantity) || quantity < 1) {
        showToast("Please enter a valid quantity.");
        return;
      }

      if (quantity > avail) {
        showToast(`Only ${avail} left for you to add.`);
        return;
      }

      if (existing) {
        existing.quantity += quantity;
      } else {
        carts.push({ product_id, quantity });
      }

      addCartToHTML();
      addCartToMemory();
      modal.style.display = "none";
      showToast(`Added ${quantity} × "${item.name}" to cart`);
      document.getElementById("burtizy")?.scrollIntoView({ behavior: "smooth" });
    });

    mclose.addEventListener("click", () => {
      modal.style.display = "none";
    });

    modal.style.display = "flex";
  };

  productDiv.addEventListener("click", (e) => {
    e.stopPropagation();
    showModal();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  return productDiv;
}


// ============================================================
// FILTER / SEARCH  — debounced so re-render only fires when
// the user pauses typing, not on every single keystroke
// ============================================================
let currentSearchTerm = "";
let currentCategoryFilter = "";
let searchDebounceTimer = null;

function renderFilteredSections() {
  const queryStr = currentSearchTerm.trim().toLowerCase();
  sectionsContainer.innerHTML = "";

  sectionsData.forEach((section) => {
    const filteredItems = section.items.filter(item => {
      const categoryMatch = item.category.toLowerCase().includes(queryStr);
      const nameMatch = item.name.toLowerCase().includes(queryStr);
      const categoryFilterMatch = !currentCategoryFilter || item.category.toLowerCase() === currentCategoryFilter;
      return (categoryMatch || nameMatch) && categoryFilterMatch;
    });

    if (filteredItems.length === 0) return;

    const sectionDiv = document.createElement("div");
    sectionDiv.classList.add("section");

    const hr = document.createElement("div");
    hr.classList.add("section-line");
    const sectionTitle = document.createElement("h2");
    sectionTitle.classList.add("section-title");
    sectionTitle.textContent = section.sectionName;
    sectionDiv.appendChild(hr);
    sectionDiv.appendChild(sectionTitle);

    const listProductEl = document.createElement("div");
    listProductEl.classList.add("listProduct");

    filteredItems.forEach((item, itemIndex) => {
      const product_id = `${section.sectionName}-${itemIndex}`;
      const productDiv = createProductCard(item, product_id);
      listProductEl.appendChild(productDiv);
    });

    sectionDiv.appendChild(listProductEl);
    sectionsContainer.appendChild(sectionDiv);
  });
}


document.getElementById("searchInput").addEventListener("input", (e) => {
  clearTimeout(searchDebounceTimer);
  const val = e.target.value;
  searchDebounceTimer = setTimeout(() => {
    currentSearchTerm = val;
    renderFilteredSections();
  }, 180);
});

document.querySelectorAll(".filter-chips span").forEach(chip => {
  chip.addEventListener("click", () => {
    const isActive = chip.classList.contains("active");
    document.querySelectorAll(".filter-chips span").forEach(c => c.classList.remove("active"));

    if (!isActive) {
      chip.classList.add("active");
      currentCategoryFilter = chip.getAttribute("value").toLowerCase();
    } else {
      currentCategoryFilter = "";
    }
    renderFilteredSections();
  });
});


// ============================================================
// CART: MEMORY & HTML
// Event delegation is used for +/- buttons so we don't attach
// hundreds of listeners on every single cart re-render.
// ============================================================
const loadCartFromMemory = () => {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    carts = JSON.parse(savedCart);
    addCartToHTML();
  }
};

const addCartToMemory = () => {
  localStorage.setItem("cart", JSON.stringify(carts));
};

// Delegated +/- handlers — attached once, never re-attached
listCart.addEventListener("click", (e) => {
  const btn = e.target;
  if (!btn.classList.contains("plus") && !btn.classList.contains("minus")) return;

  const productId = btn.closest(".item")?.dataset.id;
  if (!productId) return;

  const cartItem = carts.find(c => c.product_id === productId);
  if (!cartItem) return;

  if (btn.classList.contains("plus")) {
    const product = listProducts.find(p => p.id === productId);
    if (product && cartItem.quantity < product.stock) {
      cartItem.quantity += 1;
    } else if (product) {
      showToast(`Max stock reached for "${product.name}"`);
      return;
    }
  } else {
    cartItem.quantity -= 1;
    if (cartItem.quantity <= 0) {
      carts = carts.filter(c => c.product_id !== productId);
    }
  }

  addCartToHTML();
  addCartToMemory();
});

// ============================================================
// DROP-IN REPLACEMENT for the addCartToHTML function in homi.js
// Change: marks NEW items with .new-item so only they animate,
// instead of re-animating everything on every +/- tap.
// ============================================================

const addCartToHTML = () => {
  const fragment = document.createDocumentFragment();
  let totalQuantity = 0;

  // Track which product IDs are already rendered (no animation needed)
  const existingIds = new Set(
    [...listCart.querySelectorAll(".item[data-id]")].map(el => el.dataset.id)
  );

  carts.forEach((cartItem) => {
    totalQuantity += cartItem.quantity;

    const product = listProducts.find(p => p.id === cartItem.product_id);
    if (!product) return;

    const maxNameLength = 30;
    const nameShort = product.name.length > maxNameLength
      ? product.name.slice(0, maxNameLength) + "..."
      : product.name;

    const cartDiv = document.createElement("div");
    cartDiv.classList.add("item");
    // Only animate items that weren't already in the cart panel
    if (!existingIds.has(cartItem.product_id)) {
      cartDiv.classList.add("new-item");
    }
    cartDiv.dataset.id = cartItem.product_id;
    cartDiv.innerHTML = `
      <div class="image">
        <img src="${product.imageUrl}" alt="${product.name}" loading="lazy">
      </div>
      <div class="name">${nameShort}</div>
      <div class="quantity">
        <span class="minus">-</span>
        <span class="quan">${cartItem.quantity}</span>
        <span class="plus">+</span>
      </div>
      <div class="totalPrice">$${(product.price * cartItem.quantity).toFixed(2)}</div>
    `;

    fragment.appendChild(cartDiv);
  });

  listCart.innerHTML = "";
  listCart.appendChild(fragment);

  checkOutBtn.disabled = carts.length === 0;

  const cartCountLabel = document.getElementById("cartItemCount");
  if (cartCountLabel) cartCountLabel.textContent = carts.length;

  iconCartSpan.innerText = totalQuantity;
};


// ============================================================
// CHECKOUT
// ============================================================
const checkOutBtn = document.querySelector(".checkOut");
const checkoutSection = document.querySelector(".overlay");
const totalPriceEl = document.querySelector(".total-price");
const closeCheckoutBtn = document.querySelector(".close-checkout");
const formModal = document.querySelector(".form-modal");
const checkoutForm = document.getElementById("checkoutForm");

checkOutBtn.addEventListener("click", () => {
  if (carts.length === 0) return;

  checkoutSection.style.display = "flex";
  checkoutList.innerHTML = "";
  let total = 0;
  const maxNameLength = 20;

  carts.forEach(item => {
    const product = listProducts.find(p => p.id === item.product_id);
    if (!product) return;

    const nameShort = product.name.length > maxNameLength
      ? product.name.slice(0, maxNameLength) + "..."
      : product.name;

    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");
    itemDiv.innerHTML = `
      <div class="image"><img src="${product.imageUrl}" alt="${product.name}" loading="lazy"></div>
      <div class="name">${nameShort}</div>
      <div class="totalprice">$${(product.price * item.quantity).toFixed(2)}</div>
    `;
    checkoutList.appendChild(itemDiv);
    total += product.price * item.quantity;
  });

  totalPriceEl.innerText = `Total: $${total.toFixed(2)}`;

  document.getElementById("showFormModal").addEventListener("click", () => {
    formModal.style.display = "flex";
  });
});

closeCheckoutBtn.addEventListener("click", () => {
  checkoutSection.style.display = "none";
});

checkoutSection.addEventListener("click", (e) => {
  if (e.target === checkoutSection) checkoutSection.style.display = "none";
});


// ============================================================
// PAYSTACK MODAL HELPERS
// ============================================================
function openPaypalModal() {
  document.getElementById("paypalModal").style.display = "flex";
}

function closePaypalModal() {
  document.getElementById("paypalModal").style.display = "none";
}

function openPaystackModal() {
  document.getElementById("paystackModal").style.display = "flex";
}

function closePaystackModal() {
  document.getElementById("paystackModal").style.display = "none";
}

document.querySelector(".close-paystack-modal").addEventListener("click", () => {
  closePaystackModal();
});


// ============================================================
// SAVE ORDER & UPDATE STOCK
// Fixed: was doing getDocs inside a nested loop (N×M reads).
// Now does ONE snapshot and loops in memory.
// ============================================================
async function saveOrderAndUpdateStock(name, email, phone, countryCodeValue, countryLabel, pickup, carts) {
  try {
    const orderItems = carts.map(c => {
      const product = listProducts.find(p => p.id === c.product_id);
      return {
        id: c.product_id,
        name: product?.name || "Unnamed Item",      // ← was "itemName"
        quantity: c.quantity,
        price: product?.price || 0,
        imageUrl: product?.imageUrl || ""           // ← was product?.image
      };
    });

    const orderData = {
      name,
      email,
      phone,
      country: { code: countryCodeValue, label: countryLabel },
      pickup,
      items: orderItems,
      status: 'pending',
      timestamp: new Date().toISOString()
    };

    await addDoc(collection(db, "orders"), orderData);

    // Single Firestore read for all sections
    const sectionsSnapshot = await getDocs(collection(db, "sections"));

    for (const cartItem of carts) {
      const [sectionName, index] = cartItem.product_id.split("-");

      for (const sectionDoc of sectionsSnapshot.docs) {
        const sectionData = sectionDoc.data();
        if (sectionData.sectionName === sectionName) {
          const items = [...sectionData.items];
          const itemIndex = parseInt(index);
          if (items[itemIndex]) {
            items[itemIndex].stock -= cartItem.quantity;
            const sectionRef = doc(db, "sections", sectionDoc.id);
            const cleanedItems = items.map(item => ({
              name: item.name,
              description: item.description,
              imageUrl: item.imageUrl,
              category: item.category,
              price: item.price,
              stock: item.stock
            }));
            await updateDoc(sectionRef, { items: cleanedItems });
          }
        }
      }
    }

    showToast("Order placed successfully!");
    addCartToHTML();
  } catch (err) {
    console.error("Error saving order:", err);
    alert("Something went wrong. Try again.\n" + (err.message || ""));
  }
}


// ============================================================
// CHECKOUT FORM SUBMIT
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const checkoutForm = document.getElementById("checkoutForm");

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const pickup = document.getElementById("pickup").value.trim();
      const countryCodeElement = document.getElementById("countryCode");
      const countryCodeValue = countryCodeElement.value;
      const countryLabel = countryCodeElement.options[countryCodeElement.selectedIndex].text;

      if (!name || !email || !phone || !pickup || !countryCodeValue) {
        showToast("Please fill in all fields.");
        return;
      }

      let totalUSD = 0;
      carts.forEach(item => {
        const product = listProducts.find(p => p.id === item.product_id);
        if (product) totalUSD += product.price * item.quantity;
      });

      const totalNaira = Math.round(totalUSD * 1500);

      const handler = PaystackPop.setup({
        key: "pk_test_cb3826dfb6732cf27093aa151b352fb821871dc7",
        email: email,
        amount: totalNaira * 100,
        currency: "NGN",
        ref: "ORD-" + Math.floor(Math.random() * 1000000000),
        metadata: {
          custom_fields: [{
            display_name: name,
            variable_name: "phone",
            value: phone
          }]
        },
        callback: function(response) {
          document.getElementById("loaderOverlay").style.display = "flex";

          (async () => {
            try {
              const currentCart = carts.map(c => {
                const product = listProducts.find(p => p.id === c.product_id);
                return {
                  product_id: c.product_id,
                  quantity: c.quantity,
                  name: product?.name || "Unnamed",           // ← was "name" here, this one is fine
                  price: product?.price || 0,
                  imageUrl: product?.imageUrl || ""           // ← was product?.image
                };
              });

              await saveOrderAndUpdateStock(name, email, phone, countryCodeValue, countryLabel, pickup, currentCart);

              await sendOrderEmail({
                name,
                email,
                phone: `${countryCodeValue}${phone}`,
                pickup,
                timestamp: Date.now(),
                items: currentCart
              });

              addCartToHTML();
              showToast("Check your email for order confirmation!");
              closePaystackModal();

            } catch (err) {
              console.error("❌ Something failed:", err);
              alert("Payment succeeded, but something went wrong. Please contact support.");
            } finally {
              setTimeout(() => {
                document.getElementById("loaderOverlay").style.display = "none";
                carts.length = 0;
                localStorage.removeItem("cart");
                location.reload();
              }, 300);
            }
          })();
        },
        onClose: function() {
          showToast("Payment cancelled.");
          closePaystackModal();
        }
      });

      handler.openIframe();
      openPaystackModal();
    });
  }
});


// ============================================================
// SEND EMAIL
// ============================================================
async function sendOrderEmail({ name, email, phone, pickup, timestamp, items }) {
  const total = items.reduce((sum, item) => {
    const itemPrice = parseFloat(item.price) || 0;
    const itemQuantity = parseInt(item.quantity) || 0;
    return sum + itemPrice * itemQuantity;
  }, 0);

  const itemLines = items.map(item =>
    `Item: ${item.name} Quantity: ${item.quantity}`
  ).join('');

  try {
    await emailjs.send("service_w3zumfl", "template_kccavv8", {
      name: name || "N/A",
      email: email || "N/A",
      phone: phone || "N/A",
      pickup: pickup || "N/A",
      timestamp: new Date(timestamp).toLocaleString(),
      total: total.toFixed(2),
      items_html: itemLines
    });
    console.log("✅ Email sent successfully");
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
}


// ============================================================
// CLOSE FORM MODAL
// ============================================================
document.querySelector(".close-form").addEventListener("click", () => {
  const modal = document.getElementById("formModal");
  const form = document.getElementById("checkoutForm");
  modal.style.display = "none";
  form.reset();
});

document.getElementById("formModal").addEventListener("click", (e) => {
  if (e.target === document.getElementById("formModal")) {
    document.getElementById("formModal").style.display = "none";
    document.getElementById("checkoutForm").reset();
  }
});


// ============================================================
// COUNTRY CODE SELECT
// ============================================================
const countryCodes = [
  { code: "+355", country: "AL", name: "Albania", flag: "🇦🇱" },
  { code: "+213", country: "DZ", name: "Algeria", flag: "🇩🇿" },
  { code: "+376", country: "AD", name: "Andorra", flag: "🇦🇩" },
  { code: "+244", country: "AO", name: "Angola", flag: "🇦🇴" },
  { code: "+1", country: "AG", name: "Antigua & Barbuda", flag: "🇦🇬" },
  { code: "+54", country: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "+374", country: "AM", name: "Armenia", flag: "🇦🇲" },
  { code: "+297", country: "AW", name: "Aruba", flag: "🇦🇼" },
  { code: "+61", country: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "+43", country: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "+994", country: "AZ", name: "Azerbaijan", flag: "🇦🇿" },
  { code: "+973", country: "BH", name: "Bahrain", flag: "🇧🇭" },
  { code: "+880", country: "BD", name: "Bangladesh", flag: "🇧🇩" },
  { code: "+1", country: "BB", name: "Barbados", flag: "🇧🇧" },
  { code: "+375", country: "BY", name: "Belarus", flag: "🇧🇾" },
  { code: "+32", country: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "+501", country: "BZ", name: "Belize", flag: "🇧🇿" },
  { code: "+229", country: "BJ", name: "Benin", flag: "🇧🇯" },
  { code: "+975", country: "BT", name: "Bhutan", flag: "🇧🇹" },
  { code: "+591", country: "BO", name: "Bolivia", flag: "🇧🇴" },
  { code: "+387", country: "BA", name: "Bosnia & Herzegovina", flag: "🇧🇦" },
  { code: "+267", country: "BW", name: "Botswana", flag: "🇧🇼" },
  { code: "+55", country: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "+246", country: "IO", name: "British Indian Ocean Territory", flag: "🇮🇴" },
  { code: "+673", country: "BN", name: "Brunei", flag: "🇧🇳" },
  { code: "+359", country: "BG", name: "Bulgaria", flag: "🇧🇬" },
  { code: "+226", country: "BF", name: "Burkina Faso", flag: "🇧🇫" },
  { code: "+257", country: "BI", name: "Burundi", flag: "🇧🇮" },
  { code: "+855", country: "KH", name: "Cambodia", flag: "🇰🇭" },
  { code: "+237", country: "CM", name: "Cameroon", flag: "🇨🇲" },
  { code: "+1", country: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "+238", country: "CV", name: "Cape Verde", flag: "🇨🇻" },
  { code: "+599", country: "BQ", name: "Caribbean Netherlands", flag: "🇧🇶" },
  { code: "+1", country: "KY", name: "Cayman Islands", flag: "🇰🇾" },
  { code: "+236", country: "CF", name: "Central African Republic", flag: "🇨🇫" },
  { code: "+235", country: "TD", name: "Chad", flag: "🇹🇩" },
  { code: "+56", country: "CL", name: "Chile", flag: "🇨🇱" },
  { code: "+86", country: "CN", name: "China", flag: "🇨🇳" },
  { code: "+61", country: "CX", name: "Christmas Island", flag: "🇨🇽" },
  { code: "+57", country: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "+269", country: "KM", name: "Comoros", flag: "🇰🇲" },
  { code: "+242", country: "CG", name: "Congo – Brazzaville", flag: "🇨🇬" },
  { code: "+243", country: "CD", name: "Congo – Kinshasa", flag: "🇨🇩" },
  { code: "+682", country: "CK", name: "Cook Islands", flag: "🇨🇰" },
  { code: "+506", country: "CR", name: "Costa Rica", flag: "🇨🇷" },
  { code: "+385", country: "HR", name: "Croatia", flag: "🇭🇷" },
  { code: "+53", country: "CU", name: "Cuba", flag: "🇨🇺" },
  { code: "+599", country: "CW", name: "Curaçao", flag: "🇨🇼" },
  { code: "+357", country: "CY", name: "Cyprus", flag: "🇨🇾" },
  { code: "+420", country: "CZ", name: "Czech Republic", flag: "🇨🇿" },
  { code: "+45", country: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "+253", country: "DJ", name: "Djibouti", flag: "🇩🇯" },
  { code: "+1", country: "DM", name: "Dominica", flag: "🇩🇲" },
  { code: "+1", country: "DO", name: "Dominican Republic", flag: "🇩🇴" },
  { code: "+593", country: "EC", name: "Ecuador", flag: "🇪🇨" },
  { code: "+20", country: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "+503", country: "SV", name: "El Salvador", flag: "🇸🇻" },
  { code: "+240", country: "GQ", name: "Equatorial Guinea", flag: "🇬🇶" },
  { code: "+291", country: "ER", name: "Eritrea", flag: "🇪🇷" },
  { code: "+372", country: "EE", name: "Estonia", flag: "🇪🇪" },
  { code: "+251", country: "ET", name: "Ethiopia", flag: "🇪🇹" },
  { code: "+500", country: "FK", name: "Falkland Islands", flag: "🇫🇰" },
  { code: "+298", country: "FO", name: "Faroe Islands", flag: "🇫🇴" },
  { code: "+679", country: "FJ", name: "Fiji", flag: "🇫🇯" },
  { code: "+358", country: "FI", name: "Finland", flag: "🇫🇮" },
  { code: "+33", country: "FR", name: "France", flag: "🇫🇷" },
  { code: "+594", country: "GF", name: "French Guiana", flag: "🇬🇫" },
  { code: "+689", country: "PF", name: "French Polynesia", flag: "🇵🇫" },
  { code: "+241", country: "GA", name: "Gabon", flag: "🇬🇦" },
  { code: "+220", country: "GM", name: "Gambia", flag: "🇬🇲" },
  { code: "+995", country: "GE", name: "Georgia", flag: "🇬🇪" },
  { code: "+49", country: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "+233", country: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "+350", country: "GI", name: "Gibraltar", flag: "🇬🇮" },
  { code: "+30", country: "GR", name: "Greece", flag: "🇬🇷" },
  { code: "+299", country: "GL", name: "Greenland", flag: "🇬🇱" },
  { code: "+1", country: "GD", name: "Grenada", flag: "🇬🇩" },
  { code: "+1", country: "GU", name: "Guam", flag: "🇬🇺" },
  { code: "+502", country: "GT", name: "Guatemala", flag: "🇬🇹" },
  { code: "+224", country: "GN", name: "Guinea", flag: "🇬🇳" },
  { code: "+245", country: "GW", name: "Guinea-Bissau", flag: "🇬🇼" },
  { code: "+592", country: "GY", name: "Guyana", flag: "🇬🇾" },
  { code: "+509", country: "HT", name: "Haiti", flag: "🇭🇹" },
  { code: "+504", country: "HN", name: "Honduras", flag: "🇭🇳" },
  { code: "+852", country: "HK", name: "Hong Kong", flag: "🇭🇰" },
  { code: "+36", country: "HU", name: "Hungary", flag: "🇭🇺" },
  { code: "+354", country: "IS", name: "Iceland", flag: "🇮🇸" },
  { code: "+91", country: "IN", name: "India", flag: "🇮🇳" },
  { code: "+62", country: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "+98", country: "IR", name: "Iran", flag: "🇮🇷" },
  { code: "+964", country: "IQ", name: "Iraq", flag: "🇮🇶" },
  { code: "+353", country: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "+39", country: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "+1", country: "JM", name: "Jamaica", flag: "🇯🇲" },
  { code: "+81", country: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "+254", country: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "+856", country: "LA", name: "Laos", flag: "🇱🇦" },
  { code: "+371", country: "LV", name: "Latvia", flag: "🇱🇻" },
  { code: "+423", country: "LI", name: "Liechtenstein", flag: "🇱🇮" },
  { code: "+370", country: "LT", name: "Lithuania", flag: "🇱🇹" },
  { code: "+352", country: "LU", name: "Luxembourg", flag: "🇱🇺" },
  { code: "+261", country: "MG", name: "Madagascar", flag: "🇲🇬" },
  { code: "+265", country: "MW", name: "Malawi", flag: "🇲🇼" },
  { code: "+60", country: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "+960", country: "MV", name: "Maldives", flag: "🇲🇻" },
  { code: "+223", country: "ML", name: "Mali", flag: "🇲🇱" },
  { code: "+356", country: "MT", name: "Malta", flag: "🇲🇹" },
  { code: "+692", country: "MH", name: "Marshall Islands", flag: "🇲🇭" },
  { code: "+596", country: "MQ", name: "Martinique", flag: "🇲🇶" },
  { code: "+222", country: "MR", name: "Mauritania", flag: "🇲🇷" },
  { code: "+230", country: "MU", name: "Mauritius", flag: "🇲🇺" },
  { code: "+262", country: "YT", name: "Mayotte", flag: "🇾🇹" },
  { code: "+52", country: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "+691", country: "FM", name: "Micronesia", flag: "🇫🇲" },
  { code: "+373", country: "MD", name: "Moldova", flag: "🇲🇩" },
  { code: "+377", country: "MC", name: "Monaco", flag: "🇲🇨" },
  { code: "+976", country: "MN", name: "Mongolia", flag: "🇲🇳" },
  { code: "+382", country: "ME", name: "Montenegro", flag: "🇲🇪" },
  { code: "+1", country: "MS", name: "Montserrat", flag: "🇲🇸" },
  { code: "+212", country: "MA", name: "Morocco", flag: "🇲🇦" },
  { code: "+258", country: "MZ", name: "Mozambique", flag: "🇲🇿" },
  { code: "+264", country: "NA", name: "Namibia", flag: "🇳🇦" },
  { code: "+674", country: "NR", name: "Nauru", flag: "🇳🇷" },
  { code: "+977", country: "NP", name: "Nepal", flag: "🇳🇵" },
  { code: "+31", country: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "+64", country: "NZ", name: "New Zealand", flag: "🇳🇿" },
  { code: "+505", country: "NI", name: "Nicaragua", flag: "🇳🇮" },
  { code: "+227", country: "NE", name: "Niger", flag: "🇳🇪" },
  { code: "+234", country: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "+683", country: "NU", name: "Niue", flag: "🇳🇺" },
  { code: "+672", country: "NF", name: "Norfolk Island", flag: "🇳🇫" },
  { code: "+47", country: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "+968", country: "OM", name: "Oman", flag: "🇴🇲" },
  { code: "+92", country: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "+680", country: "PW", name: "Palau", flag: "🇵🇼" },
  { code: "+970", country: "PS", name: "Palestine", flag: "🇵🇸" },
  { code: "+507", country: "PA", name: "Panama", flag: "🇵🇦" },
  { code: "+675", country: "PG", name: "Papua New Guinea", flag: "🇵🇬" },
  { code: "+595", country: "PY", name: "Paraguay", flag: "🇵🇾" },
  { code: "+51", country: "PE", name: "Peru", flag: "🇵🇪" },
  { code: "+63", country: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "+48", country: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "+351", country: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "+1", country: "PR", name: "Puerto Rico", flag: "🇵🇷" },
  { code: "+974", country: "QA", name: "Qatar", flag: "🇶🇦" },
  { code: "+262", country: "RE", name: "Réunion", flag: "🇷🇪" },
  { code: "+40", country: "RO", name: "Romania", flag: "🇷🇴" },
  { code: "+7", country: "RU", name: "Russia", flag: "🇷🇺" },
  { code: "+250", country: "RW", name: "Rwanda", flag: "🇷🇼" },
  { code: "+590", country: "BL", name: "Saint Barthélemy", flag: "🇧🇱" },
  { code: "+290", country: "SH", name: "Saint Helena", flag: "🇸🇭" },
  { code: "+1", country: "KN", name: "Saint Kitts & Nevis", flag: "🇰🇳" },
  { code: "+1", country: "LC", name: "Saint Lucia", flag: "🇱🇨" },
  { code: "+508", country: "PM", name: "Saint Pierre & Miquelon", flag: "🇵🇲" },
  { code: "+1", country: "VC", name: "Saint Vincent & Grenadines", flag: "🇻🇨" },
  { code: "+685", country: "WS", name: "Samoa", flag: "🇼🇸" },
  { code: "+378", country: "SM", name: "San Marino", flag: "🇸🇲" },
  { code: "+239", country: "ST", name: "São Tomé & Príncipe", flag: "🇸🇹" },
  { code: "+966", country: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+221", country: "SN", name: "Senegal", flag: "🇸🇳" },
  { code: "+381", country: "RS", name: "Serbia", flag: "🇷🇸" },
  { code: "+248", country: "SC", name: "Seychelles", flag: "🇸🇨" },
  { code: "+232", country: "SL", name: "Sierra Leone", flag: "🇸🇱" },
  { code: "+65", country: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "+421", country: "SK", name: "Slovakia", flag: "🇸🇰" },
  { code: "+386", country: "SI", name: "Slovenia", flag: "🇸🇮" },
  { code: "+677", country: "SB", name: "Solomon Islands", flag: "🇸🇧" },
  { code: "+252", country: "SO", name: "Somalia", flag: "🇸🇴" },
  { code: "+27", country: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "+82", country: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "+211", country: "SS", name: "South Sudan", flag: "🇸🇸" },
  { code: "+34", country: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "+94", country: "LK", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "+249", country: "SD", name: "Sudan", flag: "🇸🇩" },
  { code: "+597", country: "SR", name: "Suriname", flag: "🇸🇷" },
  { code: "+47", country: "SJ", name: "Svalbard & Jan Mayen", flag: "🇸🇯" },
  { code: "+268", country: "SZ", name: "Swaziland", flag: "🇸🇿" },
  { code: "+46", country: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "+41", country: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "+963", country: "SY", name: "Syria", flag: "🇸🇾" },
  { code: "+886", country: "TW", name: "Taiwan", flag: "🇹🇼" },
  { code: "+992", country: "TJ", name: "Tajikistan", flag: "🇹🇯" },
  { code: "+255", country: "TZ", name: "Tanzania", flag: "🇹🇿" },
  { code: "+66", country: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "+228", country: "TG", name: "Togo", flag: "🇹🇬" },
  { code: "+690", country: "TK", name: "Tokelau", flag: "🇹🇰" },
  { code: "+676", country: "TO", name: "Tonga", flag: "🇹🇴" },
  { code: "+1", country: "TT", name: "Trinidad & Tobago", flag: "🇹🇹" },
  { code: "+216", country: "TN", name: "Tunisia", flag: "🇹🇳" },
  { code: "+90", country: "TR", name: "Turkey", flag: "🇹🇷" },
  { code: "+993", country: "TM", name: "Turkmenistan", flag: "🇹🇲" },
  { code: "+688", country: "TV", name: "Tuvalu", flag: "🇹🇻" },
  { code: "+256", country: "UG", name: "Uganda", flag: "🇺🇬" },
  { code: "+380", country: "UA", name: "Ukraine", flag: "🇺🇦" },
  { code: "+44", country: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+1", country: "US", name: "United States", flag: "🇺🇸" },
  { code: "+598", country: "UY", name: "Uruguay", flag: "🇺🇾" },
  { code: "+998", country: "UZ", name: "Uzbekistan", flag: "🇺🇿" },
  { code: "+58", country: "VE", name: "Venezuela", flag: "🇻🇪" },
  { code: "+84", country: "VN", name: "Vietnam", flag: "🇻🇳" },
  { code: "+678", country: "VU", name: "Vanuatu", flag: "🇻🇺" },
  { code: "+681", country: "WF", name: "Wallis & Futuna", flag: "🇼🇫" },
  { code: "+967", country: "YE", name: "Yemen", flag: "🇾🇪" },
  { code: "+260", country: "ZM", name: "Zambia", flag: "🇿🇲" },
  { code: "+263", country: "ZW", name: "Zimbabwe", flag: "🇿🇼" }
];

const select = document.getElementById("countryCode");
countryCodes
  .sort((a, b) => a.name.localeCompare(b.name))
  .forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.code;
    opt.dataset.country = c.country;
    opt.innerText = `${c.flag} ${c.code} (${c.name})`;
    select.append(opt);
  });

select.addEventListener("change", () => {
  const selected = select.value;
  const phoneInput = document.getElementById("phone");
  if (!phoneInput.value.startsWith(selected)) {
    phoneInput.value = selected;
  }
});


// ============================================================
// RELOAD LINKS
// ============================================================
document.querySelectorAll('.reload-text').forEach(el => {
  el.addEventListener('click', () => {
    location.reload();
  });
});


// ============================================================
// INIT
// ============================================================
loadSectionsAndItems().then(() => {
  loadCartFromMemory();
});
