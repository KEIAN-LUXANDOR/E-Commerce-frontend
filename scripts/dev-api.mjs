#!/usr/bin/env node
/**
 * DEV ONLY: a stand-in for the Spring Boot backend, so the website can be run and tested
 * without Java or a database. It follows docs/API-ENDPOINTS.md:
 *   - LIVE endpoints behave like the real backend (same paths, fields, errors, CSRF, session cookie).
 *   - PLANNED endpoints follow the proposed contracts, so the pages can be tried end to end.
 *
 * Run:   node scripts/dev-api.mjs            (listens on http://localhost:8080)
 * Then:  NEXT_PUBLIC_FEATURES=all npm run dev
 *
 * Test logins:   riya@example.com / Secret@123   (verified customer)
 *                new@example.com  / Secret@123   (email not verified)
 *                admin@example.com / Admin@12345 (ADMIN)
 * Data lives in memory and resets when you stop the script. Never deploy this.
 */
import http from "node:http";
import crypto from "node:crypto";

const PORT = Number(process.env.PORT ?? 8080);
const now = () => new Date().toISOString();
const uuid = () => crypto.randomUUID();
/** Same id every time for the same text, so restarting this script doesn't change product ids. */
const stableId = (text) => {
  const h = crypto.createHash("sha1").update(text).digest("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-8${h.slice(17, 20)}-${h.slice(20, 32)}`;
};

// ---------------------------------------------------------------- data

const SHAPES = ["ROUND", "OVAL", "CUSHION", "EMERALD", "PEAR", "PRINCESS", "RADIANT", "ASSCHER", "MARQUISE", "HEART"];
const COLORS = ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
const CLARITIES = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1", "I2", "I3"];
const CUTS = ["IDEAL", "EXCELLENT", "VERY_GOOD", "GOOD", "FAIR"];
const FINISHES = ["EXCELLENT", "VERY_GOOD", "GOOD", "FAIR"];
const FLUOR = ["NONE", "FAINT", "MEDIUM", "STRONG", "VERY_STRONG"];
const LABS = ["GIA", "IGI", "HRD"];
const ORIGINS = ["NATURAL", "LAB_GROWN"];
const SORTS = ["recommended", "newest", "price_asc", "price_desc", "carat_asc", "carat_desc", "name"];
const STATES = ["Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"];
const title = (s) => s.charAt(0) + s.slice(1).toLowerCase();

let seed = 7;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const pick = (list, max = list.length) => list[Math.floor(rand() * max)];

const products = []; // { id, slug, name, description, status, createdAt, diamond, images[], variant{...} }
for (let i = 0; i < 40; i++) {
  const origin = i % 3 === 0 ? "NATURAL" : "LAB_GROWN";
  const shape = SHAPES[i % SHAPES.length];
  const carat = Math.round((0.3 + rand() * 2.7) * 100) / 100;
  const color = pick(COLORS, 7);
  const clarity = pick(CLARITIES, 8);
  const cut = shape === "ROUND" ? pick(CUTS, 3) : null;
  const base = origin === "NATURAL" ? 380000 : 65000;
  const rupees = base * Math.pow(carat, 1.6) * (1 + (7 - COLORS.indexOf(color)) * 0.06);
  const pricePaise = Math.round(rupees / 100) * 100 * 100;
  const slug = `${carat.toFixed(2).replace(".", "-")}-ct-${shape.toLowerCase()}-${origin === "NATURAL" ? "natural" : "lab-grown"}-kl${1001 + i}`;
  const name = `${carat.toFixed(2)} ct ${title(shape)} ${origin === "NATURAL" ? "Natural" : "Lab-grown"} Diamond`;
  const id = stableId(`product:${slug}`);
  const hasImage = i % 4 !== 3;
  products.push({
    id,
    slug,
    name,
    description: `A ${carat.toFixed(2)} carat ${shape.toLowerCase()} ${origin === "NATURAL" ? "natural" : "lab-grown"} diamond with its ${i % 3 === 0 ? "GIA" : "IGI"} grading report.`,
    status: i === 39 ? "DRAFT" : "ACTIVE",
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    diamond: {
      origin, shape, carat, color, clarity, cut,
      polish: pick(FINISHES, 2), symmetry: pick(FINISHES, 2), fluorescence: pick(FLUOR, 3),
      lab: origin === "NATURAL" ? "GIA" : pick(["IGI", "IGI", "GIA"]), quickShip: i % 2 === 0,
    },
    images: hasImage ? [{ id: stableId(`image:${slug}`), url: `/images/sample/${shape.toLowerCase()}.svg`, altText: name, sortOrder: 0 }] : [],
    variant: { id: stableId(`variant:${slug}`), sku: `KL-${1001 + i}`, pricePaise, mrpPaise: null, stockQuantity: i === 5 ? 0 : 1, active: true },
    everOrdered: false,
  });
}

const users = new Map(); // email -> user
function addUser(email, password, fullName, role, emailVerified, phone = null) {
  const u = { id: uuid(), email, password, fullName, phone, role, emailVerified, createdAt: now(), addresses: [], wishlist: [], cart: [] };
  users.set(email, u);
  return u;
}
const riya = addUser("riya@example.com", "Secret@123", "Riya Shah", "CUSTOMER", true, "9876543210");
addUser("new@example.com", "Secret@123", "Neel Patil", "CUSTOMER", false);
addUser("admin@example.com", "Admin@12345", "Store Admin", "ADMIN", true);
riya.addresses.push({ id: uuid(), fullName: "Riya Shah", phone: "9876543210", line1: "Flat 4B, Sai Heights, Baner Road", line2: null, landmark: "Near Balewadi High Street", city: "Pune", state: "Maharashtra", pincode: "411045", defaultAddress: true, createdAt: now() });

const sessions = new Map(); // sid -> { userId, csrf }
const tokens = new Map(); // token -> { email, kind, expires }
const orders = []; // full order objects + userId
const returns = [];
const enquiries = [];
const coupons = [];
let orderSeq = 100001;
let returnSeq = 5001;

// ---------------------------------------------------------------- helpers

const userById = (id) => [...users.values()].find((u) => u.id === id);
const userView = (u) => ({ id: u.id, email: u.email, fullName: u.fullName, phone: u.phone, role: u.role, emailVerified: u.emailVerified, createdAt: u.createdAt });
const variantView = (p) => ({ id: p.variant.id, sku: p.variant.sku, name: "Single stone", pricePaise: p.variant.pricePaise, mrpPaise: p.variant.mrpPaise, inStock: p.variant.active && p.variant.stockQuantity > 0 });
const productView = (p) => ({
  id: p.id, slug: p.slug, name: p.name, description: p.description, diamond: p.diamond,
  images: [...p.images].sort((a, b) => a.sortOrder - b.sortOrder).map(({ url, altText }) => ({ url, altText })),
  variants: p.variant.active ? [variantView(p)] : [],
});
const adminProductView = (p) => ({ ...productView(p), status: p.status, images: p.images, variant: p.variant, everOrdered: p.everOrdered, createdAt: p.createdAt, updatedAt: p.createdAt });
const page = (list, pageNo, size) => ({ items: list.slice(pageNo * size, pageNo * size + size), page: pageNo, size, totalItems: list.length, totalPages: Math.ceil(list.length / size) });

function send(res, status, body, headers = {}) {
  res.writeHead(status, { "Content-Type": "application/json", ...headers });
  res.end(body === undefined ? "" : JSON.stringify(body));
}
function problem(res, status, title, detail, extra = {}) {
  res.writeHead(status, { "Content-Type": "application/problem+json" });
  res.end(JSON.stringify({ status, title, detail, instance: res.req.url.split("?")[0], ...extra }));
}
const bad = (res, detail, errors) => problem(res, 400, "Invalid Input", detail, errors ? { errors } : {});
const notFound = (res, detail = "Not found.") => problem(res, 404, "Resource Not Found", detail);

const cookies = (req) => Object.fromEntries((req.headers.cookie ?? "").split(/;\s*/).filter(Boolean).map((c) => [c.slice(0, c.indexOf("=")), c.slice(c.indexOf("=") + 1)]));
function newSession(res, userId = null) {
  const sid = crypto.randomBytes(16).toString("hex");
  sessions.set(sid, { userId, csrf: crypto.randomBytes(16).toString("hex") });
  res.setHeader("Set-Cookie", `JSESSIONID=${sid}; Path=/; HttpOnly; SameSite=Lax`);
  return sessions.get(sid);
}

async function readBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return Buffer.concat(chunks);
}
function parseJson(buf) {
  if (!buf.length) return {};
  try { return JSON.parse(buf.toString("utf8")); } catch { return null; }
}
/** Minimal multipart reader: returns { fields, files: { name: { filename, data } } } */
function parseMultipart(buf, contentType) {
  const boundary = /boundary=(.+)$/.exec(contentType ?? "")?.[1];
  const out = { fields: {}, files: {} };
  if (!boundary) return out;
  for (const part of buf.toString("latin1").split(`--${boundary}`)) {
    const [head, ...rest] = part.split("\r\n\r\n");
    const name = /name="([^"]+)"/.exec(head)?.[1];
    if (!name) continue;
    const value = rest.join("\r\n\r\n").replace(/\r\n$/, "");
    const filename = /filename="([^"]*)"/.exec(head)?.[1];
    if (filename !== undefined) out.files[name] = { filename, data: Buffer.from(value, "latin1") };
    else out.fields[name] = Buffer.from(value, "latin1").toString("utf8");
  }
  return out;
}

const PHONE = /^[6-9]\d{9}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function expireOrders() {
  for (const o of orders) {
    if (o.status === "PENDING_PAYMENT" && new Date(o.expiresAt) < new Date()) cancelOrder(o, "PAYMENT_TIMEOUT");
  }
}
function cancelOrder(o, reason) {
  o.status = "CANCELLED";
  o.cancelledAt = now();
  o.cancelReason = reason;
  o.history.push({ status: "CANCELLED", at: now(), by: null, note: reason });
  for (const item of o.items) {
    const p = products.find((x) => x.variant.id === item.variantId);
    if (p) p.variant.stockQuantity += 1;
  }
}
const orderView = (o) => {
  const { userId: _u, history: _h, notes: _n, payment: _p, ...rest } = o;
  const ret = returns.find((r) => r.orderNumber === o.orderNumber);
  return { ...rest, items: o.items.map(({ variantId: _v, ...i }) => i), returnRequest: ret ? { returnNumber: ret.returnNumber, status: ret.status, requestedAt: ret.requestedAt } : null };
};
const orderSummary = (o) => ({ orderNumber: o.orderNumber, status: o.status, createdAt: o.createdAt, itemCount: o.items.length, totalPaise: o.totalPaise, firstItemName: o.items[0]?.productName ?? "", firstItemImageUrl: o.items[0]?.imageUrl ?? null });
const adminOrderSummary = (o) => { const u = userById(o.userId); return { orderNumber: o.orderNumber, status: o.status, customerName: u?.fullName ?? "", customerEmail: u?.email ?? "", itemCount: o.items.length, totalPaise: o.totalPaise, createdAt: o.createdAt, paidAt: o.paidAt }; };
const adminOrderView = (o) => { const u = userById(o.userId); return { ...orderView(o), customer: { id: u.id, fullName: u.fullName, email: u.email, phone: u.phone }, payment: o.payment, history: o.history, notes: o.notes }; };

function cartView(u) {
  const items = u.cart.map((c) => {
    const p = products.find((x) => x.variant.id === c.variantId);
    if (!p || p.status !== "ACTIVE") return null;
    const v = variantView(p);
    return { variantId: c.variantId, product: productView(p), pricePaise: p.variant.active ? v.pricePaise : null, available: v.inStock, addedAt: c.addedAt };
  }).filter(Boolean);
  const subtotal = items.filter((i) => i.available).reduce((s, i) => s + i.pricePaise, 0);
  let discount = 0;
  let coupon = null;
  if (u.coupon) {
    const c = coupons.find((x) => x.code === u.coupon && x.active);
    if (c && subtotal >= c.minOrderPaise) {
      discount = c.type === "PERCENT" ? Math.round((subtotal * c.value) / 100) : c.value;
      if (c.maxDiscountPaise) discount = Math.min(discount, c.maxDiscountPaise);
      discount = Math.min(discount, subtotal);
      coupon = { code: c.code, discountPaise: discount, description: c.description };
    }
  }
  return { items, itemCount: items.length, subtotalPaise: subtotal, hasUnavailableItems: items.some((i) => !i.available), coupon, discountPaise: discount, totalPaise: subtotal - discount };
}

function filterProducts(sp) {
  const errors = [];
  const list = (key, allowed) => {
    const all = sp.getAll(key).flatMap((v) => v.split(",")).map((v) => v.trim()).filter(Boolean);
    for (const v of all) if (!allowed.includes(v)) errors.push(key);
    return all;
  };
  const num = (key) => {
    const v = sp.get(key);
    if (v === null || v === "") return undefined;
    const n = Number(v);
    if (!Number.isFinite(n)) errors.push(key);
    return n;
  };
  const origin = sp.get("origin");
  if (origin && !ORIGINS.includes(origin)) errors.push("origin");
  const f = {
    q: sp.get("q")?.toLowerCase(), origin,
    shape: list("shape", SHAPES), color: list("color", COLORS), clarity: list("clarity", CLARITIES), cut: list("cut", CUTS),
    polish: list("polish", FINISHES), symmetry: list("symmetry", FINISHES), fluorescence: list("fluorescence", FLUOR), lab: list("lab", LABS),
    minCarat: num("minCarat"), maxCarat: num("maxCarat"), minPrice: num("minPrice"), maxPrice: num("maxPrice"),
    withImage: sp.get("withImage") === "true", quickShip: sp.get("quickShip") === "true",
  };
  const sort = sp.get("sort") ?? "recommended";
  if (!SORTS.includes(sort)) errors.push("sort");
  if (errors.length) return { error: errors[0] };
  let out = products.filter((p) => p.status === "ACTIVE" && p.variant.active);
  const d = (p) => p.diamond;
  const inList = (vals, v) => vals.length === 0 || vals.includes(v);
  out = out.filter((p) =>
    (!f.q || p.name.toLowerCase().includes(f.q)) && (!f.origin || d(p).origin === f.origin) &&
    inList(f.shape, d(p).shape) && inList(f.color, d(p).color) && inList(f.clarity, d(p).clarity) &&
    (f.cut.length === 0 || (d(p).cut && f.cut.includes(d(p).cut))) && inList(f.polish, d(p).polish) &&
    inList(f.symmetry, d(p).symmetry) && inList(f.fluorescence, d(p).fluorescence) && inList(f.lab, d(p).lab) &&
    (f.minCarat === undefined || d(p).carat >= f.minCarat) && (f.maxCarat === undefined || d(p).carat <= f.maxCarat) &&
    (f.minPrice === undefined || p.variant.pricePaise >= f.minPrice) && (f.maxPrice === undefined || p.variant.pricePaise <= f.maxPrice) &&
    (!f.withImage || p.images.length > 0) && (!f.quickShip || d(p).quickShip));
  const by = {
    price_asc: (a, b) => a.variant.pricePaise - b.variant.pricePaise,
    price_desc: (a, b) => b.variant.pricePaise - a.variant.pricePaise,
    carat_asc: (a, b) => a.diamond.carat - b.diamond.carat,
    carat_desc: (a, b) => b.diamond.carat - a.diamond.carat,
    name: (a, b) => a.name.localeCompare(b.name),
  }[sort] ?? ((a, b) => b.createdAt.localeCompare(a.createdAt));
  return { list: out.sort(by) };
}

function validateAddress(b) {
  const errors = [];
  if (!b.fullName?.trim()) errors.push({ field: "fullName", message: "Enter the full name" });
  if (!PHONE.test(b.phone ?? "")) errors.push({ field: "phone", message: "Enter a 10-digit mobile number" });
  if (!b.line1?.trim()) errors.push({ field: "line1", message: "Enter the house or flat number and street" });
  if (!b.city?.trim()) errors.push({ field: "city", message: "Enter the city" });
  if (!/^[1-9]\d{5}$/.test(b.pincode ?? "")) errors.push({ field: "pincode", message: "Enter a 6-digit PIN code" });
  const state = STATES.find((s) => s.toLowerCase() === String(b.state ?? "").toLowerCase());
  if (!state) errors.push({ field: "state", message: "Choose a valid Indian state or union territory." });
  return { errors, state };
}

function svgFor(shape) {
  const outlines = {
    round: '<circle cx="50" cy="50" r="34"/>', oval: '<ellipse cx="50" cy="50" rx="26" ry="36"/>',
    cushion: '<rect x="18" y="18" width="64" height="64" rx="16"/>', emerald: '<polygon points="30,14 70,14 80,24 80,76 70,86 30,86 20,76 20,24"/>',
    pear: '<path d="M50 12 C70 40 78 56 78 66 a28 26 0 0 1 -56 0 C22 56 30 40 50 12z"/>', princess: '<rect x="18" y="18" width="64" height="64"/>',
    radiant: '<polygon points="28,14 72,14 82,24 82,76 72,86 28,86 18,76 18,24"/>', asscher: '<polygon points="32,18 68,18 82,32 82,68 68,82 32,82 18,68 18,32"/>',
    marquise: '<path d="M50 10 C76 34 76 66 50 90 C24 66 24 34 50 10z"/>', heart: '<path d="M50 84 C20 60 14 44 22 30 a16 16 0 0 1 28 0 a16 16 0 0 1 28 0 C86 44 80 60 50 84z"/>',
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#F1F5F9"/><g fill="#FFFFFF" stroke="#0A192F" stroke-width="1.2">${outlines[shape] ?? outlines.round}</g><text x="50" y="97" font-size="5" text-anchor="middle" fill="#64748B" font-family="sans-serif">SAMPLE PHOTO</text></svg>`;
}

// ---------------------------------------------------------------- server

const CSRF_EXEMPT = new Set(["/api/v1/auth/register", "/api/v1/auth/login", "/api/v1/auth/verify-email", "/api/v1/auth/resend-verification", "/api/v1/auth/forgot-password", "/api/v1/auth/reset-password"]);
const failures = new Map();

http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  const path = url.pathname;
  const method = req.method;
  const sid = cookies(req).JSESSIONID;
  let session = sid ? sessions.get(sid) : undefined;
  const user = session?.userId ? userById(session.userId) : undefined;
  expireOrders();

  try {
    if (path.startsWith("/images/sample/")) {
      res.writeHead(200, { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=3600" });
      return res.end(svgFor(path.split("/").pop().replace(".svg", "")));
    }
    if (path.startsWith("/images/uploads/")) {
      const img = uploads.get(path);
      if (!img) return notFound(res);
      res.writeHead(200, { "Content-Type": img.type });
      return res.end(img.data);
    }
    if (path === "/actuator/health") return send(res, 200, { status: "UP" });
    if (!path.startsWith("/api/v1/")) return notFound(res);

    // CSRF on every write except the six public account endpoints
    if (!["GET", "HEAD", "OPTIONS"].includes(method) && !CSRF_EXEMPT.has(path) && !path.startsWith("/api/v1/payments/")) {
      if (!session || req.headers["x-csrf-token"] !== session.csrf) return problem(res, 403, "Forbidden", "Missing or invalid CSRF token.");
    }

    const raw = await readBody(req);
    const isMultipart = (req.headers["content-type"] ?? "").startsWith("multipart/");
    const body = isMultipart ? parseMultipart(raw, req.headers["content-type"]) : parseJson(raw);
    if (body === null) return bad(res, "Malformed JSON.");
    const p = path.slice("/api/v1".length);
    const seg = p.split("/").filter(Boolean);

    // ---------------- auth
    if (p === "/auth/csrf" && method === "GET") {
      if (!session) session = newSession(res);
      return send(res, 200, { headerName: "X-CSRF-TOKEN", token: session.csrf });
    }
    if (p === "/auth/register" && method === "POST") {
      const errors = [];
      if (!EMAIL.test(body.email ?? "")) errors.push({ field: "email", message: "Enter a valid email address" });
      if (!body.password || body.password.length < 8 || body.password.length > 72) errors.push({ field: "password", message: "Password must be 8 to 72 characters" });
      if (!body.fullName?.trim()) errors.push({ field: "fullName", message: "Enter your full name" });
      if (body.phone && !PHONE.test(body.phone)) errors.push({ field: "phone", message: "Enter a 10-digit Indian mobile number" });
      if (errors.length) return bad(res, "One or more fields are invalid.", errors);
      const email = body.email.trim().toLowerCase();
      if (users.has(email)) return problem(res, 409, "Conflict", "An account with this email already exists.");
      const u = addUser(email, body.password, body.fullName.trim(), "CUSTOMER", false, body.phone || null);
      const token = crypto.randomBytes(12).toString("hex");
      tokens.set(token, { email, kind: "verify" });
      console.log(`[dev-api] verification link: http://localhost:3000/verify-email?token=${token}`);
      return send(res, 201, userView(u));
    }
    if (p === "/auth/login" && method === "POST") {
      const email = String(body.email ?? "").trim().toLowerCase();
      if ((failures.get(email) ?? 0) >= 5) return problem(res, 429, "Too Many Requests", "Too many failed login attempts. Please try again in 15 minutes.");
      const u = users.get(email);
      if (!u || u.password !== body.password) {
        failures.set(email, (failures.get(email) ?? 0) + 1);
        return problem(res, 401, "Unauthorized", "Invalid email or password.");
      }
      failures.delete(email);
      newSession(res, u.id);
      return send(res, 200, userView(u));
    }
    if (p === "/auth/logout" && method === "POST") {
      sessions.delete(sid);
      res.setHeader("Set-Cookie", "JSESSIONID=; Path=/; Max-Age=0");
      res.writeHead(204);
      return res.end();
    }
    if (p === "/auth/verify-email" && method === "POST") {
      const t = tokens.get(body.token);
      if (!t || t.kind !== "verify") return bad(res, "This link is invalid or has expired. Please request a new one.");
      users.get(t.email).emailVerified = true;
      tokens.delete(body.token);
      return send(res, 200, { message: "Your email address is verified." });
    }
    if (p === "/auth/resend-verification" && method === "POST") {
      const u = users.get(String(body.email ?? "").toLowerCase());
      if (u && !u.emailVerified) {
        const token = crypto.randomBytes(12).toString("hex");
        tokens.set(token, { email: u.email, kind: "verify" });
        console.log(`[dev-api] verification link: http://localhost:3000/verify-email?token=${token}`);
      }
      return send(res, 202, { message: "If an unverified account exists for this email, we have sent a new verification link." });
    }
    if (p === "/auth/forgot-password" && method === "POST") {
      const u = users.get(String(body.email ?? "").toLowerCase());
      if (u) {
        const token = crypto.randomBytes(12).toString("hex");
        tokens.set(token, { email: u.email, kind: "reset" });
        console.log(`[dev-api] reset link: http://localhost:3000/reset-password?token=${token}`);
      }
      return send(res, 202, { message: "If an account exists for this email, we have sent a password reset link." });
    }
    if (p === "/auth/reset-password" && method === "POST") {
      const t = tokens.get(body.token);
      if (!t || t.kind !== "reset") return bad(res, "This link is invalid or has expired. Please request a new one.");
      if (!body.newPassword || body.newPassword.length < 8) return bad(res, "One or more fields are invalid.", [{ field: "newPassword", message: "Password must be 8 to 72 characters" }]);
      const u = users.get(t.email);
      u.password = body.newPassword;
      u.emailVerified = true;
      tokens.delete(body.token);
      return send(res, 200, { message: "Your password has been changed. Please log in with your new password." });
    }

    // ---------------- catalogue (public)
    if (p === "/categories" && method === "GET") {
      return send(res, 200, [
        { id: stableId("cat:natural"), slug: "natural", name: "Natural Diamonds" },
        { id: stableId("cat:lab-grown"), slug: "lab-grown", name: "Lab-Grown Diamonds" }
      ]);
    }
    if (p === "/banners/active" && method === "GET") {
      return send(res, 200, [
        {
          id: "ban-001",
          title: "Certified Loose Diamonds",
          text: "Direct atelier sourcing from Surat and Mumbai cutting vaults. Inspected in Pune.",
          ctaLabel: "Browse Solitaires",
          ctaHref: "/diamonds",
          shape: "ROUND",
          startsAt: "2026-01-01T00:00:00Z",
          endsAt: "2026-12-31T23:59:59Z",
        }
      ]);
    }
    if (seg[0] === "products" && seg[2] === "similar" && method === "GET") {
      const slug = decodeURIComponent(seg[1]);
      const cur = products.find((x) => x.slug === slug);
      const sim = products.filter((x) => x.status === "ACTIVE" && x.slug !== slug && (!cur || x.diamond.origin === cur.diamond.origin));
      return send(res, 200, sim.slice(0, 4).map(productView));
    }
    if (p.startsWith("/products/featured") && method === "GET") {
      return send(res, 200, products.filter((x) => x.status === "ACTIVE").slice(0, 4).map(productView));
    }
    if (p === "/products" && method === "GET") {
      const r = filterProducts(url.searchParams);
      if (r.error) return bad(res, `Invalid value for '${r.error}'.`);
      const pg = Math.max(0, Number(url.searchParams.get("page") ?? 0));
      const size = Math.min(50, Math.max(1, Number(url.searchParams.get("size") ?? 20)));
      const out = page(r.list, pg, size);
      return send(res, 200, { ...out, items: out.items.map(productView) });
    }
    if (seg[0] === "products" && seg.length === 2 && method === "GET") {
      const prod = products.find((x) => x.slug === decodeURIComponent(seg[1]) && x.status === "ACTIVE");
      if (!prod) return notFound(res, `Product not found: ${seg[1]}`);
      return send(res, 200, productView(prod));
    }

    // ---------------- public planned
    if (p === "/orders/track" && method === "POST") {
      const o = orders.find((x) => x.orderNumber === String(body.orderNumber ?? "").trim().toUpperCase());
      const u = o && userById(o.userId);
      if (!o || u.email !== String(body.email ?? "").trim().toLowerCase()) return notFound(res, "We couldn't find an order with these details.");
      return send(res, 200, { orderNumber: o.orderNumber, status: o.status, placedAt: o.createdAt, deliverTo: { city: o.shippingAddress.city, pincode: o.shippingAddress.pincode }, shipment: o.shipment, timeline: o.history.map(({ status, at }) => ({ status, at })) });
    }
    if (p === "/enquiries" && method === "POST") {
      const errors = [];
      if (!body.fullName?.trim()) errors.push({ field: "fullName", message: "Enter your name" });
      if (!EMAIL.test(body.email ?? "")) errors.push({ field: "email", message: "Enter a valid email address" });
      if (body.phone && !PHONE.test(body.phone)) errors.push({ field: "phone", message: "Enter a 10-digit mobile number" });
      if (!body.message?.trim()) errors.push({ field: "message", message: "Write a short message" });
      if (errors.length) return bad(res, "One or more fields are invalid.", errors);
      enquiries.unshift({ id: uuid(), status: "NEW", createdAt: now(), productSlug: null, preferredDate: null, preferredTime: null, ...body });
      return send(res, 201, { message: body.type === "VIEWING" ? "Thank you. We'll call you within one working day to confirm your viewing." : "Thank you. We'll reply within one working day." });
    }
    if (p === "/newsletter" && method === "POST") {
      if (!EMAIL.test(body.email ?? "")) return bad(res, "One or more fields are invalid.", [{ field: "email", message: "Enter a valid email address" }]);
      return send(res, 202, { message: "Thank you. Please check your inbox to confirm." });
    }
    const isPincode = (seg[0] === "delivery" && seg[1] === "pincode" && seg[2]) || (seg[0] === "pincodes" && seg[1]);
    if (isPincode && method === "GET") {
      const pin = seg[0] === "pincodes" ? (seg[1] ?? "") : (seg[2] ?? "");
      if (!/^[1-9]\d{5}$/.test(pin)) return bad(res, "Enter a 6-digit PIN code.");
      const serviceable = !pin.startsWith("19");
      const metro = ["11", "40", "41", "56", "60", "70", "50"].includes(pin.slice(0, 2));
      return send(res, 200, { pincode: pin, serviceable, city: pin.startsWith("41") ? "Pune" : null, state: null, minDays: metro ? 2 : 4, maxDays: metro ? 4 : 7 });
    }

    // ---------------- everything below needs login
    if (!user) return problem(res, 401, "Unauthorized", "Please log in to continue.");

    if (p === "/auth/me" && method === "GET") return send(res, 200, userView(user));
    if (p === "/account/profile" && method === "PUT") {
      const errors = [];
      if (!body.fullName?.trim()) errors.push({ field: "fullName", message: "Enter your full name" });
      if (body.phone && !PHONE.test(body.phone)) errors.push({ field: "phone", message: "Enter a 10-digit Indian mobile number" });
      if (errors.length) return bad(res, "One or more fields are invalid.", errors);
      user.fullName = body.fullName.trim();
      user.phone = body.phone || null;
      return send(res, 200, userView(user));
    }
    if (p === "/account/change-password" && method === "POST") {
      if (body.currentPassword !== user.password) return bad(res, "Your current password is incorrect.");
      if (body.newPassword === user.password) return bad(res, "Your new password must be different from your current password.");
      if (!body.newPassword || body.newPassword.length < 8) return bad(res, "One or more fields are invalid.", [{ field: "newPassword", message: "Password must be 8 to 72 characters" }]);
      user.password = body.newPassword;
      return send(res, 200, { message: "Your password has been changed." });
    }
    if (p === "/account/checkout-eligibility" && method === "GET") {
      if (!user.emailVerified) return problem(res, 403, "Forbidden", "Please verify your email address before placing an order.", { code: "EMAIL_NOT_VERIFIED" });
      return send(res, 200, { canCheckout: true });
    }

    // addresses
    if (p === "/account/addresses/states" && method === "GET") return send(res, 200, STATES);
    if (p === "/account/addresses" && method === "GET") {
      return send(res, 200, [...user.addresses].sort((a, b) => Number(b.defaultAddress) - Number(a.defaultAddress)).map(({ createdAt: _c, ...a }) => a));
    }
    if (p === "/account/addresses" && method === "POST") {
      const { errors, state } = validateAddress(body);
      if (errors.length) return bad(res, "One or more fields are invalid.", errors);
      if (user.addresses.length >= 10) return bad(res, "You can save up to 10 addresses. Please delete one first.");
      const makeDefault = body.makeDefault === true || user.addresses.length === 0;
      if (makeDefault) user.addresses.forEach((a) => (a.defaultAddress = false));
      const a = { id: uuid(), fullName: body.fullName.trim(), phone: body.phone, line1: body.line1.trim(), line2: body.line2 || null, landmark: body.landmark || null, city: body.city.trim(), state, pincode: body.pincode, defaultAddress: makeDefault, createdAt: now() };
      user.addresses.push(a);
      const { createdAt: _c, ...view } = a;
      return send(res, 201, view);
    }
    if (seg[0] === "account" && seg[1] === "addresses" && seg[2]) {
      const a = user.addresses.find((x) => x.id === seg[2]);
      if (!a) return notFound(res, "Address not found.");
      if (seg[3] === "default" && method === "PUT") {
        user.addresses.forEach((x) => (x.defaultAddress = x.id === a.id));
        const { createdAt: _c, ...view } = a;
        return send(res, 200, view);
      }
      if (method === "PUT") {
        const { errors, state } = validateAddress(body);
        if (errors.length) return bad(res, "One or more fields are invalid.", errors);
        Object.assign(a, { fullName: body.fullName.trim(), phone: body.phone, line1: body.line1.trim(), line2: body.line2 || null, landmark: body.landmark || null, city: body.city.trim(), state, pincode: body.pincode });
        if (body.makeDefault) user.addresses.forEach((x) => (x.defaultAddress = x.id === a.id));
        const { createdAt: _c, ...view } = a;
        return send(res, 200, view);
      }
      if (method === "DELETE") {
        user.addresses = user.addresses.filter((x) => x.id !== a.id);
        if (a.defaultAddress && user.addresses.length) user.addresses[user.addresses.length - 1].defaultAddress = true;
        res.writeHead(204);
        return res.end();
      }
    }

    // wishlist
    if (p === "/account/wishlist" && method === "GET") {
      return send(res, 200, user.wishlist.map((w) => ({ product: products.find((x) => x.id === w.productId), addedAt: w.addedAt })).filter((w) => w.product && w.product.status === "ACTIVE").map((w) => ({ product: productView(w.product), addedAt: w.addedAt })));
    }
    if (p === "/account/wishlist/ids" && method === "GET") return send(res, 200, user.wishlist.map((w) => w.productId));
    if (seg[0] === "account" && seg[1] === "wishlist" && seg[2]) {
      if (method === "PUT") {
        const prod = products.find((x) => x.id === seg[2] && x.status === "ACTIVE");
        if (!prod) return notFound(res, "Product not found.");
        if (!user.wishlist.some((w) => w.productId === prod.id)) {
          if (user.wishlist.length >= 100) return bad(res, "Your wishlist can hold up to 100 products. Please remove some first.");
          user.wishlist.unshift({ productId: prod.id, addedAt: now() });
        }
      }
      if (method === "DELETE") user.wishlist = user.wishlist.filter((w) => w.productId !== seg[2]);
      res.writeHead(204);
      return res.end();
    }

    // cart
    if (p === "/account/cart" && method === "GET") return send(res, 200, cartView(user));
    if (p === "/account/cart" && method === "DELETE") {
      user.cart = [];
      res.writeHead(204);
      return res.end();
    }
    if (seg[0] === "account" && seg[1] === "cart" && seg[2] === "items" && seg[3]) {
      if (!/^[0-9a-f-]{36}$/.test(seg[3])) return bad(res, "Invalid value for 'variantId'.");
      if (method === "PUT") {
        if (!user.cart.some((c) => c.variantId === seg[3])) {
          const prod = products.find((x) => x.variant.id === seg[3] && x.status === "ACTIVE");
          if (!prod) return notFound(res, "Product not found.");
          if (prod.variant.stockQuantity < 1) return problem(res, 409, "Conflict", "Sorry, this diamond has just been sold.");
          if (user.cart.length >= 20) return bad(res, "Your cart can hold up to 20 items. Please remove some first.");
          user.cart.unshift({ variantId: seg[3], addedAt: now() });
        }
      }
      if (method === "DELETE") user.cart = user.cart.filter((c) => c.variantId !== seg[3]);
      res.writeHead(204);
      return res.end();
    }
    if (p === "/account/cart/coupon") {
      if (method === "DELETE") { user.coupon = null; return send(res, 200, cartView(user)); }
      const c = coupons.find((x) => x.code === String(body.code ?? "").trim().toUpperCase() && x.active);
      if (!c) return bad(res, "This coupon code isn't valid.");
      if (cartView(user).subtotalPaise < c.minOrderPaise) return bad(res, `This coupon needs a cart of at least ₹${(c.minOrderPaise / 100).toLocaleString("en-IN")}.`);
      user.coupon = c.code;
      return send(res, 200, cartView(user));
    }

    // orders
    if (p === "/account/orders" && method === "POST") {
      if (!user.emailVerified) return problem(res, 403, "Forbidden", "Please verify your email address before placing an order.", { code: "EMAIL_NOT_VERIFIED" });
      const pending = orders.find((o) => o.userId === user.id && o.status === "PENDING_PAYMENT");
      if (pending) return problem(res, 409, "Conflict", "You already have an order waiting for payment.", { code: "PENDING_ORDER_EXISTS", orderNumber: pending.orderNumber });
      const address = user.addresses.find((a) => a.id === body.addressId);
      if (!address) return bad(res, "Choose a delivery address.");
      const cart = cartView(user);
      if (cart.items.length === 0) return bad(res, "Your cart is empty.");
      if (cart.hasUnavailableItems) return problem(res, 409, "Conflict", "One of the diamonds in your cart has just been sold. Please remove it to continue.", { code: "ITEM_SOLD" });
      const reserved = cart.items.map((i) => products.find((x) => x.variant.id === i.variantId));
      reserved.forEach((x) => { x.variant.stockQuantity -= 1; x.everOrdered = true; });
      const { id: _id, defaultAddress: _d, createdAt: _c, ...shippingAddress } = address;
      const o = {
        orderNumber: `KL${orderSeq++}`, userId: user.id, status: "PENDING_PAYMENT", createdAt: now(),
        expiresAt: new Date(Date.now() + 15 * 60000).toISOString(), paidAt: null, cancelledAt: null, cancelReason: null,
        items: cart.items.map((i, n) => ({ lineNumber: n + 1, variantId: i.variantId, productSlug: i.product.slug, productName: i.product.name, sku: i.product.variants[0].sku, description: `${i.product.diamond.carat.toFixed(2)} ct · ${i.product.diamond.color} · ${i.product.diamond.clarity} · ${i.product.diamond.lab}`, imageUrl: i.product.images[0]?.url ?? null, pricePaise: i.pricePaise })),
        subtotalPaise: cart.subtotalPaise, shippingPaise: 0, discountPaise: cart.discountPaise, totalPaise: cart.totalPaise, currency: "INR",
        shippingAddress, shipment: null, payment: null, history: [{ status: "PENDING_PAYMENT", at: now(), by: null, note: null }], notes: [],
      };
      orders.unshift(o);
      user.cart = [];
      user.coupon = null;
      return send(res, 201, orderView(o));
    }
    if (p === "/account/orders" && method === "GET") {
      const mine = orders.filter((o) => o.userId === user.id);
      const out = page(mine, Number(url.searchParams.get("page") ?? 0), Number(url.searchParams.get("size") ?? 10));
      return send(res, 200, { ...out, items: out.items.map(orderSummary) });
    }
    if (seg[0] === "account" && seg[1] === "orders" && seg[2]) {
      const o = orders.find((x) => x.orderNumber === seg[2] && x.userId === user.id);
      if (!o) return notFound(res, "Order not found.");
      if (!seg[3] && method === "GET") return send(res, 200, orderView(o));
      if (seg[3] === "cancel" && method === "POST") {
        if (o.status !== "PENDING_PAYMENT") return problem(res, 409, "Conflict", "Only an order waiting for payment can be cancelled here. Please contact us.");
        cancelOrder(o, "CUSTOMER_CANCELLED");
        return send(res, 200, orderView(o));
      }
      if (seg[3] === "payment" && !seg[4] && method === "POST") {
        if (o.status !== "PENDING_PAYMENT") return problem(res, 409, "Conflict", "This order can't be paid any more.");
        o.payment ??= { razorpayOrderId: `order_mock_${crypto.randomBytes(6).toString("hex")}`, razorpayPaymentId: null, method: null, paidAt: null };
        const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_Tk8mk9UEbyKP18";
        return send(res, 200, {
          keyId,
          razorpayOrderId: o.payment.razorpayOrderId,
          amountPaise: o.totalPaise,
          currency: "INR",
          orderNumber: o.orderNumber,
          expiresAt: o.expiresAt,
          customerName: user.fullName,
          customerEmail: user.email,
          customerPhone: user.phone || "+919876543210",
          prefill: { name: user.fullName, email: user.email, contact: user.phone }
        });
      }
      if (seg[3] === "payment" && seg[4] === "verify" && method === "POST") {
        if (o.status === "PAID") return send(res, 200, orderView(o));
        if (o.status !== "PENDING_PAYMENT") return problem(res, 409, "Conflict", "This order can't be paid any more.");
        if (!body.razorpayPaymentId || !body.razorpayOrderId || body.razorpaySignature === "tampered") {
          return problem(res, 400, "Invalid Input", "We couldn't confirm this payment. If money was taken, it will be refunded automatically.", { code: "PAYMENT_SIGNATURE_INVALID" });
        }
        o.status = "PAID";
        o.paidAt = now();
        o.payment = {
          ...o.payment,
          razorpayOrderId: body.razorpayOrderId,
          razorpayPaymentId: body.razorpayPaymentId,
          method: "razorpay",
          paidAt: o.paidAt
        };
        o.history.push({ status: "PAID", at: o.paidAt, by: user.fullName, note: "Verified via Razorpay" });
        return send(res, 200, orderView(o));
      }
      if (seg[3] === "invoice" && method === "GET") {
        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        return res.end(`DEV INVOICE for ${o.orderNumber}\nThe real backend returns a PDF here.`);
      }
      if (seg[3] === "return" && method === "POST") {
        if (o.status !== "DELIVERED") return problem(res, 409, "Conflict", "Returns can be requested once the order is delivered.");
        if (returns.some((r) => r.orderNumber === o.orderNumber)) return problem(res, 409, "Conflict", "A return has already been requested for this order.");
        if (!body.reason?.trim()) return bad(res, "One or more fields are invalid.", [{ field: "reason", message: "Choose a reason" }]);
        const r = { id: uuid(), returnNumber: `R${returnSeq++}`, orderNumber: o.orderNumber, status: "REQUESTED", reason: body.reason, details: body.details ?? "", requestedAt: now(), customerName: user.fullName, customerEmail: user.email, items: orderView(o).items, refundPaise: null, shipment: null, history: [{ status: "REQUESTED", at: now(), by: null, note: null }] };
        returns.unshift(r);
        return send(res, 201, { returnNumber: r.returnNumber, status: r.status, requestedAt: r.requestedAt });
      }
    }

    // ---------------- admin
    if (seg[0] === "admin") {
      if (user.role !== "ADMIN") return problem(res, 403, "Forbidden", "You do not have permission to do this.");
      const a = seg.slice(1);
      if (a[0] === "summary") {
        const today = new Date().toDateString();
        const paid = orders.filter((o) => o.paidAt);
        const recent = paid.filter((o) => Date.now() - new Date(o.paidAt).getTime() < 30 * 86400000);
        return send(res, 200, {
          ordersToShip: orders.filter((o) => o.status === "PAID").length,
          awaitingPayment: orders.filter((o) => o.status === "PENDING_PAYMENT").length,
          paidToday: { count: paid.filter((o) => new Date(o.paidAt).toDateString() === today).length, totalPaise: paid.filter((o) => new Date(o.paidAt).toDateString() === today).reduce((s, o) => s + o.totalPaise, 0) },
          last30Days: { count: recent.length, totalPaise: recent.reduce((s, o) => s + o.totalPaise, 0) },
          activeDiamonds: products.filter((x) => x.status === "ACTIVE" && x.variant.stockQuantity > 0).length,
          soldLast30Days: recent.reduce((s, o) => s + o.items.length, 0),
          openReturns: returns.filter((r) => ["REQUESTED", "APPROVED", "RECEIVED"].includes(r.status)).length,
          newEnquiries: enquiries.filter((e) => e.status === "NEW").length,
        });
      }
      if (a[0] === "products") {
        if (a[1] === "import" && method === "POST") {
          const file = body.files?.file;
          if (!file) return bad(res, "Choose a CSV file.");
          const lines = file.data.toString("utf8").trim().split(/\r?\n/);
          const head = lines[0].split(",").map((h) => h.trim());
          const errs = [];
          let created = 0;
          lines.slice(1).forEach((line, n) => {
            const cells = line.split(",");
            const row = Object.fromEntries(head.map((h, i) => [h, (cells[i] ?? "").trim()]));
            if (!SHAPES.includes(row.shape)) errs.push({ row: n + 2, field: "shape", message: `Unknown shape "${row.shape}"` });
            else if (!(Number(row.carat) > 0)) errs.push({ row: n + 2, field: "carat", message: "Carat must be a number above 0" });
            else if (!(Number(row.price_rupees) > 0)) errs.push({ row: n + 2, field: "price_rupees", message: "Price must be a number above 0" });
            else created += 1;
          });
          return send(res, 200, { rows: lines.length - 1, created: url.searchParams.get("dryRun") === "true" ? 0 : created, updated: 0, errors: errs, dryRun: url.searchParams.get("dryRun") === "true" });
        }
        if (!a[1] && method === "GET") {
          const q = url.searchParams.get("q")?.toLowerCase();
          const st = url.searchParams.get("status");
          const or = url.searchParams.get("origin");
          const list = products.filter((x) => (!q || x.name.toLowerCase().includes(q) || x.variant.sku.toLowerCase().includes(q)) && (!st || x.status === st) && (!or || x.diamond.origin === or));
          const out = page(list, Number(url.searchParams.get("page") ?? 0), Number(url.searchParams.get("size") ?? 20));
          return send(res, 200, { ...out, items: out.items.map(adminProductView) });
        }
        const saveProduct = (x, b) => {
          const errors = [];
          if (!b.name?.trim()) errors.push({ field: "name", message: "Enter a name" });
          if (!b.sku?.trim()) errors.push({ field: "sku", message: "Enter the SKU" });
          if (!(b.pricePaise > 0)) errors.push({ field: "pricePaise", message: "Enter the price" });
          if (!b.diamond || !(b.diamond.carat > 0)) errors.push({ field: "diamond.carat", message: "Enter the carat weight" });
          if (products.some((o) => o.variant.sku === b.sku && o !== x)) errors.push({ field: "sku", message: "This SKU is already used" });
          if (errors.length) return { errors };
          const slug = b.slug?.trim() || b.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + b.sku.toLowerCase();
          const target = x ?? { id: uuid(), createdAt: now(), images: [], everOrdered: false, variant: { id: uuid() } };
          Object.assign(target, { slug, name: b.name.trim(), description: b.description ?? null, status: b.status ?? "DRAFT", diamond: b.diamond });
          Object.assign(target.variant, { sku: b.sku.trim(), pricePaise: b.pricePaise, mrpPaise: b.mrpPaise ?? null, stockQuantity: b.stockQuantity ?? 1, active: true });
          if (!x) products.unshift(target);
          return { product: target };
        };
        if (!a[1] && method === "POST") {
          const r = saveProduct(null, body);
          if (r.errors) return bad(res, "One or more fields are invalid.", r.errors);
          return send(res, 201, adminProductView(r.product));
        }
        const prod = products.find((x) => x.id === a[1]);
        if (!prod) return notFound(res, "Product not found.");
        if (!a[2] && method === "GET") return send(res, 200, adminProductView(prod));
        if (!a[2] && method === "PUT") {
          const r = saveProduct(prod, body);
          if (r.errors) return bad(res, "One or more fields are invalid.", r.errors);
          return send(res, 200, adminProductView(r.product));
        }
        if (!a[2] && method === "DELETE") {
          if (prod.everOrdered) return problem(res, 409, "Conflict", "This diamond has been ordered before. Archive it instead.");
          products.splice(products.indexOf(prod), 1);
          res.writeHead(204);
          return res.end();
        }
        if (a[2] === "status" && method === "PUT") { prod.status = body.status; return send(res, 200, adminProductView(prod)); }
        if (a[2] === "images" && !a[3] && method === "POST") {
          const file = body.files?.file;
          if (!file) return bad(res, "Choose a photo.");
          const imgUrl = `/images/uploads/${uuid()}`;
          uploads.set(imgUrl, { type: file.filename.endsWith(".png") ? "image/png" : "image/jpeg", data: file.data });
          const img = { id: uuid(), url: imgUrl, altText: body.fields.altText || prod.name, sortOrder: prod.images.length };
          prod.images.push(img);
          return send(res, 201, img);
        }
        if (a[2] === "images" && a[3] === "order" && method === "PUT") {
          body.imageIds.forEach((imgId, i) => { const img = prod.images.find((m) => m.id === imgId); if (img) img.sortOrder = i; });
          return send(res, 200, [...prod.images].sort((x, y) => x.sortOrder - y.sortOrder));
        }
        if (a[2] === "images" && a[3] && method === "DELETE") {
          prod.images = prod.images.filter((m) => m.id !== a[3]);
          res.writeHead(204);
          return res.end();
        }
      }
      if (a[0] === "orders") {
        if (!a[1]) {
          const st = url.searchParams.get("status");
          const q = url.searchParams.get("q")?.toLowerCase();
          const list = orders.filter((o) => (!st || o.status === st) && (!q || o.orderNumber.toLowerCase().includes(q) || userById(o.userId).email.includes(q) || userById(o.userId).fullName.toLowerCase().includes(q)));
          const out = page(list, Number(url.searchParams.get("page") ?? 0), Number(url.searchParams.get("size") ?? 20));
          return send(res, 200, { ...out, items: out.items.map(adminOrderSummary) });
        }
        const o = orders.find((x) => x.orderNumber === a[1]);
        if (!o) return notFound(res, "Order not found.");
        if (!a[2]) return send(res, 200, adminOrderView(o));
        if (a[2] === "ship") {
          if (o.status !== "PAID") return problem(res, 409, "Conflict", "Only paid orders can be shipped.");
          if (!body.courier?.trim() || !body.trackingNumber?.trim()) return bad(res, "One or more fields are invalid.", [{ field: "trackingNumber", message: "Enter the courier and tracking number" }]);
          o.status = "SHIPPED";
          o.shipment = { courier: body.courier, trackingNumber: body.trackingNumber, trackingUrl: body.trackingUrl || null, shippedAt: now(), deliveredAt: null };
          o.history.push({ status: "SHIPPED", at: now(), by: user.fullName, note: `${body.courier} ${body.trackingNumber}` });
          return send(res, 200, adminOrderView(o));
        }
        if (a[2] === "deliver") {
          if (o.status !== "SHIPPED") return problem(res, 409, "Conflict", "Only shipped orders can be marked delivered.");
          o.status = "DELIVERED";
          o.shipment.deliveredAt = now();
          o.history.push({ status: "DELIVERED", at: now(), by: user.fullName, note: null });
          return send(res, 200, adminOrderView(o));
        }
        if (a[2] === "cancel") {
          if (!["PAID", "PENDING_PAYMENT"].includes(o.status)) return problem(res, 409, "Conflict", "This order can't be cancelled now.");
          cancelOrder(o, body.reason || "ADMIN");
          return send(res, 200, adminOrderView(o));
        }
        if (a[2] === "notes") {
          o.notes.push({ at: now(), by: user.fullName, text: body.text });
          return send(res, 200, adminOrderView(o));
        }
      }
      if (a[0] === "packing") {
        return send(res, 200, orders.filter((o) => o.status === "PAID").map((o) => ({ orderNumber: o.orderNumber, paidAt: o.paidAt, shipTo: { fullName: o.shippingAddress.fullName, city: o.shippingAddress.city, state: o.shippingAddress.state, pincode: o.shippingAddress.pincode }, items: o.items.map((i) => ({ sku: i.sku, productName: i.productName, description: i.description, imageUrl: i.imageUrl, certificateNumber: null })) })));
      }
      if (a[0] === "customers") {
        const view = (u) => { const mine = orders.filter((o) => o.userId === u.id && o.paidAt); return { id: u.id, fullName: u.fullName, email: u.email, phone: u.phone, emailVerified: u.emailVerified, createdAt: u.createdAt, orderCount: mine.length, totalSpentPaise: mine.reduce((s, o) => s + o.totalPaise, 0) }; };
        const customers = [...users.values()].filter((u) => u.role === "CUSTOMER");
        if (!a[1]) {
          const q = url.searchParams.get("q")?.toLowerCase();
          const list = customers.filter((u) => !q || u.email.includes(q) || u.fullName.toLowerCase().includes(q) || (u.phone ?? "").includes(q));
          const out = page(list, Number(url.searchParams.get("page") ?? 0), Number(url.searchParams.get("size") ?? 20));
          return send(res, 200, { ...out, items: out.items.map(view) });
        }
        const c = customers.find((u) => u.id === a[1]);
        if (!c) return notFound(res, "Customer not found.");
        return send(res, 200, { ...view(c), addresses: c.addresses.map(({ id: _i, defaultAddress: _d, createdAt: _c, ...x }) => x), orders: orders.filter((o) => o.userId === c.id).map(adminOrderSummary) });
      }
      if (a[0] === "returns") {
        if (!a[1]) {
          const st = url.searchParams.get("status");
          const out = page(returns.filter((r) => !st || r.status === st), Number(url.searchParams.get("page") ?? 0), 50);
          return send(res, 200, out);
        }
        const r = returns.find((x) => x.id === a[1]);
        if (!r) return notFound(res, "Return not found.");
        if (!a[2]) return send(res, 200, r);
        const next = { approve: "APPROVED", reject: "REJECTED", receive: "RECEIVED", refund: "REFUNDED" }[a[2]];
        if (!next) return notFound(res);
        if (a[2] === "refund") {
          r.refundPaise = body.refundPaise;
          const o = orders.find((x) => x.orderNumber === r.orderNumber);
          if (o) { o.status = "REFUNDED"; o.history.push({ status: "REFUNDED", at: now(), by: user.fullName, note: null }); }
        }
        r.status = next;
        r.history.push({ status: next, at: now(), by: user.fullName, note: body.note ?? null });
        return send(res, 200, r);
      }
      if (a[0] === "coupons") {
        const check = (b) => (!/^[A-Z0-9]{3,20}$/.test(b.code ?? "") ? [{ field: "code", message: "3–20 capital letters or numbers" }] : []);
        if (!a[1] && method === "GET") return send(res, 200, coupons);
        if (!a[1] && method === "POST") {
          const errs = check(body);
          if (errs.length) return bad(res, "One or more fields are invalid.", errs);
          if (coupons.some((c) => c.code === body.code)) return problem(res, 409, "Conflict", "This code already exists.");
          const c = { id: uuid(), usedCount: 0, ...body };
          coupons.push(c);
          return send(res, 201, c);
        }
        const c = coupons.find((x) => x.id === a[1]);
        if (!c) return notFound(res, "Coupon not found.");
        if (method === "PUT") { Object.assign(c, body); return send(res, 200, c); }
        if (method === "DELETE") { coupons.splice(coupons.indexOf(c), 1); res.writeHead(204); return res.end(); }
      }
      if (a[0] === "enquiries") {
        if (!a[1]) {
          const st = url.searchParams.get("status");
          const ty = url.searchParams.get("type");
          return send(res, 200, page(enquiries.filter((e) => (!st || e.status === st) && (!ty || e.type === ty)), 0, 100));
        }
        const e = enquiries.find((x) => x.id === a[1]);
        if (!e) return notFound(res);
        e.status = body.status;
        return send(res, 200, e);
      }
    }

    return notFound(res, `No endpoint for ${method} ${path} in the dev API.`);
  } catch (err) {
    console.error(err);
    return problem(res, 500, "Internal Server Error", "Something went wrong in the dev API.");
  }
}).listen(PORT, () => {
  console.log(`[dev-api] Stand-in backend on http://localhost:${PORT}  (${products.length} sample diamonds)`);
  console.log("[dev-api] Logins: riya@example.com / Secret@123 · new@example.com / Secret@123 (unverified) · admin@example.com / Admin@12345");
});

const uploads = new Map();