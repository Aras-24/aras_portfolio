// Form und Message‑Container
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const actionURL = contactForm.getAttribute("action");

    try {
        const response = await fetch(actionURL, {
            method: "POST",
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            formMessage.style.color = "green";
            formMessage.textContent = "Danke! Deine Nachricht wurde erfolgreich gesendet.";
            contactForm.reset();
        } else {
            // Fehlerantwort von Formspree
            formMessage.style.color = "red";
            formMessage.textContent = "Fehler beim Senden. Bitte versuche es später.";
        }
    } catch (error) {
        formMessage.style.color = "red";
        formMessage.textContent = "Fehler beim Senden. Bitte versuche es später.";
        console.error("Formspree‑Fehler:", error);
    }
});
