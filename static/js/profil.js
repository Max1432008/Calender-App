const profile_name = document.querySelector(".profile-name");
const profil_button = document.getElementById("profil-button");

let profil_visible = false; //! Umgestellt für das einstellen

async function get_user_data() {
  const response = await fetch("/get-user-data");
  return await response.json();
}

async function user_data_input(profil_container) {
  const data = await get_user_data();

  const profil_benutzer_name = profil_container.querySelector(
    ".profil-benutzer-name",
  );

  const profil_eMail = profil_container.querySelector(".profil-eMail");

  if (data.success) {
    profil_benutzer_name.value = data.data.name;
    profil_eMail.value = data.data.email;

    console.log("Name-Input:", profil_benutzer_name);
    console.log("E-Mail-Input:", profil_eMail);
    console.log("Daten:", data);
  } else {
    console.error(data.error);
  }
}

function profil_management() {
  const template_profil = document.getElementById("profil-template");
  const existing_profil = document.querySelector(".profil-container");

  if (profil_visible === false) {
    const profil_container =
      template_profil.content.firstElementChild.cloneNode(true);
    document.body.appendChild(profil_container);
    profil_visible = true;
    profile_name.classList.add("profile-name-visible");

    user_data_input(profil_container);
  } else {
    existing_profil?.remove();
    profil_visible = false;
    profile_name.classList.remove("profile-name-visible");
  }
}

profil_button.addEventListener("click", () => {
  profil_management();
});

async function User_data() {
  const data = await get_user_data();

  if (data.success) {
    profile_name.textContent = data.data.name;
  } else {
    console.error("Fehler beim Abrufen der Benutzerdaten:", data.error);
    profile_name.textContent = "Nicht gefunden";
  }
}

const themesSettings = [
  { name: "Ozean blau", id: "ozean", class: "ozean-style" },
  { name: "Lila Nacht", id: "lila", class: "lila-style" },
  {
    name: "Sonnenuntergang",
    id: "sonnenuntergang",
    class: "sonnenuntergang-style",
  },
  { name: "Eis Blau", id: "eis", class: "eis-style" },
  { name: "Wald grün", id: "wald", class: "wald-style" },
  { name: "Nordlicht", id: "nordlicht", class: "nordlicht-style" },
  { name: "Korallenriff", id: "korallenriff", class: "korallenriff-style" },
  { name: "Kirschblüte", id: "kirschbluete", class: "kirschbluete-style" },
  { name: "Minze", id: "minze", class: "minze-style" },
  { name: "Gold", id: "gold", class: "gold-style" },
  { name: "Mitternacht", id: "mitternacht", class: "mitternacht-style" },
];

function createThemePreview() {
  const container = document.querySelector(".bg-styling");

  themesSettings.forEach((theme) => {
    const stylingContainer = document.createElement("div");
    stylingContainer.classList.add("styling-container");

    const window = document.createElement("button");
    window.classList.add("window", "glass", theme.class);
    window.dataset.bg = theme.id;

    const name = document.createElement("p");
    name.textContent = theme.name;

    stylingContainer.appendChild(window);
    stylingContainer.appendChild(name);

    container.appendChild(stylingContainer);
  });
}
function Choose_color() {
  const buttons = document.querySelectorAll(".window");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      document.documentElement.dataset.bg = button.dataset.bg;
      const text = button.parentElement.querySelector("p");
      const window = button.parentElement.querySelector(".window");
      window.classList.toggle("theme-choose");
      text.classList.toggle("theme-text-choose");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  User_data();
  profil_management();
  createThemePreview();
  Choose_color();
});
