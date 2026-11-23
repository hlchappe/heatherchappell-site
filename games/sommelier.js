/* SIDE-EYE SOMMELIER — heatherchappell.com arcade
   Match the degree of side-eye to the offense. Vanilla JS, no deps. */
(function () {
  "use strict";

  var ID = "sommelier";
  var BEST_KEY = "hc_" + ID + "_best";

  var C = {
    ink: "#141414", paper: "#F3ECDF", pink: "#FF2E88", pinkDark: "#D41A6E",
    yellow: "#FFE14D", teal: "#19C2B0", grey: "#6B6B6B", ink2: "#1E1E1E"
  };
  var F = {
    pixel: '"Press Start 2P", "Space Mono", monospace',
    mono: '"Space Mono", ui-monospace, monospace',
    display: '"Archivo Black", Impact, sans-serif',
    serif: '"Fraunces", Georgia, serif'
  };

  var LEVELS = ["GLANCE", "SQUINT", "FULL SIDE-EYE", "SIDE-EYE + EYEBROW", "BLESS YOUR HEART"];
  var LEVELS_SHORT = ["GLANCE", "SQUINT", "SIDE-EYE", "+BROW", "BLESS"];
  var BAND_COLORS = [C.teal, "#7FD08A", C.yellow, "#FF8A5C", C.pink];

  // ---------------------------------------------------------------- the wine list
  // Recurring cast: Greg from Procurement (who: "greg"), Dale next door ("dale"),
  // Aunt Dot ("dot"). Each gets worse as the levels climb.
  var SITUATIONS = [
    // 1 — Glance
    { t: "The waiter asks, “Still working on that?” The fork is in your mouth. It is mid-bite.", lvl: 1, note: "Light-bodied, innocent. He has eleven tables and a dream." },
    { t: "Someone says “PEE-can” at Thanksgiving. Within earshot of the pie.", lvl: 1, note: "Regional varietal. Glance, pass the pie. The pie did nothing." },
    { t: "Greg from Procurement answers your four-paragraph email with “k.” Lowercase. No period.", lvl: 1, who: "greg", note: "Crisp, minimalist. Greg is saving his letters for later." },
    { t: "Your own reflection in the microwave door, 6:12 a.m., before coffee.", lvl: 1, note: "Be gentle. You have not been decanted yet." },
    { t: "Dale next door waves at you with his whole leaf blower. It is running.", lvl: 1, who: "dale", note: "Faint finish of two-stroke engine. Dale means well. For now." },
    { t: "The family group chat gets a 46-second voice memo from Uncle Ray. It is mostly wind.", lvl: 1, note: "Breezy. Literally. Somebody is at the lake." },
    // 2 — Squint
    { t: "Greg from Procurement books a “quick sync” for 4:45 p.m. Friday. It is 45 minutes long.", lvl: 2, who: "greg", note: "A late-harvest invite, with notes of an empty parking lot." },
    { t: "Someone replies-all “Thanks!” to 412 people. Including the CEO, who did not need thanking.", lvl: 2, note: "Squint now. Next comes the reply-all “please remove me.”" },
    { t: "A friend says “I don’t really watch TV,” then recaps all four seasons of a show about bakers.", lvl: 2, note: "Unaware of its own tannins. They’ll hear themselves someday." },
    { t: "The cat knocks one (1) glass off the counter. Eye contact is maintained throughout.", lvl: 2, note: "Nobody out-side-eyes a cat. You will lose. Squint and sweep." },
    { t: "Aunt Dot comments “Is this you??” on a photo of you. You are tagged. You are the only one in it.", lvl: 2, who: "dot", note: "Early Aunt Dot. Approachable, with notes of 200% font size." },
    { t: "Dale parks his boat trailer across your mailbox. The mail carrier now walks around it, sighing.", lvl: 2, who: "dale", note: "Dale’s terroir is expanding. Note the acreage." },
    // 3 — Full Side-Eye
    { t: "An email opens “Per my last email.” Their last email was a calendar invite with no title.", lvl: 3, note: "Dry, devastating, aged in passive-aggressive oak." },
    { t: "Someone stops dead at the top of the escalator to read a text. The stairs keep coming.", lvl: 3, note: "The stairs have one job, friend. The stairs do not care." },
    { t: "A stranger takes a speakerphone call in the dentist’s waiting room. It is about gutters.", lvl: 3, note: "We all know about the gutters now. We have gutter opinions." },
    { t: "Greg from Procurement answers your three-sentence email with a 40-minute meeting called “Alignment.”", lvl: 3, who: "greg", note: "A big, jammy Greg. Pairs with a second monitor he can’t see." },
    { t: "Someone cuts the coffee line and explains, “Sorry, I’m just a very busy person.”", lvl: 3, note: "Full side-eye, held for one long sip. Do not blink first." },
    { t: "Your cousin posts a poll in the group chat, votes in it, then closes the poll. Two minutes total.", lvl: 3, note: "Bold structure, with brief notes of democracy." },
    { t: "Dale borrows your ladder in March. It is October. He has painted it to match his shutters.", lvl: 3, who: "dale", note: "Dale, mid-vintage. Your ladder is now a sage green." },
    // 4 — Side-Eye + Eyebrow
    { t: "Greg from Procurement microwaves tilapia at 10:47 a.m. and announces, “It’s brain food.”", lvl: 4, who: "greg", note: "Aromatic to the fourth floor. The eyebrow is building policy." },
    { t: "The group project member who “did the font.” It was the default font. They did not change it.", lvl: 4, note: "Nose of default settings. Finish of total confidence." },
    { t: "Dale starts the leaf blower at 7:02 a.m. Sunday. There is one leaf. He is chasing it.", lvl: 4, who: "dale", note: "Notes of gasoline and hubris. The leaf left on its own at 7:19." },
    { t: "Someone takes the last of the coffee and leaves a quarter inch, so technically it isn’t empty.", lvl: 4, note: "Bitter, with a long finish of legal technicality." },
    { t: "A colleague “just wants to play devil’s advocate” for 22 minutes of a 30-minute meeting.", lvl: 4, note: "The devil has adequate representation. He didn’t ask for this." },
    { t: "Aunt Dot tells the whole Easter table about your “little writing hobby.” You have published novels.", lvl: 4, who: "dot", note: "Smile. Pass the deviled eggs. Raise the brow to chapter length." },
    { t: "Someone says “No offense,” then pauses so you have time to brace.", lvl: 4, note: "Offense was taken. It was decanted in advance." },
    // 5 — Bless Your Heart
    { t: "A man explains your own job to you. In your meeting. Using your slides.", lvl: 5, note: "Full-bodied. Let it breathe, since he isn’t letting you." },
    { t: "Aunt Dot says “Bless your heart” to you. Then pats your hand twice.", lvl: 5, who: "dot", note: "She knows you know what she meant. The pats were footnotes." },
    { t: "The sweet tea, upon tasting, is unsweet. The pitcher was sweating like it had sugar in it.", lvl: 5, note: "Below the Mason-Dixon, this is a formal matter with a hearing." },
    { t: "Store-bought potato salad, moved into a Pyrex, presented at the potluck as “Mama’s recipe.”", lvl: 5, note: "The tub is in the car. We saw the tub. Mama saw the tub." },
    { t: "Someone visiting for one weekend corrects how you pronounce your own hometown.", lvl: 5, note: "Hand to heart. Slow smile. The good china of slow smiles." },
    { t: "Greg from Procurement repeats your idea ten minutes later, louder, and names it “the Greg Framework.”", lvl: 5, who: "greg", note: "Greg, fully aged. Pour a sweetness that should worry him." },
    { t: "Dale files an HOA complaint about your “excessive porch lighting.” Dale owns a 12-foot inflatable snowman.", lvl: 5, who: "dale", note: "Dale Reserve. Big snowman energy, zero self-awareness." }
  ];

  var ROUND_LEN = 10;
  var CARD_TIME = 5.0;     // seconds to lock in before you blink
  var REVEAL_TIME = 1.55;
  var INTRO_TIME = 0.35;

  // ---------------------------------------------------------------- helpers
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = (Math.random() * (i + 1)) | 0; var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function zpad(n, w) { n = String(n); while (n.length < w) n = "0" + n; return n; }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function pickRound() {
    var byLvl = [[], [], [], [], []];
    SITUATIONS.forEach(function (s) { byLvl[s.lvl - 1].push(s); });
    var out = [];
    byLvl.forEach(function (list) { out = out.concat(shuffle(list.slice()).slice(0, 2)); });
    shuffle(out);
    // avoid identical targets back to back where easy
    for (var i = 1; i < out.length; i++) {
      if (out[i].lvl === out[i - 1].lvl) {
        for (var j = i + 1; j < out.length; j++) {
          if (out[j].lvl !== out[i - 1].lvl && (j + 1 >= out.length || out[j + 1].lvl !== out[i].lvl)) {
            var t = out[i]; out[i] = out[j]; out[j] = t; break;
          }
        }
      }
    }
    return out;
  }

  // expression params by level (index 0 = resting, 1..5 = levels)
  var EXP = {
    shift:  [0,    0.45, 0.72, 1.0,  1.0,  1.0],
    lid:    [0.04, 0.12, 0.26, 0.40, 0.32, 0.40],
    squint: [0,    0,    0.38, 0.22, 0.12, 0.28],
    raise:  [0,    0,   -2,   -3,    5,    7],
    tilt:   [0,    0,    1.5,  3,   -4,   -5],
    arch:   [3,    3,    1,    0.5,  5,    6]
  };
  function expAt(key, e) {
    var arr = EXP[key];
    e = clamp(e, 0, 5);
    var i = Math.floor(e); if (i >= 5) return arr[5];
    return lerp(arr[i], arr[i + 1], e - i);
  }

  var RANKS = [
    { min: 950, name: "GRAND CRU · AUNT DOT RESERVE", verdict: "Aunt Dot has seen your work and has asked to sit somewhere else." },
    { min: 800, name: "GRAND CRU", verdict: "Cellared for decades at family reunions and baby showers. A legend of the eyelid." },
    { min: 600, name: "CERTIFIED SIDE-EYE SOMMELIER", verdict: "You can clear a break room with one eyelid. Please use this power gently." },
    { min: 350, name: "POLITE SKEPTIC", verdict: "Your face said “interesting.” Your face meant “absolutely not.” Solid work." },
    { min: 200, name: "SCREW-TOP SQUINTER", verdict: "Perfectly drinkable. Mostly picked for the label." },
    { min: 0, name: "ACCIDENTAL EYE CONTACT", verdict: "You looked. They saw you look. You both said sorry. Nobody knows why." }
  ];
  function rankObj(score) {
    for (var i = 0; i < RANKS.length; i++) if (score >= RANKS[i].min) return RANKS[i];
    return RANKS[RANKS.length - 1];
  }
  function rankFor(score) { return rankObj(score).name; }

  var PAIRINGS = [
    "Pairs well with: a reply-all, a long hallway, and a slow turn of the head.",
    "Pairs well with: a 9x13 casserole of unknown origin and a long, wordless sip.",
    "Pairs well with: a porch glider with a clear view of Dale.",
    "Pairs well with: a cc line and nothing at all in the body of the email.",
    "Pairs well with: a lukewarm decaf and Greg’s 4:45 p.m. Friday sync. Decline politely.",
    "Pairs well with: a paper-fan flutter and the phrase “well, I never.”"
  ];

  function tastingNotes(score, results) {
    var lines = [];
    var rank = rankObj(score);
    lines.push(rank.verdict);

    var signed = 0, n = 0, blinks = 0, kisses = 0, cast = { greg: 0, dale: 0, dot: 0 };
    results.forEach(function (r) {
      if (r.who) cast[r.who]++;
      if (r.timeout) { blinks++; return; }
      signed += r.chosen - r.target; n++;
      if (r.chef) kisses++;
    });
    var avg = n ? signed / n : 0;
    var paired = results.filter(function (r) { return !r.timeout && r.chosen === r.target; }).length;

    // region + palate
    var region;
    if (!n) region = "Region: The Blink Valley. Palate: still loading.";
    else if (avg > 0.5) region = "Region: Côtes de Bless Your Heart. Runs hot: a full glare where a glance would do.";
    else if (avg < -0.5) region = "Region: Lower Squint Valley. Runs cool: met real crimes with a polite “hm.”";
    else if (paired >= 5) region = "Region: Sideways Valley. Balanced: offense and glare arrive together.";
    else region = "Region: The Cul-de-Sac. The glare and the offense kept missing each other in the lobby.";
    lines.push(region);

    // finish
    var finish;
    if (kisses >= 3) finish = "Finish: long and smug, with " + kisses + " chef’s kisses on the palate.";
    else if (blinks >= 3) finish = "Finish: heavy sediment. Blinked " + blinks + " times. They all got away with it.";
    else if (blinks) finish = "Finish: slight sediment. Blinked " + blinks + (blinks === 1 ? " time" : " times") + ", which is " + blinks + " more than Aunt Dot.";
    else finish = "Finish: clean. Never blinked once. Unsettling, in a good way.";
    lines.push(finish);

    // the recurring cast remembers you
    if (cast.greg >= 2) lines.push("Greg from Procurement appeared " + cast.greg + " times. He would like to circle back on these notes.");
    else if (cast.dale >= 2) lines.push("Dale next door appeared " + cast.dale + " times. The leaf blower is warming up as we speak.");
    else if (cast.dot >= 1) lines.push("Aunt Dot was served. She says your score is “real good, for you.”");
    else if (cast.greg) lines.push("A trace of Greg from Procurement on the nose. He has sent a calendar hold titled “Notes.”");
    else if (cast.dale) lines.push("A trace of Dale on the nose. He still has your ladder.");

    // Dolly Scale (calibrated by hand, with rhinestones)
    var dolly = Math.max(0.1, score / 1000 * 9).toFixed(1);
    lines.push("Dolly Scale reading: " + dolly + " out of 9 (to 5).");

    lines.push(PAIRINGS[(Math.random() * PAIRINGS.length) | 0]);
    return lines;
  }

  // ---------------------------------------------------------------- styles
  function injectStyles() {
    if (document.getElementById("hcsom-styles")) return;
    var st = document.createElement("style");
    st.id = "hcsom-styles";
    st.textContent =
      ".hcsom-root{position:relative;width:100%;background:" + C.ink + ";border:3px solid " + C.ink + ";box-sizing:border-box;overflow:hidden;outline:none;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation;}" +
      ".hcsom-root:focus-visible{box-shadow:0 0 0 3px " + C.yellow + ";}" +
      ".hcsom-canvas{display:block;width:100%;height:100%;cursor:pointer;}" +
      ".hcsom-scan{position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(to bottom,rgba(0,0,0,0) 0,rgba(0,0,0,0) 2px,rgba(0,0,0,.16) 3px,rgba(0,0,0,0) 4px);mix-blend-mode:multiply;}" +
      ".hcsom-vig{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 60%,rgba(0,0,0,.35) 100%);}" +
      ".hcsom-mute{position:absolute;right:8px;bottom:8px;font:700 10px/1 " + F.mono + ";letter-spacing:.06em;color:" + C.paper + ";background:" + C.ink + ";border:2px solid " + C.paper + ";padding:5px 7px;cursor:pointer;z-index:2;}" +
      ".hcsom-mute[aria-pressed=true]{background:" + C.pink + ";border-color:" + C.pink + ";color:" + C.ink + ";}" +
      ".hcsom-mute:focus-visible{outline:2px solid " + C.yellow + ";outline-offset:2px;}" +
      ".hcsom-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;}";
    document.head.appendChild(st);
  }

  // ---------------------------------------------------------------- audio
  function makeAudio() {
    var ctx = null, on = false;
    function ensure() {
      if (!ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        try { ctx = new AC(); } catch (e) { return null; }
      }
      if (ctx.state === "suspended") ctx.resume();
      return ctx;
    }
    function tone(freq, start, dur, type, vol) {
      var a = ctx; if (!a) return;
      var t0 = a.currentTime + start;
      var o = a.createOscillator(), g = a.createGain();
      o.type = type || "square"; o.frequency.setValueAtTime(freq, t0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(vol || 0.06, t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(a.destination);
      o.start(t0); o.stop(t0 + dur + 0.02);
    }
    return {
      get on() { return on; },
      set: function (v) { on = v; if (on) ensure(); else if (ctx && ctx.state === "running") ctx.suspend(); },
      play: function (kind) {
        if (!on || !ensure()) return;
        if (kind === "lock") tone(440, 0, 0.08, "square", 0.05);
        else if (kind === "chef") { tone(660, 0, 0.09); tone(880, 0.08, 0.09); tone(1320, 0.16, 0.18, "triangle", 0.07); }
        else if (kind === "good") { tone(523, 0, 0.1); tone(784, 0.09, 0.14, "triangle"); }
        else if (kind === "meh") tone(330, 0, 0.16, "triangle", 0.05);
        else if (kind === "bad") { tone(180, 0, 0.18, "sawtooth", 0.04); tone(140, 0.12, 0.2, "sawtooth", 0.04); }
        else if (kind === "start") { tone(392, 0, 0.08); tone(523, 0.08, 0.08); tone(659, 0.16, 0.12); }
        else if (kind === "end") { tone(659, 0, 0.12, "triangle"); tone(523, 0.12, 0.12, "triangle"); tone(784, 0.24, 0.3, "triangle"); }
      },
      close: function () { if (ctx) { try { ctx.close(); } catch (e) {} ctx = null; } }
    };
  }

  // ---------------------------------------------------------------- pixel eye
  var EW = 72, EH = 50;
  function hexRGB(h) { return [parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16)]; }
  var RGB = {
    paper: hexRGB(C.paper), ink: hexRGB(C.ink), pink: hexRGB(C.pink), pinkDark: hexRGB(C.pinkDark),
    yellow: hexRGB(C.yellow), grey: hexRGB(C.grey), shade: hexRGB("#D9CFBF")
  };

  function EyeRenderer() {
    var cv = document.createElement("canvas");
    cv.width = EW; cv.height = EH;
    var cx2 = cv.getContext("2d");
    var img = cx2.createImageData(EW, EH);
    var d = img.data;
    var inside = new Uint8Array(EW * EH);   // 1 sclera, 2 lid
    function set(x, y, rgb) {
      if (x < 0 || y < 0 || x >= EW || y >= EH) return;
      var i = (y * EW + x) * 4; d[i] = rgb[0]; d[i + 1] = rgb[1]; d[i + 2] = rgb[2]; d[i + 3] = 255;
    }
    this.canvas = cv;
    this.draw = function (e, blink, time, lookX) {
      d.fill(0); inside.fill(0);
      var cx = 36, cy = 30, A = 27, H = 14;
      var shift = expAt("shift", e), lid = Math.max(expAt("lid", e), blink), squint = expAt("squint", e) * (1 - blink);
      var raise = expAt("raise", e), tilt = expAt("tilt", e), arch = expAt("arch", e);
      if (lookX !== undefined) shift = lookX;
      var x, y, u, s, top, lidY, low;
      var lidRow = new Int16Array(EW).fill(-1);
      for (x = 0; x < EW; x++) {
        u = (x + 0.5 - (cx - A)) / (2 * A);
        if (u <= 0 || u >= 1) continue;
        s = Math.pow(Math.sin(Math.PI * u), 0.85);
        top = cy - H * s;
        lidY = cy - H * s * (1 - 2 * lid) + lid * 3.5 * (u - 0.5) * 2;
        low = cy + H * 0.82 * s * (1 - squint);
        if (lidY < top) lidY = top;
        for (y = 0; y < EH; y++) {
          var yc = y + 0.5;
          if (yc >= top && yc <= low + 0.01) {
            inside[y * EW + x] = yc < lidY ? 2 : 1;
          }
        }
        lidRow[x] = Math.round(lidY);
      }
      // pupil / iris
      var px = cx + shift * A * 0.58;
      var py = cy + 1;
      var rI = 9, rP = 4.6;
      for (y = 0; y < EH; y++) for (x = 0; x < EW; x++) {
        var k = inside[y * EW + x];
        if (!k) continue;
        if (k === 2) continue; // lowered lid: the eye simply narrows
        var dx = x + 0.5 - px, dy = y + 0.5 - py, dd = dx * dx + dy * dy;
        if (dd <= rP * rP) set(x, y, RGB.ink);
        else if (dd <= rI * rI) set(x, y, (dd > (rI - 1.4) * (rI - 1.4)) ? RGB.pinkDark : RGB.pink);
        else {
          // soft shadow under the lid line
          var lr = lidRow[x];
          set(x, y, (lr >= 0 && y <= lr + 1) ? RGB.shade : RGB.paper);
        }
      }
      // highlight
      var hx = Math.round(px - 4), hy = Math.round(py - 4);
      if (inside[hy * EW + hx] === 1) { set(hx, hy, RGB.paper); set(hx + 1, hy, RGB.paper); set(hx, hy + 1, RGB.paper); }
      // lid edge (lash line) — 2px ink
      for (x = 0; x < EW; x++) {
        var lr2 = lidRow[x]; if (lr2 < 0) continue;
        var hasS = false;
        for (y = 0; y < EH; y++) if (inside[y * EW + x] === 1) { hasS = true; break; }
        if (!hasS) continue;
        set(x, y - 1, RGB.pink); set(x, y - 2, RGB.pink);
        if (lid > 0.14) {
          u = (x + 0.5 - (cx - A)) / (2 * A);
          var crease = Math.round(cy - H * Math.pow(Math.sin(Math.PI * u), 0.85)) - 1;
          if (crease < y - 4) set(x, crease, RGB.grey);
        }
      }
      // lower outline (grey) under the sclera
      for (y = 0; y < EH; y++) for (x = 0; x < EW; x++) {
        if (inside[y * EW + x] === 1 || d[(y * EW + x) * 4 + 3]) continue;
        if (y > 0 && inside[(y - 1) * EW + x] === 1) set(x, y, RGB.grey);
      }
      // lashes at the outer corner (wing)
      var wingX = cx + A, wingY = cy - 1;
      set(wingX, wingY - 1, RGB.pink); set(wingX + 1, wingY - 2, RGB.pink); set(wingX + 2, wingY - 3, RGB.pink); set(wingX + 1, wingY - 1, RGB.pink);
      // brow
      var bx0 = cx - A + 3, bx1 = cx + A - 1;
      var baseY = cy - H - 6 - raise;
      for (x = bx0; x <= bx1; x++) {
        u = (x - bx0) / (bx1 - bx0);
        var archPos = e >= 3.5 ? 0.62 : 0.5;
        var a = Math.sin(Math.PI * clamp(u / archPos * 0.5, 0, 0.5) + (u > archPos ? Math.PI * 0.5 * (u - archPos) / (1 - archPos) : 0));
        var by = Math.round(baseY - arch * a + tilt * (u - 0.5) * 2);
        var thick = u < 0.15 ? 2 : u > 0.85 ? 2 : 3;
        for (var t = 0; t < thick; t++) set(x, by + t, RGB.paper);
      }
      // level 5: sparkle of Southern menace + a tiny heart
      if (e > 4.4) {
        var amt = clamp((e - 4.4) / 0.6, 0, 1);
        var tw = (Math.sin(time * 9) + 1) / 2;
        var sx = Math.round(px + 3), sy = Math.round(py - 3);
        if (inside[sy * EW + sx] === 1) set(sx, sy, RGB.yellow);
        if (amt > 0.3) {
          var stx = cx + A + 3, sty = cy - H - 2;
          var L = tw > 0.5 ? 2 : 1;
          for (var q = -L; q <= L; q++) { set(stx + q, sty, RGB.yellow); set(stx, sty + q, RGB.yellow); }
          var st2x = cx + A - 4, st2y = cy - H - 10;
          var L2 = tw > 0.5 ? 1 : 2;
          for (q = -L2; q <= L2; q++) { set(st2x + q, st2y, RGB.yellow); set(st2x, st2y + q, RGB.yellow); }
        }
        if (amt > 0.6) {
          var hx0 = cx - A - 1, hy0 = cy + H - 2;
          var heart = ["01010", "11111", "11111", "01110", "00100"];
          for (var r = 0; r < 5; r++) for (var c = 0; c < 5; c++) if (heart[r][c] === "1") set(hx0 + c, hy0 + r, RGB.pink);
        }
      }
      cx2.putImageData(img, 0, 0);
    };
  }

  // ---------------------------------------------------------------- canvas text helpers
  function wrap(ctx, text, maxW) {
    var words = text.split(" "), lines = [], line = "";
    for (var i = 0; i < words.length; i++) {
      var test = line ? line + " " + words[i] : words[i];
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = words[i]; }
      else line = test;
    }
    if (line) lines.push(line);
    return lines;
  }
  function fitWrap(ctx, text, fontFn, maxW, maxH, maxSize, minSize, lh) {
    for (var sz = maxSize; sz >= minSize; sz--) {
      ctx.font = fontFn(sz);
      var lines = wrap(ctx, text, maxW);
      if (lines.length * sz * lh <= maxH) return { size: sz, lines: lines };
    }
    ctx.font = fontFn(minSize);
    return { size: minSize, lines: wrap(ctx, text, maxW) };
  }
  function fitText(ctx, text, fontFn, maxW, maxSize, minSize) {
    for (var sz = maxSize; sz > minSize; sz--) {
      ctx.font = fontFn(sz);
      if (ctx.measureText(text).width <= maxW) return sz;
    }
    ctx.font = fontFn(minSize);
    return minSize;
  }
  function box(ctx, x, y, w, h, fill, shadow, border) {
    if (shadow) { ctx.fillStyle = shadow; ctx.fillRect(x + 5, y + 5, w, h); }
    ctx.fillStyle = border || C.ink; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = fill; ctx.fillRect(x + 3, y + 3, w - 6, h - 6);
  }
  function sticker(ctx, text, cx, cy, angle, size, bg, fg) {
    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(angle);
    ctx.font = "400 " + size + "px " + F.display;
    var w = ctx.measureText(text).width + size * 1.2, h = size * 1.9;
    ctx.fillStyle = C.ink; ctx.fillRect(-w / 2 + 4, -h / 2 + 4, w, h);
    ctx.fillStyle = bg; ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.strokeRect(-w / 2 + 1, -h / 2 + 1, w - 2, h - 2);
    ctx.fillStyle = fg; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(text, 0, size * 0.06);
    ctx.restore();
  }
  function fnt(weight, family) { return function (sz) { return weight + " " + sz + "px " + family; }; }

  // ---------------------------------------------------------------- mount
  function mount(container) {
    injectStyles();
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var root = document.createElement("div");
    root.className = "hcsom-root";
    root.tabIndex = 0;
    root.setAttribute("role", "application");
    root.setAttribute("aria-label", "Side-Eye Sommelier game. Press Space or tap to play.");
    var canvas = document.createElement("canvas");
    canvas.className = "hcsom-canvas";
    var scan = document.createElement("div"); scan.className = "hcsom-scan";
    var vig = document.createElement("div"); vig.className = "hcsom-vig";
    var mute = document.createElement("button");
    mute.type = "button"; mute.className = "hcsom-mute";
    mute.setAttribute("aria-pressed", "false");
    mute.textContent = "SOUND: OFF";
    var live = document.createElement("div");
    live.className = "hcsom-sr"; live.setAttribute("aria-live", "polite");
    root.appendChild(canvas); root.appendChild(vig); root.appendChild(scan); root.appendChild(mute); root.appendChild(live);
    container.innerHTML = "";
    container.appendChild(root);

    var ctx = canvas.getContext("2d");
    var eye = new EyeRenderer();
    var audio = makeAudio();
    var W = 0, H = 0, dpr = 1;

    var best = 0;
    try { best = parseInt(localStorage.getItem(BEST_KEY), 10) || 0; } catch (e) {}

    // ---------------- state
    var S = {
      mode: "title",      // title | play | results
      t: 0,               // global clock (game-time, pauses)
      modeT: 0,
      round: [], idx: 0, score: 0, results: [],
      phase: "intro",     // intro | aim | reveal
      phaseT: 0, meter: 0, mPhase: 0, period: 2, chosen: 0, last: null,
      eyeE: 0, eyeTarget: 0, blink: 0, nextBlink: 2, idleLook: 0, idleLookT: 0,
      newBest: false, shake: 0
    };

    function announce(msg) { live.textContent = msg; }

    function startGame() {
      S.mode = "play"; S.modeT = 0;
      S.round = pickRound(); S.idx = 0; S.score = 0; S.results = []; S.newBest = false;
      startCard();
      audio.play("start");
    }
    function startCard() {
      S.phase = "intro"; S.phaseT = 0;
      S.period = Math.max(0.85, 2.0 - S.idx * 0.125);
      S.mPhase = Math.random();
      S.meter = tri(S.mPhase);
      announce("Offense " + (S.idx + 1) + " of " + ROUND_LEN + ": " + S.round[S.idx].t);
    }
    function tri(p) { p = p - Math.floor(p); return p < 0.5 ? p * 2 : 2 - p * 2; }

    function lockIn(timeout) {
      var sit = S.round[S.idx];
      var v = S.meter;
      var pos = v * 5;
      var chosen = Math.min(5, Math.floor(pos) + 1);
      var r = { target: sit.lvl, who: sit.who || "", chosen: chosen, timeout: !!timeout, chef: false, pts: 0, verdict: "", sub: "" };
      if (timeout) {
        r.verdict = "YOU BLINKED"; r.sub = "You blinked. They got away with it. They always do.";
        r.chosen = sit.lvl; // for display only
        audio.play("bad");
      } else {
        var dist = Math.abs(pos - (sit.lvl - 0.5));
        var diff = chosen - sit.lvl;
        if (diff === 0) {
          if (dist <= 0.18) { r.pts = 100; r.chef = true; r.verdict = "CHEF’S KISS"; r.sub = "Poured to the line."; audio.play("chef"); }
          else { r.pts = Math.round(60 + 30 * (1 - clamp((dist - 0.18) / 0.32, 0, 1))); r.verdict = "WELL PAIRED"; r.sub = "Correct glare, nice legs."; audio.play("good"); }
        } else if (Math.abs(diff) === 1) {
          r.pts = 25;
          r.verdict = diff > 0 ? "A BIT HEAVY" : "UNDER-POURED";
          r.sub = diff > 0 ? "Over-poured by one notch." : "One notch shy of justice.";
          audio.play("meh");
        } else {
          r.pts = Math.abs(diff) === 2 ? 8 : 0;
          r.verdict = diff > 0 ? "WAY TOO OAKY" : "BARELY A SIP";
          r.sub = diff > 0 ? "That much eye for this? Bold." : "That offense deserved more eye.";
          audio.play("bad");
          S.shake = reduced ? 0 : 0.25;
        }
      }
      S.score += r.pts;
      S.results.push(r);
      S.last = r;
      S.chosen = chosen;
      S.phase = "reveal"; S.phaseT = 0;
      announce(r.verdict + ". Called for " + LEVELS[sit.lvl - 1] + ". " + r.pts + " points.");
    }

    function nextCard() {
      S.idx++;
      if (S.idx >= ROUND_LEN) endGame();
      else startCard();
    }
    function endGame() {
      S.mode = "results"; S.modeT = 0;
      if (S.score > best) {
        best = S.score; S.newBest = true;
        try { localStorage.setItem(BEST_KEY, String(best)); } catch (e) {}
      }
      S.notes = tastingNotes(S.score, S.results);
      audio.play("end");
      announce("Final score " + S.score + ". Rank: " + rankFor(S.score) + ". " + S.notes.join(" ") + " Press Space or tap to play again.");
    }

    function action() {
      if (S.mode === "title") { if (S.modeT > 0.15) startGame(); }
      else if (S.mode === "play") {
        if (S.phase === "aim") { lockIn(false); audio.play("lock"); }
        else if (S.phase === "reveal" && S.phaseT > 0.45) nextCard();
      } else if (S.mode === "results") { if (S.modeT > 0.9) startGame(); }
    }

    // ---------------- input
    function onPointer(ev) {
      if (ev.button !== undefined && ev.button !== 0) return;
      try { root.focus({ preventScroll: true }); } catch (e) { root.focus(); }
      ev.preventDefault();
      action();
    }
    function onKey(ev) {
      var k = ev.key;
      if (ev.target === mute) return;
      if (k === " " || k === "Spacebar" || k === "Enter") {
        ev.preventDefault();
        if (!ev.repeat) action();
      } else if ((k === "ArrowUp" || k === "ArrowDown" || k === "ArrowLeft" || k === "ArrowRight") && S.mode === "play") {
        ev.preventDefault();
      } else if (k === "m" || k === "M") {
        toggleMute();
      }
    }
    function toggleMute() {
      audio.set(!audio.on);
      mute.setAttribute("aria-pressed", audio.on ? "true" : "false");
      mute.textContent = audio.on ? "SOUND: ON" : "SOUND: OFF";
    }
    function onMute(ev) { ev.stopPropagation(); toggleMute(); }
    function stopProp(ev) { ev.stopPropagation(); }
    canvas.addEventListener("pointerdown", onPointer);
    root.addEventListener("keydown", onKey);
    mute.addEventListener("click", onMute);
    mute.addEventListener("pointerdown", stopProp);

    // ---------------- sizing
    function resize() {
      var w = container.clientWidth || 640;
      var h = Math.round(clamp(w * 0.75, 380, 640));
      if (w < 420) h = Math.round(clamp(w * 1.18, 380, 520)); // taller on phones so text breathes
      root.style.height = h + "px";
      dpr = Math.min(window.devicePixelRatio || 1, 3);
      W = root.clientWidth - 6 || w; H = h - 6;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      draw();
    }
    var ro = null;
    if (window.ResizeObserver) { ro = new ResizeObserver(function () { resize(); }); ro.observe(container); }
    else window.addEventListener("resize", resize);

    // ---------------- loop & pausing
    var raf = 0, lastTs = 0, hidden = document.hidden, offscreen = false, destroyed = false;
    function running() { return !hidden && !offscreen && !destroyed; }
    function loop(ts) {
      raf = 0;
      if (!running()) return;
      var dt = lastTs ? Math.min(0.05, (ts - lastTs) / 1000) : 0;
      lastTs = ts;
      update(dt);
      draw();
      raf = requestAnimationFrame(loop);
    }
    function kick() { if (!raf && running()) { lastTs = 0; raf = requestAnimationFrame(loop); } }
    function halt() { if (raf) cancelAnimationFrame(raf); raf = 0; }
    function onVis() { hidden = document.hidden; if (hidden) halt(); else kick(); }
    document.addEventListener("visibilitychange", onVis);
    var io = null;
    if (window.IntersectionObserver) {
      io = new IntersectionObserver(function (entries) {
        offscreen = !entries[0].isIntersecting;
        if (offscreen) halt(); else kick();
      }, { threshold: 0.05 });
      io.observe(root);
    }

    // ---------------- update
    function update(dt) {
      S.t += dt; S.modeT += dt;
      if (S.shake > 0) S.shake = Math.max(0, S.shake - dt);
      // blinking (idle only)
      S.nextBlink -= dt;
      if (S.nextBlink <= 0) { S.blink = 1; S.nextBlink = 2.5 + Math.random() * 3; }
      S.blink = Math.max(0, S.blink - dt * 7);

      if (S.mode === "title") {
        S.idleLookT -= dt;
        if (S.idleLookT <= 0) { S.idleLook = [0, 0, 3, 1, 4, 2][(Math.random() * 6) | 0]; S.idleLookT = 1.4 + Math.random() * 1.4; }
        S.eyeTarget = S.idleLook;
      } else if (S.mode === "play") {
        S.phaseT += dt;
        if (S.phase === "intro") {
          S.eyeTarget = 0;
          if (S.phaseT >= (reduced ? 0.15 : INTRO_TIME)) { S.phase = "aim"; S.phaseT = 0; }
        } else if (S.phase === "aim") {
          S.mPhase += dt / S.period;
          S.meter = tri(S.mPhase);
          S.eyeTarget = S.meter * 5;
          if (S.phaseT >= CARD_TIME) lockIn(true);
        } else if (S.phase === "reveal") {
          S.eyeTarget = S.last.timeout ? 0 : S.chosen; // land on the chosen level
          if (S.phaseT >= REVEAL_TIME) nextCard();
        }
      } else if (S.mode === "results") {
        S.eyeTarget = S.score >= 600 ? 5 : S.score >= 350 ? 3 : 1;
      }
      var follow = S.mode === "play" && S.phase === "aim" ? 18 : 9;
      S.eyeE += (S.eyeTarget - S.eyeE) * Math.min(1, dt * follow);
      if (S.mode === "play" && S.phase !== "reveal") S.blink = 0;
    }

    // ---------------- draw
    function bg() {
      ctx.fillStyle = C.ink; ctx.fillRect(0, 0, W, H);
      // halftone dots, denser toward bottom
      ctx.fillStyle = "rgba(243,236,223,0.05)";
      var step = 9;
      for (var y = 0; y < H; y += step) {
        var r = 0.6 + (y / H) * 1.3;
        for (var x = ((y / step) % 2) * step / 2; x < W; x += step) {
          ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
        }
      }
    }

    function drawEyeAt(cx, cy, maxW, maxH, e, blink, lookX) {
      eye.draw(e, blink, S.t, lookX);
      var sc = Math.max(1, Math.floor(Math.min(maxW / EW, maxH / EH) * dpr)) / dpr;
      var w = EW * sc, h = EH * sc;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(eye.canvas, Math.round((cx - w / 2) * dpr) / dpr, Math.round((cy - h / 2) * dpr) / dpr, w, h);
      return { w: w, h: h };
    }

    function drawTitle() {
      var pad = Math.max(12, W * 0.04);
      // masthead
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.fillStyle = C.yellow;
      var kSize = fitText(ctx, "THE SIDE EYE WINE LIST · EST. YOUR MOTHER", fnt("700", F.mono), W - pad * 2, 12, 8);
      ctx.fillText("THE SIDE EYE WINE LIST · EST. YOUR MOTHER", W / 2, pad + kSize);
      var tSize = fitText(ctx, "SIDE-EYE SOMMELIER", fnt("400", F.display), W - pad * 2, Math.min(56, H * 0.11), 18);
      var ty = pad + kSize + 8 + tSize;
      ctx.fillStyle = C.pinkDark; ctx.fillText("SIDE-EYE SOMMELIER", W / 2 + 3, ty + 3);
      ctx.fillStyle = C.pink; ctx.fillText("SIDE-EYE SOMMELIER", W / 2, ty);
      var sub = "Match the degree of side-eye to the offense.";
      var sSize = fitText(ctx, sub, fnt("italic 500", F.serif), W - pad * 2, 18, 11);
      ctx.fillStyle = C.paper; ctx.fillText(sub, W / 2, ty + sSize + 10);

      var eyeTop = ty + sSize + 18, eyeBot = H * 0.74;
      var dims = drawEyeAt(W / 2, (eyeTop + eyeBot) / 2, W * 0.5, eyeBot - eyeTop, S.eyeE, S.blink);

      // scale legend
      var ly = eyeBot + 6;
      var legend = "1 GLANCE · 2 SQUINT · 3 FULL SIDE-EYE · 4 +EYEBROW · 5 BLESS YOUR HEART";
      var lSize = fitText(ctx, legend, fnt("700", F.mono), W - pad * 2, 11, 7);
      ctx.fillStyle = C.grey;
      if (ctx.measureText(legend).width > W - pad * 2) {
        ctx.fillText("1 GLANCE · 2 SQUINT · 3 SIDE-EYE", W / 2, ly + lSize);
        ctx.fillText("4 +EYEBROW · 5 BLESS YOUR HEART", W / 2, ly + lSize * 2 + 4);
        ly += lSize + 4;
      } else ctx.fillText(legend, W / 2, ly + lSize);

      // press start
      var blinkOn = reduced || (Math.floor(S.t * 2) % 2 === 0);
      var ps = "PRESS START / TAP TO PLAY";
      var pSize = fitText(ctx, ps, fnt("400", F.pixel), W - pad * 2, 14, 8);
      var py = Math.min(H - pad - 22, ly + lSize + pSize + 16);
      if (blinkOn) { ctx.fillStyle = C.yellow; ctx.fillText(ps, W / 2, py); }
      ctx.font = fnt("700", F.mono)(Math.max(9, Math.min(11, W / 50)));
      ctx.fillStyle = C.teal;
      ctx.textAlign = "left";
      ctx.fillText("BEST " + pad0(best), pad, H - pad + 2);
      void dims;
    }
    function pad0(n) { return zpad(n, 4); }

    function drawPlay() {
      var sit = S.round[S.idx];
      var pad = Math.max(10, W * 0.025);
      var hud = Math.max(22, Math.min(30, H * 0.06));
      var shakeX = S.shake > 0 ? Math.sin(S.t * 90) * 4 * (S.shake / 0.25) : 0;
      ctx.save(); ctx.translate(shakeX, 0);

      // HUD
      var hSize = Math.max(8, Math.min(12, W / 55));
      ctx.font = fnt("400", F.pixel)(hSize);
      ctx.textBaseline = "middle";
      ctx.textAlign = "left"; ctx.fillStyle = C.paper;
      ctx.fillText("NO." + zpad(S.idx + 1, 2) + "/" + ROUND_LEN, pad, pad + hud / 2 - 2);
      ctx.textAlign = "right"; ctx.fillStyle = C.yellow;
      ctx.fillText("SCORE " + pad0(S.score), W - pad, pad + hud / 2 - 2);
      // timer bar
      var tbY = pad + hud - 4, tbW = W - pad * 2;
      ctx.fillStyle = "#2A2A2A"; ctx.fillRect(pad, tbY, tbW, 4);
      var frac = S.phase === "aim" ? 1 - S.phaseT / CARD_TIME : S.phase === "intro" ? 1 : 0;
      ctx.fillStyle = frac < 0.3 ? C.pink : C.teal;
      ctx.fillRect(pad, tbY, tbW * clamp(frac, 0, 1), 4);

      // situation card
      var cardY = tbY + 12, cardH = Math.max(96, H * (W < 520 ? 0.3 : 0.25)), cardW = W - pad * 2 - 6;
      var noteRoom = Math.max(18, Math.min(26, W / 30));
      // reserve enough room for the sommelier note (it may wrap) so it never sits on the offense text
      (function () {
        var vSz = Math.max(13, Math.min(26, W / 24));
        ctx.font = "400 " + vSz + "px " + F.display;
        var swMax = 0;
        ["CHEF’S KISS", "WELL PAIRED", "A BIT HEAVY", "UNDER-POURED", "WAY TOO OAKY", "BARELY A SIP", "YOU BLINKED"].forEach(function (v) {
          swMax = Math.max(swMax, ctx.measureText(v).width + vSz * 1.2);
        });
        var nW0 = cardW - 28 - (W < 520 ? 0 : swMax + 10);
        var longest = "You blinked. They got away with it. They always do.";
        var nf = fitWrap(ctx, sit.note.length > longest.length ? sit.note : longest, fnt("italic 500", F.serif), nW0, Math.max(18, Math.min(26, W / 30)) * 1.25, Math.min(17, W / 34), 10, 1.15);
        var need = (W < 520 ? vSz * 0.9 : 0) + (nf.lines.length - 1) * nf.size * 1.15 + nf.size + 4;
        if (need > noteRoom) { cardH += need - noteRoom; noteRoom = need; }
      })();
      var slide = S.phase === "intro" && !reduced ? (1 - easeOut(S.phaseT / INTRO_TIME)) * (W * 0.6) : 0;
      ctx.save(); ctx.translate(slide, 0);
      box(ctx, pad, cardY, cardW, cardH, C.paper, C.pink);
      var inX = pad + 14, inW = cardW - 28;
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      var lab = "THE OFFENSE — NO." + zpad(S.idx + 1, 2);
      var labSize = Math.max(9, Math.min(11, W / 60));
      ctx.font = fnt("700", F.mono)(labSize); ctx.fillStyle = C.pinkDark;
      ctx.fillText(lab, inX, cardY + 10 + labSize);
      var fit = fitWrap(ctx, sit.t, fnt("700", F.serif), inW, cardH - labSize - 30 - noteRoom, Math.min(30, W / 22), 13, 1.18);
      ctx.fillStyle = C.ink;
      for (var i = 0; i < fit.lines.length; i++) ctx.fillText(fit.lines[i], inX, cardY + 16 + labSize + fit.size * (1 + i * 1.18));
      ctx.restore();

      // stage
      var stageTop = cardY + cardH + 14, stageBot = H - pad - 34;
      var meterW = Math.max(64, Math.min(170, W * 0.25));
      var meterX = W - pad - meterW;
      var eyeAreaW = meterX - pad - 10;
      var labelH = Math.max(18, H * 0.05);
      var eyeCY = stageTop + (stageBot - stageTop - labelH) / 2;
      var dims = drawEyeAt(pad + eyeAreaW / 2, eyeCY, eyeAreaW * 0.92, stageBot - stageTop - labelH - 8, S.eyeE, S.blink);

      // live level label under eye
      var showLvl = S.phase === "reveal" ? S.chosen : Math.min(5, Math.floor(S.meter * 5) + 1);
      var lblText = (S.phase === "reveal" && S.last.timeout) ? "…" : showLvl + " · " + LEVELS[showLvl - 1];
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      var lSize = fitText(ctx, lblText, fnt("400", F.pixel), eyeAreaW - 8, Math.min(14, labelH * 0.7), 7);
      ctx.fillStyle = S.phase === "intro" ? C.grey : BAND_COLORS[showLvl - 1];
      ctx.fillText(lblText, pad + eyeAreaW / 2, Math.min(stageBot, eyeCY + dims.h / 2 + lSize + 10));

      // meter
      drawMeter(meterX, stageTop, meterW, stageBot - stageTop, sit);

      // footer hint
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.font = fnt("700", F.mono)(Math.max(9, Math.min(11, W / 60)));
      ctx.fillStyle = C.grey;
      var hint = S.phase === "reveal" ? "TAP / SPACE: NEXT POUR" : "TAP / SPACE: LOCK IT IN";
      ctx.fillText(hint, pad, H - pad + 2);

      ctx.restore();

      if (S.phase === "reveal") drawReveal(sit, pad, cardY, cardW, cardH);
    }

    function drawMeter(x, y, w, h, sit) {
      // frame
      box(ctx, x, y, w, h, "#1B1B1B", null, C.paper);
      var ix = x + 5, iy = y + 5, iw = w - 10, ih = h - 10;
      var bandH = ih / 5;
      var revealing = S.phase === "reveal";
      for (var b = 0; b < 5; b++) {
        var by = iy + ih - (b + 1) * bandH;
        var isTarget = revealing && sit.lvl === b + 1;
        ctx.globalAlpha = revealing ? (isTarget ? 1 : 0.28) : 0.85;
        ctx.fillStyle = BAND_COLORS[b];
        ctx.fillRect(ix, by + 1, iw, bandH - 2);
        ctx.globalAlpha = 1;
        // label
        var full = (b + 1) + " " + LEVELS[b];
        var lbl = full;
        var size = Math.max(7, Math.min(11, bandH * 0.32));
        ctx.font = fnt("700", F.mono)(size);
        if (ctx.measureText(lbl).width > iw - 14) lbl = (b + 1) + " " + LEVELS_SHORT[b];
        if (ctx.measureText(lbl).width > iw - 14) { size = Math.max(7, size - 2); ctx.font = fnt("700", F.mono)(size); }
        if (ctx.measureText(lbl).width > iw - 14) lbl = String(b + 1);
        ctx.fillStyle = C.ink; ctx.textAlign = "left"; ctx.textBaseline = "middle";
        ctx.fillText(lbl, ix + 9, by + bandH / 2 + 1);
        if (isTarget) {
          ctx.strokeStyle = C.paper; ctx.lineWidth = 3;
          ctx.strokeRect(ix - 1, by, iw + 2, bandH);
        }
      }
      // center ticks (sweet spots)
      ctx.fillStyle = "rgba(20,20,20,.55)";
      for (b = 0; b < 5; b++) {
        var cyb = iy + ih - (b + 0.5) * bandH;
        ctx.fillRect(ix, cyb - 1, 5, 2);
      }
      // pointer
      if (S.phase !== "intro") {
        var mv = S.meter;
        var py = iy + ih - mv * ih;
        if (!(revealing && S.last.timeout)) {
          ctx.fillStyle = C.ink; ctx.fillRect(ix - 4, py - 3, iw + 8, 6);
          ctx.fillStyle = C.paper; ctx.fillRect(ix - 4, py - 1, iw + 8, 2);
          // arrow on left
          ctx.fillStyle = C.paper;
          ctx.beginPath(); ctx.moveTo(x - 9, py - 7); ctx.lineTo(x - 1, py); ctx.lineTo(x - 9, py + 7); ctx.closePath(); ctx.fill();
        }
      }
      // caption above
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.font = fnt("700", F.mono)(9);
      ctx.fillStyle = C.grey;
    }

    function drawReveal(sit, pad, cardY, cardW, cardH) {
      var r = S.last;
      var p = clamp(S.phaseT / 0.25, 0, 1);
      var sc = reduced ? 1 : 0.6 + 0.4 * easeOut(p) + (p < 1 ? 0 : 0);
      var col = r.chef ? C.yellow : r.pts >= 60 ? C.teal : r.pts >= 25 ? C.paper : C.pink;
      var vSize = Math.max(13, Math.min(26, W / 24));
      ctx.font = "400 " + vSize + "px " + F.display;
      var sw = ctx.measureText(r.verdict).width + vSize * 1.2;
      ctx.save();
      ctx.translate(pad + cardW - sw / 2 - 6, cardY + cardH - 2);
      ctx.scale(sc, sc);
      sticker(ctx, r.verdict, 0, 0, -0.05, vSize, col, C.ink);
      ctx.restore();
      // points + called-for line inside the card top-right
      ctx.textAlign = "right"; ctx.textBaseline = "alphabetic";
      var labSize = Math.max(9, Math.min(11, W / 60));
      ctx.font = fnt("700", F.mono)(labSize);
      ctx.fillStyle = C.pinkDark;
      ctx.fillText("CALLED FOR: " + sit.lvl + "   +" + r.pts, pad + cardW - 14, cardY + 10 + labSize);
      // sommelier note inside the card, bottom-left, clear of the sticker
      var noteText = r.timeout ? r.sub : sit.note;
      var nW = cardW - 28 - (W < 520 ? 0 : sw + 10);
      var nFit = fitWrap(ctx, noteText, fnt("italic 500", F.serif), nW, Math.max(18, Math.min(26, W / 30)) * 1.25, Math.min(17, W / 34), 10, 1.15);
      ctx.textAlign = "left"; ctx.fillStyle = C.pinkDark;
      var nBase = cardY + cardH - 14 - (W < 520 ? vSize * 0.9 : 0) - (nFit.lines.length - 1) * nFit.size * 1.15;
      for (var i = 0; i < nFit.lines.length; i++) ctx.fillText(nFit.lines[i], pad + 14, nBase + i * nFit.size * 1.15);
    }

    function drawResults() {
      var pad = Math.max(10, W * 0.035);
      var cardX = pad, cardY = pad, cardW = W - pad * 2 - 6, cardH = H - pad * 2 - 30;
      box(ctx, cardX, cardY, cardW, cardH, C.paper, C.pink);
      var ix = cardX + 16, iw = cardW - 32;
      var y = cardY + 14;
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      var kSize = Math.max(9, Math.min(11, W / 60));
      ctx.font = fnt("700", F.mono)(kSize); ctx.fillStyle = C.pinkDark;
      ctx.fillText("TASTING NOTES · VINTAGE " + new Date().getFullYear(), ix, y + kSize);
      y += kSize + 6;
      // small eye in the corner of the card
      var eyeW = Math.min(iw * 0.3, 150);
      ctx.fillStyle = C.ink; ctx.fillRect(cardX + cardW - 16 - eyeW, y, eyeW, eyeW * EH / EW);
      drawEyeAt(cardX + cardW - 16 - eyeW / 2, y + eyeW * EH / EW / 2, eyeW - 6, eyeW * EH / EW - 6, S.eyeE, S.blink);
      var sSize = fitText(ctx, pad0(S.score), fnt("400", F.display), iw - eyeW - 12, Math.min(64, H * 0.13), 22);
      ctx.fillStyle = C.ink;
      ctx.fillText(pad0(S.score), ix, y + sSize * 0.95);
      ctx.font = fnt("700", F.mono)(kSize); ctx.fillStyle = C.grey;
      ctx.fillText((S.newBest ? "NEW BEST! " : "BEST " + pad0(best) + " · ") + "OUT OF 1000", ix, y + sSize + kSize + 6);
      y = Math.max(y + sSize + kSize + 14, y + eyeW * EH / EW + 6);
      // rank sticker
      var rank = rankFor(S.score);
      var rSize = Math.max(11, Math.min(20, W / 34));
      ctx.font = "400 " + rSize + "px " + F.display;
      var rw = Math.min(ctx.measureText(rank).width + rSize * 1.2, iw);
      if (ctx.measureText(rank).width + rSize * 1.2 > iw) rSize = Math.max(9, rSize * iw / (ctx.measureText(rank).width + rSize * 1.2));
      var stickY = y + rSize * 1.2;
      sticker(ctx, rank, ix + rw / 2 + 2, stickY, -0.035, rSize, C.pink, C.ink);
      y = stickY + rSize * 1.6;
      // notes: one paragraph per note, as large as the space allows
      var flightH = Math.max(22, Math.min(34, iw / 14));
      var bottomReserve = flightH + kSize + 34;
      var avail = cardY + cardH - y - bottomReserve;
      var best_ = null;
      for (var sz = Math.min(24, W / 26); sz >= 10; sz--) {
        ctx.font = fnt("italic 500", F.serif)(sz);
        var paras = S.notes.map(function (t) { return wrap(ctx, t, iw); });
        var total = 0; paras.forEach(function (pl) { total += pl.length * sz * 1.28 + sz * 0.45; });
        best_ = { size: sz, paras: paras };
        if (total <= avail) break;
      }
      // small screens: if even the smallest type overflows, drop the middle notes
      // (region first, then finish) so the flight row never gets covered
      var notesShown = S.notes.slice();
      while (notesShown.length > 2) {
        var tot = 0; best_.paras.forEach(function (pl) { tot += pl.length * best_.size * 1.28 + best_.size * 0.45; });
        if (tot <= avail) break;
        notesShown.splice(1, 1);
        ctx.font = fnt("italic 500", F.serif)(best_.size);
        best_.paras = notesShown.map(function (t) { return wrap(ctx, t, iw); });
      }
      ctx.fillStyle = C.ink; ctx.font = fnt("italic 500", F.serif)(best_.size);
      var ny = y + best_.size;
      best_.paras.forEach(function (pl, pi) {
        ctx.fillStyle = pi === best_.paras.length - 1 ? C.pinkDark : C.ink;
        pl.forEach(function (ln) { ctx.fillText(ln, ix, ny); ny += best_.size * 1.28; });
        ny += best_.size * 0.45;
      });
      // the flight: ten glasses, one per offense
      var fy = cardY + cardH - 16 - kSize - 8 - flightH;
      var gap = 4, fw = Math.min(56, (iw - gap * 9) / 10);
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      S.results.forEach(function (r, i) {
        var gx = ix + i * (fw + gap);
        var col = r.timeout ? C.grey : r.chef ? C.yellow : r.chosen === r.target ? C.teal : Math.abs(r.chosen - r.target) === 1 ? "#E8DCC8" : C.pink;
        ctx.fillStyle = C.ink; ctx.fillRect(gx, fy, fw, flightH);
        ctx.fillStyle = col; ctx.fillRect(gx + 2, fy + 2, fw - 4, flightH - 4);
        ctx.fillStyle = C.ink; ctx.font = fnt("700", F.mono)(Math.max(8, Math.min(12, fw / 3.6)));
        ctx.fillText(r.timeout ? "\u2013" : r.chosen + "/" + r.target, gx + fw / 2, fy + flightH / 2 + 1);
      });
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      // tally row
      var kisses = S.results.filter(function (r) { return r.chef; }).length;
      var paired = S.results.filter(function (r) { return !r.timeout && r.chosen === r.target; }).length;
      var tally = (iw > 520 ? "THE FLIGHT (YOURS/CALLED FOR) \u00B7 " : "") + "PAIRED " + paired + "/10 \u00B7 CHEF\u2019S KISSES " + kisses;
      fitText(ctx, tally, fnt("700", F.mono), iw, kSize, 7); ctx.fillStyle = C.grey;
      ctx.fillText(tally, ix, cardY + cardH - 14);
      // play again
      var ready = S.modeT > 0.9;
      var pa = "PLAY AGAIN";
      var pSize = Math.max(9, Math.min(13, W / 45));
      ctx.font = fnt("400", F.pixel)(pSize);
      var bw = ctx.measureText(pa).width + 24, bh = pSize + 16;
      var bx = W / 2 - bw / 2, byy = H - pad - bh + 4;
      ctx.globalAlpha = ready ? 1 : 0.4;
      ctx.fillStyle = C.ink; ctx.fillRect(bx + 4, byy + 4, bw, bh);
      ctx.fillStyle = C.yellow; ctx.fillRect(bx, byy, bw, bh);
      ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.strokeRect(bx + 1, byy + 1, bw - 2, bh - 2);
      ctx.fillStyle = C.ink; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(pa, W / 2, byy + bh / 2 + 1);
      ctx.globalAlpha = 1;
    }

    function draw() {
      if (!W || !H) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bg();
      if (S.mode === "title") drawTitle();
      else if (S.mode === "play") drawPlay();
      else drawResults();
    }

    resize();
    kick();

    return {
      destroy: function () {
        destroyed = true;
        halt();
        canvas.removeEventListener("pointerdown", onPointer);
        root.removeEventListener("keydown", onKey);
        mute.removeEventListener("click", onMute);
        mute.removeEventListener("pointerdown", stopProp);
        document.removeEventListener("visibilitychange", onVis);
        if (ro) ro.disconnect(); else window.removeEventListener("resize", resize);
        if (io) io.disconnect();
        audio.close();
        container.innerHTML = "";
      }
    };
  }

  window.HC_GAMES = window.HC_GAMES || {};
  window.HC_GAMES[ID] = {
    title: "SIDE-EYE SOMMELIER",
    tagline: "Pair the offense with the correct vintage of side-eye. Chef’s kiss optional.",
    mount: mount
  };
})();
