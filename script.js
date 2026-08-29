// =========================================================
// THE INDEX — startup data, rendering, filtering, and the
// "add a card" submission form.
// =========================================================

// ---- 1. Data -----------------------------------------------------------
// Swap this array for a fetch() call to your own API / Google Sheet /
// Firebase collection later — the render function only needs objects
// shaped like this.
const STARTUPS = [
  {
    name: "Loopwell",
    category: "Climate",
    description: "Sensors that tell commercial HVAC systems when they're wasting energy, in real time.",
    url: "https://example.com/loopwell",
    initials: "LW",
    color: "#2F6F62"
  },
  {
    name: "Nimbusly",
    category: "Dev tools",
    description: "One-command preview environments for every pull request, no YAML required.",
    url: "https://example.com/nimbusly",
    initials: "NB",
    color: "#E2A33D"
  },
  {
    name: "Fernbank",
    category: "Fintech",
    description: "Payroll built for teams that pay contractors in six countries and three currencies.",
    url: "https://example.com/fernbank",
    initials: "FB",
    color: "#1F2A24"
  },
  {
    name: "Harborlight",
    category: "Healthcare",
    description: "A scheduling layer that lets small clinics fill cancellations within the hour.",
    url: "https://example.com/harborlight",
    initials: "HL",
    color: "#4B7A86"
  },
  {
    name: "Quietform",
    category: "Productivity",
    description: "Turns messy voice memos into structured meeting notes your team will actually read.",
    url: "https://example.com/quietform",
    initials: "QF",
    color: "#8A6E3D"
  },
  {
    name: "Rootcellar",
    category: "AgTech",
    description: "Soil-moisture forecasting for small farms, priced per acre instead of per seat.",
    url: "https://example.com/rootcellar",
    initials: "RC",
    color: "#2F6F62"
  },
  {
    name: "Signalfare",
    category: "Logistics",
    description: "Predicts freight delays two days out by watching port and weather data together.",
    url: "https://example.com/signalfare",
    initials: "SF",
    color: "#E2A33D"
  },
  {
    name: "Tidepool Labs",
    category: "Consumer",
    description: "A swim-tracking wearable built for open water, not laps in a pool.",
    url: "https://example.com/tidepoollabs",
    initials: "TL",
    color: "#1F2A24"
  }
];

// ---- 2. Render cards -----------------------------------------------------

const grid = document.getElementById("card-grid");
const noResults = document.getElementById("no-results");
const resultCount = document.getElementById("result-count");

function cardTemplate(startup, index) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.name = startup.name.toLowerCase();
  card.dataset.description = startup.description.toLowerCase();
  card.dataset.category = startup.category.toLowerCase();

  card.innerHTML = `
    <div class="card-top">
      <div class="logo" style="background:${startup.color}">${startup.initials}</div>
      <div class="card-title">
        <span class="card-name">${startup.name}</span>
        <span class="card-category">${startup.category}</span>
      </div>
    </div>
    <p class="card-desc">${startup.description}</p>
    <div class="card-bottom">
      <a class="card-link" href="${startup.url}" target="_blank" rel="noopener noreferrer">
        Visit site ↗
      </a>
      <span class="card-stamp">No. ${String(index + 1).padStart(2, "0")}</span>
    </div>
  `;
  return card;
}

function renderCards(list) {
  grid.innerHTML = "";
  list.forEach((startup, i) => grid.appendChild(cardTemplate(startup, i)));
}

renderCards(STARTUPS);
updateCount(STARTUPS.length);

// ---- 3. Search / filter ---------------------------------------------------

const searchInput = document.getElementById("search-input");

function updateCount(n) {
  resultCount.textContent = `${n} card${n === 1 ? "" : "s"}`;
}

function filterCards(query) {
  const q = query.trim().toLowerCase();
  const cards = Array.from(grid.querySelectorAll(".card"));
  let visibleCount = 0;

  cards.forEach((card) => {
    const matches =
      q === "" ||
      card.dataset.name.includes(q) ||
      card.dataset.description.includes(q) ||
      card.dataset.category.includes(q);

    if (matches) {
      card.hidden = false;
      // let the browser register "hidden = false" before removing
      // the animated class, so the fade/scale-in transition plays
      requestAnimationFrame(() => card.classList.remove("is-hidden"));
      visibleCount++;
    } else {
      card.classList.add("is-hidden");
      // wait for the CSS transition to finish before removing the
      // card from layout, so the grid reflows smoothly
      card.addEventListener(
        "transitionend",
        () => {
          if (card.classList.contains("is-hidden")) card.hidden = true;
        },
        { once: true }
      );
    }
  });

  updateCount(visibleCount);
  noResults.hidden = visibleCount !== 0;
}

let debounceId;
searchInput.addEventListener("input", (e) => {
  clearTimeout(debounceId);
  const value = e.target.value;
  debounceId = setTimeout(() => filterCards(value), 120);
});

// ---- 4. Submission form -----------------------------------------------

const form = document.getElementById("submit-form");
const descField = document.getElementById("startup-desc");
const charCount = document.getElementById("char-count");
const status = document.getElementById("form-status");

descField.addEventListener("input", () => {
  const remaining = 140 - descField.value.length;
  charCount.textContent = remaining;
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("startup-name").value.trim();
  const url = document.getElementById("startup-url").value.trim();
  const description = descField.value.trim();

  if (!name || !url || !description) {
    status.textContent = "Fill in every field before filing the card.";
    status.style.color = "#B3492E";
    return;
  }

  // ---------------------------------------------------------------------
  // No backend is wired up yet. This is where you'd send the data on,
  // e.g. to Firebase or a Google Sheet — see README.md for notes on
  // both options. For now the new card is just added to the grid so
  // the interaction is complete end to end.
  // ---------------------------------------------------------------------
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  STARTUPS.push({
    name,
    category: "Just filed",
    description,
    url,
    initials: initials || "??",
    color: "#2F6F62"
  });

  renderCards(STARTUPS);
  filterCards(searchInput.value);

  form.reset();
  charCount.textContent = "140";
  status.textContent = `${name} was added to the drawer.`;
  status.style.color = "#2F6F62";
});
