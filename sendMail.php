<?php
$data = json_decode(file_get_contents("php://input"));

$name = trim($data->name);
$email = trim($data->email);
$message = trim($data->message);

if(empty($name) || empty($email) || empty($message)){
    echo "Bitte füllen Sie alle Pflichtfelder aus.";
    exit;
}

$to = "arasadaib@web.de"; // Meine E-Mail
$subject = "Neue Nachricht von Portfolio-Kontaktformular";
$body = "Name: $name\nE-Mail: $email\n\nNachricht:\n$message";
$headers = "From: $email";

if(mail($to, $subject, $body, $headers)){
    echo "Nachricht erfolgreich gesendet!";
}else{
    echo "Die Nachricht konnte leider nicht gesendet werden.<br>Bitte versuchen Sie es erneut.";
}
?>
