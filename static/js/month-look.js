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
function create_More(klon_event, container) {
  const append_more = klon_event.querySelector(".append-more");
  const event = klon_event.querySelector(".event");

  event.addEventListener("click", (e) => {
    e.stopPropagation();

    // Falls schon ein Popup offen ist
    if (openPopup) {
      openPopup.style.display = "none";
      openContainer.classList.remove("active");
    }

    append_more.innerHTML = "";
    container.classList.add("active");

    const template = document.getElementById("More-Envent-Info");
    const klon = template.content.cloneNode(true);

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

function createEvent(container) {
  const content = container.querySelector(".content");

  const template = document.getElementById("Event");
  const klon = template.content.cloneNode(true);

  const event_color = klon.querySelector(".event-color");
  const event_content = klon.querySelector(".event-content");

  event_content.textContent = "Mein Geburtstag";

  create_More(klon, container);
  content.appendChild(klon);
}
