const profile_name = document.querySelector(".profile-name");
const profil_button = document.getElementById("profil-button");

let profil_visible = true; //! Umgestellt für das einstellen
let dark_theme = true;

function update_Profil_GET_data(profil_container) {
  const profil_benutzer_name = profil_container.querySelector(
    ".profil-benutzer-name",
  );
  const profil_eMail = profil_container.querySelector(".profil-eMail");

  return {
    name: profil_benutzer_name.value.trim(),
    email: profil_eMail.value.trim(),
    color_theme: document.documentElement.dataset.theme,
    background_color: document.documentElement.dataset.bg,
  };
}

function update_Profil_data(profil_container) {
  const payload = update_Profil_GET_data(profil_container);

  return fetch("/update_Prfil_data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Serverfehler: ${response.status} ${response.statusText}`,
        );
      }
      return response.json();
    })
    .then((result) => {
      console.log("Erfolgreich geupdatet:", result);
      return payload;
    })
    .catch((error) => {
      console.error("Fehler beim Speichern:", error);
      return null;
    });
}

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

function dark_mode(profil_container, theme_button) {
  const text_theme = profil_container.querySelector(".text-theme");
  document.documentElement.dataset.theme = "dark";
  theme_button.setAttribute("aria-pressed", "false");
  typeText(text_theme, "Dark Mode", 50);
}

function light_mode(profil_container, theme_button) {
  const text_theme = profil_container.querySelector(".text-theme");
  document.documentElement.dataset.theme = "light";
  theme_button.setAttribute("aria-pressed", "true");
  typeText(text_theme, "Light Mode", 50);
}

function close_profil(profil_container) {
  profil_container.remove();

  profil_visible = false;
  profile_name.classList.remove("profile-name-visible");
}

function profil_button_funktion(profil_container) {
  const delete_button = profil_container.querySelector(".delete-button");
  const save_button = profil_container.querySelector(".save-button-profil");

  // Nicht speichern
  delete_button.addEventListener("click", () => {
    close_profil(profil_container);
  });

  // Speichern
  save_button.addEventListener("click", async () => {
    save_button.disabled = true;

    const result = await update_Profil_data(profil_container);

    save_button.disabled = false;

    if (result === null) {
      console.error("Profil konnte nicht gespeichert werden.");
    }
  });
}

function theme_button_funktion(profil_container) {
  const theme_button = profil_container.querySelector(".button-theme");

  // Anfangszustand einstellen

  if (document.documentElement.dataset.theme === "dark") {
    theme_button.setAttribute("aria-pressed", "false");
  } else {
    theme_button.setAttribute("aria-pressed", "true");
  }

  theme_button.addEventListener("click", () => {
    const theme_button = profil_container.querySelector(".button-theme");

    if (document.documentElement.dataset.theme === "dark") {
      light_mode(profil_container, theme_button);
    } else {
      dark_mode(profil_container, theme_button);
    }
  });
}

function profil_management() {
  const template_profil = document.getElementById("profil-template");
  const existing_profil = document.querySelector(".profil-container");

  if (profil_visible === false) {
    const profil_container =
      template_profil.content.firstElementChild.cloneNode(true);
    document.body.appendChild(profil_container);
    user_data_input(profil_container);

    profil_button_funktion(profil_container);

    load_user_settings(profil_container);
    User_data();
    createThemePreview();
    Choose_color();

    profil_visible = true;
    profile_name.classList.add("profile-name-visible");

    user_data_input(profil_container);
    theme_button_funktion(profil_container);
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

  if (!container) return;

  themesSettings.forEach((theme, index) => {
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

async function load_user_settings(profil_container) {
  const data = await get_user_data();

  if (!data.success) {
    console.error("Einstellungen konnten nicht geladen werden");
    return;
  }

  // Theme aus der Datenbank übernehmen

  document.documentElement.dataset.theme = data.data.color_theme;

  // Hintergrund aus der Datenbank übernehmen

  document.documentElement.dataset.bg = data.data.background_color;

  // Button an das geladene Theme anpassen

  if (profil_container) {
    const theme_button = profil_container.querySelector(".button-theme");

    if (theme_button) {
      const is_light = data.data.color_theme === "light";

      theme_button.setAttribute("aria-pressed", String(is_light));
    }
  }
}
document.addEventListener("DOMContentLoaded", () => {
  User_data();
  profil_management();
  createThemePreview();
  Choose_color();
  load_user_settings();
});
