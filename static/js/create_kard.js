function create_Kard(ort, placeMap, state) {
  const latitude = Number(ort.latitude);
  const longitude = Number(ort.longitude);

  placeMap.style.display = "block";

  if (!state.map) {
    state.map = L.map(placeMap).setView([latitude, longitude], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(state.map);
  } else {
    state.map.setView([latitude, longitude], 15);
  }

  if (state.marker) {
    state.marker.remove();
  }

  state.marker = L.marker([latitude, longitude])
    .addTo(state.map)
    .bindPopup(ort.name)
    .openPopup();
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

async function find_place(placeInput, sheet, kartenState) {
  console.log("focus out", placeInput.value);

  document.querySelectorAll(".place-result-container").forEach((container) => {
    container.remove();
  });

  const container_places = document.createElement("div");
  container_places.replaceChildren();

  container_places.classList.add("place-result-container");
  const placeMap = sheet.querySelector("#place-map");

  const rect = placeInput.getBoundingClientRect();

  container_places.style.left = `${rect.left + 420}px`;
  container_places.style.top = `${rect.bottom + 5}px`;
  container_places.style.width = `${rect.width}px`;

  const Standort_daten = await place_data(placeInput);

  if (!Standort_daten || !Array.isArray(Standort_daten.message)) {
    console.error("Keine gültigen Ortsdaten erhalten:", Standort_daten);

    return;
  }

  const bereitsAngezeigt = new Set();
  for (let i = 0; i < Standort_daten.message.length; i++) {
    const button_place = document.createElement("button");
    button_place.classList.add("place-result-button");

    //* Place Icon erstellen
    const placeIcon = document.createElement("div");
    placeIcon.classList.add("place-icon-rectaround");

    const circle = document.createElement("div");
    circle.classList.add("place-icon-circle");

    const rechteck = document.createElement("div");
    rechteck.classList.add("place-icon-rechteck");

    const dreieck = document.createElement("div");
    dreieck.classList.add("place-icon-dreieck");

    placeIcon.appendChild(circle);
    placeIcon.appendChild(rechteck);
    placeIcon.appendChild(dreieck);

    button_place.appendChild(placeIcon);

    const ortDaten = Standort_daten.message[i];

    const ortSchluessel = `${ortDaten.name}|${ortDaten.latitude}|${ortDaten.longitude}`;

    if (bereitsAngezeigt.has(ortSchluessel)) {
      continue;
    }

    bereitsAngezeigt.add(ortSchluessel);
    const ortName = ortDaten.name
      .replace(/\b\d{5}\b/, "")
      .replace(", Deutschland", "")
      .trim();

    const ortNameSpan = document.createElement("span");
    ortNameSpan.innerText = ortName;

    button_place.appendChild(placeIcon);
    button_place.appendChild(ortNameSpan);
    container_places.appendChild(button_place);

    button_place.addEventListener("click", () => {
      button_place_click(placeInput, ortDaten);
      create_Kard(ortDaten, placeMap, kartenState);
    });
  }

  document.body.appendChild(container_places);
}

async function Kard(kartenState, placeInput, placeMap) {
  const place = placeInput.value.trim();

  if (place === "") {
    return;
  }

  const Standort_daten = await place_data(placeInput);

  if (
    !Standort_daten ||
    !Array.isArray(Standort_daten.message) ||
    Standort_daten.message.length === 0
  ) {
    console.log("Ort nicht gefunden");
    return;
  }

  const ort = Standort_daten.message[0];

  create_Kard(ort, placeMap, kartenState);
}

function Kard_and_List(sheet) {
  const kartenState = { map: null, marker: null };
  // let map = null; und let marker = null; löschen

  const placeMap = sheet.querySelector("#place-map");
  const placeInput = sheet.querySelector(".place-input");

  placeInput.addEventListener("input", async () => {
    if (placeInput.value.length > 3) {
      await find_place(placeInput, sheet, kartenState);
    }
  });
  Kard(kartenState, placeInput, placeMap);

  placeInput.addEventListener("change", async () => {
    await Kard(kartenState, placeInput, placeMap);
  });
}
