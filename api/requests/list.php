<?php

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/functions.php';
require_once __DIR__ . '/../../includes/auth_check.php';

require_login();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(false, null, "Invalid Request Method");
}

$scope = $_GET['scope'] ?? 'mine'; // 'mine' (default, unchanged) or 'all' (for browse)

$sql = "SELECT id, requester_id, patient_name, blood_type, units_needed, hospital_name,
               city, urgency, status, created_at
        FROM blood_requests";
$conditions = [];
$params = [];

if ($scope === 'mine') {
    $conditions[] = "requester_id = :user_id";
    $params['user_id'] = $_SESSION['user_id'];
} else {
    // Browse mode: only show open requests by default, plus whatever filters were sent
    $status = $_GET['status'] ?? 'open';
    if ($status !== '') {
        $conditions[] = "status = :status";
        $params['status'] = $status;
    }
}

$blood_type = sanitize($_GET['blood_type'] ?? '');
if ($blood_type !== '') {
    if (!isValidBloodType($blood_type)) {
        jsonResponse(false, null, "Invalid blood type");
    }
    $conditions[] = "blood_type = :blood_type";
    $params['blood_type'] = $blood_type;
}

$city = sanitize($_GET['city'] ?? '');
if ($city !== '') {
    $conditions[] = "city LIKE :city";
    $params['city'] = '%' . $city . '%';
}

$search = sanitize($_GET['search'] ?? '');
if ($search !== '' && $scope === 'all') {
    $conditions[] = "(patient_name LIKE :search OR hospital_name LIKE :search)";
    $params['search'] = '%' . $search . '%';
}

if (!empty($conditions)) {
    $sql .= " WHERE " . implode(' AND ', $conditions);
}

$sql .= " ORDER BY created_at DESC";

$stmt = $dsn->prepare($sql);
$stmt->execute($params);
$requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

jsonResponse(true, $requests, count($requests) . " request(s) found");