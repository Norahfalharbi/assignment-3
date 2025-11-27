// Get the current date and time
const now = new Date();
let greeting;

// Check the current hour and decide which greeting to use
if (now.getHours() < 12) {
  greeting = "Good Morning";
} else if (now.getHours() < 18) {
  greeting = "Good Afternoon";
} else {
  greeting = "Good Evening";
}
// Check if the user's name is already stored in localStorage
let userName = localStorage.getItem("userName");
if(!userName){
    userName=prompt("Hi! what is your name?");
    if(userName){
        localStorage.setItem("userName", userName);
    }   
 
}
function showToast(message) {
  const toast = document.getElementById("greetingToast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 10000); // hides after 4 seconds
}
const hh = now.getHours().toString().padStart(2, "0");
const mm = now.getMinutes().toString().padStart(2, "0");

showToast(`${greeting} ${userName}! Time Now is ${hh}:${mm}`);


// ===== Project Filter with Search =====
document.addEventListener("DOMContentLoaded", () => {
  const filterBar   = document.querySelector(".filter");
  const cards       = Array.from(document.querySelectorAll(".projects-grid .card"));
  const grid = document.querySelector(".projects-grid");
  const emptyState  = document.getElementById("emptyState");
  const searchInput = document.getElementById("searchInput"); 
    const sortSelect  = document.getElementById("sortProjects");

  let currentFilter = "all";
  let currentSearch = "";
  let currentSort   = "none";

//sort event listener
function sortCards() {
  if (!grid || currentSort === "none") return;

  const sorted = [...cards];

  if (currentSort === "az") {
    // Sort alphabetically by title
    sorted.sort((a, b) => {
      const ta = (a.dataset.title || "").toLowerCase();
      const tb = (b.dataset.title || "").toLowerCase();
      return ta.localeCompare(tb);
    });
  }

  else if (currentSort === "date") {
    // Sort by date (newest first)
    sorted.sort((a, b) => {
      const da = new Date(a.dataset.date);
      const db = new Date(b.dataset.date);
      return db - da; // newest → oldest
    });
  }

  // Re-append in sorted order
  sorted.forEach(card => grid.appendChild(card));
}
  

//filter and search function
  function applyFilter(value, query) {
  let anyVisible = false;

    cards.forEach(card => {
      const category = (card.dataset.category || "").toLowerCase();
      const text = (card.textContent || "").toLowerCase();
      const matchesFilter = value === "all" || category === value;
      const matchesSearch = !query || text.includes(query);
      const shouldShow = matchesFilter && matchesSearch;

      if (shouldShow) {
        // show with fade-in
        card.style.display = "block";
        card.classList.add("is-hiding");
        void card.offsetWidth; // reflow
        card.classList.remove("is-hiding");
        anyVisible = true;
      } else {
        // fade-out then hide
        if (!card.classList.contains("is-hiding")) {
          card.classList.add("is-hiding");
          card.addEventListener("transitionend", function handler() {
            card.style.display = "none";
            card.removeEventListener("transitionend", handler);
          }, { once: true });
        }
      }
    });

    emptyState.style.display = anyVisible ? "none" : "block";
  }

  // click-to-filter (event delegation)
  if (filterBar) {
    filterBar.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-filter]");
      if (!btn) return;

      // active state + accessibility
      filterBar.querySelectorAll("button").forEach(b => {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });

      currentFilter = btn.dataset.filter.toLowerCase();
      applyFilter(currentFilter, currentSearch);
    });

    // live search input
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        currentSearch = e.target.value.trim().toLowerCase();
        applyFilter(currentFilter, currentSearch);
      });
    }
  // sort select
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      sortCards();
      applyFilter(currentFilter, currentSearch);
    });
  }

    // initial load: "all"
    applyFilter("all", "");
  }
});
//show/hide card details
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".details-btn");
  if (!btn) return;

  const detailsId = btn.getAttribute("aria-controls");
  const details = document.getElementById(detailsId);
  const card = btn.closest(".card");
  const isOpen = btn.getAttribute("aria-expanded") === "true";

  //close others so only one open at a time
  document.querySelectorAll(".card-details:not([hidden])").forEach(p => {
    if (p !== details) {
      const otherBtn  = document.querySelector(`.details-btn[aria-controls="${p.id}"]`);
      const otherCard = otherBtn?.closest(".card");
      otherBtn?.setAttribute("aria-expanded", "false");
      if (otherBtn) otherBtn.textContent = "Show Details";
      p.classList.remove("open");
      setTimeout(() => { p.hidden = true; }, 300);
      otherCard?.classList.remove("expanded");
    }
  });

  // Toggle current
  btn.setAttribute("aria-expanded", String(!isOpen));
  btn.textContent = isOpen ? "Show Details" : "Hide Details";
   
  if (isOpen) {
    details.classList.remove("open");
    setTimeout(() => { details.hidden = true; }, 300);
  } else {
    details.hidden = false;
    requestAnimationFrame(() => details.classList.add("open"));
  }
});
// ===== Two-button theme switcher (Dark / Light) =====
document.addEventListener("DOMContentLoaded", () => {
  const lightBtn = document.getElementById("lightBtn");
  const darkBtn = document.getElementById("darkBtn");

  // load saved preference or system preference
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = saved || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", initial);
  updateActiveButton(initial);
 // helper to update active button styles
  function updateActiveButton(theme) {
    if (theme === "dark") {
      darkBtn.classList.add("active");
      lightBtn.classList.remove("active");
    } else {
      lightBtn.classList.add("active");
      darkBtn.classList.remove("active");
    }
  }
// helper to set theme
  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    updateActiveButton(theme);
  }

  lightBtn.addEventListener("click", () => setTheme("light"));
  darkBtn.addEventListener("click", () => setTheme("dark"));
});

// === Fetch and display books from Google Books API ===
const button = document.getElementById("loadBooks");
const list = document.getElementById("booksList");
const status = document.getElementById("booksStatus");

button.addEventListener("click", function () {
  status.textContent = "Loading...";
  list.innerHTML = "";
// Fetch books about programming
fetch("https://www.googleapis.com/books/v1/volumes?q=programming+books&maxResults=5")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      const items = data.items;
      list.innerHTML = "";
      for (let i = 0; i < items.length; i++) {
        const info = items[i].volumeInfo;
       if (!info.imageLinks || !info.imageLinks.thumbnail) continue;
       //remove books without images 
       const img = info.imageLinks.thumbnail;
        const authors = info.authors ? info.authors.join(", ") : "Unknown Author";

        list.innerHTML += `
          <div class="book-card">
            <img src="${img}" alt="${info.title || "Book"}">
            <h3>${info.title || "Untitled"}</h3>
            <p>${authors}</p>
          </div>
        `;
      }
      status.textContent = "";
    }) // error handling
    .catch(function (err) {
      console.error(err);
      status.textContent = "Sorry, we have an error!";
    });
});
const timeOnSiteEl = document.getElementById("timeOnSite");
if (timeOnSiteEl) {
  let seconds = 0;
  setInterval(() => {
    seconds++;
    // format mm:ss
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    timeOnSiteEl.textContent = `${mins}:${secs}`;
  }, 1000);
}


// === Native field validation (+ success message) ===
document.addEventListener("DOMContentLoaded", () => {
  const form      = document.getElementById("contactForm");
  const nameEl    = document.getElementById("name");
  const emailEl   = document.getElementById("email");
  const messageEl = document.getElementById("message");
  const msg       = document.getElementById("formMessage");
//if any element is missing, return null
  if (!form || !nameEl || !emailEl || !messageEl || !msg) return;

  // --- Name ---
  nameEl.addEventListener("invalid", function () {
    this.setCustomValidity(""); // reset first
    if (this.validity.valueMissing) {
      this.setCustomValidity("Name is required.");
    }
  });
  nameEl.addEventListener("input", function () {
    this.setCustomValidity("");
  });

  // --- Email ---
  emailEl.addEventListener("invalid", function () {
    this.setCustomValidity(""); // reset first
    if (this.validity.valueMissing) {
      this.setCustomValidity("Email is required.");
    } else if (this.validity.typeMismatch) {
      this.setCustomValidity("Enter a valid email address (must include '@' and '.')."); 
    }
  });
  emailEl.addEventListener("input", function () {
    this.setCustomValidity("");
  });

  // --- Message ---
  messageEl.addEventListener("invalid", function () {
    this.setCustomValidity(""); // reset first
    if (this.validity.valueMissing) {
      this.setCustomValidity("Message is required.");
    }
  });
  messageEl.addEventListener("input", function () {
    this.setCustomValidity("");
  });

  // --- Submit: let browser validate first, then show success ---
  form.addEventListener("submit", function (e) {
 if (!form.checkValidity()) {
    e.preventDefault();
    msg.textContent = "Please fill out all required fields correctly.";
    msg.classList.remove("success");
    msg.classList.add("error");
    form.reportValidity();  
    return;
  }

  // success:
  e.preventDefault();
  msg.textContent = "Thank you! Your message has been sent successfully.";
  msg.classList.remove("error");
  msg.classList.add("success");

  form.reset();

  setTimeout(() => {
    msg.textContent = "";
    msg.classList.remove("success");
  }, 4000);
});
});

