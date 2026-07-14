const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");
const todayButton = document.getElementById("today");

prevMonthButton.addEventListener("click", () => {
  // Logic to go to the previous month
  console.log("Previous month button clicked");
  prevMonthButton.classList.add("nav-button-moveLeft");
});

nextMonthButton.addEventListener("click", () => {
  // Logic to go to the next month
  console.log("Next month button clicked");
  nextMonthButton.classList.add("nav-button-moveRight");
});

todayButton.addEventListener("click", () => {
  // Logic to go to today's date
  console.log("Today button clicked");
  todayButton.classList.add("nav-button-moveToday");
});

//* Add event listeners for animation end to remove the animation classes

prevMonthButton.addEventListener("animationend", () => {
  prevMonthButton.classList.remove("nav-button-moveLeft");
});
nextMonthButton.addEventListener("animationend", () => {
  nextMonthButton.classList.remove("nav-button-moveRight");
});
todayButton.addEventListener("animationend", () => {
  todayButton.classList.remove("nav-button-moveToday");
});

//*
//*
//*    Search input      */

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

let clickingButton = false;

// --- Sichtbarkeit des Such-Buttons ---

function searchButtonShow() {
  searchButton.classList.add("search-input-focus");
}

function searchButtonHide() {
  searchButton.classList.remove("search-input-focus");
  searchButton.classList.remove("search-click-animation");
}

function searchButtonClickAnimation() {
  searchButton.classList.add("search-click-animation");
}

// --- Event Listener: Input ---

searchInput.addEventListener("focus", () => {
  searchButtonShow();
  searchButtonClickAnimation();
});

searchInput.addEventListener("focusout", () => {
  if (clickingButton) {
    // Klick auf den Button war der Grund für den Fokusverlust -> nicht verstecken
    clickingButton = false;
    return;
  }
  searchButtonHide();
});

// --- Event Listener: Button ---

// mousedown feuert VOR focusout, deshalb setzen wir hier das Flag
searchButton.addEventListener("mousedown", () => {
  clickingButton = true;
});

searchButton.addEventListener("click", () => {
  searchButtonShow();
  searchButtonClickAnimation();
  searchInput.focus(); // optional: Fokus zurück ins Suchfeld
});
