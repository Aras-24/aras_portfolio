document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("contact-name").value.trim();
  const email = document.getElementById("contact-email").value.trim();
  const message = document.getElementById("contact-message").value.trim();
  const formMessage = document.getElementById("formMessage");

  if (!name || !email || !message) {
    formMessage.textContent = "Bitte füllen Sie alle Pflichtfelder aus.";
    formMessage.style.color = "red";
    return;
  }

  //Daten an Backend senden(sendMail.php)

  fetch("sendMail.php", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, message }),
  })
    .then((response) => response.text())
    .then((data) => {
      formMessage.textContent = data;
      formMessage.style.color = "green";
      document.getElementById("contactForm").reset();
    })

    .catch((error) => {
      formMessage.textContent =
        "Die Nachricht konnte leider nicht gesendet werden.\nBitte versuchen Sie es erneut.";
      formMessage.style.color = "red";
    });
});
