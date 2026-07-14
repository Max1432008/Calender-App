const JAHR = 2026;
const MONAT = 12;

function createEvent(container) {
  const content = container.querySelector(".content");

  const template = document.getElementById("Event");
  const klon = template.content.cloneNode(true);

  const event_color = klon.querySelector(".event-color");
  const event_content = klon.querySelector(".event-content");

  event_content.textContent = "Mein Geburtstag";

  content.appendChild(klon);
}

function getDaysInMonth(jahr, month) {
  const tage = new Date(jahr, month, 0).getDate();
  let firstDay = new Date(jahr, month - 1, 1).getDay(); // 0 = Sonntag, 1 = Montag, ..., 6 = Samstag
  firstDay = (firstDay + 6) % 7; // Umwandlung: 0 = Montag, 1 = Dienstag, ..., 6 = Sonntag
  console.log("Erster Tag des Monats: " + firstDay);

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
  const monthTitle = document.getElementById("month-title");
  monthTitle.textContent = `${monthNames[month - 1]} ${jahr}`;
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
  console.log(month_count);

  const template = document.getElementById("calender-day");
  const klon = template.content.cloneNode(true);
  const container_calender = klon.querySelector(".container-calender");
  const calender_day = container_calender.querySelector(".date-headline");
  calender_day.textContent = month_count;

  /*
  if (month_count % 7 == 0 || month_count % 7 == 6) {
    console.log("Wochenende");
    container_calender.style.backgroundColor = "var(--border-weekend)";
  }*/
  const WochenendPosition = (firstDay + month_count - 1) % 7;
  if (WochenendPosition == 5 || WochenendPosition == 6) {
    console.log("Wochenende");
    console.log("WochenendPosition: " + WochenendPosition);
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
