        // Current User Session State
        let currentRole = null;
        let currentUser = null;
        let activeTab = null;
        
        let editingAssocName = null;
        let assocToDelete = null;

        // Initialize App (shared across all 16 pages; guards element lookups
        // since each page only has a subset of the markup)
        document.addEventListener('DOMContentLoaded', function() {
            initDatabase();
            renderHomeContent();
            trackVisit();
            initMobileHeroCarousel();

            const nav = document.getElementById('main-nav');
            if (nav) {
                window.addEventListener('scroll', function() {
                    if (window.scrollY > 20) {
                        nav.classList.add('shadow-lg');
                    } else {
                        nav.classList.remove('shadow-lg');
                    }
                });
            }

            const menuBtn = document.getElementById('mobile-menu-btn');
            if (menuBtn) {
                menuBtn.addEventListener('click', toggleMobileMenu);
            }

            // Background music (index.html only): browsers block autoplay with
            // sound until the visitor has interacted with the page, so we try
            // right away and fall back to updating the toggle icon if blocked.
            const bgMusic = document.getElementById('bg-music');
            if (bgMusic) {
                bgMusic.volume = 0.5;
                bgMusic.play().then(() => {
                    updateMusicToggleIcon(true);
                }).catch(() => {
                    updateMusicToggleIcon(false);
                });
            }
        });

        // index.html's mobile nav drawer (half-width slide-in, mirrors the
        // dashboards' toggleSidebar() pattern but with its own element ids
        // since this page has no logged-in session/portal-tabs).
        function toggleMobileMenu() {
            const panel = document.getElementById('mobile-menu');
            const backdrop = document.getElementById('mobile-menu-backdrop');
            if (!panel) return;
            const isOpen = panel.classList.contains('translate-x-0');
            if (isOpen) {
                panel.classList.remove('translate-x-0');
                panel.classList.add('-translate-x-full');
                if (backdrop) backdrop.classList.add('hidden');
            } else {
                panel.classList.add('translate-x-0');
                panel.classList.remove('-translate-x-full');
                if (backdrop) backdrop.classList.remove('hidden');
            }
        }

        function updateMusicToggleIcon(isPlaying) {
            const icon = document.getElementById('music-toggle-icon');
            if (!icon) return;
            icon.className = isPlaying ? 'fa-solid fa-music' : 'fa-solid fa-volume-xmark';
        }

        function toggleBgMusic() {
            const audio = document.getElementById('bg-music');
            if (!audio) return;
            if (audio.paused) {
                audio.play().then(() => updateMusicToggleIcon(true)).catch(() => {});
            } else {
                audio.pause();
                updateMusicToggleIcon(false);
            }
        }

        // Session helpers (multi-page auth: session is persisted in
        // localStorage so a role's dashboard page(s) can be reloaded directly)
        function requireSession(allowedRoles) {
            initDatabase();
            const session = JSON.parse(localStorage.getItem('activeSession') || 'null');
            if (!session) {
                window.location.href = 'dang-nhap.html';
                return null;
            }
            const acc = villageDb.accounts.find(a => a.username === session.username);
            if (!acc || acc.status !== 'Hoạt động' || (allowedRoles && !allowedRoles.includes(acc.role))) {
                window.location.href = 'dang-nhap.html';
                return null;
            }
            currentRole = acc.role;
            currentUser = acc;
            return acc;
        }

        // Resolves the household (familyId) of whichever account is currently
        // logged in, by matching their name against the residents list. Every
        // role that also lives in the village (Cư dân, Cán bộ Hội) uses this so
        // the "Tổng quan / Thành viên Hộ / Quỹ Thôn" tabs show THEIR OWN household,
        // not a hardcoded one.
        function getCurrentUserFamilyId() {
            const resident = villageDb.residents.find(r => r.name === currentUser.name);
            return resident ? resident.familyId : null;
        }

        // Resolves the resident record (and so the resident id) of whichever
        // account is logged in — used for per-member hội phí obligations, which
        // are tracked per person rather than per household.
        function getCurrentUserResident() {
            return villageDb.residents.find(r => r.name === currentUser.name) || null;
        }

        // Every stored date in villageDb (dob, news date, transaction dates...)
        // uses the Vietnamese "DD/MM/YYYY" text format everywhere it's displayed,
        // but <input type="date"> only accepts/emits ISO "YYYY-MM-DD" — these
        // convert between the two so date-picker fields can prefill and save
        // without changing the stored format app-wide.
        function dmyToIso(dmy) {
            const parts = String(dmy || '').split('/');
            if (parts.length !== 3) return '';
            const [d, m, y] = parts;
            return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
        }
        function isoToDmy(iso) {
            const parts = String(iso || '').split('-');
            if (parts.length !== 3) return '';
            const [y, m, d] = parts;
            return `${d}/${m}/${y}`;
        }
        // "Chu kỳ" (period) fields only ever need a year (not a full date), so
        // they're rendered as a plain <select> of years rather than a date
        // picker — these helpers extract the year out of an existing "Năm
        // 2026" period label and build/select the <option> list.
        function periodToYear(period) {
            const match = String(period || '').match(/\d{4}/);
            return match ? match[0] : String(new Date().getFullYear());
        }
        function yearToPeriodLabel(year) {
            return `Năm ${year}`;
        }
        function buildYearSelectOptions(selectedYear) {
            const current = new Date().getFullYear();
            const years = [];
            for (let y = current - 1; y <= current + 5; y++) years.push(y);
            return years.map(y => `<option value="${y}" ${String(y) === String(selectedYear) ? 'selected' : ''}>${y}</option>`).join('');
        }
        // A "khoản thu" obligation drops out of the active list/checkboxes once
        // its cycle year has passed (e.g. a "Năm 2026" obligation disappears once
        // the calendar reaches 2027) so the selection list doesn't keep growing
        // year after year — the underlying data (and each household/member's
        // already-created fund entries) is never touched, only the display here.
        function isObligationCurrentCycle(period) {
            const match = String(period || '').match(/\d{4}/);
            if (!match) return true;
            return parseInt(match[0]) >= new Date().getFullYear();
        }

        function renderUserBadge() {
            document.getElementById('user-display-name').innerText = currentUser.name;
            document.getElementById('user-avatar-initials').innerText = currentUser.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();

            const subtitle = document.getElementById('user-subtitle');
            const familyId = getCurrentUserFamilyId();
            if (currentRole === 'Cư dân') {
                subtitle.innerText = `Chủ hộ • Hộ số: ${familyId || 'Chưa xác định'}`;
            } else if (currentRole === 'Cán bộ Hội') {
                subtitle.innerText = `Quản trị: ${currentUser.assoc}${familyId ? ` • Hộ số: ${familyId}` : ''}`;
            } else if (currentRole === 'Trưởng thôn') {
                subtitle.innerText = "Đại diện: Thôn Đoàn Kết";
            } else if (currentRole === 'Admin') {
                subtitle.innerText = "Quản trị hệ thống tối cao";
            }

            // Cán bộ Hội's header (dashboard-canbo.html only) shows the
            // specific association they manage instead of a generic title,
            // since one account only ever represents one hội (Hội Nông dân,
            // Hội Phụ nữ...).
            const pageTitle = document.getElementById('header-page-title');
            if (pageTitle && currentRole === 'Cán bộ Hội' && currentUser.assoc) {
                pageTitle.innerText = `CỔNG ${currentUser.assoc.toUpperCase()}`;
            }
        }

        function initDatabase() {
            if (localStorage.getItem('village_residents_db')) {
                villageDb.residents = JSON.parse(localStorage.getItem('village_residents_db'));
                villageDb.funds = JSON.parse(localStorage.getItem('village_funds_db'));
                villageDb.associationQuotas = JSON.parse(localStorage.getItem('village_assoc_db'));
                villageDb.accounts = JSON.parse(localStorage.getItem('village_accounts_db'));
                villageDb.auditLogs = JSON.parse(localStorage.getItem('village_logs_db'));
                villageDb.deleteRequests = JSON.parse(localStorage.getItem('village_del_req_db'));
                villageDb.permissions = JSON.parse(localStorage.getItem('village_perms_db'));
                villageDb.villageFund = localStorage.getItem('village_fund_db')
                    ? JSON.parse(localStorage.getItem('village_fund_db'))
                    : {...defaultVillageFund};
                villageDb.memberEditRequests = localStorage.getItem('village_member_edit_req_db')
                    ? JSON.parse(localStorage.getItem('village_member_edit_req_db'))
                    : [...defaultMemberEditRequests];
                villageDb.newMemberRequests = localStorage.getItem('village_new_member_req_db')
                    ? JSON.parse(localStorage.getItem('village_new_member_req_db'))
                    : [...defaultNewMemberRequests];
                villageDb.houseNumbers = localStorage.getItem('village_house_numbers_db')
                    ? JSON.parse(localStorage.getItem('village_house_numbers_db'))
                    : {};
                villageDb.fundObligations = localStorage.getItem('village_fund_obligations_db')
                    ? JSON.parse(localStorage.getItem('village_fund_obligations_db'))
                    : [...defaultFundObligations];
                villageDb.gpsCoords = localStorage.getItem('village_gps_coords_db')
                    ? JSON.parse(localStorage.getItem('village_gps_coords_db'))
                    : {...defaultGpsCoords};
                villageDb.homeContent = localStorage.getItem('village_home_content_db')
                    ? JSON.parse(localStorage.getItem('village_home_content_db'))
                    : JSON.parse(JSON.stringify(defaultHomeContent));
                // Backfill any homeContent fields added after a visitor's copy was
                // already cached in localStorage (e.g. the "gallery" section),
                // so returning visitors get new sections without losing edits
                // Admin already made to the cached stats/news/products/etc.
                Object.keys(defaultHomeContent).forEach(key => {
                    if (!(key in villageDb.homeContent)) {
                        villageDb.homeContent[key] = JSON.parse(JSON.stringify(defaultHomeContent[key]));
                    }
                });
                villageDb.incidentReports = localStorage.getItem('village_incident_reports_db')
                    ? JSON.parse(localStorage.getItem('village_incident_reports_db'))
                    : [];
                villageDb.residenceRegistrations = localStorage.getItem('village_residence_reg_db')
                    ? JSON.parse(localStorage.getItem('village_residence_reg_db'))
                    : [];
                villageDb.incidentMinutes = localStorage.getItem('village_incident_minutes_db')
                    ? JSON.parse(localStorage.getItem('village_incident_minutes_db'))
                    : [];
            } else {
                villageDb.residents = [...defaultResidents];
                villageDb.funds = {...defaultFunds};
                villageDb.associationQuotas = {...defaultAssociationQuotas};
                villageDb.accounts = [...defaultAccounts];
                villageDb.auditLogs = [...defaultLogs];
                villageDb.deleteRequests = [...defaultDeleteRequests];
                villageDb.permissions = {...defaultPermissions};
                villageDb.villageFund = {...defaultVillageFund};
                villageDb.memberEditRequests = [...defaultMemberEditRequests];
                villageDb.newMemberRequests = [...defaultNewMemberRequests];
                villageDb.houseNumbers = {};
                villageDb.fundObligations = [...defaultFundObligations];
                villageDb.gpsCoords = {...defaultGpsCoords};
                villageDb.homeContent = JSON.parse(JSON.stringify(defaultHomeContent));
                villageDb.incidentReports = [];
                villageDb.residenceRegistrations = [];
                villageDb.incidentMinutes = [];
                saveDatabase();
            }
        }

        function saveDatabase() {
            localStorage.setItem('village_residents_db', JSON.stringify(villageDb.residents));
            localStorage.setItem('village_funds_db', JSON.stringify(villageDb.funds));
            localStorage.setItem('village_assoc_db', JSON.stringify(villageDb.associationQuotas));
            localStorage.setItem('village_accounts_db', JSON.stringify(villageDb.accounts));
            localStorage.setItem('village_logs_db', JSON.stringify(villageDb.auditLogs));
            localStorage.setItem('village_del_req_db', JSON.stringify(villageDb.deleteRequests));
            localStorage.setItem('village_perms_db', JSON.stringify(villageDb.permissions));
            localStorage.setItem('village_fund_db', JSON.stringify(villageDb.villageFund));
            localStorage.setItem('village_member_edit_req_db', JSON.stringify(villageDb.memberEditRequests));
            localStorage.setItem('village_new_member_req_db', JSON.stringify(villageDb.newMemberRequests));
            localStorage.setItem('village_house_numbers_db', JSON.stringify(villageDb.houseNumbers));
            localStorage.setItem('village_fund_obligations_db', JSON.stringify(villageDb.fundObligations));
            localStorage.setItem('village_gps_coords_db', JSON.stringify(villageDb.gpsCoords));
            localStorage.setItem('village_home_content_db', JSON.stringify(villageDb.homeContent));
            localStorage.setItem('village_incident_reports_db', JSON.stringify(villageDb.incidentReports));
            localStorage.setItem('village_residence_reg_db', JSON.stringify(villageDb.residenceRegistrations));
            localStorage.setItem('village_incident_minutes_db', JSON.stringify(villageDb.incidentMinutes));
        }

        function addLog(action, detail, actor) {
            const now = new Date();
            const timeStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth()+1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
            villageDb.auditLogs.unshift({ time: timeStr, action, detail, actor });
            saveDatabase();
        }

        // Custom Alert Controllers
        function showCustomAlert(type, title, message) {
            const box = document.getElementById('custom-alert-box');
            const icon = document.getElementById('alert-box-icon');
            const titleEl = document.getElementById('alert-box-title');
            const msgEl = document.getElementById('alert-box-message');

            titleEl.innerText = title;
            msgEl.innerText = message;

            if (type === 'success') {
                icon.className = "w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 bg-emerald-50 text-emerald-600";
                icon.innerHTML = `<i class="fa-solid fa-circle-check"></i>`;
            } else if (type === 'error') {
                icon.className = "w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 bg-red-50 text-red-600";
                icon.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i>`;
            } else {
                icon.className = "w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 bg-blue-50 text-blue-600";
                icon.innerHTML = `<i class="fa-solid fa-circle-info"></i>`;
            }

            box.classList.remove('hidden');
            setTimeout(() => {
                box.classList.remove('translate-x-96');
            }, 10);

            setTimeout(() => {
                closeCustomAlert();
            }, 4000);
        }

        function closeCustomAlert() {
            const box = document.getElementById('custom-alert-box');
            box.classList.add('translate-x-96');
            setTimeout(() => {
                box.classList.add('hidden');
            }, 300);
        }

        function selectPreset(username, password) {
            document.getElementById('login-username').value = username;
            document.getElementById('login-password').value = password;
        }

        const roleRedirect = {
            'Cư dân': 'dashboard-cu-dan.html',
            'Cán bộ Hội': 'dashboard-canbo.html',
            'Trưởng thôn': 'dashboard-truongthon.html',
            'Tổ ANTT': 'dashboard-antt.html',
            'Admin': 'dashboard-admin.html'
        };

        function handleCitizenLogin(event) {
            event.preventDefault();
            const u = document.getElementById('login-username').value.trim();
            const p = document.getElementById('login-password').value.trim();
            const errAlert = document.getElementById('login-error-alert');
            const errText = document.getElementById('login-error-text');

            const acc = villageDb.accounts.find(a => a.username === u && p === 'doanket');

            if (acc) {
                if (acc.status !== "Hoạt động") {
                    errAlert.classList.remove('hidden');
                    errText.innerHTML = "Tài khoản của bạn đã bị khóa bởi quản trị viên.";
                    return;
                }

                acc.lastActive = "Vừa xong";
                saveDatabase();
                localStorage.setItem('activeSession', JSON.stringify({ username: acc.username }));

                errAlert.classList.add('hidden');
                addLog("Đăng nhập", `${acc.name} đăng nhập thành công với quyền ${acc.role}.`, acc.name);
                window.location.href = roleRedirect[acc.role];
            } else {
                errAlert.classList.remove('hidden');
                errText.innerHTML = "Tài khoản hoặc mật khẩu không chính xác.";
            }
        }

        function logout() {
            addLog("Đăng xuất", `Tài khoản ${currentUser.name} đã đăng xuất.`, currentUser.name);
            localStorage.removeItem('activeSession');
            currentRole = null;
            currentUser = null;
            activeTab = null;
            window.location.href = 'index.html';
        }

        // Tabs configuration per Role
