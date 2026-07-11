        let editingMemberId = null;

        function openEditMemberModal(resId) {
            const res = villageDb.residents.find(r => r.id === resId);
            if (!res) return;
            editingMemberId = resId;

            document.getElementById('edit-member-name').innerText = res.name;
            document.getElementById('edit-member-phone-input').value = res.phone || '';

            const modal = document.getElementById('edit-member-modal');
            const box = document.getElementById('edit-member-modal-box');
            modal.classList.remove('hidden');
            setTimeout(() => {
                box.classList.remove('scale-95');
                box.classList.add('scale-100');
            }, 10);
        }

        function closeEditMemberModal() {
            const modal = document.getElementById('edit-member-modal');
            const box = document.getElementById('edit-member-modal-box');
            box.classList.add('scale-95');
            box.classList.remove('scale-100');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 150);
            editingMemberId = null;
        }

        function saveEditMemberModal(event) {
            event.preventDefault();
            if (!editingMemberId) return;

            const res = villageDb.residents.find(r => r.id === editingMemberId);
            const newPhone = document.getElementById('edit-member-phone-input').value.trim();

            res.phone = newPhone;
            saveDatabase();
            addLog("Cập nhật số điện thoại", `Cán bộ ${currentUser.name} cập nhật số điện thoại của ${res.name} thành "${newPhone}".`, currentUser.name);
            showCustomAlert('success', 'Đã cập nhật', `Đã lưu số điện thoại mới cho ${res.name}.`);
            closeEditMemberModal();
            renderAssociationMembers();
        }

        function renderAssociationFunds() {
            const container = document.getElementById('tab-content-container');
            const association = currentUser.assoc;
            const quota = villageDb.associationQuotas[association] || { balance: 0, txs: [] };
            const members = villageDb.residents.filter(r => r.association === association);
            const memberOptions = members.map(m => `<option value="${m.name}">`).join('');

            let rows = quota.txs.map(tx => {
                const typeBadge = tx.type === "Thu"
                    ? `<span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold">Thu</span>`
                    : `<span class="px-2 py-0.5 rounded bg-red-50 text-red-600 text-[10px] font-bold">Chi</span>`;

                return `
                    <tr class="hover:bg-stone-50 transition-colors">
                        <td class="p-3">${typeBadge}</td>
                        <td class="p-3 text-stone-600">${tx.type === 'Thu' ? (tx.member ? `${tx.member} - ${tx.desc}` : tx.desc) : tx.desc}</td>
                        <td class="p-3 font-mono text-right text-stone-900 font-bold">${tx.type === 'Thu' ? '+' : '-'}${tx.amount.toLocaleString('vi-VN')} đ</td>
                        <td class="p-3 text-stone-500 text-center font-mono">${tx.date}</td>
                        <td class="p-3 text-stone-400 text-right">${tx.officer}</td>
                    </tr>
                `;
            }).join('');

            const currentFeeObligations = (quota.feeObligations || []).filter(o => isObligationCurrentCycle(o.period));
            const totalFeeObligation = currentFeeObligations.reduce((sum, o) => sum + o.amount, 0);
            const feeObligationRows = currentFeeObligations.map(o => {
                const isConfirming = homeContentItemToDelete === o.id;
                const deleteBtn = isConfirming
                    ? `<button onclick="deleteAssocFeeObligation('${o.id}')" class="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white border border-red-500 text-[10px] font-bold"><i class="fa-solid fa-triangle-exclamation"></i> Xác nhận?</button>`
                    : `<button onclick="deleteAssocFeeObligation('${o.id}')" class="px-2.5 py-1 rounded bg-red-50 hover:bg-red-600 text-red-600 hover:text-white text-[10px] font-semibold"><i class="fa-solid fa-trash"></i> Xóa</button>`;
                return `
                    <tr class="hover:bg-stone-50 transition-colors">
                        <td class="p-3 font-semibold text-stone-900">${o.name}</td>
                        <td class="p-3 text-stone-600">${o.period}</td>
                        <td class="p-3 text-right font-mono font-bold text-primary-400">${o.amount.toLocaleString('vi-VN')} đ</td>
                        <td class="p-3 text-right space-x-2 whitespace-nowrap">
                            <button onclick="openEditAssocFeeModal('${o.id}')" class="px-2.5 py-1 rounded bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-850 text-[10px]"><i class="fa-solid fa-pen-to-square mr-1"></i> Sửa</button>
                            ${deleteBtn}
                        </td>
                    </tr>
                `;
            }).join('') || '<tr><td colspan="4" class="p-4 text-center text-stone-400">Chưa có khoản thu hội phí nào.</td></tr>';

            const pendingFeePayments = [];
            Object.keys(quota.memberFunds || {}).forEach(residentId => {
                (quota.memberFunds[residentId] || []).forEach((f, idx) => {
                    if (f.status === "Chờ duyệt") {
                        const resident = villageDb.residents.find(r => r.id === residentId);
                        pendingFeePayments.push({ residentId, fundIdx: idx, fund: f, memberName: resident ? resident.name : residentId });
                    }
                });
            });
            const pendingFeeRows = pendingFeePayments.map(p => `
                <tr class="hover:bg-stone-50 transition-colors">
                    <td class="p-3 font-bold text-stone-900">${p.memberName}</td>
                    <td class="p-3 text-stone-600">${p.fund.name}</td>
                    <td class="p-3 text-right font-mono font-bold text-blue-600">${p.fund.amount.toLocaleString('vi-VN')} đ</td>
                    <td class="p-3 font-mono text-stone-500 text-[11px]">${p.fund.date}</td>
                    <td class="p-3 text-right whitespace-nowrap space-x-1.5">
                        <button onclick="approveAssocFeePayment('${p.residentId}', ${p.fundIdx})" class="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold">Duyệt</button>
                        <button onclick="rejectAssocFeePayment('${p.residentId}', ${p.fundIdx})" class="px-2.5 py-1 rounded bg-stone-50 hover:bg-stone-100 text-stone-500 border border-stone-200 text-[10px] font-bold">Từ chối</button>
                    </td>
                </tr>
            `).join('') || '<tr><td colspan="5" class="p-4 text-center text-stone-400">Không có xác nhận chuyển khoản nào đang chờ duyệt.</td></tr>';

            container.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                    <div>
                        <h4 class="font-serif text-lg font-bold text-stone-900">Quản lý quỹ hội & Sổ sách thu chi - ${association}</h4>
                        <p class="text-xs text-stone-500">Thống kê chi tiết tài chính, tự động hóa ghi nhật ký hoạt động.</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    <div class="p-5 rounded-2xl bg-gradient-to-r from-stone-900 to-stone-950 border border-stone-200 flex flex-col justify-center">
                        <span class="text-[10px] font-bold text-primary-400 uppercase tracking-widest block">Số dư quỹ hội hiện tại</span>
                        <span class="text-2xl font-serif font-black text-stone-900 block mt-1">${quota.balance.toLocaleString('vi-VN')} đ</span>
                        <span class="text-[10px] text-stone-400 block mt-1">Hệ thống đối soát tự động của chi hội</span>
                    </div>

                    <!-- Add Transaction Form -->
                    <div class="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3 text-left">
                        <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Ghi nhận giao dịch mới</span>
                        <form onsubmit="addAssociationTransaction(event)" class="space-y-2">
                            <input type="hidden" id="tx-type" value="Thu">
                            <div class="inline-flex p-1 rounded-lg bg-white border border-stone-200">
                                <button type="button" onclick="setAssocTxType('Thu')" id="tx-type-btn-Thu" class="px-4 py-1 rounded text-xs font-bold uppercase transition-all bg-primary-600 text-white">Thu</button>
                                <button type="button" onclick="setAssocTxType('Chi')" id="tx-type-btn-Chi" class="px-4 py-1 rounded text-xs font-bold uppercase transition-all text-stone-500 hover:text-stone-900">Chi</button>
                            </div>

                            <div id="tx-thu-fields" class="space-y-2">
                                <input type="text" id="tx-member" list="tx-member-datalist" placeholder="Gõ để tìm hội viên..." autocomplete="off" class="w-full px-2 py-1.5 rounded bg-white border border-stone-200 text-stone-900 text-xs outline-none">
                                <datalist id="tx-member-datalist">
                                    ${memberOptions}
                                </datalist>

                                <span class="text-[9px] uppercase font-bold text-stone-400 block">Chọn khoản thu áp dụng</span>
                                <div class="space-y-1 max-h-32 overflow-y-auto">
                                    ${currentFeeObligations.map(o => `
                                        <label class="flex items-center justify-between gap-2 px-2 py-1.5 rounded bg-white border border-stone-200 text-xs cursor-pointer">
                                            <span class="flex items-center gap-2 text-stone-600">
                                                <input type="checkbox" class="tx-obligation-checkbox" data-amount="${o.amount}" data-name="${o.name}" onchange="updateAssocTxThuTotal()">
                                                ${o.name}
                                            </span>
                                            <span class="font-mono text-stone-500">${o.amount.toLocaleString('vi-VN')} đ</span>
                                        </label>
                                    `).join('') || '<p class="text-[11px] text-stone-400">Chưa có khoản thu nào — hãy tạo ở mục phía dưới.</p>'}
                                </div>
                                <div class="flex justify-between items-center pt-1 text-xs">
                                    <span class="text-stone-400">Tổng tiền:</span>
                                    <span id="tx-thu-total-display" class="font-mono font-bold text-emerald-600">0 đ</span>
                                </div>
                            </div>
                            <div id="tx-chi-fields" class="hidden space-y-2">
                                <input type="text" id="tx-desc" placeholder="Nội dung chi" class="w-full px-2 py-1.5 rounded bg-white border border-stone-200 text-stone-900 text-xs outline-none">
                                <input type="number" id="tx-amount" placeholder="Số tiền" class="w-full px-2 py-1.5 rounded bg-white border border-stone-200 text-stone-900 text-xs outline-none">
                            </div>

                            <button type="submit" class="w-full py-1.5 rounded bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs uppercase">Xác nhận giao dịch</button>
                        </form>
                    </div>
                </div>

                <!-- Bank account info -->
                <div class="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3 text-left">
                    <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Thông tin tài khoản ngân hàng nhận chuyển khoản</span>
                    <form onsubmit="saveAssociationBankInfo(event)" class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                        <div class="space-y-1">
                            <label class="text-[9px] uppercase font-bold text-stone-400 block">Ngân hàng</label>
                            <select id="assoc-bank-name-input" class="w-full px-3 py-2 rounded-lg bg-white border border-stone-200 text-stone-900 text-xs outline-none focus:border-primary-500">
                                <option value="">-- Chọn ngân hàng --</option>
                                ${VIETNAM_BANKS.map(b => `<option value="${b}" ${quota.bankInfo && quota.bankInfo.bankName === b ? 'selected' : ''}>${b}</option>`).join('')}
                            </select>
                        </div>
                        <div class="space-y-1">
                            <label class="text-[9px] uppercase font-bold text-stone-400 block">Số tài khoản</label>
                            <input type="text" id="assoc-bank-account-input" value="${(quota.bankInfo && quota.bankInfo.accountNumber) || ''}" class="w-full px-3 py-2 rounded-lg bg-white border border-stone-200 text-stone-900 text-xs outline-none focus:border-primary-500">
                        </div>
                        <div class="space-y-1">
                            <label class="text-[9px] uppercase font-bold text-stone-400 block">Chủ tài khoản</label>
                            <input type="text" id="assoc-bank-holder-input" value="${(quota.bankInfo && quota.bankInfo.accountHolder) || ''}" class="w-full px-3 py-2 rounded-lg bg-white border border-stone-200 text-stone-900 text-xs outline-none focus:border-primary-500">
                        </div>
                        <button type="submit" class="sm:col-span-3 w-full py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs uppercase">Lưu thông tin ngân hàng</button>
                    </form>
                </div>

                <!-- Fee obligations -->
                <div class="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3 text-left">
                    <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Tạo khoản thu hội phí mới (áp dụng cho mọi hội viên)</span>
                    <form onsubmit="createAssocFeeObligation(event)" class="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
                        <div class="space-y-1 sm:col-span-2">
                            <label class="text-[9px] uppercase font-bold text-stone-400 block">Tên khoản thu</label>
                            <input type="text" id="assoc-fee-name-input" placeholder="VD: Hội phí đợt 2 năm 2026" class="w-full px-2 py-1.5 rounded bg-white border border-stone-200 text-stone-900 text-xs outline-none">
                        </div>
                        <div class="space-y-1">
                            <label class="text-[9px] uppercase font-bold text-stone-400 block">Chu kỳ</label>
                            <select id="assoc-fee-period-input" class="w-full px-2 py-1.5 rounded bg-white border border-stone-200 text-stone-900 text-xs outline-none">${buildYearSelectOptions()}</select>
                        </div>
                        <div class="space-y-1">
                            <label class="text-[9px] uppercase font-bold text-stone-400 block">Số tiền / hội viên</label>
                            <input type="number" id="assoc-fee-amount-input" placeholder="Số tiền" class="w-full px-2 py-1.5 rounded bg-white border border-stone-200 text-stone-900 text-xs outline-none">
                        </div>
                        <button type="submit" class="sm:col-span-4 w-full py-1.5 rounded bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs uppercase">Tạo khoản thu hội phí</button>
                    </form>
                </div>

                <div class="space-y-3 text-left">
                    <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Danh sách khoản thu hội phí — Tổng mỗi hội viên phải đóng: ${totalFeeObligation.toLocaleString('vi-VN')} đ</span>
                    <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                    <th class="p-3 font-semibold">Tên khoản thu</th>
                                    <th class="p-3 font-semibold">Chu kỳ</th>
                                    <th class="p-3 font-semibold text-right">Số tiền / hội viên</th>
                                    <th class="p-3 font-semibold text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-stone-200/40 text-stone-600">${feeObligationRows}</tbody>
                        </table>
                    </div>
                </div>

                <div class="space-y-3 text-left">
                    <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Xác nhận chuyển khoản hội phí đang chờ duyệt (${pendingFeePayments.length})</span>
                    <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                    <th class="p-3 font-semibold">Hội viên</th>
                                    <th class="p-3 font-semibold">Khoản thu</th>
                                    <th class="p-3 font-semibold text-right">Số tiền</th>
                                    <th class="p-3 font-semibold">Thời gian báo</th>
                                    <th class="p-3 font-semibold text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-stone-200/40 text-stone-600">${pendingFeeRows}</tbody>
                        </table>
                    </div>
                </div>

                <!-- Ledger list -->
                <div class="space-y-3 text-left">
                    <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Nhật ký lịch sử giao dịch</span>
                    <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                    <th class="p-3 font-semibold">Phân loại</th>
                                    <th class="p-3 font-semibold">Diễn giải nội dung</th>
                                    <th class="p-3 font-semibold text-right">Số tiền</th>
                                    <th class="p-3 font-semibold text-center">Ngày thực hiện</th>
                                    <th class="p-3 font-semibold text-right">Cán bộ lập</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-stone-200/40 text-stone-600">
                                ${rows || '<tr><td colspan="5" class="p-4 text-center text-stone-400">Chưa có giao dịch phát sinh nào.</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        function setAssocTxType(type) {
            document.getElementById('tx-type').value = type;
            document.getElementById('tx-thu-fields').classList.toggle('hidden', type !== 'Thu');
            document.getElementById('tx-chi-fields').classList.toggle('hidden', type !== 'Chi');

            const activeClass = "px-4 py-1 rounded text-xs font-bold uppercase transition-all bg-primary-600 text-white";
            const inactiveClass = "px-4 py-1 rounded text-xs font-bold uppercase transition-all text-stone-500 hover:text-stone-900";
            document.getElementById('tx-type-btn-Thu').className = type === 'Thu' ? activeClass : inactiveClass;
            document.getElementById('tx-type-btn-Chi').className = type === 'Chi' ? activeClass : inactiveClass;
        }

        function updateAssocTxThuTotal() {
            const checkboxes = document.querySelectorAll('.tx-obligation-checkbox:checked');
            let total = 0;
            checkboxes.forEach(cb => { total += parseInt(cb.dataset.amount); });
            const display = document.getElementById('tx-thu-total-display');
            if (display) display.innerText = `${total.toLocaleString('vi-VN')} đ`;
        }

        function addAssociationTransaction(e) {
            e.preventDefault();
            const association = currentUser.assoc;
            const quota = villageDb.associationQuotas[association];

            const type = document.getElementById('tx-type').value;
            let amount;

            let desc = '';
            let member = undefined;
            if (type === 'Thu') {
                member = document.getElementById('tx-member').value.trim();
                const isValidMember = villageDb.residents.some(r => r.association === association && r.name === member);
                if (!member || !isValidMember) {
                    showCustomAlert('error', 'Lỗi giao dịch', 'Vui lòng chọn một hội viên hợp lệ từ danh sách gợi ý.');
                    return;
                }

                const checkedBoxes = [...document.querySelectorAll('.tx-obligation-checkbox:checked')];
                if (!checkedBoxes.length) {
                    showCustomAlert('error', 'Lỗi giao dịch', 'Vui lòng chọn ít nhất một khoản thu.');
                    return;
                }

                amount = checkedBoxes.reduce((sum, cb) => sum + parseInt(cb.dataset.amount), 0);
                const obligationNames = checkedBoxes.map(cb => cb.dataset.name);
                desc = obligationNames.join(', ');
            } else {
                desc = document.getElementById('tx-desc').value.trim();
                amount = parseInt(document.getElementById('tx-amount').value);
                if (!desc) {
                    showCustomAlert('error', 'Lỗi giao dịch', 'Vui lòng nhập nội dung chi.');
                    return;
                }
            }

            if (!amount || amount <= 0) {
                showCustomAlert('error', 'Lỗi giao dịch', 'Số tiền giao dịch phải lớn hơn 0.');
                return;
            }

            if (type === 'Chi' && amount > quota.balance) {
                showCustomAlert('error', 'Lỗi giao dịch', 'Số dư tài khoản hội không đủ để chi quỹ.');
                return;
            }

            if (type === 'Thu') quota.balance += amount;
            else quota.balance -= amount;

            const now = new Date();
            const dateStr = `${now.getDate().toString().padStart(2,'0')}/${(now.getMonth()+1).toString().padStart(2,'0')}/${now.getFullYear()}`;
            const txId = `TX-${Math.floor(100 + Math.random()*900)}`;

            const tx = { id: txId, type, desc, amount, date: dateStr, officer: currentUser.name };
            if (type === 'Thu') tx.member = member;
            quota.txs.unshift(tx);
            saveDatabase();

            addLog("Giao dịch quỹ hội", `Cán bộ ${currentUser.name} lập giao dịch ${type} số tiền ${amount.toLocaleString('vi-VN')} đ cho quỹ ${association}.`, currentUser.name);
            showCustomAlert('success', 'Giao dịch thành công', 'Nhật ký sổ sách quỹ hội đã được cập nhật.');
            renderAssociationFunds();
        }

        function saveAssociationBankInfo(event) {
            event.preventDefault();
            const association = currentUser.assoc;
            const quota = villageDb.associationQuotas[association];

            const bankName = document.getElementById('assoc-bank-name-input').value.trim();
            const accountNumber = document.getElementById('assoc-bank-account-input').value.trim();
            const accountHolder = document.getElementById('assoc-bank-holder-input').value.trim();

            if (!bankName || !accountNumber || !accountHolder) {
                showCustomAlert('error', 'Thiếu thông tin', 'Vui lòng nhập đầy đủ Ngân hàng, Số tài khoản và Chủ tài khoản.');
                return;
            }

            quota.bankInfo = { bankName, accountNumber, accountHolder };
            saveDatabase();
            addLog("Cập nhật tài khoản ngân hàng", `Cán bộ ${currentUser.name} cập nhật thông tin tài khoản ngân hàng nhận chuyển khoản của quỹ ${association}.`, currentUser.name);
            showCustomAlert('success', 'Đã lưu', 'Đã cập nhật thông tin tài khoản ngân hàng của quỹ hội.');
            renderAssociationFunds();
        }

        // Hội phí obligations mirror village-fund fundObligations, but scoped
        // per member (quota.memberFunds[residentId]) since hội phí is owed by
        // each hội viên individually, not by household.
        function createAssocFeeObligation(e) {
            e.preventDefault();
            const association = currentUser.assoc;
            const quota = villageDb.associationQuotas[association];

            const name = document.getElementById('assoc-fee-name-input').value.trim();
            const amount = parseInt(document.getElementById('assoc-fee-amount-input').value);
            const period = yearToPeriodLabel(document.getElementById('assoc-fee-period-input').value);

            if (!name) {
                showCustomAlert('error', 'Lỗi tạo khoản thu', 'Vui lòng nhập tên khoản thu.');
                return;
            }
            if (!amount || amount <= 0) {
                showCustomAlert('error', 'Lỗi tạo khoản thu', 'Số tiền phải lớn hơn 0.');
                return;
            }

            const obId = `AOB-${Math.floor(100 + Math.random()*900)}`;
            if (!quota.feeObligations) quota.feeObligations = [];
            quota.feeObligations.push({ id: obId, name, amount, period });

            const members = villageDb.residents.filter(r => r.association === association);
            if (!quota.memberFunds) quota.memberFunds = {};
            members.forEach(m => {
                if (!quota.memberFunds[m.id]) quota.memberFunds[m.id] = [];
                quota.memberFunds[m.id].push({
                    id: obId, name, period, amount, status: "Chưa đóng", date: "-",
                    memo: `HOIPHI_${m.id}_${obId}`
                });
            });

            saveDatabase();
            addLog("Tạo khoản thu hội phí", `Cán bộ ${currentUser.name} tạo khoản thu "${name}" (${amount.toLocaleString('vi-VN')} đ/hội viên) áp dụng cho toàn bộ ${members.length} hội viên của quỹ ${association}.`, currentUser.name);
            showCustomAlert('success', 'Tạo khoản thu thành công', `Đã áp dụng khoản thu "${name}" cho toàn bộ ${members.length} hội viên.`);
            renderAssociationFunds();
        }

        let editingAssocFeeId = null;
        function openEditAssocFeeModal(id) {
            const quota = villageDb.associationQuotas[currentUser.assoc];
            const ob = (quota.feeObligations || []).find(o => o.id === id);
            if (!ob) return;
            editingAssocFeeId = id;
            document.getElementById('edit-assoc-fee-name-input').value = ob.name;
            document.getElementById('edit-assoc-fee-period-input').innerHTML = buildYearSelectOptions(periodToYear(ob.period));
            document.getElementById('edit-assoc-fee-amount-input').value = ob.amount;
            openModalEl('edit-assoc-fee-modal', 'edit-assoc-fee-modal-box');
        }
        function closeEditAssocFeeModal() { closeModalEl('edit-assoc-fee-modal', 'edit-assoc-fee-modal-box'); editingAssocFeeId = null; }
        function saveEditAssocFee(event) {
            event.preventDefault();
            const quota = villageDb.associationQuotas[currentUser.assoc];
            const ob = (quota.feeObligations || []).find(o => o.id === editingAssocFeeId);
            if (!ob) return;

            const name = document.getElementById('edit-assoc-fee-name-input').value.trim();
            const period = yearToPeriodLabel(document.getElementById('edit-assoc-fee-period-input').value);
            const amount = parseInt(document.getElementById('edit-assoc-fee-amount-input').value);

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

            // Keep every member's still-unpaid entry for this fee in sync;
            // entries already marked "Đã đóng" stay untouched as history.
            Object.keys(quota.memberFunds || {}).forEach(residentId => {
                const entry = (quota.memberFunds[residentId] || []).find(f => f.id === ob.id && f.status !== "Đã đóng");
                if (entry) { entry.name = name; entry.period = period; entry.amount = amount; }
            });

            saveDatabase();
            addLog("Sửa khoản thu hội phí", `Cán bộ ${currentUser.name} cập nhật khoản thu "${name}".`, currentUser.name);
            showCustomAlert('success', 'Đã lưu', `Đã cập nhật khoản thu "${name}".`);
            closeEditAssocFeeModal();
            renderAssociationFunds();
        }
        function deleteAssocFeeObligation(id) {
            const quota = villageDb.associationQuotas[currentUser.assoc];
            if (homeContentItemToDelete !== id) {
                homeContentItemToDelete = id;
                showCustomAlert('info', 'Xác nhận xóa', 'Nhấn "Xác nhận?" một lần nữa để xóa khoản thu này.');
                renderAssociationFunds();
                return;
            }
            const ob = (quota.feeObligations || []).find(o => o.id === id);
            if (!ob) return;

            quota.feeObligations = quota.feeObligations.filter(o => o.id !== id);
            Object.keys(quota.memberFunds || {}).forEach(residentId => {
                quota.memberFunds[residentId] = (quota.memberFunds[residentId] || []).filter(f => f.id !== id);
            });
            homeContentItemToDelete = null;

            saveDatabase();
            addLog("Xóa khoản thu hội phí", `Cán bộ ${currentUser.name} xóa khoản thu "${ob.name}" khỏi toàn bộ hội viên.`, currentUser.name);
            showCustomAlert('info', 'Đã xóa', `Đã xóa khoản thu "${ob.name}".`);
            renderAssociationFunds();
        }

        function approveAssocFeePayment(residentId, fundIdx) {
            const association = currentUser.assoc;
            const quota = villageDb.associationQuotas[association];
            const fund = quota.memberFunds[residentId][fundIdx];
            if (!fund || fund.status !== "Chờ duyệt") return;

            fund.status = "Đã đóng";
            quota.balance += fund.amount;

            const resident = villageDb.residents.find(r => r.id === residentId);
            const memberName = resident ? resident.name : residentId;
            quota.txs.unshift({
                id: `TX-${Math.floor(100 + Math.random()*900)}`, type: "Thu", desc: fund.name,
                member: memberName, amount: fund.amount, date: fund.date, officer: currentUser.name
            });

            saveDatabase();
            addLog("Duyệt thanh toán hội phí", `Cán bộ ${currentUser.name} duyệt xác nhận chuyển khoản ${fund.amount.toLocaleString('vi-VN')} đ của ${memberName} cho quỹ ${association}.`, currentUser.name);
            showCustomAlert('success', 'Đã duyệt', `Đã xác nhận khoản hội phí "${fund.name}" của ${memberName}.`);
            renderAssociationFunds();
        }

        function rejectAssocFeePayment(residentId, fundIdx) {
            const association = currentUser.assoc;
            const quota = villageDb.associationQuotas[association];
            const fund = quota.memberFunds[residentId][fundIdx];
            if (!fund || fund.status !== "Chờ duyệt") return;

            const resident = villageDb.residents.find(r => r.id === residentId);
            const memberName = resident ? resident.name : residentId;
            fund.status = "Chưa đóng";
            fund.date = "-";

            saveDatabase();
            addLog("Từ chối thanh toán hội phí", `Cán bộ ${currentUser.name} từ chối xác nhận chuyển khoản của ${memberName} cho quỹ ${association}.`, currentUser.name);
            showCustomAlert('info', 'Đã từ chối', `Đã từ chối xác nhận chuyển khoản của ${memberName}, hội viên cần chuyển khoản và xác nhận lại.`);
            renderAssociationFunds();
        }

        // -----------------------------------------------------------------------------------
        // Vay Vốn Hội Viên (member loans): a loan is recorded as a Chi (expense) from the
        // association fund; when repaid, principal + interest is auto-computed and recorded
        // as a Thu (income) transaction.
        // -----------------------------------------------------------------------------------
        function renderAssociationLoans() {
            const container = document.getElementById('tab-content-container');
            const association = currentUser.assoc;
            const quota = villageDb.associationQuotas[association] || { balance: 0, txs: [], loans: [] };
            if (!quota.loans) quota.loans = [];

            const members = villageDb.residents.filter(r => r.association === association);
            const memberOptions = members.map(m => `<option value="${m.name}">`).join('');

            const loanRows = quota.loans.map(loan => {
                const interest = Math.round(loan.amount * loan.interestRate / 100);
                const total = loan.amount + interest;
                const statusBadge = loan.status === 'Đã hoàn thành'
                    ? `<span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold">Đã hoàn thành</span>`
                    : `<span class="px-2 py-0.5 rounded bg-amber-50 text-amber-600 text-[10px] font-bold">Đang vay</span>`;
                const completeBtn = loan.status === 'Đã hoàn thành'
                    ? `<span class="text-stone-400 font-mono text-[10px]">${loan.completedDate}</span>`
                    : `<button onclick="completeMemberLoan('${loan.id}')" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] uppercase transition-all shadow-md">Xác nhận đã đóng lãi + gốc</button>`;

                const isConfirmingDelete = loanToDelete === loan.id;
                const deleteBtn = isConfirmingDelete
                    ? `<button onclick="deleteMemberLoan('${loan.id}')" class="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white border border-red-500 text-[11px] font-bold"><i class="fa-solid fa-triangle-exclamation"></i> Xác nhận xóa?</button>`
                    : `<button onclick="deleteMemberLoan('${loan.id}')" class="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-600 text-red-600 hover:text-white text-[11px] font-semibold"><i class="fa-solid fa-trash"></i> Xóa</button>`;

                return `
                    <tr class="hover:bg-stone-50 transition-colors">
                        <td class="p-3 font-bold text-stone-900">${loan.member}</td>
                        <td class="p-3 font-mono text-right text-stone-600">${loan.amount.toLocaleString('vi-VN')} đ</td>
                        <td class="p-3 text-center text-stone-600">${loan.interestRate}%</td>
                        <td class="p-3 text-center text-stone-600">${loan.termMonths} tháng</td>
                        <td class="p-3 font-mono text-right text-stone-500">${total.toLocaleString('vi-VN')} đ</td>
                        <td class="p-3 text-center">${statusBadge}</td>
                        <td class="p-3 text-right space-x-2 whitespace-nowrap">${completeBtn}${deleteBtn}</td>
                    </tr>
                `;
            }).join('') || '<tr><td colspan="7" class="p-4 text-center text-stone-400">Chưa có khoản vay nào.</td></tr>';

            container.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                    <div>
                        <h4 class="font-serif text-lg font-bold text-stone-900">Vay Vốn Hội Viên - ${association}</h4>
                        <p class="text-xs text-stone-500">Hội viên vay vốn từ quỹ hội; khoản vay tính vào Chi, khi hoàn thành gốc + lãi tự động tính vào Thu.</p>
                    </div>
                </div>

                <!-- Create Loan Form -->
                <div class="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3 text-left">
                    <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Lập khoản vay mới</span>
                    <form onsubmit="createMemberLoan(event)" class="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
                        <div class="space-y-1">
                            <label class="text-[9px] uppercase font-bold text-stone-400 block">Thành viên</label>
                            <input type="text" id="loan-member" list="loan-member-datalist" placeholder="Gõ để tìm hội viên..." autocomplete="off" class="w-full px-2 py-1.5 rounded bg-white border border-stone-200 text-stone-900 text-xs outline-none">
                            <datalist id="loan-member-datalist">
                                ${memberOptions}
                            </datalist>
                        </div>
                        <div class="space-y-1">
                            <label class="text-[9px] uppercase font-bold text-stone-400 block">Số tiền vay</label>
                            <input type="number" id="loan-amount" placeholder="Số tiền" required class="w-full px-2 py-1.5 rounded bg-white border border-stone-200 text-stone-900 text-xs outline-none">
                        </div>
                        <div class="space-y-1">
                            <label class="text-[9px] uppercase font-bold text-stone-400 block">Lãi suất (%)</label>
                            <input type="number" id="loan-rate" placeholder="VD: 5" required class="w-full px-2 py-1.5 rounded bg-white border border-stone-200 text-stone-900 text-xs outline-none">
                        </div>
                        <div class="space-y-1">
                            <label class="text-[9px] uppercase font-bold text-stone-400 block">Thời hạn (tháng)</label>
                            <input type="number" id="loan-term" placeholder="VD: 6" required class="w-full px-2 py-1.5 rounded bg-white border border-stone-200 text-stone-900 text-xs outline-none">
                        </div>
                        <button type="submit" class="sm:col-span-4 w-full py-1.5 rounded bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs uppercase">Lập khoản vay (tính vào Chi)</button>
                    </form>
                </div>

                <!-- Loans list -->
                <div class="space-y-3 text-left">
                    <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Danh sách khoản vay</span>
                    <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                    <th class="p-3 font-semibold">Thành viên</th>
                                    <th class="p-3 font-semibold text-right">Số tiền vay</th>
                                    <th class="p-3 font-semibold text-center">Lãi suất</th>
                                    <th class="p-3 font-semibold text-center">Thời hạn</th>
                                    <th class="p-3 font-semibold text-right">Gốc + lãi phải trả</th>
                                    <th class="p-3 font-semibold text-center">Trạng thái</th>
                                    <th class="p-3 font-semibold text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-stone-200/40 text-stone-600">
                                ${loanRows}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        function createMemberLoan(e) {
            e.preventDefault();
            const association = currentUser.assoc;
            const quota = villageDb.associationQuotas[association];
            if (!quota.loans) quota.loans = [];

            const member = document.getElementById('loan-member').value.trim();
            const amount = parseInt(document.getElementById('loan-amount').value);
            const interestRate = parseFloat(document.getElementById('loan-rate').value);
            const termMonths = parseInt(document.getElementById('loan-term').value);

            const isValidMember = villageDb.residents.some(r => r.association === association && r.name === member);
            if (!member || !isValidMember) {
                showCustomAlert('error', 'Lỗi lập vay', 'Vui lòng chọn một hội viên hợp lệ từ danh sách gợi ý.');
                return;
            }
            if (!amount || amount <= 0) {
                showCustomAlert('error', 'Lỗi lập vay', 'Số tiền vay phải lớn hơn 0.');
                return;
            }
            if (amount > quota.balance) {
                showCustomAlert('error', 'Lỗi lập vay', 'Số dư quỹ hội không đủ để giải ngân khoản vay này.');
                return;
            }

            const now = new Date();
            const dateStr = `${now.getDate().toString().padStart(2,'0')}/${(now.getMonth()+1).toString().padStart(2,'0')}/${now.getFullYear()}`;
            const loanId = `LOAN-${Math.floor(100 + Math.random()*900)}`;

            // The disbursed loan counts as a Chi (expense) from the association fund.
            const disburseTxId = `TX-${Math.floor(100 + Math.random()*900)}`;
            quota.txs.unshift({ id: disburseTxId, type: "Chi", desc: `Giải ngân cho ${member} vay vốn`, amount, date: dateStr, officer: currentUser.name });
            quota.balance -= amount;

            quota.loans.unshift({
                id: loanId, member, amount, interestRate, termMonths,
                status: "Đang vay", date: dateStr, completedDate: null,
                disburseTxId, completeTxId: null
            });

            saveDatabase();
            addLog("Lập khoản vay", `Cán bộ ${currentUser.name} giải ngân ${amount.toLocaleString('vi-VN')} đ cho ${member} vay, lãi suất ${interestRate}%, thời hạn ${termMonths} tháng.`, currentUser.name);
            showCustomAlert('success', 'Lập khoản vay thành công', `Đã ghi nhận khoản vay và tính vào Chi của quỹ hội.`);
            renderAssociationLoans();
        }

        function completeMemberLoan(loanId) {
            const association = currentUser.assoc;
            const quota = villageDb.associationQuotas[association];
            const loan = quota.loans.find(l => l.id === loanId);
            if (!loan || loan.status === 'Đã hoàn thành') return;

            const interest = Math.round(loan.amount * loan.interestRate / 100);
            const total = loan.amount + interest;

            const now = new Date();
            const dateStr = `${now.getDate().toString().padStart(2,'0')}/${(now.getMonth()+1).toString().padStart(2,'0')}/${now.getFullYear()}`;

            loan.status = "Đã hoàn thành";
            loan.completedDate = dateStr;

            const completeTxId = `TX-${Math.floor(100 + Math.random()*900)}`;
            quota.txs.unshift({ id: completeTxId, type: "Thu", desc: `Gốc + lãi`, member: loan.member, amount: total, date: dateStr, officer: currentUser.name });
            quota.balance += total;
            loan.completeTxId = completeTxId;

            saveDatabase();
            addLog("Hoàn thành khoản vay", `${loan.member} đã đóng đủ gốc và lãi ${total.toLocaleString('vi-VN')} đ cho quỹ ${association}.`, currentUser.name);
            showCustomAlert('success', 'Hoàn thành khoản vay', `${loan.member} đã đóng lãi, tự động tính gốc ${loan.amount.toLocaleString('vi-VN')} đ + lãi ${interest.toLocaleString('vi-VN')} đ vào khoản thu.`);
            renderAssociationLoans();
        }

        // Deletes a mistakenly-created loan, reversing whichever transactions it
        // generated (the disbursement Chi, and the repayment Thu if already completed)
        // so the association balance stays consistent.
        let loanToDelete = null;
        function deleteMemberLoan(loanId) {
            if (loanToDelete !== loanId) {
                loanToDelete = loanId;
                showCustomAlert('info', 'Xác nhận xóa', 'Nhấn "Xác nhận xóa?" một lần nữa trên khoản vay này để xóa.');
                renderAssociationLoans();
                return;
            }

            const association = currentUser.assoc;
            const quota = villageDb.associationQuotas[association];
            const loan = quota.loans.find(l => l.id === loanId);
            if (!loan) return;

            // Prefer matching by the stored transaction id; fall back to matching by
            // description + amount for loans created before this id tracking existed.
            let disburseTx = loan.disburseTxId ? quota.txs.find(t => t.id === loan.disburseTxId) : null;
            if (!disburseTx) {
                disburseTx = quota.txs.find(t => t.type === 'Chi' && t.amount === loan.amount && t.desc === `Giải ngân cho ${loan.member} vay vốn`);
            }
            if (disburseTx) {
                quota.balance += disburseTx.amount;
                quota.txs = quota.txs.filter(t => t !== disburseTx);
            }

            let completeTx = loan.completeTxId ? quota.txs.find(t => t.id === loan.completeTxId) : null;
            if (!completeTx && loan.status === 'Đã hoàn thành') {
                const interest = Math.round(loan.amount * loan.interestRate / 100);
                const total = loan.amount + interest;
                completeTx = quota.txs.find(t => t.type === 'Thu' && t.amount === total && t.desc === `${loan.member} đã đóng lãi`);
            }
            if (completeTx) {
                quota.balance -= completeTx.amount;
                quota.txs = quota.txs.filter(t => t !== completeTx);
            }

            quota.loans = quota.loans.filter(l => l.id !== loanId);
            loanToDelete = null;

            saveDatabase();
            addLog("Xóa khoản vay", `Cán bộ ${currentUser.name} xóa khoản vay của ${loan.member} và hoàn tác các giao dịch liên quan.`, currentUser.name);
            showCustomAlert('info', 'Đã xóa khoản vay', `Đã xóa khoản vay của ${loan.member} và hoàn tác các giao dịch liên quan trong quỹ hội.`);
            renderAssociationLoans();
        }

        // -----------------------------------------------------------------------------------
        // 3. TRƯỞNG THÔN TABS RENDERERS & LOGIC
        // -----------------------------------------------------------------------------------
