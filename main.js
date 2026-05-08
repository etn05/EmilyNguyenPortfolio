/**
 * Emily Nguyen portfolio — GSAP scroll + micro-interactions
 * Requires GSAP + ScrollTrigger (loaded before this file).
 */
(function () {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion || typeof gsap === "undefined") {
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.style.opacity = "";
      el.style.transform = "";
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const easeOut = "power3.out";

  gsap.utils.toArray("[data-reveal]").forEach(function (el, i) {
    const delay = Number(el.dataset.revealDelay) || i * 0.06;
    gsap.fromTo(
      el,
      {
        opacity: 0,
        y: el.dataset.revealAxis === "x" ? 0 : 32,
        x: el.dataset.revealAxis === "x" ? 24 : 0,
      },
      {
        opacity: 1,
        y: 0,
        x: 0,
        duration: 0.95,
        delay: delay,
        ease: easeOut,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      }
    );
  });

  gsap.from(".hero-title-motion", {
    opacity: 0,
    x: -22,
    duration: 1.05,
    ease: easeOut,
    delay: 0.05,
  });

  gsap.from(".hero-embed-shell", {
    opacity: 0,
    scale: 0.96,
    y: 20,
    duration: 1.1,
    ease: "power2.out",
    delay: 0.2,
  });

  const footerGrain = document.querySelector(".grain-text");
  if (footerGrain) {
    gsap.fromTo(
      footerGrain,
      { opacity: 0.85, letterSpacing: "0px" },
      {
        opacity: 1,
        letterSpacing: "-0.06em",
        scrollTrigger: {
          trigger: ".site-footer",
          start: "top 80%",
          end: "bottom bottom",
          scrub: true,
        },
      }
    );
  }
})();

(function () {
  const filterChips = document.querySelectorAll(".filter-chip");
  const cards = document.querySelectorAll("[data-category]");

  function applyProjectFilter(tag) {
    filterChips.forEach(function (c) {
      c.classList.toggle("is-active", (c.dataset.filter || "all") === tag);
    });
    cards.forEach(function (card) {
      const cats = (card.dataset.category || "").split(/\s+/);
      const show = tag === "all" || cats.includes(tag);
      card.classList.toggle("is-hidden", !show);
    });
  }

  filterChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      applyProjectFilter(chip.dataset.filter || "all");
    });
  });

  const activeChip = document.querySelector(".filter-chip.is-active");
  if (activeChip) {
    applyProjectFilter(activeChip.dataset.filter || "all");
  }

  const aboutSection = document.getElementById("about-teaser");
  const wrap3d = document.getElementById("about-links-3d");
  const spin = document.querySelector("[data-about-spin]");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (wrap3d && spin) {
    if (prefersReducedMotion) {
      wrap3d.classList.add("is-reduced");
    } else {
      let angle = 0;
      let lastT = performance.now();
      const AUTO_DPS = 22;
      let scrollBoost = 0;

      function tick(now) {
        const dt = Math.min(0.05, (now - lastT) / 1000);
        lastT = now;
        scrollBoost *= Math.exp(-dt * 2.2);
        const hoveringLink = !!wrap3d.querySelector(".about-link-node:hover");
        const focusingLink = !!wrap3d.querySelector(
          ".about-link-node:focus-visible"
        );
        const pause = hoveringLink || focusingLink;
        wrap3d.classList.toggle("is-hover-paused", pause);
        const speed = pause ? 0 : AUTO_DPS + scrollBoost;
        angle += speed * dt;
        spin.style.transform = "rotateY(" + angle + "deg)";
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);

      if (aboutSection) {
        aboutSection.addEventListener(
          "wheel",
          function (e) {
            scrollBoost += e.deltaY * 0.045;
          },
          { passive: true }
        );
      }
    }
  }
})();

(function () {
  const lightboxEl = document.getElementById("gallery-lightbox");
  if (!lightboxEl) return;

  const lightboxImg = lightboxEl.querySelector(".lightbox__img");
  const btnPrev = lightboxEl.querySelector("[data-lightbox-prev]");
  const btnNext = lightboxEl.querySelector("[data-lightbox-next]");
  const closeTargets = lightboxEl.querySelectorAll("[data-lightbox-close]");

  if (!lightboxImg || !btnPrev || !btnNext) return;

  const APHEX_PAGES = [
    "images/gallery/aphex_menu/1.png",
    "images/gallery/aphex_menu/2.png",
    "images/gallery/aphex_menu/3.png",
    "images/gallery/aphex_menu/4.png",
  ];

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const state = {
    srcs: null,
    index: 0,
    lastFocus: null,
    altSingle: "",
  };

  function renderLightbox() {
    if (!state.srcs || !state.srcs.length) return;
    const multi = state.srcs.length > 1;
    btnPrev.hidden = !multi;
    btnNext.hidden = !multi;
    lightboxImg.src = state.srcs[state.index];
    if (multi) {
      lightboxImg.alt =
        "Aphex menu, page " +
        (state.index + 1) +
        " of " +
        state.srcs.length +
        ".";
    } else {
      lightboxImg.alt = state.altSingle || "";
    }
  }

  function openLightbox(opts) {
    state.lastFocus = document.activeElement;
    state.srcs = opts.srcs;
    state.index = Math.max(
      0,
      Math.min(opts.index || 0, state.srcs.length - 1)
    );
    state.altSingle =
      state.srcs.length > 1 ? "" : opts.altSingle || "";
    lightboxEl.classList.add("is-open");
    lightboxEl.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    renderLightbox();
    const closer = lightboxEl.querySelector(".lightbox__close");
    if (closer) closer.focus();
  }

  function closeLightbox() {
    lightboxEl.classList.remove("is-open");
    lightboxEl.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    state.srcs = null;
    lightboxImg.removeAttribute("src");
    if (state.lastFocus && typeof state.lastFocus.focus === "function") {
      state.lastFocus.focus();
    }
  }

  function stepLightbox(delta) {
    if (!state.srcs || state.srcs.length < 2) return;
    state.index =
      (state.index + delta + state.srcs.length) % state.srcs.length;
    renderLightbox();
  }

  closeTargets.forEach(function (el) {
    el.addEventListener("click", function () {
      closeLightbox();
    });
  });

  btnPrev.addEventListener("click", function (e) {
    e.stopPropagation();
    stepLightbox(-1);
  });
  btnNext.addEventListener("click", function (e) {
    e.stopPropagation();
    stepLightbox(1);
  });

  document.addEventListener("keydown", function (e) {
    if (!lightboxEl.classList.contains("is-open")) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeLightbox();
      return;
    }
    if (state.srcs && state.srcs.length > 1) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepLightbox(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        stepLightbox(1);
      }
    }
  });

  document.querySelectorAll(".gallery-tile[data-lightbox-src]").forEach(
    function (tile) {
      tile.addEventListener("click", function () {
        const src = tile.getAttribute("data-lightbox-src");
        if (!src) return;
        const img = tile.querySelector("img");
        const altSingle = img ? img.getAttribute("alt") || "" : "";
        openLightbox({
          srcs: [src],
          index: 0,
          altSingle: altSingle,
        });
      });
    }
  );

  const book = document.querySelector("[data-gallery-book]");
  if (book) {
    const previewImg = book.querySelector(".gallery-book__page");
    const openBtn = book.querySelector("[data-gallery-book-open]");
    const prevBtn = book.querySelector("[data-gallery-book-prev]");
    const nextBtn = book.querySelector("[data-gallery-book-next]");

    if (previewImg && openBtn && prevBtn && nextBtn) {
      let previewIndex = 0;

      function renderPreview() {
        previewImg.src = APHEX_PAGES[previewIndex];
        previewImg.alt =
          "Aphex menu, page " +
          (previewIndex + 1) +
          " of " +
          APHEX_PAGES.length +
          ".";
      }

      function stepPreview(delta, e) {
        if (e) e.stopPropagation();
        previewIndex =
          (previewIndex + delta + APHEX_PAGES.length) % APHEX_PAGES.length;
        if (reduceMotion) {
          renderPreview();
          return;
        }
        previewImg.style.opacity = "0.4";
        window.setTimeout(function () {
          renderPreview();
          previewImg.style.opacity = "1";
        }, 90);
      }

      prevBtn.addEventListener("click", function (e) {
        stepPreview(-1, e);
      });
      nextBtn.addEventListener("click", function (e) {
        stepPreview(1, e);
      });

      openBtn.addEventListener("click", function () {
        openLightbox({
          srcs: APHEX_PAGES.slice(),
          index: previewIndex,
        });
      });

      APHEX_PAGES.forEach(function (src) {
        const pre = new Image();
        pre.src = src;
      });
    }
  }
})();
