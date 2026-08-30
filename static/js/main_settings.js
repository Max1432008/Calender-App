function typeText(element, text, speed = 50) {
  element.textContent = "";

  let i = 0;

  const interval = setInterval(() => {
    element.textContent += text[i];
    i++;

    if (i >= text.length) {
      clearInterval(interval);
    }
  }, speed);
}

function hidden_sheet(append_objekt, objekt) {
  sheet_out = false;
  append_objekt.replaceChildren();
  objekt.style.opacity = 0;
}
