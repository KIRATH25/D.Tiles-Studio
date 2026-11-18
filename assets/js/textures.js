/* ==========================================================================
   D.Tiles Studio — procedural surface renderer
   Renders each product's material as a high-resolution image, so product
   imagery is consistent, accurate to the palette and always available.
   ========================================================================== */
(function () {
  var DT = window.DT;
  var cache = {};
  var SIZE = 640;

  function hexRgb(h) { h = h.replace("#", ""); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }
  function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  function shade(c, k) { return [c[0] * k, c[1] * k, c[2] * k]; }
  function clamp(v) { return v < 0 ? 0 : v > 255 ? 255 : v; }
  function rng(seed) { var s = seed >>> 0 || 1; return function () { s |= 0; s = s + 0x6D2B79F5 | 0; var t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  function makeNoise(seed) {
    var perm = new Uint8Array(512), r = rng(seed), p = [];
    for (var i = 0; i < 256; i++) p[i] = i;
    for (i = 255; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = p[i]; p[i] = p[j]; p[j] = t; }
    for (i = 0; i < 512; i++) perm[i] = p[i & 255];
    var vals = new Float32Array(256); for (i = 0; i < 256; i++) vals[i] = r();
    function n2(x, y) {
      var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
      var u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
      xi &= 255; yi &= 255;
      var a = vals[perm[perm[xi] + yi]], b = vals[perm[perm[xi + 1] + yi]], c = vals[perm[perm[xi] + yi + 1]], d = vals[perm[perm[xi + 1] + yi + 1]];
      return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
    }
    function fbm(x, y, oct) { var s = 0, a = .5, f = 1, n = 0; for (var o = 0; o < (oct || 5); o++) { s += a * n2(x * f, y * f); n += a; a *= .5; f *= 2.03; } return s / n; }
    return { n2: n2, fbm: fbm, r: r };
  }

  function render(tex) {
    var W = SIZE, H = SIZE;
    var cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    var ctx = cv.getContext("2d");
    var N = makeNoise(tex.seed || 1), r = N.r;
    var base = hexRgb(tex.base), img, d, x, y, i, n, c;
    var t = tex.t;

    function pixels(fn) {
      img = ctx.createImageData(W, H); d = img.data;
      for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
        c = fn(x / W, y / H, x, y); i = (y * W + x) * 4;
        var g = (r() - .5) * 6;
        d[i] = clamp(c[0] + g); d[i + 1] = clamp(c[1] + g); d[i + 2] = clamp(c[2] + g); d[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
    }

    if (t === "marble") {
      var vein = hexRgb(tex.vein), vein2 = hexRgb(tex.vein2 || tex.vein), sc = tex.scale || 2, sh = tex.sharp || 10;
      var ang = r() * Math.PI, ax = Math.cos(ang), ay = Math.sin(ang);
      pixels(function (u, v) {
        var cloud = N.fbm(u * 2.2 + 10, v * 2.2 + 10, 4);
        var col = mix(base, shade(base, .93), cloud * (tex.cloud || .7));
        var w = N.fbm(u * sc, v * sc, 6);
        var l = Math.abs(Math.sin((u * ax + v * ay) * 6 * sc + w * 9));
        var k = Math.pow(1 - l, sh);
        var w2 = N.fbm(u * sc * 2.2 + 5, v * sc * 2.2 + 3, 5);
        var l2 = Math.abs(Math.sin((u * ay - v * ax) * 9 * sc + w2 * 12));
        var k2 = Math.pow(1 - l2, sh * 2.2) * .55;
        col = mix(col, vein2, Math.min(1, k2 + k * .35));
        col = mix(col, vein, Math.min(1, k * (tex.bold ? .95 : .7)));
        return col;
      });
    } else if (t === "travertine") {
      var band = hexRgb(tex.band);
      pixels(function (u, v) {
        var w = N.fbm(u * 3, v * 3, 5);
        var s = tex.cross ? N.fbm(u * 5 + w * 2, v * 5, 5) : Math.sin(v * 46 + w * 5 + N.n2(u * 4, v * 40) * 1.5) * .5 + .5;
        var col = mix(base, band, Math.pow(s, 1.6) * .8);
        var fine = N.n2(u * 120, v * (tex.cross ? 120 : 18));
        col = mix(col, shade(band, .94), fine * .25);
        return col;
      });
      for (i = 0; i < 160; i++) {
        var px = r() * W, py = r() * H, rw = 1 + r() * (tex.cross ? 5 : 9), rh = 1 + r() * 2.2;
        ctx.fillStyle = "rgba(120,96,66," + (.18 + r() * .25) + ")";
        ctx.beginPath(); ctx.ellipse(px, py, rw, rh, tex.cross ? r() * 3 : 0, 0, 6.3); ctx.fill();
      }
    } else if (t === "concrete") {
      pixels(function (u, v) {
        var m = N.fbm(u * 3, v * 3, 6);
        var col = mix(shade(base, 1.04), shade(base, .9), m);
        if (tex.trowel) { var s = N.fbm(u * 1.5 + N.n2(u * 3, v * 3), v * 6, 4); col = mix(col, shade(base, 1.06), Math.pow(s, 3) * .7); }
        var f = N.n2(u * 260, v * 260);
        col = mix(col, shade(base, .85), (tex.speckle ? Math.pow(f, 6) * 1.6 : f * .12));
        return col;
      });
      if (tex.pores) for (i = 0; i < 220; i++) { ctx.fillStyle = "rgba(60,58,55," + (.1 + r() * .2) + ")"; ctx.beginPath(); ctx.arc(r() * W, r() * H, .6 + r() * 1.4, 0, 6.3); ctx.fill(); }
    } else if (t === "slate" || t === "stone") {
      pixels(function (u, v) {
        var a = N.fbm(u * 4, v * 4, 6), b = N.fbm(u * 14 + 3, v * 14, 4);
        var col = mix(shade(base, 1.12), shade(base, .82), a);
        col = mix(col, shade(base, t === "slate" ? 1.25 : .9), Math.pow(b, 3) * .9);
        if (t === "stone") { var rust = [150, 128, 96]; col = mix(col, rust, Math.pow(N.fbm(u * 2 + 7, v * 2, 4), 4) * .5); }
        return col;
      });
      for (i = 0; i < 900; i++) { ctx.fillStyle = "rgba(255,255,255," + r() * .08 + ")"; ctx.fillRect(r() * W, r() * H, 1.4, 1.4); }
    } else if (t === "wood") {
      var planks = 4, pw = W / planks;
      for (var pk = 0; pk < planks; pk++) {
        var off = r() * 50, tone = .9 + r() * .18;
        img = ctx.createImageData(Math.ceil(pw), H); d = img.data;
        for (y = 0; y < H; y++) for (x = 0; x < Math.ceil(pw); x++) {
          var u = (x + pk * pw) / W, v = y / H;
          var g = N.fbm(u * 3 + off, v * .6, 4);
          var ring = Math.sin((u * 60 + g * 12 + off) ) * .5 + .5;
          var col = mix(shade(base, tone * 1.06), shade(base, tone * .78), Math.pow(ring, 3) * .7 + N.n2(u * 300, v * 6) * .2);
          i = (y * Math.ceil(pw) + x) * 4; var nn = (r() - .5) * 6;
          d[i] = clamp(col[0] + nn); d[i + 1] = clamp(col[1] + nn); d[i + 2] = clamp(col[2] + nn); d[i + 3] = 255;
        }
        ctx.putImageData(img, Math.round(pk * pw), 0);
        ctx.fillStyle = "rgba(60,40,25,.35)"; ctx.fillRect(Math.round(pk * pw), 0, 1.5, H);
        var cut = r() * H; ctx.fillRect(Math.round(pk * pw), cut, pw, 1.5);
      }
    } else if (t === "fluted") {
      var ribs = tex.ribs || 8, rw2 = W / ribs;
      pixels(function (u, v, px) {
        var p = (px % rw2) / rw2;
        var light = .72 + Math.sin(p * Math.PI) * .38 - (p > .92 ? .3 : 0);
        var m = N.fbm(u * 3, v * 3, 5);
        var col = mix(base, shade(base, .82), m * .6);
        col = mix(col, [190, 140, 105], Math.pow(N.fbm(u * 6 + 4, v * 2, 4), 3) * .5);
        return shade(col, light);
      });
    } else if (t === "zellige") {
      var cells = tex.cells || 6, cw = W / cells, gr = 4;
      ctx.fillStyle = "#E6DCCB"; ctx.fillRect(0, 0, W, H);
      for (var cy = 0; cy < cells; cy++) for (var cx = 0; cx < cells; cx++) {
        var k3 = .88 + r() * .22, col3 = shade(base, k3);
        var gx = cx * cw + gr / 2, gy = cy * cw + gr / 2, gs = cw - gr;
        var grad = ctx.createRadialGradient(gx + gs * (.25 + r() * .4), gy + gs * (.2 + r() * .4), 2, gx + gs / 2, gy + gs / 2, gs * .8);
        grad.addColorStop(0, "rgb(" + col3.map(function (q) { return Math.round(clamp(q * 1.12)); }).join(",") + ")");
        grad.addColorStop(.6, "rgb(" + col3.map(Math.round).join(",") + ")");
        grad.addColorStop(1, "rgb(" + col3.map(function (q) { return Math.round(q * .86); }).join(",") + ")");
        ctx.fillStyle = grad; ctx.fillRect(gx, gy, gs, gs);
        ctx.fillStyle = "rgba(255,255,255," + (.25 + r() * .25) + ")";
        ctx.beginPath(); ctx.ellipse(gx + gs * (.3 + r() * .3), gy + gs * (.25 + r() * .3), gs * .12, gs * .05, -.6, 0, 6.3); ctx.fill();
      }
    } else if (t === "subway") {
      var bh = H / 8, bw = bh * 3.33, gr2 = 3;
      ctx.fillStyle = "#DCD6CB"; ctx.fillRect(0, 0, W, H);
      for (var row = 0; row < 8; row++) {
        var sx = row % 2 ? -bw / 2 : 0;
        for (var bx = sx; bx < W; bx += bw) {
          var k4 = .9 + r() * .16, c4 = shade(base, k4);
          var gg = ctx.createLinearGradient(0, row * bh, 0, row * bh + bh);
          gg.addColorStop(0, "rgb(" + c4.map(function (q) { return Math.round(clamp(q * 1.2)); }).join(",") + ")");
          gg.addColorStop(.35, "rgb(" + c4.map(Math.round).join(",") + ")");
          gg.addColorStop(1, "rgb(" + c4.map(function (q) { return Math.round(q * .82); }).join(",") + ")");
          ctx.fillStyle = gg; ctx.fillRect(bx + gr2 / 2, row * bh + gr2 / 2, bw - gr2, bh - gr2);
          ctx.fillStyle = "rgba(255,255,255,.22)"; ctx.fillRect(bx + 8, row * bh + 5, bw * .5, 2);
        }
      }
    } else if (t === "linen") {
      pixels(function (u, v) {
        var a = Math.sin(u * W * .9) * .5 + .5, b = Math.sin(v * H * .9) * .5 + .5;
        var m = N.fbm(u * 3, v * 3, 4);
        var col = mix(shade(base, 1.03), shade(base, .92), m * .6);
        return mix(col, shade(base, .9), (a * b) * .22 + N.n2(u * 200, v * 8) * .08);
      });
    } else if (t === "terrazzo") {
      pixels(function (u, v) { return mix(base, shade(base, .95), N.fbm(u * 4, v * 4, 4)); });
      var chips = ["#A86A4E", "#7A7D6B", "#34312E", "#B09A74", "#C9BBA6", "#8D8F8E", "#D8C6AE"];
      for (i = 0; i < 520; i++) {
        var cx2 = r() * W, cy2 = r() * H, rr = (r() < .12 ? 7 + r() * 9 : 2 + r() * 5), sides = 5 + Math.floor(r() * 3);
        ctx.fillStyle = chips[Math.floor(r() * chips.length)]; ctx.globalAlpha = .82 + r() * .18;
        ctx.beginPath();
        for (var s2 = 0; s2 < sides; s2++) { var a2 = s2 / sides * 6.283 + r() * .6, rad = rr * (.6 + r() * .5); ctx[s2 ? "lineTo" : "moveTo"](cx2 + Math.cos(a2) * rad, cy2 + Math.sin(a2) * rad); }
        ctx.closePath(); ctx.fill();
      }
      ctx.globalAlpha = 1;
    } else if (t === "ledge") {
      ctx.fillStyle = "#2E2B28"; ctx.fillRect(0, 0, W, H);
      var yy = 0;
      while (yy < H) {
        var hh = 14 + r() * 26, xx = -r() * 60;
        while (xx < W) {
          var ww = 60 + r() * 180, k5 = .7 + r() * .55, c5 = shade(base, k5);
          if (r() < .25) c5 = mix(c5, [140, 100, 70], .35);
          var lg = ctx.createLinearGradient(0, yy, 0, yy + hh);
          lg.addColorStop(0, "rgb(" + c5.map(function (q) { return Math.round(clamp(q * 1.25)); }).join(",") + ")");
          lg.addColorStop(1, "rgb(" + c5.map(function (q) { return Math.round(q * .7); }).join(",") + ")");
          ctx.fillStyle = lg; ctx.fillRect(xx + 1.5, yy + 1.5, ww - 3, hh - 3);
          xx += ww;
        }
        yy += hh;
      }
      var ov = ctx.getImageData(0, 0, W, H), od = ov.data;
      for (i = 0; i < od.length; i += 4) { var nz = (N.n2((i / 4 % W) / 6, Math.floor(i / 4 / W) / 6) - .5) * 30; od[i] = clamp(od[i] + nz); od[i + 1] = clamp(od[i + 1] + nz); od[i + 2] = clamp(od[i + 2] + nz); }
      ctx.putImageData(ov, 0, 0);
    } else if (t === "brick") {
      ctx.fillStyle = "#CFC4B4"; ctx.fillRect(0, 0, W, H);
      var bh2 = H / 12, bw2 = bh2 * 3.6;
      for (var r2 = 0; r2 < 12; r2++) {
        var ox = r2 % 2 ? -bw2 / 2 : 0;
        for (var x2 = ox; x2 < W; x2 += bw2) {
          var c6 = shade(base, .8 + r() * .38); if (r() < .2) c6 = mix(c6, [70, 45, 35], .3);
          ctx.fillStyle = "rgb(" + c6.map(Math.round).join(",") + ")"; ctx.fillRect(x2 + 3, r2 * bh2 + 3, bw2 - 6, bh2 - 6);
        }
      }
      var bv = ctx.getImageData(0, 0, W, H), bd = bv.data;
      for (i = 0; i < bd.length; i += 4) { var xx2 = i / 4 % W, yy2 = Math.floor(i / 4 / W); var nz2 = (N.fbm(xx2 / 40, yy2 / 40, 3) - .5) * 26 + (r() - .5) * 14; bd[i] = clamp(bd[i] + nz2); bd[i + 1] = clamp(bd[i + 1] + nz2); bd[i + 2] = clamp(bd[i + 2] + nz2); }
      ctx.putImageData(bv, 0, 0);
    } else if (t === "metal") {
      pixels(function (u, v) {
        var s = N.n2(u * 3, v * 400) * .6 + N.n2(u * 1, v * 120) * .4;
        var lg = .85 + Math.sin(u * 3.1) * .2;
        return shade(mix(base, shade(base, 1.2), s), lg);
      });
    } else {
      ctx.fillStyle = tex.base; ctx.fillRect(0, 0, W, H);
    }
    return cv;
  }

  function get(p) {
    if (!p || !p.tex) return null;
    if (!cache[p.sku]) {
      var cv = render(p.tex);
      cache[p.sku] = { canvas: cv, url: cv.toDataURL("image/jpeg", .9) };
    }
    return cache[p.sku];
  }

  /* A laid-floor preview: the material repeated as tiles with grout joints. */
  function laid(p) {
    var key = p.sku + "#laid";
    if (cache[key]) return cache[key].url;
    var src = get(p); if (!src) return null;
    var W = SIZE, cv = document.createElement("canvas"); cv.width = W; cv.height = W;
    var ctx = cv.getContext("2d");
    var dims = (p.size.match(/(\d+)\s*×\s*(\d+)/) || [0, 600, 600]);
    var a = +dims[1], b = +dims[2], ratio = Math.max(a, b) / Math.min(a, b);
    var cols = ratio > 2.5 ? 4 : 3, tw = W / cols, th = Math.min(W, tw * Math.min(ratio, 3));
    ctx.fillStyle = "#CFC6B8"; ctx.fillRect(0, 0, W, W);
    var rnd = rng(p.tex.seed + 7);
    for (var cx = 0; cx < cols; cx++) {
      var off = ratio > 1.2 && cx % 2 ? -th / 2 : 0;
      for (var y = off; y < W; y += th) {
        var sx = rnd() * (SIZE * .5), sy = rnd() * (SIZE * .5);
        ctx.drawImage(src.canvas, sx, sy, SIZE * .5, SIZE * .5 * (th / tw > 1 ? 1 : th / tw), cx * tw + 1.5, y + 1.5, tw - 3, th - 3);
      }
    }
    var g = ctx.createLinearGradient(0, 0, W, W); g.addColorStop(0, "rgba(255,250,240,.12)"); g.addColorStop(1, "rgba(40,30,20,.12)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, W);
    cache[key] = { url: cv.toDataURL("image/jpeg", .88) };
    return cache[key].url;
  }

  /* Close-up crop of the surface. */
  function detail(p) {
    var key = p.sku + "#detail";
    if (cache[key]) return cache[key].url;
    var src = get(p); if (!src) return null;
    var cv = document.createElement("canvas"); cv.width = SIZE; cv.height = SIZE;
    cv.getContext("2d").drawImage(src.canvas, SIZE * .3, SIZE * .3, SIZE * .4, SIZE * .4, 0, 0, SIZE, SIZE);
    cache[key] = { url: cv.toDataURL("image/jpeg", .88) };
    return cache[key].url;
  }

  /* Primary image URL for any product (photo for sanitaryware, texture otherwise). */
  function src(p, w) {
    if (p.images && p.images.length) return p.images[0];
    if (p.photo) return DT.photo(DT.img[p.photo], w || 900);
    var t = get(p); return t ? t.url : "";
  }

  /* Lazy fill: <img data-tex="SKU" data-variant="laid|detail"> */
  var queue = [], busy = false;
  function pump() {
    if (busy || !queue.length) return;
    busy = true;
    var el = queue.shift();
    setTimeout(function () {
      fill(el); busy = false; pump();
    }, 0);
  }
  function fill(el) {
    var p = DT.bySku(el.getAttribute("data-tex")); if (!p) return;
    var v = el.getAttribute("data-variant"), url;
    if (p.images && p.images.length) { el.loading = "lazy"; url = (v === "alt" && p.images[1]) ? p.images[1] : p.images[0]; }
    else if (p.photo && !v) url = DT.photo(DT.img[p.photo], +el.getAttribute("data-w") || 900);
    else if (v === "laid") url = laid(p);
    else if (v === "detail") url = detail(p);
    else url = src(p);
    if (url) {
      if (/^https?:/.test(url)) { el.onload = function () { el.removeAttribute("data-loading"); }; el.onerror = function () { el.removeAttribute("data-loading"); }; el.src = url; }
      else { el.src = url; el.removeAttribute("data-loading"); }
    }
    el.setAttribute("data-filled", "1");
  }
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); queue.push(e.target); pump(); } });
  }, { rootMargin: "300px" }) : null;

  function hydrate(root) {
    (root || document).querySelectorAll("img[data-tex]:not([data-filled])").forEach(function (el) {
      if (el.hasAttribute("data-observed")) return;
      el.setAttribute("data-observed", "1");
      var p = DT.bySku(el.getAttribute("data-tex"));
      if (p && (p.images || (p.photo && !el.getAttribute("data-variant")))) { fill(el); return; }
      if (io) io.observe(el); else { queue.push(el); pump(); }
    });
  }

  DT.tex = { get: get, laid: laid, detail: detail, src: src, hydrate: hydrate, fill: fill };
})();
