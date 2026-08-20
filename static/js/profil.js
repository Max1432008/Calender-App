const profile_name = document.querySelector(".profile-name");
const profil_button = document.getElementById("profil-button");

profil_button.addEventListener("click", () => {
  profile_name.classList.toggle("profile-name-visible");
});

function get_user_data_header() {
  fetch("/get-user-data-header")
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        profile_name.textContent = data.data.name;
      } else {
        console.error("Fehler beim Abrufen der Benutzerdaten:", data.error);
        profile_name.textContent = "Nicht gefunden";
      }
    });
}

get_user_data_header();
