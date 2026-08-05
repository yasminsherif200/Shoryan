<?php

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/functions.php';
require_once __DIR__ . '/../../includes/auth_check.php';

require_login();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, null, "Invalid Request Method");
}

// A user can only edit their own profile
$user_id = $_SESSION['user_id'];

$full_name          = sanitize($_POST['full_name'] ?? '');
$phone              = $_POST['phone'] ?? '';
$blood_type         = sanitize($_POST['blood_type'] ?? '');
$city               = sanitize($_POST['city'] ?? '');
$address            = sanitize($_POST['address'] ?? '');
$gender             = sanitize($_POST['gender'] ?? '');
$is_available       = $_POST['is_available'] ?? '1';
$last_donation_date = trim($_POST['last_donation_date'] ?? '');

// Required fields
if (!isRequired($full_name))  jsonResponse(false, null, "Full name is Required");
if (!isRequired($phone))      jsonResponse(false, null, "Phone number is Required");
if (!isRequired($blood_type)) jsonResponse(false, null, "Blood type is Required");
if (!isRequired($city))       jsonResponse(false, null, "City is Required");
if (!isRequired($gender))     jsonResponse(false, null, "Gender is Required");

// Format checks 
// Validate phone number, blood type, and gender from functions.php file
if (!isValidPhone($phone))          jsonResponse(false, null, "Invalid Phone number");
if (!isValidBloodType($blood_type)) jsonResponse(false, null, "Invalid blood type");
if (!isValidGender($gender))        jsonResponse(false, null, "Invalid gender");

// Availability toggle -> 0 / 1
$is_available = ($is_available === '1' || $is_available === 'on' || $is_available === 1) ? 1 : 0;

// Optional fields -> NULL when empty
$address = ($address === '') ? null : $address;

if ($last_donation_date === '') {
    $last_donation_date = null;
} elseif (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $last_donation_date)) {
    jsonResponse(false, null, "Invalid last donation date");
}

$update = $dsn->prepare(
    "UPDATE users SET
        full_name          = :full_name,
        phone              = :phone,
        blood_type         = :blood_type,
        city               = :city,
        address            = :address,
        gender             = :gender,
        is_available       = :is_available,
        last_donation_date = :last_donation_date
     WHERE id = :id"
);

$update->execute([
    'full_name'          => $full_name,
    'phone'              => $phone,
    'blood_type'         => $blood_type,
    'city'               => $city,
    'address'            => $address,
    'gender'             => $gender,
    'is_available'       => $is_available,
    'last_donation_date' => $last_donation_date,
    'id'                 => $user_id,
]);

// Keep the name shown in the navbar / topbar in sync
$_SESSION['full_name'] = $full_name;

jsonResponse(true, null, "Profile updated successfully");
