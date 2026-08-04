<?php

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/functions.php';

if($_SERVER['REQUEST_METHOD'] !== 'POST'){
    jsonResponse(false, null, "Invalid Request Method");
}

$full_name = sanitize($_POST['full_name'] ?? '');
$email = sanitize($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$confirmPassword = $_POST['confirm_password'] ?? '';
$phone = $_POST['phone'] ?? '';
$blood_type = sanitize($_POST['blood_type'] ?? '');
$city = sanitize($_POST['city'] ?? '');
$gender = sanitize($_POST['gender'] ?? '');

if(!isRequired($full_name)) jsonResponse(false, null, "Full name is Required");
if(!isRequired($email)) jsonResponse(false, null, "Email is Required");
if(!isRequired($password)) jsonResponse(false, null, "Password is Required");
if(!isRequired($phone)) jsonResponse(false, null, "Phone number is Required");  
if(!isRequired($blood_type)) jsonResponse(false, null, "Blood type is Required");
if(!isRequired($city)) jsonResponse(false, null, "City is Required");
if(!isRequired($gender)) jsonResponse(false, null, "Gender is Required");

if(!isValidEmail($email)) jsonResponse(false, null, "Invalid Email");
if(!isValidBloodType($blood_type)) jsonResponse(false, null, "Invalid blood type");
if(!isValidGender($gender)) jsonResponse(false, null, "Invalid gender");
if(!isValidPhone($phone)) jsonResponse(false, null, "Invalid Phone number");

if(strlen($password) < 8) jsonResponse(false, null, "Password must be at least 8 characters");
if($password !== $confirmPassword) jsonResponse(false, null, "Passwords don't match");


$checkEmail = $dsn->prepare("SELECT id FROM users WHERE email = :email");
$checkEmail->execute(['email' => $email]);
if($checkEmail->fetch()) jsonResponse(false, null, "Email already registered");

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$insertUser = $dsn->prepare(
    "INSERT INTO users (full_name, email, password, phone, blood_type, city, gender, role)
    VALUES (:full_name, :email, :password, :phone, :blood_type, :city, :gender, 'user')"
);

$insertUser->execute([
    'full_name' => $full_name, 
    'email' => $email, 
    'password' => $hashedPassword, 
    'phone' => $phone, 
    'blood_type' => $blood_type, 
    'city' => $city, 
    'gender' => $gender
]);

jsonResponse(true, null, "Registration successful. Please log in.");
