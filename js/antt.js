        function renderAnttTinBao() {
            const container = document.getElementById('tab-content-container');
            const reports = [...villageDb.incidentReports].sort((a, b) => b.time.localeCompare(a.time));

            const rows = reports.map(r => {
                const head = villageDb.residents.find(rr => rr.familyId === r.familyId && rr.isHouseholder) || villageDb.residents.find(rr => rr.familyId === r.familyId);
                const locationLink = r.lat
                    ? `<a href="https://www.google.com/maps?q=${r.lat},${r.lng}" target="_blank" rel="noopener" class="text-primary-400 hover:underline"><i class="fa-solid fa-location-dot mr-1"></i>Xem bản đồ</a>`
                    : (r.locationText || '<span class="text-stone-600">Không có</span>');
                const actionBtn = r.status === 'Mới'
                    ? `<button onclick="markIncidentReportStatus('${r.id}', 'Đã tiếp nhận')" class="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white text-[10px] font-semibold">Tiếp nhận</button>`
                    : r.status === 'Đã tiếp nhận'
                        ? `<button onclick="markIncidentReportStatus('${r.id}', 'Đã xử lý')" class="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold">Đánh dấu đã xử lý</button>`
                        : `<span class="text-stone-600 text-[10px]">—</span>`;

                return `
                    <tr class="hover:bg-stone-50 transition-colors">
                        <td class="p-3">
                            <span class="font-bold text-stone-900 block">${head ? head.name : r.reporterName}</span>
                            <span class="text-[10px] text-stone-400 font-mono">${r.familyId}</span>
                        </td>
                        <td class="p-3 text-stone-600">${r.content}</td>
                        <td class="p-3 text-xs">${locationLink}</td>
                        <td class="p-3 font-mono text-stone-500 text-[11px]">${r.time}</td>
                        <td class="p-3 text-right">${actionBtn}</td>
                    </tr>
                `;
            }).join('') || '<tr><td colspan="5" class="p-4 text-center text-stone-400">Chưa có tin báo nào từ cư dân.</td></tr>';

            container.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                    <div>
                        <h4 class="font-serif text-lg font-bold text-stone-900">Tin Báo Từ Cư Dân</h4>
                        <p class="text-xs text-stone-500">Tiếp nhận và xử lý các tin báo an ninh trật tự gửi trực tiếp từ cư dân, kèm vị trí sự việc.</p>
                    </div>
                </div>

                <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50 text-left">
                    <table class="w-full text-left text-xs">
                        <thead>
                            <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                <th class="p-3 font-semibold">Hộ báo cáo</th>
                                <th class="p-3 font-semibold">Nội dung</th>
                                <th class="p-3 font-semibold">Vị trí</th>
                                <th class="p-3 font-semibold">Thời gian</th>
                                <th class="p-3 font-semibold text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-stone-200/40 text-stone-600">${rows}</tbody>
                    </table>
                </div>
            `;
        }

        function markIncidentReportStatus(id, status) {
            const report = villageDb.incidentReports.find(r => r.id === id);
            if (!report) return;
            report.status = status;
            saveDatabase();
            addLog("Xử lý tin báo ANTT", `${currentUser.name} cập nhật tin báo "${report.content}" sang trạng thái "${status}".`, currentUser.name);
            showCustomAlert('success', 'Đã cập nhật', `Tin báo đã chuyển sang trạng thái "${status}".`);
            renderAnttTinBao();
        }

        function renderAnttLuuTru() {
            const container = document.getElementById('tab-content-container');
            const requests = [...villageDb.residenceRegistrations].sort((a, b) => b.time.localeCompare(a.time));

            const statusBadge = (status) => {
                if (status === 'Đã duyệt') return `<span class="px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">Đã duyệt</span>`;
                if (status === 'Từ chối') return `<span class="px-2 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider">Từ chối</span>`;
                return `<span class="px-2 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider">Chờ duyệt</span>`;
            };

            const rows = requests.map(r => {
                const action = r.status === 'Chờ duyệt'
                    ? `<button onclick="decideResidenceRequest('${r.id}', 'Đã duyệt')" class="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold mr-1.5">Duyệt</button><button onclick="decideResidenceRequest('${r.id}', 'Từ chối')" class="px-2.5 py-1 rounded bg-stone-50 hover:bg-stone-100 text-stone-500 border border-stone-200 text-[10px] font-bold">Từ chối</button>`
                    : `<span class="text-stone-600 text-[10px]">—</span>`;

                return `
                    <tr class="hover:bg-stone-50 transition-colors">
                        <td class="p-3">
                            <span class="font-bold text-stone-900 block">${r.guestName}</span>
                            <span class="text-[10px] text-stone-400 font-mono">${r.guestCccd || 'Chưa có Căn Cước'}</span>
                        </td>
                        <td class="p-3 text-stone-600">${r.relationship}</td>
                        <td class="p-3">
                            <span class="text-stone-900 block">${r.hostName}</span>
                            <span class="text-[10px] text-stone-400 font-mono">${r.familyId}</span>
                        </td>
                        <td class="p-3 font-mono text-stone-500">${r.fromDate} → ${r.toDate}</td>
                        <td class="p-3 text-center">${statusBadge(r.status)}</td>
                        <td class="p-3 text-right whitespace-nowrap">${action}</td>
                    </tr>
                `;
            }).join('') || '<tr><td colspan="6" class="p-4 text-center text-stone-400">Chưa có đăng ký lưu trú nào.</td></tr>';

            container.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                    <div>
                        <h4 class="font-serif text-lg font-bold text-stone-900">Duyệt Đăng Ký Lưu Trú</h4>
                        <p class="text-xs text-stone-500">Xét duyệt đăng ký tạm trú cho khách/người thân do các hộ gia đình gửi lên.</p>
                    </div>
                </div>

                <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50 text-left">
                    <table class="w-full text-left text-xs">
                        <thead>
                            <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                <th class="p-3 font-semibold">Người lưu trú</th>
                                <th class="p-3 font-semibold">Quan hệ</th>
                                <th class="p-3 font-semibold">Hộ đăng ký</th>
                                <th class="p-3 font-semibold">Thời gian lưu trú</th>
                                <th class="p-3 font-semibold text-center">Trạng thái</th>
                                <th class="p-3 font-semibold text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-stone-200/40 text-stone-600">${rows}</tbody>
                    </table>
                </div>
            `;
        }

        function decideResidenceRequest(id, decision) {
            const req = villageDb.residenceRegistrations.find(r => r.id === id);
            if (!req) return;
            req.status = decision;
            req.decidedBy = currentUser.name;
            saveDatabase();
            addLog("Duyệt lưu trú", `${currentUser.name} ${decision === 'Đã duyệt' ? 'phê duyệt' : 'từ chối'} đăng ký lưu trú của ${req.guestName} (hộ ${req.familyId}).`, currentUser.name);
            showCustomAlert(decision === 'Đã duyệt' ? 'success' : 'info', 'Đã cập nhật', `Đăng ký lưu trú của ${req.guestName} đã được ${decision === 'Đã duyệt' ? 'phê duyệt' : 'từ chối'}.`);
            renderAnttLuuTru();
        }

        // Biên bản sự việc — an official incident record Tổ ANTT creates after
        // handling a situation; only visible on the ANTT screen (not shown to
        // residents), optionally linked back to the tin báo that triggered it.
        function renderAnttBienBan() {
            const container = document.getElementById('tab-content-container');
            const minutes = [...villageDb.incidentMinutes].sort((a, b) => b.time.localeCompare(a.time));

            const reportOptions = villageDb.incidentReports.map(r => `<option value="${r.id}">${r.content.slice(0, 40)} (${r.time})</option>`).join('');

            const rows = minutes.map(m => {
                const isConfirming = homeContentItemToDelete === m.id;
                const deleteBtn = isConfirming
                    ? `<button onclick="deleteIncidentMinutes('${m.id}')" class="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white border border-red-500 text-[10px] font-bold">Xác nhận?</button>`
                    : `<button onclick="deleteIncidentMinutes('${m.id}')" class="px-2.5 py-1 rounded bg-red-50 hover:bg-red-600 text-red-600 hover:text-white text-[10px] font-semibold"><i class="fa-solid fa-trash"></i> Xóa</button>`;
                return `
                    <tr class="hover:bg-stone-50 transition-colors">
                        <td class="p-3 font-semibold text-stone-900 align-top">${m.title}</td>
                        <td class="p-3 text-stone-600 align-top">${m.content}</td>
                        <td class="p-3 text-stone-500 align-top">${m.location || '-'}</td>
                        <td class="p-3 font-mono text-stone-500 text-[11px] align-top">${m.time}</td>
                        <td class="p-3 text-right align-top">${deleteBtn}</td>
                    </tr>
                `;
            }).join('') || '<tr><td colspan="5" class="p-4 text-center text-stone-400">Chưa có biên bản sự việc nào.</td></tr>';

            container.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                    <div>
                        <h4 class="font-serif text-lg font-bold text-stone-900">Biên Bản Sự Việc</h4>
                        <p class="text-xs text-stone-500">Lập biên bản chính thức sau khi xử lý sự việc an ninh trật tự. Chỉ Tổ ANTT xem được mục này.</p>
                    </div>
                </div>

                <div class="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-left space-y-4">
                    <h5 class="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                        <i class="fa-solid fa-file-signature text-primary-400"></i>
                        <span>Lập biên bản mới</span>
                    </h5>
                    <form onsubmit="createIncidentMinutes(event)" class="space-y-3">
                        <div class="space-y-1.5">
                            <label class="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">Liên kết tin báo (nếu có)</label>
                            <select id="minutes-related-report-input" class="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-xs outline-none focus:border-primary-500 transition-colors">
                                <option value="">Không liên kết tin báo nào</option>
                                ${reportOptions}
                            </select>
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">Tiêu đề biên bản</label>
                            <input type="text" id="minutes-title-input" required class="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-xs outline-none focus:border-primary-500 transition-colors">
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div class="space-y-1.5">
                                <label class="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">Địa điểm xảy ra</label>
                                <input type="text" id="minutes-location-input" class="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-xs outline-none focus:border-primary-500 transition-colors">
                            </div>
                            <div class="space-y-1.5">
                                <label class="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">Người liên quan</label>
                                <input type="text" id="minutes-involved-input" placeholder="Họ tên các bên liên quan" class="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-xs outline-none focus:border-primary-500 transition-colors">
                            </div>
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">Nội dung diễn biến sự việc</label>
                            <textarea id="minutes-content-input" rows="4" required class="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-sm outline-none focus:border-primary-500 transition-colors"></textarea>
                        </div>
                        <button type="submit" class="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-primary-950/50">Lập biên bản</button>
                    </form>
                </div>

                <div class="space-y-3 text-left">
                    <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Danh sách biên bản đã lập</span>
                    <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                    <th class="p-3 font-semibold">Tiêu đề</th>
                                    <th class="p-3 font-semibold">Nội dung</th>
                                    <th class="p-3 font-semibold">Địa điểm</th>
                                    <th class="p-3 font-semibold">Thời gian lập</th>
                                    <th class="p-3 font-semibold text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-stone-200/40 text-stone-600">${rows}</tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        function createIncidentMinutes(event) {
            event.preventDefault();
            const relatedReportId = document.getElementById('minutes-related-report-input').value || null;
            const title = document.getElementById('minutes-title-input').value.trim();
            const location = document.getElementById('minutes-location-input').value.trim();
            const involvedPeople = document.getElementById('minutes-involved-input').value.trim();
            const content = document.getElementById('minutes-content-input').value.trim();

            if (!title || !content) {
                showCustomAlert('error', 'Thiếu thông tin', 'Vui lòng nhập Tiêu đề và Nội dung diễn biến sự việc.');
                return;
            }

            const now = new Date();
            const timeStr = `${now.getDate().toString().padStart(2,'0')}/${(now.getMonth()+1).toString().padStart(2,'0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;

            villageDb.incidentMinutes.unshift({
                id: `BB-${Math.floor(1000 + Math.random()*9000)}`,
                relatedReportId, title, location, involvedPeople, content,
                createdBy: currentUser.name, time: timeStr
            });

            saveDatabase();
            addLog("Lập biên bản sự việc", `${currentUser.name} lập biên bản "${title}".`, currentUser.name);
            showCustomAlert('success', 'Đã lập biên bản', `Đã lưu biên bản sự việc "${title}".`);
            renderAnttBienBan();
        }

        function deleteIncidentMinutes(id) {
            if (homeContentItemToDelete !== id) {
                homeContentItemToDelete = id;
                showCustomAlert('info', 'Xác nhận xóa', 'Nhấn "Xác nhận?" một lần nữa để xóa biên bản này.');
                renderAnttBienBan();
                return;
            }
            const m = villageDb.incidentMinutes.find(x => x.id === id);
            villageDb.incidentMinutes = villageDb.incidentMinutes.filter(x => x.id !== id);
            homeContentItemToDelete = null;
            saveDatabase();
            addLog("Xóa biên bản sự việc", `${currentUser.name} xóa biên bản "${m.title}".`, currentUser.name);
            showCustomAlert('info', 'Đã xóa', `Đã xóa biên bản "${m.title}".`);
            renderAnttBienBan();
        }

        // Read-only full resident directory for Tổ ANTT (view only, no
        // edit/delete rights — that stays with Trưởng thôn/Admin).
        let anttSearchQuery = '';
        function filterAnttResidents(value) {
            anttSearchQuery = value;
            renderAnttDanCu();
        }

        function renderAnttDanCu() {
            const container = document.getElementById('tab-content-container');
            const query = anttSearchQuery.trim().toLowerCase();
            const filtered = !query ? villageDb.residents : villageDb.residents.filter(r =>
                [r.name, r.cccd, r.phone, r.familyId, r.group, r.association].some(field => (field || '').toLowerCase().includes(query))
            );

            const rows = filtered.map(r => `
                <tr class="hover:bg-stone-50 transition-colors">
                    <td class="p-3 font-bold text-stone-900">${r.name}</td>
                    <td class="p-3 text-stone-600">${r.relation || (r.isHouseholder ? 'Chủ hộ' : 'Thành viên')}</td>
                    <td class="p-3 font-mono text-stone-600">${r.dob}</td>
                    <td class="p-3 font-mono text-stone-500">${r.phone || 'Chưa có SĐT'}</td>
                    <td class="p-3 font-mono text-stone-400">${r.familyId}</td>
                    <td class="p-3 text-stone-600">${r.group}</td>
                    <td class="p-3 text-right"><button onclick="openViewLocationModal('${r.familyId}')" class="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white text-[10px] font-semibold transition-all"><i class="fa-solid fa-location-dot"></i> Vị trí</button></td>
                </tr>
            `).join('');

            container.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                    <div>
                        <h4 class="font-serif text-lg font-bold text-stone-900">Quản Lý Dân Cư (Chỉ xem)</h4>
                        <p class="text-xs text-stone-500">Tra cứu thông tin nhân khẩu toàn thôn phục vụ công tác an ninh trật tự. Không có quyền chỉnh sửa.</p>
                    </div>
                </div>

                <div class="space-y-3 text-left">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Danh bạ cư dân toàn Thôn Đoàn Kết (${filtered.length}/${villageDb.residents.length} nhân khẩu)</span>
                        <div class="relative w-full sm:w-64">
                            <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs"></i>
                            <input type="text" id="antt-search-input" value="${anttSearchQuery}" oninput="filterAnttResidents(this.value)" placeholder="Tìm theo tên, Căn Cước, SĐT, mã hộ..." class="w-full pl-8 pr-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs outline-none focus:border-primary-500 transition-colors">
                        </div>
                    </div>
                    <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                    <th class="p-3 font-semibold">Họ và Tên</th>
                                    <th class="p-3 font-semibold">Quan hệ với chủ hộ</th>
                                    <th class="p-3 font-semibold">Ngày sinh</th>
                                    <th class="p-3 font-semibold">Số điện thoại</th>
                                    <th class="p-3 font-semibold">Mã hộ</th>
                                    <th class="p-3 font-semibold">Địa bàn</th>
                                    <th class="p-3 font-semibold text-right">Vị trí</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-stone-200/40 text-stone-600">${rows}</tbody>
                        </table>
                    </div>
                </div>
            `;

            if (anttSearchQuery) {
                const input = document.getElementById('antt-search-input');
                if (input) {
                    input.focus();
                    input.setSelectionRange(input.value.length, input.value.length);
                }
            }
        }

        // Full roster of Tổ ANTT itself (not the whole village) — every account
        // with role "Tổ ANTT", enriched with Căn Cước/ngày sinh/địa bàn from the
        // linked resident record. Reuses getPublicSecurityRoster() (js/homepage.js)
        // for the name/chức danh/phone + Tổ Trưởng→Tổ Phó→Tổ Viên ordering, so
        // this stays in sync with the same account data the homepage shows.
        function renderAnttToDoi() {
            const container = document.getElementById('tab-content-container');
            const roster = getPublicSecurityRoster().map(m => {
                const res = villageDb.residents.find(r => r.name === m.name) || {};
                return { ...m, cccd: res.cccd || '', dob: res.dob || '', familyId: res.familyId || '', group: res.group || '' };
            });

            const titleBadge = (title) => title === 'Tổ Trưởng'
                ? `<span class="px-2 py-0.5 rounded bg-primary-600 text-white font-bold text-[10px]">${title}</span>`
                : title === 'Tổ Phó'
                    ? `<span class="px-2 py-0.5 rounded bg-primary-50 text-primary-700 font-bold text-[10px]">${title}</span>`
                    : `<span class="px-2 py-0.5 rounded bg-stone-100 text-stone-500 font-semibold text-[10px]">${title}</span>`;

            const rows = roster.map(m => `
                <tr class="hover:bg-stone-50 transition-colors">
                    <td class="p-3">
                        <span class="font-bold text-stone-900 block">${m.name}</span>
                        <span class="text-[10px] text-stone-400 font-mono">${m.familyId || '-'}</span>
                    </td>
                    <td class="p-3">${titleBadge(m.title)}</td>
                    <td class="p-3 font-mono text-stone-600">${m.cccd || 'Chưa cấp'}</td>
                    <td class="p-3 font-mono text-stone-600">${m.dob || '-'}</td>
                    <td class="p-3 font-mono text-stone-500">${m.phoneDisplay || 'Chưa có SĐT'}</td>
                    <td class="p-3 text-stone-600">${m.group || '-'}</td>
                    <td class="p-3 text-right">${m.familyId ? `<button onclick="openViewLocationModal('${m.familyId}')" class="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white text-[10px] font-semibold transition-all"><i class="fa-solid fa-location-dot"></i> Vị trí</button>` : ''}</td>
                </tr>
            `).join('') || '<tr><td colspan="7" class="p-4 text-center text-stone-400">Chưa có thành viên Tổ ANTT nào.</td></tr>';

            container.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                    <div>
                        <h4 class="font-serif text-lg font-bold text-stone-900">Thành Viên Tổ An Ninh Trật Tự</h4>
                        <p class="text-xs text-stone-500">Danh sách đầy đủ toàn bộ thành viên Tổ ANTT, kèm chức danh, Căn Cước, ngày sinh và số điện thoại liên hệ.</p>
                    </div>
                </div>
                <p class="text-[11px] text-stone-400 -mt-2">Thêm/sửa/xóa thành viên và chức danh (Tổ Trưởng/Tổ Phó/Tổ Viên) do Admin quản lý ở tab "Quản lý Tài khoản".</p>

                <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50 text-left">
                    <table class="w-full text-left text-xs">
                        <thead>
                            <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                <th class="p-3 font-semibold">Họ và Tên</th>
                                <th class="p-3 font-semibold">Chức danh</th>
                                <th class="p-3 font-semibold">Số Căn Cước</th>
                                <th class="p-3 font-semibold">Ngày sinh</th>
                                <th class="p-3 font-semibold">Số điện thoại</th>
                                <th class="p-3 font-semibold">Địa bàn</th>
                                <th class="p-3 font-semibold text-right">Vị trí</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-stone-200/40 text-stone-600">${rows}</tbody>
                    </table>
                </div>
            `;
        }

        // -----------------------------------------------------------------------------------
        // SHARED LANDING PAGE CONTENT (index.html) — driven by villageDb.homeContent so
        // Admin can manage it from "Quản lý Trang chủ" instead of it being hardcoded HTML.
        // -----------------------------------------------------------------------------------
