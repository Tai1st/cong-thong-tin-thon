// Database State
        let villageDb = {
            residents: [],
            funds: [],
            auditLogs: [],
            deleteRequests: [],
            accounts: [],
            associationQuotas: {},
            permissions: {},
            villageFund: { balance: 0, unpaidHouseholds: 0, totalHouseholds: 0, thu: [], chi: [] },
            memberEditRequests: [],
            newMemberRequests: [],
            houseNumbers: {},
            fundObligations: [],
            gpsCoords: {},
            homeContent: {},
            incidentReports: [],
            residenceRegistrations: [],
            incidentMinutes: []
        };

        const defaultResidents = [
            { id: "CD-001", name: "Nguyễn Văn Dân", dob: "12/05/1980", cccd: "066080004452", phone: "0912345001", relation: "Chủ hộ", group: "Đoàn Kết cũ", association: "Hội Nông dân", isHouseholder: true, familyId: "FAM-082" },
            { id: "CD-002", name: "Trần Thị Hoa", dob: "20/08/1983", cccd: "066183002241", phone: "0912345002", relation: "Vợ", group: "Đoàn Kết cũ", association: "Hội Phụ nữ", isHouseholder: false, familyId: "FAM-082" },
            { id: "CD-003", name: "Nguyễn Trần Tiến", dob: "03/11/2008", cccd: "066208009912", phone: "0912345003", relation: "Con", group: "Đoàn Kết cũ", association: "Chi đoàn", isHouseholder: false, familyId: "FAM-082" },
            { id: "CD-004", name: "Nguyễn Thị Mai", dob: "17/02/2012", cccd: "066312005678", phone: "", relation: "Con", group: "Đoàn Kết cũ", association: "None", isHouseholder: false, familyId: "FAM-082" },
            { id: "CD-005", name: "Phan Thị Sương", dob: "09/04/1975", cccd: "066075003344", phone: "0912345005", relation: "Chủ hộ", group: "Đoàn Kết cũ", association: "Hội Phụ nữ", isHouseholder: true, familyId: "FAM-001" },
            { id: "CD-006", name: "Lê Nhật Lâm", dob: "25/07/1994", cccd: "066094005566", phone: "0912345006", relation: "Chủ hộ", group: "Đoàn Kết cũ", association: "Chi đoàn", isHouseholder: true, familyId: "FAM-002" },
            { id: "CD-007", name: "Nguyễn Văn Giang", dob: "01/01/1955", cccd: "066055007788", phone: "0912345007", relation: "Chủ hộ", group: "Yên Khánh cũ", association: "Hội Người cao tuổi", isHouseholder: true, familyId: "FAM-003" },
            { id: "CD-008", name: "Hồ Ngọc Tiêu", dob: "14/09/1952", cccd: "066052008899", phone: "0912345008", relation: "Chủ hộ", group: "Đoàn Kết cũ", association: "Hội Cựu chiến binh", isHouseholder: true, familyId: "FAM-004" },
            { id: "CD-009", name: "Trần Quốc Đạo", dob: "22/06/1973", cccd: "066073009900", phone: "0912345009", relation: "Chủ hộ", group: "Yên Khánh cũ", association: "Hội Nông dân", isHouseholder: true, familyId: "FAM-005" },
            { id: "CD-010", name: "Phạm Văn Thành", dob: "30/03/1979", cccd: "066079012345", phone: "0912345010", relation: "Chủ hộ", group: "Yên Khánh cũ", association: "None", isHouseholder: true, familyId: "FAM-006" },
            { id: "CD-011", name: "Trần Thị Lan", dob: "05/12/1985", cccd: "066185098765", phone: "0912345011", relation: "Con", group: "Đoàn Kết cũ", association: "Hội Phụ nữ", isHouseholder: false, familyId: "FAM-001" },
            { id: "CD-012", name: "Bùi Quốc Khánh", dob: "18/10/2002", cccd: "066202024681", phone: "0912345012", relation: "Con", group: "Đoàn Kết cũ", association: "Chi đoàn", isHouseholder: false, familyId: "FAM-082" },
            { id: "CD-013", name: "Đinh Văn Thông", dob: "10/10/1970", cccd: "066070001234", phone: "0978190440", relation: "Chủ hộ", group: "Đoàn Kết cũ", association: "None", isHouseholder: true, familyId: "FAM-007" },
            { id: "CD-014", name: "Nguyễn Quốc Tài", dob: "12/03/1988", cccd: "066088004321", phone: "0987533112", relation: "Chủ hộ", group: "Đoàn Kết cũ", association: "None", isHouseholder: true, familyId: "FAM-008" }
        ];

        // Village-wide fund obligation templates ("khoản thu") — the amount/hộ that
        // every household owes. IDs match the legacy per-household fund entry ids
        // below so they represent the same obligations, and new obligations created
        // via the Trưởng thôn UI (createFundObligation) get applied to every
        // household exactly the same way.
        const defaultFundObligations = [
            { id: "NTM", name: "Quỹ xây dựng Nông thôn mới", period: "Năm 2026", amount: 500000 },
            { id: "KH", name: "Quỹ Khuyến học thôn", period: "Năm 2026", amount: 100000 },
            { id: "ANQP", name: "Quỹ Quốc phòng & An ninh", period: "Năm 2026", amount: 150000 },
            { id: "QVN", name: "Quỹ Ngày vì người nghèo", period: "Năm 2026", amount: 100000 }
        ];

        function buildDefaultHouseholdFunds(familyId, statuses) {
            return defaultFundObligations.map(o => ({
                id: o.id, name: o.name, period: o.period, amount: o.amount,
                status: statuses[o.id] ? "Đã đóng" : "Chưa đóng",
                date: statuses[o.id] || "-",
                memo: `DONG_GOP_${familyId}_${o.id}`
            }));
        }

        const defaultFunds = {
            "FAM-082": buildDefaultHouseholdFunds("FAM-082", { NTM: "05/01/2026", KH: "12/02/2026", ANQP: "20/03/2026" }),
            "FAM-001": buildDefaultHouseholdFunds("FAM-001", { NTM: "15/01/2026", KH: "15/01/2026", ANQP: "15/01/2026", QVN: "15/01/2026" }),
            "FAM-002": buildDefaultHouseholdFunds("FAM-002", { NTM: "12/02/2026", KH: "12/02/2026", ANQP: "12/02/2026", QVN: "12/02/2026" }),
            "FAM-003": buildDefaultHouseholdFunds("FAM-003", { NTM: "20/03/2026", KH: "20/03/2026", ANQP: "20/03/2026", QVN: "20/03/2026" }),
            "FAM-004": buildDefaultHouseholdFunds("FAM-004", { NTM: "22/01/2026", KH: "22/01/2026", ANQP: "22/01/2026", QVN: "22/01/2026" }),
            "FAM-005": buildDefaultHouseholdFunds("FAM-005", { NTM: "18/02/2026", KH: "18/02/2026", ANQP: "18/02/2026", QVN: "18/02/2026" }),
            "FAM-006": buildDefaultHouseholdFunds("FAM-006", {}),
            "FAM-007": buildDefaultHouseholdFunds("FAM-007", { NTM: "05/01/2026", KH: "05/01/2026", ANQP: "05/01/2026", QVN: "05/01/2026" })
        };

        const defaultAssociationQuotas = {
            "Hội Nông dân": { balance: 4200000, txs: [
                { id: "TX-001", type: "Thu", desc: "Hội phí đợt 1 năm 2026", member: "Trần Quốc Đạo", amount: 1200000, date: "15/01/2026", officer: "Trần Quốc Đạo" },
                { id: "TX-004", type: "Thu", desc: "Hội phí đợt 1 năm 2026", member: "Nguyễn Văn Dân", amount: 1200000, date: "15/01/2026", officer: "Trần Quốc Đạo" },
                { id: "TX-002", type: "Chi", desc: "Hỗ trợ mua phân bón hộ khó khăn", amount: 1200000, date: "18/03/2026", officer: "Trần Quốc Đạo" }
            ], loans: [],
                bankInfo: { bankName: "Vietcombank - Ngân hàng TMCP Ngoại thương Việt Nam", accountNumber: "9987533112", accountHolder: "NGUYEN QUOC TAI" },
                feeObligations: [{ id: "AOB-001", name: "Hội phí đợt 2 năm 2026", amount: 1200000, period: "Năm 2026" }],
                memberFunds: {
                    "CD-001": [{ id: "AOB-001", name: "Hội phí đợt 2 năm 2026", period: "Năm 2026", amount: 1200000, status: "Chưa đóng", date: "-", memo: "HOIPHI_CD-001_AOB-001" }],
                    "CD-009": [{ id: "AOB-001", name: "Hội phí đợt 2 năm 2026", period: "Năm 2026", amount: 1200000, status: "Đã đóng", date: "20/03/2026", memo: "HOIPHI_CD-009_AOB-001" }]
                }
            },
            "Hội Phụ nữ": { balance: 6150000, txs: [
                { id: "TX-003", type: "Thu", desc: "Thu quỹ đóng góp tình nghĩa", member: "Phan Thị Sương", amount: 1750000, date: "10/02/2026", officer: "Phan Thị Sương" },
                { id: "TX-005", type: "Thu", desc: "Thu quỹ đóng góp tình nghĩa", member: "Trần Thị Hoa", amount: 1750000, date: "10/02/2026", officer: "Phan Thị Sương" }
            ], loans: [],
                bankInfo: { bankName: "Vietcombank - Ngân hàng TMCP Ngoại thương Việt Nam", accountNumber: "9987533112", accountHolder: "NGUYEN QUOC TAI" },
                feeObligations: [{ id: "AOB-002", name: "Quỹ tình nghĩa đợt 2 năm 2026", amount: 1750000, period: "Năm 2026" }],
                memberFunds: {
                    "CD-002": [{ id: "AOB-002", name: "Quỹ tình nghĩa đợt 2 năm 2026", period: "Năm 2026", amount: 1750000, status: "Chưa đóng", date: "-", memo: "HOIPHI_CD-002_AOB-002" }],
                    "CD-005": [{ id: "AOB-002", name: "Quỹ tình nghĩa đợt 2 năm 2026", period: "Năm 2026", amount: 1750000, status: "Đã đóng", date: "15/03/2026", memo: "HOIPHI_CD-005_AOB-002" }],
                    "CD-011": [{ id: "AOB-002", name: "Quỹ tình nghĩa đợt 2 năm 2026", period: "Năm 2026", amount: 1750000, status: "Chờ duyệt", date: "22/03/2026 (QR)", memo: "HOIPHI_CD-011_AOB-002" }]
                }
            },
            "Chi đoàn": { balance: 1800000, txs: [], loans: [],
                bankInfo: { bankName: "Vietcombank - Ngân hàng TMCP Ngoại thương Việt Nam", accountNumber: "9987533112", accountHolder: "NGUYEN QUOC TAI" },
                feeObligations: [{ id: "AOB-003", name: "Đoàn phí năm 2026", amount: 100000, period: "Năm 2026" }],
                memberFunds: {
                    "CD-003": [{ id: "AOB-003", name: "Đoàn phí năm 2026", period: "Năm 2026", amount: 100000, status: "Chưa đóng", date: "-", memo: "HOIPHI_CD-003_AOB-003" }],
                    "CD-006": [{ id: "AOB-003", name: "Đoàn phí năm 2026", period: "Năm 2026", amount: 100000, status: "Đã đóng", date: "05/02/2026", memo: "HOIPHI_CD-006_AOB-003" }],
                    "CD-012": [{ id: "AOB-003", name: "Đoàn phí năm 2026", period: "Năm 2026", amount: 100000, status: "Chưa đóng", date: "-", memo: "HOIPHI_CD-012_AOB-003" }]
                }
            },
            "Hội Người cao tuổi": { balance: 2500000, txs: [], loans: [],
                bankInfo: { bankName: "Vietcombank - Ngân hàng TMCP Ngoại thương Việt Nam", accountNumber: "9987533112", accountHolder: "NGUYEN QUOC TAI" },
                feeObligations: [{ id: "AOB-004", name: "Hội phí năm 2026", amount: 50000, period: "Năm 2026" }],
                memberFunds: {
                    "CD-007": [{ id: "AOB-004", name: "Hội phí năm 2026", period: "Năm 2026", amount: 50000, status: "Đã đóng", date: "10/01/2026", memo: "HOIPHI_CD-007_AOB-004" }]
                }
            },
            "Hội Cựu chiến binh": { balance: 3100000, txs: [], loans: [],
                bankInfo: { bankName: "Vietcombank - Ngân hàng TMCP Ngoại thương Việt Nam", accountNumber: "9987533112", accountHolder: "NGUYEN QUOC TAI" },
                feeObligations: [{ id: "AOB-005", name: "Hội phí năm 2026", amount: 60000, period: "Năm 2026" }],
                memberFunds: {
                    "CD-008": [{ id: "AOB-005", name: "Hội phí năm 2026", period: "Năm 2026", amount: 60000, status: "Chưa đóng", date: "-", memo: "HOIPHI_CD-008_AOB-005" }]
                }
            }
        };

        const defaultAccounts = [
            { id: "ACC-001", username: "066080004452", name: "Nguyễn Văn Dân", role: "Cư dân", lastActive: "Vừa xong", status: "Hoạt động" },
            { id: "ACC-002", username: "066073009900", name: "Trần Quốc Đạo", role: "Cán bộ Hội", lastActive: "1 giờ trước", status: "Hoạt động", assoc: "Hội Nông dân" },
            { id: "ACC-003", username: "066070001234", name: "Đinh Văn Thông", role: "Trưởng thôn", lastActive: "2 giờ trước", status: "Hoạt động" },
            { id: "ACC-004", username: "admin", name: "Ban Quản Trị Hệ Thống", role: "Admin", lastActive: "Kích hoạt", status: "Hoạt động" },
            { id: "ACC-005", username: "066075003344", name: "Phan Thị Sương", role: "Cán bộ Hội", lastActive: "Chưa đăng nhập", status: "Hoạt động", assoc: "Hội Phụ nữ" },
            { id: "ACC-006", username: "066094005566", name: "Lê Nhật Lâm", role: "Cán bộ Hội", lastActive: "Chưa đăng nhập", status: "Hoạt động", assoc: "Chi đoàn" },
            { id: "ACC-007", username: "066055007788", name: "Nguyễn Văn Giang", role: "Cán bộ Hội", lastActive: "Chưa đăng nhập", status: "Hoạt động", assoc: "Hội Người cao tuổi" },
            { id: "ACC-008", username: "066052008899", name: "Hồ Ngọc Tiêu", role: "Cán bộ Hội", lastActive: "Chưa đăng nhập", status: "Hoạt động", assoc: "Hội Cựu chiến binh" },
            { id: "ACC-009", username: "066088004321", name: "Nguyễn Quốc Tài", role: "Tổ ANTT", lastActive: "Chưa đăng nhập", status: "Hoạt động" }
        ];

        const defaultLogs = [
            { time: "09/07/2026 09:12:05", action: "Thiết lập hệ thống", detail: "Khởi tạo hệ thống dữ liệu điện tử Thôn Đoàn Kết mới sáp nhập.", actor: "Hệ thống" },
            { time: "09/07/2026 09:15:30", action: "Cập nhật dữ liệu", detail: "Nhập danh sách 12 nhân khẩu thuộc hai tổ đại diện.", actor: "Admin" }
        ];

        const defaultDeleteRequests = [
            { id: "REQ-101", residentId: "CD-010", residentName: "Phạm Văn Thành", reason: "Chuyển khẩu vĩnh viễn sang địa bàn xã khác", submittedBy: "Trưởng thôn", status: "Chờ duyệt", time: "09/07/2026 10:10" }
        ];

        // Requests from a resident to change their own household member's info
        // (name, birth year, Căn Cước, phone); stays "Chờ duyệt" until an Admin
        // approves/rejects it.
        const defaultMemberEditRequests = [];
        const EDITABLE_MEMBER_FIELDS = [
            { key: "name", label: "Họ và tên" },
            { key: "relation", label: "Quan hệ với chủ hộ" },
            { key: "dob", label: "Ngày sinh" },
            { key: "cccd", label: "Số Căn Cước" },
            { key: "phone", label: "Số điện thoại" }
        ];

        // Requests from a resident to add a brand-new member to their household;
        // stays "Chờ duyệt" until an Admin approves it (which creates the resident).
        const defaultNewMemberRequests = [];

        const defaultPermissions = {
            "Cư dân": { "Căn Cước": "Xem", "Ngày sinh": "Xem", "Quỹ thôn": "Xem/Sửa", "Địa chỉ GPS": "Xem/Sửa" },
            "Cán bộ Hội": { "Căn Cước": "Xem", "Ngày sinh": "Xem", "Quỹ thôn": "Xem", "Địa chỉ GPS": "Xem/Sửa" },
            "Trưởng thôn": { "Căn Cước": "Xem/Sửa", "Ngày sinh": "Xem/Sửa", "Quỹ thôn": "Xem/Sửa", "Địa chỉ GPS": "Xem/Sửa" },
            "Tổ ANTT": { "Căn Cước": "Xem", "Ngày sinh": "Xem", "Quỹ thôn": "Khóa", "Địa chỉ GPS": "Xem" },
            "Admin": { "Căn Cước": "Xem/Sửa", "Ngày sinh": "Xem/Sửa", "Quỹ thôn": "Xem/Sửa", "Địa chỉ GPS": "Xem/Sửa" }
        };

        // Content shown on the public homepage (index.html), editable by Admin
        // via "Quản lý Trang chủ" instead of being hardcoded in the HTML. Each
        // sub-array mirrors what used to be a hand-written section on the page.
        const defaultHomeContent = {
            stats: [
                { id: "ST-001", icon: "fa-map-location-dot", label: "Diện Tích Tự Nhiên", value: "559,23", unit: "ha", breakdown: [{ label: "Thôn Đoàn Kết cũ:", value: "202,41 ha" }, { label: "Thôn Yên Khánh cũ:", value: "356,82 ha" }] },
                { id: "ST-002", icon: "fa-house-chimney", label: "Quy Mô Dân Cư", value: "363", unit: "hộ", breakdown: [{ label: "Thôn Đoàn Kết cũ:", value: "190 hộ" }, { label: "Thôn Yên Khánh cũ:", value: "173 hộ" }] },
                { id: "ST-003", icon: "fa-people-group", label: "Tổng Số Nhân Khẩu", value: "1.647", unit: "người", breakdown: [{ label: "Thôn Đoàn Kết cũ:", value: "851 người" }, { label: "Thôn Yên Khánh cũ:", value: "796 người" }] }
            ],
            news: [
                { id: "NEWS-001", categorySlug: "hanh-chinh", category: "Hành chính", colorClass: "bg-red-100 text-red-600", date: "07/07/2026", title: "Lịch tiếp công dân của Ban tự quản và giải quyết thủ tục sáp nhập mới", summary: "Nhằm tạo điều kiện cho bà con cập nhật giấy tờ hành chính liên quan sau sáp nhập, Ban tự quản tổ chức tiếp nhận...", content: "Nhằm giải quyết nhanh chóng và đồng bộ các thay đổi về hồ sơ cư trú của bà con sau khi sáp nhập hai thôn, Ban tự quản Thôn Đoàn Kết kính báo lịch làm việc như sau:\n\n- Thời gian tiếp dân: Sáng thứ Ba và thứ Năm hàng tuần (Từ 8:00 đến 11:30).\n- Địa điểm: Văn phòng Nhà Văn Hóa Thôn Đoàn Kết mới.\n- Nội dung thực hiện: Hỗ trợ người dân đăng ký đính chính thông tin hộ khẩu, cập nhật cơ sở dữ liệu đất đai, cấp giấy chứng nhận định danh số mức độ cơ sở, giải quyết các thủ tục liên quan đến sản xuất nông nghiệp và hộ tịch.\n- Người chịu trách nhiệm: Ông Đinh Văn Thông - Trưởng thôn trực tiếp chỉ đạo tiếp nhận phối hợp cùng cán bộ UBND xã Dliê Ya.", createdBy: "Admin" },
                { id: "NEWS-002", categorySlug: "san-xuat", category: "Sản xuất", colorClass: "bg-emerald-100 text-emerald-600", date: "05/07/2026", title: "Hội thảo chuyển đổi số trong sản xuất Sầu riêng chất lượng cao", summary: "Đồng hành cùng bà con nâng cao giá trị trái Sầu riêng xuất khẩu, phối hợp cùng các kỹ sư nông nghiệp đầu ngành...", content: "Với định hướng nông nghiệp là bệ phóng bứt phá kinh tế cho Thôn Đoàn Kết mới, Chi hội Nông dân phối hợp cùng Doanh nghiệp Đối tác tổ chức khóa tập huấn chuyên sâu chuyển đổi số:\n\n- Chủ đề: Áp dụng mã vùng trồng, ghi chép nhật ký điện tử và sử dụng chế phẩm sinh học chuẩn xuất khẩu cho Sầu riêng Ri6.\n- Địa điểm tập trung: Hội trường Nhà văn hóa Thôn Đoàn Kết.\n- Lợi ích tham dự: Bà con được hướng dẫn tạo tài khoản quản lý mã số vườn trồng, được kết nối với đơn vị thu mua chính ngạch xuất khẩu không qua trung gian.\n- Diễn giả: Thạc sĩ Nông nghiệp Nguyễn Hoàng Nam - Viện khoa học kỹ thuật nông lâm nghiệp Tây Nguyên (WASI).\n\nĐề nghị bà con đăng ký sớm qua đồng chí Trần Quốc Đạo - Chi hội trưởng Hội Nông dân.", createdBy: "Admin" },
                { id: "NEWS-003", categorySlug: "doan-the", category: "Đoàn thể", colorClass: "bg-amber-100 text-amber-600", date: "28/06/2026", title: "Phát động ngày \"Chủ Nhật Xanh\" trồng hoa dọc trục giao thông thôn", summary: "Bí thư Chi đoàn và Hội Phụ nữ phát động toàn dân tham gia dọn dẹp vệ sinh đường làng và trồng thêm dải hoa ngũ sắc...", content: "Thực hiện tiêu chí Xanh - Sạch - Đẹp trong bộ tiêu chí xây dựng Nông thôn mới nâng cao năm 2026, Chi đoàn Thanh niên phối hợp với Hội Liên hiệp Phụ nữ phát động chiến dịch ra quân tình nguyện:\n\n- Nội dung: Dọn dẹp hành lang lộ giới đường trục chính, nhổ cỏ hoang, dọn rác thải nhựa và tiến hành trồng 500 cây hoa ngũ sắc dọc 2km tuyến đường hoa kiểu mẫu.\n- Lực lượng nòng cốt: Đoàn viên thanh niên và toàn thể hội viên phụ nữ, đồng thời trân trọng kính mời toàn thể bà con nhân dân thu xếp công việc cùng tham gia đóng góp ngày công.\n- Thời gian xuất phát: Đúng 6h30 sáng Chủ Nhật tuần này tại trục nhà văn hóa.\n- Chỉ huy chiến dịch: Anh Lê Nhật Lâm - Bí thư Chi đoàn kiêm Thôn đội trưởng.", createdBy: "Admin" },
                { id: "NEWS-004", categorySlug: "hanh-chinh", category: "Hành chính", colorClass: "bg-red-100 text-red-600", date: "25/06/2026", title: "Triển khai chương trình hỗ trợ sinh kế và vốn vay ưu đãi sản xuất năm 2026", summary: "Hội Nông dân tổ chức rà soát nhu cầu hỗ trợ về vốn đầu tư phân bón, hệ thống tưới nước cho các hộ khó khăn...", content: "Thực hiện chủ trương xóa nghèo bền vững và đồng hành cùng bà con phát triển kinh tế tập thể, Ban quản lý thôn phối hợp với Ngân hàng Chính sách Xã hội huyện tổ chức triển khai vốn vay ưu đãi:\n\n- Đối tượng áp dụng: Các hộ gia đình trong diện chính sách, hộ có nhu cầu mở rộng quy mô trồng mắc ca, sầu riêng hữu cơ hoặc đầu tư máy móc chế biến sấy hạt cà phê, sấy tiêu.\n- Mức vay hỗ trợ: Tối đa lên đến 100 triệu đồng/hộ với lãi suất đặc biệt ưu đãi và thời gian ân hạn dài.\n- Quy trình: Hội đồng bình xét của thôn do đ/c Phan Thị Sương - Trưởng ban Công tác Mặt trận kết hợp với Hội Nông dân thẩm định công khai, dân chủ, đúng đối tượng.\n- Mọi thắc mắc và nộp hồ sơ xin liên hệ trực tiếp văn phòng thôn.", createdBy: "Admin" }
            ],
            products: [
                { id: "PRD-001", name: "Cà Phê Robusta", badge: "Chủ Lực", image: "https://file3.qdnd.vn/data/images/0/2026/01/16/upload_2080/gia%20ca%20phe%20congluan%20vn.jpg?dpi=150&quality=100&w=870", desc: "Hạt cà phê Robusta đậm đà đặc sản Tây Nguyên, trồng hữu cơ cho hương thơm thuần khiết và vị đậm mạnh mẽ.", footerLabel: "Sản lượng năm:", footerValue: "~ 900 Tấn" },
                { id: "PRD-002", name: "Sầu Riêng Ri6", badge: "Giá Trị Cao", image: "https://bizweb.dktcdn.net/100/482/702/products/3-67ba133a-54f7-451d-a46c-54b0053119dd.jpg?v=1692801715450", desc: "Cơm vàng hạt lép, dẻo ngọt đậm hương thơm, thu hoạch theo quy trình xuất khẩu sạch, an toàn cho người tiêu dùng.", footerLabel: "Diện tích:", footerValue: "120 ha" },
                { id: "PRD-003", name: "Hồ Tiêu Đen", badge: "Truyền Thống", image: "https://photo-baomoi.bmcdn.me/w500_r1/2026_07_09_125_55575040/fd474d641c2ff571ac3e.jpg", desc: "Hạt chắc, độ cay nồng sâu và thơm tự nhiên đặc trưng. Là mặt hàng thế mạnh lâu đời của bà con hai thôn cũ.", footerLabel: "Tiêu chuẩn:", footerValue: "VietGAP" },
                { id: "PRD-004", name: "Hạt Mắc Ca", badge: "Kinh Tế Mới", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7Uc344hSjd3Yjd21c4DB95oDglkyIhGJGV1ztF4wSNcY5r0U8ZfHzRVo&s=10", desc: "Nữ hoàng các loại hạt, hạt to tròn đều, chứa hàm lượng dinh dưỡng cao, béo ngậy được thị trường cực kỳ ưa chuộng.", footerLabel: "Sản xuất:", footerValue: "Xấy nứt vỏ" },
                { id: "PRD-005", name: "Chanh Dây Tím", badge: "Dài Hạn", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMiTeYLc1h3PI5EN2VTStE-9BMveIgFSgX00PaCTdNkl_eORIMyIADTSs5&s=10", desc: "Sản vật mọng nước, vị chua ngọt dạt dào sảng khoái, nguồn nguyên liệu hoàn hảo xuất khẩu đi các nước EU.", footerLabel: "Nguồn gốc:", footerValue: "Chuẩn xuất khẩu" }
            ],
            leadership: [
                { id: "LD-001", initials: "HXC", colorTheme: "red", role: "Bí Thư Chi Bộ Thôn", name: "Đ/c Hoàng Xuân Chiển", desc: "Chịu trách nhiệm lãnh đạo toàn diện công tác Đảng và định hướng chính trị cho phong trào địa phương.", actionType: "phone", phone: "0962994479", phoneDisplay: "0962.994.479" , decorIcon: "fa-star" },
                { id: "LD-002", initials: "ĐVT", colorTheme: "primary", role: "Trưởng Thôn Đoàn Kết", name: "Ông Đinh Văn Thông", desc: "Phụ trách quản lý hành chính, điều hành các hoạt động kinh tế, an ninh trật tự trên địa bàn toàn thôn.", actionType: "phone", phone: "0978190440", phoneDisplay: "0978.190.440" , decorIcon: "fa-landmark" },
                { id: "LD-003", initials: "PTS", colorTheme: "amber", role: "Trưởng Ban CTMT", name: "Bà Phan Thị Sương", desc: "Đầu mối đại đoàn kết toàn dân, gắn kết các tầng lớp nhân dân và khối đại đoàn kết các dân tộc.", actionType: "phone", phone: "0365045342", phoneDisplay: "0365.045.342" , decorIcon: "fa-handshake-angle" },
                { id: "LD-004", initials: "LNL", colorTheme: "blue", role: "Bí Thư Đoàn • Thôn Đội Trưởng", name: "Anh Lê Nhật Lâm", desc: "Thủ lĩnh thanh niên, xung kích chuyển đổi số, tình nguyện, đồng thời chỉ huy quốc phòng, dân quân tự vệ.", actionType: "tag", tagIcon: "fa-bolt", tagLabel: "Xung kích" , decorIcon: "fa-shield-halved" },
                { id: "LD-005", initials: "NTH", colorTheme: "rose", role: "Hội Trưởng Phụ Nữ", name: "Bà Nguyễn Thị Hương", desc: "Chăm lo đời sống hội viên phụ nữ, xây dựng gia đình ấm no, bình đẳng, tiến bộ, hạnh phúc toàn diện.", actionType: "tag", tagIcon: "fa-heart", tagLabel: "Nhân ái" , decorIcon: "fa-venus" },
                { id: "LD-006", initials: "NVG", colorTheme: "emerald", role: "Hội Người Cao Tuổi", name: "Ông Nguyễn Văn Giang", desc: "Nêu cao tinh thần \"Tuổi cao chí càng cao, gương sáng xây dựng và bảo vệ vững vàng Tổ quốc\".", actionType: "tag", tagIcon: "fa-award", tagLabel: "Gương mẫu" , decorIcon: "fa-medal" },
                { id: "LD-007", initials: "HNT", colorTheme: "slate", role: "Hội Cựu Chiến Binh", name: "Ông Hồ Ngọc Tiêu", desc: "Giữ vững phẩm chất \"Bộ đội Cụ Hồ\", đi đầu trong công tác giữ gìn an ninh và giáo dục thế hệ trẻ lòng yêu nước.", actionType: "tag", tagIcon: "fa-flag", tagLabel: "Kỷ luật" , decorIcon: "fa-person-military-pointing" },
                { id: "LD-008", initials: "TQĐ", colorTheme: "lime", role: "Chi Hội Trưởng Nông Dân", name: "Ông Trần Quốc Đạo", desc: "Trọng tâm thúc đẩy các mô hình sản xuất nông nghiệp công nghệ cao, liên kết làm giàu chính đáng.", actionType: "tag", tagIcon: "fa-seedling", tagLabel: "Kiến tạo" , decorIcon: "fa-leaf" }
            ],
            security: {
                hotline: "0987533112",
                hotlineDisplay: "0987.533.112",
                slogan: "Đoàn kết - Chủ động - Kỷ cương - An toàn",
                members: [
                    { id: "SEC-001", title: "Tổ Trưởng", name: "Nguyễn Quốc Tài", phone: "0987533112", phoneDisplay: "0987 533 112" },
                    { id: "SEC-002", title: "Tổ Phó", name: "Nguyễn Văn Hải", phone: "0949307225", phoneDisplay: "0949 307 225" },
                    { id: "SEC-003", title: "Tổ Viên", name: "Đặng Trung Văn", phone: "0974455458", phoneDisplay: "0974 455 458" },
                    { id: "SEC-004", title: "Tổ Viên", name: "Hà Vĩnh Tuy", phone: "0989778599", phoneDisplay: "0989 778 599" },
                    { id: "SEC-005", title: "Tổ Viên", name: "Đinh Văn Cường", phone: "0368444449", phoneDisplay: "0368 444 449" },
                    { id: "SEC-006", title: "Tổ Viên", name: "Nguyễn Văn Tú", phone: "0977354354", phoneDisplay: "0977 354 354" }
                ]
            },
            schedule: [
                { id: "SCH-001", day: "25", month: "Tháng 5", title: "Hội nghị nhân dân quý II/2026", location: "Nhà văn hóa thôn", time: "07:30" },
                { id: "SCH-002", day: "28", month: "Tháng 5", title: "Tập huấn kỹ thuật trồng sầu riêng", location: "Vườn mẫu thôn", time: "08:00" },
                { id: "SCH-003", day: "05", month: "Tháng 6", title: "Ngày Chủ nhật xanh", location: "Toàn thôn", time: "07:00" }
            ],
            gallery: [
                { id: "GAL-001", image: "https://placehold.co/400x260/dcfce7/15803d?text=Hop+trien+khai", caption: "Họp triển khai kế hoạch sản xuất vụ Hè Thu 2026" },
                { id: "GAL-002", image: "https://placehold.co/400x260/fef3c7/b45309?text=Thu+hoach+ca+phe", caption: "Bà con thu hoạch cà phê Robusta đầu vụ" },
                { id: "GAL-003", image: "https://placehold.co/400x260/bbf7d0/166534?text=Chu+Nhat+Xanh", caption: "Ra quân \"Chủ Nhật Xanh\" dọn vệ sinh đường làng" },
                { id: "GAL-004", image: "https://placehold.co/400x260/fee2e2/b91c1c?text=Trong+hoa+duong+lang", caption: "Chi đoàn thanh niên trồng hoa dọc tuyến đường kiểu mẫu" },
                { id: "GAL-005", image: "https://placehold.co/400x260/dbeafe/1d4ed8?text=Giao+luu+the+thao", caption: "Giao lưu thể thao chào mừng thôn Đoàn Kết mới" },
                { id: "GAL-006", image: "https://placehold.co/400x260/fce7f3/a21caf?text=Nha+sach+vuon+dep", caption: "Hội Phụ nữ phát động phong trào \"Nhà sạch, vườn đẹp\"" }
            ]
        };

        // Village-wide fund ledger (separate from a household's own dues and
        // from per-association quotas): Thu = collected from households,
        // Chi = what the village spent the fund on.
        // Generates the public "Thu" ledger straight from each household's own
        // fund-obligation statuses above, so the two views can never drift apart:
        // every "Đã đóng" entry in defaultFunds becomes one Thu transaction here.
        function buildDefaultVillageThu() {
            const thu = [];
            let counter = 1;
            Object.keys(defaultFunds).forEach(familyId => {
                const head = defaultResidents.find(r => r.familyId === familyId && r.isHouseholder);
                if (!head) return;
                defaultFunds[familyId].forEach(f => {
                    if (f.status === "Đã đóng") {
                        thu.push({
                            id: `VT-${String(counter).padStart(3, '0')}`,
                            household: head.name,
                            desc: `Hộ ${head.name} đóng góp: ${f.name}`,
                            amount: f.amount,
                            date: f.date
                        });
                        counter++;
                    }
                });
            });
            return thu;
        }

        const defaultVillageFund = {
            balance: 45200000,
            unpaidHouseholds: 12,
            totalHouseholds: 363,
            bankInfo: { bankName: "Vietcombank - Ngân hàng TMCP Ngoại thương Việt Nam", accountNumber: "9987533112", accountHolder: "NGUYEN QUOC TAI" },
            thu: buildDefaultVillageThu(),
            chi: [
                { id: "VC-001", desc: "Chi xây dựng đường bê tông liên thôn", amount: 150000000, date: "12/02/2026" },
                { id: "VC-002", desc: "Chi hỗ trợ hộ nghèo dịp Tết", amount: 60000000, date: "20/01/2026" },
                { id: "VC-003", desc: "Chi mua sắm trang thiết bị Nhà văn hóa thôn", amount: 45000000, date: "01/03/2026" }
            ],
            unpaidHouseholdsList: [
                { familyId: "FAM-006", representative: "Phạm Văn Thành", dob: "30/03/1979", group: "Yên Khánh cũ", unpaidAmount: 750000 },
                { familyId: "FAM-014", representative: "Lê Thị Bích", dob: "22/06/1988", group: "Đoàn Kết cũ", unpaidAmount: 750000 },
                { familyId: "FAM-027", representative: "Nguyễn Văn Hùng", dob: "14/11/1982", group: "Đoàn Kết cũ", unpaidAmount: 750000 },
                { familyId: "FAM-033", representative: "Trần Văn Sáu", dob: "07/08/1975", group: "Yên Khánh cũ", unpaidAmount: 750000 },
                { familyId: "FAM-041", representative: "Hoàng Thị Nga", dob: "19/04/1990", group: "Đoàn Kết cũ", unpaidAmount: 750000 }
            ]
        };

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
                    : {};
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
                villageDb.gpsCoords = {};
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
            else if (residentAssocTabMap[tabId]) renderResidentAssociationDetail(residentAssocTabMap[tabId]);
        }

        // -----------------------------------------------------------------------------------
        // 1. CƯ DÂN TABS RENDERERS & LOGIC
        // -----------------------------------------------------------------------------------
        // Household-info card pinned to the bottom of the resident sidebar
        // (chủ hộ / địa chỉ / sĩ số), plus the header notification-bell badge
        // showing how many of the current user's requests are still pending.
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
            const sec = (villageDb.homeContent && villageDb.homeContent.security) || { hotline: '', hotlineDisplay: '', members: [] };
            const chief = (sec.members || []).find(m => m.title === 'Tổ Trưởng');

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
                        <div class="relative w-full h-48 sm:h-64 rounded-2xl border border-stone-200 bg-stone-50 overflow-hidden flex items-center justify-center">
                            <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px]"></div>
                            <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950 z-10 pointer-events-none"></div>

                            <!-- Flashing Household Marker -->
                            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                                <span class="absolute w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500 animate-ping"></span>
                                <span class="w-4 h-4 rounded-full bg-emerald-500 border-2 border-stone-950 shadow-lg flex items-center justify-center text-[7px] text-stone-900 font-bold"><i class="fa-solid fa-house-chimney"></i></span>
                                <span class="mt-1 px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-500/30 text-[8px] text-emerald-600 font-bold whitespace-nowrap">Hộ gia đình ${familyId || ''}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Member-edit request modal: a resident can propose changes to any of a
        // household member's info fields (name, birth year, Căn Cước, phone), but it
        // stays "Chờ duyệt" (pending) until an Admin approves it — residents
        // cannot write these fields directly.
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
                phone: document.getElementById('request-member-phone-input').value.trim()
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
                oldValues: { name: res.name, relation: res.relation || '', dob: res.dob, cccd: res.cccd, phone: res.phone || '' },
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
                id: reqId, familyId, name, relation, dob, cccd, phone,
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
            villageDb.residents.push({
                id: newId, name: req.name, dob: req.dob, cccd: req.cccd || "Chưa cấp", phone: req.phone || "",
                relation: req.relation, group: "Chưa xác định", association: "None",
                isHouseholder: false, familyId: req.familyId
            });

            saveDatabase();
            addLog("Phê duyệt thêm thành viên", `Admin phê duyệt thêm thành viên mới "${req.name}" (${req.relation}) vào hộ ${req.familyId}.`, "Admin");
            showCustomAlert('success', 'Phê duyệt hoàn tất', `Đã thêm thành viên "${req.name}" vào hồ sơ nhân khẩu.`);
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

            const accountedNames = new Set(villageDb.accounts.map(a => a.name));
            const availableResidents = villageDb.residents.filter(r => !accountedNames.has(r.name));
            const residentDatalistOptions = availableResidents.map(r => `<option value="${r.name}">`).join('');

            container.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                    <div>
                        <h4 class="font-serif text-lg font-bold text-stone-900">Quản lý tài khoản, Cấp quyền & Đổi mật khẩu</h4>
                        <p class="text-xs text-stone-500">Bảo mật hệ điều hành thôn số, cấp phát tài khoản đặc thù cán bộ.</p>
                    </div>
                    <button onclick="syncAllResidentAccounts()" class="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-primary-950/50 flex items-center gap-2 shrink-0">
                        <i class="fa-solid fa-arrows-rotate"></i> Đồng bộ tài khoản toàn bộ cư dân
                    </button>
                </div>
                <p class="text-[11px] text-stone-400 -mt-2">${availableResidents.length} / ${villageDb.residents.length} cư dân chưa có tài khoản đăng nhập.</p>

                <!-- Add Account Card -->
                <div class="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-left space-y-4">
                    <h5 class="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                        <i class="fa-solid fa-user-plus text-primary-400"></i>
                        <span>Thêm Tài Khoản Mới</span>
                    </h5>
                    <form onsubmit="createNewAccount(event)" class="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                        <div class="space-y-1">
                            <label class="text-[9px] uppercase font-bold text-stone-400 block">Chọn cư dân</label>
                            <input type="text" id="new-account-resident" list="new-account-resident-datalist" oninput="updateNewAccountUsername()" placeholder="Gõ để tìm cư dân..." autocomplete="off" required class="w-full px-3 py-2 rounded-lg bg-white border border-stone-200 text-stone-900 text-xs outline-none focus:border-primary-500">
                            <datalist id="new-account-resident-datalist">
                                ${residentDatalistOptions}
                            </datalist>
                        </div>
                        <div class="space-y-1 hidden">
                            <label class="text-[9px] uppercase font-bold text-stone-400 block">Tên đăng nhập (Số Căn Cước)</label>
                            <input type="text" id="new-account-username" readonly placeholder="Tự động điền" class="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-500 text-xs outline-none cursor-not-allowed">
                        </div>
                        <div class="space-y-1">
                            <label class="text-[9px] uppercase font-bold text-stone-400 block">Vai trò</label>
                            <select id="new-account-role" onchange="toggleNewAccountAssocField()" class="w-full px-3 py-2 rounded-lg bg-white border border-stone-200 text-stone-900 text-xs outline-none focus:border-primary-500">
                                <option value="Cư dân">Cư dân</option>
                                <option value="Cán bộ Hội">Cán bộ Hội</option>
                                <option value="Trưởng thôn">Trưởng thôn</option>
                                <option value="Tổ ANTT">Tổ ANTT</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                        <div class="space-y-1 hidden" id="new-account-assoc-field">
                            <label class="text-[9px] uppercase font-bold text-stone-400 block">Hội phụ trách (Hội trưởng)</label>
                            <select id="new-account-assoc" class="w-full px-3 py-2 rounded-lg bg-white border border-stone-200 text-stone-900 text-xs outline-none focus:border-primary-500">
                                ${Object.keys(villageDb.associationQuotas).map(n => `<option value="${n}">${n}</option>`).join('') || '<option disabled>Chưa có hội nào</option>'}
                            </select>
                        </div>
                        <button type="submit" class="w-full py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs uppercase transition-colors">Tạo tài khoản</button>
                    </form>
                </div>

                <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50 text-left">
                    <table class="w-full text-left text-xs">
                        <thead>
                            <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                <th class="p-3 font-semibold">Tên tài khoản cư dân</th>
                                <th class="p-3 font-semibold">Tên đăng nhập</th>
                                <th class="p-3 font-semibold">Nhóm vai trò</th>
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

        function updateNewAccountUsername() {
            const name = document.getElementById('new-account-resident').value.trim();
            const res = villageDb.residents.find(r => r.name === name);
            document.getElementById('new-account-username').value = (res && res.cccd && res.cccd !== 'Chưa cấp') ? res.cccd : '';
        }

        function toggleNewAccountAssocField() {
            const role = document.getElementById('new-account-role').value;
            document.getElementById('new-account-assoc-field').classList.toggle('hidden', role !== 'Cán bộ Hội');
        }

        // Bulk-creates a "Cư dân" account (username = Căn Cước) for every resident
        // who doesn't already have an account, so account management stays in
        // sync with the full resident roster instead of relying on Admin adding
        // people one at a time. Residents without a valid Căn Cước yet (e.g. minors
        // not issued one) are skipped and reported separately.
        function syncAllResidentAccounts() {
            const accountedNames = new Set(villageDb.accounts.map(a => a.name));
            const candidates = villageDb.residents.filter(r => !accountedNames.has(r.name));

            let created = 0;
            let skipped = 0;
            candidates.forEach(res => {
                if (!res.cccd || res.cccd === 'Chưa cấp') {
                    skipped++;
                    return;
                }
                const accId = `ACC-${Math.floor(100 + Math.random()*900)}-${created}`;
                villageDb.accounts.push({
                    id: accId, username: res.cccd, name: res.name, role: "Cư dân",
                    lastActive: "Chưa đăng nhập", status: "Hoạt động"
                });
                created++;
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

        function createNewAccount(e) {
            e.preventDefault();
            const residentName = document.getElementById('new-account-resident').value.trim();
            const role = document.getElementById('new-account-role').value;

            const res = villageDb.residents.find(r => r.name === residentName);
            if (!res) {
                showCustomAlert('error', 'Lỗi tạo tài khoản', 'Vui lòng chọn một cư dân hợp lệ từ danh sách gợi ý.');
                return;
            }
            if (!res.cccd || res.cccd === 'Chưa cấp') {
                showCustomAlert('error', 'Lỗi tạo tài khoản', 'Cư dân này chưa có số Căn Cước hợp lệ để làm tên đăng nhập.');
                return;
            }
            if (villageDb.accounts.some(a => a.name === res.name)) {
                showCustomAlert('error', 'Lỗi tạo tài khoản', 'Cư dân này đã có tài khoản trong hệ thống.');
                return;
            }

            let assoc;
            if (role === 'Cán bộ Hội') {
                assoc = document.getElementById('new-account-assoc').value;
                if (!assoc || !villageDb.associationQuotas[assoc]) {
                    showCustomAlert('error', 'Lỗi tạo tài khoản', 'Vui lòng chọn hội mà tài khoản này sẽ phụ trách.');
                    return;
                }
            }

            const accId = `ACC-${Math.floor(100 + Math.random()*900)}`;
            const newAcc = {
                id: accId, username: res.cccd, name: res.name, role,
                lastActive: "Chưa đăng nhập", status: "Hoạt động"
            };
            if (role === 'Cán bộ Hội') newAcc.assoc = assoc;
            villageDb.accounts.push(newAcc);

            saveDatabase();
            addLog("Tạo tài khoản mới", `Admin cấp tài khoản đăng nhập cho ${res.name} (tên đăng nhập: ${res.cccd}) với vai trò ${role}${assoc ? ` (phụ trách ${assoc})` : ''}.`, "Admin");
            showCustomAlert('success', 'Tạo tài khoản thành công', `Đã cấp tài khoản đăng nhập cho ${res.name}.`);
            renderAdminAccounts();
        }

        // Edit-account modal: lets Admin change an account's Vai trò (role) and,
        // when the role is Cán bộ Hội, which Hội nhóm it's assigned to phụ
        // trách — replaces the old inline role <select> which never let admin
        // set/clear the "assoc" field, so switching someone to/from Cán bộ Hội
        // left a stale or missing association behind.
        let editingAccountId = null;

        function openEditAccountModal(accId) {
            const acc = villageDb.accounts.find(a => a.id === accId);
            if (!acc) return;
            editingAccountId = accId;

            document.getElementById('edit-account-name').innerText = acc.name;
            document.getElementById('edit-account-username').innerText = acc.username;
            document.getElementById('edit-account-role-input').value = acc.role;

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
            const role = document.getElementById('edit-account-role-input').value;

            let assoc;
            if (role === 'Cán bộ Hội') {
                assoc = document.getElementById('edit-account-assoc-input').value;
                if (!assoc || !villageDb.associationQuotas[assoc]) {
                    showCustomAlert('error', 'Lỗi cập nhật', 'Vui lòng chọn hội mà tài khoản này sẽ phụ trách.');
                    return;
                }
            }

            acc.role = role;
            if (role === 'Cán bộ Hội') acc.assoc = assoc;
            else delete acc.assoc;

            saveDatabase();
            addLog("Thay đổi chức vụ", `Admin thay đổi vai trò của ${acc.name} từ ${oldRole} thành ${role}${assoc ? ` (phụ trách ${assoc})` : ''}.`, "Admin");
            showCustomAlert('success', 'Cập nhật thành công', `Đã cập nhật vai trò tài khoản ${acc.name}.`);
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
        const LEADERSHIP_COLORS = ["red", "primary", "amber", "blue", "rose", "emerald", "slate", "lime", "purple", "cyan", "teal", "orange", "pink", "indigo"];

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

            const leadershipRows = (hc.leadership || []).map(l => {
                const isConfirming = homeContentItemToDelete === l.id;
                const deleteBtn = isConfirming
                    ? `<button onclick="deleteHomeLeadership('${l.id}')" class="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white border border-red-500 text-[10px] font-bold"><i class="fa-solid fa-triangle-exclamation"></i> Xác nhận?</button>`
                    : `<button onclick="deleteHomeLeadership('${l.id}')" class="px-2.5 py-1 rounded bg-red-50 hover:bg-red-600 text-red-600 hover:text-white text-[10px] font-semibold"><i class="fa-solid fa-trash"></i> Xóa</button>`;
                return `
                    <tr class="hover:bg-stone-50 transition-colors">
                        <td class="p-3 font-semibold text-stone-900">${l.name}</td>
                        <td class="p-3 text-stone-600">${l.role}</td>
                        <td class="p-3 text-right space-x-2 whitespace-nowrap">
                            <button onclick="openLeadershipFormModal('${l.id}')" class="px-2.5 py-1 rounded bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-850 text-[10px]"><i class="fa-solid fa-pen-to-square mr-1"></i> Sửa</button>
                            ${deleteBtn}
                        </td>
                    </tr>
                `;
            }).join('') || '<tr><td colspan="3" class="p-4 text-center text-stone-400">Chưa có nhân sự nào.</td></tr>';

            const sec = hc.security || { hotline: '', hotlineDisplay: '', slogan: '', members: [] };
            const memberRows = (sec.members || []).map(m => {
                const isConfirming = homeContentItemToDelete === m.id;
                const deleteBtn = isConfirming
                    ? `<button onclick="deleteSecurityMember('${m.id}')" class="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white border border-red-500 text-[10px] font-bold"><i class="fa-solid fa-triangle-exclamation"></i> Xác nhận?</button>`
                    : `<button onclick="deleteSecurityMember('${m.id}')" class="px-2.5 py-1 rounded bg-red-50 hover:bg-red-600 text-red-600 hover:text-white text-[10px] font-semibold"><i class="fa-solid fa-trash"></i> Xóa</button>`;
                return `
                    <tr class="hover:bg-stone-50 transition-colors">
                        <td class="p-3 font-semibold text-stone-900">${m.name}</td>
                        <td class="p-3 text-stone-600">${m.title}</td>
                        <td class="p-3 font-mono text-stone-500">${m.phoneDisplay}</td>
                        <td class="p-3 text-right space-x-2 whitespace-nowrap">
                            <button onclick="openSecurityMemberFormModal('${m.id}')" class="px-2.5 py-1 rounded bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-850 text-[10px]"><i class="fa-solid fa-pen-to-square mr-1"></i> Sửa</button>
                            ${deleteBtn}
                        </td>
                    </tr>
                `;
            }).join('') || '<tr><td colspan="4" class="p-4 text-center text-stone-400">Chưa có thành viên nào.</td></tr>';

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
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Ban tự quản & Hệ thống chính trị</span>
                        <button onclick="openLeadershipFormModal(null)" class="px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-bold text-[11px] uppercase"><i class="fa-solid fa-plus mr-1"></i> Thêm nhân sự</button>
                    </div>
                    <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                    <th class="p-3 font-semibold">Họ và tên</th>
                                    <th class="p-3 font-semibold">Chức vụ</th>
                                    <th class="p-3 font-semibold text-right">Thao tác</th>
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
                    <div class="flex items-center justify-between pt-2">
                        <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Thành viên Tổ An ninh</span>
                        <button onclick="openSecurityMemberFormModal(null)" class="px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-bold text-[11px] uppercase"><i class="fa-solid fa-plus mr-1"></i> Thêm thành viên</button>
                    </div>
                    <div class="table-scroll overflow-x-auto rounded-xl border border-stone-200 bg-stone-50">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="border-b border-stone-200 bg-stone-50 text-stone-500">
                                    <th class="p-3 font-semibold">Họ và tên</th>
                                    <th class="p-3 font-semibold">Chức danh</th>
                                    <th class="p-3 font-semibold">Số điện thoại</th>
                                    <th class="p-3 font-semibold text-right">Thao tác</th>
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

        // --- Leadership ---
        let editingLeadershipId = null;
        function toggleLeadershipActionFields() {
            const type = document.getElementById('leadership-form-actiontype-input').value;
            document.getElementById('leadership-form-phone-fields').classList.toggle('hidden', type !== 'phone');
            document.getElementById('leadership-form-tag-fields').classList.toggle('hidden', type !== 'tag');
        }
        function openLeadershipFormModal(id) {
            editingLeadershipId = id;
            const l = id ? villageDb.homeContent.leadership.find(x => x.id === id) : null;
            document.getElementById('leadership-form-title').innerText = id ? 'Sửa nhân sự' : 'Thêm nhân sự mới';
            document.getElementById('leadership-form-initials-input').value = l ? l.initials : '';
            document.getElementById('leadership-form-color-input').innerHTML = LEADERSHIP_COLORS.map(c => `<option value="${c}" ${l && l.colorTheme === c ? 'selected' : ''}>${c}</option>`).join('');
            document.getElementById('leadership-form-decoricon-input').value = l ? (l.decorIcon || '') : '';
            document.getElementById('leadership-form-role-input').value = l ? l.role : '';
            document.getElementById('leadership-form-name-input').value = l ? l.name : '';
            document.getElementById('leadership-form-desc-input').value = l ? l.desc : '';
            document.getElementById('leadership-form-actiontype-input').value = l ? l.actionType : 'phone';
            document.getElementById('leadership-form-phone-input').value = l && l.actionType === 'phone' ? l.phone : '';
            document.getElementById('leadership-form-phonedisplay-input').value = l && l.actionType === 'phone' ? l.phoneDisplay : '';
            document.getElementById('leadership-form-tagicon-input').value = l && l.actionType === 'tag' ? l.tagIcon : '';
            document.getElementById('leadership-form-taglabel-input').value = l && l.actionType === 'tag' ? l.tagLabel : '';
            toggleLeadershipActionFields();
            openModalEl('leadership-form-modal', 'leadership-form-modal-box');
        }
        function closeLeadershipFormModal() { closeModalEl('leadership-form-modal', 'leadership-form-modal-box'); editingLeadershipId = null; }
        function saveLeadershipForm(event) {
            event.preventDefault();
            const initials = document.getElementById('leadership-form-initials-input').value.trim();
            const colorTheme = document.getElementById('leadership-form-color-input').value;
            const decorIcon = document.getElementById('leadership-form-decoricon-input').value.trim();
            const role = document.getElementById('leadership-form-role-input').value.trim();
            const name = document.getElementById('leadership-form-name-input').value.trim();
            const desc = document.getElementById('leadership-form-desc-input').value.trim();
            const actionType = document.getElementById('leadership-form-actiontype-input').value;

            if (!initials || !role || !name || !desc) {
                showCustomAlert('error', 'Thiếu thông tin', 'Vui lòng nhập đầy đủ Chữ viết tắt, Chức vụ, Họ tên và Mô tả.');
                return;
            }

            const entry = { initials, colorTheme, decorIcon, role, name, desc, actionType };
            if (actionType === 'phone') {
                entry.phone = document.getElementById('leadership-form-phone-input').value.trim();
                entry.phoneDisplay = document.getElementById('leadership-form-phonedisplay-input').value.trim();
            } else {
                entry.tagIcon = document.getElementById('leadership-form-tagicon-input').value.trim();
                entry.tagLabel = document.getElementById('leadership-form-taglabel-input').value.trim();
            }

            if (editingLeadershipId) {
                const idx = villageDb.homeContent.leadership.findIndex(x => x.id === editingLeadershipId);
                villageDb.homeContent.leadership[idx] = { id: editingLeadershipId, ...entry };
            } else {
                villageDb.homeContent.leadership.push({ id: `LD-${Math.floor(1000 + Math.random()*9000)}`, ...entry });
            }

            saveDatabase();
            addLog("Cập nhật trang chủ", `Admin ${editingLeadershipId ? 'sửa' : 'thêm'} nhân sự "${name}".`, "Admin");
            showCustomAlert('success', 'Đã lưu', `Đã ${editingLeadershipId ? 'cập nhật' : 'thêm'} nhân sự "${name}".`);
            closeLeadershipFormModal();
            renderAdminHomeContent();
        }
        function deleteHomeLeadership(id) {
            if (homeContentItemToDelete !== id) {
                homeContentItemToDelete = id;
                showCustomAlert('info', 'Xác nhận xóa', 'Nhấn "Xác nhận?" một lần nữa để xóa nhân sự này.');
                renderAdminHomeContent();
                return;
            }
            const l = villageDb.homeContent.leadership.find(x => x.id === id);
            villageDb.homeContent.leadership = villageDb.homeContent.leadership.filter(x => x.id !== id);
            homeContentItemToDelete = null;
            saveDatabase();
            addLog("Cập nhật trang chủ", `Admin xóa nhân sự "${l.name}".`, "Admin");
            showCustomAlert('info', 'Đã xóa', `Đã xóa nhân sự "${l.name}".`);
            renderAdminHomeContent();
        }

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

        let editingSecurityMemberId = null;
        function openSecurityMemberFormModal(id) {
            editingSecurityMemberId = id;
            const m = id ? villageDb.homeContent.security.members.find(x => x.id === id) : null;
            document.getElementById('security-member-form-title').innerText = id ? 'Sửa thành viên' : 'Thêm thành viên mới';
            document.getElementById('security-member-form-title-input').value = m ? m.title : '';
            document.getElementById('security-member-form-name-input').value = m ? m.name : '';
            document.getElementById('security-member-form-phone-input').value = m ? m.phone : '';
            openModalEl('security-member-form-modal', 'security-member-form-modal-box');
        }
        function closeSecurityMemberFormModal() { closeModalEl('security-member-form-modal', 'security-member-form-modal-box'); editingSecurityMemberId = null; }
        function saveSecurityMemberForm(event) {
            event.preventDefault();
            const title = document.getElementById('security-member-form-title-input').value.trim();
            const name = document.getElementById('security-member-form-name-input').value.trim();
            const phone = document.getElementById('security-member-form-phone-input').value.trim();

            if (!title || !name || !phone) {
                showCustomAlert('error', 'Thiếu thông tin', 'Vui lòng nhập đầy đủ Chức danh, Họ tên và Số điện thoại.');
                return;
            }
            const phoneDisplay = phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');

            if (editingSecurityMemberId) {
                const m = villageDb.homeContent.security.members.find(x => x.id === editingSecurityMemberId);
                Object.assign(m, { title, name, phone, phoneDisplay });
            } else {
                villageDb.homeContent.security.members.push({ id: `SEC-${Math.floor(1000 + Math.random()*9000)}`, title, name, phone, phoneDisplay });
            }

            saveDatabase();
            addLog("Cập nhật trang chủ", `Admin ${editingSecurityMemberId ? 'sửa' : 'thêm'} thành viên Tổ An ninh "${name}".`, "Admin");
            showCustomAlert('success', 'Đã lưu', `Đã ${editingSecurityMemberId ? 'cập nhật' : 'thêm'} thành viên "${name}".`);
            closeSecurityMemberFormModal();
            renderAdminHomeContent();
        }
        function deleteSecurityMember(id) {
            if (homeContentItemToDelete !== id) {
                homeContentItemToDelete = id;
                showCustomAlert('info', 'Xác nhận xóa', 'Nhấn "Xác nhận?" một lần nữa để xóa thành viên này.');
                renderAdminHomeContent();
                return;
            }
            const m = villageDb.homeContent.security.members.find(x => x.id === id);
            villageDb.homeContent.security.members = villageDb.homeContent.security.members.filter(x => x.id !== id);
            homeContentItemToDelete = null;
            saveDatabase();
            addLog("Cập nhật trang chủ", `Admin xóa thành viên Tổ An ninh "${m.name}".`, "Admin");
            showCustomAlert('info', 'Đã xóa', `Đã xóa thành viên "${m.name}".`);
            renderAdminHomeContent();
        }

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

        // -----------------------------------------------------------------------------------
        // SHARED LANDING PAGE CONTENT (index.html) — driven by villageDb.homeContent so
        // Admin can manage it from "Quản lý Trang chủ" instead of it being hardcoded HTML.
        // -----------------------------------------------------------------------------------
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

        function renderHomeLeadership() {
            const container = document.getElementById('leadership-grid');
            if (!container) return;
            const list = (villageDb.homeContent && villageDb.homeContent.leadership) || [];
            container.innerHTML = list.map(l => {
                const name = l.actionType === 'phone'
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
            const sec = (villageDb.homeContent && villageDb.homeContent.security) || { hotline: '', hotlineDisplay: '', slogan: '', members: [] };
            const members = sec.members || [];
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
            const list = (villageDb.homeContent && villageDb.homeContent.leadership) || [];
            const body = document.getElementById('info-modal-body');
            body.innerHTML = list.map(l => `
                <div class="flex items-center justify-between gap-3 py-3 border-b border-stone-100 last:border-0">
                    <div class="min-w-0">
                        <p class="text-[11px] font-bold text-primary-600 uppercase tracking-wide">${l.role}</p>
                        <p class="text-sm font-semibold text-stone-800">${l.name}</p>
                    </div>
                    ${l.actionType === 'phone'
                        ? `<a href="tel:${l.phone}" class="shrink-0 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-600 text-xs font-bold hover:bg-primary-100 transition-colors"><i class="fa-solid fa-phone mr-1"></i>${l.phoneDisplay}</a>`
                        : `<span class="shrink-0 px-3 py-1.5 rounded-lg bg-${l.colorTheme}-50 text-${l.colorTheme}-600 text-xs font-bold"><i class="fa-solid ${l.tagIcon} mr-1"></i>${l.tagLabel}</span>`}
                </div>
            `).join('') || '<p class="text-stone-500 text-sm text-center py-6">Chưa có nhân sự nào.</p>';
            openInfoModal('Ban Tự Quản & Hệ Thống Chính Trị');
        }

        function openSecurityModal() {
            const sec = (villageDb.homeContent && villageDb.homeContent.security) || { hotline: '', hotlineDisplay: '', slogan: '', members: [] };
            const body = document.getElementById('info-modal-body');
            body.innerHTML = `
                ${sec.slogan ? `<p class="text-center text-xs italic text-stone-400 pb-2 border-b border-stone-100">"${sec.slogan}"</p>` : ''}
                <div class="divide-y divide-stone-100">
                    ${(sec.members || []).map(m => `
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
