        function renderMobileStats() {
            const container = document.getElementById('mobile-stats-grid');
            if (!container) return;
            const stats = (villageDb.homeContent && villageDb.homeContent.stats) || [];
            container.innerHTML = stats.map(s => `
                <div class="flex items-center gap-2">
                    <span class="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center text-xs shrink-0">
                        <i class="fa-solid ${s.icon}"></i>
                    </span>
                    <div class="min-w-0">
                        <p class="text-sm font-black text-stone-900 leading-none">${s.value} <span class="text-[10px] font-semibold text-primary-600">${s.unit}</span></p>
                        <p class="text-[9px] text-stone-400 truncate">${s.label}</p>
                    </div>
                </div>
            `).join('');
        }

        function initMobileHeroCarousel() {
            const track = document.getElementById('mobile-hero-track');
            const dotsWrap = document.getElementById('mobile-hero-dots');
            if (!track || !dotsWrap) return;
            const slideCount = track.children.length;
            const dotClass = (active) => `w-1.5 h-1.5 rounded-full transition-colors ${active ? 'bg-primary-600' : 'bg-stone-300'}`;
            dotsWrap.innerHTML = Array.from({ length: slideCount }).map((_, i) => `<span class="${dotClass(i === 0)}" data-dot="${i}"></span>`).join('');
            let ticking = false;
            track.addEventListener('scroll', () => {
                if (ticking) return;
                ticking = true;
                requestAnimationFrame(() => {
                    const idx = Math.round(track.scrollLeft / track.clientWidth);
                    dotsWrap.querySelectorAll('[data-dot]').forEach((d, i) => {
                        d.className = dotClass(i === idx);
                    });
                    ticking = false;
                });
            });
        }

        function renderHomeStats() {
            const container = document.getElementById('home-stats-grid');
            if (!container) return;
            const stats = (villageDb.homeContent && villageDb.homeContent.stats) || [];
            container.innerHTML = stats.map(s => `
                <div class="p-6">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                            <i class="fa-solid ${s.icon}"></i>
                        </div>
                        <h3 class="text-sm font-bold text-stone-700">${s.label}</h3>
                    </div>
                    <div class="text-3xl font-black text-stone-900 font-serif mb-3 flex items-baseline gap-1">
                        ${s.value} <span class="text-base text-primary-600 font-sans font-semibold">${s.unit}</span>
                    </div>
                    <div class="space-y-1.5 text-xs text-stone-400 border-t border-stone-100 pt-3">
                        ${(s.breakdown || []).map(b => `
                            <div class="flex justify-between">
                                <span>${b.label}</span>
                                <span class="text-stone-700 font-medium">${b.value}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        }

        let homeNewsFilter = 'all';
        function renderHomeNews() {
            const grid = document.getElementById('news-grid');
            if (!grid) return;
            const news = (villageDb.homeContent && villageDb.homeContent.news) || [];
            const visible = homeNewsFilter === 'all' ? news : news.filter(n => n.categorySlug === homeNewsFilter);
            grid.innerHTML = visible.map(n => `
                <button onclick="openNewsDetail('${n.id}')" class="w-full text-left px-5 py-4 hover:bg-stone-50 transition-colors flex gap-3 items-start">
                    <div class="w-9 h-9 rounded-lg ${n.colorClass} flex items-center justify-center shrink-0 mt-0.5">
                        <i class="fa-solid fa-bullhorn text-xs"></i>
                    </div>
                    <div class="min-w-0">
                        <p class="text-sm font-semibold text-stone-800 leading-snug line-clamp-2">${n.title}</p>
                        <p class="text-[11px] text-stone-500 mt-1">${n.category} · ${n.date}</p>
                    </div>
                </button>
            `).join('') || '<p class="text-stone-500 text-sm text-center py-8">Chưa có thông báo nào.</p>';
        }

        function filterNews(category) {
            homeNewsFilter = category;
            const buttons = ['all', 'hanh-chinh', 'san-xuat', 'doan-the'];
            buttons.forEach(btn => {
                const b = document.getElementById(`btn-news-${btn}`);
                if (!b) return;
                b.className = btn === category
                    ? "px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-primary-600 text-white transition-all"
                    : "px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-stone-100 text-stone-400 hover:bg-stone-200 transition-all";
            });
            renderHomeNews();
        }

        // Site-wide search: delegates to a Google "site:" search opened in a
        // new tab, so it can surface any content on the site (not just news)
        // without needing our own search index. Falls back to the real
        // deployed domain if run somewhere window.location.hostname isn't
        // meaningful (e.g. opened as a local file).
        function runSiteSearch(inputId) {
            const input = document.getElementById(inputId || 'site-search-input');
            if (!input) return;
            const q = input.value.trim();
            if (!q) return;
            const site = window.location.hostname || 'thondoanket.netlify.app';
            window.open(`https://www.google.com/search?q=${encodeURIComponent('site:' + site + ' ' + q)}`, '_blank');
        }

        function openNewsDetail(id) {
            const data = (villageDb.homeContent.news || []).find(n => n.id === id);
            if (!data) return;
            document.getElementById('news-modal-category').innerText = data.category;
            document.getElementById('news-modal-category').className = `px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${data.colorClass}`;
            document.getElementById('news-modal-date').innerText = data.date;
            document.getElementById('news-modal-title').innerText = data.title;
            document.getElementById('news-modal-content').innerText = data.content;
            document.getElementById('news-modal').classList.remove('hidden');
        }

        function closeNewsDetail() {
            document.getElementById('news-modal').classList.add('hidden');
        }

        function renderHomeProducts() {
            const container = document.getElementById('products-grid');
            if (!container) return;
            const products = (villageDb.homeContent && villageDb.homeContent.products) || [];
            container.innerHTML = products.map(p => `
                <a href="#nong-san" class="group flex flex-col items-center gap-1.5 text-center" title="${p.name}">
                    <div class="w-full aspect-square rounded-xl overflow-hidden border border-stone-100">
                        <img src="${p.image}" onerror="this.src='https://placehold.co/200x200/f0fdf4/16a34a?text=${encodeURIComponent(p.name)}'" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                    </div>
                    <span class="text-[11px] font-semibold text-stone-600 group-hover:text-primary-600 leading-tight">${p.name}</span>
                </a>
            `).join('') || '<p class="text-stone-500 text-xs col-span-3 text-center py-4">Chưa có nông sản nào.</p>';
        }

        // Ghép số điện thoại từ hồ sơ cư dân cùng tên với một tài khoản, dùng
        // chung cho cả "Ban Tự Quản" và "Tổ An Ninh Trật Tự" trên trang chủ.
        function getResidentPhoneDisplay(accountName) {
            const res = villageDb.residents.find(r => r.name === accountName);
            const phone = (res && res.phone) || '';
            return { phone, phoneDisplay: phone ? phone.replace(/(\d{3,4})(\d{3})(\d{3,4})/, '$1.$2.$3') : '' };
        }

        // "Ban Tự Quản" trên trang chủ được sinh trực tiếp từ villageDb.accounts
        // (tài khoản nào có trường chucvu — chức vụ công khai — thì xuất hiện ở
        // đây), ghép thêm số điện thoại từ hồ sơ cư dân cùng tên, nên mục này
        // luôn đồng bộ với dữ liệu dân cư/tài khoản thật thay vì một danh sách
        // soạn thảo riêng dễ bị lệch dữ liệu. Tài khoản role "Tổ ANTT" không
        // xuất hiện ở đây — họ có mục riêng, xem getPublicSecurityRoster().
        function getPublicLeadershipList() {
            return villageDb.accounts
                .filter(a => a.chucvu && a.chucvu.trim() && a.role !== 'Tổ ANTT')
                .map(a => ({ role: a.chucvu, name: a.name, ...getResidentPhoneDisplay(a.name) }));
        }

        // "Tổ An Ninh Trật Tự" trên trang chủ được sinh từ mọi tài khoản có
        // role "Tổ ANTT" — chucvu của tài khoản là chức danh trong tổ (Tổ
        // Trưởng/Tổ Phó/Tổ Viên, mặc định "Tổ Viên" nếu bỏ trống), nên luôn
        // khớp với danh sách tài khoản Tổ ANTT thật thay vì soạn thảo riêng.
        function getPublicSecurityRoster() {
            const rank = { 'Tổ Trưởng': 0, 'Tổ Phó': 1 };
            return villageDb.accounts
                .filter(a => a.role === 'Tổ ANTT')
                .map(a => ({ title: (a.chucvu && a.chucvu.trim()) || 'Tổ Viên', name: a.name, ...getResidentPhoneDisplay(a.name) }))
                .sort((a, b) => (rank[a.title] ?? 2) - (rank[b.title] ?? 2));
        }

        function renderHomeLeadership() {
            const container = document.getElementById('leadership-grid');
            if (!container) return;
            const list = getPublicLeadershipList();
            container.innerHTML = list.map(l => {
                const name = l.phone
                    ? `<a href="tel:${l.phone}" class="hover:text-primary-600 transition-colors">${l.name}</a>`
                    : l.name;
                return `
                    <div class="flex items-center justify-between gap-2 py-2 border-b border-stone-100 last:border-0">
                        <span class="text-stone-400">${l.role}:</span>
                        <span class="font-semibold text-stone-800 text-right">${name}</span>
                    </div>
                `;
            }).join('') || '<p class="text-stone-500 text-center py-4">Chưa có nhân sự nào.</p>';
        }

        function renderHomeSecurity() {
            const sec = (villageDb.homeContent && villageDb.homeContent.security) || { hotline: '', hotlineDisplay: '', slogan: '' };
            const members = getPublicSecurityRoster();
            const chief = members.find(m => m.title === 'Tổ Trưởng');
            const deputies = members.filter(m => m.title === 'Tổ Phó');
            const others = members.filter(m => m.title !== 'Tổ Trưởng' && m.title !== 'Tổ Phó');

            const chart = document.getElementById('security-org-chart');
            if (chart) {
                chart.innerHTML = `
                    <div class="flex flex-col items-center gap-2">
                        ${chief ? `<div class="px-3 py-2 rounded-lg bg-primary-600 text-white text-[11px] font-bold text-center shadow-sm">${chief.title}<br><span class="font-normal">${chief.name}</span></div>` : ''}
                        ${deputies.length ? `
                        <div class="w-px h-3 bg-stone-300"></div>
                        <div class="flex items-start gap-3">
                            ${deputies.map(d => `<div class="px-3 py-2 rounded-lg bg-primary-50 text-primary-700 border border-primary-100 text-[11px] font-bold text-center">${d.title}<br><span class="font-normal">${d.name}</span></div>`).join('')}
                        </div>` : ''}
                        ${others.length ? `<div class="text-[11px] text-stone-500 pt-1">Tổ viên (${others.length} người)</div>` : ''}
                        ${sec.slogan ? `<p class="text-[11px] text-stone-500 italic pt-1 text-center">"${sec.slogan}"</p>` : ''}
                    </div>
                `;
            }

            const bannerLink = document.getElementById('security-hotline-banner-link');
            if (bannerLink) {
                bannerLink.href = `tel:${sec.hotline}`;
                bannerLink.innerHTML = `<i class="fa-solid fa-phone"></i> ${sec.hotlineDisplay}`;
            }
        }

        function openInfoModal(title) {
            document.getElementById('info-modal-title').innerText = title;
            document.getElementById('info-modal').classList.remove('hidden');
        }

        function closeInfoModal() {
            document.getElementById('info-modal').classList.add('hidden');
        }

        function openLeadershipModal() {
            const list = getPublicLeadershipList();
            const body = document.getElementById('info-modal-body');
            body.innerHTML = list.map(l => `
                <div class="flex items-center justify-between gap-3 py-3 border-b border-stone-100 last:border-0">
                    <div class="min-w-0">
                        <p class="text-[11px] font-bold text-primary-600 uppercase tracking-wide">${l.role}</p>
                        <p class="text-sm font-semibold text-stone-800">${l.name}</p>
                    </div>
                    ${l.phone
                        ? `<a href="tel:${l.phone}" class="shrink-0 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-600 text-xs font-bold hover:bg-primary-100 transition-colors"><i class="fa-solid fa-phone mr-1"></i>${l.phoneDisplay}</a>`
                        : ''}
                </div>
            `).join('') || '<p class="text-stone-500 text-sm text-center py-6">Chưa có nhân sự nào.</p>';
            openInfoModal('Ban Tự Quản & Hệ Thống Chính Trị');
        }

        function openSecurityModal() {
            const sec = (villageDb.homeContent && villageDb.homeContent.security) || { hotline: '', hotlineDisplay: '', slogan: '' };
            const members = getPublicSecurityRoster();
            const body = document.getElementById('info-modal-body');
            body.innerHTML = `
                ${sec.slogan ? `<p class="text-center text-xs italic text-stone-400 pb-2 border-b border-stone-100">"${sec.slogan}"</p>` : ''}
                <div class="divide-y divide-stone-100">
                    ${members.map(m => `
                        <div class="flex items-center justify-between gap-3 py-3">
                            <div class="min-w-0">
                                <p class="text-[11px] font-bold text-emerald-600 uppercase tracking-wide">${m.title}</p>
                                <p class="text-sm font-semibold text-stone-800">${m.name}</p>
                            </div>
                            <a href="tel:${m.phone}" class="shrink-0 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-600 text-xs font-bold hover:bg-primary-100 transition-colors"><i class="fa-solid fa-phone mr-1"></i>${m.phoneDisplay}</a>
                        </div>
                    `).join('') || '<p class="text-stone-500 text-sm text-center py-6">Chưa có thành viên nào.</p>'}
                </div>
                <a href="tel:${sec.hotline}" class="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wide transition-colors">
                    <i class="fa-solid fa-phone"></i> Đường Dây Nóng 24/7 · ${sec.hotlineDisplay}
                </a>
            `;
            openInfoModal('Tổ An Ninh Trật Tự Cơ Sở');
        }

        function renderHomeGallery() {
            const track = document.getElementById('gallery-track');
            if (!track) return;
            const items = (villageDb.homeContent && villageDb.homeContent.gallery) || [];
            track.innerHTML = items.map(g => `
                <div class="shrink-0 w-56 rounded-2xl overflow-hidden border border-stone-100 group">
                    <div class="h-36 overflow-hidden">
                        <img src="${g.image}" alt="${g.caption}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                    </div>
                    <p class="p-3 text-xs font-medium text-stone-600 leading-snug">${g.caption}</p>
                </div>
            `).join('') || '';
        }

        function scrollGallery(direction) {
            const track = document.getElementById('gallery-track');
            if (!track) return;
            track.scrollBy({ left: direction * 240, behavior: 'smooth' });
        }

        function trackVisit() {
            const todayEl = document.getElementById('visit-today');
            const totalEl = document.getElementById('visit-total');
            if (!todayEl && !totalEl) return;
            const todayKey = new Date().toISOString().slice(0, 10);
            const stats = JSON.parse(localStorage.getItem('village_visit_stats') || 'null') || { date: '', today: 0, total: 156789 };
            if (stats.date !== todayKey) {
                stats.date = todayKey;
                stats.today = 0;
            }
            stats.today += 1;
            stats.total += 1;
            localStorage.setItem('village_visit_stats', JSON.stringify(stats));
            if (todayEl) todayEl.innerText = stats.today.toLocaleString('vi-VN');
            if (totalEl) totalEl.innerText = stats.total.toLocaleString('vi-VN');
        }

        function renderHomeContent() {
            renderHomeStats();
            renderMobileStats();
            renderHomeNews();
            renderHomeProducts();
            renderHomeLeadership();
            renderHomeSecurity();
            renderHomeGallery();
        }
