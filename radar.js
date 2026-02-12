// radar.js
document.addEventListener("DOMContentLoaded", () => {
  initRadar().catch((err) => console.error("[radar.js]", err));
});

async function initRadar() {
  const data = await fetchSkillsJson();

  if (!data.radar) {
    console.warn("[radar.js] No radar object found in skills.json");
    return;
  }

  const svg = document.querySelector(".radar-svg");
  if (!svg) throw new Error("Missing .radar-svg in HTML");

  // Ensure legend exists (prevents crashes)
  let legend = document.querySelector(".radar-legend");
  if (!legend) {
    legend = document.createElement("div");
    legend.className = "radar-legend";

    // Prefer placing it in .radar-info if available
    const radarInfo = document.querySelector(".radar-info");
    if (radarInfo) radarInfo.prepend(legend);
  }

  // Clear safely
  svg.replaceChildren();
  if (legend) legend.replaceChildren();

  const labels = Array.isArray(data.radar.labels) ? data.radar.labels : [];
  const values = Array.isArray(data.radar.values) ? data.radar.values : [];

  if (labels.length < 3) {
    console.warn("[radar.js] radar.labels must have at least 3 items");
    return;
  }

  // If values shorter, pad with 0s
  while (values.length < labels.length) values.push(0);

  const NS = "http://www.w3.org/2000/svg";
  const createEl = (name) => document.createElementNS(NS, name);

  const maxValue = 100;
  const radius = 90;
  const levels = 5;

  const polarToXY = (angle, r) => ({
    x: Math.cos(angle) * r,
    y: Math.sin(angle) * r,
  });

  // ===== Grid rings =====
  for (let lvl = 1; lvl <= levels; lvl++) {
    const r = (radius * lvl) / levels;
    const ring = createEl("polygon");

    const pts = labels.map((_, i) => {
      const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
      const p = polarToXY(angle, r);
      return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
    });

    ring.setAttribute("points", pts.join(" "));
    ring.setAttribute("fill", "none");
    ring.setAttribute("stroke", "rgba(255,255,255,0.12)");
    ring.setAttribute("stroke-width", "1");
    svg.appendChild(ring);
  }

  // ===== Axis + Labels + Legend =====
  labels.forEach((label, i) => {
    const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
    const end = polarToXY(angle, radius);

    const axis = createEl("line");
    axis.setAttribute("x1", "0");
    axis.setAttribute("y1", "0");
    axis.setAttribute("x2", end.x.toFixed(2));
    axis.setAttribute("y2", end.y.toFixed(2));
    axis.setAttribute("stroke", "rgba(255,255,255,0.14)");
    axis.setAttribute("stroke-width", "1");
    svg.appendChild(axis);

    // Push labels further out to avoid clipping
    const text = createEl("text");
    const labelPos = polarToXY(angle, radius + 32);

    text.setAttribute("x", labelPos.x.toFixed(2));
    text.setAttribute("y", labelPos.y.toFixed(2));
    text.setAttribute("fill", "rgba(252,197,129,0.95)");
    text.setAttribute("font-size", "11");
    text.setAttribute(
      "text-anchor",
      labelPos.x > 8 ? "start" : labelPos.x < -8 ? "end" : "middle",
    );
    text.setAttribute(
      "dominant-baseline",
      labelPos.y > 8 ? "hanging" : labelPos.y < -8 ? "auto" : "middle",
    );
    text.textContent = String(label);
    svg.appendChild(text);

    // Legend item (optional, but nice)
    if (legend) {
      const item = document.createElement("div");
      item.className = "radar-legend-item";

      const dot = document.createElement("span");
      dot.className = "radar-dot";

      const name = document.createElement("span");
      const pct = clampNumber(values[i], 0, 100);
      name.textContent = `${label}: ${pct}/100`;

      item.appendChild(dot);
      item.appendChild(name);
      legend.appendChild(item);
    }
  });

  // ===== Data polygon =====
  const poly = createEl("polygon");
  const dataPoints = labels.map((_, i) => {
    const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
    const pct = clampNumber(values[i], 0, 100);
    const r = (pct / maxValue) * radius;
    const p = polarToXY(angle, r);
    return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
  });

  poly.setAttribute("points", dataPoints.join(" "));
  poly.setAttribute("fill", "rgba(252,197,129,0.18)");
  poly.setAttribute("stroke", "rgba(252,197,129,0.75)");
  poly.setAttribute("stroke-width", "2");
  svg.appendChild(poly);

  // ===== Points =====
  labels.forEach((_, i) => {
    const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
    const pct = clampNumber(values[i], 0, 100);
    const r = (pct / maxValue) * radius;
    const p = polarToXY(angle, r);

    const c = createEl("circle");
    c.setAttribute("cx", p.x.toFixed(2));
    c.setAttribute("cy", p.y.toFixed(2));
    c.setAttribute("r", "3.5");
    c.setAttribute("fill", "rgba(252,197,129,0.95)");
    svg.appendChild(c);
  });
}

async function fetchSkillsJson() {
  const res = await fetch("skills.json", { cache: "no-store" });
  if (!res.ok) {
    throw new Error(
      `Failed to load skills.json (${res.status}). Place it beside index.html`,
    );
  }
  return await res.json();
}

function clampNumber(n, min, max) {
  const num = Number(n);
  if (Number.isNaN(num)) return min;
  return Math.max(min, Math.min(max, num));
}
