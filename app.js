(function () {
  const KEY = "gtls-transport-demo-data-v1";
  const ADMIN_AUTH_KEY = "gtls-admin-auth-v1";
  const SIDEBAR_COLLAPSED_KEY = "gtls-sidebar-collapsed-v1";
  const ACCESS_OPTIONS = [
    { value: "dashboard", label: "Dashboard" },
    { value: "booking", label: "Booking Form" },
    { value: "ledger", label: "Booking Summary" },
    { value: "truck", label: "Truck Details" },
    { value: "truck-summary", label: "Pending Truck Summary" },
    { value: "completed-truck-summary", label: "Completed Truck Summary" },
    { value: "equipment", label: "Equipment & Handling Fleet" },
    { value: "maintenance", label: "Fleet Maintenance" },
    { value: "employee", label: "Employees" },
    { value: "khata", label: "Accounts Receivable" },
    { value: "accounts-payable", label: "Accounts Payable" },
    { value: "admin", label: "Admin" },
    { value: "activity-logs", label: "Activity Logs" }
  ];
  const DEFAULT_USER_ACCESS = ACCESS_OPTIONS.map((item) => item.value)
    .filter((item) => !["admin", "activity-logs"].includes(item));

  const seed = {
    activityLogs: [],
    bookings: [
      {
        id: "BK-24061",
        invoiceNo: "INV-24061",
        date: "2026-06-10",
        category: "Inter City Transport",
        accountFlow: "Awaited",
        paymentTerm: "30 Days",
        salesTaxAuthority: "Sindh Revenue Board",
        totalAmount: 166750,
        customer: "Cherat Packaging Ltd",
        consignee: "Cherat Packaging Gadoon",
        route: "Karachi to Gadoon",
        origin: "Karachi Port",
        destination: "Gadoon",
        blNo: "ONEYSINE22550700",
        containerNo: "TRHU5588410",
        size: "40 FT",
        truckNo: "TMT-066",
        goodsType: "Plastic Dana",
        quantity: "990 Bags",
        rate: 145000,
        gatePass: 0,
        detention: 0,
        remarks: "PO submitted, dispatch ready.",
        status: "Delivered"
      },
      {
        id: "BK-24062",
        invoiceNo: "INV-24062",
        date: "2026-06-10",
        category: "Inter City Transport",
        accountFlow: "Awaited",
        paymentTerm: "15 Days",
        salesTaxAuthority: "Sindh Revenue Board",
        totalAmount: 388700,
        customer: "AICT",
        consignee: "AICT Lahore Terminal",
        route: "Port Qasim to Lahore",
        origin: "Port Qasim",
        destination: "Lahore",
        blNo: "KMTCTAO8140361",
        containerNo: "2 X 40FT",
        size: "40 FT",
        truckNo: "TMT-166",
        goodsType: "Cranes",
        quantity: "14 Units",
        rate: 338000,
        gatePass: 0,
        detention: 0,
        remarks: "In transit toward Lahore.",
        status: "In Transit"
      },
      {
        id: "BK-24063",
        invoiceNo: "INV-24063",
        date: "2026-06-09",
        category: "Inter City Transport",
        accountFlow: "Awaited",
        paymentTerm: "Immediate",
        salesTaxAuthority: "Punjab Revenue Authority",
        totalAmount: 216200,
        customer: "DAMCO Pakistan",
        consignee: "Sadaqat Ltd",
        route: "Karachi to Faisalabad",
        origin: "Karachi",
        destination: "Faisalabad",
        blNo: "EMN-2502438",
        containerNo: "LCL Cargo",
        size: "40 FT",
        truckNo: "JW-5477",
        goodsType: "General Cargo",
        quantity: "52 Mton",
        rate: 188000,
        gatePass: 0,
        detention: 0,
        remarks: "Delivered and ready for invoice.",
        status: "Delivered"
      }
    ],
    ledgerEntries: [
      {
        id: "LED-001",
        billNo: "001/24",
        date: "2024-05-22",
        customer: "Cherat Packaging Ltd",
        destination: "Gadoon",
        blNo: "ONEYSINE22550700",
        container: "TRHU5588410",
        goods: "990 Bags",
        receivedAmount: 348502,
        receivedDate: "2024-06-11",
        chequeNo: "1005782261",
        remarks: "Full Payment Received"
      },
      {
        id: "LED-006",
        billNo: "006/24",
        date: "2024-05-29",
        customer: "Cherat Packaging Ltd",
        destination: "Gadoon",
        blNo: "720118757",
        container: "5 X 40",
        goods: "5100 Bags",
        receivedAmount: 1499799.84,
        receivedDate: "2024-06-11",
        chequeNo: "1005782264",
        remarks: "Settled"
      },
      {
        id: "LED-018",
        billNo: "018/24",
        date: "2024-07-12",
        customer: "Cherat Packaging Ltd",
        destination: "Gadoon",
        blNo: "ML/KHI/24023",
        container: "1 X 20",
        goods: "Plastic Dana",
        receivedAmount: 193662,
        receivedDate: "2024-08-01",
        chequeNo: "51000400",
        remarks: "Settled"
      }
    ],
    trucks: [
      {
        id: "TRK-066",
        registrationNo: "TMT-066",
        chassisNo: "JALFVR34MS7000695",
        engineNo: "6HK1-AA6552",
        make: "ISUZU",
        model: "2025",
        purchaseCost: 17400000,
        downPayment: 6870000,
        installmentPaid: 8,
        installmentTotal: 12,
        documentAlert: "Fitness expires on 20 Jun 2026"
      },
      {
        id: "TRK-166",
        registrationNo: "TMT-166",
        chassisNo: "JALFVR34MS7000801",
        engineNo: "AA7939",
        make: "FVR-240",
        model: "2025",
        purchaseCost: 17900000,
        downPayment: 3209700,
        installmentPaid: 6,
        installmentTotal: 12,
        documentAlert: "Route permit renewal needed"
      }
    ],
    equipmentFleet: [
      {
        id: "EQP-001",
        truckNo: "TMT-066",
        chassisNo: "JALFVR34MS7000695",
        engineNo: "6HK1AA6552",
        make: "ISUZU",
        model: "2025",
        mra: "Lasbellah Balochistan",
        banker: "United Bank Limited",
        fitnessExpiry: "2026-06-17",
        balochistanPermitExpiry: "2028-12-09",
        sindhPermitExpiry: "2028-12-09",
        kpkPermitExpiry: "",
        punjabPermitExpiry: "2028-12-09",
        taxPaidUpTo: "2026-12-31",
        originalDocs: "Fitness, Route Permits"
      },
      {
        id: "EQP-002",
        truckNo: "TMT-166",
        chassisNo: "JALFVR34MS7000801",
        engineNo: "6HK1AA7939",
        make: "ISUZU",
        model: "2025",
        mra: "Lasbellah Balochistan",
        banker: "Bank of Punjab",
        fitnessExpiry: "2026-12-28",
        balochistanPermitExpiry: "2028-12-09",
        sindhPermitExpiry: "2028-12-09",
        kpkPermitExpiry: "2028-12-09",
        punjabPermitExpiry: "2028-12-09",
        taxPaidUpTo: "2026-12-31",
        originalDocs: "Fitness, Route Permits, Original Card"
      },
      {
        id: "EQP-003",
        truckNo: "TMT-266",
        chassisNo: "JALFVR34MS7001096",
        engineNo: "6HK1AD1590",
        make: "ISUZU",
        model: "2026",
        mra: "Lasbellah Balochistan",
        banker: "Bank of Punjab",
        fitnessExpiry: "2026-09-08",
        balochistanPermitExpiry: "2029-02-23",
        sindhPermitExpiry: "2029-02-23",
        kpkPermitExpiry: "2029-02-23",
        punjabPermitExpiry: "2029-02-23",
        taxPaidUpTo: "2026-12-31",
        originalDocs: "Fitness, Route Permits"
      },
      {
        id: "EQP-004",
        truckNo: "JW-5477",
        chassisNo: "JALFVR34MS7000694",
        engineNo: "6HK1AA6552",
        make: "ISUZU",
        model: "2025",
        mra: "Karachi Sindh",
        banker: "United Bank Limited",
        fitnessExpiry: "2026-12-19",
        balochistanPermitExpiry: "",
        sindhPermitExpiry: "2029-01-16",
        kpkPermitExpiry: "",
        punjabPermitExpiry: "2029-01-16",
        taxPaidUpTo: "2027-06-30",
        originalDocs: "Fitness, Route Permits, Number Plate, Copy Key"
      }
    ],
    truckExpenses: [
      {
        id: "EXP-001",
        truckNo: "TMT-066",
        date: "2025-11-20",
        vendor: "Shabir Trailor",
        description: "Trolly Maker",
        paymentMode: "Cheque",
        invoiceNo: "001",
        amount: 1000000
      },
      {
        id: "EXP-005",
        truckNo: "TMT-066",
        date: "2025-11-21",
        vendor: "TPL Insurance",
        description: "Insurance",
        paymentMode: "IBFT",
        invoiceNo: "005",
        amount: 295800
      },
      {
        id: "EXP-013",
        truckNo: "TMT-066",
        date: "2026-01-13",
        vendor: "General Store",
        description: "Rim",
        paymentMode: "IBFT",
        invoiceNo: "013",
        amount: 416000
      }
    ],
    invoices: [
      {
        id: "INV-102-26",
        invoiceNo: "INV-102/26",
        customer: "Cherat Packaging Ltd",
        period: "01 Jun 2026 - 10 Jun 2026",
        units: "12 Containers",
        roadFreight: 1820000,
        saleTax: 273000,
        otherCharges: 18000,
        receivedSoFar: 1100000,
        lastPaymentRef: "Cheque No 1005782405"
      },
      {
        id: "INV-103-26",
        invoiceNo: "INV-103/26",
        customer: "DAMCO Pakistan",
        period: "11 Jun 2026 - 20 Jun 2026",
        units: "8 Containers",
        roadFreight: 1245000,
        saleTax: 186750,
        otherCharges: 0,
        receivedSoFar: 0,
        lastPaymentRef: "Awaiting payment"
      }
    ],
    maintenanceJobs: [],
    employees: [
      {
        id: "EMP-1001",
        name: "Muhammad Usman",
        designation: "Operations Coordinator",
        salary: 85000,
        joiningDate: "2025-02-15",
        status: "Active",
        phone: "0300-1234567",
        department: "Operations"
      },
      {
        id: "EMP-1002",
        name: "Ayesha Khan",
        designation: "Accounts Assistant",
        salary: 72000,
        joiningDate: "2024-11-01",
        status: "Inactive",
        phone: "0312-9876543",
        department: "Finance"
      }
    ],
    adminUsers: [
      {
        id: "ADM-1001",
        name: "Super Admin",
        email: "admin@gmail.com",
        password: "transport",
        role: "Super Admin",
        status: "Active",
        access: ACCESS_OPTIONS.map((item) => item.value)
      }
    ],
    customerKhatas: [
      {
        id: "CUS-1001",
        customer: "Cherat Packaging Ltd",
        phone: "021-34900112",
        city: "Karachi",
        openingBalance: 125000,
        entries: [
          {
            id: "KHT-001",
            date: "2026-06-05",
            type: "Debit",
            description: "Transport bill for Karachi to Gadoon",
            amount: 145000
          },
          {
            id: "KHT-002",
            date: "2026-06-08",
            type: "Credit",
            description: "Part payment received",
            amount: 75000
          }
        ]
      },
      {
        id: "CUS-1002",
        customer: "DAMCO Pakistan",
        phone: "042-35788011",
        city: "Lahore",
        openingBalance: -45000,
        entries: [
          {
            id: "KHT-003",
            date: "2026-06-11",
            type: "Debit",
            description: "Faisalabad delivery billing",
            amount: 188000
          },
          {
            id: "KHT-004",
            date: "2026-06-14",
            type: "Credit",
            description: "Advance adjustment",
            amount: 50000
          }
        ]
      }
    ],
    vendorKhatas: [
      {
        id: "PAY-1001",
        customer: "Abdullah Transport",
        phone: "0300-1234567",
        city: "Karachi",
        openingBalance: 0,
        entries: [
          {
            id: "PAYE-001",
            date: "2026-07-04",
            type: "Debit",
            description: "Transport service payable",
            amount: 120000
          },
          {
            id: "PAYE-002",
            date: "2026-07-08",
            type: "Credit",
            description: "Part payment made",
            amount: 40000
          }
        ]
      }
    ]
  };

  function assignSequentialIds(items = [], prefix, field = "id") {
    return items.map((item, index) => ({
      ...item,
      [field]: `${prefix}-${index + 1}`
    }));
  }

  function migrateReadableIds(store) {
    store.bookings = assignSequentialIds(store.bookings || [], "Job");
    store.equipmentFleet = assignSequentialIds(store.equipmentFleet || [], "EQP");
    store.maintenanceJobs = assignSequentialIds(store.maintenanceJobs || [], "MNT");
    store.employees = assignSequentialIds(store.employees || [], "EMP");
    store.adminUsers = assignSequentialIds(store.adminUsers || [], "ADM");
    store.ledgerEntries = assignSequentialIds(store.ledgerEntries || [], "LED");
    store.activityLogs = assignSequentialIds(store.activityLogs || [], "LOG");

    let customerEntryNumber = 1;
    store.customerKhatas = assignSequentialIds(store.customerKhatas || [], "CUS").map((account) => ({
      ...account,
      entries: (account.entries || []).map((entry) => ({
        ...entry,
        id: `KHT-${customerEntryNumber++}`
      }))
    }));

    let payableEntryNumber = 1;
    store.vendorKhatas = assignSequentialIds(store.vendorKhatas || [], "PAY").map((account) => ({
      ...account,
      entries: (account.entries || []).map((entry) => ({
        ...entry,
        id: `PAYE-${payableEntryNumber++}`
      }))
    }));

    const truckJobIds = new Map();
    let truckJobNumber = 1;
    store.truckExpenses = (store.truckExpenses || []).map((item, index) => {
      const currentJobNo = String(item.jobNo || "").trim();
      if (!currentJobNo) return { ...item, id: `TRIP-${index + 1}` };
      if (!truckJobIds.has(currentJobNo)) truckJobIds.set(currentJobNo, `Job-${truckJobNumber++}`);
      return { ...item, id: `TRIP-${index + 1}`, jobNo: truckJobIds.get(currentJobNo) };
    });

    store.readableIdVersion = 2;
    return store;
  }

  function getNextSequentialId(items = [], prefix, field = "id") {
    const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matcher = new RegExp(`^${escapedPrefix}-(\\d+)$`, "i");
    const highest = items.reduce((max, item) => {
      const match = String(item?.[field] || "").trim().match(matcher);
      return match ? Math.max(max, Number(match[1])) : max;
    }, 0);
    return `${prefix}-${highest + 1}`;
  }

  function loadStore() {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) {
      const initialStore = migrateReadableIds(structuredClone(seed));
      sessionStorage.setItem(KEY, JSON.stringify(initialStore));
      return initialStore;
    }
    const parsed = JSON.parse(raw);
    const requiresReadableIdMigration = Number(parsed.readableIdVersion || 0) < 2;
    const store = {
      ...structuredClone(seed),
      ...parsed
    };

    if (!Array.isArray(store.customerKhatas) || store.customerKhatas.length === 0) {
      store.customerKhatas = structuredClone(seed.customerKhatas);
    } else {
      store.customerKhatas = store.customerKhatas.map((account, index) => ({
        ...structuredClone(seed.customerKhatas[index] || {}),
        ...account,
        entries: Array.isArray(account.entries) ? account.entries.map((entry) => ({
          ...entry,
          type: entry.type === "Jama" ? "Credit" : entry.type === "Udhar" ? "Debit" : entry.type
        })) : []
      }));
    }

    if (!Array.isArray(store.vendorKhatas) || store.vendorKhatas.length === 0) {
      store.vendorKhatas = structuredClone(seed.vendorKhatas);
    } else {
      store.vendorKhatas = store.vendorKhatas.map((account) => ({
        ...account,
        entries: Array.isArray(account.entries) ? account.entries.map((entry) => ({
          ...entry,
          type: entry.type === "Payable" ? "Debit" : entry.type === "Paid" ? "Credit" : entry.type
        })) : []
      }));
    }

    if (!Array.isArray(store.employees)) {
      store.employees = structuredClone(seed.employees);
    }

    if (!Array.isArray(store.equipmentFleet)) {
      store.equipmentFleet = structuredClone(seed.equipmentFleet);
    }

    if (!Array.isArray(store.maintenanceJobs)) {
      store.maintenanceJobs = [];
    }

    if (!Array.isArray(store.activityLogs)) {
      store.activityLogs = [];
    }
    store.activityLogs = pruneActivityLogs(store.activityLogs);

    if (!Array.isArray(store.adminUsers) || store.adminUsers.length === 0) {
      store.adminUsers = structuredClone(seed.adminUsers);
    } else {
      store.adminUsers = store.adminUsers.map((item) => normalizeAdminUser(item));
      const superAdminIndex = store.adminUsers.findIndex((item) => item.role === "Super Admin");
      const superAdminRecord = structuredClone(seed.adminUsers[0]);
      if (superAdminIndex === -1) {
        store.adminUsers.unshift(superAdminRecord);
      } else {
        store.adminUsers[superAdminIndex] = {
          ...store.adminUsers[superAdminIndex],
          ...superAdminRecord,
          access: ACCESS_OPTIONS.map((item) => item.value)
        };
      }
    }

    if (Array.isArray(store.bookings)) {
      store.bookings = store.bookings.map((booking) => normalizeBookingContainers(booking));
    }

    if (requiresReadableIdMigration) migrateReadableIds(store);

    saveStore(store, { skipAudit: true });
    return store;
  }

  function pruneActivityLogs(logs = []) {
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - 3);
    return logs.filter((log) => {
      const timestamp = new Date(log.timestamp || log.createdAt || log.date || "");
      return Number.isNaN(timestamp.getTime()) || timestamp >= cutoff;
    });
  }

  const AUDIT_SOURCES = [
    { key: "bookings", module: "Booking Form" },
    { key: "truckExpenses", module: "Truck Details", filter: (item) => Boolean(item.jobNo) },
    { key: "equipmentFleet", module: "Equipment & Handling Fleet" },
    { key: "maintenanceJobs", module: "Fleet Maintenance" },
    { key: "employees", module: "Employees" },
    { key: "adminUsers", module: "Admin Users" },
    { key: "customerKhatas", module: "Accounts Receivable", nested: true },
    { key: "vendorKhatas", module: "Accounts Payable", nested: true }
  ];

  function getAuditRecords(store, source) {
    const records = Array.isArray(store?.[source.key]) ? store[source.key] : [];
    if (!source.nested) return source.filter ? records.filter(source.filter) : records;

    return records.flatMap((account) => {
      const accountRecord = {
        ...account,
        entries: undefined,
        _auditId: account.id,
        _auditLabel: account.customer || account.id
      };
      const entryRecords = (Array.isArray(account.entries) ? account.entries : []).map((entry) => ({
        ...entry,
        _auditId: `${account.id}:${entry.id}`,
        _auditRecordId: entry.id,
        _auditLabel: `${account.customer || account.id} / ${entry.id}`
      }));
      return [accountRecord, ...entryRecords];
    });
  }

  function getAuditRecordId(record = {}) {
    return String(record._auditRecordId || record._auditId || record.id || "Record");
  }

  function getAuditRecordLabel(record = {}) {
    return String(record._auditLabel || record.bookingNo || record.jobNo || record.name || record.customer || record.truckNo || record.id || "Record");
  }

  function getChangedAuditFields(before = {}, after = {}) {
    const hiddenFields = new Set(["_auditId", "_auditRecordId", "_auditLabel", "password", "image", "biltyImage", "bilty"]);
    return [...new Set([...Object.keys(before), ...Object.keys(after)])]
      .filter((key) => !hiddenFields.has(key) && !key.startsWith("_"))
      .filter((key) => JSON.stringify(before[key]) !== JSON.stringify(after[key]))
      .map((key) => key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/^./, (letter) => letter.toUpperCase()));
  }

  function appendAuditLog(store, { action, module, recordId = "-", details = "" }, sessionOverride) {
    if (!Array.isArray(store.activityLogs)) store.activityLogs = [];
    const session = sessionOverride || getAdminSession() || {};
    store.activityLogs.unshift({
      id: getNextSequentialId(store.activityLogs || [], "LOG"),
      timestamp: new Date().toISOString(),
      userId: session.id || "SYSTEM",
      userName: session.name || "System",
      userEmail: session.email || "-",
      userRole: session.role || "System",
      module,
      action,
      recordId: String(recordId || "-"),
      details: String(details || "")
    });
    store.activityLogs = pruneActivityLogs(store.activityLogs).slice(0, 2000);
  }

  function collectAuditChanges(previousStore, nextStore) {
    if (!previousStore) return;
    AUDIT_SOURCES.forEach((source) => {
      const beforeRecords = getAuditRecords(previousStore, source);
      const afterRecords = getAuditRecords(nextStore, source);
      const beforeMap = new Map(beforeRecords.map((record) => [String(record._auditId || record.id), record]));
      const afterMap = new Map(afterRecords.map((record) => [String(record._auditId || record.id), record]));

      afterMap.forEach((record, id) => {
        const previous = beforeMap.get(id);
        if (!previous) {
          appendAuditLog(nextStore, {
            action: "CREATE",
            module: source.module,
            recordId: getAuditRecordId(record),
            details: `${getAuditRecordLabel(record)} created.`
          });
          return;
        }
        const changedFields = getChangedAuditFields(previous, record);
        if (changedFields.length) {
          appendAuditLog(nextStore, {
            action: "UPDATE",
            module: source.module,
            recordId: getAuditRecordId(record),
            details: `${getAuditRecordLabel(record)} updated: ${changedFields.join(", ")}.`
          });
        }
      });

      beforeMap.forEach((record, id) => {
        if (afterMap.has(id)) return;
        appendAuditLog(nextStore, {
          action: "DELETE",
          module: source.module,
          recordId: getAuditRecordId(record),
          details: `${getAuditRecordLabel(record)} deleted.`
        });
      });
    });
  }

  function saveStore(store, options = {}) {
    let previousStore = null;
    if (!options.skipAudit) {
      try {
        const previousRaw = sessionStorage.getItem(KEY);
        previousStore = previousRaw ? JSON.parse(previousRaw) : null;
      } catch (error) {
        previousStore = null;
      }
      collectAuditChanges(previousStore, store);
    }
    store.activityLogs = pruneActivityLogs(store.activityLogs || []);
    sessionStorage.setItem(KEY, JSON.stringify(store));
  }

  function normalizeAdminAccess(access, role = "Admin") {
    const allowedValues = new Set(ACCESS_OPTIONS.map((item) => item.value));
    if (role === "Super Admin") return ACCESS_OPTIONS.map((item) => item.value);

    const values = Array.isArray(access)
      ? access
      : typeof access === "string" && access
        ? [access]
        : structuredClone(DEFAULT_USER_ACCESS);

    let migratedValues = values.includes("khata") && !values.includes("accounts-payable")
      ? [...values, "accounts-payable"]
      : [...values];
    if (migratedValues.includes("truck") && !migratedValues.includes("equipment")) {
      migratedValues.push("equipment");
    }
    if (migratedValues.includes("truck") && !migratedValues.includes("maintenance")) {
      migratedValues.push("maintenance");
    }
    const normalized = [...new Set(migratedValues
      .map((item) => String(item || "").trim())
      .filter((item) => allowedValues.has(item))
    )];

    return normalized.length ? normalized : structuredClone(DEFAULT_USER_ACCESS);
  }

  function normalizeAdminUser(user = {}) {
    const role = String(user.role || "Admin").trim() || "Admin";
    return {
      ...user,
      role,
      access: normalizeAdminAccess(user.access, role)
    };
  }

  function getAdminSession() {
    const raw = sessionStorage.getItem(ADMIN_AUTH_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  }

  function setAdminSession(user) {
    sessionStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      access: normalizeAdminAccess(user.access, user.role)
    }));
  }

  function getSupabaseClient() {
    const config = window.GTLS_SUPABASE_CONFIG || {};
    const publishableKey = String(config.publishableKey || "").trim();
    const isConfigured = config.url && publishableKey && !publishableKey.startsWith("PASTE_");
    if (!isConfigured || !window.supabase?.createClient) return null;

    if (!window.GTLS_SUPABASE_CLIENT) {
      window.GTLS_SUPABASE_CLIENT = window.supabase.createClient(config.url, publishableKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
    }
    return window.GTLS_SUPABASE_CLIENT;
  }

  function mapSupabaseProfile(profile, authUser) {
    const isSuperAdmin = profile.role === "super_admin";
    return {
      id: profile.id || authUser.id,
      name: profile.name || authUser.email || "User",
      email: profile.email || authUser.email || "",
      role: isSuperAdmin ? "Super Admin" : "Admin",
      status: profile.status === "active" ? "Active" : "Inactive",
      access: isSuperAdmin
        ? ACCESS_OPTIONS.map((item) => item.value)
        : normalizeAdminAccess(profile.access_modules || [], "Admin")
    };
  }

  async function getSupabaseSessionUser() {
    const client = getSupabaseClient();
    if (!client) {
      clearAdminSession();
      return null;
    }

    const { data: sessionData, error: sessionError } = await client.auth.getSession();
    if (sessionError || !sessionData.session?.user) {
      clearAdminSession();
      return null;
    }

    const authUser = sessionData.session.user;
    const { data: profile, error: profileError } = await client
      .from("profiles")
      .select("id,name,email,role,status,access_modules")
      .eq("id", authUser.id)
      .single();

    if (profileError || !profile || profile.status !== "active") {
      await client.auth.signOut();
      clearAdminSession();
      return null;
    }

    const user = mapSupabaseProfile(profile, authUser);
    setAdminSession(user);
    return user;
  }

  async function signInWithSupabase(email, password) {
    const client = getSupabaseClient();
    if (!client) {
      throw new Error("Supabase publishable key is not configured in supabase-config.js.");
    }

    const { data, error } = await client.auth.signInWithPassword({
      email: String(email || "").trim(),
      password: String(password || "")
    });
    if (error) throw error;

    const { data: profile, error: profileError } = await client
      .from("profiles")
      .select("id,name,email,role,status,access_modules")
      .eq("id", data.user.id)
      .single();
    if (profileError || !profile) {
      await client.auth.signOut();
      throw new Error("Your user profile is not available.");
    }
    if (profile.status !== "active") {
      await client.auth.signOut();
      throw new Error("Your account is inactive. Contact the Super Admin.");
    }

    return mapSupabaseProfile(profile, data.user);
  }

  function getPageFile(page) {
    return `${page === "employee" ? "employees" : page}.html`;
  }

  function navigateWithTransition(url, options = {}) {
    if (!url) return;
    window.location.href = url;
  }

  function markPageReady() {
    return;
  }

  function bindPageTransitions() {
    document.querySelectorAll('a[href$=".html"]').forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || document.head.querySelector(`link[rel="prefetch"][href="${href}"]`)) return;
      const prefetch = document.createElement("link");
      prefetch.rel = "prefetch";
      prefetch.href = href;
      document.head.appendChild(prefetch);
    });
  }

  function clearAdminSession() {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
  }

  function recordAuthenticationActivity(action, sessionOverride) {
    try {
      const raw = sessionStorage.getItem(KEY);
      const store = raw ? JSON.parse(raw) : structuredClone(seed);
      appendAuditLog(store, {
        action,
        module: "Authentication",
        recordId: sessionOverride?.id || "-",
        details: action === "SIGN_IN" ? "User signed in." : "User signed out."
      }, sessionOverride);
      saveStore(store, { skipAudit: true });
    } catch (error) {
      return;
    }
  }

  function getPasswordToggleIcon(isVisible) {
    return isVisible
      ? `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M3 3l18 18"></path>
          <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7"></path>
          <path d="M9.4 5.5A10.8 10.8 0 0 1 12 5c5.2 0 8.8 4.3 10 7-0.5 1.1-1.5 2.7-3 4.1"></path>
          <path d="M6.2 6.3C4.3 7.6 3 9.6 2 12c1.2 2.7 4.8 7 10 7 1.7 0 3.3-0.4 4.7-1"></path>
        </svg>
      `
      : `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      `;
  }

  function authenticateSoftwareUser(store, email, password) {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedPassword = String(password || "").trim();
    return store.adminUsers.find((item) =>
      String(item.email || "").trim().toLowerCase() === normalizedEmail &&
      String(item.password || "").trim() === normalizedPassword &&
      String(item.status || "").trim() === "Active"
    ) || null;
  }

  function bindPasswordToggle(passwordField, passwordToggle) {
    function sync() {
      const isVisible = passwordField.type === "text";
      passwordToggle.innerHTML = getPasswordToggleIcon(isVisible);
      passwordToggle.setAttribute("aria-label", isVisible ? "Hide password" : "Show password");
      passwordToggle.setAttribute("title", isVisible ? "Hide password" : "Show password");
    }

    passwordToggle.addEventListener("click", () => {
      passwordField.type = passwordField.type === "password" ? "text" : "password";
      sync();
    });

    sync();
  }

  function softwareLoginPage(store) {
    const form = document.querySelector("[data-software-login-form]");
    const notice = document.querySelector("[data-notice]");
    const passwordField = form.querySelector("[name='password']");
    const passwordToggle = form.querySelector("[data-password-toggle]");

    bindPasswordToggle(passwordField, passwordToggle);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const submitButton = form.querySelector("[type='submit']");
      submitButton.disabled = true;
      notice.hidden = true;

      try {
        const user = await signInWithSupabase(data.email, data.password);
        setAdminSession(user);
        recordAuthenticationActivity("SIGN_IN", user);
        const firstPage = normalizeAdminAccess(user.access, user.role)[0] || "dashboard";
        navigateWithTransition(getPageFile(firstPage));
      } catch (error) {
        notice.hidden = false;
        notice.textContent = error.message || "Incorrect email or password.";
        submitButton.disabled = false;
      }
    });
  }

  async function enforceSoftwareAccess(page) {
    const publicPages = new Set(["signin", "admin-login"]);
    const session = await getSupabaseSessionUser();
    const hasSession = Boolean(session);

    if (page === "signin" && hasSession) {
      const firstPage = session.access?.[0] || "dashboard";
      navigateWithTransition(getPageFile(firstPage), { immediate: true });
      return false;
    }

    if (!publicPages.has(page) && !hasSession) {
      navigateWithTransition("index.html", { immediate: true });
      return false;
    }

    if (!publicPages.has(page) && session && session.role !== "Super Admin") {
      const allowed = new Set(normalizeAdminAccess(session.access, session.role));
      if (!allowed.has(page)) {
        const fallback = allowed.has("dashboard") ? "dashboard" : allowed.values().next().value || "dashboard";
        navigateWithTransition(getPageFile(fallback), { immediate: true });
        return false;
      }
    }

    return true;
  }

  function applySessionAccess() {
    const session = getAdminSession();
    if (!session) return;

    const allowed = new Set(normalizeAdminAccess(session.access, session.role));
    document.querySelectorAll(".nav a").forEach((link) => {
      const page = link.dataset.page;
      if (!page) return;
      const isAllowed = session.role === "Super Admin" || allowed.has(page);
      link.hidden = !isAllowed;
    });
  }

  function bindSoftwareSignOut() {
    const sidebarTip = document.querySelector(".sidebar .tip");
    if (!sidebarTip || document.querySelector("[data-software-signout]")) return;

    sidebarTip.innerHTML = `<div class="actions"><button class="btn small" type="button" data-software-signout>Sign Out</button></div>`;

    sidebarTip.querySelector("[data-software-signout]").addEventListener("click", () => {
      openSignOutConfirmation();
    });
  }

  function openSignOutConfirmation() {
    let modal = document.querySelector("[data-signout-modal]");
    if (!modal) {
      modal = document.createElement("div");
      modal.className = "confirm-modal";
      modal.dataset.signoutModal = "";
      modal.hidden = true;
      modal.innerHTML = `
        <div class="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="signout-title" aria-describedby="signout-description">
          <div class="confirm-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M10 17l5-5-5-5M15 12H3"></path>
              <path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"></path>
            </svg>
          </div>
          <h2 id="signout-title">Sign out?</h2>
          <p id="signout-description">Are you sure you want to end your current session?</p>
          <div class="confirm-actions">
            <button class="btn" type="button" data-cancel-signout>Stay Signed In</button>
            <button class="btn primary" type="button" data-confirm-signout>Sign Out</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      const closeModal = () => {
        modal.hidden = true;
        document.body.classList.remove("confirm-modal-open");
      };
      modal.querySelector("[data-cancel-signout]").addEventListener("click", closeModal);
      modal.querySelector("[data-confirm-signout]").addEventListener("click", async () => {
        recordAuthenticationActivity("SIGN_OUT", getAdminSession());
        const client = getSupabaseClient();
        if (client) await client.auth.signOut();
        clearAdminSession();
        navigateWithTransition("index.html");
      });
      modal.addEventListener("click", (event) => {
        if (event.target === modal) closeModal();
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !modal.hidden) closeModal();
      });
    }

    modal.hidden = false;
    document.body.classList.add("confirm-modal-open");
    modal.querySelector("[data-cancel-signout]").focus();
  }

  function normalizeContainerLine(line = {}) {
    return {
      containerNo: String(line.containerNo || "").trim(),
      size: String(line.size || "40 FT").trim() || "40 FT",
      truckNo: String(line.truckNo || "").trim(),
      rate: Number(line.rate || 0),
      gatePass: String(line.gatePass || "").trim(),
      detention: Number(line.detention || 0)
    };
  }

  function getBookingContainerLines(booking = {}) {
    if (Array.isArray(booking.containerLines) && booking.containerLines.length > 0) {
      return booking.containerLines.map((line) => normalizeContainerLine(line));
    }

    const fallback = normalizeContainerLine({
      containerNo: booking.containerNo,
      size: booking.size,
      truckNo: booking.truckNo,
      rate: booking.rate,
      gatePass: booking.gatePass,
      detention: booking.detention
    });

    return fallback.containerNo || fallback.truckNo ? [fallback] : [normalizeContainerLine()];
  }

  function formatInvoiceContainerSizes(lines = []) {
    const sizeCounts = new Map();

    lines.forEach((line) => {
      const rawSize = String(line.size || "").trim();
      if (!rawSize) return;

      const feetMatch = rawSize.toUpperCase().match(/^(\d+)\s*FT$/);
      const label = feetMatch ? feetMatch[1] : rawSize;
      sizeCounts.set(label, (sizeCounts.get(label) || 0) + 1);
    });

    return Array.from(sizeCounts, ([size, count]) => `${count}x${size}`).join(", ") || "-";
  }

  function getNextBookingJobNo(bookings = []) {
    const highestJobNumber = bookings.reduce((highest, booking) => {
      const match = String(booking.id || "").trim().match(/^Job-(\d+)$/i);
      return match ? Math.max(highest, Number(match[1])) : highest;
    }, 0);

    return `Job-${highestJobNumber + 1}`;
  }

  function normalizeBookingContainers(booking = {}) {
    const containerLines = getBookingContainerLines(booking);
    const primaryLine = containerLines[0] || normalizeContainerLine();
    const accountFlow = String(booking.accountFlow || "").trim() === "Debit" ? "Awaited" : String(booking.accountFlow || "").trim() || "Awaited";
    const statusValue = String(booking.status || "").trim();
    const status = statusValue === "Submitted" ? "Delivered" : (statusValue || "Delivered");
    const rate = Number(booking.rate || 0);
    const detention = Number(booking.detention || 0);
    const taxBreakdown = calculateBookingTaxBreakdown(rate, detention, booking.salesTaxAuthority);
    return {
      ...booking,
      invoiceNo: String(booking.invoiceNo || "").trim(),
      accountFlow,
      status,
      containerLines,
      containerNo: primaryLine.containerNo,
      size: primaryLine.size,
      truckNo: primaryLine.truckNo,
      rate,
      salesTaxAmount: Number(booking.salesTaxAmount ?? taxBreakdown.salesTaxAmount),
      totalAmount: Number(booking.totalAmount ?? taxBreakdown.totalAmount),
      incomeTaxAmount: Number(booking.incomeTaxAmount ?? taxBreakdown.incomeTaxAmount),
      salesTaxWithheldAmount: Number(booking.salesTaxWithheldAmount ?? taxBreakdown.salesTaxWithheldAmount),
      salesTaxByUsAmount: Number(booking.salesTaxByUsAmount ?? taxBreakdown.salesTaxByUsAmount),
      receivableAmount: Number(booking.receivableAmount ?? taxBreakdown.receivableAmount),
      gatePass: String(booking.gatePass || "").trim(),
      paymentReceivedDate: String(booking.paymentReceivedDate || "").trim(),
      chequeNumber: String(booking.chequeNumber || "").trim(),
      detention
    };
  }

  function renderStackedCell(values, formatter = text) {
    if (!values.length) return `<div class="stacked-cell"><span>-</span></div>`;
    return `<div class="stacked-cell">${values.map((value) => `<span>${formatter(value)}</span>`).join("")}</div>`;
  }

  function renderBookingMeta(label, value) {
    return `
      <div class="booking-meta">
        <span>${label}</span>
        <strong>${value}</strong>
      </div>
    `;
  }

  function renderBookingLineStack(label, values, formatter = text) {
    const items = values.length ? values.map((value) => `<span>${formatter(value)}</span>`).join("") : "<span>-</span>";
    return `
      <div class="booking-meta booking-meta-stack">
        <span>${label}</span>
        <div class="stacked-cell">${items}</div>
      </div>
    `;
  }

  function money(value) {
    return Number(value || 0).toLocaleString("en-US", { maximumFractionDigits: 2 });
  }

  function text(value) {
    return value === null || value === undefined || value === "" ? "-" : String(value);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function calculateInvoiceTotals(invoice) {
    const total = Number(invoice.roadFreight) + Number(invoice.saleTax) + Number(invoice.otherCharges);
    const balance = total - Number(invoice.receivedSoFar || 0);
    return { total, balance };
  }

  function roundAmount(value) {
    return Math.round(Number(value || 0) * 100) / 100;
  }

  function shouldApplySalesTax(authority) {
    const taxableAuthorities = new Set([
      "Sindh Revenue Board",
      "Punjab Revenue Authority",
      "Khyber Pakhtunkhwa Revenue Authority",
      "Balochistan Revenue Authority"
    ]);
    return taxableAuthorities.has(String(authority || "").trim());
  }

  function calculateBookingTaxBreakdown(rate, detention, authority) {
    const roadHaulageCharges = Number(rate || 0);
    const detentionCharges = Number(detention || 0);
    const withoutIncomeTax = String(authority || "").trim() === "Without Income Tax";
    const taxableBase = roundAmount(roadHaulageCharges);
    const salesTaxAmount = shouldApplySalesTax(authority) ? roundAmount(taxableBase * 0.15) : 0;
    const totalAmount = roundAmount(taxableBase + salesTaxAmount);
    const incomeTaxAmount = withoutIncomeTax ? 0 : roundAmount(totalAmount * 0.07);
    const salesTaxWithheldAmount = roundAmount(salesTaxAmount * 0.20);
    const salesTaxByUsAmount = roundAmount(salesTaxAmount * 0.80);
    const receivableAmount = withoutIncomeTax
      ? taxableBase
      : roundAmount(totalAmount - incomeTaxAmount - salesTaxWithheldAmount + detentionCharges);

    return {
      roadHaulageCharges,
      detentionCharges,
      taxableBase,
      salesTaxAmount,
      totalAmount,
      incomeTaxAmount,
      salesTaxWithheldAmount,
      salesTaxByUsAmount,
      receivableAmount
    };
  }

  function calculateBookingTotalAmount(rate, detention, authority) {
    return calculateBookingTaxBreakdown(rate, detention, authority).totalAmount;
  }

  function calculateKhataSummary(account) {
    const openingBalance = Number(account.openingBalance || 0);
    const totals = account.entries.reduce((summary, entry) => {
      const amount = Number(entry.amount || 0);
      if (entry.type === "Credit") summary.credit += amount;
      else summary.debit += amount;
      return summary;
    }, { credit: 0, debit: 0 });

    const hasEntries = account.entries.length > 0;
    const closingBalance = hasEntries ? totals.debit - totals.credit : 0;
    return {
      openingBalance,
      credit: totals.credit,
      debit: totals.debit,
      closingBalance,
      hasEntries
    };
  }

  function parseDateValue(value) {
    if (!value) return null;
    const textValue = String(value).trim();
    const isoMatch = textValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoMatch) return new Date(`${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}T00:00:00`);

    const friendlyMatch = textValue.match(/^(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})$/);
    if (friendlyMatch) {
      const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
      const monthIndex = monthNames.indexOf(friendlyMatch[2].slice(0, 3).toLowerCase());
      if (monthIndex !== -1) return new Date(Number(friendlyMatch[3]), monthIndex, Number(friendlyMatch[1]));
    }

    const parsed = new Date(textValue);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  function compareDateValues(leftValue, rightValue, direction = "desc") {
    const leftDate = parseDateValue(leftValue);
    const rightDate = parseDateValue(rightValue);
    if (!leftDate && !rightDate) return 0;
    if (!leftDate) return 1;
    if (!rightDate) return -1;
    const difference = leftDate.getTime() - rightDate.getTime();
    return direction === "asc" ? difference : -difference;
  }

  function compareJobValues(leftValue, rightValue, direction = "desc") {
    const leftText = String(leftValue || "").trim();
    const rightText = String(rightValue || "").trim();
    const leftMatch = leftText.match(/(\d+)$/);
    const rightMatch = rightText.match(/(\d+)$/);
    let difference = 0;
    if (leftMatch && rightMatch) difference = Number(leftMatch[1]) - Number(rightMatch[1]);
    if (!difference) difference = leftText.localeCompare(rightText, undefined, { numeric: true, sensitivity: "base" });
    return direction === "asc" ? difference : -difference;
  }

  function formatShortDate(value) {
    const date = parseDateValue(value);
    if (!date) return value ? String(value) : "-";
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  function formatIsoDate(value) {
    const date = parseDateValue(value);
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function formatStatementDate(value) {
    if (!value) return "-";
    const date = parseDateValue(value);
    if (!date) return value;
    const day = date.getDate();
    const suffix = day % 10 === 1 && day !== 11 ? "st"
      : day % 10 === 2 && day !== 12 ? "nd"
      : day % 10 === 3 && day !== 13 ? "rd"
      : "th";
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.toLocaleString("en-US", { year: "2-digit" });
    return `${day}${suffix} ${month}, ${year}`;
  }

  function getTodayIsoDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function normalizeWhatsappNumber(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function isMobileDevice() {
    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  }

  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  function compressImageFile(file, maxDimension = 1100, maxLength = 420000) {
    return new Promise((resolve, reject) => {
      if (!file || !String(file.type || "").startsWith("image/")) {
        reject(new Error("Please select a valid image file."));
        return;
      }
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("The image could not be read."));
      reader.onload = () => {
        const image = new Image();
        image.onerror = () => reject(new Error("The image format is not supported."));
        image.onload = () => {
          const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
          const context = canvas.getContext("2d");
          context.fillStyle = "#ffffff";
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          let quality = 0.74;
          let result = canvas.toDataURL("image/jpeg", quality);
          while (result.length > maxLength && quality > 0.42) {
            quality -= 0.08;
            result = canvas.toDataURL("image/jpeg", quality);
          }
          resolve(result);
        };
        image.src = String(reader.result || "");
      };
      reader.readAsDataURL(file);
    });
  }

  function readDocumentFile(file) {
    if (!file) return Promise.reject(new Error("Please select a document."));
    if (String(file.type || "").startsWith("image/")) {
      return compressImageFile(file).then((data) => ({ name: file.name, type: "image/jpeg", data }));
    }
    if (file.type === "application/pdf" || /\.pdf$/i.test(file.name || "")) {
      if (file.size > 1500000) return Promise.reject(new Error("Please select a PDF smaller than 1.5 MB."));
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("The document could not be read."));
        reader.onload = () => resolve({ name: file.name, type: "application/pdf", data: String(reader.result || "") });
        reader.readAsDataURL(file);
      });
    }
    return Promise.reject(new Error("Please select an image or PDF document."));
  }

  function safePdfFileName(value, fallback = "record") {
    return String(value || fallback).trim().replace(/[^a-z0-9_-]+/gi, "_").replace(/^_+|_+$/g, "") || fallback;
  }

  async function createRegisterPdf(title, headers, row, fileName, imageData = "") {
    if (!window.jspdf?.jsPDF) throw new Error("The PDF library could not be loaded.");
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("l", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const letterhead = await loadInvoiceTemplateDataUrl();
    const letterheadHeader = await cropImageDataUrl(letterhead, 0, 270);
    if (letterheadHeader) {
      const headerWidth = 390;
      const headerHeight = headerWidth * (270 / 1131);
      pdf.addImage(letterheadHeader, "JPEG", 28, 10, headerWidth, headerHeight, undefined, "FAST");
    }
    pdf.setTextColor(18, 54, 91);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text(title.toUpperCase(), 36, 125);
    pdf.autoTable({
      startY: 142,
      margin: { left: 36, right: 36, bottom: 62 },
      head: [headers],
      body: [row],
      theme: "grid",
      styles: { fontSize: 7.5, cellPadding: 5, halign: "center", valign: "middle", lineColor: [93, 72, 52], lineWidth: 0.55 },
      headStyles: { fillColor: [240, 225, 208], textColor: [25, 42, 62], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [255, 251, 247] }
    });
    if (imageData) {
      const y = Math.min((pdf.lastAutoTable?.finalY || 170) + 18, pageHeight - 165);
      pdf.setFontSize(10);
      pdf.text("Attached Image", 36, y);
      const imageType = imageData.startsWith("data:image/png") ? "PNG" : "JPEG";
      pdf.addImage(imageData, imageType, 36, y + 8, 120, 90, undefined, "FAST");
    }
    pdf.setDrawColor(35, 35, 35);
    pdf.setLineWidth(0.7);
    pdf.line(36, pageHeight - 48, pageWidth - 36, pageHeight - 48);
    pdf.setTextColor(18, 54, 91);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    pdf.text("Office # 15, Ayub Shopping Center, Keamari, Karachi | 021-328 62660", 44, pageHeight - 30);
    pdf.save(`${safePdfFileName(fileName)}.pdf`);
  }

  let invoiceTemplateDataUrlPromise = null;

  function loadInvoiceTemplateDataUrl() {
    if (invoiceTemplateDataUrlPromise) return invoiceTemplateDataUrlPromise;
    invoiceTemplateDataUrlPromise = fetch("assets/Invoice.jpg")
      .then((response) => {
        if (!response.ok) throw new Error("Invoice template could not be loaded.");
        return response.blob();
      })
      .then((blob) => blobToDataUrl(blob))
      .catch(() => null);
    return invoiceTemplateDataUrlPromise;
  }

  async function buildBookingInvoicePdf(booking) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      throw new Error("The PDF library could not be loaded.");
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const left = 36;
    const right = pageWidth - 36;
    const brandImage = await loadInvoiceTemplateDataUrl();
    const tax = calculateBookingTaxBreakdown(booking.rate, booking.detention, booking.salesTaxAuthority);
    const lines = getBookingContainerLines(booking);
    const sizeText = formatInvoiceContainerSizes(lines);
    const customerName = String(booking.customer || "").trim() || "-";
    const consigneeText = String(booking.consignee || "").trim() || "-";
    const descriptionText = [booking.goodsType, booking.quantity].filter(Boolean).join(", ") || "-";
    const taxAuthorityLabelMap = {
      "Sindh Revenue Board": "Sindh Sales Tax @ 15 %",
      "Punjab Revenue Authority": "Punjab Sales Tax @ 15 %",
      "Khyber Pakhtunkhwa Revenue Authority": "KPK Sales Tax @ 15 %",
      "Balochistan Revenue Authority": "Balochistan Sales Tax @ 15 %"
    };
    const taxLineLabel = taxAuthorityLabelMap[String(booking.salesTaxAuthority || "").trim()] || "Sales Tax @ 0 %";

    if (brandImage) {
      pdf.addImage(brandImage, "JPEG", 0, 0, pageWidth, pageHeight);
    }

    pdf.setFillColor(255, 255, 255);
    pdf.rect(22, 118, pageWidth - 44, pageHeight - 172, "F");

    pdf.setTextColor(24, 24, 24);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("SALES TAX INVOICE", pageWidth / 2, 168, { align: "center" });

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    pdf.setTextColor(32, 32, 32);
    pdf.text(`M/s ${customerName.toUpperCase()}`, left, 204);
    pdf.text(consigneeText, left, 222);
    pdf.text(`NTN NO : ${text(booking.gatePass || "-")}`, left, 240);
    pdf.text(`Date: ${formatShortDate(booking.date)}`, right, 222, { align: "right" });

    pdf.autoTable({
      startY: 274,
      theme: "grid",
      margin: { left, right: pageWidth - 356 },
      tableWidth: 320,
      body: [
        ["Booking No", text(booking.bookingNo || booking.id)],
        ["Invoice No", text(booking.invoiceNo || booking.id)],
        ["BL No", text(booking.blNo)],
        ["No of Container", sizeText],
        ["Description", descriptionText],
        ["Consignee", customerName],
        ["Destination", text(booking.destination)],
        ["Category", text(booking.category)]
      ],
      styles: {
        font: "helvetica",
        fontSize: 11,
        cellPadding: 5,
        lineColor: [70, 70, 70],
        lineWidth: 0.8,
        textColor: [32, 32, 32]
      },
      columnStyles: {
        0: { cellWidth: 98, fontStyle: "bold" },
        1: { cellWidth: 222 }
      }
    });

    const chargesStartY = pdf.lastAutoTable.finalY + 24;
    pdf.autoTable({
      startY: chargesStartY,
      theme: "grid",
      margin: { left, right: left },
      head: [["S.No", "Particular", "Amount In Pak Rs."]],
      body: [
        ["1", "Road Haulage Charges", money(booking.rate)],
        ["2", taxLineLabel, money(tax.salesTaxAmount)],
        ["", "Total", money(tax.totalAmount)]
      ],
      styles: {
        fontSize: 10,
        cellPadding: 6,
        lineColor: [70, 70, 70],
        lineWidth: 0.8,
        textColor: [32, 32, 32]
      },
      headStyles: {
        fillColor: [255, 235, 59],
        textColor: [0, 0, 0],
        fontStyle: "bold"
      },
      columnStyles: {
        0: { cellWidth: 42, halign: "center" },
        1: { cellWidth: 349 },
        2: { cellWidth: 132, halign: "right" }
      }
    });

    const signatureY = pdf.lastAutoTable.finalY + 34;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    pdf.setTextColor(32, 32, 32);
    pdf.text("For Global Transport & Logistics Services", right, signatureY, { align: "right" });

    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, pageHeight - 112, pageWidth, 112, "F");
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.8);
    pdf.line(28, pageHeight - 68, pageWidth - 28, pageHeight - 68);
    pdf.text("Office # 15, Ayub Shopping Center, Keamari, Karachi | 021-328 62660", left, pageHeight - 48);

    pdf.save(`${String(booking.customer || "customer").replace(/[^\w-]+/g, "_")}_invoice.pdf`);
  }

  function formatContainerSizeSummary(booking) {
    const counts = new Map();
    getBookingContainerLines(booking).forEach((line) => {
      const rawSize = String(line.size || "").trim();
      if (!rawSize) return;
      const size = rawSize.replace(/\s*ft\.?$/i, "").trim();
      counts.set(size, (counts.get(size) || 0) + 1);
    });
    return [...counts.entries()].map(([size, count]) => `${count}x${size}`).join(", ") || "-";
  }

  function cropImageDataUrl(dataUrl, cropTop, cropHeight) {
    return new Promise((resolve) => {
      if (!dataUrl) return resolve(null);
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = Math.min(cropHeight, image.naturalHeight - cropTop);
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, cropTop, image.naturalWidth, canvas.height, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.92));
      };
      image.onerror = () => resolve(null);
      image.src = dataUrl;
    });
  }

  async function buildSummaryRecordPdf(customer, bookings) {
    if (!window.jspdf || !window.jspdf.jsPDF) throw new Error("The PDF library could not be loaded.");
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("l", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const letterhead = await loadInvoiceTemplateDataUrl();
    const letterheadHeader = await cropImageDataUrl(letterhead, 0, 270);
    const totals = bookings.reduce((summary, item) => {
      const tax = calculateBookingTaxBreakdown(item.rate, item.detention, item.salesTaxAuthority);
      summary.roadHaulage += Number(item.rate || 0);
      summary.salesTax += Number(item.salesTaxAmount || tax.salesTaxAmount || 0);
      summary.totalAmount += Number(item.totalAmount || tax.totalAmount || 0);
      return summary;
    }, { roadHaulage: 0, salesTax: 0, totalAmount: 0 });
    if (letterheadHeader) {
      const headerWidth = 520;
      const headerHeight = 124;
      pdf.addImage(letterheadHeader, "JPEG", 20, 10, headerWidth, headerHeight);
    }
    pdf.setTextColor(24, 48, 77);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(15);
    pdf.text("CUSTOMER SUMMARY", 36, 150);
    pdf.setFontSize(12);
    pdf.text(String(customer || "Unknown Customer"), 36, 170);
    pdf.autoTable({
      startY: 184,
      theme: "grid",
      head: [["S.No", "Date", "Booking No", "Invoice No", "Customer", "Container", "Road Haulage Charges", "15% Sales Tax", "Total Amount", "Remarks"]],
      body: bookings.map((item, index) => {
        const tax = calculateBookingTaxBreakdown(item.rate, item.detention, item.salesTaxAuthority);
        return [
        String(index + 1),
        formatShortDate(item.date),
        text(item.bookingNo || item.id),
        text(item.invoiceNo || "-"),
        text(item.customer || customer || "-"),
        formatContainerSizeSummary(item),
        money(item.rate),
        money(item.salesTaxAmount || tax.salesTaxAmount),
        money(item.totalAmount || tax.totalAmount),
        text(item.remarks || "-")
      ];
      }),
      foot: [["", "", "", "", "", "Total", money(totals.roadHaulage), money(totals.salesTax), money(totals.totalAmount), ""]],
      styles: { fontSize: 8, cellPadding: 4, lineColor: [226, 210, 193], textColor: [25, 40, 58], overflow: "linebreak" },
      headStyles: { fillColor: [24, 48, 77], textColor: [255, 255, 255] },
      footStyles: { fillColor: [255, 247, 239], textColor: [24, 48, 77], fontStyle: "bold" },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 58 },
        2: { cellWidth: 72 },
        3: { cellWidth: 72 },
        4: { cellWidth: 92 },
        5: { cellWidth: 58 },
        6: { cellWidth: 88 },
        7: { cellWidth: 72 },
        8: { cellWidth: 78 },
        9: { cellWidth: 106 }
      }
    });
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, pageHeight - 112, pageWidth, 112, "F");
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.8);
    pdf.line(28, pageHeight - 68, pageWidth - 28, pageHeight - 68);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(32, 32, 32);
    pdf.text("Office # 15, Ayub Shopping Center, Keamari, Karachi | 021-328 62660", 36, pageHeight - 48);
    pdf.save(`${String(customer || "customer").replace(/[^\w-]+/g, "_")}_summary.pdf`);
  }

  function setActiveNav() {
    const page = document.body.dataset.page;
    document.querySelectorAll(".nav a").forEach((link) => {
      link.classList.toggle("active", link.dataset.page === page);
    });
  }

  function ensureEquipmentNavigation() {
    document.querySelectorAll(".nav").forEach((nav) => {
      if (nav.querySelector('[data-page="equipment"]')) return;
      const link = document.createElement("a");
      link.href = "equipment.html";
      link.dataset.page = "equipment";
      link.textContent = "Equipment & Handling Fleet";
      const employeeLink = nav.querySelector('[data-page="employee"]');
      nav.insertBefore(link, employeeLink || nav.querySelector('[data-page="admin"], [data-page="admin-login"]'));
    });
  }

  function ensureAccountsNavigationOrder() {
    document.querySelectorAll(".nav").forEach((nav) => {
      const employeeLink = nav.querySelector('[data-page="employee"]');
      const receivableLink = nav.querySelector('[data-page="khata"]');
      const payableLink = nav.querySelector('[data-page="accounts-payable"]');
      if (!employeeLink) return;
      if (receivableLink) nav.insertBefore(receivableLink, employeeLink);
      if (payableLink) nav.insertBefore(payableLink, employeeLink);
    });
  }

  function ensureMaintenanceNavigation() {
    document.querySelectorAll(".nav").forEach((nav) => {
      if (nav.querySelector('[data-page="maintenance"]')) return;
      const link = document.createElement("a");
      link.href = "maintenance.html";
      link.dataset.page = "maintenance";
      link.textContent = "Fleet Maintenance";
      const employeeLink = nav.querySelector('[data-page="employee"]');
      nav.insertBefore(link, employeeLink || nav.querySelector('[data-page="admin"], [data-page="admin-login"]'));
    });
  }

  function ensureActivityLogsNavigation() {
    document.querySelectorAll(".nav").forEach((nav) => {
      if (nav.querySelector('[data-page="activity-logs"]')) return;
      const link = document.createElement("a");
      link.href = "activity-logs.html";
      link.dataset.page = "activity-logs";
      link.textContent = "Activity Logs";
      const adminLink = nav.querySelector('[data-page="admin"], [data-page="admin-login"]');
      if (adminLink) adminLink.insertAdjacentElement("afterend", link);
      else nav.appendChild(link);
    });
  }

  function syncAdminNavigationRoute() {
    const session = getAdminSession();
    document.querySelectorAll('.nav a[data-page="admin-login"], .nav a[data-page="admin"]').forEach((link) => {
      link.href = session ? "admin.html" : "admin-login.html";
      link.dataset.page = session ? "admin" : "admin-login";
    });
  }

  function getNavigationIcon(page) {
    const icons = {
      dashboard: '<path d="M3 11.5 12 4l9 7.5"></path><path d="M5 10v10h14V10"></path><path d="M9 20v-6h6v6"></path>',
      booking: '<path d="M6 3v3M18 3v3"></path><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M3 9h18M8 13h3M8 17h6"></path>',
      ledger: '<path d="M6 2h9l4 4v16H6z"></path><path d="M14 2v5h5M9 12h6M9 16h6"></path>',
      truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z"></path><circle cx="7" cy="18" r="2"></circle><circle cx="18" cy="18" r="2"></circle>',
      "truck-summary": '<path d="M4 19V9M10 19V5M16 19v-7M22 19H2"></path>',
      "completed-truck-summary": '<circle cx="12" cy="12" r="9"></circle><path d="m8 12 2.5 2.5L16 9"></path>',
      equipment: '<path d="M4 14h11v5H4zM15 11h4l2 3v5h-6z"></path><path d="M7 14V8h6M13 8l3-3M3 19h19"></path><circle cx="8" cy="20" r="1.5"></circle><circle cx="18" cy="20" r="1.5"></circle>',
      maintenance: '<path d="m14.7 6.3 3-3a4.2 4.2 0 0 1-5.5 5.5l-6.8 6.8a2.1 2.1 0 0 0 3 3l6.8-6.8a4.2 4.2 0 0 0 5.5-5.5l-3 3z"></path><circle cx="7" cy="17" r=".8"></circle>',
      employee: '<circle cx="12" cy="8" r="4"></circle><path d="M4 21c.8-4.2 3.5-6 8-6s7.2 1.8 8 6"></path>',
      khata: '<path d="M4 4h16v16H4z"></path><path d="M8 8h8M8 12h8M8 16h5"></path>',
      "accounts-payable": '<path d="M3 7h18v12H3z"></path><path d="M3 10h18M7 15h4"></path><path d="m16 14 2 2 3-4"></path>',
      "activity-logs": '<path d="M5 3h14v18H5z"></path><path d="M9 3v3h6V3M8 10h8M8 14h8M8 18h5"></path>',
      "admin-login": '<circle cx="12" cy="8" r="4"></circle><path d="M5 21v-2a7 7 0 0 1 14 0v2"></path><path d="M18 5.5 20 4l1 2"></path>',
      admin: '<circle cx="12" cy="8" r="4"></circle><path d="M5 21v-2a7 7 0 0 1 14 0v2"></path><path d="M18 5.5 20 4l1 2"></path>'
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icons[page] || icons.dashboard}</svg>`;
  }

  function bindDesktopSidebar() {
    const sidebar = document.querySelector(".sidebar");
    const brand = sidebar?.querySelector(".brand");
    const nav = sidebar?.querySelector(".nav");
    if (!sidebar || !brand || !nav) return;

    nav.querySelectorAll("a[data-page]").forEach((link) => {
      if (link.querySelector(".nav-icon")) return;
      const label = link.textContent.trim();
      link.innerHTML = `<span class="nav-icon">${getNavigationIcon(link.dataset.page)}</span><span class="nav-label">${escapeHtml(label)}</span>`;
      link.title = label;
    });

    let collapseButton = brand.querySelector("[data-sidebar-collapse]");
    if (!collapseButton) {
      collapseButton = document.createElement("button");
      collapseButton.type = "button";
      collapseButton.className = "sidebar-collapse";
      collapseButton.dataset.sidebarCollapse = "";
      brand.appendChild(collapseButton);
    }

    const signOutButton = sidebar.querySelector("[data-software-signout]");
    if (signOutButton && !signOutButton.querySelector(".nav-icon")) {
      signOutButton.innerHTML = `
        <span class="nav-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M10 17l5-5-5-5M15 12H3"></path><path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"></path>
          </svg>
        </span>
        <span class="nav-label">Sign Out</span>
      `;
      signOutButton.title = "Sign Out";
    }

    function applyCollapsedState(isCollapsed) {
      sidebar.classList.toggle("collapsed", isCollapsed);
      document.body.classList.toggle("sidebar-collapsed", isCollapsed);
      collapseButton.setAttribute("aria-expanded", String(!isCollapsed));
      collapseButton.setAttribute("aria-label", isCollapsed ? "Expand sidebar" : "Collapse sidebar");
      collapseButton.title = isCollapsed ? "Expand sidebar" : "Collapse sidebar";
      collapseButton.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="${isCollapsed ? "m9 18 6-6-6-6" : "m15 18-6-6 6-6"}"></path>
        </svg>
      `;
    }

    applyCollapsedState(localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true");
    collapseButton.addEventListener("click", () => {
      const nextState = !sidebar.classList.contains("collapsed");
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(nextState));
      applyCollapsedState(nextState);
    });
  }

  function bindMobileNav() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const close = document.querySelector("[data-nav-close]");
    const overlay = document.querySelector("[data-nav-overlay]");
    const sidebar = document.querySelector(".sidebar");
    if (!toggle || !sidebar) return;

    function openNav() {
      sidebar.classList.add("open");
      document.body.classList.add("nav-open");
    }

    function closeNav() {
      sidebar.classList.remove("open");
      document.body.classList.remove("nav-open");
    }

    toggle.addEventListener("click", openNav);
    if (close) close.addEventListener("click", closeNav);
    if (overlay) overlay.addEventListener("click", closeNav);
    document.querySelectorAll(".nav a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });
  }

  const PAYMENT_ALERT_READ_KEY = "gtls-payment-alert-read-v1";

  function getBookingReceivableAmount(item) {
    const storedAmount = Number(item.receivableAmount);
    if (Number.isFinite(storedAmount)) return storedAmount;
    return calculateBookingTaxBreakdown(item.rate, item.detention, item.salesTaxAuthority).receivableAmount;
  }

  function getPaymentTermDays(value) {
    const term = String(value || "").trim().toLowerCase();
    if (!term) return null;
    if (["immediate", "due immediately", "same day", "on delivery", "cash on delivery", "cod"].includes(term)) return 0;
    const amount = Number((term.match(/\d+(?:\.\d+)?/) || [])[0]);
    if (!Number.isFinite(amount)) return null;
    if (term.includes("month")) return Math.round(amount * 30);
    if (term.includes("week")) return Math.round(amount * 7);
    return Math.round(amount);
  }

  function getPaymentDueDate(item) {
    const bookingDate = parseDateValue(item.date);
    const termDays = getPaymentTermDays(item.paymentTerm);
    if (!bookingDate || termDays === null) return null;
    const dueDate = new Date(bookingDate);
    dueDate.setDate(dueDate.getDate() + termDays);
    return dueDate;
  }

  function getPaymentAlertKey(item, dueDate) {
    const dateKey = dueDate instanceof Date && !Number.isNaN(dueDate.getTime())
      ? `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2, "0")}-${String(dueDate.getDate()).padStart(2, "0")}`
      : "unknown";
    return `${item.id || item.invoiceNo || item.customer || "booking"}|${dateKey}`;
  }

  function getReadPaymentAlertKeys() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(PAYMENT_ALERT_READ_KEY) || "[]");
      return new Set(Array.isArray(saved) ? saved : []);
    } catch (_) {
      return new Set();
    }
  }

  function bindPaymentNotifications(bookingsSource) {
    const center = document.querySelector("[data-payment-notifications]");
    if (!center) return () => {};
    const trigger = center.querySelector("[data-notification-trigger]");
    const panel = center.querySelector("[data-notification-panel]");
    const closeButton = center.querySelector("[data-notification-close]");
    const count = center.querySelector("[data-notification-count]");
    const summary = center.querySelector("[data-notification-summary]");
    const list = center.querySelector("[data-notification-list]");
    let expiredPayments = [];

    function readBookings() {
      const value = typeof bookingsSource === "function" ? bookingsSource() : bookingsSource;
      return Array.isArray(value) ? value : [];
    }

    function renderNotifications() {
      const today = parseDateValue(getTodayIsoDate());
      expiredPayments = readBookings()
        .filter((item) => String(item.accountFlow || "").trim().toLowerCase() === "awaited")
        .map((item) => {
          const dueDate = getPaymentDueDate(item);
          const daysOverdue = dueDate && today ? Math.floor((today - dueDate) / 86400000) : -1;
          return { item, dueDate, daysOverdue, key: getPaymentAlertKey(item, dueDate) };
        })
        .filter((entry) => entry.dueDate && entry.daysOverdue >= 0)
        .sort((left, right) => right.daysOverdue - left.daysOverdue);

      const readKeys = getReadPaymentAlertKeys();
      const unreadCount = expiredPayments.filter((entry) => !readKeys.has(entry.key)).length;
      count.textContent = unreadCount > 99 ? "99+" : unreadCount;
      count.hidden = unreadCount === 0;
      summary.textContent = expiredPayments.length
        ? `${expiredPayments.length} expired payment${expiredPayments.length === 1 ? "" : "s"}`
        : "No expired payments";
      list.innerHTML = expiredPayments.length
        ? expiredPayments.map(({ item, dueDate, daysOverdue }) => `
          <a class="payment-notification" href="booking.html" title="Open Booking Form">
            <span class="payment-notification-icon"><strong>${daysOverdue}</strong><small>${daysOverdue === 1 ? "day" : "days"}</small></span>
            <span class="payment-notification-copy">
              <span class="payment-notification-title">
                <strong>${text(item.customer || "Customer")}</strong>
                <em>${daysOverdue === 0 ? "Due today" : "Overdue"}</em>
              </span>
              <span class="payment-notification-meta">
                <span>${text(item.invoiceNo || item.id || "Invoice")}</span>
                <span>PKR ${money(getBookingReceivableAmount(item))}</span>
              </span>
              <span class="payment-notification-due">Due date: ${formatShortDate(dueDate)}</span>
            </span>
          </a>
        `).join("")
        : '<div class="notification-empty">No payment term has expired.</div>';
    }

    function setPanel(open) {
      panel.hidden = !open;
      trigger.setAttribute("aria-expanded", String(open));
    }

    trigger.addEventListener("click", () => {
      const opening = panel.hidden;
      if (opening && expiredPayments.length) {
        const readKeys = getReadPaymentAlertKeys();
        expiredPayments.forEach((entry) => readKeys.add(entry.key));
        sessionStorage.setItem(PAYMENT_ALERT_READ_KEY, JSON.stringify([...readKeys]));
        count.hidden = true;
        count.textContent = "0";
      }
      setPanel(opening);
    });
    closeButton.addEventListener("click", () => setPanel(false));
    document.addEventListener("click", (event) => {
      if (!panel.hidden && !center.contains(event.target)) setPanel(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !panel.hidden) {
        setPanel(false);
        trigger.focus();
      }
    });

    renderNotifications();
    return renderNotifications;
  }

  function dashboardPage(store) {
    const bookings = Array.isArray(store.bookings) ? store.bookings : [];
    const truckJobs = (Array.isArray(store.truckExpenses) ? store.truckExpenses : []).filter((item) => item.jobNo);
    const equipmentFleet = Array.isArray(store.equipmentFleet) ? store.equipmentFleet : [];
    const customerAccounts = Array.isArray(store.customerKhatas) ? store.customerKhatas : [];
    const supplierAccounts = Array.isArray(store.vendorKhatas) ? store.vendorKhatas : [];

    function hasAllTruckPaymentsCredited(item) {
      return [item.importPaymentStatus, item.exportPaymentStatus, item.mtyPaymentStatus]
        .every((status) => String(status || "Awaited").trim().toLowerCase() === "credit");
    }

    function isTruckPaymentCredited(status) {
      return String(status || "Awaited").trim().toLowerCase() === "credit";
    }

    function getAwaitedTruckReceivable(item) {
      const financials = calculateTruckTripFinancials(item);
      let total = 0;
      if (!isTruckPaymentCredited(item.importPaymentStatus)) total += financials.importReceivable;
      if (!isTruckPaymentCredited(item.exportPaymentStatus)) total += financials.exportReceivable;
      if (!isTruckPaymentCredited(item.mtyPaymentStatus)) total += Number(item.mtyBoxFreight || 0);
      return total;
    }

    function setKpi(name, value) {
      const element = document.querySelector(`[data-kpi='${name}']`);
      if (element) element.textContent = value;
    }

    function setExpiryKpi(name, summary) {
      setKpi(name, summary.alerts);
      const card = document.querySelector(`[data-expiry-card='${name}']`);
      const detail = document.querySelector(`[data-expiry-detail='${name}']`);
      if (card) {
        card.classList.toggle("expiry-due", summary.due > 0 && summary.expired === 0);
        card.classList.toggle("expiry-expired", summary.expired > 0);
        card.title = summary.alerts
          ? `${summary.expired} expired, ${summary.due} due within 30 days`
          : "No expiry within 30 days";
      }
      if (detail) {
        detail.textContent = summary.alerts
          ? `${summary.expired} expired | ${summary.due} due soon`
          : "No upcoming expiry";
      }
    }

    function setFinancialAlertKpi(name, value, formatted = false) {
      setKpi(name, formatted ? money(value) : value);
      const card = document.querySelector(`[data-financial-alert='${name}']`);
      if (card) {
        card.classList.toggle("financial-outstanding", Number(value || 0) > 0);
      }
    }

    function getAccountMetrics(accounts) {
      return accounts.reduce((metrics, account) => {
        const summary = calculateKhataSummary({ ...account, entries: Array.isArray(account.entries) ? account.entries : [] });
        const outstanding = Math.max(0, Number(summary.closingBalance || 0));
        metrics.totalDebit += Number(summary.debit || 0);
        metrics.totalCredit += Number(summary.credit || 0);
        metrics.outstanding += outstanding;
        if (outstanding > 0) metrics.pendingAccounts += 1;
        return metrics;
      }, { totalDebit: 0, totalCredit: 0, outstanding: 0, pendingAccounts: 0 });
    }

    function getDocumentExpiryState(value) {
      if (!value) return "valid";
      const today = parseDateValue(getTodayIsoDate());
      const expiry = parseDateValue(value);
      if (!expiry || !today) return "valid";
      const days = Math.ceil((expiry - today) / 86400000);
      if (days < 0) return "expired";
      if (days <= 30) return "due";
      return "valid";
    }

    function getExpirySummary(field) {
      return equipmentFleet.reduce((summary, item) => {
        const state = getDocumentExpiryState(item[field]);
        if (state === "expired") summary.expired += 1;
        if (state === "due") summary.due += 1;
        summary.alerts = summary.expired + summary.due;
        return summary;
      }, { alerts: 0, expired: 0, due: 0 });
    }

    const activeTrips = bookings.filter((b) => b.status === "In Transit").length;
    const awaitingBookings = bookings.filter((b) => String(b.accountFlow || "").trim().toLowerCase() === "awaited");
    const pendingBills = awaitingBookings.length;
    const delivered = bookings.filter((b) => b.status === "Delivered").length;
    const bookingReceivable = awaitingBookings.reduce((sum, item) => sum + getBookingReceivableAmount(item), 0);
    const completedTruckJobs = truckJobs.filter(hasAllTruckPaymentsCredited);
    const pendingTruckJobRows = truckJobs.filter((item) => !hasAllTruckPaymentsCredited(item));
    const pendingTruckJobs = pendingTruckJobRows.length;
    const pendingTruckReceivable = pendingTruckJobRows.reduce((sum, item) => sum + getAwaitedTruckReceivable(item), 0);
    const completedTruckWorkAmount = completedTruckJobs.reduce((sum, item) => sum + calculateTruckTripFinancials(item).grandTotal, 0);
    const truckProfitLoss = completedTruckJobs.reduce((sum, item) => sum + calculateTruckTripFinancials(item).profitLoss, 0);
    const customerAccountMetrics = getAccountMetrics(customerAccounts);
    const supplierAccountMetrics = getAccountMetrics(supplierAccounts);
    const equipmentExpirySummaries = {
      fitnessAlerts: getExpirySummary("fitnessExpiry"),
      balochistanPermitAlerts: getExpirySummary("balochistanPermitExpiry"),
      sindhPermitAlerts: getExpirySummary("sindhPermitExpiry"),
      kpkPermitAlerts: getExpirySummary("kpkPermitExpiry"),
      punjabPermitAlerts: getExpirySummary("punjabPermitExpiry")
    };
    const documentAlerts = Object.values(equipmentExpirySummaries).reduce((total, summary) => ({
      alerts: total.alerts + summary.alerts,
      expired: total.expired + summary.expired,
      due: total.due + summary.due
    }), { alerts: 0, expired: 0, due: 0 });

    setKpi("totalBookings", bookings.length);
    setKpi("activeTrips", activeTrips);
    setKpi("pendingBills", pendingBills);
    setKpi("delivered", delivered);
    setKpi("customerBillingTotal", money(customerAccountMetrics.totalDebit));
    setKpi("receipts", money(customerAccountMetrics.totalCredit));
    setKpi("bookingReceivable", money(bookingReceivable));
    setFinancialAlertKpi("accountsReceivable", customerAccountMetrics.outstanding, true);
    setFinancialAlertKpi("pendingCustomerCount", customerAccountMetrics.pendingAccounts);
    setKpi("supplierPayableTotal", money(supplierAccountMetrics.totalDebit));
    setKpi("supplierPaidTotal", money(supplierAccountMetrics.totalCredit));
    setFinancialAlertKpi("accountsPayable", supplierAccountMetrics.outstanding, true);
    setFinancialAlertKpi("pendingSupplierCount", supplierAccountMetrics.pendingAccounts);
    setKpi("totalTruckJobs", truckJobs.length);
    setKpi("pendingTruckJobs", pendingTruckJobs);
    setKpi("completedTruckJobs", completedTruckJobs.length);
    setKpi("pendingTruckReceivable", money(pendingTruckReceivable));
    setKpi("completedTruckWorkAmount", money(completedTruckWorkAmount));
    setKpi("truckProfitLoss", money(truckProfitLoss));
    setKpi("fleetUnits", equipmentFleet.length);
    setExpiryKpi("documentAlerts", documentAlerts);
    Object.entries(equipmentExpirySummaries).forEach(([name, summary]) => setExpiryKpi(name, summary));
    bindPaymentNotifications(bookings);

    const bookingsBody = document.querySelector("[data-bookings-preview]");
    bookingsBody.innerHTML = bookings.map((item) => `
      <tr>
        <td>${text(item.id)}</td>
        <td>${formatShortDate(item.date)}</td>
        <td>${text(item.customer)}</td>
        <td>${text(item.route)}</td>
        <td>${getBookingContainerLines(item).length} Container(s)</td>
        <td>${getBookingContainerLines(item).map((line) => text(line.truckNo)).join(", ")}</td>
        <td>${money(item.rate)}</td>
        <td><span class="badge ${item.status === "In Transit" ? "good" : "warn"}">${text(item.status)}</span></td>
      </tr>
    `).join("");

    const employeeBody = document.querySelector("[data-employee-preview]");
    if (employeeBody) {
      employeeBody.innerHTML = store.employees.map((item) => `
        <tr>
          <td>${text(item.id)}</td>
          <td>${text(item.name)}</td>
          <td>${text(item.designation)}</td>
          <td>${text(item.department)}</td>
          <td>${money(item.salary)}</td>
          <td><span class="badge ${item.status === "Active" ? "good" : "bad"}">${text(item.status)}</span></td>
        </tr>
      `).join("");
    }
  }

  function bookingPage(store) {
    const form = document.querySelector("[data-booking-form]");
    const body = document.querySelector("[data-booking-rows]");
    const notice = document.querySelector("[data-notice]");
    const customerFilter = document.querySelector("[data-booking-customer-filter]");
    const startDateFilter = document.querySelector("[data-booking-start-date]");
    const endDateFilter = document.querySelector("[data-booking-end-date]");
    const dateSort = document.querySelector("[data-booking-date-sort]");
    const bookingCount = document.querySelector("[data-booking-count]");
    const bookingTotal = document.querySelector("[data-booking-total]");
    const statusField = form.querySelector("[name='status']");
    const rateField = form.querySelector("[name='rate']");
    const detentionField = form.querySelector("[name='detention']");
    const salesTaxAuthorityField = form.querySelector("[name='salesTaxAuthority']");
    const salesTaxAmountField = form.querySelector("[name='salesTaxAmount']");
    const totalAmountField = form.querySelector("[name='totalAmount']");
    const incomeTaxAmountField = form.querySelector("[name='incomeTaxAmount']");
    const salesTaxWithheldAmountField = form.querySelector("[name='salesTaxWithheldAmount']");
    const salesTaxByUsAmountField = form.querySelector("[name='salesTaxByUsAmount']");
    const receivableAmountField = form.querySelector("[name='receivableAmount']");
    const dateTextField = form.querySelector("[name='date']");
    const datePickerField = form.querySelector("[name='datePicker']");
    const datePickerButton = form.querySelector("[data-open-date-picker]");
    const containerRows = form.querySelector("[data-container-rows]");
    const addContainerRowButton = form.querySelector("[data-add-container-row]");
    const biltyInput = form.querySelector("[data-bilty-input]");
    const removeBiltyButton = form.querySelector("[data-remove-bilty]");
    const biltyModal = document.querySelector("[data-bilty-modal]");
    const biltyModalImage = document.querySelector("[data-bilty-modal-image]");
    const closeBiltyModalButton = document.querySelector("[data-close-bilty-modal]");
    let editingId = "";
    let biltyImageData = "";
    let biltyImagePromise = Promise.resolve("");
    const refreshPaymentNotifications = bindPaymentNotifications(() => store.bookings);

    function setBiltyPreview(imageData = "") {
      biltyImageData = String(imageData || "");
      removeBiltyButton.hidden = !biltyImageData;
    }

    function compressBiltyImage(file) {
      return new Promise((resolve, reject) => {
        if (!file || !String(file.type || "").startsWith("image/")) {
          reject(new Error("Please select a valid image file."));
          return;
        }

        const reader = new FileReader();
        reader.onerror = () => reject(new Error("The Bilty image could not be read."));
        reader.onload = () => {
          const image = new Image();
          image.onerror = () => reject(new Error("The Bilty image format is not supported."));
          image.onload = () => {
            const maxDimension = 1400;
            const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
            const canvas = document.createElement("canvas");
            canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
            canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
            const context = canvas.getContext("2d");
            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            let quality = 0.78;
            let imageData = canvas.toDataURL("image/jpeg", quality);
            while (imageData.length > 700000 && quality > 0.46) {
              quality -= 0.08;
              imageData = canvas.toDataURL("image/jpeg", quality);
            }
            resolve(imageData);
          };
          image.src = String(reader.result || "");
        };
        reader.readAsDataURL(file);
      });
    }

    function closeBiltyModal() {
      biltyModal.hidden = true;
      biltyModalImage.removeAttribute("src");
      document.body.classList.remove("bilty-modal-open");
    }

    function openBiltyModal(imageData) {
      if (!imageData) return;
      biltyModalImage.src = imageData;
      biltyModal.hidden = false;
      document.body.classList.add("bilty-modal-open");
      closeBiltyModalButton.focus();
    }

    function createContainerRowMarkup(line = {}, index = 0) {
      const item = normalizeContainerLine(line);
      return `
        <div class="container-row" data-container-row="${index}">
          <div class="field-lite">
            <label>Container No</label>
            <input name="containerNo" value="${item.containerNo}" placeholder="Example: TRHU5588410" />
          </div>
          <div class="field-lite">
            <label>Container Size</label>
            <select name="size">
              <option value="20 FT" ${item.size === "20 FT" ? "selected" : ""}>20 FT</option>
              <option value="40 FT" ${item.size === "40 FT" ? "selected" : ""}>40 FT</option>
              <option value="45 FT" ${item.size === "45 FT" ? "selected" : ""}>45 FT</option>
            </select>
          </div>
          <div class="field-lite">
            <label>Truck No</label>
            <input name="truckNo" value="${item.truckNo}" placeholder="Example: TMT-066" />
          </div>
          <div class="row-action">
            <button class="btn small danger" type="button" data-remove-container-row="${index}">Remove</button>
          </div>
        </div>
      `;
    }

    function renderContainerRows(lines = [normalizeContainerLine()]) {
      containerRows.innerHTML = lines.map((line, index) => createContainerRowMarkup(line, index)).join("");
      const removeButtons = containerRows.querySelectorAll("[data-remove-container-row]");
      removeButtons.forEach((button) => {
        button.disabled = removeButtons.length === 1;
      });
      updateContainerSummary(lines);
    }

    function collectContainerLines() {
      const rows = Array.from(containerRows.querySelectorAll("[data-container-row]"));
      const lines = rows.map((row) => normalizeContainerLine({
        containerNo: row.querySelector("[name='containerNo']").value,
        size: row.querySelector("[name='size']").value,
        truckNo: row.querySelector("[name='truckNo']").value
      })).filter((line) => line.containerNo || line.truckNo);

      return lines.length ? lines : [normalizeContainerLine()];
    }

    function updateContainerSummary(lines) {
      return lines;
    }

    function syncBookingDate(value) {
      const isoValue = formatIsoDate(value);
      dateTextField.value = value ? formatShortDate(value) : "";
      datePickerField.value = isoValue;
    }

    function syncTotalAmount() {
      const breakdown = calculateBookingTaxBreakdown(rateField.value, detentionField.value, salesTaxAuthorityField.value);
      salesTaxAmountField.value = String(breakdown.salesTaxAmount);
      totalAmountField.value = String(breakdown.totalAmount);
      incomeTaxAmountField.value = String(breakdown.incomeTaxAmount);
      salesTaxWithheldAmountField.value = String(breakdown.salesTaxWithheldAmount);
      salesTaxByUsAmountField.value = String(breakdown.salesTaxByUsAmount);
      receivableAmountField.value = String(breakdown.receivableAmount);
    }

    function resetForm() {
      form.reset();
      biltyInput.value = "";
      biltyImagePromise = Promise.resolve("");
      setBiltyPreview("");
      form.elements.bookingNo.value = "BKG-24061";
      form.elements.invoiceNo.value = "INV-24061";
      syncBookingDate("2026-06-10");
      form.elements.category.value = "Inter City Transport";
      form.elements.accountFlow.value = "Awaited";
      form.elements.paymentTerm.value = "30 Days";
      form.elements.rate.value = "145000";
      form.elements.gatePass.value = "GP-001";
      form.elements.detention.value = "0";
      form.elements.salesTaxAuthority.value = "Sindh Revenue Board";
      syncTotalAmount();
      statusField.value = "Delivered";
      renderContainerRows([
        {
          containerNo: "TRHU5588410",
          size: "40 FT",
          truckNo: "TMT-066"
        }
      ]);
      editingId = "";
      form.querySelector("[data-submit-label]").textContent = "Save Booking";
    }

    function renderCustomerFilter() {
      const customers = [...new Set(store.bookings.map((item) => String(item.customer || "").trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
      const currentValue = customerFilter.value;
      customerFilter.innerHTML = `
        <option value="">All Customers</option>
        ${customers.map((customer) => `<option value="${customer}">${customer}</option>`).join("")}
      `;
      customerFilter.value = customers.includes(currentValue) ? currentValue : "";
    }

    function render() {
      renderCustomerFilter();
      const selectedCustomer = customerFilter.value;
      const startDate = parseDateValue(startDateFilter?.value);
      const endDate = parseDateValue(endDateFilter?.value);
      const bookings = (selectedCustomer
        ? store.bookings.filter((item) => String(item.customer || "").trim() === selectedCustomer)
        : [...store.bookings])
        .filter((item) => {
          if (startDate && endDate && startDate > endDate) return false;
          if (!startDate && !endDate) return true;
          const bookingDate = parseDateValue(item.date);
          if (!bookingDate) return false;
          if (startDate && bookingDate < startDate) return false;
          if (endDate && bookingDate > endDate) return false;
          return true;
        })
        .sort((left, right) => compareDateValues(left.date, right.date, dateSort?.value || "desc"));

      bookingCount.textContent = `${bookings.length} record(s)`;
      const filteredTotalAmount = bookings.reduce((total, item) => {
        const storedTotal = item.totalAmount;
        const amount = storedTotal === null || storedTotal === undefined || storedTotal === ""
          ? calculateBookingTaxBreakdown(item.rate, item.detention, item.salesTaxAuthority).totalAmount
          : Number(storedTotal || 0);
        return total + amount;
      }, 0);
      bookingTotal.textContent = `PKR ${money(filteredTotalAmount)}`;

      if (!bookings.length) {
        body.innerHTML = `
          <tr>
            <td colspan="34">No records found for this customer.</td>
          </tr>
        `;
        return;
      }

      body.innerHTML = bookings.map((item) => {
        const lines = getBookingContainerLines(item);
        return `
          <tr>
            <td>${text(item.id)}</td>
            <td>${text(item.bookingNo || item.id)}</td>
            <td>${formatShortDate(item.date)}</td>
            <td>${text(item.invoiceNo)}</td>
            <td>${text(item.customer)}</td>
            <td>${text(item.consignee)}</td>
            <td>${text(item.route)}</td>
            <td>${text(item.origin)}</td>
            <td>${text(item.destination)}</td>
            <td>${text(item.category)}</td>
            <td>${text(item.blNo)}</td>
            <td>${renderStackedCell(lines.map((line) => text(line.containerNo)))}</td>
            <td>${renderStackedCell(lines.map((line) => text(line.size)))}</td>
            <td>${renderStackedCell(lines.map((line) => text(line.truckNo)))}</td>
            <td>${text(item.goodsType)}</td>
            <td>${text(item.quantity)}</td>
            <td>${money(item.rate)}</td>
            <td>${text(item.salesTaxAuthority)}</td>
            <td>${money(item.salesTaxAmount)}</td>
            <td>${money(item.totalAmount)}</td>
            <td>${money(item.incomeTaxAmount)}</td>
            <td>${money(item.salesTaxWithheldAmount)}</td>
            <td>${money(item.salesTaxByUsAmount)}</td>
            <td>${text(item.gatePass)}</td>
            <td>${money(item.detention)}</td>
            <td>${money(item.receivableAmount)}</td>
            <td>${text(item.paymentTerm)}</td>
            <td>${text(item.paymentReceivedDate ? formatShortDate(item.paymentReceivedDate) : "-")}</td>
            <td>${text(item.chequeNumber || "-")}</td>
            <td><span class="badge ${item.status === "In Transit" ? "good" : "warn"}">${text(item.status)}</span></td>
            <td><span class="badge ${item.accountFlow === "Credit" ? "good" : "bad"}">${text(item.accountFlow || "Awaited")}</span></td>
            <td>${item.biltyImage ? `
              <button class="bilty-thumbnail" type="button" data-view-bilty="${escapeHtml(item.id)}" aria-label="View Bilty image" title="View Bilty">
                <img src="${escapeHtml(item.biltyImage)}" alt="Bilty thumbnail" />
              </button>
            ` : "-"}</td>
            <td>${text(item.remarks)}</td>
            <td>
              <div class="table-actions">
                <button class="btn small" data-download-invoice="${item.id}">Invoice</button>
                <button class="btn small" data-edit-booking="${item.id}">Edit</button>
                <button class="btn small danger" data-delete-booking="${item.id}">Delete</button>
              </div>
            </td>
          </tr>
        `;
      }).join("");
    }

    function fillForm(item) {
      resetForm();
      Object.keys(item).forEach((key) => {
        if (key === "date") syncBookingDate(item[key]);
        else if (form.elements[key]) form.elements[key].value = item[key];
      });
      syncTotalAmount();
      renderContainerRows(getBookingContainerLines(item));
      biltyInput.value = "";
      setBiltyPreview(item.biltyImage);
      editingId = item.id;
      form.querySelector("[data-submit-label]").textContent = "Update Booking";
    }

    datePickerButton.addEventListener("click", () => {
      if (typeof datePickerField.showPicker === "function") datePickerField.showPicker();
      else datePickerField.click();
    });

    datePickerField.addEventListener("change", () => {
      if (datePickerField.value) syncBookingDate(datePickerField.value);
    });

    dateTextField.addEventListener("blur", () => {
      const isoValue = formatIsoDate(dateTextField.value);
      if (!isoValue) return;
      syncBookingDate(isoValue);
    });

    rateField.addEventListener("input", syncTotalAmount);
    detentionField.addEventListener("input", syncTotalAmount);
    salesTaxAuthorityField.addEventListener("change", syncTotalAmount);

    biltyInput.addEventListener("change", () => {
      const file = biltyInput.files && biltyInput.files[0];
      if (!file) return;

      biltyInput.disabled = true;
      biltyImagePromise = compressBiltyImage(file)
        .then((imageData) => {
          setBiltyPreview(imageData);
          return imageData;
        })
        .catch((error) => {
          biltyInput.value = "";
          setBiltyPreview("");
          notice.textContent = error.message;
          return "";
        })
        .finally(() => {
          biltyInput.disabled = false;
        });
    });

    removeBiltyButton.addEventListener("click", () => {
      biltyInput.value = "";
      biltyImagePromise = Promise.resolve("");
      setBiltyPreview("");
    });

    customerFilter.addEventListener("change", render);
    if (dateSort) dateSort.addEventListener("change", render);

    addContainerRowButton.addEventListener("click", () => {
      const lines = collectContainerLines();
      lines.push(normalizeContainerLine());
      renderContainerRows(lines);
    });

    containerRows.addEventListener("click", (event) => {
      const removeIndex = event.target.getAttribute("data-remove-container-row");
      if (removeIndex === null) return;
      const lines = collectContainerLines().filter((_, index) => index !== Number(removeIndex));
      renderContainerRows(lines.length ? lines : [normalizeContainerLine()]);
    });

    containerRows.addEventListener("input", () => {
      updateContainerSummary(collectContainerLines());
    });

    containerRows.addEventListener("change", () => {
      updateContainerSummary(collectContainerLines());
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      await biltyImagePromise;
      const data = Object.fromEntries(new FormData(form).entries());
      const bookingDate = formatShortDate(datePickerField.value || data.date);
      const containerLines = collectContainerLines();
      const primaryLine = containerLines[0] || normalizeContainerLine();
      const normalized = {
        ...data,
        date: bookingDate,
        containerLines,
        containerNo: primaryLine.containerNo,
        size: primaryLine.size,
        truckNo: primaryLine.truckNo,
        rate: Number(data.rate || 0),
        gatePass: String(data.gatePass || "").trim(),
        detention: Number(data.detention || 0),
        salesTaxAmount: Number(data.salesTaxAmount || 0),
        totalAmount: Number(data.totalAmount || 0),
        incomeTaxAmount: Number(data.incomeTaxAmount || 0),
        salesTaxWithheldAmount: Number(data.salesTaxWithheldAmount || 0),
        salesTaxByUsAmount: Number(data.salesTaxByUsAmount || 0),
        receivableAmount: Number(data.receivableAmount || 0),
        paymentReceivedDate: String(data.paymentReceivedDate || "").trim(),
        chequeNumber: String(data.chequeNumber || "").trim(),
        biltyImage: biltyImageData
      };
      delete normalized.datePicker;
      delete normalized.biltyUpload;

      if (!editingId) {
        normalized.id = getNextBookingJobNo(store.bookings);
        store.bookings.unshift(normalizeBookingContainers(normalized));
        notice.textContent = "New booking saved successfully in the current browser session.";
      } else {
        const index = store.bookings.findIndex((item) => item.id === editingId);
        normalized.id = editingId;
        store.bookings[index] = normalizeBookingContainers(normalized);
        notice.textContent = `Booking ${editingId} updated successfully.`;
      }
      saveStore(store);
      render();
      refreshPaymentNotifications();
      resetForm();
    });

    body.addEventListener("click", (event) => {
      const biltyTrigger = event.target.closest("[data-view-bilty]");
      const invoiceId = event.target.getAttribute("data-download-invoice");
      const editId = event.target.getAttribute("data-edit-booking");
      const deleteId = event.target.getAttribute("data-delete-booking");
      if (biltyTrigger) {
        const item = store.bookings.find((entry) => entry.id === biltyTrigger.getAttribute("data-view-bilty"));
        if (item && item.biltyImage) openBiltyModal(item.biltyImage);
        return;
      }
      if (invoiceId) {
        const item = store.bookings.find((entry) => entry.id === invoiceId);
        if (!item) return;
        buildBookingInvoicePdf(item).catch(() => {
          notice.textContent = "Invoice download failed. Please try again.";
        });
        return;
      }
      if (editId) {
        const item = store.bookings.find((entry) => entry.id === editId);
        if (item) {
          fillForm(item);
          const formSection = form.closest(".screen");
          (formSection || form).scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
      if (deleteId) {
        store.bookings = store.bookings.filter((entry) => entry.id !== deleteId);
        saveStore(store);
        render();
        refreshPaymentNotifications();
        notice.textContent = `Booking ${deleteId} deleted successfully.`;
        if (editingId === deleteId) resetForm();
      }
    });

    closeBiltyModalButton.addEventListener("click", closeBiltyModal);
    biltyModal.addEventListener("click", (event) => {
      if (event.target === biltyModal) closeBiltyModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !biltyModal.hidden) closeBiltyModal();
    });

    document.querySelector("[data-reset-form]").addEventListener("click", resetForm);
    if (customerFilter) customerFilter.addEventListener("change", render);
    if (startDateFilter) startDateFilter.addEventListener("change", render);
    if (endDateFilter) endDateFilter.addEventListener("change", render);
    if (dateSort) dateSort.addEventListener("change", render);
    resetForm();
    render();
  }

  function ledgerPage(store) {
    const body = document.querySelector("[data-ledger-rows]");
    const totalElement = document.querySelector("[data-summary-total]");
    const countElement = document.querySelector("[data-summary-count]");
    const customerFilter = document.querySelector("[data-summary-customer-filter]");
    const dateSort = document.querySelector("[data-summary-date-sort]");
    if (!body || !countElement) return;

    function getPendingBookings() {
      return store.bookings
        .filter((item) => {
          const paymentStatus = String(item.accountFlow || "").trim().toLowerCase();
          return !paymentStatus || paymentStatus === "awaited" || paymentStatus === "debit";
        });
    }

    function renderCustomerOptions() {
      if (!customerFilter) return;
      const customers = [...new Set(getPendingBookings().map((item) => String(item.customer || "").trim()).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b));
      customerFilter.innerHTML = `
        <option value="">All Customers</option>
        ${customers.map((customer) => `<option value="${escapeHtml(customer)}">${text(customer)}</option>`).join("")}
      `;
    }

    function render() {
      const selectedCustomer = customerFilter ? String(customerFilter.value || "").trim() : "";
      const debitBookings = getPendingBookings()
        .filter((item) => !selectedCustomer || String(item.customer || "").trim() === selectedCustomer)
        .sort((left, right) => compareDateValues(left.date, right.date, dateSort?.value || "desc"));

      const grouped = new Map();

      debitBookings.forEach((item) => {
        const customer = String(item.customer || "").trim() || "Unknown Customer";
        const pendingAmount = Number(item.receivableAmount || calculateBookingTaxBreakdown(item.rate, item.detention, item.salesTaxAuthority).receivableAmount);
        if (!grouped.has(customer)) {
          grouped.set(customer, {
            customer,
            bookings: [],
            dates: [],
            bookingNumbers: [],
            categories: [],
            totalRate: 0
          });
        }

        const entry = grouped.get(customer);
        entry.bookings.push(item);
        if (item.date && !entry.dates.includes(item.date)) entry.dates.push(item.date);
        const bookingNumber = String(item.bookingNo || item.id || "").trim();
        if (bookingNumber && !entry.bookingNumbers.includes(bookingNumber)) entry.bookingNumbers.push(bookingNumber);
        if (item.category && !entry.categories.includes(item.category)) entry.categories.push(item.category);
        entry.totalRate += pendingAmount;
      });

      const summaryRows = [...grouped.values()];
      if (totalElement) {
        totalElement.textContent = `PKR ${money(summaryRows.reduce((sum, item) => sum + item.totalRate, 0))}`;
      }
      countElement.textContent = `${summaryRows.length} customer(s)`;

      if (!summaryRows.length) {
        body.innerHTML = `
          <tr>
            <td colspan="6">No awaited summary records are available yet.</td>
          </tr>
        `;
        return;
      }

      body.innerHTML = summaryRows.map((item) => `
        <tr>
          <td>${renderStackedCell(item.dates.map((date) => formatShortDate(date)), text)}</td>
          <td>${renderStackedCell(item.bookingNumbers, text)}</td>
          <td>${renderStackedCell(item.categories.map((category) => text(category)), text)}</td>
          <td>${text(item.customer)}</td>
          <td>${money(item.totalRate)}</td>
          <td><button class="btn small" type="button" data-download-summary="${escapeHtml(item.customer)}">Download PDF</button></td>
        </tr>
      `).join("");
    }

    if (customerFilter) {
      customerFilter.addEventListener("change", render);
    }
    if (dateSort) dateSort.addEventListener("change", render);
    body.addEventListener("click", (event) => {
      const customer = event.target.getAttribute("data-download-summary");
      if (!customer) return;
      const bookings = getPendingBookings().filter((item) => (String(item.customer || "").trim() || "Unknown Customer") === customer);
      buildSummaryRecordPdf(customer, bookings).catch(() => {});
    });
    renderCustomerOptions();
    render();
  }

  async function buildPendingTruckSummaryPdf(trips, summaryTruckNo) {
    if (!window.jspdf || !window.jspdf.jsPDF) throw new Error("The PDF library could not be loaded.");
    const records = (Array.isArray(trips) ? trips : [trips])
      .filter(Boolean)
      .sort((left, right) => compareJobValues(left.jobNo, right.jobNo, "asc"));
    if (!records.length) throw new Error("No pending truck records were found.");
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("l", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const letterhead = await loadInvoiceTemplateDataUrl();
    const letterheadHeader = await cropImageDataUrl(letterhead, 0, 270);
    if (letterheadHeader) {
      const headerWidth = 520;
      const headerHeight = 124;
      pdf.addImage(letterheadHeader, "JPEG", 20, 10, headerWidth, headerHeight);
    }
    pdf.setTextColor(24, 48, 77);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text("PENDING TRUCK SUMMARY", 28, 150);
    pdf.text(`Truck No: ${text(summaryTruckNo)}`, 28, 168);

    function shortPdfDate(value) {
      const movementDate = parseDateValue(value);
      return movementDate
        ? `${String(movementDate.getDate()).padStart(2, "0")}-${movementDate.toLocaleString("en-US", { month: "short" })}-${String(movementDate.getFullYear()).slice(-2)}`
        : "-";
    }

    const rows = records.flatMap((trip) => {
      const importReceivable = trip.importReceivedAmount === undefined || trip.importReceivedAmount === ""
        ? Number(trip.importFreight || 0) - Number(trip.importBrokerCommission || 0)
        : Number(trip.importReceivedAmount || 0);
      const exportReceivable = trip.exportReceivedAmount === undefined || trip.exportReceivedAmount === ""
        ? Number(trip.exportFreight || 0) - Number(trip.exportBrokerCommission || 0)
        : Number(trip.exportReceivedAmount || 0);
      return [
        {
          amount: importReceivable,
          values: {
            jobNo: trip.jobNo,
            type: "Import",
            date: shortPdfDate(trip.date),
            truckNo: trip.truckNo,
            origin: trip.origin,
            destination: trip.destination,
            size: trip.size,
            weight: trip.weight,
            cargo: trip.cargoDescription,
            receivable: importReceivable,
            broker: trip.importBroker,
            remarks: trip.importRemarks || trip.remarks
          }
        },
        {
          amount: exportReceivable,
          values: {
            jobNo: trip.jobNo,
            type: "Export",
            date: shortPdfDate(trip.exportLoadDate),
            truckNo: trip.exportTruckNo || trip.truckNo,
            origin: trip.exportOrigin,
            destination: trip.exportDestination,
            size: trip.exportSize,
            weight: trip.exportWeight,
            cargo: trip.cargoDescription,
            receivable: exportReceivable,
            broker: trip.exportBroker,
            remarks: trip.exportRemarks || trip.remarks
          }
        },
        {
          amount: Number(trip.mtyBoxFreight || 0),
          values: {
            jobNo: trip.jobNo,
            type: "MTY",
            date: "-",
            truckNo: "-",
            origin: "-",
            destination: "-",
            size: "-",
            weight: "-",
            cargo: "-",
            receivable: Number(trip.mtyBoxFreight || 0),
            broker: trip.mtyBroker,
            remarks: "-"
          }
        }
      ];
    }).map((row, index) => ({
      amount: row.amount,
      cells: [
        String(index + 1),
        text(row.values.jobNo || "-"),
        row.values.type,
        row.values.date,
        text(row.values.truckNo || "-"),
        text(row.values.origin || "-"),
        text(row.values.destination || "-"),
        text(row.values.size || "-"),
        text(row.values.weight || "-"),
        text(row.values.cargo || "-"),
        money(row.values.receivable),
        text(row.values.broker || "-"),
        text(row.values.remarks || "-")
      ]
    }));
    const totalReceivable = rows.reduce((total, row) => total + Number(row.amount || 0), 0);

    pdf.autoTable({
      startY: 182,
      theme: "grid",
      margin: { left: 20, right: 20, bottom: 72 },
      showFoot: "lastPage",
      head: [[
        "S.No", "Job No", "Type", "Date", "Registration No", "Origin", "Destination", "Size",
        "Weight", "Cargo Description", "Receivable Amount", "Broker", "Remarks"
      ]],
      body: rows.map((row) => row.cells),
      foot: [["", "", "", "", "", "", "", "", "", "Total", money(totalReceivable), "", ""]],
      styles: {
        fontSize: 8,
        cellPadding: 4,
        lineColor: [0, 0, 0],
        lineWidth: 0.65,
        textColor: [0, 0, 0],
        valign: "middle",
        overflow: "linebreak"
      },
      headStyles: {
        fillColor: [184, 220, 231],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        halign: "center",
        minCellHeight: 34
      },
      bodyStyles: { minCellHeight: 34, halign: "center" },
      footStyles: {
        fillColor: [255, 247, 239],
        textColor: [24, 48, 77],
        fontStyle: "bold",
        halign: "center",
        minCellHeight: 28
      },
      columnStyles: {
        0: { cellWidth: 28, halign: "center" },
        1: { cellWidth: 48, halign: "center" },
        2: { cellWidth: 42, halign: "center" },
        3: { cellWidth: 52, halign: "center" },
        4: { cellWidth: 72, halign: "center" },
        5: { cellWidth: 47, halign: "center" },
        6: { cellWidth: 58, halign: "center" },
        7: { cellWidth: 36, halign: "center" },
        8: { cellWidth: 43, halign: "center" },
        9: { cellWidth: 68, halign: "center" },
        10: { cellWidth: 74, halign: "center" },
        11: { cellWidth: 106, halign: "center" },
        12: { cellWidth: 84, halign: "center" }
      },
      didDrawPage: () => {
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.7);
        pdf.line(28, pageHeight - 52, pageWidth - 28, pageHeight - 52);
        pdf.setTextColor(24, 48, 77);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.text("Office # 15, Ayub Shopping Center, Keamari, Karachi | 021-328 62660", 36, pageHeight - 34);
      }
    });

    const safeTruckNo = String(summaryTruckNo || "truck").replace(/[^\w-]+/g, "_");
    pdf.save(`${safeTruckNo}_pending_summary.pdf`);
  }

  async function buildTruckDetailsInvoicePdf(trip, tripType) {
    if (!window.jspdf || !window.jspdf.jsPDF) throw new Error("The PDF library could not be loaded.");
    const isImport = tripType === "import";
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const letterhead = await loadInvoiceTemplateDataUrl();
    if (letterhead) pdf.addImage(letterhead, "JPEG", 0, 0, pageWidth, pageHeight);

    pdf.setFillColor(255, 255, 255);
    pdf.rect(22, 118, pageWidth - 44, pageHeight - 172, "F");

    const details = isImport ? {
      date: trip.date,
      truckNo: trip.truckNo,
      origin: trip.origin,
      destination: trip.destination,
      size: trip.size,
      weight: trip.weight,
      freight: trip.importFreight,
      broker: trip.importBroker,
      commission: trip.importBrokerCommission,
      paymentStatus: trip.importPaymentStatus,
      remarks: trip.importRemarks || trip.remarks
    } : {
      date: trip.exportLoadDate,
      truckNo: trip.exportTruckNo || trip.truckNo,
      origin: trip.exportOrigin,
      destination: trip.exportDestination,
      size: trip.exportSize,
      weight: trip.exportWeight,
      freight: trip.exportFreight,
      broker: trip.exportBroker,
      commission: trip.exportBrokerCommission,
      paymentStatus: trip.exportPaymentStatus,
      remarks: trip.exportRemarks || trip.remarks
    };

    pdf.setTextColor(24, 48, 77);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text(isImport ? "IMPORT INVOICE" : "EXPORT INVOICE", 36, 158);
    pdf.text(`Job No: ${text(trip.jobNo || "-")}`, 36, 178);
    pdf.text(
      `${isImport ? "Import - Broker" : "Export - Broker"}: ${text(details.broker || "-")}`,
      36,
      198
    );

    pdf.autoTable({
      startY: 226,
      theme: "grid",
      body: [
        ["Date", details.date ? formatShortDate(details.date) : "-"],
        ["Truck Registration No", text(details.truckNo || "-")],
        ["Route", `${text(details.origin || "-")} to ${text(details.destination || "-")}`],
        ["Size / Weight", `${text(details.size || "-")} / ${text(details.weight || "-")}`],
        ["Cargo Description", text(trip.cargoDescription || "-")],
        ["Broker", text(details.broker || "-")],
        ["Freight", money(details.freight)],
        ["Broker Commission", money(details.commission)],
        ["Payment Status", text(details.paymentStatus || "Awaited")],
        ["Remarks", text(details.remarks || "-")]
      ],
      styles: {
        fontSize: 10,
        cellPadding: 6,
        lineColor: [226, 210, 193],
        textColor: [25, 40, 58],
        overflow: "linebreak"
      },
      columnStyles: {
        0: { cellWidth: 150, fontStyle: "bold" },
        1: { cellWidth: 355 }
      }
    });

    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, pageHeight - 112, pageWidth, 112, "F");
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.8);
    pdf.line(28, pageHeight - 68, pageWidth - 28, pageHeight - 68);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(32, 32, 32);
    pdf.text("Office # 15, Ayub Shopping Center, Keamari, Karachi | 021-328 62660", 36, pageHeight - 48);

    const safeJobNo = safePdfFileName(trip.jobNo || "truck");
    const clientName = safePdfFileName(trip.customer || trip.importBroker || trip.exportBroker || "client");
    pdf.save(`${clientName}_${safeJobNo}_${isImport ? "import" : "export"}_invoice.pdf`);
  }

  function calculateTruckTripFinancials(trip = {}) {
    const importReceivable = Number(trip.importFreight || 0) - Number(trip.importBrokerCommission || 0);
    const exportReceivable = Number(trip.exportFreight || 0) - Number(trip.exportBrokerCommission || 0);
    const grandTotal = importReceivable + exportReceivable + Number(trip.mtyBoxFreight || 0);
    const roundTripExpense = Number(trip.roundTripExpense || 0);
    return {
      grandTotal,
      roundTripExpense,
      profitLoss: grandTotal - roundTripExpense
    };
  }

  function truckPage(store) {
    const body = document.querySelector("[data-truck-trip-rows]");
    const form = document.querySelector("[data-truck-trip-form]");
    const notice = document.querySelector("[data-notice]");
    const count = document.querySelector("[data-truck-trip-count]");
    const customerFilter = document.querySelector("[data-truck-customer-filter]");
    const jobSort = document.querySelector("[data-truck-job-sort]");
    const profitLossTotal = document.querySelector("[data-truck-ledger-profit-loss]");
    const imageInput = form?.querySelector("[data-truck-image-input]");
    const imagePreview = form?.querySelector("[data-truck-image-preview]");
    const removeImageButton = form?.querySelector("[data-remove-truck-image]");
    if (!body || !form) return;
    let editingId = "";
    let tripImageData = "";
    let tripImagePromise = Promise.resolve("");

    const numberFields = ["mtyBoxFreight", "importFreight", "importBrokerCommission", "importReceivedAmount", "exportFreight", "exportBrokerCommission", "exportReceivedAmount", "grandTotal", "roundTripExpense", "profitLoss"];

    function calculateTrip() {
      const importReceived = Number(form.elements.importFreight.value || 0) - Number(form.elements.importBrokerCommission.value || 0);
      const exportReceived = Number(form.elements.exportFreight.value || 0) - Number(form.elements.exportBrokerCommission.value || 0);
      const financials = calculateTruckTripFinancials({
        importFreight: form.elements.importFreight.value,
        importBrokerCommission: form.elements.importBrokerCommission.value,
        exportFreight: form.elements.exportFreight.value,
        exportBrokerCommission: form.elements.exportBrokerCommission.value,
        mtyBoxFreight: form.elements.mtyBoxFreight.value,
        roundTripExpense: form.elements.roundTripExpense.value
      });
      form.elements.importReceivedAmount.value = String(importReceived);
      form.elements.exportReceivedAmount.value = String(exportReceived);
      form.elements.grandTotal.value = String(financials.grandTotal);
      form.elements.profitLoss.value = String(financials.profitLoss);
    }

    function getNextTruckJobNo() {
      const highestJobNumber = store.truckExpenses.reduce((highest, item) => {
        const match = String(item.jobNo || "").trim().match(/^Job-(\d+)$/i);
        return match ? Math.max(highest, Number(match[1])) : highest;
      }, 0);
      return `Job-${highestJobNumber + 1}`;
    }

    function resetForm() {
      form.reset();
      form.elements.date.value = "2026-07-04";
      form.elements.truckNo.value = "JW-5477";
      form.elements.exportTruckNo.value = "JW-5477";
      form.elements.importPaymentStatus.value = "Awaited";
      form.elements.mtyPaymentStatus.value = "Awaited";
      form.elements.exportPaymentStatus.value = "Awaited";
      calculateTrip();
      if (imageInput) imageInput.value = "";
      setTripImage("");
      tripImagePromise = Promise.resolve("");
      editingId = "";
      form.querySelector("[data-submit-label]").textContent = "Save Trip";
    }

    function setTripImage(imageData = "") {
      tripImageData = String(imageData || "");
      if (removeImageButton) removeImageButton.hidden = !tripImageData;
      if (imagePreview) {
        imagePreview.hidden = !tripImageData;
        imagePreview.innerHTML = tripImageData
          ? `<img src="${tripImageData}" alt="Selected truck details attachment" />`
          : "";
      }
    }

    function render() {
      const allRows = store.truckExpenses.filter((item) => item.jobNo);
      const truckNumbers = [...new Set(allRows.map((item) => String(item.truckNo || "").trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
      const selectedTruckNo = String(customerFilter?.value || "").trim();
      if (customerFilter) {
        customerFilter.innerHTML = `<option value="">All Trucks</option>${truckNumbers.map((truckNo) => `<option value="${escapeHtml(truckNo)}">${text(truckNo)}</option>`).join("")}`;
        customerFilter.value = truckNumbers.includes(selectedTruckNo) ? selectedTruckNo : "";
      }
      const rows = (selectedTruckNo ? allRows.filter((item) => String(item.truckNo || "").trim() === selectedTruckNo) : [...allRows])
        .sort((left, right) => compareJobValues(left.jobNo, right.jobNo, jobSort?.value || "desc"));

      if (profitLossTotal) {
        const totalProfitLoss = rows.reduce((total, item) => total + calculateTruckTripFinancials(item).profitLoss, 0);
        profitLossTotal.textContent = `PKR ${money(totalProfitLoss)}`;
      }
      count.textContent = `${rows.length} record(s)`;
      if (!rows.length) {
        body.innerHTML = `<tr><td colspan="40">No truck trip records available yet.</td></tr>`;
        return;
      }
      body.innerHTML = rows.map((item, index) => {
        const financials = calculateTruckTripFinancials(item);
        return `
        <tr>
          <td>${index + 1}</td><td>${text(item.jobNo)}</td><td>${formatShortDate(item.date)}</td><td>${text(item.truckNo)}</td>
          <td>${text(item.origin)}</td><td>${text(item.destination)}</td><td>${text(item.customer)}</td><td>${text(item.size)}</td><td>${text(item.weight)}</td><td>${text(item.cargoDescription)}</td>
          <td>${money(item.mtyBoxFreight)}</td><td>${text(item.mtyBroker)}</td>
          <td>${money(item.importFreight)}</td><td>${money(item.importBrokerCommission)}</td><td>${text(item.importBroker)}</td><td>${money(item.importReceivedAmount)}</td><td>${text(item.importChequeDetails)}</td><td>${item.importPaymentDate ? formatShortDate(item.importPaymentDate) : "-"}</td><td><span class="badge ${item.importPaymentStatus === "Credit" ? "good" : "bad"}">${text(item.importPaymentStatus || "Awaited")}</span></td><td>${item.mtyPaymentDate ? formatShortDate(item.mtyPaymentDate) : "-"}</td><td><span class="badge ${item.mtyPaymentStatus === "Credit" ? "good" : "bad"}">${text(item.mtyPaymentStatus || "Awaited")}</span></td><td>${text(item.importRemarks || item.remarks || "-")}</td>
          <td>${item.exportLoadDate ? formatShortDate(item.exportLoadDate) : "-"}</td><td>${text(item.exportTruckNo || item.truckNo)}</td><td>${text(item.exportBroker)}</td><td>${money(item.exportFreight)}</td><td>${money(item.exportBrokerCommission)}</td><td>${text(item.exportOrigin)}</td><td>${text(item.exportDestination)}</td><td>${text(item.exportSize)}</td><td>${text(item.exportWeight)}</td><td>${money(item.exportReceivedAmount)}</td><td>${text(item.exportChequeDetails)}</td><td>${item.exportPaymentDate ? formatShortDate(item.exportPaymentDate) : "-"}</td><td><span class="badge ${item.exportPaymentStatus === "Credit" ? "good" : "bad"}">${text(item.exportPaymentStatus || "Awaited")}</span></td><td>${text(item.exportRemarks || item.remarks || "-")}</td><td>${money(financials.grandTotal)}</td><td>${money(financials.roundTripExpense)}</td><td>${money(financials.profitLoss)}</td>
          <td>
            <div class="table-actions">
              <button class="btn small" data-import-invoice="${item.id}">Import Invoice</button>
              <button class="btn small" data-export-invoice="${item.id}">Export Invoice</button>
              <button class="btn small" data-edit-trip="${item.id}">Edit</button>
              <button class="btn small danger" data-delete-trip="${item.id}">Delete</button>
            </div>
          </td>
        </tr>
      `;
      }).join("");
    }

    function fillForm(item) {
      Object.keys(item).forEach((key) => {
        if (form.elements[key]) form.elements[key].value = item[key];
      });
      calculateTrip();
      setTripImage(item.image || "");
      tripImagePromise = Promise.resolve(tripImageData);
      editingId = item.id;
      form.querySelector("[data-submit-label]").textContent = "Update Trip";
    }

    ["mtyBoxFreight", "importFreight", "importBrokerCommission", "exportFreight", "exportBrokerCommission", "roundTripExpense"].forEach((name) => {
      form.elements[name].addEventListener("input", calculateTrip);
    });

    imageInput?.addEventListener("change", () => {
      const file = imageInput.files?.[0];
      if (!file) return;
      tripImagePromise = compressImageFile(file)
        .then((result) => {
          setTripImage(result);
          return result;
        })
        .catch((error) => {
          imageInput.value = "";
          notice.textContent = error.message;
          return tripImageData;
        });
    });

    removeImageButton?.addEventListener("click", () => {
      imageInput.value = "";
      setTripImage("");
      tripImagePromise = Promise.resolve("");
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      await tripImagePromise;
      calculateTrip();
      const calculatedData = Object.fromEntries(new FormData(form).entries());
      const normalized = Object.fromEntries(Object.entries(calculatedData).filter(([key]) => key !== "tripImageFile"));
      numberFields.forEach((name) => { normalized[name] = Number(calculatedData[name] || 0); });
      normalized.image = tripImageData;
      if (!editingId) {
        normalized.jobNo = getNextTruckJobNo();
        normalized.id = getNextSequentialId(store.truckExpenses, "TRIP");
        store.truckExpenses.unshift(normalized);
        notice.textContent = `Truck trip ${normalized.jobNo} saved successfully.`;
      } else {
        const index = store.truckExpenses.findIndex((item) => item.id === editingId);
        normalized.jobNo = store.truckExpenses[index]?.jobNo || getNextTruckJobNo();
        normalized.id = editingId;
        store.truckExpenses[index] = normalized;
        notice.textContent = `Truck trip ${normalized.jobNo} updated successfully.`;
      }
      try {
        saveStore(store);
      } catch (error) {
        notice.textContent = "The image is too large for browser storage. Please choose a smaller image.";
        return;
      }
      render();
      resetForm();
    });

    body.addEventListener("click", (event) => {
      const importInvoiceId = event.target.getAttribute("data-import-invoice");
      const exportInvoiceId = event.target.getAttribute("data-export-invoice");
      const editId = event.target.getAttribute("data-edit-trip");
      const deleteId = event.target.getAttribute("data-delete-trip");
      if (importInvoiceId || exportInvoiceId) {
        const item = store.truckExpenses.find((entry) => entry.id === (importInvoiceId || exportInvoiceId));
        if (item) buildTruckDetailsInvoicePdf(item, importInvoiceId ? "import" : "export").catch(() => {
          notice.textContent = "Invoice download failed. Please try again.";
        });
        return;
      }
      if (editId) fillForm(store.truckExpenses.find((item) => item.id === editId));
      if (deleteId) {
        store.truckExpenses = store.truckExpenses.filter((item) => item.id !== deleteId);
        saveStore(store);
        render();
        notice.textContent = `Truck trip ${deleteId} deleted successfully.`;
        if (editingId === deleteId) resetForm();
      }
    });

    document.querySelector("[data-reset-form]").addEventListener("click", resetForm);
    if (customerFilter) customerFilter.addEventListener("change", render);
    if (jobSort) jobSort.addEventListener("change", render);
    resetForm();
    render();
  }

  function truckSummaryPage(store) {
    const isCompletedSummary = document.body.dataset.page === "completed-truck-summary";
    const groupsContainer = document.querySelector("[data-truck-summary-groups]");
    const count = document.querySelector("[data-truck-summary-count]");
    const customerFilter = document.querySelector("[data-truck-summary-customer-filter]");
    const jobSort = document.querySelector("[data-truck-summary-job-sort]");
    const startDateFilter = document.querySelector("[data-truck-summary-start-date]");
    const endDateFilter = document.querySelector("[data-truck-summary-end-date]");
    const importReceivableTotal = document.querySelector("[data-truck-summary-import-receivable]");
    const exportReceivableTotal = document.querySelector("[data-truck-summary-export-receivable]");
    const grandTotalElement = document.querySelector("[data-truck-summary-grand-total]");
    const totalTrucksElement = document.querySelector("[data-truck-summary-total-trucks]");
    const totalWorkElement = document.querySelector("[data-completed-total-work]");
    const completedProfitLossElement = document.querySelector("[data-completed-profit-loss]");
    const pendingSummaryDownloadButton = document.querySelector("[data-download-pending-truck-summary]");
    let currentPendingSummaryTrips = [];
    let currentPendingSummaryTruckNo = "";
    if (!groupsContainer || !count) return;

    function hasAllPaymentsCredited(item) {
      const importStatus = String(item.importPaymentStatus || "Awaited").trim().toLowerCase();
      const exportStatus = String(item.exportPaymentStatus || "Awaited").trim().toLowerCase();
      const mtyStatus = String(item.mtyPaymentStatus || "Awaited").trim().toLowerCase();
      return importStatus === "credit"
        && exportStatus === "credit"
        && mtyStatus === "credit";
    }

    function render() {
      const trips = store.truckExpenses.filter((item) => {
        if (!item.jobNo) return false;
        return isCompletedSummary ? hasAllPaymentsCredited(item) : !hasAllPaymentsCredited(item);
      });
      const truckNumbers = [...new Set(trips.map((item) => String(item.truckNo || "").trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
      const selectedTruckNo = String(customerFilter?.value || "").trim();
      if (customerFilter) {
        customerFilter.innerHTML = `<option value="">All Trucks</option>${truckNumbers.map((truckNo) => `<option value="${escapeHtml(truckNo)}">${text(truckNo)}</option>`).join("")}`;
        customerFilter.value = truckNumbers.includes(selectedTruckNo) ? selectedTruckNo : "";
      }
      const startDate = parseDateValue(startDateFilter?.value);
      const endDate = parseDateValue(endDateFilter?.value);
      const filteredTrips = trips
        .filter((item) => !selectedTruckNo || String(item.truckNo || "").trim() === selectedTruckNo)
        .filter((item) => {
          if (!startDate && !endDate) return true;
          const completedDate = parseDateValue(item.exportLoadDate || item.date);
          if (!completedDate) return false;
          if (startDate && completedDate < startDate) return false;
          if (endDate && completedDate > endDate) return false;
          return true;
        })
        .sort((left, right) => compareJobValues(left.jobNo, right.jobNo, jobSort?.value || "desc"));

      if (!isCompletedSummary) {
        currentPendingSummaryTrips = filteredTrips;
        currentPendingSummaryTruckNo = selectedTruckNo;
        if (pendingSummaryDownloadButton) {
          pendingSummaryDownloadButton.disabled = !selectedTruckNo || !filteredTrips.length;
        }
      }

      const totals = filteredTrips.reduce((summary, item) => {
        const storedImportReceivable = Number(item.importReceivedAmount);
        const storedExportReceivable = Number(item.exportReceivedAmount);
        const importReceivable = Number.isFinite(storedImportReceivable)
          ? storedImportReceivable
          : Number(item.importFreight || 0) - Number(item.importBrokerCommission || 0);
        const exportReceivable = Number.isFinite(storedExportReceivable)
          ? storedExportReceivable
          : Number(item.exportFreight || 0) - Number(item.exportBrokerCommission || 0);
        const financials = calculateTruckTripFinancials(item);
        const grandTotal = financials.grandTotal;
        summary.importReceivable += importReceivable;
        summary.exportReceivable += exportReceivable;
        summary.grandTotal += grandTotal;
        summary.profitLoss += financials.profitLoss;
        return summary;
      }, { importReceivable: 0, exportReceivable: 0, grandTotal: 0, profitLoss: 0 });

      if (importReceivableTotal) importReceivableTotal.textContent = `PKR ${money(totals.importReceivable)}`;
      if (exportReceivableTotal) exportReceivableTotal.textContent = `PKR ${money(totals.exportReceivable)}`;
      if (grandTotalElement) grandTotalElement.textContent = `PKR ${money(totals.grandTotal)}`;
      if (totalTrucksElement) {
        const totalTrucks = new Set(filteredTrips.map((item) => String(item.truckNo || "").trim()).filter(Boolean)).size;
        totalTrucksElement.textContent = String(totalTrucks);
      }
      if (totalWorkElement) totalWorkElement.textContent = `PKR ${money(totals.grandTotal)}`;
      if (completedProfitLossElement) completedProfitLossElement.textContent = `PKR ${money(totals.profitLoss)}`;
      const groupedTrips = new Map();

      filteredTrips.forEach((trip) => {
        const jobNo = String(trip.jobNo || "").trim() || "Unknown Job";
        if (!groupedTrips.has(jobNo)) {
          groupedTrips.set(jobNo, {
            jobNo,
            customer: String(trip.customer || "").trim() || "-",
            trips: []
          });
        }
        groupedTrips.get(jobNo).trips.push(trip);
      });

      const jobGroups = [...groupedTrips.values()];
      count.textContent = `${jobGroups.length} job(s)`;
      if (!jobGroups.length) {
        groupsContainer.innerHTML = `<div class="truck-summary-empty">No ${isCompletedSummary ? "completed" : "pending"} truck records available yet.</div>`;
        return;
      }

      let serialNumber = 0;
      groupsContainer.innerHTML = jobGroups.map((group) => {
        const legs = group.trips.flatMap((item) => ([
          { tripId: item.id, type: "Import", date: item.date, truckNo: item.truckNo, origin: item.origin, destination: item.destination, size: item.size, weight: item.weight, cargo: item.cargoDescription, freight: item.importFreight, receivable: item.importReceivedAmount === undefined || item.importReceivedAmount === "" ? Number(item.importFreight || 0) - Number(item.importBrokerCommission || 0) : Number(item.importReceivedAmount || 0), broker: item.importBroker, remarks: item.importRemarks || item.remarks },
          { tripId: item.id, type: "Export", date: item.exportLoadDate, truckNo: item.exportTruckNo || item.truckNo, origin: item.exportOrigin, destination: item.exportDestination, size: item.exportSize, weight: item.exportWeight, cargo: item.cargoDescription, freight: item.exportFreight, receivable: item.exportReceivedAmount === undefined || item.exportReceivedAmount === "" ? Number(item.exportFreight || 0) - Number(item.exportBrokerCommission || 0) : Number(item.exportReceivedAmount || 0), broker: item.exportBroker, remarks: item.exportRemarks || item.remarks },
          { tripId: item.id, type: "MTY", date: "", truckNo: "", origin: "", destination: "", size: "", weight: "", cargo: "", freight: item.mtyBoxFreight, receivable: Number(item.mtyBoxFreight || 0), broker: item.mtyBroker, remarks: "" }
        ]));
        const brokerSummary = [...new Set(legs.map((leg) => String(leg.broker || "").trim()).filter(Boolean))].join(" | ") || "-";

        return `
          <section class="truck-job-group">
            <div class="truck-job-header">
              <div class="truck-job-identity">
                <span>Job No</span>
                <strong>${escapeHtml(group.jobNo)}</strong>
              </div>
              <div class="truck-job-customer">
                <span>Broker</span>
                <strong>${escapeHtml(brokerSummary)}</strong>
              </div>
              <span class="truck-job-count">${legs.length} movement(s)</span>
            </div>
            <div class="table-wrap">
              <table class="statement-table truck-summary-table">
                <thead>
                  <tr>
                    <th>S.No</th><th>Type</th><th>Date</th><th>Registration No</th><th>Origin</th><th>Destination</th><th>Size</th><th>Weight</th><th>Cargo Description</th><th>${isCompletedSummary ? "Received Amount" : "Receivable Amount"}</th><th>Broker</th><th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  ${legs.map((leg) => {
                    serialNumber += 1;
                    return `<tr>
                      <td>${serialNumber}</td>
                      <td><span class="truck-leg-type ${leg.type.toLowerCase()}">${leg.type}</span></td>
                      <td>${leg.date ? formatShortDate(leg.date) : "-"}</td>
                      <td>${text(leg.truckNo)}</td>
                      <td>${text(leg.origin)}</td>
                      <td>${text(leg.destination)}</td>
                      <td>${text(leg.size)}</td>
                      <td>${text(leg.weight)}</td>
                      <td>${text(leg.cargo)}</td>
                      <td>${money(leg.receivable)}</td>
                      <td>${text(leg.broker)}</td>
                      <td>${text(leg.remarks)}</td>
                    </tr>`;
                  }).join("")}
                </tbody>
              </table>
            </div>
          </section>
        `;
      }).join("");
    }

    if (customerFilter) customerFilter.addEventListener("change", render);
    if (jobSort) jobSort.addEventListener("change", render);
    if (startDateFilter) startDateFilter.addEventListener("change", render);
    if (endDateFilter) endDateFilter.addEventListener("change", render);
    if (pendingSummaryDownloadButton) {
      pendingSummaryDownloadButton.addEventListener("click", () => {
        if (!currentPendingSummaryTruckNo || !currentPendingSummaryTrips.length) return;
        buildPendingTruckSummaryPdf(currentPendingSummaryTrips, currentPendingSummaryTruckNo).catch(() => {});
      });
    }
    render();
  }

  function equipmentPage(store) {
    const form = document.querySelector("[data-equipment-form]");
    const body = document.querySelector("[data-equipment-rows]");
    const summary = document.querySelector("[data-equipment-summary]");
    const search = document.querySelector("[data-equipment-search]");
    const count = document.querySelector("[data-equipment-count]");
    const notice = document.querySelector("[data-notice]");
    const documentInput = document.querySelector("[data-equipment-document-input]");
    const documentName = document.querySelector("[data-equipment-document-name]");
    const removeDocumentButton = document.querySelector("[data-remove-equipment-document]");
    let editingId = "";
    let equipmentDocument = { name: "", type: "", data: "" };
    let equipmentDocumentPromise = Promise.resolve(equipmentDocument);
    if (!form || !body || !summary) return;

    const permitFields = [
      "balochistanPermitExpiry",
      "sindhPermitExpiry",
      "kpkPermitExpiry",
      "punjabPermitExpiry"
    ];

    function setNotice(message = "") {
      if (!notice) return;
      notice.textContent = message;
      notice.hidden = !message;
    }

    function setEquipmentDocument(document = {}) {
      equipmentDocument = {
        name: String(document.name || ""),
        type: String(document.type || ""),
        data: String(document.data || "")
      };
      if (documentName) {
        documentName.textContent = equipmentDocument.name;
        documentName.hidden = !equipmentDocument.name;
      }
      if (removeDocumentButton) removeDocumentButton.hidden = !equipmentDocument.name;
    }

    function getExpiryState(value) {
      if (!value) return { className: "na", label: "N/A" };
      const expiry = parseDateValue(value);
      if (!expiry) return { className: "na", label: text(value) };
      const today = parseDateValue(getTodayIsoDate());
      const days = Math.ceil((expiry - today) / 86400000);
      if (days < 0) return { className: "expired", label: formatShortDate(value) };
      if (days <= 90) return { className: "due", label: formatShortDate(value) };
      return { className: "valid", label: formatShortDate(value) };
    }

    function expiryCell(value) {
      const state = getExpiryState(value);
      return `<span class="expiry-status ${state.className}">${state.label}</span>`;
    }

    function updateSummary(rows) {
      const fitnessAlerts = rows.filter((item) => {
        const state = getExpiryState(item.fitnessExpiry).className;
        return state === "expired" || state === "due";
      }).length;
      const permitAlerts = rows.filter((item) => permitFields.some((field) => {
        const state = getExpiryState(item[field]).className;
        return state === "expired" || state === "due";
      })).length;
      const completeFiles = rows.filter((item) => String(item.documentData || item.originalDocs || "").trim()).length;

      summary.innerHTML = `
        <div class="card span-3"><span class="badge neutral">Fleet</span><strong>${rows.length}</strong><div class="muted">Registered equipment</div></div>
        <div class="card span-3"><span class="badge ${fitnessAlerts ? "bad" : "good"}">Fitness</span><strong>${fitnessAlerts}</strong><div class="muted">Expiry alerts</div></div>
        <div class="card span-3"><span class="badge ${permitAlerts ? "warn" : "good"}">Permits</span><strong>${permitAlerts}</strong><div class="muted">Permit alerts</div></div>
        <div class="card span-3"><span class="badge good">Documents</span><strong>${completeFiles}</strong><div class="muted">Files recorded</div></div>
      `;
    }

    function getFilteredRows() {
      const query = String(search?.value || "").trim().toLowerCase();
      return [...store.equipmentFleet]
        .filter((item) => !query || [
          item.truckNo,
          item.chassisNo,
          item.engineNo,
          item.make,
          item.model,
          item.mra,
          item.banker,
          item.documentName,
          item.originalDocs
        ].some((value) => String(value || "").toLowerCase().includes(query)))
        .sort((left, right) => String(left.truckNo || "").localeCompare(String(right.truckNo || "")));
    }

    function render() {
      const rows = getFilteredRows();
      body.innerHTML = rows.map((item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td><strong>${text(item.truckNo)}</strong></td>
          <td>${text(item.chassisNo)}</td>
          <td>${text(item.engineNo)}</td>
          <td>${text(item.make)}</td>
          <td>${text(item.model)}</td>
          <td>${text(item.mra)}</td>
          <td>${text(item.banker)}</td>
          <td>${expiryCell(item.fitnessExpiry)}</td>
          <td>${expiryCell(item.balochistanPermitExpiry)}</td>
          <td>${expiryCell(item.sindhPermitExpiry)}</td>
          <td>${expiryCell(item.kpkPermitExpiry)}</td>
          <td>${expiryCell(item.punjabPermitExpiry)}</td>
          <td>${expiryCell(item.taxPaidUpTo)}</td>
          <td class="equipment-docs">${item.documentData
            ? `<button class="btn small" type="button" data-view-equipment-document="${item.id}">${escapeHtml(item.documentName || "View File")}</button>`
            : text(item.originalDocs || "-")}</td>
          <td>
            <div class="table-actions">
              <button class="btn small" type="button" data-download-equipment="${item.id}">Download PDF</button>
              <button class="btn small" type="button" data-edit-equipment="${item.id}">Edit</button>
              <button class="btn small danger" type="button" data-delete-equipment="${item.id}">Delete</button>
            </div>
          </td>
        </tr>
      `).join("");
      updateSummary(rows);
      if (count) count.textContent = `${rows.length} record(s)`;
    }

    function resetForm() {
      form.reset();
      editingId = "";
      setEquipmentDocument();
      equipmentDocumentPromise = Promise.resolve(equipmentDocument);
      form.querySelector("[data-submit-label]").textContent = "Save Equipment";
    }

    function fillForm(item) {
      if (!item) return;
      Object.keys(item).forEach((key) => {
        if (form.elements[key] && form.elements[key].type !== "file") form.elements[key].value = item[key] || "";
      });
      setEquipmentDocument({
        name: item.documentName || item.originalDocs || "",
        type: item.documentType || "",
        data: item.documentData || ""
      });
      equipmentDocumentPromise = Promise.resolve(equipmentDocument);
      editingId = item.id;
      form.querySelector("[data-submit-label]").textContent = "Update Equipment";
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    documentInput?.addEventListener("change", () => {
      const file = documentInput.files?.[0];
      if (!file) return;
      equipmentDocumentPromise = readDocumentFile(file)
        .then((document) => {
          setEquipmentDocument(document);
          setNotice("");
          return document;
        })
        .catch((error) => {
          documentInput.value = "";
          setNotice(error.message);
          return equipmentDocument;
        });
    });

    removeDocumentButton?.addEventListener("click", () => {
      if (documentInput) documentInput.value = "";
      setEquipmentDocument();
      equipmentDocumentPromise = Promise.resolve(equipmentDocument);
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      await equipmentDocumentPromise;
      const data = Object.fromEntries(new FormData(form).entries());
      const normalized = Object.fromEntries(
        Object.entries(data)
          .filter(([key]) => key !== "equipmentDocumentFile")
          .map(([key, value]) => [key, String(value || "").trim()])
      );
      normalized.documentName = equipmentDocument.name;
      normalized.documentType = equipmentDocument.type;
      normalized.documentData = equipmentDocument.data;
      normalized.originalDocs = equipmentDocument.name;

      if (!editingId) {
        normalized.id = getNextSequentialId(store.equipmentFleet, "EQP");
        store.equipmentFleet.unshift(normalized);
        setNotice(`${normalized.truckNo} added to the equipment register.`);
      } else {
        const index = store.equipmentFleet.findIndex((item) => item.id === editingId);
        if (index === -1) return;
        normalized.id = editingId;
        store.equipmentFleet[index] = normalized;
        setNotice(`${normalized.truckNo} equipment record updated.`);
      }

      saveStore(store);
      resetForm();
      render();
    });

    body.addEventListener("click", async (event) => {
      const downloadId = event.target.closest("[data-download-equipment]")?.dataset.downloadEquipment;
      const viewDocumentId = event.target.closest("[data-view-equipment-document]")?.dataset.viewEquipmentDocument;
      const editId = event.target.getAttribute("data-edit-equipment");
      const deleteId = event.target.getAttribute("data-delete-equipment");
      if (downloadId) {
        const item = store.equipmentFleet.find((entry) => entry.id === downloadId);
        if (item) {
          try {
            await createRegisterPdf(
              "Equipment & Handling Fleet",
              ["S.No", "Truck No", "Chassis No", "Engine No", "Make", "Model", "MRA"],
              ["1", item.truckNo, item.chassisNo, item.engineNo, item.make, item.model, item.mra],
              `${safePdfFileName(item.truckNo || item.id)}_equipment_fleet`
            );
          } catch (error) {
            setNotice(error.message);
          }
        }
        return;
      }
      if (viewDocumentId) {
        const item = store.equipmentFleet.find((entry) => entry.id === viewDocumentId);
        if (item?.documentData) window.open(item.documentData, "_blank", "noopener,noreferrer");
        return;
      }
      if (editId) fillForm(store.equipmentFleet.find((item) => item.id === editId));
      if (deleteId) {
        store.equipmentFleet = store.equipmentFleet.filter((item) => item.id !== deleteId);
        saveStore(store);
        if (editingId === deleteId) resetForm();
        render();
        setNotice("Equipment record deleted.");
      }
    });

    document.querySelector("[data-reset-equipment-form]").addEventListener("click", resetForm);
    if (search) search.addEventListener("input", render);
    resetForm();
    render();
  }

  function maintenancePage(store) {
    const form = document.querySelector("[data-maintenance-form]");
    const body = document.querySelector("[data-maintenance-rows]");
    const summary = document.querySelector("[data-maintenance-summary]");
    const truckFilter = document.querySelector("[data-maintenance-truck-filter]");
    const dateOrder = document.querySelector("[data-maintenance-date-order]");
    const count = document.querySelector("[data-maintenance-count]");
    const notice = document.querySelector("[data-notice]");
    const truckOptions = document.querySelector("[data-maintenance-truck-options]");
    const imageInput = document.querySelector("[data-maintenance-image-input]");
    const imagePreview = document.querySelector("[data-maintenance-image-preview]");
    const removeImageButton = document.querySelector("[data-remove-maintenance-image]");
    const imageModal = document.querySelector("[data-maintenance-image-modal]");
    const imageModalImage = document.querySelector("[data-maintenance-image-modal-image]");
    const closeImageModalButton = document.querySelector("[data-close-maintenance-image-modal]");
    if (!form || !body || !summary) return;

    let editingId = "";
    let imageData = "";
    let imagePromise = Promise.resolve("");

    function setNotice(message = "", isError = false) {
      if (!notice) return;
      notice.textContent = message;
      notice.hidden = !message;
      notice.classList.toggle("error", isError);
    }

    function getNextJobNo() {
      const nextNumber = store.maintenanceJobs.reduce((maximum, item) => {
        const number = Number(String(item.id || "").replace(/\D/g, "")) || 0;
        return Math.max(maximum, number);
      }, 0) + 1;
      return `MNT-${nextNumber}`;
    }

    function getTruckNumbers() {
      const numbers = new Set();
      (store.equipmentFleet || []).forEach((item) => numbers.add(String(item.truckNo || "").trim()));
      (store.trucks || []).forEach((item) => numbers.add(String(item.registrationNo || "").trim()));
      (store.truckExpenses || []).forEach((item) => {
        numbers.add(String(item.truckNo || "").trim());
        numbers.add(String(item.exportTruckNo || "").trim());
      });
      store.maintenanceJobs.forEach((item) => numbers.add(String(item.truckNo || "").trim()));
      return [...numbers].filter(Boolean).sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));
    }

    function populateTruckControls() {
      const selectedTruck = truckFilter?.value || "";
      const options = getTruckNumbers();
      if (truckOptions) truckOptions.innerHTML = options.map((truckNo) => `<option value="${escapeHtml(truckNo)}"></option>`).join("");
      if (truckFilter) {
        truckFilter.innerHTML = `<option value="">All Trucks</option>${options.map((truckNo) => `<option value="${escapeHtml(truckNo)}">${escapeHtml(truckNo)}</option>`).join("")}`;
        truckFilter.value = options.includes(selectedTruck) ? selectedTruck : "";
      }
    }

    function calculateWarrantyExpiry() {
      const repairDate = parseDateValue(form.elements.repairDate.value);
      const period = String(form.elements.warrantyPeriod.value || "").trim();
      const match = period.match(/^(\d+(?:\.\d+)?)\s*(day|days|month|months|year|years)$/i);
      if (!repairDate || !match) return;
      const amount = Number(match[1]);
      const unit = match[2].toLowerCase();
      const expiry = new Date(repairDate);
      if (unit.startsWith("day")) expiry.setDate(expiry.getDate() + amount);
      else if (unit.startsWith("month")) expiry.setMonth(expiry.getMonth() + amount);
      else expiry.setFullYear(expiry.getFullYear() + amount);
      form.elements.warrantyExpiry.value = formatIsoDate(expiry);
    }

    function getWarrantyState(value) {
      if (!value) return { className: "na", label: "Not Recorded" };
      const expiry = parseDateValue(value);
      const today = parseDateValue(getTodayIsoDate());
      if (!expiry || !today) return { className: "na", label: "Not Recorded" };
      const days = Math.ceil((expiry - today) / 86400000);
      if (days < 0) return { className: "expired", label: "Expired" };
      if (days <= 30) return { className: "due", label: `${days} day(s) left` };
      return { className: "valid", label: "Active" };
    }

    function compressImage(file) {
      return new Promise((resolve, reject) => {
        if (!file || !String(file.type || "").startsWith("image/")) {
          reject(new Error("Please select a valid image file."));
          return;
        }
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("The image could not be read."));
        reader.onload = () => {
          const image = new Image();
          image.onerror = () => reject(new Error("The image format is not supported."));
          image.onload = () => {
            const maxDimension = 1200;
            const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
            const canvas = document.createElement("canvas");
            canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
            canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
            const context = canvas.getContext("2d");
            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            let quality = 0.76;
            let result = canvas.toDataURL("image/jpeg", quality);
            while (result.length > 460000 && quality > 0.4) {
              quality -= 0.08;
              result = canvas.toDataURL("image/jpeg", quality);
            }
            resolve(result);
          };
          image.src = String(reader.result || "");
        };
        reader.readAsDataURL(file);
      });
    }

    function setImage(nextImage = "") {
      imageData = String(nextImage || "");
      removeImageButton.hidden = !imageData;
      imagePreview.hidden = !imageData;
      imagePreview.innerHTML = imageData
        ? `<button type="button" data-preview-current-maintenance-image><img src="${imageData}" alt="Selected maintenance invoice or part" /><span>View image</span></button>`
        : "";
    }

    function openImageModal(source) {
      if (!source) return;
      imageModalImage.src = source;
      imageModal.hidden = false;
      document.body.classList.add("bilty-modal-open");
      closeImageModalButton.focus();
    }

    function closeImageModal() {
      imageModal.hidden = true;
      imageModalImage.removeAttribute("src");
      document.body.classList.remove("bilty-modal-open");
    }

    function getFilteredRows() {
      return [...store.maintenanceJobs]
        .filter((item) => !truckFilter?.value || item.truckNo === truckFilter.value)
        .sort((left, right) => compareDateValues(left.repairDate || left.complaintDate, right.repairDate || right.complaintDate, dateOrder?.value || "desc"));
    }

    function updateSummary(rows) {
      const underWarranty = rows.filter((item) => getWarrantyState(item.warrantyExpiry).className === "valid").length;
      const expiringSoon = rows.filter((item) => getWarrantyState(item.warrantyExpiry).className === "due").length;
      const totalCost = rows.reduce((total, item) => total + Number(item.partCost || 0), 0);
      summary.innerHTML = `
        <div class="card span-3"><span class="badge neutral">Jobs</span><strong>${rows.length}</strong><div class="muted">Maintenance records</div></div>
        <div class="card span-3"><span class="badge good">Warranty</span><strong>${underWarranty}</strong><div class="muted">Active warranties</div></div>
        <div class="card span-3"><span class="badge ${expiringSoon ? "warn" : "good"}">Due Soon</span><strong>${expiringSoon}</strong><div class="muted">Within 30 days</div></div>
        <div class="card span-3"><span class="badge warn">Parts Cost</span><strong>PKR ${money(totalCost)}</strong><div class="muted">Filtered maintenance cost</div></div>`;
    }

    function render() {
      populateTruckControls();
      const rows = getFilteredRows();
      body.innerHTML = rows.map((item) => {
        const warranty = getWarrantyState(item.warrantyExpiry);
        return `<tr>
          <td><strong>${text(item.id)}</strong></td><td>${text(item.truckNo)}</td>
          <td>${formatShortDate(item.complaintDate)}</td><td>${formatShortDate(item.repairDate)}</td>
          <td>${text(item.partName)}</td><td>${text(item.oldSerialNumber)}</td><td>${text(item.newSerialNumber)}</td>
          <td>PKR ${money(item.partCost)}</td><td>${text(item.warrantyPeriod)}</td><td>${formatShortDate(item.warrantyExpiry)}</td>
          <td><span class="expiry-status ${warranty.className}">${warranty.label}</span></td>
          <td>${text(item.driverName)}</td>
          <td>${item.image ? `<button class="maintenance-thumbnail" type="button" data-view-maintenance-image="${item.id}" aria-label="View image for ${escapeHtml(item.id)}"><img src="${item.image}" alt="" /></button>` : "-"}</td>
          <td>${text(item.approvedBy)}</td>
          <td><div class="table-actions"><button class="btn small" type="button" data-download-maintenance="${item.id}">Download PDF</button><button class="btn small" type="button" data-edit-maintenance="${item.id}">Edit</button><button class="btn small danger" type="button" data-delete-maintenance="${item.id}">Delete</button></div></td>
        </tr>`;
      }).join("");
      updateSummary(rows);
      if (count) count.textContent = `${rows.length} record(s)`;
    }

    function resetForm() {
      form.reset();
      editingId = "";
      form.elements.id.value = getNextJobNo();
      form.elements.complaintDate.value = getTodayIsoDate();
      form.querySelector("[data-submit-label]").textContent = "Save Maintenance Job";
      setImage("");
      imagePromise = Promise.resolve("");
      setNotice();
    }

    function fillForm(item) {
      if (!item) return;
      Object.keys(item).forEach((key) => {
        if (form.elements[key] && key !== "imageFile") form.elements[key].value = item[key] || "";
      });
      editingId = item.id;
      setImage(item.image || "");
      imagePromise = Promise.resolve(imageData);
      form.querySelector("[data-submit-label]").textContent = "Update Maintenance Job";
      setNotice();
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    imageInput.addEventListener("change", () => {
      const file = imageInput.files?.[0];
      if (!file) return;
      imagePromise = compressImage(file)
        .then((result) => {
          setImage(result);
          setNotice();
          return result;
        })
        .catch((error) => {
          imageInput.value = "";
          setNotice(error.message, true);
          return imageData;
        });
    });

    removeImageButton.addEventListener("click", () => {
      imageInput.value = "";
      setImage("");
      imagePromise = Promise.resolve("");
    });
    imagePreview.addEventListener("click", (event) => {
      if (event.target.closest("[data-preview-current-maintenance-image]")) openImageModal(imageData);
    });
    form.elements.repairDate.addEventListener("change", calculateWarrantyExpiry);
    form.elements.warrantyPeriod.addEventListener("input", calculateWarrantyExpiry);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      await imagePromise;
      const data = Object.fromEntries(new FormData(form).entries());
      const normalized = Object.fromEntries(Object.entries(data)
        .filter(([key]) => key !== "imageFile")
        .map(([key, value]) => [key, String(value || "").trim()]));
      normalized.partCost = Number(String(normalized.partCost || "0").replace(/,/g, "")) || 0;
      normalized.image = imageData;

      const duplicateSerial = store.maintenanceJobs.find((item) =>
        item.id !== editingId && normalized.newSerialNumber &&
        String(item.newSerialNumber || "").toLowerCase() === normalized.newSerialNumber.toLowerCase()
      );
      if (duplicateSerial) {
        setNotice(`New Serial Number already exists in ${duplicateSerial.id} for truck ${duplicateSerial.truckNo}.`, true);
        return;
      }

      if (!editingId) {
        normalized.id = getNextJobNo();
        store.maintenanceJobs.unshift(normalized);
      } else {
        const index = store.maintenanceJobs.findIndex((item) => item.id === editingId);
        if (index === -1) return;
        normalized.id = editingId;
        store.maintenanceJobs[index] = normalized;
      }

      try {
        saveStore(store);
      } catch (error) {
        setNotice("The image is too large for browser storage. Please choose a smaller image.", true);
        return;
      }
      const savedId = normalized.id;
      resetForm();
      render();
      setNotice(`${savedId} saved successfully.`);
    });

    body.addEventListener("click", async (event) => {
      const downloadId = event.target.closest("[data-download-maintenance]")?.dataset.downloadMaintenance;
      const editId = event.target.closest("[data-edit-maintenance]")?.dataset.editMaintenance;
      const deleteId = event.target.closest("[data-delete-maintenance]")?.dataset.deleteMaintenance;
      const imageId = event.target.closest("[data-view-maintenance-image]")?.dataset.viewMaintenanceImage;
      if (downloadId) {
        const item = store.maintenanceJobs.find((record) => record.id === downloadId);
        if (item) {
          try {
            await createRegisterPdf(
              "Fleet Maintenance Record",
              ["Job No", "Truck No", "Complaint Date", "Repair Date", "Part Name", "Old Serial No", "New Serial No", "Part Cost", "Warranty Period", "Warranty Expiry", "Warranty Status", "Driver Name", "Image", "Approved By"],
              [item.id, item.truckNo, formatShortDate(item.complaintDate), formatShortDate(item.repairDate), item.partName, item.oldSerialNumber, item.newSerialNumber, `PKR ${money(item.partCost)}`, item.warrantyPeriod, formatShortDate(item.warrantyExpiry), getWarrantyState(item.warrantyExpiry).label, item.driverName, item.image ? "Attached" : "-", item.approvedBy],
              `${safePdfFileName(item.truckNo || item.id)}_${safePdfFileName(item.id)}_maintenance`,
              item.image || ""
            );
          } catch (error) {
            setNotice(error.message, true);
          }
        }
        return;
      }
      if (editId) fillForm(store.maintenanceJobs.find((item) => item.id === editId));
      if (imageId) openImageModal(store.maintenanceJobs.find((item) => item.id === imageId)?.image);
      if (deleteId) {
        store.maintenanceJobs = store.maintenanceJobs.filter((item) => item.id !== deleteId);
        saveStore(store);
        if (editingId === deleteId) resetForm();
        render();
        setNotice(`${deleteId} deleted.`);
      }
    });

    truckFilter?.addEventListener("change", render);
    dateOrder?.addEventListener("change", render);
    document.querySelector("[data-reset-maintenance-form]").addEventListener("click", resetForm);
    closeImageModalButton.addEventListener("click", closeImageModal);
    imageModal.addEventListener("click", (event) => { if (event.target === imageModal) closeImageModal(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !imageModal.hidden) closeImageModal(); });
    populateTruckControls();
    resetForm();
    render();
  }

  function employeePage(store) {
    const form = document.querySelector("[data-employee-form]");
    const body = document.querySelector("[data-employee-rows]");
    const notice = document.querySelector("[data-notice]");
    const summary = document.querySelector("[data-employee-summary]");
    const imageInput = document.querySelector("[data-employee-image-input]");
    const imagePreview = document.querySelector("[data-employee-image-preview]");
    const removeImageButton = document.querySelector("[data-remove-employee-image]");
    let editingId = "";
    let employeeImageData = "";
    let employeeImagePromise = Promise.resolve("");

    function setEmployeeImage(image = "") {
      employeeImageData = String(image || "");
      if (removeImageButton) removeImageButton.hidden = !employeeImageData;
      if (imagePreview) {
        imagePreview.hidden = !employeeImageData;
        imagePreview.innerHTML = employeeImageData
          ? `<img src="${employeeImageData}" alt="Selected employee" />`
          : "";
      }
    }

    function updateSummary() {
      const active = store.employees.filter((item) => item.status === "Active").length;
      const inactive = store.employees.filter((item) => item.status === "Inactive").length;
      const payroll = store.employees
        .filter((item) => item.status === "Active")
        .reduce((sum, item) => sum + Number(item.salary || 0), 0);

      summary.innerHTML = `
        <div class="card span-4"><span class="badge good">Active</span><strong>${active}</strong><div class="muted">Current employees</div></div>
        <div class="card span-4"><span class="badge bad">Inactive</span><strong>${inactive}</strong><div class="muted">Offboarded / on hold</div></div>
        <div class="card span-4"><span class="badge warn">Payroll</span><strong>PKR ${money(payroll)}</strong><div class="muted">Monthly active payroll</div></div>
      `;
    }

    function resetForm() {
      form.reset();
      form.elements.joiningDate.value = "2026-06-18";
      form.elements.status.value = "Active";
      form.elements.department.value = "Operations";
      editingId = "";
      form.querySelector("[data-submit-label]").textContent = "Save Employee";
      if (imageInput) imageInput.value = "";
      employeeImagePromise = Promise.resolve("");
      setEmployeeImage("");
    }

    function render() {
      body.innerHTML = store.employees.map((item) => `
        <tr>
          <td>${text(item.id)}</td>
          <td>${text(item.name)}</td>
          <td>${text(item.designation)}</td>
          <td>${text(item.department)}</td>
          <td>${money(item.salary)}</td>
          <td>${text(item.joiningDate)}</td>
          <td>${text(item.phone)}</td>
          <td><div class="employee-status-actions"><span class="badge ${item.status === "Active" ? "good" : "bad"}">${text(item.status)}</span><button class="btn small" type="button" data-download-employee="${item.id}">Download PDF</button></div></td>
          <td>
            <div class="table-actions">
              <button class="btn small" data-edit-employee="${item.id}">Edit</button>
              <button class="btn small danger" data-delete-employee="${item.id}">Delete</button>
            </div>
          </td>
        </tr>
      `).join("");
      updateSummary();
    }

    function fillForm(item) {
      if (!item) return;
      Object.keys(item).forEach((key) => {
        if (form.elements[key]) form.elements[key].value = item[key];
      });
      editingId = item.id;
      setEmployeeImage(item.image || "");
      employeeImagePromise = Promise.resolve(employeeImageData);
      form.querySelector("[data-submit-label]").textContent = "Update Employee";
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    imageInput?.addEventListener("change", () => {
      const file = imageInput.files?.[0];
      if (!file) return;
      employeeImagePromise = compressImageFile(file)
        .then((image) => {
          setEmployeeImage(image);
          return image;
        })
        .catch((error) => {
          imageInput.value = "";
          notice.textContent = error.message;
          return employeeImageData;
        });
    });

    removeImageButton?.addEventListener("click", () => {
      imageInput.value = "";
      employeeImagePromise = Promise.resolve("");
      setEmployeeImage("");
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      await employeeImagePromise;
      const data = Object.fromEntries([...new FormData(form).entries()].filter(([key]) => key !== "employeeImageFile"));
      const normalized = {
        ...data,
        salary: Number(data.salary || 0),
        image: employeeImageData
      };

      if (!editingId) {
        normalized.id = getNextSequentialId(store.employees, "EMP");
        store.employees.unshift(normalized);
        notice.textContent = `Employee ${normalized.id} saved successfully.`;
      } else {
        const index = store.employees.findIndex((item) => item.id === editingId);
        if (index === -1) {
          notice.textContent = "Employee record not found. Please try again.";
          return;
        }
        normalized.id = editingId;
        store.employees[index] = normalized;
        notice.textContent = `Employee ${editingId} updated successfully.`;
      }

      try {
        saveStore(store);
      } catch (error) {
        notice.textContent = "The image is too large for browser storage. Please choose a smaller image.";
        return;
      }
      render();
      resetForm();
    });

    body.addEventListener("click", async (event) => {
      const downloadId = event.target.closest("[data-download-employee]")?.dataset.downloadEmployee;
      const editId = event.target.closest("[data-edit-employee]")?.dataset.editEmployee;
      const deleteId = event.target.closest("[data-delete-employee]")?.dataset.deleteEmployee;
      if (downloadId) {
        const item = store.employees.find((record) => record.id === downloadId);
        if (item) {
          try {
            await createRegisterPdf(
              "Employee Record",
              ["Employee ID", "Name", "Designation", "Department", "Salary", "Joining Date", "Phone", "Status"],
              [item.id, item.name, item.designation, item.department, `PKR ${money(item.salary)}`, formatShortDate(item.joiningDate), item.phone, item.status],
              `${safePdfFileName(item.name || item.id)}_employee_record`,
              item.image || ""
            );
          } catch (error) {
            notice.textContent = error.message;
          }
        }
        return;
      }
      if (editId) fillForm(store.employees.find((item) => item.id === editId));
      if (deleteId) {
        store.employees = store.employees.filter((item) => item.id !== deleteId);
        saveStore(store);
        render();
        notice.textContent = `Employee ${deleteId} deleted successfully.`;
        if (editingId === deleteId) resetForm();
      }
    });

    document.querySelector("[data-reset-form]").addEventListener("click", resetForm);
    render();
    resetForm();
  }

  function adminLoginPage(store) {
    const form = document.querySelector("[data-admin-login-form]");
    const notice = document.querySelector("[data-notice]");
    const passwordField = form.querySelector("[name='password']");
    const passwordToggle = form.querySelector("[data-password-toggle]");
    bindPasswordToggle(passwordField, passwordToggle);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const submitButton = form.querySelector("[type='submit']");
      submitButton.disabled = true;
      notice.hidden = true;

      try {
        const user = await signInWithSupabase(data.email, data.password);
        if (user.role !== "Super Admin") {
          throw new Error("Super Admin access is required.");
        }
        setAdminSession(user);
        recordAuthenticationActivity("SIGN_IN", user);
        navigateWithTransition("admin.html");
      } catch (error) {
        notice.hidden = false;
        notice.textContent = error.message || "Incorrect email or password.";
        submitButton.disabled = false;
      }
    });
  }

  async function adminPage(store) {
    const session = getAdminSession();
    if (!session) {
      navigateWithTransition("admin-login.html", { immediate: true });
      return;
    }

    const form = document.querySelector("[data-admin-form]");
    const body = document.querySelector("[data-admin-rows]");
    const notice = document.querySelector("[data-notice]");
    const summary = document.querySelector("[data-admin-summary]");
    const passwordField = form.querySelector("[name='password']");
    const passwordToggle = form.querySelector("[data-password-toggle]");
    const roleField = form.querySelector("[name='role']");
    const accessCheckboxes = Array.from(form.querySelectorAll("input[name='access']"));
    const logoutButton = document.querySelector("[data-admin-logout]");
    let editingId = "";
    let adminUsers = [];

    function setNotice(message = "") {
      notice.textContent = message;
      notice.hidden = !message;
    }

    function updateSummary() {
      const totalUsers = adminUsers.length;
      const superAdmins = adminUsers.filter((item) => item.role === "Super Admin").length;
      const activeUsers = adminUsers.filter((item) => item.status === "Active").length;

      summary.innerHTML = `
        <div class="card span-4"><span class="badge warn">Super Admin</span><strong>${superAdmins}</strong></div>
        <div class="card span-4"><span class="badge good">Active Users</span><strong>${activeUsers}</strong></div>
        <div class="card span-4"><span class="badge neutral">Total Users</span><strong>${totalUsers}</strong></div>
      `;
    }

    function syncPasswordToggle() {
      const isVisible = passwordField.type === "text";
      passwordToggle.innerHTML = getPasswordToggleIcon(isVisible);
      passwordToggle.setAttribute("aria-label", isVisible ? "Hide password" : "Show password");
      passwordToggle.setAttribute("title", isVisible ? "Hide password" : "Show password");
    }

    function syncAccessState(roleValue) {
      const isSuperAdmin = roleValue === "Super Admin";
      const selected = new Set(isSuperAdmin ? ACCESS_OPTIONS.map((item) => item.value) : []);
      accessCheckboxes.forEach((checkbox) => {
        if (isSuperAdmin) checkbox.checked = selected.has(checkbox.value);
        checkbox.disabled = isSuperAdmin;
      });
    }

    function resetForm() {
      form.reset();
      form.elements.status.value = "Active";
      form.elements.role.value = "Admin";
      accessCheckboxes.forEach((checkbox) => {
        checkbox.checked = DEFAULT_USER_ACCESS.includes(checkbox.value);
        checkbox.disabled = false;
      });
      passwordField.type = "password";
      passwordField.required = true;
      syncPasswordToggle();
      editingId = "";
      form.querySelector("[data-submit-label]").textContent = "Save User";
    }

    function render() {
      body.innerHTML = adminUsers.map((item, index) => {
        const accessLabels = normalizeAdminAccess(item.access, item.role)
          .map((access) => ACCESS_OPTIONS.find((option) => option.value === access)?.label || access);
        const visibleAccess = accessLabels.slice(0, 4);
        return `
        <tr>
          <td><strong class="admin-display-id">ADM-${index + 1}</strong></td>
          <td>${text(item.name)}</td>
          <td class="admin-email-cell">${text(item.email)}</td>
          <td>
            <span class="muted">Managed by Supabase Auth</span>
          </td>
          <td>${text(item.role)}</td>
          <td><span class="badge ${item.status === "Active" ? "good" : "bad"}">${text(item.status)}</span></td>
          <td><div class="admin-access-list" title="${text(accessLabels.join(", "))}">${visibleAccess.map((label) => `<span class="admin-access-chip">${text(label)}</span>`).join("")}${accessLabels.length > visibleAccess.length ? `<span class="admin-access-more">+${accessLabels.length - visibleAccess.length} more</span>` : ""}</div></td>
          <td>
            <div class="table-actions">
              <button class="btn small" data-edit-admin="${item.id}">Edit</button>
              ${item.role === "Super Admin" ? "" : `<button class="btn small danger" data-delete-admin="${item.id}">Delete</button>`}
            </div>
          </td>
        </tr>
      `;
      }).join("");
      updateSummary();
    }

    function fillForm(item) {
      if (!item) return;
      ["name", "email", "password", "role", "status"].forEach((key) => {
        if (form.elements[key]) form.elements[key].value = item[key] || "";
      });
      const selectedAccess = new Set(normalizeAdminAccess(item.access, item.role));
      accessCheckboxes.forEach((checkbox) => {
        checkbox.checked = selectedAccess.has(checkbox.value);
      });
      syncAccessState(item.role);
      passwordField.type = "password";
      passwordField.required = false;
      syncPasswordToggle();
      editingId = item.id;
      form.querySelector("[data-submit-label]").textContent = "Update User";
    }

    passwordToggle.addEventListener("click", () => {
      passwordField.type = passwordField.type === "password" ? "text" : "password";
      syncPasswordToggle();
    });

    roleField.addEventListener("change", () => {
      syncAccessState(roleField.value);
    });

    if (logoutButton) {
      logoutButton.addEventListener("click", () => {
        openSignOutConfirmation();
      });
    }

    async function loadAdminUsers() {
      const client = getSupabaseClient();
      if (!client) throw new Error("Supabase is not configured.");
      const { data, error } = await client
        .from("profiles")
        .select("id,name,email,role,status,access_modules")
        .order("created_at", { ascending: true });
      if (error) throw error;
      adminUsers = (data || []).map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        password: "",
        role: item.role === "super_admin" ? "Super Admin" : "Admin",
        status: item.status === "active" ? "Active" : "Inactive",
        access: item.role === "super_admin"
          ? ACCESS_OPTIONS.map((option) => option.value)
          : item.access_modules || []
      }));
      render();
    }

    async function invokeUserManager(body) {
      const client = getSupabaseClient();
      if (!client) throw new Error("Supabase is not configured.");

      const { data: sessionData, error: sessionError } = await client.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      if (sessionError || !accessToken) {
        throw new Error("Your login session has expired. Please sign in again.");
      }

      const { data: result, error } = await client.functions.invoke("manage-user", {
        body,
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (error) {
        let message = error.message || "Unable to contact the user management service.";
        try {
          const details = await error.context?.json();
          if (details?.error) message = details.error;
        } catch (_) {
          // Keep the original Functions client message when no JSON body is available.
        }
        throw new Error(message);
      }
      if (result?.error) throw new Error(result.error);
      return result;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      const normalized = {
        ...data,
        name: String(data.name || "").trim(),
        email: String(data.email || "").trim(),
        password: String(data.password || "").trim(),
        access: normalizeAdminAccess(formData.getAll("access"), data.role)
      };

      const submitButton = form.querySelector("[type='submit']");
      submitButton.disabled = true;
      try {
        await invokeUserManager({
          action: editingId ? "update" : "create",
          user_id: editingId || undefined,
          name: normalized.name,
          email: normalized.email,
          password: normalized.password,
          role: normalized.role === "Super Admin" ? "super_admin" : "admin",
          status: normalized.status === "Active" ? "active" : "inactive",
          access_modules: normalized.access
        });
        setNotice(`User ${normalized.name} ${editingId ? "updated" : "added"} successfully.`);
        await loadAdminUsers();
        resetForm();
      } catch (error) {
        setNotice(error.message || "Unable to save the Supabase user.");
      } finally {
        submitButton.disabled = false;
      }
    });

    body.addEventListener("click", (event) => {
      const editId = event.target.getAttribute("data-edit-admin");
      const deleteId = event.target.getAttribute("data-delete-admin");
      if (editId) fillForm(adminUsers.find((item) => item.id === editId));
      if (deleteId) {
        (async () => {
          try {
            await invokeUserManager({ action: "delete", user_id: deleteId });
            setNotice("User deleted successfully.");
            await loadAdminUsers();
            if (editingId === deleteId) resetForm();
          } catch (error) {
            setNotice(error.message || "Unable to delete the Supabase user.");
          }
        })();
      }
    });

    document.querySelector("[data-reset-form]").addEventListener("click", resetForm);
    setNotice("");
    try {
      await loadAdminUsers();
    } catch (error) {
      setNotice(error.message || "Unable to load Supabase users.");
    }
    resetForm();
  }

  function activityLogsPage(store) {
    const logs = Array.isArray(store.activityLogs) ? store.activityLogs : [];
    const body = document.querySelector("[data-log-rows]");
    const summary = document.querySelector("[data-log-summary]");
    const count = document.querySelector("[data-log-count]");
    const search = document.querySelector("[data-log-search]");
    const moduleFilter = document.querySelector("[data-log-module]");
    const actionFilter = document.querySelector("[data-log-action]");
    const userFilter = document.querySelector("[data-log-user]");
    const orderFilter = document.querySelector("[data-log-order]");

    function populateFilter(select, values, allLabel) {
      select.innerHTML = `<option value="">${allLabel}</option>${values.map((value) => `<option value="${escapeHtml(value)}">${text(value)}</option>`).join("")}`;
    }

    function formatLogTimestamp(value) {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return "-";
      return new Intl.DateTimeFormat("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }).format(date);
    }

    function actionClass(action) {
      if (action === "CREATE" || action === "SIGN_IN") return "good";
      if (action === "DELETE" || action === "SIGN_OUT") return "bad";
      return "warn";
    }

    function renderSummary() {
      const countAction = (action) => logs.filter((item) => item.action === action).length;
      summary.innerHTML = `
        <div class="audit-stat"><span>Total Events</span><strong>${logs.length}</strong></div>
        <div class="audit-stat"><span>Created</span><strong>${countAction("CREATE")}</strong></div>
        <div class="audit-stat"><span>Updated</span><strong>${countAction("UPDATE")}</strong></div>
        <div class="audit-stat"><span>Deleted</span><strong>${countAction("DELETE")}</strong></div>
        <div class="audit-stat"><span>Active Users</span><strong>${new Set(logs.map((item) => item.userId).filter(Boolean)).size}</strong></div>
      `;
    }

    function render() {
      const query = search.value.trim().toLowerCase();
      const direction = orderFilter.value === "oldest" ? 1 : -1;
      const filtered = logs
        .filter((item) => !moduleFilter.value || item.module === moduleFilter.value)
        .filter((item) => !actionFilter.value || item.action === actionFilter.value)
        .filter((item) => !userFilter.value || item.userId === userFilter.value)
        .filter((item) => !query || [item.userName, item.userEmail, item.module, item.action, item.recordId, item.details]
          .some((value) => String(value || "").toLowerCase().includes(query)))
        .sort((a, b) => direction * (new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));

      count.textContent = `${filtered.length} event(s)`;
      body.innerHTML = filtered.length ? filtered.map((item) => `
        <tr>
          <td class="audit-time">${formatLogTimestamp(item.timestamp)}</td>
          <td><strong>${text(item.userName || "System")}</strong><small>${text(item.userEmail || "-")}</small></td>
          <td>${text(item.userRole || "-")}</td>
          <td>${text(item.module || "-")}</td>
          <td><span class="badge ${actionClass(item.action)}">${text(item.action || "-")}</span></td>
          <td>${text(item.recordId || "-")}</td>
          <td class="audit-details">${text(item.details || "-")}</td>
        </tr>
      `).join("") : `<tr><td colspan="7" class="empty-state">No activity matches the selected filters.</td></tr>`;
    }

    populateFilter(moduleFilter, [...new Set(logs.map((item) => item.module).filter(Boolean))].sort(), "All Modules");
    populateFilter(actionFilter, [...new Set(logs.map((item) => item.action).filter(Boolean))].sort(), "All Actions");
    userFilter.innerHTML = `<option value="">All Users</option>${[...new Map(logs.filter((item) => item.userId).map((item) => [item.userId, item])).values()]
      .sort((a, b) => String(a.userName).localeCompare(String(b.userName)))
      .map((item) => `<option value="${escapeHtml(item.userId)}">${text(item.userName || item.userEmail || item.userId)}</option>`).join("")}`;

    [search, moduleFilter, actionFilter, userFilter, orderFilter].forEach((control) => {
      control.addEventListener(control === search ? "input" : "change", render);
    });
    renderSummary();
    render();
  }

  function khataPage(store) {
    const isPayable = document.body.dataset.page === "accounts-payable";
    const accounts = isPayable ? store.vendorKhatas : store.customerKhatas;
    const partyLabel = isPayable ? "Payee" : "Customer";
    const statementLabel = isPayable ? "PAYABLE STATEMENT" : "RECEIVABLE STATEMENT";
    const debitLabel = isPayable ? "Total Payable" : "Total Debit";
    const creditLabel = isPayable ? "Total Paid" : "Total Credit";
    const balanceLabel = isPayable ? "Outstanding Payable" : "Net Balance";
    const entryPrefix = isPayable ? "PAYE" : "KHT";
    const select = document.querySelector("[data-khata-select]");
    const body = document.querySelector("[data-khata-rows]");
    const summary = document.querySelector("[data-khata-summary]");
    const customerCard = document.querySelector("[data-khata-customer]");
    const customerListBody = document.querySelector("[data-khata-customers]");
    const statementRange = document.querySelector("[data-khata-range]");
    const statementTitle = document.querySelector("[data-khata-title]");
    const form = document.querySelector("[data-khata-form]");
    const customerForm = document.querySelector("[data-customer-form]");
    const notice = document.querySelector("[data-notice]");
    const customerNotice = document.querySelector("[data-customer-notice]");
    const exportNotice = document.querySelector("[data-export-notice]");
    const printButton = document.querySelector("[data-print-statement]");
    const whatsappButton = document.querySelector("[data-whatsapp-statement]");
    const entryImageInput = form.querySelector("[data-entry-image-input]");
    const removeEntryImageButton = form.querySelector("[data-remove-entry-image]");
    const entryImageModal = document.querySelector("[data-entry-image-modal]");
    const entryImageModalImage = document.querySelector("[data-entry-image-modal-image]");
    const closeEntryImageModalButton = document.querySelector("[data-close-entry-image-modal]");
    let editingId = "";
    let editingCustomerId = "";
    let entryImageData = "";
    let entryImagePromise = Promise.resolve("");
    let pendingAccountId = "";
    const allAccountsValue = "__all_accounts__";

    function getVisibleAccounts() {
      return accounts.filter((account) => (account.entries || []).length > 0 || account.id === pendingAccountId);
    }

    function getAggregateAccount() {
      return {
        id: allAccountsValue,
        customer: isPayable ? "All Payees" : "All Customers",
        phone: "-",
        city: "-",
        entries: getVisibleAccounts().flatMap((account) => (account.entries || []).map((entry) => ({
          ...entry,
          sourceAccountId: account.id,
          sourceAccountName: account.customer,
          description: `${account.customer}: ${entry.description || "-"}`
        })))
      };
    }

    function setEntryImage(imageData = "") {
      entryImageData = String(imageData || "");
      removeEntryImageButton.hidden = !entryImageData;
    }

    function compressEntryImage(file) {
      return new Promise((resolve, reject) => {
        if (!file || !String(file.type || "").startsWith("image/")) {
          reject(new Error("Please select a valid image file."));
          return;
        }
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("The image could not be read."));
        reader.onload = () => {
          const image = new Image();
          image.onerror = () => reject(new Error("The image format is not supported."));
          image.onload = () => {
            const maxDimension = 1100;
            const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
            const canvas = document.createElement("canvas");
            canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
            canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
            const context = canvas.getContext("2d");
            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            let quality = 0.74;
            let imageData = canvas.toDataURL("image/jpeg", quality);
            while (imageData.length > 420000 && quality > 0.42) {
              quality -= 0.08;
              imageData = canvas.toDataURL("image/jpeg", quality);
            }
            resolve(imageData);
          };
          image.src = String(reader.result || "");
        };
        reader.readAsDataURL(file);
      });
    }

    function closeEntryImageModal() {
      entryImageModal.hidden = true;
      entryImageModalImage.removeAttribute("src");
      document.body.classList.remove("bilty-modal-open");
    }

    function openEntryImageModal(imageData) {
      if (!imageData) return;
      entryImageModalImage.src = imageData;
      entryImageModal.hidden = false;
      document.body.classList.add("bilty-modal-open");
      closeEntryImageModalButton.focus();
    }

    function getSelectedAccount() {
      if (select.value === allAccountsValue) return getAggregateAccount();
      return accounts.find((item) => item.id === select.value) || getAggregateAccount();
    }

    function getStatementData(account) {
      const totals = calculateKhataSummary(account);
      const sortedEntries = [...account.entries].sort((a, b) => a.date.localeCompare(b.date));
      const startDate = sortedEntries[0]?.date || "";
      const endDate = sortedEntries.length ? getTodayIsoDate() : "";
      let runningBalance = 0;
      const rows = sortedEntries.map((entry) => {
        const amount = Number(entry.amount || 0);
        runningBalance += entry.type === "Debit" ? amount : -amount;
        return {
          date: formatStatementDate(entry.date),
          description: text(entry.description),
          debit: entry.type === "Debit" ? money(entry.amount) : "-",
          credit: entry.type === "Credit" ? money(entry.amount) : "-",
          balance: runningBalance === 0
            ? "0"
            : `${money(Math.abs(runningBalance))} ${runningBalance > 0
              ? (isPayable ? "Outstanding" : "(-)")
              : (isPayable ? "Advance" : "(+)")}`
        };
      });

      return {
        totals,
        rows,
        startDate: formatStatementDate(startDate),
        endDate: formatStatementDate(endDate),
        today: formatStatementDate(getTodayIsoDate())
      };
    }

    async function buildStatementPdfFile(account) {
      if (!window.jspdf || !window.jspdf.jsPDF) {
        throw new Error("The PDF library could not be loaded.");
      }

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF("p", "pt", "a4");
      const statement = getStatementData(account);
      const left = 34;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const contentWidth = pageWidth - (left * 2);
      const brandImage = await loadInvoiceTemplateDataUrl();

      if (brandImage) {
        pdf.addImage(brandImage, "JPEG", 0, 0, pageWidth, pageHeight);
      }

      pdf.setTextColor(24, 48, 77);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.text(account.customer, left, 164);
      pdf.setFontSize(12);
      pdf.text(statementLabel, left, 181);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(75, 75, 75);
      pdf.text(account.phone || "-", left, 197);
      pdf.text(`${statement.startDate} - ${statement.endDate}`, left, 213);

      const statsTop = 245;
      const statWidth = contentWidth / 3;
      pdf.setDrawColor(228, 232, 238);
      pdf.setLineWidth(1);
      pdf.line(left + statWidth, statsTop - 8, left + statWidth, statsTop + 28);
      pdf.line(left + (statWidth * 2), statsTop - 8, left + (statWidth * 2), statsTop + 28);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(85, 85, 85);
      pdf.text(debitLabel, left, statsTop);
      pdf.text(creditLabel, left + statWidth + 18, statsTop);
      pdf.text(balanceLabel, left + (statWidth * 2) + 18, statsTop);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Rs ${money(statement.totals.debit)}`, left, statsTop + 18);
      pdf.text(`Rs ${money(statement.totals.credit)}`, left + statWidth + 18, statsTop + 18);
      pdf.setTextColor(statement.totals.closingBalance > 0 ? 220 : 0, statement.totals.closingBalance > 0 ? 70 : 0, statement.totals.closingBalance > 0 ? 70 : 0);
      pdf.text(`Rs ${money(Math.abs(statement.totals.closingBalance))}`, left + (statWidth * 2) + 18, statsTop + 18);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(255, 82, 82);
      pdf.text(
        statement.totals.closingBalance > 0
          ? (isPayable ? "Outstanding" : "Debit (-)")
          : statement.totals.closingBalance < 0
            ? (isPayable ? "Advance Paid" : "Credit (+)")
            : "-",
        left + (statWidth * 2) + 18,
        statsTop + 34
      );

      pdf.autoTable({
        startY: 288,
        head: [[
          "Date",
          "Description",
          isPayable ? "Payable" : "Debit (-)",
          isPayable ? "Paid" : "Credit (+)",
          isPayable ? "Outstanding" : "Balance"
        ]],
        body: statement.rows.map((row) => [row.date, row.description, row.debit, row.credit, row.balance]),
        styles: {
          fontSize: 9,
          cellPadding: 9,
          lineColor: [230, 234, 239],
          lineWidth: 0.6
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [20, 20, 20],
          fontStyle: "bold",
          halign: "left",
          lineColor: [230, 234, 239]
        },
        bodyStyles: {
          textColor: [31, 41, 55]
        },
        alternateRowStyles: {
          fillColor: [255, 255, 255]
        },
        columnStyles: {
          2: { halign: "right" },
          3: { halign: "right" },
          4: { halign: "right", fillColor: [248, 250, 253] }
        },
        didParseCell(data) {
          if (data.section === "body" && data.column.index === 4) {
            const raw = String(data.cell.raw || "");
            if (raw.includes("(-)") || raw.includes("Outstanding")) data.cell.styles.textColor = [255, 82, 82];
          }
        },
        margin: { left, right: left }
      });

      const finalY = pdf.lastAutoTable.finalY || 330;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(110, 120, 132);
      pdf.text(`Report Generated on ${statement.today}`, left, Math.min(finalY + 28, pageHeight - 70));

      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, pageHeight - 112, pageWidth, 112, "F");
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.8);
      pdf.line(28, pageHeight - 68, pageWidth - 28, pageHeight - 68);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(32, 32, 32);
      pdf.text("Office # 15, Ayub Shopping Center, Keamari, Karachi | 021-328 62660", 36, pageHeight - 48);

      const blob = pdf.output("blob");
      return new File(
        [blob],
        `${account.customer.replace(/[^\w-]+/g, "_")}_${isPayable ? "payable" : "receivable"}.pdf`,
        { type: "application/pdf" }
      );
    }

    async function printStatement(account) {
      try {
        const file = await buildStatementPdfFile(account);
        triggerFileDownload(file);
        exportNotice.textContent = `${account.customer} ${isPayable ? "payable" : "receivable"} PDF downloaded successfully.`;
      } catch (error) {
        exportNotice.textContent = "The PDF could not be generated. Please try again.";
      }
    }

    function triggerFileDownload(file) {
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    }

    async function shareStatementOnWhatsapp(account) {
      const phone = normalizeWhatsappNumber(account.phone);
      const message = encodeURIComponent(`The updated statement for ${account.customer} is ready.`);

      try {
        const file = await buildStatementPdfFile(account);
        if (isMobileDevice() && navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
          await navigator.share({
            files: [file],
            title: `${account.customer} ${isPayable ? "Payable" : "Receivable"} Statement`,
            text: `${account.customer} ${isPayable ? "payable" : "receivable"} statement`
          });
          exportNotice.textContent = "The share sheet is open. Select WhatsApp to send the statement directly.";
          return;
        }

        triggerFileDownload(file);
      } catch (error) {
        // Fallback to chat open below.
      }

      if (phone) {
        const baseUrl = isMobileDevice() ? "https://wa.me/" : "https://web.whatsapp.com/send?phone=";
        const whatsappUrl = isMobileDevice()
          ? `${baseUrl}${phone}?text=${message}`
          : `${baseUrl}${phone}&text=${message}`;
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        exportNotice.textContent = isMobileDevice()
          ? "WhatsApp chat is open. The PDF has been downloaded; attach it and send it."
          : "WhatsApp Web is open and the PDF has been downloaded. Attach the downloaded PDF in the chat and send it.";
      } else {
        exportNotice.textContent = `A valid WhatsApp number was not found for this ${partyLabel.toLowerCase()}.`;
      }
    }

    function populateCustomers(preferredValue = select.value || allAccountsValue) {
      const visibleAccounts = getVisibleAccounts();
      select.innerHTML = `<option value="${allAccountsValue}">${isPayable ? "All Payees" : "All Customers"}</option>${visibleAccounts.map((account) => `
        <option value="${account.id}">${account.customer}</option>
      `).join("")}`;
      select.value = preferredValue === allAccountsValue || visibleAccounts.some((account) => account.id === preferredValue)
        ? preferredValue
        : allAccountsValue;
    }

    function resetCustomerForm() {
      customerForm.reset();
      customerForm.elements.customer.value = "";
      customerForm.elements.phone.value = "";
      customerForm.elements.city.value = "";
      editingCustomerId = "";
      customerForm.querySelector("[data-customer-submit-label]").textContent = `Save ${partyLabel}`;
    }

    function fillCustomerForm(account) {
      if (!account) return;
      customerForm.elements.customer.value = account.customer || "";
      customerForm.elements.phone.value = account.phone || "";
      customerForm.elements.city.value = account.city || "";
      editingCustomerId = account.id;
      customerForm.querySelector("[data-customer-submit-label]").textContent = `Update ${partyLabel}`;
    }

    function renderCustomerList() {
      if (!customerListBody) return;
      customerListBody.innerHTML = getVisibleAccounts().map((account) => {
        const totals = calculateKhataSummary(account);
        return `
          <tr>
            <td>${text(account.customer)}</td>
            <td>${text(account.phone)}</td>
            <td>${text(account.city)}</td>
            <td>${money(totals.debit)}</td>
            <td>${money(totals.credit)}</td>
            <td class="${totals.closingBalance > 0 ? "debit-text" : totals.closingBalance < 0 ? "credit-text" : ""}">${money(Math.abs(totals.closingBalance))}${totals.closingBalance > 0
              ? (isPayable ? " Outstanding" : " (-)")
              : totals.closingBalance < 0
                ? (isPayable ? " Advance Paid" : " (+)")
                : ""}</td>
            <td>${account.entries.length}</td>
            <td>
              <div class="table-actions">
                <button class="btn small" data-open-customer="${account.id}">Open</button>
                <button class="btn small" data-edit-customer="${account.id}">Edit</button>
              </div>
            </td>
          </tr>
        `;
      }).join("");
    }

    function renderAccount(accountId) {
      const isAggregate = accountId === allAccountsValue;
      const account = isAggregate
        ? getAggregateAccount()
        : accounts.find((item) => item.id === accountId) || getAggregateAccount();
      if (!account) return;

      const totals = calculateKhataSummary(account);
      const statement = getStatementData(account);
      const sortedEntries = [...account.entries].sort((a, b) => a.date.localeCompare(b.date));
      statementTitle.textContent = `${account.customer} ${isPayable ? "Payable" : "Receivable"} Statement`;
      statementRange.textContent = `${statement.startDate} - ${statement.endDate}`;
      customerCard.innerHTML = `
        <div class="khata-mini">
          <span class="khata-mini-label">Phone</span>
          <strong class="khata-mini-value">${text(account.phone)}</strong>
        </div>
        <div class="khata-mini">
          <span class="khata-mini-label">City</span>
          <strong class="khata-mini-value">${text(account.city)}</strong>
        </div>
      `;

      summary.innerHTML = `
        <div class="statement-stat">
          <span>${debitLabel}</span>
          <strong>Rs ${money(totals.debit)}</strong>
        </div>
        <div class="statement-stat">
          <span>${creditLabel}</span>
          <strong>Rs ${money(totals.credit)}</strong>
        </div>
        <div class="statement-stat ${totals.closingBalance > 0 ? "negative" : totals.closingBalance < 0 ? "positive" : ""}">
          <span>${balanceLabel}</span>
          <strong>Rs ${money(Math.abs(totals.closingBalance))}</strong>
          <small>${totals.hasEntries
            ? (totals.closingBalance > 0
              ? (isPayable ? "Outstanding" : "Debit (-)")
              : totals.closingBalance < 0
                ? (isPayable ? "Advance Paid" : "Credit (+)")
                : "Settled")
            : "-"}</small>
        </div>
      `;

      let runningBalance = 0;
      body.innerHTML = sortedEntries.map((entry) => {
        const amount = Number(entry.amount || 0);
        runningBalance += entry.type === "Debit" ? amount : -amount;
        return `
          <tr>
            <td>${formatStatementDate(entry.date)}</td>
            <td>${text(entry.description)}</td>
            <td>${entry.image && !isAggregate ? `
              <button class="bilty-thumbnail" type="button" data-view-khata-image="${escapeHtml(entry.id)}" aria-label="View entry image" title="View image">
                <img src="${escapeHtml(entry.image)}" alt="Entry attachment thumbnail" />
              </button>
            ` : entry.image ? '<span class="muted">Attached</span>' : "-"}</td>
            <td class="amount-cell debit-text">${entry.type === "Debit" ? money(entry.amount) : "-"}</td>
            <td class="amount-cell credit-text">${entry.type === "Credit" ? money(entry.amount) : "-"}</td>
            <td class="amount-cell ${runningBalance > 0 ? "debit-text" : runningBalance < 0 ? "credit-text" : ""}">${runningBalance === 0
              ? "0"
              : `${money(Math.abs(runningBalance))} ${runningBalance > 0
                ? (isPayable ? "Outstanding" : "(-)")
                : (isPayable ? "Advance" : "(+)")}`}</td>
            <td>
              <div class="table-actions">
                ${isAggregate ? "-" : `<button class="btn small" data-edit-khata="${entry.id}">Edit</button><button class="btn small danger" data-delete-khata="${entry.id}">Delete</button>`}
              </div>
            </td>
          </tr>
        `;
      }).join("");

      form.elements.accountId.value = isAggregate ? "" : account.id;
      Array.from(form.elements).forEach((control) => {
        if (control.name !== "accountId") control.disabled = isAggregate;
      });
      select.value = account.id;
      renderCustomerList();
    }

    function resetForm() {
      const isAggregate = select.value === allAccountsValue;
      form.elements.accountId.value = isAggregate ? "" : select.value;
      form.elements.date.value = "";
      form.elements.type.value = "";
      form.elements.description.value = "";
      form.elements.amount.value = "";
      entryImageInput.value = "";
      entryImagePromise = Promise.resolve("");
      setEntryImage("");
      editingId = "";
      form.querySelector("[data-submit-label]").textContent = "Save Entry";
      Array.from(form.elements).forEach((control) => {
        if (control.name !== "accountId") control.disabled = isAggregate;
      });
    }

    function fillForm(account, entry) {
      if (!entry) return;
      form.elements.accountId.value = account.id;
      form.elements.date.value = entry.date;
      form.elements.type.value = entry.type;
      form.elements.description.value = entry.description;
      form.elements.amount.value = entry.amount;
      entryImageInput.value = "";
      entryImagePromise = Promise.resolve(entry.image || "");
      setEntryImage(entry.image);
      editingId = entry.id;
      form.querySelector("[data-submit-label]").textContent = "Update Entry";
    }

    select.addEventListener("change", () => {
      renderAccount(select.value);
      resetForm();
    });

    customerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(customerForm).entries());
      const normalized = {
        id: editingCustomerId,
        customer: data.customer.trim(),
        phone: data.phone.trim(),
        city: data.city.trim(),
        openingBalance: 0,
        entries: []
      };

      if (!normalized.customer) {
        customerNotice.textContent = `${partyLabel} name is required.`;
        return;
      }

      if (!editingCustomerId) {
        normalized.id = getNextSequentialId(accounts, isPayable ? "PAY" : "CUS");
        accounts.unshift(normalized);
        pendingAccountId = normalized.id;
        customerNotice.textContent = `${partyLabel} ${normalized.customer} was added successfully.`;
      } else {
        const index = accounts.findIndex((item) => item.id === editingCustomerId);
        if (index === -1) {
          customerNotice.textContent = `${partyLabel} record not found.`;
          return;
        }
        normalized.id = editingCustomerId;
        normalized.entries = accounts[index].entries || [];
        accounts[index] = normalized;
        customerNotice.textContent = `${partyLabel} ${normalized.customer} updated successfully.`;
      }

      saveStore(store);
      populateCustomers(normalized.id);
      renderAccount(normalized.id);
      resetCustomerForm();
    });

    entryImageInput.addEventListener("change", () => {
      const file = entryImageInput.files && entryImageInput.files[0];
      if (!file) return;
      entryImageInput.disabled = true;
      entryImagePromise = compressEntryImage(file)
        .then((imageData) => {
          setEntryImage(imageData);
          return imageData;
        })
        .catch((error) => {
          entryImageInput.value = "";
          setEntryImage("");
          notice.textContent = error.message;
          return "";
        })
        .finally(() => {
          entryImageInput.disabled = false;
        });
    });

    removeEntryImageButton.addEventListener("click", () => {
      entryImageInput.value = "";
      entryImagePromise = Promise.resolve("");
      setEntryImage("");
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      await entryImagePromise;
      const data = Object.fromEntries(new FormData(form).entries());
      const account = accounts.find((item) => item.id === data.accountId);
      if (!account) return;

      const normalized = {
        id: editingId,
        date: data.date,
        type: data.type,
        description: data.description,
        image: entryImageData,
        amount: Number(data.amount || 0)
      };

      if (!editingId) {
        const allEntries = accounts.flatMap((item) => Array.isArray(item.entries) ? item.entries : []);
        normalized.id = getNextSequentialId(allEntries, entryPrefix);
        account.entries.unshift(normalized);
        pendingAccountId = "";
        notice.textContent = `Statement entry ${normalized.id} saved successfully.`;
      } else {
        const index = account.entries.findIndex((entry) => entry.id === editingId);
        if (index === -1) {
          notice.textContent = "Entry not found. Please try again.";
          return;
        }
        account.entries[index] = normalized;
        notice.textContent = `Statement entry ${editingId} updated successfully.`;
      }

      saveStore(store);
      populateCustomers(account.id);
      renderAccount(account.id);
      resetForm();
    });

    body.addEventListener("click", (event) => {
      const imageTrigger = event.target.closest("[data-view-khata-image]");
      const editId = event.target.getAttribute("data-edit-khata");
      const deleteId = event.target.getAttribute("data-delete-khata");
      const account = accounts.find((item) => item.id === select.value);
      if (!account) return;

      if (imageTrigger) {
        const entry = account.entries.find((item) => item.id === imageTrigger.getAttribute("data-view-khata-image"));
        if (entry?.image) openEntryImageModal(entry.image);
        return;
      }
      if (editId) fillForm(account, account.entries.find((entry) => entry.id === editId));
      if (deleteId) {
        account.entries = account.entries.filter((entry) => entry.id !== deleteId);
        saveStore(store);
        if (!account.entries.length) {
          pendingAccountId = "";
          populateCustomers(allAccountsValue);
          renderAccount(allAccountsValue);
        } else {
          populateCustomers(account.id);
          renderAccount(account.id);
        }
        notice.textContent = `Statement entry ${deleteId} deleted successfully.`;
        if (editingId === deleteId) resetForm();
      }
    });

    if (customerListBody) {
      customerListBody.addEventListener("click", (event) => {
        const openId = event.target.getAttribute("data-open-customer");
        const editCustomerId = event.target.getAttribute("data-edit-customer");
        if (openId) {
          renderAccount(openId);
          resetForm();
        }
        if (editCustomerId) {
          fillCustomerForm(accounts.find((item) => item.id === editCustomerId));
        }
      });
    }

    document.querySelector("[data-reset-form]").addEventListener("click", resetForm);
    document.querySelector("[data-reset-customer-form]").addEventListener("click", resetCustomerForm);
    printButton.addEventListener("click", () => {
      const account = getSelectedAccount();
      if (account) printStatement(account);
    });
    whatsappButton.addEventListener("click", () => {
      const account = getSelectedAccount();
      if (account) shareStatementOnWhatsapp(account);
    });
    closeEntryImageModalButton.addEventListener("click", closeEntryImageModal);
    entryImageModal.addEventListener("click", (event) => {
      if (event.target === entryImageModal) closeEntryImageModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !entryImageModal.hidden) closeEntryImageModal();
    });
    populateCustomers(allAccountsValue);
    renderAccount(allAccountsValue);
    resetForm();
    resetCustomerForm();
  }

  function enhanceFileInputs(root = document) {
    root.querySelectorAll('input[type="file"]:not([data-upload-enhanced])').forEach((input) => {
      input.dataset.uploadEnhanced = "true";
      const wrapper = document.createElement("div");
      wrapper.className = "file-upload-control";
      const visual = document.createElement("div");
      visual.className = "file-upload-visual";
      visual.setAttribute("aria-hidden", "true");
      visual.innerHTML = `
        <span class="file-upload-icon">&#8593;</span>
        <span class="file-upload-action">Select File</span>
        <span class="file-upload-name">No file selected</span>
      `;
      input.parentNode.insertBefore(wrapper, input);
      wrapper.append(input, visual);

      const syncFileName = () => {
        const file = input.files?.[0];
        wrapper.classList.toggle("has-file", Boolean(file));
        visual.querySelector(".file-upload-name").textContent = file?.name || "No file selected";
      };
      input.addEventListener("change", syncFileName);
      wrapper._syncFileName = syncFileName;
      syncFileName();
    });
  }

  function refreshFileInputs() {
    document.querySelectorAll(".file-upload-control").forEach((wrapper) => wrapper._syncFileName?.());
  }

  document.addEventListener("reset", () => setTimeout(refreshFileInputs));
  document.addEventListener("click", (event) => {
    if (event.target.closest('[data-remove-equipment-document], [data-remove-maintenance-image], [data-remove-employee-image], [data-clear-bilty], [data-remove-entry-image], [data-remove-truck-image]')) {
      setTimeout(refreshFileInputs);
    }
  });

  document.addEventListener("DOMContentLoaded", async () => {
    const store = loadStore();
    const page = document.body.dataset.page;
    if (!await enforceSoftwareAccess(page)) return;
    bindPageTransitions();
    syncAdminNavigationRoute();
    ensureEquipmentNavigation();
    ensureMaintenanceNavigation();
    ensureAccountsNavigationOrder();
    ensureActivityLogsNavigation();
    applySessionAccess();
    setActiveNav();
    bindMobileNav();
    if (page !== "signin") bindSoftwareSignOut();
    bindDesktopSidebar();
    if (page === "signin") softwareLoginPage(store);
    if (page === "dashboard") dashboardPage(store);
    if (page === "booking") bookingPage(store);
    if (page === "ledger") ledgerPage(store);
    if (page === "truck") truckPage(store);
    if (page === "truck-summary" || page === "completed-truck-summary") truckSummaryPage(store);
    if (page === "equipment") equipmentPage(store);
    if (page === "maintenance") maintenancePage(store);
    if (page === "employee") employeePage(store);
    if (page === "admin-login") adminLoginPage(store);
    if (page === "admin") adminPage(store);
    if (page === "activity-logs") activityLogsPage(store);
    if (page === "khata" || page === "accounts-payable") khataPage(store);
    enhanceFileInputs();
    markPageReady();
  });
})();
