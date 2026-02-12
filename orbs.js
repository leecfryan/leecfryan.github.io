// orbs.js
(() => {
  const container = document.querySelector(".bg-orbs");
  if (!container) return;

  const ORB_COUNT = 10; // tweak: 6 - 16 is nice
  const MIN_SIZE = 120;
  const MAX_SIZE = 320;

  // colours that match your theme
  const COLOURS = [
    "rgba(0, 140, 255, 0.35)", // blue
    "rgba(255, 0, 180, 0.28)", // pink/purple
    "rgba(0, 255, 200, 0.22)", // cyan/teal
    "rgba(252, 197, 129, 0.22)", // beige accent
  ];

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function vw() {
    return window.innerWidth;
  }

  function vh() {
    return window.innerHeight;
  }

  function createOrb() {
    const el = document.createElement("div");
    el.className = "bg-orb";

    const size = rand(MIN_SIZE, MAX_SIZE);
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.background = `radial-gradient(circle at 30% 30%, ${pick(COLOURS)}, transparent 60%)`;

    // start somewhere random
    const x = rand(-size * 0.2, vw() - size * 0.8);
    const y = rand(-size * 0.2, vh() - size * 0.8);
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;

    // store current position
    el.dataset.x = String(x);
    el.dataset.y = String(y);

    container.appendChild(el);
    return el;
  }

  // Move an orb to a new random target, with random duration/easing.
  // Uses Web Animations API (no innerHTML, no libs).
  function drift(orb) {
    const rect = orb.getBoundingClientRect();
    const size = rect.width || parseFloat(orb.style.width) || 200;

    const fromX = parseFloat(orb.dataset.x || "0");
    const fromY = parseFloat(orb.dataset.y || "0");

    // next target (disorganised but bounded)
    const toX = rand(-size * 0.2, vw() - size * 0.8);
    const toY = rand(-size * 0.2, vh() - size * 0.8);

    // duration randomness
    const duration = rand(6000, 14000);

    const anim = orb.animate(
      [
        { transform: `translate3d(${fromX}px, ${fromY}px, 0)` },
        { transform: `translate3d(${toX}px, ${toY}px, 0)` },
      ],
      {
        duration,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "forwards",
      },
    );

    anim.onfinish = () => {
      orb.dataset.x = String(toX);
      orb.dataset.y = String(toY);
      // drift again forever
      drift(orb);
    };
  }

  // Build orbs
  const orbs = Array.from({ length: ORB_COUNT }, () => createOrb());
  orbs.forEach((o) => drift(o));

  // Keep them in bounds on resize
  window.addEventListener("resize", () => {
    orbs.forEach((orb) => {
      const x = rand(-80, vw() - 200);
      const y = rand(-80, vh() - 200);
      orb.dataset.x = String(x);
      orb.dataset.y = String(y);
      orb.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  });
})();
