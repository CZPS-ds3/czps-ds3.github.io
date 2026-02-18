/* ============================================================
   LIM YI HENG — PORTFOLIO  main.js  v4  (fixed)
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {

  /* ── INJECT STATIC IMAGES ── */
  const imgs = {
    "profile-img":  "profile_pic",
    "cert-pcep":    "pcep",
    "cert-wde":     "wde",
    "cert-github":  "github_cert",
    "cert-ycep":    "ycep",
    "cert-ibm-web": "ibm_webdev",
    "cert-ibm-ux":  "ibm_ux",
    "vball-prize":  "vball_prize",
    "vball-s3":     "vball_s3",
    "vball-s4":     "vball_s4"
  };
  Object.entries(imgs).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el && IMAGES[key]) el.src = IMAGES[key];
  });

  /* ── VIDEOS (autoplay) ── */
  function setupVideo(id, filename) {
    const v = document.getElementById(id);
    if (!v) return;
    v.src = "pictures/" + filename;
    v.muted = true;
    v.autoplay = true;
    v.loop = true;
    v.playsInline = true;
    v.play().catch(() => {});
  }
  setupVideo("wdp-video",  "WDP admin dashboard recording.mp4");
  setupVideo("golf-video", "golf recording.mp4");
  setupVideo("pbi-video",  "Power BI singapore standard of living recording.mp4");

  /* ── PROJECT LIGHTBOX with auto-advancing carousel ── */
  const lbOverlay = document.getElementById("proj-lb");
  const lbImg     = document.getElementById("proj-lb-img");
  const lbClose   = document.getElementById("proj-lb-close");
  const lbPrev    = document.getElementById("proj-lb-prev");
  const lbNext    = document.getElementById("proj-lb-next");
  const lbCounter = document.getElementById("proj-lb-counter");
  const lbDotsEl  = document.getElementById("proj-lb-dots");

  let lbKeys = [], lbIdx = 0, lbTimer = null;

  function setLB(n) {
    lbIdx = (n + lbKeys.length) % lbKeys.length;
    if (lbImg) lbImg.src = IMAGES[lbKeys[lbIdx]] || "";
    if (lbCounter) lbCounter.textContent = (lbIdx + 1) + " / " + lbKeys.length;
    if (lbDotsEl) lbDotsEl.querySelectorAll(".lb-dot").forEach((d, i) => d.classList.toggle("active", i === lbIdx));
  }

  function startLBAuto() {
    clearInterval(lbTimer);
    if (lbKeys.length > 1) lbTimer = setInterval(() => setLB(lbIdx + 1), 3000);
  }

  function openProjLB(keys, startIdx) {
    lbKeys = keys;
    lbIdx = startIdx || 0;
    if (lbDotsEl) {
      lbDotsEl.innerHTML = "";
      keys.forEach((_, i) => {
        const d = document.createElement("div");
        d.className = "lb-dot" + (i === 0 ? " active" : "");
        d.addEventListener("click", () => { setLB(i); startLBAuto(); });
        lbDotsEl.appendChild(d);
      });
    }
    setLB(lbIdx);
    startLBAuto();
    lbOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeProjLB() {
    clearInterval(lbTimer);
    lbOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (lbClose)   lbClose.addEventListener("click", closeProjLB);
  if (lbPrev)    lbPrev.addEventListener("click",  () => { setLB(lbIdx - 1); startLBAuto(); });
  if (lbNext)    lbNext.addEventListener("click",  () => { setLB(lbIdx + 1); startLBAuto(); });
  if (lbOverlay) lbOverlay.addEventListener("click", e => { if (e.target === lbOverlay) closeProjLB(); });

  document.addEventListener("keydown", e => {
    if (!lbOverlay || !lbOverlay.classList.contains("open")) return;
    if (e.key === "ArrowRight") { setLB(lbIdx + 1); startLBAuto(); }
    if (e.key === "ArrowLeft")  { setLB(lbIdx - 1); startLBAuto(); }
    if (e.key === "Escape")     closeProjLB();
  });

  /* Attach click to each project card */
  const projectSets = {
    "wdp-card":  ["wdp1","wdp2","wdp3","wdp4","wdp5","wdp6","wdp7","wdp8","wdp9","wdp10","wdp11"],
    "golf-card": ["golf1","golf2","golf3","golf4","golf5","golf6","golf7","golf8","golf9"],
    "pbi-card":  ["pbi1","pbi2","pbi3","pbi4"]
  };
  Object.entries(projectSets).forEach(([cardId, keys]) => {
    const card = document.getElementById(cardId);
    if (card) {
      card.addEventListener("click", () => openProjLB(keys, 0));
    }
  });

  /* ── ACTIVITY PHOTO LIGHTBOX ── */
  const photoLB      = document.getElementById("photo-lb");
  const photoLBImg   = document.getElementById("photo-lb-img");
  const photoLBClose = document.getElementById("photo-lb-close");

  document.querySelectorAll(".act-photos img").forEach(img => {
    img.addEventListener("click", () => {
      if (photoLBImg) photoLBImg.src = img.src;
      if (photoLB)    photoLB.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });
  function closePhotoLB() {
    if (photoLB) photoLB.classList.remove("open");
    document.body.style.overflow = "";
  }
  if (photoLBClose) photoLBClose.addEventListener("click", closePhotoLB);
  if (photoLB)      photoLB.addEventListener("click", e => { if (e.target === photoLB) closePhotoLB(); });

  /* ── SCROLL REVEAL ── */
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); }
    });
  }, { threshold: 0.06 });
  document.querySelectorAll(".skill-card,.exp-card,.act-card,.project-card,.cert-card,.iitem").forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = (i % 6 * 0.05) + "s";
    ro.observe(el);
  });

  /* ── NAVBAR ── */
  const nav = document.querySelector("nav");
  window.addEventListener("scroll", () => {
    if (nav) nav.classList.toggle("scrolled", scrollY > 50);
  }, { passive: true });

  const secs  = document.querySelectorAll("section[id]");
  const navAs = document.querySelectorAll(".nav-links a");
  const no = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navAs.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
      }
    });
  }, { threshold: 0.35 });
  secs.forEach(s => no.observe(s));

  /* ── TYPING TAGLINE ── */
  const tel = document.getElementById("tagline");
  if (tel) {
    const phrases = [
      "NYP Diploma in Information Technology",
      "Front-End Development enthusiast",
      "Volleyball Vice-Captain \uD83C\uDFD0",
      "Golfer & gym-goer \u26F3 \uD83C\uDFCB\uFE0F",
      "Always ready for a challenge \uD83D\uDD25"
    ];
    let pi = 0, ci = 0, del = false;
    function type() {
      const p = phrases[pi];
      if (!del) {
        tel.textContent = p.slice(0, ++ci);
        if (ci === p.length) { del = true; setTimeout(type, 1800); return; }
      } else {
        tel.textContent = p.slice(0, --ci);
        if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
      }
      setTimeout(type, del ? 38 : 62);
    }
    type();
  }

});
