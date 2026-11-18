/* ==========================================================================
   D.Tiles Studio — application shell & page logic
   ========================================================================== */
(function () {
  "use strict";
  var DT = window.DT, C = DT.config, W = DT.wa;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var inr = W.inr, num = W.num;
  var qs = new URLSearchParams(location.search);

  /* ---------- Icons ---------- */
  var I = {
    arrow: '<svg class="arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M2 8h12M9.5 3.5 14 8l-4.5 4.5"/></svg>',
    arrowL: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M14 8H2M6.5 3.5 2 8l4.5 4.5"/></svg>',
    search: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="9" r="6"/><path d="m14 14 4 4"/></svg>',
    heart: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 17s-6.5-3.9-6.5-8.6A3.6 3.6 0 0 1 10 6.3a3.6 3.6 0 0 1 6.5 2.1C16.5 13.1 10 17 10 17Z"/></svg>',
    bag: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 6.5h12l-1 10.5H5L4 6.5Z"/><path d="M7 6.5V5a3 3 0 0 1 6 0v1.5"/></svg>',
    menu: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h14M3 10h14M3 14h9"/></svg>',
    close: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m3 3 10 10M13 3 3 13"/></svg>',
    plus: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 3v10M3 8h10"/></svg>',
    minus: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 8h10"/></svg>',
    check: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m3 8.5 3 3 7-7"/></svg>',
    pin: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M10 18s6-5.3 6-10a6 6 0 0 0-12 0c0 4.7 6 10 6 10Z"/><circle cx="10" cy="8" r="2.2"/></svg>',
    clock: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="10" cy="10" r="7.5"/><path d="M10 5.5V10l3 2"/></svg>',
    phone: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 2.5h3l1.5 4-2 1.2a9 9 0 0 0 4.8 4.8l1.2-2 4 1.5v3A2 2 0 0 1 15.5 17 13 13 0 0 1 3 4.5a2 2 0 0 1 2-2Z"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2A9.7 9.7 0 0 0 3.6 16.8L2.3 21.7l5-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.2.2-.6.2-1 .1-1.2l-.5-.2Z"/></svg>',
    star: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="m10 2 2.4 5 5.4.6-4 3.8 1 5.4L10 14.2 5.2 16.8l1-5.4-4-3.8 5.4-.6L10 2Z"/></svg>',
    leaf: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 16c0-7 4-11 12-12 0 8-4 12-10 12H4Zm0 0 6-6"/></svg>',
    users: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="7.5" cy="7" r="3"/><path d="M2 17a5.5 5.5 0 0 1 11 0M13 4.3a3 3 0 0 1 0 5.4M15 12.5a5.5 5.5 0 0 1 3 4.5"/></svg>',
    doc: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 2.5h7l3 3v12H5v-15Z"/><path d="M8 9h5M8 12h5M8 15h3"/></svg>',
    target: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="10" cy="10" r="7.5"/><circle cx="10" cy="10" r="3.5"/></svg>',
    compass: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="10" cy="10" r="7.5"/><path d="m13 7-1.8 4.2L7 13l1.8-4.2L13 7Z"/></svg>',
    home: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 9 10 3l7 6v8H3V9Z"/><path d="M8 17v-5h4v5"/></svg>',
    layers: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><path d="m10 3 7.5 4L10 11 2.5 7 10 3Z"/><path d="m2.5 10.5 7.5 4 7.5-4M2.5 14l7.5 4 7.5-4"/></svg>',
    hand: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M7 10V4a1.3 1.3 0 0 1 2.6 0v5M9.6 9V3a1.3 1.3 0 0 1 2.6 0v6M12.2 9V4.5a1.3 1.3 0 0 1 2.6 0V12a6 6 0 0 1-6 6h-.4a5 5 0 0 1-4-2l-2.3-3.2a1.3 1.3 0 0 1 2-1.6L7 13"/></svg>',
    ruler: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><path d="m2.5 13.5 11-11 4 4-11 11-4-4Z"/><path d="m6 10 1.5 1.5M8.5 7.5 10 9M11 5l1.5 1.5"/></svg>',
    sun: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="10" cy="10" r="3.5"/><path d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M4 4l1.4 1.4M14.6 14.6 16 16M4 16l1.4-1.4M14.6 5.4 16 4"/></svg>',
    bulb: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M7.5 15h5M8 17.5h4M10 2.5a5 5 0 0 0-3 9c.6.5 1 1.2 1 2v.5h4v-.5c0-.8.4-1.5 1-2a5 5 0 0 0-3-9Z"/></svg>',
    info: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="10" cy="10" r="7.5"/><path d="M10 9v5M10 6.2v.1"/></svg>',
    shield: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M10 2.5 16 5v5c0 3.6-2.6 6.5-6 7.5-3.4-1-6-3.9-6-7.5V5l6-2.5Z"/><path d="m7.5 10 1.8 1.8 3.4-3.6"/></svg>',
    filter: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 5h14M6 10h8M8.5 15h3"/></svg>',
    truck: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M1.5 5h10v8h-10zM11.5 8h3.5l3 3v2h-6.5"/><circle cx="5" cy="14.5" r="1.5"/><circle cx="14.5" cy="14.5" r="1.5"/></svg>',
    box: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><path d="m10 2.5 7 3.5v8l-7 3.5L3 14V6l7-3.5Z"/><path d="m3 6 7 3.5L17 6M10 9.5v8"/></svg>',
    eye: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M1.5 10S4.5 4 10 4s8.5 6 8.5 6-3 6-8.5 6-8.5-6-8.5-6Z"/><circle cx="10" cy="10" r="2.5"/></svg>',
    calc: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4" y="2.5" width="12" height="15" rx="1"/><path d="M7 6h6M7 10h.1M10 10h.1M13 10h.1M7 13.5h.1M10 13.5h.1M13 13.5h.1"/></svg>',
    sparkle: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M10 2.5 11.6 8 17 10l-5.4 2L10 17.5 8.4 12 3 10l5.4-2L10 2.5Z"/></svg>'
  };
  DT.icons = I;

  var LOGO = '<span class="brand-mark" aria-hidden="true">D.</span>';

  /* ---------- Storage (per-browser conveniences) ---------- */
  function load(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  var Store = {
    // Pruned against the live catalogue once it loads (see boot).
    cart: load("dts_cart", []),
    wish: load("dts_wish", []),
    samples: load("dts_samples", []),
    prune: function () {
      var n = this.cart.length + this.wish.length + this.samples.length;
      this.cart = this.cart.filter(function (i) { return DT.bySku(i.sku); });
      this.wish = this.wish.filter(function (s) { return DT.bySku(s); });
      this.samples = this.samples.filter(function (i) { var p = DT.bySku(i.sku); return p && DT.isTile(p); });
      if (n !== this.cart.length + this.wish.length + this.samples.length) this.persist(); else syncBadges();
    },
    me: load("dts_me", {}),
    persist: function () { save("dts_cart", this.cart); save("dts_wish", this.wish); save("dts_samples", this.samples); save("dts_me", this.me); syncBadges(); document.dispatchEvent(new CustomEvent("dts:store")); },
    addCart: function (sku, qty) {
      var it = this.cart.find(function (i) { return i.sku === sku; });
      if (it) it.qty += qty; else this.cart.push({ sku: sku, qty: qty });
      this.persist();
    },
    setQty: function (sku, qty) {
      var it = this.cart.find(function (i) { return i.sku === sku; });
      if (!it) return;
      if (qty <= 0) this.cart = this.cart.filter(function (i) { return i.sku !== sku; }); else it.qty = qty;
      this.persist();
    },
    removeCart: function (sku) { this.cart = this.cart.filter(function (i) { return i.sku !== sku; }); this.persist(); },
    clearCart: function () { this.cart = []; this.persist(); },
    cartItems: function () { return this.cart.map(function (i) { return { p: DT.bySku(i.sku), qty: i.qty }; }).filter(function (i) { return i.p; }); },
    cartTotals: function () {
      var sub = 0, qty = 0, saved = 0, items = this.cartItems();
      items.forEach(function (i) { var lt = DT.lineTotal(i.p, i.qty); sub += lt.net; saved += lt.disc; qty += i.qty; });
      var tax = Math.round(sub * C.gstRate); return { sub: sub, tax: tax, total: sub + tax, qty: qty, saved: saved, count: items.length };
    },
    toggleWish: function (sku) {
      var on = this.wish.indexOf(sku) < 0;
      if (on) this.wish.push(sku); else this.wish = this.wish.filter(function (s) { return s !== sku; });
      this.persist(); return on;
    },
    addSample: function (sku) {
      if (this.samples.find(function (i) { return i.sku === sku; })) return "exists";
      if (this.samples.length >= C.maxSamples) return "full";
      var p = DT.bySku(sku); this.samples.push({ sku: sku, finish: p.finish }); this.persist(); return "ok";
    },
    remember: function (d) { var me = this.me; ["name", "mobile", "pincode", "location", "email", "city", "address"].forEach(function (k) { if (d[k]) me[k] = d[k]; }); this.persist(); }
  };
  DT.store = Store;

  function syncBadges() {
    var t = Store.cartTotals();
    $$("[data-cart-count]").forEach(function (b) { var was = b.textContent; b.textContent = t.count; b.classList.toggle("show", t.count > 0); if (was !== String(t.count) && was !== "") { b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); } });
    $$("[data-wish-count]").forEach(function (b) { b.textContent = Store.wish.length; b.classList.toggle("show", Store.wish.length > 0); });
    $$(".heart[data-wish]").forEach(function (h) { var on = Store.wish.indexOf(h.getAttribute("data-wish")) > -1; h.classList.toggle("on", on); h.setAttribute("aria-pressed", on); });
  }

  /* ---------- Showroom hours (IST) ---------- */
  function istNow() {
    var parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
    var o = {}; parts.forEach(function (p) { o[p.type] = p.value; });
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return { day: days.indexOf(o.weekday), mins: (+o.hour % 24) * 60 + (+o.minute) };
  }
  function toMin(t) { var a = t.split(":"); return +a[0] * 60 + +a[1]; }
  function fmt12(t) { var a = t.split(":"), h = +a[0], m = a[1]; return (h % 12 || 12) + (m !== "00" ? ":" + m : "") + " " + (h < 12 ? "AM" : "PM"); }
  function openStatus() {
    var n = istNow(), h = C.hours[n.day];
    if (n.mins >= toMin(h.open) && n.mins < toMin(h.close)) return { open: true, text: "Open today until " + fmt12(h.close) };
    if (n.mins < toMin(h.open)) return { open: false, text: "Opens today at " + fmt12(h.open) };
    var nx = C.hours[(n.day + 1) % 7]; return { open: false, text: "Closed now • Opens " + fmt12(nx.open) + " tomorrow" };
  }
  DT.openStatus = openStatus;
  function hoursSummary() {
    var wk = C.hours[1], sun = C.hours[0];
    return "Monday – Saturday: " + fmt12(wk.open) + " – " + fmt12(wk.close) + "<br>Sunday: " + fmt12(sun.open) + " – " + fmt12(sun.close);
  }
  DT.hoursSummary = hoursSummary;
  var ADDR_HTML = esc(C.address.line1) + ",<br>" + esc(C.address.line2) + ",<br>" + esc(C.address.city) + " – " + esc(C.address.pin);
  DT.addrHtml = ADDR_HTML;

  /* ---------- Shell: header, footer, overlays ---------- */
  var NAV = [
    ["home", "index.html", "Home"],
    ["shop", "collection.html", "Shop"],
    ["collections", "shop.html", "Collections"],
    ["floor-tiles", "collection.html?c=floor-tiles", "Floor<br>Tiles"],
    ["wall-tiles", "collection.html?c=wall-tiles", "Wall<br>Tiles"],
    ["sanitaryware", "collection.html?c=sanitaryware", "Sanitaryware"],
    ["inspiration", "inspiration.html", "Inspiration"],
    ["about", "about.html", "About<br>Studio"]
  ];

  function activeKey() {
    var pg = document.body.getAttribute("data-nav") || "";
    if (pg === "collection") { var c = qs.get("c"); return ["floor-tiles", "wall-tiles", "sanitaryware"].indexOf(c) > -1 ? c : "shop"; }
    return pg;
  }

  function buildShell() {
    var act = activeKey();
    var nav = NAV.map(function (n) { return '<a href="' + n[1] + '"' + (n[0] === act ? ' class="active" aria-current="page"' : "") + ">" + n[2] + "</a>"; }).join("");
    var mnav = NAV.map(function (n) { return '<a href="' + n[1] + '"' + (n[0] === act ? ' class="active"' : "") + ">" + n[2].replace("<br>", " ") + "</a>"; }).join("");

    var head = document.createElement("div");
    head.innerHTML =
      '<a class="sr-only" href="#main">Skip to content</a>' +
      '<div class="topbar"><div class="wrap"><span><i class="dot"></i>Find the right surface for the way you live.</span>' +
      '<a class="r" href="#" data-visit>Plan a showroom visit • ' + esc(C.address.short.split(",")[0]) + " " + I.arrow + "</a></div></div>" +
      '<header class="site-header"><div class="wrap">' +
      '<button class="icon-btn menu-btn" data-menu aria-label="Open menu">' + I.menu + "</button>" +
      '<a class="brand" href="index.html" aria-label="D.Tiles Studio home">' + LOGO + '<span class="brand-name">D.Tiles<br>Studio</span></a>' +
      '<nav class="nav" aria-label="Primary">' + nav + "</nav>" +
      '<div class="head-tools">' +
      '<button class="search-trigger" data-search aria-label="Search surfaces">' + I.search + "<span>Search surfaces…</span><kbd>⌘K</kbd></button>" +
      '<button class="icon-btn" data-open-wish aria-label="Saved surfaces">' + I.heart + '<span class="badge" data-wish-count></span></button>' +
      '<button class="icon-btn" data-open-cart aria-label="Cart">' + I.bag + '<span class="badge" data-cart-count></span></button>' +
      '<button class="icon-btn" data-contact aria-label="Contact studio on WhatsApp" style="background:var(--charcoal);color:#fff">' + I.wa.replace("<svg", '<svg style="width:17px;height:17px"') + "</button>" +
      '<a class="admin-pill" href="admin.html">' + I.shield + "<span>" + (DT.hasAdminSession() ? "Admin Panel" : "Admin Login") + "</span></a>" +
      "</div></div></header>" +
      '<div class="mnav" id="mnav"><div class="scrim" data-close-menu></div><div class="panel">' +
      '<div style="display:flex;justify-content:space-between;align-items:center"><a class="brand" href="index.html">' + LOGO + '<span class="brand-name">D.Tiles<br>Studio</span></a><button class="close-x" data-close-menu aria-label="Close menu">' + I.close + "</button></div>" +
      "<nav>" + mnav + '<a href="samples.html">Order Samples</a><a href="calculator.html">Tile Calculator</a><a href="quote.html">Trade & Bulk Quote</a><a href="admin.html" style="color:#1F5C45">' + (DT.hasAdminSession() ? "Admin Panel" : "Admin Login") + "</a></nav>" +
      '<div class="mfoot"><p style="margin-bottom:12px">' + ADDR_HTML + '</p><a class="btn btn-wa btn-block" href="' + W.link() + '" target="_blank" rel="noopener">' + I.wa + " WhatsApp the Studio</a></div></div></div>";
    var frag = document.createDocumentFragment();
    while (head.firstChild) frag.appendChild(head.firstChild);
    document.body.insertBefore(frag, document.body.firstChild);

    var foot = document.createElement("div");
    var cats = ["floor-tiles", "wall-tiles", "bathroom", "kitchen", "large-format", "elevation", "sanitaryware"].map(function (id) { var c = DT.catById(id); return '<li><a href="collection.html?c=' + id + '">' + esc(c.name) + "</a></li>"; }).join("");
    foot.innerHTML =
      '<footer class="site-footer"><div class="wrap"><div class="fgrid">' +
      '<div class="fabout"><a class="brand" href="index.html">' + LOGO + '<span class="brand-name">D.Tiles<br>Studio</span></a>' +
      "<p>Thoughtfully selected surfaces, tiles, and architectural finishes bringing enduring beauty and tactile warmth to living spaces.</p>" +
      '<span class="tagline">Architectural Surfaces • NCR Showroom</span></div>' +
      "<div><h5>Explore Categories</h5><ul>" + cats + "</ul></div>" +
      '<div><h5>Studio &amp; Services</h5><ul><li><a href="#" data-consult>Design Consultation</a></li><li><a href="samples.html">Physical Material Samples</a></li><li><a href="calculator.html">Area &amp; Coverage Calculator</a></li><li><a href="quote.html">Architect &amp; Trade Enquiries</a></li><li><a href="#" data-open-cart>Your Cart</a></li><li><a href="policies.html#care">Care &amp; Maintenance</a></li></ul></div>' +
      "<div><h5>Showroom &amp; Contact</h5><address>" + ADDR_HTML + "</address>" +
      '<div class="fcontact"><a href="tel:' + C.phoneTel + '">' + I.phone + esc(C.phoneDisplay) + '</a><a href="' + W.link() + '" target="_blank" rel="noopener">' + I.wa.replace("<svg", '<svg style="width:15px;height:15px;color:var(--terracotta)"') + ' WhatsApp Enquiries</a><a href="' + C.mapLink + '" target="_blank" rel="noopener">' + I.pin + " Get Directions</a></div>" +
      '<p class="gst">Showroom appointments &amp; enquiries daily<br>GST compliant invoicing • Pan-India logistics &amp; local delivery</p></div>' +
      "</div></div>" +
      '<div class="fbottom"><div class="wrap"><div class="l"><span>© ' + new Date().getFullYear() + ' D.Tiles Studio. All rights reserved.</span><span class="ln"></span><q>' + esc(C.motto) + "</q></div>" +
      '<div class="r"><a href="policies.html#privacy">Privacy Policy</a><a href="policies.html#terms">Terms of Service</a><a href="policies.html#shipping">Shipping &amp; Delivery</a><a href="policies.html#gst">GST Information</a></div></div></div></footer>' +
      '<a class="wa-float" href="#" data-contact aria-label="Chat with the studio on WhatsApp">' + I.wa + "<span>Chat with Studio</span></a>" +
      '<div class="drawer" id="drawer" aria-hidden="true"><div class="scrim" data-close-drawer></div><aside class="dpanel" role="dialog" aria-modal="true" aria-labelledby="drawer-title"><div class="dhead"><div><span class="eyebrow terra" id="drawer-eyebrow">Your selection</span><h3 id="drawer-title">Cart</h3></div><button class="close-x" data-close-drawer aria-label="Close">' + I.close + '</button></div><div class="dbody" id="drawer-body"></div><div class="dfoot" id="drawer-foot"></div></aside></div>' +
      '<div class="search-ov" id="search" aria-hidden="true"><div class="scrim" data-close-search></div><div class="sbox" role="dialog" aria-modal="true" aria-label="Search surfaces"><div class="sin">' + I.search + '<input type="search" id="search-input" placeholder="Search marble, travertine, 600×1200…" autocomplete="off"><kbd>ESC</kbd></div><div class="sres" id="search-results"></div></div></div>' +
      '<div class="modal" id="modal" aria-hidden="true"><div class="scrim" data-close-modal></div><div class="box" role="dialog" aria-modal="true" aria-labelledby="modal-title"></div></div>' +
      '<div class="toast" id="toast" role="status" aria-live="polite"></div>';
    while (foot.firstChild) document.body.appendChild(foot.firstChild);

    var sh = $(".site-header");
    var onScroll = function () { sh.classList.toggle("scrolled", window.scrollY > 10); };
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  }

  /* ---------- Toast ---------- */
  var toastT;
  function toast(msg, action) {
    var t = $("#toast");
    t.innerHTML = I.check + "<span>" + msg + "</span>" + (action ? action : "");
    t.classList.add("show"); clearTimeout(toastT);
    toastT = setTimeout(function () { t.classList.remove("show"); }, 3800);
  }
  DT.toast = toast;

  /* ---------- Overlays ---------- */
  var lastFocus;
  function lock(on) { document.documentElement.style.overflow = on ? "hidden" : ""; }
  function openLayer(el) { lastFocus = document.activeElement; el.classList.add("open"); el.setAttribute("aria-hidden", "false"); lock(true); }
  function closeLayer(el) { el.classList.remove("open"); el.setAttribute("aria-hidden", "true"); if (!$(".modal.open, .drawer.open, .search-ov.open, .mnav.open")) lock(false); if (lastFocus && lastFocus.focus) try { lastFocus.focus(); } catch (e) {} }

  /* ---------- Product card ---------- */
  function priceHtml(p) { return '<span class="price num">₹' + inr(p.price) + " <small>" + DT.priceSuffix(p) + "</small></span>"; }
  function boxHtml(p) { return DT.isTile(p) ? "₹" + inr(DT.unitPrice(p)) + " / box (" + num(p.coverage) + " sq.ft)" : p.unit === "Sets" ? "Complete set" : "Per piece"; }
  function card(p, opts) {
    opts = opts || {};
    var href = "product.html?sku=" + encodeURIComponent(p.slug);
    return '<article class="pcard reveal">' +
      '<a class="pimg" href="' + href + '" aria-label="' + esc(p.name) + '"><img data-tex="' + p.sku + '" data-w="700" alt="' + esc(p.name + " — " + p.finish + " " + p.material) + '" data-loading></a>' +
      '<span class="flag' + (opts.darkFlag ? " dark" : "") + '">' + esc(p.flag) + "</span>" +
      '<button class="heart" data-wish="' + p.sku + '" aria-label="Save ' + esc(p.name) + '" aria-pressed="false">' + I.heart + "</button>" +
      '<div class="quick"><button class="btn btn-dark" data-buy="' + p.sku + '">Buy Now</button>' + (DT.isTile(p) ? '<button class="btn btn-light" data-sample="' + p.sku + '">Sample</button>' : '<button class="btn btn-light" data-quote="' + p.sku + '">Quote</button>') + "</div>" +
      '<div class="pbody"><div class="pcat"><span>' + esc(p.material) + "</span><span>" + esc(p.size) + "</span></div>" +
      '<h3><a href="' + href + '">' + esc(p.name) + "</a></h3>" +
      '<p class="pdesc">' + esc(p.desc) + "</p>" +
      '<div class="pfoot"><div class="pp">' + priceHtml(p) + '<span class="pbox num">' + boxHtml(p) + '</span></div><button class="add" data-add="' + p.sku + '" aria-label="Add ' + esc(p.name) + ' to cart">' + I.plus + "</button></div></div></article>";
  }
  DT.card = card;

  function photo(key, w, alt, cls) {
    return '<div class="ph ' + (cls || "") + '"><img src="' + DT.photo(DT.img[key] || key, w || 1200) + '" alt="' + esc(alt || "") + '" loading="lazy" data-loading onload="this.removeAttribute(\'data-loading\')"></div>';
  }
  DT.photoHtml = photo;

  /* ---------- Reveal ---------- */
  var rio = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); rio.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -6% 0px" }) : null;
  function hydrate(root) {
    root = root || document;
    $$(".reveal:not(.in)", root).forEach(function (el) { if (rio) rio.observe(el); else el.classList.add("in"); });
    DT.tex.hydrate(root);
    $$("img[data-loading]:not([data-tex])", root).forEach(function (im) { if (im.complete && im.naturalWidth) im.removeAttribute("data-loading"); });
    syncBadges();
  }
  DT.hydrate = hydrate;

  /* ---------- Forms ---------- */
  function field(o) {
    var id = "f-" + o.name + "-" + Math.random().toString(36).slice(2, 6);
    var req = o.required ? ' required' : "";
    var lab = '<label for="' + id + '">' + o.label + (o.required ? ' <span class="req">*</span>' : "") + "</label>";
    var val = o.value != null ? esc(o.value) : "";
    var attrs = ' id="' + id + '" name="' + o.name + '"' + req + (o.type ? ' data-type="' + o.type + '"' : "") + (o.placeholder ? ' placeholder="' + esc(o.placeholder) + '"' : "") + (o.attrs || "");
    var ctl;
    if (o.select) {
      ctl = '<select class="select"' + attrs + ">" + (o.placeholder ? '<option value="">' + esc(o.placeholder) + "</option>" : "") + o.select.map(function (s) { var v = typeof s === "string" ? s : s.v, t = typeof s === "string" ? s : s.t; return '<option value="' + esc(v) + '"' + (String(o.value) === String(v) ? " selected" : "") + ">" + esc(t) + "</option>"; }).join("") + "</select>";
    } else if (o.textarea) {
      ctl = '<textarea class="textarea"' + attrs + ">" + val + "</textarea>";
    } else if (o.type === "mobile") {
      ctl = '<div class="input-group"><span class="pre">+91</span><input class="input" inputmode="numeric" maxlength="10" autocomplete="tel-national" value="' + val + '"' + attrs + "></div>";
    } else {
      var it = o.type === "pin" ? ' inputmode="numeric" maxlength="6" autocomplete="postal-code"' : o.type === "number" ? ' inputmode="decimal"' : "";
      var inp = '<input class="input" type="' + (o.inputType || "text") + '"' + it + ' value="' + val + '"' + attrs + ">";
      ctl = o.suffix ? '<div class="input-group has-suf">' + inp + '<span class="suf">' + o.suffix + "</span></div>" : inp;
    }
    var errs = { pin: "Enter a valid 6-digit pincode.", mobile: "Enter a valid 10-digit mobile number.", email: "Enter a valid email address.", number: "Enter a valid number." };
    return '<div class="field' + (o.full ? " full" : "") + '">' + lab + ctl + '<span class="err">' + (errs[o.type] || "This field is required.") + "</span></div>";
  }
  DT.field = field;

  function validate(form) {
    var first = null;
    $$("input, select, textarea", form).forEach(function (el) {
      if (el.disabled || el.type === "hidden") return;
      var v = (el.value || "").trim(), t = el.getAttribute("data-type"), bad = false;
      if (el.required && !v) bad = true;
      else if (v && t === "pin") bad = !/^[1-9]\d{5}$/.test(v);
      else if (v && t === "mobile") bad = !/^[6-9]\d{9}$/.test(v.replace(/\D/g, ""));
      else if (v && t === "email") bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      else if (v && t === "number") bad = !(parseFloat(v) > 0);
      el.classList.toggle("invalid", bad);
      var f = el.closest(".field"); if (f) f.classList.toggle("has-err", bad);
      if (bad && !first) first = el;
    });
    if (first) { first.focus(); return false; }
    return true;
  }
  function formData(form) { var d = {}; new FormData(form).forEach(function (v, k) { d[k] = typeof v === "string" ? v.trim() : v; }); return d; }
  DT.validate = validate; DT.formData = formData;

  document.addEventListener("input", function (e) {
    var el = e.target;
    if (el.getAttribute && (el.getAttribute("data-type") === "pin" || el.getAttribute("data-type") === "mobile")) el.value = el.value.replace(/\D/g, "");
    if (el.classList && el.classList.contains("invalid")) { el.classList.remove("invalid"); var f = el.closest(".field"); if (f) f.classList.remove("has-err"); }
  });

  /* ---------- Modal ---------- */
  function modal(o) {
    var m = $("#modal"), box = $(".box", m);
    box.innerHTML =
      '<div class="mhead"><div>' + (o.eyebrow ? '<span class="eyebrow terra">' + o.eyebrow + "</span>" : "") + '<h3 id="modal-title">' + o.title + "</h3>" + (o.sub ? "<p>" + o.sub + "</p>" : "") + '</div><button class="close-x" data-close-modal aria-label="Close">' + I.close + "</button></div>" +
      '<form class="mbody" novalidate>' + o.body +
      (o.preview ? '<details class="wa-preview"><summary>' + I.eye + " Preview WhatsApp message</summary><pre></pre></details>" : "") +
      '<button class="btn ' + (o.submitClass || "btn-wa") + ' btn-block" type="submit" style="margin-top:18px">' + (o.submitIcon === false ? "" : I.wa) + " " + (o.submit || "Send on WhatsApp") + "</button>" +
      (o.foot ? '<p class="secure-note">' + I.shield + "<span>" + o.foot + "</span></p>" : "") + "</form>";
    var form = $("form", box);
    var upd = function () { if (o.preview) $(".wa-preview pre", box).textContent = o.preview(formData(form)); if (o.onInput) o.onInput(formData(form), form); };
    form.addEventListener("input", upd); form.addEventListener("change", upd);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate(form)) return;
      var d = formData(form);
      var res = o.onSubmit(d, form);
      if (res !== false) closeLayer(m);
    });
    if (o.onOpen) o.onOpen(form, box);
    upd();
    hydrate(box);
    openLayer(m);
    setTimeout(function () { var f = $("input:not([type=hidden]):not([type=radio]), select", form); if (f && window.innerWidth > 700) f.focus(); }, 60);
    return form;
  }
  DT.modal = modal;

  function mprod(p, line) {
    return '<div class="mprod"><div class="im"><img data-tex="' + p.sku + '" data-w="200" alt=""></div><div><b>' + esc(p.name) + "</b><span>" + esc(line || (p.sku + " • " + p.size + " • " + p.finish)) + "</span></div></div>";
  }
  function qtyCtl(name, val, min) {
    return '<div class="qty"><button type="button" data-step="-1" aria-label="Decrease">' + I.minus + '</button><input type="number" name="' + name + '" value="' + val + '" min="' + (min || 1) + '" aria-label="Quantity"><button type="button" data-step="1" aria-label="Increase">' + I.plus + "</button></div>";
  }
  DT.qtyCtl = qtyCtl;
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-step]"); if (!b) return;
    var inp = $("input", b.closest(".qty")); var min = +inp.min || 1;
    inp.value = Math.max(min, (parseInt(inp.value, 10) || min) + +b.getAttribute("data-step"));
    inp.dispatchEvent(new Event("input", { bubbles: true }));
  });

  /* Buy Now ------------------------------------------------------------- */
  function buyNow(p, qty) {
    var me = Store.me;
    qty = qty || (DT.isTile(p) ? 10 : 1);
    var body = mprod(p) +
      '<div class="form-grid">' +
      '<div class="field"><label>Quantity (' + esc(p.unit) + ') <span class="req">*</span></label>' + qtyCtl("qty", qty) + "</div>" +
      '<div class="field"><label>Price per ' + DT.unitLabel(p) + '</label><div class="input num" style="display:flex;align-items:center;background:var(--sand-3)">₹' + inr(DT.unitPrice(p)) + (DT.isTile(p) ? '<span class="muted" style="margin-left:6px;font-size:12px">(' + num(p.coverage) + " sq.ft)</span>" : "") + "</div></div>" +
      field({ name: "name", label: "Customer Name", required: true, value: me.name, placeholder: "Your full name", full: true }) +
      field({ name: "pincode", label: "Delivery Pincode", required: true, type: "pin", value: me.pincode, placeholder: "201014" }) +
      field({ name: "location", label: "City / Locality", required: true, value: me.location, placeholder: "Indirapuram, Ghaziabad" }) +
      "</div>" +
      '<div class="msum"><span data-cov></span><b class="num" data-sub></b></div>';
    modal({
      eyebrow: "Buy Now • WhatsApp Order", title: "Confirm your order", sub: "We'll open WhatsApp with your order details filled in. Our studio confirms availability, taxes and delivery.",
      body: body, submit: "Send Order on WhatsApp", foot: "No payment is taken on the website. You pay only after the studio confirms.",
      preview: function (d) { return W.buyNow(p, { qty: Math.max(1, parseInt(d.qty, 10) || 1), name: d.name, pincode: d.pincode, location: d.location }); },
      onInput: function (d, f) {
        var q = Math.max(1, parseInt(d.qty, 10) || 1), lt = DT.lineTotal(p, q);
        $("[data-sub]", f).textContent = "₹" + inr(lt.net);
        $("[data-cov]", f).textContent = (DT.isTile(p) ? q + " boxes • covers " + num(q * p.coverage) + " sq.ft" : q + " " + DT.unitLabel(p, q) + " • Estimated subtotal") +
          (lt.pct ? " • " + lt.pct + "% bulk discount applied" : p.bulkPct ? " • Order " + p.bulkMin + "+ for " + p.bulkPct + "% off" : "");
      },
      onSubmit: function (d) {
        var q = Math.max(1, parseInt(d.qty, 10) || 1);
        Store.remember(d);
        W.open(W.buyNow(p, { qty: q, name: d.name, pincode: d.pincode, location: d.location }));
        toast("Opening WhatsApp with your order for " + esc(p.name));
      }
    });
  }
  DT.buyNow = buyNow;

  /* Cart enquiry --------------------------------------------------------- */
  function cartEnquiry() {
    var items = Store.cartItems();
    if (!items.length) { toast("Your cart is empty — add a surface first."); return; }
    var t = Store.cartTotals(), me = Store.me;
    var list = items.map(function (i) { return '<div style="display:flex;justify-content:space-between;gap:12px;font-size:12.5px;padding:7px 0;border-bottom:1px solid var(--line)"><span>' + esc(i.p.name) + ' <span class="muted">× ' + i.qty + " " + DT.unitLabel(i.p, i.qty) + '</span></span><b class="num">₹' + inr(DT.lineTotal(i.p, i.qty).net) + "</b></div>"; }).join("");
    modal({
      eyebrow: "Cart • " + items.length + " product" + (items.length > 1 ? "s" : ""), title: "Send my order", sub: "Your complete cart goes to the studio in a single WhatsApp message.",
      body: '<div style="margin-bottom:18px">' + list + '<div style="display:flex;justify-content:space-between;font-size:12.5px;padding:7px 0;color:var(--muted)"><span>Estimated GST (18%)</span><span class="num">₹' + inr(t.tax) + "</span></div></div>" +
        '<div class="form-grid">' +
        field({ name: "name", label: "Name", required: true, value: me.name, placeholder: "Your full name", full: true }) +
        field({ name: "pincode", label: "Pincode", required: true, type: "pin", value: me.pincode, placeholder: "201014" }) +
        field({ name: "location", label: "Address / City", required: true, value: me.location, placeholder: "Indirapuram, Ghaziabad" }) + "</div>" +
        '<div class="msum"><span>Estimated total incl. GST</span><b class="num">₹' + inr(t.total) + "</b></div>",
      submit: "Send Cart on WhatsApp", foot: "Prices are estimates. The studio confirms the final quotation with delivery.",
      preview: function (d) { return W.cart(Store.cartItems(), d); },
      onSubmit: function (d) { Store.remember(d); W.open(W.cart(Store.cartItems(), d)); toast("Opening WhatsApp with your complete cart"); }
    });
  }
  DT.cartEnquiry = cartEnquiry;

  /* Visit / consultation / general contact ------------------------------ */
  function contactModal(kind, extra) {
    kind = kind || "general"; extra = extra || {};
    var me = Store.me;
    var today = new Date(); var minDate = today.toISOString().slice(0, 10);
    var cfg = {
      visit: { eyebrow: "Indirapuram Showroom", title: "Plan a showroom visit", sub: "Choose a slot and our studio team will keep your shortlisted surfaces ready." },
      consultation: { eyebrow: "Personal Studio Consultation", title: "Book a consultation", sub: "Speak with a surface specialist — in the studio, on a video call, or at your site." },
      general: { eyebrow: "Contact Studio", title: "Message the studio", sub: "Ask us anything — availability, pricing, installation or design advice." },
      trade: { eyebrow: "Architect & Trade Desk", title: "Open a trade account", sub: "Project pricing, kiln reservations and dedicated support for professionals." }
    }[kind];
    var body = '<div class="form-grid">';
    if (kind === "visit" || kind === "consultation") {
      body += field({ name: "date", label: "Preferred Date", required: true, inputType: "date", attrs: ' min="' + minDate + '"' }) +
        field({ name: "slot", label: "Preferred Time", required: true, select: ["10:00 AM – 12:00 PM", "12:00 PM – 2:00 PM", "2:00 PM – 4:00 PM", "4:00 PM – 6:00 PM", "6:00 PM – 8:00 PM"], placeholder: "Select a slot" });
      if (kind === "visit") body += field({ name: "guests", label: "Visitors", select: ["1", "2", "3", "4", "5+"], value: "2" }) + field({ name: "interest", label: "Interested In", select: ["Floor Tiles", "Wall Tiles", "Bathroom & Sanitaryware", "Kitchen Surfaces", "Elevation & Outdoor", "Large Format Slabs", "Complete Home"], value: extra.interest || "Complete Home" });
      else body += field({ name: "topic", label: "Consultation Type", select: ["In-Studio Consultation", "Video Call", "Site Visit"], value: "In-Studio Consultation" }) + field({ name: "projectType", label: "Project Type", select: ["Home Renovation", "New Construction", "Commercial"], value: "Home Renovation" });
    } else if (kind === "trade") {
      body += field({ name: "company", label: "Firm / Company", required: true, placeholder: "Studio or firm name", full: true }) +
        field({ name: "topic", label: "You are", select: ["Architect", "Interior Designer", "Contractor", "Builder / Developer"], value: "Architect" }) +
        field({ name: "projectType", label: "Typical Projects", select: ["Residential", "Commercial", "Hospitality", "Mixed"], value: "Residential" });
    } else {
      body += field({ name: "topic", label: "Topic", select: ["Product Availability", "Pricing & Offers", "Delivery & Installation", "Design Advice", "Order Status", "Other"], value: extra.topic || "Product Availability", full: true });
    }
    body += field({ name: "name", label: "Name", required: true, value: me.name, placeholder: "Your full name" }) +
      field({ name: "mobile", label: "Mobile (WhatsApp)", required: true, type: "mobile", value: me.mobile, placeholder: "98102 34567" }) +
      field({ name: "message", label: kind === "general" ? "Your Message" : "Notes (optional)", required: kind === "general", textarea: true, placeholder: kind === "general" ? "Tell us what you are looking for…" : "Rooms, sizes or shortlisted products…", full: true, value: extra.message }) +
      "</div>";
    modal({
      eyebrow: cfg.eyebrow, title: cfg.title, sub: cfg.sub, body: body,
      submit: kind === "visit" ? "Request Visit on WhatsApp" : kind === "consultation" ? "Book on WhatsApp" : "Send on WhatsApp",
      foot: kind === "visit" ? esc(C.address.line1) + ", " + esc(C.address.city) : "Our studio replies on WhatsApp during showroom hours.",
      preview: function (d) { d.kind = kind; d.product = extra.product; if (d.date) d.date = new Date(d.date + "T00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }); return W.contact(d); },
      onSubmit: function (d) {
        d.kind = kind; d.product = extra.product; Store.remember(d);
        if (d.date) d.date = new Date(d.date + "T00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
        W.open(W.contact(d)); toast("Opening WhatsApp…");
      }
    });
  }
  DT.contactModal = contactModal;

  /* Add sample ------------------------------------------------------------ */
  function addSample(sku, go) {
    var r = Store.addSample(sku), p = DT.bySku(sku);
    if (r === "full") toast("Your swatch box is full (" + C.maxSamples + " max).", '<a href="samples.html">Review box</a>');
    else if (r === "exists") toast(esc(p.name) + " is already in your swatch box.", '<a href="samples.html">View box</a>');
    else toast(esc(p.name) + " added to your swatch box.", '<a href="samples.html">Review box</a>');
    if (go && r !== "full") setTimeout(function () { location.href = "samples.html"; }, 500);
  }
  DT.addSample = addSample;

  /* ---------- Drawer (cart / saved) ---------- */
  var drawerMode = "cart";
  function citem(i, compact) {
    var p = i.p, href = "product.html?sku=" + p.slug;
    return '<div class="citem"><a class="im" href="' + href + '"><img data-tex="' + p.sku + '" data-w="200" alt=""></a><div>' +
      '<h4><a href="' + href + '">' + esc(p.name) + '</a></h4><div class="m">' + esc(p.sku) + " • " + esc(p.size) + " • " + esc(p.finish) + "</div>" +
      (i.qty != null
        ? '<div class="b"><div class="qty sm" data-cart-qty="' + p.sku + '"><button type="button" data-cq="-1" aria-label="Decrease">' + I.minus + '</button><input type="number" value="' + i.qty + '" min="1" aria-label="Quantity"><button type="button" data-cq="1" aria-label="Increase">' + I.plus + '</button></div><span class="pr num">₹' + inr(DT.lineTotal(p, i.qty).net) + '</span></div><div class="m" style="margin:6px 0 0">' + i.qty + " " + DT.unitLabel(p, i.qty) + (DT.isTile(p) ? " • " + num(i.qty * p.coverage) + " sq.ft" : "") +
          (DT.lineTotal(p, i.qty).pct ? ' • <span style="color:var(--ok);font-weight:600">' + p.bulkPct + "% bulk discount</span>" : p.bulkPct ? " • " + p.bulkPct + "% off at " + p.bulkMin + "+" : "") + '</div><button class="rm" data-remove="' + p.sku + '">Remove</button>'
        : '<div class="b"><span class="pr num">₹' + inr(p.price) + ' <small class="muted" style="font-weight:500">' + DT.priceSuffix(p) + '</small></span><button class="btn btn-sm btn-dark" data-add="' + p.sku + '">Add to cart</button></div><button class="rm" data-wish-remove="' + p.sku + '">Remove</button>') +
      "</div></div>";
  }
  function renderDrawer() {
    var body = $("#drawer-body"), foot = $("#drawer-foot");
    if (drawerMode === "cart") {
      $("#drawer-title").textContent = "Your Cart"; $("#drawer-eyebrow").textContent = "Curated selection";
      var items = Store.cartItems();
      if (!items.length) {
        body.removeAttribute("data-mode");
        body.innerHTML = '<div class="cart-empty"><div class="ic">' + I.bag + "</div><h4>Your cart is empty</h4><p>Explore our curated surfaces and add the ones you love.</p></div>";
        foot.innerHTML = '<a class="btn btn-dark btn-block" href="collection.html">Explore Surfaces ' + I.arrow + "</a>";
      } else {
        var t = Store.cartTotals(), me = Store.me;
        // Build the panel once so typed delivery details survive quantity changes.
        if (body.getAttribute("data-mode") !== "cart") {
          body.setAttribute("data-mode", "cart");
          body.innerHTML = '<div id="d-items"></div>' +
            '<form class="d-form" id="d-form" novalidate><span class="eyebrow terra">Delivery details</span>' +
            '<p class="small muted" style="margin:6px 0 14px">Your complete cart goes to the studio in one WhatsApp message.</p>' +
            '<div class="form-grid">' +
            field({ name: "name", label: "Name", required: true, value: me.name, placeholder: "Your full name", full: true }) +
            field({ name: "pincode", label: "Pincode", required: true, type: "pin", value: me.pincode, placeholder: "201014" }) +
            field({ name: "location", label: "Address / City", required: true, value: me.location, placeholder: "Indirapuram" }) +
            '</div><details class="wa-preview"><summary>' + I.eye + ' Preview WhatsApp message</summary><pre id="d-preview"></pre></details></form>';
        }
        $("#d-items").innerHTML = items.map(function (i) { return citem(i); }).join("");
        var dp = $("#d-preview"); if (dp) dp.textContent = W.cart(items, formData($("#d-form")));
        foot.innerHTML = (t.saved ? '<div class="tot" style="color:var(--ok)"><span>Bulk savings applied</span><span class="num">−₹' + inr(t.saved) + "</span></div>" : "") +
          '<div class="tot"><span>Subtotal (' + t.count + " product" + (t.count > 1 ? "s" : "") + ')</span><span class="num">₹' + inr(t.sub) + '</span></div><div class="tot"><span>Estimated GST (18%)</span><span class="num">₹' + inr(t.tax) + '</span></div><div class="tot grand"><span>Estimated Total</span><b class="num">₹' + inr(t.total) + "</b></div>" +
          '<button class="btn btn-wa btn-block" type="submit" form="d-form" style="height:50px">' + I.wa + ' Enquire on WhatsApp</button>' +
          '<a class="link-arrow" href="quote.html?from=cart" style="margin-top:14px;display:flex;justify-content:center">Need bulk pricing? Request a quote ' + I.arrow + "</a>";
      }
    } else {
      $("#drawer-title").textContent = "Saved Surfaces"; $("#drawer-eyebrow").textContent = "Your shortlist";
      body.removeAttribute("data-mode");
      var ws = Store.wish.map(function (s) { return { p: DT.bySku(s) }; }).filter(function (i) { return i.p; });
      body.innerHTML = ws.length ? ws.map(function (i) { return citem(i); }).join("") : '<div class="cart-empty"><div class="ic">' + I.heart + "</div><h4>No saved surfaces yet</h4><p>Tap the heart on any surface to build your shortlist.</p></div>";
      foot.innerHTML = ws.length ? '<button class="btn btn-dark btn-block" data-wish-all>Add all to cart</button><button class="btn btn-line btn-block" data-wish-samples>Request swatches of these</button>' : '<a class="btn btn-dark btn-block" href="collection.html">Explore Surfaces ' + I.arrow + "</a>";
    }
    hydrate($("#drawer"));
  }
  function openDrawer(mode) { drawerMode = mode; renderDrawer(); openLayer($("#drawer")); }
  document.addEventListener("dts:store", function () { if ($("#drawer").classList.contains("open")) renderDrawer(); });

  /* ---------- Search ---------- */
  var sSel = 0;
  function searchRender(q) {
    var res = $("#search-results"); q = (q || "").trim().toLowerCase();
    if (!q) {
      res.innerHTML = '<div class="grp">Popular searches</div><div class="squick">' + ["Marble", "Travertine", "600×1200", "Matte", "Bathroom", "Terracotta", "Outdoor", "Sanitaryware"].map(function (t) { return '<button type="button" data-sq="' + t + '">' + t + "</button>"; }).join("") + '</div><div class="grp">Collections</div>' +
        DT.categories.slice(0, 6).map(function (c) { return '<a href="collection.html?c=' + c.id + '"><div class="im">' + photo(c.photo, 120) + "</div><div><b>" + esc(c.name) + "</b><span>" + DT.inCat(c.id).length + " surfaces</span></div></a>"; }).join("");
      hydrate(res); return;
    }
    var terms = q.split(/\s+/);
    var hits = DT.products.map(function (p) {
      var hay = [p.name, p.sku, p.material, p.finish, p.colour, p.size, p.category, p.brand, p.cats.join(" "), p.rooms.join(" "), p.desc].join(" ").toLowerCase().replace(/x/g, "×");
      var score = 0; terms.forEach(function (t) { t = t.replace(/x/g, "×"); if (hay.indexOf(t) > -1) score += p.name.toLowerCase().indexOf(t) > -1 ? 3 : 1; else score -= 10; });
      return { p: p, s: score };
    }).filter(function (h) { return h.s > 0; }).sort(function (a, b) { return b.s - a.s; }).slice(0, 8);
    var cats = DT.categories.filter(function (c) { return c.name.toLowerCase().indexOf(q) > -1; });
    var html = "";
    if (cats.length) html += '<div class="grp">Collections</div>' + cats.map(function (c) { return '<a href="collection.html?c=' + c.id + '"><div class="im">' + photo(c.photo, 120) + "</div><div><b>" + esc(c.name) + "</b><span>" + DT.inCat(c.id).length + " surfaces</span></div></a>"; }).join("");
    if (hits.length) html += '<div class="grp">Surfaces</div>' + hits.map(function (h) { var p = h.p; return '<a href="product.html?sku=' + p.slug + '"><div class="im"><img data-tex="' + p.sku + '" data-w="120" alt=""></div><div><b>' + esc(p.name) + "</b><span>" + esc(p.size) + " • " + esc(p.finish) + " • " + esc(p.sku) + '</span></div><span class="pr num">₹' + inr(p.price) + " " + DT.priceSuffix(p) + "</span></a>"; }).join("");
    if (!html) html = '<div class="snone">No surfaces match “' + esc(q) + '”.<br><a class="link-arrow terra" style="margin-top:14px" href="#" data-contact>Ask the studio ' + I.arrow + "</a></div>";
    else html += '<a href="collection.html?q=' + encodeURIComponent(q) + '" style="justify-content:center;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700">View all results ' + I.arrow + "</a>";
    res.innerHTML = html; sSel = 0; hydrate(res);
  }
  function openSearch() { openLayer($("#search")); var i = $("#search-input"); i.value = ""; searchRender(""); setTimeout(function () { i.focus(); }, 40); }

  /* ---------- Global events ---------- */
  function bindGlobal() {
    document.addEventListener("click", function (e) {
      var t = e.target, el;
      if ((el = t.closest("[data-menu]"))) { openLayer($("#mnav")); return; }
      if (t.closest("[data-close-menu]")) { closeLayer($("#mnav")); return; }
      if (t.closest("[data-search]")) { e.preventDefault(); openSearch(); return; }
      if (t.closest("[data-close-search]")) { closeLayer($("#search")); return; }
      if ((el = t.closest("[data-sq]"))) { $("#search-input").value = el.getAttribute("data-sq"); searchRender(el.getAttribute("data-sq")); return; }
      if (t.closest("[data-open-cart]")) { e.preventDefault(); openDrawer("cart"); return; }
      if (t.closest("[data-open-wish]")) { e.preventDefault(); openDrawer("wish"); return; }
      if (t.closest("[data-close-drawer]")) { closeLayer($("#drawer")); return; }
      if (t.closest("[data-close-modal]")) { closeLayer($("#modal")); return; }
      if (t.closest("[data-cart-enquire]")) { closeLayer($("#drawer")); cartEnquiry(); return; }
      if ((el = t.closest("[data-visit]"))) { e.preventDefault(); closeLayer($("#mnav")); contactModal("visit", { interest: el.getAttribute("data-visit") || undefined }); return; }
      if (t.closest("[data-consult]")) { e.preventDefault(); contactModal("consultation"); return; }
      if (t.closest("[data-trade]")) { e.preventDefault(); contactModal("trade"); return; }
      if ((el = t.closest("[data-contact]"))) { e.preventDefault(); closeLayer($("#search")); var cp = el.getAttribute("data-contact"); contactModal("general", cp ? { product: DT.bySku(cp), message: "I'd like to know more about " + DT.bySku(cp).name + "." } : {}); return; }
      if ((el = t.closest("[data-buy]"))) { e.preventDefault(); buyNow(DT.bySku(el.getAttribute("data-buy"))); return; }
      if ((el = t.closest("[data-add]"))) {
        e.preventDefault(); var p = DT.bySku(el.getAttribute("data-add")), q = DT.isTile(p) ? 10 : 1;
        Store.addCart(p.sku, q);
        toast(esc(p.name) + " — " + q + " " + DT.unitLabel(p, q) + " added", '<button type="button" data-open-cart>View cart</button>');
        return;
      }
      if ((el = t.closest("[data-wish]"))) { e.preventDefault(); var on = Store.toggleWish(el.getAttribute("data-wish")); toast(on ? "Saved to your shortlist" : "Removed from your shortlist", on ? '<button type="button" data-open-wish>View saved</button>' : ""); return; }
      if ((el = t.closest("[data-wish-remove]"))) { Store.toggleWish(el.getAttribute("data-wish-remove")); return; }
      if (t.closest("[data-wish-all]")) { Store.wish.forEach(function (s) { var p = DT.bySku(s); Store.addCart(s, DT.isTile(p) ? 10 : 1); }); drawerMode = "cart"; renderDrawer(); toast("Saved surfaces added to cart"); return; }
      if (t.closest("[data-wish-samples]")) { Store.wish.forEach(function (s) { var p = DT.bySku(s); if (p && DT.isTile(p)) Store.addSample(s); }); location.href = "samples.html"; return; }
      if ((el = t.closest("[data-sample]"))) { e.preventDefault(); addSample(el.getAttribute("data-sample"), el.hasAttribute("data-go")); return; }
      if ((el = t.closest("[data-quote]"))) { e.preventDefault(); location.href = "quote.html?sku=" + encodeURIComponent(el.getAttribute("data-quote")); return; }
      if ((el = t.closest("[data-remove]"))) { Store.removeCart(el.getAttribute("data-remove")); return; }
      if ((el = t.closest("[data-cq]"))) {
        var box = el.closest("[data-cart-qty]"), inp = $("input", box); var nv = Math.max(1, (parseInt(inp.value, 10) || 1) + +el.getAttribute("data-cq"));
        Store.setQty(box.getAttribute("data-cart-qty"), nv); return;
      }
    });
    document.addEventListener("submit", function (e) {
      if (e.target.id !== "d-form") return;
      e.preventDefault();
      var items = Store.cartItems();
      if (!items.length || !validate(e.target)) return;
      var d = formData(e.target); Store.remember(d);
      W.open(W.cart(items, d)); toast("Opening WhatsApp with your complete cart");
    });
    document.addEventListener("input", function (e) {
      if (e.target.closest && e.target.closest("#d-form")) { var dp = $("#d-preview"); if (dp) dp.textContent = W.cart(Store.cartItems(), formData($("#d-form"))); }
    });
    document.addEventListener("change", function (e) {
      var box = e.target.closest && e.target.closest("[data-cart-qty]");
      if (box) Store.setQty(box.getAttribute("data-cart-qty"), Math.max(1, parseInt(e.target.value, 10) || 1));
    });
    $("#search-input").addEventListener("input", function (e) { searchRender(e.target.value); });
    $("#search-input").addEventListener("keydown", function (e) {
      var links = $$("#search-results a");
      if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); sSel = (sSel + (e.key === "ArrowDown" ? 1 : -1) + links.length) % links.length; links.forEach(function (l, i) { l.classList.toggle("sel", i === sSel); }); if (links[sSel]) links[sSel].scrollIntoView({ block: "nearest" }); }
      if (e.key === "Enter") { e.preventDefault(); var sel = $("#search-results a.sel") || (this.value.trim() ? null : null); if (sel) location.href = sel.href; else if (this.value.trim()) location.href = "collection.html?q=" + encodeURIComponent(this.value.trim()); }
    });
    document.addEventListener("keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openSearch(); }
      if (e.key === "Escape") { ["#modal", "#search", "#drawer", "#mnav"].some(function (s) { var el = $(s); if (el && el.classList.contains("open")) { closeLayer(el); return true; } }); var f = $(".filters.open"); if (f) f.classList.remove("open"); }
    });
    window.addEventListener("storage", function (e) { if (/^dts_/.test(e.key || "")) { Store.cart = load("dts_cart", []); Store.wish = load("dts_wish", []); Store.samples = load("dts_samples", []); syncBadges(); document.dispatchEvent(new CustomEvent("dts:store")); } });
  }

  /* ==========================================================================
     PAGES
     ========================================================================== */
  var Pages = {};

  /* ---------- Home ---------- */
  Pages.home = function () {
    var feat = DT.bySku("DTS-FT-TNV-6012") || DT.products.filter(DT.isTile)[0] || DT.products[0];
    var hc = $("#hero-card");
    if (hc && feat) { hc.href = "product.html?sku=" + encodeURIComponent(feat.slug); hc.innerHTML = '<div class="sw"><img data-tex="' + feat.sku + '" alt=""></div><div><div class="s">Batch Sourced</div><div class="t">' + esc(feat.name) + '</div><div class="p num">₹' + inr(feat.price) + " " + DT.priceSuffix(feat) + "</div></div>"; }
    else if (hc) hc.style.display = "none";
    var sg = $("#spaces");
    if (sg) sg.innerHTML = DT.spaces.map(function (s, i) {
      return '<a class="space-card hover-zoom reveal" href="collection.html?room=' + s.id + '" style="transition-delay:' + (i % 3) * 80 + 'ms"><div class="ph">' + '<img src="' + DT.photo(DT.img[s.photo], 900) + '" alt="' + esc(s.name) + ' interior" loading="lazy" data-loading onload="this.removeAttribute(\'data-loading\')"><span class="tag">' + DT.products.filter(function (p) { return p.rooms.indexOf(s.id) > -1; }).length + " surfaces</span></div>" +
        '<div class="meta"><div><h3>' + esc(s.name) + "</h3><p>" + esc(s.desc) + '</p></div><span class="go">' + I.arrow + "</span></div></a>";
    }).join("");
    var cur = $("#curated");
    // Newest admin uploads appear first (sort order), so this always shows the latest releases.
    if (cur) cur.innerHTML = DT.products.slice(0, 4).map(function (p) { return card(p); }).join("") || '<div class="empty"><h3>New releases arriving soon</h3><p>Ask the studio for the latest arrivals.</p></div>';
    showroomStatus();
    homeEstimator();
  };

  function showroomStatus() {
    $$("[data-open-status]").forEach(function (el) { var s = openStatus(); el.innerHTML = "<i></i>" + s.text; el.classList.toggle("closed", !s.open); });
    $$("[data-hours]").forEach(function (el) { el.innerHTML = hoursSummary(); });
    $$("[data-address]").forEach(function (el) { el.innerHTML = ADDR_HTML; });
    $$("[data-directions]").forEach(function (el) { el.href = C.mapLink; el.target = "_blank"; el.rel = "noopener"; });
    $$("[data-tel]").forEach(function (el) { el.href = "tel:" + C.phoneTel; if (!el.children.length) el.textContent = C.phoneDisplay; });
  }

  function homeEstimator() {
    var f = $("#home-est"); if (!f) return;
    var sel = $("[name=sku]", f);
    sel.innerHTML = DT.products.filter(DT.isTile).map(function (p) { return '<option value="' + p.sku + '">' + esc(p.name) + " — " + esc(p.size) + "</option>"; }).join("");
    if (DT.bySku("DTS-FT-CGH-6012")) sel.value = "DTS-FT-CGH-6012";
    function calc() {
      var L = parseFloat($("[name=l]", f).value) || 0, Wd = parseFloat($("[name=w]", f).value) || 0, p = DT.bySku(sel.value);
      var a = L * Wd, req = a * 1.1, boxes = p ? Math.ceil(req / p.coverage) : 0;
      $("[data-o=area]", f).textContent = num(a, 1) + " sq.ft";
      $("[data-o=waste]", f).textContent = num(req, 1) + " sq.ft";
      $("[data-o=boxes]", f).textContent = boxes + " Boxes";
      $("[data-full]").href = "calculator.html?l=" + L + "&w=" + Wd + "&sku=" + encodeURIComponent(sel.value);
    }
    f.addEventListener("input", calc); calc();
  }

  /* ---------- Shop (all collections) ---------- */
  Pages.shop = function () {
    var g = $("#cat-grid"); if (!g) return;
    g.innerHTML = DT.categories.map(function (c, i) {
      var n = DT.inCat(c.id).length, from = DT.fromPrice(c.id), any = DT.inCat(c.id)[0];
      var suffix = any && DT.isTile(any) ? " / sq.ft" : "";
      return '<a class="ccard reveal" href="collection.html?c=' + c.id + '" style="transition-delay:' + (i % 3) * 70 + 'ms"><div class="ph">' + '<img src="' + DT.photo(DT.img[c.photo], 800) + '" alt="' + esc(c.name) + '" loading="lazy" data-loading onload="this.removeAttribute(\'data-loading\')">' +
        '<span class="cn">Cat. ' + c.no + " • " + esc(c.kicker) + '</span><span class="from num">From ₹' + inr(from) + suffix + "</span></div>" +
        '<div class="cb"><div class="ct"><h3>' + esc(c.name) + "</h3><span>" + n + " surfaces</span></div><p>" + esc(c.desc) + '</p><div class="cf"><span class="link-arrow">Explore collection ' + I.arrow + "</span><span>" + (DT.inCat(c.id).filter(function (p) { return p.stock === "in"; }).length) + " in stock</span></div></div></a>";
    }).join("") +
      '<div class="trade-card reveal"><div><span class="eyebrow">Architect &amp; Trade Portal</span><h3>Need custom slab fabrication or volume project quotes?</h3><p>We partner with premier architectural firms across Delhi-NCR to provide dry-lay approvals, edge chamfering, waterjet cutting and kiln reservations.</p>' +
      '<ul class="pts"><li>Commercial GST invoicing within 24 hours</li><li>Dedicated project coordinator</li><li>Volume trade margins</li></ul></div><div><a class="btn btn-terra btn-block" href="quote.html">Request Trade Quote ' + I.arrow + '</a><button class="btn btn-ghost-light btn-block" style="margin-top:8px" data-trade>Register Trade Account</button></div></div>';
    var est = $("#strip-est");
    if (est) est.addEventListener("submit", function (e) {
      e.preventDefault();
      var a = parseFloat($("[name=area]", est).value);
      var out = $(".result", est);
      if (!(a > 0)) { $("[name=area]", est).classList.add("invalid"); return; }
      var req = a * 1.1, boxes = Math.ceil(req / 15.5);
      out.innerHTML = "With 10% wastage you need <b>" + num(req, 1) + " sq.ft</b> — about <b>" + boxes + " boxes</b> of 600×1200mm tiles. <a class=\"link-arrow terra\" href=\"calculator.html?area=" + a + "\">Refine & send to studio " + I.arrow + "</a>";
      out.classList.add("show");
    });
  };

  /* ---------- Collection / listing ---------- */
  Pages.collection = function () {
    var catId = qs.get("c"), cat = catId ? DT.catById(catId) : null;
    var room = qs.get("room"), q = (qs.get("q") || "").toLowerCase();
    var base = cat ? DT.inCat(cat.id) : DT.products.slice();
    if (room) base = base.filter(function (p) { return p.rooms.indexOf(room) > -1; });
    if (q) base = base.filter(function (p) { var hay = [p.name, p.sku, p.material, p.finish, p.colour, p.size, p.category, p.cats.join(" ")].join(" ").toLowerCase().replace(/x/g, "×"); return q.split(/\s+/).every(function (t) { return hay.indexOf(t.replace(/x/g, "×")) > -1; }); });
    var space = room ? DT.spaces.find(function (s) { return s.id === room; }) : null;

    // Page head
    var title = cat ? cat.name : space ? space.name : q ? "Results for “" + esc(q) + "”" : "All Surfaces";
    var desc = cat ? cat.desc : space ? space.desc + " Curated surfaces chosen for how this room is lived in." : "Every surface in our studio — tiles, slabs, sanitaryware and finishing details, selected with intention.";
    document.title = (cat ? cat.name : space ? space.name + " Surfaces" : "Shop All Surfaces") + " — D.Tiles Studio";
    var heroP = base.find(function (p) { return DT.isTile(p); }) || base[0];
    $("#crumb-cur").textContent = cat ? cat.name : space ? space.name : "All Surfaces";
    $("#coll-eyebrow").innerHTML = '<span class="dash"></span>' + (cat ? "Architectural Surface Series • " + cat.no : space ? "Explore by Space" : "The Complete Studio Catalogue");
    $("#coll-title").innerHTML = title;
    $("#coll-desc").textContent = desc;
    var ph = cat ? cat.photo : space ? space.photo : "living4";
    $("#coll-visual").innerHTML = photo(ph, 1400, title) + (heroP ? '<div class="cap"><div><div class="k">Installed Spec</div><div class="t">' + esc(heroP.name) + " " + esc(heroP.size.replace("mm", "")) + 'mm</div></div><span class="r">Residence ' + ("0" + (base.length % 9 + 1)).slice(-2) + ", NCR</span></div>" : "");

    // Filter state
    var tiles = base.filter(DT.isTile);
    var pmin = tiles.length ? Math.min.apply(null, tiles.map(function (p) { return p.price; })) : 0;
    var pmax = tiles.length ? Math.max.apply(null, tiles.map(function (p) { return p.price; })) : 0;
    var S = { lo: pmin, hi: pmax, material: [], finish: [], size: [], palette: [], rooms: [], stock: "all", sort: "rel", page: 1 };
    var PER = 9;

    function counts(key) { var m = {}; base.forEach(function (p) { var k = p[key]; m[k] = (m[k] || 0) + 1; }); return m; }
    function checks(key, label) {
      var m = counts(key), ks = Object.keys(m).sort();
      if (ks.length < 2) return "";
      return '<div class="fgroup"><div class="flabel">' + label + "</div>" + ks.map(function (k) { return '<label class="check"><input type="checkbox" data-f="' + key + '" value="' + esc(k) + '">' + esc(k) + '<span class="c num">' + ("0" + m[k]).slice(-2) + "</span></label>"; }).join("") + "</div>";
    }
    var sizes = Object.keys(counts("size"));
    var pals = DT.palette.filter(function (pl) { return base.some(function (p) { return p.palette === pl.id; }); });
    var roomsAvail = DT.spaces.filter(function (s) { return base.some(function (p) { return p.rooms.indexOf(s.id) > -1; }); });
    var fhtml = '<div class="fhead"><h3>' + I.filter + ' Filters</h3><button class="clear" type="button" data-clear>Clear all</button></div>' +
      (tiles.length > 1 && pmax > pmin ? '<div class="fgroup"><div class="flabel">Price per sq.ft <span class="num" data-plabel></span></div><div class="range"><div class="track"></div><div class="fill"></div><input type="range" data-lo min="' + pmin + '" max="' + pmax + '" value="' + pmin + '" step="5" aria-label="Minimum price"><input type="range" data-hi min="' + pmin + '" max="' + pmax + '" value="' + pmax + '" step="5" aria-label="Maximum price"></div><div class="range-inputs"><input class="input num" data-lo-in value="' + pmin + '" inputmode="numeric" aria-label="Minimum"><span>to</span><input class="input num" data-hi-in value="' + pmax + '" inputmode="numeric" aria-label="Maximum"></div></div>' : "") +
      checks("material", "Material Composition") + checks("finish", "Finish &amp; Tactility") +
      (sizes.length > 1 ? '<div class="fgroup"><div class="flabel">Slab Dimensions</div><div class="sizes">' + sizes.sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); }).map(function (s) { return '<button type="button" data-size="' + esc(s) + '">' + esc(s.replace("mm", "")) + "</button>"; }).join("") + "</div></div>" : "") +
      (pals.length > 1 ? '<div class="fgroup"><div class="flabel">Architectural Palette</div><div class="swatches">' + pals.map(function (p) { return '<button type="button" data-pal="' + p.id + '"><i style="background:' + p.hex + '"></i>' + esc(p.name) + "</button>"; }).join("") + "</div></div>" : "") +
      (!room && roomsAvail.length > 1 ? '<div class="fgroup"><div class="flabel">Spatial Application</div>' + roomsAvail.map(function (s) { return '<label class="check"><input type="checkbox" data-f="rooms" value="' + s.id + '">' + esc(s.name) + "</label>"; }).join("") + "</div>" : "") +
      '<div class="fgroup"><div class="flabel">Stock Logistics</div><div class="stockbox"><label class="check"><input type="radio" name="stock" value="all" checked>All surfaces</label><label class="check"><input type="radio" name="stock" value="in">In-Stock Indirapuram Studio (Immediate)</label><label class="check"><input type="radio" name="stock" value="order">Made-to-Order Kiln Batch (7–14 Days)</label></div></div>' +
      '<button class="btn btn-dark btn-block listing-close" type="button" data-close-filters style="margin-top:18px">Show results</button>';
    var F = $("#filters"); F.innerHTML = fhtml;
    if (window.innerWidth > 1024) { var lc = $(".listing-close", F); if (lc) lc.style.display = "none"; }

    function apply() {
      var list = base.filter(function (p) {
        if (DT.isTile(p) && (p.price < S.lo || p.price > S.hi)) return false;
        if (S.material.length && S.material.indexOf(p.material) < 0) return false;
        if (S.finish.length && S.finish.indexOf(p.finish) < 0) return false;
        if (S.size.length && S.size.indexOf(p.size) < 0) return false;
        if (S.palette.length && S.palette.indexOf(p.palette) < 0) return false;
        if (S.rooms.length && !S.rooms.some(function (r) { return p.rooms.indexOf(r) > -1; })) return false;
        if (S.stock !== "all" && p.stock !== S.stock) return false;
        return true;
      });
      var sorters = {
        rel: null,
        lo: function (a, b) { return DT.unitPrice(a) / (a.coverage || 1) - DT.unitPrice(b) / (b.coverage || 1); },
        hi: function (a, b) { return DT.unitPrice(b) / (b.coverage || 1) - DT.unitPrice(a) / (a.coverage || 1); },
        az: function (a, b) { return a.name.localeCompare(b.name); },
        stock: function (a, b) { return (a.stock === "in" ? 0 : 1) - (b.stock === "in" ? 0 : 1); }
      };
      if (sorters[S.sort]) list.sort(sorters[S.sort]);
      return list;
    }

    function chips() {
      var out = [];
      if (S.lo > pmin || S.hi < pmax) out.push(['₹' + S.lo + " – ₹" + S.hi, "price"]);
      ["material", "finish", "size", "rooms"].forEach(function (k) { S[k].forEach(function (v) { var label = k === "rooms" ? (DT.spaces.find(function (s) { return s.id === v; }) || {}).name : v; out.push([label, k, v]); }); });
      S.palette.forEach(function (v) { out.push([(DT.palette.find(function (p) { return p.id === v; }) || {}).name, "palette", v]); });
      var html = '<span class="micro muted">Applied:</span>';
      if (!out.length && S.stock === "all") html += '<span class="small muted">No filters — showing every surface' + (cat ? " in " + esc(cat.name) : "") + ".</span>";
      html += out.map(function (c) { return '<span class="chip">' + esc(c[0]) + '<button type="button" aria-label="Remove filter" data-unchip="' + c[1] + '" data-v="' + esc(c[2] || "") + '">' + I.close + "</button></span>"; }).join("");
      if (S.stock !== "all") html += '<span class="chip solid">' + (S.stock === "in" ? "In Stock NCR" : "Made to Order") + '<button type="button" aria-label="Remove filter" data-unchip="stock">' + I.close + "</button></span>";
      return html;
    }

    function render() {
      var list = apply(), pages = Math.max(1, Math.ceil(list.length / PER));
      if (S.page > pages) S.page = pages;
      var slice = list.slice((S.page - 1) * PER, S.page * PER);
      $("#applied-chips").innerHTML = chips();
      $("#result-count").innerHTML = "Showing <b>" + slice.length + "</b> of " + list.length + " Curated Surface" + (list.length === 1 ? "" : "s");
      var html = slice.map(function (p) { return card(p); });
      if (S.page === 1 && slice.length > 3) html.splice(3, 0, advisory(cat));
      $("#grid").innerHTML = html.join("") || '<div class="empty"><h3>No surfaces match these filters</h3><p>Try widening the price range or removing a filter — or ask our studio to source it for you.</p><div class="btn-row" style="justify-content:center"><button class="btn btn-dark" data-clear>Clear filters</button><button class="btn btn-line" data-contact>Ask the studio</button></div></div>';
      var pg = "";
      if (pages > 1) {
        pg = '<button class="nav-b" data-pg="' + (S.page - 1) + '"' + (S.page === 1 ? " disabled" : "") + ">" + I.arrowL + "<span>Previous</span></button><div class=\"pages\">";
        for (var i = 1; i <= pages; i++) pg += '<button data-pg="' + i + '"' + (i === S.page ? ' class="on" aria-current="page"' : "") + ">" + i + "</button>";
        pg += '</div><button class="nav-b" data-pg="' + (S.page + 1) + '"' + (S.page === pages ? " disabled" : "") + "><span>Next</span>" + I.arrow + "</button>";
      }
      $("#pager").innerHTML = pg;
      var lbl = $("[data-plabel]", F); if (lbl) lbl.textContent = "₹" + S.lo + " — ₹" + S.hi;
      var fill = $(".range .fill", F); if (fill) { var span = pmax - pmin || 1; fill.style.left = ((S.lo - pmin) / span * 100) + "%"; fill.style.right = (100 - (S.hi - pmin) / span * 100) + "%"; }
      var fc = $("#filter-count"); if (fc) { var n = S.material.length + S.finish.length + S.size.length + S.palette.length + S.rooms.length + (S.stock !== "all" ? 1 : 0) + (S.lo > pmin || S.hi < pmax ? 1 : 0); fc.textContent = n ? "(" + n + ")" : ""; }
      hydrate($("#grid"));
    }

    function syncControls() {
      $$("[data-f]", F).forEach(function (c) { c.checked = S[c.getAttribute("data-f")].indexOf(c.value) > -1; });
      $$("[data-size]", F).forEach(function (b) { b.classList.toggle("on", S.size.indexOf(b.getAttribute("data-size")) > -1); });
      $$("[data-pal]", F).forEach(function (b) { b.classList.toggle("on", S.palette.indexOf(b.getAttribute("data-pal")) > -1); });
      $$("[name=stock]", F).forEach(function (r) { r.checked = r.value === S.stock; });
      var lo = $("[data-lo]", F); if (lo) { lo.value = S.lo; $("[data-hi]", F).value = S.hi; $("[data-lo-in]", F).value = S.lo; $("[data-hi-in]", F).value = S.hi; }
    }
    function toggle(arr, v) { var i = arr.indexOf(v); if (i > -1) arr.splice(i, 1); else arr.push(v); }

    F.addEventListener("change", function (e) {
      var t = e.target;
      if (t.hasAttribute("data-f")) toggle(S[t.getAttribute("data-f")], t.value);
      if (t.name === "stock") S.stock = t.value;
      if (t.hasAttribute("data-lo-in") || t.hasAttribute("data-hi-in")) {
        var a = Math.max(pmin, Math.min(pmax, parseInt($("[data-lo-in]", F).value, 10) || pmin)), b = Math.max(pmin, Math.min(pmax, parseInt($("[data-hi-in]", F).value, 10) || pmax));
        S.lo = Math.min(a, b); S.hi = Math.max(a, b); syncControls();
      }
      S.page = 1; render();
    });
    F.addEventListener("input", function (e) {
      var t = e.target;
      if (t.hasAttribute("data-lo") || t.hasAttribute("data-hi")) {
        var a = +$("[data-lo]", F).value, b = +$("[data-hi]", F).value;
        if (a > b) { if (t.hasAttribute("data-lo")) a = b; else b = a; t.value = t.hasAttribute("data-lo") ? a : b; }
        S.lo = a; S.hi = b; $("[data-lo-in]", F).value = a; $("[data-hi-in]", F).value = b; S.page = 1; render();
      }
    });
    document.addEventListener("click", function (e) {
      var t = e.target, el;
      if ((el = t.closest("[data-size]"))) { toggle(S.size, el.getAttribute("data-size")); el.classList.toggle("on"); S.page = 1; render(); }
      else if ((el = t.closest("[data-pal]"))) { toggle(S.palette, el.getAttribute("data-pal")); el.classList.toggle("on"); S.page = 1; render(); }
      else if (t.closest("[data-clear]")) { S = { lo: pmin, hi: pmax, material: [], finish: [], size: [], palette: [], rooms: [], stock: "all", sort: S.sort, page: 1 }; syncControls(); render(); }
      else if ((el = t.closest("[data-unchip]"))) {
        var k = el.getAttribute("data-unchip"), v = el.getAttribute("data-v");
        if (k === "price") { S.lo = pmin; S.hi = pmax; } else if (k === "stock") S.stock = "all"; else toggle(S[k], v);
        syncControls(); S.page = 1; render();
      }
      else if ((el = t.closest("[data-pg]")) && !el.disabled) { S.page = +el.getAttribute("data-pg"); render(); window.scrollTo({ top: $("#applied-bar").offsetTop - 80, behavior: "smooth" }); }
      else if (t.closest("[data-open-filters]")) { F.classList.add("open"); }
      else if (t.closest("[data-close-filters]")) { F.classList.remove("open"); }
      else if (F.classList.contains("open") && !t.closest("#filters")) { F.classList.remove("open"); }
    });
    $$("[data-sort]").forEach(function (s) { s.addEventListener("change", function () { S.sort = s.value; $$("[data-sort]").forEach(function (o) { o.value = s.value; }); S.page = 1; render(); }); });
    render();
  };

  function advisory(cat) {
    var t = {
      bathroom: ["Choosing Surfaces for Wet Areas", "For showers and bathroom floors, choose R10–R11 slip ratings and matte or satin finishes. Glossy tiles belong on walls, not underfoot."],
      kitchen: ["Kitchens that Age Gracefully", "Choose full-body or glazed vitrified floors that resist stains and dropped utensils. Pair with a sealed or glazed backsplash that wipes clean."],
      outdoor: ["Outdoor Surfaces that Stay Safe", "Use 20mm pavers or R11–R12 structured finishes for terraces and driveways. They stay grippy through the monsoon and resist frost and UV."],
      sanitaryware: ["Planning a Calm Bathroom Suite", "Wall-hung WCs and countertop basins free floor space and simplify cleaning. Plan concealed frames before tiling begins."]
    }[cat && cat.id] || ["Understanding Slip Resistance & PEI Ratings for Living Areas", "For expansive residential flooring, balance easy maintenance with safe footing. Our Indirapuram advisors recommend an R10 matte rating for dining and living zones — elegant satin sheen without wet hazard."];
    return '<div class="advisory reveal"><div><span class="eyebrow terra">Architectural Advisory • Technical Primer</span><h3>' + t[0] + "</h3><p>" + t[1] + '</p><div class="pts"><span>Class 4/5 Heavy Footfall</span><span>Stain Resistance Grade A+</span><span>Kiln-Cured Monocalibre</span></div></div><div class="cta"><button class="btn btn-terra" data-consult>Book Surface Specialist</button><small>No-obligation technical consultation</small></div></div>';
  }

  /* ---------- Product detail ---------- */
  Pages.product = function () {
    var p = DT.bySku(qs.get("sku") || "");
    var root = $("#pdp");
    if (!p) {
      root.innerHTML = '<div class="empty" style="margin:40px 0"><h3>We couldn’t find that surface</h3><p>It may have been renamed or moved to another collection.</p><div class="btn-row" style="justify-content:center"><a class="btn btn-dark" href="collection.html">Browse all surfaces</a><button class="btn btn-line" data-contact>Ask the studio</button></div></div>';
      return;
    }
    document.title = p.name + " — " + p.size + " " + p.finish + " | D.Tiles Studio";
    var md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute("content", p.name + " (" + p.sku + "): " + p.desc);
    var cat = DT.catById(p.cats[0]);
    $("#crumbs").innerHTML = '<a href="index.html">Home</a><span class="sep">/</span><a href="collection.html">Shop</a><span class="sep">/</span><a href="collection.html?c=' + cat.id + '">' + esc(cat.name) + '</a><span class="sep">/</span><span class="cur">' + esc(p.name) + "</span>";
    var tile = DT.isTile(p);
    var roomPhoto = cat.photo;
    var shots = p.images
      ? p.images.map(function (u) { return { k: "url", url: u }; }).concat([{ k: "photo", key: roomPhoto }])
      : p.photo
      ? [{ k: "photo", key: p.photo }, { k: "photo", key: "bathroom" }, { k: "photo", key: "bathDark" === p.photo ? "bathTub" : "bathDark" }, { k: "photo", key: "minimal" }]
      : [{ k: "tex" }, { k: "laid" }, { k: "detail" }, { k: "photo", key: roomPhoto }];
    function shotHtml(s, w) {
      if (s.k === "url") return '<img src="' + esc(s.url) + '" alt="' + esc(p.name) + '">';
      if (s.k === "photo") return '<img src="' + DT.photo(DT.img[s.key], w) + '" alt="' + esc(p.name) + ' installed">';
      return '<img data-tex="' + p.sku + '"' + (s.k !== "tex" ? ' data-variant="' + s.k + '"' : "") + ' alt="' + esc(p.name) + " " + (s.k === "laid" ? "laid pattern" : s.k === "detail" ? "surface close-up" : "surface") + '">';
    }
    var stockHtml = (p.stock === "in" ? '<span class="stock-line"><i></i>In stock' + (p.stockQty ? " • " + p.stockQty + " " + DT.unitLabel(p, p.stockQty) + " ready" : "") + " • Indirapuram studio</span>" : '<span class="stock-line order"><i></i>Made to order • 7–14 days</span>') +
      (p.bulkPct ? '<div class="bulk-offer">' + I.sparkle + "<span><b>Bulk offer:</b> " + esc(DT.bulkNote(p)) + " — applied automatically in your cart and WhatsApp order.</span></div>" : "");
    var specs = [["SKU", p.sku], ["Brand", p.brand], ["Category", p.category], ["Size", p.size], p.thickness ? ["Thickness", p.thickness] : null, ["Material", p.material], ["Finish", p.finish], ["Colour", p.colour],
      tile && p.pcsPerBox ? ["Pieces per box", p.pcsPerBox + " pcs"] : null, p.colours > 1 ? ["Colour options", "Available in " + p.colours + " colours"] : null,
      p.bulkPct ? ["Bulk offer", DT.bulkNote(p)] : null, p.stockQty ? ["In stock", p.stockQty + " " + DT.unitLabel(p, p.stockQty)] : null, tile ? ["Coverage per box", num(p.coverage) + " sq.ft"] : null, p.pei && p.pei !== "—" ? ["Wear rating", p.pei] : null, p.slip && p.slip !== "—" ? ["Slip rating", p.slip] : null,
      ["Best for", p.rooms.map(function (r) { return (DT.spaces.find(function (s) { return s.id === r; }) || {}).name; }).join(", ")]].filter(Boolean);

    root.innerHTML =
      '<div class="pdp">' +
      '<div class="gallery"><div class="main" id="g-main"><span class="flag">' + esc(p.flag) + "</span>" + shotHtml(shots[0], 1400) + "</div>" +
      '<div class="thumbs">' + shots.map(function (s, i) { return '<button type="button" data-shot="' + i + '"' + (i === 0 ? ' class="on"' : "") + ' aria-label="View image ' + (i + 1) + '">' + shotHtml(s, 300) + "</button>"; }).join("") + "</div></div>" +
      '<div class="pinfo"><span class="eyebrow terra"><span class="dash"></span>' + esc(p.category) + " • " + esc(p.brand) + "</span>" +
      "<h1>" + esc(p.name) + '</h1><div class="sku">SKU ' + esc(p.sku) + " • " + esc(p.size) + " • " + esc(p.finish) + "</div>" +
      '<div class="pprice"><b class="num">₹' + inr(p.price) + "</b><span>" + DT.priceSuffix(p) + (tile ? " • ₹" + inr(DT.unitPrice(p)) + " per box of " + num(p.coverage) + " sq.ft" : "") + '</span></div><div class="tax">Prices exclude GST (18%) and delivery — both confirmed transparently on WhatsApp.</div>' +
      '<p class="desc">' + esc(p.long) + "</p>" + stockHtml +
      '<div class="buybox">' +
      (tile ? '<div class="row"><div class="field"><label>Your area</label><div class="input-group has-suf" style="width:170px"><input class="input num" id="pa-area" inputmode="decimal" placeholder="e.g. 220"><span class="suf">sq.ft</span></div></div><div class="field"><label>Quantity (boxes)</label>' + qtyCtl("qty", 10) + '</div><label class="check" style="margin-bottom:12px"><input type="checkbox" id="pa-waste" checked>Add 10% wastage</label></div>'
        : '<div class="row"><div class="field"><label>Quantity (' + esc(p.unit) + ")</label>" + qtyCtl("qty", 1) + "</div></div>") +
      '<div class="calc-line"><span id="pa-cov"></span><span>Subtotal <b class="num" id="pa-sub"></b></span></div>' +
      '<div class="actions"><button class="btn btn-dark" id="pa-buy">Buy Now ' + I.arrow + '</button><button class="btn btn-line" id="pa-add">' + I.bag + " Add to Cart</button></div>" +
      '<div class="sub-actions">' + (tile ? '<button class="link-arrow terra" data-sample="' + p.sku + '" data-go>Request a sample ' + I.arrow + "</button>" : "") +
      '<a class="link-arrow" href="quote.html?sku=' + p.slug + '">Bulk quote ' + I.arrow + "</a>" + (tile ? '<a class="link-arrow" href="calculator.html?sku=' + p.sku + '">Room calculator ' + I.arrow + "</a>" : "") +
      '<button class="heart link-arrow" data-wish="' + p.sku + '" style="position:static;width:auto;height:auto;background:none;border-radius:0">' + I.heart + " Save</button></div></div>" +
      '<div class="specs">' + specs.map(function (s) { return '<div class="r"><span>' + s[0] + '</span><span class="num">' + esc(s[1]) + "</span></div>"; }).join("") + "</div>" +
      '<details class="acc"><summary>Installation &amp; care</summary><div class="acc-b">' + (tile ? "Lay on a level, cured screed using a polymer-modified C2 adhesive with full back-buttering for formats above 600mm. Keep a 2–3mm joint for rectified tiles and use spacers with a levelling system. Clean with a pH-neutral cleaner; avoid acid on honed and polished finishes." : "Install by a qualified plumber following the fitting guide in the box. Clean with a soft cloth and mild soap — avoid abrasive pads and acidic descalers on matte finishes.") + "</div></details>" +
      '<details class="acc"><summary>Delivery &amp; returns</summary><div class="acc-b">Same-day / next-day delivery across Ghaziabad, Noida and East Delhi for in-stock items; Pan-India freight in 4–8 days. Unopened full boxes can be returned within 7 days of delivery. Always order from a single batch for tonal consistency.</div></details>' +
      '<details class="acc"><summary>Talk to a specialist</summary><div class="acc-b">Unsure about the finish or quantity? <a class="link-arrow terra" href="#" data-contact="' + p.sku + '">Ask about this product ' + I.arrow + "</a></div></details>" +
      "</div></div>";

    var qIn = $("[name=qty]", root), area = $("#pa-area"), waste = $("#pa-waste");
    function upd() {
      var q = Math.max(1, parseInt(qIn.value, 10) || 1);
      var lt = DT.lineTotal(p, q);
      $("#pa-sub").innerHTML = (lt.pct ? '<s class="muted" style="font-weight:500;margin-right:6px">₹' + inr(lt.gross) + "</s>" : "") + "₹" + inr(lt.net);
      $("#pa-cov").textContent = (tile ? q + " boxes • covers " + num(q * p.coverage) + " sq.ft" : q + " " + DT.unitLabel(p, q)) + (lt.pct ? " • " + lt.pct + "% bulk discount" : "");
    }
    if (area) {
      var fromArea = function () { var a = parseFloat(area.value); if (a > 0) { qIn.value = Math.ceil(a * (waste.checked ? 1.1 : 1) / p.coverage); } upd(); };
      area.addEventListener("input", fromArea); waste.addEventListener("change", fromArea);
    }
    qIn.addEventListener("input", upd); upd();
    $("#pa-buy").addEventListener("click", function () { buyNow(p, Math.max(1, parseInt(qIn.value, 10) || 1)); });
    $("#pa-add").addEventListener("click", function () { var q = Math.max(1, parseInt(qIn.value, 10) || 1); Store.addCart(p.sku, q); toast(esc(p.name) + " — " + q + " " + DT.unitLabel(p, q) + " added", '<button type="button" data-open-cart>View cart</button>'); });
    $$("[data-shot]", root).forEach(function (b) {
      b.addEventListener("click", function () {
        $$("[data-shot]", root).forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on");
        var main = $("#g-main"); main.innerHTML = '<span class="flag">' + esc(p.flag) + "</span>" + shotHtml(shots[+b.getAttribute("data-shot")], 1400); hydrate(main);
      });
    });

    var rel = DT.products.filter(function (x) { return x.sku !== p.sku && x.cats.some(function (c) { return p.cats.indexOf(c) > -1; }); }).slice(0, 4);
    $("#related").innerHTML = rel.map(function (x) { return card(x); }).join("");
    hydrate(root);
  };

  /* ---------- Samples ---------- */
  Pages.samples = function () {
    var list = $("#swatch-list"), me = Store.me;
    if (qs.get("sku")) { var ps = DT.bySku(qs.get("sku")); if (ps && DT.isTile(ps)) Store.addSample(ps.sku); }
    function finishes(p) { var f = [p.finish, "Matte", "Satin", "Honed", "Polished"]; return f.filter(function (x, i) { return f.indexOf(x) === i; }); }
    function render() {
      var items = Store.samples;
      $("#sw-count").textContent = "Your Selected Swatches (" + items.length + "/" + C.maxSamples + ")";
      $("#sw-free").innerHTML = I.check + " " + Math.min(items.length, C.freeSamples) + " complimentary applied";
      if (!items.length) list.innerHTML = '<div class="empty" style="background:var(--white)"><h3>Your swatch box is empty</h3><p>Add up to five surfaces to feel at home before you decide.</p><button class="btn btn-dark" type="button" data-pick>Choose swatches</button></div>';
      else list.innerHTML = items.map(function (it) {
        var p = DT.bySku(it.sku), sz = /1200|1600|2400|3200/.test(p.size) ? "150×150MM" : "100×200MM";
        return '<div class="swatch-item"><div class="im"><img data-tex="' + p.sku + '" data-variant="detail" alt=""><small>' + sz + '</small></div><div><span class="st"><i></i>' + (p.stock === "in" ? "In Stock" : "Kiln Batch") + " • Batch " + esc(p.batch) + "</span><h4>" + esc(p.name) + "</h4><p>" + esc(p.material) + " • " + esc(p.size) + '</p><p style="font-size:11px;margin-top:4px">Batch code: ' + esc(p.sku) + '</p></div><div class="ctrl"><label class="sr-only" for="fin-' + p.sku + '">Finish</label><select class="select" id="fin-' + p.sku + '" data-finish="' + p.sku + '">' + finishes(p).map(function (f) { return '<option' + (f === it.finish ? " selected" : "") + ">" + esc(f) + "</option>"; }).join("") + '</select><button class="rm" type="button" data-sw-rm="' + p.sku + '">' + I.close + " Remove</button></div></div>";
      }).join("");
      $("#sw-add").style.display = items.length >= C.maxSamples ? "none" : "";
      $("#sw-add-n").textContent = "(+" + (C.maxSamples - items.length) + " max)";
      summary();
      hydrate(list);
    }
    function fee() {
      var opt = ($("[name=option]:checked") || {}).value, extra = Math.max(0, Store.samples.length - C.freeSamples) * 75;
      return (opt === "Home Delivery" ? C.sampleFee : 0) + extra;
    }
    function summary() {
      var n = Store.samples.length;
      $("#sum-items").textContent = n ? n + " Custom Swatch" + (n > 1 ? "es" : "") + " + Technical Dossier" : "No swatches selected";
      $("#sum-fee").textContent = "₹" + inr(fee());
    }
    list.addEventListener("change", function (e) { var s = e.target.getAttribute("data-finish"); if (s) { var it = Store.samples.find(function (x) { return x.sku === s; }); it.finish = e.target.value; Store.persist(); } });
    document.addEventListener("click", function (e) {
      var el = e.target.closest("[data-sw-rm]");
      if (el) { Store.samples = Store.samples.filter(function (x) { return x.sku !== el.getAttribute("data-sw-rm"); }); Store.persist(); render(); }
      if (e.target.closest("[data-pick]")) pick();
    });
    function pick() {
      var opts = DT.products.filter(function (p) { return DT.isTile(p) && !Store.samples.find(function (s) { return s.sku === p.sku; }); });
      modal({
        eyebrow: "Batch Samples", title: "Add a tile swatch", sub: "Choose up to " + (C.maxSamples - Store.samples.length) + " more surfaces.", submit: "Add to swatch box", submitClass: "btn-dark", submitIcon: false,
        body: '<div style="display:grid;gap:8px;max-height:46vh;overflow:auto;padding-right:4px">' + opts.map(function (p) { return '<label class="choice" style="align-items:center"><input type="checkbox" name="pick" value="' + p.sku + '"><span class="dot" style="border-radius:3px"></span><div class="mprod" style="margin:0;padding:0;border:0;background:none;flex:1"><div class="im"><img data-tex="' + p.sku + '" alt=""></div><div><b>' + esc(p.name) + "</b><span>" + esc(p.size) + " • " + esc(p.finish) + "</span></div></div></label>"; }).join("") + "</div>",
        onSubmit: function (d, f) {
          var picks = $$("[name=pick]:checked", f).map(function (c) { return c.value; });
          if (!picks.length) { toast("Select at least one surface."); return false; }
          var added = 0; picks.forEach(function (s) { if (Store.addSample(s) === "ok") added++; });
          if (added < picks.length) toast("Swatch box is limited to " + C.maxSamples + " surfaces."); else toast(added + " swatch" + (added > 1 ? "es" : "") + " added");
          render();
        }
      });
    }
    $("#sw-add").addEventListener("click", pick);

    var form = $("#sample-form");
    var f2 = $("#sample-fields");
    f2.innerHTML = '<div class="form-grid">' +
      field({ name: "name", label: "Full Name", required: true, value: me.name, placeholder: "Ar. Sunita Mathur" }) +
      field({ name: "mobile", label: "Mobile Number (WhatsApp enabled)", required: true, type: "mobile", value: me.mobile, placeholder: "98102 34567" }) +
      field({ name: "email", label: "Email Address", type: "email", inputType: "email", value: me.email, placeholder: "sunita@designstudio.in" }) +
      field({ name: "projectType", label: "Project Type", select: ["New Private Residence / Villa", "Apartment Renovation", "Commercial / Office", "Hospitality / Retail", "Architect Specification"], value: "New Private Residence / Villa" }) +
      '<div class="full" data-addr>' + field({ name: "address", label: "Delivery Address (House/Flat, Tower, Society)", required: true, value: me.address, placeholder: "Villa 14, Phase 2, ATS Advantage, Ahinsa Khand 1" }) + "</div>" +
      '<div class="full form-grid three" data-addr2>' + field({ name: "landmark", label: "Landmark / Locality", placeholder: "Near Habitat Centre" }) + field({ name: "city", label: "City / NCR Node", required: true, value: me.city, placeholder: "Ghaziabad / Noida" }) + field({ name: "pincode", label: "Pincode", required: true, type: "pin", value: me.pincode, placeholder: "201014" }) + "</div>" +
      '<div class="full" data-pinonly style="display:none">' + field({ name: "pincode2", label: "Your Pincode", type: "pin", value: me.pincode, placeholder: "201014" }) + "</div>" +
      field({ name: "notes", label: "Special Material Notes or Shade Preferences", textarea: true, placeholder: "Tell us if you prefer cooler vein undertones, high slip resistance for bathrooms, or pairing with particular wood veneers…", full: true }) + "</div>";

    function syncOpt() {
      var del = ($("[name=option]:checked", form) || {}).value === "Home Delivery";
      $$("[data-addr] input, [data-addr2] input", form).forEach(function (i) { i.disabled = !del; });
      $("[data-addr]", form).style.display = del ? "" : "none"; $("[data-addr2]", form).style.display = del ? "" : "none";
      $("[data-pinonly]", form).style.display = del ? "none" : ""; var p2 = $("[name=pincode2]", form); p2.disabled = del; p2.required = !del;
      summary();
    }
    form.addEventListener("change", function (e) { if (e.target.name === "option") syncOpt(); });
    syncOpt();
    function build(d) {
      var del = d.option === "Home Delivery";
      return W.sample({
        items: Store.samples.map(function (s) { return { p: DT.bySku(s.sku), finish: s.finish, qty: 1 }; }),
        option: d.option, name: d.name, pincode: del ? d.pincode : d.pincode2, mobile: d.mobile ? "+91 " + d.mobile : "",
        address: [d.address, d.landmark].filter(Boolean).join(", "), city: d.city, projectType: d.projectType,
        notes: [d.notes, "Estimated dispatch due: ₹" + inr(fee()) + (d.email ? " • Email: " + d.email : "")].filter(Boolean).join(" — ")
      });
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!Store.samples.length) { toast("Add at least one swatch to your box first."); pick(); return; }
      if (!validate(form)) return;
      var d = formData(form); Store.remember({ name: d.name, mobile: d.mobile, email: d.email, address: d.address, city: d.city, pincode: d.pincode || d.pincode2 });
      W.open(build(d)); toast("Opening WhatsApp with your sample request");
    });
    var pv = $("#sample-preview");
    if (pv) { var up = function () { $("pre", pv).textContent = Store.samples.length ? build(formData(form)) : "Add swatches to preview your message."; }; form.addEventListener("input", up); form.addEventListener("change", up); document.addEventListener("dts:store", up); pv.addEventListener("toggle", up); }
    render();
  };

  /* ---------- Calculator ---------- */
  Pages.calculator = function () {
    var form = $("#calc-form"), me = Store.me;
    var tiles = DT.products.filter(DT.isTile);
    var sel = $("[name=sku]", form);
    var groups = {}; tiles.forEach(function (p) { (groups[p.category] = groups[p.category] || []).push(p); });
    sel.innerHTML = Object.keys(groups).map(function (g) { return '<optgroup label="' + esc(g) + '">' + groups[g].map(function (p) { return '<option value="' + p.sku + '">' + esc(p.name) + " — " + esc(p.size) + " (₹" + p.price + "/sq.ft)</option>"; }).join("") + "</optgroup>"; }).join("");
    var sku = qs.get("sku"); sel.value = sku && DT.bySku(sku) && DT.isTile(DT.bySku(sku)) ? DT.bySku(sku).sku : (DT.bySku("DTS-FT-CGH-6012") ? "DTS-FT-CGH-6012" : sel.value);
    if (qs.get("l")) $("[name=length]", form).value = qs.get("l");
    if (qs.get("w")) $("[name=width]", form).value = qs.get("w");
    if (qs.get("area") && !qs.get("l")) { var s = Math.sqrt(+qs.get("area")); $("[name=length]", form).value = Math.round(s * 10) / 10; $("[name=width]", form).value = Math.round(s * 10) / 10; }
    if (me.name) $("[name=name]", form).value = me.name;
    var unit = "ft";
    $$("#unit-seg button").forEach(function (b) { b.addEventListener("click", function () {
      var nu = b.getAttribute("data-unit"); if (nu === unit) return;
      ["length", "width"].forEach(function (k) { var i = $("[name=" + k + "]", form), v = parseFloat(i.value); if (v > 0) i.value = Math.round((nu === "m" ? v * 0.3048 : v / 0.3048) * 100) / 100; });
      unit = nu; $$("#unit-seg button").forEach(function (x) { x.classList.toggle("on", x === b); }); $$("[data-unit-suf]").forEach(function (x) { x.textContent = unit; }); calc();
    }); });
    $$("#ptype-seg button").forEach(function (b) { b.addEventListener("click", function () { $$("#ptype-seg button").forEach(function (x) { x.classList.toggle("on", x === b); }); $("[name=projectType]", form).value = b.textContent; calc(); }); });
    $$("#waste-seg button").forEach(function (b) { b.addEventListener("click", function () { $$("#waste-seg button").forEach(function (x) { x.classList.toggle("on", x === b); }); $("[name=wastage]", form).value = b.getAttribute("data-w"); calc(); }); });

    var R = {};
    function calc() {
      var d = formData(form), p = DT.bySku(d.sku), k = unit === "m" ? 3.28084 : 1;
      var L = (parseFloat(d.length) || 0) * k, Wd = (parseFloat(d.width) || 0) * k, w = parseFloat(d.wastage) || 0;
      var area = L * Wd, req = area * (1 + w / 100), boxes = area > 0 ? Math.ceil(req / p.coverage) : 0, actual = boxes * p.coverage, total = DT.lineTotal(p, boxes).net;
      R = { projectType: d.projectType, room: d.room, length: Math.round(L * 100) / 100, width: Math.round(Wd * 100) / 100, area: Math.round(area * 100) / 100, wastage: w, required: Math.round(req * 100) / 100, product: p, boxes: boxes, actual: Math.round(actual * 100) / 100, total: total, name: d.name };
      $("#r-boxes").textContent = boxes;
      $("#r-area").textContent = num(area, 2) + " sq.ft";
      $("#r-req").textContent = num(req, 2) + " sq.ft";
      $("#r-act").textContent = num(actual, 2) + " sq.ft";
      $("#r-pcs").textContent = p.pcsPerBox ? (boxes * p.pcsPerBox) + " tiles" : "—";
      $("#r-ppb").textContent = "₹" + inr(DT.unitPrice(p));
      $("#r-total").textContent = "₹" + inr(total);
      $("#r-gst").textContent = "₹" + inr(Math.round(total * (1 + C.gstRate)));
      $("#calc-prod").innerHTML = '<div class="im"><img data-tex="' + p.sku + '" alt=""></div><div><b>' + esc(p.name) + "</b><span>" + esc(p.sku) + " • " + esc(p.size) + " • " + num(p.coverage) + " sq.ft / box" + (p.pcsPerBox ? " (" + p.pcsPerBox + " pcs)" : "") + (p.bulkPct ? " • " + DT.bulkNote(p) : "") + '</span></div><a class="link-arrow" style="margin-left:auto" href="product.html?sku=' + p.slug + '">View ' + I.arrow + "</a>";
      hydrate($("#calc-prod"));
      var pv = $("#calc-preview pre"); if (pv) pv.textContent = W.calculator(R);
    }
    form.addEventListener("input", calc); form.addEventListener("change", calc);
    calc();
    $("#calc-send").addEventListener("click", function () {
      if (!validate(form)) return;
      if (!R.boxes) { toast("Enter your room length and width first."); $("[name=length]", form).focus(); return; }
      Store.remember({ name: R.name });
      W.open(W.calculator(R)); toast("Opening WhatsApp with your calculation");
    });
    $("#calc-cart").addEventListener("click", function () {
      if (!R.boxes) { toast("Enter your room length and width first."); return; }
      Store.addCart(R.product.sku, R.boxes); toast(R.boxes + " boxes of " + esc(R.product.name) + " added", '<button type="button" data-open-cart>View cart</button>');
    });
    $("#calc-buy").addEventListener("click", function () { if (!R.boxes) { toast("Enter your room length and width first."); return; } buyNow(R.product, R.boxes); });
  };

  /* ---------- Cart page ---------- */
  Pages.cart = function () {
    var me = Store.me;
    var f = $("#cart-form");
    $("#cart-fields").innerHTML = '<div class="form-grid">' + field({ name: "name", label: "Name", required: true, value: me.name, placeholder: "Your full name", full: true }) + field({ name: "pincode", label: "Pincode", required: true, type: "pin", value: me.pincode, placeholder: "201014" }) + field({ name: "location", label: "Address / City", required: true, value: me.location, placeholder: "Indirapuram, Ghaziabad" }) + "</div>";
    function render() {
      var items = Store.cartItems(), t = Store.cartTotals();
      $("#cart-list").innerHTML = items.length ? items.map(function (i) {
        var p = i.p;
        return '<div class="citem"><a class="im" href="product.html?sku=' + p.slug + '"><img data-tex="' + p.sku + '" data-w="300" alt=""></a><div><span class="eyebrow" style="font-size:9.5px">' + esc(p.category) + '</span><h4 style="font-size:22px;margin-top:4px"><a href="product.html?sku=' + p.slug + '">' + esc(p.name) + '</a></h4><div class="m">' + esc(p.sku) + " • " + esc(p.size) + " • " + esc(p.finish) + "</div><div class=\"m num\">₹" + inr(DT.unitPrice(p)) + " per " + DT.unitLabel(p) + (DT.isTile(p) ? " • " + num(i.qty * p.coverage) + " sq.ft" : "") + '</div></div><div class="right"><div class="qty sm" data-cart-qty="' + p.sku + '"><button type="button" data-cq="-1" aria-label="Decrease">' + I.minus + '</button><input type="number" value="' + i.qty + '" min="1" aria-label="Quantity"><button type="button" data-cq="1" aria-label="Increase">' + I.plus + '</button></div><b class="num" style="font-size:16px">₹' + inr(DT.unitPrice(p) * i.qty) + '</b><button class="rm" data-remove="' + p.sku + '">Remove</button></div></div>';
      }).join("") : '<div class="cart-empty" style="background:var(--white);border:1px solid var(--line);border-radius:var(--r)"><div class="ic">' + I.bag + '</div><h4>Your cart is empty</h4><p>Explore our curated surfaces and add the ones you love.</p><a class="btn btn-dark" href="collection.html" style="margin-top:12px">Explore Surfaces ' + I.arrow + "</a></div>";
      $("#c-count").textContent = t.count + " product" + (t.count === 1 ? "" : "s") + " • " + t.qty + " units";
      $("#c-sub").textContent = "₹" + inr(t.sub); $("#c-tax").textContent = "₹" + inr(t.tax); $("#c-total").textContent = "₹" + inr(t.total);
      $("#cart-side").style.opacity = items.length ? 1 : .55;
      var pv = $("#cart-preview pre"); if (pv) pv.textContent = items.length ? W.cart(items, formData(f)) : "Add products to preview your message.";
      hydrate($("#cart-list"));
    }
    document.addEventListener("dts:store", render);
    f.addEventListener("input", render);
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!Store.cartItems().length) { toast("Your cart is empty — add a surface first."); return; }
      if (!validate(f)) return;
      var d = formData(f); Store.remember(d); W.open(W.cart(Store.cartItems(), d)); toast("Opening WhatsApp with your complete cart");
    });
    $("#cart-clear").addEventListener("click", function () { if (Store.cart.length && confirm("Remove all items from your cart?")) Store.clearCart(); });
    render();
  };

  /* ---------- Quote ---------- */
  Pages.quote = function () {
    var form = $("#quote-form"), me = Store.me, rows = $("#q-rows");
    var opts = DT.products.map(function (p) { return '<option value="' + p.sku + '">' + esc(p.name) + " — " + esc(p.size) + "</option>"; }).join("");
    function addRow(sku, qty) {
      var r = document.createElement("div"); r.className = "q-row";
      r.style.cssText = "display:grid;grid-template-columns:1fr 150px 40px;gap:10px;align-items:end;margin-bottom:10px";
      r.innerHTML = '<div class="field"><label>Product</label><select class="select" name="q_sku">' + opts + '</select></div><div class="field"><label data-ul>Quantity</label><input class="input num" name="q_qty" inputmode="numeric" value="' + (qty || "") + '" placeholder="e.g. 120"></div><button type="button" class="close-x" data-q-rm aria-label="Remove product" style="margin-bottom:5px">' + I.close + "</button>";
      rows.appendChild(r);
      var s = $("select", r); if (sku) s.value = sku;
      var lbl = function () { var p = DT.bySku(s.value); $("[data-ul]", r).textContent = "Qty (" + p.unit.toLowerCase() + ")"; }; s.addEventListener("change", lbl); lbl();
    }
    var pre = qs.get("sku") ? DT.bySku(qs.get("sku")) : null;
    if (pre) addRow(pre.sku, DT.isTile(pre) ? 50 : 1);
    else if (qs.get("from") === "cart" && Store.cart.length) Store.cartItems().forEach(function (i) { addRow(i.p.sku, i.qty); });
    else addRow();
    $("#q-add").addEventListener("click", function () { addRow(); });
    $("#q-cart").addEventListener("click", function () {
      var items = Store.cartItems(); if (!items.length) { toast("Your cart is empty."); return; }
      rows.innerHTML = ""; items.forEach(function (i) { addRow(i.p.sku, i.qty); }); toast(items.length + " cart item" + (items.length > 1 ? "s" : "") + " imported"); upd();
    });
    rows.addEventListener("click", function (e) { var b = e.target.closest("[data-q-rm]"); if (b) { if ($$(".q-row", rows).length > 1) b.closest(".q-row").remove(); else { $("[name=q_qty]", rows).value = ""; } upd(); } });
    $("#q-fields").innerHTML = '<div class="form-grid">' +
      field({ name: "name", label: "Name", required: true, value: me.name, placeholder: "Your full name" }) +
      field({ name: "mobile", label: "Mobile", required: true, type: "mobile", value: me.mobile, placeholder: "98102 34567" }) +
      field({ name: "pincode", label: "Delivery Pincode", required: true, type: "pin", value: me.pincode, placeholder: "201014" }) +
      field({ name: "company", label: "Company / Firm (optional)", placeholder: "Studio, firm or builder name" }) +
      field({ name: "gstin", label: "GSTIN (optional)", placeholder: "09ABCDE1234F1Z5", full: true }) + "</div>";
    function collect() {
      var d = formData(form);
      var items = $$(".q-row", rows).map(function (r) { var q = parseInt($("[name=q_qty]", r).value, 10); return { p: DT.bySku($("[name=q_sku]", r).value), qty: q }; }).filter(function (i) { return i.p && i.qty > 0; });
      return { projectType: d.projectType, location: d.location, area: parseFloat(d.area) || 0, items: items, extra: d.extra, name: d.name, mobile: d.mobile ? "+91 " + d.mobile : "", pincode: d.pincode, company: d.company, gstin: d.gstin };
    }
    function upd() { var pv = $("#quote-preview pre"); if (pv) pv.textContent = W.quote(collect()); }
    form.addEventListener("input", upd); form.addEventListener("change", upd);
    $$("#q-type button").forEach(function (b) { b.addEventListener("click", function () { $$("#q-type button").forEach(function (x) { x.classList.toggle("on", x === b); }); $("[name=projectType]", form).value = b.textContent; upd(); }); });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate(form)) return;
      var d = collect();
      if (!d.items.length && !(d.extra || "").trim()) { toast("Add at least one product with a quantity, or describe your requirement."); $("[name=q_qty]", rows).focus(); return; }
      Store.remember({ name: d.name, mobile: d.mobile.replace("+91 ", ""), pincode: d.pincode, location: d.location });
      W.open(W.quote(d)); toast("Opening WhatsApp with your quotation request");
    });
    upd();
  };

  /* ---------- Inspiration ---------- */
  Pages.inspiration = function () {
    var looks = [
      { space: "living", photo: "hero", title: "The Limestone Lounge", text: "Warm travertine underfoot and soft plaster walls for a calm, sunlit living room.", used: ["DTS-FT-TNV-6012", "DTS-WT-SLN-3060"] },
      { space: "bathroom", photo: "bathroom", title: "Brass & Arabescato", text: "Veined marble walls framed by muted brass — a hotel-suite bathroom at home.", used: ["DTS-BT-ARS-6012", "DTS-HW-BPT-1025"] },
      { space: "kitchen", photo: "kitchen", title: "Island of Statuario", text: "A seamless sintered slab island with quiet cement floors.", used: ["DTS-LF-STG-1632", "DTS-FT-PCM-6060"] },
      { space: "bedroom", photo: "bedroom", title: "Barefoot Oak", text: "Wood-look porcelain planks that stay cool in summer and never warp.", used: ["DTS-FT-ROV-2012"] },
      { space: "outdoor", photo: "villa", title: "Poolside Basalt", text: "R11 flamed basalt and Kota pavers around a lap pool.", used: ["DTS-FT-BAF-8080", "DTS-OD-KTA-6060"] },
      { space: "living", photo: "living2", title: "Fluted Warmth", text: "A terracotta fluted feature wall casting long evening shadows.", used: ["DTS-WT-TBF-3060", "DTS-CS-MCS-1212"] },
      { space: "bathroom", photo: "bathTub", title: "Soft Sculpture", text: "The Ovale tub on Romano travertine, lit by a single north window.", used: ["DTS-SW-OFB-1708", "DTS-FT-TRR-6012"] },
      { space: "commercial", photo: "commercial", title: "Studio Loft", text: "Heavy-traffic PEI 5 cemento floors for a creative workplace.", used: ["DTS-FT-NCM-6012"] },
      { space: "outdoor", photo: "exterior", title: "Ledgestone Facade", text: "Split-face stone strips give an entrance deep, natural shadow.", used: ["DTS-EL-SLD-2060", "DTS-EL-TBC-2306"] },
      { space: "kitchen", photo: "kitchenDark", title: "Olive Grove Kitchen", text: "Gloss olive subway against charcoal cabinetry and terrazzo.", used: ["DTS-WT-OLG-7525", "DTS-BT-TZB-6060"] },
      { space: "bathroom", photo: "bathDark", title: "Charcoal Calm", text: "A conical charcoal basin on micro-cement walls.", used: ["DTS-SW-CCB-4600", "DTS-CS-MCS-1212"] },
      { space: "living", photo: "windows", title: "Gallery of Light", text: "Polished Calacatta reflecting floor-to-ceiling glazing.", used: ["DTS-FT-MCO-6060", "DTS-FT-CVM-1224"] }
    ];
    var grid = $("#insp-grid"), cur = qs.get("space") || "all";
    function render() {
      grid.innerHTML = looks.filter(function (l) { return cur === "all" || l.space === cur; }).map(function (l) {
        return '<article class="insp reveal">' + photo(l.photo, 900, l.title) + '<div class="ib"><span class="eyebrow terra">' + esc((DT.spaces.find(function (s) { return s.id === l.space; }) || {}).name) + "</span><h3>" + esc(l.title) + "</h3><p>" + esc(l.text) + '</p><div class="used">' + l.used.map(function (s) { var p = DT.bySku(s); if (!p) return ""; return '<a href="product.html?sku=' + p.slug + '"><img data-tex="' + p.sku + '" data-w="80" alt="" style="width:20px;height:20px;border-radius:50%;object-fit:cover">' + esc(p.name) + "</a>"; }).join("") + "</div></div></article>";
      }).join("");
      $$("#insp-seg button").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-s") === cur); });
      hydrate(grid);
    }
    $("#insp-seg").innerHTML = '<button data-s="all">All Spaces</button>' + DT.spaces.map(function (s) { return '<button data-s="' + s.id + '">' + esc(s.name) + "</button>"; }).join("");
    $("#insp-seg").addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) { cur = b.getAttribute("data-s"); render(); } });
    render();
  };

  /* ---------- About / contact ---------- */
  Pages.about = function () {
    showroomStatus();
    var tb = $("#hours-table");
    if (tb) { var n = istNow(); var order = [1, 2, 3, 4, 5, 6, 0]; tb.innerHTML = order.map(function (i) { var h = C.hours[i]; return "<tr" + (i === n.day ? ' class="today"' : "") + "><td>" + h.day + (i === n.day ? " (Today)" : "") + "</td><td>" + fmt12(h.open) + " – " + fmt12(h.close) + "</td></tr>"; }).join(""); }
    var mf = $("#map-frame"); if (mf) mf.innerHTML = '<iframe src="' + C.mapEmbed + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="D.Tiles Studio location map"></iframe>';
    var f = $("#contact-form"); if (!f) return;
    var me = Store.me;
    $("#contact-fields").innerHTML = '<div class="form-grid">' +
      field({ name: "kind", label: "I would like to", select: [{ v: "general", t: "Ask a question" }, { v: "visit", t: "Plan a showroom visit" }, { v: "consultation", t: "Book a design consultation" }, { v: "trade", t: "Open a trade account" }], value: qs.get("kind") || "general", full: true }) +
      field({ name: "name", label: "Name", required: true, value: me.name, placeholder: "Your full name" }) +
      field({ name: "mobile", label: "Mobile (WhatsApp)", required: true, type: "mobile", value: me.mobile, placeholder: "98102 34567" }) +
      '<div data-k="visit consultation" class="full form-grid">' + field({ name: "date", label: "Preferred Date", inputType: "date", attrs: ' min="' + new Date().toISOString().slice(0, 10) + '"' }) + field({ name: "slot", label: "Preferred Time", select: ["10:00 AM – 12:00 PM", "12:00 PM – 2:00 PM", "2:00 PM – 4:00 PM", "4:00 PM – 6:00 PM", "6:00 PM – 8:00 PM"], placeholder: "Select a slot" }) + "</div>" +
      '<div data-k="trade" class="full">' + field({ name: "company", label: "Firm / Company", placeholder: "Studio or firm name" }) + "</div>" +
      '<div data-k="general" class="full">' + field({ name: "topic", label: "Topic", select: ["Product Availability", "Pricing & Offers", "Delivery & Installation", "Design Advice", "Order Status", "Other"], value: "Product Availability" }) + "</div>" +
      field({ name: "pincode", label: "Pincode", type: "pin", value: me.pincode, placeholder: "201014" }) +
      field({ name: "interest", label: "Interested In", select: ["Floor Tiles", "Wall Tiles", "Bathroom & Sanitaryware", "Kitchen Surfaces", "Elevation & Outdoor", "Large Format Slabs", "Complete Home"], value: "Complete Home" }) +
      field({ name: "message", label: "Message", textarea: true, placeholder: "Tell us about your space, sizes or shortlisted products…", full: true }) + "</div>";
    function sync() {
      var k = $("[name=kind]", f).value;
      $$("[data-k]", f).forEach(function (el) { var on = el.getAttribute("data-k").split(" ").indexOf(k) > -1; el.style.display = on ? "" : "none"; $$("input,select", el).forEach(function (i) { i.disabled = !on; }); });
      var sl = $("[name=slot]", f), dt = $("[name=date]", f); var need = k === "visit" || k === "consultation"; sl.required = need; dt.required = need;
      $("[name=company]", f).required = k === "trade"; $("[name=message]", f).required = k === "general";
    }
    function build() { var d = formData(f); if (d.date) d.date = new Date(d.date + "T00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }); if (d.kind === "trade") d.topic = undefined; return W.contact(d); }
    f.addEventListener("change", function (e) { if (e.target.name === "kind") sync(); });
    var pv = $("#contact-preview pre"); var up = function () { if (pv) pv.textContent = build(); };
    f.addEventListener("input", up); f.addEventListener("change", up);
    f.addEventListener("submit", function (e) { e.preventDefault(); if (!validate(f)) return; Store.remember(formData(f)); W.open(build()); toast("Opening WhatsApp…"); });
    sync(); up();
  };

  Pages.policies = function () {};

  /* ---------- Boot ---------- */
  function boot() {
    buildShell();
    bindGlobal();
    showroomStatus();
    hydrate(document);
    var pg = document.body.getAttribute("data-page");
    // Admin page manages its own data; every other page waits for the live catalogue.
    var ready = pg === "admin" ? Promise.resolve() : DT.loadCatalogue();
    ready.then(function () {
      if (pg !== "admin") Store.prune();
      var fn = Pages[pg] || (DT.pages && DT.pages[pg]);
      try { if (fn) fn(); } catch (err) { console.error(err); }
      hydrate(document);
      if (qs.get("cart") === "open") openDrawer("cart");
      if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) setTimeout(function () { t.scrollIntoView(); }, 50); }
    });
  }
  DT.ui = { esc: esc, field: field, validate: validate, formData: formData, toast: toast, modal: modal, icons: I, closeModal: function () { closeLayer($("#modal")); } };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
