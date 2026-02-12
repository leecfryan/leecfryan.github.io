document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("projects.json");
    if (!response.ok) {
      throw new Error("Failed to load projects.json");
    }

    const projects = await response.json();
    const grid = document.querySelector(".projects-grid");

    projects.forEach((project) => {
      // Create article card
      const card = document.createElement("article");
      card.classList.add("project-card");

      // Thumbnail container
      const thumbnail = document.createElement("div");
      thumbnail.classList.add("project-thumbnail");

      const img = document.createElement("img");
      img.src = project.image;
      img.alt = project.title;

      thumbnail.appendChild(img);

      // Content container
      const content = document.createElement("div");
      content.classList.add("project-card-content");

      const title = document.createElement("h3");
      title.textContent = project.title;

      const description = document.createElement("p");
      description.textContent = project.description;

      const linksContainer = document.createElement("div");
      linksContainer.classList.add("project-links");

      if (project.github) {
        const githubLink = document.createElement("a");
        githubLink.href = project.github;
        githubLink.textContent = "GitHub";
        githubLink.target = "_blank";
        githubLink.rel = "noopener noreferrer";

        linksContainer.appendChild(githubLink);
      }

      if (project.live) {
        const liveLink = document.createElement("a");
        liveLink.href = project.live;
        liveLink.textContent = "Live Demo";
        liveLink.target = "_blank";
        liveLink.rel = "noopener noreferrer";

        linksContainer.appendChild(liveLink);
      }

      content.appendChild(title);
      content.appendChild(description);
      content.appendChild(linksContainer);

      // Assemble card
      card.appendChild(thumbnail);
      card.appendChild(content);

      // Add to grid
      grid.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading projects:", error);
  }
});
