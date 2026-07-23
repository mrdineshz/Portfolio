// ==========================================================================
// Dinesh Kumar A — Portfolio interactions
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  setYear();
  initMobileNav();
  initScrollSpy();
  initRevealOnScroll();
  initSkillBars();
  initHeroTyping();
  initBackToTop();
  initContactForm();
});

/* ---------- footer year ---------- */
function setYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------- mobile nav toggle ---------- */
function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- highlight active nav link while scrolling ---------- */
function initScrollSpy() {
  const links = Array.from(document.querySelectorAll(".nav-link"));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length) return;

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = "#" + entry.target.id;
        const link = links.find((l) => l.getAttribute("href") === id);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove("active"));
          link.classList.add("active");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => spy.observe(section));
}

/* ---------- fade/slide elements in as they enter the viewport ---------- */
function initRevealOnScroll() {
  const targets = document.querySelectorAll(
    ".section-head, .about-body, .skill-block, .project-card, .timeline-item, .interests-block, .contact-copy, .contact-form"
  );

  targets.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ---------- animate the skill progress bars once visible ---------- */
function initSkillBars() {
  const bars = document.querySelectorAll(".skill-bar-fill");
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("filled");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  bars.forEach((bar) => observer.observe(bar));
}

/* ---------- small typing effect in the hero headline ---------- */
function initHeroTyping() {
  const el = document.getElementById("typedText");
  if (!el) return;

  const phrases = ["at a time.", "for real people.", "that just works.", "worth showing off."];
  let phraseIndex = 0;
  let charIndex = phrases[0].length;
  let deleting = false;

  const TYPE_SPEED = 55;
  const DELETE_SPEED = 32;
  const HOLD_TIME = 1800;

  function tick() {
    const current = phrases[phraseIndex];

    if (!deleting) {
      charIndex++;
      if (charIndex > current.length) {
        deleting = true;
        setTimeout(tick, HOLD_TIME);
        return;
      }
    } else {
      charIndex--;
      if (charIndex < 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        charIndex = 0;
      }
    }

    el.textContent = current.slice(0, charIndex);
    setTimeout(tick, deleting ? DELETE_SPEED : TYPE_SPEED);
  }

  // start the loop after the initial static phrase has been on screen a moment
  setTimeout(tick, HOLD_TIME);
}

/* ---------- back-to-top button visibility ---------- */
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  const toggleVisibility = () => {
    btn.style.opacity = window.scrollY > 480 ? "1" : "0.4";
  };
  toggleVisibility();
  window.addEventListener("scroll", toggleVisibility, { passive: true });
}

/* ---------- contact form validation + mailto handoff ---------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const note = document.getElementById("formNote");

  const validators = {
    name: (value) => (value.trim().length >= 2 ? "" : "Please enter your name."),
    email: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Enter a valid email address.",
    message: (value) => (value.trim().length >= 10 ? "" : "Say a little more — at least 10 characters."),
  };

  [nameInput, emailInput, messageInput].forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      const row = input.closest(".form-row");
      if (row.classList.contains("invalid")) validateField(input);
    });
  });

  function validateField(input) {
    const row = input.closest(".form-row");
    const errorEl = document.getElementById(input.id + "Error");
    const message = validators[input.id](input.value);
    row.classList.toggle("invalid", Boolean(message));
    if (errorEl) errorEl.textContent = message;
    return !message;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = [nameInput, emailInput, messageInput];
    const allValid = fields.map(validateField).every(Boolean);

    if (!allValid) {
      note.textContent = "Please fix the highlighted fields.";
      return;
    }

    const subject = encodeURIComponent(`Portfolio contact from ${nameInput.value.trim()}`);
    const body = encodeURIComponent(
      `${messageInput.value.trim()}\n\n— ${nameInput.value.trim()} (${emailInput.value.trim()})`
    );
    window.location.href = `mailto:mr.dineszz@gmail.com?subject=${subject}&body=${body}`;

    note.textContent = "Opening your email app to send this — thank you!";
    form.reset();
  });
}
