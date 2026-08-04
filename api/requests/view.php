<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/functions.php';
require_once __DIR__ . '/../../includes/auth_check.php';

require_login();

$request_id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
if ($request_id <= 0) {
    json_response(false, 'Valid request ID is required.', null, 400);
}

try {
    $sql = "SELECT r.*, u.name AS requester_name, u.phone AS requester_phone
            FROM blood_requests r
            JOIN users u ON u.id = r.requester_id
            WHERE r.id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->execute([':id' => $request_id]);
    $request = $stmt->fetch();

    if (!$request) {
        json_response(false, 'Request not found.', null, 404);
    }

    $donations_sql = "SELECT d.id, d.donor_id, d.status, d.created_at, u.name AS donor_name, u.phone AS donor_phone
                       FROM donations d
                       JOIN users u ON u.id = d.donor_id
                       WHERE d.request_id = :id
                       ORDER BY d.created_at DESC";
    $donationsStmt = $conn->prepare($donations_sql);
    $donationsStmt->execute([':id' => $request_id]);
    $donations = $donationsStmt->fetchAll();

    $request['donations'] = $donations;

    json_response(true, 'Request retrieved.', $request);
} catch (PDOException $e) {
    json_response(false, 'Failed to retrieve request: ' . $e->getMessage(), null, 500);
}
