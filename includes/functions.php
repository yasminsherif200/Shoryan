<?php

require_once __DIR__ . '/../config/constants.php';

function jsonResponse($success, $data = null, $message = ''){
    header('Content-Type: application/json');
    echo json_encode(['success' => $success, 'data' => $data, 'message' => $message]);
    exit;
}

function sanitize($input){
    return htmlspecialchars(trim($input));
}

function isValidEmail($email){
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function isValidBloodType($bloodType){
    return in_array($bloodType, BLOOD_TYPES, true);
}

function isValidGender($gender){
    return in_array($gender, GENDERS, true);
}

function isValidUrgency($urgency){
    return in_array($urgency, URGENCY_LEVELS, true);
}

function isValidPhone($phone){
    return preg_match('/^01[0125]\d{8}$/', $phone) === 1;
}

function isRequired($value){
    return trim($value ?? '') !== '';
}