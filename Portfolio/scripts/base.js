// ---------- Site settings ----------

const siteInfo = {
  name: "Abdulsalam Oke",
  email: "akoredeabdulsalam330@gmail.com",
  linkedin: "https://www.linkedin.com/in/abdulsalam-oke-72a12b3a6/",
  github: "https://github.com/abdulsalam-akorede",
  resume: "files/Abdulsalam-Oke-Resume.pdf",
  location: "Lagos, Nigeria. Available for remote work."
};

const form = document.getElementById('form');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    formData.append("access_key", "1e16cbfb-8f90-437c-8f29-1955353464f5");

    const originalText = submitBtn.textContent;

    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            alert("Success! Your message has been sent.");
            form.reset();
        } else {
            alert("Error: " + data.message);
        }

    } catch (error) {
        alert("Something went wrong. Please try again.");
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

const navLinks = [
  { label: "Home", href: "index.html", page: "home" },
  { label: "About", href: "about.html", page: "about" },
  { label: "Projects", href: "projects.html", page: "projects" },
  { label: "Contact", href: "contact.html", page: "contact" }
];

// ---------- Project data ----------

const projects = [
  {
    id: 1,
    name: "Olam's Apparel",
    category: "Client Website",
    summary: "A multi-page website for a Lagos fashion brand, built with separate HTML, CSS, and JavaScript files.",
    details: "A responsive website for Olam's Apparel, a Lagos brand that makes agbada, caftans, casuals, two-piece outfits, and Senegal wear. The site presents the brand's story and offerings and gives customers an easy way to get in touch.",
    highlights: [
      "Home, About, and Contact pages with shared navigation",
      "Colour palette and tagline taken from the business identity",
      "Responsive layout for phones, tablets, and desktops",
      "Contact form connected to a web form service"
    ],
    tools: ["HTML", "CSS", "JavaScript"],
    image: "images/olams-apparel.webp",
    links: [
      { label: "Open live site", url: "../Olams-apparel/index.html" }
    ]
  },
  {
    id: 2,
    name: "Personal Portfolio",
    category: "Coursework",
    summary: "The site you are viewing, built as my WDD 131 course project.",
    details: "My professional portfolio, built for BYU-Idaho's Dynamic Web Fundamentals course. It uses a shared JavaScript file to build the navigation, footer, and project cards on every page.",
    highlights: [
      "Projects rendered from a JavaScript array with category filters",
      "Accessible project dialog and mobile navigation",
      "Contact form connected to a web form service",
      "Visit counter that uses localStorage"
    ],
    tools: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
    image: "images/portfolio.webp",
    links: [
      { label: "View source on GitHub", url: "https://github.com/abdulsalam-akorede/wdd131" }
    ]
  },
  {
    id: 3,
    name: "WDD 131 Coursework",
    category: "Coursework",
    summary: "Course projects on responsive layouts, DOM manipulation, forms, and events.",
    details: "A collection of work from Dynamic Web Fundamentals, including a site plan, responsive pages, and JavaScript features that respond to user actions.",
    highlights: [
      "Site plan covering pages, palette, fonts, and navigation",
      "Pages checked against the course audit",
      "JavaScript functions, conditionals, and array methods in use"
    ],
    tools: ["HTML", "CSS", "JavaScript"],
    image: "images/wdd131.webp",
    links: [
      { label: "View on GitHub", url: "https://github.com/abdulsalam-akorede/wdd131" }
    ]
  }
];

// ---------- Helpers ----------

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function mediaMarkup(project) {
  return `
    <div class="project-media" data-initials="${getInitials(project.name)}">
      <img src="${project.image}" alt="Screenshot of ${project.name}" loading="lazy">
    </div>
  `;
}

function handleBrokenImages(container) {
  container.querySelectorAll(".project-media img").forEach((img) => {
    const showPlaceholder = () => {
      img.parentElement.classList.add("placeholder");
      img.remove();
    };

    img.addEventListener("error", showPlaceholder, { once: true });

    if (img.complete && img.naturalWidth === 0) {
      showPlaceholder();
    }
  });
}

// ---------- Nav ----------

function buildNav(activePage) {
  const header = document.querySelector("#site-header");
  if (!header) return;

  const linkItems = navLinks
    .map((link) => {
      const isActive = link.page === activePage;
      return `<li><a href="${link.href}" class="${isActive ? "active" : ""}"${isActive ? ' aria-current="page"' : ""}>${link.label}</a></li>`;
    })
    .join("");

  header.innerHTML = `
    <div class="nav-container">
      <a href="index.html" class="logo">${siteInfo.name}</a>
      <button id="menu-toggle" class="menu-toggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="main-nav">&#9776;</button>
      <nav id="main-nav" aria-label="Main">
        <ul>${linkItems}</ul>
      </nav>
    </div>
  `;

  const toggle = document.querySelector("#menu-toggle");
  const nav = document.querySelector("#main-nav");

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// ---------- Footer ----------

function buildFooter() {
  const footer = document.querySelector("#site-footer");
  if (!footer) return;

  const pageLinks = navLinks
    .map((link) => `<li><a href="${link.href}">${link.label}</a></li>`)
    .join("");

  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <p class="footer-brand">${siteInfo.name}</p>
          <p>Software development student building responsive websites.</p>
        </div>
        <div>
          <p class="footer-title">Pages</p>
          <ul class="footer-links">${pageLinks}</ul>
        </div>
        <div>
          <p class="footer-title">Connect</p>
          <ul class="footer-links">
            <li><a href="mailto:${siteInfo.email}">Email</a></li>
            <li><a href="${siteInfo.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            <li><a href="${siteInfo.github}" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            <li><a href="${siteInfo.resume}" download>Resume</a></li>
          </ul>
        </div>
      </div>
      <p class="footer-bottom">&copy; ${new Date().getFullYear()} ${siteInfo.name}. <a href="references.html">References</a></p>
    </div>
  `;
}

// ---------- Contact links ----------

function fillContactLinks() {
  document.querySelectorAll("[data-contact]").forEach((element) => {
    const type = element.dataset.contact;

    if (type === "email") {
      element.href = `mailto:${siteInfo.email}`;
      element.textContent = siteInfo.email;
    } else if (type === "linkedin") {
      element.href = siteInfo.linkedin;
    } else if (type === "github") {
      element.href = siteInfo.github;
    } else if (type === "resume") {
      element.href = siteInfo.resume;
    } else if (type === "location") {
      element.textContent = siteInfo.location;
    }
  });
}

// ---------- Featured projects (home page) ----------

function renderFeaturedProjects() {
  const container = document.querySelector("#featured-projects");
  if (!container) return;

  const [main, ...others] = projects.slice(0, 3);

  const highlights = main.highlights
    .slice(0, 3)
    .map((item) => `<li>${item}</li>`)
    .join("");

  const liveLink = main.links[0]
    ? `<a href="${main.links[0].url}" class="btn" target="_blank" rel="noopener noreferrer">${main.links[0].label}</a>`
    : "";

  const otherCards = others
    .map(
      (project) => `
        <article class="project-card">
          ${mediaMarkup(project)}
          <div class="project-card-content">
            <p class="project-tag">${project.category}</p>
            <h3>${project.name}</h3>
            <p>${project.summary}</p>
            <a href="projects.html?project=${project.id}" class="project-link">View details</a>
          </div>
        </article>
      `
    )
    .join("");

  container.innerHTML = `
    <article class="feature">
      ${mediaMarkup(main)}
      <div class="feature-content">
        <p class="project-tag">${main.category}</p>
        <h3>${main.name}</h3>
        <p>${main.summary}</p>
        <ul class="plain-list">${highlights}</ul>
        <div class="feature-actions">
          ${liveLink}
          <a href="projects.html?project=${main.id}" class="btn btn-outline">Project details</a>
        </div>
      </div>
    </article>
    <div class="project-grid">${otherCards}</div>
  `;

  handleBrokenImages(container);
}

// ---------- Projects page ----------

function renderProjects(category = "All") {
  const container = document.querySelector("#projects-grid");
  if (!container) return;

  const filtered =
    category === "All"
      ? projects
      : projects.filter((project) => project.category === category);

  container.innerHTML = filtered
    .map(
      (project) => `
        <article class="project-card">
          ${mediaMarkup(project)}
          <div class="project-card-content">
            <p class="project-tag">${project.category}</p>
            <h3>${project.name}</h3>
            <p>${project.summary}</p>
            <button class="project-link" data-project-id="${project.id}">View details</button>
          </div>
        </article>
      `
    )
    .join("");

  handleBrokenImages(container);
}

function setupProjectFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  if (buttons.length === 0) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      renderProjects(button.dataset.category);

      buttons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });
    });
  });
}

// ---------- Project modal ----------

let lastFocusedElement = null;

function openProjectModal(projectId) {
  const modal = document.querySelector("#project-modal");
  const modalBody = document.querySelector("#modal-body");
  const project = projects.find((item) => item.id === Number(projectId));

  if (!modal || !modalBody || !project) return;

  const highlights = project.highlights
    .map((item) => `<li>${item}</li>`)
    .join("");

  const tools = project.tools.map((tool) => `<li>${tool}</li>`).join("");

  const links = project.links
    .map(
      (link) =>
        `<a href="${link.url}" class="btn" target="_blank" rel="noopener noreferrer">${link.label}</a>`
    )
    .join("");

  modalBody.innerHTML = `
    <p class="project-tag">${project.category}</p>
    <h2 id="modal-title">${project.name}</h2>
    <p>${project.details}</p>
    <h3>What I built</h3>
    <ul class="plain-list">${highlights}</ul>
    <h3>Tools</h3>
    <ul class="modal-tools">${tools}</ul>
    <div class="modal-actions">${links}</div>
  `;

  lastFocusedElement = document.activeElement;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.querySelector("#modal-close").focus();
}

function closeProjectModal() {
  const modal = document.querySelector("#project-modal");
  if (!modal || !modal.classList.contains("open")) return;

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

function setupProjectModal() {
  const modal = document.querySelector("#project-modal");
  const closeButton = document.querySelector("#modal-close");
  const grid = document.querySelector("#projects-grid");

  if (!modal || !closeButton || !grid) return;

  // One listener on the grid keeps working after the filters re-render the cards.
  grid.addEventListener("click", (event) => {
    const button = event.target.closest(".project-link");
    if (button) openProjectModal(button.dataset.projectId);
  });

  closeButton.addEventListener("click", closeProjectModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeProjectModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeProjectModal();
  });

  const requestedId = new URLSearchParams(window.location.search).get("project");
  if (requestedId) openProjectModal(requestedId);
}

function trackProjectVisits() {
  const message = document.querySelector("#project-visit-count");
  if (!message) return;

  try {
    const visits = (Number(localStorage.getItem("projectVisits")) || 0) + 1;
    localStorage.setItem("projectVisits", visits);
    message.textContent = `You have viewed this page ${visits} time${visits === 1 ? "" : "s"}.`;
  } catch (error) {
    message.textContent = "";
  }
}

// ---------- Contact form ----------

function setFormStatus(text, type) {
  const status = document.querySelector("#form-message");
  if (!status) return;

  status.textContent = text;
  status.className = `form-message ${type}`;
}

function setupContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const submitButton = document.querySelector("#form-submit");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (FORM_ENDPOINT.includes("YOUR_FORM_ID")) {
      setFormStatus(`The form is not connected yet. Please email me at ${siteInfo.email}.`, "error");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    setFormStatus("", "");

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });

      if (response.ok) {
        form.reset();
        setFormStatus("Thank you. Your message was sent and I will reply soon.", "success");
      } else {
        setFormStatus(`Your message could not be sent. Please email me at ${siteInfo.email}.`, "error");
      }
    } catch (error) {
      setFormStatus(`Something went wrong. Please check your connection or email me at ${siteInfo.email}.`, "error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Send message";
    }
  });
}

// ---------- Init ----------

document.addEventListener("DOMContentLoaded", () => {
  buildNav(document.body.dataset.page);
  buildFooter();
  fillContactLinks();
  renderFeaturedProjects();
  renderProjects();
  setupProjectFilters();
  setupProjectModal();
  trackProjectVisits();
  setupContactForm();
});