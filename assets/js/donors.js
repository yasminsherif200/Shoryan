const DONORS_PAGE_SIZE = 6;
 
let allDonors = [];        // full result set for the current filters
let visibleDonorCount = 0; // how many of allDonors are currently rendered
let currentFilters = { blood_type: '', city: '' };
 
document.addEventListener('DOMContentLoaded', function () {
    const grid = document.getElementById('donorsGrid');
    if (!grid) return; // not on the search donors page
 
    const form = document.getElementById('donorSearchForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            searchDonors({
                blood_type: form.blood_type.value,
                city: form.city.value.trim()
            });
        });
    }
 
    const clearLink = document.getElementById('clearFiltersLink');
    if (clearLink) {
        clearLink.addEventListener('click', function (e) {
            e.preventDefault();
            if (form) form.reset();
            searchDonors({ blood_type: '', city: '' });
        });
    }
 
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', renderNextDonorPage);
    }
 
    // Removing an individual filter chip re-runs the search without it
    const activeFilters = document.getElementById('activeFilters');
    if (activeFilters) {
        activeFilters.addEventListener('click', function (e) {
            const removeBtn = e.target.closest('[data-remove-filter]');
            if (!removeBtn) return;
 
            const key = removeBtn.getAttribute('data-remove-filter');
            const nextFilters = Object.assign({}, currentFilters);
            nextFilters[key] = '';
 
            if (form) form[key].value = '';
            searchDonors(nextFilters);
        });
    }
 
    // Contact Donor reveals the donor's phone number inline
    const grid2 = document.getElementById('donorsGrid');
    grid2.addEventListener('click', function (e) {
        const contactBtn = e.target.closest('.btn-contact-donor');
        if (!contactBtn) return;
        revealDonorPhone(contactBtn);
    });
 
    // Show every available donor by default when the page first loads
    searchDonors({ blood_type: '', city: '' });
});
 
// ========================================================
// Fetch donors from the API for the given filters
// ========================================================
function searchDonors(filters) {
    currentFilters = filters;
    renderFilterChips(filters);
    clearDonorsMessage();
 
    const params = new URLSearchParams();
    if (filters.blood_type) params.append('blood_type', filters.blood_type);
    if (filters.city) params.append('city', filters.city);
 
    const grid = document.getElementById('donorsGrid');
    grid.innerHTML = '<p class="donor-empty-state">Loading donors...</p>';
 
    fetch('/Shoryan/api/donors/search.php?' + params.toString())
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (!data.success) {
                allDonors = [];
                visibleDonorCount = 0;
                renderDonorCards([]);
                updateResultsCount(0);
                showDonorsMessage(data.message);
                toggleLoadMoreButton();
                return;
            }
 
            allDonors = data.data || [];
            visibleDonorCount = 0;
            updateResultsCount(allDonors.length);
            renderNextDonorPage();
        })
        .catch(function (err) {
            console.error(err);
            allDonors = [];
            visibleDonorCount = 0;
            renderDonorCards([]);
            updateResultsCount(0);
            showDonorsMessage('Failed to load donors. Please try again.');
            toggleLoadMoreButton();
        });
}
 
// ========================================================
// Rendering: cards, pagination, results count, chips
// ========================================================
function renderNextDonorPage() {
    const nextSlice = allDonors.slice(0, visibleDonorCount + DONORS_PAGE_SIZE);
    visibleDonorCount = nextSlice.length;
    renderDonorCards(nextSlice);
    toggleLoadMoreButton();
}
 
function toggleLoadMoreButton() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (!loadMoreBtn) return;
    loadMoreBtn.style.display = visibleDonorCount < allDonors.length ? 'flex' : 'none';
}
 
function renderDonorCards(donors) {
    const grid = document.getElementById('donorsGrid');
 
    if (donors.length === 0) {
        grid.innerHTML = '<p class="donor-empty-state">No donors match your filters right now.</p>';
        return;
    }
 
    grid.innerHTML = donors.map(buildDonorCardHtml).join('');
}
 
function buildDonorCardHtml(donor) {
    const initials = getInitials(donor.full_name);
    const lastDonation = formatLastDonation(donor.last_donation_date);
 
    return (
        '<div class="donor-card">' +
            '<div class="donor-card-header">' +
                '<div class="donor-avatar">' + escapeHtml(initials) + '</div>' +
                '<div class="donor-name-wrap">' +
                    '<p class="donor-name">' + escapeHtml(donor.full_name) + '</p>' +
                    '<p class="donor-location">' + escapeHtml(donor.city) + '</p>' +
                '</div>' +
                '<div class="donor-blood-badge">' + escapeHtml(donor.blood_type) + '</div>' +
            '</div>' +
            '<div class="donor-card-stats">' +
                '<div>' +
                    '<p class="donor-stat-label">Last Donation</p>' +
                    '<p class="donor-stat-value">' + escapeHtml(lastDonation) + '</p>' +
                '</div>' +
                '<div>' +
                    '<p class="donor-stat-label">Status</p>' +
                    '<p class="donor-status">Eligible</p>' +
                '</div>' +
            '</div>' +
            '<button type="button" class="btn-contact-donor" data-phone="' + escapeHtml(donor.phone) + '">' +
                '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8 9.9a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.8 2z"/></svg>' +
                'Contact Donor' +
            '</button>' +
        '</div>'
    );
}
 
function revealDonorPhone(button) {
    const phone = button.getAttribute('data-phone');
    button.outerHTML =
        '<a class="btn-contact-donor" href="tel:' + escapeHtml(phone) + '">' +
            '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8 9.9a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.8 2z"/></svg>' +
            escapeHtml(phone) +
        '</a>';
}
 
function updateResultsCount(total) {
    const countEl = document.getElementById('resultsCount');
    if (!countEl) return;
    countEl.textContent = 'Showing ' + total + ' result' + (total === 1 ? '' : 's');
}
 
function renderFilterChips(filters) {
    const container = document.getElementById('activeFilters');
    const clearLink = document.getElementById('clearFiltersLink');
    if (!container) return;
 
    const chips = [];
 
    if (filters.blood_type) {
        chips.push(buildChipHtml('blood_type', 'Type: ' + filters.blood_type));
    }
    if (filters.city) {
        chips.push(buildChipHtml('city', 'Location: ' + filters.city));
    }
 
    container.innerHTML = chips.join('');
    if (clearLink) {
        clearLink.style.display = chips.length > 0 ? 'inline' : 'none';
    }
}
 
function buildChipHtml(key, label) {
    return (
        '<span class="filter-chip">' +
            escapeHtml(label) +
            ' <button type="button" data-remove-filter="' + key + '" aria-label="Remove filter">&times;</button>' +
        '</span>'
    );
}
 
function showDonorsMessage(message) {
    const box = document.getElementById('donorsMessage');
    if (!box) return;
    box.textContent = message;
    box.classList.add('message-error');
}
 
function clearDonorsMessage() {
    const box = document.getElementById('donorsMessage');
    if (!box) return;
    box.textContent = '';
    box.classList.remove('message-error', 'message-success');
}
 
// ========================================================
// Small formatting helpers
// ========================================================
function getInitials(fullName) {
    if (!fullName) return '?';
    return fullName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(function (part) { return part.charAt(0).toUpperCase(); })
        .join('');
}
 
function formatLastDonation(dateStr) {
    if (!dateStr) return 'No previous donations';
 
    const donated = new Date(dateStr);
    const now = new Date();
    const months = (now.getFullYear() - donated.getFullYear()) * 12 + (now.getMonth() - donated.getMonth());
 
    if (months < 1) return 'This month';
    if (months === 1) return '1 month ago';
    if (months < 12) return months + ' months ago';
 
    const years = Math.floor(months / 12);
    return years === 1 ? '1 year ago' : years + ' years ago';
}
 
function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value == null ? '' : String(value);
    return div.innerHTML;
}