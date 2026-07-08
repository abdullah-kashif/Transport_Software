(function () {
  const KEY = "gtls-transport-demo-data-v1";
  const ADMIN_AUTH_KEY = "gtls-admin-auth-v1";
  const ACCESS_OPTIONS = [
    { value: "dashboard", label: "Dashboard" },
    { value: "booking", label: "Booking Form" },
    { value: "ledger", label: "Summary Page" },
    { value: "truck", label: "Truck Details" },
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
        status: "Submitted"
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
        remarks: "Submitted and ready for invoice.",
        status: "Submitted"
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
      window.location.href = getPageFile("dashboard");
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
        notice.textContent = "Email ya password sahi nahi hai.";
        return;
      }

      setAdminSession(user);
      const firstPage = normalizeAdminAccess(user.access, user.role)[0] || "dashboard";
      window.location.href = getPageFile(firstPage);
    });
  }

  function enforceSoftwareAccess(page) {
    const publicPages = new Set(["signin", "admin-login"]);
    const session = getAdminSession();
    const hasSession = Boolean(session);

    if (page === "signin" && hasSession) {
      const firstPage = session.access?.[0] || "dashboard";
      window.location.href = getPageFile(firstPage);
      return false;
    }

    if (!publicPages.has(page) && !hasSession) {
      window.location.href = "index.html";
      return false;
    }

    if (!publicPages.has(page) && session && session.role !== "Super Admin") {
      const allowed = new Set(normalizeAdminAccess(session.access, session.role));
      if (!allowed.has(page)) {
        const fallback = allowed.has("dashboard") ? "dashboard" : allowed.values().next().value || "dashboard";
        window.location.href = getPageFile(fallback);
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

    const wrapper = document.createElement("div");
    wrapper.className = "actions";
    wrapper.style.marginTop = "12px";
    wrapper.innerHTML = `<button class="btn small" type="button" data-software-signout>Sign Out</button>`;
    sidebarTip.appendChild(wrapper);

    wrapper.querySelector("[data-software-signout]").addEventListener("click", () => {
      clearAdminSession();
      window.location.href = "index.html";
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
    const rate = Number(booking.rate || 0);
    const detention = Number(booking.detention || 0);
    const taxBreakdown = calculateBookingTaxBreakdown(rate, detention, booking.salesTaxAuthority);
    return {
      ...booking,
      invoiceNo: String(booking.invoiceNo || "").trim(),
      accountFlow,
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

  function setActiveNav() {
    const page = document.body.dataset.page;
    document.querySelectorAll(".nav a").forEach((link) => {
      if (link.dataset.page === page) {
        link.classList.add("active");
      }
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

  function bindReset() {
    const btn = document.querySelector("[data-reset-demo]");
    if (!btn) return;
    btn.addEventListener("click", () => {
      sessionStorage.setItem(KEY, JSON.stringify(seed));
      window.location.reload();
    });
  }

  function dashboardPage(store) {
    const activeTrips = store.bookings.filter((b) => b.status === "In Transit").length;
    const pendingBills = store.bookings.filter((b) => b.status === "Submitted").length;
    const delivered = 0;
    const trucks = store.trucks.length;
    const activeEmployees = store.employees.filter((employee) => employee.status === "Active").length;
    const totalReceipts = store.ledgerEntries.reduce((sum, item) => sum + Number(item.receivedAmount || 0), 0);
    const totalExpenses = store.truckExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const alerts = store.trucks.filter((truck) => truck.documentAlert).length;

    document.querySelector("[data-kpi='activeTrips']").textContent = activeTrips;
    document.querySelector("[data-kpi='pendingBills']").textContent = pendingBills;
    document.querySelector("[data-kpi='trucks']").textContent = trucks;
    document.querySelector("[data-kpi='alerts']").textContent = alerts;
    document.querySelector("[data-kpi='delivered']").textContent = delivered;
    document.querySelector("[data-kpi='employees']").textContent = activeEmployees;
    document.querySelector("[data-kpi='receipts']").textContent = money(totalReceipts);
    document.querySelector("[data-kpi='expenses']").textContent = money(totalExpenses);

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
        <td><span class="badge ${item.status === "Submitted" ? "warn" : "good"}">${text(item.status)}</span></td>
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
      statusField.value = "Submitted";
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
      const bookings = selectedCustomer
        ? store.bookings.filter((item) => String(item.customer || "").trim() === selectedCustomer)
        : store.bookings;

      bookingCount.textContent = `${bookings.length} record(s)`;

      if (!bookings.length) {
        body.innerHTML = `
          <tr>
            <td colspan="22">Is customer ka koi record nahi mila.</td>
          </tr>
        `;
        return;
      }

      body.innerHTML = bookings.map((item) => {
        const lines = getBookingContainerLines(item);
        return `
          <tr>
            <td>${text(item.id)}</td>
            <td>${formatShortDate(item.date)}</td>
            <td>${text(item.invoiceNo)}</td>
            <td>${text(item.customer)}</td>
            <td>${text(item.accountFlow)}</td>
            <td>${text(item.consignee)}</td>
            <td>${text(item.route)}</td>
            <td>${text(item.origin)}</td>
            <td>${text(item.destination)}</td>
            <td>${text(item.blNo)}</td>
            <td>${renderStackedCell(lines.map((line) => text(line.containerNo)))}</td>
            <td>${renderStackedCell(lines.map((line) => text(line.size)))}</td>
            <td>${renderStackedCell(lines.map((line) => text(line.truckNo)))}</td>
            <td>${text(item.goodsType)}</td>
            <td>${text(item.quantity)}</td>
            <td>${money(item.rate)}</td>
            <td>${text(item.gatePass)}</td>
            <td>${money(item.detention)}</td>
            <td>${money(item.receivableAmount)}</td>
            <td><span class="badge ${item.status === "Submitted" ? "warn" : "good"}">${text(item.status)}</span></td>
            <td>${text(item.remarks)}</td>
            <td>
              <div class="table-actions">
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
        receivableAmount: Number(data.receivableAmount || 0)
      };
      delete normalized.datePicker;

      if (!editingId) {
        normalized.id = `BK-${Date.now().toString().slice(-6)}`;
        store.bookings.unshift(normalizeBookingContainers(normalized));
        notice.textContent = "New booking save ho gayi hai aur sessionStorage mein store ho chuki hai.";
      } else {
        const index = store.bookings.findIndex((item) => item.id === editingId);
        normalized.id = editingId;
        store.bookings[index] = normalizeBookingContainers(normalized);
        notice.textContent = `Booking ${editingId} update ho gayi hai.`;
      }
      saveStore(store);
      render();
      resetForm();
    });

    body.addEventListener("click", (event) => {
      const editId = event.target.getAttribute("data-edit-booking");
      const deleteId = event.target.getAttribute("data-delete-booking");
      if (editId) {
        const item = store.bookings.find((entry) => entry.id === editId);
        if (item) fillForm(item);
      }
      if (deleteId) {
        store.bookings = store.bookings.filter((entry) => entry.id !== deleteId);
        saveStore(store);
        render();
        notice.textContent = `Booking ${deleteId} delete kar di gayi hai.`;
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

    function render() {
      const debitBookings = store.bookings
        .filter((item) => String(item.accountFlow || "").trim().toLowerCase() === "awaited")
        .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));

      const grouped = new Map();

      debitBookings.forEach((item) => {
        const customer = String(item.customer || "").trim() || "Unknown Customer";
        const pendingAmount = Number(item.receivableAmount || calculateBookingTaxBreakdown(item.rate, item.detention, item.salesTaxAuthority).receivableAmount);
        if (!grouped.has(customer)) {
          grouped.set(customer, {
            customer,
            dates: [],
            categories: [],
            totalRate: 0
          });
        }

        const entry = grouped.get(customer);
        if (item.date && !entry.dates.includes(item.date)) entry.dates.push(item.date);
        if (item.category && !entry.categories.includes(item.category)) entry.categories.push(item.category);
        entry.totalRate += pendingAmount;
      });

      const summaryRows = [...grouped.values()];
      totalElement.textContent = money(summaryRows.reduce((sum, item) => sum + item.totalRate, 0));
      countElement.textContent = `${summaryRows.length} customer(s)`;

      if (!summaryRows.length) {
        body.innerHTML = `
          <tr>
            <td colspan="4">Abhi tak koi awaited summary record available nahi hai.</td>
          </tr>
        `;
        return;
      }

      body.innerHTML = summaryRows.map((item) => `
        <tr>
          <td>${renderStackedCell(item.dates.map((date) => formatShortDate(date)), text)}</td>
          <td>${renderStackedCell(item.categories.map((category) => text(category)), text)}</td>
          <td>${text(item.customer)}</td>
          <td>${money(item.totalRate)}</td>
        </tr>
      `).join("");
    }

    render();
  }

  function truckPage(store) {
    const select = document.querySelector("[data-truck-select]");
    const profile = document.querySelector("[data-truck-profile]");
    const finance = document.querySelector("[data-truck-finance]");
    const body = document.querySelector("[data-expense-rows]");
    const form = document.querySelector("[data-expense-form]");
    const notice = document.querySelector("[data-notice]");
    let editingId = "";

    function renderTruckOptions() {
      select.innerHTML = store.trucks.map((truck) => `
        <option value="${truck.registrationNo}">${truck.registrationNo}</option>
      `).join("");
    }

    function renderTruckDetails(truckNo) {
      const truck = store.trucks.find((item) => item.registrationNo === truckNo) || store.trucks[0];
      if (!truck) return;
      profile.innerHTML = `
        <div class="item"><strong>Registration No</strong><div class="muted">${text(truck.registrationNo)}</div></div>
        <div class="item"><strong>Chassis No</strong><div class="muted">${text(truck.chassisNo)}</div></div>
        <div class="item"><strong>Engine No</strong><div class="muted">${text(truck.engineNo)}</div></div>
        <div class="item"><strong>Make / Model</strong><div class="muted">${text(truck.make)} / ${text(truck.model)}</div></div>
      `;
      const percent = Math.round((Number(truck.installmentPaid) / Number(truck.installmentTotal || 1)) * 100);
      finance.innerHTML = `
        <div class="item"><strong>Purchase Cost</strong><div class="muted">PKR ${money(truck.purchaseCost)}</div></div>
        <div class="item"><strong>Down Payment</strong><div class="muted">PKR ${money(truck.downPayment)}</div></div>
        <div class="item"><strong>Installment Completion</strong><div class="muted">${truck.installmentPaid} of ${truck.installmentTotal} installments paid</div><div class="progress"><span style="width:${percent}%"></span></div></div>
        <div class="item"><strong>Document Alert</strong><div class="muted">${text(truck.documentAlert)}</div></div>
      `;
      renderExpenses(truck.registrationNo);
      form.elements.truckNo.value = truck.registrationNo;
    }

    function resetForm() {
      form.reset();
      form.elements.truckNo.value = select.value;
      editingId = "";
      form.querySelector("[data-submit-label]").textContent = "Add Expense";
    }

    function renderExpenses(truckNo) {
      const rows = store.truckExpenses.filter((item) => item.truckNo === truckNo);
      body.innerHTML = rows.map((item) => `
        <tr>
          <td>${formatShortDate(item.date)}</td>
          <td>${text(item.vendor)}</td>
          <td>${text(item.description)}</td>
          <td>${text(item.paymentMode)}</td>
          <td>${text(item.invoiceNo)}</td>
          <td>${money(item.amount)}</td>
          <td>
            <div class="table-actions">
              <button class="btn small" data-edit-expense="${item.id}">Edit</button>
              <button class="btn small danger" data-delete-expense="${item.id}">Delete</button>
            </div>
          </td>
        </tr>
      `).join("");
    }

    function fillForm(item) {
      Object.keys(item).forEach((key) => {
        if (form.elements[key]) form.elements[key].value = item[key];
      });
      editingId = item.id;
      form.querySelector("[data-submit-label]").textContent = "Update Expense";
    }

    select.addEventListener("change", () => {
      renderTruckDetails(select.value);
      resetForm();
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const normalized = { ...data, amount: Number(data.amount || 0) };
      if (!editingId) {
        normalized.id = `EXP-${Date.now().toString().slice(-6)}`;
        store.truckExpenses.unshift(normalized);
        notice.textContent = "Truck expense save ho gaya hai.";
      } else {
        const index = store.truckExpenses.findIndex((item) => item.id === editingId);
        normalized.id = editingId;
        store.truckExpenses[index] = normalized;
        notice.textContent = `Expense ${editingId} update ho gaya hai.`;
      }
      saveStore(store);
      renderExpenses(select.value);
      resetForm();
    });

    body.addEventListener("click", (event) => {
      const editId = event.target.getAttribute("data-edit-expense");
      const deleteId = event.target.getAttribute("data-delete-expense");
      if (editId) fillForm(store.truckExpenses.find((item) => item.id === editId));
      if (deleteId) {
        store.truckExpenses = store.truckExpenses.filter((item) => item.id !== deleteId);
        saveStore(store);
        renderExpenses(select.value);
        notice.textContent = `Expense ${deleteId} delete ho gaya hai.`;
        if (editingId === deleteId) resetForm();
      }
    });

    document.querySelector("[data-reset-form]").addEventListener("click", resetForm);
    renderTruckOptions();
    renderTruckDetails(store.trucks[0].registrationNo);
    resetForm();
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
        notice.textContent = `Employee ${normalized.id} save ho gaya hai.`;
      } else {
        const index = store.employees.findIndex((item) => item.id === editingId);
        if (index === -1) {
          notice.textContent = "Employee record nahi mila, dubara try karein.";
          return;
        }
        normalized.id = editingId;
        store.employees[index] = normalized;
        notice.textContent = `Employee ${editingId} update ho gaya hai.`;
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
        notice.textContent = `Employee ${deleteId} delete ho gaya hai.`;
        if (editingId === deleteId) resetForm();
      }
    });

    document.querySelector("[data-reset-form]").addEventListener("click", resetForm);
    render();
    resetForm();
  }

  function adminLoginPage(store) {
    if (getAdminSession()) {
      window.location.href = "admin.html";
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
        notice.textContent = "Email ya password sahi nahi hai.";
        return;
      }

      setAdminSession(user);
      window.location.href = "admin.html";
    });
  }

  function adminPage(store) {
    const session = getAdminSession();
    if (!session) {
      window.location.href = "admin-login.html";
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
        window.location.href = "index.html";
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
        setNotice(`User ${normalized.name} successfully add ho gaya hai.`);
      } else {
        const index = store.adminUsers.findIndex((item) => item.id === editingId);
        if (index === -1) {
          setNotice("User record nahi mila, dubara try karein.");
          return;
        }
        normalized.id = editingId;
        store.adminUsers[index] = normalized;
        setNotice(`User ${normalized.name} update ho gaya hai.`);
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
        setNotice(`User ${deleteId} delete ho gaya hai.`);
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
        throw new Error("PDF library load nahi hui.");
      }

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF("p", "pt", "a4");
      const statement = getStatementData(account);
      const left = 18;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const contentWidth = pageWidth - (left * 2);

      pdf.setFillColor(245, 247, 250);
      pdf.rect(0, 0, pageWidth, 40, "F");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(70, 70, 70);
      pdf.text("Global Transport And Logistics Services", left, 25);

      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(18);
      pdf.text(`${account.customer} Statement`, left, 72);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(75, 75, 75);
      pdf.text(account.phone || "-", left, 88);
      pdf.text(`${statement.startDate} - ${statement.endDate}`, left, 103);

      const statsTop = 126;
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
        startY: 178,
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
      pdf.setFontSize(10);
      pdf.setTextColor(70, 70, 70);
      pdf.text("Global Transport And Logistics Services", left, finalY + 24);
      pdf.text("Mezzanine Floor B-9 Nagina Center Keamari Karachi. (+92 21 32862568)", left, finalY + 40);
      pdf.text(`Report Generated on ${statement.today}`, left, finalY + 56);

      const blob = pdf.output("blob");
      return new File([blob], `${account.customer.replace(/\s+/g, "_")}_statement.pdf`, { type: "application/pdf" });
    }

    async function printStatement(account) {
      try {
        const file = await buildStatementPdfFile(account);
        const url = URL.createObjectURL(file);
        window.open(url, "_blank", "noopener,noreferrer");
        exportNotice.textContent = "PDF preview new tab mein open ho gayi hai. Wahan se print ya Save as PDF kar sakte hain.";
      } catch (error) {
        exportNotice.textContent = "PDF generate nahi ho saki. Dobara try karein.";
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
      const message = encodeURIComponent(`${account.customer} ka updated statement ready hai.`);

      try {
        const file = await buildStatementPdfFile(account);
        if (isMobileDevice() && navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
          await navigator.share({
            files: [file],
            title: `${account.customer} Statement`,
            text: `${account.customer} ka statement`
          });
          exportNotice.textContent = "Share sheet open ho gayi hai. WhatsApp select karke statement direct bhej dein.";
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
          ? "Agar device share-sheet support nahi karti to WhatsApp chat open ho gayi hai. PDF download ho chuki hai; attach karke send kar dein."
          : "WhatsApp Web chat open ho gayi hai aur PDF download ho chuki hai. Ab downloaded PDF us chat mein attach karke send kar dein.";
      } else {
        exportNotice.textContent = "Customer ka valid WhatsApp number nahi mila.";
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
        customerNotice.textContent = "Customer name required hai.";
        return;
      }

      if (!editingCustomerId) {
        normalized.id = `CUS-${Date.now().toString().slice(-6)}`;
        store.customerKhatas.unshift(normalized);
        customerNotice.textContent = `Customer ${normalized.customer} add ho gaya hai.`;
      } else {
        const index = store.customerKhatas.findIndex((item) => item.id === editingCustomerId);
        if (index === -1) {
          customerNotice.textContent = "Customer record nahi mila.";
          return;
        }
        normalized.id = editingCustomerId;
        normalized.entries = store.customerKhatas[index].entries || [];
        store.customerKhatas[index] = normalized;
        customerNotice.textContent = `Customer ${normalized.customer} update ho gaya hai.`;
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
        notice.textContent = `Khata entry ${normalized.id} save ho gayi hai.`;
      } else {
        const index = account.entries.findIndex((entry) => entry.id === editingId);
        if (index === -1) {
          notice.textContent = "Entry nahi mili, dubara try karein.";
          return;
        }
        account.entries[index] = normalized;
        notice.textContent = `Khata entry ${editingId} update ho gayi hai.`;
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
        notice.textContent = `Khata entry ${deleteId} delete ho gayi hai.`;
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
    applySessionAccess();
    setActiveNav();
    bindMobileNav();
    bindReset();
    if (page !== "signin" && page !== "admin-login") bindSoftwareSignOut();
    if (page === "signin") softwareLoginPage(store);
    if (page === "dashboard") dashboardPage(store);
    if (page === "booking") bookingPage(store);
    if (page === "ledger") ledgerPage(store);
    if (page === "truck") truckPage(store);
    if (page === "employee") employeePage(store);
    if (page === "admin-login") adminLoginPage(store);
    if (page === "admin") adminPage(store);
    if (page === "khata") khataPage(store);
  });
})();
