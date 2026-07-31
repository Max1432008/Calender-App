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

  document.getElementById("calendar-list").appendChild(klon);
}
createCalenderItem("Deutsch", 2);

const add_kalender_container = document.getElementById(
  "add-kalender-container",
);

//*_________________________
//* New Kalender ....

const add_kalender = document.getElementById("add-kalender");
const template_new_calender = document.getElementById(
  "template-new-kalender-side",
);
const new_kalender_color = document.getElementById("new-kalender-color");

const sheet = document.getElementById("sheet");
const sheet_append = document.getElementById("sheet-append");

const Back_button = document.getElementById("back-button");

let sheet_out = false;

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
      // hier später: Farbe im Kalender-Objekt speichern
      create_tmp_kalender_side();

      const write_color = document.querySelector(".write-color");
      const dot = document.querySelector(".dot");
      write_color.textContent = color.name;
      dot.style.background = `var(${color.var})`;
    });

    sheet_append.appendChild(klon);
  });
}

function create_tmp_kalender_side() {
  sheet_append.innerHTML = "";
  const klon = template_new_calender.content.cloneNode(true);

  Back_button.style.display = "none";
  const button_color = klon.querySelector(".button-color");
  button_color.addEventListener("click", (event) => {
    event.stopPropagation();
    color_kalender();
  });

  sheet_append.appendChild(klon);
}

function save_Kalender() {
  console.log("Kalender wird gespeichert");
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
