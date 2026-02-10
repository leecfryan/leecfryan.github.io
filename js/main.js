import { initNav } from "./modules/nav.js";
import { renderProjects } from "./modules/projects.js";

initNav();
renderProjects();

document.getElementById("year").textContent = new Date().getFullYear();
