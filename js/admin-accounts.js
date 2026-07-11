        function renderAdminDuyệtXóa() {
            const container = document.getElementById('tab-content-container');
            let pendingRequests = villageDb.deleteRequests.filter(req => req.status === 'Chờ duyệt');

            let rows = pendingRequests.map(req => `
                <tr class="hover:bg-stone-50 transition-colors">
                    <td class="p-3 font-bold text-stone-900 text-xs">${req.residentName}</td>
                    <td class="p-3 text-red-600 font-medium text-xs">${req.reason}</td>
                    <td class="p-3 text-stone-500 font-mono text-[11px]">${req.time}</td>
                    <td class="p-3 text-stone-600 font-medium text-xs">${req.submittedBy}</td>
                    <td class="p-3 text-right space-x-2">
                        <button onclick="approveDeleteRequest('${req.id}')" class="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all">Duyệt xóa</button>
                        <button onclick="rejectDeleteRequest('${req.id}')" class="px-3 py-1 rounded bg-stone-50 hover:bg-stone-100 text-stone-500 border border-stone-200 text-[11px] font-bold transition-all">Từ chối</button>
                    </td>
                </tr>
            `).join('');

            const pendingMemberRequests = villageDb.memberEditRequests.filter(req => req.status === 'Chờ duyệt');
            let memberRows = pendingMemberRequests.map(req => {
                const changeSummary = EDITABLE_MEMBER_FIELDS
                    .filter(f => String(req.newValues[f.key]) !== String(req.oldValues[f.key] || ''))
                    .map(f => `<div><span class="text-stone-400">${f.label}:</span> <span class="text-stone-500">"${req.oldValues[f.key] || ''}"</span> → <span class="text-primary-400 font-semibold">"${req.newValues[f.key]}"</span></div>`)
                    .join('');

                return `
                    <tr class="hover:bg-stone-50 transition-colors">
                        <td class="p-3 font-bold text-stone-900 text-xs align-top">${req.residentName}</td>
                        <td class="p-3 text-xs align-top space-y-0.5">${changeSummary}</td>
                        <td class="p-3 text-stone-500 font-mono text-[11px] align-top">${req.time}</td>
                        <td class="p-3 text-stone-600 font-medium text-xs align-top">${req.submittedBy}</td>
                        <td class="p-3 text-right space-x-2 align-top whitespace-nowrap">
                            <button onclick="approveMemberEditRequest('${req.id}')" class="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all">Duyệt</button>
                            <button onclick="rejectMemberEditRequest('${req.id}')" class="px-3 py-1 rounded bg-stone-50 hover:bg-stone-100 text-stone-500 border border-stone-200 text-[11px] font-bold transition-all">Từ chối</button>
                        </td>
                    </tr>
                `;
            }).join('');

            const pendingNewMemberRequests = villageDb.newMemberRequests.filter(req => req.status === 'Chờ duyệt');
            let newMemberRows = pendingNewMemberRequests.map(req => `
                <tr class="hover:bg-stone-50 transition-colors">
                    <td class="p-3 font-bold text-stone-900 text-xs">${req.name}</td>
                    <td class="p-3 text-stone-600 text-xs">${req.relation}</td>
                    <td class="p-3 font-mono text-stone-500 text-xs">${req.dob}</td>
                    <td class="p-3 font-mono text-stone-500 text-xs">${req.familyId}</td>
                    <td class="p-3 text-stone-500 font-mono text-[11px]">${req.time}</td>
                    <td class="p-3 text-stone-600 font-medium text-xs">${req.submittedBy}</td>
                    <td class="p-3 text-right space-x-2 whitespace-nowrap">
                        <button onclick="approveNewMemberRequest('${req.id}')" class="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all">Duyệt</button>
                        <button onclick="rejectNewMemberRequest('${req.id}')" class="px-3 py-1 rounded bg-stone-50 hover:bg-stone-100 text-stone-500 border border-stone-200 text-[11px] font-bold transition-all">Từ chối</button>
                    </td>
                </tr>
            `).join('');

            container.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                    <div>
                        <h4 class="font-serif text-lg font-bold text-stone-900">Kiểm duyệt & Phê duyệt yêu cầu xóa dữ liệu</h4>
                        <p class="text-xs text-stone-500">Kiểm tra thông tin đệ trình từ Trưởng thôn và đưa ra quyết định phê duyệt tối cao.</p>
                    </div>
                </div>

                <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50 text-left">
                    <table class="w-full text-left text-xs">
                        <thead>
                            <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                <th class="p-3 font-semibold">Nhân khẩu đề nghị</th>
                                <th class="p-3 font-semibold">Lý do đính kèm</th>
                                <th class="p-3 font-semibold">Thời gian lập</th>
                                <th class="p-3 font-semibold">Đơn vị đề xuất</th>
                                <th class="p-3 font-semibold text-right">Phê duyệt tối cao</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-stone-200/40 text-stone-600">
                            ${rows || '<tr><td colspan="5" class="p-4 text-center text-stone-400">Hiện không có yêu cầu xóa dữ liệu nào chờ phê duyệt.</td></tr>'}
                        </tbody>
                    </table>
                </div>

                <div class="space-y-3 text-left pt-6 border-t border-stone-200">
                    <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Yêu cầu sửa thông tin nhân khẩu</span>
                    <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                    <th class="p-3 font-semibold">Nhân khẩu</th>
                                    <th class="p-3 font-semibold">Thay đổi đề nghị</th>
                                    <th class="p-3 font-semibold">Thời gian lập</th>
                                    <th class="p-3 font-semibold">Người đề xuất</th>
                                    <th class="p-3 font-semibold text-right">Phê duyệt</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-stone-200/40 text-stone-600">
                                ${memberRows || '<tr><td colspan="5" class="p-4 text-center text-stone-400">Hiện không có yêu cầu sửa thông tin nào chờ phê duyệt.</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="space-y-3 text-left pt-6 border-t border-stone-200">
                    <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Yêu cầu thêm thành viên mới</span>
                    <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                    <th class="p-3 font-semibold">Họ và tên</th>
                                    <th class="p-3 font-semibold">Quan hệ</th>
                                    <th class="p-3 font-semibold">Ngày sinh</th>
                                    <th class="p-3 font-semibold">Hộ</th>
                                    <th class="p-3 font-semibold">Thời gian lập</th>
                                    <th class="p-3 font-semibold">Người đề xuất</th>
                                    <th class="p-3 font-semibold text-right">Phê duyệt</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-stone-200/40 text-stone-600">
                                ${newMemberRows || '<tr><td colspan="7" class="p-4 text-center text-stone-400">Hiện không có yêu cầu thêm thành viên nào chờ phê duyệt.</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        function approveNewMemberRequest(reqId) {
            const req = villageDb.newMemberRequests.find(r => r.id === reqId);
            req.status = "Đã duyệt";

            const newId = `CD-${Math.floor(100 + Math.random()*900)}`;
            const newResident = {
                id: newId, name: req.name, dob: req.dob, cccd: req.cccd || "Chưa cấp", phone: req.phone || "",
                relation: req.relation, group: req.group || "Chưa xác định", association: "None",
                isHouseholder: false, familyId: req.familyId,
                fatherName: req.fatherName || "", motherName: req.motherName || "",
                permanentAddress: req.permanentAddress || "", temporaryAddress: req.temporaryAddress || ""
            };
            villageDb.residents.push(newResident);

            // Mỗi cư dân có đúng một tài khoản: tự động cấp tài khoản "Cư dân"
            // (tên đăng nhập = Căn Cước) ngay khi hồ sơ được duyệt, thay vì để
            // Admin phải tạo tài khoản thủ công.
            const accountCreated = createResidentAccount(newResident);

            saveDatabase();
            addLog("Phê duyệt thêm thành viên", `Admin phê duyệt thêm thành viên mới "${req.name}" (${req.relation}) vào hộ ${req.familyId}.`, "Admin");
            showCustomAlert('success', 'Phê duyệt hoàn tất', `Đã thêm thành viên "${req.name}" vào hồ sơ nhân khẩu.${accountCreated ? ' Đã tự động cấp tài khoản đăng nhập.' : ' Chưa có Căn Cước hợp lệ nên tài khoản sẽ được cấp sau khi cập nhật Căn Cước.'}`);
            renderAdminDuyệtXóa();
        }

        function rejectNewMemberRequest(reqId) {
            const req = villageDb.newMemberRequests.find(r => r.id === reqId);
            req.status = "Từ chối";
            saveDatabase();

            addLog("Từ chối yêu cầu thêm thành viên", `Admin từ chối yêu cầu thêm thành viên "${req.name}" vào hộ ${req.familyId}.`, "Admin");
            showCustomAlert('info', 'Đã từ chối', `Đã từ chối yêu cầu thêm thành viên "${req.name}".`);
            renderAdminDuyệtXóa();
        }

        function approveMemberEditRequest(reqId) {
            const req = villageDb.memberEditRequests.find(r => r.id === reqId);
            const res = villageDb.residents.find(r => r.id === req.residentId);

            req.status = "Đã duyệt";
            if (res) {
                EDITABLE_MEMBER_FIELDS.forEach(f => { res[f.key] = req.newValues[f.key]; });
            }
            saveDatabase();

            addLog("Phê duyệt sửa thông tin", `Admin phê duyệt thay đổi thông tin của ${req.residentName}.`, "Admin");
            showCustomAlert('success', 'Phê duyệt hoàn tất', `Đã cập nhật thông tin mới cho ${req.residentName}.`);
            renderAdminDuyệtXóa();
        }

        function rejectMemberEditRequest(reqId) {
            const req = villageDb.memberEditRequests.find(r => r.id === reqId);
            req.status = "Từ chối";
            saveDatabase();

            addLog("Từ chối yêu cầu sửa thông tin", `Admin từ chối yêu cầu sửa thông tin của ${req.residentName}.`, "Admin");
            showCustomAlert('info', 'Đã từ chối', `Đã từ chối yêu cầu sửa thông tin của ${req.residentName}.`);
            renderAdminDuyệtXóa();
        }

        function approveDeleteRequest(reqId) {
            const req = villageDb.deleteRequests.find(r => r.id === reqId);
            req.status = "Đã duyệt";

            const idx = villageDb.residents.findIndex(r => r.id === req.residentId);
            if (idx !== -1) {
                const resName = villageDb.residents[idx].name;
                villageDb.residents.splice(idx, 1);

                // Giữ số tài khoản luôn khớp với số cư dân: gỡ luôn tài khoản
                // gắn với nhân khẩu vừa bị xóa (nếu có).
                const accIdx = villageDb.accounts.findIndex(a => a.name === resName);
                if (accIdx !== -1) villageDb.accounts.splice(accIdx, 1);

                saveDatabase();
                addLog("Phê duyệt xóa", `Admin phê duyệt yêu cầu xóa nhân khẩu ${resName} khỏi hệ thống dữ liệu.`, "Admin");
                showCustomAlert('success', 'Phê duyệt hoàn tất', `Nhân khẩu ${resName} đã được gỡ khỏi cơ sở dữ liệu Thôn.`);
            }
            renderAdminDuyệtXóa();
        }

        function rejectDeleteRequest(reqId) {
            const req = villageDb.deleteRequests.find(r => r.id === reqId);
            req.status = "Từ chối";
            saveDatabase();

            addLog("Từ chối yêu cầu xóa", `Admin từ chối đề xuất xóa cư dân ${req.residentName}.`, "Admin");
            showCustomAlert('info', 'Đã từ chối', `Đã từ chối đơn đề nghị xóa nhân khẩu ${req.residentName}.`);
            renderAdminDuyệtXóa();
        }

        function renderAdminQuảnLýHội() {
            const container = document.getElementById('tab-content-container');
            
            let assocList = Object.keys(villageDb.associationQuotas).map(name => {
                const q = villageDb.associationQuotas[name];
                const count = villageDb.residents.filter(r => r.association === name).length;
                const leaderAcc = villageDb.accounts.find(a => a.role === 'Cán bộ Hội' && a.assoc === name);

                let nameField = '';
                if (editingAssocName === name) {
                    nameField = `
                        <div class="flex items-center gap-2">
                            <input type="text" id="edit-assoc-input-${name.replace(/\s+/g, '-')}" value="${name}" class="px-2 py-1 rounded bg-white border border-stone-200 text-stone-900 text-xs outline-none focus:border-primary-500">
                            <button onclick="saveAssocName('${name}')" class="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold"><i class="fa-solid fa-check"></i> Lưu</button>
                            <button onclick="cancelEditAssocName()" class="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-500 rounded text-[10px] font-bold">Hủy</button>
                        </div>
                    `;
                } else {
                    nameField = `
                        <span class="font-bold text-stone-900 text-sm">${name}</span>
                    `;
                }

                const isConfirming = assocToDelete === name;
                const deleteBtn = isConfirming
                    ? `<button onclick="confirmDeleteAssoc('${name}')" class="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white border border-red-500 text-[10px] font-bold"><i class="fa-solid fa-triangle-exclamation"></i> Xác nhận xóa?</button>`
                    : `<button onclick="confirmDeleteAssoc('${name}')" class="px-2.5 py-1 rounded bg-red-50 hover:bg-red-600 text-red-600 hover:text-white text-[10px] font-semibold"><i class="fa-solid fa-trash"></i> Xóa hội</button>`;

                return `
                    <tr class="hover:bg-stone-50 transition-colors">
                        <td class="p-4">${nameField}</td>
                        <td class="p-4 text-primary-400 font-semibold text-xs">${leaderAcc ? leaderAcc.name : ''}</td>
                        <td class="p-4 text-stone-600 font-semibold text-xs">${count} hội viên</td>
                        <td class="p-4 font-mono text-emerald-600 font-bold">${q.balance.toLocaleString('vi-VN')} đ</td>
                        <td class="p-4 text-right space-x-2">
                            ${editingAssocName !== name ? `<button onclick="startEditAssocName('${name}')" class="px-2.5 py-1 rounded bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-850 text-[10px] font-semibold"><i class="fa-solid fa-pen-to-square"></i> Đổi tên</button>` : ''}
                            ${deleteBtn}
                        </td>
                    </tr>
                `;
            }).join('');

            container.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                    <div>
                        <h4 class="font-serif text-lg font-bold text-stone-900">Quản Lý Danh Sách Hội Đoàn Thể Toàn Thôn</h4>
                        <p class="text-xs text-stone-500">Thiết lập cấu trúc hoạt động, tạo mới, sửa tên hoặc xóa giải thể các chi hội đoàn thể.</p>
                    </div>
                </div>

                <!-- Create New Association Card -->
                <div class="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-left space-y-4">
                    <h5 class="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                        <i class="fa-solid fa-folder-plus text-primary-400"></i>
                        <span>Thành Lập Chi Hội Mới</span>
                    </h5>
                    <form onsubmit="handleCreateAssoc(event)" class="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                        <div class="space-y-1">
                            <label class="text-[9px] uppercase font-bold text-stone-400 block">Tên chi hội đoàn thể mới</label>
                            <input type="text" id="new-assoc-name" required placeholder="Ví dụ: Chi hội Khuyến học" class="w-full px-3 py-2 rounded-lg bg-white border border-stone-200 text-stone-900 text-xs outline-none focus:border-primary-500">
                        </div>
                        <div class="space-y-1">
                            <label class="text-[9px] uppercase font-bold text-stone-400 block">Số dư ngân quỹ ban đầu (đ)</label>
                            <input type="number" id="new-assoc-balance" required placeholder="0" class="w-full px-3 py-2 rounded-lg bg-white border border-stone-200 text-stone-900 text-xs outline-none focus:border-primary-500">
                        </div>
                        <button type="submit" class="w-full py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs uppercase transition-colors">Kích hoạt chi hội</button>
                    </form>
                    <p class="text-[11px] text-stone-400">Hội trưởng sẽ được gán khi tạo tài khoản Cán bộ Hội ở tab "Quản lý Tài khoản".</p>
                </div>

                <!-- Associations Table -->
                <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50 text-left">
                    <table class="w-full text-left text-xs">
                        <thead>
                            <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                <th class="p-4 font-semibold">Tên chi hội đoàn thể</th>
                                <th class="p-4 font-semibold">Hội trưởng</th>
                                <th class="p-4 font-semibold">Số lượng hội viên</th>
                                <th class="p-4 font-semibold">Ngân quỹ hiện có</th>
                                <th class="p-4 font-semibold text-right">Quản lý cấu trúc</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-stone-200/40 text-stone-600">
                            ${assocList || '<tr><td colspan="5" class="p-4 text-center text-stone-400">Chưa có chi hội nào trong hệ thống.</td></tr>'}
                        </tbody>
                    </table>
                </div>
            `;
        }

        function handleCreateAssoc(e) {
            e.preventDefault();
            const name = document.getElementById('new-assoc-name').value.trim();
            const balance = parseInt(document.getElementById('new-assoc-balance').value) || 0;

            if (!name) return;
            if (villageDb.associationQuotas[name]) {
                showCustomAlert('error', 'Lỗi thiết lập', 'Tên chi hội này đã tồn tại trên hệ thống.');
                return;
            }

            villageDb.associationQuotas[name] = { balance: balance, txs: [], loans: [] };
            saveDatabase();

            addLog("Tạo chi hội mới", `Admin thành lập chi hội mới "${name}" với số dư ban đầu ${balance.toLocaleString('vi-VN')} đ.`, "Admin");
            showCustomAlert('success', 'Tạo hội thành công', `Đã đăng ký hoạt động chi hội "${name}" thành công. Hãy tạo tài khoản Cán bộ Hội phụ trách ở tab Quản lý Tài khoản.`);
            renderAdminQuảnLýHội();
        }

        function startEditAssocName(name) {
            editingAssocName = name;
            renderAdminQuảnLýHội();
        }

        function cancelEditAssocName() {
            editingAssocName = null;
            renderAdminQuảnLýHội();
        }

        function saveAssocName(oldName) {
            const inputId = `edit-assoc-input-${oldName.replace(/\s+/g, '-')}`;
            const newName = document.getElementById(inputId).value.trim();

            if (!newName) return;
            if (newName === oldName) {
                editingAssocName = null;
                renderAdminQuảnLýHội();
                return;
            }

            if (villageDb.associationQuotas[newName]) {
                showCustomAlert('error', 'Trùng tên chi hội', 'Tên chi hội mới bị trùng với một hội đang hoạt động.');
                return;
            }

            // Copy balances and log history
            villageDb.associationQuotas[newName] = villageDb.associationQuotas[oldName];
            delete villageDb.associationQuotas[oldName];

            // Re-map resident associations
            villageDb.residents.forEach(r => {
                if (r.association === oldName) {
                    r.association = newName;
                }
            });

            // Keep any Cán bộ Hội accounts pointed at this hội in sync with the new name
            villageDb.accounts.forEach(a => {
                if (a.assoc === oldName) a.assoc = newName;
            });

            editingAssocName = null;
            saveDatabase();
            addLog("Thay đổi tên chi hội", `Admin đổi tên chi hội từ "${oldName}" sang "${newName}".`, "Admin");
            showCustomAlert('success', 'Đổi tên thành công', `Tên chi hội đã đổi thành công sang "${newName}".`);
            renderAdminQuảnLýHội();
        }

        function confirmDeleteAssoc(name) {
            if (assocToDelete === name) {
                delete villageDb.associationQuotas[name];

                // Detach members to 'None'
                villageDb.residents.forEach(r => {
                    if (r.association === name) {
                        r.association = "None";
                    }
                });

                // Clear any Cán bộ Hội accounts left pointing at the dissolved hội
                villageDb.accounts.forEach(a => {
                    if (a.assoc === name) a.assoc = undefined;
                });

                assocToDelete = null;
                saveDatabase();
                addLog("Giải thể chi hội", `Admin giải thể và xóa vĩnh viễn chi hội "${name}" khỏi hệ thống.`, "Admin");
                showCustomAlert('success', 'Giải thể chi hội', `Chi hội "${name}" đã được giải thể và gỡ liên kết hội viên.`);
                renderAdminQuảnLýHội();
            } else {
                assocToDelete = name;
                showCustomAlert('info', 'Xác nhận giải thể', `Nhấn "Xác nhận xóa?" một lần nữa trên chi hội "${name}" để hoàn tất giải thể.`);
                renderAdminQuảnLýHội();
            }
        }

        function renderAdminPermissions() {
            const container = document.getElementById('tab-content-container');

            let headers = ["Căn Cước", "Ngày sinh", "Quỹ thôn", "Địa chỉ GPS"];
            let roles = ["Cư dân", "Cán bộ Hội", "Trưởng thôn", "Tổ ANTT", "Admin"];

            let rows = roles.map(role => {
                let cells = headers.map(header => {
                    const currentVal = villageDb.permissions[role][header];
                    return `
                        <td class="p-4">
                            <select onchange="updatePermissionMatrix('${role}', '${header}', this.value)" class="px-2 py-1 rounded bg-white border border-stone-200 text-stone-900 text-xs outline-none">
                                <option value="Xem" ${currentVal === 'Xem' ? 'selected' : ''}>Xem</option>
                                <option value="Xem/Sửa" ${currentVal === 'Xem/Sửa' ? 'selected' : ''}>Xem & Sửa</option>
                                <option value="Khóa" ${currentVal === 'Khóa' ? 'selected' : ''}>Khóa quyền</option>
                            </select>
                        </td>
                    `;
                }).join('');

                return `
                    <tr class="hover:bg-stone-50 transition-colors">
                        <td class="p-4 font-bold text-stone-900">${role}</td>
                        ${cells}
                    </tr>
                `;
            }).join('');

            container.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                    <div>
                        <h4 class="font-serif text-lg font-bold text-stone-900">Bảng Ma Trận Cấu Hình Phân Quyền Dữ Liệu</h4>
                        <p class="text-xs text-stone-500">Kiểm soát quyền truy cập chi tiết các trường thông tin nhạy cảm.</p>
                    </div>
                </div>

                <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50 text-left">
                    <table class="w-full text-left text-xs">
                        <thead>
                            <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                <th class="p-4 font-semibold">Nhóm vai trò (Role)</th>
                                <th class="p-4 font-semibold">Trường Số Căn Cước</th>
                                <th class="p-4 font-semibold">Trường Ngày sinh</th>
                                <th class="p-4 font-semibold">Sổ sách Quỹ thôn</th>
                                <th class="p-4 font-semibold">Tọa độ Địa lý GPS</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-stone-200/40 text-stone-600">
                            ${rows}
                        </tbody>
                    </table>
                </div>
            `;
        }

        function updatePermissionMatrix(role, field, value) {
            villageDb.permissions[role][field] = value;
            saveDatabase();
            addLog("Thay đổi phân quyền", `Thay đổi quyền truy cập trường ${field} của nhóm ${role} thành: ${value}`, "Admin");
            showCustomAlert('success', 'Đã lưu cấu hình', 'Phân quyền phân hệ vai trò đã được áp dụng.');
        }

        function renderAdminAccounts() {
            const container = document.getElementById('tab-content-container');

            let rows = villageDb.accounts.map(acc => {
                const statusBadge = acc.status === "Hoạt động"
                    ? `<span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 font-bold text-[10px]">Đang mở</span>`
                    : `<span class="px-2 py-0.5 rounded bg-red-50 text-red-600 font-bold text-[10px]">Đã khóa</span>`;

                const actionBtn = acc.status === "Hoạt động"
                    ? `<button onclick="toggleAccountStatus('${acc.id}', 'Khóa')" class="px-2 py-1 rounded bg-stone-50 hover:bg-stone-100 text-stone-500 border border-stone-850 text-[10px]">Khóa tài khoản</button>`
                    : `<button onclick="toggleAccountStatus('${acc.id}', 'Hoạt động')" class="px-2 py-1 rounded bg-emerald-600/20 text-emerald-600 text-[10px]">Mở tài khoản</button>`;

                return `
                    <tr class="hover:bg-stone-50 transition-colors">
                        <td class="p-3">
                            <span class="font-bold text-stone-900 block">${acc.name}</span>
                            <span class="text-[10px] text-stone-400 font-mono">ID: ${acc.id}</span>
                        </td>
                        <td class="p-3 font-mono text-stone-600">${acc.username}</td>
                        <td class="p-3">
                            <span class="font-semibold text-stone-900 block">${acc.role}</span>
                            ${acc.role === 'Cán bộ Hội' && acc.assoc ? `<span class="text-[10px] text-stone-400 block">Phụ trách: ${acc.assoc}</span>` : ''}
                        </td>
                        <td class="p-3 text-stone-600">${acc.chucvu || '<span class="text-stone-300">—</span>'}</td>
                        <td class="p-3 text-stone-500 font-mono text-[10px]">${acc.lastActive}</td>
                        <td class="p-3">${statusBadge}</td>
                        <td class="p-3 text-right space-x-2">
                            <button onclick="openEditAccountModal('${acc.id}')" class="px-2 py-1 rounded bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-850 text-[10px]"><i class="fa-solid fa-pen-to-square mr-1"></i> Sửa</button>
                            <button onclick="resetAccountPassword('${acc.id}')" class="px-2 py-1 rounded bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-850 text-[10px]">Reset Pass</button>
                            ${acc.role !== 'Admin' ? actionBtn : ''}
                        </td>
                    </tr>
                `;
            }).join('');

            const unaccountedResidents = villageDb.residents.filter(r => !villageDb.accounts.some(a => a.name === r.name));

            container.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                    <div>
                        <h4 class="font-serif text-lg font-bold text-stone-900">Quản lý tài khoản, Cấp quyền & Đổi mật khẩu</h4>
                        <p class="text-xs text-stone-500">Tài khoản đăng nhập được tự động cấp theo Căn Cước khi nhân khẩu được duyệt thêm — mỗi cư dân có đúng một tài khoản.</p>
                    </div>
                    <button onclick="syncAllResidentAccounts()" class="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-primary-950/50 flex items-center gap-2 shrink-0">
                        <i class="fa-solid fa-arrows-rotate"></i> Đồng bộ tài khoản toàn bộ cư dân
                    </button>
                </div>
                <p class="text-[11px] text-stone-400 -mt-2">${unaccountedResidents.length} / ${villageDb.residents.length} cư dân chưa có tài khoản đăng nhập${unaccountedResidents.length > 0 ? ' (thiếu Căn Cước hợp lệ — bấm "Đồng bộ" sau khi cập nhật)' : ''}.</p>

                <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50 text-left">
                    <table class="w-full text-left text-xs">
                        <thead>
                            <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                <th class="p-3 font-semibold">Tên tài khoản cư dân</th>
                                <th class="p-3 font-semibold">Tên đăng nhập</th>
                                <th class="p-3 font-semibold">Nhóm vai trò (phân quyền)</th>
                                <th class="p-3 font-semibold">Chức vụ</th>
                                <th class="p-3 font-semibold">Hoạt động cuối</th>
                                <th class="p-3 font-semibold">Trạng thái</th>
                                <th class="p-3 font-semibold text-right">Quản trị</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-stone-200/40 text-stone-600">
                            ${rows}
                        </tbody>
                    </table>
                </div>
            `;
        }

        // Creates the one-and-only "Cư dân" account for a resident (username =
        // Căn Cước), skipping residents without a valid Căn Cước yet (e.g. minors
        // not issued one) or who already have an account. Returns true if an
        // account was created. Shared by the auto-provisioning on new-member
        // approval and the bulk sync below, so accounts always stay 1:1 with
        // residents without Admin ever creating one by hand.
        function createResidentAccount(res) {
            if (!res.cccd || res.cccd === 'Chưa cấp') return false;
            if (villageDb.accounts.some(a => a.name === res.name)) return false;

            const accId = `ACC-${Math.floor(100 + Math.random()*900)}-${Math.floor(Math.random()*900)}`;
            villageDb.accounts.push({
                id: accId, username: res.cccd, name: res.name, role: "Cư dân", chucvu: "",
                lastActive: "Chưa đăng nhập", status: "Hoạt động"
            });
            return true;
        }

        // Bulk-creates accounts for every resident who doesn't already have one,
        // so account management stays in sync with the full resident roster even
        // if a Căn Cước was only entered after a resident's profile was created.
        function syncAllResidentAccounts() {
            let created = 0;
            let skipped = 0;
            villageDb.residents.forEach(res => {
                if (villageDb.accounts.some(a => a.name === res.name)) return;
                if (createResidentAccount(res)) created++;
                else skipped++;
            });

            if (created > 0) saveDatabase();
            addLog("Đồng bộ tài khoản", `Admin đồng bộ tài khoản toàn bộ cư dân: tạo mới ${created} tài khoản, bỏ qua ${skipped} cư dân chưa có Căn Cước hợp lệ.`, "Admin");
            showCustomAlert(
                created > 0 ? 'success' : 'info',
                'Đồng bộ hoàn tất',
                created > 0
                    ? `Đã tạo ${created} tài khoản mới cho cư dân chưa có tài khoản.${skipped > 0 ? ` Bỏ qua ${skipped} cư dân chưa có Căn Cước hợp lệ.` : ''}`
                    : `Mọi cư dân đã có tài khoản.${skipped > 0 ? ` Còn ${skipped} cư dân chưa có Căn Cước hợp lệ nên chưa thể tạo.` : ''}`
            );
            renderAdminAccounts();
        }

        // Edit-account modal: lets Admin change an account's Vai trò (role — chỉ
        // dùng để phân quyền hệ thống) and, when the role is Cán bộ Hội, which
        // Hội nhóm it's assigned to phụ trách, plus its Chức vụ (public-facing
        // title, independent of role) which feeds the homepage "Ban Tự Quản"
        // list via getPublicLeadershipList() in js/homepage.js.
        let editingAccountId = null;

        function openEditAccountModal(accId) {
            const acc = villageDb.accounts.find(a => a.id === accId);
            if (!acc) return;
            editingAccountId = accId;

            document.getElementById('edit-account-name').innerText = acc.name;
            document.getElementById('edit-account-username').innerText = acc.username;
            document.getElementById('edit-account-role-input').value = acc.role;
            document.getElementById('edit-account-chucvu-input').value = acc.chucvu || '';

            const assocSelect = document.getElementById('edit-account-assoc-input');
            assocSelect.innerHTML = Object.keys(villageDb.associationQuotas).map(n => `<option value="${n}">${n}</option>`).join('') || '<option disabled>Chưa có hội nào</option>';
            if (acc.assoc) assocSelect.value = acc.assoc;

            toggleEditAccountAssocField();

            const modal = document.getElementById('edit-account-modal');
            const box = document.getElementById('edit-account-modal-box');
            modal.classList.remove('hidden');
            setTimeout(() => {
                box.classList.remove('scale-95');
                box.classList.add('scale-100');
            }, 10);
        }

        function closeEditAccountModal() {
            const modal = document.getElementById('edit-account-modal');
            const box = document.getElementById('edit-account-modal-box');
            box.classList.add('scale-95');
            box.classList.remove('scale-100');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 150);
            editingAccountId = null;
        }

        function toggleEditAccountAssocField() {
            const role = document.getElementById('edit-account-role-input').value;
            document.getElementById('edit-account-assoc-field').classList.toggle('hidden', role !== 'Cán bộ Hội');
        }

        function saveEditAccount(event) {
            event.preventDefault();
            const acc = villageDb.accounts.find(a => a.id === editingAccountId);
            if (!acc) return;

            const oldRole = acc.role;
            const oldChucvu = acc.chucvu || '';
            const role = document.getElementById('edit-account-role-input').value;
            const chucvu = document.getElementById('edit-account-chucvu-input').value.trim();

            let assoc;
            if (role === 'Cán bộ Hội') {
                assoc = document.getElementById('edit-account-assoc-input').value;
                if (!assoc || !villageDb.associationQuotas[assoc]) {
                    showCustomAlert('error', 'Lỗi cập nhật', 'Vui lòng chọn hội mà tài khoản này sẽ phụ trách.');
                    return;
                }
            }

            acc.role = role;
            acc.chucvu = chucvu;
            if (role === 'Cán bộ Hội') acc.assoc = assoc;
            else delete acc.assoc;

            saveDatabase();
            const changes = [];
            if (role !== oldRole) changes.push(`vai trò (phân quyền) từ "${oldRole}" thành "${role}"${assoc ? ` (phụ trách ${assoc})` : ''}`);
            if (chucvu !== oldChucvu) changes.push(`chức vụ thành "${chucvu || 'không có'}"`);
            addLog("Cập nhật tài khoản", `Admin cập nhật tài khoản ${acc.name}${changes.length ? ': ' + changes.join('; ') : ''}.`, "Admin");
            showCustomAlert('success', 'Cập nhật thành công', `Đã cập nhật tài khoản ${acc.name}.`);
            closeEditAccountModal();
            renderAdminAccounts();
        }

        function resetAccountPassword(accId) {
            const acc = villageDb.accounts.find(a => a.id === accId);
            addLog("Reset Mật khẩu", `Quản trị viên khôi phục mật khẩu mặc định cho tài khoản ${acc.name}.`, "Admin");
            showCustomAlert('success', 'Khôi phục mật khẩu', `Mật khẩu của ${acc.name} đã được reset thành mặc định ('doanket').`);
        }

        function toggleAccountStatus(accId, value) {
            const acc = villageDb.accounts.find(a => a.id === accId);
            acc.status = value;
            saveDatabase();
            addLog("Đổi trạng thái tài khoản", `Thay đổi trạng thái hoạt động tài khoản ${acc.name} thành: ${value}`, "Admin");
            showCustomAlert('info', 'Đã lưu', `Tài khoản ${acc.name} hiện đã chuyển sang trạng thái: ${value}`);
            renderAdminAccounts();
        }

        // -----------------------------------------------------------------------------------
        // ADMIN: QUẢN LÝ TRANG CHỦ — CRUD over villageDb.homeContent so the public
        // homepage (index.html) no longer needs its content hardcoded in HTML.
        // -----------------------------------------------------------------------------------
        // Common Vietnamese banks, used wherever Cán bộ Hội/Trưởng thôn record a
        // bank account to receive fund transfers (thay vì gõ tay dễ sai chính tả).
