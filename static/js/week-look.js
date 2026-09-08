const weekGrid = document.querySelector(".week-grid");

for (let stunde = 0; stunde < 24; stunde++) {
  const label = document.createElement("div");
  label.classList.add("time-label");
  label.style.gridRow = stunde + 1;
  label.textContent = String(stunde).padStart(2, "0") + ":00";

  const line = document.createElement("div");
  line.classList.add("hour-line");
  line.style.gridRow = stunde + 1;

  weekGrid.appendChild(label);
  weekGrid.appendChild(line);
}

document.addEventListener("DOMContentLoaded", () => {
  const gridContainer = document.getElementById("grid-container");
  const weekGrid = document.querySelector(".week-grid");
});
