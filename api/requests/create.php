<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/functions.php';
require_once __DIR__ . '/../../includes/auth_check.php';

require_login();
$user_id = $_SESSION['user_id'];

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

$requiredFields = ['patient_name', 'blood_type', 'city', 'units_needed', 'urgency'];
foreach ($requiredFields as $field) {
    if (!isRequired($input[$field] ?? '')) {
        jsonResponse(false, null, "Missing required field: $field");
    }
}

if (!isValidBloodType($input['blood_type'])) {
    jsonResponse(false, null, 'Invalid blood type.');
}

if (!isValidUrgency($input['urgency'])) {
    jsonResponse(false, null, 'Invalid urgency level.');
}

$units = (int) $input['units_needed'];
if ($units < 1) {
    jsonResponse(false, null, 'Units needed must be at least 1.');
}

$patient_name  = sanitize($input['patient_name']);
$blood_type    = sanitize($input['blood_type']);
$city          = sanitize($input['city']);
$hospital_name = sanitize($input['hospital_name'] ?? '');
$urgency       = sanitize($input['urgency']);
$notes         = sanitize($input['notes'] ?? '');

$sql = "INSERT INTO blood_requests
            (requester_id, patient_name, blood_type, city, hospital_name, units_needed, urgency, status, notes, created_at)
        VALUES
            (:requester_id, :patient_name, :blood_type, :city, :hospital_name, :units_needed, :urgency, 'open', :notes, NOW())";

try {
    $stmt = $dsn->prepare($sql);
    $stmt->execute([
        'requester_id'  => $user_id,
        'patient_name'  => $patient_name,
        'blood_type'    => $blood_type,
        'city'          => $city,
        'hospital_name' => $hospital_name,
        'units_needed'  => $units,
        'urgency'       => $urgency,
        'notes'         => $notes,
    ]);

    jsonResponse(true, ['request_id' => (int) $dsn->lastInsertId()], 'Blood request created successfully.');
} catch (PDOException $e) {
    jsonResponse(false, null, 'Failed to create request: ' . $e->getMessage());
}