let eventUpdate = {
  title: "",
  place: "",
  eventId: "",
  hole_day: false,
  day_start: "",
  day_end: "",
  time_start: "",
  time_end: "",
  content: "",
  color: "",
};

function Update_Event_GET_Data(popup, eventData) {
  const titleInput = popup.querySelector(".title-input");
  const placeInput = popup.querySelector(".place-input");

  const holeDayCheckbox = popup.querySelector(".hole-day-checkbox");

  const dayStartInput = popup.querySelector(".day-start-input");
  const dayEndInput = popup.querySelector(".day-end-input");

  const timeStartInput = popup.querySelector(".time-start-input");
  const timeEndInput = popup.querySelector(".time-end-input");

  const contentTextarea = popup.querySelector(".textarea-more");

  eventUpdate.title = titleInput.value;
  eventUpdate.place = placeInput.value;

  eventUpdate.eventId = eventData.id;

  eventUpdate.hole_day = holeDayCheckbox.checked;

  eventUpdate.day_start = dayStartInput.value;
  eventUpdate.day_end = dayEndInput.value;

  eventUpdate.time_start = timeStartInput.value;
  eventUpdate.time_end = timeEndInput.value;

  eventUpdate.calender_typ_id = eventData.calender_typ_id;

  eventUpdate.content = contentTextarea.value;

  // Farbe zunächst vom bisherigen Event übernehmen
  eventUpdate.color = eventData.color ?? "";

  console.log("Daten aus Popup:", eventUpdate);

  return eventUpdate;
}

function Update_Event_Data(popup, eventData) {
  const data = Update_Event_GET_Data(popup, eventData);

  console.log("Daten zum Speichern:", data);

  fetch("/update_event_data", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Serverfehler: ${response.status} ${response.statusText}`,
        );
      }

      return response.json();
    })

    .then((data) => {
      console.log("Erfolgreich gespeichert:", data);
    })

    .catch((error) => {
      console.error("Fehler beim Speichern:", error);
    });
}

function create_More(klon_event, container, Events) {
  const event = klon_event.querySelector(".event");

  event.addEventListener("click", (e) => {
    e.stopPropagation();

    document
      .querySelectorAll("#more-calender-day")
      .forEach((popup) => popup.remove());

    container.classList.add("active");

    const template = document.getElementById("More-Envent-Info");
    const klon = template.content.cloneNode(true);

    const title = klon.querySelector(".title-input");
    const place = klon.querySelector(".place-input");

    const selectButton = klon.querySelector(".select-button");
    const selectAppend = klon.querySelector(".select-append");
    const circle = klon.querySelector(".circle");

    const holeDayCheckbox = klon.querySelector(".hole-day-checkbox");

    const dayStartInput = klon.querySelector(".day-start-input");
    const timeStartInput = klon.querySelector(".time-start-input");

    const dayEndInput = klon.querySelector(".day-end-input");
    const timeEndInput = klon.querySelector(".time-end-input");

    const repeatSelect = klon.querySelector(".repeat-select");
    const textareaMore = klon.querySelector(".textarea-more");

    const closeSheetBtn = klon.querySelector(".close-sheet-btn");
    const saveEventBtn = klon.querySelector(".save-event-btn");

    title.value = Events.title ?? "";
    place.value = Events.place ?? "";

    holeDayCheckbox.checked = Events.hole_day ?? false;

    dayStartInput.value = get_time(Events.day_start)[0] ?? "";
    timeStartInput.value = get_time(Events.day_start)[1] ?? "";

    dayEndInput.value = get_time(Events.day_end)[0] ?? "";
    timeEndInput.value = get_time(Events.day_end)[1] ?? "";

    repeatSelect.value = Events.repeat ?? "Nie";
    textareaMore.value = Events.content ?? "";

    const popup = klon.querySelector("#more-calender-day");

    function closeColorPicker(ev) {
      if (!selectAppend.contains(ev.target) && ev.target !== selectButton) {
        selectAppend.style.display = "none";
      }
    }

    selectButton.addEventListener("click", (ev) => {
      ev.stopPropagation();

      if (selectAppend.parentElement !== document.body) {
        document.body.appendChild(selectAppend);
      }
      const rect = selectButton.getBoundingClientRect();
      selectAppend.style.position = "fixed";
      selectAppend.style.left = rect.left - 120 + "px";
      selectAppend.style.top = rect.bottom - 100 + "px";
      selectAppend.style.display = "block";
      selectAppend.style.opacity = "1";
      selectAppend.style.zIndex = "99999";

      upload_kalender_color(popup, selectAppend);
    });

    document.addEventListener("click", closeColorPicker);

    const farbe = calendarColors.find(
      (color) => color.name.trim() === (Events.color ?? "").trim(),
    );

    if (farbe) {
      circle.style.backgroundColor = `var(${farbe.var})`;
    }

    get_color(Events.calendarId).then((kalender) => {
      if (kalender) {
        console.log(kalender);
        selectButton.textContent = kalender.titel;
      }
    });

    closeSheetBtn.addEventListener("click", () => {
      popup.remove();
    });

    saveEventBtn.addEventListener("click", () => {
      Update_Event_Data(popup, Events);
      updateEventInDOM(Events.id, eventUpdate, Events, container);
    });

    const delete_event = document.createElement("button");
    delete_event.classList.add("delete-event-btn");
    delete_event.innerText = "Löschen";
    popup.appendChild(delete_event);

    document.body.appendChild(popup);

    const rect = e.currentTarget.getBoundingClientRect();
    popup.style.left = rect.left + "px";
    popup.style.top = rect.bottom + "px";

    updatePopupPosition(popup, event);

    openPopup = popup;
    openContainer = container;

    setupPopup(popup, container);
  });
}
