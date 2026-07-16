const form = document.getElementById("registerForm");
const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");
const message_register = document.getElementById("message-register");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const eMail = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, eMail, password }),
  });

  const data = await response.json();
  if (data.success) {
    window.location.href = "/month-look";
  } else {
    message.textContent = data.error;
  }
});

//!   Animation von switch Regs. & Anmelden

const registerLink = document.getElementById("register-link");
const div_anmeldung = document.getElementById("div-anmelde-wrapper");

registerLink.addEventListener("click", () => {
  div_anmeldung.classList.remove("move-down");
  div_anmeldung.classList.add("move-up");

  setTimeout(() => {
    window.location.href = "/register";
  }, 300); // 300 ms warten
});

document.addEventListener("DOMContentLoaded", () => {
  div_anmeldung.classList.remove("move-up");
  div_anmeldung.classList.add("move-down");
});

//!   Kopieren verhindern
const password = document.getElementById("password");

password.addEventListener("copy", (event) => {
  event.preventDefault();
});
