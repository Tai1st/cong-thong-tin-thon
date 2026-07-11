        let requestingMemberEditForId = null;

        function openRequestMemberEditModal(resId) {
            const res = villageDb.residents.find(r => r.id === resId);
            if (!res) return;
            requestingMemberEditForId = resId;

            document.getElementById('request-member-name').innerText = res.name;
            document.getElementById('request-member-name-input').value = res.name || '';
            document.getElementById('request-member-relation-input').value = res.relation || '';
            document.getElementById('request-member-dob-input').value = dmyToIso(res.dob);
            document.getElementById('request-member-cccd-input').value = res.cccd || '';
            document.getElementById('request-member-phone-input').value = res.phone || '';
            document.getElementById('request-member-father-input').value = res.fatherName || '';
            document.getElementById('request-member-mother-input').value = res.motherName || '';
            document.getElementById('request-member-group-input').value = res.group || 'Đoàn Kết cũ';
            document.getElementById('request-member-permanent-address-input').value = res.permanentAddress || '';
            document.getElementById('request-member-temporary-address-input').value = res.temporaryAddress || '';

            const modal = document.getElementById('request-member-modal');
            const box = document.getElementById('request-member-modal-box');
            modal.classList.remove('hidden');
            setTimeout(() => {
                box.classList.remove('scale-95');
                box.classList.add('scale-100');
            }, 10);
        }

        function closeRequestMemberEditModal() {
            const modal = document.getElementById('request-member-modal');
            const box = document.getElementById('request-member-modal-box');
            box.classList.add('scale-95');
            box.classList.remove('scale-100');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 150);
            requestingMemberEditForId = null;
        }

        function submitMemberEditRequest(event) {
            event.preventDefault();
            if (!requestingMemberEditForId) return;

            const res = villageDb.residents.find(r => r.id === requestingMemberEditForId);
            const newValues = {
                name: document.getElementById('request-member-name-input').value.trim(),
                relation: document.getElementById('request-member-relation-input').value.trim(),
                dob: isoToDmy(document.getElementById('request-member-dob-input').value) || res.dob,
                cccd: document.getElementById('request-member-cccd-input').value.trim(),
                phone: document.getElementById('request-member-phone-input').value.trim(),
                fatherName: document.getElementById('request-member-father-input').value.trim(),
                motherName: document.getElementById('request-member-mother-input').value.trim(),
                group: document.getElementById('request-member-group-input').value,
                permanentAddress: document.getElementById('request-member-permanent-address-input').value.trim(),
                temporaryAddress: document.getElementById('request-member-temporary-address-input').value.trim()
            };

            const changes = EDITABLE_MEMBER_FIELDS.filter(f => String(newValues[f.key]) !== String(res[f.key] || ''));
            if (!changes.length) {
                showCustomAlert('error', 'Không có thay đổi', 'Bạn chưa thay đổi thông tin nào để gửi yêu cầu.');
                return;
            }

            const now = new Date();
            const timeStr = `${now.getDate().toString().padStart(2,'0')}/${(now.getMonth()+1).toString().padStart(2,'0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
            const reqId = `MREQ-${Math.floor(100 + Math.random()*900)}`;

            villageDb.memberEditRequests.push({
                id: reqId, residentId: res.id, residentName: res.name,
                oldValues: {
                    name: res.name, relation: res.relation || '', dob: res.dob, cccd: res.cccd, phone: res.phone || '',
                    fatherName: res.fatherName || '', motherName: res.motherName || '',
                    group: res.group || '', permanentAddress: res.permanentAddress || '', temporaryAddress: res.temporaryAddress || ''
                },
                newValues,
                submittedBy: currentUser.name, status: "Chờ duyệt", time: timeStr
            });

            saveDatabase();
            const changeSummary = changes.map(f => `${f.label}: "${res[f.key] || ''}" → "${newValues[f.key]}"`).join('; ');
            addLog("Yêu cầu sửa thông tin", `${currentUser.name} đề nghị sửa thông tin của ${res.name} (${changeSummary}), đang chờ Admin duyệt.`, currentUser.name);
            showCustomAlert('info', 'Đã gửi yêu cầu', 'Yêu cầu điều chỉnh thông tin đã được gửi và đang chờ Admin phê duyệt.');
            closeRequestMemberEditModal();
            renderResidentFamily();
        }

        // Add-new-member request modal: proposes a brand-new household member,
        // which stays "Chờ duyệt" until an Admin approves it (creating the resident).
        function openAddMemberModal() {
            document.getElementById('add-member-name-input').value = '';
            document.getElementById('add-member-relation-input').value = '';
            document.getElementById('add-member-dob-input').value = '';
            document.getElementById('add-member-cccd-input').value = '';
            document.getElementById('add-member-phone-input').value = '';
            document.getElementById('add-member-father-input').value = '';
            document.getElementById('add-member-mother-input').value = '';

            // Mặc định thành viên mới kế thừa nhóm cư trú/địa chỉ thường trú
            // của hộ (thường đúng cho vợ/chồng/con sinh sống cùng nhà); người
            // gửi yêu cầu có thể sửa lại nếu thành viên mới thực ra ở nơi khác.
            const familyId = getCurrentUserFamilyId();
            const householdHead = familyId
                ? (villageDb.residents.find(r => r.familyId === familyId && r.isHouseholder) || villageDb.residents.find(r => r.familyId === familyId))
                : null;
            document.getElementById('add-member-group-input').value = (householdHead && householdHead.group) || 'Đoàn Kết cũ';
            document.getElementById('add-member-permanent-address-input').value = (householdHead && householdHead.permanentAddress) || 'Thôn Đoàn Kết, xã Dliê Ya, tỉnh Đắk Lắk';
            document.getElementById('add-member-temporary-address-input').value = '';

            const modal = document.getElementById('add-member-modal');
            const box = document.getElementById('add-member-modal-box');
            modal.classList.remove('hidden');
            setTimeout(() => {
                box.classList.remove('scale-95');
                box.classList.add('scale-100');
            }, 10);
        }

        function closeAddMemberModal() {
            const modal = document.getElementById('add-member-modal');
            const box = document.getElementById('add-member-modal-box');
            box.classList.add('scale-95');
            box.classList.remove('scale-100');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 150);
        }

        function submitNewMemberRequest(event) {
            event.preventDefault();
            const familyId = getCurrentUserFamilyId();
            if (!familyId) return;

            const name = document.getElementById('add-member-name-input').value.trim();
            const relation = document.getElementById('add-member-relation-input').value.trim();
            const dob = isoToDmy(document.getElementById('add-member-dob-input').value);
            const cccd = document.getElementById('add-member-cccd-input').value.trim();
            const phone = document.getElementById('add-member-phone-input').value.trim();
            const fatherName = document.getElementById('add-member-father-input').value.trim();
            const motherName = document.getElementById('add-member-mother-input').value.trim();
            const group = document.getElementById('add-member-group-input').value;
            const permanentAddress = document.getElementById('add-member-permanent-address-input').value.trim();
            const temporaryAddress = document.getElementById('add-member-temporary-address-input').value.trim();

            if (!name || !relation || !dob) {
                showCustomAlert('error', 'Thiếu thông tin', 'Vui lòng nhập đầy đủ Họ và tên, Quan hệ với chủ hộ, Ngày sinh.');
                return;
            }
            if (!cccd) {
                showCustomAlert('error', 'Thiếu thông tin', 'Vui lòng nhập Số định danh cá nhân / Căn Cước. Theo quy định hiện hành, trẻ em được cấp số định danh cá nhân ngay từ khi đăng ký khai sinh.');
                return;
            }

            const now = new Date();
            const timeStr = `${now.getDate().toString().padStart(2,'0')}/${(now.getMonth()+1).toString().padStart(2,'0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
            const reqId = `NMREQ-${Math.floor(100 + Math.random()*900)}`;

            villageDb.newMemberRequests.push({
                id: reqId, familyId, name, relation, dob, cccd, phone, fatherName, motherName,
                group, permanentAddress, temporaryAddress,
                submittedBy: currentUser.name, status: "Chờ duyệt", time: timeStr
            });

            saveDatabase();
            addLog("Yêu cầu thêm thành viên", `${currentUser.name} đề nghị thêm thành viên mới "${name}" (${relation}) vào hộ ${familyId}, đang chờ Admin duyệt.`, currentUser.name);
            showCustomAlert('info', 'Đã gửi yêu cầu', 'Yêu cầu thêm thành viên mới đã được gửi và đang chờ Admin phê duyệt.');
            closeAddMemberModal();
            renderResidentFamily();
        }

        // Shared Geolocation capture used both by a resident updating their own
        // household's location and by Trưởng thôn/Cán bộ Hội updating a
        // household's location while visiting in person (their device's GPS is
        // assumed to be at the household at that moment).
        function updateGpsForFamily(familyId, btnId, onSuccess) {
            if (!familyId) return;

            if (!navigator.geolocation) {
                showCustomAlert('error', 'Không hỗ trợ định vị', 'Trình duyệt của bạn không hỗ trợ định vị GPS.');
                return;
            }

            const btn = btnId ? document.getElementById(btnId) : null;
            if (btn) btn.disabled = true;

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    villageDb.gpsCoords[familyId] = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    saveDatabase();
                    addLog("Cập nhật GPS", `${currentUser.name} định vị GPS hộ ${familyId} tại (${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}).`, currentUser.name);
                    showCustomAlert('success', 'Định vị thành công', 'Đã lấy vị trí GPS hiện tại của thiết bị và lưu vào hồ sơ hộ gia đình.');
                    if (btn) btn.disabled = false;
                    if (onSuccess) onSuccess();
                },
                (error) => {
                    if (btn) btn.disabled = false;
                    const message = error.code === error.PERMISSION_DENIED
                        ? 'Trình duyệt báo quyền vị trí bị chặn. Trên Safari, quyền này có 2 lớp: (1) Cài đặt hệ thống > Quyền riêng tư > Dịch vụ định vị phải bật cho Safari, và (2) quyền của riêng trang web (bấm biểu tượng "aA" trên thanh địa chỉ > Cài đặt cho trang này > Vị trí > Cho phép). Nếu vừa đổi quyền, hãy tải lại trang rồi thử lại.'
                        : 'Không thể lấy vị trí GPS. Vui lòng kiểm tra lại thiết bị và thử lại.';
                    showCustomAlert('error', 'Định vị thất bại', message);
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        }

        function simulateGPSUpdate() {
            const familyId = getCurrentUserFamilyId();
            updateGpsForFamily(familyId, 'gps-update-btn', renderResidentFamily);
        }

        function saveHouseNumber() {
            const familyId = getCurrentUserFamilyId();
            if (!familyId) return;

            const houseNumber = document.getElementById('house-number-input').value.trim();
            villageDb.houseNumbers[familyId] = houseNumber;
            saveDatabase();

            addLog("Cập nhật số nhà", `${currentUser.name} cập nhật số nhà/địa chỉ hộ ${familyId} thành "${houseNumber}".`, currentUser.name);
            showCustomAlert('success', 'Đã cập nhật', 'Đã lưu số nhà / địa chỉ cụ thể của hộ gia đình.');
        }

        let residentFundView = 'thu';
        function switchResidentFundView(view) {
            residentFundView = view;
            renderResidentContributions();
        }

        // Mirrors the same table layout Trưởng thôn sees in "Quản lý Quỹ Thôn"
        // (Tên hộ đóng/Nội dung chi + Số tiền, no date column, no delete button
        // since residents only have read access here) so the two views stay
        // visually consistent even though they already share the same data.
        function renderVillageFundLedgerHtml() {
            const vf = villageDb.villageFund;
            const ledger = residentFundView === 'thu' ? vf.thu : vf.chi;

            let displayLedger = ledger;
            if (residentFundView === 'thu') {
                const totalsByHousehold = new Map();
                ledger.forEach(t => {
                    const key = t.household || t.desc;
                    totalsByHousehold.set(key, (totalsByHousehold.get(key) || 0) + t.amount);
                });
                displayLedger = [...totalsByHousehold.entries()].map(([household, amount]) => ({ household, amount }));
            }

            const ledgerRows = displayLedger.map(t => `
                <tr class="hover:bg-stone-50 transition-colors">
                    <td class="p-3 font-semibold text-stone-900">${residentFundView === 'thu' ? (t.household || t.desc) : t.desc}</td>
                    <td class="p-3 text-right font-mono font-bold ${residentFundView === 'thu' ? 'text-emerald-600' : 'text-red-600'}">${residentFundView === 'thu' ? '+' : '-'}${t.amount.toLocaleString('vi-VN')} đ</td>
                </tr>
            `).join('') || '<tr><td colspan="2" class="p-4 text-center text-stone-400">Chưa có dữ liệu.</td></tr>';

            return `
                <div class="space-y-4 text-left">
                    <div>
                        <h4 class="font-serif text-lg font-bold text-stone-900">Công Khai Quỹ Thôn Toàn Xã</h4>
                        <p class="text-xs text-stone-500">Minh bạch các khoản thu (đóng góp từ các hộ) và chi (sử dụng quỹ) của toàn thôn.</p>
                    </div>

                    <div class="p-3.5 rounded-xl bg-amber-50 flex items-center gap-3 text-amber-600 text-xs">
                        <i class="fa-solid fa-house-circle-exclamation text-base"></i>
                        <span><strong>${vf.unpaidHouseholds}</strong> / ${vf.totalHouseholds} hộ chưa đóng quỹ thôn năm 2026</span>
                    </div>

                    <div class="inline-flex p-1 rounded-xl bg-stone-50 border border-stone-200">
                        <button onclick="switchResidentFundView('thu')" class="px-5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${residentFundView === 'thu' ? 'bg-primary-600 text-white' : 'text-stone-500 hover:text-white'}">Thu</button>
                        <button onclick="switchResidentFundView('chi')" class="px-5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${residentFundView === 'chi' ? 'bg-primary-600 text-white' : 'text-stone-500 hover:text-white'}">Chi</button>
                    </div>

                    <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                    <th class="p-3 font-semibold">${residentFundView === 'thu' ? 'Tên hộ đóng' : 'Nội dung chi'}</th>
                                    <th class="p-3 font-semibold text-right">Số tiền</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-stone-200/40 text-stone-600">
                                ${ledgerRows}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        function renderResidentContributions() {
            const container = document.getElementById('tab-content-container');
            const familyId = getCurrentUserFamilyId();
            const funds = (familyId && villageDb.funds[familyId]) || [];

            let rows = funds.map((f, idx) => {
                const statusBadge = f.status === "Đã đóng"
                    ? `<span class="px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-extrabold uppercase tracking-wider block text-center"><i class="fa-solid fa-check mr-1"></i> Đã hoàn thành</span>`
                    : f.status === "Chờ duyệt"
                        ? `<span class="px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-[9px] font-extrabold uppercase tracking-wider block text-center"><i class="fa-solid fa-clock mr-1"></i> Chờ duyệt</span>`
                        : `<span class="px-2 py-1 rounded-full bg-amber-50 text-amber-600 text-[9px] font-extrabold uppercase tracking-wider block text-center"><i class="fa-solid fa-circle-exclamation mr-1"></i> Chưa thanh toán</span>`;

                const action = f.status === "Đã đóng"
                    ? `<span class="text-stone-400 font-mono text-[10px]">${f.date}</span>`
                    : f.status === "Chờ duyệt"
                        ? `<span class="text-blue-600 text-[10px] font-semibold">Đang chờ Trưởng thôn duyệt</span>`
                        : `<button onclick="payResidentFund(${idx})" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] uppercase transition-all shadow-md">Đóng Qua QR</button>`;

                return `
                    <tr class="hover:bg-stone-50 transition-colors">
                        <td class="p-4">
                            <span class="font-bold text-stone-900 block text-xs">${f.name}</span>
                            <span class="text-[10px] text-stone-400 font-mono">${f.memo}</span>
                        </td>
                        <td class="p-4 text-stone-600 font-medium">${f.period}</td>
                        <td class="p-4 text-right font-mono text-stone-900 font-bold">${f.amount.toLocaleString('vi-VN')} đ</td>
                        <td class="p-4 text-center">${statusBadge}</td>
                        <td class="p-4 text-right">${action}</td>
                    </tr>
                `;
            }).join('');

            container.innerHTML = `
                ${renderVillageFundLedgerHtml()}

                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left pt-6 border-t border-stone-200">
                    <div>
                        <h4 class="font-serif text-lg font-bold text-stone-900">Sổ Theo Dõi Đóng Góp Của Hộ Gia Đình Bạn</h4>
                        <p class="text-xs text-stone-500">Minh bạch các hoạt động đóng góp, xây dựng nông thôn mới nâng cao.</p>
                    </div>
                </div>

                <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50 text-left">
                    <table class="w-full text-left text-xs">
                        <thead>
                            <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                <th class="p-4 font-semibold">Khoản Đóng Góp</th>
                                <th class="p-4 font-semibold">Chu kỳ</th>
                                <th class="p-4 font-semibold text-right">Số tiền</th>
                                <th class="p-4 font-semibold text-center">Trạng thái</th>
                                <th class="p-4 font-semibold text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-stone-200/40 text-stone-600">
                            ${rows}
                        </tbody>
                    </table>
                </div>

                <div id="quick-qr-box" class="hidden p-6 rounded-2xl border border-primary-500/30 bg-primary-950/10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center text-left">
                    <div class="md:col-span-8 space-y-4">
                        <div class="flex items-center gap-2 text-primary-400">
                            <i class="fa-solid fa-qrcode text-lg"></i>
                            <h5 class="text-sm font-bold uppercase tracking-wider">Thanh toán đóng góp nghĩa vụ qua QR chuẩn</h5>
                        </div>
                        <p class="text-xs text-stone-600 leading-relaxed">
                            Quét mã QR để hoàn thành nghĩa vụ. Ban quản trị sẽ cập nhật tức thời trạng thái đóng góp cho hộ gia đình của bạn ngay khi giao dịch thành công.
                        </p>
                        <div class="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
                            <div class="flex justify-between">
                                <span class="text-stone-400">Ngân hàng thụ hưởng:</span>
                                <span class="text-stone-900 font-bold">${(villageDb.villageFund.bankInfo && villageDb.villageFund.bankInfo.bankName) || 'Chưa cập nhật'}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-stone-400">Số tài khoản:</span>
                                <span class="text-stone-900 font-bold font-mono">${(villageDb.villageFund.bankInfo && villageDb.villageFund.bankInfo.accountNumber) || 'Chưa cập nhật'}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-stone-400">Chủ tài khoản:</span>
                                <span class="text-stone-900 font-bold">${(villageDb.villageFund.bankInfo && villageDb.villageFund.bankInfo.accountHolder) || 'Chưa cập nhật'}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-stone-400">Mã giao dịch đối soát:</span>
                                <span class="text-primary-400 font-mono font-bold" id="qr-memo-field"></span>
                            </div>
                        </div>
                        <button onclick="confirmSimulatedResidentPayment()" class="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs uppercase transition-colors shadow-lg shadow-primary-950/50">
                            Tôi đã chuyển khoản thành công
                        </button>
                    </div>
                    <div class="md:col-span-4 flex justify-center">
                        <img id="qr-img" src="" alt="Mã QR Chuyển Khoản VietQR" class="w-36 h-36 border-4 border-white rounded-xl">
                    </div>
                </div>
            `;
        }

        let pendingFundIdx = null;
        function payResidentFund(idx) {
            pendingFundIdx = idx;
            const fund = villageDb.funds[getCurrentUserFamilyId()][idx];
            document.getElementById('qr-memo-field').innerText = fund.memo;

            const vietQrUrl = buildVietQrUrl(villageDb.villageFund.bankInfo, fund.amount, fund.memo);
            document.getElementById('qr-img').src = vietQrUrl || `https://placehold.co/150x150/ffffff/000000?text=${fund.id}+-+${fund.amount / 1000}K`;

            document.getElementById('quick-qr-box').classList.remove('hidden');
            document.getElementById('quick-qr-box').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        function confirmSimulatedResidentPayment() {
            if (pendingFundIdx === null) return;
            const familyId = getCurrentUserFamilyId();
            const fund = villageDb.funds[familyId][pendingFundIdx];
            fund.status = "Chờ duyệt";

            const now = new Date();
            fund.date = `${now.getDate().toString().padStart(2,'0')}/${(now.getMonth()+1).toString().padStart(2,'0')}/${now.getFullYear()} (QR)`;

            saveDatabase();
            addLog("Đóng góp quỹ thôn", `Hộ gia đình ${familyId} báo đã chuyển khoản ${fund.amount.toLocaleString('vi-VN')} đ cho quỹ ${fund.name}, đang chờ Trưởng thôn duyệt.`, currentUser.name);
            showCustomAlert('info', 'Đã gửi xác nhận', `Đã gửi xác nhận chuyển khoản quỹ ${fund.name}, đang chờ Trưởng thôn duyệt.`);
            renderResidentContributions();
        }

        // Member-level hội phí payment (parallels payResidentFund/confirmSimulatedResidentPayment
        // above, but keyed by resident id + association name instead of familyId,
        // since hội phí obligations belong to an individual member, not a household).
        let pendingAssocFundIdx = null;
        let pendingAssocFundAssocName = null;

        function payAssocMemberFund(idx) {
            const me = getCurrentUserResident();
            if (!me) return;
            pendingAssocFundIdx = idx;
            pendingAssocFundAssocName = me.association;

            const quota = villageDb.associationQuotas[me.association];
            const fund = quota.memberFunds[me.id][idx];
            document.getElementById('assoc-qr-memo-field').innerText = fund.memo;

            const vietQrUrl = buildVietQrUrl(quota.bankInfo, fund.amount, fund.memo);
            document.getElementById('assoc-qr-img').src = vietQrUrl || `https://placehold.co/150x150/ffffff/000000?text=${fund.id}+-+${fund.amount / 1000}K`;

            document.getElementById('assoc-quick-qr-box').classList.remove('hidden');
            document.getElementById('assoc-quick-qr-box').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        function confirmAssocMemberFundPayment() {
            if (pendingAssocFundIdx === null) return;
            const me = getCurrentUserResident();
            if (!me) return;
            const fund = villageDb.associationQuotas[pendingAssocFundAssocName].memberFunds[me.id][pendingAssocFundIdx];
            fund.status = "Chờ duyệt";

            const now = new Date();
            fund.date = `${now.getDate().toString().padStart(2,'0')}/${(now.getMonth()+1).toString().padStart(2,'0')}/${now.getFullYear()} (QR)`;

            saveDatabase();
            addLog("Đóng hội phí", `${currentUser.name} báo đã chuyển khoản ${fund.amount.toLocaleString('vi-VN')} đ cho quỹ ${pendingAssocFundAssocName} (${fund.name}), đang chờ hội trưởng duyệt.`, currentUser.name);
            showCustomAlert('info', 'Đã gửi xác nhận', `Đã gửi xác nhận chuyển khoản hội phí "${fund.name}", đang chờ hội trưởng duyệt.`);
            renderResidentAssociationDetail(pendingAssocFundAssocName);
        }

        // Lets any resident (Cư dân, and — since they share the same resident
        // tab group — Cán bộ Hội/Trưởng thôn/Tổ ANTT too) send an incident
        // report straight to Tổ ANTT, with an optional GPS pin captured at the
        // moment of reporting so ANTT can locate the scene.
        function renderResidentIncidentReport() {
            const container = document.getElementById('tab-content-container');
            const familyId = getCurrentUserFamilyId();
            const myReports = villageDb.incidentReports.filter(r => r.familyId === familyId).sort((a, b) => b.time.localeCompare(a.time));

            const statusBadge = (status) => {
                if (status === 'Đã xử lý') return `<span class="px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider"><i class="fa-solid fa-check mr-1"></i> Đã xử lý</span>`;
                if (status === 'Đã tiếp nhận') return `<span class="px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider"><i class="fa-solid fa-eye mr-1"></i> Đã tiếp nhận</span>`;
                return `<span class="px-2 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider"><i class="fa-solid fa-clock mr-1"></i> Mới gửi</span>`;
            };

            const rows = myReports.map(r => `
                <tr class="hover:bg-stone-50 transition-colors">
                    <td class="p-4">
                        <span class="text-stone-900 block text-xs">${r.content}</span>
                        <span class="text-[10px] text-stone-400 font-mono">${r.locationText || (r.lat ? `${r.lat.toFixed(5)}, ${r.lng.toFixed(5)}` : 'Không kèm vị trí')}</span>
                    </td>
                    <td class="p-4 font-mono text-stone-500 text-[11px]">${r.time}</td>
                    <td class="p-4 text-center">${statusBadge(r.status)}</td>
                </tr>
            `).join('') || '<tr><td colspan="3" class="p-4 text-center text-stone-400">Bạn chưa gửi tin báo nào.</td></tr>';

            container.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                    <div>
                        <h4 class="font-serif text-lg font-bold text-stone-900">Báo An Ninh Trật Tự</h4>
                        <p class="text-xs text-stone-500">Gửi tin báo trực tiếp đến Tổ An ninh trật tự thôn kèm vị trí hiện tại của bạn.</p>
                    </div>
                </div>

                <div class="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-left space-y-4">
                    <form onsubmit="submitIncidentReport(event)" class="space-y-3">
                        <div class="space-y-1.5">
                            <label class="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">Nội dung sự việc</label>
                            <textarea id="incident-report-content-input" rows="3" required placeholder="Mô tả ngắn gọn sự việc cần báo..." class="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-sm outline-none focus:border-primary-500 transition-colors"></textarea>
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">Địa điểm cụ thể (nếu cần)</label>
                            <input type="text" id="incident-report-location-input" placeholder="VD: Trước cổng Nhà văn hóa thôn" class="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-xs outline-none focus:border-primary-500 transition-colors">
                        </div>
                        <div class="flex items-center gap-2 text-xs">
                            <button type="button" onclick="captureIncidentReportLocation()" id="incident-report-gps-btn" class="px-3 py-2 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 hover:border-primary-500 text-stone-700 hover:text-stone-900 font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-2">
                                <i class="fa-solid fa-location-crosshairs text-primary-400"></i> Đính kèm vị trí GPS hiện tại
                            </button>
                            <span id="incident-report-gps-status" class="text-stone-400"></span>
                        </div>
                        <button type="submit" class="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-red-950/50">
                            <i class="fa-solid fa-paper-plane mr-1"></i> Gửi tin báo đến Tổ ANTT
                        </button>
                    </form>
                </div>

                <div class="space-y-3 text-left">
                    <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Tin báo bạn đã gửi</span>
                    <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                    <th class="p-4 font-semibold">Nội dung / Vị trí</th>
                                    <th class="p-4 font-semibold">Thời gian gửi</th>
                                    <th class="p-4 font-semibold text-center">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-stone-200/40 text-stone-600">${rows}</tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        let incidentReportCoords = null;
        function captureIncidentReportLocation() {
            if (!navigator.geolocation) {
                showCustomAlert('error', 'Không hỗ trợ định vị', 'Trình duyệt của bạn không hỗ trợ định vị GPS.');
                return;
            }
            const btn = document.getElementById('incident-report-gps-btn');
            const status = document.getElementById('incident-report-gps-status');
            if (btn) btn.disabled = true;
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    incidentReportCoords = { lat: position.coords.latitude, lng: position.coords.longitude };
                    if (status) status.innerText = `Đã đính kèm: ${incidentReportCoords.lat.toFixed(5)}, ${incidentReportCoords.lng.toFixed(5)}`;
                    if (btn) btn.disabled = false;
                },
                () => {
                    if (btn) btn.disabled = false;
                    showCustomAlert('error', 'Định vị thất bại', 'Không thể lấy vị trí GPS. Bạn vẫn có thể gửi tin báo kèm mô tả địa điểm bằng chữ.');
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        }

        function submitIncidentReport(event) {
            event.preventDefault();
            const familyId = getCurrentUserFamilyId();
            if (!familyId) return;

            const content = document.getElementById('incident-report-content-input').value.trim();
            const locationText = document.getElementById('incident-report-location-input').value.trim();
            if (!content) {
                showCustomAlert('error', 'Thiếu thông tin', 'Vui lòng nhập nội dung sự việc cần báo.');
                return;
            }

            const now = new Date();
            const timeStr = `${now.getDate().toString().padStart(2,'0')}/${(now.getMonth()+1).toString().padStart(2,'0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;

            villageDb.incidentReports.unshift({
                id: `INC-${Math.floor(1000 + Math.random()*9000)}`,
                familyId, reporterName: currentUser.name, content, locationText,
                lat: incidentReportCoords ? incidentReportCoords.lat : null,
                lng: incidentReportCoords ? incidentReportCoords.lng : null,
                status: "Mới", time: timeStr
            });
            incidentReportCoords = null;

            saveDatabase();
            addLog("Gửi tin báo ANTT", `${currentUser.name} gửi tin báo an ninh trật tự: "${content}".`, currentUser.name);
            showCustomAlert('success', 'Đã gửi tin báo', 'Tổ An ninh trật tự đã nhận được tin báo của bạn.');
            renderResidentIncidentReport();
        }

        // Resident-submitted temporary-residence registration for a visiting
        // relative/guest; stays "Chờ duyệt" until Tổ ANTT approves/rejects it.
        function renderResidentResidenceRequest() {
            const container = document.getElementById('tab-content-container');
            const familyId = getCurrentUserFamilyId();
            const myRequests = villageDb.residenceRegistrations.filter(r => r.familyId === familyId).sort((a, b) => b.time.localeCompare(a.time));

            const statusBadge = (status) => {
                if (status === 'Đã duyệt') return `<span class="px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider"><i class="fa-solid fa-check mr-1"></i> Đã duyệt</span>`;
                if (status === 'Từ chối') return `<span class="px-2 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider"><i class="fa-solid fa-xmark mr-1"></i> Từ chối</span>`;
                return `<span class="px-2 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider"><i class="fa-solid fa-clock mr-1"></i> Chờ duyệt</span>`;
            };

            const rows = myRequests.map(r => `
                <tr class="hover:bg-stone-50 transition-colors">
                    <td class="p-4 font-bold text-stone-900">${r.guestName}</td>
                    <td class="p-4 text-stone-600">${r.relationship}</td>
                    <td class="p-4 font-mono text-stone-500">${r.fromDate} → ${r.toDate}</td>
                    <td class="p-4 text-center">${statusBadge(r.status)}</td>
                </tr>
            `).join('') || '<tr><td colspan="4" class="p-4 text-center text-stone-400">Bạn chưa đăng ký lưu trú nào.</td></tr>';

            container.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                    <div>
                        <h4 class="font-serif text-lg font-bold text-stone-900">Đăng Ký Lưu Trú Cho Người Thân</h4>
                        <p class="text-xs text-stone-500">Gửi đăng ký tạm trú cho khách/người thân đến ở lại nhà bạn để Tổ ANTT duyệt và theo dõi.</p>
                    </div>
                </div>

                <div class="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-left space-y-4">
                    <form onsubmit="submitResidenceRequest(event)" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div class="space-y-1.5">
                            <label class="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">Họ tên người lưu trú</label>
                            <input type="text" id="residence-guest-name-input" required class="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-xs outline-none focus:border-primary-500 transition-colors">
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">Số Căn Cước</label>
                            <input type="text" id="residence-guest-cccd-input" class="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-xs outline-none focus:border-primary-500 transition-colors">
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">Quan hệ với chủ hộ</label>
                            <input type="text" id="residence-relationship-input" placeholder="VD: Anh/chị, bạn bè..." required class="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-xs outline-none focus:border-primary-500 transition-colors">
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">Lý do lưu trú</label>
                            <input type="text" id="residence-reason-input" class="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-xs outline-none focus:border-primary-500 transition-colors">
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">Từ ngày</label>
                            <input type="date" id="residence-from-date-input" required class="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-xs outline-none focus:border-primary-500 transition-colors">
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">Đến ngày</label>
                            <input type="date" id="residence-to-date-input" required class="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-xs outline-none focus:border-primary-500 transition-colors">
                        </div>
                        <button type="submit" class="sm:col-span-2 w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-primary-950/50">
                            Gửi đăng ký lưu trú
                        </button>
                    </form>
                </div>

                <div class="space-y-3 text-left">
                    <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Đăng ký của hộ bạn</span>
                    <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                    <th class="p-4 font-semibold">Người lưu trú</th>
                                    <th class="p-4 font-semibold">Quan hệ</th>
                                    <th class="p-4 font-semibold">Thời gian lưu trú</th>
                                    <th class="p-4 font-semibold text-center">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-stone-200/40 text-stone-600">${rows}</tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        function submitResidenceRequest(event) {
            event.preventDefault();
            const familyId = getCurrentUserFamilyId();
            if (!familyId) return;

            const guestName = document.getElementById('residence-guest-name-input').value.trim();
            const guestCccd = document.getElementById('residence-guest-cccd-input').value.trim();
            const relationship = document.getElementById('residence-relationship-input').value.trim();
            const reason = document.getElementById('residence-reason-input').value.trim();
            const fromDate = document.getElementById('residence-from-date-input').value;
            const toDate = document.getElementById('residence-to-date-input').value;

            if (!guestName || !relationship || !fromDate || !toDate) {
                showCustomAlert('error', 'Thiếu thông tin', 'Vui lòng nhập đầy đủ Họ tên, Quan hệ, Từ ngày và Đến ngày.');
                return;
            }

            const now = new Date();
            const timeStr = `${now.getDate().toString().padStart(2,'0')}/${(now.getMonth()+1).toString().padStart(2,'0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;

            villageDb.residenceRegistrations.unshift({
                id: `RES-${Math.floor(1000 + Math.random()*9000)}`,
                familyId, hostName: currentUser.name, guestName, guestCccd, relationship, reason, fromDate, toDate,
                status: "Chờ duyệt", submittedBy: currentUser.name, time: timeStr
            });

            saveDatabase();
            addLog("Đăng ký lưu trú", `${currentUser.name} đăng ký lưu trú cho ${guestName} (${relationship}) từ ${fromDate} đến ${toDate}, đang chờ Tổ ANTT duyệt.`, currentUser.name);
            showCustomAlert('info', 'Đã gửi đăng ký', 'Đăng ký lưu trú đang chờ Tổ ANTT phê duyệt.');
            renderResidentResidenceRequest();
        }

        // -----------------------------------------------------------------------------------
        // 2. CÁN BỘ HỘI TABS RENDERERS & LOGIC
        // -----------------------------------------------------------------------------------
        function renderAssociationMembers() {
            const container = document.getElementById('tab-content-container');
            const association = currentUser.assoc;

            // Active Members of this Association
            const members = villageDb.residents.filter(r => r.association === association);
            const nonMembers = villageDb.residents.filter(r => r.association !== association);

            let rows = members.map(m => {
                const isSelf = m.name === currentUser.name;
                const removeAction = isSelf
                    ? `<button type="button" disabled title="Bạn không thể tự gỡ chính mình" class="px-2 py-1 rounded bg-white text-stone-600 border border-stone-200 text-[10px] cursor-not-allowed opacity-60">Gỡ khỏi Hội</button>`
                    : `<button onclick="removeResidentFromAssoc('${m.id}')" class="px-2 py-1 rounded bg-red-50 text-red-600 text-[10px] hover:bg-red-600 hover:text-white transition-all">Gỡ khỏi Hội</button>`;

                return `
                    <tr class="hover:bg-stone-50 transition-colors">
                        <td class="p-3 font-bold text-stone-900">${m.name}</td>
                        <td class="p-3 font-mono text-stone-500">${m.dob}</td>
                        <td class="p-3 text-stone-600">${m.group}</td>
                        <td class="p-3 font-mono text-stone-500">${m.phone || 'Chưa có SĐT'}</td>
                        <td class="p-3 text-right space-x-2 whitespace-nowrap">
                            <button onclick="openViewLocationModal('${m.familyId}')" class="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white text-[10px] font-semibold transition-all"><i class="fa-solid fa-location-dot"></i> Vị trí</button>
                            <button onclick="openEditMemberModal('${m.id}')" class="px-2 py-1 rounded bg-stone-100 hover:bg-primary-600 text-stone-600 hover:text-white border border-stone-300 text-[10px] font-semibold transition-all"><i class="fa-solid fa-pen-to-square"></i> Sửa</button>
                            ${removeAction}
                        </td>
                    </tr>
                `;
            }).join('');

            // Searchable datalist to Add New Member (typing filters instantly,
            // much faster than scrolling a <select> when the resident list is large)
            let options = nonMembers.map(r => `<option value="${r.name}">${r.dob} - ${r.group}</option>`).join('');

            container.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                    <div>
                        <h4 class="font-serif text-lg font-bold text-stone-900">Quản lý Hội viên - ${association}</h4>
                        <p class="text-xs text-stone-500">Tra cứu, thêm mới hoặc loại bỏ hội viên khỏi hội nhóm.</p>
                    </div>
                </div>

                <!-- Add Member Panel -->
                <div class="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-4 text-left">
                    <h5 class="text-xs font-bold text-stone-900 uppercase tracking-wider">Thêm nhân khẩu vào ${association}</h5>
                    <div class="flex flex-col sm:flex-row gap-3 items-end">
                        <div class="flex-grow space-y-1">
                            <label class="text-[9px] uppercase font-bold text-stone-400">Tìm cư dân chưa tham gia Hội</label>
                            <input type="text" id="add-member-select" list="add-member-datalist" placeholder="Gõ để tìm cư dân..." autocomplete="off" class="w-full px-3 py-2 rounded-lg bg-white border border-stone-200 text-stone-900 text-xs outline-none focus:border-primary-500">
                            <datalist id="add-member-datalist">
                                ${options}
                            </datalist>
                        </div>
                        <button onclick="addResidentToAssoc()" class="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shrink-0">Ghi nhận Hội viên</button>
                    </div>
                </div>

                <!-- Members List -->
                <div class="space-y-3 text-left">
                    <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Danh sách Hội viên hiện hành (${members.length} người)</span>
                    <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                    <th class="p-3 font-semibold">Thành viên</th>
                                    <th class="p-3 font-semibold">Ngày sinh</th>
                                    <th class="p-3 font-semibold">Địa bàn</th>
                                    <th class="p-3 font-semibold">Số điện thoại</th>
                                    <th class="p-3 font-semibold text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-stone-200/40 text-stone-600">
                                ${rows || '<tr><td colspan="5" class="p-4 text-center text-stone-400">Chưa có hội viên nào.</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        function addResidentToAssoc() {
            const input = document.getElementById('add-member-select');
            const name = input.value.trim();
            const association = currentUser.assoc;
            const res = villageDb.residents.find(r => r.name === name && r.association !== association);

            if (!name || !res) {
                showCustomAlert('error', 'Lỗi', 'Vui lòng chọn một cư dân hợp lệ từ danh sách gợi ý.');
                return;
            }

            res.association = association;
            saveDatabase();
            addLog("Thêm hội viên", `Nhân khẩu ${res.name} được thêm vào ${association}.`, currentUser.name);
            showCustomAlert('success', 'Thành công', `Đã thêm hội viên ${res.name} thành công.`);
            renderAssociationMembers();
        }

        function removeResidentFromAssoc(resId) {
            const res = villageDb.residents.find(r => r.id === resId);
            const association = currentUser.assoc;

            if (res.name === currentUser.name) {
                showCustomAlert('error', 'Không thể thực hiện', 'Bạn không thể tự gỡ chính mình khỏi hội nhóm.');
                return;
            }

            res.association = "None";
            saveDatabase();
            addLog("Xóa hội viên", `Nhân khẩu ${res.name} bị loại khỏi ${association}.`, currentUser.name);
            showCustomAlert('info', 'Đã gỡ', `Đã gỡ nhân khẩu ${res.name} khỏi hội nhóm.`);
            renderAssociationMembers();
        }

        // Edit-member modal: only the phone number field is editable.
