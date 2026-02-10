export async function renderProjects() {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  try {
    const res = await fetch("data/projects.json");
    const projects = await res.json();

    grid.innerHTML = projects
      .map(
        (p) => `
      <article class="card">
        <h3>${escapeHtml(p.title)}</h3>
        <p style="color: var(--muted)">${escapeHtml(p.desc)}</p>
        <p>
          <a href="${p.links.live}" target="_blank" rel="noreferrer">Live</a>
          ·
          <a href="${p.links.repo}" target="_blank" rel="noreferrer">Repo</a>
        </p>
      </article>
    `,
      )
      .join("");
  } catch {
    grid.innerHTML = `<p style="color: var(--muted)">Could not load projects.</p>`;
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
