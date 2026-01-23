<?php
// ==================================================
// sendMail.php mit PHPMailer + SMTP + CORS für GitHub Pages
// ==================================================

require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

// ====================================
// ENV VARIABLES LADEN
// ====================================
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// ====================================
// CORS: nur GitHub Pages erlauben
// ====================================
$allowedOrigin = "https://aras-24.github.io";
if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] === $allowedOrigin) {
    header("Access-Control-Allow-Origin: $allowedOrigin");
} else {
    header("HTTP/1.1 403 Forbidden");
    exit("CORS: Zugriff verweigert");
}

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: text/plain");

// Preflight OPTIONS Request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ====================================
// FORMULARDATEN
// ====================================
$name    = $_POST['name'] ?? '';
$email   = $_POST['email'] ?? '';
$phone   = $_POST['phone'] ?? '';
$message = $_POST['message'] ?? '';

$name = strip_tags(trim($name));
$email = filter_var(trim($email), FILTER_SANITIZE_EMAIL);
$phone = strip_tags(trim($phone));
$message = strip_tags(trim($message));

if (!$name || !$email || !$message) {
    http_response_code(400);
    exit("Bitte füllen Sie Name, E-Mail und Nachricht aus.");
}

// ====================================
// PHPMailer SMTP
// ====================================
$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = $_ENV['SMTP_HOST'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $_ENV['SMTP_USER'];
    $mail->Password   = $_ENV['SMTP_PASS'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = $_ENV['SMTP_PORT'];

    $mail->setFrom($email, $name);
    $mail->addAddress('arasadaib@web.de', 'Aras Adaib');

    $mail->isHTML(false);
    $mail->Subject = "Neue Kontaktanfrage von $name";
    $mail->Body    = "Name: $name\nE-Mail: $email\nTelefon: $phone\n\nNachricht:\n$message";

    $mail->send();
    http_response_code(200);
    echo "Ihre Nachricht wurde gesendet.";

} catch (Exception $e) {
    http_response_code(500);
    echo "Nachricht konnte nicht gesendet werden. Fehler: {$mail->ErrorInfo}";
}
