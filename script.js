/*
  Mohit Yadav — Portfolio scripts
  - Theme toggle (persisted)
  - Mobile nav toggle
  - IntersectionObserver reveals + skillbar animation
  - Typed hero text
  - Hero canvas particles (subtle, lightweight)
  - Mailto form (works on GitHub Pages)
*/

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Footer year
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Theme toggle
  const themeToggle = $(".theme-toggle");
  const setTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  };

  const getTheme = () =>
    document.documentElement.dataset.theme ||
    localStorage.getItem("theme") ||
    "dark";

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = getTheme();
      setTheme(current === "dark" ? "light" : "dark");
      // Repaint canvas subtly for new colors
      window.dispatchEvent(new Event("themechange"));
    });
  }

  // Mobile nav
  const navToggle = $(".nav-toggle");
  const navLinks = $("#nav-links");
  const closeNav = () => {
    document.body.classList.remove("nav-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  };

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    $$("#nav-links a").forEach((a) => {
      a.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }

  // Intersection Observer reveals
  const revealEls = $$(".reveal");
  const barSpans = $$(".bar span");

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target;
          el.classList.add("is-visible");

          const delay = el.getAttribute("data-delay");
          if (delay) el.style.transitionDelay = `${Number(delay)}ms`;

          // Animate any skillbar span inside
          $$(`.bar span`, el).forEach((span) => {
            span.animate(
              [{ transform: "scaleX(0.35)" }, { transform: "scaleX(1)" }],
              {
                duration: 900,
                easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
                fill: "forwards",
              }
            );
          });

          io.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    revealEls.forEach((el) => io.observe(el));
  } else {
    // No observer or reduced motion: show everything.
    revealEls.forEach((el) => el.classList.add("is-visible"));
    barSpans.forEach((span) => {
      span.style.transform = "scaleX(1)";
    });
  }

  // Typed text in hero
  const typedEl = $("[data-typed]");
  if (typedEl) {
    const words = [
      "data models",
      "analytics pipelines",
      "decision-ready dashboards",
      "automated reporting",
      "experimentation insights",
    ];

    const typeSpeed = 26;
    const eraseSpeed = 18;
    const holdMs = 900;
    const betweenMs = 260;

    let wordIdx = 0;
    let charIdx = 0;
    let isErasing = false;
    let isPaused = false;

    const tick = () => {
      if (prefersReducedMotion) {
        typedEl.textContent = words[0];
        return;
      }
      if (isPaused) return;

      const word = words[wordIdx];
      if (!isErasing) {
        charIdx++;
        typedEl.textContent = word.slice(0, charIdx);
        if (charIdx >= word.length) {
          isPaused = true;
          window.setTimeout(() => {
            isPaused = false;
            isErasing = true;
          }, holdMs);
        }
        window.setTimeout(tick, typeSpeed);
      } else {
        charIdx--;
        typedEl.textContent = word.slice(0, Math.max(0, charIdx));
        if (charIdx <= 0) {
          isErasing = false;
          wordIdx = (wordIdx + 1) % words.length;
          isPaused = true;
          window.setTimeout(() => {
            isPaused = false;
          }, betweenMs);
        }
        window.setTimeout(tick, eraseSpeed);
      }
    };

    tick();
  }

  // Mailto form
  const form = $("#contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const fd = new FormData(form);
      const name = String(fd.get("name") || "").trim();
      const email = String(fd.get("email") || "").trim();
      const message = String(fd.get("message") || "").trim();

      // Minimal front-end validation
      if (!name || !email || !message) {
        const hint = $("#form-hint");
        if (hint) hint.textContent = "Please fill in all fields.";
        return;
      }

      const to = "mohity667@gmail.com";
      const subject = `Portfolio contact — ${name}`;
      const body = [
        `Name: ${name}`,
        `Email: ${email}`,
        "",
        message,
        "",
        "— Sent from your portfolio site",
      ].join("\n");

      const href =
        `mailto:${encodeURIComponent(to)}` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

      window.location.href = href;
    });
  }

  // Hero canvas particles
  const canvas = $("#hero-canvas");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d", { alpha: true });
    let w = 0;
    let h = 0;
    let dpr = Math.min(2, window.devicePixelRatio || 1);
    let raf = 0;

    const rand = (min, max) => min + Math.random() * (max - min);

    const getColors = () => {
      const style = getComputedStyle(document.documentElement);
      const accent = style.getPropertyValue("--accent").trim() || "#25d0c9";
      const accent2 = style.getPropertyValue("--accent-2").trim() || "#5aa7ff";
      const text = style.getPropertyValue("--text").trim() || "rgba(255,255,255,0.92)";
      return { accent, accent2, text };
    };

    const makeDots = () => {
      const count = Math.max(26, Math.floor((w * h) / 52000));
      const dots = [];
      for (let i = 0; i < count; i++) {
        dots.push({
          x: rand(0, w),
          y: rand(0, h),
          r: rand(1.1, 2.8),
          vx: rand(-0.12, 0.12),
          vy: rand(-0.1, 0.1),
          a: rand(0.12, 0.32),
        });
      }
      return dots;
    };

    let dots = [];
    let t0 = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = makeDots();
    };

    const draw = (now) => {
      raf = requestAnimationFrame(draw);
      if (prefersReducedMotion) return;

      const dt = Math.min(32, now - t0);
      t0 = now;

      const { accent, accent2 } = getColors();
      ctx.clearRect(0, 0, w, h);

      // Soft gradient wash
      const g = ctx.createRadialGradient(
        w * 0.25,
        h * 0.2,
        10,
        w * 0.25,
        h * 0.2,
        Math.max(w, h) * 0.9
      );
      g.addColorStop(0, `${accent}22`);
      g.addColorStop(0.45, `${accent2}16`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // Dots + links
      for (const p of dots) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }

      // Links
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i];
          const b = dots[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          const maxDist = 110;
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.18;
            ctx.strokeStyle = `rgba(37, 208, 201, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Dots
      for (const p of dots) {
        ctx.fillStyle = `rgba(255, 255, 255, ${p.a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const start = () => {
      cancelAnimationFrame(raf);
      resize();
      t0 = performance.now();
      raf = requestAnimationFrame(draw);
    };

    const onResize = () => start();
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("themechange", () => {
      // gentle refresh; dot positions stay
    });

    start();
  }
})();

