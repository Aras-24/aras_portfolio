// 1. FORMULAR ELEMENTE
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

// 2. EVENTLISTENER FÜR FORM SUBMIT
contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

     // 3. FORM DATA SAMMELN
     const formData = new FormData(contactForm);

     // 4. FETCH ZU RENDER BACKEND
     try {
        // URL zu Render PHP-Backend
        // Früher: action="sendMail.php" lokal
        const response = await fetch("https://mein-kontaktformular.onrender.com/sendMail.php", {
            method: "POST",
            body: formData
        });

        // Prüfen, ob Server ok antwortet
        if (!response.ok) throw new Error(`Server antwortete mit Status ${response.status}`);

        const result = await response.text();

        // Erfolgsmeldung im Frontend
        formMessage.style.color = "green";
        formMessage.textContent = "Danke! Ihre Nachricht wurde gesendet.";
        contactForm.reset();

    } catch (error) {
        // Fehlerbehandlung
        formMessage.style.color = "red";
        formMessage.textContent = "Leider konnte die Nachricht nicht gesendet werden. Bitte versuchen Sie es später.";
        console.error("Fehler beim Senden des Formulars:", error);
    }
});

// 5. OPTIONAL: Real-Time Feedback bei Eingaben

const inputs = contactForm.querySelectorAll("input, textarea");
inputs.forEach(input => {
    input.addEventListener("input", () => {
        formMessage.textContent = ""; // Alte Meldungen löschen
    });
});