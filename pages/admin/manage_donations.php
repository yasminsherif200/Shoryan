<?php require_once __DIR__ . '/../../includes/auth_check.php'; require_admin(); ?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Manage Donations - Admin Portal - Shoryan</title>
<link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
<?php include __DIR__ . '/../../includes/navbar.php'; ?>

<main class="container">
  <h1>Manage Donation Offers</h1>
  <p class="muted">Review donors who responded to each request and update the status of each donation offer.</p>

  <form id="donations-filter-form" class="filters">
    <select name="status">
      <option value="">All statuses</option>
      <option value="pending">Pending</option>
      <option value="accepted">Accepted</option>
      <option value="completed">Completed</option>
      <option value="cancelled">Cancelled</option>
    </select>
    <button type="submit">Filter</button>
  </form>

  <table class="admin-table">
    <thead>
      <tr>
        <th>Donor</th>
        <th>Donor Phone</th>
        <th>Request</th>
        <th>Patient</th>
        <th>Blood Type</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody id="donations-table-body">
      <tr><td colspan="7">Loading...</td></tr>
    </tbody>
  </table>
</main>

<?php include __DIR__ . '/../../includes/footer.php'; ?>
<script src="/assets/js/admin.js"></script>
<script>
  AdminAPI.renderDonationsTable();

  document.getElementById('donations-filter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    AdminAPI.renderDonationsTable(data);
  });
</script>
</body>
</html>
