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

  const filterChips = document.querySelectorAll(".filter-chip");
  const cards = document.querySelectorAll("[data-category]");

  filterChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      const tag = chip.dataset.filter || "all";
      filterChips.forEach(function (c) {
        c.classList.toggle("is-active", c === chip);
      });

      cards.forEach(function (card) {
        const cats = (card.dataset.category || "").split(/\s+/);
        const show = tag === "all" || cats.includes(tag);
        card.classList.toggle("is-hidden", !show);
      });
    });
  });
})();
