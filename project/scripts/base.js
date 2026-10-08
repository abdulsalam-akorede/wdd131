// ---------- Shared site data ----------

const navLinks = [
  { label: "Home", href: "index.html", page: "home" },
  { label: "About", href: "about.html", page: "about" },
  { label: "Projects", href: "projects.html", page: "projects" },
  { label: "Contact", href: "contact.html", page: "contact" }
];

const projects = [
  {
    id: 1,
    name: "Crestline Brands",
    category: "Branding",
    description: "Full brand identity buildout including logo, color system, and print materials.",
    details: "A branding project focused on creating a consistent visual identity for Crestline Brands, including logo development, color selection, promotional materials, and brand presentation.",
    tools: "CorelDRAW, Photoshop",
    image: "images/crestline.webp"
  },

  {
    id: 2,
    name: "Project Go",
    category: "Branding",
    description: "Brand identity for a digital-skills empowerment initiative.",
    details: "A digital empowerment project designed to help students, graduates, job seekers, entrepreneurs, freelancers, and professionals develop practical digital skills.",
    tools: "CorelDRAW, Photoshop",
    image: "images/project-go.webp"
  },

  {
    id: 3,
    name: "WDD 131 Coursework",
    category: "Web Development",
    description: "Responsive websites built with semantic HTML, CSS, and vanilla JavaScript.",
    details: "A collection of projects created while studying Dynamic Web Fundamentals, including responsive layouts, JavaScript functionality, forms, DOM manipulation, and interactive web pages.",
    tools: "HTML, CSS, JavaScript",
    image: "images/wdd131.webp"
  }
];

// ---------- Nav ----------

function buildNav(activePage) {
  const header = document.querySelector("#site-header");
  if (!header) return;

  const linkItems = navLinks
    .map((link) => {
      const activeClass = link.page === activePage ? "active" : "";
      return `<li><a href="${link.href}" class="${activeClass}">${link.label}</a></li>`;
    })
    .join("");

  header.innerHTML = `
    <div class="nav-container">
      <a href="index.html" class="logo">Abdulsalam Oke</a>
      <button id="menu-toggle" class="menu-toggle" aria-label="Toggle navigation" aria-expanded = "false" >&#9776;</button>
      <nav id="main-nav">
        <ul>${linkItems}</ul>
      </nav>
    </div>
  `;

  const toggle = document.querySelector("#menu-toggle");
  const nav = document.querySelector("#main-nav");

  toggle.addEventListener("click", () => {
  nav.classList.toggle("open");

  const isOpen = nav.classList.contains("open");

  toggle.setAttribute("aria-expanded", isOpen);

  });
}

// ---------- Footer ----------

function buildFooter() {
  const footer = document.querySelector("#site-footer");
  if (!footer) return;

  const year = new Date().getFullYear();
  footer.innerHTML = `<p>&copy; ${year} Abdulsalam Akorede</p>`;
}

// ---------- Featured projects (home page) ----------

function renderFeaturedProjects() {
  const container = document.querySelector("#featured-projects");
  if (!container) return;

  const featured = projects.slice(0, 3);

  container.innerHTML = featured
    .map(
      (project) => `
      <div class="project-card">
        <img src="${project.image}" alt="${project.name}">
        <h3>${project.name}</h3>
        <p>${project.description}</p>
      </div>
    `
    )
    .join("");
}

function renderProjects(category = "All") {
  const container = document.querySelector("#projects-grid");

  if (!container) return;

  const filteredProjects =
    category === "All"
      ? projects
      : projects.filter((project) => project.category === category);

  container.innerHTML = filteredProjects
    .map(
      (project) => `
        <article class="project-card">
          <img
            src="${project.image}"
            alt="${project.name}"
            loading="lazy"
          >

          <div class="project-card-content">
            <p class="project-category">${project.category}</p>

            <h3>${project.name}</h3>

            <p>${project.description}</p>

            <button class="project-link" data-project-id="${project.id}">
              View Project →
            </button>
          </div>
        </article>
      `
    )
    .join("");
}

function setupProjectFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");

  if (filterButtons.length === 0) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.category;

      renderProjects(category);

      filterButtons.forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");
    });
  });
}


function setupContactForm() {
  const form = document.querySelector("#contact-form");
  const message = document.querySelector("#form-message");

  if (!form || !message) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.querySelector("#name").value.trim();

    if (name === "") {
      message.textContent = "Please enter your name.";
      return;
    }

    message.textContent = `Thank you, ${name}! Your message has been received.`;

    form.reset();
  });
}


function setupProjectModal() {
  const modal = document.querySelector("#project-modal");
  const modalBody = document.querySelector("#modal-body");
  const closeButton = document.querySelector("#modal-close");
  const projectButtons = document.querySelectorAll(".project-link");

  if (!modal || !modalBody || !closeButton || projectButtons.length === 0) {
    return;
  }

  projectButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const projectId = Number(button.dataset.projectId);

      const selectedProject = projects.find(
        (project) => project.id === projectId
      );

      if (!selectedProject) return;

      modalBody.innerHTML = `
        <p class="modal-category">${selectedProject.category}</p>
        <h2>${selectedProject.name}</h2>
        <p>${selectedProject.details}</p>
        <p class="modal-tools"><strong>Tools:</strong> ${selectedProject.tools}</p>
      `;

      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
    });
  });

  closeButton.addEventListener("click", () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  });
}

function trackProjectVisits() {
  const visitMessage = document.querySelector("#project-visit-count");

  if (!visitMessage) return;

  let visitCount = Number(localStorage.getItem("projectVisits")) || 0;

  visitCount += 1;

  localStorage.setItem("projectVisits", visitCount);

  visitMessage.textContent =
    `You've explored my projects ${visitCount} time${visitCount === 1 ? "" : "s"}.`;
}

// ---------- Init ----------

document.addEventListener("DOMContentLoaded", () => {
  const activePage = document.body.dataset.page;

  buildNav(activePage);
  buildFooter();
  renderFeaturedProjects();
  renderProjects();
  setupProjectFilters();
  setupContactForm();
  setupProjectModal();
  trackProjectVisits();
});

