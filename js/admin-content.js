        const VIETNAM_BANKS = [
            "Agribank - Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam",
            "Vietcombank - Ngân hàng TMCP Ngoại thương Việt Nam",
            "VietinBank - Ngân hàng TMCP Công thương Việt Nam",
            "BIDV - Ngân hàng TMCP Đầu tư và Phát triển Việt Nam",
            "Techcombank - Ngân hàng TMCP Kỹ thương Việt Nam",
            "MB Bank - Ngân hàng TMCP Quân đội",
            "ACB - Ngân hàng TMCP Á Châu",
            "VPBank - Ngân hàng TMCP Việt Nam Thịnh Vượng",
            "Sacombank - Ngân hàng TMCP Sài Gòn Thương Tín",
            "HDBank - Ngân hàng TMCP Phát triển TP.HCM",
            "TPBank - Ngân hàng TMCP Tiên Phong",
            "SHB - Ngân hàng TMCP Sài Gòn - Hà Nội",
            "VIB - Ngân hàng TMCP Quốc tế Việt Nam",
            "Eximbank - Ngân hàng TMCP Xuất Nhập khẩu Việt Nam",
            "MSB - Ngân hàng TMCP Hàng hải Việt Nam",
            "OCB - Ngân hàng TMCP Phương Đông",
            "SeABank - Ngân hàng TMCP Đông Nam Á",
            "LPBank - Ngân hàng TMCP Lộc Phát Việt Nam",
            "Nam A Bank - Ngân hàng TMCP Nam Á",
            "Bac A Bank - Ngân hàng TMCP Bắc Á",
            "PVcomBank - Ngân hàng TMCP Đại Chúng Việt Nam",
            "SCB - Ngân hàng TMCP Sài Gòn",
            "VietBank - Ngân hàng TMCP Việt Nam Thương Tín",
            "KienlongBank - Ngân hàng TMCP Kiên Long",
            "NCB - Ngân hàng TMCP Quốc Dân",
            "BaoVietBank - Ngân hàng TMCP Bảo Việt",
            "PGBank - Ngân hàng TMCP Xăng dầu Petrolimex",
            "SaigonBank - Ngân hàng TMCP Sài Gòn Công Thương",
            "VietABank - Ngân hàng TMCP Việt Á",
            "ABBank - Ngân hàng TMCP An Bình",
            "GPBank - Ngân hàng Thương mại TNHH MTV Dầu khí Toàn Cầu",
            "MBV - Ngân hàng Thương mại TNHH MTV Đại Dương",
            "CB - Ngân hàng Thương mại TNHH MTV Xây dựng Việt Nam",
            "Co-opBank - Ngân hàng Hợp tác xã Việt Nam",
            "Public Bank Vietnam",
            "Woori Bank Việt Nam",
            "Shinhan Bank Việt Nam",
            "HSBC Việt Nam",
            "Standard Chartered Việt Nam",
            "CIMB Việt Nam",
            "UOB Việt Nam",
            "Ngân hàng Chính sách Xã hội (VBSP)"
        ];

        // NAPAS BIN codes for VietQR image generation (img.vietqr.io), keyed by
        // the exact bank label in VIETNAM_BANKS. Only the major domestic banks
        // realistically used by a village fund are mapped; unmapped/foreign
        // banks fall back to the placeholder QR since we can't be certain of
        // their BIN.
        const VIETQR_BANK_BIN = {
            "Agribank - Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam": "970405",
            "Vietcombank - Ngân hàng TMCP Ngoại thương Việt Nam": "970436",
            "VietinBank - Ngân hàng TMCP Công thương Việt Nam": "970415",
            "BIDV - Ngân hàng TMCP Đầu tư và Phát triển Việt Nam": "970418",
            "Techcombank - Ngân hàng TMCP Kỹ thương Việt Nam": "970407",
            "MB Bank - Ngân hàng TMCP Quân đội": "970422",
            "ACB - Ngân hàng TMCP Á Châu": "970416",
            "VPBank - Ngân hàng TMCP Việt Nam Thịnh Vượng": "970432",
            "Sacombank - Ngân hàng TMCP Sài Gòn Thương Tín": "970403",
            "HDBank - Ngân hàng TMCP Phát triển TP.HCM": "970437",
            "TPBank - Ngân hàng TMCP Tiên Phong": "970423",
            "SHB - Ngân hàng TMCP Sài Gòn - Hà Nội": "970443",
            "VIB - Ngân hàng TMCP Quốc tế Việt Nam": "970441",
            "Eximbank - Ngân hàng TMCP Xuất Nhập khẩu Việt Nam": "970431",
            "MSB - Ngân hàng TMCP Hàng hải Việt Nam": "970426",
            "OCB - Ngân hàng TMCP Phương Đông": "970448",
            "SeABank - Ngân hàng TMCP Đông Nam Á": "970440",
            "LPBank - Ngân hàng TMCP Lộc Phát Việt Nam": "970449",
            "Nam A Bank - Ngân hàng TMCP Nam Á": "970428",
            "Bac A Bank - Ngân hàng TMCP Bắc Á": "970409",
            "PVcomBank - Ngân hàng TMCP Đại Chúng Việt Nam": "970412",
            "SCB - Ngân hàng TMCP Sài Gòn": "970429",
            "VietBank - Ngân hàng TMCP Việt Nam Thương Tín": "970433",
            "KienlongBank - Ngân hàng TMCP Kiên Long": "970452",
            "NCB - Ngân hàng TMCP Quốc Dân": "970419",
            "BaoVietBank - Ngân hàng TMCP Bảo Việt": "970438",
            "PGBank - Ngân hàng TMCP Xăng dầu Petrolimex": "970430",
            "SaigonBank - Ngân hàng TMCP Sài Gòn Công Thương": "970400",
            "VietABank - Ngân hàng TMCP Việt Á": "970427",
            "ABBank - Ngân hàng TMCP An Bình": "970425"
        };

        // Builds a live VietQR payment QR (img.vietqr.io) from the village fund's
        // saved bank info; falls back to a placeholder image when the bank isn't
        // mapped (e.g. foreign banks) or no bank info has been saved yet.
        function buildVietQrUrl(bankInfo, amount, addInfo) {
            if (!bankInfo || !bankInfo.bankName || !bankInfo.accountNumber) return null;
            const bin = VIETQR_BANK_BIN[bankInfo.bankName];
            if (!bin) return null;
            const params = new URLSearchParams({
                amount: String(amount),
                addInfo: addInfo,
                accountName: bankInfo.accountHolder || ''
            });
            return `https://img.vietqr.io/image/${bin}-${bankInfo.accountNumber}-compact2.png?${params.toString()}`;
        }

        const NEWS_CATEGORIES = [
            { slug: "hanh-chinh", label: "Hành chính", colorClass: "bg-red-50 text-red-600 " },
            { slug: "san-xuat", label: "Sản xuất", colorClass: "bg-emerald-50 text-emerald-600 " },
            { slug: "doan-the", label: "Đoàn thể", colorClass: "bg-amber-50 text-amber-600 " }
        ];

        // Shared "Tin tức & Thông báo" table rows — used both by Admin's full
        // "Quản lý Trang chủ" page and by the standalone news-management tab
        // available to Cán bộ Hội/Trưởng thôn/Tổ ANTT, since all of them write
        // to the same villageDb.homeContent.news shown on the public homepage.
        // Admin can edit/delete every tin tức; every other role (Cán bộ Hội,
        // Trưởng thôn, Tổ ANTT) can only edit/delete tin they themselves created —
        // legacy items seeded before this field existed are attributed to Admin.
        function canManageNewsItem(n) {
            return currentRole === 'Admin' || n.createdBy === currentUser.name;
        }

        function buildNewsRowsHtml() {
            const news = (villageDb.homeContent && villageDb.homeContent.news) || [];
            return news.map(n => {
                const canManage = canManageNewsItem(n);
                const isConfirming = homeContentItemToDelete === n.id;
                const deleteBtn = isConfirming
                    ? `<button onclick="deleteHomeNews('${n.id}')" class="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white border border-red-500 text-[10px] font-bold"><i class="fa-solid fa-triangle-exclamation"></i> Xác nhận?</button>`
                    : `<button onclick="deleteHomeNews('${n.id}')" class="px-2.5 py-1 rounded bg-red-50 hover:bg-red-600 text-red-600 hover:text-white text-[10px] font-semibold"><i class="fa-solid fa-trash"></i> Xóa</button>`;
                const actions = canManage
                    ? `<button onclick="openNewsFormModal('${n.id}')" class="px-2.5 py-1 rounded bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-850 text-[10px]"><i class="fa-solid fa-pen-to-square mr-1"></i> Sửa</button>${deleteBtn}`
                    : `<span class="text-stone-600 text-[10px]">Chỉ ${n.createdBy || 'Admin'} có thể sửa</span>`;
                return `
                    <tr class="hover:bg-stone-50 transition-colors">
                        <td class="p-3 font-semibold text-stone-900">${n.title}</td>
                        <td class="p-3 text-stone-600">${n.category}</td>
                        <td class="p-3 font-mono text-stone-500">${n.date}</td>
                        <td class="p-3 text-right space-x-2 whitespace-nowrap">${actions}</td>
                    </tr>
                `;
            }).join('') || '<tr><td colspan="4" class="p-4 text-center text-stone-400">Chưa có thông báo nào.</td></tr>';
        }

        function renderNewsManagement() {
            const container = document.getElementById('tab-content-container');
            container.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                    <div>
                        <h4 class="font-serif text-lg font-bold text-stone-900">Tin tức & Thông báo</h4>
                        <p class="text-xs text-stone-500">Đăng tin tức/thông báo hiển thị công khai ở mục "Bảng Tin & Thông Báo" trên trang chủ.</p>
                    </div>
                    <button onclick="openNewsFormModal(null)" class="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-primary-950/50 flex items-center gap-2 shrink-0">
                        <i class="fa-solid fa-plus"></i> Thêm tin
                    </button>
                </div>

                <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50 text-left">
                    <table class="w-full text-left text-xs">
                        <thead>
                            <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                <th class="p-3 font-semibold">Tiêu đề</th>
                                <th class="p-3 font-semibold">Danh mục</th>
                                <th class="p-3 font-semibold">Ngày</th>
                                <th class="p-3 font-semibold text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-stone-200/40 text-stone-600">${buildNewsRowsHtml()}</tbody>
                    </table>
                </div>
            `;
        }

        function renderAdminHomeContent() {
            const container = document.getElementById('tab-content-container');
            const hc = villageDb.homeContent;

            const statRows = (hc.stats || []).map(s => `
                <tr class="hover:bg-stone-50 transition-colors">
                    <td class="p-3 font-semibold text-stone-900">${s.label}</td>
                    <td class="p-3 font-mono text-stone-600">${s.value} ${s.unit}</td>
                    <td class="p-3 text-right"><button onclick="openEditStatModal('${s.id}')" class="px-2.5 py-1 rounded bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-850 text-[10px]"><i class="fa-solid fa-pen-to-square mr-1"></i> Sửa</button></td>
                </tr>
            `).join('');

            const newsRows = buildNewsRowsHtml();

            const productRows = (hc.products || []).map(p => {
                const isConfirming = homeContentItemToDelete === p.id;
                const deleteBtn = isConfirming
                    ? `<button onclick="deleteHomeProduct('${p.id}')" class="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white border border-red-500 text-[10px] font-bold"><i class="fa-solid fa-triangle-exclamation"></i> Xác nhận?</button>`
                    : `<button onclick="deleteHomeProduct('${p.id}')" class="px-2.5 py-1 rounded bg-red-50 hover:bg-red-600 text-red-600 hover:text-white text-[10px] font-semibold"><i class="fa-solid fa-trash"></i> Xóa</button>`;
                return `
                    <tr class="hover:bg-stone-50 transition-colors">
                        <td class="p-3 font-semibold text-stone-900">${p.name}</td>
                        <td class="p-3 text-stone-600">${p.badge}</td>
                        <td class="p-3 text-right space-x-2 whitespace-nowrap">
                            <button onclick="openProductFormModal('${p.id}')" class="px-2.5 py-1 rounded bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-850 text-[10px]"><i class="fa-solid fa-pen-to-square mr-1"></i> Sửa</button>
                            ${deleteBtn}
                        </td>
                    </tr>
                `;
            }).join('') || '<tr><td colspan="3" class="p-4 text-center text-stone-400">Chưa có nông sản nào.</td></tr>';

            const leadershipRows = getPublicLeadershipList().map(l => `
                <tr class="hover:bg-stone-50 transition-colors">
                    <td class="p-3 font-semibold text-stone-900">${l.name}</td>
                    <td class="p-3 text-stone-600">${l.role}</td>
                </tr>
            `).join('') || '<tr><td colspan="2" class="p-4 text-center text-stone-400">Chưa có nhân sự nào.</td></tr>';

            const sec = hc.security || { hotline: '', hotlineDisplay: '', slogan: '' };
            const memberRows = getPublicSecurityRoster().map(m => `
                <tr class="hover:bg-stone-50 transition-colors">
                    <td class="p-3 font-semibold text-stone-900">${m.name}</td>
                    <td class="p-3 text-stone-600">${m.title}</td>
                    <td class="p-3 font-mono text-stone-500">${m.phoneDisplay}</td>
                </tr>
            `).join('') || '<tr><td colspan="3" class="p-4 text-center text-stone-400">Chưa có thành viên nào.</td></tr>';

            container.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                    <div>
                        <h4 class="font-serif text-lg font-bold text-stone-900">Quản lý Trang chủ</h4>
                        <p class="text-xs text-stone-500">Chỉnh sửa nội dung hiển thị công khai trên trang chủ (index.html) mà không cần sửa mã nguồn.</p>
                    </div>
                </div>

                <!-- Thống kê -->
                <div class="space-y-3 text-left">
                    <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Số liệu thống kê (mục "Tầm Vóc Mới")</span>
                    <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                    <th class="p-3 font-semibold">Chỉ tiêu</th>
                                    <th class="p-3 font-semibold">Giá trị</th>
                                    <th class="p-3 font-semibold text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-stone-200/40 text-stone-600">${statRows}</tbody>
                        </table>
                    </div>
                </div>

                <!-- Tin tức -->
                <div class="space-y-3 text-left">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Tin tức & Thông báo</span>
                        <button onclick="openNewsFormModal(null)" class="px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-bold text-[11px] uppercase"><i class="fa-solid fa-plus mr-1"></i> Thêm tin</button>
                    </div>
                    <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                    <th class="p-3 font-semibold">Tiêu đề</th>
                                    <th class="p-3 font-semibold">Danh mục</th>
                                    <th class="p-3 font-semibold">Ngày</th>
                                    <th class="p-3 font-semibold text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-stone-200/40 text-stone-600">${newsRows}</tbody>
                        </table>
                    </div>
                </div>

                <!-- Nông sản -->
                <div class="space-y-3 text-left">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Nông sản đặc sản</span>
                        <button onclick="openProductFormModal(null)" class="px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-bold text-[11px] uppercase"><i class="fa-solid fa-plus mr-1"></i> Thêm nông sản</button>
                    </div>
                    <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                    <th class="p-3 font-semibold">Tên nông sản</th>
                                    <th class="p-3 font-semibold">Nhãn</th>
                                    <th class="p-3 font-semibold text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-stone-200/40 text-stone-600">${productRows}</tbody>
                        </table>
                    </div>
                </div>

                <!-- Ban tự quản -->
                <div class="space-y-3 text-left">
                    <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Ban tự quản & Hệ thống chính trị</span>
                    <p class="text-[11px] text-stone-400 -mt-1">Đồng bộ theo trường "Chức vụ" của từng tài khoản — sửa ở tab <span class="font-semibold text-stone-500">Quản lý Tài khoản</span>.</p>
                    <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                    <th class="p-3 font-semibold">Họ và tên</th>
                                    <th class="p-3 font-semibold">Chức vụ</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-stone-200/40 text-stone-600">${leadershipRows}</tbody>
                        </table>
                    </div>
                </div>

                <!-- Tổ An ninh -->
                <div class="space-y-3 text-left">
                    <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Tổ An ninh trật tự</span>
                    <div class="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3">
                        <form onsubmit="saveSecurityHotline(event)" class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                            <div class="space-y-1">
                                <label class="text-[9px] uppercase font-bold text-stone-400 block">Số điện thoại đường dây nóng</label>
                                <input type="text" id="security-hotline-input" value="${sec.hotline}" placeholder="0987533112" class="w-full px-3 py-2 rounded-lg bg-white border border-stone-200 text-stone-900 text-xs outline-none focus:border-primary-500">
                            </div>
                            <div class="space-y-1">
                                <label class="text-[9px] uppercase font-bold text-stone-400 block">Khẩu hiệu (Phương châm)</label>
                                <input type="text" id="security-slogan-input" value="${sec.slogan}" class="w-full px-3 py-2 rounded-lg bg-white border border-stone-200 text-stone-900 text-xs outline-none focus:border-primary-500">
                            </div>
                            <button type="submit" class="w-full py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs uppercase">Lưu</button>
                        </form>
                    </div>
                    <div class="pt-2">
                        <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Thành viên Tổ An ninh</span>
                        <p class="text-[11px] text-stone-400">Đồng bộ theo tài khoản có vai trò "Tổ ANTT" — thêm/sửa/xóa thành viên và chức danh (Tổ Trưởng/Tổ Phó/Tổ Viên) ở tab <span class="font-semibold text-stone-500">Quản lý Tài khoản</span>.</p>
                    </div>
                    <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                    <th class="p-3 font-semibold">Họ và tên</th>
                                    <th class="p-3 font-semibold">Chức danh</th>
                                    <th class="p-3 font-semibold">Số điện thoại</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-stone-200/40 text-stone-600">${memberRows}</tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        // Shared confirm-twice delete state for every home-content list (news,
        // products, leadership, security members) — only one item can be
        // "armed" for deletion at a time, mirroring the pattern used elsewhere
        // (deleteMemberLoan, deleteVillageFundTransaction, confirmDeleteAssoc).
        let homeContentItemToDelete = null;

        // --- Stats ---
        let editingStatId = null;
        function openEditStatModal(id) {
            const stat = villageDb.homeContent.stats.find(s => s.id === id);
            if (!stat) return;
            editingStatId = id;
            document.getElementById('edit-stat-label-input').value = stat.label;
            document.getElementById('edit-stat-icon-input').value = stat.icon;
            document.getElementById('edit-stat-value-input').value = stat.value;
            document.getElementById('edit-stat-unit-input').value = stat.unit;
            document.getElementById('edit-stat-breakdown1-label-input').value = (stat.breakdown[0] || {}).label || '';
            document.getElementById('edit-stat-breakdown1-value-input').value = (stat.breakdown[0] || {}).value || '';
            document.getElementById('edit-stat-breakdown2-label-input').value = (stat.breakdown[1] || {}).label || '';
            document.getElementById('edit-stat-breakdown2-value-input').value = (stat.breakdown[1] || {}).value || '';
            openModalEl('edit-stat-modal', 'edit-stat-modal-box');
        }
        function closeEditStatModal() { closeModalEl('edit-stat-modal', 'edit-stat-modal-box'); editingStatId = null; }
        function saveEditStat(event) {
            event.preventDefault();
            const stat = villageDb.homeContent.stats.find(s => s.id === editingStatId);
            if (!stat) return;
            stat.label = document.getElementById('edit-stat-label-input').value.trim();
            stat.icon = document.getElementById('edit-stat-icon-input').value.trim();
            stat.value = document.getElementById('edit-stat-value-input').value.trim();
            stat.unit = document.getElementById('edit-stat-unit-input').value.trim();
            stat.breakdown = [
                { label: document.getElementById('edit-stat-breakdown1-label-input').value.trim(), value: document.getElementById('edit-stat-breakdown1-value-input').value.trim() },
                { label: document.getElementById('edit-stat-breakdown2-label-input').value.trim(), value: document.getElementById('edit-stat-breakdown2-value-input').value.trim() }
            ];
            saveDatabase();
            addLog("Cập nhật trang chủ", `Admin cập nhật số liệu thống kê "${stat.label}".`, "Admin");
            showCustomAlert('success', 'Đã lưu', `Đã cập nhật số liệu "${stat.label}".`);
            closeEditStatModal();
            renderAdminHomeContent();
        }

        // --- News ---
        let editingNewsId = null;
        function openNewsFormModal(id) {
            const news = id ? villageDb.homeContent.news.find(n => n.id === id) : null;
            if (news && !canManageNewsItem(news)) {
                showCustomAlert('error', 'Không có quyền', `Chỉ ${news.createdBy || 'Admin'} hoặc Admin mới có thể sửa tin này.`);
                return;
            }
            editingNewsId = id;
            document.getElementById('news-form-title').innerText = id ? 'Sửa tin tức' : 'Thêm tin tức mới';
            document.getElementById('news-form-category-input').value = news ? news.categorySlug : NEWS_CATEGORIES[0].slug;
            document.getElementById('news-form-date-input').value = news ? dmyToIso(news.date) : '';
            document.getElementById('news-form-title-input').value = news ? news.title : '';
            document.getElementById('news-form-summary-input').value = news ? news.summary : '';
            document.getElementById('news-form-content-input').value = news ? news.content : '';
            openModalEl('news-form-modal', 'news-form-modal-box');
        }
        function closeNewsFormModal() { closeModalEl('news-form-modal', 'news-form-modal-box'); editingNewsId = null; }
        function saveNewsForm(event) {
            event.preventDefault();
            const categorySlug = document.getElementById('news-form-category-input').value;
            const cat = NEWS_CATEGORIES.find(c => c.slug === categorySlug);
            const date = isoToDmy(document.getElementById('news-form-date-input').value);
            const title = document.getElementById('news-form-title-input').value.trim();
            const summary = document.getElementById('news-form-summary-input').value.trim();
            const content = document.getElementById('news-form-content-input').value.trim();

            if (!date || !title || !summary || !content) {
                showCustomAlert('error', 'Thiếu thông tin', 'Vui lòng nhập đầy đủ Ngày, Tiêu đề, Tóm tắt và Nội dung.');
                return;
            }

            if (editingNewsId) {
                const news = villageDb.homeContent.news.find(n => n.id === editingNewsId);
                Object.assign(news, { categorySlug: cat.slug, category: cat.label, colorClass: cat.colorClass, date, title, summary, content });
            } else {
                villageDb.homeContent.news.unshift({ id: `NEWS-${Math.floor(1000 + Math.random()*9000)}`, categorySlug: cat.slug, category: cat.label, colorClass: cat.colorClass, date, title, summary, content, createdBy: currentUser.name });
            }

            saveDatabase();
            addLog("Cập nhật tin tức", `${currentUser.name} ${editingNewsId ? 'sửa' : 'thêm'} tin tức "${title}".`, currentUser.name);
            showCustomAlert('success', 'Đã lưu', `Đã ${editingNewsId ? 'cập nhật' : 'thêm'} tin tức "${title}".`);
            closeNewsFormModal();
            rerenderNewsAfterChange();
        }
        function deleteHomeNews(id) {
            const target = villageDb.homeContent.news.find(n => n.id === id);
            if (target && !canManageNewsItem(target)) {
                showCustomAlert('error', 'Không có quyền', `Chỉ ${target.createdBy || 'Admin'} hoặc Admin mới có thể xóa tin này.`);
                return;
            }
            if (homeContentItemToDelete !== id) {
                homeContentItemToDelete = id;
                showCustomAlert('info', 'Xác nhận xóa', 'Nhấn "Xác nhận?" một lần nữa để xóa tin tức này.');
                rerenderNewsAfterChange();
                return;
            }
            const news = villageDb.homeContent.news.find(n => n.id === id);
            villageDb.homeContent.news = villageDb.homeContent.news.filter(n => n.id !== id);
            homeContentItemToDelete = null;
            saveDatabase();
            addLog("Cập nhật tin tức", `${currentUser.name} xóa tin tức "${news.title}".`, currentUser.name);
            showCustomAlert('info', 'Đã xóa', `Đã xóa tin tức "${news.title}".`);
            rerenderNewsAfterChange();
        }
        // News CRUD is shared between Admin's "Quản lý Trang chủ" page and the
        // standalone "Tin tức & Thông báo" tab (Cán bộ Hội/Trưởng thôn/Tổ ANTT),
        // so re-render whichever one is actually on screen.
        function rerenderNewsAfterChange() {
            if (activeTab === 'tin-tức') renderNewsManagement();
            else renderAdminHomeContent();
        }

        // --- Products ---
        let editingProductId = null;
        function openProductFormModal(id) {
            editingProductId = id;
            const p = id ? villageDb.homeContent.products.find(x => x.id === id) : null;
            document.getElementById('product-form-title').innerText = id ? 'Sửa nông sản' : 'Thêm nông sản mới';
            document.getElementById('product-form-name-input').value = p ? p.name : '';
            document.getElementById('product-form-badge-input').value = p ? p.badge : '';
            document.getElementById('product-form-image-input').value = p ? p.image : '';
            document.getElementById('product-form-desc-input').value = p ? p.desc : '';
            document.getElementById('product-form-footer-label-input').value = p ? p.footerLabel : '';
            document.getElementById('product-form-footer-value-input').value = p ? p.footerValue : '';
            openModalEl('product-form-modal', 'product-form-modal-box');
        }
        function closeProductFormModal() { closeModalEl('product-form-modal', 'product-form-modal-box'); editingProductId = null; }
        function saveProductForm(event) {
            event.preventDefault();
            const name = document.getElementById('product-form-name-input').value.trim();
            const badge = document.getElementById('product-form-badge-input').value.trim();
            const image = document.getElementById('product-form-image-input').value.trim();
            const desc = document.getElementById('product-form-desc-input').value.trim();
            const footerLabel = document.getElementById('product-form-footer-label-input').value.trim();
            const footerValue = document.getElementById('product-form-footer-value-input').value.trim();

            if (!name || !desc) {
                showCustomAlert('error', 'Thiếu thông tin', 'Vui lòng nhập ít nhất Tên nông sản và Mô tả.');
                return;
            }

            if (editingProductId) {
                const p = villageDb.homeContent.products.find(x => x.id === editingProductId);
                Object.assign(p, { name, badge, image, desc, footerLabel, footerValue });
            } else {
                villageDb.homeContent.products.push({ id: `PRD-${Math.floor(1000 + Math.random()*9000)}`, name, badge, image, desc, footerLabel, footerValue });
            }

            saveDatabase();
            addLog("Cập nhật trang chủ", `Admin ${editingProductId ? 'sửa' : 'thêm'} nông sản "${name}".`, "Admin");
            showCustomAlert('success', 'Đã lưu', `Đã ${editingProductId ? 'cập nhật' : 'thêm'} nông sản "${name}".`);
            closeProductFormModal();
            renderAdminHomeContent();
        }
        function deleteHomeProduct(id) {
            if (homeContentItemToDelete !== id) {
                homeContentItemToDelete = id;
                showCustomAlert('info', 'Xác nhận xóa', 'Nhấn "Xác nhận?" một lần nữa để xóa nông sản này.');
                renderAdminHomeContent();
                return;
            }
            const p = villageDb.homeContent.products.find(x => x.id === id);
            villageDb.homeContent.products = villageDb.homeContent.products.filter(x => x.id !== id);
            homeContentItemToDelete = null;
            saveDatabase();
            addLog("Cập nhật trang chủ", `Admin xóa nông sản "${p.name}".`, "Admin");
            showCustomAlert('info', 'Đã xóa', `Đã xóa nông sản "${p.name}".`);
            renderAdminHomeContent();
        }

        // --- Leadership: không còn CRUD riêng — xem/sửa "Chức vụ" trực tiếp
        // trên tài khoản của cư dân ở tab Quản lý Tài khoản (admin-accounts.js).

        // --- Security (hotline/slogan + members) ---
        function saveSecurityHotline(event) {
            event.preventDefault();
            const hotline = document.getElementById('security-hotline-input').value.trim();
            const slogan = document.getElementById('security-slogan-input').value.trim();
            if (!hotline) {
                showCustomAlert('error', 'Thiếu thông tin', 'Vui lòng nhập số điện thoại đường dây nóng.');
                return;
            }
            villageDb.homeContent.security.hotline = hotline;
            villageDb.homeContent.security.hotlineDisplay = hotline.replace(/(\d{4})(\d{3})(\d{3})/, '$1.$2.$3');
            villageDb.homeContent.security.slogan = slogan;
            saveDatabase();
            addLog("Cập nhật trang chủ", `Admin cập nhật đường dây nóng/khẩu hiệu Tổ An ninh.`, "Admin");
            showCustomAlert('success', 'Đã lưu', 'Đã cập nhật đường dây nóng và khẩu hiệu Tổ An ninh.');
            renderAdminHomeContent();
        }

        // Thành viên Tổ An ninh không còn CRUD riêng — xem/sửa vai trò "Tổ
        // ANTT" và chức danh (chucvu: Tổ Trưởng/Tổ Phó/Tổ Viên) trực tiếp trên
        // tài khoản của cư dân ở tab Quản lý Tài khoản (admin-accounts.js).

        // Shared modal open/close helper (scale-95 -> scale-100 transition
        // pattern used by every modal in this app).
        function openModalEl(modalId, boxId) {
            const modal = document.getElementById(modalId);
            const box = document.getElementById(boxId);
            modal.classList.remove('hidden');
            setTimeout(() => {
                box.classList.remove('scale-95');
                box.classList.add('scale-100');
            }, 10);
        }
        function closeModalEl(modalId, boxId) {
            const modal = document.getElementById(modalId);
            const box = document.getElementById(boxId);
            box.classList.add('scale-95');
            box.classList.remove('scale-100');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 150);
        }

        function renderAdminLogs() {
            const container = document.getElementById('tab-content-container');

            let rows = villageDb.auditLogs.map(log => `
                <tr class="hover:bg-stone-50 transition-colors text-[11px]">
                    <td class="p-3 text-stone-400 font-mono">${log.time}</td>
                    <td class="p-3"><span class="px-2 py-0.5 rounded bg-stone-50 text-stone-600 font-bold border border-stone-850">${log.action}</span></td>
                    <td class="p-3 text-stone-600 font-medium">${log.detail}</td>
                    <td class="p-3 text-stone-500 font-mono text-right">${log.actor}</td>
                </tr>
            `).join('');

            container.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                    <div>
                        <h4 class="font-serif text-lg font-bold text-stone-900">Nhật Ký Kiểm Toán Toàn Bộ Hệ Thống</h4>
                        <p class="text-xs text-stone-500">Ghi vết tự động mọi hành vi nhạy cảm để đối soát tuyệt đối khi phát sinh sự cố.</p>
                    </div>
                </div>

                <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50 text-left">
                    <table class="w-full text-left text-xs">
                        <thead>
                            <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                <th class="p-3 font-semibold">Thời điểm</th>
                                <th class="p-3 font-semibold">Hành động</th>
                                <th class="p-3 font-semibold">Diễn giải chi tiết</th>
                                <th class="p-3 font-semibold text-right">Người thực hiện</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-stone-200/40 text-stone-600">
                            ${rows}
                        </tbody>
                    </table>
                </div>
            `;
        }

        // -----------------------------------------------------------------------------------
        // 5. TỔ ANTT TABS RENDERERS & LOGIC
        // -----------------------------------------------------------------------------------
