<?php
header("Content-Type: application/json");
require_once '../../config/db.php';
require_once '../../includes/auth_check.php';
require_admin(); // التأكد أنك أدمن

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // جلب الطلبات
        $stmt = $dsn->query("SELECT br.*, u.full_name as requester_name FROM blood_requests br JOIN users u ON br.requester_id = u.id ORDER BY br.created_at DESC");
        echo json_encode(["status" => "success", "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // حذف طلب
        $id = $_POST['id'] ?? 0;
        if ($_POST['action'] === 'delete') {
            $stmt = $dsn->prepare("DELETE FROM blood_requests WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(["status" => "success", "message" => "Request Deleted Successfully"]);
        }
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}