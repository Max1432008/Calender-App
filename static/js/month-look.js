function sortEventsByTime(events) {
  return events.sort((a, b) => new Date(a.day_start) - new Date(b.day_start));
}

async function upload_kalender_typen() {
  const response = await fetch("/get-event-typen");

  if (!response.ok) {
    console.error("Fehler beim Laden der Events:", response.status);
    return [];
  }

  const data_event = await response.json();

  console.log("Events vom Server:", data_event);
  let data = sortEventsByTime(data_event.message);
  return data || [];
}

function updatePopupPosition(popup, event) {
  const rect = event.getBoundingClientRect();

  // Platz unter dem Event
  const spaceBottom = window.innerHeight - rect.bottom;
  const spaceRight = window.innerWidth - rect.right;

  // Platz über dem Event
  const spaceTop = rect.top;
  const spaceLeft = rect.left;

  if (spaceBottom < popup.offsetHeight && spaceTop > popup.offsetHeight) {
    popup.classList.add("up-popup");
  } else {
    popup.classList.remove("up-popup");
  }

  if (spaceRight < popup.offsetWidth && spaceLeft > popup.offsetWidth) {
    popup.classList.add("left-popup");
  } else {
    popup.classList.remove("left-popup");
  }

  if (
    spaceRight < popup.offsetWidth &&
    spaceLeft > popup.offsetWidth &&
    spaceBottom < popup.offsetHeight &&
    spaceTop > popup.offsetHeight
  ) {
    popup.classList.add("left-up-popup");
  } else {
    popup.classList.remove("left-up-popup");
  }
}

function setupPopup(popup, container) {
  document.addEventListener("click", function closePopup(event) {
    if (!popup.contains(event.target)) {
      popup.style.display = "none";

      container.classList.remove("active");

      openPopup = null;
      openContainer = null;

      document.removeEventListener("click", closePopup);
    }
  });
}

let openPopup = null;
let openContainer = null;
function create_More(klon_event, container, alleEvents) {
  const append_more = klon_event.querySelector(".append-more");
  const event = klon_event.querySelector(".event");

  event.addEventListener("click", (e) => {
    e.stopPropagation();

    // Falls schon ein Popup offen ist

    const vorhandenePopups = document.querySelectorAll("#more-calender-day");
    console.log("Anzahl:", vorhandenePopups.length);
    vorhandenePopups.forEach((popup) => {
      popup.remove();
    });

    container.classList.add("active");

    const template = document.getElementById("More-Envent-Info");
    const klon = template.content.cloneNode(true);

    const title = klon.querySelector(".title-input");
    title.value = alleEvents.title;

    append_more.appendChild(klon);

    const popup = append_more.querySelector("#more-calender-day");

    const rect = e.currentTarget.getBoundingClientRect();

    updatePopupPosition(popup, event);

    // Aktuelles Popup merken
    openPopup = popup;
    openContainer = container;

    setupPopup(popup, container);
  });
}
async function createEvent(container, alleEvents) {
  const content = container.querySelector(".content");

  const template = document.getElementById("Event");
  const klon = template.content.cloneNode(true);

  const event_color = klon.querySelector(".event-color");
  const event_content = klon.querySelector(".event-content");
  const event_time = klon.querySelector(".event-time");

  console.log(alleEvents);
  event_content.textContent = alleEvents.title ?? "Ohne Titel";

  event_time.textContent = alleEvents.day_start
    ? new Date(alleEvents.day_start).toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Keine Zeit";

  const farbe = calendarColors.find(
    (color) => color.name.trim() === (alleEvents.color ?? "").trim(),
  );

  if (farbe) {
    event_color.style.background = `var(${farbe.var})`;
  }

  create_More(klon, container, alleEvents);
  content.appendChild(klon);
}

async function renderEventsForDay(container, year, month, day, alleEvents) {
  if (!Array.isArray(alleEvents)) {
    console.error("alleEvents ist kein Array:", alleEvents);
    return;
  }

  console.log(alleEvents.length);
  for (let i = 0; i < alleEvents.length; i++) {
    const eventDate = new Date(alleEvents[i].day_start);
    const eventYear = eventDate.getFullYear();
    const eventMonth = eventDate.getMonth() + 1; // +1, weil JS bei 0 startet
    const eventDay = eventDate.getDate();

    if (eventYear === year && eventMonth === month && eventDay === day) {
      createEvent(container, alleEvents[i]);
    }
  }
}
