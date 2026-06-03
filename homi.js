import { db } from './firebase-config.js';
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

  /* ─────────────────────────────────────────
     ZOOM BLOCK
  ───────────────────────────────────────── */
  document.addEventListener('wheel', e => {
    if (e.ctrlKey) e.preventDefault();
  }, { passive: false });

  document.addEventListener('gesturestart', e => e.preventDefault());

  /* ─────────────────────────────────────────
     HAMBURGER MENU
  ───────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });

    document.querySelectorAll('.mob-link').forEach(l =>
      l.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      })
    );
  }

  /* ─────────────────────────────────────────
     SCROLL REVEAL
  ───────────────────────────────────────── */
  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

  /* ─────────────────────────────────────────
     CHAR COUNTER
  ───────────────────────────────────────── */
  const messageEl = document.getElementById('message');
  const charCountEl = document.getElementById('charCount');

  if (messageEl && charCountEl) {
    messageEl.addEventListener('input', () => {
      charCountEl.textContent = `${messageEl.value.length} / 500`;
    });
  }

  /* ─────────────────────────────────────────
     CONTACT SCROLL BUTTON
  ───────────────────────────────────────── */
  const contactScrollBtn = document.getElementById('contactScrollBtn');

  if (contactScrollBtn) {
    contactScrollBtn.addEventListener('click', () => {
      document.getElementById('mimi')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ─────────────────────────────────────────
     PROJECT LINKS
  ───────────────────────────────────────── */
  const links = {
    kit: 'https://kit-tin.company/',
    pbye: 'https://piercingsbye.com/',
    commerce: 'https://damiaig.github.io/e-commerce/',
    estate: 'https://damiaig.github.io/Landing/',
    menu: 'https://damiaig.github.io/Menu/',
    landingg: 'https://damiaig.github.io/Landing2/',
    cafe: 'https://damiaig.github.io/Menu-Caf-/',
    restaurant: 'https://damiaig.github.io/Restaurant-menu/'
  };

  Object.entries(links).forEach(([id, url]) => {
    document.getElementById(id)?.addEventListener('click', () => {
      window.open(url, '_blank');
    });
  });

  /* ─────────────────────────────────────────
     VIDEO AUTOPLAY + MUTE CONTROL
  ───────────────────────────────────────── */
  const videoFrames = document.querySelectorAll('.video-frame');

  videoFrames.forEach(frame => {
    const video = frame.querySelector('.site-video');
    const muteBtn = frame.querySelector('.mute-btn-solo');

    if (!video) return;

    video.loop = true;
    video.muted = true;
    video.preload = 'metadata';

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      });
    }, { threshold: 0.25 });

    io.observe(frame);

    if (!muteBtn) return;

    muteBtn.addEventListener('click', () => {
      const isMuted = video.muted;

      if (isMuted) {
        video.muted = false;
        muteBtn.textContent = '🔊';

        videoFrames.forEach(other => {
          if (other === frame) return;
          const ov = other.querySelector('.site-video');
          const ob = other.querySelector('.mute-btn-solo');
          if (ov) ov.muted = true;
          if (ob) ob.textContent = '🔇';
        });
      } else {
        video.muted = true;
        muteBtn.textContent = '🔇';
      }
    });
  });

  /* ─────────────────────────────────────────
     SLIDER (FIXED + CLEAN)
  ───────────────────────────────────────── */
  const track = document.getElementById('sliderTrack');
  const stage = document.getElementById('sliderStage');
  const dotsWrap = document.getElementById('sliderDots');
  const thumbsWrap = document.getElementById('sliderThumbs');
  const counter = document.getElementById('sliderCounter');

  const btnPrev = document.getElementById('sliderPrev');
  const btnNext = document.getElementById('sliderNext');
  const btnPlay = document.getElementById('sliderPlayPause');

  if (!track || !stage) return;

  const slides = Array.from(track.querySelectorAll('.slide'));
  const total = slides.length;

  let current = 0;
  let isPlaying = true;
  let interval = null;

  const DURATION = 4000;

  slides[0].classList.add('active');

  /* ── DOTS ── */
  const dots = slides.map((_, i) => {
    const d = document.createElement('button');
    d.className = 'slider-dot' + (i === 0 ? ' active' : '');
    d.onclick = () => goTo(i);
    dotsWrap?.appendChild(d);
    return d;
  });

  /* ── THUMBS ── */
  const thumbs = slides.map((slide, i) => {
    const btn = document.createElement('button');
    btn.className = 'slider-thumb' + (i === 0 ? ' active' : '');

    const img = slide.querySelector('img');
    if (img) {
      const t = document.createElement('img');
      t.src = img.src;
      btn.appendChild(t);
    }

    btn.onclick = () => goTo(i);
    thumbsWrap?.appendChild(btn);
    return btn;
  });

  /* ── CORE SLIDE FUNCTION ── */
  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    thumbs[current].classList.remove('active');

    current = (index + total) % total;

    slides[current].classList.add('active');
    dots[current].classList.add('active');
    thumbs[current].classList.add('active');

    track.style.transform = `translateX(-${current * 100}%)`;
    counter.textContent = `${current + 1} / ${total}`;
  }

  /* ── AUTO ── */
  function start() {
    stop();
    interval = setInterval(() => goTo(current + 1), DURATION);
  }

  function stop() {
    clearInterval(interval);
  }

  /* ── PLAY/PAUSE ── */
  btnPlay?.addEventListener('click', () => {
    isPlaying = !isPlaying;
    if (isPlaying) start();
    else stop();
  });

  btnPrev?.addEventListener('click', () => goTo(current - 1));
  btnNext?.addEventListener('click', () => goTo(current + 1));

  /* ── INIT ── */
  goTo(0);
  start();

  /* ─────────────────────────────────────────
     FIREBASE FORM
  ───────────────────────────────────────── */
  const form = document.querySelector('.form-wrapper');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  function validate() {
    return (
      nameInput?.value.trim() &&
      emailInput?.value.includes('@') &&
      messageInput?.value.trim()
    );
  }

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validate()) return alert("Fill all fields correctly");

    try {
      await addDoc(collection(db, "messages"), {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim(),
        timestamp: serverTimestamp()
      });

      alert("Message sent!");
      form.reset();
    } catch (err) {
      console.error(err);
      alert("Failed to send");
    }
  });

});
