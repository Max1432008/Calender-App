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
    window.location.href = "/dashboard";
  } else {
    message.textContent = data.error;
  }
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username-register").value;
  const eMail = document.getElementById("email-register").value;
  const password = document.getElementById("password-register").value;
  const password_Confirm = document.getElementById(
    "password-confirm-register",
  ).value;

  const response = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      eMail,
      password,
      password_Confirm,
      Status: "registrieren",
    }),
  });

  const data = await response.json();
  if (data.success) {
    console.log("ALL CORREKT");
    window.location.href = "/month-look";
  } else {
    message_register.textContent = data.error;
  }
});
