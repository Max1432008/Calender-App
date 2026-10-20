navigator.serviceWorker.register("/service-worker.js");

const button = document.getElementById("Mitteilungen");

button.addEventListener("click", async () => {
  const result = await Notification.requestPermission();
  if (result === "granted") {
    const reg = await navigator.serviceWorker.ready;

    await reg.showNotification("Mein Kalender 📅", {
      body: "Deine Mitteilungen funktionieren!",
      icon: "/static/img/notification-icon.png",
      badge: "/static/img/notification-icon.png",
    });
  }
});
