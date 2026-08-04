// لما صفحة manage_users.php تفتح، حمّل المستخدمين على طول
document.addEventListener('DOMContentLoaded', function () {
    const usersTableBody = document.getElementById('usersTableBody');
    if (usersTableBody) {
        loadUsers();
    }
});

// ========================================================
// جيب كل المستخدمين واعرضهم في جدول manage_users.php
// ========================================================
function loadUsers() {
    const messageBox = document.getElementById('usersMessage');
    const table = document.getElementById('usersTable');
    const tbody = document.getElementById('usersTableBody');

    fetch('/Shoryan/api/admin/users.php')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (!data.success) {
                messageBox.textContent = data.message;
                return;
            }

            if (data.data.length === 0) {
                messageBox.textContent = 'No users found.';
                return;
            }

            tbody.innerHTML = '';
            data.data.forEach(function (row) {
                const tr = document.createElement('tr');
                tr.innerHTML =
                    '<td>' + row.full_name + '</td>' +
                    '<td>' + row.email + '</td>' +
                    '<td>' + row.phone + '</td>' +
                    '<td>' + row.blood_type + '</td>' +
                    '<td>' + row.city + '</td>' +
                    '<td>' + row.role + '</td>' +
                    '<td>' + row.created_at + '</td>' +
                    '<td><button onclick="deleteUser(' + row.id + ')">Delete</button></td>';
                tbody.appendChild(tr);
            });

            table.style.display = 'table';
        })
        .catch(function (err) {
            console.error(err);
            messageBox.textContent = 'Failed to load users.';
        });
}

// ========================================================
// مسح مستخدم معين بعد تأكيد من الأدمن
// ========================================================
function deleteUser(userId) {
    const confirmed = confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;

    const formData = new URLSearchParams();
    formData.append('user_id', userId);

    fetch('/Shoryan/api/admin/users.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
    })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            alert(data.message);
            if (data.success) {
                loadUsers();
            }
        })
        .catch(function (err) {
            console.error(err);
            alert('Something went wrong. Please try again.');
        });
}
