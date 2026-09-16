const siebar_btn = document.getElementById("Kalender-siebar-btn");
const Kalender_siedbar = document.getElementById("Kalender-sidbar");
let sidebar_out;

// Siebar aufahren
function Sidbar_out() {
  Kalender_siedbar.classList.add("sidebar-out");
  Kalender_siedbar.classList.remove("sidebar-in");
  localStorage.setItem("sidebar_out", "true");
}

// Siebar enfahren
function Seibar_in() {
  Kalender_siedbar.classList.add("sidebar-in");
  Kalender_siedbar.classList.remove("sidebar-out");
  localStorage.setItem("sidebar_out", "false");
}

siebar_btn.addEventListener("click", () => {
  sidebar_out = sidebar_out ? false : true;
  if (sidebar_out) {
    Sidbar_out();
  } else {
    Seibar_in();
  }
  console.log("sidebar_out:", sidebar_out);
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
let sheet_visible = false;
let draftKalender = { name: "", shared_with: "", color: "" };

const close_sheet_btn = document.querySelector(".close-sheet-btn");
const check_btn = document.querySelector(".check-btn");

close_sheet_btn.addEventListener("click", () => {
  hidden_sheet(sheet_append, sheet);
});

check_btn.addEventListener("click", () => {
  if (
    !draftKalender.name ||
    draftKalender.name.trim() === "" ||
    !draftKalender.color ||
    draftKalender.color.trim() === ""
  ) {
    alert("Bitte geben Sie einen Namen und eine Farbe für den Kalender ein.");
    return;
  } else {
    save_Kalender().then(() => {
      upload_kalender_typen();
      hidden_sheet(sheet_append, sheet);
    });
  }
});

function give_save_data() {
  const name_input = document.querySelector(".kalender-name") || { value: "" };
  const write_color = document.querySelector(".write-color") || {
    textContent: "",
  };
  const shared_with = document.querySelector(".shared-with") || { value: "" };

  return {
    name: name_input.value,
    shared_with: shared_with.value,
    color: write_color.textContent,
  };
}

//*   __________    LOKAL SPEICHERN     ________
function local_save() {
  localStorage.setItem("kalender", JSON.stringify(give_save_data()));
}

function Back_btn() {
  local_save();
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

      // Alte Eingaben speichern

      // Formular neu erstellen
      create_tmp_kalender_side();

      // Eingaben wieder einsetzen

      // Farbe setzen
      const write_color = document.querySelector(".write-color");
      const dot = document.querySelector(".dot");

      draftKalender.color = color.name;

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
  Back_button.style.display = "none";
  Save_button.style.opacity = "1";
  sheet_append.innerHTML = "";
  const klon = template_new_calender.content.cloneNode(true);
  const button_color = klon.querySelector(".button-color");
  const name_input = klon.querySelector(".kalender-name");
  const shared_with = klon.querySelector(".shared-with");

  button_color.addEventListener("click", (event) => {
    event.stopPropagation();
    color_kalender();
  });
  name_input.value = draftKalender.name;
  shared_with.value = draftKalender.shared_with;

  name_input.addEventListener(
    "input",
    () => (draftKalender.name = name_input.value),
  );
  shared_with.addEventListener(
    "input",
    () => (draftKalender.shared_with = shared_with.value),
  );
  sheet_append.appendChild(klon);
}

const calendar_list = document.getElementById("calendar-list");
const calender_item_template = document.getElementById(
  "calender-item-template",
);
let calender_rounds = 10;

function createCalenderItem(name, colorId) {
  const klon = calender_item_template.content.cloneNode(true);

  const item = klon.querySelector(".sidebar-item");
  const text = klon.querySelector(".text");

  item.style.setProperty("--item-bg", `var(--entry-${colorId})`);
  item.style.setProperty("--item-border", `var(--entry-${colorId})`);
  text.textContent = name;

  calendar_list.appendChild(klon);
}

function upload_kalender_typen() {
  fetch("/get-kalneder-typen")
    .then((response) => response.json())
    .then((data) => {
      calendar_list.innerHTML = "";
      data.message.forEach((kalender) => {
        const farbe = calendarColors.find(
          (color) => color.name.trim() === kalender.color.trim(),
        );

        createCalenderItem(kalender.titel, farbe.id);
      });
    });
}

function save_Kalender() {
  const kalender_data = give_save_data();

  return fetch("/save-new-kalender", {
    // <- return hinzugefügt
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kalender_data }),
  })
    .then((response) => response.json())
    .then((data) => {});
}

function see_sheet() {
  sheet.style.display = "block";
  sheet.style.opacity = "1";
  sheet_visible = true;

  create_tmp_kalender_side();
}

add_kalender.addEventListener("click", (event) => {
  event.stopPropagation();

  if (!sheet_visible) {
    see_sheet();
  } else {
    hidden_sheet(sheet_append, sheet);
  }
});

document.addEventListener("click", (event) => {
  if (!sheet.contains(event.target) && !add_kalender.contains(event.target)) {
    hidden_sheet(sheet_append, sheet);
  }
});

//*
//*
//*
//*   _______________       Neustart Funktion     ____________
//*

document.addEventListener("DOMContentLoaded", () => {
  upload_kalender_typen();

  const sidebarOut = localStorage.getItem("sidebar_out");

  if (sidebarOut === "true") {
    sidebar_out = true;
    hidden_sheet(sheet_append, sheet);
    Sidbar_out();
  } else {
    sidebar_out = false;
    Seibar_in();
  }
});
