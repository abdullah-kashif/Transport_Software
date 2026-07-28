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
    { value: "employee", label: "Employees" },
    { value: "khata", label: "Accounts Receivable" },
    { value: "accounts-payable", label: "Accounts Payable" },
    { value: "admin", label: "Admin" }
  ];
  const DEFAULT_USER_ACCESS = ACCESS_OPTIONS.map((item) => item.value).filter((item) => item !== "admin");

  const seed = {
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

  function loadStore() {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) {
      sessionStorage.setItem(KEY, JSON.stringify(seed));
      return structuredClone(seed);
    }
    const parsed = JSON.parse(raw);
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

    saveStore(store);
    return store;
  }

  function saveStore(store) {
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
    return;
  }

  function clearAdminSession() {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
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
    if (getAdminSession()) {
      navigateWithTransition(getPageFile("dashboard"), { immediate: true });
      return;
    }

    const form = document.querySelector("[data-software-login-form]");
    const notice = document.querySelector("[data-notice]");
    const passwordField = form.querySelector("[name='password']");
    const passwordToggle = form.querySelector("[data-password-toggle]");

    bindPasswordToggle(passwordField, passwordToggle);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const user = authenticateSoftwareUser(store, data.email, data.password);
      if (!user) {
        notice.hidden = false;
        notice.textContent = "Incorrect email or password.";
        return;
      }

      setAdminSession(user);
      const firstPage = normalizeAdminAccess(user.access, user.role)[0] || "dashboard";
      navigateWithTransition(getPageFile(firstPage));
    });
  }

  function enforceSoftwareAccess(page) {
    const publicPages = new Set(["signin", "admin-login"]);
    const session = getAdminSession();
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
      modal.querySelector("[data-confirm-signout]").addEventListener("click", () => {
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

    return `Job-${String(highestJobNumber + 1).padStart(2, "0")}`;
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

  function getNavigationIcon(page) {
    const icons = {
      dashboard: '<path d="M3 11.5 12 4l9 7.5"></path><path d="M5 10v10h14V10"></path><path d="M9 20v-6h6v6"></path>',
      booking: '<path d="M6 3v3M18 3v3"></path><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M3 9h18M8 13h3M8 17h6"></path>',
      ledger: '<path d="M6 2h9l4 4v16H6z"></path><path d="M14 2v5h5M9 12h6M9 16h6"></path>',
      truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z"></path><circle cx="7" cy="18" r="2"></circle><circle cx="18" cy="18" r="2"></circle>',
      "truck-summary": '<path d="M4 19V9M10 19V5M16 19v-7M22 19H2"></path>',
      "completed-truck-summary": '<circle cx="12" cy="12" r="9"></circle><path d="m8 12 2.5 2.5L16 9"></path>',
      equipment: '<path d="M4 14h11v5H4zM15 11h4l2 3v5h-6z"></path><path d="M7 14V8h6M13 8l3-3M3 19h19"></path><circle cx="8" cy="20" r="1.5"></circle><circle cx="18" cy="20" r="1.5"></circle>',
      employee: '<circle cx="12" cy="8" r="4"></circle><path d="M4 21c.8-4.2 3.5-6 8-6s7.2 1.8 8 6"></path>',
      khata: '<path d="M4 4h16v16H4z"></path><path d="M8 8h8M8 12h8M8 16h5"></path>',
      "accounts-payable": '<path d="M3 7h18v12H3z"></path><path d="M3 10h18M7 15h4"></path><path d="m16 14 2 2 3-4"></path>',
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

  function dashboardPage(store) {
    const activeTrips = store.bookings.filter((b) => b.status === "In Transit").length;
    const pendingBills = store.bookings.filter((b) => String(b.accountFlow || "").trim() === "Awaited").length;
    const delivered = store.bookings.filter((b) => b.status === "Delivered").length;
    const activeEmployees = store.employees.filter((employee) => employee.status === "Active").length;
    const totalReceipts = store.ledgerEntries.reduce((sum, item) => sum + Number(item.receivedAmount || 0), 0);

    document.querySelector("[data-kpi='activeTrips']").textContent = activeTrips;
    document.querySelector("[data-kpi='pendingBills']").textContent = pendingBills;
    document.querySelector("[data-kpi='delivered']").textContent = delivered;
    document.querySelector("[data-kpi='employees']").textContent = activeEmployees;
    document.querySelector("[data-kpi='receipts']").textContent = money(totalReceipts);

    const bookingsBody = document.querySelector("[data-bookings-preview]");
    bookingsBody.innerHTML = store.bookings.map((item) => `
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
      const bookings = (selectedCustomer
        ? store.bookings.filter((item) => String(item.customer || "").trim() === selectedCustomer)
        : [...store.bookings])
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
        if (item) fillForm(item);
      }
      if (deleteId) {
        store.bookings = store.bookings.filter((entry) => entry.id !== deleteId);
        saveStore(store);
        render();
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

    const safeJobNo = String(trip.jobNo || "truck").replace(/[^\w-]+/g, "_");
    pdf.save(`${safeJobNo}_${isImport ? "import" : "export"}_invoice.pdf`);
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
    if (!body || !form) return;
    let editingId = "";

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
      return `Job-${String(highestJobNumber + 1).padStart(2, "0")}`;
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
      editingId = "";
      form.querySelector("[data-submit-label]").textContent = "Save Trip";
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
      editingId = item.id;
      form.querySelector("[data-submit-label]").textContent = "Update Trip";
    }

    ["mtyBoxFreight", "importFreight", "importBrokerCommission", "exportFreight", "exportBrokerCommission", "roundTripExpense"].forEach((name) => {
      form.elements[name].addEventListener("input", calculateTrip);
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      calculateTrip();
      const calculatedData = Object.fromEntries(new FormData(form).entries());
      const normalized = { ...calculatedData };
      numberFields.forEach((name) => { normalized[name] = Number(calculatedData[name] || 0); });
      if (!editingId) {
        normalized.jobNo = getNextTruckJobNo();
        normalized.id = `TRIP-${Date.now().toString().slice(-6)}`;
        store.truckExpenses.unshift(normalized);
        notice.textContent = `Truck trip ${normalized.jobNo} saved successfully.`;
      } else {
        const index = store.truckExpenses.findIndex((item) => item.id === editingId);
        normalized.jobNo = store.truckExpenses[index]?.jobNo || getNextTruckJobNo();
        normalized.id = editingId;
        store.truckExpenses[index] = normalized;
        notice.textContent = `Truck trip ${normalized.jobNo} updated successfully.`;
      }
      saveStore(store);
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
    let editingId = "";
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
      const completeFiles = rows.filter((item) => String(item.originalDocs || "").trim()).length;

      summary.innerHTML = `
        <div class="card span-3"><span class="badge">Fleet</span><strong>${rows.length}</strong><div class="muted">Registered equipment</div></div>
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
          <td class="equipment-docs">${text(item.originalDocs || "-")}</td>
          <td>
            <div class="table-actions">
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
      form.querySelector("[data-submit-label]").textContent = "Save Equipment";
    }

    function fillForm(item) {
      if (!item) return;
      Object.keys(item).forEach((key) => {
        if (form.elements[key]) form.elements[key].value = item[key] || "";
      });
      editingId = item.id;
      form.querySelector("[data-submit-label]").textContent = "Update Equipment";
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const normalized = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, String(value || "").trim()])
      );

      if (!editingId) {
        const nextNumber = store.equipmentFleet.reduce((max, item) => {
          const current = Number(String(item.id || "").replace(/\D/g, "")) || 0;
          return Math.max(max, current);
        }, 0) + 1;
        normalized.id = `EQP-${String(nextNumber).padStart(3, "0")}`;
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

    body.addEventListener("click", (event) => {
      const editId = event.target.getAttribute("data-edit-equipment");
      const deleteId = event.target.getAttribute("data-delete-equipment");
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

  function employeePage(store) {
    const form = document.querySelector("[data-employee-form]");
    const body = document.querySelector("[data-employee-rows]");
    const notice = document.querySelector("[data-notice]");
    const summary = document.querySelector("[data-employee-summary]");
    let editingId = "";

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
          <td><span class="badge ${item.status === "Active" ? "good" : "bad"}">${text(item.status)}</span></td>
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
      form.querySelector("[data-submit-label]").textContent = "Update Employee";
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const normalized = {
        ...data,
        salary: Number(data.salary || 0)
      };

      if (!editingId) {
        const nextNumber = store.employees.reduce((max, item) => {
          const current = Number(String(item.id).replace("EMP-", "")) || 0;
          return Math.max(max, current);
        }, 1000) + 1;
        normalized.id = `EMP-${nextNumber}`;
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

      saveStore(store);
      render();
      resetForm();
    });

    body.addEventListener("click", (event) => {
      const editId = event.target.getAttribute("data-edit-employee");
      const deleteId = event.target.getAttribute("data-delete-employee");
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
    if (getAdminSession()) {
      navigateWithTransition("admin.html", { immediate: true });
      return;
    }

    const form = document.querySelector("[data-admin-login-form]");
    const notice = document.querySelector("[data-notice]");
    const passwordField = form.querySelector("[name='password']");
    const passwordToggle = form.querySelector("[data-password-toggle]");
    bindPasswordToggle(passwordField, passwordToggle);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const user = authenticateSoftwareUser(store, data.email, data.password);

      if (!user) {
        notice.hidden = false;
        notice.textContent = "Incorrect email or password.";
        return;
      }

      setAdminSession(user);
      navigateWithTransition("admin.html");
    });
  }

  function adminPage(store) {
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
    const visiblePasswords = new Set();

    function setNotice(message = "") {
      notice.textContent = message;
      notice.hidden = !message;
    }

    function updateSummary() {
      const totalUsers = store.adminUsers.length;
      const superAdmins = store.adminUsers.filter((item) => item.role === "Super Admin").length;
      const activeUsers = store.adminUsers.filter((item) => item.status === "Active").length;

      summary.innerHTML = `
        <div class="card span-4"><span class="badge warn">Super Admin</span><strong>${superAdmins}</strong></div>
        <div class="card span-4"><span class="badge good">Active Users</span><strong>${activeUsers}</strong></div>
        <div class="card span-4"><span class="badge">Total Users</span><strong>${totalUsers}</strong></div>
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
      syncPasswordToggle();
      editingId = "";
      form.querySelector("[data-submit-label]").textContent = "Save User";
    }

    function render() {
      body.innerHTML = store.adminUsers.map((item) => `
        <tr>
          <td>${text(item.id)}</td>
          <td>${text(item.name)}</td>
          <td>${text(item.email)}</td>
          <td>
            ${item.role === "Super Admin" ? `<span class="muted">-</span>` : `
              <div class="password-display">
                <span>${visiblePasswords.has(item.id) ? text(item.password) : "........"}</span>
                <button class="password-toggle inline" type="button" data-toggle-admin-password="${item.id}" aria-label="${visiblePasswords.has(item.id) ? "Hide password" : "Show password"}" title="${visiblePasswords.has(item.id) ? "Hide password" : "Show password"}">
                  ${getPasswordToggleIcon(visiblePasswords.has(item.id))}
                </button>
              </div>
            `}
          </td>
          <td>${text(item.role)}</td>
          <td><span class="badge ${item.status === "Active" ? "good" : "bad"}">${text(item.status)}</span></td>
          <td>${normalizeAdminAccess(item.access, item.role).map((access) => `<span class="badge">${text(ACCESS_OPTIONS.find((option) => option.value === access)?.label || access)}</span>`).join(" ")}</td>
          <td>
            <div class="table-actions">
              <button class="btn small" data-edit-admin="${item.id}">Edit</button>
              ${item.role === "Super Admin" ? "" : `<button class="btn small danger" data-delete-admin="${item.id}">Delete</button>`}
            </div>
          </td>
        </tr>
      `).join("");
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

    form.addEventListener("submit", (event) => {
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

      if (!editingId) {
        const nextNumber = store.adminUsers.reduce((max, item) => {
          const current = Number(String(item.id).replace("ADM-", "")) || 0;
          return Math.max(max, current);
        }, 1000) + 1;
        normalized.id = `ADM-${nextNumber}`;
        store.adminUsers.unshift(normalized);
        setNotice(`User ${normalized.name} was added successfully.`);
      } else {
        const index = store.adminUsers.findIndex((item) => item.id === editingId);
        if (index === -1) {
          setNotice("User record not found. Please try again.");
          return;
        }
        normalized.id = editingId;
        store.adminUsers[index] = normalized;
        setNotice(`User ${normalized.name} updated successfully.`);
      }

      saveStore(store);
      render();
      resetForm();
    });

    body.addEventListener("click", (event) => {
      const editId = event.target.getAttribute("data-edit-admin");
      const deleteId = event.target.getAttribute("data-delete-admin");
      const togglePasswordButton = event.target.closest("[data-toggle-admin-password]");
      const toggleId = togglePasswordButton?.getAttribute("data-toggle-admin-password");

      if (editId) fillForm(store.adminUsers.find((item) => item.id === editId));
      if (toggleId) {
        if (visiblePasswords.has(toggleId)) visiblePasswords.delete(toggleId);
        else visiblePasswords.add(toggleId);
        render();
        return;
      }
      if (deleteId) {
        store.adminUsers = store.adminUsers.filter((item) => item.id !== deleteId);
        saveStore(store);
        render();
        setNotice(`User ${deleteId} deleted successfully.`);
        if (editingId === deleteId) resetForm();
      }
    });

    document.querySelector("[data-reset-form]").addEventListener("click", resetForm);
    setNotice("");
    render();
    resetForm();
  }

  function khataPage(store) {
    const isPayable = document.body.dataset.page === "accounts-payable";
    const accounts = isPayable ? store.vendorKhatas : store.customerKhatas;
    const partyLabel = isPayable ? "Payee" : "Customer";
    const statementLabel = isPayable ? "PAYABLE STATEMENT" : "CUSTOMER STATEMENT";
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
    let editingId = "";
    let editingCustomerId = "";

    function getSelectedAccount() {
      return accounts.find((item) => item.id === select.value) || accounts[0];
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
      pdf.setFontSize(17);
      pdf.text(statementLabel, pageWidth - left, 154, { align: "right" });

      pdf.setFontSize(18);
      pdf.text(`${account.customer} ${isPayable ? "Payable" : "Receivable"} Statement`, left, 170);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(75, 75, 75);
      pdf.text(account.phone || "-", left, 188);
      pdf.text(`${statement.startDate} - ${statement.endDate}`, left, 204);

      const statsTop = 236;
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

    function populateCustomers() {
      select.innerHTML = accounts.map((account) => `
        <option value="${account.id}">${account.customer}</option>
      `).join("");
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
      customerListBody.innerHTML = accounts.map((account) => {
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
      const account = accounts.find((item) => item.id === accountId) || accounts[0];
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
            <td class="amount-cell debit-text">${entry.type === "Debit" ? money(entry.amount) : "-"}</td>
            <td class="amount-cell credit-text">${entry.type === "Credit" ? money(entry.amount) : "-"}</td>
            <td class="amount-cell ${runningBalance > 0 ? "debit-text" : runningBalance < 0 ? "credit-text" : ""}">${runningBalance === 0
              ? "0"
              : `${money(Math.abs(runningBalance))} ${runningBalance > 0
                ? (isPayable ? "Outstanding" : "(-)")
                : (isPayable ? "Advance" : "(+)")}`}</td>
            <td>
              <div class="table-actions">
                <button class="btn small" data-edit-khata="${entry.id}">Edit</button>
                <button class="btn small danger" data-delete-khata="${entry.id}">Delete</button>
              </div>
            </td>
          </tr>
        `;
      }).join("");

      form.elements.accountId.value = account.id;
      select.value = account.id;
      renderCustomerList();
    }

    function resetForm() {
      form.elements.accountId.value = select.value;
      form.elements.date.value = "";
      form.elements.type.value = "";
      form.elements.description.value = "";
      form.elements.amount.value = "";
      editingId = "";
      form.querySelector("[data-submit-label]").textContent = "Save Entry";
    }

    function fillForm(account, entry) {
      if (!entry) return;
      form.elements.accountId.value = account.id;
      form.elements.date.value = entry.date;
      form.elements.type.value = entry.type;
      form.elements.description.value = entry.description;
      form.elements.amount.value = entry.amount;
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
        normalized.id = `${isPayable ? "PAY" : "CUS"}-${Date.now().toString().slice(-6)}`;
        accounts.unshift(normalized);
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
      populateCustomers();
      renderAccount(normalized.id);
      resetCustomerForm();
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const account = accounts.find((item) => item.id === data.accountId);
      if (!account) return;

      const normalized = {
        id: editingId,
        date: data.date,
        type: data.type,
        description: data.description,
        amount: Number(data.amount || 0)
      };

      if (!editingId) {
        normalized.id = `${entryPrefix}-${Date.now().toString().slice(-6)}`;
        account.entries.unshift(normalized);
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
      renderAccount(account.id);
      resetForm();
    });

    body.addEventListener("click", (event) => {
      const editId = event.target.getAttribute("data-edit-khata");
      const deleteId = event.target.getAttribute("data-delete-khata");
      const account = accounts.find((item) => item.id === select.value);
      if (!account) return;

      if (editId) fillForm(account, account.entries.find((entry) => entry.id === editId));
      if (deleteId) {
        account.entries = account.entries.filter((entry) => entry.id !== deleteId);
        saveStore(store);
        renderAccount(account.id);
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
    populateCustomers();
    renderAccount(accounts[0]?.id);
    resetForm();
    resetCustomerForm();
  }

  document.addEventListener("DOMContentLoaded", () => {
    const store = loadStore();
    const page = document.body.dataset.page;
    if (!enforceSoftwareAccess(page)) return;
    bindPageTransitions();
    ensureEquipmentNavigation();
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
    if (page === "employee") employeePage(store);
    if (page === "admin-login") adminLoginPage(store);
    if (page === "admin") adminPage(store);
    if (page === "khata" || page === "accounts-payable") khataPage(store);
    markPageReady();
  });
})();
