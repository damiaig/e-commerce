<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="style.css" rel="stylesheet">
    <title>Censura Clothing</title>
    <script src="https://js.paystack.co/v1/inline.js"></script>
    <link rel="icon" href="New_Project__10_-removebg-preview - Copy.png" type="image/png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Aclonica&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
</head>
<body>

  <!-- Custom Cursor -->
  <div class="cursor-dot"></div>
  <div class="cursor-ring"></div>

  <!-- Page Transition Overlay -->
  <div class="page-transition"></div>

  <!-- Loader -->
  <div id="loaderOverlay" style="display:none;">
    <div class="loader-inner">
      <div class="loader-logo">C</div>
      <div class="loader-bar"><div class="loader-bar-fill"></div></div>
    </div>
  </div>

  <!-- Item Modal -->
  <div class="item-modal" style="display: none;">
    <div class="item-modal-content">
      <!-- Dynamic item content will be inserted here -->
    </div>
  </div>

  <!-- Landing Section -->
  <div id="landingSection" class="landing-hero">
    <div class="header-logo">
      <span><img src="New_Project__10_-removebg-preview - Copy.png" alt=""></span>
    </div>

    <!-- Animated background lines -->
    <div class="hero-lines">
      <span></span><span></span><span></span><span></span><span></span>
    </div>

    <div class="landing-content">
      <div class="hero-eyebrow">EST. 2025 — COLLECTION</div>
      <h1 class="hero-title">
        <span class="hero-word">CEN</span><span class="hero-word accent">SU</span><span class="hero-word">RA</span>
      </h1>
      <p class="hero-sub">Wear the statement</p>
      <button class="catalog-btn" onclick="document.querySelector('.bur').scrollIntoView({ behavior: 'smooth' });">
        <span>Explore Catalog</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
      </button>
    </div>
 
  </div>

  <!-- Header -->
  <header id="burtizy" class="bur">
    <div class="title">
      <span class="mini">PRODUCT LIST</span>
      <span class="sala">Censura</span>
    </div>

    <h1 class="center-header">
      <span class="reload-text"><span class="cens">Censura</span></span>
    </h1>

    <div class="center-header1">
      <h1>
        <span class="reload-text">
          <span><img class="hihi" src="New_Project__9_-removebg.png" alt=""></span>
        </span>
      </h1>
    </div>

    <div class="icon-container">
      <div class="icon-cart">
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"/>
        </svg>
        <span>0</span>
      </div>
    </div>
  </header>

  <!-- Search Container -->
  <div id="sec" class="search-container">
    <div class="search-bar">
      <input type="text" placeholder="Search pieces..." id="searchInput">
      <button id="searchButton">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000" class="bi bi-search" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.415l-3.85-3.85zm-5.242.656a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
        </svg>
      </button>
    </div>
    <div class="filter-chips">
      <span value="shirts">Shirts</span>
      <span value="pants">Pants</span>
      <span value="shorts">Shorts</span>
      <span value="caps">Caps</span>
    </div>
  </div>

  <!-- Sections -->
  <div class="sections">
    <!-- Sections and items will be injected here -->
  </div>

  <!-- Form Modal -->
  <div id="formModal" class="form-modal" style="display: none;">
    <div class="form-modal-content">
      <span class="close-form">&times;</span>
      <h2>Your Details</h2>
      <p class="form-subtitle">Complete your order below</p>
      <form id="checkoutForm">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input type="text" id="name" maxlength="50" placeholder="John Doe" required>
        </div>
        <div class="form-group">
          <label for="email">Email Address</label>
          <input type="email" id="email" maxlength="50" placeholder="you@email.com" required>
        </div>
        <div class="form-group">
          <label for="phone">Phone Number</label>
          <div class="phone-row">
            <select id="countryCode" required>
              <option value="">Country</option>
            </select>
            <input type="tel" id="phone" maxlength="15" placeholder="Number" required>
          </div>
        </div>
        <div class="form-group">
          <label for="pickup">Pickup Location</label>
          <input type="text" placeholder="Enter pickup address" id="pickup" maxlength="150" required>
        </div>
        <button type="submit" class="submit-btn">
          <span>Continue to Payment</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </form>
    </div>
  </div>

  <!-- Shopping Cart Tab -->
  <div class="cartTab">
    <div class="cart-header">
      <h1>Shopping Cart</h1>
      <div class="cart-count-label"><span id="cartItemCount">0</span> items</div>
    </div>
    <div class="listCart">
      <!-- Cart items dynamically populated -->
    </div>
    <div class="btn">
      <button class="close">CLOSE</button>
      <button class="checkOut" disabled>CHECK OUT</button>
    </div>
  </div>

  <!-- Cart Overlay -->
  <div class="cart-overlay"></div>

  <!-- Checkout Container -->
  <div class="overlay">
    <div class="checkout">
      <div class="checkout-header">
        <h2>Order Summary</h2>
        <button class="close-checkout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20"><path d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="checkout-list"></div>
      <div class="total-price"></div>
      <button id="showFormModal">
        <span>Fill in your details</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>

      <!-- Paystack Modal -->
      <div id="paystackModal" class="modal" style="display: none;">
        <div class="modal-content">
          <span class="close-paystack-modal">&times;</span>
          <h2>Proceed to Payment</h2>
          <div class="paystack-button-container"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Toast Notification -->
  <div class="toast" id="toast">
    <div class="toast-icon">✓</div>
    <div class="toast-msg"></div>
  </div>

  <!-- Footer -->
  <footer class="custom-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <img src="New_Project__9_-removebg.png" alt="Censura" />
        <span class="footer-brand-name">Censura</span>
        <p class="footer-tagline">Wear the statement.</p>
      </div>
      <div class="footer-links">
        <div>
          <h2>Resources</h2>
          <ul>
            <li><a href="https://flowbite.com/" target="_blank">Flowbite</a></li>
            <li><a href="https://tailwindcss.com/" target="_blank">Tailwind CSS</a></li>
          </ul>
        </div>
        <div>
          <h2>Follow us</h2>
          <ul>
            <li><a href="https://instagram.com/" target="_blank">Instagram</a></li>
            <li><a href="https://tiktok.com/" target="_blank">TikTok</a></li>
          </ul>
        </div>
        <div>
          <h2>Legal</h2>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms &amp; Conditions</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2025 Censura™. All Rights Reserved.</span>
      <div class="footer-socials">
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          <svg class="insta" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
          </svg>
        </a>
        <a href="https://x.com" target="_blank" rel="noopener noreferrer">
          <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24">
            <path d="M17.688 3H21l-7.688 8.844L22 21h-7l-4.844-5.344L5.312 21H2l8.156-9.406L2 3h7l4.219 4.656L17.688 3z"/>
          </svg>
        </a>
        <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">
          <svg class="skolo" xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24">
            <path d="M8 0a8 8 0 0 0-2.915 15.452c-.07-.633-.134-1.606.027-2.297.146-.625.938-3.977.938-3.977s-.239-.479-.239-1.187c0-1.113.645-1.943 1.448-1.943.682 0 1.012.512 1.012 1.127 0 .686-.437 1.712-.663 2.663-.188.796.4 1.446 1.185 1.446 1.422 0 2.515-1.5 2.515-3.664 0-1.915-1.377-3.254-3.342-3.254-2.276 0-3.612 1.707-3.612 3.471 0 .688.265 1.425.595 1.826a.24.24 0 0 1 .056.23c-.061.252-.196.796-.222.907-.035.146-.116.177-.268.107-1-.465-1.624-1.926-1.624-3.1 0-2.523 1.834-4.84 5.286-4.84 2.775 0 4.932 1.977 4.932 4.62 0 2.757-1.739 4.976-4.151 4.976-.811 0-1.573-.421-1.834-.919l-.498 1.902c-.181.695-.669 1.566-.995 2.097A8 8 0 1 0 8 0"/>
          </svg>
        </a>
      </div>
    </div>
  </footer>

  <script type="module" src="homi.js"></script>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
  <script>
    emailjs.init('OGJL_7MdLJz6Vjdof');
  </script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/intlTelInput.min.js"></script>
  <script>
    document.addEventListener('wheel', function (e) {
      if (e.ctrlKey) e.preventDefault();
    }, { passive: false });
    document.addEventListener('gesturestart', function (e) {
      e.preventDefault();
    });
  </script>

<!-- Replace the LAST <script> block in index.html with this -->
<!-- 
  Replace the mousemove handler in your last <script> block with this.
  elementFromPoint is removed — mix-blend-mode handles color inversion in CSS.
  The on-dark class toggle is also removed (no longer needed).
-->
<script>
  // ── Header scroll ────────────────────────────────────────────────
  window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    const landing = document.getElementById("landingSection");
    if (window.scrollY >= landing.offsetHeight) {
      header.classList.add("fixed-header");
    } else {
      header.classList.remove("fixed-header");
    }
  }, { passive: true });

  // ── Search toggle ────────────────────────────────────────────────
  const searchContainer = document.querySelector(".search-container");
  const searchButton = document.getElementById("searchButton");
  searchButton.addEventListener("click", () => {
    searchContainer.classList.toggle("active");
  });

  // ── Custom cursor ────────────────────────────────────────────────
  // mix-blend-mode: difference in CSS handles color inversion automatically.
  // No elementFromPoint needed — zero lag, works on any background.
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  }, { passive: true });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .item, .icon-cart, .qty-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('hovered');
      dot.classList.add('hovered');
    }, { passive: true });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('hovered');
      dot.classList.remove('hovered');
    }, { passive: true });
  });

  // ── Scroll-reveal ────────────────────────────────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('revealed');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  function observeElements() {
    document.querySelectorAll('.item, .section-title, .section-line').forEach(el => {
      el.classList.add('reveal-target');
      observer.observe(el);
    });
  }

  const sectionsEl = document.querySelector('.sections');
  const mutationObserver = new MutationObserver(() => observeElements());
  mutationObserver.observe(sectionsEl, { childList: true, subtree: true });

  // ── Prevent pinch-zoom ───────────────────────────────────────────
  document.addEventListener('wheel', (e) => {
    if (e.ctrlKey) e.preventDefault();
  }, { passive: false });
  document.addEventListener('gesturestart', (e) => {
    e.preventDefault();
  }, { passive: false });
</script>
</body>
</html>




