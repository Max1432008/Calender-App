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
  calender_typ_id: "",
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
  const repeatSelect = sheet.querySelector(".repeat-select");

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
  eventCreatePayload.repeat = repeatSelect.value;
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
  viewContent.style.transition = "all 0.3s ease";
}

viewButtons.forEach((btn) => {
  btn.addEventListener("click", () => moveViewContent(btn));
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

function create_Kard(ort, placeMap, map, marker) {
  const latitude = Number(ort.latitude);
  const longitude = Number(ort.longitude);

  placeMap.style.display = "block";

  if (!map) {
    map = L.map(placeMap).setView([latitude, longitude], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);
  } else {
    map.setView([latitude, longitude], 15);
  }

  if (marker) {
    marker.remove();
  }

  marker = L.marker([latitude, longitude])
    .addTo(map)
    .bindPopup(ort.name)
    .openPopup();

  return {
    map: map,
    marker: marker,
  };
}

async function place_data(placeInput) {
  const response = await fetch("/search-place", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      kalender_data: placeInput.value,
    }),
  });

  const data = await response.json();

  console.log("Erfolgreich angekommen", data);

  return data;
}

function button_place_click(placeInput, ort) {
  placeInput.value = ort.name;
}

async function find_place(placeInput, sheet, map, marker) {
  console.log("focus out", placeInput.value);

  document.querySelectorAll(".place-result-container").forEach((container) => {
    container.remove();
  });

  const container_places = document.createElement("div");
  container_places.classList.add("place-result-container");
  const placeMap = sheet.querySelector("#place-map");

  const rect = placeInput.getBoundingClientRect();

  container_places.style.left = `${rect.left + 450}px`;
  container_places.style.top = `${rect.bottom + 5}px`;
  container_places.style.width = `${rect.width}px`;

  const Standort_daten = await place_data(placeInput);

  for (let i = 0; i < Standort_daten.message.length; i++) {
    console.log(i);
    const button_place = document.createElement("button");
    button_place.classList.add("place-result-button");

    let ort = Standort_daten.message[i];

    ort = ort.name
      .replace(/\b\d{5}\b/, "")
      .replace(", Deutschland", "")
      .trim();

    button_place.innerText = ort;

    container_places.appendChild(button_place);

    button_place.addEventListener("click", () => {
      button_place_click(placeInput, Standort_daten.message[i]);
      create_Kard(ort, placeMap, map, marker);
    });
  }
  document.body.appendChild(container_places);
}

function select_sheet_create(sheet, container) {
  const select_button = sheet.querySelector(".select-button");
  const select_append = sheet.querySelector(".select-append");
  const placeInput = sheet.querySelector(".place-input");
  const placeMap = sheet.querySelector("#place-map");

  let map = null;
  let marker = null;

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

  placeInput.addEventListener("input", async () => {
    await find_place(placeInput, sheet, map, marker);
  });

  placeInput.addEventListener("change", async () => {
    const place = placeInput.value.trim();

    if (place === "") {
      return;
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`,
    );

    const data = await response.json();

    if (data.length === 0) {
      console.log("Ort nicht gefunden");
      return;
    }

    const Standort_daten = await place_data(placeInput);

    const ort = Standort_daten.message[0];
    create_Kard(ort, placeMap, map, marker);
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

  save_event_btn.addEventListener("click", async (event) => {
    event.stopPropagation();

    const payload = saveDraftCalendarEvent(sheet, draftCalendar);
    upload_event(payload);
    await loadEvents();
    await create_calender_day(events);

    //! kommt zum schluss
    hidden_sheet(select_append, sheet);
  });

  close_sheet_btn.addEventListener("click", (event) => {
    event.stopPropagation();
    console.log("close sheet");
    hidden_sheet(select_append, sheet);
  });

  document.addEventListener("click", (event) => {
    const placeResult = event.target.closest(".place-result-container");

    if (
      !select_append.contains(event.target) &&
      !select_button.contains(event.target) &&
      !placeResult
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
  const placeResult = event.target.closest(".place-result-container");

  if (
    popup &&
    !popup.contains(event.target) &&
    !add_Event_btn.contains(event.target) &&
    !placeResult
  ) {
    popup.remove();
  }
});

const month_view = document.getElementById("month-view");
const week_view = document.getElementById("week-view");
const day_view = document.getElementById("day-view");
const year_view = document.getElementById("year-view");

month_view.addEventListener("click", () => {
  moveViewContent(month_view);
  setTimeout(() => {
    window.location.href = "/month-look";
  }, 300);
});

week_view.addEventListener("click", () => {
  moveViewContent(week_view);
  setTimeout(() => {
    window.location.href = "/week-look";
  }, 300);
});

day_view.addEventListener("click", () => {
  moveViewContent(day_view);
  setTimeout(() => {
    window.location.href = "/day-look";
  }, 300);
});

year_view.addEventListener("click", () => {
  moveViewContent(year_view);
  setTimeout(() => {
    window.location.href = "/year-look";
  }, 300);
});
