/* ==========================================================================
   D.Tiles Studio — WhatsApp enquiry messages
   Every button on the site builds its message here from real product and
   calculator data, then opens wa.me with the text pre-filled.
   *text* renders as bold inside WhatsApp.
   ========================================================================== */
(function () {
  var DT = window.DT;

  function inr(n) { return (Math.round(n * 100) / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 }); }
  function num(n, d) { return (+n).toLocaleString("en-IN", { maximumFractionDigits: d === undefined ? 2 : d }); }
  function v(x, fallback) { return (x === undefined || x === null || String(x).trim() === "") ? (fallback || "Not specified") : String(x).trim(); }
  function H(t) { return "*" + t + "*"; }

  function ref(code) {
    var d = new Date(), chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", s = "";
    for (var i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
    var ymd = String(d.getFullYear()).slice(2) + ("0" + (d.getMonth() + 1)).slice(-2) + ("0" + d.getDate()).slice(-2);
    return "DTS-" + code + "-" + ymd + "-" + s;
  }
  function stamp(code) {
    var d = new Date();
    var when = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) + ", " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    return "\n\n———————————\nEnquiry Ref: " + ref(code) + "\nSent: " + when + " via dtilesstudio website";
  }
  function qtyText(p, q) { return q + " " + DT.unitLabel(p, q); }

  /* 1. Tile quantity calculator ---------------------------------------- */
  function calculator(d) {
    var p = d.product, lt = DT.lineTotal(p, d.boxes);
    var price = ["• Price per Box: ₹" + inr(DT.unitPrice(p))];
    if (lt.pct) price.push("• Bulk Discount: " + lt.pct + "% on " + p.bulkMin + "+ boxes (−₹" + inr(lt.disc) + ")");
    price.push("• Estimated Product Total: ₹" + inr(lt.net));
    return [
      "Hello D.Tiles Studio Team!",
      "",
      "I have used your Tile Quantity Calculator and would like to enquire about the following requirement.",
      "",
      H("PROJECT DETAILS"),
      "• Project Type: " + v(d.projectType),
      "• Room / Area: " + v(d.room),
      "• Length: " + num(d.length) + " ft",
      "• Width: " + num(d.width) + " ft",
      "• Total Area: " + num(d.area) + " sq. ft.",
      "• Additional Wastage: " + num(d.wastage, 0) + "%",
      "• Total Required Coverage: " + num(d.required) + " sq. ft.",
      "",
      H("TILE REQUIREMENTS"),
      "• Selected Product: " + p.name,
      "• Product SKU: " + p.sku,
      "• Tile Size: " + p.size,
      "• Coverage per Box: " + num(p.coverage) + " sq. ft.",
      "• Required Quantity: " + d.boxes + " boxes",
      "• Total Actual Coverage: " + num(d.actual) + " sq. ft.",
      "",
      H("PRICE DETAILS")
    ].concat(price, [
      "",
      "I would appreciate your assistance with:",
      "1. Confirming product availability.",
      "2. Confirming the final quantity required.",
      "3. Providing the best available quotation.",
      "4. Delivery charges and estimated delivery time.",
      "Please help me proceed with this requirement.",
      "",
      "Thank you!",
      v(d.name, "D.Tiles Studio Customer")
    ]).join("\n") + stamp("CAL");
  }

  /* 2. Buy Now — single product ----------------------------------------- */
  function buyNow(p, d) {
    var q = d.qty, unitP = DT.unitPrice(p), lt = DT.lineTotal(p, q);
    var sub = lt.pct
      ? ["• Bulk Discount: " + lt.pct + "% on " + p.bulkMin + "+ " + p.unit.toLowerCase() + " (−₹" + inr(lt.disc) + ")", "• Estimated Subtotal: ₹" + inr(lt.net)]
      : ["• Estimated Subtotal: ₹" + inr(lt.net)];
    return [
      "Hello D.Tiles Studio Team!",
      "",
      "I am interested in purchasing the following product from your website.",
      "",
      H("PRODUCT DETAILS"),
      "• Product Name: " + p.name,
      "• Product SKU: " + p.sku,
      "• Brand: " + p.brand,
      "• Category: " + p.category,
      "• Size: " + p.size,
      "• Material: " + p.material,
      "• Finish: " + p.finish,
      "• Colour: " + p.colour,
      "",
      H("ORDER REQUIREMENTS"),
      "• Quantity: " + q + (DT.isTile(p) ? " (covers " + num(q * p.coverage) + " sq. ft.)" : ""),
      "• Unit: " + p.unit,
      "• Price per Unit: ₹" + inr(unitP) + (DT.isTile(p) ? " (₹" + inr(p.price) + " / sq. ft.)" : ""),
    ].concat(sub, [
      "",
      H("DELIVERY DETAILS"),
      "• Customer Name: " + v(d.name),
      "• Delivery Pincode: " + v(d.pincode),
      "• Delivery Location: " + v(d.location),
      "",
      "Please confirm:",
      "1. Product availability.",
      "2. Final payable amount, including applicable taxes.",
      "3. Delivery charges and estimated delivery date.",
      "4. Available payment options.",
      "I would like to proceed with the purchase once everything is confirmed.",
      "",
      "Thank you!",
      "D.Tiles Studio Customer"
    ]).join("\n") + stamp("BUY");
  }

  /* 3. Shopping cart ------------------------------------------------------ */
  function cart(items, d) {
    var lines = [
      "Hello D.Tiles Studio Team!",
      "",
      "I have selected multiple products from your website and would like to place an order.",
      "",
      H("MY SHOPPING LIST")
    ];
    var sub = 0, qty = 0, saved = 0;
    items.forEach(function (it, i) {
      var p = it.p, lt = DT.lineTotal(p, it.qty); sub += lt.net; qty += it.qty; saved += lt.disc;
      lines.push("", H("[PRODUCT " + (i + 1) + "]"),
        "• Name: " + p.name,
        "• SKU: " + p.sku,
        "• Size / Finish: " + p.size + " / " + p.finish,
        "• Quantity: " + qtyText(p, it.qty) + (DT.isTile(p) ? " (" + num(it.qty * p.coverage) + " sq. ft.)" : ""),
        "• Price: ₹" + inr(lt.net) + " (₹" + inr(lt.unit) + " per " + DT.unitLabel(p) + (lt.pct ? ", " + lt.pct + "% bulk discount applied" : "") + ")");
    });
    var tax = Math.round(sub * DT.config.gstRate);
    lines.push("",
      H("ORDER SUMMARY"),
      "• Total Products: " + items.length,
      "• Total Quantity: " + qty + " units",
      "• Estimated Subtotal: ₹" + inr(sub) + (saved ? " (bulk savings ₹" + inr(saved) + ")" : ""),
      "• Estimated Taxes: ₹" + inr(tax) + " (GST @ " + Math.round(DT.config.gstRate * 100) + "%)",
      "• Estimated Total: ₹" + inr(sub + tax),
      "",
      H("DELIVERY INFORMATION"),
      "• Name: " + v(d.name),
      "• Pincode: " + v(d.pincode),
      "• Location: " + v(d.location),
      "",
      "Please verify the availability of all selected products and share the final quotation, including applicable taxes and delivery charges.",
      "",
      "I would like to proceed with this order.",
      "",
      "Thank you!",
      v(d.name, ""));
    return lines.join("\n").replace(/\n$/, "") + stamp("CRT");
  }

  /* 4. Bulk / wholesale quotation ---------------------------------------- */
  function quote(d) {
    var lines = [
      "Hello D.Tiles Studio Team!",
      "",
      "I would like to request a quotation for a bulk purchase.",
      "",
      H("PROJECT INFORMATION"),
      "• Project Type: " + v(d.projectType),
      "• Project Location: " + v(d.location),
      "• Approximate Area: " + (d.area ? num(d.area) : "Not specified") + " sq. ft.",
      "",
      H("REQUIRED PRODUCTS")
    ];
    if (d.items && d.items.length) {
      d.items.forEach(function (it, i) {
        var p = it.p;
        lines.push((i ? "\n" : "") + (i + 1) + ". " + p.name + " — " + p.sku,
          "   " + p.size + " / " + p.finish,
          "   Required Quantity: " + qtyText(p, it.qty) + (DT.isTile(p) ? " (≈ " + num(it.qty * p.coverage) + " sq. ft.)" : ""));
      });
    } else {
      lines.push("To be discussed with the studio team.");
    }
    if (d.extra && d.extra.trim()) lines.push("", "Additional Products / Notes:", d.extra.trim());
    lines.push("",
      H("MY REQUIREMENTS"),
      "• Best available bulk pricing.",
      "• Product availability and quantity confirmation.",
      "• GST invoice." + (d.gstin ? " (GSTIN: " + d.gstin + ")" : ""),
      "• Delivery charges.",
      "• Expected delivery timeline.",
      "• Any applicable bulk purchase discounts.",
      "",
      H("CONTACT DETAILS"),
      "• Name: " + v(d.name),
      "• Mobile: " + v(d.mobile),
      "• Delivery Pincode: " + v(d.pincode));
    if (d.company) lines.push("• Company / Firm: " + d.company);
    lines.push("",
      "Please share your best quotation.",
      "",
      "Thank you,",
      v(d.name, ""));
    return lines.join("\n") + stamp("BLK");
  }

  /* 5. Sample request ----------------------------------------------------- */
  function sample(d) {
    var lines = [
      "Hello D.Tiles Studio Team!",
      "",
      d.items.length > 1
        ? "I came across these products on your website and would like to request physical samples."
        : "I came across this product on your website and would like to request a physical sample.",
      ""
    ];
    d.items.forEach(function (it, i) {
      var p = it.p;
      lines.push(H(d.items.length > 1 ? "PRODUCT DETAILS — SAMPLE " + (i + 1) : "PRODUCT DETAILS"),
        "• Product Name: " + p.name,
        "• SKU: " + p.sku,
        "• Size: " + p.size,
        "• Finish: " + (it.finish || p.finish),
        "• Colour: " + p.colour,
        "");
    });
    var total = d.items.reduce(function (s, it) { return s + (it.qty || 1); }, 0);
    lines.push(H("REQUEST DETAILS"),
      "• Sample Quantity: " + total + (total > 1 ? " swatches" : " swatch") + " (one per product)",
      "• Preferred Option: " + v(d.option),
      "• Name: " + v(d.name),
      "• Pincode: " + v(d.pincode));
    if (d.mobile) lines.push("• Mobile: " + d.mobile);
    if (d.option === "Home Delivery" && d.address) lines.push("• Delivery Address: " + d.address + (d.city ? ", " + d.city : ""));
    if (d.projectType) lines.push("• Project Type: " + d.projectType);
    if (d.notes && d.notes.trim()) lines.push("• Notes: " + d.notes.trim());
    lines.push("",
      "Please let me know about sample availability, applicable charges and collection or delivery arrangements.",
      "",
      "Thank you!",
      v(d.name, ""));
    return lines.join("\n") + stamp("SMP");
  }

  /* 6. Contact studio / visit booking / consultation ---------------------- */
  function contact(d) {
    var intro = {
      general: "I would like to get in touch with your studio regarding the following.",
      visit: "I would like to plan a visit to your Indirapuram showroom.",
      consultation: "I would like to book a personal design consultation with your studio.",
      trade: "I am an architect / designer / contractor and would like to open a trade account with your studio."
    }[d.kind || "general"];
    var title = { general: "MY ENQUIRY", visit: "SHOWROOM VISIT REQUEST", consultation: "CONSULTATION REQUEST", trade: "TRADE ACCOUNT REQUEST" }[d.kind || "general"];
    var lines = ["Hello D.Tiles Studio Team!", "", intro, "", H(title)];
    if (d.topic) lines.push("• Topic: " + d.topic);
    if (d.date) lines.push("• Preferred Date: " + d.date);
    if (d.slot) lines.push("• Preferred Time: " + d.slot);
    if (d.guests) lines.push("• Visitors: " + d.guests);
    if (d.interest) lines.push("• Interested In: " + d.interest);
    if (d.projectType) lines.push("• Project Type: " + d.projectType);
    if (d.company) lines.push("• Firm / Company: " + d.company);
    if (d.product) lines.push("• Product: " + d.product.name + " (" + d.product.sku + ")");
    if (d.message && d.message.trim()) lines.push("• Message: " + d.message.trim());
    lines.push("", H("CONTACT DETAILS"), "• Name: " + v(d.name), "• Mobile: " + v(d.mobile));
    if (d.pincode) lines.push("• Pincode: " + d.pincode);
    lines.push("", d.kind === "visit" ? "Please confirm my visit slot." : "Please get back to me at your earliest convenience.", "", "Thank you!", v(d.name, ""));
    var code = { general: "GEN", visit: "VST", consultation: "CNS", trade: "TRD" }[d.kind || "general"];
    return lines.join("\n") + stamp(code);
  }

  function open(message) {
    var url = "https://wa.me/" + DT.config.whatsapp + "?text=" + encodeURIComponent(message);
    var w = window.open(url, "_blank", "noopener");
    if (!w) window.location.href = url;
    return url;
  }

  DT.wa = { calculator: calculator, buyNow: buyNow, cart: cart, quote: quote, sample: sample, contact: contact, open: open, inr: inr, num: num,
    link: function (msg) { return "https://wa.me/" + DT.config.whatsapp + (msg ? "?text=" + encodeURIComponent(msg) : ""); } };
})();
