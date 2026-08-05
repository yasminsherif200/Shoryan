<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/functions.php';
require_once __DIR__ . '/../../includes/auth_check.php';

require_login();
$user_id  = $_SESSION['user_id'];
$is_admin = ($_SESSION['role'] ?? '') === 'admin';

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

if (empty($input['request_id'])) {
    jsonResponse(false, null, 'Request ID is required.');
}
$request_id = (int) $input['request_id'];

try {
    $checkStmt = $dsn->prepare("SELECT requester_id FROM blood_requests WHERE id = :id");
    $checkStmt->execute(['id' => $request_id]);
    $existing = $checkStmt->fetch();

    if (!$existing) {
        jsonResponse(false, null, 'Request not found.');
    }

    if (!$is_admin && (int) $existing['requester_id'] !== (int) $user_id) {
        jsonResponse(false, null, 'You do not have permission to edit this request.');
    }

    $fields = [];
    $params = ['id' => $request_id];

    if (isset($input['patient_name'])) {
        $fields[] = "patient_name = :patient_name";
        $params['patient_name'] = sanitize($input['patient_name']);
    }
    if (isset($input['blood_type'])) {
        if (!isValidBloodType($input['blood_type'])) {
            jsonResponse(false, null, 'Invalid blood type.');
        }
        $fields[] = "blood_type = :blood_type";
        $params['blood_type'] = sanitize($input['blood_type']);
    }
    if (isset($input['city'])) {
        $fields[] = "city = :city";
        $params['city'] = sanitize($input['city']);
    }
    if (isset($input['hospital_name'])) {
        $fields[] = "hospital_name = :hospital_name";
        $params['hospital_name'] = sanitize($input['hospital_name']);
    }
    if (isset($input['units_needed'])) {
        $units = (int) $input['units_needed'];
        if ($units < 1) {
            jsonResponse(false, null, 'Units needed must be at least 1.');
        }
        $fields[] = "units_needed = :units_needed";
        $params['units_needed'] = $units;
    }
    if (isset($input['urgency'])) {
        if (!isValidUrgency($input['urgency'])) {
            jsonResponse(false, null, 'Invalid urgency level.');
        }
        $fields[] = "urgency = :urgency";
        $params['urgency'] = sanitize($input['urgency']);
    }
    if (isset($input['status'])) {
        if (!in_array($input['status'], REQUEST_STATUSES, true)) {
            jsonResponse(false, null, 'Invalid status.');
        }
        $fields[] = "status = :status";
        $params['status'] = sanitize($input['status']);
    }
    if (isset($input['notes'])) {
        $fields[] = "notes = :notes";
        $params['notes'] = sanitize($input['notes']);
    }

    if (empty($fields)) {
        jsonResponse(false, null, 'No fields to update.');
    }

    $sql = "UPDATE blood_requests SET " . implode(', ', $fields) . ", updated_at = NOW() WHERE id = :id";
    $stmt = $dsn->prepare($sql);
    $stmt->execute($params);

    jsonResponse(true, null, 'Request updated successfully.');
} catch (PDOException $e) {
    jsonResponse(false, null, 'Failed to update request: ' . $e->getMessage());
}