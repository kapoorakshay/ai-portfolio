const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav__toggle");
const menu = document.querySelector("#nav-menu");
const navLinks = document.querySelectorAll(".nav__link");
const sections = document.querySelectorAll("main section[id]");
const form = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

function setMenuOpen(isOpen) {
  nav.classList.toggle("is-open", isOpen);
  toggle.setAttribute("aria-expanded", String(isOpen));
  toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
}

toggle.addEventListener("click", () => {
  setMenuOpen(!nav.classList.contains("is-open"));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenuOpen(false);
  }
});

function setActiveLink() {
  const offset = window.scrollY + 120;
  let currentId = "home";

  sections.forEach((section) => {
    if (section.offsetTop <= offset) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentId}`;
    link.classList.toggle("is-active", isActive);
  });
}

window.addEventListener("scroll", setActiveLink, { passive: true });
setActiveLink();

const revealTargets = document.querySelectorAll(".section");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((section) => observer.observe(section));
} else {
  revealTargets.forEach((section) => section.classList.add("is-visible"));
}

function showError(fieldId, message) {
  const field = document.querySelector(`#${fieldId}`).closest(".form-field");
  const error = document.querySelector(`#${fieldId}-error`);
  field.classList.add("is-invalid");
  error.hidden = false;
  error.textContent = message;
}

function clearErrors() {
  form.querySelectorAll(".form-field").forEach((field) => {
    field.classList.remove("is-invalid");
  });
  form.querySelectorAll(".field-error").forEach((error) => {
    error.hidden = true;
    error.textContent = "";
  });
  formStatus.hidden = true;
  formStatus.classList.remove("is-success", "is-error");
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  let isValid = true;

  if (!name) {
    showError("name", "Please enter your name.");
    isValid = false;
  }

  if (!email) {
    showError("email", "Please enter your email.");
    isValid = false;
  } else if (!isValidEmail(email)) {
    showError("email", "Please enter a valid email address.");
    isValid = false;
  }

  if (!message) {
    showError("message", "Please enter a message.");
    isValid = false;
  }

  formStatus.hidden = false;

  if (!isValid) {
    formStatus.classList.add("is-error");
    formStatus.textContent = "Please fix the errors above and try again.";
    return;
  }

  formStatus.classList.add("is-success");
  formStatus.textContent =
    "Thanks! Your message was validated locally. This demo does not send email yet.";
  form.reset();
});
