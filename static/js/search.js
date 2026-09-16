//*    Search input      */
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const search_append = document.getElementById("search-append");
const search_append_container = document.getElementById(
  "search-append-container",
);

let clickingButton = false;

// --- Sichtbarkeit des Such-Buttons ---

async function give_db_Events() {
  const response = await fetch("/get-event-typen");
  const data = await response.json();
  const events = data.message;
  return events;
}

async function find_search() {
  const searchTerm = searchInput.value.trim();
  if (searchTerm === "") {
    search_append_container.innerHTML = "";
    return;
  }

  search_append_container.innerHTML = "";

  let foundEvent = false;
  const events = await give_db_Events();
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const eventTitle = event.title.toLowerCase();
    const eventPlace = event.place.toLowerCase();
    const eventDescription = event.content.toLowerCase();

    const searchResultTemplate = document.getElementById(
      "search-result-template",
    );

    if (
      eventTitle.includes(searchTerm.toLowerCase()) ||
      eventDescription.includes(searchTerm.toLowerCase()) ||
      eventPlace.includes(searchTerm.toLowerCase())
    ) {
      const searchResultClone = searchResultTemplate.content.cloneNode(true);
      const titleElement = searchResultClone.querySelector(
        ".search-result-title",
      );
      const descriptionElement = searchResultClone.querySelector(
        ".search-result-description",
      );
      const dateElement = searchResultClone.querySelector(
        ".search-result-date",
      );
      const timeStartElement = searchResultClone.querySelector(
        ".search-result-time-start",
      );
      const timeEndElement = searchResultClone.querySelector(
        ".search-result-time-end",
      );
      const search_button_event =
        searchResultClone.querySelector(".search-result");

      foundEvent = true;
      const timeStart = event.day_start.split("T")[1].slice(0, 5);
      const timeEnd = event.day_end.split("T")[1].slice(0, 5);
      const date = event.day_start.split("T")[0];

      titleElement.textContent = event.title;
      if (eventDescription.includes(searchTerm.toLowerCase())) {
        descriptionElement.textContent = event.content;
      } else {
        descriptionElement.textContent = event.place;
      }
      dateElement.textContent = date;
      timeStartElement.textContent = `${timeStart}`;
      timeEndElement.textContent = `${timeEnd}`;

      search_button_event.addEventListener("click", async () => {
        console.log("Clicked on event:", event.title);

        const date = event.day_start.split("T")[0];
        const [year, month] = date.split("-");

        if (JAHR !== Number(year) || MONAT !== Number(month)) {
          JAHR = Number(year);
          MONAT = Number(month);
          updateMonthTitle(JAHR, MONAT);
          await create_calender_day();
        }

        const gefundenesEvent = events.find(
          (eventAusArray) => eventAusArray.id === event.id,
        );
        if (gefundenesEvent) {
          const eventElement = document.querySelector(
            `.event[data-event-id="${gefundenesEvent.id}"]`,
          );
          if (eventElement) {
            const scrollY = window.scrollY;

            eventElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });

            window.scrollTo({
              top: scrollY,
            });
            eventElement.classList.add("highlight");
            setTimeout(() => {
              eventElement.classList.remove("highlight");
            }, 2000);
          }
        }
      });

      search_append_container.appendChild(searchResultClone);
    }
  }
  if (!foundEvent) {
    search_append_container.innerHTML = "<p>Keine Ergebnisse gefunden</p>";
  }
}

searchInput.addEventListener("input", () => {
  find_search();
});

searchButton.addEventListener("click", () => {
  find_search();
});

async function searchButtonShow() {
  searchButton.classList.add("search-input-focus");
  search_append.classList.add("search-append-out");
}

async function searchButtonHide() {
  searchButton.classList.remove("search-input-focus");
  searchButton.classList.remove("search-click-animation");
  search_append.classList.remove("search-append-out");
  search_append_container.innerHTML = "";
}

function searchButtonClickAnimation() {
  searchButton.classList.add("search-click-animation");
}

/*
searchButton.addEventListener("mousedown", () => {
  clickingButton = true;
});

searchButton.addEventListener("click", () => {
  searchButtonShow();
  searchButtonClickAnimation();
  searchInput.focus(); // optional: Fokus zurück ins Suchfeld
});
*/

searchInput.addEventListener("focus", () => {
  searchButtonClickAnimation();

  if (searchInput.value.trim() !== "") {
    searchButtonShow();
    find_search();
  }
});

searchInput.addEventListener("input", () => {
  searchButtonClickAnimation();

  if (searchInput.value.trim() !== "") {
    searchButtonShow();
  } else {
    searchButtonHide();
  }
});

/*
searchInput.addEventListener("focusout", () => {
  if (clickingButton) {
    // Klick auf den Button war der Grund für den Fokusverlust -> nicht verstecken
    clickingButton = false;
    return;
  }
  searchButtonHide();
});*/

document.addEventListener("click", (event) => {
  if (
    !search_append_container.contains(event.target) &&
    !searchButton.contains(event.target) &&
    !searchInput.contains(event.target)
  ) {
    searchButtonHide();
  }
});
