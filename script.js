(function () {
  "use strict";

  /* Mark that JS is alive (enables hide-until-reveal only when JS works) */
  document.documentElement.classList.add("js-ready");

  /* One place to update your real Amazon storefront / ASIN URL */
  const AMAZON_URL = "https://www.amazon.com";
  document.querySelectorAll(".js-amazon").forEach((el) => {
    el.setAttribute("href", AMAZON_URL);
    if (el.tagName === "A") {
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    }
  });

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* i18n — safe if i18n.js failed to load */
  const i18n = window.VeloraI18n;
  if (i18n && typeof i18n.setLang === "function") {
    try {
      i18n.setLang(i18n.getLang());
    } catch (err) {
      console.warn("Velora i18n error:", err);
    }

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        i18n.setLang(btn.getAttribute("data-lang"));
      });
    });
  }

  /* Header */
  const header = document.querySelector(".header");
  const burger = document.querySelector(".burger");
  const nav = document.getElementById("nav");

  window.addEventListener(
    "scroll",
    () => {
      header?.classList.toggle("scrolled", window.scrollY > 10);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      const bar = document.querySelector(".progress-bar");
      if (bar) bar.style.width = `${pct}%`;
    },
    { passive: true }
  );

  burger?.addEventListener("click", () => {
    const open = nav?.classList.toggle("open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });

  nav?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      burger?.setAttribute("aria-expanded", "false");
    });
  });

  /* Cursor glow */
  const glow = document.querySelector(".cursor-glow");
  if (glow && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener(
      "pointermove",
      (e) => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      },
      { passive: true }
    );
  }

  /* Reveal on scroll — show everything above fold immediately */
  const revealEls = document.querySelectorAll(".reveal");

  const showReveal = (el) => {
    const delay = Number(el.getAttribute("data-delay") || 0);
    setTimeout(() => el.classList.add("in"), delay);
  };

  /* Always show first hero blocks right away */
  document.querySelectorAll(".hero .reveal").forEach(showReveal);

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          showReveal(entry.target);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" }
    );
    revealEls.forEach((el) => {
      if (!el.closest(".hero")) io.observe(el);
    });
  } else {
    /* Fallback: show all */
    revealEls.forEach(showReveal);
  }

  /* Safety net: if still hidden after 1.5s, force visible */
  setTimeout(() => {
    document.querySelectorAll(".reveal:not(.in)").forEach((el) => el.classList.add("in"));
  }, 1500);

  /* Count-up stats */
  if ("IntersectionObserver" in window) {
    const statsIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const strong = entry.target;
          const target = Number(strong.getAttribute("data-count") || 0);
          const suffix = strong.getAttribute("data-suffix") || "";
          const isFloat = String(target).includes(".") || target % 1 !== 0;
          const duration = 1200;
          const start = performance.now();
          const locale = document.documentElement.lang === "es" ? "es-ES" : "en-US";

          const tick = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            const value = target * eased;
            strong.textContent = isFloat
              ? value.toFixed(1) + suffix
              : Math.round(value).toLocaleString(locale) + suffix;
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          statsIo.unobserve(strong);
        });
      },
      { threshold: 0.4 }
    );
    document.querySelectorAll("[data-count]").forEach((el) => statsIo.observe(el));
  }

  /* Quick view modal */
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");
  const modalTitle = document.getElementById("modal-title");

  const openModal = (product, imgSrc) => {
    if (!modal) return;
    modalImg.src = imgSrc;
    modalImg.alt = product;
    modalTitle.textContent = product;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".quick").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const card = btn.closest(".product");
      const img = card?.querySelector("img");
      const name = btn.getAttribute("data-product") || "Product";
      openModal(name, img?.src || "");
    });
  });

  modal?.querySelectorAll("[data-close]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  /* Sticky mobile CTA after scrolling past hero */
  const sticky = document.getElementById("sticky-cta");
  if (sticky) {
    const showSticky = () => {
      const y = window.scrollY || 0;
      const show = y > 420;
      sticky.classList.toggle("is-visible", show);
      sticky.hidden = !show;
      document.body.classList.toggle("has-sticky", show);
    };
    sticky.hidden = true;
    window.addEventListener("scroll", showSticky, { passive: true });
    showSticky();
  }

  /* FAQ: only one open at a time (cleaner on mobile) */
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });
})();
