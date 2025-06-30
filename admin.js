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

 

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // Redirect unauthenticated users
    sessionStorage.clear();
    window.location.href = "admin-login.html";
    return;
  }

  // If user is logged in, check admin validation
  const sessionCode = sessionStorage.getItem("adminCode");
  if (!sessionCode) {
    sessionStorage.clear();
    window.location.href = "admin-login.html";
    return;
  }

  const adminDocRef = doc(db, "adminAccess", user.uid);
  const adminDocSnap = await getDoc(adminDocRef);

  // If user is not an admin or the code doesn't match, log them out
  if (!adminDocSnap.exists() || adminDocSnap.data().code !== sessionCode) {
    sessionStorage.clear();
    window.location.href = "admin-login.html";
    return;
  }

  // Admin validated, now load messages
 
});


onAuthStateChanged(auth, async (user) => {
  if (!user) {
    console.log("User is not authenticated.");
    sessionStorage.clear();
    window.location.href = "admin.login.html";
    return;
  }
  console.log("User is authenticated:", user);
  // Continue with admin validation...
});


window.addEventListener("DOMContentLoaded", () => {
    const openModalBtn = document.getElementById("openModalBtn");
    const sectionModal = document.getElementById("sectionModal");
    const sectionForm = document.getElementById("sectionForm");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const itemPreviewList = document.getElementById("itemPreviewList");
    const itemsWrapper = document.getElementById("itemsWrapper");
  
    if (openModalBtn && sectionModal && sectionForm) {
      openModalBtn.onclick = () => {
        sectionModal.style.display = "flex";
      };
  
      closeModalBtn.onclick = () => {
        sectionModal.style.display = "none";
        resetSectionModal();
      };
  
      sectionForm.addEventListener("submit", () => {
        sectionModal.style.display = "none";
        resetSectionModal();
      });
    }
  
function resetSectionModal() {
  // Reset form fields
  sectionForm.reset();

  // Clear preview list
  itemPreviewList.innerHTML = "";

  // Clear sectionItems array if used globally
  sectionItems = [];

 

 
}

  });
  


// Elements
const form = document.getElementById('sectionForm');
 
const itemPreviewList = document.getElementById('itemPreviewList');

 
// Handle form submit
const sectionModal = document.getElementById("sectionModal");
const closeModalBtn = document.getElementById("closeModalBtn");

let sectionItems = []; // Resettable list of items per section

// Submit form
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const submitBtn = form.querySelector("button[type='submit']");
  submitBtn.disabled = true;
  submitBtn.innerText = "Submitting...";

  const sectionName = document.getElementById("sectionName").value.trim();

  if (sectionName && sectionItems.length > 0) {
    try {
      await addDoc(collection(db, "sections"), {
        sectionName,
        items: sectionItems,
        createdAt: new Date()
      });

      alert("✅ Section submitted!");
      form.reset();
      itemPreviewList.innerHTML = "";
      sectionItems = [];
      sectionModal.style.display = "none";
    } catch (err) {
      console.error("Error saving section:", err);
      alert("❌ An error occurred while saving.");
    }
  } else {
    alert("Please add a section name and at least one item.");
  }

  submitBtn.disabled = false;
  submitBtn.innerText = "Submit Section";
});


// Close modal when clicking the "×" button
closeModalBtn.addEventListener("click", () => {
  sectionModal.style.display = "none";
  itemForm.reset();
  editingIndex = null; // 🔁 Reset again here
});

// Close modal when clicking outside modal content
window.addEventListener("click", (e) => {
  if (e.target === sectionModal) {
    sectionModal.style.display = "none";
    itemForm.reset();
    editingIndex = null; // 🔁 Reset again here
  }
});


  



const itemModal = document.getElementById("itemModal");
const openItemBtn = document.getElementById("addItemBtn");
const closeItemModalBtn = document.getElementById("closeItemModalBtn");
const itemForm = document.getElementById("itemForm");
 
openItemBtn.onclick = () => {
  itemModal.style.display = "flex";
  
};

closeItemModalBtn.onclick = () => {
  itemModal.style.display = "none";
  itemForm.reset();
};

// On save in item modal
let editingIndex = null; // Track index if editing

itemForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const submitBtn = itemForm.querySelector("button[type='submit']");
  submitBtn.disabled = true;
  submitBtn.innerText = "Saving...";

  const description = document.getElementById("itemDescription").value.trim();
  const name = document.getElementById("itemName").value.trim();
  const price = parseFloat(document.getElementById("itemPrice").value);
  const stock = parseInt(document.getElementById("itemStock").value);
  const imageInput = document.getElementById("itemImage");
  let imageUrl = null;

  try {
    if (imageInput.files.length > 0) {
      const file = imageInput.files[0];
  
      const options = {
        maxSizeMB: 0.5, // Compress to ~500KB
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };
  
      const compressedFile = await imageCompression(file, options);
      const storageRef = ref(storage, `items/${Date.now()}_${compressedFile.name}`);
      const snapshot = await uploadBytes(storageRef, compressedFile);
      imageUrl = await getDownloadURL(snapshot.ref);
    }
  
    if (name && !isNaN(price) && !isNaN(stock)) {
      const itemData = { name, price, stock, description, imageUrl };
  
      if (editingIndex !== null) {
        sectionItems[editingIndex] = itemData;
        editingIndex = null;
      } else {
        sectionItems.push(itemData);
      }
  
      renderItemPreviewList();
      itemModal.style.display = "none";
      itemForm.reset();
    }
  } catch (err) {
    console.error("Error saving item:", err);
    alert("❌ Error saving item.");
  }
  
  

  submitBtn.disabled = false;
  submitBtn.innerText = "Save";
});



function renderItemPreviewList() {
  itemPreviewList.innerHTML = "";
  sectionItems.forEach((item, index) => {
    const displayName = item.name.length > 20 ? item.name.substring(0, 20) + "..." : item.name;

    const div = document.createElement("div");
    div.className = "item-entry";
    div.innerHTML = `
      <p style="display: flex; align-items: center; justify-content: space-between; gap: 10px;">
        <span><strong>${displayName}</strong> - ₦${item.price} (${item.stock})</span>
        <span class="edit-icon" data-index="${index}" style="cursor: pointer;">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000">
            <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
          </svg>
        </span>
        <span class="delete-icon" data-index="${index}" style="cursor: pointer;">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000">
            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
          </svg>
        </span>
      </p>
      ${item.imageUrl ? `<img src="${item.imageUrl}" style="max-width: 80px; max-height: 80px; object-fit: cover;">` : ""}
    `;
    itemPreviewList.appendChild(div);
  });

  // Event listeners for delete/edit
  document.querySelectorAll(".delete-icon").forEach(span => {
    span.onclick = () => {
      const i = parseInt(span.dataset.index);
      sectionItems.splice(i, 1);
      renderItemPreviewList();
    };
  });

  document.querySelectorAll(".edit-icon").forEach(span => {
    span.onclick = () => {
      const i = parseInt(span.dataset.index);
      const item = sectionItems[i];
      editingIndex = i;

      document.getElementById("itemName").value = item.name;
      document.getElementById("itemPrice").value = item.price;
      document.getElementById("itemStock").value = item.stock;
      document.getElementById("itemDescription").value = item.description || "";

      itemModal.style.display = "flex";
    };
  });
}






const sectionContainer = document.getElementById('sectionContainer');

function renderSections(sections, docIds) {
  sectionContainer.innerHTML = "";

  sections.forEach((section, secIndex) => {
  
  
    const itemsHTML = section.items.map((item, itemIndex) => `
      <div class="item-card" data-section-index="${secIndex}" data-item-index="${itemIndex}">
        <img src="${item.imageUrl}" class="item-img" alt="${item.name}">
        <div class="item-details">
          <div class="item-name">${item.name.length > 20 ? item.name.slice(0, 20) + "..." : item.name}</div>
          <div class="item-desc" style="display: none;">${item.description}</div>
          <div class="item-price">$${item.price}</div>
          <div class="item-stock">Qty: ${item.stock}</div>
        </div>
        <div class="item-actions">
        <button class="edit-item-btn">Edit</button>
        <button class="delete-item-btn">Delete</button>
      </div>
      </div>
    `).join("");

    const sectionHTML = `
    <div class="section-box" data-section-index="${secIndex}">
    <div class="section-controls">
      <button class="add-item-btn" data-doc-id="${docIds[secIndex]}" data-sec-index="${secIndex}">Add Item</button>
      <button class="delete-section-btn" data-doc-id="${docIds[secIndex]}">Delete</button>
    </div>
    <h2 class="section-title">${section.sectionName}</h2>
    <div class="filter-bar">
      <input type="text" placeholder="Filter by name..." class="filter-input">
      <input type="number" placeholder="Filter by quantity..." class="filter-quantity">
    </div>
    <div class="items-grid">${itemsHTML}</div>
  </div>
    `;
 
    
    
    sectionContainer.insertAdjacentHTML('beforeend', sectionHTML);


    // 🟢 ADD THIS AFTER appending the HTML (still inside the forEach loop!)
    const sectionBoxes = sectionContainer.querySelectorAll('.section-box');
    const sectionBox = sectionBoxes[sectionBoxes.length - 1];
    const filterInput = sectionBox.querySelector('.filter-input');
    const filterQuantity = sectionBox.querySelector('.filter-quantity');
    const itemCards = sectionBox.querySelectorAll('.item-card');
  
    function applyFilters() {
      const query = filterInput.value.toLowerCase();
      const quantity = parseInt(filterQuantity.value);
  
      itemCards.forEach(card => {
        const name = card.querySelector('.item-name').textContent.toLowerCase();
        const stockText = card.querySelector('.item-stock').textContent;
        const stock = parseInt(stockText.replace(/\D/g, ''));
  
        const matchesName = name.includes(query);
        const matchesQty = isNaN(quantity) || stock === quantity;
  
        card.style.display = matchesName && matchesQty ? 'block' : 'none';
      });
    }
  
    filterInput.addEventListener('input', applyFilters);
    filterQuantity.addEventListener('input', applyFilters);
 
   
});

 


 
 
  

  document.querySelectorAll('.add-item-btn').forEach(btn => {
    btn.onclick = () => {
      const docId = btn.dataset.docId;
      const secIndex = parseInt(btn.dataset.secIndex);
      openAddItemModal(docId, secIndex);
    };
  });
  
  // Attach events after rendering
  document.querySelectorAll('.edit-item-btn').forEach(btn => {
    btn.onclick = (e) => {
      const card = e.target.closest('.item-card');
      const secIndex = parseInt(card.dataset.sectionIndex);
      const itemIndex = parseInt(card.dataset.itemIndex);
      const item = sections[secIndex].items[itemIndex];
      openEditModal(item, docIds[secIndex], itemIndex);
    };
  });
  document.querySelectorAll('.delete-section-btn').forEach(btn => {
    btn.onclick = async () => {
      const docId = btn.dataset.docId;
      const confirmed = confirm("Are you sure you want to delete this section? This will also delete all item images.");
  
      if (!confirmed) return;
  
      document.getElementById("loaderOverlay").style.display = "flex";
  
      const docRef = doc(db, "sections", docId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const items = docSnap.data().items || [];
  
        // Delete all item images
        for (const item of items) {
          if (item.imageUrl) {
            try {
              const fileRef = ref(storage, item.imageUrl);
              await deleteObject(fileRef);
            } catch (err) {
              console.warn("Image delete failed:", err.message);
            }
          }
        }
  
        // Delete the section document
        await deleteDoc(docRef);
      }
  
      document.getElementById("loaderOverlay").style.display = "none";
      loadSections();
    };
  });
  
  document.querySelectorAll('.delete-item-btn').forEach(btn => {
    btn.onclick = async (e) => {
      const card = e.target.closest('.item-card');
      const secIndex = parseInt(card.dataset.sectionIndex);
      const itemIndex = parseInt(card.dataset.itemIndex);
      const docId = docIds[secIndex];
      const sectionItems = sections[secIndex].items;
      const itemToDelete = sectionItems[itemIndex];
  
      const confirmed = confirm("Delete this item and its image?");
      if (!confirmed) return;
  
      document.getElementById("loaderOverlay").style.display = "flex";
  
      // Delete item image if exists
      if (itemToDelete.imageUrl) {
        try {
          const fileRef = ref(storage, itemToDelete.imageUrl);
          await deleteObject(fileRef);
        } catch (err) {
          console.warn("Failed to delete image:", err.message);
        }
      }
  
      // Remove item from Firestore
      sectionItems.splice(itemIndex, 1);
      const docRef = doc(db, "sections", docId);
  
      if (sectionItems.length === 0) {
        await deleteDoc(docRef);
      } else {
        await updateDoc(docRef, { items: sectionItems });
      }
  
      document.getElementById("loaderOverlay").style.display = "none";
      loadSections();
    };
  });
  
  
}
 

function openAddItemModal(docId) {
  const itemModal = document.getElementById("itemModal");
  itemModal.style.display = "flex";

  const form = document.getElementById("itemForm");

  // Clear previous handlers
  const newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);

  newForm.onsubmit = async (e) => {
    e.preventDefault();
    const submitBtn = newForm.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.innerText = "Saving...";
  
    const name = document.getElementById("itemName").value.trim();
    const price = parseFloat(document.getElementById("itemPrice").value);
    const stock = parseInt(document.getElementById("itemStock").value);
    const description = document.getElementById("itemDescription").value.trim();
    const imageFile = document.getElementById("itemImage").files[0];
  
    let imageUrl = "";
    if (imageFile) {
      try {
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        };
  
        const compressedFile = await imageCompression(imageFile, options);
        const storageRef = ref(storage, `items/${Date.now()}_${compressedFile.name}`);
        const snapshot = await uploadBytes(storageRef, compressedFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      } catch (err) {
        console.error("Image compression failed:", err);
        alert("❌ Failed to compress or upload image.");
        submitBtn.disabled = false;
        submitBtn.innerText = "Save";
        return;
      }
    }
  
    const newItem = { name, price, stock, description, imageUrl };
  
    const docRef = doc(db, "sections", docId);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    data.items.push(newItem);
  
    await updateDoc(docRef, { items: data.items });
  
    itemModal.style.display = "none";
    newForm.reset();
    submitBtn.disabled = false;
    submitBtn.innerText = "Save";
    loadSections();
  };
  
}



function openEditModal(item, docId, itemIndex) {
  document.getElementById("editName").value = item.name;
  document.getElementById("editPrice").value = item.price;
  document.getElementById("editStock").value = item.stock;
  document.getElementById("editDesc").value = item.description;
  document.getElementById("editItemModal").style.display = "flex";

  const form = document.getElementById("editItemForm");
  form.onsubmit = async (e) => {
    e.preventDefault();

    const updatedItem = {
      name: document.getElementById("editName").value.trim(),
      price: parseFloat(document.getElementById("editPrice").value),
      stock: parseInt(document.getElementById("editStock").value),
      description: document.getElementById("editDesc").value.trim()
    };

    const imageFile = document.getElementById("editImage").files[0];

    if (imageFile) {
      try {
        // Delete old image
        if (item.imageUrl) {
          try {
            const oldRef = ref(storage, item.imageUrl);
            await deleteObject(oldRef);
          } catch (err) {
            console.warn("Failed to delete old image:", err.message);
          }
        }

        // Compress new image
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(imageFile, options);

        const storageRef = ref(storage, `items/${Date.now()}_${compressedFile.name}`);
        const snapshot = await uploadBytes(storageRef, compressedFile);
        updatedItem.imageUrl = await getDownloadURL(snapshot.ref);
      } catch (err) {
        console.error("Error compressing or uploading image:", err.message);
        alert("❌ Failed to update image.");
        return;
      }
    } else {
      updatedItem.imageUrl = item.imageUrl;
    }

    const docRef = doc(db, "sections", docId);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    data.items[itemIndex] = updatedItem;

    await updateDoc(docRef, { items: data.items });
    document.getElementById("editItemModal").style.display = "none";
    loadSections();
  };
}




 
async function loadSections() {
  const snapshot = await getDocs(collection(db, "sections"));
  const data = snapshot.docs.map(doc => doc.data());
  const docIds = snapshot.docs.map(doc => doc.id);
  renderSections(data, docIds);
}


loadSections();



const editModal = document.getElementById("editItemModal");
const closeEditModalBtn = document.getElementById("closeEditModalBtn");
const editForm = document.getElementById("editItemForm");

// Close modal on × button
closeEditModalBtn.onclick = () => {
  editModal.style.display = "none";
  editForm.reset(); // Clear form
};

// Close modal when clicking outside the modal content
window.addEventListener("click", (e) => {
  if (e.target === editModal) {
    editModal.style.display = "none";
    editForm.reset(); // Clear form
  }
});



document.addEventListener("DOMContentLoaded", async () => {
  const ordersContainer = document.getElementById("ordersContainer");
  const filterNameInput = document.querySelector(".filter-name-order");
  const filterEmailInput = document.querySelector(".filter-email-order");
  const filterDateInput = document.querySelector(".filter-date-order");

  flatpickr(".filter-date-order", {
    dateFormat: "Y-m-d",
    allowInput: false  // 🔒 disables typing
  });
  

  let allOrders = [];

  function renderOrders(filteredOrders, docRefs) {

    ordersContainer.innerHTML = "";

    filteredOrders.forEach((order, index) => {
      const orderId = `modal-${index}`;
      const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const pendingChecked = order.status === "pending" ? "checked" : "";
      const completeChecked = order.status === "complete" ? "checked" : "";
      const deliveredChecked = order.status === "delivered" ? "checked" : "";
      
      const orderBox = document.createElement("div");
      orderBox.classList.add("order-box");
      orderBox.innerHTML = `
        <p><strong>Name:</strong> ${order.name}</p>
        <p><strong>Email:</strong> ${order.email}</p>
        <p><strong>Phone:</strong> ${order.phone}</p>
        <p><strong>Country:</strong> ${order.country?.label || ""}</p>
        <p><strong>Delivery location:</strong> ${order.pickup}</p>
        <p><strong>Timestamp:</strong> ${new Date(order.timestamp).toLocaleString()}</p>
        <p><strong>Total:</strong> $${total.toFixed(2)}</p>
        <button class="view-items-btn" data-modal="${orderId}">View Items</button>
        <button class="status-btn" data-status="${index}">Status</button>
        <button class="delete-order-btn" data-index="${index}">Delete</button>
        

<div id="status-modal-${index}" class="status-modal" style="display: none;">
  <div class="status-modal-content">
    <span class="close-status-modal" data-status="${index}">&times;</span>
    <h3>Order Status</h3>
    <form class="status-form">
    <label><input type="radio" name="status-${index}" value="pending" ${pendingChecked}> Pending</label><br>
    <label><input type="radio" name="status-${index}" value="complete" ${completeChecked}> Complete</label><br>
    <label><input type="radio" name="status-${index}" value="delivered" ${deliveredChecked}> Delivered</label><br>
    
    <textarea class="status-message pending-message" style="${order.status === 'pending' ? '' : 'display:none;'}">Hi ${order.name}, your order is currently pending. We’ll notify you when it's being processed.</textarea><br>
    
    <textarea class="status-message complete-message" style="${order.status === 'complete' ? '' : 'display:none;'}">Hi ${order.name}, your order has been marked as complete. Thank you for shopping with us!</textarea><br>
    
    <textarea class="status-message delivered-message" style="${order.status === 'delivered' ? '' : 'display:none;'}">Hi ${order.name}, your order has been delivered. Kindly confirm receipt. Thanks!</textarea><br>
    
      <button type="submit" class="send-status-btn">Send Update</button>
    </form>
  </div>
</div>


        <div id="${orderId}" class="items-modal">
          <div class="items-modal-content">
            <span class="close-items-modal" data-modal="${orderId}">&times;</span>
            <h3>Ordered Items</h3>
            <div class="items-list">
              ${order.items.map(item => `
                <div class="modal-item">
                  <img src="${item.image || ''}" alt="${item.name}" />
                  <span>Name: ${item.name} <br>Quantity: ${item.quantity}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      ordersContainer.appendChild(orderBox);
    });
    document.querySelectorAll(".status-form").forEach((form, index) => {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
    
        const selectedStatus = form.querySelector(`input[name="status-${index}"]:checked`)?.value;
        let message = "";
    
        if (selectedStatus === "pending") {
          message = form.querySelector(".pending-message").value.trim();
        } else if (selectedStatus === "complete") {
          message = form.querySelector(".complete-message").value.trim();
        } else if (selectedStatus === "delivered") {
          message = form.querySelector(".delivered-message").value.trim();
        }
    
        const docRef = docRefs[index].ref;

        try {
          await updateDoc(docRef, { status: selectedStatus });
          alert("✅ Status updated!");
          // Optionally send email here with `message`
        } catch (err) {
          console.error("Error updating status:", err);
          alert("❌ Failed to update status.");
        }
      });
    });
    document.querySelectorAll(".status-form").forEach((form, formIndex) => {
      const radios = form.querySelectorAll(`input[name="status-${formIndex}"]`);
      const pendingMsg = form.querySelector(".pending-message");
      const completeMsg = form.querySelector(".complete-message");
      const deliveredMsg = form.querySelector(".delivered-message");
    
      radios.forEach(radio => {
        radio.addEventListener("change", () => {
          pendingMsg.style.display = radio.value === "pending" ? "block" : "none";
          completeMsg.style.display = radio.value === "complete" ? "block" : "none";
          deliveredMsg.style.display = radio.value === "delivered" ? "block" : "none";
        });
      });
    });
    
    

    // Attach modal events
    document.querySelectorAll(".view-items-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const modalId = btn.dataset.modal;
        document.getElementById(modalId).style.display = "flex";
      });
    });

    document.querySelectorAll(".status-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = btn.dataset.status;
        document.getElementById(`status-modal-${index}`).style.display = "flex";
      });
    });
    document.querySelectorAll(".delete-order-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const index = btn.dataset.index;
        const confirmDelete = confirm("Are you sure you want to delete this order?");
        if (!confirmDelete) return;
    
        const docRef = docRefs[index].ref;
        try {
          await deleteDoc(docRef);
          alert("🗑️ Order deleted.");
          // Re-fetch and re-render orders
          const snapshot = await getDocs(collection(db, "orders"));
          allOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          renderOrders(allOrders, snapshot.docs);
        } catch (err) {
          console.error("❌ Failed to delete order:", err);
          alert("Failed to delete order. Try again.");
        }
      });
    });
    
    document.querySelectorAll(".close-status-modal").forEach(close => {
      close.addEventListener("click", () => {
        const index = close.dataset.status;
        document.getElementById(`status-modal-${index}`).style.display = "none";
      });
    });
    
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("status-modal")) {
        e.target.style.display = "none";
      }
    });
    

    document.querySelectorAll(".close-items-modal").forEach(close => {
      close.addEventListener("click", () => {
        const modalId = close.dataset.modal;
        document.getElementById(modalId).style.display = "none";
      });
    });

    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("items-modal")) {
        e.target.style.display = "none";
      }
    });
  }

  function applyFilters() {
    const nameVal = filterNameInput.value.toLowerCase();
    const emailVal = filterEmailInput.value.toLowerCase();
    const dateVal = filterDateInput.value;

    const filtered = allOrders.filter(order => {
      const matchesName = order.name.toLowerCase().includes(nameVal);
      const matchesEmail = order.email.toLowerCase().includes(emailVal);
      const matchesDate = dateVal === "" || new Date(order.timestamp).toISOString().startsWith(dateVal);
      return matchesName && matchesEmail && matchesDate;
    });

    renderOrders(filtered);
  }

  try {
    const snapshot = await getDocs(collection(db, "orders"));
    allOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
renderOrders(allOrders, snapshot.docs);

    // Filter events
    filterNameInput.addEventListener("input", applyFilters);
    filterEmailInput.addEventListener("input", applyFilters);
    filterDateInput.addEventListener("change", applyFilters);

  } catch (err) {
    console.error("Error loading orders:", err);
  }
});





 
const bgPreview = document.getElementById('bgPreview');
const bgInput = document.getElementById('bgImageInput');
const saveBtn = document.getElementById('saveBgBtn');

let currentBgUrl = "";
let newCompressedFile = null;

async function loadAdminBgPreview() {
  try {
    const docRef = doc(db, "homeBackground", "main");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      currentBgUrl = docSnap.data().imageUrl;
      bgPreview.src = currentBgUrl;
    }
  } catch (err) {
    console.error("Failed to load background image:", err.message);
  }
}

bgInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    // ✅ Use the original file without compression
    newCompressedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      bgPreview.src = reader.result;
    };
    reader.readAsDataURL(file);
  } catch (err) {
    alert("❌ Failed to preview image");
  }
});

saveBtn.addEventListener("click", async () => {
  if (!newCompressedFile) {
    alert("Please select a new image.");
    return;
  }

  try {
    const docRef = doc(db, "homeBackground", "main");
    const docSnap = await getDoc(docRef);
    const previousData = docSnap.exists() ? docSnap.data() : null;

    // Delete previous image if path exists
    if (previousData?.imagePath) {
      try {
        const oldRef = ref(storage, previousData.imagePath);
        await deleteObject(oldRef);
      } catch (err) {
        console.warn("Couldn't delete old image:", err.message);
      }
    }

    // Upload new image
    const fileName = `bg_${Date.now()}_${newCompressedFile.name}`;
    const storagePath = `backgrounds/${fileName}`;
    const storageRef = ref(storage, storagePath);
    const snapshot = await uploadBytes(storageRef, newCompressedFile);
    const newUrl = await getDownloadURL(snapshot.ref);

    // Save both URL and path
    await setDoc(docRef, {
      imageUrl: newUrl,
      imagePath: storagePath,
    });

    alert("✅ Background image updated!");
    currentBgUrl = newUrl;
    newCompressedFile = null;
  } catch (err) {
    console.error("Error saving background image:", err);
    alert("❌ Failed to save image.");
  }
});


loadAdminBgPreview();
