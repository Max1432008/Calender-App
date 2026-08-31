const DATE = new Date();
const DAY = DATE.getDate();
const TODAY_MONAT = DATE.getMonth() + 1;
const TODAY_JAHR = DATE.getFullYear();

let JAHR = DATE.getFullYear();
let MONAT = DATE.getMonth() + 1;

const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");
const todayButton = document.getElementById("today");

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
const search_append = document.getElementById("search-append");

let clickingButton = false;

// --- Sichtbarkeit des Such-Buttons ---

function searchButtonShow() {
  searchButton.classList.add("search-input-focus");
  search_append.classList.toggle("search-append-out");
}

function searchButtonHide() {
  searchButton.classList.remove("search-input-focus");
  searchButton.classList.remove("search-click-animation");
  search_append.classList.remove("search-append-out");
  search_append.innerHTML = "";
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
  typeText(monthName, `${monthNames[month - 1]} ${JAHR}`);
  //monthName.textContent = `${monthNames[month - 1]} ${JAHR}`;
}

let month_count = 0;
updateMonthTitle(JAHR, MONAT);
let start = 0;

let alleEvents = [];

async function loadEvents() {
  alleEvents = await upload_kalender_typen();
  console.log("EVENTS GELADEN:", alleEvents);
  console.log("Anfang:", alleEvents[4].time_start);
}

async function create_calender_day() {
  start = 0;
  month_count = 0;

  let { tage: max_month_days, firstDay } = getDaysInMonth(JAHR, MONAT);

  const grid = document.getElementById("grid-container");

  while (grid.children.length > 7) {
    grid.removeChild(grid.lastElementChild);
  }

  while (start < firstDay) {
    const placeholder = document.createElement("div");
    placeholder.classList.add("empty-day");
    grid.appendChild(placeholder);
    start += 1;
  }

  while (month_count <= max_month_days - 1) {
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

    if (month_count == DAY && MONAT == TODAY_MONAT && JAHR == TODAY_JAHR) {
      container_calender.style.backgroundColor = "var(--today-bg)";
      container_calender.style.border = "1px solid var(--today-border)";
    }

    grid.appendChild(klon);

    await renderEventsForDay(
      container_calender,
      JAHR,
      MONAT,
      month_count,
      alleEvents,
    );
  }
}

async function initCalendar() {
  await loadEvents();
  await create_calender_day();
}

initCalendar();

async function next_month() {
  MONAT += 1;
  if (MONAT > 12) {
    MONAT = 1;
    JAHR += 1;
  }
  updateMonthTitle(JAHR, MONAT);
  await create_calender_day();
}

async function prev_month() {
  MONAT -= 1;
  if (MONAT < 1) {
    MONAT = 12;
    JAHR -= 1;
  }
  updateMonthTitle(JAHR, MONAT);
  await create_calender_day();
}

async function today_month() {
  const heute = new Date();

  const aktuellerMonat = heute.getMonth() + 1;
  const aktuellesJahr = heute.getFullYear();

  MONAT = aktuellerMonat;
  JAHR = aktuellesJahr;
  console.log(aktuellerMonat);
  console.log(aktuellesJahr);
  updateMonthTitle(JAHR, MONAT);
  await create_calender_day();
}

prevMonthButton.addEventListener("click", () => {
  // Logic to go to the previous month
  prevMonthButton.classList.add("nav-button-moveLeft");

  prev_month();
});

nextMonthButton.addEventListener("click", () => {
  // Logic to go to the next month
  nextMonthButton.classList.add("nav-button-moveRight");

  next_month();
});

todayButton.addEventListener("click", () => {
  // Logic to go to today's date
  todayButton.classList.add("nav-button-moveToday");

  today_month();
});
