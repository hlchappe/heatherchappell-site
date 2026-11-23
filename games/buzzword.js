/* BUZZWORD INVADERS — heatherchappell.com arcade
 * Defend your calendar from descending corporate jargon with one withering side-eye.
 * Vanilla JS, no dependencies. Registers window.HC_GAMES.buzzword.
 */
(function () {
  'use strict';

  var C = {
    ink: '#141414', paper: '#F3ECDF', pink: '#FF2E88', pinkD: '#D41A6E',
    yellow: '#FFE14D', teal: '#19C2B0', grey: '#6B6B6B'
  };
  var W = 320, H = 240;                 // logical resolution (4:3)
  var PIX = '"Press Start 2P", "Space Mono", ui-monospace, monospace';
  var MONO = '"Space Mono", ui-monospace, Menlo, monospace';
  var DISP = '"Archivo Black", "Arial Black", Impact, sans-serif';
  var ROUND = 75;                       // seconds: one compressed workday, 9 to 5
  var BEST_KEY = 'hc_buzzword_best';

  // "|" = line break inside a block
  // Jargon escalates by quarter. Keep each line <= 12 chars and <= 2 lines (blocks must fit a 26px row).
  var BUZZ_TIERS = [
    // Q1: the classics
    ['SYNERGY', 'CIRCLE|BACK', 'TOUCH|BASE', 'BANDWIDTH', 'DEEP DIVE', 'PIVOT', 'LEVERAGE',
      'ALIGNMENT', 'NORTH|STAR', 'ACTION|ITEMS', 'PING ME', 'HARD STOP', 'WIN-WIN', 'BUY-IN',
      'HOLISTIC', 'PARADIGM|SHIFT', 'LOW-HANGING|FRUIT', 'MOVE THE|NEEDLE', 'BEST|PRACTICES',
      'VALUE-ADD', 'THOUGHT|LEADER', 'TAKE IT|OFFLINE', 'QUICK|SYNC', 'PAIN|POINTS', 'ICYMI',
      'BOIL THE|OCEAN'],
    // Q2: the inbox gets passive-aggressive
    ['PER MY|LAST EMAIL', 'FRIENDLY|REMINDER', 'GENTLE|NUDGE', 'JUST|FLAGGING', 'BUMPING|THIS',
      'SEE|BELOW', "YOU'RE ON|MUTE", 'SEE MY|SCREEN?', "LET'S|PARKING-LOT", 'GRAB SOME|TIME',
      'ON MY|RADAR', 'SWIM|LANES', 'UNPACK|THAT', 'PRE-READ', 'NEW PHONE|WHO DIS', 'EOD-ISH',
      'PER OUR|CONVO', 'TO YOUR|POINT', 'NOT TO|PILE ON', 'REAL QUICK', 'LOOPING IN|LEGAL',
      'SORRY, YOU|GO AHEAD', 'NO, YOU|GO AHEAD', 'AS DISCUSSED', 'SO TO|SPEAK'],
    // Q3: the offsite (whiteboards were harmed)
    ['BLUE-SKY|IT', 'SECRET|SAUCE', 'GROWTH|HACK', 'FULL-|FUNNEL', 'OMNI-|CHANNEL', 'RIGHT-|SIZE',
      'DOUBLE-|CLICK', 'IDEATE', 'DISRUPT', 'FLYWHEEL', 'MOONSHOT', 'TIGER|TEAM', 'WAR ROOM',
      'DATA-|DRIVEN-ISH', 'LEAN IN|TO IT', 'NET-NET', 'GO-TO-|MARKET', 'STRETCH|GOAL',
      'HEADWINDS', 'SUNSET IT', 'CROSS-|POLLINATE', 'PEEL THE|ONION', 'TABLE|STAKES',
      'NO-|BRAINER', 'OPERATION-|ALIZE'],
    // Q4: budget season. Words have stopped meaning things.
    ['DOUBLE-CLICK|PARKING LOT', 'MOVE THE|NORTH STAR', 'SYNC ON|THE SYNC', 'QUICK SYNC|(90 MIN)',
      'HARD STOP|(SOFT)', 'MEETING TO|PLAN MEETING', 'PIVOT TO|THE PIVOT', 'BOIL THE|NORTH STAR',
      'CIRCLE BACK|TO THE BACK', 'UNPACK THE|PARKING LOT', 'ACTION THE|ACTION ITEMS',
      'LEVERAGE|THE LEVERAGE', 'AGILE|WATERFALL', 'RIGHT-SIZE|THE OCEAN', 'SUNSET THE|SUNRISE',
      'AI-POWERED|FAX MACHINE', 'WIN-WIN-|WIN-WIN', 'PER MY|PER MY', 'NORTH STAR|SOUTH-ISH',
      'LOW-HANGING|NORTH STAR', 'PING THE|FLYWHEEL', 'EMPOWER|THE FUNNEL', 'PRE-WIRE|THE PRE-READ',
      'SYNERGIZE|THE PIVOT', 'HOLISTIC|SWIM LANE']
  ];
  var HUMAN = [
    'THANKS,|GREAT WORK', 'LUNCH IS|ON ME', 'MEETING|CANCELED', 'TAKE|FRIDAY OFF',
    'LOVED|YOUR DECK', 'GO HOME|EARLY', 'HOW ARE|YOU, REALLY?', 'NO ACTION|NEEDED',
    'NO NEED|TO REPLY', 'I FIXED THE|PRINTER', 'BAGELS IN|THE KITCHEN', 'CAMERAS|OPTIONAL',
    'ENDING 5|MIN EARLY', 'YOUR IDEA,|YOUR CREDIT', 'I REFILLED|THE COFFEE', 'I READ YOUR|PRE-READ'
  ];
  // Pixel-font strings: straight quotes only.
  var QUIPS = [
    'NOTED.', 'MM-HMM.', 'SURE.', 'BOLD.', 'OKAY THEN.', 'NOPE.', 'CIRCLED.', 'BLESS YOUR HEART.',
    'HONEY, NO.', 'SOURCE?', 'ALLEGEDLY.', 'SAYS WHO?', 'COOL COOL COOL.', 'THE AUDACITY.',
    'UNSUBSCRIBED.', 'SEE ME AFTER.', "WE'LL SEE.", 'NOT ON MY WATCH.', 'AND YET.',
    'SURE IT DOES.', 'DECLINED, WITH LOVE.', 'RED PEN.'
  ];
  var RUDE_QUIPS = [
    'THEY BROUGHT BAGELS.', 'NOTED IN YOUR FILE.', 'HR WOULD LIKE A WORD.',
    'YOUR MAMA RAISED YOU BETTER.', 'THAT WAS A COMPLIMENT.', 'THEY MEANT IT, TOO.'
  ];
  var DECLINES = ['DECLINED', 'NO AGENDA, NO DICE', 'CONFLICT (VAGUE)', 'COULD BE AN EMAIL', 'DECLINED (POLITELY)'];
  var WAVE_NAMES = [
    { t: 'Q1 KICKOFF', s: 'New fiscal year. Same slide template.' },
    { t: 'Q2 ALL-HANDS', s: 'Agenda: 14 items. Time allotted: 30 minutes.' },
    { t: 'Q3 OFFSITE', s: 'Trust fall at 2:00. Lunch is a wrap. Again.' },
    { t: 'Q4 PLANNING', s: 'The budget is gone. The ambition is not.' },
    { t: 'FISCAL Q5 (?)', s: 'Finance says this is fine. Finance is on PTO.' }
  ];
  var SPECIAL_SUB = 'Reports to three managers. All of them are named Gary.';
  // Clock gags: m = minutes after midnight on the 9-to-5 clock (1 game second = 6.4 clock minutes)
  var CLOCK_GAGS = [
    { m: 615, t: "10:15 AM  GARY: 'QUICK SYNC?' (IT WAS 40 MIN)" },
    { m: 720, t: 'NOON  LUNCH: SALAD, AT DESK, ON MUTE' },
    { m: 810, t: "1:30 PM  GARY REPLIED ALL: 'THX!'" },
    { m: 887, t: '2:47 PM  THE 3 PM SLUMP ARRIVED EARLY' },
    { m: 935, t: '3:35 PM  SHEET CAKE IN BREAK ROOM. NOBODY KNOWS WHOSE.' },
    { m: 1005, t: '4:45 PM  GARY IS TYPING...' },
    { m: 1012, t: "4:52 PM  GARY: 'GOT A QUICK QUESTION?'" }
  ];
  var RANKS = [
    { min: 0, t: 'INTERN', q: 'Still says "great question!" and means it. Bless.' },
    { min: 200, t: 'ASSOCIATE (ACTING)', q: 'Has a badge. The badge does not open the good fridge.' },
    { min: 400, t: 'MIDDLE MANAGER', q: 'Blocked off "focus time." Gary booked over it.' },
    { min: 1000, t: 'VP OF SIDE-EYE', q: 'Has ended a meeting with one look. Twice. On a Tuesday.' },
    { min: 1500, t: 'SVP, STRATEGIC NOPE', q: 'Declines with "Thanks!" and somehow it stings.' },
    { min: 2000, t: 'CHIEF SKEPTIC OFFICER', q: 'Reads the entire email thread. Then asks for the source.' }
  ];
  var REASONS = {
    recurring: ['You have been added to a recurring meeting.', 'Weekly. No end date. No agenda. Camera on.'],
    desk: ['The jargon has reached your desk.', 'It would love to grab fifteen minutes. It means ninety.'],
    eod: ['5:00 PM. Logging off.', '4:59 PM: Gary had "a quick question." You had a train.']
  };
  // Notes from your manager (Gary). Keyed to how the day went.
  var NOTES = {
    recurring: 'Glad you could make it! It is every Tuesday, forever. Bring snacks.',
    desk: 'Saw the jargon got to your desk. Let\'s circle back on that. Same time next week?',
    rudeMany: 'A few folks said they felt "glared at." Let\'s take it offline. Then back online.',
    rude: function (t) { return 'You glared at "' + t + (/[?!.]$/.test(t) ? '' : '.') + '" They meant that. Let\'s talk.'; },
    rank: [
      'Great energy today! Let\'s find you a stretch goal. Like lunch.',
      'Solid. Not "exceeds," but the word "solid" is in my notes, underlined.',
      'Strong quarter. Could you present it to my boss? As me?',
      'Your look ended my 2:00. Off the record: thank you.',
      'Let\'s talk about a title change. Title. Not raise. Title.',
      'I\'m told you asked for a source on my source. Promoted. Please stop.'
    ]
  };

  var STYLE_ID = 'hc-bzi-style';
  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = [
      '.hc-bzi{position:relative;width:100%;background:#141414;color:#F3ECDF;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;box-sizing:border-box;line-height:1}',
      '.hc-bzi *{box-sizing:border-box}',
      '.hc-bzi__screen{position:relative;width:100%;overflow:hidden}',
      '.hc-bzi__screen canvas{display:block;width:100%;height:100%;touch-action:manipulation;cursor:pointer}',
      '.hc-bzi__scan{position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(to bottom,rgba(0,0,0,0) 0,rgba(0,0,0,0) 2px,rgba(0,0,0,.22) 2px,rgba(0,0,0,.22) 3px),radial-gradient(ellipse at center,rgba(0,0,0,0) 60%,rgba(0,0,0,.35) 100%)}',
      '.hc-bzi__bar{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 8px;border-top:3px solid #FF2E88;font-family:"Space Mono",ui-monospace,monospace;font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:#F3ECDF}',
      '.hc-bzi__label{opacity:.75;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.hc-bzi__btns{display:flex;gap:6px;flex-shrink:0}',
      '.hc-bzi__btn{font:inherit;text-transform:uppercase;background:#141414;color:#F3ECDF;border:2px solid #F3ECDF;padding:3px 7px;cursor:pointer;border-radius:0;box-shadow:2px 2px 0 #FF2E88}',
      '.hc-bzi__btn:hover{background:#F3ECDF;color:#141414}',
      '.hc-bzi__btn[aria-pressed="true"]{background:#FFE14D;color:#141414;border-color:#FFE14D}',
      '.hc-bzi__btn:focus-visible{outline:2px solid #FFE14D;outline-offset:2px}',
      '.hc-bzi-host:focus{outline:none}',
      '.hc-bzi-host:focus-visible{outline:3px solid #FFE14D;outline-offset:2px}'
    ].join('\n');
    document.head.appendChild(s);
  }

  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[(Math.random() * a.length) | 0]; }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = (Math.random() * (i + 1)) | 0, t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function overlap(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
  }
  function readBest() { try { return parseInt(localStorage.getItem(BEST_KEY), 10) || 0; } catch (e) { return 0; } }
  function writeBest(v) { try { localStorage.setItem(BEST_KEY, String(v)); } catch (e) { /* private mode */ } }
  function rankFor(s) { var r = RANKS[0]; for (var i = 0; i < RANKS.length; i++) if (s >= RANKS[i].min) r = RANKS[i]; return r; }
  function clockMins(t) { return 9 * 60 + Math.floor((t / ROUND) * 480); }
  function managerNote(r) {
    var s = r.stats;
    if (s.rude >= 2) return NOTES.rudeMany;
    if (s.rude === 1 && s.lastRude) return NOTES.rude(s.lastRude);
    if (r.reason === 'recurring') return NOTES.recurring;
    if (r.reason === 'desk') return NOTES.desk;
    return NOTES.rank[Math.max(0, RANKS.indexOf(r.rank))] || NOTES.rank[0];
  }

  // ---------- geometry constants ----------
  var CH = 6, LH = 8;                  // pixel-font char advance and line height for blocks
  var ROW_H = 26, GAP = 6, ROW_MAX = 232;
  var PLAYER_Y = 222;
  var BUNKER_Y = 190, CELL = 2, BCOLS = 16, BROWS = 7;

  function mount(container) {
    injectStyle();
    var prevTab = container.getAttribute('tabindex');
    container.setAttribute('tabindex', '0');
    container.classList.add('hc-bzi-host');

    var root = document.createElement('div');
    root.className = 'hc-bzi';
    var screen = document.createElement('div');
    screen.className = 'hc-bzi__screen';
    var canvas = document.createElement('canvas');
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Buzzword Invaders. Arrow keys or A and D to move, Space to glare. On touch, hold and drag to move and glare.');
    var scan = document.createElement('div');
    scan.className = 'hc-bzi__scan';
    screen.appendChild(canvas);
    screen.appendChild(scan);

    var bar = document.createElement('div');
    bar.className = 'hc-bzi__bar';
    var label = document.createElement('span');
    label.className = 'hc-bzi__label';
    var coarse = false;
    try { coarse = window.matchMedia('(pointer: coarse)').matches; } catch (e) { /* noop */ }
    label.textContent = coarse ? 'Hold & drag to move + glare' : '\u2190 \u2192 move \u00B7 space glare \u00B7 P pause';
    var btns = document.createElement('div');
    btns.className = 'hc-bzi__btns';
    var pauseBtn = document.createElement('button');
    pauseBtn.type = 'button'; pauseBtn.className = 'hc-bzi__btn'; pauseBtn.textContent = 'Pause';
    pauseBtn.setAttribute('aria-pressed', 'false');
    var muteBtn = document.createElement('button');
    muteBtn.type = 'button'; muteBtn.className = 'hc-bzi__btn'; muteBtn.textContent = 'Sound: off';
    muteBtn.setAttribute('aria-pressed', 'false');
    btns.appendChild(pauseBtn); btns.appendChild(muteBtn);
    bar.appendChild(label); bar.appendChild(btns);

    root.appendChild(screen); root.appendChild(bar);
    container.appendChild(root);

    var ctx = canvas.getContext('2d');
    var scale = 1, dpr = 1;
    var reduceMotion = false;
    try { reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { /* noop */ }

    // ---------- audio (off by default) ----------
    var audio = { ctx: null, on: false };
    function blip(f1, f2, dur, type, vol) {
      if (!audio.on || !audio.ctx) return;
      try {
        var a = audio.ctx, t = a.currentTime, o = a.createOscillator(), g = a.createGain();
        o.type = type || 'square';
        o.frequency.setValueAtTime(f1, t);
        o.frequency.exponentialRampToValueAtTime(Math.max(20, f2), t + dur);
        g.gain.setValueAtTime(vol || 0.05, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g); g.connect(a.destination);
        o.start(t); o.stop(t + dur + 0.02);
      } catch (e) { /* ignore */ }
    }
    var sfx = {
      fire: function () { blip(1200, 600, 0.06, 'square', 0.03); },
      hit: function () { blip(420, 90, 0.14, 'sawtooth', 0.05); },
      rude: function () { blip(160, 120, 0.25, 'square', 0.05); },
      ouch: function () { blip(220, 55, 0.4, 'triangle', 0.09); },
      ufo: function () { blip(700, 900, 0.12, 'sine', 0.04); },
      bonus: function () { blip(880, 1760, 0.18, 'square', 0.04); },
      wave: function () { blip(523, 523, 0.08, 'square', 0.04); setTimeout(function () { blip(784, 784, 0.12, 'square', 0.04); }, 90); }
    };
    function setSound(on) {
      audio.on = on;
      muteBtn.textContent = on ? 'Sound: on' : 'Sound: off';
      muteBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (on && !audio.ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (AC) { try { audio.ctx = new AC(); } catch (e) { audio.ctx = null; } }
      }
      if (on && audio.ctx && audio.ctx.state === 'suspended') audio.ctx.resume();
      if (on) sfx.bonus();
    }

    // ---------- state ----------
    var mode = 'title';          // title | play | over
    var paused = false;
    var best = readBest();
    var g = null;                // per-round game state
    var keys = { left: false, right: false, fire: false };
    var pointer = { down: false, x: W / 2 };
    var titleT = 0, overT = 0;
    var raf = 0, last = 0, visible = !document.hidden, onscreen = true, alive = true;
    var lastResult = null;

    function newGame() {
      g = {
        score: 0, hits: 0, time: 0, wave: 0,
        blocks: [], fdir: 1, frame: 0, frameT: 0,
        beams: [], invites: [], particles: [], popups: [],
        ufo: null, ufoT: rand(9, 14), fireT: 1.5, cool: 0,
        inter: 0, banner: '', bannerT: 0, shake: 0, flash: 0,
        stats: { glared: 0, declined: 0, rude: 0, muted: 0, spared: 0, dodged: 0, lastRude: '' },
        gagI: 0,
        player: { x: W / 2, look: 1, lookT: 0, smug: 0, inv: 0, glanceFlip: 1 },
        bunkers: makeBunkers()
      };
      nextWave();
    }

    function makeBunkers() {
      var out = [], xs = [W * 0.2, W * 0.5, W * 0.8];
      for (var i = 0; i < 3; i++) {
        var cells = new Uint8Array(BCOLS * BROWS);
        for (var r = 0; r < BROWS; r++) for (var c = 0; c < BCOLS; c++) {
          var on = 1;
          if (r === 0 && (c < 2 || c > BCOLS - 3)) on = 0;
          if (r === 1 && (c < 1 || c > BCOLS - 2)) on = 0;
          if (r >= BROWS - 2 && c >= 5 && c <= BCOLS - 6) on = 0;
          cells[r * BCOLS + c] = on;
        }
        out.push({ x: Math.round(xs[i] - (BCOLS * CELL) / 2), y: BUNKER_Y, cells: cells });
      }
      return out;
    }

    function blockSize(text) {
      var lines = text.split('|'), m = 0;
      for (var i = 0; i < lines.length; i++) m = Math.max(m, lines[i].length);
      return { lines: lines, w: m * CH + 8, h: lines.length * LH + 6 };
    }

    function nextWave() {
      g.wave++;
      var n = g.wave, rows = 4;
      var tier = Math.min(n, BUZZ_TIERS.length) - 1;
      // current quarter's jargon on top; the previous quarter's is the backfill
      var pool = shuffle(BUZZ_TIERS[Math.max(0, tier - 1)].slice()).concat(shuffle(BUZZ_TIERS[tier].slice()));
      var hum = shuffle(HUMAN.slice());
      var humanCount = Math.min(3, 1 + Math.floor(n / 2));
      var humanRows = shuffle([0, 1, 2, 3]).slice(0, humanCount);
      var top = 34 + Math.min(n - 1, 4) * 5;
      g.blocks = [];
      for (var r = 0; r < rows; r++) {
        var items = [];
        if (humanRows.indexOf(r) >= 0) items.push({ text: hum.pop(), human: true });
        var width = 0;
        for (var k = 0; k < items.length; k++) width += blockSize(items[k].text).w + GAP;
        while (pool.length) {
          var t = pool[pool.length - 1], s = blockSize(t);
          if (width + s.w > ROW_MAX) break;
          pool.pop(); items.push({ text: t, human: false }); width += s.w + GAP;
          if (items.length >= 5) break;
        }
        shuffle(items);
        var total = -GAP, sizes = [];
        for (k = 0; k < items.length; k++) { sizes.push(blockSize(items[k].text)); total += sizes[k].w + GAP; }
        var x = Math.round((W - total) / 2), cy = top + r * ROW_H + ROW_H / 2;
        for (k = 0; k < items.length; k++) {
          var sz = sizes[k];
          g.blocks.push({
            x: x, y: Math.round(cy - sz.h / 2), w: sz.w, h: sz.h, lines: sz.lines,
            human: items[k].human, alive: true, row: r, pts: (rows - r) * 10,
            color: items[k].human ? C.teal : [C.pink, C.yellow, C.yellow, C.paper][r]
          });
          x += sz.w + GAP;
        }
      }
      g.total = countBuzz();
      g.fdir = Math.random() < 0.5 ? -1 : 1;
      var wn = WAVE_NAMES[n - 1];
      g.banner = wn ? wn.t : ('SPECIAL PROJECT #' + (n - 5));
      g.bannerSub = wn ? wn.s : SPECIAL_SUB;
      g.bannerT = 1.6;
      g.fireT = 1.4;
      sfx.wave();
    }

    function countBuzz() {
      var n = 0;
      for (var i = 0; i < g.blocks.length; i++) if (g.blocks[i].alive && !g.blocks[i].human) n++;
      return n;
    }

    function popup(x, y, text, color, life, big) {
      g.popups.push({ x: x, y: y, text: text, c: color || C.paper, life: life || 0.9, max: life || 0.9, big: !!big });
    }
    function burst(x, y, color, n) {
      for (var i = 0; i < n; i++) {
        g.particles.push({ x: x, y: y, vx: rand(-60, 60), vy: rand(-70, 30), life: rand(0.3, 0.7), c: color, s: Math.random() < 0.5 ? 1 : 2 });
      }
    }

    // bunker hit test at a point; erases a small crater if solid
    function bunkerHit(x, y, rad) {
      for (var i = 0; i < g.bunkers.length; i++) {
        var b = g.bunkers[i];
        var cx = Math.floor((x - b.x) / CELL), cy = Math.floor((y - b.y) / CELL);
        if (cx < 0 || cy < 0 || cx >= BCOLS || cy >= BROWS) continue;
        if (!b.cells[cy * BCOLS + cx]) continue;
        for (var yy = -rad; yy <= rad; yy++) for (var xx = -rad; xx <= rad; xx++) {
          var px = cx + xx, py = cy + yy;
          if (px < 0 || py < 0 || px >= BCOLS || py >= BROWS) continue;
          if (xx * xx + yy * yy <= rad * rad + (Math.random() < 0.5 ? 1 : 0)) b.cells[py * BCOLS + px] = 0;
        }
        return true;
      }
      return false;
    }
    function bunkerEraseRect(x, y, w, h) {
      for (var i = 0; i < g.bunkers.length; i++) {
        var b = g.bunkers[i];
        if (!overlap(x, y, w, h, b.x, b.y, BCOLS * CELL, BROWS * CELL)) continue;
        for (var r = 0; r < BROWS; r++) for (var c = 0; c < BCOLS; c++) {
          if (overlap(x, y, w, h, b.x + c * CELL, b.y + r * CELL, CELL, CELL)) b.cells[r * BCOLS + c] = 0;
        }
      }
    }

    function endGame(reason) {
      if (mode !== 'play') return;
      mode = 'over';
      overT = 0;
      var isBest = g.score > best;
      if (isBest) { best = g.score; writeBest(best); }
      lastResult = { reason: reason, score: g.score, isBest: isBest, rank: rankFor(g.score), stats: g.stats, wave: g.wave };
      keys.fire = false; pointer.down = false;
      updateTouchAction();
    }

    function startGame() {
      newGame();
      mode = 'play';
      paused = false;
      setPauseUI();
      updateTouchAction();
    }

    // ---------- update ----------
    function update(dt) {
      titleT += dt;
      if (mode === 'over') { overT += dt; return; }
      if (mode !== 'play' || paused) return;

      var p = g.player, n = g.wave;
      g.time += dt;
      if (g.time >= ROUND) { g.time = ROUND; endGame('eod'); return; }
      // clock gags (cosmetic)
      var nowM = clockMins(g.time);
      while (g.gagI < CLOCK_GAGS.length && nowM >= CLOCK_GAGS[g.gagI].m) {
        popup(W / 2, 170, CLOCK_GAGS[g.gagI].t, C.yellow, 2.6);
        g.gagI++;
      }
      if (g.shake > 0) g.shake -= dt;
      if (g.flash > 0) g.flash -= dt;
      if (g.bannerT > 0) g.bannerT -= dt;
      if (p.inv > 0) p.inv -= dt;
      if (p.smug > 0) p.smug -= dt;
      g.cool -= dt;

      // player movement
      var vx = 0, speed = 120;
      if (keys.left) vx -= speed;
      if (keys.right) vx += speed;
      if (pointer.down) {
        var d = pointer.x - p.x;
        if (Math.abs(d) > 1) vx = Math.max(-170, Math.min(170, d * 10));
      }
      p.x = Math.max(17, Math.min(W - 17, p.x + vx * dt));
      // pupil: glances where you're going; idles in a permanent side-eye
      var targetLook = vx > 5 ? 1 : vx < -5 ? -1 : p.glanceFlip;
      p.look += (targetLook - p.look) * Math.min(1, dt * 12);
      p.lookT -= dt;
      if (p.lookT <= 0 && Math.abs(vx) < 5) { p.glanceFlip = -p.glanceFlip; p.lookT = rand(1.2, 2.6); }

      // fire
      var wantFire = keys.fire || pointer.down;
      if (wantFire && g.cool <= 0 && g.beams.length < 2 && g.inter <= 0) {
        g.beams.push({ x: p.x, y: PLAYER_Y - 9, t: 0, dir: p.look >= 0 ? 1 : -1 });
        g.cool = 0.3;
        sfx.fire();
      }

      // interlude between waves
      if (g.inter > 0) {
        g.inter -= dt;
        for (var hi = 0; hi < g.blocks.length; hi++) if (g.blocks[hi].alive) g.blocks[hi].y -= 140 * dt;
        if (g.inter <= 0) nextWave();
      } else {
        // formation
        var buzzLeft = countBuzz();
        var frac = g.total ? 1 - buzzLeft / g.total : 0;
        var fspeed = (10 + 4 * n) * (1 + 2.4 * frac);
        var dx = g.fdir * fspeed * dt;
        var minX = 1e9, maxX = -1e9, i, b;
        for (i = 0; i < g.blocks.length; i++) {
          b = g.blocks[i]; if (!b.alive) continue;
          b.x += dx;
          if (b.x < minX) minX = b.x;
          if (b.x + b.w > maxX) maxX = b.x + b.w;
        }
        var drop = 0;
        if (g.fdir > 0 && maxX > W - 4) { g.fdir = -1; drop = n > 3 ? 8 : 6; dx = (W - 4) - maxX; }
        else if (g.fdir < 0 && minX < 4) { g.fdir = 1; drop = n > 3 ? 8 : 6; dx = 4 - minX; }
        if (drop) {
          for (i = 0; i < g.blocks.length; i++) { b = g.blocks[i]; if (b.alive) { b.y += drop; b.x += dx; } }
        }
        g.frameT += dt * (1 + 2 * frac);
        if (g.frameT > 0.45) { g.frameT = 0; g.frame ^= 1; }
        for (i = 0; i < g.blocks.length; i++) {
          b = g.blocks[i]; if (!b.alive) continue;
          if (b.y + b.h > BUNKER_Y - 2) bunkerEraseRect(b.x, b.y, b.w, b.h);
          if (!b.human && b.y + b.h >= PLAYER_Y - 6) { endGame('desk'); return; }
        }

        // enemy fire: meeting invites
        if (g.bannerT <= 0.6) g.fireT -= dt;
        if (g.fireT <= 0) {
          g.fireT = rand(0.8, 1.6) / (1 + 0.3 * (n - 1));
          if (g.invites.length < 1 + n) {
            var shooters = [], aimed = [];
            for (i = 0; i < g.blocks.length; i++) {
              b = g.blocks[i]; if (!b.alive || b.human) continue;
              shooters.push(b);
              if (p.x > b.x - 6 && p.x < b.x + b.w + 6) aimed.push(b);
            }
            var s = (aimed.length && Math.random() < 0.35) ? pick(aimed) : (shooters.length ? pick(shooters) : null);
            if (s) g.invites.push({ x: s.x + s.w / 2 + rand(-s.w / 4, s.w / 4), y: s.y + s.h, vy: 46 + 9 * n });
          }
        }

        // REPLY ALL saucer
        if (!g.ufo) {
          g.ufoT -= dt;
          if (g.ufoT <= 0) {
            var dir = Math.random() < 0.5 ? 1 : -1, uw = 9 * CH + 10;
            g.ufo = { x: dir > 0 ? -uw : W, y: 17, w: uw, h: 11, dir: dir, pts: pick([50, 100, 150, 300]),
              label: clockMins(g.time) >= 990 ? 'GOT A SEC?' : 'REPLY ALL' };
            sfx.ufo();
          }
        } else {
          g.ufo.x += g.ufo.dir * 48 * dt;
          if (g.ufo.x > W + 4 || g.ufo.x + g.ufo.w < -4) { g.ufo = null; g.ufoT = rand(10, 16); }
        }
      }

      // beams (sub-stepped so nothing tunnels)
      for (var bi = g.beams.length - 1; bi >= 0; bi--) {
        var bm = g.beams[bi], dist = 230 * dt, steps = Math.ceil(dist / 2), gone = false;
        bm.t += dt;
        for (var st = 0; st < steps && !gone; st++) {
          bm.y -= dist / steps;
          if (bm.y < 12) { gone = true; break; }
          if (bunkerHit(bm.x, bm.y, 1)) { gone = true; break; }
          // vs invites
          for (var ii = g.invites.length - 1; ii >= 0; ii--) {
            var iv = g.invites[ii];
            if (Math.abs(iv.x - bm.x) < 5 && Math.abs(iv.y - bm.y) < 6) {
              g.invites.splice(ii, 1); g.score += 5; g.stats.declined++;
              popup(iv.x, iv.y - 4, pick(DECLINES), C.teal, 0.9);
              burst(iv.x, iv.y, C.paper, 5); sfx.hit(); gone = true; break;
            }
          }
          if (gone) break;
          // vs blocks
          for (var k = 0; k < g.blocks.length; k++) {
            var bl = g.blocks[k];
            if (!bl.alive || !overlap(bm.x - 2, bm.y - 2, 4, 4, bl.x, bl.y, bl.w, bl.h)) continue;
            bl.alive = false; gone = true;
            var cx = bl.x + bl.w / 2, cy = bl.y + bl.h / 2;
            if (bl.human) {
              g.score = Math.max(0, g.score - 50); g.stats.rude++;
              popup(cx, cy, 'Rude.', C.yellow, 1.3, true);
              popup(cx, cy + 10, '-50', C.pink, 1.3);
              popup(cx, cy + 18, pick(RUDE_QUIPS), C.paper, 1.5);
              g.stats.lastRude = bl.lines.join(' ').replace(/- /g, '-');
              burst(cx, cy, C.teal, 10); sfx.rude();
              if (!reduceMotion) g.shake = 0.18;
            } else {
              g.score += bl.pts; g.stats.glared++;
              popup(cx, cy, '+' + bl.pts, bl.color, 0.8);
              if (Math.random() < 0.3) popup(cx, cy - 9, pick(QUIPS), C.paper, 0.9);
              burst(cx, cy, bl.color, 12); sfx.hit();
              p.smug = 0.45;
            }
            break;
          }
          if (gone) break;
          // vs REPLY ALL
          if (g.ufo && overlap(bm.x - 2, bm.y - 2, 4, 4, g.ufo.x, g.ufo.y, g.ufo.w, g.ufo.h)) {
            var u = g.ufo; g.score += u.pts; g.stats.muted++;
            popup(u.x + u.w / 2, u.y + 14, (u.label === 'REPLY ALL' ? 'THREAD MUTED +' : 'MOVED TO MONDAY +') + u.pts, C.yellow, 1.4, true);
            burst(u.x + u.w / 2, u.y + 5, C.pink, 16); sfx.bonus();
            g.ufo = null; g.ufoT = rand(10, 16); gone = true;
          }
        }
        if (gone) g.beams.splice(bi, 1);
      }

      // invites
      for (var j = g.invites.length - 1; j >= 0; j--) {
        var inv = g.invites[j], d2 = inv.vy * dt, s2 = Math.ceil(d2 / 2), dead = false;
        for (var q = 0; q < s2 && !dead; q++) {
          inv.y += d2 / s2;
          if (bunkerHit(inv.x, inv.y + 3, 1)) { dead = true; break; }
          if (inv.y > H - 6) { dead = true; g.stats.dodged++; burst(inv.x, H - 8, C.grey, 3); break; }
          if (p.inv <= 0 && overlap(inv.x - 3, inv.y - 3, 7, 7, p.x - 13, PLAYER_Y - 5, 26, 10)) {
            dead = true;
            g.hits++;
            p.inv = 1.3;
            g.flash = reduceMotion ? 0 : 0.25;
            if (!reduceMotion) g.shake = 0.3;
            burst(p.x, PLAYER_Y, C.pink, 14); sfx.ouch();
            if (g.hits >= 3) { g.invites.splice(j, 1); endGame('recurring'); return; }
            popup(p.x, PLAYER_Y - 16, g.hits === 1 ? 'ACCEPTED (TENTATIVE)' : 'ACCEPTED. CAMERA ON.', C.pink, 1.4, true);
          }
        }
        if (dead) g.invites.splice(j, 1);
      }

      // wave clear?
      if (g.inter <= 0 && countBuzz() === 0) {
        var bonus = 100;
        g.score += bonus;
        popup(W / 2, 110, 'QUARTER CLOSED +' + bonus, C.yellow, 1.6, true);
        for (var m = 0; m < g.blocks.length; m++) {
          var hb = g.blocks[m];
          if (hb.alive && hb.human) { g.score += 25; g.stats.spared++; popup(hb.x + hb.w / 2, hb.y - 4, 'SPARED +25', C.teal, 1.2); }
        }
        g.invites.length = 0;
        g.inter = 1.4;
        sfx.bonus();
      }

      // fx
      for (var pi = g.particles.length - 1; pi >= 0; pi--) {
        var pt = g.particles[pi];
        pt.life -= dt; pt.x += pt.vx * dt; pt.y += pt.vy * dt; pt.vy += 160 * dt;
        if (pt.life <= 0) g.particles.splice(pi, 1);
      }
      for (var pu = g.popups.length - 1; pu >= 0; pu--) {
        var po = g.popups[pu];
        po.life -= dt; po.y -= 14 * dt;
        if (po.life <= 0) g.popups.splice(pu, 1);
      }
    }

    // ---------- drawing ----------
    function rect(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); }
    function text(t, x, y, font, color, align, base) {
      ctx.font = font; ctx.fillStyle = color;
      ctx.textAlign = align || 'left'; ctx.textBaseline = base || 'top';
      ctx.fillText(t, x, y);
    }
    function fitText(t, x, y, size, family, color, align, maxW) {
      var s = size;
      ctx.font = s + 'px ' + family;
      while (s > 4 && ctx.measureText(t).width > maxW) { s -= 0.5; ctx.font = s + 'px ' + family; }
      text(t, x, y, s + 'px ' + family, color, align);
    }

    function fitItalic(t, x, y, size, color, maxW) {
      var sz = size;
      ctx.font = 'italic ' + sz + 'px ' + MONO;
      while (sz > 4 && ctx.measureText(t).width > maxW) { sz -= 0.5; ctx.font = 'italic ' + sz + 'px ' + MONO; }
      text(t, x, y, 'italic ' + sz + 'px ' + MONO, color, 'center');
    }

    // The pixel eye: almond outline, pupil pushed to one side.
    function drawEye(cx, cy, u, look, lid, outline, sclera) {
      var A = 11, Hh = 5;
      var x0 = Math.round(cx - A * u - u / 2), y0 = Math.round(cy - Hh * u - u / 2);
      var px = look * 5;
      for (var x = -A; x <= A; x++) {
        var hOuter = Math.round(Hh * (1 - (x / (A + 0.5)) * (x / (A + 0.5))));
        for (var y = -hOuter; y <= hOuter; y++) {
          var inner = Math.abs(x) <= A - 2 && Math.abs(y) < Math.round((Hh - 1) * (1 - (x / (A - 1)) * (x / (A - 1))) + 0.4);
          var col = outline;
          if (inner) {
            col = sclera;
            var dxp = x - px, dyp = y;
            if (dxp * dxp + dyp * dyp <= 7) col = C.ink;
            if (dxp === -1 + (look > 0 ? 1 : 0) && dyp === -1) col = C.paper;
            if (lid > 0 && y < -Hh + 1 + Math.round(lid * (Hh * 2 - 2))) col = outline;
          }
          ctx.fillStyle = col;
          ctx.fillRect(x0 + (x + A) * u, y0 + (y + Hh) * u, u, u);
        }
      }
    }

    function drawGlance(x, y, t, dir) {
      // a tiny sideways glance flying up: pink streak + mini almond eye
      for (var i = 1; i <= 4; i++) {
        ctx.globalAlpha = 0.5 - i * 0.1;
        rect(x - 1, y + 2 + i * 3, 2, 2, C.pink);
      }
      ctx.globalAlpha = 1;
      rect(x - 3, y - 1, 7, 3, C.pink);
      rect(x - 4, y, 9, 1, C.pink);
      rect(x - 2, y, 5, 1, C.paper);
      var pp = (Math.floor(t * 10) % 2 ? dir : -dir);
      rect(x + pp * 1 + (pp > 0 ? 0 : -1), y, 2, 1, C.ink);
    }

    function drawInvite(x, y) {
      x = Math.round(x); y = Math.round(y);
      rect(x - 3, y - 3, 7, 7, C.paper);
      rect(x - 3, y - 3, 7, 2, C.pink);
      rect(x - 2, y - 4, 1, 2, C.ink); rect(x + 2, y - 4, 1, 2, C.ink);
      rect(x - 2, y, 1, 1, C.ink); rect(x, y, 1, 1, C.ink); rect(x + 2, y, 1, 1, C.ink);
      rect(x - 2, y + 2, 1, 1, C.ink); rect(x, y + 2, 1, 1, C.pink);
    }

    function drawBlock(b, frame) {
      var x = Math.round(b.x), y = Math.round(b.y);
      if (b.human) {
        rect(x, y, b.w, b.h, C.teal);
        rect(x + 1, y + b.h, b.w, 1, 'rgba(25,194,176,.35)');
      } else {
        ctx.fillStyle = 'rgba(243,236,223,0.05)';
        ctx.fillRect(x, y, b.w, b.h);
        ctx.strokeStyle = b.color; ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, b.w - 1, b.h - 1);
        // invader "legs" that shuffle each step
        var lx = frame ? 2 : 4;
        rect(x + lx, y + b.h, 2, 2, b.color);
        rect(x + b.w - lx - 2, y + b.h, 2, 2, b.color);
      }
      ctx.font = '6px ' + PIX; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillStyle = b.human ? C.ink : b.color;
      for (var i = 0; i < b.lines.length; i++) ctx.fillText(b.lines[i], x + b.w / 2, y + 4 + i * LH);
    }

    function drawBunkers() {
      for (var i = 0; i < g.bunkers.length; i++) {
        var b = g.bunkers[i];
        ctx.fillStyle = 'rgba(25,194,176,.75)';
        for (var r = 0; r < BROWS; r++) for (var c = 0; c < BCOLS; c++) {
          if (b.cells[r * BCOLS + c]) ctx.fillRect(b.x + c * CELL, b.y + r * CELL, CELL, CELL);
        }
        text('OOO', b.x + BCOLS * CELL / 2, b.y + 3, '5px ' + PIX, C.ink, 'center');
      }
    }

    function clockText(t) {
      var mins = 9 * 60 + Math.floor((t / ROUND) * 480), h = Math.floor(mins / 60), m = mins % 60;
      var ap = h >= 12 ? 'PM' : 'AM', hh = h > 12 ? h - 12 : h;
      return hh + ':' + (m < 10 ? '0' : '') + m + ' ' + ap;
    }

    function drawHUD() {
      rect(0, 0, W, 13, C.ink);
      rect(0, 13, W, 1, C.pinkD);
      text('SCORE ' + g.score, 5, 4, '6px ' + PIX, C.paper);
      var late = ROUND - g.time < 10;
      var ct = clockText(g.time);
      text(ct, W / 2, 4, '6px ' + PIX, late && Math.floor(g.time * 4) % 2 ? C.pink : C.yellow, 'center');
      // open calendar slots
      text('SLOTS', W - 40, 4, '5px ' + PIX, C.grey, 'right');
      for (var i = 0; i < 3; i++) {
        var x = W - 34 + i * 10, used = i < g.hits;
        rect(x, 3, 7, 7, used ? C.pink : C.ink);
        ctx.strokeStyle = used ? C.pink : C.paper; ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, 3.5, 6, 6);
        if (used) { rect(x + 2, 5, 3, 3, C.ink); }
      }
    }

    function drawPlay() {
      var p = g.player;
      ctx.save();
      if (g.shake > 0) ctx.translate(Math.round(rand(-2, 2)), Math.round(rand(-2, 2)));
      // floor + desk line
      rect(0, H - 6, W, 1, C.pink);
      text('YOUR DESK', 4, H - 4, '4px ' + PIX, C.grey);
      text('WAVE ' + g.wave, W - 4, H - 4, '4px ' + PIX, C.grey, 'right');

      drawBunkers();
      for (var i = 0; i < g.blocks.length; i++) if (g.blocks[i].alive) drawBlock(g.blocks[i], g.frame);

      if (g.ufo) {
        var u = g.ufo, ux = Math.round(u.x);
        rect(ux, u.y, u.w, u.h, C.pink);
        rect(ux + 3, u.y + u.h, u.w - 6, 2, C.pinkD);
        text(u.label || 'REPLY ALL', ux + u.w / 2, u.y + 3, '6px ' + PIX, C.paper, 'center');
      }
      for (i = 0; i < g.invites.length; i++) drawInvite(g.invites[i].x, g.invites[i].y);
      for (i = 0; i < g.beams.length; i++) drawGlance(Math.round(g.beams[i].x), Math.round(g.beams[i].y), g.beams[i].t, g.beams[i].dir);

      // the player eye (blinks while invulnerable)
      if (!(p.inv > 0 && Math.floor(p.inv * 12) % 2)) {
        var lid = p.smug > 0 ? 0.45 : 0.15;
        drawEye(Math.round(p.x), PLAYER_Y, 1.4, p.look, lid, C.pink, C.paper);
      }

      for (i = 0; i < g.particles.length; i++) {
        var pt = g.particles[i];
        rect(Math.round(pt.x), Math.round(pt.y), pt.s, pt.s, pt.c);
      }
      for (i = 0; i < g.popups.length; i++) {
        var po = g.popups[i];
        ctx.globalAlpha = Math.max(0, Math.min(1, po.life / po.max * 2));
        var f = po.big ? '7px ' + PIX : '5px ' + PIX;
        ctx.font = f;
        var tw = ctx.measureText(po.text).width, px = Math.max(tw / 2 + 2, Math.min(W - tw / 2 - 2, po.x));
        text(po.text, px + 1, po.y + 1, f, C.ink, 'center');
        text(po.text, px, po.y, f, po.c, 'center');
      }
      ctx.globalAlpha = 1;

      if (g.bannerT > 0) {
        var a = Math.min(1, g.bannerT * 2);
        ctx.globalAlpha = a;
        rect(0, 124, W, 32, C.yellow);
        text(g.banner, W / 2, 127, '16px ' + DISP, C.ink, 'center');
        if (g.bannerSub) fitItalic(g.bannerSub, W / 2, 146, 7, C.ink, W - 16);
        ctx.globalAlpha = 1;
      }
      ctx.restore();

      if (g.flash > 0) { ctx.globalAlpha = g.flash * 1.2; rect(0, 0, W, H, C.pink); ctx.globalAlpha = 1; }
      drawHUD();

      if (paused) {
        ctx.globalAlpha = 0.78; rect(0, 0, W, H, C.ink); ctx.globalAlpha = 1;
        text('OUT TO LUNCH', W / 2, 92, '24px ' + DISP, C.paper, 'center');
        text('(PAUSED)', W / 2, 124, '7px ' + PIX, C.yellow, 'center');
        if (Math.floor(titleT * 2) % 2 === 0) text('TAP OR PRESS P TO RESUME', W / 2, 146, '6px ' + PIX, C.pink, 'center');
      }
    }

    function drawTitle() {
      // halftone dots
      ctx.fillStyle = 'rgba(255,46,136,.10)';
      for (var y = 6; y < H; y += 8) for (var x = (y / 8) % 2 ? 4 : 0; x < W; x += 8) ctx.fillRect(x, y, 1.5, 1.5);

      // tilted sticker
      ctx.save();
      ctx.translate(262, 26); ctx.rotate(0.12);
      rect(-38, -9, 76, 18, C.yellow);
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; ctx.strokeRect(-38, -9, 76, 18);
      text('SIDE EYE ARCADE', 0, -3, '5px ' + PIX, C.ink, 'center');
      ctx.restore();

      text('BUZZWORD', W / 2 + 2, 30, '34px ' + DISP, C.pinkD, 'center');
      text('BUZZWORD', W / 2, 28, '34px ' + DISP, C.paper, 'center');
      text('INVADERS', W / 2, 64, '22px ' + DISP, C.pink, 'center');

      var look = Math.sin(titleT * 1.3) > 0 ? 1 : -1;
      drawEye(W / 2, 112, 3, look, 0.2, C.pink, C.paper);

      if (Math.floor(titleT * 2.2) % 2 === 0) text('PRESS START / TAP TO PLAY', W / 2, 142, '8px ' + PIX, C.yellow, 'center');

      // legend
      var ly = 162;
      ctx.strokeStyle = C.pink; ctx.lineWidth = 1; ctx.strokeRect(38.5, ly + 0.5, 50, 12);
      text('SYNERGY', 63.5, ly + 4, '5px ' + PIX, C.pink, 'center');
      text('JARGON: GLARE AT IT', 96, ly + 4, '5px ' + PIX, C.paper);
      rect(38, ly + 17, 51, 12, C.teal);
      text('THANKS!', 63.5, ly + 21, '5px ' + PIX, C.ink, 'center');
      text('ACTUAL KINDNESS: DO NOT', 96, ly + 21, '5px ' + PIX, C.paper);
      drawInvite(63, ly + 40);
      text('INVITES: DODGE. 3 = DOOM', 96, ly + 38, '5px ' + PIX, C.paper);

      text('BEST ' + best + '  ·  9 TO 5, IN ' + ROUND + ' SECONDS', W / 2, 214, '5px ' + PIX, C.grey, 'center');
      text('*Counts toward zero continuing-education credits.', W / 2, 226, 'italic 6px ' + MONO, C.grey, 'center');
    }

    function wrapLines(t, maxW) {
      var words = t.split(' '), out = [], line = '';
      for (var i = 0; i < words.length; i++) {
        var test = line ? line + ' ' + words[i] : words[i];
        if (ctx.measureText(test).width > maxW && line) { out.push(line); line = words[i]; } else line = test;
      }
      if (line) out.push(line);
      return out;
    }

    var againBtn = { x: 0, y: 0, w: 0, h: 0 };
    function drawOver() {
      var r = lastResult;
      ctx.fillStyle = 'rgba(255,46,136,.10)';
      for (var y = 6; y < H; y += 8) for (var x = (y / 8) % 2 ? 4 : 0; x < W; x += 8) ctx.fillRect(x, y, 1.5, 1.5);

      // memo card
      var mx = 26, my = 6, mw = W - 52, mh = 226;
      rect(mx + 5, my + 5, mw, mh, C.pink);
      rect(mx, my, mw, mh, C.paper);
      ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.strokeRect(mx + 1, my + 1, mw - 2, mh - 2);

      text('END-OF-DAY REPORT', mx + 10, my + 9, '14px ' + DISP, C.ink);
      text('RE: YOUR PERFORMANCE  ·  CC: NOBODY, THANKFULLY  ·  FORM 5-PM-B', mx + 10, my + 28, '5px ' + MONO, C.grey);
      rect(mx + 10, my + 36, mw - 20, 1, C.ink);

      ctx.font = 'bold 7px ' + MONO;
      var reasonLines = wrapLines(REASONS[r.reason][0], mw - 20);
      for (var i = 0; i < reasonLines.length; i++) text(reasonLines[i], mx + 10, my + 41 + i * 9, 'bold 7px ' + MONO, C.ink);
      var ry = my + 41 + reasonLines.length * 9;
      text(REASONS[r.reason][1], mx + 10, ry, 'italic 6px ' + MONO, C.grey);

      text(String(r.score), mx + 10, ry + 10, '26px ' + DISP, C.pink);
      ctx.font = '26px ' + DISP;
      var sw = ctx.measureText(String(r.score)).width;
      text('POINTS', mx + 14 + sw, ry + 24, '6px ' + PIX, C.ink);
      text(r.isBest ? 'NEW PERSONAL BEST' : 'BEST ' + best, mx + mw - 10, ry + 24, '5px ' + PIX, r.isBest ? C.pinkD : C.grey, 'right');

      var ky = ry + 42;
      text('RANK:', mx + 10, ky + 2, '6px ' + PIX, C.ink);
      ctx.font = '11px ' + DISP;
      var rw = ctx.measureText(r.rank.t).width;
      rect(mx + 46, ky - 2, Math.min(rw + 8, mw - 56), 15, C.yellow);
      fitText(r.rank.t, mx + 50, ky + 1, 11, DISP, C.ink, 'left', mw - 64);
      text(r.rank.q, mx + 10, ky + 17, 'italic 6px ' + MONO, C.ink);

      var s = r.stats;
      var meetings = s.declined + s.dodged;
      var torque = (0.8 + s.glared * 0.29 + s.muted * 0.61).toFixed(2);
      var synergy = (s.glared ? 100 / (s.glared * 7 + 3) : 100).toFixed(3);
      text('JARGON GLARED ' + s.glared + '  DECLINED ' + s.declined + '  MUTED ' + s.muted, mx + 10, ky + 28, '5px ' + PIX, C.grey);
      text('KINDNESS SPARED ' + s.spared + '  RUDE ' + s.rude + (s.rude ? ' (NOTED IN FILE)' : ''), mx + 10, ky + 36, '5px ' + PIX, C.grey);
      text('MEETINGS SURVIVED: ' + meetings + '  QUARTERS CLOSED: ' + Math.max(0, r.wave - 1), mx + 10, ky + 44, '5px ' + PIX, C.grey);
      text('EYE-ROLL TORQUE: ' + torque + ' FT-LB  SYNERGY: ' + synergy + '%', mx + 10, ky + 52, '5px ' + PIX, C.grey);

      rect(mx + 10, ky + 60, mw - 20, 1, C.grey);
      text('NOTES FROM YOUR MANAGER, GARY:', mx + 10, ky + 64, '5px ' + PIX, C.pinkD);
      ctx.font = 'italic 6px ' + MONO;
      var nl = wrapLines(managerNote(r), mw - 20);
      for (i = 0; i < Math.min(2, nl.length); i++) text(nl[i], mx + 10, ky + 72 + i * 8, 'italic 6px ' + MONO, C.ink);
      text('*This report will be reviewed in a meeting about this report.', mx + 10, ky + 92, 'italic 5px ' + MONO, C.grey);

      var bw = 110, bh = 18, bx = W / 2 - bw / 2, by = my + mh - 25;
      againBtn = { x: bx, y: by, w: bw, h: bh };
      var ready = overT > 0.8;
      rect(bx + 3, by + 3, bw, bh, C.ink);
      rect(bx, by, bw, bh, ready ? C.pink : C.grey);
      text('PLAY AGAIN', W / 2, by + 6, '7px ' + PIX, C.paper, 'center');
    }

    function draw() {
      ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
      rect(0, 0, W, H, C.ink);
      if (mode === 'title') drawTitle();
      else if (mode === 'play') drawPlay();
      else drawOver();
    }

    // ---------- loop / lifecycle ----------
    function frame(ts) {
      raf = 0;
      if (!alive) return;
      var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0;
      last = ts;
      update(dt);
      draw();
      schedule();
    }
    function schedule() {
      if (!raf && alive && visible && onscreen) raf = requestAnimationFrame(frame);
    }
    function halt() { if (raf) cancelAnimationFrame(raf); raf = 0; last = 0; }

    function setPaused(v) {
      if (mode !== 'play') v = false;
      paused = v;
      keys.left = keys.right = keys.fire = false; pointer.down = false;
      setPauseUI();
      updateTouchAction();
      if (!raf) { draw(); }
    }
    function setPauseUI() {
      pauseBtn.textContent = paused ? 'Resume' : 'Pause';
      pauseBtn.setAttribute('aria-pressed', paused ? 'true' : 'false');
      pauseBtn.disabled = mode !== 'play';
      pauseBtn.style.opacity = mode === 'play' ? '1' : '.4';
    }
    function updateTouchAction() {
      canvas.style.touchAction = (mode === 'play' && !paused) ? 'none' : 'manipulation';
    }

    function resize() {
      var cw = Math.max(200, root.clientWidth || container.clientWidth || 320);
      var ch = Math.round(cw * H / W);
      dpr = Math.min(3, window.devicePixelRatio || 1);
      scale = cw / W;
      screen.style.height = ch + 'px';
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      draw();
    }

    // ---------- input ----------
    function toLogical(e) {
      var r = canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H };
    }
    function onPointerDown(e) {
      if (e.button !== undefined && e.button > 0) return;
      try { container.focus({ preventScroll: true }); } catch (err) { container.focus(); }
      var pt = toLogical(e);
      if (mode === 'title') { startGame(); return; }
      if (mode === 'over') {
        if (overT > 0.8) { mode = 'title'; titleT = 0; startGame(); }
        return;
      }
      if (paused) { setPaused(false); return; }
      e.preventDefault();
      pointer.down = true; pointer.x = pt.x;
      try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
    }
    function onPointerMove(e) {
      if (!pointer.down) return;
      pointer.x = toLogical(e).x;
    }
    function onPointerUp() { pointer.down = false; }

    var KEYMAP = { ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right', ' ': 'fire', Spacebar: 'fire', ArrowUp: 'fire', w: 'fire', W: 'fire' };
    function onKeyDown(e) {
      if (e.target !== container) return;          // let the buttons handle their own keys
      var k = e.key;
      if (mode === 'title' || mode === 'over') {
        if (k === 'Enter' || k === ' ' || k === 'Spacebar') {
          e.preventDefault();
          if (mode === 'title' || overT > 0.8) startGame();
        }
        if (k === 'm' || k === 'M') setSound(!audio.on);
        return;
      }
      if (k === 'p' || k === 'P' || k === 'Escape') { e.preventDefault(); setPaused(!paused); return; }
      if (k === 'm' || k === 'M') { setSound(!audio.on); return; }
      if (paused) { if (k === 'Enter' || k === ' ') { e.preventDefault(); setPaused(false); } return; }
      var act = KEYMAP[k];
      if (act) { e.preventDefault(); keys[act] = true; }
      if (k === 'ArrowDown') e.preventDefault();
    }
    function onKeyUp(e) {
      var act = KEYMAP[e.key];
      if (act) keys[act] = false;
    }
    function onBlur() { keys.left = keys.right = keys.fire = false; pointer.down = false; }
    function onVis() {
      visible = !document.hidden;
      if (!visible) { if (mode === 'play') setPaused(true); halt(); }
      else schedule();
    }
    function onMute(e) { e.stopPropagation(); setSound(!audio.on); }
    function onPauseBtn(e) { e.stopPropagation(); setPaused(!paused); }
    function stopProp(e) { e.stopPropagation(); }

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    container.addEventListener('keydown', onKeyDown);
    container.addEventListener('keyup', onKeyUp);
    container.addEventListener('blur', onBlur);
    document.addEventListener('visibilitychange', onVis);
    muteBtn.addEventListener('click', onMute);
    pauseBtn.addEventListener('click', onPauseBtn);
    bar.addEventListener('pointerdown', stopProp);

    var ro = null, io = null;
    if (window.ResizeObserver) { ro = new ResizeObserver(function () { resize(); }); ro.observe(root); }
    else window.addEventListener('resize', resize);
    if (window.IntersectionObserver) {
      io = new IntersectionObserver(function (entries) {
        onscreen = entries[entries.length - 1].isIntersecting;
        if (!onscreen) { if (mode === 'play') setPaused(true); halt(); }
        else schedule();
      }, { threshold: 0.15 });
      io.observe(root);
    }

    setPauseUI();
    updateTouchAction();
    resize();
    schedule();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (alive) draw(); });

    return {
      destroy: function () {
        alive = false;
        halt();
        canvas.removeEventListener('pointerdown', onPointerDown);
        canvas.removeEventListener('pointermove', onPointerMove);
        canvas.removeEventListener('pointerup', onPointerUp);
        canvas.removeEventListener('pointercancel', onPointerUp);
        container.removeEventListener('keydown', onKeyDown);
        container.removeEventListener('keyup', onKeyUp);
        container.removeEventListener('blur', onBlur);
        document.removeEventListener('visibilitychange', onVis);
        muteBtn.removeEventListener('click', onMute);
        pauseBtn.removeEventListener('click', onPauseBtn);
        bar.removeEventListener('pointerdown', stopProp);
        if (ro) ro.disconnect(); else window.removeEventListener('resize', resize);
        if (io) io.disconnect();
        if (audio.ctx) { try { audio.ctx.close(); } catch (e) { /* noop */ } audio.ctx = null; }
        container.classList.remove('hc-bzi-host');
        if (prevTab === null) container.removeAttribute('tabindex'); else container.setAttribute('tabindex', prevTab);
        container.innerHTML = '';
      },
      // test hook (harmless in production)
      _debug: function () { return { mode: mode, paused: paused, g: g, best: best }; }
    };
  }

  window.HC_GAMES = window.HC_GAMES || {};
  window.HC_GAMES.buzzword = {
    title: 'BUZZWORD INVADERS',
    tagline: 'Defend your calendar from descending jargon with one withering look.',
    mount: mount
  };
})();
