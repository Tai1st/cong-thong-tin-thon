        function renderResidentSidebarInfo() {
            const infoBox = document.getElementById('resident-sidebar-info');
            const familyId = getCurrentUserFamilyId();
            const household = familyId ? villageDb.residents.filter(r => r.familyId === familyId) : [];
            const head = household.find(r => r.isHouseholder) || getCurrentUserResident();

            if (infoBox) {
                infoBox.innerHTML = `
                    <div class="p-4 rounded-2xl bg-primary-50 border border-primary-100 space-y-2.5 text-xs">
                        <span class="text-[10px] font-bold text-primary-700 uppercase tracking-widest block">Thông Tin Hộ Gia Đình</span>
                        <div class="flex justify-between gap-2"><span class="text-stone-500">Chủ hộ:</span><span class="font-semibold text-stone-800 text-right">${head ? head.name : 'Chưa xác định'}</span></div>
                        <div class="flex justify-between gap-2"><span class="text-stone-500">Địa chỉ:</span><span class="font-semibold text-stone-800 text-right">Thôn Đoàn Kết</span></div>
                        <div class="flex justify-between gap-2"><span class="text-stone-500">Số nhân khẩu:</span><span class="font-semibold text-stone-800 text-right">${household.length} người</span></div>
                        <button onclick="switchPortalTab('family')" class="w-full py-2 rounded-lg bg-white border border-primary-200 text-primary-700 font-bold text-[11px] hover:bg-primary-100 transition-colors">Xem chi tiết hộ gia đình</button>
                    </div>
                `;
            }

            const badge = document.getElementById('resident-notif-badge');
            if (badge) {
                const pendingCount = villageDb.memberEditRequests.filter(r => r.submittedBy === currentUser.name && r.status === 'Chờ duyệt').length
                    + villageDb.newMemberRequests.filter(r => r.submittedBy === currentUser.name && r.status === 'Chờ duyệt').length;
                if (pendingCount > 0) {
                    badge.innerText = pendingCount;
                    badge.classList.remove('hidden');
                } else {
                    badge.classList.add('hidden');
                }
            }
        }

        function renderResidentDashboard() {
            const container = document.getElementById('tab-content-container');
            const familyId = getCurrentUserFamilyId();
            const household = familyId ? villageDb.residents.filter(r => r.familyId === familyId) : [];
            const funds = (familyId && villageDb.funds[familyId]) || [];

            let paidTotal = 0;
            let obligatedTotal = 0;
            funds.forEach(f => {
                obligatedTotal += f.amount;
                if (f.status === "Đã đóng") paidTotal += f.amount;
            });
            const paidPct = obligatedTotal > 0 ? Math.round((paidTotal / obligatedTotal) * 100) : 0;

            const news = ((villageDb.homeContent && villageDb.homeContent.news) || []).slice(0, 4);
            const schedule = (villageDb.homeContent && villageDb.homeContent.schedule) || [];
            const products = ((villageDb.homeContent && villageDb.homeContent.products) || []).slice(0, 5);
            const sec = (villageDb.homeContent && villageDb.homeContent.security) || { hotline: '', hotlineDisplay: '' };
            const chief = getPublicSecurityRoster().find(m => m.title === 'Tổ Trưởng');

            const myRequests = [
                ...villageDb.memberEditRequests.filter(r => r.submittedBy === currentUser.name).map(r => ({ desc: `Sửa thông tin: ${r.residentName}`, time: r.time, status: r.status })),
                ...villageDb.newMemberRequests.filter(r => r.submittedBy === currentUser.name).map(r => ({ desc: `Đăng ký thêm thành viên: ${r.name}`, time: r.time, status: r.status }))
            ].slice(-4).reverse();

            const statusBadge = (status) => status === 'Đã duyệt'
                ? `<span class="px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-extrabold uppercase tracking-wider shrink-0">Đã duyệt</span>`
                : status === 'Từ chối'
                    ? `<span class="px-2 py-1 rounded-full bg-red-50 text-red-600 text-[9px] font-extrabold uppercase tracking-wider shrink-0">Từ chối</span>`
                    : `<span class="px-2 py-1 rounded-full bg-amber-50 text-amber-600 text-[9px] font-extrabold uppercase tracking-wider shrink-0">Đang chờ duyệt</span>`;

            container.innerHTML = `
                <!-- Welcome banner -->
                <div class="bg-gradient-to-r from-primary-700 to-primary-600 rounded-3xl p-6 sm:p-8 text-white flex items-center gap-6 overflow-hidden relative">
                    <div class="relative z-10 space-y-2 flex-1">
                        <h4 class="font-serif text-xl sm:text-2xl font-black">Chào mừng, ${currentUser.name}!</h4>
                        <p class="text-primary-100 text-xs sm:text-sm max-w-lg">Đây là không gian dành riêng cho cư dân thôn Đoàn Kết. Bạn có thể tra cứu thông tin, gửi yêu cầu và theo dõi các hoạt động của thôn một cách dễ dàng.</p>
                    </div>
                    <div class="hidden sm:flex w-20 h-20 rounded-full bg-white/15 items-center justify-center text-4xl shrink-0 relative z-10"><i class="fa-solid fa-people-roof"></i></div>
                    <div class="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10"></div>
                </div>

                <!-- Quick actions -->
                <div class="space-y-3">
                    <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Thao Tác Nhanh</span>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <button onclick="switchPortalTab('family')" class="flex flex-col items-center gap-2 bg-white border border-stone-200 rounded-2xl py-4 shadow-sm hover:border-primary-300 transition-colors">
                            <span class="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center"><i class="fa-solid fa-user-pen"></i></span>
                            <span class="text-[11px] font-semibold text-stone-600 text-center leading-tight px-1">Gửi yêu cầu chỉnh sửa thông tin</span>
                        </button>
                        <button onclick="openAddMemberModal()" class="flex flex-col items-center gap-2 bg-white border border-stone-200 rounded-2xl py-4 shadow-sm hover:border-blue-300 transition-colors">
                            <span class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><i class="fa-solid fa-people-group"></i></span>
                            <span class="text-[11px] font-semibold text-stone-600 text-center leading-tight px-1">Đăng ký, cập nhật thành viên hộ</span>
                        </button>
                        <button onclick="switchPortalTab('contributions')" class="flex flex-col items-center gap-2 bg-white border border-stone-200 rounded-2xl py-4 shadow-sm hover:border-amber-300 transition-colors">
                            <span class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><i class="fa-solid fa-hand-holding-dollar"></i></span>
                            <span class="text-[11px] font-semibold text-stone-600 text-center leading-tight px-1">Đóng góp quỹ, hội phí</span>
                        </button>
                        <button onclick="switchPortalTab('bao-antt')" class="flex flex-col items-center gap-2 bg-white border border-stone-200 rounded-2xl py-4 shadow-sm hover:border-purple-300 transition-colors">
                            <span class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center"><i class="fa-solid fa-bullhorn"></i></span>
                            <span class="text-[11px] font-semibold text-stone-600 text-center leading-tight px-1">Gửi phản ánh, kiến nghị</span>
                        </button>
                    </div>
                </div>

                <!-- News + Schedule -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div class="bg-white border border-stone-200 rounded-2xl p-5 space-y-3">
                        <div class="flex items-center justify-between">
                            <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Thông Báo Mới Nhất</span>
                            <button onclick="switchPortalTab('bao-antt')" class="text-[11px] font-semibold text-primary-600 hover:text-primary-700">Xem tất cả</button>
                        </div>
                        <div class="divide-y divide-stone-100">
                            ${news.map(n => `
                                <div class="py-2.5 flex items-center justify-between gap-3">
                                    <div class="flex items-center gap-2.5 min-w-0">
                                        <i class="fa-solid fa-bullhorn text-primary-500 text-xs shrink-0"></i>
                                        <span class="text-xs font-medium text-stone-700 truncate">${n.title}</span>
                                    </div>
                                    <span class="text-[10px] text-stone-400 shrink-0">${n.date}</span>
                                </div>
                            `).join('') || '<p class="text-stone-400 text-xs text-center py-4">Chưa có thông báo nào.</p>'}
                        </div>
                    </div>

                    <div class="bg-white border border-stone-200 rounded-2xl p-5 space-y-3">
                        <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Lịch Công Tác Sắp Tới</span>
                        <div class="divide-y divide-stone-100">
                            ${schedule.map(s => `
                                <div class="py-2.5 flex items-center gap-3">
                                    <div class="w-11 h-11 rounded-xl bg-primary-50 text-primary-700 flex flex-col items-center justify-center shrink-0 leading-none">
                                        <span class="text-sm font-black">${s.day}</span>
                                        <span class="text-[8px] font-semibold">${s.month}</span>
                                    </div>
                                    <div class="min-w-0">
                                        <p class="text-xs font-semibold text-stone-800 truncate">${s.title}</p>
                                        <p class="text-[10px] text-stone-400"><i class="fa-solid fa-location-dot mr-1"></i>${s.location} · ${s.time}</p>
                                    </div>
                                </div>
                            `).join('') || '<p class="text-stone-400 text-xs text-center py-4">Chưa có lịch công tác nào.</p>'}
                        </div>
                    </div>
                </div>

                <!-- Dues progress + My requests -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div class="bg-white border border-stone-200 rounded-2xl p-5 space-y-4">
                        <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Tình Hình Đóng Góp Năm 2026</span>
                        <div class="space-y-1.5">
                            <div class="flex justify-between text-xs">
                                <span class="text-stone-500">Đã đóng</span>
                                <span class="font-bold text-stone-900">${paidTotal.toLocaleString('vi-VN')} đ / ${obligatedTotal.toLocaleString('vi-VN')} đ</span>
                            </div>
                            <div class="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                                <div class="h-full bg-primary-600 rounded-full" style="width:${paidPct}%"></div>
                            </div>
                            <p class="text-[10px] text-stone-400 text-right">${paidPct}% hoàn thành</p>
                        </div>
                        <div class="divide-y divide-stone-100">
                            ${funds.map(f => `
                                <div class="py-2 flex items-center justify-between gap-2">
                                    <span class="text-xs text-stone-600 truncate">${f.name}</span>
                                    ${f.status === 'Đã đóng'
                                        ? `<span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-extrabold uppercase shrink-0">Đã đóng</span>`
                                        : `<span class="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[9px] font-extrabold uppercase shrink-0">Chưa đóng</span>`}
                                </div>
                            `).join('') || '<p class="text-stone-400 text-xs text-center py-4">Chưa có khoản thu nào.</p>'}
                        </div>
                        <button onclick="switchPortalTab('contributions')" class="w-full py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-600 font-bold text-[11px] hover:bg-stone-100 transition-colors">Xem lịch sử đóng góp</button>
                    </div>

                    <div class="bg-white border border-stone-200 rounded-2xl p-5 space-y-3">
                        <div class="flex items-center justify-between">
                            <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Yêu Cầu Của Tôi</span>
                            <button onclick="switchPortalTab('family')" class="text-[11px] font-semibold text-primary-600 hover:text-primary-700">Xem tất cả</button>
                        </div>
                        <div class="divide-y divide-stone-100">
                            ${myRequests.map(r => `
                                <div class="py-2.5 space-y-1">
                                    <div class="flex items-start justify-between gap-2">
                                        <span class="text-xs font-medium text-stone-700">${r.desc}</span>
                                        ${statusBadge(r.status)}
                                    </div>
                                    <p class="text-[10px] text-stone-400">Ngày gửi: ${r.time}</p>
                                </div>
                            `).join('') || '<p class="text-stone-400 text-xs text-center py-4">Bạn chưa gửi yêu cầu nào.</p>'}
                        </div>
                    </div>
                </div>

                <!-- Sản vật đất lành -->
                <div class="bg-white border border-stone-200 rounded-2xl p-5 space-y-3">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Sản Vật Đất Lành</span>
                        <a href="index.html#nong-san" target="_blank" class="text-[11px] font-semibold text-primary-600 hover:text-primary-700">Xem thêm</a>
                    </div>
                    <div class="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        ${products.map(p => `
                            <div class="text-center space-y-1.5">
                                <div class="w-full aspect-square rounded-xl overflow-hidden border border-stone-100">
                                    <img src="${p.image}" onerror="this.src='https://placehold.co/200x200/f0fdf4/16a34a?text=${encodeURIComponent(p.name)}'" alt="${p.name}" class="w-full h-full object-cover">
                                </div>
                                <span class="text-[11px] font-semibold text-stone-600 leading-tight block">${p.name}</span>
                            </div>
                        `).join('') || '<p class="text-stone-400 text-xs col-span-full text-center py-4">Chưa có nông sản nào.</p>'}
                    </div>
                </div>

                <!-- ANTT contact banner -->
                <div class="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div class="flex items-center gap-3">
                        <span class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><i class="fa-solid fa-shield-halved"></i></span>
                        <div>
                            <h5 class="text-xs font-bold text-stone-900 uppercase tracking-wide">Tổ An Ninh Trật Tự Cơ Sở</h5>
                            <p class="text-[11px] text-stone-500">Mọi thông tin về an ninh trật tự, vui lòng liên hệ Tổ ANTT hoặc gọi đường dây nóng 24/7.</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-6 shrink-0">
                        <a href="tel:${sec.hotline}" class="text-left">
                            <span class="text-[9px] font-bold text-red-500 uppercase tracking-wide block">Trực ban 24/7</span>
                            <span class="text-sm font-black text-stone-900">${sec.hotlineDisplay}</span>
                        </a>
                        ${chief ? `
                        <div class="text-left hidden sm:block">
                            <span class="text-[9px] font-bold text-emerald-600 uppercase tracking-wide block">Tổ trưởng ANTT</span>
                            <span class="text-sm font-black text-stone-900">${chief.name}</span>
                        </div>` : ''}
                    </div>
                </div>
            `;
        }

        function renderResidentAssociationDetail(assocName) {
            const container = document.getElementById('tab-content-container');
            const quota = villageDb.associationQuotas[assocName] || { txs: [] };
            const leaderAcc = villageDb.accounts.find(a => a.role === 'Cán bộ Hội' && a.assoc === assocName);
            const thuItems = quota.txs.filter(tx => tx.type === 'Thu');
            const chiItems = quota.txs.filter(tx => tx.type === 'Chi');
            const assocThuTotal = thuItems.reduce((sum, tx) => sum + tx.amount, 0);
            const assocChiTotal = chiItems.reduce((sum, tx) => sum + tx.amount, 0);

            const me = getCurrentUserResident();
            const isMyOwnMembership = me && me.association === assocName;
            const myFees = (isMyOwnMembership && quota.memberFunds && quota.memberFunds[me.id]) || [];
            const myFeesStatusBadge = (status) => status === "Đã đóng"
                ? `<span class="px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-extrabold uppercase tracking-wider block text-center"><i class="fa-solid fa-check mr-1"></i> Đã hoàn thành</span>`
                : status === "Chờ duyệt"
                    ? `<span class="px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-[9px] font-extrabold uppercase tracking-wider block text-center"><i class="fa-solid fa-clock mr-1"></i> Chờ duyệt</span>`
                    : `<span class="px-2 py-1 rounded-full bg-amber-50 text-amber-600 text-[9px] font-extrabold uppercase tracking-wider block text-center"><i class="fa-solid fa-circle-exclamation mr-1"></i> Chưa thanh toán</span>`;
            const myFeesRows = myFees.map((f, idx) => `
                <tr class="hover:bg-stone-50 transition-colors">
                    <td class="p-3">
                        <span class="font-bold text-stone-900 block">${f.name}</span>
                        <span class="text-[10px] text-stone-400 font-mono">${f.memo}</span>
                    </td>
                    <td class="p-3 text-stone-600">${f.period}</td>
                    <td class="p-3 text-right font-mono text-stone-900 font-bold">${f.amount.toLocaleString('vi-VN')} đ</td>
                    <td class="p-3 text-center">${myFeesStatusBadge(f.status)}</td>
                    <td class="p-3 text-right">
                        ${f.status === "Đã đóng" ? `<span class="text-stone-400 font-mono text-[10px]">${f.date}</span>`
                            : f.status === "Chờ duyệt" ? `<span class="text-blue-600 text-[10px] font-semibold">Đang chờ hội trưởng duyệt</span>`
                            : `<button onclick="payAssocMemberFund(${idx})" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] uppercase transition-all shadow-md">Đóng Qua QR</button>`}
                    </td>
                </tr>
            `).join('') || '<tr><td colspan="5" class="p-4 text-center text-stone-400">Chưa có khoản hội phí nào.</td></tr>';

            const thuRows = thuItems.map(tx => `
                <tr class="hover:bg-stone-50 transition-colors">
                    <td class="p-3 font-semibold text-stone-900">${tx.member ? `${tx.member} - ${tx.desc}` : tx.desc}</td>
                    <td class="p-3 text-right font-mono font-bold text-emerald-600">${tx.amount.toLocaleString('vi-VN')} đ</td>
                </tr>
            `).join('') || '<tr><td colspan="2" class="p-3 text-center text-stone-400">Chưa có khoản thu nào.</td></tr>';

            const chiRows = chiItems.map(tx => `
                <div class="flex items-center justify-between py-2 text-xs">
                    <div>
                        <span class="text-stone-600 block">${tx.desc}</span>
                        <span class="text-stone-400 font-mono text-[11px]">${tx.date}</span>
                    </div>
                    <span class="text-red-600 font-mono font-bold">-${tx.amount.toLocaleString('vi-VN')} đ</span>
                </div>
            `).join('') || '<p class="text-xs text-stone-400 py-2">Chưa có khoản chi nào.</p>';

            container.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                    <div>
                        <h4 class="font-serif text-lg font-bold text-stone-900">${assocName}</h4>
                        <p class="text-xs text-stone-500">Hội trưởng: <span class="text-primary-400 font-semibold">${leaderAcc ? leaderAcc.name : 'Chưa có tài khoản phụ trách'}</span></p>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    <div class="p-4 rounded-xl bg-stone-50 border border-stone-200">
                        <span class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">Tổng thu</span>
                        <span class="text-lg font-bold text-stone-900 block mt-1">${assocThuTotal.toLocaleString('vi-VN')} đ</span>
                    </div>
                    <div class="p-4 rounded-xl bg-stone-50 border border-stone-200">
                        <span class="text-[10px] font-bold text-red-600 uppercase tracking-widest block">Tổng chi</span>
                        <span class="text-lg font-bold text-stone-900 block mt-1">${assocChiTotal.toLocaleString('vi-VN')} đ</span>
                    </div>
                </div>

                ${quota.bankInfo ? `
                <div class="p-4 rounded-xl bg-stone-50 border border-stone-200 text-left">
                    <span class="text-[10px] font-bold text-primary-400 uppercase tracking-widest block mb-2">Thông tin chuyển khoản đóng hội phí</span>
                    <div class="space-y-1.5 text-xs">
                        <div class="flex justify-between"><span class="text-stone-400">Ngân hàng:</span><span class="text-stone-900 font-bold">${quota.bankInfo.bankName}</span></div>
                        <div class="flex justify-between"><span class="text-stone-400">Số tài khoản:</span><span class="text-stone-900 font-bold font-mono">${quota.bankInfo.accountNumber}</span></div>
                        <div class="flex justify-between"><span class="text-stone-400">Chủ tài khoản:</span><span class="text-stone-900 font-bold">${quota.bankInfo.accountHolder}</span></div>
                    </div>
                </div>
                ` : ''}

                ${isMyOwnMembership ? `
                <div class="space-y-3 text-left pt-2 border-t border-stone-200">
                    <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Nghĩa vụ hội phí của tôi</span>
                    <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                    <th class="p-4 font-semibold">Khoản hội phí</th>
                                    <th class="p-4 font-semibold">Chu kỳ</th>
                                    <th class="p-4 font-semibold text-right">Số tiền</th>
                                    <th class="p-4 font-semibold text-center">Trạng thái</th>
                                    <th class="p-4 font-semibold text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-stone-200/40 text-stone-600">${myFeesRows}</tbody>
                        </table>
                    </div>
                </div>

                <div id="assoc-quick-qr-box" class="hidden p-6 rounded-2xl border border-primary-500/30 bg-primary-950/10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center text-left">
                    <div class="md:col-span-8 space-y-4">
                        <div class="flex items-center gap-2 text-primary-400">
                            <i class="fa-solid fa-qrcode text-lg"></i>
                            <h5 class="text-sm font-bold uppercase tracking-wider">Thanh toán hội phí qua QR chuẩn</h5>
                        </div>
                        <p class="text-xs text-stone-600 leading-relaxed">
                            Quét mã QR để hoàn thành nghĩa vụ hội phí. Hội trưởng sẽ xét duyệt xác nhận chuyển khoản của bạn.
                        </p>
                        <div class="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
                            <div class="flex justify-between">
                                <span class="text-stone-400">Mã giao dịch đối soát:</span>
                                <span class="text-primary-400 font-mono font-bold" id="assoc-qr-memo-field"></span>
                            </div>
                        </div>
                        <button onclick="confirmAssocMemberFundPayment()" class="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs uppercase transition-colors shadow-lg shadow-primary-950/50">
                            Tôi đã chuyển khoản thành công
                        </button>
                    </div>
                    <div class="md:col-span-4 flex justify-center">
                        <img id="assoc-qr-img" src="" alt="Mã QR Chuyển Khoản VietQR" class="w-36 h-36 border-4 border-white rounded-xl">
                    </div>
                </div>
                ` : ''}

                <div class="space-y-2 text-left">
                    <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Chi tiết thu theo hội viên</span>
                    <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                    <th class="p-3 font-semibold">Tên thành viên</th>
                                    <th class="p-3 font-semibold text-right">Số tiền đóng</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-stone-200/40 text-stone-600">
                                ${thuRows}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="space-y-2 text-left">
                    <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Các khoản chi của hội</span>
                    <div class="rounded-xl border border-stone-200 bg-stone-50 divide-y divide-stone-200/40 px-4">
                        ${chiRows}
                    </div>
                </div>
            `;
        }

        function renderResidentFamily() {
            const container = document.getElementById('tab-content-container');
            const familyId = getCurrentUserFamilyId();
            const household = familyId ? villageDb.residents.filter(r => r.familyId === familyId) : [];
            const coords = familyId ? villageDb.gpsCoords[familyId] : null;

            let familyRows = household.map(m => {
                const pendingReq = villageDb.memberEditRequests.find(r => r.residentId === m.id && r.status === 'Chờ duyệt');
                const action = pendingReq
                    ? `<span class="px-2 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider"><i class="fa-solid fa-clock mr-1"></i> Chờ Admin duyệt</span>`
                    : `<button onclick="openRequestMemberEditModal('${m.id}')" class="px-2.5 py-1 rounded bg-white hover:bg-stone-100 text-stone-600 text-[11px] font-semibold transition-all"><i class="fa-solid fa-pen-to-square mr-1"></i> Sửa</button>`;

                return `
                    <tr class="hover:bg-stone-50 transition-colors">
                        <td class="p-4 font-bold text-stone-900">${m.name}</td>
                        <td class="p-4 text-stone-600">${m.relation || (m.isHouseholder ? "Chủ hộ" : "Thành viên")}</td>
                        <td class="p-4 font-mono text-stone-500">${m.dob}</td>
                        <td class="p-4 font-mono text-stone-400">${m.cccd}</td>
                        <td class="p-4 font-mono text-stone-500">${m.phone || 'Chưa có SĐT'}</td>
                        <td class="p-4 text-right">${action}</td>
                    </tr>
                `;
            }).join('');

            const pendingNewMembers = villageDb.newMemberRequests.filter(r => r.familyId === familyId && r.status === 'Chờ duyệt');
            let pendingNewMemberRows = pendingNewMembers.map(r => `
                <tr class="hover:bg-stone-50 transition-colors opacity-70">
                    <td class="p-4 font-bold text-stone-900">${r.name}</td>
                    <td class="p-4 text-stone-600">${r.relation}</td>
                    <td class="p-4 font-mono text-stone-500">${r.dob}</td>
                    <td class="p-4 font-mono text-stone-400">${r.cccd || '-'}</td>
                    <td class="p-4 font-mono text-stone-500">${r.phone || 'Chưa có SĐT'}</td>
                    <td class="p-4 text-right">
                        <span class="px-2 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider"><i class="fa-solid fa-clock mr-1"></i> Chờ Admin duyệt</span>
                    </td>
                </tr>
            `).join('');

            container.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                    <div>
                        <h4 class="font-serif text-lg font-bold text-stone-900">Quản lý Thành Viên & Tọa độ Gia đình</h4>
                        <p class="text-xs text-stone-500">Cơ chế quản lý khép kín, đảm bảo tính bảo mật và toàn vẹn dữ liệu cá nhân.</p>
                    </div>
                    <button onclick="openAddMemberModal()" class="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs uppercase shrink-0"><i class="fa-solid fa-user-plus mr-1"></i> Thêm mới</button>
                </div>

                <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50 text-left">
                    <table class="w-full text-left text-xs">
                        <thead>
                            <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                <th class="p-4 font-semibold">Thành viên</th>
                                <th class="p-4 font-semibold">Quan hệ với chủ hộ</th>
                                <th class="p-4 font-semibold">Ngày sinh</th>
                                <th class="p-4 font-semibold">Số Căn Cước</th>
                                <th class="p-4 font-semibold">Số điện thoại</th>
                                <th class="p-4 font-semibold text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-stone-200/40 text-stone-600">
                            ${familyRows}${pendingNewMemberRows}
                        </tbody>
                    </table>
                </div>

                <!-- GPS section -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-6 border-t border-stone-200 text-left">
                    <div class="lg:col-span-5 space-y-4">
                        <span class="px-2 py-1 rounded bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider inline-block">Định vị địa bàn nông thôn</span>
                        <h5 class="text-base font-serif font-bold text-stone-900">Xác định tọa độ GPS hộ gia đình</h5>
                        <p class="text-xs text-stone-500 leading-relaxed">
                            Cập nhật chính xác vị trí phục vụ số hóa bản đồ đất đai, cứu hộ khẩn cấp và công tác phát triển an ninh số cơ sở Thôn Đoàn Kết.
                        </p>
                        
                        <div class="p-3.5 rounded-xl bg-stone-50 border border-stone-200 font-mono text-xs text-stone-600 space-y-1.5">
                            <div class="flex justify-between">
                                <span class="text-stone-400">Vĩ độ (Latitude):</span>
                                <span class="text-stone-900 font-bold">${coords ? coords.lat.toFixed(6) + '° N' : 'Chưa định vị'}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-stone-400">Kinh độ (Longitude):</span>
                                <span class="text-stone-900 font-bold">${coords ? coords.lng.toFixed(6) + '° E' : 'Chưa định vị'}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-stone-400">Trạng thái định vị:</span>
                                <span class="${coords ? 'text-emerald-600' : 'text-amber-600'} font-bold">${coords ? 'Đã định vị bằng GPS thiết bị' : 'Chưa có dữ liệu'}</span>
                            </div>
                        </div>

                        <button onclick="simulateGPSUpdate()" id="gps-update-btn" class="w-full py-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 hover:border-primary-500 text-stone-700 hover:text-stone-900 font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2">
                            <i class="fa-solid fa-location-crosshairs animate-pulse text-primary-400"></i> Định vị GPS hiện tại
                        </button>

                        <a href="${coords ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}` : '#'}" ${coords ? 'target="_blank" rel="noopener"' : 'onclick="return false;"'} class="w-full py-3 rounded-xl bg-emerald-50 ${coords ? 'hover:bg-emerald-100 hover:border-emerald-500 hover:text-emerald-600' : 'opacity-40 cursor-not-allowed'} text-emerald-600 font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2">
                            <i class="fa-brands fa-google"></i> Xem trên Google Maps
                        </a>

                        <div class="space-y-1.5 pt-2">
                            <label class="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">Số nhà / Địa chỉ cụ thể</label>
                            <div class="flex items-center gap-2">
                                <input type="text" id="house-number-input" value="${villageDb.houseNumbers[familyId] || ''}" placeholder="VD: Số 12, ngõ 3" class="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-xs outline-none focus:border-primary-500 transition-colors">
                                <button onclick="saveHouseNumber()" class="px-3 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold shrink-0"><i class="fa-solid fa-floppy-disk"></i></button>
                            </div>
                        </div>
                    </div>

                    <div class="lg:col-span-7">
                        <div id="family-gps-map" class="w-full h-48 sm:h-64 rounded-2xl border border-stone-200 overflow-hidden"></div>
                    </div>
                </div>
            `;

            renderFamilyGpsMap(familyId, coords);
        }

        // Bản đồ thật (Leaflet + OpenStreetMap, miễn phí, không cần API key) cho
        // riêng khu vực Thôn Đoàn Kết — thay thế placeholder lưới chấm tĩnh cũ.
        // DOM của #family-gps-map bị hủy mỗi lần renderResidentFamily() render
        // lại (innerHTML ghi đè), nên phải remove() map cũ trước khi tạo mới.
        let familyGpsMap = null;
        const DOAN_KET_CENTER = [13.125944, 108.324778]; // 13°07'33.4"N 108°19'29.2"E — tâm Thôn Đoàn Kết, dùng khi hộ chưa định vị
        function renderFamilyGpsMap(familyId, coords) {
            const el = document.getElementById('family-gps-map');
            if (!el) return;
            if (familyGpsMap) { familyGpsMap.remove(); familyGpsMap = null; }

            const center = coords ? [coords.lat, coords.lng] : DOAN_KET_CENTER;
            familyGpsMap = L.map(el, { scrollWheelZoom: false }).setView(center, coords ? 17 : 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(familyGpsMap);

            // Ranh giới thật của Thôn Đoàn Kết (js/village-boundary.js) — cùng
            // nguồn geometry với bản đồ tổng ở tra-cuu.html, giúp thấy được
            // hộ gia đình nằm ở đâu trong phạm vi thôn thay vì chỉ 1 chấm
            // trơ trọi trên nền OSM.
            if (typeof DOAN_KET_BOUNDARY !== 'undefined') {
                L.polygon(DOAN_KET_BOUNDARY, {
                    color: '#e11d48',
                    weight: 2,
                    fillColor: '#e11d48',
                    fillOpacity: 0.06
                }).addTo(familyGpsMap);
            }

            if (coords) {
                L.marker(center).addTo(familyGpsMap)
                    .bindPopup(`Hộ gia đình ${familyId || ''}`)
                    .openPopup();
            }
        }

        // Member-edit request modal: a resident can propose changes to any of a
        // household member's info fields (name, birth year, Căn Cước, phone), but it
        // stays "Chờ duyệt" (pending) until an Admin approves it — residents
        // cannot write these fields directly.
