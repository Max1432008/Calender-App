const siebar_btn = document.getElementById("Kalender-siebar-btn");
const Kalender_siedbar = document.getElementById("Kalender-sidbar");

// Siebar aufahren
function Sidbar_out() {
  Kalender_siedbar.classList.add("sidebar-out");
  Kalender_siedbar.classList.remove("sidebar-in");
}

// Siebar enfahren
function Seibar_in() {
  Kalender_siedbar.classList.add("sidebar-in");
  Kalender_siedbar.classList.remove("sidebar-out");
}

let sidebar_out = false;
siebar_btn.addEventListener("click", () => {
  if (sidebar_out) {
    Sidbar_out();
    console.log("out");
  } else {
    Seibar_in();
    console.log("in");
  }

  sidebar_out = sidebar_out ? false : true;
});

//*      ______   Kalender Typen    ________       */

//*
//*
//*
//*___________________________________________
//* New Kalender ....

const add_kalender = document.getElementById("add-kalender");
const template_new_calender = document.getElementById(
  "template-new-kalender-side",
);
const new_kalender_color = document.getElementById("new-kalender-color");

const sheet = document.getElementById("sheet");
const sheet_append = document.getElementById("sheet-append");

const Back_button = document.getElementById("back-button");
const Save_button = document.getElementById("save-btn");

let sheet_out = false;
let kalenderArray = []; //* Lokalstorage Save

//*   __________    LOKAL SPEICHERN     ________
/*function local_save(objekt) {
  const kalender_inputs = objekt.querySelectorAll(".kalender-input");
  const kalender_btn = objekt.querySelector(".kalender-btn");

  kalender_btn.addEventListener("click", () => {
    const neuerKalender = {
      id: Date.now(),
      name: kalender_inputs[0].value,
      color: "--entry-2", // kommt später von deiner Farbauswahl
      checked: true,
    };

    kalenderArray.push(neuerKalender);
    localStorage.setItem("kalender", JSON.stringify(kalenderArray));
  });
}*/

function hidden_sheet() {
  console.log("Außerhalb geklickt");
  sheet_out = false;
  sheet_append.replaceChildren(); // löscht alle Items in sheet
  sheet.style.opacity = 0;
}

function Back_btn() {
  sheet_append.innerHTML = "";
  create_tmp_kalender_side();
}

function color_kalender() {
  sheet_append.innerHTML = "";
  Back_button.style.display = "block";
  Save_button.style.opacity = "0";

  Back_button.addEventListener("click", (event) => {
    event.stopPropagation();
    Back_btn();
  });

  calendarColors.forEach((color) => {
    const klon = new_kalender_color.content.cloneNode(true);

    const circle = klon.querySelector(".circle");
    const name = klon.querySelector(".color-name");
    const btn = klon.querySelector(".color-btn");

    circle.style.background = `var(${color.var})`;
    name.textContent = color.name;

    btn.addEventListener("click", (event) => {
      event.stopPropagation();

      console.log("Ausgewählt:", color.name, color.id);

      // Alte Eingaben speichern
      const name_input = document.querySelector(".kalender-name");
      const shared_input = document.querySelector(".shared-with");

      const old_name = name_input ? name_input.value : "";
      const old_shared = shared_input ? shared_input.value : "";

      // Formular neu erstellen
      create_tmp_kalender_side();

      // Eingaben wieder einsetzen
      const new_name_input = document.querySelector(".kalender-name");
      const new_shared_input = document.querySelector(".shared-with");

      if (new_name_input) {
        new_name_input.value = old_name;
      }

      if (new_shared_input) {
        new_shared_input.value = old_shared;
      }

      // Farbe setzen
      const write_color = document.querySelector(".write-color");
      const dot = document.querySelector(".dot");

      if (write_color) {
        write_color.textContent = color.name;
      }

      if (dot) {
        dot.style.background = `var(${color.var})`;
      }
    });

    sheet_append.appendChild(klon);
  });
}

function create_tmp_kalender_side() {
  sheet_append.innerHTML = "";
  const klon = template_new_calender.content.cloneNode(true);

  Back_button.style.display = "none";
  Save_button.style.opacity = "1";
  const button_color = klon.querySelector(".button-color");
  button_color.addEventListener("click", (event) => {
    event.stopPropagation();
    color_kalender();
  });

  //!local_save(klon);

  sheet_append.appendChild(klon);
}

function give_save_data() {
  const name_input = document.querySelector(".kalender-name");
  const write_color = document.querySelector(".write-color");
  const shared_with = document.querySelector(".shared-with");

  console.log(name_input);
  console.log(name_input.value);
  console.log(shared_with);
  console.log(shared_with.value);

  return {
    name: name_input.value,
    shared_with: shared_with.value,
    color: write_color.textContent,
  };
}

function save_Kalender() {
  console.log("Kalender wird gespeichert");

  const kalender_data = give_save_data();

  fetch("/save-new-kalender", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      /* deine Daten */
      kalender_data,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      // hier mit der Antwort arbeiten
      console.log(data);
    });
}

function see_sheet() {
  const close_sheet_btn = document.querySelector(".close-sheet-btn");
  const check_btn = document.querySelector(".check-btn");

  sheet.style.opacity = 1;
  create_tmp_kalender_side();

  close_sheet_btn.addEventListener("click", () => {
    console.log("Sheet Close button");
    hidden_sheet();
  });

  check_btn.addEventListener("click", () => {
    save_Kalender();
    hidden_sheet();
  });
}

add_kalender.addEventListener("click", () => {
  if (!sheet_out) {
    see_sheet();
  } else {
    hidden_sheet();
  }

  sheet_out = sheet_out ? false : true;
});

document.addEventListener("click", (event) => {
  if (!sheet.contains(event.target) && !add_kalender.contains(event.target)) {
    hidden_sheet();
  }
});

//*
//*
//*
//*   _______________       Neustart Funktion     ____________
//*

const calendar_list = document.getElementById("calendar-list");
const calender_item_template = document.getElementById(
  "calender-item-template",
);
let calender_rounds = 10;

function createCalenderItem(name, colorId) {
  const klon = calender_item_template.content.cloneNode(true);

  const item = klon.querySelector(".sidebar-item");
  const text = klon.querySelector(".text");

  item.dataset.color = colorId; // setzt data-color="..."
  text.textContent = name;

  calendar_list.appendChild(klon);
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("/get-kalneder-typen")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      data.message.forEach((kalender) => {
        console.log(kalender.titel);
        console.log(kalender.color);
        const farbe = calendarColors.find(
          (color) => color.name.trim() === kalender.color.trim(),
        );

        console.log(farbe.id);
        createCalenderItem(kalender.titel, farbe.id);
      });
    });
});
