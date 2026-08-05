<?php 
require_once '../../includes/auth_check.php';
require_admin();
include '../../includes/navbar.php'; 
?>
<div style="padding:20px;">
    <h2>Donation Logs</h2>
    <table border="1" width="100%">
        <thead>
            <tr><th>Donor</th><th>Patient</th><th>Blood Type</th><th>Status</th></tr>
        </thead>
        <tbody id="adminDonationsTable"></tbody>
    </table>
</div>
<script src="../../assets/js/admin.js"></script>
<script>document.addEventListener('DOMContentLoaded', loadAdminDonations);</script>