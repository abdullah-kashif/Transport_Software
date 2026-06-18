(function () {
  const KEY = "gtls-transport-demo-data-v1";

  const seed = {
    bookings: [
      {
        id: "BK-24061",
        date: "2026-06-10",
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
        status: "Pending Bill"
      },
      {
        id: "BK-24062",
        date: "2026-06-10",
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
        date: "2026-06-09",
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

    saveStore(store);
    return store;
  }

  function saveStore(store) {
    sessionStorage.setItem(KEY, JSON.stringify(store));
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

  function formatStatementDate(value) {
    if (!value) return "-";
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
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
    const pendingBills = store.bookings.filter((b) => b.status === "Pending Bill").length;
    const delivered = store.bookings.filter((b) => b.status === "Delivered").length;
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
        <td>${text(item.date)}</td>
        <td>${text(item.customer)}</td>
        <td>${text(item.route)}</td>
        <td>${text(item.containerNo)} / ${text(item.size)}</td>
        <td>${text(item.truckNo)}</td>
        <td>${money(item.rate)}</td>
        <td><span class="badge ${item.status === "Pending Bill" ? "warn" : "good"}">${text(item.status)}</span></td>
      </tr>
    `).join("");

    const invoiceBody = document.querySelector("[data-invoice-preview]");
    invoiceBody.innerHTML = store.invoices.map((item) => {
      const totals = calculateInvoiceTotals(item);
      return `
        <tr>
          <td>${text(item.invoiceNo)}</td>
          <td>${text(item.customer)}</td>
          <td>${text(item.period)}</td>
          <td>${money(item.roadFreight)}</td>
          <td>${money(totals.total)}</td>
          <td>${money(item.receivedSoFar)}</td>
          <td>${money(totals.balance)}</td>
        </tr>
      `;
    }).join("");

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
    const statusField = form.querySelector("[name='status']");
    let editingId = "";

    function resetForm() {
      form.reset();
      form.elements.date.value = "2026-06-10";
      statusField.value = "Pending Bill";
      editingId = "";
      form.querySelector("[data-submit-label]").textContent = "Save Booking";
    }

    function render() {
      body.innerHTML = store.bookings.map((item) => `
        <tr>
          <td>${text(item.id)}</td>
          <td>${text(item.date)}</td>
          <td>${text(item.customer)}</td>
          <td>${text(item.consignee)}</td>
          <td>${text(item.route)}</td>
          <td>${text(item.origin)}</td>
          <td>${text(item.destination)}</td>
          <td>${text(item.blNo)}</td>
          <td>${text(item.containerNo)}</td>
          <td>${text(item.size)}</td>
          <td>${text(item.truckNo)}</td>
          <td>${text(item.goodsType)}</td>
          <td>${text(item.quantity)}</td>
          <td>${money(item.rate)}</td>
          <td>${money(item.gatePass)}</td>
          <td>${money(item.detention)}</td>
          <td>${text(item.status)}</td>
          <td>${text(item.remarks)}</td>
          <td>
            <div class="table-actions">
              <button class="btn small" data-edit-booking="${item.id}">Edit</button>
              <button class="btn small danger" data-delete-booking="${item.id}">Delete</button>
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
      form.querySelector("[data-submit-label]").textContent = "Update Booking";
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const normalized = {
        ...data,
        rate: Number(data.rate || 0),
        gatePass: Number(data.gatePass || 0),
        detention: Number(data.detention || 0)
      };

      if (!editingId) {
        normalized.id = `BK-${Date.now().toString().slice(-6)}`;
        store.bookings.unshift(normalized);
        notice.textContent = "New booking save ho gayi hai aur sessionStorage mein store ho chuki hai.";
      } else {
        const index = store.bookings.findIndex((item) => item.id === editingId);
        normalized.id = editingId;
        store.bookings[index] = normalized;
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
    const form = document.querySelector("[data-ledger-form]");
    const body = document.querySelector("[data-ledger-rows]");
    const notice = document.querySelector("[data-notice]");
    let editingId = "";

    function resetForm() {
      form.reset();
      editingId = "";
      form.querySelector("[data-submit-label]").textContent = "Save Receipt";
    }

    function render() {
      body.innerHTML = store.ledgerEntries.map((item) => `
        <tr>
          <td>${text(item.billNo)}</td>
          <td>${text(item.date)}</td>
          <td>${text(item.customer)}</td>
          <td>${text(item.destination)}</td>
          <td>${text(item.blNo)}</td>
          <td>${text(item.container)}</td>
          <td>${text(item.goods)}</td>
          <td>${money(item.receivedAmount)}</td>
          <td>${text(item.receivedDate)}</td>
          <td>${text(item.chequeNo)}</td>
          <td>${text(item.remarks)}</td>
          <td>
            <div class="table-actions">
              <button class="btn small" data-edit-ledger="${item.id}">Edit</button>
              <button class="btn small danger" data-delete-ledger="${item.id}">Delete</button>
            </div>
          </td>
        </tr>
      `).join("");

      const total = store.ledgerEntries.reduce((sum, item) => sum + Number(item.receivedAmount || 0), 0);
      document.querySelector("[data-ledger-total]").textContent = money(total);
    }

    function fillForm(item) {
      Object.keys(item).forEach((key) => {
        if (form.elements[key]) form.elements[key].value = item[key];
      });
      editingId = item.id;
      form.querySelector("[data-submit-label]").textContent = "Update Receipt";
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const normalized = { ...data, receivedAmount: Number(data.receivedAmount || 0) };
      if (!editingId) {
        normalized.id = `LED-${Date.now().toString().slice(-6)}`;
        store.ledgerEntries.unshift(normalized);
        notice.textContent = "New customer receipt save ho gayi hai.";
      } else {
        const index = store.ledgerEntries.findIndex((item) => item.id === editingId);
        normalized.id = editingId;
        store.ledgerEntries[index] = normalized;
        notice.textContent = `Receipt ${editingId} update ho gayi hai.`;
      }
      saveStore(store);
      render();
      resetForm();
    });

    body.addEventListener("click", (event) => {
      const editId = event.target.getAttribute("data-edit-ledger");
      const deleteId = event.target.getAttribute("data-delete-ledger");
      if (editId) fillForm(store.ledgerEntries.find((item) => item.id === editId));
      if (deleteId) {
        store.ledgerEntries = store.ledgerEntries.filter((item) => item.id !== deleteId);
        saveStore(store);
        render();
        notice.textContent = `Receipt ${deleteId} delete ho gayi hai.`;
        if (editingId === deleteId) resetForm();
      }
    });

    document.querySelector("[data-reset-form]").addEventListener("click", resetForm);
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
          <td>${text(item.date)}</td>
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

  function invoicePage(store) {
    const form = document.querySelector("[data-invoice-form]");
    const body = document.querySelector("[data-invoice-rows]");
    const notice = document.querySelector("[data-notice]");
    let editingId = "";

    function resetForm() {
      form.reset();
      form.elements.receivedSoFar.value = 0;
      form.elements.otherCharges.value = 0;
      editingId = "";
      form.querySelector("[data-submit-label]").textContent = "Create Invoice";
    }

    function render() {
      body.innerHTML = store.invoices.map((item) => {
        const totals = calculateInvoiceTotals(item);
        return `
          <tr>
            <td>${text(item.invoiceNo)}</td>
            <td>${text(item.customer)}</td>
            <td>${text(item.period)}</td>
            <td>${text(item.units)}</td>
            <td>${money(item.roadFreight)}</td>
            <td>${money(item.saleTax)}</td>
            <td>${money(item.otherCharges)}</td>
            <td>${money(totals.total)}</td>
            <td>${money(item.receivedSoFar)}</td>
            <td>${money(totals.balance)}</td>
            <td>${text(item.lastPaymentRef)}</td>
            <td>
              <div class="table-actions">
                <button class="btn small" data-edit-invoice="${item.id}">Edit</button>
                <button class="btn small danger" data-delete-invoice="${item.id}">Delete</button>
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
      editingId = item.id;
      form.querySelector("[data-submit-label]").textContent = "Update Invoice";
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const normalized = {
        ...data,
        roadFreight: Number(data.roadFreight || 0),
        saleTax: Number(data.saleTax || 0),
        otherCharges: Number(data.otherCharges || 0),
        receivedSoFar: Number(data.receivedSoFar || 0)
      };
      if (!editingId) {
        normalized.id = `INV-${Date.now().toString().slice(-6)}`;
        store.invoices.unshift(normalized);
        notice.textContent = "Invoice create ho gayi hai aur session mein save ho chuki hai.";
      } else {
        const index = store.invoices.findIndex((item) => item.id === editingId);
        normalized.id = editingId;
        store.invoices[index] = normalized;
        notice.textContent = `Invoice ${editingId} update ho gayi hai.`;
      }
      saveStore(store);
      render();
      resetForm();
    });

    body.addEventListener("click", (event) => {
      const editId = event.target.getAttribute("data-edit-invoice");
      const deleteId = event.target.getAttribute("data-delete-invoice");
      if (editId) fillForm(store.invoices.find((item) => item.id === editId));
      if (deleteId) {
        store.invoices = store.invoices.filter((item) => item.id !== deleteId);
        saveStore(store);
        render();
        notice.textContent = `Invoice ${deleteId} delete ho gayi hai.`;
        if (editingId === deleteId) resetForm();
      }
    });

    document.querySelector("[data-reset-form]").addEventListener("click", resetForm);
    render();
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

    async function shareStatementOnWhatsapp(account) {
      const phone = normalizeWhatsappNumber(account.phone);
      const message = encodeURIComponent(`${account.customer} ka updated statement ready hai.`);

      try {
        const file = await buildStatementPdfFile(account);
        if (navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
          await navigator.share({
            files: [file],
            title: `${account.customer} Statement`,
            text: `${account.customer} ka statement`
          });
          exportNotice.textContent = "Share sheet open ho gayi hai. Wahan se WhatsApp select karke customer ko statement bhej dein.";
          return;
        }
      } catch (error) {
        // Fallback to chat open below.
      }

      if (phone) {
        window.open(`https://wa.me/${phone}?text=${message}`, "_blank", "noopener,noreferrer");
        exportNotice.textContent = "WhatsApp chat open ho gayi hai. Browser security ki wajah se PDF auto-attach nahi hoti, is liye PDF button se preview/save karke us chat mein attach karein.";
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
        <div class="khata-mini"><strong>Phone</strong><div class="muted">${text(account.phone)}</div></div>
        <div class="khata-mini"><strong>City</strong><div class="muted">${text(account.city)}</div></div>
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
    setActiveNav();
    bindMobileNav();
    bindReset();
    const page = document.body.dataset.page;
    if (page === "dashboard") dashboardPage(store);
    if (page === "booking") bookingPage(store);
    if (page === "ledger") ledgerPage(store);
    if (page === "truck") truckPage(store);
    if (page === "invoice") invoicePage(store);
    if (page === "employee") employeePage(store);
    if (page === "khata") khataPage(store);
  });
})();
