// Function to load requests
async function loadAdminRequests() {
    const res = await fetch('../../api/admin/requests.php');
    const json = await res.json();
    const body = document.getElementById('adminRequestsTable');
    if(body && json.status === 'success') {
        body.innerHTML = json.data.map(req => `
            <tr>
                <td>${req.patient_name}</td>
                <td>${req.requester_name}</td>
                <td>${req.blood_type}</td>
                <td>${req.status}</td>
                <td><button onclick="deleteReq(${req.id})" style="color:red; cursor:pointer;">Delete</button></td>
            </tr>`).join('');
    }
}

// Function to delete
async function deleteReq(id) {
    if(!confirm('Are you sure you want to delete this request?')) return;
    const fd = new FormData();
    fd.append('id', id);
    fd.append('action', 'delete');
    const res = await fetch('../../api/admin/requests.php', { method: 'POST', body: fd });
    const json = await res.json();
    alert(json.message);
    loadAdminRequests();
}

// Function to load donations
async function loadAdminDonations() {
    const res = await fetch('../../api/admin/donations.php');
    const json = await res.json();
    const body = document.getElementById('adminDonationsTable');
    if(body && json.status === 'success') {
        body.innerHTML = json.data.map(don => `
            <tr>
                <td>${don.donor_name}</td>
                <td>${don.patient_name}</td>
                <td>${don.blood_type}</td>
                <td>${don.status}</td>
            </tr>`).join('');
    }
}