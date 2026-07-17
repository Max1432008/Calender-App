const JAHR = 2026;
const MONAT = 1;

const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");
const todayButton = document.getElementById("today");

prevMonthButton.addEventListener("click", () => {
  // Logic to go to the previous month
  console.log("Previous month button clicked");
  prevMonthButton.classList.add("nav-button-moveLeft");
});

nextMonthButton.addEventListener("click", () => {
  // Logic to go to the next month
  console.log("Next month button clicked");
  nextMonthButton.classList.add("nav-button-moveRight");
});

todayButton.addEventListener("click", () => {
  // Logic to go to today's date
  console.log("Today button clicked");
  todayButton.classList.add("nav-button-moveToday");
});

//* Add event listeners for animation end to remove the animation classes

prevMonthButton.addEventListener("animationend", () => {
  prevMonthButton.classList.remove("nav-button-moveLeft");
});
nextMonthButton.addEventListener("animationend", () => {
  nextMonthButton.classList.remove("nav-button-moveRight");
});
todayButton.addEventListener("animationend", () => {
  todayButton.classList.remove("nav-button-moveToday");
});

//*
//*
//*    Search input      */

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

let clickingButton = false;

// --- Sichtbarkeit des Such-Buttons ---

function searchButtonShow() {
  searchButton.classList.add("search-input-focus");
}

function searchButtonHide() {
  searchButton.classList.remove("search-input-focus");
  searchButton.classList.remove("search-click-animation");
}

function searchButtonClickAnimation() {
  searchButton.classList.add("search-click-animation");
}

// --- Event Listener: Input ---

searchInput.addEventListener("focus", () => {
  searchButtonShow();
  searchButtonClickAnimation();
});

searchInput.addEventListener("focusout", () => {
  if (clickingButton) {
    // Klick auf den Button war der Grund für den Fokusverlust -> nicht verstecken
    clickingButton = false;
    return;
  }
  searchButtonHide();
});

// --- Event Listener: Button ---

// mousedown feuert VOR focusout, deshalb setzen wir hier das Flag
searchButton.addEventListener("mousedown", () => {
  clickingButton = true;
});

searchButton.addEventListener("click", () => {
  searchButtonShow();
  searchButtonClickAnimation();
  searchInput.focus(); // optional: Fokus zurück ins Suchfeld
});

//!!!       ––––––––
function getDaysInMonth(jahr, month) {
  const tage = new Date(jahr, month, 0).getDate();
  let firstDay = new Date(jahr, month - 1, 1).getDay(); // 0 = Sonntag, 1 = Montag, ..., 6 = Samstag
  firstDay = (firstDay + 6) % 7; // Umwandlung: 0 = Montag, 1 = Dienstag, ..., 6 = Sonntag

  return { tage, firstDay };
}

function updateMonthTitle(jahr, month) {
  const monthNames = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ];

  const monthName = document.querySelector(".month-name");

  monthName.textContent = `${monthNames[month - 1]}`;
}

let month_count = 0;
const { tage: max_month_days, firstDay } = getDaysInMonth(JAHR, MONAT);
updateMonthTitle(JAHR, MONAT);

let start = 0;
while (start < firstDay) {
  const placeholder = document.createElement("div");
  placeholder.classList.add("empty-day");
  document.getElementById("grid-container").appendChild(placeholder);
  start += 1;
}

while (month_count <= max_month_days - 1) {
  // -1, da month_count bei 0 startet
  month_count += 1;

  const template = document.getElementById("calender-day");
  const klon = template.content.cloneNode(true);
  const container_calender = klon.querySelector(".container-calender");
  const calender_day = container_calender.querySelector(".date-headline");
  calender_day.textContent = month_count;

  const WochenendPosition = (firstDay + month_count - 1) % 7;
  if (WochenendPosition == 5 || WochenendPosition == 6) {
    container_calender.style.backgroundColor = "var(--border-weekend)";
  }

  document.getElementById("grid-container").appendChild(klon);
  createEvent(container_calender);
  createEvent(container_calender);
  if (month_count == 5) {
    createEvent(container_calender);
    createEvent(container_calender);
  }
}

console.log(getDaysInMonth(JAHR, MONAT));

//!         ––––––––––– */
const yearList = document.getElementById("yearList");

const currentYear = JAHR;

for (let i = currentYear - 50; i <= currentYear + 50; i++) {
  let year = document.createElement("div");

  year.className = "year";
  year.textContent = i;

  yearList.appendChild(year);
}

// aktuelles Jahr in die Mitte scrollen
const current = [...document.querySelectorAll(".year")].find(
  (y) => y.textContent == currentYear,
);

const monthList = document.getElementById("monthList");

if (monthList) {
  const months = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ];

  months.forEach((month) => {
    const element = document.createElement("div");

    element.className = "month";
    element.textContent = month;

    monthList.appendChild(element);
  });
}

current.scrollIntoView({
  block: "center",
});

// Auswahl ändern
yearList.addEventListener("scroll", () => {
  let years = document.querySelectorAll(".year");

  years.forEach((year) => {
    let rect = year.getBoundingClientRect();
    let parent = yearList.getBoundingClientRect();

    let center = parent.top + parent.height / 2;

    if (Math.abs(rect.top + rect.height / 2 - center) < 15) {
      years.forEach((y) => y.classList.remove("selected"));
      year.classList.add("selected");

      console.log("Ausgewählt:", year.textContent);
    }
  });
});
