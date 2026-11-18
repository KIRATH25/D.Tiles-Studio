/* ==========================================================================
   D.Tiles Studio — Admin panel (Supabase auth + products + image storage)
   Uses ONLY the publishable key. Row Level Security on the database makes
   sure only accounts listed in public.admins can change anything.
   ========================================================================== */
(function () {
  "use strict";
  var DT = window.DT;
  DT.pages = DT.pages || {};

  var MAX_BATCH = 10, UPLOAD_CONCURRENCY = 3, MAX_EDGE = 1600;
  var sb, U, I, root, rows = [], me = null;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  DT.pages.admin = function () {
    U = DT.ui; I = U.icons; root = $("#admin-root");
    if (!window.supabase || !window.supabase.createClient) { root.innerHTML = notice("Couldn’t load the admin library", "Check your internet connection and refresh the page."); return; }
    sb = window.supabase.createClient(DT.config.supabaseUrl, DT.config.supabaseKey, { auth: { persistSession: true, autoRefreshToken: true } });
    root.innerHTML = '<div class="adm-loading">Checking your session…</div>';
    sb.auth.getSession().then(function (r) { route(r.data.session); });
    sb.auth.onAuthStateChange(function (ev) { if (ev === "SIGNED_OUT") route(null); });
  };

  function esc(s) { return U.esc(s); }
  function inr(n) { return DT.wa.inr(n); }
  function rand(n) { var c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", s = ""; var a = new Uint32Array(n); crypto.getRandomValues(a); for (var i = 0; i < n; i++) s += c[a[i] % c.length]; return s; }
  function slugify(s) { return String(s).toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_-]+/g, "-").slice(0, 60) || "product"; }
  function isTileCat(c) { return DT.tileCats.indexOf(c) > -1; }
  function displayName() { return (me && me.user_metadata && (me.user_metadata.full_name || me.user_metadata.username)) || (me && me.email) || ""; }
  function notice(t, m) { return '<div class="adm-card adm-center"><h2>' + t + '</h2><p class="muted">' + m + "</p></div>"; }
  function friendly(err) {
    var m = (err && (err.message || err.error_description || err.error)) || String(err);
    if (/row-level security|permission denied|not authorized|403/i.test(m)) return "Your account doesn’t have admin rights. Add it to the admins table (see the setup guide).";
    if (/relation .* does not exist|could not find the table|schema cache/i.test(m)) return "The database isn’t set up yet. Run supabase/schema.sql in the Supabase SQL Editor.";
    if (/Invalid login credentials/i.test(m)) return "Incorrect passcode. Please try again.";
    if (/Email not confirmed/i.test(m)) return "This email isn’t confirmed yet. In Supabase → Authentication → Users, confirm the user.";
    if (/duplicate key/i.test(m)) return "A product with the same SKU already exists. Please try saving again.";
    if (/Failed to fetch|NetworkError/i.test(m)) return "Network problem — check your internet connection and try again.";
    return m;
  }

  /* ---------- Routing ---------- */
  function route(session) {
    if (!session) { me = null; return renderLogin(); }
    me = session.user;
    sb.rpc("is_admin").then(function (r) {
      if (r.error) { root.innerHTML = notice("Setup needed", esc(friendly(r.error))) + logoutBar(); bindLogout(); return; }
      if (!r.data) { root.innerHTML = notice("Not an admin account", "You’re signed in as <b>" + esc(displayName()) + "</b>, but this account hasn’t been given admin access yet.") + logoutBar(); bindLogout(); return; }
      renderDash();
    });
  }
  function logoutBar() { return '<div class="adm-center" style="margin-top:16px"><button class="btn btn-line" data-logout>Sign out</button></div>'; }
  function bindLogout() { $$("[data-logout]", root).forEach(function (b) { b.addEventListener("click", function () { sb.auth.signOut().then(function () { location.reload(); }); }); }); }

  /* ---------- Login ---------- */
  function renderLogin() {
    root.innerHTML =
      '<form class="adm-card adm-login" id="login-form" novalidate>' +
      '<span class="brand-mark" style="border:0;padding:0;font-size:56px">D.</span>' +
      '<span class="eyebrow terra" style="margin-top:18px">Studio Admin</span><h2 style="margin:8px 0 6px">Sign in</h2>' +
      '<p class="small muted" style="margin-bottom:22px">Manage products, prices, stock and images.</p>' +
      '<div class="form-grid" style="grid-template-columns:1fr">' +
      U.field({ name: "username", label: "Username", required: true, placeholder: "e.g. Vicky Sharma", attrs: ' autocomplete="username" autocapitalize="words" spellcheck="false"' }) +
      U.field({ name: "password", label: "Passcode", required: true, inputType: "password", attrs: ' autocomplete="current-password"' }) +
      '</div><p class="adm-error" id="login-err"></p>' +
      '<button class="btn btn-dark btn-block" type="submit" style="height:50px;margin-top:6px">Sign in ' + I.arrow + "</button></form>";
    var f = $("#login-form");
    f.addEventListener("submit", function (e) {
      e.preventDefault(); if (!U.validate(f)) return;
      var d = U.formData(f), btn = $("button[type=submit]", f), err = $("#login-err");
      var email = DT.config.adminUsers[d.username.toLowerCase().replace(/\s+/g, " ").trim()];
      if (!email) { err.textContent = "Unknown username. Enter your full name exactly as registered, e.g. “Vicky Sharma”."; return; }
      btn.disabled = true; btn.textContent = "Signing in…"; err.textContent = "";
      sb.auth.signInWithPassword({ email: email, password: d.password }).then(function (r) {
        if (r.error) { err.textContent = friendly(r.error); btn.disabled = false; btn.innerHTML = "Sign in " + I.arrow; return; }
        route(r.data.session); refreshHeaderPill(true);
      });
    });
  }
  function refreshHeaderPill(on) { $$(".admin-pill span").forEach(function (s) { s.textContent = on ? "Admin Panel" : "Admin Login"; }); }

  /* ---------- Dashboard ---------- */
  function renderDash() {
    root.innerHTML =
      '<div class="adm-top"><div><span class="eyebrow terra">Studio Admin</span><h1>Products</h1><p class="small muted">Signed in as ' + esc(displayName()) + "</p></div>" +
      '<div class="btn-row" style="margin:0"><a class="btn btn-line btn-sm" href="collection.html" target="_blank" rel="noopener">View live site</a><button class="btn btn-dark btn-sm" data-logout>Sign out</button></div></div>' +
      '<div class="seg adm-tabs"><button class="on" data-tab="list">All products <span id="count-badge"></span></button><button data-tab="add">' + I.plus.replace("<svg", '<svg style="width:12px;height:12px;vertical-align:-1px"') + " Add products</button></div>" +
      '<section id="tab-list"></section><section id="tab-add" hidden></section>';
    bindLogout();
    $$("[data-tab]", root).forEach(function (b) { b.addEventListener("click", function () { showTab(b.getAttribute("data-tab")); }); });
    renderAdd();
    loadList();
  }
  function showTab(t) {
    $$("[data-tab]", root).forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-tab") === t); });
    $("#tab-list").hidden = t !== "list"; $("#tab-add").hidden = t !== "add";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------- Product list ---------- */
  function loadList() {
    var box = $("#tab-list"); box.innerHTML = '<div class="adm-loading">Loading products…</div>';
    sb.from("products").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false }).then(function (r) {
      if (r.error) { box.innerHTML = notice("Couldn’t load products", esc(friendly(r.error))); return; }
      rows = r.data || [];
      DT.products = rows.map(DT.mapRow); // lets thumbnails of built-in textured products render
      renderList();
    });
  }
  function renderList() {
    var box = $("#tab-list");
    $("#count-badge").textContent = "(" + rows.length + ")";
    box.innerHTML =
      '<div class="adm-toolbar"><div class="input-group" style="flex:1;min-width:200px"><span class="pre">' + I.search.replace("<svg", '<svg style="width:14px;height:14px"') + '</span><input class="input" id="flt-q" placeholder="Search name or SKU"></div>' +
      '<select class="select" id="flt-cat" style="width:auto"><option value="">All categories</option>' + DT.categories.map(function (c) { return '<option value="' + c.id + '">' + esc(c.name) + "</option>"; }).join("") + "</select>" +
      '<select class="select" id="flt-st" style="width:auto"><option value="">All statuses</option><option value="on">Visible on site</option><option value="off">Hidden</option></select></div>' +
      '<div id="adm-rows"></div>';
    var draw = function () {
      var q = $("#flt-q").value.trim().toLowerCase(), c = $("#flt-cat").value, st = $("#flt-st").value;
      var list = rows.filter(function (r) {
        if (q && (r.name + " " + r.sku).toLowerCase().indexOf(q) < 0) return false;
        if (c && r.category !== c) return false;
        if (st === "on" && !r.is_active) return false;
        if (st === "off" && r.is_active) return false;
        return true;
      });
      $("#adm-rows").innerHTML = list.length ? list.map(rowHtml).join("") : '<div class="empty"><h3>No products found</h3><p>Try another search, or add new products.</p></div>';
      DT.tex.hydrate($("#adm-rows"));
    };
    ["#flt-q", "#flt-cat", "#flt-st"].forEach(function (s) { $(s).addEventListener("input", draw); });
    $("#adm-rows").addEventListener("click", onRowClick);
    $("#adm-rows").addEventListener("change", onRowChange);
    draw();
  }
  function rowHtml(r) {
    var p = DT.mapRow(r), cat = DT.catById(r.category) || { name: r.category };
    var thumb = r.image1_url ? '<img src="' + esc(r.image1_url) + '" alt="" loading="lazy">' : '<img data-tex="' + esc(r.sku) + '" alt="">';
    return '<div class="adm-row' + (r.is_active ? "" : " off") + '" data-id="' + r.id + '">' +
      '<div class="adm-thumb">' + thumb + "</div>" +
      '<div class="adm-main"><b>' + esc(r.name) + "</b><span>" + esc(r.sku) + " • " + esc(cat.name) + " • " + esc(r.size) + (r.colours_available > 1 ? " • " + r.colours_available + " colours" : "") + "</span></div>" +
      '<div class="adm-cell"><b class="num">₹' + inr(r.price) + "</b><span>" + DT.priceSuffix(p) + "</span></div>" +
      '<div class="adm-cell"><b class="num">' + r.stock_qty + "</b><span>in stock</span></div>" +
      '<div class="adm-cell">' + (r.bulk_discount_pct ? '<b class="num" style="color:var(--ok)">' + (+r.bulk_discount_pct) + "% off</b><span>on " + r.bulk_min_qty + "+</span>" : '<span class="muted">No bulk offer</span>') + "</div>" +
      '<label class="adm-switch" title="Show on website"><input type="checkbox" data-toggle' + (r.is_active ? " checked" : "") + '><i></i><span>' + (r.is_active ? "Visible" : "Hidden") + "</span></label>" +
      '<div class="adm-actions"><a class="btn btn-line btn-sm" href="product.html?sku=' + encodeURIComponent(r.slug) + '" target="_blank" rel="noopener" title="View on site">View</a><button class="btn btn-dark btn-sm" data-edit>Edit</button><button class="btn btn-sm adm-del" data-del aria-label="Delete">' + I.close + "</button></div></div>";
  }
  function rowById(id) { return rows.find(function (r) { return r.id === id; }); }
  function onRowClick(e) {
    var el = e.target.closest("[data-edit],[data-del]"); if (!el) return;
    var r = rowById(el.closest(".adm-row").getAttribute("data-id"));
    if (el.hasAttribute("data-edit")) return openEdit(r);
    if (!confirm("Delete “" + r.name + "” permanently? It will disappear from the website, carts and searches.")) return;
    el.disabled = true;
    sb.from("products").delete().eq("id", r.id).then(function (res) {
      if (res.error) { U.toast(esc(friendly(res.error))); el.disabled = false; return; }
      removeStored([r.image1_url, r.image2_url]);
      rows = rows.filter(function (x) { return x.id !== r.id; }); renderList(); U.toast("Deleted " + esc(r.name));
    });
  }
  function onRowChange(e) {
    if (!e.target.hasAttribute("data-toggle")) return;
    var cb = e.target, rowEl = cb.closest(".adm-row"), r = rowById(rowEl.getAttribute("data-id")), on = cb.checked;
    cb.disabled = true;
    sb.from("products").update({ is_active: on }).eq("id", r.id).then(function (res) {
      cb.disabled = false;
      if (res.error) { cb.checked = !on; U.toast(esc(friendly(res.error))); return; }
      r.is_active = on; rowEl.classList.toggle("off", !on); $("span", cb.parentNode).textContent = on ? "Visible" : "Hidden";
      U.toast(on ? esc(r.name) + " is now visible on the website" : esc(r.name) + " is hidden from the website");
    });
  }

  /* ---------- Product form card (shared by Add and Edit) ---------- */
  function cardHtml(n, d, edit) {
    d = d || {};
    var cat = d.category || "floor-tiles";
    var catOpts = DT.categories.map(function (c) { return { v: c.id, t: c.name }; });
    return '<div class="ap-card" data-card>' +
      (edit ? "" : '<div class="ap-head"><b>Product <span data-n>' + n + '</span></b><div class="ap-tools"><button type="button" class="link-arrow" data-dup>Duplicate</button><button type="button" class="link-arrow" data-rm style="color:#B5553F">Remove</button></div></div>') +
      '<div class="form-grid three">' +
      '<div class="field" style="grid-column:span 2">' + inner(U.field({ name: "name", label: "Product name", required: true, value: d.name, placeholder: "e.g. Statuario Gold Polished" })) + "</div>" +
      U.field({ name: "category", label: "Category", required: true, select: catOpts, value: cat }) +
      U.field({ name: "size", label: "Size", required: true, value: d.size, placeholder: "e.g. 600×1200mm" }) +
      U.field({ name: "price", label: "Price (₹ per sq.ft)", required: true, type: "number", value: d.price, placeholder: "e.g. 165" }) +
      '<div class="field"><label>Sold in</label><select class="select" name="unit"></select></div>' +
      '<div class="field" data-tile>' + inner(U.field({ name: "coverage", label: "Coverage per box (sq.ft)", type: "number", value: d.coverage, placeholder: "e.g. 15.5" })) + "</div>" +
      '<div class="field" data-tile>' + inner(U.field({ name: "pcs_per_box", label: "Pieces per box", inputType: "number", value: d.pcs_per_box, placeholder: "e.g. 2", attrs: ' min="1" step="1"' })) + "</div>" +
      U.field({ name: "stock_qty", label: "Stock available", inputType: "number", value: d.stock_qty != null ? d.stock_qty : "", placeholder: "e.g. 120", attrs: ' min="0" step="1"' }) +
      U.field({ name: "colours_available", label: "Available in how many colours", inputType: "number", value: d.colours_available || 1, attrs: ' min="1" max="99" step="1"' }) +
      '<div class="field" style="grid-column:span 2"><label>Bulk discount (optional)</label><div class="bulk-row"><div class="input-group has-suf"><input class="input num" name="bulk_discount_pct" inputmode="decimal" placeholder="e.g. 8" value="' + esc(d.bulk_discount_pct || "") + '"><span class="suf">% off</span></div><span class="muted small">on orders of</span><div class="input-group has-suf"><input class="input num" name="bulk_min_qty" inputmode="numeric" placeholder="e.g. 50" value="' + esc(d.bulk_min_qty || "") + '"><span class="suf" data-unit-word>boxes</span></div><span class="muted small">or more</span></div><span class="err" data-bulk-err>Fill both the discount % (1–80) and the minimum quantity (2 or more), or leave both empty.</span></div>' +
      "</div>" +
      '<div class="ap-images">' + imgSlot(1, d.image1_url, !edit) + imgSlot(2, d.image2_url, false) + "</div>" +
      '<details class="ap-more"' + (d.finish || d.material || d.description ? " open" : "") + '><summary>More details (optional)</summary><div class="form-grid three" style="margin-top:14px">' +
      U.field({ name: "finish", label: "Finish", value: d.finish, placeholder: "e.g. Polished, Matte" }) +
      U.field({ name: "material", label: "Material", value: d.material, placeholder: "e.g. Glazed Vitrified" }) +
      U.field({ name: "brand", label: "Brand", value: d.brand || "", placeholder: "e.g. Somany, Hindware" }) +
      U.field({ name: "description", label: "Short description", textarea: true, value: d.description, placeholder: "One or two lines shown on the product card", full: true, attrs: ' maxlength="400"' }) +
      "</div></details></div>";
  }
  function inner(fieldHtml) { return fieldHtml.replace(/^<div class="field[^"]*">/, "").replace(/<\/div>$/, ""); }
  function imgSlot(i, url, required) {
    return '<label class="img-slot" data-slot="' + i + '"><input type="file" accept="image/jpeg,image/png,image/webp" name="image' + i + '"' + (required ? " required" : "") + ">" +
      '<span class="img-prev">' + (url ? '<img src="' + esc(url) + '" alt="">' : "") + "</span>" +
      '<span class="img-txt"><b>Image ' + i + (i === 1 ? ' <span class="req">*</span>' : " (optional)") + "</b><small>" + (url ? "Tap to replace" : "JPG, PNG or WebP • auto-optimised") + "</small></span>" +
      (i === 2 && url ? '<button type="button" class="img-clear" data-clear-img aria-label="Remove image 2">' + I.close + "</button>" : "") +
      '<span class="err">Image 1 is required.</span></label>';
  }
  function bindCard(card, d) {
    card._files = [null, null]; card._clear2 = false;
    var catSel = $("[name=category]", card), unitSel = $("[name=unit]", card);
    function sync() {
      var c = catSel.value, tile = isTileCat(c), keep = unitSel.value;
      unitSel.innerHTML = tile ? '<option value="Boxes">Boxes</option>' : '<option value="Pieces">Pieces</option><option value="Sets">Sets</option>';
      unitSel.disabled = tile;
      if (!tile && (keep === "Pieces" || keep === "Sets")) unitSel.value = keep;
      else if (!tile && d && (d.unit === "Pieces" || d.unit === "Sets")) unitSel.value = d.unit;
      $$("[data-tile]", card).forEach(function (el) { el.style.display = tile ? "" : "none"; $$("input", el).forEach(function (i) { i.disabled = !tile; }); });
      var cov = $("[name=coverage]", card); cov.required = tile;
      var lab = $("[name=price]", card).closest(".field").querySelector("label");
      lab.innerHTML = (tile ? "Price (₹ per sq.ft)" : "Price (₹ per " + (unitSel.value === "Sets" ? "set" : "piece") + ")") + ' <span class="req">*</span>';
      $("[data-unit-word]", card).textContent = tile ? "boxes" : unitSel.value === "Sets" ? "sets" : "pieces";
    }
    catSel.addEventListener("change", sync); unitSel.addEventListener("change", sync); sync();
    $$(".img-slot input", card).forEach(function (inp) {
      inp.addEventListener("change", function () {
        var f = inp.files && inp.files[0], slot = inp.closest(".img-slot"), i = +slot.getAttribute("data-slot") - 1;
        if (!f) return;
        if (!/^image\/(jpeg|png|webp)$/.test(f.type)) { U.toast("Please choose a JPG, PNG or WebP image (iPhone HEIC photos: export as JPG first)."); inp.value = ""; return; }
        if (f.size > 25 * 1024 * 1024) { U.toast("That image is over 25 MB — please choose a smaller photo."); inp.value = ""; return; }
        card._files[i] = f; if (i === 1) card._clear2 = false;
        $(".img-prev", slot).innerHTML = '<img src="' + URL.createObjectURL(f) + '" alt="">';
        $(".img-txt small", slot).textContent = f.name;
        slot.classList.remove("invalid");
      });
    });
    var clr = $("[data-clear-img]", card);
    if (clr) clr.addEventListener("click", function (e) { e.preventDefault(); card._clear2 = true; card._files[1] = null; var s = clr.closest(".img-slot"); $(".img-prev", s).innerHTML = ""; $(".img-txt small", s).textContent = "Will be removed on save"; clr.remove(); });
  }
  function readCard(card, existing) {
    var g = function (n) { var el = $("[name=" + n + "]", card); return el && !el.disabled ? el.value.trim() : ""; };
    var cat = g("category"), tile = isTileCat(cat);
    var pct = g("bulk_discount_pct"), min = g("bulk_min_qty");
    var ok = U.validate(card);
    var bulkBad = (pct === "") !== (min === "") || (pct !== "" && !(+pct > 0 && +pct <= 80)) || (min !== "" && !(parseInt(min, 10) >= 2));
    var bf = $("[data-bulk-err]", card).closest(".field"); bf.classList.toggle("has-err", bulkBad);
    var needImg = !existing && !card._files[0];
    var slot1 = $('.img-slot[data-slot="1"]', card); slot1.classList.toggle("invalid", needImg);
    if (!ok || bulkBad || needImg) { if (ok && (bulkBad || needImg)) card.scrollIntoView({ behavior: "smooth", block: "center" }); return null; }
    var unit = tile ? "Boxes" : ($("[name=unit]", card).value || "Pieces");
    return {
      name: g("name"), category: cat, size: g("size"), price: Math.round(parseFloat(g("price")) * 100) / 100, unit: unit,
      coverage: tile ? Math.round(parseFloat(g("coverage")) * 100) / 100 : null,
      pcs_per_box: tile && g("pcs_per_box") ? parseInt(g("pcs_per_box"), 10) : null,
      stock_qty: Math.max(0, parseInt(g("stock_qty"), 10) || 0),
      colours_available: Math.min(99, Math.max(1, parseInt(g("colours_available"), 10) || 1)),
      bulk_discount_pct: pct ? Math.round(parseFloat(pct) * 100) / 100 : null, bulk_min_qty: min ? parseInt(min, 10) : null,
      finish: g("finish") || null, material: g("material") || null, brand: g("brand") || "D.Tiles Studio", description: g("description") || null
    };
  }

  /* ---------- Add products (batch of up to 10) ---------- */
  function renderAdd() {
    var box = $("#tab-add");
    box.innerHTML =
      '<form id="batch-form" novalidate><p class="small muted" style="margin:0 0 16px">Add up to ' + MAX_BATCH + " products at once — same or different categories. Fields marked * are required. Images are resized and compressed automatically before upload.</p>" +
      '<div id="cards"></div>' +
      '<div class="ap-foot"><button type="button" class="btn btn-line" id="add-card">' + I.plus + ' Add another product</button><span class="small muted" id="card-count"></span>' +
      '<button type="submit" class="btn btn-dark" id="save-all" style="margin-left:auto;height:50px">Save all products ' + I.arrow + "</button></div>" +
      '<div class="ap-progress" id="progress" hidden><div class="bar"><i></i></div><span></span></div></form>';
    addCard();
    $("#add-card").addEventListener("click", function () { addCard(); });
    $("#cards").addEventListener("click", function (e) {
      var card = e.target.closest("[data-card]"); if (!card) return;
      if (e.target.closest("[data-rm]")) { if ($$("[data-card]", $("#cards")).length > 1) { card.remove(); renumber(); } else U.toast("At least one product card is needed."); }
      if (e.target.closest("[data-dup]")) duplicate(card);
    });
    $("#batch-form").addEventListener("submit", function (e) { e.preventDefault(); saveBatch(); });
  }
  function addCard(data, files) {
    var wrap = $("#cards"), n = $$("[data-card]", wrap).length;
    if (n >= MAX_BATCH) { U.toast("You can add up to " + MAX_BATCH + " products per batch. Save these first, then add more."); return null; }
    var tmp = document.createElement("div"); tmp.innerHTML = cardHtml(n + 1, data, false);
    var card = tmp.firstChild; wrap.appendChild(card); bindCard(card, data);
    if (files) { card._files = files.slice(); files.forEach(function (f, i) { if (f) { var s = $('.img-slot[data-slot="' + (i + 1) + '"]', card); $(".img-prev", s).innerHTML = '<img src="' + URL.createObjectURL(f) + '" alt="">'; $(".img-txt small", s).textContent = f.name; } }); }
    renumber();
    if (n > 0) card.scrollIntoView({ behavior: "smooth", block: "start" });
    return card;
  }
  function duplicate(card) {
    var d = {}; $$("input[name], select[name], textarea[name]", card).forEach(function (el) { if (el.type !== "file") d[el.name] = el.value; });
    d.name = d.name ? d.name + " (copy)" : "";
    addCard(d, card._files);
  }
  function renumber() {
    var cards = $$("[data-card]", $("#cards"));
    cards.forEach(function (c, i) { $("[data-n]", c).textContent = i + 1; });
    $("#card-count").textContent = cards.length + " of " + MAX_BATCH + " in this batch";
    $("#add-card").disabled = cards.length >= MAX_BATCH;
    $("#save-all").innerHTML = "Save " + (cards.length > 1 ? "all " + cards.length + " products" : "product") + " " + I.arrow;
  }

  /* ---------- Images ---------- */
  function compress(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file), img = new Image();
      img.onload = function () {
        var w = img.naturalWidth, h = img.naturalHeight, s = Math.min(1, MAX_EDGE / Math.max(w, h));
        w = Math.round(w * s); h = Math.round(h * s);
        var c = document.createElement("canvas"); c.width = w; c.height = h;
        var ctx = c.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h); ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        c.toBlob(function (b) {
          if (b && b.type === "image/webp") return resolve(b);
          c.toBlob(function (j) { j ? resolve(j) : reject(new Error("Couldn’t process " + file.name)); }, "image/jpeg", 0.85);
        }, "image/webp", 0.82);
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error(file.name + " isn’t a readable image.")); };
      img.src = url;
    });
  }
  function upload(file) {
    return compress(file).then(function (blob) {
      var ext = blob.type === "image/webp" ? "webp" : "jpg";
      var path = "products/" + Date.now().toString(36) + "-" + rand(10).toLowerCase() + "." + ext;
      return sb.storage.from(DT.config.imageBucket).upload(path, blob, { contentType: blob.type, cacheControl: "31536000", upsert: false }).then(function (r) {
        if (r.error) throw r.error;
        return { path: path, url: sb.storage.from(DT.config.imageBucket).getPublicUrl(path).data.publicUrl };
      });
    });
  }
  function storedPath(url) {
    var marker = "/storage/v1/object/public/" + DT.config.imageBucket + "/";
    return url && url.indexOf(marker) > -1 ? decodeURIComponent(url.split(marker)[1].split("?")[0]) : null;
  }
  function removeStored(urls) {
    var paths = urls.map(storedPath).filter(Boolean);
    if (paths.length) sb.storage.from(DT.config.imageBucket).remove(paths);
  }
  // Run async tasks with a concurrency limit so 10 products × 2 images never flood the connection.
  function pool(tasks, limit) {
    var i = 0, active = 0, results = new Array(tasks.length);
    return new Promise(function (resolve, reject) {
      var failed = false;
      function next() {
        if (failed) return;
        if (i >= tasks.length && active === 0) return resolve(results);
        while (active < limit && i < tasks.length) {
          (function (k) {
            active++;
            tasks[k]().then(function (v) { results[k] = v; active--; next(); }, function (e) { failed = true; reject(e); });
          })(i++);
        }
      }
      next();
    });
  }

  /* ---------- Save batch ---------- */
  function saveBatch() {
    var cards = $$("[data-card]", $("#cards")), data = [], bad = false;
    cards.forEach(function (c) { var d = readCard(c, false); if (!d) bad = true; data.push(d); });
    if (bad) { U.toast("Please complete the highlighted fields."); return; }

    var btn = $("#save-all"), prog = $("#progress"), add = $("#add-card");
    var tasks = [], uploaded = [], total = 0, done = 0;
    cards.forEach(function (c, i) {
      c._files.forEach(function (f, j) {
        if (!f) return; total++;
        tasks.push(function () { return upload(f).then(function (r) { uploaded.push(r.path); data[i]["image" + (j + 1) + "_url"] = r.url; done++; setProg(done / (total + 1), "Uploading images " + done + " / " + total + "…"); }); });
      });
    });
    btn.disabled = true; add.disabled = true; prog.hidden = false; setProg(0.02, "Preparing images…");

    pool(tasks, UPLOAD_CONCURRENCY).then(function () {
      setProg(total / (total + 1), "Publishing products…");
      var payload = data.map(function (d) {
        d.sku = "DTS-" + (DT.catCode[d.category] || "XX") + "-" + rand(6);
        d.slug = slugify(d.name) + "-" + rand(4).toLowerCase();
        d.sort_order = 0; d.is_active = true;
        return d;
      });
      return sb.from("products").insert(payload).select("*").then(function (r) { if (r.error) throw r.error; return r.data; });
    }).then(function (inserted) {
      setProg(1, "Done!");
      U.toast(inserted.length + " product" + (inserted.length > 1 ? "s" : "") + " published — live on the website now.");
      rows = inserted.concat(rows);
      setTimeout(function () { renderAdd(); showTab("list"); renderList(); DT.products = rows.map(DT.mapRow); }, 600);
    }).catch(function (err) {
      if (uploaded.length) sb.storage.from(DT.config.imageBucket).remove(uploaded);
      prog.hidden = true; btn.disabled = false; add.disabled = $$("[data-card]", $("#cards")).length >= MAX_BATCH;
      U.toast(esc(friendly(err)));
    });

    function setProg(f, t) { $(".bar i", prog).style.width = Math.round(f * 100) + "%"; $("span", prog).textContent = t; }
  }

  /* ---------- Edit ---------- */
  function openEdit(r) {
    var form = U.modal({
      eyebrow: "Edit product • " + esc(r.sku), title: esc(r.name), body: cardHtml(1, r, true),
      submit: "Save changes", submitClass: "btn-dark", submitIcon: false,
      onOpen: function (f) { var card = $("[data-card]", f); bindCard(card, r); f.closest(".box").style.width = "min(860px, 100%)"; },
      onSubmit: function (d, f) {
        var card = $("[data-card]", f), upd = readCard(card, true);
        if (!upd) return false;
        var btn = $("button[type=submit]", f); btn.disabled = true; btn.textContent = "Saving…";
        var olds = [], jobs = [];
        [0, 1].forEach(function (j) {
          var file = card._files[j];
          if (file) jobs.push(function () { return upload(file).then(function (res) { upd["image" + (j + 1) + "_url"] = res.url; if (r["image" + (j + 1) + "_url"]) olds.push(r["image" + (j + 1) + "_url"]); }); });
        });
        if (card._clear2 && r.image2_url) { upd.image2_url = null; olds.push(r.image2_url); }
        if (r.flag && upd.bulk_discount_pct == null && /^Bulk /.test(r.flag)) upd.flag = null;
        pool(jobs, 2).then(function () {
          return sb.from("products").update(upd).eq("id", r.id).select("*").single();
        }).then(function (res) {
          if (res.error) throw res.error;
          removeStored(olds);
          var k = rows.findIndex(function (x) { return x.id === r.id; }); rows[k] = res.data; DT.products = rows.map(DT.mapRow);
          U.closeModal(); renderList(); U.toast("Saved — the website is updated.");
        }).catch(function (err) { btn.disabled = false; btn.textContent = "Save changes"; U.toast(esc(friendly(err))); });
        return false;
      }
    });
    return form;
  }
})();
