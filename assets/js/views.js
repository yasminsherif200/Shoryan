/* Template builder functions - one per original React component */

function urgencyBadge(t, urgency) {
  switch (urgency) {
    case 'CRITICAL': return { cls: 'bg-red-100 text-red-700 border-red-300 anim-pulse', label: t.criticalUrgent };
    case 'URGENT': return { cls: 'bg-amber-100 text-amber-800 border-amber-300', label: t.urgent };
    case 'MODERATE': return { cls: 'bg-blue-100 text-blue-800 border-blue-300', label: t.moderate };
    default: return { cls: 'bg-gray-100 text-gray-800 border-gray-300', label: t.scheduled };
  }
}

function requestsCountLabel(s, count) {
  return s.lang.code === 'ar' ? `عرض ${count} حالة تحتاج تبرع بالدم فوراً بمختلف المحافظات` : `Showing ${count} active blood appeals requiring donors`;
}

function emptyRequestsHTML(s) {
  const ar = s.lang.code === 'ar';
  return `
  <div class="bg-white p-12 text-center rounded-3xl border border-gray-200/80 space-y-3">
    ${icon('droplet', 'w-12 h-12 text-gray-300 mx-auto')}
    <p class="text-gray-700 font-bold">${ar ? 'لا توجد طلبات تطابق معايير البحث الحالية' : 'No requests matched your filter criteria.'}</p>
    <button onclick="App.resetRequestsFilters()" class="text-xs font-bold text-red-600 underline">${ar ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}</button>
  </div>`;
}

function requestCardHTML(s, req) {
  const t = App.t.call({ state: s });
  const lang = s.lang;
  const percent = Math.round((req.unitsFulfilled / req.unitsNeeded) * 100);
  const badge = urgencyBadge(t, req.urgency);
  return `
  <div onclick="App.openDetail('${req.id}')" class="bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group cursor-pointer flex flex-col justify-between">
    <div>
      <div class="p-4 sm:p-5 pb-3 flex items-start justify-between gap-3 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white font-black text-xl shadow-md shadow-red-500/20 shrink-0">
            <span>${req.bloodType}</span>
            <span class="text-[9px] uppercase tracking-tighter opacity-80 font-bold">Group</span>
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs font-mono font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">${esc(req.code)}</span>
              ${req.verifiedByHospital ? `<span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">${icon('check-circle', 'w-3 h-3 text-emerald-600')}<span>${lang.code === 'ar' ? 'موثق' : 'Verified'}</span></span>` : ''}
            </div>
            <h3 class="font-bold text-gray-900 text-lg group-hover:text-red-600 transition-colors mt-0.5 line-clamp-1">${esc(req.patientName)}</h3>
            <p class="text-xs text-gray-500">${lang.code === 'ar' ? `العمر: ${req.patientAge} سنة` : `Age: ${req.patientAge} yrs`}</p>
          </div>
        </div>
        <span class="text-xs font-black px-2.5 py-1 rounded-full border ${badge.cls}">${badge.label}</span>
      </div>
      <div class="p-4 sm:p-5 space-y-3">
        <div class="space-y-1.5 text-xs text-gray-600">
          <div class="flex items-center gap-2">${icon('building-2', 'w-4 h-4 text-gray-400 shrink-0')}<span class="font-semibold text-gray-800 line-clamp-1">${esc(req.hospitalName)}</span></div>
          <div class="flex items-center gap-2">${icon('map-pin', 'w-4 h-4 text-red-500 shrink-0')}<span>${esc(req.city)}</span></div>
        </div>
        ${req.medicalNote ? `<p class="text-xs bg-red-50/60 p-2.5 rounded-xl border border-red-100 text-gray-700 line-clamp-2 italic">"${esc(req.medicalNote)}"</p>` : ''}
        <div class="space-y-1.5 pt-1">
          <div class="flex justify-between text-xs font-bold">
            <span class="text-gray-600">${t.bagsFulfilled}:</span>
            <span class="text-red-600">${req.unitsFulfilled} / ${req.unitsNeeded} (${percent}%)</span>
          </div>
          <div class="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
            <div class="bg-gradient-to-r from-red-500 to-rose-600 h-2.5 rounded-full transition-all duration-500" style="width:${Math.min(100, percent)}%"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-2">
      <button onclick="event.stopPropagation(); App.shareWhatsApp('${req.id}')" class="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors border border-emerald-200 flex items-center gap-1.5 text-xs font-bold">
        ${icon('share-2', 'w-4 h-4')}<span class="hidden sm:inline">${lang.code === 'ar' ? 'واتساب' : 'Share'}</span>
      </button>
      <div class="flex items-center gap-2">
        <button onclick="event.stopPropagation(); App.openDetail('${req.id}')" class="px-3 py-2 rounded-xl text-xs font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100">${t.viewDetails}</button>
        <button onclick="event.stopPropagation(); App.openPledge('${req.id}')" class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 transition-all shadow-xs flex items-center gap-1.5">${icon('heart', 'w-3.5 h-3.5')}<span>${t.volunteerToDonate}</span></button>
      </div>
    </div>
  </div>`;
}

function donorCardHTML(s, donor) {
  const t = App.t.call({ state: s });
  const lang = s.lang;
  return `
  <div class="bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all p-5 space-y-4 flex flex-col justify-between">
    <div class="space-y-3">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="relative">
            <img src="${donor.avatarUrl}" alt="${esc(donor.name)}" class="w-12 h-12 rounded-2xl object-cover border border-gray-200">
            <span class="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${donor.isAvailable ? 'bg-emerald-500' : 'bg-gray-400'}"></span>
          </div>
          <div>
            <h3 class="font-bold text-gray-900 text-base">${esc(donor.name)}</h3>
            <p class="text-xs text-gray-500 flex items-center gap-1">${icon('map-pin', 'w-3 h-3 text-red-500')}<span>${esc(donor.city)}</span></p>
          </div>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-red-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-red-500/20 shrink-0">${donor.bloodType}</div>
      </div>
      <div class="grid grid-cols-2 gap-2 text-center bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-xs">
        <div><p class="text-gray-400 font-bold">${t.totalDonations}</p><p class="font-bold text-gray-900">${donor.totalDonations} ${lang.code === 'ar' ? 'مرات' : 'times'}</p></div>
        <div><p class="text-gray-400 font-bold">${t.livesImpacted}</p><p class="font-bold text-red-600">${donor.livesImpacted} ❤️</p></div>
      </div>
      <div class="flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200/60 w-fit">${icon('award', 'w-4 h-4 text-amber-600')}<span>${esc(donor.badge)}</span></div>
    </div>
    <div class="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
      <a href="tel:${donor.phone}" class="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors">${icon('phone', 'w-4 h-4')}<span>${lang.code === 'ar' ? 'اتصال مباشر بالطوارئ' : 'Call Donor'}</span></a>
    </div>
  </div>`;
}

function aiMessageHTML(m) {
  const isUser = m.sender === 'user';
  return `
  <div class="flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}">
    <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-red-600 text-white' : 'bg-purple-700 text-white'}">
      ${icon(isUser ? 'user' : 'bot', 'w-4 h-4')}
    </div>
    <div class="p-3.5 rounded-2xl text-xs leading-relaxed max-w-[80%] ${isUser ? 'bg-red-600 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 shadow-xs rounded-tl-none whitespace-pre-wrap'}">
      <p>${esc(m.text)}</p>
    </div>
  </div>`;
}

function renderToast(s) {
  if (!s.toast) return '';
  return `
  <div id="toast-banner" class="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-2xl border border-red-500/40 flex items-center gap-3 anim-slide-top max-w-lg w-[90%]">
    ${icon('heart', 'w-5 h-5 text-red-500 anim-bounce')}
    <p class="text-xs font-bold leading-snug">${s.toast}</p>
  </div>`;
}

function renderNavbar(s) {
  const t = App.t.call({ state: s });
  const lang = s.lang;
  const nav = [
    ['home', t.home], ['requests', `${t.requests} (${s.requests.length})`], ['find-donors', t.findDonors],
    ['my-profile', t.myProfile], ['my-requests', t.myRequests], ['ledger', t.donationLedger], ['admin', t.adminPortal]
  ];
  const linkCls = (v) => `px-3 py-2 rounded-xl text-sm font-semibold transition-all ${s.view === v ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-100'}`;
  const mobileCls = (v) => `px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${s.view === v ? 'bg-red-600 text-white' : 'text-gray-700 bg-white border border-gray-200'}`;
  return `
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-red-100 shadow-xs">
    <div class="bg-gradient-to-r from-red-700 via-rose-600 to-red-700 text-white text-xs py-1.5 px-4 font-medium flex justify-between items-center">
      <div class="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
        <div class="flex items-center gap-2">
          <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 anim-ping"></span>
          <span>${lang.code === 'ar' ? '⚡ يوجد طلبات عاجلة بحاجة متبرعين أصحاب فصيلة O- و B- حالياً بالقاهرة والإسكندرية' : '⚡ Urgent requests active for O- and B- blood donors in Cairo & Alexandria'}</span>
        </div>
        <div class="flex items-center gap-4 text-xs font-semibold">
          <a href="tel:137" class="flex items-center gap-1 hover:underline text-rose-100 bg-red-800/60 px-2 py-0.5 rounded">${icon('phone-call', 'w-3 h-3')}<span>${lang.code === 'ar' ? 'طوارئ بنك الدم: 137' : 'Blood Emergency: 137'}</span></a>
          <button onclick="App.toggleLang()" class="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded text-white transition-colors">${icon('globe', 'w-3 h-3')}<span>${t.switchLang}</span></button>
        </div>
      </div>
    </div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-3 cursor-pointer" onclick="App.setView('home')">
          <div class="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-md shadow-red-500/20">
            ${icon('droplet', 'w-6 h-6')}
            <div class="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full border-2 border-white anim-pulse"></div>
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="text-2xl font-black text-gray-900 tracking-tight font-serif">${t.appName}</span>
              <span class="text-xs px-1.5 py-0.5 bg-red-100 text-red-700 font-bold rounded-md">مصر 🇪🇬</span>
            </div>
            <p class="text-[10px] text-gray-500 font-medium line-clamp-1 hidden sm:block">${lang.code === 'ar' ? 'منصة التبرع بالدم الرقمية' : 'Blood Donation Platform'}</p>
          </div>
        </div>
        <nav class="hidden lg:flex items-center gap-1">
          ${nav.map(([v, label]) => `<button onclick="App.setView('${v}')" class="${linkCls(v)}">${label}</button>`).join('')}
        </nav>
        <div class="flex items-center gap-2">
          <button onclick="App.openAI()" class="p-2.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors border border-purple-200 flex items-center gap-1.5 text-xs font-bold">
            ${icon('bot', 'w-4 h-4 text-purple-600')}<span class="hidden md:inline">${lang.code === 'ar' ? 'المساعد الذكي' : 'AI Help'}</span>
          </button>
          <button onclick="App.openCreate()" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs sm:text-sm hover:from-red-700 hover:to-rose-700 transition-all shadow-md shadow-red-500/20 flex items-center gap-2">
            ${icon('file-plus', 'w-4 h-4')}<span>${t.createRequest}</span>
          </button>
        </div>
      </div>
    </div>
    <div class="lg:hidden flex border-t border-gray-100 bg-gray-50/80 overflow-x-auto px-2 py-1.5 gap-2 scrollbar-none">
      ${nav.map(([v, label]) => `<button onclick="App.setView('${v}')" class="${mobileCls(v)}">${label.replace(/\s\(\d+\)$/, s.view === v || v !== 'requests' ? '' : '')}</button>`).join('')}
    </div>
  </header>`;
}

function renderFooter(s) {
  const t = App.t.call({ state: s });
  const lang = s.lang;
  return `
  <footer class="bg-gray-900 text-gray-300 pt-16 pb-12 border-t-4 border-red-600">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
        <div class="space-y-4 md:col-span-1">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-10 h-10 rounded-2xl bg-red-600 text-white shadow-md">${icon('droplet', 'w-6 h-6')}</div>
            <span class="text-2xl font-black text-white font-serif tracking-wide">${t.appName}</span>
          </div>
          <p class="text-sm text-gray-400 leading-relaxed">${t.appSlogan}</p>
          <div class="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 p-2.5 rounded-xl">
            ${icon('shield-check', 'w-4 h-4 shrink-0 text-emerald-400')}
            <span>${lang.code === 'ar' ? 'منصة معتمدة بالتنسيق مع بنوك الدم الوطنية' : 'Verified in coordination with national blood banks'}</span>
          </div>
        </div>
        <div class="space-y-3">
          <h4 class="text-white font-bold text-sm tracking-wider uppercase border-b border-gray-800 pb-2">${lang.code === 'ar' ? 'خطوط طوارئ الدم' : 'Emergency Hotlines'}</h4>
          <ul class="space-y-2.5 text-sm">
            <li class="flex items-center gap-2">${icon('phone-call', 'w-4 h-4 text-red-500')}<span class="text-gray-300 font-semibold">${lang.code === 'ar' ? 'بنك الدم الرئيسي (مصر):' : 'Main Blood Bank:'}</span><a href="tel:137" class="text-red-400 font-bold hover:underline">137</a></li>
            <li class="flex items-center gap-2">${icon('phone-call', 'w-4 h-4 text-red-500')}<span class="text-gray-300 font-semibold">${lang.code === 'ar' ? 'الإسعاف المصري:' : 'Egyptian Ambulance:'}</span><a href="tel:123" class="text-red-400 font-bold hover:underline">123</a></li>
            <li class="flex items-center gap-2 text-xs text-gray-400 pt-2">${icon('building-2', 'w-4 h-4 text-gray-500 shrink-0')}<span>${lang.code === 'ar' ? 'تغطية المستشفيات: القاهرة، الجيزة، الإسكندرية، الدلتا، والصعيد' : 'Coverage: Cairo, Alex, Delta, Upper Egypt'}</span></li>
          </ul>
        </div>
        <div class="space-y-3">
          <h4 class="text-white font-bold text-sm tracking-wider uppercase border-b border-gray-800 pb-2">${lang.code === 'ar' ? 'روابط سريعة' : 'Quick Links'}</h4>
          <ul class="space-y-2 text-sm">
            <li><button onclick="App.setView('requests')" class="hover:text-red-400 transition-colors">${t.requests}</button></li>
            <li><button onclick="App.setView('find-donors')" class="hover:text-red-400 transition-colors">${t.findDonors}</button></li>
            <li><button onclick="App.setView('my-profile')" class="hover:text-red-400 transition-colors">${t.myProfile}</button></li>
            <li><button onclick="App.setView('ledger')" class="hover:text-red-400 transition-colors">${t.donationLedger}</button></li>
            <li><button onclick="App.setView('admin')" class="hover:text-red-400 transition-colors">${t.adminPortal}</button></li>
          </ul>
        </div>
        <div class="space-y-3">
          <h4 class="text-white font-bold text-sm tracking-wider uppercase border-b border-gray-800 pb-2">${lang.code === 'ar' ? 'المستشفيات الشريكة' : 'Partner Hospitals'}</h4>
          <p class="text-xs text-gray-400">${lang.code === 'ar' ? 'مستشفى القصر العيني، 57357 للأطفال، عين شمس الجامعي، مستشفى الأميري بالإسكندرية، طوارئ المنصورة، أسيوط الجامعي.' : 'Al Kasr Al Ainy, 57357 Hospital, Ain Shams University, Alex Main Hospital, Mansoura Emergency, Asyut University.'}</p>
          <div class="pt-2"><span class="text-xs font-semibold text-red-400 flex items-center gap-1">${icon('heart', 'w-3.5 h-3.5')}<span>${lang.code === 'ar' ? 'منصة مجانية 100% بدون أي رسوم' : '100% Free Humanitarian Platform'}</span></span></div>
        </div>
      </div>
      <div class="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <p>© ${new Date().getFullYear()} Shoryan Platform (شريان) - All rights reserved.</p>
        <div class="flex items-center gap-6">
          <span>${lang.code === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}</span>
          <span>${lang.code === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</span>
          <span>${lang.code === 'ar' ? 'دليل بنوك الدم' : 'Blood Bank Directory'}</span>
        </div>
      </div>
    </div>
  </footer>`;
}

function renderCompatibilityMatrix(s) {
  const t = App.t.call({ state: s });
  const lang = s.lang;
  const info = BLOOD_COMPATIBILITY[s.compatType];
  return `
  <div class="bg-gradient-to-br from-red-900 via-slate-900 to-gray-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-red-800/40 relative overflow-hidden my-8">
    <div class="relative z-10">
      <div class="text-center max-w-2xl mx-auto mb-8">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold mb-3 border border-red-500/30">${icon('sparkles', 'w-3.5 h-3.5 text-red-400')}<span>${t.compatibilityTitle}</span></div>
        <h2 class="text-2xl sm:text-3xl font-black font-serif text-white mb-2">${lang.code === 'ar' ? 'فصيلة دمك تحدد أبطالك المحتملين' : 'Who Can You Help or Receive Blood From?'}</h2>
        <p class="text-sm text-gray-300">${t.compatibilitySubtitle}</p>
      </div>
      <div class="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
        ${['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(type => {
          const isSelected = s.compatType === type;
          const isDonor = type === 'O-'; const isRecip = type === 'AB+';
          return `<button onclick="App.selectCompatType('${type}')" class="relative px-4 py-3 rounded-2xl font-black text-base sm:text-lg transition-all ${isSelected ? 'bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-600/40 scale-105 ring-2 ring-white' : 'bg-white/10 text-gray-200 hover:bg-white/20 border border-white/10'}">
            <span>${type}</span>
            ${isDonor ? `<span class="absolute -top-2 -right-2 bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">${lang.code === 'ar' ? 'عام' : 'Univ'}</span>` : ''}
            ${isRecip ? `<span class="absolute -top-2 -right-2 bg-blue-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">${lang.code === 'ar' ? 'مستقبل' : 'Recip'}</span>` : ''}
          </button>`;
        }).join('')}
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
        <div class="space-y-3">
          <div class="flex items-center gap-2 text-red-400 font-bold text-sm border-b border-white/10 pb-2">${icon('heart-pulse', 'w-5 h-5 text-red-500 anim-pulse')}<span>${t.canDonateTo} (${s.compatType}):</span></div>
          <div class="flex flex-wrap gap-2 pt-1">${info.canGiveTo.map(target => `<div class="px-3.5 py-2 rounded-xl bg-red-600/30 border border-red-500/50 text-white font-black text-sm flex items-center gap-1.5 shadow-sm">${icon('check-circle-2', 'w-4 h-4 text-emerald-400')}<span>${target}</span></div>`).join('')}</div>
          <p class="text-xs text-gray-400 pt-2 italic">
            ${s.compatType === 'O-' ? (lang.code === 'ar' ? 'فصيلة O- هي المتبرع العام الممتاز لكافة الفصائل الأخرى.' : 'O- is the universal donor compatible with all other blood types.') : ''}
            ${s.compatType === 'AB+' ? (lang.code === 'ar' ? 'فصيلة AB+ يمكنها التبرع لفصيلة AB+ فقط.' : 'AB+ can donate to AB+ individuals.') : ''}
          </p>
        </div>
        <div class="space-y-3">
          <div class="flex items-center gap-2 text-emerald-400 font-bold text-sm border-b border-white/10 pb-2">${icon('arrow-right-left', 'w-5 h-5 text-emerald-400')}<span>${t.canReceiveFrom} (${s.compatType}):</span></div>
          <div class="flex flex-wrap gap-2 pt-1">${info.canReceiveFrom.map(source => `<div class="px-3.5 py-2 rounded-xl bg-emerald-600/30 border border-emerald-500/50 text-white font-black text-sm flex items-center gap-1.5 shadow-sm">${icon('check-circle-2', 'w-4 h-4 text-emerald-300')}<span>${source}</span></div>`).join('')}</div>
          <p class="text-xs text-gray-400 pt-2 italic">
            ${s.compatType === 'AB+' ? (lang.code === 'ar' ? 'فصيلة AB+ هي المستقبل العام وتستقبل الدم من كل الفصائل.' : 'AB+ is the universal recipient that can accept blood from any type.') : ''}
            ${s.compatType === 'O-' ? (lang.code === 'ar' ? 'فصيلة O- تستقبل من فصيلة O- فقط، لذلك فإن المتبرعين بها عملة نادرة وحرجة.' : 'O- can only receive O- blood, making O- donors extremely critical.') : ''}
          </p>
        </div>
      </div>
    </div>
  </div>`;
}

function renderView(s) {
  switch (s.view) {
    case 'home': return renderHome(s);
    case 'requests': return renderBrowseRequests(s);
    case 'find-donors': return renderFindDonors(s);
    case 'my-profile': return renderDonorDashboard(s);
    case 'my-requests': return renderMyRequests(s);
    case 'ledger': return renderLedger(s);
    case 'admin': return renderAdmin(s);
    default: return renderHome(s);
  }
}

function renderHome(s) {
  const t = App.t.call({ state: s });
  const lang = s.lang;
  const urgent = s.requests.filter(r => r.urgency === 'CRITICAL' || r.urgency === 'URGENT').slice(0, 3);
  return `
  <div class="space-y-12 pb-16">
    <section class="relative overflow-hidden bg-gradient-to-br from-red-950 via-slate-900 to-red-900 text-white rounded-3xl p-8 sm:p-14 shadow-2xl border border-red-800/40 mt-4">
      <div class="relative z-10 max-w-3xl space-y-6">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-200 text-xs font-bold shadow-xs">
          <span class="w-2 h-2 rounded-full bg-emerald-400 anim-ping"></span>
          <span>${lang.code === 'ar' ? 'شبكة بنوك الدم والاستغاثات الأولى بمصر' : "Egypt's Leading Emergency Blood Network"}</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-black font-serif leading-tight tracking-tight text-white">${t.heroTitle}</h1>
        <p class="text-base sm:text-lg text-red-100/90 leading-relaxed max-w-2xl font-light">${t.heroSubtitle}</p>
        <div class="flex flex-wrap items-center gap-4 pt-2">
          <button onclick="App.setView('requests')" class="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm shadow-xl shadow-red-600/30 flex items-center gap-2.5 transition-all">${icon('search', 'w-4 h-4')}<span>${t.findBloodNow}</span></button>
          <button onclick="App.openCreate()" class="px-6 py-3.5 rounded-2xl bg-white text-red-900 hover:bg-red-50 font-black text-sm shadow-lg flex items-center gap-2.5 transition-all">${icon('file-plus', 'w-4 h-4 text-red-600')}<span>${t.createRequest}</span></button>
        </div>
        <div class="flex items-center gap-4 text-xs text-red-200/80 pt-4 border-t border-white/10">
          <div class="flex items-center gap-1.5">${icon('shield-check', 'w-4 h-4 text-emerald-400')}<span>${lang.code === 'ar' ? 'ربط موثق مع المستشفيات' : 'Verified Hospital Network'}</span></div>
          <span>•</span>
          <div class="flex items-center gap-1.5">${icon('activity', 'w-4 h-4 text-red-400')}<span>${lang.code === 'ar' ? 'إنذارات جغرافية فورية' : 'Real-time Geo Alerts'}</span></div>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">${icon('heart', 'w-6 h-6')}</div>
        <div><p class="text-2xl font-black text-gray-900 font-mono">${s.stats.livesSaved.toLocaleString()}</p><p class="text-xs text-gray-500 font-semibold">${t.livesSaved}</p></div>
      </div>
      <div class="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">${icon('activity', 'w-6 h-6')}</div>
        <div><p class="text-2xl font-black text-gray-900 font-mono">${s.stats.activeRequests}</p><p class="text-xs text-gray-500 font-semibold">${t.activeRequests}</p></div>
      </div>
      <div class="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">${icon('users', 'w-6 h-6')}</div>
        <div><p class="text-2xl font-black text-gray-900 font-mono">${s.stats.totalUsers.toLocaleString()}</p><p class="text-xs text-gray-500 font-semibold">${t.verifiedDonors}</p></div>
      </div>
      <div class="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">${icon('building-2', 'w-6 h-6')}</div>
        <div><p class="text-2xl font-black text-gray-900 font-mono">${s.stats.verifiedHospitals}</p><p class="text-xs text-gray-500 font-semibold">${t.partnerHospitals}</p></div>
      </div>
    </section>

    <section class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-red-600 anim-ping"></span><h2 class="text-2xl font-black text-gray-900 font-serif">${t.communityPulse}</h2></div>
          <p class="text-xs text-gray-500 mt-1">${lang.code === 'ar' ? 'حالات حرجة تتطلب متبرعين فوراً بالمستشفيات' : 'Critical appeals requiring immediate blood donors'}</p>
        </div>
        <button onclick="App.setView('requests')" class="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"><span>${lang.code === 'ar' ? 'جميع الحالات' : 'View All Appeals'}</span>${icon('arrow-right', 'w-4 h-4 rtl-rotate-180')}</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">${urgent.map(r => requestCardHTML(s, r)).join('')}</div>
    </section>

    ${renderCompatibilityMatrix(s)}

    <section class="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200/80 shadow-xs text-center space-y-10">
      <div class="max-w-2xl mx-auto space-y-2">
        <span class="px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider">${lang.code === 'ar' ? 'دليل الإنقاذ السريع' : 'Simple & Effective'}</span>
        <h2 class="text-2xl sm:text-3xl font-black text-gray-900 font-serif">${t.processTitle}</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-right rtl:text-right ltr:text-left">
        <div class="p-6 bg-red-50/50 rounded-2xl border border-red-100 space-y-3"><div class="w-12 h-12 rounded-2xl bg-red-600 text-white font-black text-xl flex items-center justify-center">1</div><h3 class="font-bold text-gray-900 text-lg">${t.step1Title}</h3><p class="text-xs text-gray-600 leading-relaxed">${t.step1Desc}</p></div>
        <div class="p-6 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-3"><div class="w-12 h-12 rounded-2xl bg-rose-600 text-white font-black text-xl flex items-center justify-center">2</div><h3 class="font-bold text-gray-900 text-lg">${t.step2Title}</h3><p class="text-xs text-gray-600 leading-relaxed">${t.step2Desc}</p></div>
        <div class="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-3"><div class="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center">3</div><h3 class="font-bold text-gray-900 text-lg">${t.step3Title}</h3><p class="text-xs text-gray-600 leading-relaxed">${t.step3Desc}</p></div>
      </div>
    </section>
  </div>`;
}

function renderBrowseRequests(s) {
  const t = App.t.call({ state: s });
  const lang = s.lang;
  return `
  <div class="space-y-8 pb-16">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs">
      <div>
        <h1 class="text-2xl font-black text-gray-900 font-serif">${t.requests}</h1>
        <p id="requests-count-label" class="text-xs text-gray-500 mt-1">${requestsCountLabel(s, s.requests.length)}</p>
      </div>
      <button onclick="App.openCreate()" class="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs shadow-md shadow-red-500/20 flex items-center justify-center gap-2">${icon('file-plus', 'w-4 h-4')}<span>${t.createRequest}</span></button>
    </div>

    <div class="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
      <div class="relative">
        ${icon('search', 'w-5 h-5 text-gray-400 absolute top-3.5 left-3.5 rtl:right-3.5 rtl:left-auto')}
        <input id="req-search" type="text" oninput="App.updateRequestsGrid()" placeholder="${t.searchPlaceholder}" class="w-full pl-11 rtl:pr-11 rtl:pl-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-gray-50/50">
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label class="block text-xs font-bold text-gray-500 mb-1">${t.filterByBlood}</label>
          <select id="req-bt" onchange="App.updateRequestsGrid()" class="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 bg-white outline-none focus:ring-2 focus:ring-red-500">
            <option value="ALL">${t.filterByBlood}</option>
            ${BLOOD_TYPES.map(bt => `<option value="${bt}">${bt}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-500 mb-1">${t.filterByCity}</label>
          <select id="req-city" onchange="App.updateRequestsGrid()" class="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 bg-white outline-none focus:ring-2 focus:ring-red-500">
            <option value="ALL">${t.filterByCity}</option>
            ${EGYPTIAN_CITIES.map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-500 mb-1">${lang.code === 'ar' ? 'درجة الطوارئ' : 'Urgency'}</label>
          <select id="req-urg" onchange="App.updateRequestsGrid()" class="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 bg-white outline-none focus:ring-2 focus:ring-red-500">
            <option value="ALL">${lang.code === 'ar' ? 'كل المستويات' : 'All Urgencies'}</option>
            <option value="CRITICAL">${t.criticalUrgent}</option>
            <option value="URGENT">${t.urgent}</option>
            <option value="MODERATE">${t.moderate}</option>
            <option value="SCHEDULED">${t.scheduled}</option>
          </select>
        </div>
      </div>
    </div>

    <div id="requests-grid-container">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${s.requests.map(r => requestCardHTML(s, r)).join('')}</div>
    </div>
  </div>`;
}

function renderFindDonors(s) {
  const t = App.t.call({ state: s });
  const lang = s.lang;
  return `
  <div class="space-y-8 pb-16">
    <div class="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-gray-900 font-serif">${t.findDonors}</h1>
        <p class="text-xs text-gray-500 mt-1">${lang.code === 'ar' ? 'قائمة الأبطال المتبرعين بالدم الموثقين القريبين للاتصال المباشر والطوارئ' : 'Directory of verified blood donors ready to help'}</p>
      </div>
      <div class="flex items-center gap-2 bg-red-50 text-red-700 px-3.5 py-2 rounded-2xl border border-red-100 text-xs font-bold">${icon('user-check', 'w-4 h-4 text-red-600')}<span>${s.donors.filter(d => d.isAvailable).length} ${lang.code === 'ar' ? 'متبرع جاهز اليوم' : 'Donors Available Today'}</span></div>
    </div>

    <div class="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
      <div class="relative">
        ${icon('search', 'w-5 h-5 text-gray-400 absolute top-3.5 left-3.5 rtl:right-3.5 rtl:left-auto')}
        <input id="donor-search" type="text" oninput="App.updateDonorsGrid()" placeholder="${lang.code === 'ar' ? 'ابحث باسم المتبرع أو المدينة...' : 'Search donor name or city...'}" class="w-full pl-11 rtl:pr-11 rtl:pl-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-gray-50/50">
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-gray-500 mb-1">${t.filterByBlood}</label>
          <select id="donor-bt" onchange="App.updateDonorsGrid()" class="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 bg-white outline-none focus:ring-2 focus:ring-red-500">
            <option value="ALL">${t.filterByBlood}</option>
            ${BLOOD_TYPES.map(bt => `<option value="${bt}">${bt}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-500 mb-1">${t.filterByCity}</label>
          <select id="donor-city" onchange="App.updateDonorsGrid()" class="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 bg-white outline-none focus:ring-2 focus:ring-red-500">
            <option value="ALL">${t.filterByCity}</option>
            ${EGYPTIAN_CITIES.map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>
        </div>
      </div>
    </div>

    <div id="donors-grid-container">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${s.donors.map(d => donorCardHTML(s, d)).join('')}</div>
    </div>
  </div>`;
}

function renderDonorDashboard(s) {
  const t = App.t.call({ state: s });
  const lang = s.lang;
  const donor = s.donors[0];
  const isAvailable = s.donorAvailable;
  return `
  <div class="space-y-8 pb-16">
    <div class="bg-gradient-to-r from-red-900 via-slate-900 to-red-950 text-white p-6 sm:p-10 rounded-3xl shadow-xl border border-red-800/40 relative overflow-hidden">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
        <div class="flex items-center gap-5 text-center sm:text-right">
          <div class="relative">
            <img src="${donor.avatarUrl}" alt="${esc(donor.name)}" class="w-20 h-20 rounded-3xl object-cover border-2 border-red-500 shadow-xl">
            <span class="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-slate-900">${icon('shield-check', 'w-4 h-4')}</span>
          </div>
          <div class="space-y-1">
            <div class="flex items-center justify-center sm:justify-start gap-2">
              <h1 class="text-2xl font-black text-white font-serif">${esc(donor.name)}</h1>
              <span class="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full border border-amber-500/30 font-bold">${esc(donor.badge)}</span>
            </div>
            <p class="text-xs text-red-200 flex items-center justify-center sm:justify-start gap-1">${icon('map-pin', 'w-3.5 h-3.5')}<span>${esc(donor.city)}, Egypt</span></p>
          </div>
        </div>
        <div class="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-2 text-center">
          <p class="text-xs font-bold text-gray-300">${lang.code === 'ar' ? 'حالة التفرغ للتبرع الإغاثي:' : 'Emergency Readiness:'}</p>
          <button onclick="App.toggleDonorAvailable()" class="px-5 py-2 rounded-xl text-xs font-black transition-all ${isAvailable ? 'bg-emerald-500 text-white shadow-lg' : 'bg-gray-600 text-gray-200'}">
            ${isAvailable ? (lang.code === 'ar' ? 'جاهز للتبرع بالدم الآن 🩸' : 'Available for Emergency') : (lang.code === 'ar' ? 'غير متاح حالياً' : 'Currently Unavailable')}
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-1 bg-gradient-to-br from-red-600 via-rose-700 to-red-800 text-white p-6 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
        <div class="flex justify-between items-center border-b border-white/20 pb-4">
          <div class="flex items-center gap-2">${icon('droplet', 'w-5 h-5')}<span class="font-serif font-black text-lg">${t.digitalDonorCard}</span></div>
          <span class="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded font-bold">SHORYAN-ID</span>
        </div>
        <div class="text-center py-2 space-y-3">
          <div class="w-20 h-20 mx-auto rounded-2xl bg-white text-red-700 font-black text-3xl flex items-center justify-center shadow-lg">${donor.bloodType}</div>
          <div><p class="text-lg font-black">${esc(donor.name)}</p><p class="text-xs text-red-200">${esc(donor.phone)}</p></div>
        </div>
        <div class="bg-white p-4 rounded-2xl text-center space-y-2">
          <div class="w-32 h-32 mx-auto bg-slate-900 rounded-xl p-2 flex items-center justify-center text-white">${icon('qr-code', 'w-28 h-28 text-white')}</div>
          <p class="text-[10px] font-bold text-gray-500 uppercase">${lang.code === 'ar' ? 'امسح الكود في بنك الدم بالمستشفى للتسجيل الفوري' : 'Hospital Blood Bank Digital Verification QR'}</p>
        </div>
      </div>

      <div class="md:col-span-2 space-y-6">
        <div class="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl flex items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">${icon('check-circle-2', 'w-6 h-6')}</div>
            <div><h3 class="font-bold text-emerald-950 text-base">${t.eligibleToDonate}</h3><p class="text-xs text-emerald-800">${lang.code === 'ar' ? 'مضى أكثر من 90 يوماً على آخر تبرع. صحتكمم ممتازة للمساعدة.' : 'Over 90 days since your last donation. You can save lives today!'}</p></div>
          </div>
          <span class="hidden sm:inline-block px-3 py-1 bg-emerald-200 text-emerald-900 text-xs font-bold rounded-full">${lang.code === 'ar' ? 'جاهز' : 'Ready'}</span>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div class="bg-white p-5 rounded-2xl border border-gray-200/80 text-center space-y-1 shadow-xs"><p class="text-2xl font-black text-gray-900 font-mono">${donor.totalDonations}</p><p class="text-xs text-gray-500 font-bold">${t.totalDonations}</p></div>
          <div class="bg-white p-5 rounded-2xl border border-gray-200/80 text-center space-y-1 shadow-xs"><p class="text-2xl font-black text-red-600 font-mono">${donor.livesImpacted}</p><p class="text-xs text-gray-500 font-bold">${t.livesImpacted}</p></div>
          <div class="bg-white p-5 rounded-2xl border border-gray-200/80 text-center space-y-1 shadow-xs"><p class="text-xs font-bold text-gray-900 mt-2">${donor.lastDonationDate}</p><p class="text-xs text-gray-500 font-bold">${lang.code === 'ar' ? 'آخر تبرع' : 'Last Donation'}</p></div>
        </div>

        <div class="bg-white rounded-3xl border border-gray-200/80 p-6 space-y-4 shadow-xs">
          <h3 class="font-bold text-gray-900 text-base flex items-center gap-2">${icon('clock', 'w-4 h-4 text-red-600')}<span>${lang.code === 'ar' ? 'سجل التبرعات الأخير:' : 'Recent Donation Activity:'}</span></h3>
          <div class="space-y-3">
            ${s.myHistory.map(rec => `
            <div class="p-4 bg-gray-50 rounded-2xl border border-gray-200/60 flex items-center justify-between text-xs">
              <div><div class="flex items-center gap-2"><span class="font-bold text-gray-900 text-sm">${esc(rec.hospitalName)}</span><span class="bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded text-[10px]">${esc(rec.requestCode)}</span></div><p class="text-gray-500 mt-0.5">${esc(rec.notes)} • ${rec.donationDate}</p></div>
              <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">${rec.status}</span>
            </div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function renderMyRequests(s) {
  const t = App.t.call({ state: s });
  const lang = s.lang;
  return `
  <div class="space-y-8 pb-16">
    <div class="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-gray-900 font-serif">${t.myRequests}</h1>
        <p class="text-xs text-gray-500 mt-1">${lang.code === 'ar' ? 'إدارة استغاثات الدم الخاصة بك وتحديث أعداد أكياس الدم وتأكيد المتبرعين' : 'Manage blood requests posted by you'}</p>
      </div>
      <button onclick="App.openCreate()" class="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs shadow-md shadow-red-500/20 flex items-center justify-center gap-2">${icon('file-plus', 'w-4 h-4')}<span>${t.createRequest}</span></button>
    </div>
    <div class="space-y-4">
      ${s.requests.map(req => {
        const percent = Math.round((req.unitsFulfilled / req.unitsNeeded) * 100);
        const isComplete = req.unitsFulfilled >= req.unitsNeeded;
        return `
        <div class="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4 hover:border-red-200 transition-all">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-14 h-14 rounded-2xl bg-red-600 text-white font-black text-xl flex items-center justify-center shadow-md">${req.bloodType}</div>
              <div>
                <div class="flex items-center gap-2"><span class="text-xs font-mono font-bold text-gray-400">${esc(req.code)}</span><span class="px-2 py-0.5 rounded text-[10px] font-bold ${isComplete ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'}">${isComplete ? (lang.code === 'ar' ? 'مكتمل ✅' : 'Fulfilled') : req.urgency}</span></div>
                <h3 class="font-bold text-gray-900 text-lg">${esc(req.patientName)}</h3>
                <p class="text-xs text-gray-500 flex items-center gap-1">${icon('map-pin', 'w-3.5 h-3.5 text-red-500')}<span>${esc(req.hospitalName)} (${esc(req.city)})</span></p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="text-right rtl:text-right ltr:text-left"><p class="text-xs font-bold text-gray-500">${t.bagsFulfilled}</p><p class="text-sm font-black text-red-600">${req.unitsFulfilled} / ${req.unitsNeeded} ${lang.code === 'ar' ? 'أكياس' : 'units'}</p></div>
              ${!isComplete ? `<button onclick="App.markFulfilled('${req.id}')" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors">${lang.code === 'ar' ? 'تم الاستيفاء' : 'Mark Fulfilled'}</button>` : ''}
              <button onclick="App.openDetail('${req.id}')" class="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition-colors">${t.viewDetails}</button>
            </div>
          </div>
          <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div class="bg-red-600 h-2 rounded-full transition-all duration-500" style="width:${Math.min(100, percent)}%"></div></div>
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

function renderLedger(s) {
  const t = App.t.call({ state: s });
  const lang = s.lang;
  const cert = s.selectedCertificateId ? s.myHistory.find(r => r.id === s.selectedCertificateId) : null;
  return `
  <div class="space-y-8 pb-16">
    <div class="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-gray-900 font-serif">${t.donationLedger}</h1>
        <p class="text-xs text-gray-500 mt-1">${lang.code === 'ar' ? 'سجل التبرعات الموثقة بشهادات الشكر والتأكيد من بنك الدم' : 'Verified records of your blood donations'}</p>
      </div>
      <div class="flex items-center gap-2 bg-amber-50 text-amber-900 px-3.5 py-2 rounded-2xl border border-amber-200 text-xs font-bold">${icon('award', 'w-4 h-4 text-amber-600')}<span>3 ${lang.code === 'ar' ? 'شهادات تقدير متاحة' : 'Certificates Earned'}</span></div>
    </div>

    <div class="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-right rtl:text-right ltr:text-left text-xs">
          <thead class="bg-gray-50 text-gray-500 uppercase font-bold border-b border-gray-200">
            <tr>
              <th class="p-4">${lang.code === 'ar' ? 'رقم الطلب' : 'Request ID'}</th>
              <th class="p-4">${lang.code === 'ar' ? 'اسم المريض' : 'Patient'}</th>
              <th class="p-4">${t.hospitalName}</th>
              <th class="p-4">${lang.code === 'ar' ? 'الفصيلة' : 'Blood Type'}</th>
              <th class="p-4">${lang.code === 'ar' ? 'تاريخ التبرع' : 'Date'}</th>
              <th class="p-4">${lang.code === 'ar' ? 'شهادة تقدير' : 'Certificate'}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 font-medium text-gray-800">
            ${s.myHistory.map(rec => `
            <tr class="hover:bg-gray-50/80 transition-colors">
              <td class="p-4 font-mono font-bold text-red-600">${esc(rec.requestCode)}</td>
              <td class="p-4 font-bold text-gray-900">${esc(rec.patientName)}</td>
              <td class="p-4">${esc(rec.hospitalName)}</td>
              <td class="p-4"><span class="px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold">${rec.bloodType}</span></td>
              <td class="p-4 text-gray-500">${rec.donationDate}</td>
              <td class="p-4"><button onclick="App.openCertificate('${rec.id}')" class="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 font-bold hover:bg-amber-100 transition-colors flex items-center gap-1.5">${icon('award', 'w-3.5 h-3.5 text-amber-600')}<span>${t.downloadCertificate}</span></button></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>

    ${cert ? `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div class="bg-gradient-to-br from-amber-50 via-white to-amber-100 text-gray-900 rounded-3xl max-w-xl w-full p-8 border-4 border-amber-400 shadow-2xl relative space-y-6 my-8 anim-fade-zoom">
        <button onclick="App.closeCertificate()" class="absolute top-4 left-4 p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300">${icon('x', 'w-4 h-4')}</button>
        <div class="text-center space-y-2 border-b border-amber-300 pb-4">
          <div class="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-lg">${icon('award', 'w-8 h-8')}</div>
          <h2 class="text-2xl font-black font-serif text-amber-950">${lang.code === 'ar' ? 'شهادة شكر وتقدير إنسانية' : 'Certificate of Appreciation'}</h2>
          <p class="text-xs font-bold text-amber-800">${lang.code === 'ar' ? 'صادرة من منصة شريان وبنك الدم القومي' : 'Shoryan National Blood Donation Network'}</p>
        </div>
        <div class="text-center space-y-4 py-2">
          <p class="text-sm text-gray-700">${lang.code === 'ar' ? 'تشهد منصة شريان بأن البطل المتبرع:' : 'This certificate certifies that the hero donor:'}</p>
          <p class="text-2xl font-black text-red-700 font-serif">${lang.code === 'ar' ? 'أحمد سلامة' : 'Ahmed Salama'}</p>
          <p class="text-xs text-gray-600 leading-relaxed max-w-md mx-auto">
            ${lang.code === 'ar' ? `قد قام بالتبرع بالدم لصالح حالة المريض (${esc(cert.patientName)}) بـ ${esc(cert.hospitalName)} بتاريخ ${cert.donationDate}، مساهماً في إنقاذ حياة إنسانية بكل إيثار.` : `Donated blood for patient (${esc(cert.patientName)}) at ${esc(cert.hospitalName)} on ${cert.donationDate}, saving a human life.`}
          </p>
        </div>
        <div class="pt-4 border-t border-amber-300 flex justify-between items-center text-xs font-bold text-gray-600">
          <div class="text-center"><p class="text-gray-400">ختم توثيق بنك الدم</p><p class="text-amber-800 font-mono mt-1">VERIFIED-STAMP</p></div>
          <div class="text-center"><p class="text-gray-400">إدارة منصة شريان</p><p class="text-red-700 font-serif mt-1">Shoryan Egypt</p></div>
        </div>
        <div class="flex justify-center pt-2"><button onclick="window.print()" class="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md flex items-center gap-2">${icon('printer', 'w-4 h-4')}<span>${lang.code === 'ar' ? 'طباعة / حفظ الشهادة PDF' : 'Print / Download PDF'}</span></button></div>
      </div>
    </div>` : ''}
  </div>`;
}

function renderAdmin(s) {
  const t = App.t.call({ state: s });
  const lang = s.lang;
  const tabBtn = (tab, label) => `<button onclick="App.setAdminTab('${tab}')" class="px-4 py-2 rounded-xl text-xs font-bold transition-all ${s.adminTab === tab ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300'}">${label}</button>`;
  return `
  <div class="space-y-8 pb-16">
    <div class="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold mb-2">${icon('shield-alert', 'w-3.5 h-3.5 text-red-400')}<span>${lang.code === 'ar' ? 'منظومة الإشراف والتوثيق المباشر' : 'Hospital & Admin Portal'}</span></div>
        <h1 class="text-2xl font-black font-serif text-white">${t.adminPortal}</h1>
        <p class="text-xs text-gray-400 mt-1">${lang.code === 'ar' ? 'توثيق البلاغات ومراجعة بنوك الدم بالمستشفيات لمنع الشائعات' : 'Moderate appeals and verify hospital blood bank requests'}</p>
      </div>
      <div class="flex items-center gap-2">${tabBtn('requests', `${t.myRequests} (${s.requests.length})`)}${tabBtn('donors', `${t.findDonors} (${s.donors.length})`)}</div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs"><p class="text-xs text-gray-500 font-bold">${lang.code === 'ar' ? 'إجمالي المستخدمين' : 'Total Registered'}</p><p class="text-2xl font-black text-gray-900 font-mono mt-1">${s.stats.totalUsers.toLocaleString()}</p></div>
      <div class="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs"><p class="text-xs text-gray-500 font-bold">${t.activeRequests}</p><p class="text-2xl font-black text-red-600 font-mono mt-1">${s.requests.length}</p></div>
      <div class="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs"><p class="text-xs text-gray-500 font-bold">${lang.code === 'ar' ? 'التبرعات المكتملة' : 'Completed Donations'}</p><p class="text-2xl font-black text-emerald-600 font-mono mt-1">${s.stats.completedDonations.toLocaleString()}</p></div>
      <div class="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs"><p class="text-xs text-gray-500 font-bold">${t.partnerHospitals}</p><p class="text-2xl font-black text-purple-600 font-mono mt-1">${s.stats.verifiedHospitals}</p></div>
    </div>

    ${s.adminTab === 'requests' ? `
    <div class="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
      <div class="p-4 border-b border-gray-100 bg-gray-50 font-bold text-xs text-gray-700">${lang.code === 'ar' ? 'جدول الطلبات والاستغاثات الحالية' : 'Active Blood Appeals Table'}</div>
      <div class="overflow-x-auto"><table class="w-full text-right rtl:text-right ltr:text-left text-xs">
        <thead class="bg-gray-100 text-gray-500 font-bold uppercase"><tr><th class="p-3.5">الكود</th><th class="p-3.5">المريض</th><th class="p-3.5">الفصيلة</th><th class="p-3.5">المستشفى</th><th class="p-3.5">التوثيق</th><th class="p-3.5">الإجراء</th></tr></thead>
        <tbody class="divide-y divide-gray-100 font-medium">
          ${s.requests.map(req => `
          <tr class="hover:bg-gray-50">
            <td class="p-3.5 font-mono font-bold text-red-600">${esc(req.code)}</td>
            <td class="p-3.5 font-bold">${esc(req.patientName)}</td>
            <td class="p-3.5"><span class="px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold">${req.bloodType}</span></td>
            <td class="p-3.5">${esc(req.hospitalName)}</td>
            <td class="p-3.5">${req.verifiedByHospital ? `<span class="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">${icon('check-circle-2', 'w-3.5 h-3.5')}<span>موثق</span></span>` : `<span class="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-full w-fit block">قيد التوثيق</span>`}</td>
            <td class="p-3.5">${!req.verifiedByHospital ? `<button onclick="App.verifyRequest('${req.id}')" class="px-3 py-1 rounded bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700">توثيق من بنك الدم</button>` : ''}</td>
          </tr>`).join('')}
        </tbody>
      </table></div>
    </div>` : `
    <div class="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
      <div class="p-4 border-b border-gray-100 bg-gray-50 font-bold text-xs text-gray-700">${lang.code === 'ar' ? 'جدول المتبرعين المسجلين' : 'Registered Donors Table'}</div>
      <div class="overflow-x-auto"><table class="w-full text-right rtl:text-right ltr:text-left text-xs">
        <thead class="bg-gray-100 text-gray-500 font-bold uppercase"><tr><th class="p-3.5">اسم المتبرع</th><th class="p-3.5">الفصيلة</th><th class="p-3.5">المدينة</th><th class="p-3.5">رقم الهاتف</th><th class="p-3.5">الرتبة</th></tr></thead>
        <tbody class="divide-y divide-gray-100 font-medium">
          ${s.donors.map(donor => `
          <tr class="hover:bg-gray-50">
            <td class="p-3.5 font-bold">${esc(donor.name)}</td>
            <td class="p-3.5"><span class="px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold">${donor.bloodType}</span></td>
            <td class="p-3.5">${esc(donor.city)}</td>
            <td class="p-3.5 font-mono">${esc(donor.phone)}</td>
            <td class="p-3.5"><span class="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">${esc(donor.badge)}</span></td>
          </tr>`).join('')}
        </tbody>
      </table></div>
    </div>`}
  </div>`;
}

// ---- Modals ----
function renderDetailModal(s) {
  if (!s.modals.detail || !s.selectedRequestId) return '';
  const req = s.requests.find(r => r.id === s.selectedRequestId);
  if (!req) return '';
  const t = App.t.call({ state: s });
  const lang = s.lang;
  const percent = Math.round((req.unitsFulfilled / req.unitsNeeded) * 100);
  return `
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
    <div class="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-100 my-8 anim-fade-zoom">
      <div class="bg-gradient-to-r from-red-700 via-rose-700 to-red-800 text-white p-6 relative">
        <button onclick="App.closeDetail()" class="absolute top-5 left-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">${icon('x', 'w-5 h-5')}</button>
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-2xl bg-white text-red-600 font-black text-2xl flex flex-col items-center justify-center shadow-lg"><span>${req.bloodType}</span><span class="text-[10px] text-gray-500 font-bold uppercase">Blood</span></div>
          <div>
            <div class="flex items-center gap-2"><span class="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-md font-mono font-bold">${esc(req.code)}</span><span class="bg-red-900/60 text-red-200 text-xs px-2.5 py-0.5 rounded-full border border-red-500/30 font-bold">${req.urgency}</span></div>
            <h2 class="text-2xl font-black font-serif text-white mt-1">${esc(req.patientName)}</h2>
            <p class="text-xs text-red-100">${lang.code === 'ar' ? `تاريخ النشر: ${new Date(req.createdAt).toLocaleDateString('ar-EG')}` : `Posted: ${new Date(req.createdAt).toLocaleDateString()}`}</p>
          </div>
        </div>
      </div>
      <div class="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
        <div class="bg-red-50 p-4 rounded-2xl border border-red-100 space-y-2">
          <div class="flex justify-between items-center text-sm font-bold"><span class="text-gray-700">${t.bagsFulfilled}:</span><span class="text-red-700">${req.unitsFulfilled} / ${req.unitsNeeded} ${lang.code === 'ar' ? 'أكياس' : 'units'} (${percent}%)</span></div>
          <div class="w-full bg-red-200 h-3 rounded-full overflow-hidden"><div class="bg-red-600 h-3 rounded-full transition-all duration-500" style="width:${Math.min(100, percent)}%"></div></div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="bg-gray-50 p-4 rounded-2xl border border-gray-200/80 space-y-2"><div class="flex items-center gap-2 text-xs font-bold text-gray-500">${icon('building-2', 'w-4 h-4 text-red-600')}<span>${t.hospitalName}</span></div><p class="font-bold text-gray-900 text-sm">${esc(req.hospitalName)}</p><p class="text-xs text-gray-600">${esc(req.hospitalAddress)}</p></div>
          <div class="bg-gray-50 p-4 rounded-2xl border border-gray-200/80 space-y-2"><div class="flex items-center gap-2 text-xs font-bold text-gray-500">${icon('map-pin', 'w-4 h-4 text-red-600')}<span>${t.cityLocation}</span></div><p class="font-bold text-gray-900 text-sm">${esc(req.city)}</p><p class="text-xs text-gray-600">${esc(req.governorate)}</p></div>
        </div>
        <div class="bg-gray-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div><p class="text-xs text-gray-400 font-bold">${t.contactPerson}:</p><p class="text-lg font-bold">${esc(req.contactName)}</p><p class="text-sm text-red-400 font-mono font-bold">${esc(req.contactPhone)}</p></div>
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <a href="tel:${req.contactPhone}" class="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors">${icon('phone', 'w-4 h-4')}<span>${lang.code === 'ar' ? 'اتصال مباشر' : 'Call Directly'}</span></a>
            <button onclick="App.shareWhatsApp('${req.id}')" class="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors">${icon('message-square', 'w-4 h-4')}</button>
          </div>
        </div>
        ${req.medicalNote ? `<div class="space-y-1"><h4 class="text-xs font-bold text-gray-500 uppercase">${t.medicalNote}:</h4><p class="text-sm text-gray-800 bg-amber-50/80 p-3.5 rounded-xl border border-amber-200 leading-relaxed font-medium">${esc(req.medicalNote)}</p></div>` : ''}
        <div class="rounded-2xl overflow-hidden border border-gray-200 bg-slate-100 relative h-40 flex items-center justify-center">
          <div class="relative text-center space-y-1"><div class="inline-flex p-3 bg-red-600 text-white rounded-full shadow-lg anim-bounce">${icon('map-pin', 'w-6 h-6')}</div><p class="text-xs font-bold text-gray-900">${esc(req.hospitalName)}</p><p class="text-[11px] text-gray-500">${esc(req.hospitalAddress)}</p></div>
        </div>
        <div class="space-y-3">
          <h4 class="text-sm font-bold text-gray-900 flex items-center gap-2">${icon('heart', 'w-4 h-4 text-red-600')}<span>${lang.code === 'ar' ? 'المتطوعون المسجلون للتبرع لهذه الحالة:' : 'Registered Donors for this Appeal:'}</span><span class="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">${(req.offers || []).length}</span></h4>
          ${(req.offers && req.offers.length > 0) ? `<div class="space-y-2">${req.offers.map(offer => `
            <div class="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
              <div class="flex items-center gap-2"><div class="w-8 h-8 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center">${offer.donorBloodType}</div><div><p class="font-bold text-gray-900">${esc(offer.donorName)}</p><p class="text-gray-500">${esc(offer.notes || (lang.code === 'ar' ? 'تعهد بأذون تبرع' : 'Pledged blood donation'))}</p></div></div>
              <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${(offer.status === 'ACCEPTED' || offer.status === 'COMPLETED') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">${offer.status}</span>
            </div>`).join('')}</div>` : `<p class="text-xs text-gray-400 italic bg-gray-50 p-3 rounded-xl">${lang.code === 'ar' ? 'لا يوجد متطوعون مسجلون حتى الآن. كن أول أبطال هذه الحالة!' : 'No donors registered yet. Be the first lifesaver!'}</p>`}
        </div>
      </div>
      <div class="p-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-3">
        <button onclick="App.closeDetail()" class="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100 transition-colors">${t.close}</button>
        <button onclick="App.openPledge('${req.id}')" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm shadow-md shadow-red-500/20 flex items-center gap-2">${icon('heart', 'w-4 h-4')}<span>${t.volunteerToDonate}</span></button>
      </div>
    </div>
  </div>`;
}

function renderPledgeModal(s) {
  if (!s.modals.pledge || !s.selectedRequestId) return '';
  const req = s.requests.find(r => r.id === s.selectedRequestId);
  if (!req) return '';
  const t = App.t.call({ state: s });
  const lang = s.lang;
  return `
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
    <div class="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 my-8 anim-fade-zoom">
      <div class="bg-gradient-to-r from-red-600 to-rose-700 text-white p-6 relative">
        <button onclick="App.closePledge()" class="absolute top-5 left-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">${icon('x', 'w-5 h-5')}</button>
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">${icon('heart', 'w-6 h-6')}</div>
          <div><h2 class="text-xl font-black font-serif">${t.confirmPledge}</h2><p class="text-xs text-red-100">${lang.code === 'ar' ? `المريض: ${req.patientName} (${req.code})` : `Patient: ${req.patientName} (${req.code})`}</p></div>
        </div>
      </div>
      <form onsubmit="App.submitPledge(event)" class="p-6 space-y-5">
        <div class="bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl space-y-2.5">
          <h4 class="text-xs font-bold text-emerald-900 flex items-center gap-1.5 uppercase">${icon('shield-check', 'w-4 h-4 text-emerald-600')}<span>${lang.code === 'ar' ? 'فحص السلامة الصحية الفوري:' : 'Donation Safety Health Check:'}</span></h4>
          <label class="flex items-center gap-2 text-xs text-emerald-950 font-medium"><input id="pledge-check-weight" type="checkbox" checked class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"><span>${lang.code === 'ar' ? 'الوزن أكثر من 50 كجم والسلوك الصحي سليم' : 'Weight is over 50kg & in good health'}</span></label>
          <label class="flex items-center gap-2 text-xs text-emerald-950 font-medium"><input id="pledge-check-health" type="checkbox" checked class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"><span>${lang.code === 'ar' ? 'عدم وجود حُمى أو نزلات برد أو أدوية حظر تبرع' : 'No fever, cold, or restricted medications today'}</span></label>
          <label class="flex items-center gap-2 text-xs text-emerald-950 font-medium"><input id="pledge-check-time" type="checkbox" checked class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"><span>${lang.code === 'ar' ? 'مرور 3 أشهر على آخر تبرع بالدم (للرجال) أو 4 أشهر (للنساء)' : 'More than 90 days since your last blood donation'}</span></label>
        </div>
        <div class="space-y-4">
          <div><label class="block text-xs font-bold text-gray-700 mb-1">${t.patientName} (${lang.code === 'ar' ? 'المتبرع' : 'Donor'}):</label><input id="pledge-name" type="text" required value="Ahmed Salama" class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"></div>
          <div class="grid grid-cols-2 gap-3">
            <div><label class="block text-xs font-bold text-gray-700 mb-1">${t.phoneNumber}:</label><input id="pledge-phone" type="text" required value="+20 101 999 2233" class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none font-mono"></div>
            <div><label class="block text-xs font-bold text-gray-700 mb-1">${t.selectBloodType}:</label>
              <select id="pledge-bt" class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none font-bold text-red-600">
                ${BLOOD_TYPES.map(bt => `<option value="${bt}" ${bt === req.bloodType ? 'selected' : ''}>${bt}</option>`).join('')}
              </select>
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">${lang.code === 'ar' ? 'عدد أكياس الدم المتعهد بها:' : 'Units Pledged:'}</label>
            <div class="flex items-center gap-3">
              <button type="button" data-units="1" onclick="App.setPledgeUnits(1)" class="pledge-unit-btn flex-1 py-2.5 rounded-xl text-xs font-bold border transition-colors bg-red-600 text-white border-red-600">1 ${lang.code === 'ar' ? 'كيس دم (450مل)' : 'Unit (450ml)'}</button>
              <button type="button" data-units="2" onclick="App.setPledgeUnits(2)" class="pledge-unit-btn flex-1 py-2.5 rounded-xl text-xs font-bold border transition-colors bg-gray-50 text-gray-700 border-gray-300">2 ${lang.code === 'ar' ? 'كيسين' : '2 Units'}</button>
            </div>
          </div>
        </div>
        <p class="text-[11px] text-gray-500 leading-tight">${lang.code === 'ar' ? 'بالضغط على التأكيد، ستتم إضافة اسمك لقائمة المتبرعين وتنبيه مسؤول الحالة بالمستشفى للبدء في إجراءات الاستقبال.' : 'By confirming, your pledge will be recorded and the hospital contact person notified.'}</p>
        <div class="pt-2 flex items-center justify-end gap-3">
          <button type="button" onclick="App.closePledge()" class="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100">${t.cancel}</button>
          <button type="submit" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs shadow-md shadow-red-500/20 flex items-center gap-1.5">${icon('check-circle-2', 'w-4 h-4')}<span>${t.confirmPledge}</span></button>
        </div>
      </form>
    </div>
  </div>`;
}

function renderCreateModal(s) {
  if (!s.modals.create) return '';
  const t = App.t.call({ state: s });
  const lang = s.lang;
  const isRare = s.createBloodType === 'O-' || s.createBloodType === 'AB-' || s.createBloodType === 'B-';
  return `
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm overflow-y-auto">
    <div class="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-100 my-8 anim-fade-zoom">
      <div class="bg-gradient-to-r from-red-700 via-rose-700 to-red-800 text-white p-6 relative">
        <button onclick="App.closeCreate()" class="absolute top-5 left-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">${icon('x', 'w-5 h-5')}</button>
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">${icon('file-plus', 'w-6 h-6')}</div>
          <div><h2 class="text-2xl font-black font-serif">${t.createRequest}</h2><p class="text-xs text-red-100">${lang.code === 'ar' ? 'نشر استغاثة فورية وإرسال إشعارات لمئات المتبرعين القريبين' : 'Broadcast an urgent request to matching nearby donors'}</p></div>
        </div>
      </div>
      <form onsubmit="App.submitCreate(event)" class="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
        <div id="rare-blood-warning" class="bg-amber-50 border border-amber-300 p-3.5 rounded-2xl items-start gap-3" style="display:${isRare ? 'flex' : 'none'}">
          ${icon('alert-triangle', 'w-5 h-5 text-amber-600 shrink-0 mt-0.5')}
          <div class="text-xs text-amber-900">
            <p class="font-bold rare-title">${lang.code === 'ar' ? `تنبيه: فصيلة ${s.createBloodType} نادرة!` : `Notice: ${s.createBloodType} is a rare blood type!`}</p>
            <p>${lang.code === 'ar' ? 'سيتدخل النظام الذكي لإرسال إنذار أولوية عليا لكافة المتبرعين المسجلين بهذه الفصيلة بالمدينة.' : 'Priority notification will be dispatched immediately to registered rare group donors.'}</p>
          </div>
        </div>

        <div class="space-y-3 border-b border-gray-100 pb-4">
          <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">${lang.code === 'ar' ? '1. بيانات المريض وفصيلة الدم' : '1. Patient & Blood Info'}</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="sm:col-span-2"><label class="block text-xs font-bold text-gray-700 mb-1">${t.patientName} *</label><input id="create-patientName" type="text" required placeholder="${lang.code === 'ar' ? 'مثال: منى أحمد السيد' : 'e.g. Mona Ahmed'}" class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"></div>
            <div><label class="block text-xs font-bold text-gray-700 mb-1">${lang.code === 'ar' ? 'العمر' : 'Age'}</label><input id="create-patientAge" type="number" min="1" max="100" value="30" class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"></div>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1.5">${t.selectBloodType} *</label>
            <div class="grid grid-cols-4 sm:grid-cols-8 gap-2">
              ${BLOOD_TYPES.map(bt => `<button type="button" data-bt="${bt}" onclick="App.setCreateBloodType('${bt}')" class="create-bt-btn py-2.5 rounded-xl font-black text-sm transition-all ${bt === s.createBloodType ? 'bg-red-600 text-white shadow-md shadow-red-500/30 scale-105' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}">${bt}</button>`).join('')}
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label class="block text-xs font-bold text-gray-700 mb-1">${t.bagsNeeded} *</label><input id="create-unitsNeeded" type="number" min="1" max="10" required value="2" class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"></div>
            <div><label class="block text-xs font-bold text-gray-700 mb-1">${lang.code === 'ar' ? 'درجة الإلحاح' : 'Urgency Level'}</label>
              <select id="create-urgency" class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none font-bold text-red-600">
                <option value="CRITICAL">${t.criticalUrgent}</option><option value="URGENT">${t.urgent}</option><option value="MODERATE">${t.moderate}</option><option value="SCHEDULED">${t.scheduled}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="space-y-3 border-b border-gray-100 pb-4">
          <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">${lang.code === 'ar' ? '2. المستشفى والموقع' : '2. Hospital & Location'}</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label class="block text-xs font-bold text-gray-700 mb-1">${t.hospitalName} *</label><input id="create-hospitalName" type="text" required placeholder="${lang.code === 'ar' ? 'مستشفى القصر العيني' : 'e.g. Kasr Al Ainy Hospital'}" class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"></div>
            <div><label class="block text-xs font-bold text-gray-700 mb-1">${t.cityLocation} *</label>
              <select id="create-city" class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none">
                ${EGYPTIAN_CITIES.map(c => `<option value="${c}">${c}</option>`).join('')}
              </select>
            </div>
          </div>
          <div><label class="block text-xs font-bold text-gray-700 mb-1">${lang.code === 'ar' ? 'عنوان المستشفى / القسم / الغرفة' : 'Hospital Address / Ward Number'}</label><input id="create-hospitalAddress" type="text" placeholder="${lang.code === 'ar' ? 'مثال: قسم الجراحة، الدور الثالث، غرفة 302' : 'e.g. Surgery Ward, 3rd floor'}" class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"></div>
        </div>

        <div class="space-y-3">
          <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">${lang.code === 'ar' ? '3. التواصل والتشخيص الطبي' : '3. Contact & Medical Diagnosis'}</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label class="block text-xs font-bold text-gray-700 mb-1">${t.contactPerson}</label><input id="create-contactName" type="text" placeholder="${lang.code === 'ar' ? 'اسم مرافق المريض' : 'Contact person name'}" class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"></div>
            <div><label class="block text-xs font-bold text-gray-700 mb-1">${t.phoneNumber} *</label><input id="create-contactPhone" type="text" required placeholder="+20 100 000 0000" class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none font-mono"></div>
          </div>
          <div><label class="block text-xs font-bold text-gray-700 mb-1">${t.medicalNote}</label><textarea id="create-medicalNote" rows="2" placeholder="${lang.code === 'ar' ? 'اكتب تفاصيل الحالة الطبية أو اسم العملية لمساعدة المتبرعين...' : 'Describe medical notes or surgical emergency...'}" class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"></textarea></div>
        </div>

        <div class="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
          <button type="button" onclick="App.closeCreate()" class="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100">${t.cancel}</button>
          <button type="submit" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm shadow-md shadow-red-500/20 flex items-center gap-2">${icon('sparkles', 'w-4 h-4')}<span>${t.broadcastRequest}</span></button>
        </div>
      </form>
    </div>
  </div>`;
}

function renderAIDrawer(s) {
  if (!s.modals.ai) return '';
  const t = App.t.call({ state: s });
  const lang = s.lang;
  const quickPrompts = lang.code === 'ar' ? [
    'ما هي شروط التبرع بالدم والوزن المطلوب؟', 'فصيلة دمي O-، ما مدى ندرتها ومن يستفيد منها؟', 'ما هي الإرشادات بعد الانتهاء من التبرع بالدم؟'
  ] : [
    'What are the eligibility rules & minimum weight for blood donation?', 'I am O- blood group, who can receive my blood?', 'Post-donation recovery guidelines & care tips'
  ];
  return `
  <div class="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm">
    <div class="bg-white w-full max-w-md h-full flex flex-col shadow-2xl border-l border-gray-200 anim-slide-right">
      <div class="bg-gradient-to-r from-purple-800 to-indigo-900 text-white p-5 flex items-center justify-between border-b border-purple-700">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-purple-200 border border-purple-400/30">${icon('bot', 'w-6 h-6')}</div>
          <div><h3 class="font-bold font-serif text-base">${t.aiAssistant}</h3><p class="text-[11px] text-purple-200 flex items-center gap-1">${icon('sparkles', 'w-3 h-3 text-amber-300')}<span>Powered by Gemini 2.5 AI</span></p></div>
        </div>
        <button onclick="App.closeAI()" class="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors">${icon('x', 'w-5 h-5')}</button>
      </div>
      <div class="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
        <div class="space-y-1.5 pb-2 border-b border-gray-200">
          <p class="text-[11px] font-bold text-gray-400 uppercase">${lang.code === 'ar' ? 'أسئلة شائعة موصى بها:' : 'Suggested Questions:'}</p>
          <div class="flex flex-wrap gap-1.5">${quickPrompts.map(qp => `<button onclick="App.sendAIQuick(${JSON.stringify(qp)})" class="text-xs bg-white hover:bg-purple-50 text-purple-900 border border-purple-200 px-3 py-1.5 rounded-xl font-medium transition-colors text-right rtl:text-right">${esc(qp)}</button>`).join('')}</div>
        </div>
        <div id="ai-chat-messages" class="space-y-4"></div>
      </div>
      <div class="p-4 bg-white border-t border-gray-200">
        <form onsubmit="event.preventDefault(); App.sendAI();" class="flex items-center gap-2">
          <input id="ai-input" type="text" placeholder="${lang.code === 'ar' ? 'اسأل المساعد الذكي شيئاً...' : 'Ask AI Assistant...'}" class="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none">
          <button type="submit" class="p-2.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white rounded-xl transition-colors">${icon('send', 'w-4 h-4 rtl-rotate-180')}</button>
        </form>
      </div>
    </div>
  </div>`;
}
