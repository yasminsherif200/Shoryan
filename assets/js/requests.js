// لما صفحة my_requests.php تفتح، حمّل طلباتي على طول
document.addEventListener('DOMContentLoaded', function () {
    const requestsTableBody = document.getElementById('requestsTableBody');
    if (requestsTableBody) {
        loadMyRequests();
    }
});

// ========================================================
// جيب كل طلباتي واعرضها في جدول my_requests.php
// ========================================================
function loadMyRequests() {
    const messageBox = document.getElementById('requestsMessage');
    const table = document.getElementById('requestsTable');
    const tbody = document.getElementById('requestsTableBody');

    fetch('/Shoryan/api/requests/list.php')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (!data.success) {
                messageBox.textContent = data.message;
                return;
            }

            if (data.data.length === 0) {
                messageBox.textContent = 'You have not created any request yet.';
                return;
            }

            tbody.innerHTML = '';
            data.data.forEach(function (row) {
                const tr = document.createElement('tr');
                tr.innerHTML =
                    '<td>' + row.patient_name + '</td>' +
                    '<td>' + row.blood_type + '</td>' +
                    '<td>' + row.units_needed + '</td>' +
                    '<td>' + (row.hospital_name || '-') + '</td>' +
                    '<td>' + row.city + '</td>' +
                    '<td>' + row.urgency + '</td>' +
                    '<td><span class="status-badge status-' + row.status + '">' + row.status + '</span></td>' +
                    '<td>' + row.created_at + '</td>' +
                    '<td><button onclick="deleteRequest(' + row.id + ')">Delete</button></td>';
                tbody.appendChild(tr);
            });

            table.style.display = 'table';
        })
        .catch(function (err) {
            console.error(err);
            messageBox.textContent = 'Failed to load your requests.';
        });
}

// ========================================================
// مسح طلب معين بعد تأكيد من المستخدم
// ========================================================
function deleteRequest(requestId) {
    const confirmed = confirm('Are you sure you want to delete this request?');
    if (!confirmed) return;

    const formData = new URLSearchParams();
    formData.append('request_id', requestId);

    fetch('/Shoryan/api/requests/delete.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
    })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            alert(data.message);
            if (data.success) {
                loadMyRequests();
            }
        })
        .catch(function (err) {
            console.error(err);
            alert('Something went wrong. Please try again.');
        });
}
/* ============================================================
   requests.js - Shoryan API Client
   مسؤول عن جميع استدعاءات الـ Backend (Fetch API)
   ============================================================ */

// ----------------------------------------------
// 
// ----------------------------------------------
const API_BASE_URL = 'http://127.0.0.1:8000/api'; // لو شغال على بورت تاني غيرها

// ----------------------------------------------
// 2. معالج الردود العام (معالجة الأخطاء)
// ----------------------------------------------
async function handleResponse(response) {
  if (!response.ok) {
    // حاول تجيب رسالة الخطأ من الـ Backend
    let errorMsg = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorMsg;
    } catch (e) {
      // لو الرد مش JSON
    }
    throw new Error(errorMsg);
  }
  // لو الرد 204 (No Content) أو مفيش محتوى
  if (response.status === 204) {
    return {};
  }
  return response.json();
}

// ----------------------------------------------
// 3. دوال المصادقة (Authentication)
// ----------------------------------------------
export async function registerUser(userData) {
  const res = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse(res);
}

export async function loginUser(credentials) {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return handleResponse(res);
}

export async function logoutUser() {
  const res = await fetch(`${API_BASE_URL}/logout`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// ----------------------------------------------
// 4. دوال طلبات الدم (Blood Requests CRUD)
// ----------------------------------------------

// جلب كل الطلبات (مع إمكانية تمرير فلتر مثل ?bloodType=O-&city=Cairo)
export async function getRequests(filters = {}) {
  const query = new URLSearchParams(filters).toString();
  const url = query ? `${API_BASE_URL}/requests?${query}` : `${API_BASE_URL}/requests`;
  const res = await fetch(url, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// جلب طلب واحد بالـ ID
export async function getRequestById(id) {
  const res = await fetch(`${API_BASE_URL}/requests/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// إنشاء طلب جديد (نشر استغاثة)
export async function createRequest(data) {
  const res = await fetch(`${API_BASE_URL}/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// تحديث طلب (مثلاً: تغيير عدد الأكياس الموفرة، أو توثيق الحالة)
export async function updateRequest(id, data) {
  const res = await fetch(`${API_BASE_URL}/requests/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// حذف طلب
export async function deleteRequest(id) {
  const res = await fetch(`${API_BASE_URL}/requests/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// ----------------------------------------------
// 5. دوال المتبرعين (Donors)
// ----------------------------------------------
export async function getDonors(filters = {}) {
  const query = new URLSearchParams(filters).toString();
  const url = query ? `${API_BASE_URL}/donors?${query}` : `${API_BASE_URL}/donors`;
  const res = await fetch(url, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// تحديث حالة المتبرع (متاح / غير متاح)
export async function updateDonorAvailability(donorId, isAvailable) {
  const res = await fetch(`${API_BASE_URL}/donors/${donorId}/availability`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ is_available: isAvailable }),
  });
  return handleResponse(res);
}

// ----------------------------------------------
// 6. دوال المطابقة والتعهدات (Matching & Pledges)
// ----------------------------------------------

// جلب المتبرعين المطابقين لطلب معين (بناءً على الفصيلة والموقع)
export async function getMatchingDonors(requestId) {
  const res = await fetch(`${API_BASE_URL}/requests/${requestId}/matches`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// تسجيل تعهد بالتبرع (Pledge)
export async function createPledge(requestId, data) {
  const res = await fetch(`${API_BASE_URL}/pledges`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ request_id: requestId, ...data }),
  });
  return handleResponse(res);
}

// تحديث حالة التعهد (مقبول، مكتمل، ملغي)
export async function updatePledgeStatus(pledgeId, status) {
  const res = await fetch(`${API_BASE_URL}/pledges/${pledgeId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
}

// ----------------------------------------------
// 7. دوال الإشعارات (Notifications)
// ----------------------------------------------
export async function getNotifications() {
  const res = await fetch(`${API_BASE_URL}/notifications`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function markNotificationAsRead(notificationId) {
  const res = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// ----------------------------------------------
// 8. دوال المشرف (Admin)
// ----------------------------------------------
export async function verifyRequestByAdmin(requestId) {
  const res = await fetch(`${API_BASE_URL}/admin/requests/${requestId}/verify`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
  });
  return handleResponse(res);
}

export async function getAdminStats() {
  const res = await fetch(`${API_BASE_URL}/admin/stats`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// ----------------------------------------------
// 9. دوال مساعدة (Helper)
// ----------------------------------------------

// دالة لجلب التوكن من localStorage (لازم تكون موجودة بعد تسجيل الدخول)
function getAuthHeaders() {
  const token = localStorage.getItem('shoryan_token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

// رفع ملف (اختياري - لو هتضيف صورة أو تحليل)
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers: getAuthHeaders(), // ملحوظة: ما تحطش Content-Type عشان FormData هي اللي تحدد الحدود
    body: formData,
  });
  return handleResponse(res);
}
