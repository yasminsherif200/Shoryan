<?php require_once __DIR__ . '/../../includes/auth_check.php'; require_admin(); ?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Manage Blood Requests - Admin Portal - Shoryan</title>
<link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
<?php include __DIR__ . '/../../includes/navbar.php'; ?>

<main class="container">
  <h1>Manage Blood Requests</h1>
  <p class="muted">Verify requests with the hospital blood bank, update request status, or delete a request entirely.</p>

  <form id="admin-filter-form" class="filters">
    <select name="status">
      <option value="">All statuses</option>
      <option value="open">Open</option>
      <option value="fulfilled">Fulfilled</option>
    </select>
    <button type="submit">Filter</button>
  </form>

  <table class="admin-table">
    <thead>
      <tr>
        <th>Code</th>
        <th>Patient</th>
        <th>Blood Type</th>
        <th>Hospital</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody id="requests-table-body">
      <tr><td colspan="6">Loading...</td></tr>
    </tbody>
  </table>
</main>

<?php include __DIR__ . '/../../includes/footer.php'; ?>
<script src="/assets/js/requests.js"></script>
<script src="/assets/js/admin.js"></script>
<script>
  AdminAPI.renderRequestsTable();

  document.getElementById('admin-filter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    AdminAPI.renderRequestsTable(data);
  });
</script>
</body>
</html>
