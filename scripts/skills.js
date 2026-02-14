// skills.js
document.addEventListener("DOMContentLoaded", () => {
  initSkills().catch((err) => console.error("[skills.js]", err));
});

async function initSkills() {
  const data = await fetchSkillsJson();

  const grid = document.querySelector(".skills-grid");
  const learningContainer = document.querySelector(".learning-tags");

  if (!grid) throw new Error("Missing .skills-grid in HTML");
  if (!learningContainer) throw new Error("Missing .learning-tags in HTML");

  // Clear safely
  grid.replaceChildren();
  learningContainer.replaceChildren();

  // Categories -> Cards
  if (Array.isArray(data.categories)) {
    data.categories.forEach((category) => {
      const card = document.createElement("div");
      card.className = "skill-card";

      const title = document.createElement("h3");
      title.textContent = category.category ?? "Category";

      const list = document.createElement("div");
      list.className = "skill-list";

      (category.skills ?? []).forEach((skill) => {
        const item = document.createElement("div");
        item.className = "skill-item";

        const labelRow = document.createElement("div");
        labelRow.className = "skill-label-row";

        const label = document.createElement("div");
        label.className = "skill-label";
        label.textContent = skill.name ?? "Skill";

        const value = document.createElement("div");
        value.className = "skill-value";
        const pct = clampNumber(skill.level, 0, 100);
        value.textContent = `${pct}%`;

        labelRow.appendChild(label);
        labelRow.appendChild(value);

        const bar = document.createElement("div");
        bar.className = "skill-bar";

        const fill = document.createElement("div");
        fill.className = "skill-fill";
        fill.style.width = `${pct}%`;

        bar.appendChild(fill);

        item.appendChild(labelRow);
        item.appendChild(bar);
        list.appendChild(item);
      });

      card.appendChild(title);
      card.appendChild(list);
      grid.appendChild(card);
    });
  }

  // Learning tags
  if (Array.isArray(data.learning)) {
    data.learning.forEach((name) => {
      const tag = document.createElement("span");
      tag.className = "learning-tag";
      tag.textContent = String(name);
      learningContainer.appendChild(tag);
    });
  }
}

async function fetchSkillsJson() {
  // skills.json must sit next to index.html
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
