// scripts/gsap-animations.js
(() => {
  // Safety check
  if (!window.gsap) {
    console.error("GSAP not loaded. Did you include the CDN script?");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // ----------------------------
  // 1) HERO INTRO
  // ----------------------------
  const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

  heroTl
    .from(".hero-content h1", { y: 20, opacity: 0, duration: 0.7 })
    .from(".hero-subtitle", { y: 16, opacity: 0, duration: 0.6 }, "-=0.35")
    .from(
      ".hero-actions .btn",
      { y: 12, opacity: 0, duration: 0.45, stagger: 0.12 },
      "-=0.25",
    )
    .from(
      ".hero-image .glass-card",
      { y: 20, opacity: 0, duration: 0.7 },
      "-=0.55",
    );

  // Subtle float on profile card
  gsap.to(".hero-image .glass-card", {
    y: -8,
    duration: 2.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  // ----------------------------
  // 2) SECTION REVEALS ON SCROLL
  // ----------------------------
  gsap.utils.toArray(".reveal-section").forEach((section) => {
    gsap.from(section, {
      opacity: 0,
      y: 28,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    // Optional: animate common children inside sections (cards/tags/items)
    const children = section.querySelectorAll(
      ".card, .project-card, .skill-card, .tag, .learning-tags > *, .skills-grid > *",
    );
    if (children.length) {
      gsap.from(children, {
        opacity: 0,
        y: 18,
        duration: 0.6,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
        },
      });
    }
  });

  // ----------------------------
  // 3) PROJECT CARDS (DYNAMIC INJECTION SAFE)
  // ----------------------------
  // If your projects are rendered later via JS, use MutationObserver
  const projectsGrid = document.querySelector(".projects-grid");
  if (projectsGrid) {
    const animateProjectCards = () => {
      const cards = projectsGrid.querySelectorAll(".project-card");
      if (!cards.length) return;

      gsap.from(cards, {
        opacity: 0,
        y: 22,
        duration: 0.55,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: projectsGrid,
          start: "top 80%",
        },
      });

      // Hover lift for each card
      cards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, { y: -6, duration: 0.25, ease: "power2.out" });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { y: 0, duration: 0.25, ease: "power2.out" });
        });
      });
    };

    animateProjectCards();

    const obs = new MutationObserver(() => animateProjectCards());
    obs.observe(projectsGrid, { childList: true, subtree: true });
  }

  // ----------------------------
  // 4) BACKGROUND ORBS PARALLAX
  // ----------------------------
  const orbs = document.querySelector(".bg-orbs");
  const layer = document.querySelector(".bg-layer");

  if (orbs) {
    gsap.to(orbs, {
      y: 120,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
      },
    });
  }

  if (layer) {
    gsap.to(layer, {
      y: 60,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
      },
    });
  }

  // ----------------------------
  // 5) MAGNETIC BUTTONS (Optional, feels amazing)
  // ----------------------------
  const magneticButtons = document.querySelectorAll(
    ".btn, .btn-primary, .btn-outline",
  );
  magneticButtons.forEach((btn) => {
    btn.style.willChange = "transform";

    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.18,
        y: y * 0.25,
        duration: 0.25,
        ease: "power3.out",
      });
    });

    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.35, ease: "elastic.out(1, 0.5)" });
    });
  });
})();
