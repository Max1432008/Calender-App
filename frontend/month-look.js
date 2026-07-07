function createEvent(container) {
  const content = container.querySelector(".content");

  const template = document.getElementById("Event");
  const klon = template.content.cloneNode(true);

  const event_color = klon.querySelector(".event-color");
  const event_content = klon.querySelector(".event-content");

  event_content.textContent = "Test Event";

  content.appendChild(klon);
}

function getDaysInMonth(jahr, month) {
  const tage = new Date(jahr, month, 0).getDate();

  return tage;
}

let month_count = 0;
max_month_days = getDaysInMonth(2026, 4);
while (month_count <= max_month_days) {
  month_count += 1;
  console.log(month_count);

  const template = document.getElementById("calender-day");
  const klon = template.content.cloneNode(true);
  const container_calender = klon.querySelector(".container-calender");
  const calender_day = container_calender.querySelector(".date-headline");
  calender_day.textContent = month_count;

  if (month_count % 7 == 0 || month_count % 7 == 6) {
    console.log("Wochenende");
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

console.log(getDaysInMonth(2026, 3));
