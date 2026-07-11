        const roleTabs = {
            "Cư dân": [
                { id: "dashboard", label: "Tổng quan Hộ gia đình", icon: "fa-table-columns" },
                { id: "family", label: "Thành viên & Vị trí GPS", icon: "fa-people-roof" },
                { id: "contributions", label: "Quỹ Thôn", icon: "fa-hand-holding-dollar" },
                { id: "bao-antt", label: "Báo An Ninh Trật Tự", icon: "fa-triangle-exclamation" },
                { id: "dang-ky-luu-tru", label: "Đăng Ký Lưu Trú", icon: "fa-house-user" }
            ],
            "Cán bộ Hội": [
                { id: "hội-viên", label: "Quản lý Hội viên", icon: "fa-users" },
                { id: "quỹ-hội", label: "Quản lý Quỹ Hội", icon: "fa-scale-balanced" },
                { id: "vay-vốn", label: "Vay Vốn Hội Viên", icon: "fa-money-bill-transfer" },
                { id: "tin-tức", label: "Tin tức & Thông báo", icon: "fa-newspaper" }
            ],
            "Trưởng thôn": [
                { id: "toàn-thôn", label: "Quản lý Toàn Thôn", icon: "fa-landmark" },
                { id: "quản-lý-quỹ-thôn", label: "Quản lý Quỹ Thôn", icon: "fa-coins" },
                { id: "tin-tức", label: "Tin tức & Thông báo", icon: "fa-newspaper" }
            ],
            "Tổ ANTT": [
                { id: "antt-tin-bao", label: "Tin Báo Từ Cư Dân", icon: "fa-bell" },
                { id: "antt-luu-tru", label: "Duyệt Đăng Ký Lưu Trú", icon: "fa-house-user" },
                { id: "antt-bien-ban", label: "Biên Bản Sự Việc", icon: "fa-file-signature" },
                { id: "antt-dan-cu", label: "Quản Lý Dân Cư", icon: "fa-users-viewfinder" },
                { id: "antt-to-doi", label: "Thành Viên Tổ ANTT", icon: "fa-users-gear" },
                { id: "tin-tức", label: "Tin tức & Thông báo", icon: "fa-newspaper" }
            ],
            "Admin": [
                { id: "duyệt-xóa", label: "Duyệt Yêu Cầu Xóa", icon: "fa-trash-can-arrow-up" },
                { id: "quản-lý-hội", label: "Quản lý Hội nhóm", icon: "fa-folder-tree" },
                { id: "phân-quyền", label: "Cấu hình Phân quyền", icon: "fa-user-lock" },
                { id: "quản-lý-tài-khoản", label: "Quản lý Tài khoản", icon: "fa-users-cog" },
                { id: "quản-lý-trang-chủ", label: "Quản lý Trang chủ", icon: "fa-house-laptop" },
                { id: "nhật-ký", label: "Nhật ký Hệ thống", icon: "fa-list-check" }
            ]
        };

        // Tracks the tab list last handed to renderTabsMenu(), so switchPortalTab()
        // can still find the right buttons when called with just a tabId (e.g. from
        // an onclick="switchPortalTab('...')" generated for a dynamic tab set).
        let lastRenderedTabs = null;

        // tabsInput can be either a flat array of tabs (single "Tính năng vận hành"
        // group, the original behavior) or an array of { label, tabs } groups, each
        // rendered under its own section header (e.g. Cán bộ Hội sees their own
        // resident tabs grouped separately from their association-officer tabs).
        // containerId lets a page render a resident-tabs block into its OWN sidebar
        // container (e.g. Admin, whose main #portal-tabs is a static mix of cross-page
        // links and in-page buttons that this function doesn't generate). When that
        // happens, pass mergeIntoLastRenderedTabs: true so switchPortalTab's default
        // tab lookup (lastRenderedTabs) still includes these tabs alongside the rest.
        function renderTabsMenu(tabsInput, containerId, mergeIntoLastRenderedTabs) {
            renderUserBadge();

            const groups = !tabsInput
                ? [{ label: "Tính năng vận hành", tabs: roleTabs[currentRole] }]
                : (Array.isArray(tabsInput) && tabsInput.length && tabsInput[0].tabs)
                    ? tabsInput
                    : [{ label: "Tính năng vận hành", tabs: tabsInput }];

            const flatTabs = groups.flatMap(g => g.tabs);
            lastRenderedTabs = mergeIntoLastRenderedTabs ? (lastRenderedTabs || []).concat(flatTabs) : flatTabs;
            const container = document.getElementById(containerId || 'portal-tabs');

            container.innerHTML = groups.map(group => `
                <div class="flex items-center gap-2 px-2 mb-2 mt-6 pt-4 border-t border-stone-100 first:mt-0 first:pt-0 first:border-0">
                    <span class="w-1 h-3 rounded-full bg-primary-300"></span>
                    <span class="text-[9px] font-bold text-stone-400 uppercase tracking-widest">${group.label}</span>
                </div>
                ${group.tabs.map(tab => `
                    <button onclick="switchPortalTab('${tab.id}')" id="tab-btn-${tab.id}" class="w-full py-2.5 px-3 rounded-2xl text-stone-500 hover:bg-stone-50 hover:text-stone-900 text-left text-xs font-semibold flex items-center gap-3 transition-all">
                        <i class="fa-solid ${tab.icon} w-4 text-center"></i>
                        <span>${tab.label}</span>
                    </button>
                `).join('')}
            `).join('');
        }

        function switchPortalTab(tabId, tabsList) {
            activeTab = tabId;
            const tabs = tabsList || lastRenderedTabs || roleTabs[currentRole];

            tabs.forEach(tab => {
                const btn = document.getElementById(`tab-btn-${tab.id}`);
                if (btn) {
                    if (tab.id === tabId) {
                        btn.className = "w-full py-2.5 px-3 rounded-2xl bg-primary-50 text-primary-700 text-left text-xs font-bold flex items-center gap-3 transition-all";
                    } else {
                        btn.className = "w-full py-2.5 px-3 rounded-2xl text-stone-500 hover:bg-stone-50 hover:text-stone-900 text-left text-xs font-semibold flex items-center gap-3 transition-all";
                    }
                }
            });

            executeTabRenderer(tabId);
            closeSidebarOnMobile();
        }

        // Sidebar is hidden by default on mobile (< md) and toggled via the
        // hamburger button in the header; auto-closes after picking a tab so
        // the user lands back on the content instead of staring at the menu.
        function toggleSidebar() {
            const panel = document.getElementById('sidebar-panel');
            const backdrop = document.getElementById('sidebar-backdrop');
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

        function closeSidebarOnMobile() {
            if (window.innerWidth >= 768) return;
            const panel = document.getElementById('sidebar-panel');
            const backdrop = document.getElementById('sidebar-backdrop');
            if (panel) {
                panel.classList.remove('translate-x-0');
                panel.classList.add('-translate-x-full');
            }
            if (backdrop) backdrop.classList.add('hidden');
        }

        // Maps a dynamically-generated resident association tab id (e.g. "hoi-0")
        // back to the association name it represents.
        let residentAssocTabMap = {};

        function buildResidentTabs(baseTabs) {
            const familyId = getCurrentUserFamilyId();
            const household = familyId ? villageDb.residents.filter(r => r.familyId === familyId) : [];
            const associations = [...new Set(household.map(r => r.association).filter(a => a && a !== "None"))];

            residentAssocTabMap = {};
            const assocTabs = associations.map((a, idx) => {
                const id = `hoi-${idx}`;
                residentAssocTabMap[id] = a;
                return { id, label: a, icon: "fa-people-group" };
            });

            return (baseTabs || roleTabs["Cư dân"]).concat(assocTabs);
        }

        function executeTabRenderer(tabId) {
            document.getElementById('simulated-notification').classList.add('hidden');

            if (tabId === 'dashboard') renderResidentDashboard();
            else if (tabId === 'family') renderResidentFamily();
            else if (tabId === 'contributions') renderResidentContributions();
            else if (tabId === 'bao-antt') renderResidentIncidentReport();
            else if (tabId === 'dang-ky-luu-tru') renderResidentResidenceRequest();
            else if (tabId === 'hội-viên') renderAssociationMembers();
            else if (tabId === 'quỹ-hội') renderAssociationFunds();
            else if (tabId === 'vay-vốn') renderAssociationLoans();
            else if (tabId === 'tin-tức') renderNewsManagement();
            else if (tabId === 'toàn-thôn') renderTrưởngThônDashboard();
            else if (tabId === 'quản-lý-quỹ-thôn') renderTruongThonVillageFund();
            else if (tabId === 'duyệt-xóa') renderAdminDuyệtXóa();
            else if (tabId === 'quản-lý-hội') renderAdminQuảnLýHội();
            else if (tabId === 'phân-quyền') renderAdminPermissions();
            else if (tabId === 'quản-lý-tài-khoản') renderAdminAccounts();
            else if (tabId === 'quản-lý-trang-chủ') renderAdminHomeContent();
            else if (tabId === 'nhật-ký') renderAdminLogs();
            else if (tabId === 'antt-tin-bao') renderAnttTinBao();
            else if (tabId === 'antt-luu-tru') renderAnttLuuTru();
            else if (tabId === 'antt-bien-ban') renderAnttBienBan();
            else if (tabId === 'antt-dan-cu') renderAnttDanCu();
            else if (tabId === 'antt-to-doi') renderAnttToDoi();
            else if (residentAssocTabMap[tabId]) renderResidentAssociationDetail(residentAssocTabMap[tabId]);
        }

        // -----------------------------------------------------------------------------------
        // 1. CƯ DÂN TABS RENDERERS & LOGIC
        // -----------------------------------------------------------------------------------
        // Household-info card pinned to the bottom of the resident sidebar
        // (chủ hộ / địa chỉ / sĩ số), plus the header notification-bell badge
        // showing how many of the current user's requests are still pending.
