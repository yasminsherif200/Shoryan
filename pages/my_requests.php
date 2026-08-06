<?php
require_once __DIR__ . '/../includes/auth_check.php';
require_login();

$currentPage = 'my-requests';
$pageTitle = 'My Requests';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><?= htmlspecialchars($pageTitle) ?> - Shoryan</title>
    <link rel="stylesheet" href="/Shoryan/assets/css/navbar.css">
    <link rel="stylesheet" href="/Shoryan/assets/css/footer.css">
    <style>
        .page-with-sidebar {
            padding: 32px 40px 60px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
            background: #f7f7f6;
            min-height: calc(100vh - 1px);
        }

        .page-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            margin-bottom: 24px;
            flex-wrap: wrap;
            gap: 12px;
        }

        .page-header h1 {
            font-size: 26px;
            font-weight: 800;
            color: #1a1a1a;
            margin: 0 0 4px 0;
            font-family: Georgia, 'Times New Roman', serif;
        }

        .page-header p {
            font-size: 13px;
            color: #7a7a7a;
            margin: 0;
        }

        .btn-request-blood {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: linear-gradient(135deg, #dc2626, #b91c1c);
            color: #fff;
            font-size: 13px;
            font-weight: 700;
            text-decoration: none;
            padding: 12px 20px;
            border-radius: 12px;
            border: none;
            white-space: nowrap;
        }

        #requestsMessage {
            font-size: 13px;
            color: #b3261e;
            background: #fdecea;
            border: 1px solid #f6c8c4;
            border-radius: 10px;
            padding: 10px 14px;
            margin-bottom: 16px;
        }
        #requestsMessage:empty { display: none; }

        .request-list { display: flex; flex-direction: column; gap: 16px; }

        .request-card {
            background: #ffffff;
            border: 1px solid #eceae7;
            border-radius: 18px;
            padding: 20px 24px;
        }

        .request-card-top {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 16px;
            flex-wrap: wrap;
        }

        .request-card-left { display: flex; align-items: flex-start; gap: 14px; }

        .bt-badge {
            width: 48px;
            height: 48px;
            flex-shrink: 0;
            background: linear-gradient(135deg, #ef4444, #b91c1c);
            color: #fff;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 15px;
        }

        .request-info .meta-row {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 4px;
        }

        .request-code { font-size: 12px; color: #9a9a9a; font-weight: 700; }

        .urgency-pill {
            font-size: 10.5px;
            font-weight: 800;
            text-transform: uppercase;
            padding: 2px 8px;
            border-radius: 999px;
            letter-spacing: 0.02em;
        }
        .urgency-critical  { background: #fde3e1; color: #b3261e; }
        .urgency-urgent    { background: #fde3e1; color: #b3261e; }
        .urgency-moderate  { background: #fde3e1; color: #b3261e; }
        .urgency-scheduled { background: #fde3e1; color: #b3261e; }
        .status-fulfilled  { background: #dff5e6; color: #12805c; }
        .status-cancelled  { background: #ececec; color: #7a7a7a; }

        .request-info h3 {
            margin: 0 0 4px 0;
            font-size: 16px;
            font-weight: 800;
            color: #1a1a1a;
        }

        .request-info .location {
            font-size: 12.5px;
            color: #8a8a8a;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .request-card-right { text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }

        .units-label { font-size: 11px; color: #9a9a9a; font-weight: 700; margin-bottom: 2px; }
        .units-value { font-size: 13.5px; font-weight: 800; color: #b3261e; }

        .card-actions { display: flex; gap: 8px; }

        .btn-fulfilled {
            background: #16a34a;
            color: #fff;
            border: none;
            font-size: 12px;
            font-weight: 700;
            padding: 8px 14px;
            border-radius: 8px;
            cursor: pointer;
        }
        .btn-fulfilled:hover { background: #128a3e; }

        .btn-view {
            background: #f1f1f0;
            color: #333;
            border: none;
            font-size: 12px;
            font-weight: 700;
            padding: 8px 14px;
            border-radius: 8px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
        }
        .btn-view:hover { background: #e6e6e5; }

        .progress-track {
            margin-top: 14px;
            width: 100%;
            height: 6px;
            background: #f0efee;
            border-radius: 999px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #ef4444, #b91c1c);
            border-radius: 999px;
        }

        .empty-state {
            text-align: center;
            padding: 50px 0;
            color: #9a9a9a;
            font-size: 13.5px;
            background: #fff;
            border: 1px solid #eceae7;
            border-radius: 18px;
        }
    </style>
</head>
<body>

<?php include __DIR__ . '/../includes/navbar.php'; ?>

<main class="page-with-sidebar">

    <div class="page-header">
        <div>
            <h1>My Requests</h1>
            <p>Manage blood requests posted by you</p>
        </div>
        <a href="request_create.php" class="btn-request-blood">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            Request Blood
        </a>
    </div>

    <div id="requestsMessage"></div>

    <div id="requestList" class="request-list"></div>

</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>

<script src="/Shoryan/assets/js/requests.js"></script>
<script>
/*
  NOTE: this assumes `requests.js` exposes a `RequestsAPI` object with:
    - RequestsAPI.list(filters)  -> already used on browse_requests.php
    - a way to scope results to the logged-in user's own requests
    - a field for units fulfilled / request code (see message below the code)
  Adjust the field names below (request.xxx) to match whatever your
  api/list.php (or equivalent) actually returns.
*/
function urgencyClass(urgency, status) {
  if (status === 'fulfilled') return 'status-fulfilled';
  if (status === 'cancelled') return 'status-cancelled';
  return 'urgency-' + (urgency || 'moderate').toLowerCase();
}

function renderRequestCard(r) {
  const needed = Number(r.units_needed || 0);
  const fulfilled = Number(r.units_fulfilled || 0); // may not exist in your schema yet
  const percent = needed > 0 ? Math.min(100, Math.round((fulfilled / needed) * 100)) : 0;
  const isFulfilled = r.status === 'fulfilled' || fulfilled >= needed;
  const badgeLabel = r.status === 'fulfilled' ? 'FULFILLED' : (r.urgency || '').toUpperCase();

  return `
    <div class="request-card">
      <div class="request-card-top">
        <div class="request-card-left">
          <div class="bt-badge">${r.blood_type}</div>
          <div class="request-info">
            <div class="meta-row">
              <span class="request-code">REQ-${r.id}</span>
              <span class="urgency-pill ${urgencyClass(r.urgency, r.status)}">${badgeLabel}</span>
            </div>
            <h3>${r.patient_name}</h3>
            <p class="location">📍 ${r.hospital_name || ''} (${r.city || ''})</p>
          </div>
        </div>
        <div class="request-card-right">
          <div>
            <p class="units-label">UNITS NEEDED</p>
            <p class="units-value">${fulfilled} / ${needed} units</p>
          </div>
          <div class="card-actions">
            ${!isFulfilled ? `<button class="btn-fulfilled" onclick="markFulfilled(${r.id})">Mark Fulfilled</button>` : ''}
            <a href="request_details.php?id=${r.id}" class="btn-view">View Details</a>
          </div>
        </div>
      </div>
      <div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div>
    </div>
  `;
}

async function loadMyRequests() {
  const msg = document.getElementById('requestsMessage');
  const list = document.getElementById('requestList');
  msg.textContent = '';

  try {
    // TODO: confirm this filters to the logged-in user's own requests server-side
    const result = await RequestsAPI.list({ mine: 1 });

    if (!result.success) {
      msg.textContent = result.message || 'Failed to load your requests.';
      return;
    }
    if (!result.data.length) {
      list.innerHTML = '<div class="empty-state">You haven\u2019t created any blood requests yet.</div>';
      return;
    }
    list.innerHTML = result.data.map(renderRequestCard).join('');
  } catch (err) {
    msg.textContent = 'Failed to load your requests. Please try again.';
  }
}

async function markFulfilled(id) {
  try {
    const res = await fetch('/Shoryan/api/requests/update.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ request_id: id, status: 'fulfilled' })
    });
    const result = await res.json();
    if (result.success) {
      loadMyRequests();
    } else {
      alert(result.message || 'Could not update the request.');
    }
  } catch (err) {
    alert('Could not update the request.');
  }
}

loadMyRequests();
</script>
</body>
</html>
