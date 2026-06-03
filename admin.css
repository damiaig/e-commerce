import { db, storage, auth } from "./firebase-config.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-storage.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

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


// ── AUTH GUARD ────────────────────────────────────────────────────────────────
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    sessionStorage.clear();
    window.location.href = "admin-login.html";
    return;
  }

  const sessionCode = sessionStorage.getItem("adminCode");
  if (!sessionCode) {
    sessionStorage.clear();
    window.location.href = "admin-login.html";
    return;
  }

  const adminDocRef  = doc(db, "adminAccess", user.uid);
  const adminDocSnap = await getDoc(adminDocRef);

  if (!adminDocSnap.exists() || adminDocSnap.data().code !== sessionCode) {
    sessionStorage.clear();
    window.location.href = "admin-login.html";
    return;
  }
});


// ── LOADER HELPERS ────────────────────────────────────────────────────────────
function showLoader() { document.getElementById("loaderOverlay").style.display = "flex"; }
function hideLoader() { document.getElementById("loaderOverlay").style.display = "none"; }


// ── IMAGE UPLOAD HELPER (images only, min qty = 1) ───────────────────────────
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

function validateImageFile(file) {
  if (!file) return true; // no file is fine (optional)
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    alert("❌ Only image files are allowed (JPEG, PNG, WebP, GIF, AVIF).");
    return false;
  }
  return true;
}

// Attach image-only filter to a file input
function lockToImages(inputEl) {
  inputEl.setAttribute("accept", "image/*");
  inputEl.addEventListener("change", () => {
    if (inputEl.files.length && !validateImageFile(inputEl.files[0])) {
      inputEl.value = "";
    }
  });
}

// Enforce min=1 on a number input (quantity)
function enforceMinOne(inputEl) {
  inputEl.setAttribute("min", "1");
  inputEl.addEventListener("input", () => {
    const v = parseInt(inputEl.value);
    if (!isNaN(v) && v < 1) inputEl.value = 1;
  });
  inputEl.addEventListener("blur", () => {
    if (inputEl.value === "" || parseInt(inputEl.value) < 1) inputEl.value = 1;
  });
}

// Apply restrictions once DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  lockToImages(document.getElementById("itemImage"));
  lockToImages(document.getElementById("editImage"));
  enforceMinOne(document.getElementById("itemStock"));
  enforceMinOne(document.getElementById("editStock"));
});


// ══════════════════════════════════════════════════════════════════════════════
// SECTION / ITEM MANAGEMENT
// ══════════════════════════════════════════════════════════════════════════════

let newSectionItems        = [];
let newSectionEditingIndex = null;


// ── NEW SECTION MODAL ─────────────────────────────────────────────────────────
const openModalBtn  = document.getElementById("openModalBtn");
const sectionModal  = document.getElementById("sectionModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const sectionForm   = document.getElementById("sectionForm");

openModalBtn.onclick = () => {
  resetNewSectionModal();
  sectionModal.style.display = "flex";
};

closeModalBtn.onclick = () => {
  sectionModal.style.display = "none";
  resetNewSectionModal();
};

window.addEventListener("click", (e) => {
  if (e.target === sectionModal) {
    sectionModal.style.display = "none";
    resetNewSectionModal();
  }
});

function resetNewSectionModal() {
  sectionForm.reset();
  newSectionItems        = [];
  newSectionEditingIndex = null;
  renderNewSectionPreview();
}

sectionForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const sectionName = document.getElementById("sectionName").value.trim();

  if (!sectionName)                { alert("Please enter a section name."); return; }
  if (newSectionItems.length === 0) { alert("Please add at least one item."); return; }

  const submitBtn = sectionForm.querySelector("#submitSection");
  submitBtn.disabled    = true;
  submitBtn.textContent = "Submitting…";

  try {
    await addDoc(collection(db, "sections"), {
      sectionName,
      items: newSectionItems,
      createdAt: new Date()
    });
    alert("✅ Section submitted!");
    sectionModal.style.display = "none";
    resetNewSectionModal();
    loadSections();
  } catch (err) {
    console.error("Error saving section:", err);
    alert("❌ An error occurred while saving.");
  }

  submitBtn.disabled    = false;
  submitBtn.textContent = "Submit Section";
});


// ── SHARED ITEM MODAL ─────────────────────────────────────────────────────────
let itemModalMode  = "new-section";
let existingDocId  = null;

const itemModal         = document.getElementById("itemModal");
const closeItemModalBtn = document.getElementById("closeItemModalBtn");
const itemForm          = document.getElementById("itemForm");

document.getElementById("addItemBtn").onclick = () => {
  itemModalMode          = "new-section";
  newSectionEditingIndex = null;
  itemForm.reset();
  document.getElementById("category").value = "";
  itemModal.style.display = "flex";
};

closeItemModalBtn.onclick = () => {
  itemModal.style.display = "none";
  itemForm.reset();
  newSectionEditingIndex = null;
};

window.addEventListener("click", (e) => {
  if (e.target === itemModal) {
    itemModal.style.display = "none";
    itemForm.reset();
    newSectionEditingIndex = null;
  }
});

itemForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = itemForm.querySelector("button[type='submit']");
  submitBtn.disabled    = true;
  submitBtn.textContent = "Saving…";

  const name        = document.getElementById("itemName").value.trim();
  const price       = parseFloat(document.getElementById("itemPrice").value);
  const stock       = parseInt(document.getElementById("itemStock").value);
  const description = document.getElementById("itemDescription").value.trim();
  const category    = document.getElementById("category").value.trim();
  const imageInput  = document.getElementById("itemImage");
  const imageFile   = imageInput.files[0];

  // Validate image type
  if (!validateImageFile(imageFile)) {
    submitBtn.disabled    = false;
    submitBtn.textContent = "Save";
    return;
  }

  // Enforce stock >= 1
  if (isNaN(stock) || stock < 1) {
    alert("Quantity must be at least 1.");
    submitBtn.disabled    = false;
    submitBtn.textContent = "Save";
    return;
  }

  let imageUrl = "";

  if (imageFile) {
    try {
      const options        = { maxSizeMB: 0.5, maxWidthOrHeight: 800, useWebWorker: true };
      const compressedFile = await imageCompression(imageFile, options);
      const storageRef     = ref(storage, `items/${Date.now()}_${compressedFile.name}`);
      const snapshot       = await uploadBytes(storageRef, compressedFile);
      imageUrl             = await getDownloadURL(snapshot.ref);
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("❌ Failed to upload image.");
      submitBtn.disabled    = false;
      submitBtn.textContent = "Save";
      return;
    }
  }

  const itemData = { name, price, stock, description, category, imageUrl };

  if (itemModalMode === "new-section") {
    if (newSectionEditingIndex !== null) {
      if (!imageFile) itemData.imageUrl = newSectionItems[newSectionEditingIndex].imageUrl;
      newSectionItems[newSectionEditingIndex] = itemData;
      newSectionEditingIndex = null;
    } else {
      newSectionItems.push(itemData);
    }
    renderNewSectionPreview();

  } else if (itemModalMode === "existing-section") {
    try {
      const docRef  = doc(db, "sections", existingDocId);
      const docSnap = await getDoc(docRef);
      const data    = docSnap.data();
      data.items.push(itemData);
      await updateDoc(docRef, { items: data.items });
      loadSections();
    } catch (err) {
      console.error("Failed to add item to existing section:", err);
      alert("❌ Failed to add item.");
    }
  }

  itemModal.style.display = "none";
  itemForm.reset();
  submitBtn.disabled    = false;
  submitBtn.textContent = "Save";
});


function renderNewSectionPreview() {
  const itemPreviewList = document.getElementById("itemPreviewList");
  itemPreviewList.innerHTML = "";

  newSectionItems.forEach((item, index) => {
    const displayName = item.name.length > 20 ? item.name.slice(0, 20) + "…" : item.name;

    const div = document.createElement("div");
    div.className = "item-entry";
    div.innerHTML = `
      ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.name}">` : ""}
      <p><strong>${displayName}</strong> — ₦${item.price} (qty: ${item.stock})</p>
      <span class="edit-icon"   data-index="${index}" style="cursor:pointer;" title="Edit">
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px">
          <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
        </svg>
      </span>
      <span class="delete-icon" data-index="${index}" style="cursor:pointer;" title="Remove">
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px">
          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
        </svg>
      </span>
    `;

    div.querySelector(".delete-icon").onclick = () => {
      newSectionItems.splice(index, 1);
      renderNewSectionPreview();
    };

    div.querySelector(".edit-icon").onclick = () => {
      newSectionEditingIndex = index;
      const it = newSectionItems[index];
      document.getElementById("itemName").value        = it.name;
      document.getElementById("itemPrice").value       = it.price;
      document.getElementById("itemStock").value       = it.stock;
      document.getElementById("itemDescription").value = it.description || "";
      document.getElementById("category").value        = it.category || "";
      itemModalMode           = "new-section";
      itemModal.style.display = "flex";
    };

    itemPreviewList.appendChild(div);
  });
}


// ══════════════════════════════════════════════════════════════════════════════
// LOAD & RENDER EXISTING SECTIONS
// ══════════════════════════════════════════════════════════════════════════════

const sectionContainer = document.getElementById("sectionContainer");

function renderSections(sections, docIds) {
  sectionContainer.innerHTML = "";

  sections.forEach((section, secIndex) => {
    const itemsHTML = section.items.map((item, itemIndex) => `
      <div class="item-card" data-section-index="${secIndex}" data-item-index="${itemIndex}" style="animation-delay:${itemIndex * 0.05}s;">
        <img src="${item.imageUrl || ''}" class="item-img" alt="${item.name}">
        <div class="item-details">
          <div class="item-name">${item.name.length > 20 ? item.name.slice(0, 20) + "…" : item.name}</div>
          <div class="item-price">₦${item.price}</div>
          <div class="item-stock">Qty: ${item.stock}</div>
        </div>
        <div class="item-actions">
          <button class="edit-item-btn">Edit</button>
          <button class="delete-item-btn">Delete</button>
        </div>
      </div>
    `).join("");

    const sectionHTML = `
      <div class="section-box" data-section-index="${secIndex}" style="animation-delay:${secIndex * 0.08}s;">
        <h2 class="section-title">${section.sectionName}</h2>
        <div class="section-controls">
          <button class="add-item-btn" data-doc-id="${docIds[secIndex]}" data-sec-index="${secIndex}">+ Add Item</button>
          <button class="delete-section-btn" data-doc-id="${docIds[secIndex]}">Delete Section</button>
        </div>
        <div class="filter-bar">
          <input type="text"   placeholder="Filter by name…"     class="filter-input">
          <input type="number" placeholder="Filter by quantity…" class="filter-quantity">
        </div>
        <div class="items-grid">${itemsHTML}</div>
      </div>
    `;

    sectionContainer.insertAdjacentHTML("beforeend", sectionHTML);

    const sectionBoxes   = sectionContainer.querySelectorAll(".section-box");
    const sectionBox     = sectionBoxes[sectionBoxes.length - 1];
    const filterInput    = sectionBox.querySelector(".filter-input");
    const filterQuantity = sectionBox.querySelector(".filter-quantity");
    const itemCards      = sectionBox.querySelectorAll(".item-card");

    function applyFilters() {
      const q        = filterInput.value.toLowerCase();
      const quantity = parseInt(filterQuantity.value);
      itemCards.forEach(card => {
        const name  = card.querySelector(".item-name").textContent.toLowerCase();
        const stock = parseInt(card.querySelector(".item-stock").textContent.replace(/\D/g, ""));
        card.style.display = (name.includes(q) && (isNaN(quantity) || stock === quantity)) ? "block" : "none";
      });
    }

    filterInput.addEventListener("input", applyFilters);
    filterQuantity.addEventListener("input", applyFilters);
  });


  document.querySelectorAll(".add-item-btn").forEach(btn => {
    btn.onclick = () => {
      itemModalMode          = "existing-section";
      existingDocId          = btn.dataset.docId;
      newSectionEditingIndex = null;
      itemForm.reset();
      document.getElementById("category").value = "";
      itemModal.style.display = "flex";
    };
  });

  document.querySelectorAll(".edit-item-btn").forEach(btn => {
    btn.onclick = (e) => {
      const card      = e.target.closest(".item-card");
      const secIndex  = parseInt(card.dataset.sectionIndex);
      const itemIndex = parseInt(card.dataset.itemIndex);
      openEditModal(sections[secIndex].items[itemIndex], docIds[secIndex], itemIndex);
    };
  });

  document.querySelectorAll(".delete-section-btn").forEach(btn => {
    btn.onclick = async () => {
      if (!confirm("Delete this entire section and all its images?")) return;
      showLoader();

      const docRef  = doc(db, "sections", btn.dataset.docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        for (const item of (docSnap.data().items || [])) {
          if (item.imageUrl) {
            try { await deleteObject(ref(storage, item.imageUrl)); }
            catch (err) { console.warn("Image delete failed:", err.message); }
          }
        }
        await deleteDoc(docRef);
      }

      hideLoader();
      loadSections();
    };
  });

  document.querySelectorAll(".delete-item-btn").forEach(btn => {
    btn.onclick = async (e) => {
      const card      = e.target.closest(".item-card");
      const secIndex  = parseInt(card.dataset.sectionIndex);
      const itemIndex = parseInt(card.dataset.itemIndex);
      const docId     = docIds[secIndex];
      const items     = sections[secIndex].items;
      const target    = items[itemIndex];

      if (!confirm("Delete this item and its image?")) return;
      showLoader();

      if (target.imageUrl) {
        try { await deleteObject(ref(storage, target.imageUrl)); }
        catch (err) { console.warn("Image delete failed:", err.message); }
      }

      items.splice(itemIndex, 1);
      const docRef = doc(db, "sections", docId);
      if (items.length === 0) {
        await deleteDoc(docRef);
      } else {
        await updateDoc(docRef, { items });
      }

      hideLoader();
      loadSections();
    };
  });
}


// ── EDIT ITEM MODAL ───────────────────────────────────────────────────────────
const editModal         = document.getElementById("editItemModal");
const closeEditModalBtn = document.getElementById("closeEditModalBtn");
const editItemForm      = document.getElementById("editItemForm");

closeEditModalBtn.onclick = () => { editModal.style.display = "none"; editItemForm.reset(); };
window.addEventListener("click", (e) => {
  if (e.target === editModal) { editModal.style.display = "none"; editItemForm.reset(); }
});

function openEditModal(item, docId, itemIndex) {
  document.getElementById("editName").value     = item.name;
  document.getElementById("editPrice").value    = item.price;
  document.getElementById("editStock").value    = item.stock;
  document.getElementById("editDesc").value     = item.description || "";
  document.getElementById("editCategory").value = item.category || "";
  editModal.style.display = "flex";

  const freshForm = editItemForm.cloneNode(true);
  editItemForm.parentNode.replaceChild(freshForm, editItemForm);

  // Re-apply restrictions on cloned inputs
  lockToImages(freshForm.querySelector("#editImage"));
  enforceMinOne(freshForm.querySelector("#editStock"));

  document.getElementById("closeEditModalBtn").onclick = () => {
    document.getElementById("editItemModal").style.display = "none";
    freshForm.reset();
  };

  freshForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = freshForm.querySelector("button[type='submit']");
    submitBtn.disabled    = true;
    submitBtn.textContent = "Saving…";

    const stockVal = parseInt(document.getElementById("editStock").value);
    if (isNaN(stockVal) || stockVal < 1) {
      alert("Quantity must be at least 1.");
      submitBtn.disabled    = false;
      submitBtn.textContent = "Save Changes";
      return;
    }

    const imageFile = document.getElementById("editImage").files[0];
    if (!validateImageFile(imageFile)) {
      submitBtn.disabled    = false;
      submitBtn.textContent = "Save Changes";
      return;
    }

    const updatedItem = {
      name:        document.getElementById("editName").value.trim(),
      price:       parseFloat(document.getElementById("editPrice").value),
      stock:       stockVal,
      category:    document.getElementById("editCategory").value.trim(),
      description: document.getElementById("editDesc").value.trim()
    };

    if (imageFile) {
      try {
        if (item.imageUrl) {
          try { await deleteObject(ref(storage, item.imageUrl)); }
          catch (err) { console.warn("Old image delete failed:", err.message); }
        }
        const options        = { maxSizeMB: 0.5, maxWidthOrHeight: 800, useWebWorker: true };
        const compressedFile = await imageCompression(imageFile, options);
        const storageRef     = ref(storage, `items/${Date.now()}_${compressedFile.name}`);
        const snapshot       = await uploadBytes(storageRef, compressedFile);
        updatedItem.imageUrl = await getDownloadURL(snapshot.ref);
      } catch (err) {
        console.error("Image update failed:", err);
        alert("❌ Failed to update image.");
        submitBtn.disabled    = false;
        submitBtn.textContent = "Save Changes";
        return;
      }
    } else {
      updatedItem.imageUrl = item.imageUrl;
    }

    const docRef  = doc(db, "sections", docId);
    const docSnap = await getDoc(docRef);
    const data    = docSnap.data();
    data.items[itemIndex] = updatedItem;
    await updateDoc(docRef, { items: data.items });

    document.getElementById("editItemModal").style.display = "none";
    loadSections();

    submitBtn.disabled    = false;
    submitBtn.textContent = "Save Changes";
  });
}


async function loadSections() {
  const snapshot = await getDocs(collection(db, "sections"));
  const data     = snapshot.docs.map(d => d.data());
  const docIds   = snapshot.docs.map(d => d.id);
  renderSections(data, docIds);
}

loadSections();


// ══════════════════════════════════════════════════════════════════════════════
// ORDERS PANEL
// ══════════════════════════════════════════════════════════════════════════════

const ordersContainer  = document.getElementById("ordersContainer");
const filterNameInput  = document.querySelector(".filter-name-order");
const filterEmailInput = document.querySelector(".filter-email-order");
const filterDateInput  = document.querySelector(".filter-date-order");

flatpickr(".filter-date-order", { dateFormat: "Y-m-d", allowInput: false });

let allOrders  = [];
let allDocRefs = [];

function createAndMountModal(html) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html.trim();
  const modal = wrapper.firstElementChild;
  document.body.appendChild(modal);
  return modal;
}

function removeModal(modal) {
  if (modal && modal.parentNode) modal.parentNode.removeChild(modal);
}


function renderOrders(filteredOrders, docRefs) {
  ordersContainer.innerHTML = "";

  filteredOrders.forEach((order, index) => {
    const total = (order.items || []).reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

    const orderBox = document.createElement("div");
    orderBox.classList.add("order-box");
    orderBox.style.animationDelay = `${index * 0.06}s`;

    orderBox.innerHTML = `
      <p><strong>Name:</strong>              ${order.name || "—"}</p>
      <p><strong>Email:</strong>             ${order.email || "—"}</p>
      <p><strong>Phone:</strong>             ${order.phone || "—"}</p>
      <p><strong>Country:</strong>           ${order.country?.label || "—"}</p>
      <p><strong>Delivery location:</strong> ${order.pickup || "—"}</p>
      <p><strong>Timestamp:</strong>         ${order.timestamp ? new Date(order.timestamp).toLocaleString() : "—"}</p>
      <p><strong>Total:</strong>             ₦${total.toFixed(2)}</p>
      <div class="order-actions">
        <button class="view-items-btn">View Items</button>
        <button class="status-btn">Status</button>
        <button class="delete-order-btn">Delete</button>
      </div>
    `;

    ordersContainer.appendChild(orderBox);

    const viewItemsBtn   = orderBox.querySelector(".view-items-btn");
    const statusBtn      = orderBox.querySelector(".status-btn");
    const deleteOrderBtn = orderBox.querySelector(".delete-order-btn");

    // ── VIEW ITEMS ─────────────────────────────────────────────────────────
    viewItemsBtn.addEventListener("click", () => {
      // Each order item may store the image as 'image', 'imageUrl', or inside
      // a nested 'item' object — try all variants so the photo always shows.
      const itemsHTML = (order.items || []).map(item => {
        const imgSrc = item.image || item.imageUrl || item.img || "";
        const qty    = item.quantity ?? item.qty ?? 1;
        const price  = item.price ?? 0;
        const name   = item.name || "Unknown item";

        return `
          <div class="modal-item">
            ${imgSrc
              ? `<img src="${imgSrc}" alt="${name}" onerror="this.style.display='none'">`
              : `<div style="width:54px;height:54px;border-radius:8px;background:var(--bg-elevated);border:1px solid var(--border);flex-shrink:0;"></div>`
            }
            <span>
              <strong>${name}</strong><br>
              Qty: ${qty}<br>
              Price: ₦${price}
            </span>
          </div>
        `;
      }).join("");

      const modal = createAndMountModal(`
        <div class="modal" style="display:flex;">
          <div class="items-modal-content">
            <span class="close" style="cursor:pointer;">&times;</span>
            <h2>Order Info</h2>
            <div style="margin-bottom:14px; font-size:13.5px; color:var(--text-secondary);">
              <p><strong>Name:</strong> ${order.name || "—"}</p>
              <p><strong>Email:</strong> ${order.email || "—"}</p>
              <p><strong>Phone:</strong> ${order.phone || "—"}</p>
              <p><strong>Delivery location:</strong> ${order.pickup || "—"}</p>
              <p><strong>Date:</strong> ${order.timestamp ? new Date(order.timestamp).toLocaleString() : "—"}</p>
            </div>
            <h2>Items</h2>
            <div class="items-list">${itemsHTML || "<p style='color:var(--text-muted)'>No items found.</p>"}</div>
          </div>
        </div>
      `);

      modal.querySelector(".close").onclick = () => removeModal(modal);
      modal.addEventListener("click", (e) => { if (e.target === modal) removeModal(modal); });
    });


    // ── STATUS ─────────────────────────────────────────────────────────────
    statusBtn.addEventListener("click", () => {
      const pendingChecked   = order.status === "pending"   ? "checked" : "";
      const completeChecked  = order.status === "complete"  ? "checked" : "";
      const deliveredChecked = order.status === "delivered" ? "checked" : "";

      const modal = createAndMountModal(`
        <div class="modal" style="display:flex;">
          <div class="modal-content" style="max-width:460px; width:95vw;">
            <span class="close" style="cursor:pointer;">&times;</span>
            <h3>Order Status — ${order.name || ""}</h3>
            <form class="status-form" style="margin-top:12px;">
              <label><input type="radio" name="status" value="pending"   ${pendingChecked}>   Pending</label>
              <label><input type="radio" name="status" value="complete"  ${completeChecked}>  Complete</label>
              <label><input type="radio" name="status" value="delivered" ${deliveredChecked}> Delivered</label>

              <textarea class="status-message pending-message"   style="${order.status === 'pending'   ? '' : 'display:none;'}">Hi ${order.name}, your order is currently pending. We'll notify you when it's being processed.</textarea>
              <textarea class="status-message complete-message"  style="${order.status === 'complete'  ? '' : 'display:none;'}">Hi ${order.name}, your order has been marked as complete. Thank you for shopping with us!</textarea>
              <textarea class="status-message delivered-message" style="${order.status === 'delivered' ? '' : 'display:none;'}">Hi ${order.name}, your order has been delivered. Kindly confirm receipt. Thanks!</textarea>

              <span class="send-status-btn" style="display:inline-block; margin-top:8px; cursor:pointer;">Send Update</span>
            </form>
          </div>
        </div>
      `);

      const form         = modal.querySelector(".status-form");
      const radios       = form.querySelectorAll("input[type='radio']");
      const sendBtn      = form.querySelector(".send-status-btn");
      const pendingMsg   = form.querySelector(".pending-message");
      const completeMsg  = form.querySelector(".complete-message");
      const deliveredMsg = form.querySelector(".delivered-message");

      radios.forEach(radio => {
        radio.addEventListener("change", () => {
          pendingMsg.style.display   = radio.value === "pending"   ? "block" : "none";
          completeMsg.style.display  = radio.value === "complete"  ? "block" : "none";
          deliveredMsg.style.display = radio.value === "delivered" ? "block" : "none";
        });
      });

      sendBtn.addEventListener("click", async () => {
        if (sendBtn.classList.contains("disabled")) return;

        const selectedRadio = form.querySelector("input[type='radio']:checked");
        if (!selectedRadio) { alert("Please select a status."); return; }

        const selectedStatus = selectedRadio.value;
        let message = "";
        if (selectedStatus === "pending")   message = pendingMsg.value.trim();
        if (selectedStatus === "complete")  message = completeMsg.value.trim();
        if (selectedStatus === "delivered") message = deliveredMsg.value.trim();

        if (!order.email?.trim()) { alert("❌ No valid email for this order."); return; }

        sendBtn.classList.add("disabled");
        sendBtn.textContent = "Processing…";
        showLoader();

        try {
          const docRef = docRefs[index].ref;
          await updateDoc(docRef, { status: selectedStatus });

          await emailjs.send("service_w3zumfl", "template_a3rcx9f", {
            to_name:  order.name,
            to_email: order.email,
            message
          });

          alert("✅ Status updated and email sent!");
          removeModal(modal);
          hideLoader();
          allOrders[allOrders.indexOf(order)].status = selectedStatus;
        } catch (err) {
          console.error("Status update error:", err);
          alert("❌ Failed to update status or send email.");
          sendBtn.classList.remove("disabled");
          sendBtn.textContent = "Send Update";
          hideLoader();
        }
      });

      modal.querySelector(".close").onclick = () => removeModal(modal);
      modal.addEventListener("click", (e) => { if (e.target === modal) removeModal(modal); });
    });


    // ── DELETE order ──────────────────────────────────────────────────────
    deleteOrderBtn.addEventListener("click", async () => {
      if (!confirm("Are you sure you want to delete this order?")) return;

      try {
        await deleteDoc(docRefs[index].ref);
        alert("🗑️ Order deleted.");
        const snapshot = await getDocs(collection(db, "orders"));
        allOrders  = snapshot.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        allDocRefs = snapshot.docs;
        renderOrders(allOrders, allDocRefs);
      } catch (err) {
        console.error("Delete order failed:", err);
        alert("❌ Failed to delete order.");
      }
    });
  });
}


// ── Filters ───────────────────────────────────────────────────────────────────
function applyOrderFilters() {
  const nameVal  = filterNameInput.value.toLowerCase();
  const emailVal = filterEmailInput.value.toLowerCase();
  const dateVal  = filterDateInput.value;

  const filtered = allOrders.filter(order => {
    const matchesName  = (order.name  || "").toLowerCase().includes(nameVal);
    const matchesEmail = (order.email || "").toLowerCase().includes(emailVal);
    const matchesDate  = !dateVal || (order.timestamp && new Date(order.timestamp).toISOString().startsWith(dateVal));
    return matchesName && matchesEmail && matchesDate;
  });

  const filteredDocRefs = filtered.map(order => allDocRefs.find(d => d.id === order.id));
  renderOrders(filtered, filteredDocRefs);
}

filterNameInput.addEventListener("input",  applyOrderFilters);
filterEmailInput.addEventListener("input", applyOrderFilters);
filterDateInput.addEventListener("change", applyOrderFilters);


// ── Initial orders load ───────────────────────────────────────────────────────
(async () => {
  try {
    const snapshot = await getDocs(collection(db, "orders"));
    allOrders  = snapshot.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    allDocRefs = snapshot.docs;
    renderOrders(allOrders, allDocRefs);
  } catch (err) {
    console.error("Error loading orders:", err);
  }
})();
