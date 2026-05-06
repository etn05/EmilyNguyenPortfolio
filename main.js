(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* —— Scroll reveal —— */
  const revealEls = document.querySelectorAll("[data-reveal]");

  revealEls.forEach(function (el) {
    const delay = el.getAttribute("data-reveal-delay");
    if (delay != null) {
      el.style.setProperty("--reveal-delay", delay + "ms");
    }
  });

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* —— Header scroll state —— */
  const header = document.querySelector(".site-header");
  let lastY = window.scrollY;

  function onScrollHeader() {
    const y = window.scrollY;
    if (!header) return;
    header.classList.toggle("is-scrolled", y > 24);
    lastY = y;
  }

  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* —— Hero parallax —— */
  const parallaxEl = document.querySelector("[data-parallax]");
  const parallaxStrength = parallaxEl
    ? parseFloat(parallaxEl.getAttribute("data-parallax") || "0.1")
    : 0;

  if (!prefersReducedMotion && parallaxEl && parallaxStrength) {
    window.addEventListener(
      "scroll",
      function () {
        const y = window.scrollY;
        const offset = y * parallaxStrength;
        parallaxEl.style.transform = "translateY(" + offset + "px)";
      },
      { passive: true }
    );
  }

  /* —— Mobile nav —— */
  const toggle = document.querySelector(".nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  if (toggle && mobileNav) {
    function setMenuOpen(nextOpen) {
      toggle.setAttribute("aria-expanded", String(nextOpen));
      toggle.setAttribute("aria-label", nextOpen ? "Close menu" : "Open menu");
      mobileNav.classList.toggle("is-open", nextOpen);
      mobileNav.setAttribute("aria-hidden", String(!nextOpen));
      if (nextOpen) {
        mobileNav.removeAttribute("inert");
      } else {
        mobileNav.setAttribute("inert", "");
      }
      document.body.style.overflow = nextOpen ? "hidden" : "";
    }

    toggle.addEventListener("click", function () {
      const open = toggle.getAttribute("aria-expanded") === "true";
      setMenuOpen(!open);
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenuOpen(false);
      });
    });
  }

  /* —— Copy email —— */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    const text = btn.getAttribute("data-copy");
    const label = btn.querySelector(".copy-btn__label");
    const done = btn.querySelector(".copy-btn__done");

    btn.addEventListener("click", async function () {
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        btn.classList.add("is-copied");
        if (label) label.hidden = true;
        if (done) done.hidden = false;
        window.setTimeout(function () {
          btn.classList.remove("is-copied");
          if (label) label.hidden = false;
          if (done) done.hidden = true;
        }, 2000);
      } catch {
        if (label) label.textContent = "Copy failed";
        window.setTimeout(function () {
          if (label) label.textContent = "Copy";
        }, 2000);
      }
    });
  });

  /* —— Section scroll progress (subtle background shift) —— */
  if (!prefersReducedMotion) {
    const root = document.documentElement;
    window.addEventListener(
      "scroll",
      function () {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        root.style.setProperty("--scroll-p", String(p));
      },
      { passive: true }
    );
  }
})();
