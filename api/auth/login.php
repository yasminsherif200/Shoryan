<?php

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/functions.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, null, "Invalid request method");
}

$email    = sanitize($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

if (!isRequired($email)) jsonResponse(false, null, "Email is required"); 
if (!isRequired($password)) jsonResponse(false, null, "Password is required"); 


$logUser = $dsn->prepare("SELECT id, full_name, email, password, role FROM users WHERE email = :email");
$logUser->execute(['email' => $email]);
$user = $logUser->fetch();

if (!$user || !password_verify($password, $user['password'])) {
    jsonResponse(false, null, "Invalid email or password");
}

$_SESSION['user_id']   = $user['id'];
$_SESSION['full_name'] = $user['full_name'];
$_SESSION['role']      = $user['role'];

jsonResponse(true, ['role' => $user['role']], "Login successful");

