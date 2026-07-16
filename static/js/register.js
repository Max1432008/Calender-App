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

//!   Animation von switch Regs. & Anmelden

const anmeldeLink = document.getElementById("anmelde-link");
const div_Registrierung = document.getElementById("div-registrieren-wrapper");

anmeldeLink.addEventListener("click", () => {
  div_Registrierung.classList.remove("move-down");
  div_Registrierung.classList.add("move-up");

  setTimeout(() => {
    window.location.href = "/";
  }, 300); // 300 ms warten
});

document.addEventListener("DOMContentLoaded", () => {
  div_Registrierung.classList.remove("move-up");
  div_Registrierung.classList.add("move-down");

  //!     Kopieren verhindern

  const password_confirm_register = document.getElementById(
    "password-confirm-register",
  );
  const password_register = document.getElementById("password-register");

  password_confirm_register.addEventListener("copy", (event) => {
    event.preventDefault();
  });
  password_register.addEventListener("copy", (event) => {
    event.preventDefault();
  });

  //!     Passwort bestätigen ausbleden zeigen

  const password_bestätigen = document.getElementById(
    "password-confirm-register",
  );
  const password_frist = document.getElementById("password-register");

  password_frist.addEventListener("focus", () => {
    password_bestätigen.style.visibility = "visible";
  });

  password_frist.addEventListener("focusout", () => {
    if (password_frist.value === "" || password_bestätigen === "") {
      password_bestätigen.style.visibility = "hidden";
      password_bestätigen.value = "";
    } else {
      password_bestätigen.style.visibility = "visible";
    }
  });
});
