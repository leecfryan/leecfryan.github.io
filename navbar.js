class NavBar extends HTMLElement {
  connectedCallback() {
    const nav = document.createElement("nav");
    nav.className = "navbar";

    const links = [
      { href: "#home", text: "Home" },
      { href: "#projects", text: "Projects" },
      { href: "#skills", text: "Skills" },
      { href: "#contact", text: "Contact" },
    ];

    links.forEach(({ href, text }) => {
      const a = document.createElement("a");
      a.href = href;
      a.textContent = text;
      nav.appendChild(a);
    });

    this.replaceChildren(nav);
  }
}

customElements.define("nav-bar", NavBar);
