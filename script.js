"use strict";

const body = document.body;
const loader = document.getElementById("loader");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const menuButton = document.getElementById("menuButton");
const themeToggle = document.getElementById("themeToggle");
const backTop = document.getElementById("backTop");
const navLinks = document.querySelectorAll("[data-nav-link]");
const likeFormatter = new Intl.NumberFormat("en-US");

function setMenu(open) {
  sidebar.classList.toggle("open", open);
  body.classList.toggle("menu-open", open);
  overlay.hidden = !open;
  menuButton.setAttribute("aria-expanded", String(open));
}

function setTheme(theme) {
  const isDark = theme === "dark";
  body.classList.toggle("dark", isDark);
  themeToggle.setAttribute("aria-pressed", String(isDark));
  localStorage.setItem("instagram-clone-theme", theme);
}

function preferredTheme() {
  const saved = localStorage.getItem("instagram-clone-theme");

  if (saved) {
    return saved;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function animateLikeButton(button) {
  button.classList.remove("like-burst");
  window.requestAnimationFrame(() => button.classList.add("like-burst"));
}

function updateLike(button, liked) {
  const post = button.closest(".post-card");
  const countElement = post.querySelector("[data-like-count]");
  const baseCount = Number(button.dataset.count);

  button.classList.toggle("liked", liked);
  button.setAttribute("aria-pressed", String(liked));
  countElement.textContent = `${likeFormatter.format(baseCount + (liked ? 1 : 0))} others`;

  if (liked) {
    animateLikeButton(button);
  }
}

function pulseImageHeart(image) {
  const media = image.closest(".post-media");
  media.classList.remove("heart-pop");
  window.requestAnimationFrame(() => media.classList.add("heart-pop"));
}

window.addEventListener("load", () => {
  window.setTimeout(() => loader.classList.add("hidden"), 450);
});

setTheme(preferredTheme());

menuButton.addEventListener("click", () => {
  setMenu(!sidebar.classList.contains("open"));
});

overlay.addEventListener("click", () => setMenu(false));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenu(false);
  }
});

themeToggle.addEventListener("click", () => {
  setTheme(body.classList.contains("dark") ? "light" : "dark");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
    setMenu(false);
  });
});

document.querySelectorAll("[data-like]").forEach((button) => {
  button.addEventListener("click", () => {
    updateLike(button, !button.classList.contains("liked"));
  });
});

document.querySelectorAll("[data-save]").forEach((button) => {
  button.addEventListener("click", () => {
    const saved = !button.classList.contains("saved");
    button.classList.toggle("saved", saved);
    button.setAttribute("aria-pressed", String(saved));
  });
});

document.querySelectorAll("[data-double-like]").forEach((image) => {
  image.addEventListener("dblclick", () => {
    const likeButton = image.closest(".post-card").querySelector("[data-like]");

    if (!likeButton.classList.contains("liked")) {
      updateLike(likeButton, true);
    }

    pulseImageHeart(image);
  });
});

document.querySelectorAll(".story button").forEach((button) => {
  button.addEventListener("click", () => {
    button.closest(".story").classList.add("story--viewed");
  });
});

document.querySelectorAll(".comment-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector("input");

    if (input.value.trim()) {
      input.value = "";
      input.placeholder = "Comment posted";
    }
  });
});

window.addEventListener("scroll", () => {
  backTop.classList.toggle("show", window.scrollY > 600);
});

backTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const link = document.querySelector(`[data-nav-link][href="#${entry.target.id}"]`);

      if (link) {
        navLinks.forEach((item) => item.classList.remove("active"));
        link.classList.add("active");
      }
    });
  },
  { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 }
);

document.querySelectorAll("#home, .posts > article[id]").forEach((section) => navObserver.observe(section));
