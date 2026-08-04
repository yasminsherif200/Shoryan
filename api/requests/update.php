<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/functions.php';
require_once __DIR__ . '/../../includes/auth_check.php';

$user_id  = require_login();
$is_admin = ($_SESSION['role'] ?? '') === 'admin';

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

if (empty($input['request_id'])) {
    json_response(false, 'Request ID is required.', null, 400);
}
$request_id = (int) $input['request_id'];

try {
    $checkStmt = $conn->prepare("SELECT requester_id FROM blood_requests WHERE id = :id");
    $checkStmt->execute([':id' => $request_id]);
    $existing = $checkStmt->fetch();

    if (!$existing) {
        json_response(false, 'Request not found.', null, 404);
    }

    if (!$is_admin && (int) $existing['requester_id'] !== (int) $user_id) {
        json_response(false, 'You do not have permission to edit this request.', null, 403);
    }

    $fields = [];
    $params = [':id' => $request_id];

    if (isset($input['patient_name'])) {
        $fields[] = "patient_name = :patient_name";
        $params[':patient_name'] = sanitize($input['patient_name']);
    }
    if (isset($input['blood_type'])) {
        if (!valid_blood_type($input['blood_type'])) {
            json_response(false, 'Invalid blood type.', null, 400);
        }
        $fields[] = "blood_type = :blood_type";
        $params[':blood_type'] = sanitize($input['blood_type']);
    }
    if (isset($input['city'])) {
        $fields[] = "city = :city";
        $params[':city'] = sanitize($input['city']);
    }
    if (isset($input['hospital_name'])) {
        $fields[] = "hospital_name = :hospital_name";
        $params[':hospital_name'] = sanitize($input['hospital_name']);
    }
    if (isset($input['units_needed'])) {
        $units = (int) $input['units_needed'];
        if ($units < 1) {
            json_response(false, 'Units needed must be at least 1.', null, 400);
        }
        $fields[] = "units_needed = :units_needed";
        $params[':units_needed'] = $units;
    }
    if (isset($input['urgency'])) {
        if (!valid_urgency($input['urgency'])) {
            json_response(false, 'Invalid urgency level.', null, 400);
        }
        $fields[] = "urgency = :urgency";
        $params[':urgency'] = sanitize($input['urgency']);
    }
    if (isset($input['status'])) {
        if (!valid_request_status($input['status'])) {
            json_response(false, 'Invalid status.', null, 400);
        }
        $fields[] = "status = :status";
        $params[':status'] = sanitize($input['status']);
    }
    if (isset($input['notes'])) {
        $fields[] = "notes = :notes";
        $params[':notes'] = sanitize($input['notes']);
    }

    if (empty($fields)) {
        json_response(false, 'No fields to update.', null, 400);
    }

    $sql = "UPDATE blood_requests SET " . implode(', ', $fields) . ", updated_at = NOW() WHERE id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);

    json_response(true, 'Request updated successfully.');
} catch (PDOException $e) {
    json_response(false, 'Failed to update request: ' . $e->getMessage(), null, 500);
}
