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
  /* Lower % = higher on screen = reveals sooner (88% was too far down the viewport) */
  const revealStart = "top 72%";
  const revealStartEarly = "top 78%";

  function initHeroLoad() {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    const embed = hero.querySelector(".hero-embed-shell");
    const gif = hero.querySelector(".hero-gif-shell");
    const aside = hero.querySelector(".hero-meta__aside");
    const intro = hero.querySelector(".hero-meta__intro");

    const targets = [embed, gif, aside, intro].filter(Boolean);
    gsap.set(targets, { opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: easeOut } });

    if (embed) {
      gsap.set(embed, { scale: 0.98, y: 28 });
      tl.to(
        embed,
        { opacity: 1, scale: 1, y: 0, duration: 1.15, ease: "power2.out" },
        0.1
      );
    }

    if (gif) {
      gsap.set(gif, { y: 24 });
      tl.to(gif, { opacity: 1, y: 0, duration: 1.05 }, 0.26);
    }

    if (aside) {
      gsap.set(aside, { y: 28 });
      tl.to(aside, { opacity: 1, y: 0, duration: 0.95 }, 0.38);
    }

    if (intro) {
      gsap.set(intro, { y: 28 });
      tl.to(intro, { opacity: 1, y: 0, duration: 0.95 }, 0.5);
    }
  }

  initHeroLoad();

  gsap.utils.toArray("[data-reveal]").forEach(function (el, i) {
    if (el.closest(".hero")) return;

    const delay =
      el.dataset.revealDelay !== undefined
        ? Number(el.dataset.revealDelay)
        : Math.min(i * 0.04, 0.28);
    const start = el.dataset.revealStart || revealStart;
    gsap.fromTo(
      el,
      {
        opacity: 0,
        y: el.dataset.revealAxis === "x" ? 0 : 28,
        x: el.dataset.revealAxis === "x" ? 20 : 0,
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
          start: start,
          toggleActions: "play none none none",
          once: true,
        },
      }
    );
  });

  const footerDisplay = document.querySelector(".footer-display__text");
  if (footerDisplay) {
    gsap.from(footerDisplay, {
      opacity: 0,
      y: 18,
      duration: 1,
      ease: easeOut,
      scrollTrigger: {
        trigger: ".site-footer",
        start: revealStartEarly,
        toggleActions: "play none none none",
        once: true,
      },
    });
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
})();

(function () {
  const lightboxEl = document.getElementById("gallery-lightbox");
  if (!lightboxEl) return;

  const lightboxImg = lightboxEl.querySelector(".lightbox__img");
  const lightboxCaption = lightboxEl.querySelector(".lightbox__caption");
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

  const APHEX_CAPTIONS = [
    "“Menu” of Aphex Twin songs. 2025.",
    "",
    "",
    "",
  ];

  const GALLERY_CAPTION_HTML = {
    // "images/gallery/etn.gif":
    //   "Stills from a montage film. Still and Moving Images, 2025.",
    "images/gallery/peyton.jpeg":
      "Stills from a montage film. Still and Moving Images NYU. 2025.",
    "images/gallery/audion poster.png":
      'Poster for the conceptual brand Audion. <a href="https://www.are.na/block/44726318" target="_blank" rel="noopener noreferrer">View brand guidelines</a>. 2026.',
    "images/gallery/deathofdesign.jpg":
      'Poster for an essay on AI’s impact on design. <a href="https://medium.com/@emilytnguyen/what-ai-has-really-taken-from-design-rip-internet-slop-73c758ea6c2a" target="_blank" rel="noopener noreferrer">Read on Medium</a>. 2026.',
  };

  function captionForSrc(src) {
    return GALLERY_CAPTION_HTML[src] || "";
  }

  function captionsForSrcs(srcs) {
    return srcs.map(function (src) {
      return captionForSrc(src);
    });
  }

  function updateLightboxCaption() {
    if (!lightboxCaption) return;
    const html =
      state.captions && state.captions.length
        ? state.captions[state.index] || ""
        : "";
    if (html) {
      lightboxCaption.innerHTML = html;
      lightboxCaption.hidden = false;
    } else {
      lightboxCaption.innerHTML = "";
      lightboxCaption.hidden = true;
    }
  }

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const state = {
    srcs: null,
    index: 0,
    lastFocus: null,
    altSingle: "",
    captions: null,
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
    updateLightboxCaption();
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
    state.captions = opts.captions || captionsForSrcs(opts.srcs);
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
    state.captions = null;
    lightboxImg.removeAttribute("src");
    if (lightboxCaption) {
      lightboxCaption.innerHTML = "";
      lightboxCaption.hidden = true;
    }
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
        const captionAttr = tile.getAttribute("data-lightbox-caption");
        openLightbox({
          srcs: [src],
          index: 0,
          altSingle: altSingle,
          captions: [
            captionAttr !== null ? captionAttr : captionForSrc(src),
          ],
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
          captions: APHEX_CAPTIONS.slice(),
        });
      });

      APHEX_PAGES.forEach(function (src) {
        const pre = new Image();
        pre.src = src;
      });
    }
  }
})();

(function () {
  function initCustomCursor() {
    const cursor = document.querySelector(".cursor");
    if (!cursor) return;

    const canUseCustomCursor = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    if (!canUseCustomCursor) return;

    document.documentElement.classList.add("custom-cursor-enabled");
    document.body.appendChild(cursor);

    let x = -100;
    let y = -100;
    let rafId = null;

    function paintCursor() {
      rafId = null;
      cursor.style.transform =
        "translate3d(" + x + "px, " + y + "px, 0) translate(-50%, -50%)";
    }

    function setCursorPressed(pressed) {
      cursor.classList.toggle("is-pressing", pressed);
    }

    function onPointerDown(e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      setCursorPressed(true);
    }

    function onPointerUp(e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      setCursorPressed(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("blur", function () {
      setCursorPressed(false);
    });

    function scheduleCursorPaint() {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(paintCursor);
    }

    document.addEventListener(
      "pointermove",
      function (e) {
        if (e.pointerType && e.pointerType !== "mouse") return;
        x = e.clientX;
        y = e.clientY;
        scheduleCursorPaint();
      },
      { passive: true }
    );

    document.querySelectorAll("iframe").forEach(function (frame) {
      frame.addEventListener("mouseenter", function () {
        cursor.classList.add("is-over-iframe");
      });
      frame.addEventListener("mouseleave", function () {
        cursor.classList.remove("is-over-iframe");
      });
    });

    const cursorText = document.querySelector(".cursor-text");

    document.querySelectorAll(".email-link").forEach(function (emailLink) {
      emailLink.addEventListener("mouseenter", function () {
        cursor.classList.remove("cursor--large");
        cursor.classList.add("email-mode");

        window.setTimeout(function () {
          if (cursorText) {
            cursorText.textContent = "Email me!";
            cursorText.classList.add("show");
          }
        }, 180);
      });

      emailLink.addEventListener("mouseleave", function () {
        if (cursorText) {
          cursorText.classList.remove("show");
          window.setTimeout(function () {
            cursorText.textContent = "";
          }, 150);
        }
        cursor.classList.remove("email-mode");
      });
    });

    const growTargets = document.querySelectorAll(
      "a:not(.email-link), button, .btn, .project-card, .gallery-tile, .filter-chip, .btn-quiet"
    );

    growTargets.forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        cursor.classList.add("cursor--large");
      });
      el.addEventListener("mouseleave", function () {
        cursor.classList.remove("cursor--large");
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCustomCursor);
  } else {
    initCustomCursor();
  }
})();

(function () {
  function fitFooterWordmark() {
    const container = document.querySelector(".footer-display");
    const text = document.querySelector(".footer-display__text");
    if (!container || !text) return;

    const fitPad = 14;
    const maxWidth = Math.max(0, container.clientWidth - fitPad * 2);
    if (!maxWidth) return;

    let lo = 8;
    let hi = 1200;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      text.style.fontSize = mid + "px";
      const textWidth = text.getBoundingClientRect().width;
      if (textWidth > maxWidth) hi = mid - 1;
      else lo = mid;
    }

    text.style.fontSize = lo + "px";
  }

  function initFooterWordmarkFit() {
    fitFooterWordmark();

    const container = document.querySelector(".footer-display");
    if (container && typeof ResizeObserver !== "undefined") {
      new ResizeObserver(fitFooterWordmark).observe(container);
    } else {
      window.addEventListener("resize", fitFooterWordmark);
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fitFooterWordmark);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFooterWordmarkFit);
  } else {
    initFooterWordmarkFit();
  }
})();
