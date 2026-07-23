/* Squee's House of Pizza - thumbnail generator (general channel)
   Hosted script. Mounts into <div id="shop-thumbgen"></div>.
   All CSS scoped under .shop-thumb, all IDs prefixed st-, everything inside an IIFE. */
(function () {
  var MOUNT = document.getElementById("shop-thumbgen");
  if (!MOUNT) return;

  /* ---------- fonts ---------- */
  if (!document.getElementById("st-fonts")) {
    var fl = document.createElement("link");
    fl.id = "st-fonts";
    fl.rel = "stylesheet";
    fl.href = "https://fonts.googleapis.com/css2?family=Anton&family=Archivo+Black&family=Cinzel:wght@400;600;900&family=EB+Garamond:wght@400;500&display=swap";
    document.head.appendChild(fl);
  }

  /* ---------- scoped styles ---------- */
  var CSS = [
    ".shop-thumb{--bg:#17120c;--panel:#1c1d21;--gold:#d6a34a;--gold-dim:#8a6a2e;--ink:#f2ead9;--ink-dim:#a89c86;--line:#33302a;--warn:#e07a5f;--ok:#7fb069;",
    "background:var(--bg);color:var(--ink);font-family:'EB Garamond',Georgia,serif;font-size:15px;border-radius:6px;overflow:hidden}",
    ".shop-thumb *{box-sizing:border-box}",
    ".shop-thumb .hdr{padding:16px 20px;border-bottom:1px solid var(--line);display:flex;align-items:baseline;gap:12px;flex-wrap:wrap}",
    ".shop-thumb .hdr strong{font-family:Cinzel,serif;font-weight:900;font-size:18px;letter-spacing:.06em;color:var(--gold)}",
    ".shop-thumb .hdr em{color:var(--ink-dim);font-size:13px;font-style:normal}",
    ".shop-thumb .wrap{display:flex;gap:22px;padding:20px;align-items:flex-start;flex-wrap:wrap}",
    ".shop-thumb .stage{flex:1 1 560px;min-width:320px}",
    ".shop-thumb .panel{flex:0 0 360px;background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:16px;max-width:100%}",
    ".shop-thumb canvas#st-main{width:100%;height:auto;display:block;border:1px solid var(--line);border-radius:4px;background:#000}",
    ".shop-thumb .previews{display:flex;gap:16px;align-items:flex-end;margin-top:14px;flex-wrap:wrap}",
    ".shop-thumb .previews figure{margin:0}",
    ".shop-thumb .previews canvas{display:block;border:1px solid var(--line);border-radius:3px;background:#000}",
    ".shop-thumb .previews figcaption{font-size:12px;color:var(--ink-dim);margin-top:5px}",
    ".shop-thumb .readout{margin-top:14px;padding:11px 13px;border:1px solid var(--line);border-radius:4px;font-size:13px;line-height:1.7}",
    ".shop-thumb .readout b{font-family:Cinzel,serif;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);font-weight:600;display:block;margin-bottom:5px}",
    ".shop-thumb .g{color:var(--ok)}.shop-thumb .w{color:var(--warn)}",
    ".shop-thumb h4{font-family:Cinzel,serif;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin:20px 0 9px;font-weight:600;border-bottom:1px solid var(--line);padding-bottom:6px}",
    ".shop-thumb h4:first-child{margin-top:0}",
    ".shop-thumb label{display:block;font-size:13px;color:var(--ink-dim);margin:9px 0 4px}",
    ".shop-thumb input[type=text],.shop-thumb select,.shop-thumb textarea{width:100%;background:#0f0c08;border:1px solid var(--line);color:var(--ink);padding:7px 9px;border-radius:3px;font-family:'EB Garamond',serif;font-size:14px}",
    ".shop-thumb input[type=range]{width:100%;accent-color:var(--gold)}",
    ".shop-thumb input[type=file]{font-size:12px;color:var(--ink-dim);width:100%}",
    ".shop-thumb .row{display:flex;gap:8px}.shop-thumb .row>*{flex:1}",
    ".shop-thumb button{background:transparent;border:1px solid var(--gold-dim);color:var(--gold);padding:7px 11px;border-radius:3px;cursor:pointer;font-family:Cinzel,serif;font-size:11px;letter-spacing:.1em;text-transform:uppercase;line-height:1.2}",
    ".shop-thumb button:hover{background:rgba(214,163,74,.12)}",
    ".shop-thumb button.solid{background:var(--gold);color:#17120c;border-color:var(--gold);font-weight:600}",
    ".shop-thumb button.solid:hover{background:#e5b45c}",
    ".shop-thumb .layouts{display:grid;grid-template-columns:1fr 1fr;gap:8px}",
    ".shop-thumb .layouts button{width:100%;padding:9px 6px}",
    ".shop-thumb .layouts button[aria-pressed=true]{background:var(--gold);color:#17120c;border-color:var(--gold)}",
    ".shop-thumb .sl{display:flex;align-items:center;gap:9px}.shop-thumb .sl input[type=range]{flex:1}",
    ".shop-thumb .sl .nv{width:58px;flex:0 0 58px;text-align:right;font-size:12px;color:var(--ink);background:#0f0c08;border:1px solid var(--line);border-radius:3px;padding:4px 5px;font-family:'EB Garamond',serif;font-variant-numeric:tabular-nums}",
    ".shop-thumb .sl .nv:focus{border-color:var(--gold);outline:none}",
    ".shop-thumb .ck{display:flex;align-items:center;gap:8px;margin:8px 0;font-size:13px;color:var(--ink-dim)}",
    ".shop-thumb .ck input{accent-color:var(--gold)}.shop-thumb .ck label{margin:0}",
    ".shop-thumb .note{font-size:12px;color:var(--ink-dim);line-height:1.5;margin:8px 0 0}",
    ".shop-thumb .status{font-size:12px;color:var(--gold);min-height:16px;margin-top:6px}",
    ".shop-thumb .wc{font-size:12px;margin-top:5px}",
    ".shop-thumb fieldset{border:1px solid var(--line);border-radius:4px;padding:12px;margin:12px 0}",
    ".shop-thumb fieldset[disabled]{opacity:.42}",
    ".shop-thumb legend{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);font-family:Cinzel,serif;padding:0 6px}",
    ".shop-thumb .cutrow{display:flex;align-items:center;gap:9px;padding:6px 8px;border:1px solid var(--line);border-radius:3px;margin-bottom:6px;cursor:pointer;background:#0f0c08}",
    ".shop-thumb .cutrow[aria-selected=true]{border-color:var(--gold);background:rgba(214,163,74,.1)}",
    ".shop-thumb .cutrow img{width:30px;height:30px;object-fit:contain;background:#241d14;border-radius:2px;flex:0 0 30px}",
    ".shop-thumb .cutrow .nm{flex:1;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
    ".shop-thumb .cutrow .kill{border:none;background:none;color:var(--ink-dim);font-size:15px;padding:2px 5px;letter-spacing:0}",
    ".shop-thumb .cutrow .kill:hover{color:var(--warn);background:none}",
    ".shop-thumb .empty{font-size:12px;color:var(--ink-dim);font-style:italic;padding:6px 0}"
  ].join("");
  var st = document.createElement("style");
  st.textContent = CSS;
  document.head.appendChild(st);

  /* ---------- markup ---------- */
  MOUNT.className = "shop-thumb";
  MOUNT.innerHTML =
    '<div class="hdr"><strong>Squee\'s House of Pizza</strong><em>thumbnail generator</em></div>' +
    '<div class="wrap">' +
      '<div class="stage">' +
        '<canvas id="st-main" width="1280" height="720"></canvas>' +
        '<div class="previews">' +
          '<figure><canvas id="st-p160" width="160" height="90"></canvas><figcaption>160px feed</figcaption></figure>' +
          '<figure><canvas id="st-p320" width="320" height="180"></canvas><figcaption>320px sidebar</figcaption></figure>' +
        '</div>' +
        '<div class="readout"><b>Legibility check</b>' +
          '<div id="st-rdWords"></div><div id="st-rdLuma"></div><div id="st-rdFace"></div></div>' +
      '</div>' +
      '<div class="panel">' +
        '<h4>Layout</h4>' +
        '<div class="layouts" id="st-layouts">' +
          '<button data-layout="hero" aria-pressed="true">Hero</button>' +
          '<button data-layout="versus" aria-pressed="false">Versus</button>' +
          '<button data-layout="statement" aria-pressed="false">Statement</button>' +
          '<button data-layout="feature" aria-pressed="false">Feature</button>' +
        '</div><p class="note" id="st-layoutNote"></p>' +

        '<h4>Backdrop</h4>' +
        '<label>House background (used when no card art is set)</label>' +
        '<input type="file" id="st-bgFile" accept="image/png,image/jpeg,image/webp">' +
        '<button id="st-bgClear" style="margin-top:8px">Clear background</button>' +

        '<h4>Card art</h4>' +
        '<fieldset><legend>Primary</legend>' +
          '<label>Archetype</label><select id="st-arch1"></select>' +
          '<label>Or card name</label>' +
          '<div class="row"><input type="text" id="st-card1" placeholder="Parallax Wave">' +
          '<button id="st-fetch1" style="flex:0 0 84px">Fetch</button></div>' +
          '<button id="st-clear1" style="margin-top:8px">Clear art</button>' +
          '<label>Zoom</label><div class="sl"><input type="range" id="st-s1" min="100" max="260" value="100"><input type="number" class="nv" value="100"></div>' +
          '<label>Pan X</label><div class="sl"><input type="range" id="st-x1" min="-100" max="100" value="0"><input type="number" class="nv" value="0"></div>' +
          '<label>Pan Y</label><div class="sl"><input type="range" id="st-y1" min="-100" max="100" value="0"><input type="number" class="nv" value="0"></div>' +
        '</fieldset>' +
        '<fieldset id="st-art2box"><legend>Opponent</legend>' +
          '<label>Archetype</label><select id="st-arch2"></select>' +
          '<label>Or card name</label>' +
          '<div class="row"><input type="text" id="st-card2" placeholder="Psychatog">' +
          '<button id="st-fetch2" style="flex:0 0 84px">Fetch</button></div>' +
          '<button id="st-clear2" style="margin-top:8px">Clear art</button>' +
          '<label>Zoom</label><div class="sl"><input type="range" id="st-s2" min="100" max="260" value="100"><input type="number" class="nv" value="100"></div>' +
          '<label>Pan X</label><div class="sl"><input type="range" id="st-x2" min="-100" max="100" value="0"><input type="number" class="nv" value="0"></div>' +
          '<label>Pan Y</label><div class="sl"><input type="range" id="st-y2" min="-100" max="100" value="0"><input type="number" class="nv" value="0"></div>' +
        '</fieldset><div class="status" id="st-status"></div>' +

        '<h4>Hook text</h4>' +
        '<textarea id="st-hook" rows="2" placeholder="punished for greed"></textarea>' +
        '<div class="wc" id="st-wc"></div>' +
        '<label>Size</label><div class="sl"><input type="range" id="st-hookSize" min="70" max="180" value="126"><input type="number" class="nv" value="126"></div>' +
        '<label>Typeface</label><select id="st-hookFont">' +
          '<option value="Anton">Anton (condensed)</option>' +
          '<option value="Archivo Black">Archivo Black (wide)</option></select>' +
        '<div class="ck"><input type="checkbox" id="st-hookGold"><label for="st-hookGold">Gold last word</label></div>' +
        '<div class="ck"><input type="checkbox" id="st-hookPanel"><label for="st-hookPanel">Dark panel behind text</label></div>' +
        '<p class="note">Two lines is the ceiling. The panel is for bright art where the scrim is not enough.</p>' +

        '<h4>Crew cutouts</h4>' +
        '<input type="file" id="st-cutFile" accept="image/png,image/webp" multiple>' +
        '<div class="ck"><input type="checkbox" id="st-cutOn" checked><label for="st-cutOn">Show cutouts</label></div>' +
        '<div id="st-cutList"></div>' +
        '<fieldset id="st-cutEdit" disabled><legend>Selected</legend>' +
          '<div class="ck"><input type="checkbox" id="st-cutFlip"><label for="st-cutFlip">Flip horizontally</label></div>' +
          '<label>Size</label><div class="sl"><input type="range" id="st-cutS" min="25" max="160" value="88"><input type="number" class="nv" value="88"></div>' +
          '<label>Position across frame</label><div class="sl"><input type="range" id="st-cutX" min="0" max="100" value="78"><input type="number" class="nv" value="78"></div>' +
          '<label>Vertical nudge</label><div class="sl"><input type="range" id="st-cutY" min="-50" max="50" value="0"><input type="number" class="nv" value="0"></div>' +
          '<div class="row" style="margin-top:10px"><button id="st-cutBack">Send back</button><button id="st-cutFront">Bring front</button></div>' +
        '</fieldset>' +

        '<h4>Brand bar</h4>' +
        '<div class="ck"><input type="checkbox" id="st-barOn" checked><label for="st-barOn">Show gold bar</label></div>' +
        '<label>Lockup</label><select id="st-barMode">' +
          '<option value="short">S.H.O.P. (reads at 160px)</option>' +
          '<option value="full">Squee\'s House of Pizza</option>' +
          '<option value="logo">Uploaded mark</option></select>' +
        '<label>Mark image</label><input type="file" id="st-logoFile" accept="image/png,image/webp">' +
        '<label>Bar height</label><div class="sl"><input type="range" id="st-barH" min="34" max="92" value="52"><input type="number" class="nv" value="52"></div>' +
        '<label>Series label</label><input type="text" id="st-series" value="MTGO League">' +
        '<label>Corner chip</label><input type="text" id="st-chip" placeholder="July 2026">' +
        '<div class="ck"><input type="checkbox" id="st-chipOn" checked><label for="st-chipOn">Show chip</label></div>' +

        '<h4>Contrast</h4>' +
        '<label>Scrim strength</label><div class="sl"><input type="range" id="st-scrim" min="0" max="100" value="0"><input type="number" class="nv" value="0"></div>' +

        '<h4>Export</h4>' +
        '<button class="solid" id="st-export" style="width:100%">Download 1280 &times; 720 PNG</button>' +
        '<p class="note">Art loads from Scryfall\'s oldest paper printing. Uploads stay local to your browser.</p>' +
      '</div>' +
    '</div>';

  /* ---------- logic ---------- */
  var W = 1280, H = 720, GOLD = "#d6a34a", DARK = "#17120c";
  var el = function (n) { return document.getElementById("st-" + n); };
  var main = el("main"), ctx = main.getContext("2d");
  var lastZone = null, lastLuma = null;

  var ARCHETYPES = [
    ["", ""], ["Replenish", "Parallax Wave"], ["Enchantress", "Argothian Enchantress"],
    ["Psychatog", "Psychatog"], ["Gro-a-Tog", "Quirion Dryad"], ["Landstill", "Standstill"],
    ["The Rock", "Pernicious Deed"], ["Deadguy Ale", "Hymn to Tourach"],
    ["Mono Black Control", "Cursed Scroll"], ["Goblins", "Goblin Lackey"],
    ["Sligh", "Jackal Pup"], ["Burn", "Fireblast"], ["RG Zoo", "Kird Ape"],
    ["Terrageddon", "Armageddon"], ["White Weenie", "Soltari Priest"],
    ["Parfait", "Land Tax"], ["Elves", "Priest of Titania"], ["UG Madness", "Wild Mongrel"],
    ["Survival", "Survival of the Fittest"], ["Angry Hermit", "Deranged Hermit"],
    ["Full English Breakfast", "Volrath's Shapeshifter"], ["Reanimator", "Exhume"],
    ["Oath", "Oath of Druids"], ["Aluren", "Aluren"], ["Dream Halls", "Dream Halls"],
    ["Pandeburst", "Saproling Burst"], ["Devourer Combo", "Sutured Ghoul"],
    ["Stiflenought", "Phyrexian Dreadnought"], ["Stasis", "Stasis"],
    ["Astral Slide", "Astral Slide"], ["MUD", "Metalworker"], ["Black MUD", "Su-Chi"]
  ];

  var S = {
    layout: "hero", art1: null, art2: null, bg: null, logo: null,
    cuts: [], active: -1,
    s1: 100, x1: 0, y1: 0, s2: 100, x2: 0, y2: 0,
    hook: "punished for greed", hookSize: 126, hookFont: "Anton",
    hookGold: false, hookPanel: false, cutOn: true,
    barOn: true, barMode: "full", barH: 52, series: "MTGO League",
    chip: "", chipOn: true, scrim: 0
  };

  var NOTES = {
    hero: "One card art, scrim on the left, cutout right. Default for league videos and deck content.",
    versus: "Diagonal split, two arts, gold seam. For head-to-head matches and archetype comparisons.",
    statement: "Art pushed back, text dominant. For bans, news, reactions. Weakest layout without a face in it.",
    feature: "Person dominant over a soft field. For tournament reports, interviews, crew talk."
  };
  var DX = { hero: 78, versus: 80, statement: 80, feature: 52 };
  var DS = { hero: 88, versus: 64, statement: 56, feature: 100 };

  function fillSelect(s) {
    ARCHETYPES.forEach(function (p) {
      var o = document.createElement("option");
      o.value = p[1]; o.textContent = p[0] || "(none)"; s.appendChild(o);
    });
  }
  fillSelect(el("arch1")); fillSelect(el("arch2"));
  function setStatus(t) { el("status").textContent = t; }
  function barHeight() { return S.barOn ? S.barH : 0; }

  function loadArt(name, slot) {
    if (!name) { S[slot] = null; render(); return; }
    setStatus("Loading " + name + "\u2026");
    var q = encodeURIComponent('!"' + name + '" game:paper');
    fetch("https://api.scryfall.com/cards/search?q=" + q + "&order=released&dir=asc&unique=prints")
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) {
        var c = d.data[0];
        var u = (c.image_uris && c.image_uris.art_crop) ||
                (c.card_faces && c.card_faces[0].image_uris.art_crop);
        if (!u) throw 0;
        var i = new Image(); i.crossOrigin = "anonymous";
        i.onload = function () { S[slot] = i; setStatus(c.name + " \u2014 " + c.set_name); render(); };
        i.onerror = function () { setStatus("Image failed to load."); };
        i.src = u;
      })
      .catch(function () { setStatus("No card found for \u201c" + name + "\u201d."); });
  }

  function cover(img, dx, dy, dw, dh, zoom, px, py) {
    var r = Math.max(dw / img.width, dh / img.height) * (zoom / 100);
    var w = img.width * r, h = img.height * r;
    var sx = Math.max((w - dw) / 2, dw * 0.22), sy = Math.max((h - dh) / 2, dh * 0.22);
    ctx.drawImage(img, dx + (dw - w) / 2 + (px / 100) * sx, dy + (dh - h) / 2 + (py / 100) * sy, w, h);
  }

  function houseField(x, y, w, h) {
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    if (S.bg) cover(S.bg, x, y, w, h, 100, 0, 0);
    else {
      ctx.fillStyle = DARK; ctx.fillRect(x, y, w, h);
      var g = ctx.createRadialGradient(x + w * .5, y + h * .42, 10, x + w * .5, y + h * .42, Math.max(w, h) * .72);
      g.addColorStop(0, "rgba(138,106,46,0.42)"); g.addColorStop(1, "rgba(23,18,12,0)");
      ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
      ctx.globalAlpha = .09; ctx.fillStyle = GOLD; ctx.font = "900 300px Cinzel, serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("SHOP", x + w / 2, y + h * .44);
      ctx.globalAlpha = 1; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    }
    ctx.restore();
  }

  function wrapAt(text, maxW, size) {
    ctx.font = "400 " + size + "px '" + S.hookFont + "', Impact, sans-serif";
    var words = text.trim().split(/\s+/), lines = [], cur = "";
    for (var i = 0; i < words.length; i++) {
      var t = cur ? cur + " " + words[i] : words[i];
      if (ctx.measureText(t).width <= maxW || !cur) cur = t;
      else { lines.push(cur); cur = words[i]; }
    }
    if (cur) lines.push(cur);
    return lines;
  }

  function fitLines(text, maxW, size) {
    var s = size, lines;
    while (s > 34) {
      lines = wrapAt(text, maxW, s);
      if (lines.length <= 2) return { lines: lines, size: s };
      s -= 4;
    }
    return { lines: wrapAt(text, maxW, s).slice(0, 2), size: s };
  }

  function drawHook(cx, baseY, maxW, size, align) {
    if (!S.hook.trim()) { lastZone = null; lastLuma = null; return; }
    var f = fitLines(S.hook.toUpperCase(), maxW, size);
    ctx.font = "400 " + f.size + "px '" + S.hookFont + "', Impact, sans-serif";
    var widest = 0;
    f.lines.forEach(function (l) { widest = Math.max(widest, ctx.measureText(l).width); });
    var lh = f.size * 1.02, total = lh * f.lines.length, top = baseY - total;
    var zx = align === "center" ? cx - widest / 2 : cx;
    lastZone = { x: zx - 24, y: top - 10, w: widest + 48, h: total + 20 };
    measureLuma();
    if (S.hookPanel) {
      ctx.fillStyle = "rgba(11,8,5,0.74)";
      ctx.fillRect(lastZone.x, lastZone.y, lastZone.w, lastZone.h);
    }
    ctx.textAlign = align; ctx.lineJoin = "round"; ctx.miterLimit = 2;
    var y = top + lh * 0.82, last = f.lines.length - 1;
    f.lines.forEach(function (ln, i) {
      ctx.lineWidth = Math.max(10, f.size * 0.15);
      ctx.strokeStyle = "#0b0805"; ctx.strokeText(ln, cx, y);
      ctx.fillStyle = (S.hookGold && i === last) ? GOLD : "#ffffff";
      ctx.fillText(ln, cx, y); y += lh;
    });
    ctx.textAlign = "left";
  }

  function measureLuma() {
    if (!lastZone) { lastLuma = null; return; }
    try {
      var x = Math.max(0, Math.round(lastZone.x)), y = Math.max(0, Math.round(lastZone.y));
      var w = Math.min(W - x, Math.round(lastZone.w)), h = Math.min(H - y, Math.round(lastZone.h));
      if (w < 4 || h < 4) { lastLuma = null; return; }
      var d = ctx.getImageData(x, y, w, h).data, sum = 0, n = 0;
      for (var i = 0; i < d.length; i += 16) { sum += .2126 * d[i] + .7152 * d[i + 1] + .0722 * d[i + 2]; n++; }
      lastLuma = sum / n;
    } catch (e) { lastLuma = null; }
  }

  function drawCutouts() {
    if (!S.cutOn) return;
    var bh = barHeight();
    S.cuts.forEach(function (c) {
      var h = (H - bh) * (c.s / 100), w = h * (c.img.width / c.img.height);
      var x = (c.x / 100) * W - w / 2, y = H - bh - h + (c.y / 100) * 180;
      ctx.save();
      if (c.flip) { ctx.translate(x + w / 2, 0); ctx.scale(-1, 1); ctx.translate(-(x + w / 2), 0); }
      ctx.drawImage(c.img, x, y, w, h); ctx.restore();
    });
  }

  function drawBar() {
    if (!S.barOn) return;
    var h = S.barH, mid = H - h / 2 + 1;
    ctx.fillStyle = GOLD; ctx.fillRect(0, H - h, W, h);
    ctx.fillStyle = DARK; ctx.textBaseline = "middle"; ctx.textAlign = "left";
    if (S.barMode === "logo" && S.logo) {
      var lh = h * .66, lw = lh * (S.logo.width / S.logo.height);
      ctx.drawImage(S.logo, 28, H - h + (h - lh) / 2, lw, lh);
    } else if (S.barMode === "full") {
      ctx.font = "900 " + Math.round(h * .42) + "px Cinzel, serif";
      ctx.fillText("SQUEE'S HOUSE OF PIZZA", 28, mid);
    } else {
      ctx.font = "900 " + Math.round(h * .62) + "px Cinzel, serif";
      ctx.fillText("S.H.O.P.", 28, mid);
    }
    if (S.series.trim()) {
      ctx.font = "900 " + Math.round(h * .48) + "px Cinzel, serif";
      ctx.textAlign = "right"; ctx.fillText(S.series.toUpperCase(), W - 28, mid);
    }
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  }

  function drawChip() {
    if (!S.chipOn || !S.chip.trim()) return;
    var t = S.chip.toUpperCase();
    ctx.font = "900 26px Cinzel, serif";
    var w = ctx.measureText(t).width + 40, h = 50, x = 30, y = 28;
    ctx.fillStyle = GOLD; ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, 25); else ctx.rect(x, y, w, h);
    ctx.fill(); ctx.fillStyle = DARK; ctx.textBaseline = "middle";
    ctx.fillText(t, x + 20, y + h / 2 + 1); ctx.textBaseline = "alphabetic";
  }

  function scrimLeft() {
    var a = S.scrim / 100, g = ctx.createLinearGradient(0, 0, W * .78, 0);
    g.addColorStop(0, "rgba(11,8,5," + (.95 * a).toFixed(3) + ")");
    g.addColorStop(.45, "rgba(11,8,5," + (.72 * a).toFixed(3) + ")");
    g.addColorStop(1, "rgba(11,8,5,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  function scrimBottom() {
    var a = S.scrim / 100, g = ctx.createLinearGradient(0, H * .28, 0, H);
    g.addColorStop(0, "rgba(11,8,5,0)");
    g.addColorStop(1, "rgba(11,8,5," + (.9 * a).toFixed(3) + ")");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  function field(slot, z, px, py) {
    if (S[slot]) cover(S[slot], 0, 0, W, H, z, px, py); else houseField(0, 0, W, H);
  }

  function render() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = DARK; ctx.fillRect(0, 0, W, H);
    var bh = barHeight();
    lastZone = null; lastLuma = null;

    if (S.layout === "versus") {
      var tx = W * .62, bx = W * .38;
      ctx.save(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(tx, 0); ctx.lineTo(bx, H); ctx.lineTo(0, H);
      ctx.closePath(); ctx.clip(); field("art1", S.s1, S.x1, S.y1); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.moveTo(tx, 0); ctx.lineTo(W, 0); ctx.lineTo(W, H); ctx.lineTo(bx, H);
      ctx.closePath(); ctx.clip(); field("art2", S.s2, S.x2, S.y2); ctx.restore();
      var g = ctx.createLinearGradient(0, 0, 0, H * .55);
      g.addColorStop(0, "rgba(11,8,5," + (.88 * S.scrim / 100).toFixed(3) + ")");
      g.addColorStop(1, "rgba(11,8,5,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = GOLD; ctx.lineWidth = 12;
      ctx.beginPath(); ctx.moveTo(tx, -10); ctx.lineTo(bx, H + 10); ctx.stroke();
      drawCutouts();
      drawHook(W / 2, 208, W - 150, Math.min(S.hookSize, 108), "center");
      ctx.save(); ctx.translate((tx + bx) / 2, H * .5); ctx.rotate(Math.PI / 4);
      ctx.fillStyle = GOLD; ctx.fillRect(-52, -52, 104, 104); ctx.rotate(-Math.PI / 4);
      ctx.fillStyle = DARK; ctx.font = "400 46px 'Anton', Impact, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("VS", 0, 2);
      ctx.restore(); ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    } else if (S.layout === "statement") {
      field("art1", S.s1, S.x1, S.y1);
      ctx.fillStyle = "rgba(11,8,5," + (.34 + .5 * S.scrim / 100).toFixed(3) + ")";
      ctx.fillRect(0, 0, W, H);
      drawCutouts();
      drawHook(W / 2, (H - bh) * .62, W - 170, Math.max(S.hookSize, 130), "center");
    } else if (S.layout === "feature") {
      field("art1", S.s1, S.x1, S.y1);
      ctx.fillStyle = "rgba(11,8,5," + (.30 + .45 * S.scrim / 100).toFixed(3) + ")";
      ctx.fillRect(0, 0, W, H);
      scrimLeft();
      ctx.fillStyle = GOLD; ctx.fillRect(0, 0, 16, H - bh);
      drawCutouts();
      drawHook(62, (H - bh) * .72, W * .46, Math.min(S.hookSize, 100), "left");
    } else {
      field("art1", S.s1, S.x1, S.y1);
      scrimLeft(); scrimBottom(); drawCutouts();
      drawHook(62, (H - bh) * .80, W * .58, S.hookSize, "left");
    }

    drawBar(); drawChip();
    [["p160", 160, 90], ["p320", 320, 180]].forEach(function (p) {
      var c = el(p[0]), cx = c.getContext("2d");
      cx.clearRect(0, 0, p[1], p[2]); cx.drawImage(main, 0, 0, p[1], p[2]);
    });
    updateReadout();
  }

  function updateReadout() {
    var words = S.hook.trim() ? S.hook.trim().split(/\s+/).length : 0;
    var ok = words > 0 && words <= 3;
    el("rdWords").innerHTML = "Words: <span class='" + (ok ? "g" : "w") + "'>" + words +
      (words === 0 ? " (empty)" : ok ? " (good)" : " (over three, expect lower CTR)") + "</span>";
    el("wc").innerHTML = "<span class='" + (ok ? "g" : "w") + "'>" + words +
      " word" + (words === 1 ? "" : "s") + (ok ? "" : " \u2014 trim to three") + "</span>";
    if (lastLuma === null) el("rdLuma").textContent = "Background under text: not measurable";
    else {
      var v = Math.round(lastLuma), safe = v < 110;
      el("rdLuma").innerHTML = "Background under text: <span class='" + (safe ? "g" : "w") + "'>" +
        v + "/255" + (safe ? " (white text safe)" : " (too bright, raise scrim or use the panel)") + "</span>";
    }
    var faces = S.cutOn && S.cuts.length > 0;
    el("rdFace").innerHTML = "Face in frame: <span class='" + (faces ? "g" : "w") + "'>" +
      (faces ? "yes" : "none \u2014 69% of breakout thumbnails have one") + "</span>";
  }

  function renderCutList() {
    var box = el("cutList"); box.innerHTML = "";
    if (!S.cuts.length) {
      box.innerHTML = '<p class="empty">No cutouts loaded. Add one or several.</p>';
      el("cutEdit").disabled = true; return;
    }
    S.cuts.forEach(function (c, i) {
      var row = document.createElement("div");
      row.className = "cutrow"; row.setAttribute("aria-selected", i === S.active);
      var im = document.createElement("img"); im.src = c.img.src;
      var nm = document.createElement("span"); nm.className = "nm"; nm.textContent = c.name;
      var kill = document.createElement("button");
      kill.className = "kill"; kill.textContent = "\u00d7"; kill.title = "Remove";
      kill.addEventListener("click", function (e) {
        e.stopPropagation(); S.cuts.splice(i, 1);
        if (S.active >= S.cuts.length) S.active = S.cuts.length - 1;
        renderCutList(); syncCut(); render();
      });
      row.appendChild(im); row.appendChild(nm); row.appendChild(kill);
      row.addEventListener("click", function () { S.active = i; renderCutList(); syncCut(); });
      box.appendChild(row);
    });
    el("cutEdit").disabled = S.active < 0;
  }

  function syncCut() {
    var c = S.cuts[S.active]; if (!c) return;
    ["S:s", "X:x", "Y:y"].forEach(function (p) {
      var k = p.split(":"), n = el("cut" + k[0]);
      n.value = c[k[1]]; n.nextElementSibling.value = c[k[1]];
    });
    el("cutFlip").checked = c.flip;
  }

  function clamp(range, v) {
    if (v === "" || isNaN(v)) v = +range.value;
    return Math.min(+range.max, Math.max(+range.min, Math.round(v)));
  }
  function slider(id, key) {
    var n = el(id), o = n.nextElementSibling;
    function push(v) { v = clamp(n, v); n.value = v; o.value = v; S[key] = v; render(); }
    n.addEventListener("input", function () { push(+n.value); });
    o.addEventListener("change", function () { push(+o.value); });
    o.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); push(+o.value); o.blur(); } });
    o.value = n.value;
  }
  ["s1", "x1", "y1", "s2", "x2", "y2"].forEach(function (k) { slider(k, k); });
  slider("hookSize", "hookSize"); slider("scrim", "scrim"); slider("barH", "barH");

  function cutSlider(id, key) {
    var n = el(id), o = n.nextElementSibling;
    function push(v) {
      v = clamp(n, v); n.value = v; o.value = v;
      var c = S.cuts[S.active]; if (c) { c[key] = v; render(); }
    }
    n.addEventListener("input", function () { push(+n.value); });
    o.addEventListener("change", function () { push(+o.value); });
    o.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); push(+o.value); o.blur(); } });
    o.value = n.value;
  }
  cutSlider("cutS", "s"); cutSlider("cutX", "x"); cutSlider("cutY", "y");

  el("cutFlip").addEventListener("change", function (e) {
    var c = S.cuts[S.active]; if (c) { c.flip = e.target.checked; render(); }
  });
  el("cutBack").addEventListener("click", function () {
    if (S.active <= 0) return;
    var c = S.cuts.splice(S.active, 1)[0];
    S.cuts.splice(S.active - 1, 0, c); S.active--; renderCutList(); render();
  });
  el("cutFront").addEventListener("click", function () {
    if (S.active < 0 || S.active >= S.cuts.length - 1) return;
    var c = S.cuts.splice(S.active, 1)[0];
    S.cuts.splice(S.active + 1, 0, c); S.active++; renderCutList(); render();
  });

  ["hook", "series", "chip"].forEach(function (k) {
    el(k).addEventListener("input", function (e) { S[k] = e.target.value; render(); });
  });
  ["hookGold", "hookPanel", "cutOn", "barOn", "chipOn"].forEach(function (k) {
    el(k).addEventListener("change", function (e) { S[k] = e.target.checked; render(); });
  });
  el("hookFont").addEventListener("change", function (e) { S.hookFont = e.target.value; render(); });
  el("barMode").addEventListener("change", function (e) { S.barMode = e.target.value; render(); });

  [1, 2].forEach(function (n) {
    el("fetch" + n).addEventListener("click", function () { loadArt(el("card" + n).value.trim(), "art" + n); });
    el("card" + n).addEventListener("keydown", function (e) { if (e.key === "Enter") el("fetch" + n).click(); });
    el("clear" + n).addEventListener("click", function () {
      S["art" + n] = null; el("card" + n).value = ""; el("arch" + n).value = ""; setStatus(""); render();
    });
    el("arch" + n).addEventListener("change", function (e) {
      if (e.target.value) { el("card" + n).value = e.target.value; loadArt(e.target.value, "art" + n); }
    });
  });

  function readImage(f, cb) {
    var r = new FileReader();
    r.onload = function () { var i = new Image(); i.onload = function () { cb(i, f); }; i.src = r.result; };
    r.readAsDataURL(f);
  }
  el("bgFile").addEventListener("change", function (e) {
    var f = e.target.files[0]; if (f) readImage(f, function (i) { S.bg = i; render(); });
  });
  el("bgClear").addEventListener("click", function () { S.bg = null; el("bgFile").value = ""; render(); });
  el("logoFile").addEventListener("change", function (e) {
    var f = e.target.files[0];
    if (f) readImage(f, function (i) { S.logo = i; S.barMode = "logo"; el("barMode").value = "logo"; render(); });
  });
  el("cutFile").addEventListener("change", function (e) {
    Array.prototype.slice.call(e.target.files).forEach(function (f) {
      readImage(f, function (i, file) {
        var n = S.cuts.length;
        S.cuts.push({
          img: i, name: file.name.replace(/\.(png|webp)$/i, ""),
          s: DS[S.layout], x: Math.max(8, DX[S.layout] - n * 20), y: 0, flip: false
        });
        S.active = S.cuts.length - 1; renderCutList(); syncCut(); render();
      });
    });
    e.target.value = "";
  });

  el("layouts").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    S.layout = b.dataset.layout;
    Array.prototype.slice.call(el("layouts").children).forEach(function (x) {
      x.setAttribute("aria-pressed", x === b);
    });
    el("art2box").style.display = S.layout === "versus" ? "" : "none";
    el("layoutNote").textContent = NOTES[S.layout];
    render();
  });

  el("export").addEventListener("click", function () {
    var a = document.createElement("a");
    var slug = (S.hook || "thumbnail").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    a.download = "shop-" + slug + ".png";
    try { a.href = main.toDataURL("image/png"); a.click(); }
    catch (err) { setStatus("Export blocked by the browser on this page."); }
  });

  el("hook").value = S.hook;
  el("barMode").value = S.barMode;
  el("art2box").style.display = "none";
  el("layoutNote").textContent = NOTES.hero;
  renderCutList();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(render);
  render();
})();
