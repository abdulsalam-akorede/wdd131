
// ---------- Site settings ----------

const siteInfo = {
  name: "Abdulsalam Oke",
  email: "akoredeabdulsalam330@gmail.com",
  linkedin: "https://www.linkedin.com/in/abdulsalam-oke-72a12b3a6/",
  github: "https://github.com/abdulsalam-akorede",
  resume: "files/Abdulsalam-Oke-Resume.pdf",
  location: "Lagos, Nigeria. Available for remote work."
};

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
    category: "Web development",
    summary: "A multi-page website for a Lagos fashion brand, built with separate HTML, CSS, and JavaScript files.",
    details: "A responsive website for Olam's Apparel, a Lagos brand that makes agbada, caftans, casuals, two-piece outfits, and Senegal wear. The site presents the brand's story and offerings and gives customers an easy way to get in touch.",
    highlights: [
      "Home, About, and Contact pages with shared navigation",
      "Colour palette and tagline taken from the business identity",
      "Responsive layout for phones, tablets, and desktops",
      "Contact form connected to a web form service"
    ],
    tools: ["HTML", "CSS", "JavaScript"],
    image: "images/olams-apparel.jpg",
    links: [
      { label: "Open live site", url: "../Olams-apparel/index.html" }
    ]
  },
  {
    id: 2,
    name: "Examination Management and Ranking System",
    category: "Web development",
    summary: "A Python application that calculates results, ranks everyone by total score and reports class statistics, with a live demo you can try.",
    details: "A Python application for managing examination results. It records scores for four subjects, calculates totals and averages, applies a pass mark of 50, ranks results by total score and produces a report with class statistics. Records are saved to a CSV file, and the calculation logic is covered by automated pytest tests. The live demo runs the same Python functions in your browser.",
    highlights: [
      "Add, search and edit records with input validation (scores must be 0 to 100)",
      "Totals, averages and Pass or Fail status from reusable functions",
      "Ranked report with class average, passed and failed counts, and highest and lowest scorers",
      "Records saved to and loaded from CSV files",
      "Calculation, ranking and search logic covered by pytest tests"
    ],
    tools: ["Python", "pytest", "CSV", "JavaScript"],
    image: "images/ranking-demo.jpg",
    links: [
      { label: "Try the live demo", url: "ranking-demo.html" },
      { label: "View source on GitHub", url: "https://github.com/abdulsalam-akorede/examination-ranking-system" }
    ]
  },
  {
    id: 3,
    name: "Project Go Tech Brand Identity",
    category: "Branding",
    summary: "A complete brand identity and design system for a digital-skills programme, created for a freelance client.",
    details: "A brand identity for Project Go Tech, a digital-skills programme with the tagline \"Digitize What You Know\". I designed the logo, colour system, typography and graphic language in CorelDRAW, then built a reusable system of social media templates so the brand stays consistent across every post and flyer.",
    highlights: [
      "Logo with a \"G\" ring mark and an ascending arrow, plus a wordmark and tagline",
      "Six-colour palette and a Poppins and Inter type pairing",
      "Graphic elements, an eight-icon set and photography direction",
      "Twelve reusable social media templates for announcements, tips, spotlights and events"
    ],
    tools: ["CorelDRAW", "Brand design", "Social media design"],
    image: "images/project-go-tech.webp",
    links: []
  },
  {
    id: 4,
    name: "Crestline Brands Identity",
    category: "Branding",
    summary: "A brand identity for a design and print business, with a logo and colour system built in CorelDRAW.",
    details: "The brand identity for Crestline Brands, a design and print business. The work covers a navy, gold and white colour system, a Montserrat and Poppins type pairing, and a flat logo developed in CorelDRAW.",
    highlights: [
      "Navy, gold and white colour system",
      "Montserrat and Poppins typography pairing",
      "Flat vector logo developed in CorelDRAW"
    ],
    tools: ["CorelDRAW", "Brand design"],
    image: "images/crestline-brands.webp",
    links: []
  },
  {
    id: 5,
    name: "Professional Portfolio Website",
    category: "Web development",
    summary: "The site you are viewing, designed and built to present my work, results and experience.",
    details: "My professional portfolio, designed and built with HTML, CSS and JavaScript and published on GitHub Pages. A shared JavaScript file builds the navigation, footer and project cards on every page, so the site is easy to update.",
    highlights: [
      "Projects rendered from a JavaScript array with category filters",
      "Accessible project dialog and mobile navigation",
      "Contact form connected to a web form service",
      "Visit counter that uses localStorage"
    ],
    tools: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
    image: "images/portfolio.jpg",
    links: [
      { label: "View source on GitHub", url: "https://github.com/abdulsalam-akorede/wdd131" }
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
      if (img.parentElement) {
        img.parentElement.classList.add("placeholder");
      }
      img.remove();
    };

    img.addEventListener("error", showPlaceholder, { once: true });

    if (img.complete && img.naturalWidth === 0) {
      showPlaceholder();
    }
  });
}

// ---------- Navigation ----------

function buildNav(activePage) {
  const header = document.querySelector("#site-header");
  if (!header) return;

  const linkItems = navLinks
    .map((link) => {
      const isActive = link.page === activePage;

      return `
        <li>
          <a href="${link.href}"
             class="${isActive ? "active" : ""}"
             ${isActive ? 'aria-current="page"' : ""}>
            ${link.label}
          </a>
        </li>
      `;
    })
    .join("");

  header.innerHTML = `
    <div class="nav-container">
      <a href="index.html" class="logo">${siteInfo.name}</a>

      <button
        id="menu-toggle"
        class="menu-toggle"
        aria-label="Toggle navigation"
        aria-expanded="false"
        aria-controls="main-nav">
        &#9776;
      </button>

      <nav id="main-nav" aria-label="Main">
        <ul>${linkItems}</ul>
      </nav>
    </div>
  `;

  const toggle = document.querySelector("#menu-toggle");
  const nav = document.querySelector("#main-nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
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
            <li>
              <a href="${siteInfo.linkedin}" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a href="${siteInfo.github}" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
            <li><a href="${siteInfo.resume}" download>Resume</a></li>
          </ul>
        </div>

      </div>

      <p class="footer-bottom">
        &copy; ${new Date().getFullYear()} ${siteInfo.name}.
        <a href="references.html">References</a>
      </p>
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
  if (!container || projects.length === 0) return;

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
            <a href="projects.html?project=${project.id}" class="project-link">
              View details
            </a>
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
          <a href="projects.html?project=${main.id}" class="btn btn-outline">
            Project details
          </a>
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

            <button
              type="button"
              class="project-link"
              data-project-id="${project.id}">
              View details
            </button>
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
      renderProjects(button.dataset.category || "All");

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
  const closeButton = document.querySelector("#modal-close");

  const project = projects.find(
    (item) => item.id === Number(projectId)
  );

  if (!modal || !modalBody || !closeButton || !project) return;

  const highlights = project.highlights
    .map((item) => `<li>${item}</li>`)
    .join("");

  const tools = project.tools
    .map((tool) => `<li>${tool}</li>`)
    .join("");

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

  closeButton.focus();
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

  // Event delegation keeps working after project filtering.
  grid.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const button = target.closest("[data-project-id]");

    if (button) {
      openProjectModal(button.dataset.projectId);
    }
  });

  closeButton.addEventListener("click", closeProjectModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeProjectModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeProjectModal();
    }
  });

  const requestedId = new URLSearchParams(
    window.location.search
  ).get("project");

  if (requestedId) {
    openProjectModal(requestedId);
  }
}

// ---------- Project visit counter ----------

function trackProjectVisits() {
  const message = document.querySelector("#project-visit-count");
  if (!message) return;

  try {
    const visits =
      (Number(localStorage.getItem("projectVisits")) || 0) + 1;

    localStorage.setItem("projectVisits", String(visits));

    message.textContent =
      `You have viewed this page ${visits} time${visits === 1 ? "" : "s"}.`;

  } catch (error) {
    message.textContent = "";
  }
}

// ---------- Contact form ----------

// Your Web3Forms access key
const WEB3FORMS_ACCESS_KEY = "1e16cbfb-8f90-437c-8f29-1955353464f5";

function setFormStatus(message, type) {
  const status = document.querySelector("#form-message");
  if (!status) return;

  status.textContent = message;
  status.className = "form-message";

  if (type) {
    status.classList.add(type);
  }
}

function setupContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const submitButton = form.querySelector('button[type="submit"]');

  if (!submitButton) {
    console.error("Contact form submit button was not found.");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);

    // Check the honeypot field to help block spam.
    const honeypot = String(formData.get("_gotcha") || "").trim();

    if (honeypot !== "") {
      form.reset();
      return;
    }

    const originalButtonText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    setFormStatus("", "");

    try {
      // Add your Web3Forms access key.
      formData.set("access_key", WEB3FORMS_ACCESS_KEY);

      // Preserve the subject entered by the visitor.
      const visitorSubject = String(
        formData.get("subject") || ""
      ).trim();

      formData.set(
        "subject",
        visitorSubject || "New message from your portfolio website"
      );

      formData.set(
        "from_name",
        "Abdulsalam Oke Portfolio"
      );

      const response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json"
          }
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        form.reset();

        setFormStatus(
          "Thank you! Your message has been sent successfully. I'll get back to you soon.",
          "success"
        );
      } else {
        console.error("Web3Forms submission failed:", result);

        setFormStatus(
          `Your message could not be sent. Please email me at ${siteInfo.email}.`,
          "error"
        );
      }

    } catch (error) {
      console.error("Contact form error:", error);

      setFormStatus(
        `Something went wrong. Please try again or email me at ${siteInfo.email}.`,
        "error"
      );

    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
}

// ---------- Initialize website ----------

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
