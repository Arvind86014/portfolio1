// ===== Page Initialization =====
document.addEventListener("DOMContentLoaded", () => {
  initializeTheme();
  initializeNavigation();
  initializeAnimations();
  initializeFormValidation();
  initializeScrollToTop();
  initializeIntersectionObserver();
});

// ===== Theme Toggle =====
function initializeTheme() {
  const darkToggle = document.getElementById("darkToggle");
  const savedTheme = localStorage.getItem("theme") || "light";
  
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    updateThemeIcon(true);
  }

  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDarkMode = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    updateThemeIcon(isDarkMode);
  });
}

function updateThemeIcon(isDarkMode) {
  const icon = document.querySelector("#darkToggle i");
  if (icon) {
    icon.className = isDarkMode ? "fas fa-sun" : "fas fa-moon";
  }
}

// ===== Navigation =====
function initializeNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.querySelector(".nav-menu");

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
        if (navMenu) {
          navMenu.classList.remove("open");
          if (hamburger) hamburger.classList.remove("active");
        }
      }
    });
  });

  if (hamburger) {
    hamburger.addEventListener("click", (e) => {
      if (!navMenu) return;
      const isOpen = navMenu.classList.toggle("open");
      hamburger.classList.toggle("active");
      hamburger.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu when clicking outside, press Escape, or on resize
    document.addEventListener("click", (e) => {
      if (!navMenu || !hamburger) return;
      if (!navMenu.classList.contains("open")) return;
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        navMenu.classList.remove("open");
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navMenu && navMenu.classList.contains("open")) {
        navMenu.classList.remove("open");
        if (hamburger) hamburger.classList.remove("active");
        if (hamburger) hamburger.setAttribute("aria-expanded", "false");
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768 && navMenu && navMenu.classList.contains("open")) {
        navMenu.classList.remove("open");
        if (hamburger) hamburger.classList.remove("active");
        if (hamburger) hamburger.setAttribute("aria-expanded", "false");
      }
    });
  }
}

// ===== Form Validation =====
function initializeFormValidation() {
  const contactForm = document.getElementById("contactForm");
  
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const inputs = contactForm.querySelectorAll("input, textarea");
      let isValid = true;

      inputs.forEach(input => {
        if (!validateInput(input)) {
          isValid = false;
          showInputError(input);
        } else {
          clearInputError(input);
        }
      });

      if (isValid) {
        showSuccessMessage();
        contactForm.reset();
      }
    });

    contactForm.querySelectorAll("input, textarea").forEach(input => {
      input.addEventListener("blur", () => {
        if (validateInput(input)) {
          clearInputError(input);
        } else {
          showInputError(input);
        }
      });

      input.addEventListener("input", () => {
        clearInputError(input);
      });
    });
  }
}

function validateInput(input) {
  const value = input.value.trim();
  if (!value) return false;
  if (input.type === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }
  if (input.tagName === "TEXTAREA" && value.length < 10) return false;
  return true;
}

function showInputError(input) {
  input.style.borderColor = "#ff4444";
  input.style.boxShadow = "0 0 10px rgba(255, 68, 68, 0.2)";
}

function clearInputError(input) {
  input.style.borderColor = "";
  input.style.boxShadow = "";
}

function showSuccessMessage() {
  const msg = document.createElement("div");
  msg.innerHTML = `<div style="position:fixed;top:20px;right:20px;background:#4CAF50;color:white;padding:1rem 2rem;border-radius:8px;z-index:10000;font-weight:600;animation:slideInRight 0.5s ease;">✓ Message sent successfully!</div>`;
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 3000);
}

// ===== Scroll to Top Button =====
function initializeScrollToTop() {
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add("show");
      } else {
        scrollTopBtn.classList.remove("show");
      }
    });

    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

// ===== Animations =====
function initializeAnimations() {
  const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = "fadeIn 0.8s ease forwards";
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  document.querySelectorAll(".skill-category, .project-card, .testimonial-card, .info-card").forEach(el => {
    observer.observe(el);
  });
}

// ===== Intersection Observer =====
function initializeIntersectionObserver() {
  const elements = document.querySelectorAll(".project-card, .skill-category, .testimonial-card");
  const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -100px 0px" };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elements.forEach(element => {
    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(element);
  });
}

// ===== Counter Animation for Stats =====
function animateCounters() {
  const statsSection = document.querySelector(".stats");
  if (!statsSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const stats = document.querySelectorAll(".stat h4");
        stats.forEach(stat => {
          const target = parseInt(stat.textContent);
          animateValue(stat, 0, target, 1000);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(statsSection);
}

function animateValue(element, start, end, duration) {
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;

  const counter = setInterval(() => {
    current += increment;
    if (current >= end) {
      element.textContent = end + "+";
      clearInterval(counter);
    } else {
      element.textContent = Math.floor(current) + "+";
    }
  }, 16);
}

// Initialize counters
setTimeout(animateCounters, 500);

// Add inline animation styles
const style = document.createElement("style");
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    .nav-menu {
      position: absolute;
      top: 60px;
      right: 0;
      left: 0;
      background: white;
      flex-direction: column;
      gap: 0;
      display: none;
      padding: 1rem 0;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      z-index: 999;
      justify-content: center;
      align-items: center;
      text-align: center;
    }

    .nav-menu.open {
      display: flex !important;
      flex-direction: column;
    }

    body.dark-mode .nav-menu {
      background: rgba(10, 14, 39, 0.95);
    }

    .nav-menu li a {
      display: block;
      padding: 1rem 2rem;
      color: inherit;
    }

    .hamburger {
      display: flex;
    }

    .hamburger.active span:nth-child(1) {
      transform: rotate(45deg) translate(8px, 8px);
    }

    .hamburger.active span:nth-child(2) {
      opacity: 0;
    }

    .hamburger.active span:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -7px);
    }
  }
`;
document.head.appendChild(style);
