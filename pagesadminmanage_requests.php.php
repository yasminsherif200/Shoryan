<?php 
require_once '../../includes/auth_check.php';
require_admin();
include '../../includes/navbar.php'; 
?>
<div style="padding:20px;">
    <h2>Manage Blood Requests</h2>
    <table border="1" width="100%">
        <thead>
            <tr><th>Patient</th><th>Requester</th><th>Blood Type</th><th>Status</th><th>Action</th></tr>
        </thead>
        <tbody id="adminRequestsTable"></tbody>
    </table>
</div>
<script src="../../assets/js/admin.js"></script>
<script>document.addEventListener('DOMContentLoaded', loadAdminRequests);</script>