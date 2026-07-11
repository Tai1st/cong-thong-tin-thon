// Database State
let villageDb = {
  residents: [],
  funds: [],
  auditLogs: [],
  deleteRequests: [],
  accounts: [],
  associationQuotas: {},
  permissions: {},
  villageFund: {
    balance: 0,
    unpaidHouseholds: 0,
    totalHouseholds: 0,
    thu: [],
    chi: [],
  },
  memberEditRequests: [],
  newMemberRequests: [],
  houseNumbers: {},
  fundObligations: [],
  gpsCoords: {},
  homeContent: {},
  incidentReports: [],
  residenceRegistrations: [],
  incidentMinutes: [],
};

// fatherName/motherName là văn bản tự do (không phải khóa ngoại tới một
// resident.id) vì cha/mẹ có thể là thành viên khác trong cùng hộ, hoặc
// sống ở địa phương khác và chưa từng có hồ sơ trong hệ thống này.
//
// permanentAddress (Thường trú) và temporaryAddress (Tạm trú) là 2 cột
// riêng biệt, không loại trừ nhau:
// - permanentAddress: nơi đăng ký thường trú chính thức — thường là
//   "Thôn Đoàn Kết, xã Dliê Ya, tỉnh Đắk Lắk" cho cư dân gốc tại chỗ,
//   hoặc địa chỉ nơi khác nếu người đó chuyển thường trú từ nơi khác tới.
// - temporaryAddress: chỉ có giá trị khi cư dân (thường trú tại đây)
//   hiện đang tạm trú/đi làm ăn xa ở một nơi khác — để trống nếu không.
// (Khác với villageDb.residenceRegistrations — đó là hồ sơ đăng ký tạm
// trú riêng cho KHÁCH/người thân đến ở tạm tại hộ, không phải nhân khẩu
// chính thức của thôn.)
//
// group: "Đoàn Kết cũ" | "Yên Khánh cũ" (thôn gốc trước sáp nhập, áp
// dụng cho cư dân thường trú tại chỗ) | "Tạm Trú" (thường trú nơi khác,
// hiện đang sống tại thôn) | "Lưu Trú" (đăng ký lưu trú ngắn hạn) |
// "Xâm Canh" (canh tác đất tại thôn nhưng thường trú ở địa phương khác).
const defaultResidents = [
  {
    id: "CD-001",
    name: "Nguyễn Văn Dân",
    dob: "12/05/1980",
    cccd: "066080004452",
    phone: "0912345001",
    relation: "Chủ hộ",
    group: "Đoàn Kết cũ",
    association: "Hội Nông dân",
    isHouseholder: true,
    familyId: "FAM-082",
    fatherName: "Nguyễn Văn Đức",
    motherName: "Trần Thị Lành",
    permanentAddress: "Thôn Đoàn Kết, xã Dliê Ya, tỉnh Đắk Lắk",
    temporaryAddress: "",
  },
  {
    id: "CD-002",
    name: "Trần Thị Hoa",
    dob: "20/08/1983",
    cccd: "066183002241",
    phone: "0912345002",
    relation: "Vợ",
    group: "Đoàn Kết cũ",
    association: "Hội Phụ nữ",
    isHouseholder: false,
    familyId: "FAM-082",
    fatherName: "Trần Văn Bình",
    motherName: "Lê Thị Cúc",
    permanentAddress: "Thôn Đoàn Kết, xã Dliê Ya, tỉnh Đắk Lắk",
    temporaryAddress: "",
  },
  {
    id: "CD-003",
    name: "Nguyễn Trần Tiến",
    dob: "03/11/2008",
    cccd: "066208009912",
    phone: "0912345003",
    relation: "Con",
    group: "Đoàn Kết cũ",
    association: "Chi đoàn",
    isHouseholder: false,
    familyId: "FAM-082",
    fatherName: "Nguyễn Văn Dân",
    motherName: "Trần Thị Hoa",
    permanentAddress: "Thôn Đoàn Kết, xã Dliê Ya, tỉnh Đắk Lắk",
    temporaryAddress: "",
  },
  {
    id: "CD-004",
    name: "Nguyễn Thị Mai",
    dob: "17/02/2012",
    cccd: "066312005678",
    phone: "",
    relation: "Con",
    group: "Đoàn Kết cũ",
    association: "None",
    isHouseholder: false,
    familyId: "FAM-082",
    fatherName: "Nguyễn Văn Dân",
    motherName: "Trần Thị Hoa",
    permanentAddress: "Thôn Đoàn Kết, xã Dliê Ya, tỉnh Đắk Lắk",
    temporaryAddress: "",
  },
  {
    id: "CD-005",
    name: "Phan Thị Sương",
    dob: "09/04/1975",
    cccd: "066075003344",
    phone: "0912345005",
    relation: "Chủ hộ",
    group: "Đoàn Kết cũ",
    association: "Hội Phụ nữ",
    isHouseholder: true,
    familyId: "FAM-001",
    fatherName: "Phan Văn Lộc",
    motherName: "Đỗ Thị Nga",
    permanentAddress: "Thôn Đoàn Kết, xã Dliê Ya, tỉnh Đắk Lắk",
    temporaryAddress: "",
  },
  {
    id: "CD-006",
    name: "Lê Nhật Lâm",
    dob: "25/07/1994",
    cccd: "066094005566",
    phone: "0912345006",
    relation: "Chủ hộ",
    group: "Đoàn Kết cũ",
    association: "Chi đoàn",
    isHouseholder: true,
    familyId: "FAM-002",
    fatherName: "Lê Văn Sơn",
    motherName: "Nguyễn Thị Hạnh",
    permanentAddress: "Thôn Đoàn Kết, xã Dliê Ya, tỉnh Đắk Lắk",
    temporaryAddress: "",
  },
  {
    id: "CD-007",
    name: "Nguyễn Văn Giang",
    dob: "01/01/1955",
    cccd: "066055007788",
    phone: "0912345007",
    relation: "Chủ hộ",
    group: "Yên Khánh cũ",
    association: "Hội Người cao tuổi",
    isHouseholder: true,
    familyId: "FAM-003",
    fatherName: "Nguyễn Văn Thọ",
    motherName: "Phạm Thị Gấm",
    permanentAddress: "Thôn Đoàn Kết, xã Dliê Ya, tỉnh Đắk Lắk",
    temporaryAddress: "",
  },
  {
    id: "CD-008",
    name: "Hồ Ngọc Tiêu",
    dob: "14/09/1952",
    cccd: "066052008899",
    phone: "0912345008",
    relation: "Chủ hộ",
    group: "Đoàn Kết cũ",
    association: "Hội Cựu chiến binh",
    isHouseholder: true,
    familyId: "FAM-004",
    fatherName: "Hồ Văn Kiên",
    motherName: "Đặng Thị Xuân",
    permanentAddress: "Thôn Đoàn Kết, xã Dliê Ya, tỉnh Đắk Lắk",
    temporaryAddress: "",
  },
  {
    id: "CD-009",
    name: "Trần Quốc Đạo",
    dob: "22/06/1973",
    cccd: "066073009900",
    phone: "0912345009",
    relation: "Chủ hộ",
    group: "Yên Khánh cũ",
    association: "Hội Nông dân",
    isHouseholder: true,
    familyId: "FAM-005",
    fatherName: "Trần Văn Hòa",
    motherName: "Ngô Thị Liễu",
    permanentAddress: "Thôn Đoàn Kết, xã Dliê Ya, tỉnh Đắk Lắk",
    temporaryAddress: "",
  },
  {
    id: "CD-010",
    name: "Phạm Văn Thành",
    dob: "30/03/1979",
    cccd: "066079012345",
    phone: "0912345010",
    relation: "Chủ hộ",
    group: "Yên Khánh cũ",
    association: "None",
    isHouseholder: true,
    familyId: "FAM-006",
    fatherName: "Phạm Văn Lực",
    motherName: "Vũ Thị Yến",
    permanentAddress: "Thôn Đoàn Kết, xã Dliê Ya, tỉnh Đắk Lắk",
    temporaryAddress: "",
  },
  {
    id: "CD-011",
    name: "Trần Thị Lan",
    dob: "05/12/1985",
    cccd: "066185098765",
    phone: "0912345011",
    relation: "Con",
    group: "Đoàn Kết cũ",
    association: "Hội Phụ nữ",
    isHouseholder: false,
    familyId: "FAM-001",
    fatherName: "Trần Văn Hùng",
    motherName: "Phan Thị Sương",
    permanentAddress: "Thôn Đoàn Kết, xã Dliê Ya, tỉnh Đắk Lắk",
    temporaryAddress:
      "Đang đi làm ăn xa tại KCN Sóng Thần, TP. Dĩ An, tỉnh Bình Dương",
  },
  {
    id: "CD-012",
    name: "Bùi Quốc Khánh",
    dob: "18/10/2002",
    cccd: "066202024681",
    phone: "0912345012",
    relation: "Con",
    group: "Tạm Trú",
    association: "Chi đoàn",
    isHouseholder: false,
    familyId: "FAM-082",
    fatherName: "Nguyễn Văn Dân",
    motherName: "Trần Thị Hoa",
    permanentAddress: "Thôn 3, xã Ea Kiết, huyện Cư M'gar, tỉnh Đắk Lắk",
    temporaryAddress: "",
  },
  {
    id: "CD-013",
    name: "Đinh Văn Thông",
    dob: "10/10/1970",
    cccd: "066070001234",
    phone: "0978190440",
    relation: "Chủ hộ",
    group: "Đoàn Kết cũ",
    association: "None",
    isHouseholder: true,
    familyId: "FAM-007",
    fatherName: "Đinh Văn Lợi",
    motherName: "Hoàng Thị Thảo",
    permanentAddress: "Thôn Đoàn Kết, xã Dliê Ya, tỉnh Đắk Lắk",
    temporaryAddress: "",
  },
  {
    id: "CD-014",
    name: "Nguyễn Quốc Tài",
    dob: "12/03/1988",
    cccd: "066088004321",
    phone: "0987533112",
    relation: "Chủ hộ",
    group: "Đoàn Kết cũ",
    association: "None",
    isHouseholder: true,
    familyId: "FAM-008",
    fatherName: "Nguyễn Văn Phúc",
    motherName: "Lê Thị Hồng",
    permanentAddress: "Thôn Đoàn Kết, xã Dliê Ya, tỉnh Đắk Lắk",
    temporaryAddress: "",
  },
  {
    id: "CD-015",
    name: "Hoàng Xuân Chiển",
    dob: "15/03/1965",
    cccd: "066065001122",
    phone: "0962994479",
    relation: "Chủ hộ",
    group: "Đoàn Kết cũ",
    association: "None",
    isHouseholder: true,
    familyId: "FAM-050",
    fatherName: "Hoàng Văn Tuấn",
    motherName: "Nguyễn Thị Vân",
    permanentAddress: "Thôn Đoàn Kết, xã Dliê Ya, tỉnh Đắk Lắk",
    temporaryAddress: "",
  },
  {
    id: "CD-016",
    name: "Nguyễn Văn Hải",
    dob: "22/08/1982",
    cccd: "066082006611",
    phone: "0949307225",
    relation: "Chủ hộ",
    group: "Đoàn Kết cũ",
    association: "None",
    isHouseholder: true,
    familyId: "FAM-051",
    fatherName: "Nguyễn Văn Thanh",
    motherName: "Trần Thị Huệ",
    permanentAddress: "Thôn Đoàn Kết, xã Dliê Ya, tỉnh Đắk Lắk",
    temporaryAddress: "",
  },
  {
    id: "CD-017",
    name: "Đặng Trung Văn",
    dob: "14/11/1990",
    cccd: "066090007722",
    phone: "0974455458",
    relation: "Chủ hộ",
    group: "Yên Khánh cũ",
    association: "None",
    isHouseholder: true,
    familyId: "FAM-052",
    fatherName: "Đặng Văn Toàn",
    motherName: "Bùi Thị Nhung",
    permanentAddress: "Thôn Đoàn Kết, xã Dliê Ya, tỉnh Đắk Lắk",
    temporaryAddress: "",
  },
  {
    id: "CD-018",
    name: "Hà Vĩnh Tuy",
    dob: "03/06/1985",
    cccd: "066085008833",
    phone: "0989778599",
    relation: "Chủ hộ",
    group: "Yên Khánh cũ",
    association: "None",
    isHouseholder: true,
    familyId: "FAM-053",
    fatherName: "Hà Văn Quý",
    motherName: "Lý Thị Kim",
    permanentAddress: "Thôn Đoàn Kết, xã Dliê Ya, tỉnh Đắk Lắk",
    temporaryAddress: "",
  },
  {
    id: "CD-019",
    name: "Đinh Văn Cường",
    dob: "19/09/1988",
    cccd: "066088009944",
    phone: "0368444449",
    relation: "Chủ hộ",
    group: "Đoàn Kết cũ",
    association: "None",
    isHouseholder: true,
    familyId: "FAM-054",
    fatherName: "Đinh Văn Sáng",
    motherName: "Phạm Thị Loan",
    permanentAddress: "Thôn Đoàn Kết, xã Dliê Ya, tỉnh Đắk Lắk",
    temporaryAddress: "",
  },
  {
    id: "CD-020",
    name: "Nguyễn Văn Tú",
    dob: "27/01/1993",
    cccd: "066093001155",
    phone: "0977354354",
    relation: "Chủ hộ",
    group: "Yên Khánh cũ",
    association: "None",
    isHouseholder: true,
    familyId: "FAM-055",
    fatherName: "Nguyễn Văn Bảy",
    motherName: "Trịnh Thị Muội",
    permanentAddress: "Thôn Đoàn Kết, xã Dliê Ya, tỉnh Đắk Lắk",
    temporaryAddress: "",
  },
];

// Seed GPS locations for every household in defaultResidents so the demo
// data already shows located households instead of "Chưa định vị" for
// all of them — also the single source of truth tra-cuu.html's public
// lookup map merges in so household pins stay in sync between the two
// without duplicating coordinates. Every point below was verified with a
// point-in-polygon test against the real "Thôn Đoàn kết" boundary
// (geometry from https://tracuudlieya.io.vn/api/communes/dlieya/geojson),
// not guessed by eye, so all pins land inside the actual thôn, not just
// near it. FAM-082 (tài khoản Cư dân mẫu) keeps the specific coordinate
// given directly: 13°07'33.4"N 108°19'29.2"E.
const defaultGpsCoords = {
  "FAM-082": { lat: 13.125944, lng: 108.324778 },
  "FAM-001": { lat: 13.138258, lng: 108.334595 },
  "FAM-002": { lat: 13.136811, lng: 108.334150 },
  "FAM-003": { lat: 13.125001, lng: 108.323917 },
  "FAM-004": { lat: 13.141536, lng: 108.338301 },
  "FAM-005": { lat: 13.128028, lng: 108.324530 },
  "FAM-006": { lat: 13.138699, lng: 108.341344 },
  "FAM-007": { lat: 13.124158, lng: 108.333612 },
  "FAM-008": { lat: 13.129849, lng: 108.336541 },
  "FAM-050": { lat: 13.121934, lng: 108.330334 },
  "FAM-051": { lat: 13.131550, lng: 108.333659 },
  "FAM-052": { lat: 13.136527, lng: 108.338643 },
  "FAM-053": { lat: 13.140281, lng: 108.323268 },
  "FAM-054": { lat: 13.141065, lng: 108.328148 },
  "FAM-055": { lat: 13.143840, lng: 108.321036 },
};

// Village-wide fund obligation templates ("khoản thu") — the amount/hộ that
// every household owes. IDs match the legacy per-household fund entry ids
// below so they represent the same obligations, and new obligations created
// via the Trưởng thôn UI (createFundObligation) get applied to every
// household exactly the same way.
const defaultFundObligations = [
  {
    id: "NTM",
    name: "Quỹ xây dựng Nông thôn mới",
    period: "Năm 2026",
    amount: 500000,
  },
  { id: "KH", name: "Quỹ Khuyến học thôn", period: "Năm 2026", amount: 100000 },
  {
    id: "ANQP",
    name: "Quỹ Quốc phòng & An ninh",
    period: "Năm 2026",
    amount: 150000,
  },
  {
    id: "QVN",
    name: "Quỹ Ngày vì người nghèo",
    period: "Năm 2026",
    amount: 100000,
  },
];

function buildDefaultHouseholdFunds(familyId, statuses) {
  return defaultFundObligations.map((o) => ({
    id: o.id,
    name: o.name,
    period: o.period,
    amount: o.amount,
    status: statuses[o.id] ? "Đã đóng" : "Chưa đóng",
    date: statuses[o.id] || "-",
    memo: `DONG_GOP_${familyId}_${o.id}`,
  }));
}

const defaultFunds = {
  "FAM-082": buildDefaultHouseholdFunds("FAM-082", {
    NTM: "05/01/2026",
    KH: "12/02/2026",
    ANQP: "20/03/2026",
  }),
  "FAM-001": buildDefaultHouseholdFunds("FAM-001", {
    NTM: "15/01/2026",
    KH: "15/01/2026",
    ANQP: "15/01/2026",
    QVN: "15/01/2026",
  }),
  "FAM-002": buildDefaultHouseholdFunds("FAM-002", {
    NTM: "12/02/2026",
    KH: "12/02/2026",
    ANQP: "12/02/2026",
    QVN: "12/02/2026",
  }),
  "FAM-003": buildDefaultHouseholdFunds("FAM-003", {
    NTM: "20/03/2026",
    KH: "20/03/2026",
    ANQP: "20/03/2026",
    QVN: "20/03/2026",
  }),
  "FAM-004": buildDefaultHouseholdFunds("FAM-004", {
    NTM: "22/01/2026",
    KH: "22/01/2026",
    ANQP: "22/01/2026",
    QVN: "22/01/2026",
  }),
  "FAM-005": buildDefaultHouseholdFunds("FAM-005", {
    NTM: "18/02/2026",
    KH: "18/02/2026",
    ANQP: "18/02/2026",
    QVN: "18/02/2026",
  }),
  "FAM-006": buildDefaultHouseholdFunds("FAM-006", {}),
  "FAM-007": buildDefaultHouseholdFunds("FAM-007", {
    NTM: "05/01/2026",
    KH: "05/01/2026",
    ANQP: "05/01/2026",
    QVN: "05/01/2026",
  }),
  "FAM-008": buildDefaultHouseholdFunds("FAM-008", {
    NTM: "10/01/2026",
    KH: "10/01/2026",
    ANQP: "10/01/2026",
    QVN: "10/01/2026",
  }),
  "FAM-050": buildDefaultHouseholdFunds("FAM-050", {}),
  "FAM-051": buildDefaultHouseholdFunds("FAM-051", {}),
  "FAM-052": buildDefaultHouseholdFunds("FAM-052", {}),
  "FAM-053": buildDefaultHouseholdFunds("FAM-053", {}),
  "FAM-054": buildDefaultHouseholdFunds("FAM-054", {}),
  "FAM-055": buildDefaultHouseholdFunds("FAM-055", {}),
};

const defaultAssociationQuotas = {
  "Hội Nông dân": {
    balance: 4200000,
    txs: [
      {
        id: "TX-001",
        type: "Thu",
        desc: "Hội phí đợt 1 năm 2026",
        member: "Trần Quốc Đạo",
        amount: 1200000,
        date: "15/01/2026",
        officer: "Trần Quốc Đạo",
      },
      {
        id: "TX-004",
        type: "Thu",
        desc: "Hội phí đợt 1 năm 2026",
        member: "Nguyễn Văn Dân",
        amount: 1200000,
        date: "15/01/2026",
        officer: "Trần Quốc Đạo",
      },
      {
        id: "TX-002",
        type: "Chi",
        desc: "Hỗ trợ mua phân bón hộ khó khăn",
        amount: 1200000,
        date: "18/03/2026",
        officer: "Trần Quốc Đạo",
      },
    ],
    loans: [],
    bankInfo: {
      bankName: "Vietcombank - Ngân hàng TMCP Ngoại thương Việt Nam",
      accountNumber: "9987533112",
      accountHolder: "NGUYEN QUOC TAI",
    },
    feeObligations: [
      {
        id: "AOB-001",
        name: "Hội phí đợt 2 năm 2026",
        amount: 1200000,
        period: "Năm 2026",
      },
    ],
    memberFunds: {
      "CD-001": [
        {
          id: "AOB-001",
          name: "Hội phí đợt 2 năm 2026",
          period: "Năm 2026",
          amount: 1200000,
          status: "Chưa đóng",
          date: "-",
          memo: "HOIPHI_CD-001_AOB-001",
        },
      ],
      "CD-009": [
        {
          id: "AOB-001",
          name: "Hội phí đợt 2 năm 2026",
          period: "Năm 2026",
          amount: 1200000,
          status: "Đã đóng",
          date: "20/03/2026",
          memo: "HOIPHI_CD-009_AOB-001",
        },
      ],
    },
  },
  "Hội Phụ nữ": {
    balance: 6150000,
    txs: [
      {
        id: "TX-003",
        type: "Thu",
        desc: "Thu quỹ đóng góp tình nghĩa",
        member: "Phan Thị Sương",
        amount: 1750000,
        date: "10/02/2026",
        officer: "Phan Thị Sương",
      },
      {
        id: "TX-005",
        type: "Thu",
        desc: "Thu quỹ đóng góp tình nghĩa",
        member: "Trần Thị Hoa",
        amount: 1750000,
        date: "10/02/2026",
        officer: "Phan Thị Sương",
      },
    ],
    loans: [],
    bankInfo: {
      bankName: "Vietcombank - Ngân hàng TMCP Ngoại thương Việt Nam",
      accountNumber: "9987533112",
      accountHolder: "NGUYEN QUOC TAI",
    },
    feeObligations: [
      {
        id: "AOB-002",
        name: "Quỹ tình nghĩa đợt 2 năm 2026",
        amount: 1750000,
        period: "Năm 2026",
      },
    ],
    memberFunds: {
      "CD-002": [
        {
          id: "AOB-002",
          name: "Quỹ tình nghĩa đợt 2 năm 2026",
          period: "Năm 2026",
          amount: 1750000,
          status: "Chưa đóng",
          date: "-",
          memo: "HOIPHI_CD-002_AOB-002",
        },
      ],
      "CD-005": [
        {
          id: "AOB-002",
          name: "Quỹ tình nghĩa đợt 2 năm 2026",
          period: "Năm 2026",
          amount: 1750000,
          status: "Đã đóng",
          date: "15/03/2026",
          memo: "HOIPHI_CD-005_AOB-002",
        },
      ],
      "CD-011": [
        {
          id: "AOB-002",
          name: "Quỹ tình nghĩa đợt 2 năm 2026",
          period: "Năm 2026",
          amount: 1750000,
          status: "Chờ duyệt",
          date: "22/03/2026 (QR)",
          memo: "HOIPHI_CD-011_AOB-002",
        },
      ],
    },
  },
  "Chi đoàn": {
    balance: 1800000,
    txs: [],
    loans: [],
    bankInfo: {
      bankName: "Vietcombank - Ngân hàng TMCP Ngoại thương Việt Nam",
      accountNumber: "9987533112",
      accountHolder: "NGUYEN QUOC TAI",
    },
    feeObligations: [
      {
        id: "AOB-003",
        name: "Đoàn phí năm 2026",
        amount: 100000,
        period: "Năm 2026",
      },
    ],
    memberFunds: {
      "CD-003": [
        {
          id: "AOB-003",
          name: "Đoàn phí năm 2026",
          period: "Năm 2026",
          amount: 100000,
          status: "Chưa đóng",
          date: "-",
          memo: "HOIPHI_CD-003_AOB-003",
        },
      ],
      "CD-006": [
        {
          id: "AOB-003",
          name: "Đoàn phí năm 2026",
          period: "Năm 2026",
          amount: 100000,
          status: "Đã đóng",
          date: "05/02/2026",
          memo: "HOIPHI_CD-006_AOB-003",
        },
      ],
      "CD-012": [
        {
          id: "AOB-003",
          name: "Đoàn phí năm 2026",
          period: "Năm 2026",
          amount: 100000,
          status: "Chưa đóng",
          date: "-",
          memo: "HOIPHI_CD-012_AOB-003",
        },
      ],
    },
  },
  "Hội Người cao tuổi": {
    balance: 2500000,
    txs: [],
    loans: [],
    bankInfo: {
      bankName: "Vietcombank - Ngân hàng TMCP Ngoại thương Việt Nam",
      accountNumber: "9987533112",
      accountHolder: "NGUYEN QUOC TAI",
    },
    feeObligations: [
      {
        id: "AOB-004",
        name: "Hội phí năm 2026",
        amount: 50000,
        period: "Năm 2026",
      },
    ],
    memberFunds: {
      "CD-007": [
        {
          id: "AOB-004",
          name: "Hội phí năm 2026",
          period: "Năm 2026",
          amount: 50000,
          status: "Đã đóng",
          date: "10/01/2026",
          memo: "HOIPHI_CD-007_AOB-004",
        },
      ],
    },
  },
  "Hội Cựu chiến binh": {
    balance: 3100000,
    txs: [],
    loans: [],
    bankInfo: {
      bankName: "Vietcombank - Ngân hàng TMCP Ngoại thương Việt Nam",
      accountNumber: "9987533112",
      accountHolder: "NGUYEN QUOC TAI",
    },
    feeObligations: [
      {
        id: "AOB-005",
        name: "Hội phí năm 2026",
        amount: 60000,
        period: "Năm 2026",
      },
    ],
    memberFunds: {
      "CD-008": [
        {
          id: "AOB-005",
          name: "Hội phí năm 2026",
          period: "Năm 2026",
          amount: 60000,
          status: "Chưa đóng",
          date: "-",
          memo: "HOIPHI_CD-008_AOB-005",
        },
      ],
    },
  },
};

// Mỗi cư dân trong defaultResidents có đúng một tài khoản (username =
// Căn Cước) — khớp với cơ chế tự động cấp tài khoản khi duyệt thêm nhân
// khẩu mới (xem createResidentAccount trong admin-accounts.js). Riêng
// ACC-004 là tài khoản Quản trị hệ thống, không gắn với nhân khẩu nào.
//
// `role` chỉ dùng để phân quyền truy cập hệ thống (Cư dân/Cán bộ Hội/
// Trưởng thôn/Tổ ANTT/Admin). `chucvu` là chức vụ/vai trò công khai.
// Với role khác "Tổ ANTT", chucvu hiển thị ở mục "Ban Tự Quản" trên
// trang chủ — renderHomeLeadership() (js/homepage.js) đọc trực tiếp từ
// trường này. Với role "Tổ ANTT", chucvu là chức danh trong tổ (Tổ
// Trưởng/Tổ Phó/Tổ Viên) hiển thị ở mục "Tổ An Ninh Trật Tự" thay vì
// Ban Tự Quản — xem getPublicSecurityRoster() trong js/homepage.js.
const defaultAccounts = [
  {
    id: "ACC-001",
    username: "066080004452",
    name: "Nguyễn Văn Dân",
    role: "Cư dân",
    chucvu: "",
    lastActive: "Vừa xong",
    status: "Hoạt động",
  },
  {
    id: "ACC-002",
    username: "066073009900",
    name: "Trần Quốc Đạo",
    role: "Cán bộ Hội",
    chucvu: "Chi Hội Trưởng Nông Dân",
    lastActive: "1 giờ trước",
    status: "Hoạt động",
    assoc: "Hội Nông dân",
  },
  {
    id: "ACC-003",
    username: "066070001234",
    name: "Đinh Văn Thông",
    role: "Trưởng thôn",
    chucvu: "Trưởng Thôn",
    lastActive: "2 giờ trước",
    status: "Hoạt động",
  },
  {
    id: "ACC-004",
    username: "admin",
    name: "Ban Quản Trị Hệ Thống",
    role: "Admin",
    chucvu: "",
    lastActive: "Kích hoạt",
    status: "Hoạt động",
  },
  {
    id: "ACC-005",
    username: "066075003344",
    name: "Phan Thị Sương",
    role: "Cán bộ Hội",
    chucvu: "Hội Trưởng Phụ Nữ",
    lastActive: "Chưa đăng nhập",
    status: "Hoạt động",
    assoc: "Hội Phụ nữ",
  },
  {
    id: "ACC-006",
    username: "066094005566",
    name: "Lê Nhật Lâm",
    role: "Cán bộ Hội",
    chucvu: "Bí Thư Đoàn • Thôn Đội Trưởng",
    lastActive: "Chưa đăng nhập",
    status: "Hoạt động",
    assoc: "Chi đoàn",
  },
  {
    id: "ACC-007",
    username: "066055007788",
    name: "Nguyễn Văn Giang",
    role: "Cán bộ Hội",
    chucvu: "Hội Trưởng Người Cao Tuổi",
    lastActive: "Chưa đăng nhập",
    status: "Hoạt động",
    assoc: "Hội Người cao tuổi",
  },
  {
    id: "ACC-008",
    username: "066052008899",
    name: "Hồ Ngọc Tiêu",
    role: "Cán bộ Hội",
    chucvu: "Hội Trưởng Cựu Chiến Binh",
    lastActive: "Chưa đăng nhập",
    status: "Hoạt động",
    assoc: "Hội Cựu chiến binh",
  },
  {
    id: "ACC-009",
    username: "066088004321",
    name: "Nguyễn Quốc Tài",
    role: "Tổ ANTT",
    chucvu: "Tổ Trưởng",
    lastActive: "Chưa đăng nhập",
    status: "Hoạt động",
  },
  {
    id: "ACC-010",
    username: "066183002241",
    name: "Trần Thị Hoa",
    role: "Cư dân",
    chucvu: "",
    lastActive: "Chưa đăng nhập",
    status: "Hoạt động",
  },
  {
    id: "ACC-011",
    username: "066208009912",
    name: "Nguyễn Trần Tiến",
    role: "Cư dân",
    chucvu: "",
    lastActive: "Chưa đăng nhập",
    status: "Hoạt động",
  },
  {
    id: "ACC-012",
    username: "066312005678",
    name: "Nguyễn Thị Mai",
    role: "Cư dân",
    chucvu: "",
    lastActive: "Chưa đăng nhập",
    status: "Hoạt động",
  },
  {
    id: "ACC-013",
    username: "066079012345",
    name: "Phạm Văn Thành",
    role: "Cư dân",
    chucvu: "",
    lastActive: "Chưa đăng nhập",
    status: "Hoạt động",
  },
  {
    id: "ACC-014",
    username: "066185098765",
    name: "Trần Thị Lan",
    role: "Cư dân",
    chucvu: "",
    lastActive: "Chưa đăng nhập",
    status: "Hoạt động",
  },
  {
    id: "ACC-015",
    username: "066202024681",
    name: "Bùi Quốc Khánh",
    role: "Cư dân",
    chucvu: "",
    lastActive: "Chưa đăng nhập",
    status: "Hoạt động",
  },
  {
    id: "ACC-016",
    username: "066065001122",
    name: "Hoàng Xuân Chiển",
    role: "Cư dân",
    chucvu: "Bí Thư Chi Bộ Thôn",
    lastActive: "Chưa đăng nhập",
    status: "Hoạt động",
  },
  {
    id: "ACC-017",
    username: "066082006611",
    name: "Nguyễn Văn Hải",
    role: "Tổ ANTT",
    chucvu: "Tổ Phó",
    lastActive: "Chưa đăng nhập",
    status: "Hoạt động",
  },
  {
    id: "ACC-018",
    username: "066090007722",
    name: "Đặng Trung Văn",
    role: "Tổ ANTT",
    chucvu: "Tổ Viên",
    lastActive: "Chưa đăng nhập",
    status: "Hoạt động",
  },
  {
    id: "ACC-019",
    username: "066085008833",
    name: "Hà Vĩnh Tuy",
    role: "Tổ ANTT",
    chucvu: "Tổ Viên",
    lastActive: "Chưa đăng nhập",
    status: "Hoạt động",
  },
  {
    id: "ACC-020",
    username: "066088009944",
    name: "Đinh Văn Cường",
    role: "Tổ ANTT",
    chucvu: "Tổ Viên",
    lastActive: "Chưa đăng nhập",
    status: "Hoạt động",
  },
  {
    id: "ACC-021",
    username: "066093001155",
    name: "Nguyễn Văn Tú",
    role: "Tổ ANTT",
    chucvu: "Tổ Viên",
    lastActive: "Chưa đăng nhập",
    status: "Hoạt động",
  },
];

const defaultLogs = [
  {
    time: "09/07/2026 09:12:05",
    action: "Thiết lập hệ thống",
    detail: "Khởi tạo hệ thống dữ liệu điện tử Thôn Đoàn Kết mới sáp nhập.",
    actor: "Hệ thống",
  },
  {
    time: "09/07/2026 09:15:30",
    action: "Cập nhật dữ liệu",
    detail: "Nhập danh sách 12 nhân khẩu thuộc hai tổ đại diện.",
    actor: "Admin",
  },
];

const defaultDeleteRequests = [
  {
    id: "REQ-101",
    residentId: "CD-010",
    residentName: "Phạm Văn Thành",
    reason: "Chuyển khẩu vĩnh viễn sang địa bàn xã khác",
    submittedBy: "Trưởng thôn",
    status: "Chờ duyệt",
    time: "09/07/2026 10:10",
  },
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
  { key: "phone", label: "Số điện thoại" },
  { key: "fatherName", label: "Họ tên cha" },
  { key: "motherName", label: "Họ tên mẹ" },
  { key: "group", label: "Nhóm cư trú" },
  { key: "permanentAddress", label: "Địa chỉ thường trú" },
  { key: "temporaryAddress", label: "Địa chỉ tạm trú (nếu đi làm ăn xa)" },
];

// Giá trị hợp lệ cho trường "group": 2 nhóm gốc trước sáp nhập + 3 phân
// loại cư trú đặc biệt (Tạm Trú/Lưu Trú/Xâm Canh) — khớp với các
// <option> cố định trong <select id="...-group-input"> ở mỗi modal
// chỉnh sửa/thêm nhân khẩu (edit-resident-modal, request-member-modal,
// add-member-modal). Sửa danh sách này thì phải sửa luôn các <select> đó.

// Requests from a resident to add a brand-new member to their household;
// stays "Chờ duyệt" until an Admin approves it (which creates the resident).
const defaultNewMemberRequests = [];

const defaultPermissions = {
  "Cư dân": {
    "Căn Cước": "Xem",
    "Ngày sinh": "Xem",
    "Quỹ thôn": "Xem/Sửa",
    "Địa chỉ GPS": "Xem/Sửa",
  },
  "Cán bộ Hội": {
    "Căn Cước": "Xem",
    "Ngày sinh": "Xem",
    "Quỹ thôn": "Xem",
    "Địa chỉ GPS": "Xem/Sửa",
  },
  "Trưởng thôn": {
    "Căn Cước": "Xem/Sửa",
    "Ngày sinh": "Xem/Sửa",
    "Quỹ thôn": "Xem/Sửa",
    "Địa chỉ GPS": "Xem/Sửa",
  },
  "Tổ ANTT": {
    "Căn Cước": "Xem",
    "Ngày sinh": "Xem",
    "Quỹ thôn": "Khóa",
    "Địa chỉ GPS": "Xem",
  },
  Admin: {
    "Căn Cước": "Xem/Sửa",
    "Ngày sinh": "Xem/Sửa",
    "Quỹ thôn": "Xem/Sửa",
    "Địa chỉ GPS": "Xem/Sửa",
  },
};

// Content shown on the public homepage (index.html), editable by Admin
// via "Quản lý Trang chủ" instead of being hardcoded in the HTML. Each
// sub-array mirrors what used to be a hand-written section on the page.
const defaultHomeContent = {
  stats: [
    {
      id: "ST-001",
      icon: "fa-map-location-dot",
      label: "Diện Tích Tự Nhiên",
      value: "559,23",
      unit: "ha",
      breakdown: [
        { label: "Thôn Đoàn Kết cũ:", value: "202,41 ha" },
        { label: "Thôn Yên Khánh cũ:", value: "356,82 ha" },
      ],
    },
    {
      id: "ST-002",
      icon: "fa-house-chimney",
      label: "Quy Mô Dân Cư",
      value: "363",
      unit: "hộ",
      breakdown: [
        { label: "Thôn Đoàn Kết cũ:", value: "190 hộ" },
        { label: "Thôn Yên Khánh cũ:", value: "173 hộ" },
      ],
    },
    {
      id: "ST-003",
      icon: "fa-people-group",
      label: "Tổng Số Nhân Khẩu",
      value: "1.647",
      unit: "người",
      breakdown: [
        { label: "Thôn Đoàn Kết cũ:", value: "851 người" },
        { label: "Thôn Yên Khánh cũ:", value: "796 người" },
      ],
    },
  ],
  news: [
    {
      id: "NEWS-001",
      categorySlug: "hanh-chinh",
      category: "Hành chính",
      colorClass: "bg-red-100 text-red-600",
      date: "07/07/2026",
      title:
        "Lịch tiếp công dân của Ban tự quản và giải quyết thủ tục sáp nhập mới",
      summary:
        "Nhằm tạo điều kiện cho bà con cập nhật giấy tờ hành chính liên quan sau sáp nhập, Ban tự quản tổ chức tiếp nhận...",
      content:
        "Nhằm giải quyết nhanh chóng và đồng bộ các thay đổi về hồ sơ cư trú của bà con sau khi sáp nhập hai thôn, Ban tự quản Thôn Đoàn Kết kính báo lịch làm việc như sau:\n\n- Thời gian tiếp dân: Sáng thứ Ba và thứ Năm hàng tuần (Từ 8:00 đến 11:30).\n- Địa điểm: Văn phòng Nhà Văn Hóa Thôn Đoàn Kết mới.\n- Nội dung thực hiện: Hỗ trợ người dân đăng ký đính chính thông tin hộ khẩu, cập nhật cơ sở dữ liệu đất đai, cấp giấy chứng nhận định danh số mức độ cơ sở, giải quyết các thủ tục liên quan đến sản xuất nông nghiệp và hộ tịch.\n- Người chịu trách nhiệm: Ông Đinh Văn Thông - Trưởng thôn trực tiếp chỉ đạo tiếp nhận phối hợp cùng cán bộ UBND xã Dliê Ya.",
      createdBy: "Admin",
    },
    {
      id: "NEWS-002",
      categorySlug: "san-xuat",
      category: "Sản xuất",
      colorClass: "bg-emerald-100 text-emerald-600",
      date: "05/07/2026",
      title: "Hội thảo chuyển đổi số trong sản xuất Sầu riêng chất lượng cao",
      summary:
        "Đồng hành cùng bà con nâng cao giá trị trái Sầu riêng xuất khẩu, phối hợp cùng các kỹ sư nông nghiệp đầu ngành...",
      content:
        "Với định hướng nông nghiệp là bệ phóng bứt phá kinh tế cho Thôn Đoàn Kết mới, Chi hội Nông dân phối hợp cùng Doanh nghiệp Đối tác tổ chức khóa tập huấn chuyên sâu chuyển đổi số:\n\n- Chủ đề: Áp dụng mã vùng trồng, ghi chép nhật ký điện tử và sử dụng chế phẩm sinh học chuẩn xuất khẩu cho Sầu riêng Ri6.\n- Địa điểm tập trung: Hội trường Nhà văn hóa Thôn Đoàn Kết.\n- Lợi ích tham dự: Bà con được hướng dẫn tạo tài khoản quản lý mã số vườn trồng, được kết nối với đơn vị thu mua chính ngạch xuất khẩu không qua trung gian.\n- Diễn giả: Thạc sĩ Nông nghiệp Nguyễn Hoàng Nam - Viện khoa học kỹ thuật nông lâm nghiệp Tây Nguyên (WASI).\n\nĐề nghị bà con đăng ký sớm qua đồng chí Trần Quốc Đạo - Chi hội trưởng Hội Nông dân.",
      createdBy: "Admin",
    },
    {
      id: "NEWS-003",
      categorySlug: "doan-the",
      category: "Đoàn thể",
      colorClass: "bg-amber-100 text-amber-600",
      date: "28/06/2026",
      title:
        'Phát động ngày "Chủ Nhật Xanh" trồng hoa dọc trục giao thông thôn',
      summary:
        "Bí thư Chi đoàn và Hội Phụ nữ phát động toàn dân tham gia dọn dẹp vệ sinh đường làng và trồng thêm dải hoa ngũ sắc...",
      content:
        "Thực hiện tiêu chí Xanh - Sạch - Đẹp trong bộ tiêu chí xây dựng Nông thôn mới nâng cao năm 2026, Chi đoàn Thanh niên phối hợp với Hội Liên hiệp Phụ nữ phát động chiến dịch ra quân tình nguyện:\n\n- Nội dung: Dọn dẹp hành lang lộ giới đường trục chính, nhổ cỏ hoang, dọn rác thải nhựa và tiến hành trồng 500 cây hoa ngũ sắc dọc 2km tuyến đường hoa kiểu mẫu.\n- Lực lượng nòng cốt: Đoàn viên thanh niên và toàn thể hội viên phụ nữ, đồng thời trân trọng kính mời toàn thể bà con nhân dân thu xếp công việc cùng tham gia đóng góp ngày công.\n- Thời gian xuất phát: Đúng 6h30 sáng Chủ Nhật tuần này tại trục nhà văn hóa.\n- Chỉ huy chiến dịch: Anh Lê Nhật Lâm - Bí thư Chi đoàn kiêm Thôn đội trưởng.",
      createdBy: "Admin",
    },
    {
      id: "NEWS-004",
      categorySlug: "hanh-chinh",
      category: "Hành chính",
      colorClass: "bg-red-100 text-red-600",
      date: "25/06/2026",
      title:
        "Triển khai chương trình hỗ trợ sinh kế và vốn vay ưu đãi sản xuất năm 2026",
      summary:
        "Hội Nông dân tổ chức rà soát nhu cầu hỗ trợ về vốn đầu tư phân bón, hệ thống tưới nước cho các hộ khó khăn...",
      content:
        "Thực hiện chủ trương xóa nghèo bền vững và đồng hành cùng bà con phát triển kinh tế tập thể, Ban quản lý thôn phối hợp với Ngân hàng Chính sách Xã hội huyện tổ chức triển khai vốn vay ưu đãi:\n\n- Đối tượng áp dụng: Các hộ gia đình trong diện chính sách, hộ có nhu cầu mở rộng quy mô trồng mắc ca, sầu riêng hữu cơ hoặc đầu tư máy móc chế biến sấy hạt cà phê, sấy tiêu.\n- Mức vay hỗ trợ: Tối đa lên đến 100 triệu đồng/hộ với lãi suất đặc biệt ưu đãi và thời gian ân hạn dài.\n- Quy trình: Hội đồng bình xét của thôn do đ/c Phan Thị Sương - Trưởng ban Công tác Mặt trận kết hợp với Hội Nông dân thẩm định công khai, dân chủ, đúng đối tượng.\n- Mọi thắc mắc và nộp hồ sơ xin liên hệ trực tiếp văn phòng thôn.",
      createdBy: "Admin",
    },
  ],
  products: [
    {
      id: "PRD-001",
      name: "Cà Phê Robusta",
      badge: "Chủ Lực",
      image:
        "https://file3.qdnd.vn/data/images/0/2026/01/16/upload_2080/gia%20ca%20phe%20congluan%20vn.jpg?dpi=150&quality=100&w=870",
      desc: "Hạt cà phê Robusta đậm đà đặc sản Tây Nguyên, trồng hữu cơ cho hương thơm thuần khiết và vị đậm mạnh mẽ.",
      footerLabel: "Sản lượng năm:",
      footerValue: "~ 900 Tấn",
    },
    {
      id: "PRD-002",
      name: "Sầu Riêng Ri6",
      badge: "Giá Trị Cao",
      image:
        "https://bizweb.dktcdn.net/100/482/702/products/3-67ba133a-54f7-451d-a46c-54b0053119dd.jpg?v=1692801715450",
      desc: "Cơm vàng hạt lép, dẻo ngọt đậm hương thơm, thu hoạch theo quy trình xuất khẩu sạch, an toàn cho người tiêu dùng.",
      footerLabel: "Diện tích:",
      footerValue: "120 ha",
    },
    {
      id: "PRD-003",
      name: "Hồ Tiêu Đen",
      badge: "Truyền Thống",
      image:
        "https://photo-baomoi.bmcdn.me/w500_r1/2026_07_09_125_55575040/fd474d641c2ff571ac3e.jpg",
      desc: "Hạt chắc, độ cay nồng sâu và thơm tự nhiên đặc trưng. Là mặt hàng thế mạnh lâu đời của bà con hai thôn cũ.",
      footerLabel: "Tiêu chuẩn:",
      footerValue: "VietGAP",
    },
    {
      id: "PRD-004",
      name: "Hạt Mắc Ca",
      badge: "Kinh Tế Mới",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7Uc344hSjd3Yjd21c4DB95oDglkyIhGJGV1ztF4wSNcY5r0U8ZfHzRVo&s=10",
      desc: "Nữ hoàng các loại hạt, hạt to tròn đều, chứa hàm lượng dinh dưỡng cao, béo ngậy được thị trường cực kỳ ưa chuộng.",
      footerLabel: "Sản xuất:",
      footerValue: "Xấy nứt vỏ",
    },
    {
      id: "PRD-005",
      name: "Chanh Dây Tím",
      badge: "Dài Hạn",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMiTeYLc1h3PI5EN2VTStE-9BMveIgFSgX00PaCTdNkl_eORIMyIADTSs5&s=10",
      desc: "Sản vật mọng nước, vị chua ngọt dạt dào sảng khoái, nguồn nguyên liệu hoàn hảo xuất khẩu đi các nước EU.",
      footerLabel: "Nguồn gốc:",
      footerValue: "Chuẩn xuất khẩu",
    },
  ],
  // "Ban Tự Quản" và "Tổ An Ninh Trật Tự" trên trang chủ không còn là
  // danh sách soạn riêng — renderHomeLeadership()/openLeadershipModal()
  // và renderHomeSecurity()/openSecurityModal() (js/homepage.js) build
  // trực tiếp từ villageDb.accounts (trường chucvu + số điện thoại của
  // cư dân liên kết), nên luôn khớp với dữ liệu dân cư/tài khoản thật.
  // "security" chỉ còn giữ hotline/slogan — không gắn với một cư dân
  // cụ thể nên vẫn do Admin cấu hình trực tiếp.
  security: {
    hotline: "0987533112",
    hotlineDisplay: "0987.533.112",
    slogan: "Đoàn kết - Chủ động - Kỷ cương - An toàn",
  },
  schedule: [
    {
      id: "SCH-001",
      day: "25",
      month: "Tháng 5",
      title: "Hội nghị nhân dân quý II/2026",
      location: "Nhà văn hóa thôn",
      time: "07:30",
    },
    {
      id: "SCH-002",
      day: "28",
      month: "Tháng 5",
      title: "Tập huấn kỹ thuật trồng sầu riêng",
      location: "Vườn mẫu thôn",
      time: "08:00",
    },
    {
      id: "SCH-003",
      day: "05",
      month: "Tháng 6",
      title: "Ngày Chủ nhật xanh",
      location: "Toàn thôn",
      time: "07:00",
    },
  ],
  gallery: [
    {
      id: "GAL-001",
      image: "https://placehold.co/400x260/dcfce7/15803d?text=Hop+trien+khai",
      caption: "Họp triển khai kế hoạch sản xuất vụ Hè Thu 2026",
    },
    {
      id: "GAL-002",
      image: "https://placehold.co/400x260/fef3c7/b45309?text=Thu+hoach+ca+phe",
      caption: "Bà con thu hoạch cà phê Robusta đầu vụ",
    },
    {
      id: "GAL-003",
      image: "https://placehold.co/400x260/bbf7d0/166534?text=Chu+Nhat+Xanh",
      caption: 'Ra quân "Chủ Nhật Xanh" dọn vệ sinh đường làng',
    },
    {
      id: "GAL-004",
      image:
        "https://placehold.co/400x260/fee2e2/b91c1c?text=Trong+hoa+duong+lang",
      caption: "Chi đoàn thanh niên trồng hoa dọc tuyến đường kiểu mẫu",
    },
    {
      id: "GAL-005",
      image:
        "https://placehold.co/400x260/dbeafe/1d4ed8?text=Giao+luu+the+thao",
      caption: "Giao lưu thể thao chào mừng thôn Đoàn Kết mới",
    },
    {
      id: "GAL-006",
      image:
        "https://placehold.co/400x260/fce7f3/a21caf?text=Nha+sach+vuon+dep",
      caption: 'Hội Phụ nữ phát động phong trào "Nhà sạch, vườn đẹp"',
    },
  ],
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
  Object.keys(defaultFunds).forEach((familyId) => {
    const head = defaultResidents.find(
      (r) => r.familyId === familyId && r.isHouseholder,
    );
    if (!head) return;
    defaultFunds[familyId].forEach((f) => {
      if (f.status === "Đã đóng") {
        thu.push({
          id: `VT-${String(counter).padStart(3, "0")}`,
          household: head.name,
          desc: `Hộ ${head.name} đóng góp: ${f.name}`,
          amount: f.amount,
          date: f.date,
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
  bankInfo: {
    bankName: "Vietcombank - Ngân hàng TMCP Ngoại thương Việt Nam",
    accountNumber: "9987533112",
    accountHolder: "NGUYEN QUOC TAI",
  },
  thu: buildDefaultVillageThu(),
  chi: [
    {
      id: "VC-001",
      desc: "Chi xây dựng đường bê tông liên thôn",
      amount: 150000000,
      date: "12/02/2026",
    },
    {
      id: "VC-002",
      desc: "Chi hỗ trợ hộ nghèo dịp Tết",
      amount: 60000000,
      date: "20/01/2026",
    },
    {
      id: "VC-003",
      desc: "Chi mua sắm trang thiết bị Nhà văn hóa thôn",
      amount: 45000000,
      date: "01/03/2026",
    },
  ],
  unpaidHouseholdsList: [
    {
      familyId: "FAM-006",
      representative: "Phạm Văn Thành",
      dob: "30/03/1979",
      group: "Yên Khánh cũ",
      unpaidAmount: 750000,
    },
    {
      familyId: "FAM-014",
      representative: "Lê Thị Bích",
      dob: "22/06/1988",
      group: "Đoàn Kết cũ",
      unpaidAmount: 750000,
    },
    {
      familyId: "FAM-027",
      representative: "Nguyễn Văn Hùng",
      dob: "14/11/1982",
      group: "Đoàn Kết cũ",
      unpaidAmount: 750000,
    },
    {
      familyId: "FAM-033",
      representative: "Trần Văn Sáu",
      dob: "07/08/1975",
      group: "Yên Khánh cũ",
      unpaidAmount: 750000,
    },
    {
      familyId: "FAM-041",
      representative: "Hoàng Thị Nga",
      dob: "19/04/1990",
      group: "Đoàn Kết cũ",
      unpaidAmount: 750000,
    },
  ],
};
