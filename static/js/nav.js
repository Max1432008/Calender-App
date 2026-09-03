//*
//*
//*     –––––         Ansicht von der Switchbar oben  –––––––
//*
const viewContent = document.getElementById("view-content");
const calenderLook = document.querySelector(".calender-look");
const viewButtons = document.querySelectorAll(".calender-look > button");

// aktuell im Formular ausgewählter Kalender (Farbe/Name/ID)
let draftCalendar = {
  calendarTitle: "",
  calendarTypeId: null,
  sharedWith: "",
  color: "",
};

// Daten zum Erstellen eines neuen Events (Feldnamen = Backend-Feldnamen)
let eventCreatePayload = {
  title: "",
  place: "",
  hole_day: false,
  day_start: "",
  day_end: "",
  time_start: "",
  time_end: "",
  content: "",
  color: "",
  calender_typ_id: null,
};

function upload_event(eventCreatePayload) {
  fetch("/save-event", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventCreatePayload),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Erfolgreich gespeichert:", data);
    })
    .catch((error) => {
      console.error("Fehler beim Speichern:", error);
    });
}

function saveDraftCalendarEvent(sheet, draftCalendar) {
  const titleInput = sheet.querySelector(".title-input");
  const placeInput = sheet.querySelector(".place-input");
  const holeDayCheckbox = sheet.querySelector(".hole-day-checkbox");
  const dayStartInput = sheet.querySelector(".day-start-input");
  const dayEndInput = sheet.querySelector(".day-end-input");
  const timeStartInput = sheet.querySelector(".time-start-input");
  const timeEndInput = sheet.querySelector(".time-end-input");
  const contentTextarea = sheet.querySelector(".textarea-more");

  if (
    titleInput.value === "" ||
    dayStartInput.value === "" ||
    dayEndInput.value === "" ||
    timeStartInput.value === "" ||
    timeEndInput.value === ""
  ) {
    console.error("Ein oder mehrere Eingabefelder wurden nicht gefunden.");
    return;
  }

  eventCreatePayload.title = titleInput.value;
  eventCreatePayload.place = placeInput.value;
  eventCreatePayload.hole_day = holeDayCheckbox.checked;
  eventCreatePayload.day_start = dayStartInput.value;
  eventCreatePayload.day_end = dayEndInput.value;
  eventCreatePayload.time_start = timeStartInput.value;
  eventCreatePayload.time_end = timeEndInput.value;
  eventCreatePayload.calender_typ_id = draftCalendar.calendarTypeId;
  eventCreatePayload.content = contentTextarea.value;
  eventCreatePayload.color = draftCalendar.color;

  return eventCreatePayload;
}

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

function update_selet_btn(sheet, draftCalendar) {
  const select_button = sheet.querySelector(".select-button");
  const circle = sheet.querySelector(".circle");
  const hole_day_checkbox = sheet.querySelector(".hole-day-checkbox");

  select_button.textContent = draftCalendar.calendarTitle;
  const farbe = calendarColors.find(
    (color) => color.name.trim() === draftCalendar.color.trim(),
  );
  circle.style.background = `var(${farbe.var})`;
  circle.dataset.color = farbe.id;
  hole_day_checkbox.style.background = `var(${farbe.var})`;
}

function color_button_click(sheet, kalender_btn, kalender) {
  kalender_btn.addEventListener("click", (event) => {
    event.stopPropagation();
    draftCalendar.calendarTypeId = kalender.id;
    draftCalendar.color = kalender.color;
    draftCalendar.calendarTitle = kalender.titel;
    draftCalendar.sharedWith = kalender.shared_with;
    update_selet_btn(sheet, draftCalendar);
  });
}

function upload_kalender_color(sheet, select_append) {
  fetch("/get-kalneder-typen")
    .then((response) => response.json())
    .then((data) => {
      select_append.innerHTML = "";
      data.message.forEach((kalender) => {
        const new_kalender_color =
          document.getElementById("new-kalender-color");
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

        color_button_click(sheet, kalender_btn, kalender);

        select_append.appendChild(color_klon);
      });
    });
}

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

function select_sheet_create(sheet, container) {
  const select_button = sheet.querySelector(".select-button");
  const select_append = sheet.querySelector(".select-append");
  const save_event_btn = sheet.querySelector(".save-event-btn");
  const close_sheet_btn = sheet.querySelector(".close-sheet-btn");
  const day_start_input = sheet.querySelector(".day-start-input");
  const day_end_input = sheet.querySelector(".day-end-input");
  const time_start_input = sheet.querySelector(".time-start-input");
  const time_end_input = sheet.querySelector(".time-end-input");

  time_start_input.addEventListener("change", () => {
    const [hours, minutes] = time_start_input.value.split(":").map(Number);
    change_time(hours, minutes, time_end_input);
  });

  // Anfangsdatum setzen
  const heute = new Date();
  const heuteString = heute.toISOString().split("T")[0];
  let event_day_difference = 0;

  day_start_input.value = heuteString;
  day_end_input.value = heuteString;

  event_day_difference = differenz_day(
    day_start_input.value,
    day_end_input.value,
  );

  day_start_input.addEventListener("change", () => {
    const start = new Date(day_start_input.value);

    if (Number.isNaN(start.getTime())) {
      return;
    }

    const end = new Date(start);
    end.setDate(end.getDate() + event_day_difference);

    day_end_input.value = end.toISOString().split("T")[0];
  });

  day_end_input.addEventListener("change", () => {
    event_day_difference = differenz_day(
      day_start_input.value,
      day_end_input.value,
    );
  });

  select_button.addEventListener("click", (event) => {
    event.stopPropagation();

    if (select_append.parentElement !== document.body) {
      document.body.appendChild(select_append);
    }

    const rect = select_button.getBoundingClientRect();

    select_append.style.position = "fixed";
    select_append.style.left = rect.left - 120 + "px";
    select_append.style.top = rect.bottom - 100 + "px";
    select_append.style.display = "block";
    select_append.style.opacity = "1";
    select_append.style.zIndex = "99999";

    upload_kalender_color(sheet, select_append);
  });

  save_event_btn.addEventListener("click", (event) => {
    event.stopPropagation();

    const payload = saveDraftCalendarEvent(sheet, draftCalendar);
    upload_event(payload);

    //! kommt zum schluss
    //?hidden_sheet(select_append, select_append);
  });

  close_sheet_btn.addEventListener("click", (event) => {
    event.stopPropagation();
    hidden_sheet(select_append, select_append);
  });

  document.addEventListener("click", (event) => {
    if (
      !select_append.contains(event.target) &&
      !select_button.contains(event.target)
    ) {
      hidden_sheet(select_append, select_append);
    }
  });
}

add_Event_btn.addEventListener("click", (event) => {
  event.stopPropagation();
  if (!document.getElementById("more-calender-day")) {
    const klon = More_Envent_Info.content.cloneNode(true);
    const popup = klon.querySelector("#more-calender-day");

    document.body.appendChild(klon);

    const rect = add_Event_btn.getBoundingClientRect();
    popup.style.left = rect.left + "px";
    popup.style.top = rect.bottom + "px";

    select_sheet_create(popup, append_Event);
  }
});

document.addEventListener("click", (event) => {
  const popup = document.getElementById("more-calender-day");
  if (
    popup &&
    !popup.contains(event.target) &&
    !add_Event_btn.contains(event.target)
  ) {
    popup.remove();
  }
});
