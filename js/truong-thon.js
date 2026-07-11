        let truongThonSearchQuery = '';
        function filterTruongThonResidents(value) {
            truongThonSearchQuery = value;
            renderTrưởngThônDashboard();
        }

        function renderTrưởngThônDashboard() {
            const container = document.getElementById('tab-content-container');

            const query = truongThonSearchQuery.trim().toLowerCase();
            const filteredResidents = !query ? villageDb.residents : villageDb.residents.filter(r =>
                [r.name, r.cccd, r.phone, r.familyId, r.group, r.association].some(field => (field || '').toLowerCase().includes(query))
            );

            let rows = filteredResidents.map(r => {
                const isPending = villageDb.deleteRequests.some(req => req.residentId === r.id && req.status === 'Chờ duyệt');
                const actionBtn = isPending
                    ? `<button type="button" disabled title="Đang chờ Admin phê duyệt" class="px-2 py-1 rounded bg-amber-50 text-amber-600 text-[10px] cursor-not-allowed opacity-90"><i class="fa-solid fa-spinner animate-spin"></i> Chờ duyệt</button>`
                    : `<button onclick="openRequestDeleteModal('${r.id}')" class="px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-600 hover:text-white text-[10px] transition-all">Yêu cầu xóa</button>`;

                return `
                    <tr class="hover:bg-stone-50 transition-colors">
                        <td class="p-3 font-bold text-stone-900">${r.name}</td>
                        <td class="p-3 text-stone-600">${r.relation || (r.isHouseholder ? 'Chủ hộ' : 'Thành viên')}</td>
                        <td class="p-3 font-mono text-stone-600">${r.dob}</td>
                        <td class="p-3 font-mono text-stone-500">${r.cccd}</td>
                        <td class="p-3 font-mono text-stone-500">${r.phone || 'Chưa có SĐT'}</td>
                        <td class="p-3 font-mono text-stone-400">${r.familyId}</td>
                        <td class="p-3 text-stone-600">${r.group}</td>
                        <td class="p-3 text-stone-500">${r.association === 'None' ? 'Không tham gia' : r.association}</td>
                        <td class="p-3 text-right space-x-2 whitespace-nowrap">
                            <button onclick="openViewLocationModal('${r.familyId}')" class="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white text-[10px] font-semibold transition-all"><i class="fa-solid fa-location-dot"></i> Vị trí</button>
                            <button onclick="openEditResidentModal('${r.id}')" class="px-2 py-1 rounded bg-stone-100 hover:bg-primary-600 text-stone-600 hover:text-white border border-stone-300 text-[10px] font-semibold transition-all"><i class="fa-solid fa-pen-to-square"></i> Sửa</button>
                            ${actionBtn}
                        </td>
                    </tr>
                `;
            }).join('');

            container.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                    <div>
                        <h4 class="font-serif text-lg font-bold text-stone-900">Quản lý Toàn Thôn & Đệ Trình Xóa Nhân Khẩu</h4>
                        <p class="text-xs text-stone-500">Giám sát tính toàn vẹn dữ liệu. Gửi đề xuất xóa nhân khẩu sai sót lên Admin.</p>
                    </div>
                </div>

                <!-- Citizen Directory with Request Delete -->
                <div class="space-y-3 text-left">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Danh bạ cư dân toàn Thôn Đoàn Kết (${filteredResidents.length}/${villageDb.residents.length} nhân khẩu)</span>
                        <div class="relative w-full sm:w-64">
                            <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs"></i>
                            <input type="text" id="truong-thon-search-input" value="${truongThonSearchQuery}" oninput="filterTruongThonResidents(this.value)" placeholder="Tìm theo tên, Căn Cước, SĐT, mã hộ..." class="w-full pl-8 pr-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs outline-none focus:border-primary-500 transition-colors">
                        </div>
                    </div>
                    <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                    <th class="p-3 font-semibold">Họ và Tên</th>
                                    <th class="p-3 font-semibold">Quan hệ với chủ hộ</th>
                                    <th class="p-3 font-semibold">Ngày sinh</th>
                                    <th class="p-3 font-semibold">Căn Cước</th>
                                    <th class="p-3 font-semibold">Số điện thoại</th>
                                    <th class="p-3 font-semibold">Mã hộ</th>
                                    <th class="p-3 font-semibold">Địa bàn</th>
                                    <th class="p-3 font-semibold">Khối đoàn thể</th>
                                    <th class="p-3 font-semibold text-right">Quản lý dữ liệu</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-stone-200/40 text-stone-600">
                                ${rows}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Submit Delete Form Modal Overlay (Simulated via overlay card inside tab) -->
                <div id="delete-request-modal" class="hidden p-5 rounded-2xl bg-stone-50 space-y-4 text-left">
                    <div class="flex items-center justify-between">
                        <h5 class="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                            <i class="fa-solid fa-triangle-exclamation text-red-500"></i>
                            <span>Đệ trình lý do xóa dữ liệu nhân khẩu</span>
                        </h5>
                        <button onclick="closeRequestDeleteModal()" class="text-stone-400 hover:text-stone-900"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <input type="hidden" id="delete-target-id">
                    <div class="space-y-2">
                        <p class="text-[11px] text-stone-500">Lưu ý: Dữ liệu sẽ không bị xóa ngay lập tức mà cần được duyệt bởi Admin hệ thống tối cao.</p>
                        <input type="text" id="delete-reason-input" placeholder="Nhập lý do chi tiết (VD: Khai tử, Chuyển khẩu vĩnh viễn...)" required class="w-full px-3 py-2 rounded-lg bg-white border border-stone-200 text-stone-900 text-xs outline-none focus:border-red-500">
                    </div>
                    <div class="flex justify-end gap-2">
                        <button onclick="closeRequestDeleteModal()" class="px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-600 text-xs">Hủy</button>
                        <button onclick="submitDeleteRequest()" class="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs text-center">Gửi yêu cầu duyệt</button>
                    </div>
                </div>
            `;

            if (truongThonSearchQuery) {
                const input = document.getElementById('truong-thon-search-input');
                if (input) {
                    input.focus();
                    input.setSelectionRange(input.value.length, input.value.length);
                }
            }
        }

        function openRequestDeleteModal(resId) {
            const el = document.getElementById('delete-request-modal');
            document.getElementById('delete-target-id').value = resId;
            el.classList.remove('hidden');
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        function closeRequestDeleteModal() {
            document.getElementById('delete-request-modal').classList.add('hidden');
        }

        function submitDeleteRequest() {
            const resId = document.getElementById('delete-target-id').value;
            const reason = document.getElementById('delete-reason-input').value.trim();

            if (!reason) {
                showCustomAlert('error', 'Yêu cầu lỗi', 'Vui lòng cung cấp lý do xóa chính đáng.');
                return;
            }

            const res = villageDb.residents.find(r => r.id === resId);
            const reqId = `REQ-${Math.floor(100 + Math.random()*900)}`;
            const now = new Date();
            const dateStr = `${now.getDate().toString().padStart(2,'0')}/${(now.getMonth()+1).toString().padStart(2,'0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;

            villageDb.deleteRequests.push({
                id: reqId,
                residentId: resId,
                residentName: res.name,
                reason,
                submittedBy: currentUser.name,
                status: "Chờ duyệt",
                time: dateStr
            });

            saveDatabase();
            addLog("Đệ trình xóa", `Trưởng thôn gửi yêu cầu xóa cư dân ${res.name} lý do: ${reason}`, currentUser.name);
            showCustomAlert('success', 'Đệ trình thành công', 'Yêu cầu duyệt xóa đã được gửi thành công đến Admin.');
            closeRequestDeleteModal();
            renderTrưởngThônDashboard();
        }

        // Trưởng thôn has direct "Xem/Sửa" rights on resident info (per
        // defaultPermissions), so edits here apply immediately — no Admin
        // approval needed, unlike the Cư dân/Cán bộ Hội request-based flow.
        let editingResidentId = null;

        function openEditResidentModal(resId) {
            const res = villageDb.residents.find(r => r.id === resId);
            if (!res) return;
            editingResidentId = resId;

            document.getElementById('edit-resident-name-input').value = res.name || '';
            document.getElementById('edit-resident-relation-input').value = res.relation || '';
            document.getElementById('edit-resident-dob-input').value = dmyToIso(res.dob);
            document.getElementById('edit-resident-cccd-input').value = res.cccd || '';
            document.getElementById('edit-resident-phone-input').value = res.phone || '';
            document.getElementById('edit-resident-father-input').value = res.fatherName || '';
            document.getElementById('edit-resident-mother-input').value = res.motherName || '';
            document.getElementById('edit-resident-group-input').value = res.group || 'Đoàn Kết cũ';
            document.getElementById('edit-resident-permanent-address-input').value = res.permanentAddress || '';
            document.getElementById('edit-resident-temporary-address-input').value = res.temporaryAddress || '';

            const modal = document.getElementById('edit-resident-modal');
            const box = document.getElementById('edit-resident-modal-box');
            modal.classList.remove('hidden');
            setTimeout(() => {
                box.classList.remove('scale-95');
                box.classList.add('scale-100');
            }, 10);
        }

        function closeEditResidentModal() {
            const modal = document.getElementById('edit-resident-modal');
            const box = document.getElementById('edit-resident-modal-box');
            box.classList.add('scale-95');
            box.classList.remove('scale-100');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 150);
            editingResidentId = null;
        }

        // Lets Trưởng thôn / Cán bộ Hội look up (and, while visiting in person,
        // update) a household's location — same house number + GPS data shown
        // on the resident's own "Thành viên Hộ & Vị trí GPS" tab.
        let viewingLocationFamilyId = null;

        function refreshViewLocationModal(familyId) {
            const head = villageDb.residents.find(r => r.familyId === familyId && r.isHouseholder)
                || villageDb.residents.find(r => r.familyId === familyId);
            if (!head) return;

            document.getElementById('view-location-family-id').innerText = familyId;
            document.getElementById('view-location-head-name').innerText = head.name;
            document.getElementById('view-location-house-number').innerText = villageDb.houseNumbers[familyId] || 'Chưa cập nhật';

            const coords = villageDb.gpsCoords[familyId];
            const mapsLink = document.getElementById('view-location-maps-link');
            if (mapsLink) {
                if (coords) {
                    mapsLink.href = `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
                    mapsLink.classList.remove('opacity-40', 'pointer-events-none');
                } else {
                    mapsLink.href = '#';
                    mapsLink.classList.add('opacity-40', 'pointer-events-none');
                }
            }
        }

        function openViewLocationModal(familyId) {
            viewingLocationFamilyId = familyId;
            refreshViewLocationModal(familyId);

            const modal = document.getElementById('view-location-modal');
            const box = document.getElementById('view-location-modal-box');
            modal.classList.remove('hidden');
            setTimeout(() => {
                box.classList.remove('scale-95');
                box.classList.add('scale-100');
            }, 10);
        }

        function updateViewedLocation() {
            if (!viewingLocationFamilyId) return;
            updateGpsForFamily(viewingLocationFamilyId, 'view-location-update-btn', () => refreshViewLocationModal(viewingLocationFamilyId));
        }

        function closeViewLocationModal() {
            const modal = document.getElementById('view-location-modal');
            const box = document.getElementById('view-location-modal-box');
            box.classList.add('scale-95');
            box.classList.remove('scale-100');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 150);
        }

        function saveEditResident(event) {
            event.preventDefault();
            if (!editingResidentId) return;

            const res = villageDb.residents.find(r => r.id === editingResidentId);
            res.name = document.getElementById('edit-resident-name-input').value.trim();
            res.relation = document.getElementById('edit-resident-relation-input').value.trim();
            res.dob = isoToDmy(document.getElementById('edit-resident-dob-input').value);
            res.cccd = document.getElementById('edit-resident-cccd-input').value.trim();
            res.phone = document.getElementById('edit-resident-phone-input').value.trim();
            res.fatherName = document.getElementById('edit-resident-father-input').value.trim();
            res.motherName = document.getElementById('edit-resident-mother-input').value.trim();
            res.group = document.getElementById('edit-resident-group-input').value;
            res.permanentAddress = document.getElementById('edit-resident-permanent-address-input').value.trim();
            res.temporaryAddress = document.getElementById('edit-resident-temporary-address-input').value.trim();

            saveDatabase();
            addLog("Sửa thông tin nhân khẩu", `Trưởng thôn cập nhật trực tiếp thông tin của ${res.name}.`, currentUser.name);
            showCustomAlert('success', 'Đã lưu', `Đã cập nhật thông tin của ${res.name}.`);
            closeEditResidentModal();
            renderTrưởngThônDashboard();
        }

        // Trưởng thôn manages the village-wide fund directly (Thu/Chi ledger +
        // list of households that haven't paid), distinct from association funds.
        let truongThonFundView = 'thu';
        function switchTruongThonFundView(view) {
            truongThonFundView = view;
            renderTruongThonVillageFund();
        }

        // Deletes a mistakenly-entered Thu/Chi transaction (click once to arm,
        // click again on "Xác nhận xóa?" to actually remove it).
        let villageFundTxToDelete = null;
        function deleteVillageFundTransaction(txId) {
            if (villageFundTxToDelete !== txId) {
                villageFundTxToDelete = txId;
                showCustomAlert('info', 'Xác nhận xóa', 'Nhấn "Xác nhận xóa?" một lần nữa trên giao dịch này để xóa.');
                renderTruongThonVillageFund();
                return;
            }

            const list = truongThonFundView === 'thu' ? villageDb.villageFund.thu : villageDb.villageFund.chi;
            const tx = list.find(t => t.id === txId);
            if (!tx) return;

            const label = truongThonFundView === 'thu' ? (tx.household || tx.desc) : tx.desc;
            if (truongThonFundView === 'thu') {
                villageDb.villageFund.thu = villageDb.villageFund.thu.filter(t => t.id !== txId);
            } else {
                villageDb.villageFund.chi = villageDb.villageFund.chi.filter(t => t.id !== txId);
            }
            villageFundTxToDelete = null;
            saveDatabase();

            addLog("Xóa giao dịch quỹ thôn", `Trưởng thôn xóa khoản ${truongThonFundView === 'thu' ? 'Thu' : 'Chi'} "${label}" (${tx.amount.toLocaleString('vi-VN')} đ) do nhập sai.`, currentUser.name);
            showCustomAlert('info', 'Đã xóa', `Đã xóa giao dịch "${label}" khỏi sổ sách quỹ thôn.`);
            renderTruongThonVillageFund();
        }

        function setVillageFundTxType(type) {
            document.getElementById('vf-tx-type').value = type;
            document.getElementById('vf-thu-fields').classList.toggle('hidden', type !== 'Thu');
            document.getElementById('vf-chi-fields').classList.toggle('hidden', type !== 'Chi');

            const activeClass = "px-4 py-1 rounded text-xs font-bold uppercase transition-all bg-primary-600 text-white";
            const inactiveClass = "px-4 py-1 rounded text-xs font-bold uppercase transition-all text-stone-500 hover:text-stone-900";
            document.getElementById('vf-tx-type-btn-Thu').className = type === 'Thu' ? activeClass : inactiveClass;
            document.getElementById('vf-tx-type-btn-Chi').className = type === 'Chi' ? activeClass : inactiveClass;
        }

        function updateVillageFundThuTotal() {
            const checkboxes = document.querySelectorAll('.vf-tx-obligation-checkbox:checked');
            let total = 0;
            checkboxes.forEach(cb => { total += parseInt(cb.dataset.amount); });
            const display = document.getElementById('vf-tx-thu-total-display');
            if (display) display.innerText = `${total.toLocaleString('vi-VN')} đ`;
        }

        function addVillageFundTransaction(e) {
            e.preventDefault();
            const type = document.getElementById('vf-tx-type').value;

            let desc, household, amount;
            if (type === 'Thu') {
                household = document.getElementById('vf-tx-household').value.trim();
                const isValidHousehold = villageDb.residents.some(r => r.isHouseholder && r.name === household);
                if (!household || !isValidHousehold) {
                    showCustomAlert('error', 'Lỗi giao dịch', 'Vui lòng chọn một chủ hộ hợp lệ từ danh sách gợi ý.');
                    return;
                }

                const checkedBoxes = [...document.querySelectorAll('.vf-tx-obligation-checkbox:checked')];
                if (!checkedBoxes.length) {
                    showCustomAlert('error', 'Lỗi giao dịch', 'Vui lòng chọn ít nhất một khoản thu.');
                    return;
                }

                amount = checkedBoxes.reduce((sum, cb) => sum + parseInt(cb.dataset.amount), 0);
                const obligationNames = checkedBoxes.map(cb => cb.dataset.name);
                desc = `Hộ ${household} đóng góp: ${obligationNames.join(', ')}`;
            } else {
                desc = document.getElementById('vf-tx-desc').value.trim();
                amount = parseInt(document.getElementById('vf-tx-amount').value);
                if (!desc) {
                    showCustomAlert('error', 'Lỗi giao dịch', 'Vui lòng nhập nội dung chi.');
                    return;
                }
                if (!amount || amount <= 0) {
                    showCustomAlert('error', 'Lỗi giao dịch', 'Số tiền phải lớn hơn 0.');
                    return;
                }
            }

            const now = new Date();
            const dateStr = `${now.getDate().toString().padStart(2,'0')}/${(now.getMonth()+1).toString().padStart(2,'0')}/${now.getFullYear()}`;
            const txId = `${type === 'Thu' ? 'VT' : 'VC'}-${Math.floor(100 + Math.random()*900)}`;
            const tx = { id: txId, desc, amount, date: dateStr };
            if (type === 'Thu') tx.household = household;

            if (type === 'Thu') villageDb.villageFund.thu.unshift(tx);
            else villageDb.villageFund.chi.unshift(tx);
            saveDatabase();

            addLog("Giao dịch quỹ thôn", `Trưởng thôn ghi nhận khoản ${type} "${desc}" số tiền ${amount.toLocaleString('vi-VN')} đ vào quỹ thôn.`, currentUser.name);
            showCustomAlert('success', 'Ghi nhận thành công', 'Đã cập nhật sổ sách quỹ thôn.');
            truongThonFundView = type === 'Thu' ? 'thu' : 'chi';
            renderTruongThonVillageFund();
        }

        // Fund obligations are the "khoản thu" line items (e.g. "Quỹ Nông thôn mới
        // 2026") Trưởng thôn defines; each one is applied to every household as a
        // "Chưa đóng" entry in villageDb.funds[familyId], so residents see exactly
        // which obligations they owe in their own Quỹ Thôn tab and can pay them.
        function createFundObligation(e) {
            e.preventDefault();
            const name = document.getElementById('fund-ob-name-input').value.trim();
            const amount = parseInt(document.getElementById('fund-ob-amount-input').value);
            const period = yearToPeriodLabel(document.getElementById('fund-ob-period-input').value);

            if (!name) {
                showCustomAlert('error', 'Lỗi tạo khoản thu', 'Vui lòng nhập tên khoản thu.');
                return;
            }
            if (!amount || amount <= 0) {
                showCustomAlert('error', 'Lỗi tạo khoản thu', 'Số tiền phải lớn hơn 0.');
                return;
            }

            const obId = `OB-${Math.floor(100 + Math.random()*900)}`;
            villageDb.fundObligations.push({ id: obId, name, amount, period });

            const familyIds = [...new Set(villageDb.residents.map(r => r.familyId))];
            familyIds.forEach(fid => {
                if (!villageDb.funds[fid]) villageDb.funds[fid] = [];
                villageDb.funds[fid].push({
                    id: obId, name, period, amount, status: "Chưa đóng", date: "-",
                    memo: `DONG_GOP_${fid}_${obId}`
                });
            });

            saveDatabase();
            addLog("Tạo khoản thu quỹ thôn", `Trưởng thôn tạo khoản thu "${name}" (${amount.toLocaleString('vi-VN')} đ/hộ) áp dụng cho toàn bộ ${familyIds.length} hộ.`, currentUser.name);
            showCustomAlert('success', 'Tạo khoản thu thành công', `Đã áp dụng khoản thu "${name}" cho toàn bộ ${familyIds.length} hộ gia đình trong thôn.`);
            renderTruongThonVillageFund();
        }

        let editingFundObligationId = null;
        function openEditFundObligationModal(id) {
            const ob = villageDb.fundObligations.find(o => o.id === id);
            if (!ob) return;
            editingFundObligationId = id;
            document.getElementById('edit-fund-ob-name-input').value = ob.name;
            document.getElementById('edit-fund-ob-period-input').innerHTML = buildYearSelectOptions(periodToYear(ob.period));
            document.getElementById('edit-fund-ob-amount-input').value = ob.amount;
            openModalEl('edit-fund-ob-modal', 'edit-fund-ob-modal-box');
        }
        function closeEditFundObligationModal() { closeModalEl('edit-fund-ob-modal', 'edit-fund-ob-modal-box'); editingFundObligationId = null; }
        function saveEditFundObligation(event) {
            event.preventDefault();
            const ob = villageDb.fundObligations.find(o => o.id === editingFundObligationId);
            if (!ob) return;

            const name = document.getElementById('edit-fund-ob-name-input').value.trim();
            const period = yearToPeriodLabel(document.getElementById('edit-fund-ob-period-input').value);
            const amount = parseInt(document.getElementById('edit-fund-ob-amount-input').value);

            if (!name) {
                showCustomAlert('error', 'Lỗi cập nhật', 'Vui lòng nhập tên khoản thu.');
                return;
            }
            if (!amount || amount <= 0) {
                showCustomAlert('error', 'Lỗi cập nhật', 'Số tiền phải lớn hơn 0.');
                return;
            }

            ob.name = name;
            ob.period = period;
            ob.amount = amount;

            // Keep every household's still-unpaid entry for this obligation in
            // sync; entries already marked "Đã đóng" stay untouched as history.
            Object.keys(villageDb.funds).forEach(fid => {
                const entry = (villageDb.funds[fid] || []).find(f => f.id === ob.id && f.status !== "Đã đóng");
                if (entry) { entry.name = name; entry.period = period; entry.amount = amount; }
            });

            saveDatabase();
            addLog("Sửa khoản thu quỹ thôn", `Trưởng thôn cập nhật khoản thu "${name}".`, currentUser.name);
            showCustomAlert('success', 'Đã lưu', `Đã cập nhật khoản thu "${name}".`);
            closeEditFundObligationModal();
            renderTruongThonVillageFund();
        }
        function deleteFundObligation(id) {
            if (homeContentItemToDelete !== id) {
                homeContentItemToDelete = id;
                showCustomAlert('info', 'Xác nhận xóa', 'Nhấn "Xác nhận?" một lần nữa để xóa khoản thu này.');
                renderTruongThonVillageFund();
                return;
            }
            const ob = villageDb.fundObligations.find(o => o.id === id);
            if (!ob) return;

            villageDb.fundObligations = villageDb.fundObligations.filter(o => o.id !== id);
            Object.keys(villageDb.funds).forEach(fid => {
                villageDb.funds[fid] = (villageDb.funds[fid] || []).filter(f => f.id !== id);
            });
            homeContentItemToDelete = null;

            saveDatabase();
            addLog("Xóa khoản thu quỹ thôn", `Trưởng thôn xóa khoản thu "${ob.name}" khỏi toàn bộ hộ gia đình.`, currentUser.name);
            showCustomAlert('info', 'Đã xóa', `Đã xóa khoản thu "${ob.name}".`);
            renderTruongThonVillageFund();
        }

        function saveVillageFundBankInfo(event) {
            event.preventDefault();
            const bankName = document.getElementById('vf-bank-name-input').value.trim();
            const accountNumber = document.getElementById('vf-bank-account-input').value.trim();
            const accountHolder = document.getElementById('vf-bank-holder-input').value.trim();

            if (!bankName || !accountNumber || !accountHolder) {
                showCustomAlert('error', 'Thiếu thông tin', 'Vui lòng nhập đầy đủ Ngân hàng, Số tài khoản và Chủ tài khoản.');
                return;
            }

            villageDb.villageFund.bankInfo = { bankName, accountNumber, accountHolder };
            saveDatabase();
            addLog("Cập nhật tài khoản ngân hàng", `Trưởng thôn cập nhật thông tin tài khoản ngân hàng nhận chuyển khoản quỹ thôn.`, currentUser.name);
            showCustomAlert('success', 'Đã lưu', 'Đã cập nhật thông tin tài khoản ngân hàng của quỹ thôn.');
            renderTruongThonVillageFund();
        }

        // A resident's "Tôi đã chuyển khoản thành công" click only marks the fund
        // obligation "Chờ duyệt" (pending); Trưởng thôn must approve it here
        // before it counts as paid and lands in the public Thu ledger — this
        // prevents residents from self-marking dues as paid without any check.
        function approveResidentFundPayment(familyId, fundIdx) {
            const fund = villageDb.funds[familyId][fundIdx];
            if (!fund || fund.status !== "Chờ duyệt") return;

            fund.status = "Đã đóng";

            const head = villageDb.residents.find(r => r.familyId === familyId && r.isHouseholder) || villageDb.residents.find(r => r.familyId === familyId);
            const headName = head ? head.name : familyId;
            villageDb.villageFund.thu.unshift({
                id: `VT-${Math.floor(100 + Math.random()*900)}`,
                household: headName,
                desc: `Hộ ${headName} đóng góp: ${fund.name}`,
                amount: fund.amount,
                date: fund.date
            });

            saveDatabase();
            addLog("Duyệt thanh toán quỹ thôn", `Trưởng thôn duyệt xác nhận chuyển khoản ${fund.amount.toLocaleString('vi-VN')} đ của hộ ${headName} cho quỹ ${fund.name}.`, currentUser.name);
            showCustomAlert('success', 'Đã duyệt', `Đã xác nhận khoản đóng góp "${fund.name}" của hộ ${headName}.`);
            renderTruongThonVillageFund();
        }

        function rejectResidentFundPayment(familyId, fundIdx) {
            const fund = villageDb.funds[familyId][fundIdx];
            if (!fund || fund.status !== "Chờ duyệt") return;

            const head = villageDb.residents.find(r => r.familyId === familyId && r.isHouseholder) || villageDb.residents.find(r => r.familyId === familyId);
            const headName = head ? head.name : familyId;
            fund.status = "Chưa đóng";
            fund.date = "-";

            saveDatabase();
            addLog("Từ chối thanh toán quỹ thôn", `Trưởng thôn từ chối xác nhận chuyển khoản của hộ ${headName} cho quỹ ${fund.name}.`, currentUser.name);
            showCustomAlert('info', 'Đã từ chối', `Đã từ chối xác nhận chuyển khoản của hộ ${headName}, hộ cần chuyển khoản và xác nhận lại.`);
            renderTruongThonVillageFund();
        }

        function renderTruongThonVillageFund() {
            const container = document.getElementById('tab-content-container');
            const vf = villageDb.villageFund;
            const thuTotal = vf.thu.reduce((sum, t) => sum + t.amount, 0);
            const chiTotal = vf.chi.reduce((sum, t) => sum + t.amount, 0);

            const householdHeads = villageDb.residents.filter(r => r.isHouseholder);
            const householdDatalistOptions = householdHeads.map(r => `<option value="${r.name}">${r.familyId}</option>`).join('');

            const currentFundObligations = villageDb.fundObligations.filter(o => isObligationCurrentCycle(o.period));
            const totalObligation = currentFundObligations.reduce((sum, o) => sum + o.amount, 0);
            const obligationRows = currentFundObligations.map(o => {
                const isConfirming = homeContentItemToDelete === o.id;
                const deleteBtn = isConfirming
                    ? `<button onclick="deleteFundObligation('${o.id}')" class="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white border border-red-500 text-[10px] font-bold"><i class="fa-solid fa-triangle-exclamation"></i> Xác nhận?</button>`
                    : `<button onclick="deleteFundObligation('${o.id}')" class="px-2.5 py-1 rounded bg-red-50 hover:bg-red-600 text-red-600 hover:text-white text-[10px] font-semibold"><i class="fa-solid fa-trash"></i> Xóa</button>`;
                return `
                    <tr class="hover:bg-stone-50 transition-colors">
                        <td class="p-3 font-semibold text-stone-900">${o.name}</td>
                        <td class="p-3 text-stone-600">${o.period}</td>
                        <td class="p-3 text-right font-mono font-bold text-primary-400">${o.amount.toLocaleString('vi-VN')} đ</td>
                        <td class="p-3 text-right space-x-2 whitespace-nowrap">
                            <button onclick="openEditFundObligationModal('${o.id}')" class="px-2.5 py-1 rounded bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-850 text-[10px]"><i class="fa-solid fa-pen-to-square mr-1"></i> Sửa</button>
                            ${deleteBtn}
                        </td>
                    </tr>
                `;
            }).join('') || '<tr><td colspan="4" class="p-4 text-center text-stone-400">Chưa có khoản thu nào.</td></tr>';

            const ledger = truongThonFundView === 'thu' ? vf.thu : vf.chi;
            const ledgerRows = ledger.map(t => {
                const isConfirmingDelete = villageFundTxToDelete === t.id;
                const deleteBtn = isConfirmingDelete
                    ? `<button onclick="deleteVillageFundTransaction('${t.id}')" class="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white border border-red-500 text-[10px] font-bold"><i class="fa-solid fa-triangle-exclamation"></i> Xác nhận xóa?</button>`
                    : `<button onclick="deleteVillageFundTransaction('${t.id}')" class="px-2.5 py-1 rounded bg-red-50 hover:bg-red-600 text-red-600 hover:text-white text-[10px] font-semibold"><i class="fa-solid fa-trash"></i> Xóa</button>`;

                return `
                    <tr class="hover:bg-stone-50 transition-colors">
                        <td class="p-3 font-semibold text-stone-900">${truongThonFundView === 'thu' ? (t.household || t.desc) : t.desc}</td>
                        <td class="p-3 text-right font-mono font-bold ${truongThonFundView === 'thu' ? 'text-emerald-600' : 'text-red-600'}">${truongThonFundView === 'thu' ? '+' : '-'}${t.amount.toLocaleString('vi-VN')} đ</td>
                        <td class="p-3 text-right">${deleteBtn}</td>
                    </tr>
                `;
            }).join('') || '<tr><td colspan="3" class="p-4 text-center text-stone-400">Chưa có dữ liệu.</td></tr>';

            const pendingPayments = [];
            Object.keys(villageDb.funds).forEach(fid => {
                (villageDb.funds[fid] || []).forEach((f, idx) => {
                    if (f.status === "Chờ duyệt") {
                        const head = villageDb.residents.find(r => r.familyId === fid && r.isHouseholder) || villageDb.residents.find(r => r.familyId === fid);
                        pendingPayments.push({ familyId: fid, fundIdx: idx, fund: f, headName: head ? head.name : fid });
                    }
                });
            });
            const pendingPaymentRows = pendingPayments.map(p => `
                <tr class="hover:bg-stone-50 transition-colors">
                    <td class="p-3">
                        <span class="font-bold text-stone-900 block">${p.headName}</span>
                        <span class="text-[10px] text-stone-400 font-mono">${p.familyId}</span>
                    </td>
                    <td class="p-3 text-stone-600">${p.fund.name}</td>
                    <td class="p-3 text-right font-mono font-bold text-blue-600">${p.fund.amount.toLocaleString('vi-VN')} đ</td>
                    <td class="p-3 font-mono text-stone-500 text-[11px]">${p.fund.date}</td>
                    <td class="p-3 text-right whitespace-nowrap space-x-1.5">
                        <button onclick="approveResidentFundPayment('${p.familyId}', ${p.fundIdx})" class="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold">Duyệt</button>
                        <button onclick="rejectResidentFundPayment('${p.familyId}', ${p.fundIdx})" class="px-2.5 py-1 rounded bg-stone-50 hover:bg-stone-100 text-stone-500 border border-stone-200 text-[10px] font-bold">Từ chối</button>
                    </td>
                </tr>
            `).join('') || '<tr><td colspan="5" class="p-4 text-center text-stone-400">Không có xác nhận chuyển khoản nào đang chờ duyệt.</td></tr>';

            const unpaidRows = (vf.unpaidHouseholdsList || []).map(h => `
                <tr class="hover:bg-stone-50 transition-colors">
                    <td class="p-3 font-mono text-stone-500">${h.familyId}</td>
                    <td class="p-3 font-semibold text-stone-900">${h.representative}</td>
                    <td class="p-3 font-mono text-stone-500">${h.dob || 'Chưa cập nhật'}</td>
                    <td class="p-3 text-stone-600">${h.group}</td>
                    <td class="p-3 text-right font-mono font-bold text-amber-600">${(h.unpaidAmount || 0).toLocaleString('vi-VN')} đ</td>
                </tr>
            `).join('');

            container.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                    <div>
                        <h4 class="font-serif text-lg font-bold text-stone-900">Quản lý Quỹ Thôn</h4>
                        <p class="text-xs text-stone-500">Ghi nhận và công khai thu chi quỹ thôn toàn xã với người dân.</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                    <div class="p-4 rounded-xl bg-stone-50 border border-stone-200">
                        <span class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">Tổng thu</span>
                        <span class="text-lg font-bold text-stone-900 block mt-1">${thuTotal.toLocaleString('vi-VN')} đ</span>
                    </div>
                    <div class="p-4 rounded-xl bg-stone-50 border border-stone-200">
                        <span class="text-[10px] font-bold text-red-600 uppercase tracking-widest block">Tổng chi</span>
                        <span class="text-lg font-bold text-stone-900 block mt-1">${chiTotal.toLocaleString('vi-VN')} đ</span>
                    </div>
                    <div class="p-4 rounded-xl bg-stone-50 border border-stone-200">
                        <span class="text-[10px] font-bold text-primary-400 uppercase tracking-widest block">Số dư hiện tại</span>
                        <span class="text-lg font-bold text-stone-900 block mt-1">${(thuTotal - chiTotal).toLocaleString('vi-VN')} đ</span>
                    </div>
                </div>

                <div class="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3 text-left">
                    <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Thông tin tài khoản ngân hàng nhận chuyển khoản quỹ thôn</span>
                    <form onsubmit="saveVillageFundBankInfo(event)" class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                        <div class="space-y-1">
                            <label class="text-[9px] uppercase font-bold text-stone-400 block">Ngân hàng</label>
                            <select id="vf-bank-name-input" class="w-full px-3 py-2 rounded-lg bg-white border border-stone-200 text-stone-900 text-xs outline-none focus:border-primary-500">
                                <option value="">-- Chọn ngân hàng --</option>
                                ${VIETNAM_BANKS.map(b => `<option value="${b}" ${vf.bankInfo && vf.bankInfo.bankName === b ? 'selected' : ''}>${b}</option>`).join('')}
                            </select>
                        </div>
                        <div class="space-y-1">
                            <label class="text-[9px] uppercase font-bold text-stone-400 block">Số tài khoản</label>
                            <input type="text" id="vf-bank-account-input" value="${(vf.bankInfo && vf.bankInfo.accountNumber) || ''}" class="w-full px-3 py-2 rounded-lg bg-white border border-stone-200 text-stone-900 text-xs outline-none focus:border-primary-500">
                        </div>
                        <div class="space-y-1">
                            <label class="text-[9px] uppercase font-bold text-stone-400 block">Chủ tài khoản</label>
                            <input type="text" id="vf-bank-holder-input" value="${(vf.bankInfo && vf.bankInfo.accountHolder) || ''}" class="w-full px-3 py-2 rounded-lg bg-white border border-stone-200 text-stone-900 text-xs outline-none focus:border-primary-500">
                        </div>
                        <button type="submit" class="sm:col-span-3 w-full py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs uppercase">Lưu thông tin ngân hàng</button>
                    </form>
                </div>

                <div class="space-y-3 text-left">
                    <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Xác nhận chuyển khoản đang chờ duyệt (${pendingPayments.length})</span>
                    <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                    <th class="p-3 font-semibold">Hộ</th>
                                    <th class="p-3 font-semibold">Khoản thu</th>
                                    <th class="p-3 font-semibold text-right">Số tiền</th>
                                    <th class="p-3 font-semibold">Thời gian báo</th>
                                    <th class="p-3 font-semibold text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-stone-200/40 text-stone-600">${pendingPaymentRows}</tbody>
                        </table>
                    </div>
                </div>

                <div class="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3 text-left">
                    <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Tạo khoản thu quỹ thôn mới (áp dụng cho mọi hộ)</span>
                    <form onsubmit="createFundObligation(event)" class="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
                        <div class="space-y-1 sm:col-span-2">
                            <label class="text-[9px] uppercase font-bold text-stone-400 block">Tên khoản thu</label>
                            <input type="text" id="fund-ob-name-input" placeholder="VD: Quỹ Nông thôn mới 2026" class="w-full px-2 py-1.5 rounded bg-white border border-stone-200 text-stone-900 text-xs outline-none">
                        </div>
                        <div class="space-y-1">
                            <label class="text-[9px] uppercase font-bold text-stone-400 block">Chu kỳ</label>
                            <select id="fund-ob-period-input" class="w-full px-2 py-1.5 rounded bg-white border border-stone-200 text-stone-900 text-xs outline-none">${buildYearSelectOptions()}</select>
                        </div>
                        <div class="space-y-1">
                            <label class="text-[9px] uppercase font-bold text-stone-400 block">Số tiền / hộ</label>
                            <input type="number" id="fund-ob-amount-input" placeholder="Số tiền" class="w-full px-2 py-1.5 rounded bg-white border border-stone-200 text-stone-900 text-xs outline-none">
                        </div>
                        <button type="submit" class="sm:col-span-4 w-full py-1.5 rounded bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs uppercase">Tạo khoản thu</button>
                    </form>
                </div>

                <div class="space-y-3 text-left">
                    <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Danh sách khoản thu quỹ thôn — Tổng mỗi hộ phải đóng: ${totalObligation.toLocaleString('vi-VN')} đ</span>
                    <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                    <th class="p-3 font-semibold">Tên khoản thu</th>
                                    <th class="p-3 font-semibold">Chu kỳ</th>
                                    <th class="p-3 font-semibold text-right">Số tiền / hộ</th>
                                    <th class="p-3 font-semibold text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-stone-200/40 text-stone-600">
                                ${obligationRows}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3 text-left">
                    <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Ghi nhận khoản thu/chi mới</span>
                    <form onsubmit="addVillageFundTransaction(event)" class="space-y-2">
                        <input type="hidden" id="vf-tx-type" value="Thu">
                        <div class="inline-flex p-1 rounded-lg bg-white border border-stone-200">
                            <button type="button" onclick="setVillageFundTxType('Thu')" id="vf-tx-type-btn-Thu" class="px-4 py-1 rounded text-xs font-bold uppercase transition-all bg-primary-600 text-white">Thu</button>
                            <button type="button" onclick="setVillageFundTxType('Chi')" id="vf-tx-type-btn-Chi" class="px-4 py-1 rounded text-xs font-bold uppercase transition-all text-stone-500 hover:text-stone-900">Chi</button>
                        </div>
                        <div id="vf-thu-fields" class="space-y-2">
                            <input type="text" id="vf-tx-household" list="vf-household-datalist" placeholder="Gõ để tìm chủ hộ..." autocomplete="off" class="w-full px-2 py-1.5 rounded bg-white border border-stone-200 text-stone-900 text-xs outline-none">
                            <datalist id="vf-household-datalist">
                                ${householdDatalistOptions}
                            </datalist>

                            <span class="text-[9px] uppercase font-bold text-stone-400 block">Chọn khoản thu áp dụng</span>
                            <div class="space-y-1 max-h-32 overflow-y-auto">
                                ${currentFundObligations.map(o => `
                                    <label class="flex items-center justify-between gap-2 px-2 py-1.5 rounded bg-white border border-stone-200 text-xs cursor-pointer">
                                        <span class="flex items-center gap-2 text-stone-600">
                                            <input type="checkbox" class="vf-tx-obligation-checkbox" data-amount="${o.amount}" data-name="${o.name}" onchange="updateVillageFundThuTotal()">
                                            ${o.name}
                                        </span>
                                        <span class="font-mono text-stone-500">${o.amount.toLocaleString('vi-VN')} đ</span>
                                    </label>
                                `).join('') || '<p class="text-[11px] text-stone-400">Chưa có khoản thu nào — hãy tạo ở mục phía trên.</p>'}
                            </div>
                            <div class="flex justify-between items-center pt-1 text-xs">
                                <span class="text-stone-400">Tổng tiền:</span>
                                <span id="vf-tx-thu-total-display" class="font-mono font-bold text-emerald-600">0 đ</span>
                            </div>
                        </div>
                        <div id="vf-chi-fields" class="hidden space-y-2">
                            <input type="text" id="vf-tx-desc" placeholder="Nội dung chi" class="w-full px-2 py-1.5 rounded bg-white border border-stone-200 text-stone-900 text-xs outline-none">
                            <input type="number" id="vf-tx-amount" placeholder="Số tiền" class="w-full px-2 py-1.5 rounded bg-white border border-stone-200 text-stone-900 text-xs outline-none">
                        </div>
                        <button type="submit" class="w-full py-1.5 rounded bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs uppercase">Ghi nhận</button>
                    </form>
                </div>

                <div class="space-y-3 text-left">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Sổ sách giao dịch</span>
                        <div class="inline-flex p-1 rounded-lg bg-white border border-stone-200">
                            <button onclick="switchTruongThonFundView('thu')" class="px-4 py-1 rounded text-xs font-bold uppercase transition-all ${truongThonFundView === 'thu' ? 'bg-primary-600 text-white' : 'text-stone-500 hover:text-white'}">Thu</button>
                            <button onclick="switchTruongThonFundView('chi')" class="px-4 py-1 rounded text-xs font-bold uppercase transition-all ${truongThonFundView === 'chi' ? 'bg-primary-600 text-white' : 'text-stone-500 hover:text-white'}">Chi</button>
                        </div>
                    </div>
                    <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                    <th class="p-3 font-semibold">${truongThonFundView === 'thu' ? 'Tên hộ đóng' : 'Nội dung chi'}</th>
                                    <th class="p-3 font-semibold text-right">Số tiền</th>
                                    <th class="p-3 font-semibold text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-stone-200/40 text-stone-600">
                                ${ledgerRows}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="space-y-3 text-left">
                    <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Hộ chưa đóng quỹ thôn (${vf.unpaidHouseholds}/${vf.totalHouseholds})</span>
                    <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                    <th class="p-3 font-semibold">Mã hộ</th>
                                    <th class="p-3 font-semibold">Chủ hộ</th>
                                    <th class="p-3 font-semibold">Ngày sinh</th>
                                    <th class="p-3 font-semibold">Địa bàn</th>
                                    <th class="p-3 font-semibold text-right">Số tiền chưa đóng</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-stone-200/40 text-stone-600">
                                ${unpaidRows || '<tr><td colspan="5" class="p-4 text-center text-stone-400">Không có hộ nào chưa đóng.</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        // -----------------------------------------------------------------------------------
        // 4. ADMIN TABS RENDERERS & LOGIC
        // -----------------------------------------------------------------------------------
