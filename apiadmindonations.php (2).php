<?php
header("Content-Type: application/json");
require_once '../../config/db.php';
require_once '../../includes/auth_check.php';
require_admin();

try {
    $stmt = $dsn->query("SELECT d.status, d.created_at, u.full_name as donor_name, br.patient_name, br.blood_type 
                         FROM donations d 
                         JOIN users u ON d.donor_id = u.id 
                         JOIN blood_requests br ON d.request_id = br.id");
    echo json_encode(["status" => "success", "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}