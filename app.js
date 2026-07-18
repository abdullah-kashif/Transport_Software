(function () {
  const KEY = "gtls-transport-demo-data-v1";
  const ADMIN_AUTH_KEY = "gtls-admin-auth-v1";
  const ACCESS_OPTIONS = [
    { value: "dashboard", label: "Dashboard" },
    { value: "booking", label: "Booking Form" },
    { value: "ledger", label: "Booking Summary" },
    { value: "truck", label: "Truck Details" },
    { value: "truck-summary", label: "Truck Summary" },
    { value: "employee", label: "Employees" },
    { value: "khata", label: "Khata Page" },
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

    if (!Array.isArray(store.employees)) {
      store.employees = structuredClone(seed.employees);
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

    const normalized = [...new Set(values
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
      clearAdminSession();
      navigateWithTransition("index.html");
    });
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
    const taxableBase = roundAmount(roadHaulageCharges);
    const salesTaxAmount = shouldApplySalesTax(authority) ? roundAmount(taxableBase * 0.15) : 0;
    const totalAmount = roundAmount(taxableBase + salesTaxAmount);
    const incomeTaxAmount = roundAmount(totalAmount * 0.07);
    const salesTaxWithheldAmount = roundAmount(salesTaxAmount * 0.20);
    const salesTaxByUsAmount = roundAmount(salesTaxAmount * 0.80);
    const receivableAmount = roundAmount(totalAmount - incomeTaxAmount - salesTaxWithheldAmount + detentionCharges);

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
    const containerText = lines.map((line) => text(line.containerNo)).join(", ") || "-";
    const sizeText = lines.map((line) => text(line.size)).join(", ") || "-";
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
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    pdf.setTextColor(32, 32, 32);
    pdf.text(`M/s ${customerName.toUpperCase()}`, left, 204);
    pdf.text(consigneeText, left, 222);
    pdf.text(`NTN NO : ${text(booking.gatePass || "-")}`, left, 240);
    pdf.text(`Date: ${formatShortDate(booking.date)}`, right, 222, { align: "right" });
    pdf.text(`NTN No : ${text(booking.gatePass || "-")}`, right, 240, { align: "right" });

    pdf.autoTable({
      startY: 274,
      theme: "grid",
      margin: { left, right: pageWidth - 356 },
      tableWidth: 320,
      body: [
        ["Booking No", text(booking.bookingNo || booking.id)],
        ["Invoice No", text(booking.invoiceNo || booking.id)],
        ["BL No", text(booking.blNo)],
        ["Container No", sizeText],
        ["Description", descriptionText],
        ["Consignee", customerName],
        ["Destination", text(booking.destination)],
        ["Category", text(booking.category)]
      ],
      styles: {
        fontSize: 10,
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
    pdf.rect(18, pageHeight - 112, pageWidth - 36, 86, "F");
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.8);
    pdf.line(28, pageHeight - 68, pageWidth - 28, pageHeight - 68);
    pdf.text("Office # 15, Ayub Shopping Center, Keemari, Karachi", pageWidth / 2, pageHeight - 48, { align: "center" });

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
      pdf.addImage(letterheadHeader, "JPEG", 20, 10, pageWidth - 40, 126);
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
      head: [["S.No", "Date", "Booking No", "Customer", "Container", "NTN", "Road Haulage Charges", "15% Sales Tax", "Total Amount", "Remarks"]],
      body: bookings.map((item, index) => {
        const tax = calculateBookingTaxBreakdown(item.rate, item.detention, item.salesTaxAuthority);
        return [
        String(index + 1),
        formatShortDate(item.date),
        text(item.bookingNo || item.id),
        text(item.customer || customer || "-"),
        formatContainerSizeSummary(item),
        text(item.gatePass || "-"),
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
        3: { cellWidth: 92 },
        4: { cellWidth: 58 },
        5: { cellWidth: 62 },
        6: { cellWidth: 88 },
        7: { cellWidth: 72 },
        8: { cellWidth: 78 },
        9: { cellWidth: 116 }
      }
    });
    pdf.setFillColor(255, 255, 255);
    pdf.rect(18, pageHeight - 60, pageWidth - 36, 46, "F");
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.8);
    pdf.line(28, pageHeight - 48, pageWidth - 28, pageHeight - 48);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(32, 32, 32);
    pdf.text("Office # 15, Ayub Shopping Center, Keemari, Karachi", pageWidth / 2, pageHeight - 30, { align: "center" });
    pdf.save(`${String(customer || "customer").replace(/[^\w-]+/g, "_")}_summary.pdf`);
  }

  function setActiveNav() {
    const page = document.body.dataset.page;
    document.querySelectorAll(".nav a").forEach((link) => {
      link.classList.toggle("active", link.dataset.page === page);
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
    let editingId = "";

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

      if (!bookings.length) {
        body.innerHTML = `
          <tr>
            <td colspan="33">No records found for this customer.</td>
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

    form.addEventListener("submit", (event) => {
      event.preventDefault();
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
        chequeNumber: String(data.chequeNumber || "").trim()
      };
      delete normalized.datePicker;

      if (!editingId) {
        normalized.id = `BK-${Date.now().toString().slice(-6)}`;
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
      const invoiceId = event.target.getAttribute("data-download-invoice");
      const editId = event.target.getAttribute("data-edit-booking");
      const deleteId = event.target.getAttribute("data-delete-booking");
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
        totalElement.textContent = money(summaryRows.reduce((sum, item) => sum + item.totalRate, 0));
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

  async function buildTruckTripInvoicePdf(trip, tripType) {
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
    pdf.setTextColor(24, 48, 77);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text(`${isImport ? "IMPORT" : "EXPORT / BACK LOAD"} INVOICE`, 36, 158);
    pdf.setFontSize(12);
    pdf.text(`Job No: ${text(trip.jobNo)}`, 36, 182);
    pdf.text(`Customer/Payer: ${text(trip.customer || "-")}`, 36, 202);

    const details = isImport ? {
      date: trip.date, truckNo: trip.truckNo, origin: trip.origin, destination: trip.destination,
      size: trip.size, weight: trip.weight, freight: trip.importFreight, broker: trip.importBroker,
      commission: trip.importBrokerCommission, received: trip.importReceivedAmount,
      instrument: trip.importChequeDetails, paymentDate: trip.importPaymentDate, status: trip.importPaymentStatus
    } : {
      date: trip.exportLoadDate, truckNo: trip.exportTruckNo || trip.truckNo, origin: trip.exportOrigin, destination: trip.exportDestination,
      size: trip.exportSize, weight: trip.exportWeight, freight: trip.exportFreight, broker: trip.exportBroker,
      commission: trip.exportBrokerCommission, received: trip.exportReceivedAmount,
      instrument: trip.exportChequeDetails, paymentDate: trip.exportPaymentDate, status: trip.exportPaymentStatus
    };

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
        ["Received Amount", money(details.received)],
        ["Cheque / Instrument", text(details.instrument || "-")],
        ["Payment Received Date", details.paymentDate ? formatShortDate(details.paymentDate) : "-"],
        ["Payment Status", text(details.status || "Awaited")],
        ["Remarks", text((isImport ? trip.importRemarks : trip.exportRemarks) || trip.remarks || "-")]
      ],
      styles: { fontSize: 10, cellPadding: 6, lineColor: [226, 210, 193], textColor: [25, 40, 58] },
      columnStyles: { 0: { cellWidth: 150, fontStyle: "bold" }, 1: { cellWidth: 355 } }
    });
    pdf.setFillColor(255, 255, 255);
    pdf.rect(18, pageHeight - 112, pageWidth - 36, 86, "F");
    pdf.setDrawColor(0, 0, 0);
    pdf.line(28, pageHeight - 68, pageWidth - 28, pageHeight - 68);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text("Office # 15, Ayub Shopping Center, Keemari, Karachi", pageWidth / 2, pageHeight - 48, { align: "center" });
    pdf.save(`${String(trip.customer || "customer").replace(/[^\w-]+/g, "_")}_summary.pdf`);
  }

  function truckPage(store) {
    const body = document.querySelector("[data-truck-trip-rows]");
    const form = document.querySelector("[data-truck-trip-form]");
    const notice = document.querySelector("[data-notice]");
    const count = document.querySelector("[data-truck-trip-count]");
    const customerFilter = document.querySelector("[data-truck-customer-filter]");
    const dateSort = document.querySelector("[data-truck-date-sort]");
    if (!body || !form) return;
    let editingId = "";

    const numberFields = ["mtyBoxFreight", "importFreight", "importBrokerCommission", "importReceivedAmount", "exportFreight", "exportBrokerCommission", "exportReceivedAmount", "balanceReceivable", "grandTotal", "roundTripExpense", "profitLoss"];

    function calculateTrip() {
      const importReceived = Number(form.elements.importFreight.value || 0) - Number(form.elements.importBrokerCommission.value || 0);
      const exportReceived = Number(form.elements.exportFreight.value || 0) - Number(form.elements.exportBrokerCommission.value || 0);
      const grandTotal = Number(form.elements.mtyBoxFreight.value || 0) + importReceived + exportReceived;
      const profitLoss = grandTotal - Number(form.elements.roundTripExpense.value || 0);
      form.elements.importReceivedAmount.value = String(importReceived);
      form.elements.exportReceivedAmount.value = String(exportReceived);
      form.elements.grandTotal.value = String(grandTotal);
      form.elements.profitLoss.value = String(profitLoss);
    }

    function resetForm() {
      form.reset();
      form.elements.jobNo.value = "GT-001";
      form.elements.date.value = "2026-07-04";
      form.elements.truckNo.value = "JW-5477";
      form.elements.exportTruckNo.value = "JW-5477";
      form.elements.importPaymentStatus.value = "Awaited";
      form.elements.exportPaymentStatus.value = "Awaited";
      calculateTrip();
      editingId = "";
      form.querySelector("[data-submit-label]").textContent = "Save Trip";
    }

    function render() {
      const allRows = store.truckExpenses.filter((item) => item.jobNo);
      const customers = [...new Set(allRows.map((item) => String(item.customer || "").trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
      const selectedCustomer = String(customerFilter?.value || "").trim();
      if (customerFilter) {
        customerFilter.innerHTML = `<option value="">All Customers</option>${customers.map((customer) => `<option value="${escapeHtml(customer)}">${text(customer)}</option>`).join("")}`;
        customerFilter.value = customers.includes(selectedCustomer) ? selectedCustomer : "";
      }
      const rows = (selectedCustomer ? allRows.filter((item) => String(item.customer || "").trim() === selectedCustomer) : [...allRows])
        .sort((left, right) => compareDateValues(left.date, right.date, dateSort?.value || "desc"));
      count.textContent = `${rows.length} record(s)`;
      if (!rows.length) {
        body.innerHTML = `<tr><td colspan="40">No truck trip records available yet.</td></tr>`;
        return;
      }
      body.innerHTML = rows.map((item, index) => `
        <tr>
          <td>${index + 1}</td><td>${text(item.jobNo)}</td><td>${formatShortDate(item.date)}</td><td>${text(item.truckNo)}</td>
          <td>${text(item.origin)}</td><td>${text(item.destination)}</td><td>${text(item.customer)}</td><td>${text(item.size)}</td><td>${text(item.weight)}</td><td>${text(item.cargoDescription)}</td>
          <td>${money(item.mtyBoxFreight)}</td><td>${text(item.mtyBroker)}</td>
          <td>${money(item.importFreight)}</td><td>${money(item.importBrokerCommission)}</td><td>${text(item.importBroker)}</td><td>${money(item.importReceivedAmount)}</td><td>${text(item.importChequeDetails)}</td><td>${item.importPaymentDate ? formatShortDate(item.importPaymentDate) : "-"}</td><td><span class="badge ${item.importPaymentStatus === "Credit" ? "good" : "bad"}">${text(item.importPaymentStatus || "Awaited")}</span></td><td>${text(item.importRemarks || item.remarks || "-")}</td>
          <td>${item.exportLoadDate ? formatShortDate(item.exportLoadDate) : "-"}</td><td>${text(item.exportTruckNo || item.truckNo)}</td><td>${text(item.exportBroker)}</td><td>${money(item.exportFreight)}</td><td>${money(item.exportBrokerCommission)}</td><td>${text(item.exportOrigin)}</td><td>${text(item.exportDestination)}</td><td>${text(item.exportSize)}</td><td>${text(item.exportWeight)}</td><td>${money(item.exportReceivedAmount)}</td><td>${text(item.exportChequeDetails)}</td><td>${item.exportPaymentDate ? formatShortDate(item.exportPaymentDate) : "-"}</td><td><span class="badge ${item.exportPaymentStatus === "Credit" ? "good" : "bad"}">${text(item.exportPaymentStatus || "Awaited")}</span></td><td>${text(item.exportRemarks || item.remarks || "-")}</td>
          <td>${money(item.balanceReceivable)}</td><td>${money(item.grandTotal)}</td><td>${money(item.roundTripExpense)}</td><td>${money(item.profitLoss)}</td><td>${text(item.remarks)}</td>
          <td>
            <div class="table-actions">
              <button class="btn small" data-import-invoice="${item.id}">Import Invoice</button>
              <button class="btn small" data-export-invoice="${item.id}">Export Invoice</button>
              <button class="btn small" data-edit-trip="${item.id}">Edit</button>
              <button class="btn small danger" data-delete-trip="${item.id}">Delete</button>
            </div>
          </td>
        </tr>
      `).join("");
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
        normalized.id = `TRIP-${Date.now().toString().slice(-6)}`;
        store.truckExpenses.unshift(normalized);
        notice.textContent = `Truck trip ${normalized.jobNo} saved successfully.`;
      } else {
        const index = store.truckExpenses.findIndex((item) => item.id === editingId);
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
        if (item) buildTruckTripInvoicePdf(item, importInvoiceId ? "import" : "export").catch(() => {
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
    if (dateSort) dateSort.addEventListener("change", render);
    resetForm();
    render();
  }

  function truckSummaryPage(store) {
    const groupsContainer = document.querySelector("[data-truck-summary-groups]");
    const count = document.querySelector("[data-truck-summary-count]");
    const customerFilter = document.querySelector("[data-truck-summary-customer-filter]");
    const dateSort = document.querySelector("[data-truck-summary-date-sort]");
    if (!groupsContainer || !count) return;

    function render() {
      const trips = store.truckExpenses.filter((item) => item.jobNo);
      const customers = [...new Set(trips.map((item) => String(item.customer || "").trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
      const selectedCustomer = String(customerFilter?.value || "").trim();
      if (customerFilter) {
        customerFilter.innerHTML = `<option value="">All Customers</option>${customers.map((customer) => `<option value="${escapeHtml(customer)}">${text(customer)}</option>`).join("")}`;
        customerFilter.value = customers.includes(selectedCustomer) ? selectedCustomer : "";
      }
      const filteredTrips = (selectedCustomer ? trips.filter((item) => String(item.customer || "").trim() === selectedCustomer) : [...trips])
        .sort((left, right) => compareDateValues(left.date, right.date, dateSort?.value || "desc"));
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
        groupsContainer.innerHTML = `<div class="truck-summary-empty">No truck summary records available yet.</div>`;
        return;
      }

      let serialNumber = 0;
      groupsContainer.innerHTML = jobGroups.map((group) => {
        const legs = group.trips.flatMap((item) => ([
          { tripId: item.id, type: "Import", date: item.date, truckNo: item.truckNo, origin: item.origin, destination: item.destination, size: item.size, weight: item.weight, cargo: item.cargoDescription, freight: item.importFreight, broker: item.importBroker, remarks: item.importRemarks || item.remarks },
          { tripId: item.id, type: "Export", date: item.exportLoadDate, truckNo: item.exportTruckNo || item.truckNo, origin: item.exportOrigin, destination: item.exportDestination, size: item.exportSize, weight: item.exportWeight, cargo: item.cargoDescription, freight: item.exportFreight, broker: item.exportBroker, remarks: item.exportRemarks || item.remarks }
        ]));

        return `
          <section class="truck-job-group">
            <div class="truck-job-header">
              <div class="truck-job-identity">
                <span>Job No</span>
                <strong>${escapeHtml(group.jobNo)}</strong>
              </div>
              <div class="truck-job-customer">
                <span>Customer</span>
                <strong>${escapeHtml(group.customer)}</strong>
              </div>
              <span class="truck-job-count">${legs.length} movement(s)</span>
            </div>
            <div class="table-wrap">
              <table class="statement-table truck-summary-table">
                <thead>
                  <tr>
                    <th>S.No</th><th>Type</th><th>Date</th><th>Registration No</th><th>Origin</th><th>Destination</th><th>Size</th><th>Weight</th><th>Cargo Description</th><th>Freight</th><th>Broker</th><th>Remarks</th><th>Download PDF</th>
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
                      <td>${money(leg.freight)}</td>
                      <td>${text(leg.broker)}</td>
                      <td>${text(leg.remarks)}</td>
                      <td><button class="btn small" type="button" data-summary-invoice="${leg.tripId}" data-summary-type="${leg.type.toLowerCase()}">Download PDF</button></td>
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
    if (dateSort) dateSort.addEventListener("change", render);
    groupsContainer.addEventListener("click", (event) => {
      const tripId = event.target.getAttribute("data-summary-invoice");
      if (!tripId) return;
      const trip = store.truckExpenses.find((item) => item.id === tripId);
      if (trip) buildTruckTripInvoicePdf(trip, event.target.getAttribute("data-summary-type") || "import").catch(() => {});
    });
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
        clearAdminSession();
        navigateWithTransition("index.html");
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
      return store.customerKhatas.find((item) => item.id === select.value) || store.customerKhatas[0];
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
          balance: runningBalance === 0 ? "0" : `${money(Math.abs(runningBalance))} ${runningBalance > 0 ? "(-)" : "(+)"}`
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
      pdf.text("CUSTOMER STATEMENT", pageWidth - left, 154, { align: "right" });

      pdf.setFontSize(18);
      pdf.text(`${account.customer} Statement`, left, 170);
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
      pdf.text("Total Debit", left, statsTop);
      pdf.text("Total Credit", left + statWidth + 18, statsTop);
      pdf.text("Net Balance", left + (statWidth * 2) + 18, statsTop);

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
      pdf.text(statement.totals.closingBalance > 0 ? "Debit (-)" : statement.totals.closingBalance < 0 ? "Credit (+)" : "-", left + (statWidth * 2) + 18, statsTop + 34);

      pdf.autoTable({
        startY: 288,
        head: [["Date", "Tafseel", "Debit (-)", "Credit (+)", "Balance"]],
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
            if (raw.includes("(-)")) data.cell.styles.textColor = [255, 82, 82];
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
      pdf.rect(18, pageHeight - 112, pageWidth - 36, 86, "F");
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.8);
      pdf.line(28, pageHeight - 68, pageWidth - 28, pageHeight - 68);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(32, 32, 32);
      pdf.text("Office # 15, Ayub Shopping Center, Keemari, Karachi", pageWidth / 2, pageHeight - 48, { align: "center" });

      const blob = pdf.output("blob");
      return new File([blob], `${account.customer.replace(/[^\w-]+/g, "_")}_khata.pdf`, { type: "application/pdf" });
    }

    async function printStatement(account) {
      try {
        const file = await buildStatementPdfFile(account);
        triggerFileDownload(file);
        exportNotice.textContent = `${account.customer} khata PDF downloaded successfully.`;
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
            title: `${account.customer} Statement`,
            text: `${account.customer} statement`
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
        exportNotice.textContent = "A valid WhatsApp number was not found for this customer.";
      }
    }

    function populateCustomers() {
      select.innerHTML = store.customerKhatas.map((account) => `
        <option value="${account.id}">${account.customer}</option>
      `).join("");
    }

    function resetCustomerForm() {
      customerForm.reset();
      customerForm.elements.customer.value = "";
      customerForm.elements.phone.value = "";
      customerForm.elements.city.value = "";
      editingCustomerId = "";
      customerForm.querySelector("[data-customer-submit-label]").textContent = "Save Customer";
    }

    function fillCustomerForm(account) {
      if (!account) return;
      customerForm.elements.customer.value = account.customer || "";
      customerForm.elements.phone.value = account.phone || "";
      customerForm.elements.city.value = account.city || "";
      editingCustomerId = account.id;
      customerForm.querySelector("[data-customer-submit-label]").textContent = "Update Customer";
    }

    function renderCustomerList() {
      customerListBody.innerHTML = store.customerKhatas.map((account) => {
        const totals = calculateKhataSummary(account);
        return `
          <tr>
            <td>${text(account.customer)}</td>
            <td>${text(account.phone)}</td>
            <td>${text(account.city)}</td>
            <td>${money(totals.debit)}</td>
            <td>${money(totals.credit)}</td>
            <td class="${totals.closingBalance > 0 ? "debit-text" : totals.closingBalance < 0 ? "credit-text" : ""}">${money(Math.abs(totals.closingBalance))}${totals.closingBalance > 0 ? " (-)" : totals.closingBalance < 0 ? " (+)" : ""}</td>
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
      const account = store.customerKhatas.find((item) => item.id === accountId) || store.customerKhatas[0];
      if (!account) return;

      const totals = calculateKhataSummary(account);
      const statement = getStatementData(account);
      const sortedEntries = [...account.entries].sort((a, b) => a.date.localeCompare(b.date));
      statementTitle.textContent = `${account.customer} Statement`;
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
          <span>Total Debit</span>
          <strong>Rs ${money(totals.debit)}</strong>
        </div>
        <div class="statement-stat">
          <span>Total Credit</span>
          <strong>Rs ${money(totals.credit)}</strong>
        </div>
        <div class="statement-stat ${totals.closingBalance > 0 ? "negative" : totals.closingBalance < 0 ? "positive" : ""}">
          <span>Net Balance</span>
          <strong>Rs ${money(Math.abs(totals.closingBalance))}</strong>
          <small>${totals.hasEntries ? (totals.closingBalance > 0 ? "Debit (-)" : totals.closingBalance < 0 ? "Credit (+)" : "Settled") : "-"}</small>
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
            <td class="amount-cell ${runningBalance > 0 ? "debit-text" : runningBalance < 0 ? "credit-text" : ""}">${runningBalance === 0 ? "0" : `${money(Math.abs(runningBalance))} ${runningBalance > 0 ? "(-)" : "(+)"}`}</td>
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
        customerNotice.textContent = "Customer name is required.";
        return;
      }

      if (!editingCustomerId) {
        normalized.id = `CUS-${Date.now().toString().slice(-6)}`;
        store.customerKhatas.unshift(normalized);
        customerNotice.textContent = `Customer ${normalized.customer} was added successfully.`;
      } else {
        const index = store.customerKhatas.findIndex((item) => item.id === editingCustomerId);
        if (index === -1) {
          customerNotice.textContent = "Customer record not found.";
          return;
        }
        normalized.id = editingCustomerId;
        normalized.entries = store.customerKhatas[index].entries || [];
        store.customerKhatas[index] = normalized;
        customerNotice.textContent = `Customer ${normalized.customer} updated successfully.`;
      }

      saveStore(store);
      populateCustomers();
      renderAccount(normalized.id);
      resetCustomerForm();
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const account = store.customerKhatas.find((item) => item.id === data.accountId);
      if (!account) return;

      const normalized = {
        id: editingId,
        date: data.date,
        type: data.type,
        description: data.description,
        amount: Number(data.amount || 0)
      };

      if (!editingId) {
        normalized.id = `KHT-${Date.now().toString().slice(-6)}`;
        account.entries.unshift(normalized);
        notice.textContent = `Khata entry ${normalized.id} saved successfully.`;
      } else {
        const index = account.entries.findIndex((entry) => entry.id === editingId);
        if (index === -1) {
          notice.textContent = "Entry not found. Please try again.";
          return;
        }
        account.entries[index] = normalized;
        notice.textContent = `Khata entry ${editingId} updated successfully.`;
      }

      saveStore(store);
      renderAccount(account.id);
      resetForm();
    });

    body.addEventListener("click", (event) => {
      const editId = event.target.getAttribute("data-edit-khata");
      const deleteId = event.target.getAttribute("data-delete-khata");
      const account = store.customerKhatas.find((item) => item.id === select.value);
      if (!account) return;

      if (editId) fillForm(account, account.entries.find((entry) => entry.id === editId));
      if (deleteId) {
        account.entries = account.entries.filter((entry) => entry.id !== deleteId);
        saveStore(store);
        renderAccount(account.id);
        notice.textContent = `Khata entry ${deleteId} deleted successfully.`;
        if (editingId === deleteId) resetForm();
      }
    });

    customerListBody.addEventListener("click", (event) => {
      const openId = event.target.getAttribute("data-open-customer");
      const editCustomerId = event.target.getAttribute("data-edit-customer");
      if (openId) {
        renderAccount(openId);
        resetForm();
      }
      if (editCustomerId) {
        fillCustomerForm(store.customerKhatas.find((item) => item.id === editCustomerId));
      }
    });

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
    renderAccount(store.customerKhatas[0]?.id);
    resetForm();
    resetCustomerForm();
  }

  document.addEventListener("DOMContentLoaded", () => {
    const store = loadStore();
    const page = document.body.dataset.page;
    if (!enforceSoftwareAccess(page)) return;
    bindPageTransitions();
    applySessionAccess();
    setActiveNav();
    bindMobileNav();
    if (page !== "signin") bindSoftwareSignOut();
    if (page === "signin") softwareLoginPage(store);
    if (page === "dashboard") dashboardPage(store);
    if (page === "booking") bookingPage(store);
    if (page === "ledger") ledgerPage(store);
    if (page === "truck") truckPage(store);
    if (page === "truck-summary") truckSummaryPage(store);
    if (page === "employee") employeePage(store);
    if (page === "admin-login") adminLoginPage(store);
    if (page === "admin") adminPage(store);
    if (page === "khata") khataPage(store);
    markPageReady();
  });
})();
