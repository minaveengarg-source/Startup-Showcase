const STARTUPS = [
  { name: "Loopwell", category: "Climate", description: "Sensors that tell commercial HVAC systems when they're wasting energy, in real time.", url: "https://example.com/loopwell", initials: "LW", color: "#2F6F62" },
  { name: "Nimbusly", category: "Dev Tools", description: "One-command preview environments for every pull request, no YAML required.", url: "https://example.com/nimbusly", initials: "NB", color: "#E2A33D" },
  { name: "Fernbank", category: "Fintech", description: "Payroll built for teams that pay contractors in six countries and three currencies.", url: "https://example.com/fernbank", initials: "FB", color: "#1F2A24" },
  { name: "Harborlight", category: "Healthcare", description: "A scheduling layer that lets small clinics fill cancellations within the hour.", url: "https://example.com/harborlight", initials: "HL", color: "#4B7A86" },
  { name: "Quietform", category: "Productivity", description: "Turns messy voice memos into structured meeting notes your team will actually read.", url: "https://example.com/quietform", initials: "QF", color: "#8A6E3D" },
  { name: "Rootcellar", category: "AgTech", description: "Soil-moisture forecasting for small farms, priced per acre instead of per seat.", url: "https://example.com/rootcellar", initials: "RC", color: "#2F6F62" },
  { name: "Signalfare", category: "Logistics", description: "Predicts freight delays two days out by watching port and weather data together.", url: "https://example.com/signalfare", initials: "SF", color: "#E2A33D" },
  { name: "Tidepool Labs", category: "Consumer", description: "A swim-tracking wearable built for open water, not laps in a pool.", url: "https://example.com/tidepoollabs", initials: "TL", color: "#1F2A24" }
];

const grid = document.getElementById("card-grid");
const noResults = document.getElementById("no-results");
const resultCount = document.getElementById("result-count");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");

function updateCategories() {
  const categories = [...new Set(STARTUPS.map(s => s.category))].sort();
  categoryFilter.innerHTML = '<option value="all">All categories</option>' +
    categories.map(c => `<option value="${c.toLowerCase()}">${c}</option>`).join("");
}

function cardTemplate(startup, index) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.name = startup.name.toLowerCase();
  card.dataset.description = startup.description.toLowerCase();
  card.dataset.category = startup.category.toLowerCase();

  const top = document.createElement("div");
  top.className = "card-top";
  const logo = document.createElement("div");
  logo.className = "logo";
  logo.style.background = startup.color;
  logo.textContent = startup.initials;
  logo.setAttribute("aria-label", `${startup.name} logo`);
  const title = document.createElement("div");
  title.className = "card-title";
  const name = document.createElement("span"); name.className = "card-name"; name.textContent = startup.name;
  const category = document.createElement("span"); category.className = "card-category"; category.textContent = startup.category;
  title.append(name, category); top.append(logo, title);

  const desc = document.createElement("p"); desc.className = "card-desc"; desc.textContent = startup.description;
  const bottom = document.createElement("div"); bottom.className = "card-bottom";
  const link = document.createElement("a"); link.className = "card-link"; link.href = startup.url; link.target = "_blank"; link.rel = "noopener noreferrer"; link.textContent = "Visit site ↗";
  const stamp = document.createElement("span"); stamp.className = "card-stamp"; stamp.textContent = `No. ${String(index + 1).padStart(2, "0")}`;
  bottom.append(link, stamp); card.append(top, desc, bottom);
  return card;
}

function renderCards() {
  grid.innerHTML = "";
  STARTUPS.forEach((startup, i) => grid.appendChild(cardTemplate(startup, i)));
}

function filterCards() {
  const q = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const cards = [...grid.querySelectorAll(".card")];
  let visible = 0;

  cards.forEach(card => {
    const matchesSearch = !q || card.dataset.name.includes(q) || card.dataset.description.includes(q) || card.dataset.category.includes(q);
    const matchesCategory = category === "all" || card.dataset.category === category;
    const match = matchesSearch && matchesCategory;
    card.hidden = !match;
    card.classList.toggle("is-hidden", !match);
    if (match) visible++;
  });

  resultCount.textContent = `${visible} card${visible === 1 ? "" : "s"}`;
  noResults.hidden = visible !== 0;
}

updateCategories();
renderCards();
filterCards();
searchInput.addEventListener("input", filterCards);
categoryFilter.addEventListener("change", filterCards);

const form = document.getElementById("submit-form");
const descField = document.getElementById("startup-desc");
const charCount = document.getElementById("char-count");
const status = document.getElementById("form-status");

descField.addEventListener("input", () => {
  charCount.textContent = 140 - descField.value.length;
});

form.addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("startup-name").value.trim();
  const url = document.getElementById("startup-url").value.trim();
  const description = descField.value.trim();

  if (!name || !url || !description) {
    status.textContent = "Please fill in every field.";
    return;
  }
  try { new URL(url); } catch {
    status.textContent = "Please enter a valid website URL, e.g. https://example.com";
    return;
  }

  const initials = name.split(/\s+/).map(word => word[0]).join("").slice(0, 2).toUpperCase() || "??";
  STARTUPS.push({ name, category: "Just Filed", description, url, initials, color: "#2F6F62" });
  updateCategories();
  renderCards();
  searchInput.value = "";
  categoryFilter.value = "all";
  filterCards();
  form.reset();
  charCount.textContent = "140";
  status.textContent = `${name} was added to the showcase.`;
});
