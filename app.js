(function () {
  const KEY = "gtls-transport-live-data-v1";
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
    bookings: [],
    ledgerEntries: [],
    trucks: [],
    equipmentFleet: [],
    truckExpenses: [],
    invoices: [],
    maintenanceJobs: [],
    employees: [],
    adminUsers: [
      {
        id: "ADM-1",
        name: "Super Admin",
        email: "admin@gmail.com",
        password: "transport",
        role: "Super Admin",
        status: "Active",
        access: ACCESS_OPTIONS.map((item) => item.value)
      }
    ],
    customerKhatas: [],
    vendorKhatas: []
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

  const SIGNED_URL_CACHE_KEY = "gtls-signed-url-cache";

  function getCachedSignedUrl(path) {
    if (!path) return "";
    try {
      const cache = JSON.parse(sessionStorage.getItem(SIGNED_URL_CACHE_KEY) || "{}");
      const item = cache[path];
      if (item && item.url && item.expiresAt > Date.now()) {
        return item.url;
      }
    } catch (err) {
      console.warn("Failed to read signed URL cache:", err.message);
    }
    return "";
  }

  function cacheSignedUrl(path, url) {
    if (!path || !url) return;
    try {
      const cache = JSON.parse(sessionStorage.getItem(SIGNED_URL_CACHE_KEY) || "{}");
      cache[path] = {
        url,
        expiresAt: Date.now() + 50 * 60 * 1000
      };
      sessionStorage.setItem(SIGNED_URL_CACHE_KEY, JSON.stringify(cache));
    } catch (err) {
      console.warn("Failed to write signed URL cache:", err.message);
    }
  }

  function replaceArrayContents(target, source) {
    if (!Array.isArray(target) || !Array.isArray(source)) return;
    target.length = 0;
    target.push(...source);
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
    if (!options.skipRemote) scheduleOperationalSync(previousStore, store);
  }

  function normalizeAdminAccess(access, role = "Admin") {
    const allowedValues = new Set(ACCESS_OPTIONS.map((item) => item.value));
    if (role === "Super Admin") return ACCESS_OPTIONS.map((item) => item.value);

    const values = Array.isArray(access)
      ? access
      : typeof access === "string" && access
        ? [access]
        : [];

    return [...new Set(values
      .map((item) => String(item || "").trim())
      .filter((item) => allowedValues.has(item))
    )];
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

  const SUPABASE_DOCUMENT_BUCKET = "gtls-private-documents";

  function mapBookingRowFromSupabase(row = {}) {
    const containerLines = (row.booking_containers || [])
      .slice()
      .sort((left, right) => Number(left.sort_order || 0) - Number(right.sort_order || 0))
      .map((line) => normalizeContainerLine({
        containerNo: line.container_no,
        size: line.container_size,
        truckNo: line.truck_no
      }));
    const primaryLine = containerLines[0] || normalizeContainerLine();
    return normalizeBookingContainers({
      id: row.job_no,
      remoteId: row.id,
      bookingNo: row.booking_no,
      invoiceNo: row.invoice_no,
      date: formatShortDate(row.booking_date),
      blNo: row.bl_no,
      gatePass: row.ntn,
      customer: row.customer,
      consignee: row.consignee_address,
      route: row.route,
      origin: row.origin,
      destination: row.destination,
      category: row.category,
      goodsType: row.goods_type,
      quantity: row.quantity,
      rate: Number(row.road_haulage_charges || 0),
      salesTaxAuthority: row.sales_tax_authority,
      detention: Number(row.detention || 0),
      salesTaxAmount: Number(row.sales_tax_amount || 0),
      totalAmount: Number(row.total_amount || 0),
      incomeTaxAmount: Number(row.income_tax_amount || 0),
      salesTaxWithheldAmount: Number(row.sales_tax_withheld_amount || 0),
      salesTaxByUsAmount: Number(row.sales_tax_by_us_amount || 0),
      receivableAmount: Number(row.receivable_amount || 0),
      paymentTerm: row.payment_term,
      paymentReceivedDate: row.payment_received_date || "",
      chequeNumber: row.cheque_number,
      status: row.status,
      accountFlow: row.payment_status,
      biltyPath: row.bilty_path || "",
      biltyImage: "",
      remarks: row.remarks,
      containerLines,
      containerNo: primaryLine.containerNo,
      size: primaryLine.size,
      truckNo: primaryLine.truckNo
    });
  }

  function mapBookingForSupabase(booking = {}) {
    return {
      job_no: booking.id,
      booking_no: booking.bookingNo,
      invoice_no: booking.invoiceNo || null,
      booking_date: formatIsoDate(booking.date),
      bl_no: booking.blNo || null,
      ntn: booking.gatePass || null,
      customer: booking.customer,
      consignee_address: booking.consignee || null,
      route: booking.route || null,
      origin: booking.origin || null,
      destination: booking.destination || null,
      category: booking.category || null,
      goods_type: booking.goodsType || null,
      quantity: booking.quantity || null,
      road_haulage_charges: Number(booking.rate || 0),
      sales_tax_authority: booking.salesTaxAuthority || null,
      detention: Number(booking.detention || 0),
      sales_tax_amount: Number(booking.salesTaxAmount || 0),
      total_amount: Number(booking.totalAmount || 0),
      income_tax_amount: Number(booking.incomeTaxAmount || 0),
      sales_tax_withheld_amount: Number(booking.salesTaxWithheldAmount || 0),
      sales_tax_by_us_amount: Number(booking.salesTaxByUsAmount || 0),
      receivable_amount: Number(booking.receivableAmount || 0),
      payment_term: booking.paymentTerm || null,
      payment_received_date: formatIsoDate(booking.paymentReceivedDate) || null,
      cheque_number: booking.chequeNumber || null,
      status: booking.status === "In Transit" ? "In Transit" : "Delivered",
      payment_status: booking.accountFlow === "Credit" ? "Credit" : "Awaited",
      bilty_path: booking.biltyPath || null,
      remarks: booking.remarks || null,
      updated_at: new Date().toISOString()
    };
  }

  function dataUrlToBlob(dataUrl) {
    const [metadata, content] = String(dataUrl || "").split(",");
    const mimeType = metadata.match(/data:([^;]+)/)?.[1] || "image/jpeg";
    const binary = atob(content || "");
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return new Blob([bytes], { type: mimeType });
  }

async function getPrivateDocumentUrl(path) {
  if (!path) return "";
  const cached = getCachedSignedUrl(path);
  if (cached) return cached;
  const client = getSupabaseClient();
  if (!client) return "";
  const { data, error } = await client.storage.from(SUPABASE_DOCUMENT_BUCKET).createSignedUrl(path, 3600);
  if (error || !data?.signedUrl) return "";
  cacheSignedUrl(path, data.signedUrl);
  return data.signedUrl;
}

function getBookingBiltyFolder(booking) {
  const safeJobNo = String(booking.id || "booking").replace(/[^a-z0-9_-]/gi, "-");
  return `bookings/${safeJobNo}`;
}

async function removeStaleBookingBiltyFiles(booking, keepPath = "") {
  const client = getSupabaseClient();
  if (!client) return;

  const folder = getBookingBiltyFolder(booking);
  const bucket = client.storage.from(SUPABASE_DOCUMENT_BUCKET);
  const { data: files, error } = await bucket.list(folder, { limit: 100 });
  if (error) throw error;

  const paths = (files || [])
    .filter((file) => file?.name && file.name !== ".emptyFolderPlaceholder")
    .map((file) => `${folder}/${file.name}`)
    .filter((path) => path !== keepPath);
  const previousPath = String(booking.biltyPath || "");
  if (previousPath && previousPath !== keepPath && !paths.includes(previousPath)) {
    paths.push(previousPath);
  }
  if (!paths.length) return;

  const { error: removeError } = await bucket.remove(paths);
  if (removeError) throw removeError;
}

async function uploadBookingBilty(booking) {
  const client = getSupabaseClient();
  if (!client) return booking.biltyPath || "";

  const imageData = String(booking.biltyImage || "");

  // Case 1: Bilty image cleared/removed by the user
  if (!imageData) {
    if (booking.biltyPath) {
      try {
        const folder = getBookingBiltyFolder(booking);
        const { data: files } = await client.storage.from(SUPABASE_DOCUMENT_BUCKET).list(folder, { limit: 100 });
        const paths = (files || [])
          .map((file) => `${folder}/${file.name}`)
          .filter((file) => file !== ".emptyFolderPlaceholder");
        if (paths.length) {
          await client.storage.from(SUPABASE_DOCUMENT_BUCKET).remove(paths);
        }
      } catch (err) {
        console.warn("Failed to clear Bilty files from storage:", err.message);
      }
    }
    return "";
  }

  // Case 2: Bilty image is unchanged
  if (imageData.startsWith("http://") || imageData.startsWith("https://")) {
    return booking.biltyPath || "";
  }

  // Case 3: New Bilty image uploaded
  if (imageData.startsWith("data:")) {
    const safeJobNo = String(booking.id || "booking").replace(/[^a-z0-9_-]/gi, "-");
    const path = `bookings/${safeJobNo}/latest.jpg`;
    const { error } = await client.storage.from(SUPABASE_DOCUMENT_BUCKET)
      .upload(path, dataUrlToBlob(imageData), { contentType: "image/jpeg", upsert: true });
    if (error) throw error;
    return path;
  }

  return booking.biltyPath || "";
}

  async function saveBookingToSupabase(booking) {
    const client = getSupabaseClient();
    if (!client) return null;
    const biltyPath = await uploadBookingBilty(booking);
    const payload = mapBookingForSupabase({ ...booking, biltyPath });
    const { data: saved, error } = await client.from("bookings")
      .upsert(payload, { onConflict: "job_no" })
      .select("id,bilty_path")
      .single();
    if (error) throw error;

    const { error: deleteError } = await client.from("booking_containers")
      .delete()
      .eq("booking_id", saved.id);
    if (deleteError) throw deleteError;
    const lines = getBookingContainerLines(booking).map((line, index) => ({
      booking_id: saved.id,
      container_no: line.containerNo,
      container_size: line.size || null,
      truck_no: line.truckNo || null,
      sort_order: index
    }));
  if (lines.length) {
    const { error: linesError } = await client.from("booking_containers").insert(lines);
    if (linesError) throw linesError;
  }
  const savedPath = String(saved.bilty_path || biltyPath || "");
  await removeStaleBookingBiltyFiles(booking, savedPath);
  return { remoteId: saved.id, biltyPath: savedPath };
}

  async function deleteBookingFromSupabase(booking) {
    const client = getSupabaseClient();
    if (!client) return;
    const query = client.from("bookings").delete();
  const { error } = booking.remoteId
    ? await query.eq("id", booking.remoteId)
    : await query.eq("job_no", booking.id);
  if (error) throw error;
  await removeStaleBookingBiltyFiles(booking);
}

  async function hydrateBookingsFromSupabase(store) {
    const client = getSupabaseClient();
    if (!client) return;
    const { data, error } = await client.from("bookings")
      .select("*,booking_containers(*)")
      .order("booking_date", { ascending: false });
    if (error) {
      console.warn("Supabase booking load failed; browser data remains available.", error.message);
      return;
    }
    const mapped = (data || []).map((row) => {
      const booking = mapBookingRowFromSupabase(row);
      booking.biltyImage = getCachedSignedUrl(booking.biltyPath);
      return booking;
    });
    replaceArrayContents(store.bookings, mapped);
    saveStore(store, { skipAudit: true, skipRemote: true });
    if (typeof window.activePageRender === "function") {
      window.activePageRender();
    }
  }

  let operationalSyncTimer = null;
  let operationalSyncQueue = Promise.resolve();

  async function flushOperationalSyncBeforeMutation() {
    clearTimeout(operationalSyncTimer);
    operationalSyncTimer = null;
    await operationalSyncQueue;
  }

  function hasModuleAccessForSync(module) {
    const session = getAdminSession();
    if (!session) return false;
    return session.role === "Super Admin" || normalizeAdminAccess(session.access || [], session.role).includes(module);
  }

  function collectionChanged(previousStore, nextStore, key) {
    if (!previousStore) return false;
    return JSON.stringify(previousStore[key] || []) !== JSON.stringify(nextStore[key] || []);
  }

  function scheduleOperationalSync(previousStore, store) {
    if (!getSupabaseClient() || !getAdminSession() || !previousStore) return;
    const changed = {
      truckExpenses: collectionChanged(previousStore, store, "truckExpenses"),
      equipmentFleet: collectionChanged(previousStore, store, "equipmentFleet"),
      maintenanceJobs: collectionChanged(previousStore, store, "maintenanceJobs"),
      employees: collectionChanged(previousStore, store, "employees"),
      customerKhatas: collectionChanged(previousStore, store, "customerKhatas"),
      vendorKhatas: collectionChanged(previousStore, store, "vendorKhatas"),
      activityLogs: collectionChanged(previousStore, store, "activityLogs")
    };
    if (!Object.values(changed).some(Boolean)) return;
    clearTimeout(operationalSyncTimer);
    const snapshot = structuredClone(store);
    operationalSyncTimer = setTimeout(() => {
      operationalSyncQueue = operationalSyncQueue
        .then(() => syncOperationalStore(snapshot, changed))
        .catch((error) => console.warn("Supabase background sync failed.", error.message));
    }, 250);
  }

  function safeStorageName(value) {
    return String(value || "record").replace(/[^a-z0-9_-]/gi, "-");
  }

  function getStorageRecordFolder(currentPath, folder, recordId) {
    const path = String(currentPath || "").replace(/^\/+|\/+$/g, "");
    if (path.includes("/")) return path.split("/").slice(0, -1).join("/");
    return `${folder}/${safeStorageName(recordId)}`;
  }

  async function removeStoredPathAndFolder(path) {
    const client = getSupabaseClient();
    const normalized = String(path || "").replace(/^\/+|\/+$/g, "");
    if (!client || !normalized) return;
    const folder = normalized.includes("/") ? normalized.split("/").slice(0, -1).join("/") : "";
    const bucket = client.storage.from(SUPABASE_DOCUMENT_BUCKET);
    const paths = new Set([normalized]);
    if (folder) {
      const { data: files } = await bucket.list(folder, { limit: 100 });
      (files || []).forEach((file) => {
        if (file?.name && file.name !== ".emptyFolderPlaceholder") paths.add(`${folder}/${file.name}`);
      });
    }
    await bucket.remove([...paths]);
  }

async function uploadPrivateDataUrl(dataUrl, currentPath, folder, recordId, options = {}) {
  const client = getSupabaseClient();
  if (!client) return currentPath || "";

  // Case 1: Image cleared/removed by the user
  if (!dataUrl) {
    if (currentPath) {
      try {
        await client.storage.from(SUPABASE_DOCUMENT_BUCKET).remove([currentPath]);
        if (options.replaceFolder) {
          const recordFolder = getStorageRecordFolder(currentPath, folder, recordId);
          const { data: files } = await client.storage.from(SUPABASE_DOCUMENT_BUCKET).list(recordFolder, { limit: 100 });
          const obsoletePaths = (files || [])
            .map((file) => `${recordFolder}/${file.name}`)
            .filter((file) => file !== ".emptyFolderPlaceholder");
          if (obsoletePaths.length) {
            await client.storage.from(SUPABASE_DOCUMENT_BUCKET).remove(obsoletePaths);
          }
        }
      } catch (err) {
        console.warn("Error deleting cleared image from storage:", err.message);
      }
    }
    return "";
  }

  // Case 2: Image is unchanged
  if (String(dataUrl).startsWith("http://") || String(dataUrl).startsWith("https://")) {
    return currentPath || "";
  }

  // Case 3: New image uploaded
  if (String(dataUrl).startsWith("data:")) {
    const mimeType = String(dataUrl).match(/data:([^;]+)/)?.[1] || "image/jpeg";
    const extension = mimeType === "application/pdf" ? "pdf" : (mimeType.split("/")[1] || "jpg").replace("jpeg", "jpg");
    const recordFolder = getStorageRecordFolder(options.replaceFolder ? currentPath : "", folder, recordId);
    const path = Boolean(options.replaceFolder)
      ? `${recordFolder}/latest.${extension}`
      : `${recordFolder}/${Date.now()}.${extension}`;
    const bucket = client.storage.from(SUPABASE_DOCUMENT_BUCKET);
    const { error } = await bucket.upload(path, dataUrlToBlob(dataUrl), {
      contentType: mimeType,
      upsert: Boolean(options.replaceFolder)
    });
    if (error) throw error;

    if (options.replaceFolder) {
      const { data: files, error: listError } = await bucket.list(recordFolder, { limit: 100 });
      if (!listError) {
        const obsoletePaths = (files || [])
          .map((file) => `${recordFolder}/${file.name}`)
          .filter((filePath) => filePath !== path);
        if (obsoletePaths.length) {
          await bucket.remove(obsoletePaths).catch((err) => console.warn("Failed to remove obsolete paths", err.message));
        }
      }
    } else if (currentPath && currentPath !== path) {
      await bucket.remove([currentPath]).catch((err) => console.warn("Failed to remove currentPath", err.message));
    }

    return path;
  }

  return currentPath || "";
}

  const TABLE_IMAGE_COLUMNS = {
    truck_jobs: { col: "image_path", folder: "trucks" },
    equipment_fleet: { col: "original_documents_path", folder: "equipment" },
    maintenance_jobs: { col: "image_path", folder: "maintenance" },
    employees: { col: "image_path", folder: "employees" }
  };

  async function syncRows(table, key, rows) {
    const client = getSupabaseClient();
    const imgInfo = TABLE_IMAGE_COLUMNS[table];
    const selectFields = imgInfo ? `${key},${imgInfo.col}` : key;
    const { data: existing, error: readError } = await client.from(table).select(selectFields);
    if (readError) throw readError;
    if (rows.length) {
      const { error } = await client.from(table).upsert(rows, { onConflict: key });
      if (error) throw error;
    }
    const keep = new Set(rows.map((row) => String(row[key])));
    const removedRows = (existing || []).filter((row) => !keep.has(String(row[key])));
    if (removedRows.length) {
      const removedKeys = removedRows.map((row) => row[key]);
      if (imgInfo) {
        for (const row of removedRows) {
          const path = row[imgInfo.col];
          if (path) {
            try {
              await client.storage.from(SUPABASE_DOCUMENT_BUCKET).remove([path]);
            } catch (err) {
              console.warn(`Failed to delete file ${path}:`, err.message);
            }
          }
          const recordFolder = `${imgInfo.folder}/${safeStorageName(row[key])}`;
          try {
            const { data: files } = await client.storage.from(SUPABASE_DOCUMENT_BUCKET).list(recordFolder, { limit: 100 });
            const obsoletePaths = (files || [])
              .map((file) => `${recordFolder}/${file.name}`)
              .filter((file) => file !== ".emptyFolderPlaceholder");
            if (obsoletePaths.length) {
              await client.storage.from(SUPABASE_DOCUMENT_BUCKET).remove(obsoletePaths);
            }
          } catch (err) {
            console.warn(`Failed to clean record folder ${recordFolder}:`, err.message);
          }
        }
      }
      const { error } = await client.from(table).delete().in(key, removedKeys);
      if (error) throw error;
    }
  }

  async function syncTruckJobs(records) {
    const rows = [];
    for (const item of records || []) {
      const imagePath = await uploadPrivateDataUrl(
        item.image,
        item.imagePath,
        "trucks",
        item.jobNo || item.id,
        { replaceFolder: true }
      );
      rows.push({
        job_no: item.jobNo || item.id, import_truck_no: item.truckNo || "-", import_date: formatIsoDate(item.date),
        customer: item.customer || null, import_origin: item.origin || null, import_destination: item.destination || null,
        import_size: item.size || null, import_weight: item.weight || null, cargo_description: item.cargoDescription || null,
        mty_box_freight: Number(item.mtyBoxFreight || 0), mty_broker: item.mtyBroker || null,
        import_freight: Number(item.importFreight || 0), import_broker_commission: Number(item.importBrokerCommission || 0),
        import_broker: item.importBroker || null, import_receivable_amount: Number(item.importReceivedAmount || 0),
        import_cheque_details: item.importChequeDetails || null, import_payment_date: formatIsoDate(item.importPaymentDate) || null,
        import_payment_status: item.importPaymentStatus === "Credit" ? "Credit" : "Awaited",
        mty_payment_date: formatIsoDate(item.mtyPaymentDate) || null, mty_payment_status: item.mtyPaymentStatus === "Credit" ? "Credit" : "Awaited",
        import_remarks: item.importRemarks || null, export_load_date: formatIsoDate(item.exportLoadDate) || null,
        export_truck_no: item.exportTruckNo || null, export_broker: item.exportBroker || null,
        export_freight: Number(item.exportFreight || 0), export_broker_commission: Number(item.exportBrokerCommission || 0),
        export_origin: item.exportOrigin || null, export_destination: item.exportDestination || null,
        export_size: item.exportSize || null, export_weight: item.exportWeight || null,
        export_receivable_amount: Number(item.exportReceivedAmount || 0), export_cheque_details: item.exportChequeDetails || null,
        export_payment_date: formatIsoDate(item.exportPaymentDate) || null, export_payment_status: item.exportPaymentStatus === "Credit" ? "Credit" : "Awaited",
        export_remarks: item.exportRemarks || null, grand_total: Number(item.grandTotal || 0),
        round_trip_expense: Number(item.roundTripExpense || 0), profit_loss: Number(item.profitLoss || 0), image_path: imagePath || null,
        updated_at: new Date().toISOString()
      });
    }
    await syncRows("truck_jobs", "job_no", rows);
  }

  async function syncEquipment(records) {
    const rows = [];
    for (const item of records || []) {
      const path = await uploadPrivateDataUrl(item.documentData, item.documentPath, "equipment", item.truckNo || item.id, { replaceFolder: true });
      rows.push({ truck_no: item.truckNo, type_of_body: item.typeOfBody || null, chassis_no: item.chassisNo, engine_no: item.engineNo, make: item.make, model: item.model,
        mra: item.mra || null, banker: item.banker || null, fitness_expiry: formatIsoDate(item.fitnessExpiry) || null,
        balochistan_permit_expiry: formatIsoDate(item.balochistanPermitExpiry) || null, sindh_permit_expiry: formatIsoDate(item.sindhPermitExpiry) || null,
        kpk_permit_expiry: formatIsoDate(item.kpkPermitExpiry) || null, punjab_permit_expiry: formatIsoDate(item.punjabPermitExpiry) || null,
        tax_paid_up_to: formatIsoDate(item.taxPaidUpTo) || null, original_documents: item.documentName || item.originalDocs || null,
        original_documents_path: path || null, updated_at: new Date().toISOString() });
    }
    await syncRows("equipment_fleet", "truck_no", rows);
  }

  async function syncMaintenance(records) {
    const rows = [];
    for (const item of records || []) {
      const path = await uploadPrivateDataUrl(item.image, item.imagePath, "maintenance", item.id, { replaceFolder: true });
      rows.push({ maintenance_job_no: item.id, truck_no: item.truckNo, complaint_date: formatIsoDate(item.complaintDate),
        repair_date: formatIsoDate(item.repairDate), part_name: item.partName, old_serial_number: item.oldSerialNumber || null,
        new_serial_number: item.newSerialNumber, part_cost: Number(item.partCost || 0), warranty_period: item.warrantyPeriod || null,
        warranty_expiry: formatIsoDate(item.warrantyExpiry) || null, driver_name: item.driverName, image_path: path || null,
        approved_by: item.approvedBy, updated_at: new Date().toISOString() });
    }
    await syncRows("maintenance_jobs", "maintenance_job_no", rows);
  }

  async function syncEmployees(records) {
    const rows = [];
    for (const item of records || []) {
      const path = await uploadPrivateDataUrl(item.image, item.imagePath, "employees", item.id, { replaceFolder: true });
      rows.push({ employee_no: item.id, name: item.name, designation: item.designation, department: item.department || null,
        salary: Number(item.salary || 0), joining_date: formatIsoDate(item.joiningDate), status: item.status === "Inactive" ? "Inactive" : "Active",
        phone: item.phone || null, image_path: path || null, updated_at: new Date().toISOString() });
    }
    await syncRows("employees", "employee_no", rows);
  }

  async function syncAccounts(records, accountType) {
    const client = getSupabaseClient();
    if (!client) return;
    const parties = [];
    for (const account of records || []) {
      if (!account.customer) continue;
      const { data: saved, error } = await client.from("accounts").upsert({
        account_type: accountType,
        party_name: account.customer,
        phone: account.phone || null,
        city: account.city || null,
        opening_balance: Number(account.openingBalance || 0),
        updated_at: new Date().toISOString()
      }, { onConflict: "account_type,party_name" }).select("id").single();
      if (error) throw error;
      if (saved?.id) account.id = saved.id;
      parties.push(account.customer);

      const { data: existingEntries, error: entryReadError } = await client
        .from("account_entries")
        .select("id,image_path,entry_date,entry_type,description,amount")
        .eq("account_id", saved.id);
      if (entryReadError) throw entryReadError;

      const unusedEntries = [...(existingEntries || [])];
      for (const entry of account.entries || []) {
        const matchingIndex = unusedEntries.findIndex((remote) =>
          (entry.imagePath && remote.image_path === entry.imagePath) ||
          (String(entry.id).match(/^[0-9a-f-]{36}$/i) && String(remote.id) === String(entry.id)) ||
          (!entry.imagePath && !remote.image_path &&
            String(remote.entry_date || "") === String(formatIsoDate(entry.date) || "") &&
            String(remote.entry_type || "") === String(entry.type === "Credit" ? "Credit" : "Debit") &&
            Number(remote.amount || 0) === Number(entry.amount || 0) &&
            String(remote.description || "") === String(entry.description || ""))
        );
        const matchingRemote = matchingIndex === -1 ? null : unusedEntries.splice(matchingIndex, 1)[0];
        const path = await uploadPrivateDataUrl(entry.image, entry.imagePath, accountType, `${account.id || saved.id}-${entry.id}`, { replaceFolder: true });
        const row = {
          account_id: saved.id,
          entry_date: formatIsoDate(entry.date) || formatIsoDate(getTodayIsoDate()),
          entry_type: entry.type === "Credit" ? "Credit" : "Debit",
          description: entry.description || "Entry",
          amount: Number(entry.amount || 0),
          image_path: path || null,
          updated_at: new Date().toISOString()
        };
        const result = matchingRemote
          ? await client.from("account_entries").update(row).eq("id", matchingRemote.id).select("id").single()
          : await client.from("account_entries").insert(row).select("id").single();
        if (result.error) throw result.error;
        if (result.data?.id) {
          entry.id = String(result.data.id);
        }
      }

      for (const removedEntry of unusedEntries) {
        if (removedEntry.image_path) {
          await removeStoredPathAndFolder(removedEntry.image_path).catch((err) => console.warn("Failed to delete removed khata entry image:", err.message));
        }
        const { error: deleteEntryError } = await client.from("account_entries").delete().eq("id", removedEntry.id);
        if (deleteEntryError) throw deleteEntryError;
      }
    }
    const { data: existing, error } = await client.from("accounts").select("id,party_name").eq("account_type", accountType);
    if (error) throw error;
    const removed = (existing || []).filter((row) => !parties.includes(row.party_name)).map((row) => row.id);
    if (removed.length) {
      const { data: deletedAccountEntries } = await client.from("account_entries").select("image_path").in("account_id", removed);
      const pathsToDelete = (deletedAccountEntries || []).map((e) => e.image_path).filter(Boolean);
      if (pathsToDelete.length) {
        try {
          await client.storage.from(SUPABASE_DOCUMENT_BUCKET).remove(pathsToDelete);
        } catch (err) {
          console.warn("Failed to delete khata images for deleted accounts:", err.message);
        }
      }
      await client.from("accounts").delete().in("id", removed);
    }
  }

  async function syncActivityLogs(logs) {
    const client = getSupabaseClient();
    const syncedKey = "gtls-supabase-synced-log-ids";
    let syncedIds = new Set();
    try {
      syncedIds = new Set(JSON.parse(localStorage.getItem(syncedKey) || "[]"));
    } catch (_) {}
    const newLogs = (logs || []).filter((log) => !syncedIds.has(log.id));
    if (!newLogs.length) return;
    const sessionUser = getAdminSession();
    const rows = newLogs.map((log) => ({
      user_name: log.userName || sessionUser?.name || "System",
      module: log.module,
      action: (log.action || "UPDATE").toLowerCase(),
      record_id: log.recordId || null,
      description: log.details || "",
      metadata: {
        user_email: log.userEmail || sessionUser?.email || null,
        user_role: log.userRole || sessionUser?.role || null
      }
    }));
    const { data, error } = await client.from("activity_logs").insert(rows).select("id");
    if (!error) {
      newLogs.forEach((l) => syncedIds.add(l.id));
      localStorage.setItem(syncedKey, JSON.stringify(Array.from(syncedIds).slice(-200)));
    }
  }

  async function syncOperationalStore(store, changed = {}) {
    if (!getSupabaseClient()) return;
    const jobs = [];
    if (changed.truckExpenses && hasModuleAccessForSync("truck")) jobs.push(syncTruckJobs(store.truckExpenses));
    if (changed.equipmentFleet && hasModuleAccessForSync("equipment")) jobs.push(syncEquipment(store.equipmentFleet));
    if (changed.maintenanceJobs && hasModuleAccessForSync("maintenance")) jobs.push(syncMaintenance(store.maintenanceJobs));
    if (changed.employees && hasModuleAccessForSync("employee")) jobs.push(syncEmployees(store.employees));
    if (changed.customerKhatas && hasModuleAccessForSync("khata")) jobs.push(syncAccounts(store.customerKhatas, "receivable"));
    if (changed.vendorKhatas && hasModuleAccessForSync("accounts-payable")) jobs.push(syncAccounts(store.vendorKhatas, "payable"));
    if (changed.activityLogs) jobs.push(syncActivityLogs(store.activityLogs || []));
    await Promise.allSettled(jobs);
  }

  async function hydrateOperationalStore(store) {
    const client = getSupabaseClient();
    if (!client) return;
    const load = async (table, allowed, orderField) => {
      if (!allowed) return null;
      let query = client.from(table).select("*");
      if (orderField) query = query.order(orderField, { ascending: false });
      const { data, error } = await query;
      if (error) {
        console.warn(`Supabase load failed for ${table}:`, error.message);
        return null;
      }
      return data || [];
    };
    const [trucks, equipment, maintenance, employees, accounts, logs] = await Promise.all([
      load("truck_jobs", hasModuleAccessForSync("truck") || hasModuleAccessForSync("truck-summary") || hasModuleAccessForSync("completed-truck-summary"), "import_date"),
      load("equipment_fleet", hasModuleAccessForSync("equipment") || hasModuleAccessForSync("maintenance"), "truck_no"),
      load("maintenance_jobs", hasModuleAccessForSync("maintenance"), "repair_date"),
      load("employees", hasModuleAccessForSync("employee"), "joining_date"),
      load("accounts", hasModuleAccessForSync("khata") || hasModuleAccessForSync("accounts-payable"), "party_name"),
      load("activity_logs", hasModuleAccessForSync("activity-logs"), "created_at")
    ]);
    if (Array.isArray(trucks)) {
      const mappedTrucks = trucks.map((r) => ({
        id: r.job_no, jobNo: r.job_no, truckNo: r.import_truck_no,
        date: r.import_date, customer: r.customer || "", origin: r.import_origin || "", destination: r.import_destination || "", size: r.import_size || "",
        weight: r.import_weight || "", cargoDescription: r.cargo_description || "", mtyBoxFreight: Number(r.mty_box_freight || 0), mtyBroker: r.mty_broker || "",
        importFreight: Number(r.import_freight || 0), importBrokerCommission: Number(r.import_broker_commission || 0), importBroker: r.import_broker || "",
        importReceivedAmount: Number(r.import_receivable_amount || 0), importChequeDetails: r.import_cheque_details || "", importPaymentDate: r.import_payment_date || "",
        importPaymentStatus: r.import_payment_status, mtyPaymentDate: r.mty_payment_date || "", mtyPaymentStatus: r.mty_payment_status,
        importRemarks: r.import_remarks || "", exportLoadDate: r.export_load_date || "", exportTruckNo: r.export_truck_no || "", exportBroker: r.export_broker || "",
        exportFreight: Number(r.export_freight || 0), exportBrokerCommission: Number(r.export_broker_commission || 0), exportOrigin: r.export_origin || "",
        exportDestination: r.export_destination || "", exportSize: r.export_size || "", exportWeight: r.export_weight || "",
        exportReceivedAmount: Number(r.export_receivable_amount || 0), exportChequeDetails: r.export_cheque_details || "", exportPaymentDate: r.export_payment_date || "",
        exportPaymentStatus: r.export_payment_status, exportRemarks: r.export_remarks || "", grandTotal: Number(r.grand_total || 0),
        roundTripExpense: Number(r.round_trip_expense || 0), profitLoss: Number(r.profit_loss || 0), imagePath: r.image_path || "",
        image: getCachedSignedUrl(r.image_path)
      }));
      replaceArrayContents(store.truckExpenses, mappedTrucks);
    }

    if (Array.isArray(equipment)) {
      const mappedEquip = equipment.map((r) => ({
        id: r.truck_no, truckNo: r.truck_no, typeOfBody: r.type_of_body || "", chassisNo: r.chassis_no,
        engineNo: r.engine_no, make: r.make, model: r.model, mra: r.mra || "", banker: r.banker || "", fitnessExpiry: r.fitness_expiry || "",
        balochistanPermitExpiry: r.balochistan_permit_expiry || "", sindhPermitExpiry: r.sindh_permit_expiry || "", kpkPermitExpiry: r.kpk_permit_expiry || "",
        punjabPermitExpiry: r.punjab_permit_expiry || "", taxPaidUpTo: r.tax_paid_up_to || "", originalDocs: r.original_documents || "",
        documentName: r.original_documents || "", documentPath: r.original_documents_path || "",
        documentData: getCachedSignedUrl(r.original_documents_path)
      }));
      replaceArrayContents(store.equipmentFleet, mappedEquip);
    }

    if (Array.isArray(maintenance)) {
      const mappedMaint = maintenance.map((r) => ({
        id: r.maintenance_job_no, truckNo: r.truck_no,
        complaintDate: r.complaint_date, repairDate: r.repair_date, partName: r.part_name, oldSerialNumber: r.old_serial_number || "", newSerialNumber: r.new_serial_number,
        partCost: Number(r.part_cost || 0), warrantyPeriod: r.warranty_period || "", warrantyExpiry: r.warranty_expiry || "", driverName: r.driver_name,
        approvedBy: r.approved_by, imagePath: r.image_path || "", image: getCachedSignedUrl(r.image_path)
      }));
      replaceArrayContents(store.maintenanceJobs, mappedMaint);
    }

    if (Array.isArray(employees)) {
      const mappedEmp = employees.map((r) => ({
        id: r.employee_no, name: r.name, designation: r.designation,
        department: r.department || "", salary: Number(r.salary || 0), joiningDate: r.joining_date, status: r.status, phone: r.phone || "",
        imagePath: r.image_path || "", image: getCachedSignedUrl(r.image_path)
      }));
      replaceArrayContents(store.employees, mappedEmp);
    }

    if (Array.isArray(accounts)) {
      const { data: entries, error } = await client.from("account_entries").select("*").order("entry_date", { ascending: true });
      if (!error) {
        const receivableAccounts = accounts.filter((a) => a.account_type === "receivable");
        const payableAccounts = accounts.filter((a) => a.account_type === "payable");
        const mapAccount = (account) => ({
          id: account.id,
          customer: account.party_name,
          phone: account.phone || "",
          city: account.city || "",
          openingBalance: Number(account.opening_balance || 0),
          entries: (entries || []).filter((entry) => String(entry.account_id) === String(account.id))
            .map((entry) => ({
              id: String(entry.id),
              date: entry.entry_date,
              type: entry.entry_type,
              description: entry.description,
              amount: Number(entry.amount || 0),
              imagePath: entry.image_path || "",
              image: getCachedSignedUrl(entry.image_path)
            }))
        });
        replaceArrayContents(store.customerKhatas, receivableAccounts.map(mapAccount));
        replaceArrayContents(store.vendorKhatas, payableAccounts.map(mapAccount));
      } else {
        replaceArrayContents(store.customerKhatas, []);
        replaceArrayContents(store.vendorKhatas, []);
      }
    }

    if (Array.isArray(logs)) {
      const mappedLogs = logs.map((r) => ({
        id: `LOG-${r.id}`, timestamp: r.created_at, userName: r.user_name || "",
        userEmail: r.metadata?.user_email || "", userRole: r.metadata?.user_role || "", module: r.module, action: r.action.toUpperCase(),
        recordId: r.record_id || "-", details: r.description || ""
      }));
      replaceArrayContents(store.activityLogs, mappedLogs);
    }

    saveStore(store, { skipAudit: true, skipRemote: true });
    if (typeof window.activePageRender === "function") {
      window.activePageRender();
    }
  }

  function getPageFile(page) {
    return `${page === "employee" ? "employees" : page}.html`;
  }
  const appPages = new Set([
    "dashboard", "booking", "ledger", "truck", "truck-summary", 
    "completed-truck-summary", "equipment", "maintenance", 
    "employees", "employee", "khata", "accounts-payable", "admin", "activity-logs"
  ]);

  function isAppPage(page) {
    return appPages.has(page);
  }

  function getSkeletonLoader(page) {
    let contentHtml = "";

    if (page === "dashboard") {
      contentHtml = `
        <div class="audit-summary" style="margin-bottom: 20px;">
          <div class="skeleton-card" style="min-height: 88px; padding: 13px 15px;"><div class="skeleton-text skeleton-shimmer" style="width: 80px; height: 11px; margin-bottom: 9px; background: #e8d8c7;"></div><div class="skeleton-text skeleton-shimmer" style="width: 50px; height: 25px; margin: 0; background: #ebdccb;"></div></div>
          <div class="skeleton-card" style="min-height: 88px; padding: 13px 15px;"><div class="skeleton-text skeleton-shimmer" style="width: 80px; height: 11px; margin-bottom: 9px; background: #e8d8c7;"></div><div class="skeleton-text skeleton-shimmer" style="width: 50px; height: 25px; margin: 0; background: #ebdccb;"></div></div>
          <div class="skeleton-card" style="min-height: 88px; padding: 13px 15px;"><div class="skeleton-text skeleton-shimmer" style="width: 80px; height: 11px; margin-bottom: 9px; background: #e8d8c7;"></div><div class="skeleton-text skeleton-shimmer" style="width: 50px; height: 25px; margin: 0; background: #ebdccb;"></div></div>
          <div class="skeleton-card" style="min-height: 88px; padding: 13px 15px;"><div class="skeleton-text skeleton-shimmer" style="width: 80px; height: 11px; margin-bottom: 9px; background: #e8d8c7;"></div><div class="skeleton-text skeleton-shimmer" style="width: 50px; height: 25px; margin: 0; background: #ebdccb;"></div></div>
          <div class="skeleton-card" style="min-height: 88px; padding: 13px 15px;"><div class="skeleton-text skeleton-shimmer" style="width: 80px; height: 11px; margin-bottom: 9px; background: #e8d8c7;"></div><div class="skeleton-text skeleton-shimmer" style="width: 50px; height: 25px; margin: 0; background: #ebdccb;"></div></div>
        </div>
        <div style="margin-bottom: 20px;">
          <div class="skeleton-text skeleton-shimmer" style="width: 180px; height: 20px; margin-bottom: 12px; background: #e8d8c7;"></div>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
            <div class="skeleton-card" style="padding: 12px;"><div class="skeleton-text skeleton-shimmer" style="width: 100px; height: 10px; background: #e8d8c7;"></div><div class="skeleton-text skeleton-shimmer" style="width: 75px; height: 22px; margin: 0; background: #ebdccb;"></div></div>
            <div class="skeleton-card" style="padding: 12px;"><div class="skeleton-text skeleton-shimmer" style="width: 100px; height: 10px; background: #e8d8c7;"></div><div class="skeleton-text skeleton-shimmer" style="width: 75px; height: 22px; margin: 0; background: #ebdccb;"></div></div>
            <div class="skeleton-card" style="padding: 12px;"><div class="skeleton-text skeleton-shimmer" style="width: 100px; height: 10px; background: #e8d8c7;"></div><div class="skeleton-text skeleton-shimmer" style="width: 75px; height: 22px; margin: 0; background: #ebdccb;"></div></div>
            <div class="skeleton-card" style="padding: 12px;"><div class="skeleton-text skeleton-shimmer" style="width: 100px; height: 10px; background: #e8d8c7;"></div><div class="skeleton-text skeleton-shimmer" style="width: 75px; height: 22px; margin: 0; background: #ebdccb;"></div></div>
          </div>
        </div>
        <div style="margin-bottom: 20px;">
          <div class="skeleton-text skeleton-shimmer" style="width: 180px; height: 20px; margin-bottom: 12px; background: #e8d8c7;"></div>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
            <div class="skeleton-card" style="padding: 12px;"><div class="skeleton-text skeleton-shimmer" style="width: 100px; height: 10px; background: #e8d8c7;"></div><div class="skeleton-text skeleton-shimmer" style="width: 75px; height: 22px; margin: 0; background: #ebdccb;"></div></div>
            <div class="skeleton-card" style="padding: 12px;"><div class="skeleton-text skeleton-shimmer" style="width: 100px; height: 10px; background: #e8d8c7;"></div><div class="skeleton-text skeleton-shimmer" style="width: 75px; height: 22px; margin: 0; background: #ebdccb;"></div></div>
            <div class="skeleton-card" style="padding: 12px;"><div class="skeleton-text skeleton-shimmer" style="width: 100px; height: 10px; background: #e8d8c7;"></div><div class="skeleton-text skeleton-shimmer" style="width: 75px; height: 22px; margin: 0; background: #ebdccb;"></div></div>
            <div class="skeleton-card" style="padding: 12px;"><div class="skeleton-text skeleton-shimmer" style="width: 100px; height: 10px; background: #e8d8c7;"></div><div class="skeleton-text skeleton-shimmer" style="width: 75px; height: 22px; margin: 0; background: #ebdccb;"></div></div>
          </div>
        </div>
        <div class="table-wrap">
          <table class="statement-table">
            <thead>
              <tr>
                <th><div class="skeleton-text skeleton-shimmer" style="width: 60px; height: 12px; margin: 0; background: #e8d8c7;"></div></th>
                <th><div class="skeleton-text skeleton-shimmer" style="width: 80px; height: 12px; margin: 0; background: #e8d8c7;"></div></th>
                <th><div class="skeleton-text skeleton-shimmer" style="width: 100px; height: 12px; margin: 0; background: #e8d8c7;"></div></th>
                <th><div class="skeleton-text skeleton-shimmer" style="width: 90px; height: 12px; margin: 0; background: #e8d8c7;"></div></th>
                <th><div class="skeleton-text skeleton-shimmer" style="width: 70px; height: 12px; margin: 0; background: #e8d8c7;"></div></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><div class="skeleton-text skeleton-shimmer" style="width: 50px; height: 14px; margin: 0; background: rgba(240, 230, 218, 0.5);"></div></td>
                <td><div class="skeleton-text skeleton-shimmer" style="width: 70px; height: 14px; margin: 0; background: rgba(240, 230, 218, 0.5);"></div></td>
                <td><div class="skeleton-text skeleton-shimmer" style="width: 90px; height: 14px; margin: 0; background: rgba(240, 230, 218, 0.5);"></div></td>
                <td><div class="skeleton-text skeleton-shimmer" style="width: 85px; height: 14px; margin: 0; background: rgba(240, 230, 218, 0.5);"></div></td>
                <td><div class="skeleton-text skeleton-shimmer" style="width: 60px; height: 14px; margin: 0; background: rgba(240, 230, 218, 0.5);"></div></td>
              </tr>
              <tr>
                <td><div class="skeleton-text skeleton-shimmer" style="width: 50px; height: 14px; margin: 0; background: rgba(240, 230, 218, 0.5);"></div></td>
                <td><div class="skeleton-text skeleton-shimmer" style="width: 70px; height: 14px; margin: 0; background: rgba(240, 230, 218, 0.5);"></div></td>
                <td><div class="skeleton-text skeleton-shimmer" style="width: 90px; height: 14px; margin: 0; background: rgba(240, 230, 218, 0.5);"></div></td>
                <td><div class="skeleton-text skeleton-shimmer" style="width: 85px; height: 14px; margin: 0; background: rgba(240, 230, 218, 0.5);"></div></td>
                <td><div class="skeleton-text skeleton-shimmer" style="width: 60px; height: 14px; margin: 0; background: rgba(240, 230, 218, 0.5);"></div></td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    } else if (page === "booking") {
      contentHtml = `
        <div class="form-grid" style="border: 1px solid var(--line); border-radius: 20px; background: var(--paper); padding: 24px; box-shadow: var(--shadow); margin-bottom: 20px;">
          ${Array.from({ length: 24 }).map(() => `
            <div class="field quarter">
              <div class="skeleton-text skeleton-shimmer" style="width: 90px; height: 12px; margin-bottom: 6px; background: #e8d8c7;"></div>
              <div class="skeleton-shimmer" style="height: 44px; border-radius: 8px; border: 1px solid var(--line); background: #fffaf4;"></div>
            </div>
          `).join("")}
          <div class="field full">
            <div class="skeleton-text skeleton-shimmer" style="width: 100px; height: 12px; margin-bottom: 6px; background: #e8d8c7;"></div>
            <div class="skeleton-shimmer" style="height: 120px; border-radius: 12px; border: 1px solid var(--line); background: #fffdf9;"></div>
          </div>
          <div class="field full">
            <div class="skeleton-text skeleton-shimmer" style="width: 90px; height: 12px; margin-bottom: 6px; background: #e8d8c7;"></div>
            <div class="skeleton-shimmer" style="height: 96px; border-radius: 8px; border: 1px solid var(--line); background: #fffaf4;"></div>
          </div>
        </div>
      `;
    } else if (["ledger", "khata", "accounts-payable", "completed-truck-summary", "truck-summary", "equipment", "activity-logs"].includes(page)) {
      contentHtml = `
        <div class="audit-summary" style="margin-bottom: 20px;">
          <div class="skeleton-card" style="min-height: 88px; padding: 13px 15px;"><div class="skeleton-text skeleton-shimmer" style="width: 80px; height: 11px; margin-bottom: 9px; background: #e8d8c7;"></div><div class="skeleton-text skeleton-shimmer" style="width: 60px; height: 25px; margin: 0; background: #ebdccb;"></div></div>
          <div class="skeleton-card" style="min-height: 88px; padding: 13px 15px;"><div class="skeleton-text skeleton-shimmer" style="width: 80px; height: 11px; margin-bottom: 9px; background: #e8d8c7;"></div><div class="skeleton-text skeleton-shimmer" style="width: 60px; height: 25px; margin: 0; background: #ebdccb;"></div></div>
          <div class="skeleton-card" style="min-height: 88px; padding: 13px 15px;"><div class="skeleton-text skeleton-shimmer" style="width: 80px; height: 11px; margin-bottom: 9px; background: #e8d8c7;"></div><div class="skeleton-text skeleton-shimmer" style="width: 60px; height: 25px; margin: 0; background: #ebdccb;"></div></div>
          <div class="skeleton-card" style="min-height: 88px; padding: 13px 15px;"><div class="skeleton-text skeleton-shimmer" style="width: 80px; height: 11px; margin-bottom: 9px; background: #e8d8c7;"></div><div class="skeleton-text skeleton-shimmer" style="width: 60px; height: 25px; margin: 0; background: #ebdccb;"></div></div>
        </div>
        <div style="display: flex; gap: 12px; align-items: flex-end; margin-bottom: 20px;">
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div class="skeleton-text skeleton-shimmer" style="width: 70px; height: 12px; margin: 0; background: #e8d8c7;"></div>
            <div class="skeleton-shimmer" style="width: 220px; height: 44px; border-radius: 8px; border: 1px solid var(--line); background: #fff;"></div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div class="skeleton-text skeleton-shimmer" style="width: 70px; height: 12px; margin: 0; background: #e8d8c7;"></div>
            <div class="skeleton-shimmer" style="width: 150px; height: 44px; border-radius: 8px; border: 1px solid var(--line); background: #fff;"></div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div class="skeleton-text skeleton-shimmer" style="width: 70px; height: 12px; margin: 0; background: #e8d8c7;"></div>
            <div class="skeleton-shimmer" style="width: 150px; height: 44px; border-radius: 8px; border: 1px solid var(--line); background: #fff;"></div>
          </div>
        </div>
        <div class="table-wrap">
          <table class="statement-table">
            <thead>
              <tr>
                <th><div class="skeleton-text skeleton-shimmer" style="width: 60px; height: 12px; margin: 0; background: #e8d8c7;"></div></th>
                <th><div class="skeleton-text skeleton-shimmer" style="width: 120px; height: 12px; margin: 0; background: #e8d8c7;"></div></th>
                <th><div class="skeleton-text skeleton-shimmer" style="width: 80px; height: 12px; margin: 0; background: #e8d8c7;"></div></th>
                <th><div class="skeleton-text skeleton-shimmer" style="width: 90px; height: 12px; margin: 0; background: #e8d8c7;"></div></th>
                <th><div class="skeleton-text skeleton-shimmer" style="width: 100px; height: 12px; margin: 0; background: #e8d8c7;"></div></th>
                <th><div class="skeleton-text skeleton-shimmer" style="width: 70px; height: 12px; margin: 0; background: #e8d8c7;"></div></th>
              </tr>
            </thead>
            <tbody>
              ${Array.from({ length: 6 }).map(() => `
                <tr>
                  <td><div class="skeleton-text skeleton-shimmer" style="width: 60px; height: 14px; margin: 0; background: rgba(240, 230, 218, 0.5);"></div></td>
                  <td><div class="skeleton-text skeleton-shimmer" style="width: 110px; height: 14px; margin: 0; background: rgba(240, 230, 218, 0.5);"></div></td>
                  <td><div class="skeleton-text skeleton-shimmer" style="width: 70px; height: 14px; margin: 0; background: rgba(240, 230, 218, 0.5);"></div></td>
                  <td><div class="skeleton-text skeleton-shimmer" style="width: 80px; height: 14px; margin: 0; background: rgba(240, 230, 218, 0.5);"></div></td>
                  <td><div class="skeleton-text skeleton-shimmer" style="width: 90px; height: 14px; margin: 0; background: rgba(240, 230, 218, 0.5);"></div></td>
                  <td><div class="skeleton-text skeleton-shimmer" style="width: 60px; height: 14px; margin: 0; background: rgba(240, 230, 218, 0.5);"></div></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `;
    } else {
      contentHtml = `
        <div class="form-grid" style="border: 1px solid var(--line); border-radius: 20px; background: var(--paper); padding: 24px; box-shadow: var(--shadow); margin-bottom: 20px;">
          ${Array.from({ length: 4 }).map(() => `
            <div class="field quarter">
              <div class="skeleton-text skeleton-shimmer" style="width: 90px; height: 12px; margin-bottom: 6px; background: #e8d8c7;"></div>
              <div class="skeleton-shimmer" style="height: 44px; border-radius: 8px; border: 1px solid var(--line); background: #fffaf4;"></div>
            </div>
          `).join("")}
        </div>
        <div class="table-wrap">
          <table class="statement-table">
            <thead>
              <tr>
                <th><div class="skeleton-text skeleton-shimmer" style="width: 60px; height: 12px; margin: 0; background: #e8d8c7;"></div></th>
                <th><div class="skeleton-text skeleton-shimmer" style="width: 100px; height: 12px; margin: 0; background: #e8d8c7;"></div></th>
                <th><div class="skeleton-text skeleton-shimmer" style="width: 80px; height: 12px; margin: 0; background: #e8d8c7;"></div></th>
                <th><div class="skeleton-text skeleton-shimmer" style="width: 70px; height: 12px; margin: 0; background: #e8d8c7;"></div></th>
              </tr>
            </thead>
            <tbody>
              ${Array.from({ length: 4 }).map(() => `
                <tr>
                  <td><div class="skeleton-text skeleton-shimmer" style="width: 50px; height: 14px; margin: 0; background: rgba(240, 230, 218, 0.5);"></div></td>
                  <td><div class="skeleton-text skeleton-shimmer" style="width: 90px; height: 14px; margin: 0; background: rgba(240, 230, 218, 0.5);"></div></td>
                  <td><div class="skeleton-text skeleton-shimmer" style="width: 75px; height: 14px; margin: 0; background: rgba(240, 230, 218, 0.5);"></div></td>
                  <td><div class="skeleton-text skeleton-shimmer" style="width: 60px; height: 14px; margin: 0; background: rgba(240, 230, 218, 0.5);"></div></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `;
    }

    return `
      <section class="hero dashboard-hero skeleton-shimmer" style="margin-bottom: 16px; height: 60px; border-radius: 16px; opacity: 0.8;"></section>
      <section class="screen" style="background: transparent; border: none; box-shadow: none; padding: 0;">
        <div class="skeleton-text title skeleton-shimmer" style="margin-bottom: 20px; width: 220px; height: 28px; background: #ebdccb;"></div>
        ${contentHtml}
      </section>
    `;
  }

  let activeNavigationController = null;

  async function navigateDynamically(url, targetPage) {
    if (activeNavigationController) {
      activeNavigationController.abort();
    }
    activeNavigationController = new AbortController();
    const { signal } = activeNavigationController;

    const mainEl = document.querySelector(".main");
    if (!mainEl) {
      window.location.href = url;
      return;
    }

    mainEl.style.transition = "opacity 0.15s ease-in-out, transform 0.15s ease-in-out";
    mainEl.style.opacity = "0";
    mainEl.style.transform = "translateY(-6px)";

    let progressBar = document.querySelector(".nav-progress-bar");
    if (!progressBar) {
      progressBar = document.createElement("div");
      progressBar.className = "nav-progress-bar";
      document.body.appendChild(progressBar);
    }
    progressBar.style.width = "0%";
    progressBar.style.opacity = "1";
    
    mainEl.innerHTML = getSkeletonLoader(targetPage);
    mainEl.style.transform = "translateY(0)";
    mainEl.style.opacity = "1";
    
    const panel = document.querySelector("[data-notification-panel]");
    if (panel) panel.hidden = true;
    
    document.body.dataset.page = targetPage;
    setActiveNav();

    if (progressBar) progressBar.style.width = "70%";

    try {
      const response = await fetch(url, { signal });
      if (!response.ok) throw new Error("Failed to load page content.");
      const htmlText = await response.text();

      if (progressBar) {
        progressBar.style.width = "100%";
        setTimeout(() => {
          if (progressBar) progressBar.style.opacity = "0";
        }, 150);
      }

      const parser = new DOMParser();
      const newDoc = parser.parseFromString(htmlText, "text/html");

      const newMainEl = newDoc.querySelector(".main");
      if (!newMainEl) {
        window.location.href = url;
        return;
      }

      mainEl.innerHTML = newMainEl.innerHTML;
      document.title = newDoc.title || "GTLS Transport";
      history.pushState({ page: targetPage, url }, "", url);

      const store = loadStore();
      
      if (!await enforceSoftwareAccess(targetPage)) {
        return;
      }

      initializePage(store, targetPage);

      mainEl.style.transition = "opacity 0.2s ease-in-out, transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)";
      mainEl.style.opacity = "1";
      mainEl.style.transform = "translateY(0)";

    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Navigation request was aborted.");
        return;
      }
      console.error("Dynamic navigation error:", error);
      window.location.href = url;
    } finally {
      if (activeNavigationController && activeNavigationController.signal === signal) {
        activeNavigationController = null;
      }
    }
  }

  function navigateWithTransition(url, options = {}) {
    if (!url) return;
    
    const cleanUrl = url.split("?")[0].split("#")[0];
    let targetPage = cleanUrl.replace(".html", "").split("/").pop();
    if (targetPage === "employees") targetPage = "employee";
    if (targetPage === "index" || targetPage === "") targetPage = "signin";

    const currentPage = document.body.dataset.page;

    if (!options.immediate && isAppPage(currentPage) && isAppPage(targetPage)) {
      navigateDynamically(url, targetPage);
    } else {
      document.body.classList.add("page-navigating");
      setTimeout(() => {
        window.location.href = url;
      }, 200);
    }
  }

  function markPageReady() {
    document.body.classList.remove("page-navigating");
    document.body.classList.add("page-loaded");
  }

  function bindPageTransitions() {
    document.querySelectorAll('a[href$=".html"]').forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;
      if (!document.head.querySelector(`link[rel="prefetch"][href="${href}"]`)) {
        const prefetch = document.createElement("link");
        prefetch.rel = "prefetch";
        prefetch.href = href;
        document.head.appendChild(prefetch);
      }
      link.addEventListener("click", (event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        navigateWithTransition(href);
      });
    });
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) {
        document.body.classList.remove("page-navigating");
        document.body.classList.add("page-loaded");
      }
    });

    if (!window._popstateBound) {
      window._popstateBound = true;
      window.addEventListener("popstate", async (event) => {
        if (event.state && event.state.page) {
          const page = event.state.page;
          const url = event.state.url || getPageFile(page);
          if (isAppPage(page)) {
            await navigateDynamically(url, page);
          } else {
            window.location.href = url;
          }
        } else {
          const url = window.location.pathname.split("/").pop() || "dashboard.html";
          let targetPage = url.replace(".html", "").split("/").pop();
          if (targetPage === "employees") targetPage = "employee";
          if (targetPage === "index" || targetPage === "") targetPage = "signin";
          if (isAppPage(targetPage)) {
            await navigateDynamically(window.location.href, targetPage);
          } else {
            window.location.href = window.location.href;
          }
        }
      });
    }
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
      link.setAttribute("aria-hidden", String(!isAllowed));
      link.tabIndex = isAllowed ? 0 : -1;
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

  function requestDeleteConfirmation({ title = "Delete record?", message = "This action cannot be undone." } = {}) {
    let modal = document.querySelector("[data-delete-modal]");
    if (!modal) {
      modal = document.createElement("div");
      modal.className = "confirm-modal";
      modal.dataset.deleteModal = "";
      modal.hidden = true;
      modal.innerHTML = `
        <div class="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-description">
          <div class="confirm-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"></path>
            </svg>
          </div>
          <h2 id="delete-title">Delete record?</h2>
          <p id="delete-description">This action cannot be undone.</p>
          <div class="confirm-actions">
            <button class="btn" type="button" data-cancel-delete>Cancel</button>
            <button class="btn danger" type="button" data-confirm-delete>Delete</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const previousFocus = document.activeElement;
    const titleElement = modal.querySelector("#delete-title");
    const descriptionElement = modal.querySelector("#delete-description");
    const cancelButton = modal.querySelector("[data-cancel-delete]");
    const confirmButton = modal.querySelector("[data-confirm-delete]");
    titleElement.textContent = title;
    descriptionElement.textContent = message;
    modal.hidden = false;
    document.body.classList.add("confirm-modal-open");

    return new Promise((resolve) => {
      let settled = false;
      const finish = (confirmed) => {
        if (settled) return;
        settled = true;
        modal.hidden = true;
        document.body.classList.remove("confirm-modal-open");
        cancelButton.onclick = null;
        confirmButton.onclick = null;
        modal.onclick = null;
        document.removeEventListener("keydown", onKeyDown);
        if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
        resolve(confirmed);
      };
      const onKeyDown = (event) => {
        if (event.key === "Escape") finish(false);
      };
      cancelButton.onclick = () => finish(false);
      confirmButton.onclick = () => finish(true);
      modal.onclick = (event) => {
        if (event.target === modal) finish(false);
      };
      document.addEventListener("keydown", onKeyDown);
      cancelButton.focus();
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
    const taxBreakdown = calculateBookingTaxBreakdown(rate, detention, booking.salesTaxAuthority, booking.salesTaxWithholding);
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
      salesTaxWithholding: String(booking.salesTaxWithholding ?? taxBreakdown.salesTaxWithholding),
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

  function calculateBookingTaxBreakdown(rate, detention, authority, withholding = "20") {
    const roadHaulageCharges = Number(rate || 0);
    const detentionCharges = Number(detention || 0);
    const withoutIncomeTax = String(authority || "").trim() === "Without Income Tax";
    const taxableBase = roundAmount(roadHaulageCharges);
    const salesTaxAmount = shouldApplySalesTax(authority) ? roundAmount(taxableBase * 0.15) : 0;
    const totalAmount = roundAmount(taxableBase + salesTaxAmount);
    const incomeTaxAmount = withoutIncomeTax ? 0 : roundAmount(totalAmount * 0.07);

    let withholdingPercent = 20;
    if (withholding !== undefined && withholding !== null && withholding !== "") {
      const match = String(withholding).match(/\d+/);
      if (match) withholdingPercent = Number(match[0]);
    }
    const withheldRatio = withholdingPercent / 100;
    const byUsRatio = Math.max(0, 1 - withheldRatio);

    const salesTaxWithheldAmount = roundAmount(salesTaxAmount * withheldRatio);
    const salesTaxByUsAmount = roundAmount(salesTaxAmount * byUsRatio);
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
      salesTaxWithholding: String(withholdingPercent),
      salesTaxWithheldPercent: withholdingPercent,
      salesTaxByUsPercent: Math.round(byUsRatio * 100),
      salesTaxWithheldAmount,
      salesTaxByUsAmount,
      receivableAmount
    };
  }

  function calculateBookingTotalAmount(rate, detention, authority, withholding) {
    return calculateBookingTaxBreakdown(rate, detention, authority, withholding).totalAmount;
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
        : `
          <div class="notification-empty">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <p>All clear! No payment terms have expired.</p>
          </div>
        `;
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

    function getExpirySummary(equipmentFleet, field) {
      return equipmentFleet.reduce((summary, item) => {
        const state = getDocumentExpiryState(item[field]);
        if (state === "expired") summary.expired += 1;
        if (state === "due") summary.due += 1;
        summary.alerts = summary.expired + summary.due;
        return summary;
      }, { alerts: 0, expired: 0, due: 0 });
    }

    function renderDashboard() {
      const bookings = Array.isArray(store.bookings) ? store.bookings : [];
      const truckJobs = (Array.isArray(store.truckExpenses) ? store.truckExpenses : []).filter((item) => item.jobNo);
      const equipmentFleet = Array.isArray(store.equipmentFleet) ? store.equipmentFleet : [];
      const customerAccounts = Array.isArray(store.customerKhatas) ? store.customerKhatas : [];
      const supplierAccounts = Array.isArray(store.vendorKhatas) ? store.vendorKhatas : [];

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
        fitnessAlerts: getExpirySummary(equipmentFleet, "fitnessExpiry"),
        balochistanPermitAlerts: getExpirySummary(equipmentFleet, "balochistanPermitExpiry"),
        sindhPermitAlerts: getExpirySummary(equipmentFleet, "sindhPermitExpiry"),
        kpkPermitAlerts: getExpirySummary(equipmentFleet, "kpkPermitExpiry"),
        punjabPermitAlerts: getExpirySummary(equipmentFleet, "punjabPermitExpiry")
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
      if (typeof window.refreshPaymentNotifications === "function") window.refreshPaymentNotifications();

      const bookingsBody = document.querySelector("[data-bookings-preview]");
      if (bookingsBody) {
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
      }

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

    renderDashboard();
    window.activePageRender = renderDashboard;
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
    const salesTaxWithholdingField = form.querySelector("[name='salesTaxWithholding']");
    const salesTaxWithheldLabel = form.querySelector("[data-label-st-withheld]");
    const salesTaxByUsLabel = form.querySelector("[data-label-st-by-us]");
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
    let biltyStoragePath = "";
    let biltyImagePromise = Promise.resolve("");
    const refreshPaymentNotifications = () => {
      if (typeof window.refreshPaymentNotifications === "function") window.refreshPaymentNotifications();
    };

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
      const breakdown = calculateBookingTaxBreakdown(
        rateField.value,
        detentionField.value,
        salesTaxAuthorityField.value,
        salesTaxWithholdingField?.value
      );
      salesTaxAmountField.value = String(breakdown.salesTaxAmount);
      totalAmountField.value = String(breakdown.totalAmount);
      incomeTaxAmountField.value = String(breakdown.incomeTaxAmount);
      salesTaxWithheldAmountField.value = String(breakdown.salesTaxWithheldAmount);
      salesTaxByUsAmountField.value = String(breakdown.salesTaxByUsAmount);
      receivableAmountField.value = String(breakdown.receivableAmount);

      if (salesTaxWithheldLabel) {
        salesTaxWithheldLabel.textContent = `Sale Tax With Held ${breakdown.salesTaxWithheldPercent}%`;
      }
      if (salesTaxByUsLabel) {
        salesTaxByUsLabel.textContent = `Sale Tax ${breakdown.salesTaxByUsPercent}% by us`;
      }
    }

    function resetForm() {
      form.reset();
      biltyInput.value = "";
      biltyImagePromise = Promise.resolve("");
      biltyStoragePath = "";
      setBiltyPreview("");
      if (form.elements.bookingNo) form.elements.bookingNo.value = "";
      if (form.elements.invoiceNo) form.elements.invoiceNo.value = "";
      syncBookingDate(getTodayIsoDate());
      form.elements.category.value = "Inter City Transport";
      form.elements.accountFlow.value = "Awaited";
      form.elements.paymentTerm.value = "30 Days";
      form.elements.rate.value = "";
      form.elements.gatePass.value = "";
      form.elements.detention.value = "0";
      form.elements.salesTaxAuthority.value = "Sindh Revenue Board";
      if (salesTaxWithholdingField) salesTaxWithholdingField.value = "20";
      if (form.elements.remarks) form.elements.remarks.value = "";
      syncTotalAmount();
      statusField.value = "Delivered";
      renderContainerRows([
        {
          containerNo: "",
          size: "40 FT",
          truckNo: ""
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
            <td>${text(item.invoiceNo)}</td>
            <td>${formatShortDate(item.date)}</td>
            <td>${text(item.blNo)}</td>
            <td>${text(item.gatePass)}</td>
            <td>${text(item.customer)}</td>
            <td>${text(item.consignee)}</td>
            <td>${text(item.route)}</td>
            <td>${text(item.origin)}</td>
            <td>${text(item.destination)}</td>
            <td>${text(item.category)}</td>
            <td>${text(item.goodsType)}</td>
            <td>${text(item.quantity)}</td>
            <td>${money(item.rate)}</td>
            <td>${text(item.salesTaxAuthority)}</td>
            <td>${money(item.detention)}</td>
            <td>${money(item.salesTaxAmount)}</td>
            <td>${money(item.totalAmount)}</td>
            <td>${money(item.incomeTaxAmount)}</td>
            <td>${money(item.salesTaxWithheldAmount)}</td>
            <td>${money(item.salesTaxByUsAmount)}</td>
            <td>${money(item.receivableAmount)}</td>
            <td>${text(item.paymentTerm)}</td>
            <td>${text(item.paymentReceivedDate ? formatShortDate(item.paymentReceivedDate) : "-")}</td>
            <td>${text(item.chequeNumber || "-")}</td>
            <td>${renderStackedCell(lines.map((line) => text(line.containerNo)))}</td>
            <td>${renderStackedCell(lines.map((line) => text(line.size)))}</td>
            <td>${renderStackedCell(lines.map((line) => text(line.truckNo)))}</td>
            <td><span class="badge ${item.status === "In Transit" ? "good" : "warn"}">${text(item.status)}</span></td>
            <td><span class="badge ${item.accountFlow === "Credit" ? "good" : "bad"}">${text(item.accountFlow || "Awaited")}</span></td>
            <td>${item.biltyImage ? `
              <button class="bilty-thumbnail" type="button" data-view-bilty="${escapeHtml(item.id)}" aria-label="View Bilty image" title="View Bilty">
                <img src="${escapeHtml(item.biltyImage)}" alt="Bilty thumbnail" />
              </button>
            ` : item.biltyPath ? `
              <button class="bilty-thumbnail" type="button" data-view-bilty="${escapeHtml(item.id)}" aria-label="View Bilty image" title="View Bilty" data-lazy-bilty="${escapeHtml(item.biltyPath)}">
                <span class="loading-placeholder">...</span>
              </button>
            ` : "-"}</td>
            <td>${text(item.remarks)}</td>
            <td>
              <div class="table-actions">
                <button class="btn small" data-download-invoice="${item.id}">Invoice</button>
                <button class="btn small" data-edit-booking="${item.id}">Edit</button>
              </div>
            </td>
          </tr>
        `;
      }).join("");

      body.querySelectorAll("[data-lazy-bilty]").forEach((btn) => {
        const path = btn.getAttribute("data-lazy-bilty");
        const bookingId = btn.getAttribute("data-view-bilty");
        const booking = bookings.find((b) => b.id === bookingId);
        getPrivateDocumentUrl(path).then((url) => {
          if (url) {
            if (booking) booking.biltyImage = url;
            btn.innerHTML = `<img src="${escapeHtml(url)}" alt="Bilty thumbnail" />`;
            btn.removeAttribute("data-lazy-bilty");
          }
        });
      });
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
      biltyStoragePath = String(item.biltyPath || "");
      setBiltyPreview(item.biltyImage);
      editingId = item.id;
      form.querySelector("[data-submit-label]").textContent = "Update Booking";
    }

    datePickerButton.addEventListener("click", () => {
      if (!datePickerField.value || !dateTextField.value) {
        syncBookingDate(getTodayIsoDate());
      }
      if (typeof datePickerField.showPicker === "function") datePickerField.showPicker();
      else datePickerField.click();
    });

    dateTextField.addEventListener("focus", () => {
      if (!dateTextField.value) {
        syncBookingDate(getTodayIsoDate());
      }
    });

    dateTextField.addEventListener("click", () => {
      if (!dateTextField.value) {
        syncBookingDate(getTodayIsoDate());
      }
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
    salesTaxWithholdingField?.addEventListener("change", syncTotalAmount);

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
      biltyStoragePath = "";
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
        biltyPath: biltyStoragePath,
        biltyImage: biltyImageData
      };
      delete normalized.datePicker;
      delete normalized.biltyUpload;

      let savedBooking;
      if (!editingId) {
        normalized.id = getNextBookingJobNo(store.bookings);
        normalized.bookingNo = normalized.bookingNo || getNextSequentialId(store.bookings, "BN", "bookingNo");
        savedBooking = normalizeBookingContainers(normalized);
        store.bookings.unshift(savedBooking);
      } else {
        const index = store.bookings.findIndex((item) => item.id === editingId);
        const existing = store.bookings[index] || {};
        normalized.id = editingId;
        normalized.bookingNo = existing.bookingNo || normalized.bookingNo || getNextSequentialId(store.bookings, "BN", "bookingNo");
        savedBooking = normalizeBookingContainers(normalized);
        store.bookings[index] = savedBooking;
      }

      let syncMessage = `${editingId ? `Booking ${editingId} updated` : "New booking saved"} successfully.`;
      try {
        const remoteResult = await saveBookingToSupabase(savedBooking);
        if (remoteResult) Object.assign(savedBooking, remoteResult);
      } catch (error) {
        syncMessage = `Booking saved in this browser, but Supabase sync failed: ${error.message}`;
      }
      saveStore(store);
      render();
      refreshPaymentNotifications();
      resetForm();
      notice.textContent = syncMessage;
    });

    body.addEventListener("click", async (event) => {
      const biltyTrigger = event.target.closest("[data-view-bilty]");
      const invoiceId = event.target.getAttribute("data-download-invoice");
      const editId = event.target.getAttribute("data-edit-booking");
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
    window.activePageRender = render;
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
    body.addEventListener("click", async (event) => {
      const customer = event.target.getAttribute("data-download-summary");
      if (!customer) return;
      const bookings = getPendingBookings().filter((item) => (String(item.customer || "").trim() || "Unknown Customer") === customer);
      buildSummaryRecordPdf(customer, bookings).catch(() => {});
    });
    renderCustomerOptions();
    window.activePageRender = render;
    render();
  }

  async function buildPendingTruckSummaryPdf(trips, summaryTruckNo, brokerFilter = {}) {
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

    let subHeader = `Truck No: ${text(summaryTruckNo)}`;
    const brokerDetails = [];
    if (brokerFilter.impBroker) brokerDetails.push(`Imp Broker: ${brokerFilter.impBroker}`);
    if (brokerFilter.expBroker) brokerDetails.push(`Exp Broker: ${brokerFilter.expBroker}`);
    if (brokerFilter.mtyBroker) brokerDetails.push(`MTY Broker: ${brokerFilter.mtyBroker}`);
    if (brokerDetails.length) subHeader += ` | ${brokerDetails.join(" | ")}`;
    pdf.text(subHeader, 28, 168);

    function shortPdfDate(value) {
      const movementDate = parseDateValue(value);
      return movementDate
        ? `${String(movementDate.getDate()).padStart(2, "0")}-${movementDate.toLocaleString("en-US", { month: "short" })}-${String(movementDate.getFullYear()).slice(-2)}`
        : "-";
    }

    const hasSpecificBroker = Boolean(brokerFilter.impBroker || brokerFilter.expBroker || brokerFilter.mtyBroker);
    function shouldIncludeLeg(type, broker) {
      if (!hasSpecificBroker) return true;
      const b = String(broker || "").trim();
      if (type === "Import") return brokerFilter.impBroker ? b === brokerFilter.impBroker : false;
      if (type === "Export") return brokerFilter.expBroker ? b === brokerFilter.expBroker : false;
      if (type === "MTY") return brokerFilter.mtyBroker ? b === brokerFilter.mtyBroker : false;
      return false;
    }

    const rows = records.flatMap((trip) => {
      const storedImport = Number(trip.importReceivedAmount);
      const rawImport = Number.isFinite(storedImport)
        ? storedImport
        : Number(trip.importFreight || 0) - Number(trip.importBrokerCommission || 0);
      const storedExport = Number(trip.exportReceivedAmount);
      const rawExport = Number.isFinite(storedExport)
        ? storedExport
        : Number(trip.exportFreight || 0) - Number(trip.exportBrokerCommission || 0);
      const rawMty = Number(trip.mtyBoxFreight || 0);

      const isImportCredit = String(trip.importPaymentStatus || "Awaited").trim().toLowerCase() === "credit";
      const isExportCredit = String(trip.exportPaymentStatus || "Awaited").trim().toLowerCase() === "credit";
      const isMtyCredit = String(trip.mtyPaymentStatus || "Awaited").trim().toLowerCase() === "credit";

      const importReceivable = isImportCredit ? 0 : rawImport;
      const exportReceivable = isExportCredit ? 0 : rawExport;
      const mtyReceivable = isMtyCredit ? 0 : rawMty;

      const legs = [
        {
          amount: importReceivable,
          type: "Import",
          broker: trip.importBroker,
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
          type: "Export",
          broker: trip.exportBroker,
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
          amount: mtyReceivable,
          type: "MTY",
          broker: trip.mtyBroker,
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
            receivable: mtyReceivable,
            broker: trip.mtyBroker,
            remarks: "-"
          }
        }
      ];

      return legs.filter((leg) => shouldIncludeLeg(leg.type, leg.broker));
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
    const truckImageModal = document.querySelector("[data-truck-image-modal]");
    const truckImageModalImage = document.querySelector("[data-truck-image-modal-image]");
    const closeTruckImageModalButton = document.querySelector("[data-close-truck-image-modal]");
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
      form.elements.date.value = getTodayIsoDate();
      if (form.elements.truckNo) form.elements.truckNo.value = "";
      if (form.elements.exportTruckNo) form.elements.exportTruckNo.value = "";
      if (form.elements.customer) form.elements.customer.value = "";
      if (form.elements.importRemarks) form.elements.importRemarks.value = "";
      if (form.elements.exportRemarks) form.elements.exportRemarks.value = "";
      if (form.elements.importPaymentStatus) form.elements.importPaymentStatus.value = "Awaited";
      if (form.elements.mtyPaymentStatus) form.elements.mtyPaymentStatus.value = "Awaited";
      if (form.elements.exportPaymentStatus) form.elements.exportPaymentStatus.value = "Awaited";
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

    function closeTruckImageModal() {
      if (!truckImageModal || !truckImageModalImage) return;
      truckImageModal.hidden = true;
      truckImageModalImage.removeAttribute("src");
      document.body.classList.remove("bilty-modal-open");
    }

    function openTruckImageModal(imageData) {
      if (!imageData || !truckImageModal || !truckImageModalImage) return;
      truckImageModalImage.src = imageData;
      truckImageModal.hidden = false;
      document.body.classList.add("bilty-modal-open");
      closeTruckImageModalButton?.focus();
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
        body.innerHTML = `<tr><td colspan="41">No truck trip records available yet.</td></tr>`;
        return;
      }
      body.innerHTML = rows.map((item, index) => {
        const financials = calculateTruckTripFinancials(item);
        return `
        <tr>
          <td>${index + 1}</td><td>${text(item.jobNo)}</td><td>${formatShortDate(item.date)}</td><td>${text(item.truckNo)}</td>
          <td>${text(item.origin)}</td><td>${text(item.destination)}</td><td>${text(item.customer)}</td><td>${text(item.size)}</td><td>${text(item.weight)}</td><td>${text(item.cargoDescription)}</td>
          <td>${money(item.mtyBoxFreight)}</td><td>${text(item.mtyBroker)}</td>
          <td>${money(item.importFreight)}</td><td>${money(item.importBrokerCommission)}</td><td>${text(item.importBroker)}</td><td>${money(item.importReceivedAmount)}</td><td>${text(item.importChequeDetails)}</td><td>${item.importPaymentDate ? formatShortDate(item.importPaymentDate) : "-"}</td><td><span class="badge ${item.importPaymentStatus === "Credit" ? "good" : "bad"}">${text(item.importPaymentStatus || "Awaited")}</span></td><td>${item.mtyPaymentDate ? formatShortDate(item.mtyPaymentDate) : "-"}</td><td><span class="badge ${item.mtyPaymentStatus === "Credit" ? "good" : "bad"}">${text(item.mtyPaymentStatus || "Awaited")}</span></td><td class="remarks-cell">${text(item.importRemarks || item.remarks || "-")}</td>
          <td>${item.exportLoadDate ? formatShortDate(item.exportLoadDate) : "-"}</td><td>${text(item.exportTruckNo || item.truckNo)}</td><td>${text(item.exportBroker)}</td><td>${money(item.exportFreight)}</td><td>${money(item.exportBrokerCommission)}</td><td>${text(item.exportOrigin)}</td><td>${text(item.exportDestination)}</td><td>${text(item.exportSize)}</td><td>${text(item.exportWeight)}</td><td>${money(item.exportReceivedAmount)}</td><td>${text(item.exportChequeDetails)}</td><td>${item.exportPaymentDate ? formatShortDate(item.exportPaymentDate) : "-"}</td><td><span class="badge ${item.exportPaymentStatus === "Credit" ? "good" : "bad"}">${text(item.exportPaymentStatus || "Awaited")}</span></td><td class="remarks-cell">${text(item.exportRemarks || item.remarks || "-")}</td><td>${money(financials.grandTotal)}</td><td>${money(financials.roundTripExpense)}</td><td>${money(financials.profitLoss)}</td>
          <td>${item.image ? `
            <button class="bilty-thumbnail" type="button" data-view-truck-image="${escapeHtml(item.id)}" aria-label="View truck details image">
              <img src="${escapeHtml(item.image)}" alt="Truck details attachment" />
            </button>` : item.imagePath ? `
            <button class="bilty-thumbnail" type="button" data-view-truck-image="${escapeHtml(item.id)}" aria-label="View truck details image" data-lazy-truck-img="${escapeHtml(item.imagePath)}">
              <span class="loading-placeholder">...</span>
            </button>` : "-"}</td>
          <td>
            <div class="table-actions">
              <button class="btn small" data-import-invoice="${item.id}">Import Invoice</button>
              <button class="btn small" data-export-invoice="${item.id}">Export Invoice</button>
              <button class="btn small" data-edit-trip="${item.id}">Edit</button>
            </div>
          </td>
        </tr>
      `;
      }).join("");

      body.querySelectorAll("[data-lazy-truck-img]").forEach((btn) => {
        const path = btn.getAttribute("data-lazy-truck-img");
        const tripId = btn.getAttribute("data-view-truck-image");
        const trip = rows.find((t) => t.id === tripId);
        getPrivateDocumentUrl(path).then((url) => {
          if (url) {
            if (trip) trip.image = url;
            btn.innerHTML = `<img src="${escapeHtml(url)}" alt="Truck details attachment" />`;
            btn.removeAttribute("data-lazy-truck-img");
          }
        });
      });
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
      const existingItem = editingId
        ? store.truckExpenses.find((item) => item.id === editingId)
        : null;
      normalized.image = tripImageData;
      normalized.imagePath = existingItem?.imagePath || "";
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

    body.addEventListener("click", async (event) => {
      const imageButton = event.target.closest("[data-view-truck-image]");
      const importInvoiceId = event.target.getAttribute("data-import-invoice");
      const exportInvoiceId = event.target.getAttribute("data-export-invoice");
      const editId = event.target.getAttribute("data-edit-trip");
      if (imageButton) {
        const item = store.truckExpenses.find((entry) => entry.id === imageButton.dataset.viewTruckImage);
        if (item?.image) openTruckImageModal(item.image);
        return;
      }
      if (importInvoiceId || exportInvoiceId) {
        const item = store.truckExpenses.find((entry) => entry.id === (importInvoiceId || exportInvoiceId));
        if (item) buildTruckDetailsInvoicePdf(item, importInvoiceId ? "import" : "export").catch(() => {
          notice.textContent = "Invoice download failed. Please try again.";
        });
        return;
      }
      if (editId) fillForm(store.truckExpenses.find((item) => item.id === editId));
    });

    document.querySelector("[data-reset-form]").addEventListener("click", resetForm);
    if (customerFilter) customerFilter.addEventListener("change", render);
    if (jobSort) jobSort.addEventListener("change", render);
    closeTruckImageModalButton?.addEventListener("click", closeTruckImageModal);
    truckImageModal?.addEventListener("click", (event) => {
      if (event.target === truckImageModal) closeTruckImageModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && truckImageModal && !truckImageModal.hidden) closeTruckImageModal();
    });
    resetForm();
    window.activePageRender = render;
    render();
  }

  function truckSummaryPage(store) {
    const isCompletedSummary = document.body.dataset.page === "completed-truck-summary";
    const groupsContainer = document.querySelector("[data-truck-summary-groups]");
    const count = document.querySelector("[data-truck-summary-count]");
    const customerFilter = document.querySelector("[data-truck-summary-customer-filter]");
    const importBrokerFilter = document.querySelector("[data-truck-summary-import-broker-filter]");
    const exportBrokerFilter = document.querySelector("[data-truck-summary-export-broker-filter]");
    const mtyBrokerFilter = document.querySelector("[data-truck-summary-mty-broker-filter]");
    const jobSort = document.querySelector("[data-truck-summary-job-sort]");
    const startDateFilter = document.querySelector("[data-truck-summary-start-date]");
    const endDateFilter = document.querySelector("[data-truck-summary-end-date]");
    const importReceivableTotal = document.querySelector("[data-truck-summary-import-receivable]");
    const exportReceivableTotal = document.querySelector("[data-truck-summary-export-receivable]");
    const mtyReceivableTotal = document.querySelector("[data-truck-summary-mty-receivable]");
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

      const candidateTripsForBrokers = trips.filter((item) => !selectedTruckNo || String(item.truckNo || "").trim() === selectedTruckNo);

      const impBrokers = [...new Set(candidateTripsForBrokers.map((item) => String(item.importBroker || "").trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
      const expBrokers = [...new Set(candidateTripsForBrokers.map((item) => String(item.exportBroker || "").trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
      const mtyBrokers = [...new Set(candidateTripsForBrokers.map((item) => String(item.mtyBroker || "").trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));

      const prevImp = String(importBrokerFilter?.value || "").trim();
      const prevExp = String(exportBrokerFilter?.value || "").trim();
      const prevMty = String(mtyBrokerFilter?.value || "").trim();

      if (importBrokerFilter) {
        importBrokerFilter.innerHTML = `<option value="">All Imp</option>${impBrokers.map((b) => `<option value="${escapeHtml(b)}">${text(b)}</option>`).join("")}`;
        importBrokerFilter.value = impBrokers.includes(prevImp) ? prevImp : "";
      }
      if (exportBrokerFilter) {
        exportBrokerFilter.innerHTML = `<option value="">All Exp</option>${expBrokers.map((b) => `<option value="${escapeHtml(b)}">${text(b)}</option>`).join("")}`;
        exportBrokerFilter.value = expBrokers.includes(prevExp) ? prevExp : "";
      }
      if (mtyBrokerFilter) {
        mtyBrokerFilter.innerHTML = `<option value="">All MTY</option>${mtyBrokers.map((b) => `<option value="${escapeHtml(b)}">${text(b)}</option>`).join("")}`;
        mtyBrokerFilter.value = mtyBrokers.includes(prevMty) ? prevMty : "";
      }

      const activeImpBroker = String(importBrokerFilter?.value || "").trim();
      const activeExpBroker = String(exportBrokerFilter?.value || "").trim();
      const activeMtyBroker = String(mtyBrokerFilter?.value || "").trim();
      const hasSpecificBroker = Boolean(activeImpBroker || activeExpBroker || activeMtyBroker);

      function shouldIncludeLeg(type, broker) {
        if (!hasSpecificBroker) return true;
        const b = String(broker || "").trim();
        if (type === "Import") return activeImpBroker ? b === activeImpBroker : false;
        if (type === "Export") return activeExpBroker ? b === activeExpBroker : false;
        if (type === "MTY") return activeMtyBroker ? b === activeMtyBroker : false;
        return false;
      }

      const startDate = parseDateValue(startDateFilter?.value);
      const endDate = parseDateValue(endDateFilter?.value);
      const filteredTrips = candidateTripsForBrokers
        .filter((item) => {
          if (!startDate && !endDate) return true;
          const completedDate = parseDateValue(item.exportLoadDate || item.date);
          if (!completedDate) return false;
          if (startDate && completedDate < startDate) return false;
          if (endDate && completedDate > endDate) return false;
          return true;
        })
        .filter((item) => {
          if (!hasSpecificBroker) return true;
          const matchesImp = activeImpBroker && String(item.importBroker || "").trim() === activeImpBroker;
          const matchesExp = activeExpBroker && String(item.exportBroker || "").trim() === activeExpBroker;
          const matchesMty = activeMtyBroker && String(item.mtyBroker || "").trim() === activeMtyBroker;
          return Boolean(matchesImp || matchesExp || matchesMty);
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
        const rawImportReceivable = Number.isFinite(storedImportReceivable)
          ? storedImportReceivable
          : Number(item.importFreight || 0) - Number(item.importBrokerCommission || 0);
        const rawExportReceivable = Number.isFinite(storedExportReceivable)
          ? storedExportReceivable
          : Number(item.exportFreight || 0) - Number(item.exportBrokerCommission || 0);
        const rawMtyReceivable = Number(item.mtyBoxFreight || 0);

        const isImportCredit = String(item.importPaymentStatus || "Awaited").trim().toLowerCase() === "credit";
        const isExportCredit = String(item.exportPaymentStatus || "Awaited").trim().toLowerCase() === "credit";
        const isMtyCredit = String(item.mtyPaymentStatus || "Awaited").trim().toLowerCase() === "credit";

        const incImport = shouldIncludeLeg("Import", item.importBroker);
        const incExport = shouldIncludeLeg("Export", item.exportBroker);
        const incMty = shouldIncludeLeg("MTY", item.mtyBroker);

        const importReceivable = incImport ? (isCompletedSummary ? rawImportReceivable : (isImportCredit ? 0 : rawImportReceivable)) : 0;
        const exportReceivable = incExport ? (isCompletedSummary ? rawExportReceivable : (isExportCredit ? 0 : rawExportReceivable)) : 0;
        const mtyReceivable = incMty ? (isCompletedSummary ? rawMtyReceivable : (isMtyCredit ? 0 : rawMtyReceivable)) : 0;

        const financials = calculateTruckTripFinancials(item);
        const grandTotal = isCompletedSummary ? financials.grandTotal : (importReceivable + exportReceivable + mtyReceivable);

        summary.importReceivable += importReceivable;
        summary.exportReceivable += exportReceivable;
        summary.mtyReceivable += mtyReceivable;
        summary.grandTotal += grandTotal;
        summary.profitLoss += financials.profitLoss;
        return summary;
      }, { importReceivable: 0, exportReceivable: 0, mtyReceivable: 0, grandTotal: 0, profitLoss: 0 });

      if (importReceivableTotal) importReceivableTotal.textContent = `PKR ${money(totals.importReceivable)}`;
      if (exportReceivableTotal) exportReceivableTotal.textContent = `PKR ${money(totals.exportReceivable)}`;
      if (mtyReceivableTotal) mtyReceivableTotal.textContent = `PKR ${money(totals.mtyReceivable)}`;
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
        const legs = group.trips.flatMap((item) => {
          const storedImport = Number(item.importReceivedAmount);
          const rawImport = Number.isFinite(storedImport)
            ? storedImport
            : Number(item.importFreight || 0) - Number(item.importBrokerCommission || 0);
          const storedExport = Number(item.exportReceivedAmount);
          const rawExport = Number.isFinite(storedExport)
            ? storedExport
            : Number(item.exportFreight || 0) - Number(item.exportBrokerCommission || 0);
          const rawMty = Number(item.mtyBoxFreight || 0);

          const isImportCredit = String(item.importPaymentStatus || "Awaited").trim().toLowerCase() === "credit";
          const isExportCredit = String(item.exportPaymentStatus || "Awaited").trim().toLowerCase() === "credit";
          const isMtyCredit = String(item.mtyPaymentStatus || "Awaited").trim().toLowerCase() === "credit";

          const importRec = isCompletedSummary ? rawImport : (isImportCredit ? 0 : rawImport);
          const exportRec = isCompletedSummary ? rawExport : (isExportCredit ? 0 : rawExport);
          const mtyRec = isCompletedSummary ? rawMty : (isMtyCredit ? 0 : rawMty);

          const allLegs = [
            { tripId: item.id, type: "Import", date: item.date, truckNo: item.truckNo, origin: item.origin, destination: item.destination, size: item.size, weight: item.weight, cargo: item.cargoDescription, freight: item.importFreight, receivable: importRec, broker: item.importBroker, remarks: item.importRemarks || item.remarks },
            { tripId: item.id, type: "Export", date: item.exportLoadDate, truckNo: item.exportTruckNo || item.truckNo, origin: item.exportOrigin, destination: item.exportDestination, size: item.exportSize, weight: item.exportWeight, cargo: item.cargoDescription, freight: item.exportFreight, receivable: exportRec, broker: item.exportBroker, remarks: item.exportRemarks || item.remarks },
            { tripId: item.id, type: "MTY", date: "", truckNo: "", origin: "", destination: "", size: "", weight: "", cargo: "", freight: item.mtyBoxFreight, receivable: mtyRec, broker: item.mtyBroker, remarks: "" }
          ];

          return allLegs.filter((leg) => shouldIncludeLeg(leg.type, leg.broker));
        });

        if (!legs.length) return "";
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
      }).filter(Boolean).join("");
    }

    const resetFiltersButton = document.querySelector("[data-truck-summary-reset-filters]");
    if (customerFilter) customerFilter.addEventListener("change", render);
    if (importBrokerFilter) importBrokerFilter.addEventListener("change", render);
    if (exportBrokerFilter) exportBrokerFilter.addEventListener("change", render);
    if (mtyBrokerFilter) mtyBrokerFilter.addEventListener("change", render);
    if (jobSort) jobSort.addEventListener("change", render);
    if (startDateFilter) startDateFilter.addEventListener("change", render);
    if (endDateFilter) endDateFilter.addEventListener("change", render);
    if (resetFiltersButton) {
      resetFiltersButton.addEventListener("click", () => {
        if (customerFilter) customerFilter.value = "";
        if (importBrokerFilter) importBrokerFilter.value = "";
        if (exportBrokerFilter) exportBrokerFilter.value = "";
        if (mtyBrokerFilter) mtyBrokerFilter.value = "";
        if (jobSort) jobSort.value = "desc";
        if (startDateFilter) startDateFilter.value = "";
        if (endDateFilter) endDateFilter.value = "";
        render();
      });
    }
    if (pendingSummaryDownloadButton) {
      pendingSummaryDownloadButton.addEventListener("click", () => {
        if (!currentPendingSummaryTruckNo || !currentPendingSummaryTrips.length) return;
        const brokerFilter = {
          impBroker: String(importBrokerFilter?.value || "").trim(),
          expBroker: String(exportBrokerFilter?.value || "").trim(),
          mtyBroker: String(mtyBrokerFilter?.value || "").trim()
        };
        buildPendingTruckSummaryPdf(currentPendingSummaryTrips, currentPendingSummaryTruckNo, brokerFilter).catch(() => {});
      });
    }
    window.activePageRender = render;
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
    const documentModal = document.querySelector("[data-equipment-document-modal]");
    const documentModalImage = document.querySelector("[data-equipment-document-modal-image]");
    const closeDocumentModalButton = document.querySelector("[data-close-equipment-document-modal]");
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

    function openDocumentModal(source) {
      if (!source) return;
      documentModalImage.src = source;
      documentModal.hidden = false;
      document.body.classList.add("bilty-modal-open");
      closeDocumentModalButton?.focus();
    }

    function closeDocumentModal() {
      documentModal.hidden = true;
      documentModalImage.removeAttribute("src");
      document.body.classList.remove("bilty-modal-open");
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
          item.typeOfBody,
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
          <td>${text(item.typeOfBody || "-")}</td>
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
            ? `<button class="equipment-thumbnail" type="button" data-view-equipment-document="${item.id}" aria-label="View document for ${escapeHtml(item.id)}">
                <img src="${item.documentData}" alt="" />
               </button>`
            : item.documentPath ? `
              <button class="equipment-thumbnail" type="button" data-view-equipment-document="${item.id}" data-lazy-equipment-doc="${escapeHtml(item.documentPath)}" aria-label="View document for ${escapeHtml(item.id)}">
                <span class="loading-placeholder">...</span>
              </button>`
            : text(item.originalDocs || "-")}</td>
          <td>
            <div class="table-actions">
              <button class="btn small" type="button" data-download-equipment="${item.id}">Download PDF</button>
              <button class="btn small" type="button" data-edit-equipment="${item.id}">Edit</button>
            </div>
          </td>
        </tr>
      `).join("");
      updateSummary(rows);
      if (count) count.textContent = `${rows.length} record(s)`;

      body.querySelectorAll("[data-lazy-equipment-doc]").forEach((btn) => {
        const path = btn.getAttribute("data-lazy-equipment-doc");
        const equipId = btn.getAttribute("data-view-equipment-document");
        const equip = rows.find((e) => e.id === equipId);
        getPrivateDocumentUrl(path).then((url) => {
          if (url) {
            if (equip) equip.documentData = url;
            btn.innerHTML = `<img src="${escapeHtml(url)}" alt="" />`;
            btn.removeAttribute("data-lazy-equipment-doc");
          }
        });
      });
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
      if (downloadId) {
        const item = store.equipmentFleet.find((entry) => entry.id === downloadId);
        if (item) {
          try {
            await createRegisterPdf(
              "Equipment & Handling Fleet",
              ["S.No", "Registration No", "Type of Body", "Chassis No", "Engine No", "Maker", "Model", "MRA"],
              ["1", item.truckNo, item.typeOfBody || "-", item.chassisNo, item.engineNo, item.make, item.model, item.mra],
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
        if (item?.documentData) openDocumentModal(item.documentData);
        return;
      }
      if (editId) fillForm(store.equipmentFleet.find((item) => item.id === editId));
    });

    closeDocumentModalButton?.addEventListener("click", closeDocumentModal);
    documentModal?.addEventListener("click", (event) => {
      if (event.target === documentModal) closeDocumentModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && documentModal && !documentModal.hidden) closeDocumentModal();
    });

    document.querySelector("[data-reset-equipment-form]").addEventListener("click", resetForm);
    if (search) search.addEventListener("input", render);
    resetForm();
    window.activePageRender = render;
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
          <td>${item.image ? `
            <button class="maintenance-thumbnail" type="button" data-view-maintenance-image="${item.id}" aria-label="View image for ${escapeHtml(item.id)}">
              <img src="${item.image}" alt="" />
            </button>` : item.imagePath ? `
            <button class="maintenance-thumbnail" type="button" data-view-maintenance-image="${item.id}" aria-label="View image for ${escapeHtml(item.id)}" data-lazy-maintenance-img="${escapeHtml(item.imagePath)}">
              <span class="loading-placeholder">...</span>
            </button>` : "-"}</td>
          <td>${text(item.approvedBy)}</td>
          <td><div class="table-actions"><button class="btn small" type="button" data-download-maintenance="${item.id}">Download PDF</button><button class="btn small" type="button" data-edit-maintenance="${item.id}">Edit</button></div></td>
        </tr>`;
      }).join("");
      updateSummary(rows);
      if (count) count.textContent = `${rows.length} record(s)`;

      body.querySelectorAll("[data-lazy-maintenance-img]").forEach((btn) => {
        const path = btn.getAttribute("data-lazy-maintenance-img");
        const jobId = btn.getAttribute("data-view-maintenance-image");
        const job = rows.find((j) => j.id === jobId);
        getPrivateDocumentUrl(path).then((url) => {
          if (url) {
            if (job) job.image = url;
            btn.innerHTML = `<img src="${escapeHtml(url)}" alt="" />`;
            btn.removeAttribute("data-lazy-maintenance-img");
          }
        });
      });
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
              ""
            );
          } catch (error) {
            setNotice(error.message, true);
          }
        }
        return;
      }
      if (editId) fillForm(store.maintenanceJobs.find((item) => item.id === editId));
      if (imageId) openImageModal(store.maintenanceJobs.find((item) => item.id === imageId)?.image);
    });

    truckFilter?.addEventListener("change", render);
    dateOrder?.addEventListener("change", render);
    document.querySelector("[data-reset-maintenance-form]").addEventListener("click", resetForm);
    closeImageModalButton.addEventListener("click", closeImageModal);
    imageModal.addEventListener("click", (event) => { if (event.target === imageModal) closeImageModal(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !imageModal.hidden) closeImageModal(); });
    populateTruckControls();
    resetForm();
    window.activePageRender = render;
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
    const imageModal = document.querySelector("[data-employee-image-modal]");
    const imageModalImage = document.querySelector("[data-employee-image-modal-image]");
    const closeImageModalButton = document.querySelector("[data-close-employee-image-modal]");
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

    function openImageModal(source) {
      if (!source || !imageModal || !imageModalImage) return;
      imageModalImage.src = source;
      imageModal.hidden = false;
      document.body.classList.add("bilty-modal-open");
      closeImageModalButton?.focus();
    }

    function closeImageModal() {
      if (!imageModal || !imageModalImage) return;
      imageModal.hidden = true;
      imageModalImage.removeAttribute("src");
      document.body.classList.remove("bilty-modal-open");
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
      form.elements.joiningDate.value = getTodayIsoDate();
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
          <td>${formatShortDate(item.joiningDate)}</td>
          <td>${text(item.phone)}</td>
          <td><div class="employee-status-actions"><span class="badge ${item.status === "Active" ? "good" : "bad"}">${text(item.status)}</span><button class="btn small" type="button" data-download-employee="${item.id}">Download PDF</button></div></td>
          <td>${item.image ? `
            <button class="maintenance-thumbnail" type="button" data-view-employee-image="${item.id}" aria-label="View image for ${escapeHtml(item.name || item.id)}">
              <img src="${item.image}" alt="" />
            </button>` : item.imagePath ? `
            <button class="maintenance-thumbnail" type="button" data-view-employee-image="${item.id}" aria-label="View image for ${escapeHtml(item.name || item.id)}" data-lazy-employee-img="${escapeHtml(item.imagePath)}">
              <span class="loading-placeholder">...</span>
            </button>` : "-"}</td>
          <td>
            <div class="table-actions">
              <button class="btn small" data-edit-employee="${item.id}">Edit</button>
            </div>
          </td>
        </tr>
      `).join("");
      updateSummary();

      body.querySelectorAll("[data-lazy-employee-img]").forEach((btn) => {
        const path = btn.getAttribute("data-lazy-employee-img");
        const empId = btn.getAttribute("data-view-employee-image");
        const emp = store.employees.find((e) => e.id === empId);
        getPrivateDocumentUrl(path).then((url) => {
          if (url) {
            if (emp) emp.image = url;
            btn.innerHTML = `<img src="${escapeHtml(url)}" alt="" />`;
            btn.removeAttribute("data-lazy-employee-img");
          }
        });
      });
    }

    function fillForm(item) {
      if (!item) return;
      Object.keys(item).forEach((key) => {
        if (form.elements[key]) form.elements[key].value = item[key];
      });
      editingId = item.id;
      if (item.image) {
        setEmployeeImage(item.image);
      } else if (item.imagePath) {
        getPrivateDocumentUrl(item.imagePath).then((url) => {
          if (url) {
            item.image = url;
            setEmployeeImage(url);
          }
        });
      } else {
        setEmployeeImage("");
      }
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
      const existingItem = editingId ? store.employees.find((item) => item.id === editingId) : null;
      const normalized = {
        ...data,
        salary: Number(data.salary || 0),
        image: employeeImageData,
        imagePath: existingItem?.imagePath || ""
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
      const imageId = event.target.closest("[data-view-employee-image]")?.dataset.viewEmployeeImage;
      if (downloadId) {
        const item = store.employees.find((record) => record.id === downloadId);
        if (item) {
          try {
            await createRegisterPdf(
              "Employee Record",
              ["Employee ID", "Name", "Designation", "Department", "Salary", "Joining Date", "Phone", "Status"],
              [item.id, item.name, item.designation, item.department, `PKR ${money(item.salary)}`, formatShortDate(item.joiningDate), item.phone, item.status],
              `${safePdfFileName(item.name || item.id)}_employee_record`,
              ""
            );
          } catch (error) {
            notice.textContent = error.message;
          }
        }
        return;
      }
      if (editId) fillForm(store.employees.find((item) => item.id === editId));
      if (imageId) {
        const emp = store.employees.find((item) => item.id === imageId);
        if (emp?.image) openImageModal(emp.image);
      }
    });

    closeImageModalButton?.addEventListener("click", closeImageModal);
    imageModal?.addEventListener("click", (event) => { if (event.target === imageModal) closeImageModal(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape" && imageModal && !imageModal.hidden) closeImageModal(); });
    document.querySelector("[data-reset-form]").addEventListener("click", resetForm);
    window.activePageRender = render;
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
        const user = adminUsers.find((item) => item.id === deleteId);
        requestDeleteConfirmation({
          title: "Delete user?",
          message: `This will permanently delete ${user?.name || "this user"} and their sign-in access.`
        }).then((confirmed) => {
          if (!confirmed) return;
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
        });
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

  async function resolveRemoteKhataAccount(account, accountType) {
    const client = getSupabaseClient();
    if (!client || !account?.customer) return null;
    const query = /^[0-9a-f-]{36}$/i.test(String(account.id || ""))
      ? client.from("accounts").select("id").eq("id", account.id).eq("account_type", accountType).maybeSingle()
      : client.from("accounts").select("id").eq("party_name", account.customer).eq("account_type", accountType).maybeSingle();
    const { data, error } = await query;
    if (error) throw error;
    return data?.id || null;
  }

  async function deleteRemoteKhataEntry(account, entry, accountType) {
    const client = getSupabaseClient();
    if (!client || !account?.id || !entry) return;
    const remoteAccountId = await resolveRemoteKhataAccount(account, accountType);
    if (!remoteAccountId) return;
    let remoteEntries = [];
    if (entry.imagePath) {
      const result = await client.from("account_entries").select("id,image_path").eq("account_id", remoteAccountId).eq("image_path", entry.imagePath);
      if (result.error) throw result.error;
      remoteEntries = result.data || [];
    }
    if (!remoteEntries.length && /^[0-9a-f-]{36}$/i.test(String(entry.id || ""))) {
      const result = await client.from("account_entries").select("id,image_path").eq("account_id", remoteAccountId).eq("id", entry.id);
      if (result.error) throw result.error;
      remoteEntries = result.data || [];
    }
    if (!remoteEntries.length) {
      const result = await client.from("account_entries").select("id,image_path").eq("account_id", remoteAccountId)
        .eq("entry_date", formatIsoDate(entry.date))
        .eq("entry_type", entry.type === "Credit" ? "Credit" : "Debit")
        .eq("amount", Number(entry.amount || 0))
        .eq("description", entry.description || "");
      if (result.error) throw result.error;
      remoteEntries = result.data || [];
    }
    if (!remoteEntries.length) return;
    const paths = remoteEntries.map((item) => item.image_path).filter(Boolean);
    if (paths.length) {
      await Promise.all(paths.map((path) => removeStoredPathAndFolder(path).catch((err) => console.warn("Failed to delete khata entry image:", err.message))));
    }
    const { error } = await client.from("account_entries").delete().in("id", remoteEntries.map((item) => item.id));
    if (error) throw error;
  }

  async function deleteRemoteKhataAccount(account, accountType) {
    const client = getSupabaseClient();
    if (!client || !account?.id) return;
    const remoteAccountId = await resolveRemoteKhataAccount(account, accountType);
    if (!remoteAccountId) return;
    const { data: entries, error: readError } = await client.from("account_entries").select("id,image_path").eq("account_id", remoteAccountId);
    if (readError) throw readError;
    const paths = (entries || []).map((entry) => entry.image_path).filter(Boolean);
    if (paths.length) {
      await Promise.all(paths.map((path) => removeStoredPathAndFolder(path).catch((err) => console.warn("Failed to delete khata account image:", err.message))));
    }
    const { error: entryError } = await client.from("account_entries").delete().eq("account_id", remoteAccountId);
    if (entryError) throw entryError;
    const { error: accountError } = await client.from("accounts").delete().eq("id", remoteAccountId);
    if (accountError) throw accountError;
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
    const allAccountsValue = "__all_accounts__";

    function showNotice(el, msg) {
      if (!el) return;
      el.textContent = msg;
      el.hidden = !msg;
    }

    function findAccountByIdOrName(idOrName) {
      if (!idOrName || idOrName === allAccountsValue) return null;
      return accounts.find((item) => String(item.id) === String(idOrName) || String(item.customer).trim().toLowerCase() === String(idOrName).trim().toLowerCase()) || null;
    }

    function getVisibleAccounts() {
      return accounts;
    }

    function getAggregateAccount() {
      return {
        id: allAccountsValue,
        customer: isPayable ? "All Payees" : "All Customers",
        phone: "-",
        city: "-",
        entries: accounts.flatMap((account) => (account.entries || []).map((entry) => ({
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
      return findAccountByIdOrName(select.value) || getAggregateAccount();
    }

    function getStatementData(account) {
      const totals = calculateKhataSummary(account);
      const sortedEntries = [...(account.entries || [])].sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")));
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
        showNotice(exportNotice, `${account.customer} ${isPayable ? "payable" : "receivable"} PDF downloaded successfully.`);
      } catch (error) {
        showNotice(exportNotice, "The PDF could not be generated. Please try again.");
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
          showNotice(exportNotice, "The share sheet is open. Select WhatsApp to send the statement directly.");
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
        showNotice(exportNotice, isMobileDevice()
          ? "WhatsApp chat is open. The PDF has been downloaded; attach it and send it."
          : "WhatsApp Web is open and the PDF has been downloaded. Attach the downloaded PDF in the chat and send it.");
      } else {
        showNotice(exportNotice, `A valid WhatsApp number was not found for this ${partyLabel.toLowerCase()}.`);
      }
    }

    function populateCustomers(preferredValue = select.value || allAccountsValue) {
      const visibleAccounts = getVisibleAccounts();
      const currentSelectedAccount = findAccountByIdOrName(select.value);
      const targetName = currentSelectedAccount?.customer || preferredValue;

      select.innerHTML = `<option value="${allAccountsValue}">${isPayable ? "All Payees" : "All Customers"}</option>${visibleAccounts.map((account) => `
        <option value="${account.id}">${account.customer}</option>
      `).join("")}`;

      const matchedAccount = visibleAccounts.find((a) => String(a.id) === String(preferredValue) || String(a.customer).trim().toLowerCase() === String(targetName).trim().toLowerCase() || String(a.id) === String(targetName));
      if (matchedAccount) {
        select.value = matchedAccount.id;
      } else if (preferredValue === allAccountsValue || !visibleAccounts.length) {
        select.value = allAccountsValue;
      } else {
        select.value = visibleAccounts[0]?.id || allAccountsValue;
      }
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
      const visibleAccounts = getVisibleAccounts();
      customerListBody.innerHTML = visibleAccounts.length ? visibleAccounts.map((account) => {
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
            <td>${(account.entries || []).length}</td>
            <td>
              <div class="table-actions">
                <button class="btn small" data-open-customer="${account.id}">Open</button>
                <button class="btn small" data-edit-customer="${account.id}">Edit</button>
              </div>
            </td>
          </tr>
        `;
      }).join("") : `<tr><td colspan="8" class="text-center muted" style="padding: 24px;">No ${partyLabel.toLowerCase()} accounts recorded.</td></tr>`;
    }

    function renderAccount(accountId) {
      const isAggregate = !accountId || accountId === allAccountsValue;
      const account = isAggregate
        ? getAggregateAccount()
        : (findAccountByIdOrName(accountId) || getAggregateAccount());
      if (!account) return;

      const totals = calculateKhataSummary(account);
      const statement = getStatementData(account);
      const sortedEntries = [...(account.entries || [])].sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")));
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
      body.innerHTML = sortedEntries.length ? sortedEntries.map((entry) => {
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
            ` : entry.imagePath && !isAggregate ? `
              <button class="bilty-thumbnail" type="button" data-view-khata-image="${escapeHtml(entry.id)}" aria-label="View entry image" title="View image" data-lazy-khata-img="${escapeHtml(entry.imagePath)}">
                <span class="loading-placeholder">...</span>
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
      }).join("") : `<tr><td colspan="7" class="text-center muted" style="padding: 24px;">No statement entries recorded for this ${partyLabel.toLowerCase()}.</td></tr>`;

      body.querySelectorAll("[data-lazy-khata-img]").forEach((btn) => {
        const path = btn.getAttribute("data-lazy-khata-img");
        const entryId = btn.getAttribute("data-view-khata-image");
        const entry = sortedEntries.find((e) => e.id === entryId);
        getPrivateDocumentUrl(path).then((url) => {
          if (url) {
            if (entry) entry.image = url;
            btn.innerHTML = `<img src="${escapeHtml(url)}" alt="Entry attachment thumbnail" />`;
            btn.removeAttribute("data-lazy-khata-img");
          }
        });
      });

      if (form.elements.accountId) {
        form.elements.accountId.value = isAggregate ? "" : account.id;
      }
      Array.from(form.elements).forEach((control) => {
        if (control.name !== "accountId") control.disabled = isAggregate;
      });
      select.value = isAggregate ? allAccountsValue : account.id;
      renderCustomerList();
    }

    function resetForm() {
      const isAggregate = select.value === allAccountsValue;
      if (form.elements.accountId) {
        form.elements.accountId.value = isAggregate ? "" : select.value;
      }
      form.elements.date.value = getTodayIsoDate();
      form.elements.type.value = "Debit";
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
        customer: String(data.customer || "").trim(),
        phone: String(data.phone || "").trim(),
        city: String(data.city || "").trim(),
        openingBalance: 0,
        entries: []
      };

      if (!normalized.customer) {
        showNotice(customerNotice, `${partyLabel} name is required.`);
        return;
      }

      if (!editingCustomerId) {
        normalized.id = getNextSequentialId(accounts, isPayable ? "PAY" : "CUS");
        accounts.unshift(normalized);
        showNotice(customerNotice, `${partyLabel} ${normalized.customer} was added successfully.`);
      } else {
        const index = accounts.findIndex((item) => String(item.id) === String(editingCustomerId));
        if (index === -1) {
          showNotice(customerNotice, `${partyLabel} record not found.`);
          return;
        }
        normalized.id = editingCustomerId;
        normalized.entries = accounts[index].entries || [];
        accounts[index] = normalized;
        showNotice(customerNotice, `${partyLabel} ${normalized.customer} updated successfully.`);
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
          showNotice(notice, error.message);
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
      const accountId = data.accountId || select.value;
      const account = findAccountByIdOrName(accountId) || findAccountByIdOrName(select.value);

      if (!account || account.id === allAccountsValue) {
        showNotice(notice, `Please select a specific ${partyLabel.toLowerCase()} from the dropdown before saving an entry.`);
        return;
      }

      const normalized = {
        id: editingId,
        date: data.date || getTodayIsoDate(),
        type: data.type || "Debit",
        description: data.description || "",
        image: entryImageData || "",
        amount: Number(data.amount || 0)
      };

      if (!account.entries) account.entries = [];

      if (!editingId) {
        const allEntries = accounts.flatMap((item) => Array.isArray(item.entries) ? item.entries : []);
        normalized.id = getNextSequentialId(allEntries, entryPrefix);
        account.entries.unshift(normalized);
        showNotice(notice, `Statement entry ${normalized.id} saved successfully.`);
      } else {
        const index = account.entries.findIndex((entry) => String(entry.id) === String(editingId));
        if (index === -1) {
          showNotice(notice, "Entry not found. Please try again.");
          return;
        }
        normalized.imagePath = account.entries[index].imagePath || "";
        account.entries[index] = normalized;
        showNotice(notice, `Statement entry ${editingId} updated successfully.`);
      }

      saveStore(store);
      populateCustomers(account.id);
      renderAccount(account.id);
      resetForm();
    });

    body.addEventListener("click", async (event) => {
      const imageTrigger = event.target.closest("[data-view-khata-image]");
      const editId = event.target.getAttribute("data-edit-khata");
      const deleteId = event.target.getAttribute("data-delete-khata");
      const selectedAccount = findAccountByIdOrName(select.value);

      if (imageTrigger) {
        const imageEntryId = imageTrigger.getAttribute("data-view-khata-image");
        const acc = accounts.find((a) => (a.entries || []).some((e) => String(e.id) === String(imageEntryId))) || selectedAccount;
        const entry = acc ? (acc.entries || []).find((item) => String(item.id) === String(imageEntryId)) : null;
        if (entry?.image) openEntryImageModal(entry.image);
        return;
      }

      if (editId) {
        const acc = accounts.find((a) => (a.entries || []).some((e) => String(e.id) === String(editId))) || selectedAccount;
        if (acc) fillForm(acc, (acc.entries || []).find((entry) => String(entry.id) === String(editId)));
        return;
      }

      if (deleteId) {
        const acc = accounts.find((a) => (a.entries || []).some((e) => String(e.id) === String(deleteId))) || selectedAccount;
        if (!acc) return;
        const confirmed = await requestDeleteConfirmation({
          title: acc.entries.length === 1 ? "Delete account?" : "Delete entry?",
          message: acc.entries.length === 1
            ? `This will delete the final entry and remove ${acc.customer} from this register.`
            : `This will permanently delete the selected entry from ${acc.customer}.`
        });
        if (!confirmed) return;
        await flushOperationalSyncBeforeMutation();
        const entryIndex = (acc.entries || []).findIndex((entry) => String(entry.id) === String(deleteId));
        const entryToDelete = entryIndex !== -1 ? acc.entries[entryIndex] : null;
        if (entryIndex !== -1) {
          acc.entries.splice(entryIndex, 1);
        } else {
          acc.entries = (acc.entries || []).filter((entry) => String(entry.id) !== String(deleteId));
        }

        try {
          if (acc.entries.length === 0) {
            await deleteRemoteKhataAccount(acc, isPayable ? "payable" : "receivable");
          } else {
            await deleteRemoteKhataEntry(acc, entryToDelete, isPayable ? "payable" : "receivable");
          }
        } catch (error) {
          if (entryToDelete) acc.entries.splice(entryIndex === -1 ? acc.entries.length : entryIndex, 0, entryToDelete);
          showNotice(notice, `Delete failed: ${error.message || "Unable to delete this entry."}`);
          return;
        }

        if (acc.entries.length === 0) {
          const accIndex = accounts.findIndex((a) => a.id === acc.id || a.customer.toLowerCase() === acc.customer.toLowerCase());
          if (accIndex !== -1) accounts.splice(accIndex, 1);
          saveStore(store, { skipRemote: true });
          populateCustomers(allAccountsValue);
          renderAccount(allAccountsValue);
          renderCustomerList();
          resetForm();
          showNotice(notice, `All entries deleted. ${acc.customer} record removed from khata.`);
        } else {
          saveStore(store, { skipRemote: true });
          populateCustomers(acc.id);
          renderAccount(acc.id);
          renderCustomerList();
          showNotice(notice, "Statement entry deleted successfully.");
          if (editingId === deleteId) resetForm();
        }
      }
    });

    if (customerListBody) {
      customerListBody.addEventListener("click", (event) => {
        const openId = event.target.getAttribute("data-open-customer");
        const editCustomerId = event.target.getAttribute("data-edit-customer");
        if (openId) {
          populateCustomers(openId);
          renderAccount(openId);
          resetForm();
          const statementEl = document.querySelector(".statement-shell");
          if (statementEl) statementEl.scrollIntoView({ behavior: "smooth" });
        }
        if (editCustomerId) {
          const account = findAccountByIdOrName(editCustomerId);
          if (account) fillCustomerForm(account);
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
    window.activePageRender = () => {
      populateCustomers(select.value);
      renderAccount(select.value);
    };
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

  function initializePage(store, page) {
    document.body.dataset.page = page;
    setActiveNav();

    if (page !== "signin" && page !== "admin-login") {
      window.refreshPaymentNotifications = bindPaymentNotifications(() => store.bookings);
    }

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

    const hydrationPromises = [];
    if (["dashboard", "booking", "ledger", "khata"].includes(page)) {
      hydrationPromises.push(hydrateBookingsFromSupabase(store));
    }
    if (["dashboard", "truck", "truck-summary", "completed-truck-summary", "equipment", "maintenance", "employee", "khata", "accounts-payable", "activity-logs"].includes(page)) {
      hydrationPromises.push(hydrateOperationalStore(store));
    }

    if (hydrationPromises.length) {
      Promise.all(hydrationPromises)
        .then(() => {
          console.log("Background operational and bookings store hydration completed successfully.");
          if (typeof window.refreshPaymentNotifications === "function") {
            try {
              window.refreshPaymentNotifications();
            } catch (err) {
              console.warn("Error refreshing global notifications after hydration:", err.message);
            }
          }
          if (typeof window.activePageRender === "function") {
            try {
              window.activePageRender();
            } catch (err) {
              console.warn("Error re-rendering active page after background hydration:", err.message);
            }
          }
        })
        .catch((err) => {
          console.error("Background store hydration failed:", err);
        });
    }
  }

  function bindGlobalDateAutoSelect() {
    document.addEventListener("focusin", (event) => {
      const target = event.target;
      if (target && target.tagName === "INPUT" && target.type === "date" && !target.value) {
        target.value = getTodayIsoDate();
        target.dispatchEvent(new Event("input", { bubbles: true }));
        target.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (target && target.tagName === "INPUT" && target.type === "date" && !target.value) {
        target.value = getTodayIsoDate();
        target.dispatchEvent(new Event("input", { bubbles: true }));
        target.dispatchEvent(new Event("change", { bubbles: true }));
      }
      const datePickerBtn = target.closest("[data-open-date-picker], .date-picker-btn");
      if (datePickerBtn) {
        const group = datePickerBtn.closest(".date-input-group");
        if (group) {
          const textInput = group.querySelector("input[type='text']");
          const dateInput = group.querySelector("input[type='date']");
          if (dateInput && !dateInput.value) {
            dateInput.value = getTodayIsoDate();
            dateInput.dispatchEvent(new Event("input", { bubbles: true }));
            dateInput.dispatchEvent(new Event("change", { bubbles: true }));
          }
          if (textInput && !textInput.value) {
            textInput.value = formatShortDate(getTodayIsoDate());
            textInput.dispatchEvent(new Event("input", { bubbles: true }));
            textInput.dispatchEvent(new Event("change", { bubbles: true }));
          }
        }
      }
    });
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const store = loadStore();
    const page = document.body.dataset.page;
    if (!await enforceSoftwareAccess(page)) return;

    if (!history.state) {
      history.replaceState({ page, url: window.location.href }, "", window.location.href);
    }

    bindGlobalDateAutoSelect();
    bindPageTransitions();
    syncAdminNavigationRoute();
    ensureEquipmentNavigation();
    ensureMaintenanceNavigation();
    ensureAccountsNavigationOrder();
    ensureActivityLogsNavigation();
    applySessionAccess();
    bindMobileNav();
    if (page !== "signin") bindSoftwareSignOut();
    bindDesktopSidebar();

    initializePage(store, page);
  });
})();
