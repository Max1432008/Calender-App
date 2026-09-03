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

function differenz_day(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return 0;
  }

  return Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
}

function change_time(hours, minutes, time_end_input) {
  const date = new Date();
  date.setHours(hours, minutes);
  date.setHours(date.getHours() + 1);

  time_end_input.value =
    String(date.getHours()).padStart(2, "0") +
    ":" +
    String(date.getMinutes()).padStart(2, "0");
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

    timeStartInput.addEventListener("change", () => {
      const [hours, minutes] = timeStartInput.value.split(":").map(Number);
      change_time(hours, minutes, timeEndInput);
    });

    // Anfangsdatum setzen
    const heute = new Date();
    const heuteString = heute.toISOString().split("T")[0];
    let event_day_difference = 0;

    dayStartInput.value = heuteString;
    dayEndInput.value = heuteString;

    event_day_difference = differenz_day(
      dayStartInput.value,
      dayEndInput.value,
    );

    dayStartInput.addEventListener("change", () => {
      const start = new Date(dayStartInput.value);

      if (Number.isNaN(start.getTime())) {
        return;
      }

      const end = new Date(start);
      end.setDate(end.getDate() + event_day_difference);

      dayEndInput.value = end.toISOString().split("T")[0];
    });

    dayEndInput.addEventListener("change", () => {
      event_day_difference = differenz_day(
        dayStartInput.value,
        dayEndInput.value,
      );
    });

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

    get_color(Events.calender_typ_id).then((kalender) => {
      if (kalender) {
        console.log(kalender);
        selectButton.textContent = kalender.titel;
      }
    });

    closeSheetBtn.addEventListener("click", () => {
      popup.remove();
    });

    saveEventBtn.addEventListener("click", () => {
      Update_Event_Data(popup, Events).then((payload) => {
        if (!payload) return;

        updateEventInDOM(container, payload, Events);
      });
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
