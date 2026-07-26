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

let sheet_out = false;

function color_kalender() {
  console.log("clolor choose");
}

function create_tmp_kalender_side() {
  const klon = template_new_calender.content.cloneNode(true);

  sheet_append.appendChild(klon);
}

add_kalender.addEventListener("click", () => {
  if (!sheet_out) {
    sheet.style.opacity = 1;
    create_tmp_kalender_side();
  } else {
    sheet.style.opacity = 0;
    sheet_append.replaceChildren(); // löscht alle Items in sheet
  }

  sheet_out = sheet_out ? false : true;
});

document.addEventListener("click", (event) => {
  if (!sheet.contains(event.target) && !add_kalender.contains(event.target)) {
    console.log("Außerhalb geklickt");
    sheet_out = false;

    sheet.style.opacity = 0;
  }
});
