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
  console.log("hier ist der klick");
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
  console.log("hier ist der klick");

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

  monthName.textContent = `${monthNames[month - 1]} ${JAHR}`;
}

let month_count = 0;
updateMonthTitle(JAHR, MONAT);
let start = 0;

function create_calender_day() {
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

    if (month_count == DAY && MONAT == TODAY_MONAT && JAHR == TODAY_JAHR) {
      container_calender.style.backgroundColor = "var(--today-bg)";
    }

    document.getElementById("grid-container").appendChild(klon);
    createEvent(container_calender);
    createEvent(container_calender);
    if (month_count == 5) {
      createEvent(container_calender);
      createEvent(container_calender);
    }
  }
}
create_calender_day();

console.log(getDaysInMonth(JAHR, MONAT));

function next_month() {
  MONAT += 1;
  if (MONAT >= 12) {
    MONAT = 1;
    JAHR += 1;
  }
  updateMonthTitle(JAHR, MONAT);
  create_calender_day();
}

function prev_month() {
  MONAT -= 1;
  if (MONAT <= 1) {
    MONAT = 12;
    JAHR -= 1;
  }
  updateMonthTitle(JAHR, MONAT);
  create_calender_day();
}

function today_month() {
  const heute = new Date();

  const aktuellerMonat = heute.getMonth() + 1;
  const aktuellesJahr = heute.getFullYear();

  MONAT = aktuellerMonat;
  JAHR = aktuellesJahr;
  console.log(aktuellerMonat);
  console.log(aktuellesJahr);
  updateMonthTitle(JAHR, MONAT);
  create_calender_day();
}

prevMonthButton.addEventListener("click", () => {
  // Logic to go to the previous month
  console.log("Previous month button clicked");
  prevMonthButton.classList.add("nav-button-moveLeft");

  prev_month();
});

nextMonthButton.addEventListener("click", () => {
  // Logic to go to the next month
  console.log("Next month button clicked");
  nextMonthButton.classList.add("nav-button-moveRight");

  next_month();
});

todayButton.addEventListener("click", () => {
  // Logic to go to today's date
  console.log("Today button clicked");
  todayButton.classList.add("nav-button-moveToday");

  today_month();
});

//*
//*
//*     –––––         Ansicht von der Switchbar oben  –––––––
//*
const viewContent = document.getElementById("view-content");
const calenderLook = document.querySelector(".calender-look");
const viewButtons = document.querySelectorAll(".calender-look > button");

let draftKalender_event = { name: "", shared_with: "", color: "" };

function moveViewContent(button) {
  const btnRect = button.getBoundingClientRect();
  const parentRect = calenderLook.getBoundingClientRect();

  viewContent.style.width = btnRect.width + "px";
  viewContent.style.height = btnRect.height + "px";
  viewContent.style.left = btnRect.left - parentRect.left + "px";
  viewContent.style.top = btnRect.top - parentRect.top + "px";
}

viewButtons.forEach((btn) => {
  btn.addEventListener("click", () => moveViewContent(btn));
});

document.addEventListener("DOMContentLoaded", () => {
  const month_view = document.getElementById("month-view");
  moveViewContent(month_view);
});

const add_Event_btn = document.getElementById("add-Event");
const append_Event = document.getElementById("append-Event");

const More_Envent_Info = document.getElementById("More-Envent-Info");

function update_selet_btn(sheet, draftKalender_event) {
  console.log("update_selet_btn");
  console.log(draftKalender_event);
  console.log(sheet);
  console.log(sheet.children);
  const select_button = sheet.querySelector(".select-button");
  const circle = sheet.querySelector(".circle");

  select_button.textContent = draftKalender_event.name;
  const farbe = calendarColors.find(
    (color) => color.name.trim() === draftKalender_event.color.trim(),
  );
  circle.style.background = `var(${farbe.var})`;
  circle.dataset.color = farbe.id;
}

function color_button_click(sheet, kalender_btn, kalender) {
  // Implementation for color button click
  kalender_btn.addEventListener("click", (event) => {
    event.stopPropagation();
    console.log("Color button clicked for:", kalender.titel, kalender.color);
    draftKalender_event.color = kalender.color;
    draftKalender_event.name = kalender.titel;
    draftKalender_event.shared_with = kalender.shared_with;
    // Additional logic for handling the color button click can be added here
    update_selet_btn(sheet, draftKalender_event);
  });
}

function upload_kalender_color(sheet, select_append) {
  fetch("/get-kalneder-typen")
    .then((response) => response.json())
    .then((data) => {
      select_append.innerHTML = "";
      data.message.forEach((kalender) => {
        const color_klon = new_kalender_color.content.cloneNode(true);

        color_klon.querySelector(".color-name").textContent = kalender.titel;

        const farbe = calendarColors.find(
          (color) => color.name.trim() === kalender.color.trim(),
        );

        const circle = color_klon.querySelector(".circle");

        circle.dataset.color = farbe.id;
        circle.style.background = `var(${farbe.var})`;

        const color_hr = color_klon.querySelector(".color-hr");
        color_hr.style.display = "none";
        const kalender_btn = color_klon.querySelector(".kalender-btn");

        kalender_btn.style.margin_left = 20 + "px";

        color_button_click(sheet, kalender_btn, kalender);

        select_append.appendChild(color_klon);
      });
    });
}

function select_sheet_create(sheet, container) {
  const select_button = sheet.querySelector(".select-button");
  const select_append = sheet.querySelector(".select-append");
  const moreInfo = sheet;

  select_button.addEventListener("click", (event) => {
    event.stopPropagation();

    console.log("crate_select_sheet");

    const offsetHeight_div = moreInfo.offsetTop;

    console.log("Höhe:", offsetHeight_div);

    select_append.style.display = "block";
    select_append.style.top = -15 + "px";
    select_append.style.opacity = 1;

    upload_kalender_color(sheet, select_append);
  });

  document.addEventListener("click", (event) => {
    if (
      !select_append.contains(event.target) &&
      !select_button.contains(event.target)
    ) {
      console.log("Außerhalb geklickt");
      hidden_sheet(select_append, select_append);
    }
  });
}

add_Event_btn.addEventListener("click", (event) => {
  event.stopPropagation();
  console.log("neuer add_Event_btn");
  if (!append_Event.hasChildNodes()) {
    const klon = More_Envent_Info.content.cloneNode(true);
    append_Event.appendChild(klon);

    const echtesElement = append_Event.querySelector("#more-calender-day"); // dann das echte Element im DOM holen
    select_sheet_create(echtesElement, append_Event);
  }

  append_Event.style.opacity = 1;
});

document.addEventListener("click", (event) => {
  if (
    !append_Event.contains(event.target) &&
    !add_Event_btn.contains(event.target)
  ) {
    hidden_sheet(append_Event, append_Event);
  }
});
