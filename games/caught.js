/* DON'T GET CAUGHT — a SIDE EYE arcade game for heatherchappell.com
   Red-light / green-light stealth: hold to side-eye, let go before they look.
   Self-contained IIFE. No dependencies, no network, no external assets. */
(function () {
  "use strict";

  var ID = "caught";
  var BEST_KEY = "hc_caught_best";
  var COL = {
    ink: "#141414", paper: "#F3ECDF", pink: "#FF2E88", pinkDark: "#D41A6E",
    yellow: "#FFE14D", teal: "#19C2B0", grey: "#6B6B6B", white: "#FFFFFF"
  };
  var F_PIXEL = "'Press Start 2P', 'Space Mono', monospace";
  var F_MONO = "'Space Mono', ui-monospace, monospace";
  var F_DISPLAY = "'Archivo Black', 'Arial Black', sans-serif";

  var SCENE_LEN = 15;      // seconds of play per scene
  var SCENES_PER_GAME = 4; // 60 seconds of play, ~70 with title cards
  var CARD_LEN = 1.9;
  var CAUGHT_LEN = 1.15;
  var BASE_RATE = 20;      // points per second while side-eyeing, before multiplier

  // ---------- Cast & copy ----------
  var SKIN = ["#F5D6BC", "#E9B48E", "#C68A62", "#8D5A3B", "#5E3A26"];
  var HAIR = { black: "#141414", brown: "#6B4226", grey: "#B9B2A8", blond: "#E8B04A", red: "#B5452B", white: "#F3ECDF" };

  // Each scene's lines play IN ORDER as one escalating mini-monologue; the last line is the topper
  // and stays up until the scene ends. tic = the tiny caption under each name plate.
  var SETTINGS = [
    {
      key: "allhands", name: "THE ALL-HANDS MEETING", short: "ALL-HANDS",
      sub: "ATTENDANCE: MANDATORY. CAMERAS: ON. SNACKS: ALLEGED.",
      foot: "*Pizza is our way of saying thanks for the weekend.",
      speakerIdx: 0,
      cast: [
        { name: "BRENT · VP OF VIBES", who: "Brent", tic: "41 QUICK SYNCS TODAY", skin: 0, hair: "spiky", hc: HAIR.blond, shirt: "#2B3A55", acc: "tie", accC: COL.pink },
        { name: "PAT · LEGAL", who: "Pat", tic: "TAKING NOTES. ON YOU.", skin: 3, hair: "bob", hc: HAIR.black, shirt: COL.teal, acc: "glasses" },
        { name: "RON · IT", who: "Ron", tic: "CAN SEE YOUR 47 TABS", skin: 1, hair: "bald", hc: HAIR.brown, shirt: "#5B5F66", acc: "glasses" }
      ],
      lines: [
        "Quick sync before the sync, everybody!",
        "Revenue is down 9%. Vibes? Up 12%.",
        "So this year, instead of raises: a gratitude wall.",
        "Every sticky note is basically a bonus. Emotionally.",
        "Please bring your own sticky notes."
      ],
      caps: [
        "You've been added to a 4:55 p.m. Friday “quick sync.”",
        "HR has sent a meeting invite titled “Just Checking In.”",
        "Pat from Legal has started a fresh page. It's about you.",
        "Ron from IT saw that. Ron from IT sees everything.",
        "Your face is now in the Q4 deck. Under “Risks.”",
        "You are now the point person for the gratitude wall.",
        "Congratulations. You're on the Fun Committee now.",
        "Your camera was on. Your camera is always on.",
        "That look has been forwarded to your skip-level.",
        "Brent would like to “unpack that” over lunch. Your lunch."
      ],
      perfects: ["LOVE THAT FOR US", "GREAT CALLOUT", "ON MUTE, SAFELY"],
      fakes: ["…checks email", "…unmutes, re-mutes", "…refills coffee"],
      cameo: {
        name: "BRENT · SOMEHOW HERE", who: "Brent", tic: "BOOKED A SYNC FOR AFTER",
        card: "ALSO ATTENDING: BRENT. NOBODY INVITED BRENT.",
        caps: [
          "Brent has put fifteen minutes on your calendar. Here.",
          "Brent would love to unpack that look. Offline.",
          "Brent is adding your face to the gratitude wall."
        ]
      }
    },
    {
      key: "thanksgiving", name: "THANKSGIVING DINNER", short: "THANKSGIVING",
      sub: "SEATING CHART: FINAL. GRAVY: CONTESTED. PANTS: STRETCHY.",
      foot: "*The casserole remains unidentified at press time.",
      speakerIdx: 2,
      cast: [
        { name: "MAMAW OPAL", who: "Mamaw", tic: "HAS SEEN IT ALL. TWICE.", skin: 1, hair: "curly", hc: HAIR.white, shirt: "#7A2E3B", acc: "pearls", glasses: true },
        { name: "COUSIN TREY", who: "Trey", tic: "PODCAST HAS 3 LISTENERS", skin: 2, hair: "cap", hc: HAIR.brown, shirt: "#3E6B48", acc: "none", capC: COL.teal },
        { name: "AUNT DARLENE", who: "Darlene", tic: "CASSEROLE: UNIDENTIFIED", skin: 0, hair: "bob", hc: HAIR.red, shirt: "#B5452B", acc: "sweater" }
      ],
      lines: [
        "Y'all! I brought my famous casserole.",
        "What's in it? Love. And a can with no label.",
        "Is it sweet? Savory? Honey, it's a journey.",
        "Mamaw took one bite and said “well.”",
        "It won a ribbon at the county fair. Category unknown."
      ],
      caps: [
        "You are now sitting at the kids' table. Permanently.",
        "This will be brought up again at Easter.",
        "Mamaw saw. Mamaw keeps a list. You're on it now.",
        "Trey is going to talk about this on the podcast.",
        "You've been assigned dishes. All of them. Forever.",
        "Congratulations, you're hosting next year.",
        "The cousins' group chat knew in 11 seconds.",
        "Your pie privileges have been suspended.",
        "Somebody's already telling this story wrong.",
        "Darlene is fixing you a plate. You know what's on it."
      ],
      perfects: ["PASS THE ROLLS", "SWEET AS PIE", "MAMAW'S FAVORITE"],
      fakes: ["…reaches for a roll", "…checks the score", "…passes the gravy"],
      cameo: {
        name: "AUNT DARLENE · AGAIN", who: "Darlene", tic: "BROUGHT THE CASSEROLE",
        card: "ALSO ATTENDING: AUNT DARLENE. SHE BROUGHT IT.",
        caps: [
          "Darlene saw. You're getting the first scoop.",
          "Darlene is making you a to-go plate. Of the casserole.",
          "Darlene would like to know what you meant by that."
        ]
      }
    },
    {
      key: "hoa", name: "THE HOA MEETING", short: "HOA MEETING",
      sub: "AGENDA ITEM 14 OF 96. QUORUM: REGRETTABLY PRESENT.",
      foot: "*Minutes have been laminated for your protection.",
      speakerIdx: 0,
      cast: [
        { name: "GARY · HOA PRESIDENT", who: "Gary", tic: "LAMINATING. ALWAYS.", skin: 0, hair: "flattop", hc: HAIR.grey, shirt: "#4A6FA5", acc: "tie", accC: COL.teal, glasses: true },
        { name: "HAL · BYLAWS", who: "Hal", tic: "QUOTES SECTION 4.2(c)", skin: 4, hair: "bald", hc: HAIR.grey, shirt: "#C9B98F", acc: "bowtie", accC: COL.teal },
        { name: "DEB · LANDSCAPING", who: "Deb", tic: "OWNS A GRASS RULER", skin: 1, hair: "long", hc: HAIR.brown, shirt: "#3E6B48", acc: "scarf", accC: COL.yellow }
      ],
      lines: [
        "Item 14 of 96: mailboxes that look too happy.",
        "Approved colors: beige, ecru and Tasteful Beige.",
        "I've laminated the swatches. And the minutes.",
        "And the approved porch emotions. There is one.",
        "Motion to laminate the laminator. All in favor?"
      ],
      caps: [
        "A violation notice has been taped to your face.",
        "The minutes now reflect your expression. Laminated.",
        "You've been fined $25 for a non-beige facial expression.",
        "Hal is citing Section 4.2(c): Eyebrows, Excessive.",
        "Deb is measuring your grass. Right now. In the dark.",
        "You've been nominated to the Bench Subcommittee.",
        "Your mailbox has been reclassified as “too cheerful.”",
        "Please see the attached 14-page letter about your face.",
        "Gary is laminating a photo of that look. For the file.",
        "The neighbors have formed a committee about you."
      ],
      perfects: ["IN COMPLIANCE", "MOTION CARRIES", "TASTEFUL BEIGE"],
      fakes: ["…adjusts lanyard", "…rereads the bylaws", "…sips tepid coffee"],
      cameo: {
        name: "GARY · HOA, STILL", who: "Gary", tic: "LAMINATING THE PROGRAM",
        card: "ALSO ATTENDING: GARY. HE BROUGHT THE LAMINATOR.",
        caps: [
          "Gary has laminated your expression. For the file.",
          "Gary is filing a formal complaint. In triplicate.",
          "Gary says that is not an approved porch emotion."
        ]
      }
    },
    {
      key: "wedding", name: "THE WEDDING TOAST", short: "WEDDING TOAST",
      sub: "OPEN BAR: CLOSING IN 9 MINUTES. TOAST: 38 INDEX CARDS.",
      foot: "*Chicken or fish? Yes.",
      speakerIdx: 2,
      cast: [
        { name: "GREAT-AUNT JUNE", who: "June", tic: "HERE FOR THE CAKE ONLY", skin: 2, hair: "curly", hc: HAIR.white, shirt: "#8C6BB1", acc: "pearls" },
        { name: "KAYLA · MAID OF HONOR", who: "Kayla", tic: "HER SPEECH IS BETTER", skin: 3, hair: "long", hc: HAIR.black, shirt: COL.teal, acc: "none" },
        { name: "TODD · BEST MAN", who: "Todd", tic: "ON INDEX CARD 1 OF 38", skin: 0, hair: "flattop", hc: HAIR.brown, shirt: COL.ink, acc: "bowtie", accC: COL.pink }
      ],
      lines: [
        "I'll keep this short. Card one of thirty-eight.",
        "I met the groom in 2011. He owed me eleven dollars.",
        "Then he met Lauren, and he became a better man.",
        "A better man who still owes me eleven dollars.",
        "To the happy couple! The eleven bucks is my gift."
      ],
      caps: [
        "You're in the background of every photo now. Forever.",
        "The videographer got that. In slow motion.",
        "You've been reseated. Next to the speakers.",
        "Great-Aunt June saw. She approved. Nobody else did.",
        "Kayla saw. Kayla is adding it to her speech.",
        "You're in the slideshow now. Slide 214.",
        "Your plus-one is pretending not to know you.",
        "The DJ is dedicating the next slow song to you.",
        "You've been volunteered for the bouquet toss.",
        "Todd heard. It's going on card 22."
      ],
      perfects: ["SMILE FOR PHOTOS", "MOVED TO TEARS", "CHEERS, Y'ALL"],
      fakes: ["…sips champagne", "…fixes a boutonniere", "…waves at a cousin"],
      cameo: {
        name: "TODD · UNINVITED", who: "Todd", tic: "STILL OWED $11",
        card: "ALSO ATTENDING: TODD. HE IS STILL OWED $11.",
        caps: [
          "Todd saw. You now owe Todd eleven dollars.",
          "Todd is working you into card thirty-nine.",
          "Todd would like a word. Several words. On cards."
        ]
      }
    }
  ];

  var CAUGHT_CAPS = [
    "Your face is now in the group chat.",
    "Somebody took a screenshot. Enhance.",
    "You are the topic of the car ride home.",
    "Noted. In permanent marker.",
    "Smile and nod. Smile and nod.",
    "They saw that. So did their mother."
  ];
  var PERFECT_LABELS = ["PERFECT", "INNOCENT FACE", "CLEAN GETAWAY", "WHO, ME?", "BUTTER WOULDN'T MELT", "BLESS YOUR HEART", "NOTHING TO SEE"];
  var SMOOTH_LABELS = ["SMOOTH", "CLOSE ONE", "JUST IN TIME", "PHEW", "SMOOTH-ISH", "SIPS TEA, INNOCENTLY"];
  var FAKE_LABELS = ["…never mind", "…false alarm"];

  var RANKS = [
    { min: 0, title: "POLITE GUEST", cap: "You smiled and nodded. The host thinks you're lovely. You are dying inside.",
      closers: [
        { who: "AUNT DARLENE", line: "Such a sweet guest. Take the casserole home. All of it." },
        { who: "GARY, HOA PRESIDENT", line: "A model resident. I've laminated your name." },
        { who: "BRENT, VP OF VIBES", line: "Zero notes. Love the energy. Let's sync." }
      ] },
    { min: 700, title: "RAISED EYEBROW", cap: "Detectable only by close family and one perceptive intern.",
      closers: [
        { who: "MAMAW OPAL", line: "I saw that eyebrow. Not bad. Not good, either." },
        { who: "HAL, BYLAWS", line: "One eyebrow. Within regulation. Barely." },
        { who: "KAYLA, MAID OF HONOR", line: "I clocked it. I respect it. Don't do it again." }
      ] },
    { min: 1400, title: "PROFESSIONAL SIDE-EYER", cap: "Silent, precise, deniable. HR has nothing on you.",
      closers: [
        { who: "PAT, LEGAL", line: "We have no record of this. Which is impressive." },
        { who: "GREAT-AUNT JUNE", line: "Honey, I taught your mother that look." },
        { who: "RON, IT", line: "I see everything. I didn't see that." }
      ] },
    { min: 2100, title: "SOUTHERN GRANDMOTHER LEVEL", cap: "Bless their heart. You said it without saying a word.",
      closers: [
        { who: "MAMAW OPAL", line: "Finally. Somebody in this family can do the look." },
        { who: "AUNT DARLENE", line: "Bless your heart. Mamaw's leaving you the pearls." },
        { who: "GREAT-AUNT JUNE", line: "I've waited ninety-one years for someone to do that." }
      ] }
  ];
  var settingRotation = 0; // module-level: each new game starts at the next setting

  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = (Math.random() * (i + 1)) | 0; var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function easeOutBack(t) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
  function shade(hex, amt) {
    var n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    r = clamp(Math.round(r * (1 + amt)), 0, 255); g = clamp(Math.round(g * (1 + amt)), 0, 255); b = clamp(Math.round(b * (1 + amt)), 0, 255);
    return "rgb(" + r + "," + g + "," + b + ")";
  }

  var styleInjected = false;
  function injectStyle() {
    if (styleInjected || document.getElementById("hc-caught-style")) { styleInjected = true; return; }
    var s = document.createElement("style");
    s.id = "hc-caught-style";
    s.textContent =
      ".hc-caught{position:relative;width:100%;background:#141414;outline:none;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;overflow:hidden;border-radius:2px}" +
      ".hc-caught:focus-visible{box-shadow:0 0 0 3px #FFE14D}" +
      ".hc-caught canvas{display:block;width:100%;touch-action:none;cursor:pointer}" +
      ".hc-caught__scan{position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(to bottom,rgba(20,20,20,0) 0,rgba(20,20,20,0) 2px,rgba(20,20,20,.13) 3px);mix-blend-mode:multiply}" +
      ".hc-caught__vig{position:absolute;inset:0;pointer-events:none;box-shadow:inset 0 0 60px rgba(0,0,0,.35)}" +
      ".hc-caught__mute{position:absolute;left:8px;bottom:8px;font:700 11px/1 'Space Mono',monospace;letter-spacing:.05em;color:#F3ECDF;background:#141414;border:2px solid #F3ECDF;padding:5px 7px;cursor:pointer;border-radius:0}" +
      ".hc-caught__mute[aria-pressed=true]{background:#FF2E88;border-color:#141414;color:#141414}" +
      ".hc-caught__mute:focus-visible{outline:2px solid #FFE14D;outline-offset:2px}" +
      ".hc-caught__sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}" +
      "@media (prefers-reduced-motion: reduce){.hc-caught__scan{opacity:.5}}";
    document.head.appendChild(s);
    styleInjected = true;
  }

  function mount(container) {
    injectStyle();
    container.innerHTML = "";
    container.classList.add("hc-caught");
    container.setAttribute("tabindex", "0");
    container.setAttribute("role", "application");
    container.setAttribute("aria-label", "Don't Get Caught: hold space, mouse, or touch to give the side eye. Let go before anyone looks at you.");

    var canvas = document.createElement("canvas");
    var scan = document.createElement("div"); scan.className = "hc-caught__scan";
    var vig = document.createElement("div"); vig.className = "hc-caught__vig";
    var muteBtn = document.createElement("button");
    muteBtn.type = "button"; muteBtn.className = "hc-caught__mute";
    muteBtn.setAttribute("aria-pressed", "false");
    muteBtn.textContent = "SOUND: OFF";
    var live = document.createElement("div"); live.className = "hc-caught__sr"; live.setAttribute("aria-live", "polite");
    container.appendChild(canvas); container.appendChild(scan); container.appendChild(vig);
    container.appendChild(muteBtn); container.appendChild(live);
    var ctx = canvas.getContext("2d");

    var reduceMotion = false;
    var mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    if (mq) reduceMotion = mq.matches;

    // ---------- sizing ----------
    var W = 640, H = 400, cssW = 640, dpr = 1, k = 1;
    function resize() {
      var w = container.clientWidth || 640;
      cssW = w;
      W = w < 560 ? 420 : 640;
      H = 400;
      dpr = Math.min(window.devicePixelRatio || 1, 3);
      k = cssW / W;
      var cssH = Math.round(cssW * H / W);
      canvas.style.height = cssH + "px";
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      muteBtn.style.fontSize = (cssW < 420 ? 9 : 11) + "px";
      draw();
    }

    // ---------- audio (off by default) ----------
    var muted = true, actx = null;
    function ensureAudio() {
      if (actx) return actx;
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try { actx = new AC(); } catch (e) { actx = null; }
      return actx;
    }
    function tone(freq, dur, type, vol, slideTo, delay) {
      if (muted || !actx) return;
      try {
        var t0 = actx.currentTime + (delay || 0);
        var o = actx.createOscillator(), g = actx.createGain();
        o.type = type || "square";
        o.frequency.setValueAtTime(freq, t0);
        if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(vol || 0.06, t0 + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        o.connect(g); g.connect(actx.destination);
        o.start(t0); o.stop(t0 + dur + 0.02);
      } catch (e) { /* ignore */ }
    }
    var sfx = {
      start: function () { tone(330, 0.08, "square", 0.05); tone(494, 0.08, "square", 0.05, 0, 0.08); tone(659, 0.14, "square", 0.05, 0, 0.16); },
      mult: function (m) { tone(440 + m * 120, 0.07, "triangle", 0.06); },
      tell: function () { tone(880, 0.05, "square", 0.025); },
      caught: function () { tone(220, 0.45, "sawtooth", 0.08, 70); tone(110, 0.35, "square", 0.05, 55, 0.05); },
      perfect: function () { tone(784, 0.08, "triangle", 0.07); tone(1175, 0.16, "triangle", 0.07, 0, 0.08); },
      scene: function () { tone(523, 0.08, "square", 0.04); tone(659, 0.08, "square", 0.04, 0, 0.09); },
      end: function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0.12, "triangle", 0.06, 0, i * 0.1); }); }
    };
    function setMuted(m) {
      muted = m;
      if (!muted) { ensureAudio(); if (actx && actx.state === "suspended") actx.resume(); tone(660, 0.06, "square", 0.04); }
      muteBtn.textContent = muted ? "SOUND: OFF" : "SOUND: ON";
      muteBtn.setAttribute("aria-pressed", muted ? "false" : "true");
    }

    // ---------- best score ----------
    function loadBest() { try { return parseInt(localStorage.getItem(BEST_KEY), 10) || 0; } catch (e) { return 0; } }
    function saveBest(v) { try { localStorage.setItem(BEST_KEY, String(v)); } catch (e) { /* ignore */ } }
    var best = loadBest();

    // ---------- halftone pattern ----------
    var halftone = null;
    (function () {
      try {
        var pc = document.createElement("canvas"); pc.width = 6; pc.height = 6;
        var p = pc.getContext("2d"); p.fillStyle = "#000"; p.beginPath(); p.arc(1.5, 1.5, 1, 0, Math.PI * 2); p.fill();
        p.beginPath(); p.arc(4.5, 4.5, 1, 0, Math.PI * 2); p.fill();
        halftone = ctx.createPattern(pc, "repeat");
      } catch (e) { halftone = null; }
    })();

    // ---------- game state ----------
    var S = {
      mode: "title",      // title | card | play | caught | results
      paused: false,
      t: 0,               // wall-ish animation time
      gt: 0,              // game time (frozen during caught/cards)
      sceneIdx: 0, sceneT: 0, cardT: 0, caughtT: 0, resultsT: 0,
      startSetting: 0, setting: null,
      score: 0, strikes: 0, holdTime: 0, totalHeld: 0, mult: 1,
      inputDown: false, requireRepress: false, holding: false,
      lastReleaseAt: -99, lastHoldDur: 0, invulnUntil: 0,
      se: 0,              // visual side-eye amount 0..1
      perfects: 0, caughtCount: 0, sceneCaught: 0, ejected: false, newBest: false,
      lines: [], lineIdx: 0, lineT: 0, lineDur: 3.6, lineGap: 0, chars: 0,
      people: [], pops: [], shake: 0, flash: 0, caughtCap: "", caughtWho: -1,
      lastTellAt: -99, blinkT: 2, blink: 0, rank: null, cardSub: "", cardBonus: 0,
      lineScale: 1, cameoIdx: -1, cameo: null, usedCaps: [], catchers: {}, closer: null, caughtName: ""
    };

    function difficulty() { return clamp((S.sceneIdx + S.sceneT / SCENE_LEN) / SCENES_PER_GAME, 0, 1); }

    function setupScene() {
      var set = SETTINGS[(S.startSetting + S.sceneIdx) % SETTINGS.length];
      S.setting = set;
      // monologue plays in order; squeeze pacing so the topper lands with ~3s to spare
      S.lines = set.lines.slice(); S.lineIdx = 0; S.lineT = 0; S.chars = 0; S.lineGap = 0.4;
      S.lineDur = 3.6;
      var need = 0;
      for (var li = 0; li < S.lines.length - 1; li++) need += 1.6 + S.lines[li].length * 0.042;
      var budget = SCENE_LEN - 0.4 - 3.2 - 0.35 * (S.lines.length - 1);
      S.lineScale = clamp(need > 0 ? budget / need : 1, 0.6, 1);
      var sp = set.speakerIdx;
      var nonSpeakers = [0, 1, 2].filter(function (i) { return i !== sp; });
      var watchers;
      if (S.sceneIdx === 0) watchers = [nonSpeakers[1]];
      else if (S.sceneIdx < 3) watchers = nonSpeakers;
      else watchers = [0, 1, 2];
      // callback: in the final scene, the first scene's speaker turns up as a guest
      var cast = set.cast.slice();
      S.cameoIdx = -1; S.cameo = null;
      if (S.sceneIdx === SCENES_PER_GAME - 1) {
        var origin = SETTINGS[S.startSetting % SETTINGS.length];
        if (origin !== set && origin.cameo) {
          var src = origin.cast[origin.speakerIdx], cc = {};
          for (var ck in src) if (Object.prototype.hasOwnProperty.call(src, ck)) cc[ck] = src[ck];
          cc.name = origin.cameo.name; cc.who = origin.cameo.who; cc.tic = origin.cameo.tic; cc.cameo = origin.cameo;
          S.cameoIdx = nonSpeakers[1]; S.cameo = origin.cameo;
          cast[S.cameoIdx] = cc;
        }
      }
      S.people = cast.map(function (c, i) {
        return {
          c: c, i: i, speaker: i === sp, watcher: watchers.indexOf(i) >= 0,
          state: "idle", st: 0, tellDur: 0.6, lookDur: 1, fake: false, holdAtTell: false,
          next: 1.4 + rand(0.4, 2.2) + (watchers.indexOf(i) * 0.9), bob: rand(0, 6), pop: 0
        };
      });
      S.sceneT = 0; S.sceneCaught = 0;
    }

    function startGame() {
      S.startSetting = settingRotation % SETTINGS.length;
      settingRotation++;
      S.score = 0; S.strikes = 0; S.holdTime = 0; S.totalHeld = 0; S.mult = 1;
      S.perfects = 0; S.caughtCount = 0; S.ejected = false; S.newBest = false;
      S.usedCaps = []; S.catchers = {}; S.closer = null;
      S.sceneIdx = 0; S.gt = 0; S.pops = []; S.shake = 0; S.flash = 0;
      S.lastReleaseAt = -99; S.invulnUntil = 0; S.lastTellAt = -99;
      S.requireRepress = S.inputDown;
      setupScene();
      S.cardBonus = 0;
      S.mode = "card"; S.cardT = 0;
      sfx.start();
      announce("Scene 1: " + S.setting.name);
    }

    function endGame() {
      S.mode = "results"; S.resultsT = 0;
      S.score = Math.floor(S.score);
      var r = RANKS[0];
      for (var i = 0; i < RANKS.length; i++) if (S.score >= RANKS[i].min) r = RANKS[i];
      S.rank = r;
      S.closer = pick(r.closers);
      if (S.score > best) { best = S.score; saveBest(best); S.newBest = S.score > 0; }
      sfx.end();
      announce("Final score " + S.score + ". Rank: " + r.title + ". " + r.cap + " " + S.closer.who + " says: " + S.closer.line);
    }

    function announce(msg) { live.textContent = msg; }

    function addPop(txt, x, y, color, size, life) {
      S.pops.push({ txt: txt, x: x, y: y, color: color || COL.yellow, size: size || 16, life: life || 1.1, t: 0 });
    }

    // ---------- input ----------
    function press() {
      if (S.paused) { S.paused = false; S.requireRepress = true; S.inputDown = true; return; }
      S.inputDown = true;
      if (S.mode === "title") { startGame(); return; }
      if (S.mode === "results") { if (S.resultsT > 0.9) startGame(); return; }
    }
    function release() {
      S.inputDown = false;
      S.requireRepress = false;
    }

    function onKeyDown(e) {
      var k2 = e.key;
      if (k2 === "m" || k2 === "M") { setMuted(!muted); return; }
      if (k2 === " " || k2 === "Spacebar" || k2 === "Enter" || k2 === "ArrowUp" || k2 === "ArrowDown" || k2 === "ArrowLeft" || k2 === "ArrowRight") {
        if (e.target === muteBtn && k2 !== " " && k2 !== "Spacebar") return;
        if (e.target === muteBtn) return; // let the button handle space itself
        e.preventDefault();
        if (e.repeat) return;
        if (k2 === " " || k2 === "Spacebar" || k2 === "Enter") press();
      }
    }
    function onKeyUp(e) {
      if (e.target === muteBtn) return;
      if (e.key === " " || e.key === "Spacebar" || e.key === "Enter") { e.preventDefault(); release(); }
    }
    function onPointerDown(e) {
      if (e.button !== undefined && e.button > 0) return;
      try { container.focus({ preventScroll: true }); } catch (x) { container.focus(); }
      try { canvas.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ }
      e.preventDefault();
      press();
    }
    function onPointerUp(e) { release(); }
    function onBlur() { release(); }
    function onMute(e) { e.stopPropagation(); setMuted(!muted); }
    function stopProp(e) { e.stopPropagation(); }
    function onContext(e) { e.preventDefault(); }

    container.addEventListener("keydown", onKeyDown);
    container.addEventListener("keyup", onKeyUp);
    container.addEventListener("blur", onBlur);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("lostpointercapture", onPointerUp);
    canvas.addEventListener("contextmenu", onContext);
    muteBtn.addEventListener("click", onMute);
    muteBtn.addEventListener("pointerdown", stopProp);

    // ---------- update ----------
    function update(dt) {
      S.t += dt;
      // pops
      for (var i = S.pops.length - 1; i >= 0; i--) { S.pops[i].t += dt; if (S.pops[i].t > S.pops[i].life) S.pops.splice(i, 1); }
      S.shake = Math.max(0, S.shake - dt * 3);
      S.flash = Math.max(0, S.flash - dt * 2.5);
      // blink for the title eye
      S.blinkT -= dt; if (S.blinkT < 0) { S.blink = 0.14; S.blinkT = rand(2, 4.5); }
      if (S.blink > 0) S.blink = Math.max(0, S.blink - dt);

      var wasHolding = S.holding;
      S.holding = S.mode === "play" && S.inputDown && !S.requireRepress && !S.paused;
      if (S.mode === "title") S.se = 0.5 + 0.5 * Math.sin(S.t * 1.6) > 0.55 ? Math.min(1, S.se + dt * 6) : Math.max(0, S.se - dt * 6);
      else S.se = S.holding ? Math.min(1, S.se + dt * 9) : Math.max(0, S.se - dt * 7);

      if (wasHolding && !S.holding && S.mode === "play") { S.lastReleaseAt = S.gt; S.lastHoldDur = S.holdTime; }
      if (!S.holding) { S.holdTime = 0; S.mult = 1; }

      for (var p = 0; p < S.people.length; p++) S.people[p].pop = Math.max(0, S.people[p].pop - dt * 4);

      if (S.mode === "card") {
        S.cardT += dt;
        if (S.cardT >= CARD_LEN) { S.mode = "play"; }
        return;
      }
      if (S.mode === "results") { S.resultsT += dt; return; }
      if (S.mode === "caught") {
        S.caughtT += dt;
        if (S.caughtT >= CAUGHT_LEN) {
          var who = S.people[S.caughtWho];
          if (who) { who.state = "idle"; who.st = 0; who.next = S.sceneT + rand(1.6, 2.6); }
          S.invulnUntil = S.gt + 0.5;
          if (S.strikes >= 3) { S.ejected = true; endGame(); }
          else S.mode = "play";
        }
        return;
      }
      if (S.mode !== "play") return;

      S.gt += dt; S.sceneT += dt;
      var d = difficulty();

      // scoring
      if (S.holding) {
        S.holdTime += dt; S.totalHeld += dt;
        var m = S.holdTime >= 3 ? 3 : S.holdTime >= 1.4 ? 2 : 1;
        if (m > S.mult) { S.mult = m; addPop("x" + m + "!", W / 2 + 110, 322, m === 3 ? COL.pink : COL.yellow, 18, 0.8); sfx.mult(m); }
        S.mult = m;
        S.score += BASE_RATE * m * dt;
      }

      // speaker lines
      var speaker = null;
      for (var q = 0; q < S.people.length; q++) if (S.people[q].speaker) speaker = S.people[q];
      var speakerLooking = speaker && (speaker.state === "look" || speaker.state === "tell");
      if (S.lineGap > 0) { S.lineGap -= dt; }
      else if (!speakerLooking) {
        S.lineT += dt;
        var line = S.lines[S.lineIdx % S.lines.length];
        S.chars = Math.min(line.length, S.lineT * 42);
        S.lineDur = Math.max(line.length / 42 + 1.1, (1.6 + line.length * 0.042) * S.lineScale);
        var lastLine = S.lineIdx >= S.lines.length - 1;
        // the topper stays up; if the scene is running out, skip ahead so it still lands
        var rushTopper = !lastLine && S.sceneT > SCENE_LEN - 4.2 && S.chars >= line.length && S.lineT > line.length / 42 + 0.6;
        if (!lastLine && (S.lineT > S.lineDur || rushTopper)) {
          S.lineIdx = rushTopper ? S.lines.length - 1 : S.lineIdx + 1;
          S.lineT = 0; S.chars = 0; S.lineGap = 0.35;
        }
      }

      // watchers
      var tellDur = lerp(0.72, 0.4, d);
      for (var w = 0; w < S.people.length; w++) {
        var P = S.people[w];
        if (!P.watcher) continue;
        if (P.state === "idle") {
          if (S.sceneT >= P.next && S.sceneT < SCENE_LEN - 0.6) {
            if (S.gt - S.lastTellAt < 0.75) { P.next = S.sceneT + 0.3; continue; }
            P.state = "tell"; P.st = 0; P.tellDur = tellDur * rand(0.92, 1.08);
            P.fake = S.sceneIdx >= 2 && Math.random() < 0.24;
            P.holdAtTell = S.holding;
            P.pop = 1;
            S.lastTellAt = S.gt;
            sfx.tell();
          }
        } else if (P.state === "tell") {
          P.st += dt;
          if (P.st >= P.tellDur) {
            if (P.fake) {
              P.state = "back"; P.st = 0;
              addPop(pick(S.setting.fakes.concat(FAKE_LABELS)), personX(P.i), 128, COL.paper, 12, 1.0);
            } else {
              P.state = "look"; P.st = 0; P.lookDur = rand(0.85, 1.25) - 0.2 * d; P.pop = 1;
              // perfect release check
              if (!S.holding && P.holdAtTell && S.lastReleaseAt >= S.gt - P.tellDur - 0.02 && S.lastHoldDur >= 0.35) {
                var margin = S.gt - S.lastReleaseAt;
                if (margin <= 0.28) { S.score += 100; S.perfects++; addPop(pick(S.setting.perfects.concat(PERFECT_LABELS)) + " +100", W / 2, 286, COL.teal, 15, 1.2); sfx.perfect(); }
                else { S.score += 40; addPop(pick(SMOOTH_LABELS) + " +40", W / 2, 286, COL.yellow, 14, 1.0); }
              }
            }
          }
        } else if (P.state === "look") {
          P.st += dt;
          if (S.holding && S.gt >= S.invulnUntil) { getCaught(P); return; }
          if (P.st >= P.lookDur) { P.state = "back"; P.st = 0; }
        } else if (P.state === "back") {
          P.st += dt;
          if (P.st >= 0.3) {
            P.state = "idle"; P.st = 0;
            var lo = lerp(2.6, 1.5, d), hi = lerp(4.8, 3.0, d);
            if (S.sceneIdx === 3) { lo += 0.6; hi += 1.0; }
            P.next = S.sceneT + rand(lo, hi);
          }
        }
      }

      // scene end
      if (S.sceneT >= SCENE_LEN) {
        S.cardBonus = 0;
        if (S.sceneCaught === 0) { S.cardBonus = 150; S.score += 150; }
        S.sceneIdx++;
        if (S.sceneIdx >= SCENES_PER_GAME) { endGame(); return; }
        setupScene();
        S.mode = "card"; S.cardT = 0;
        sfx.scene();
        announce("Scene " + (S.sceneIdx + 1) + ": " + S.setting.name);
      }
    }

    function getCaught(P) {
      S.strikes++; S.caughtCount++; S.sceneCaught++;
      S.mode = "caught"; S.caughtT = 0; S.caughtWho = P.i;
      P.state = "stare"; P.st = 0; P.pop = 1;
      S.caughtCap = pickCaption(P);
      S.caughtName = P.c.name.split(" · ")[0];
      S.catchers[S.caughtName] = (S.catchers[S.caughtName] || 0) + 1;
      S.shake = reduceMotion ? 0 : 1; S.flash = reduceMotion ? 0.4 : 1;
      S.requireRepress = true; S.holding = false; S.holdTime = 0; S.mult = 1;
      sfx.caught();
      announce("Caught! " + S.caughtCap + " Strike " + S.strikes + " of 3.");
      if (navigator.vibrate && !reduceMotion) { try { navigator.vibrate(120); } catch (e) { /* ignore */ } }
    }

    function pickCaption(P) {
      var pool = P.c.cameo ? P.c.cameo.caps : (Math.random() < 0.8 ? S.setting.caps : CAUGHT_CAPS);
      // don't credit the catch to a bystander: skip captions naming a guest who isn't the catcher or the speaker
      var spk = S.setting.cast[S.setting.speakerIdx].who;
      var others = S.setting.cast.map(function (c) { return c.who; }).concat(S.people.map(function (o) { return o.c.who; }))
        .filter(function (w) { return w && w !== P.c.who && w !== spk; });
      var fair = function (c) { for (var i = 0; i < others.length; i++) if (new RegExp("\\b" + others[i] + "\\b").test(c)) return false; return true; };
      var fresh = pool.filter(function (c) { return S.usedCaps.indexOf(c) < 0 && fair(c); });
      if (!fresh.length) fresh = S.setting.caps.concat(CAUGHT_CAPS).filter(function (c) { return S.usedCaps.indexOf(c) < 0 && fair(c); });
      if (!fresh.length) fresh = CAUGHT_CAPS;
      var cap = pick(fresh);
      S.usedCaps.push(cap);
      return cap;
    }

    // ---------- drawing helpers ----------
    function rect(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); }
    function text(str, x, y, font, size, color, align, baseline) {
      ctx.font = font.indexOf("Press") >= 0 ? size + "px " + font : "700 " + size + "px " + font;
      if (font === F_DISPLAY) ctx.font = size + "px " + font;
      ctx.fillStyle = color; ctx.textAlign = align || "left"; ctx.textBaseline = baseline || "alphabetic";
      ctx.fillText(str, x, y);
    }
    function setFont(font, size) {
      ctx.font = (font === F_MONO ? "700 " : "") + size + "px " + font;
    }
    function wrap(str, maxW) {
      var words = str.split(" "), lines = [], cur = "";
      for (var i = 0; i < words.length; i++) {
        var test = cur ? cur + " " + words[i] : words[i];
        if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = words[i]; }
        else cur = test;
      }
      if (cur) lines.push(cur);
      return lines;
    }
    function boxShadowed(x, y, w, h, fill, off) {
      off = off == null ? 4 : off;
      rect(x + off, y + off, w, h, COL.ink);
      rect(x, y, w, h, COL.ink);
      rect(x + 3, y + 3, w - 6, h - 6, fill);
    }
    function personX(i) { return Math.round(W * [0.2, 0.5, 0.8][i]); }

    // ---------- backgrounds ----------
    var TABLE_Y = 236, PANEL_Y = 292;
    function drawWall(set) {
      var key = set.key;
      var wallC = { allhands: "#E4E1DA", thanksgiving: "#EBD8B7", hoa: "#C99E6E", wedding: "#F6C9D9" }[key];
      rect(0, 0, W, PANEL_Y, wallC);
      if (key === "thanksgiving") {
        for (var x = 0; x < W; x += 32) rect(x, 30, 12, TABLE_Y - 30, "rgba(181,69,43,.10)");
        // window
        boxShadowed(W * 0.5 - 70, 46, 140, 96, "#9ED8E8", 0);
        rect(W * 0.5 - 2, 46, 4, 96, COL.ink); rect(W * 0.5 - 70, 92, 140, 4, COL.ink);
        rect(W * 0.5 - 64, 120, 128, 19, "#E8B04A");
        // framed portrait
        boxShadowed(30, 60, 50, 60, "#D9C6A5", 0); rect(47, 78, 16, 18, COL.grey); rect(43, 96, 24, 18, COL.grey);
      } else if (key === "hoa") {
        for (var x2 = 0; x2 < W; x2 += 40) rect(x2, 30, 3, TABLE_Y - 30, "rgba(20,20,20,.18)");
        // banner
        var bw = W - 80;
        rect(40, 44, bw, 40, COL.paper); rect(40, 44, bw, 3, COL.ink); rect(40, 81, bw, 3, COL.ink);
        rect(40, 44, 3, 40, COL.ink); rect(37 + bw, 44, 3, 40, COL.ink);
        text("HOA MONTHLY MEETING", W / 2, 62, F_MONO, W < 600 ? 13 : 15, COL.ink, "center", "middle");
        text("AGENDA ITEM 14 OF 96", W / 2, 76, F_MONO, 10, COL.pinkDark, "center", "middle");
        // clock
        ctx.fillStyle = COL.ink; ctx.beginPath(); ctx.arc(W - 50, 120, 18, 0, 7); ctx.fill();
        ctx.fillStyle = COL.paper; ctx.beginPath(); ctx.arc(W - 50, 120, 14, 0, 7); ctx.fill();
        rect(W - 51, 108, 2, 12, COL.ink); rect(W - 51, 119, 10, 2, COL.ink);
      } else if (key === "wedding") {
        // string lights
        for (var s = 0; s < 2; s++) {
          var yy = 50 + s * 34;
          for (var x3 = 0; x3 <= W; x3 += 8) {
            var sag = Math.sin((x3 / W) * Math.PI * 3) * 8;
            rect(x3, yy + sag, 8, 2, "rgba(20,20,20,.35)");
            if (x3 % 40 === 0) {
              var on = Math.sin(S.t * 3 + x3 * 0.3 + s) > -0.3;
              rect(x3 - 3, yy + sag + 2, 7, 7, on ? COL.yellow : "#C9B98F");
            }
          }
        }
        // drapes
        rect(0, 30, 24, TABLE_Y, COL.paper); rect(W - 24, 30, 24, TABLE_Y, COL.paper);
        rect(20, 30, 4, TABLE_Y, "rgba(20,20,20,.15)"); rect(W - 24, 30, 4, TABLE_Y, "rgba(20,20,20,.15)");
      } else {
        // all-hands: projector screen with a declining chart
        var sx = W * 0.5 - 100, sy = 42;
        rect(sx - 6, sy - 6, 212, 6, COL.grey);
        rect(sx, sy, 200, 104, COL.white); rect(sx, sy, 200, 3, COL.ink); rect(sx, sy + 101, 200, 3, COL.ink);
        rect(sx, sy, 3, 104, COL.ink); rect(sx + 197, sy, 3, 104, COL.ink);
        text("Q3 SYNERGY", sx + 100, sy + 18, F_MONO, 11, COL.ink, "center", "middle");
        var bars = [62, 50, 41, 22, 9];
        for (var b = 0; b < bars.length; b++) rect(sx + 30 + b * 30, sy + 90 - bars[b], 18, bars[b], b === 4 ? COL.pink : COL.teal);
        rect(sx + 24, sy + 90, 156, 2, COL.ink);
        // sticky label
        ctx.save(); ctx.translate(sx + 196, sy + 92); ctx.rotate(0.12);
        rect(-34, -10, 68, 20, COL.yellow); text("ON TRACK*", 0, 1, F_MONO, 9, COL.ink, "center", "middle");
        ctx.restore();
        // plant
        rect(26, 150, 26, 30, "#3E6B48"); rect(18, 160, 12, 18, "#3E6B48"); rect(48, 156, 12, 20, "#3E6B48");
      }
      if (halftone) { ctx.save(); ctx.globalAlpha = 0.06; ctx.fillStyle = halftone; ctx.fillRect(0, 30, W, TABLE_Y - 30); ctx.restore(); }
    }

    function drawTable(set) {
      var key = set.key;
      var top = { allhands: "#8C9196", thanksgiving: COL.paper, hoa: "#D8CBA8", wedding: COL.white }[key];
      var front = { allhands: "#5B5F66", thanksgiving: "#F0E4CC", hoa: "#B8A984", wedding: "#F3ECDF" }[key];
      rect(0, TABLE_Y, W, 14, top);
      rect(0, TABLE_Y, W, 3, COL.ink);
      rect(0, TABLE_Y + 14, W, PANEL_Y - TABLE_Y - 14, front);
      rect(0, TABLE_Y + 14, W, 3, COL.ink);
      if (key === "thanksgiving" || key === "wedding") {
        // tablecloth scallops
        for (var x = 0; x < W; x += 24) rect(x + 8, PANEL_Y - 8, 8, 8, shade(key === "wedding" ? "#F6C9D9" : "#E8B04A", 0));
      }
      // items
      if (key === "thanksgiving") drawTurkey(W * 0.5, TABLE_Y + 4);
      if (key === "wedding") { drawCake(W * 0.5, TABLE_Y + 6); drawGlass(W * 0.33, TABLE_Y + 8); drawGlass(W * 0.67, TABLE_Y + 8); }
      if (key === "allhands") { drawMug(W * 0.35, TABLE_Y + 10, COL.pink); drawMug(W * 0.65, TABLE_Y + 10, COL.teal); }
      if (key === "hoa") { drawMug(W * 0.35, TABLE_Y + 10, COL.paper); rect(W * 0.62, TABLE_Y + 2, 30, 10, COL.white); rect(W * 0.62, TABLE_Y + 2, 30, 2, COL.grey); }
      // name plates + each guest's tic underneath (cameo plate is highlighter yellow)
      var ticC = key === "allhands" ? COL.paper : COL.ink;
      var colW = W * 0.3 - 14;
      for (var i = 0; i < S.people.length; i++) {
        setFont(F_MONO, W < 600 ? 9 : 10);
        var nm = S.people[i].c.name; if (W < 600) nm = nm.split(" · ")[0];
        var tw = Math.ceil(ctx.measureText(nm).width) + 12;
        var px = personX(i) - tw / 2, py = TABLE_Y + 17;
        rect(px + 2, py + 2, tw, 16, COL.ink);
        rect(px, py, tw, 16, S.people[i].c.cameo ? COL.yellow : COL.paper); rect(px, py, tw, 2, COL.ink);
        text(nm, personX(i), py + 9, F_MONO, W < 600 ? 9 : 10, COL.ink, "center", "middle");
        var tic = S.people[i].c.tic;
        if (tic) {
          var ts = W < 600 ? 8 : 9;
          setFont(F_MONO, ts);
          while (ts > 6 && ctx.measureText(tic).width > colW) { ts -= 0.5; setFont(F_MONO, ts); }
          text(tic, personX(i), py + 27, F_MONO, ts, ticC, "center", "middle");
        }
      }
    }
    function drawTurkey(x, y) {
      x = Math.round(x);
      rect(x - 30, y + 6, 60, 6, COL.white); rect(x - 32, y + 10, 64, 3, COL.ink);
      rect(x - 22, y - 12, 44, 20, "#B8692E"); rect(x - 18, y - 16, 36, 6, "#C97B3A");
      rect(x - 30, y - 8, 10, 6, "#C97B3A"); rect(x + 20, y - 8, 10, 6, "#C97B3A");
      rect(x - 34, y - 10, 5, 5, COL.white); rect(x + 29, y - 10, 5, 5, COL.white);
      rect(x - 10, y - 14, 12, 3, "#E0A060");
    }
    function drawCake(x, y) {
      x = Math.round(x);
      rect(x - 22, y - 8, 44, 16, COL.white); rect(x - 22, y - 8, 44, 2, COL.ink);
      rect(x - 14, y - 22, 28, 14, COL.white); rect(x - 14, y - 22, 28, 2, COL.ink);
      rect(x - 22, y - 1, 44, 3, COL.pink); rect(x - 14, y - 15, 28, 3, COL.pink);
      rect(x - 6, y - 30, 4, 8, COL.ink); rect(x + 2, y - 30, 4, 8, COL.ink);
      rect(x - 7, y - 34, 6, 5, COL.ink); rect(x + 1, y - 34, 6, 5, COL.ink);
    }
    function drawGlass(x, y) { x = Math.round(x); rect(x - 4, y - 14, 8, 10, "#F5E6A8"); rect(x - 1, y - 4, 2, 6, COL.ink); rect(x - 4, y + 2, 8, 2, COL.ink); }
    function drawMug(x, y, c) { x = Math.round(x); rect(x - 6, y - 10, 12, 12, c); rect(x + 6, y - 7, 4, 6, COL.ink); rect(x - 6, y - 10, 12, 2, COL.ink); }

    // ---------- characters ----------
    var CELL = 4;
    function drawBust(P, cx, baseY) {
      var ch = P.c;
      var skin = SKIN[ch.skin], skinD = shade(SKIN[ch.skin], -0.16);
      var state = P.state, st = P.st;
      var speaker = null;
      for (var q = 0; q < S.people.length; q++) if (S.people[q].speaker) speaker = S.people[q];
      var dirToSpeaker = P.speaker ? (P.i === 0 ? 1 : -1) : (speaker ? Math.sign(personX(speaker.i) - personX(P.i)) : 0);
      var look = dirToSpeaker; // -1 left, 0 at YOU, 1 right
      var stare = false, browL = 0, browR = 0, jitter = 0, squint = false;
      var tellP = 0;
      if (state === "tell") {
        tellP = clamp(st / P.tellDur, 0, 1);
        browL = 1;
        jitter = reduceMotion ? 0 : Math.round(Math.sin(st * 46) * (tellP > 0.25 ? 1.5 : 0.5));
        if (tellP > 0.62) look = 0;
      } else if (state === "look" || state === "stare") {
        look = 0; stare = true; browL = state === "stare" ? 0 : 1; browR = state === "stare" ? 0 : 1; squint = state === "stare";
      } else if (state === "back") {
        look = st < 0.12 ? 0 : dirToSpeaker;
      }
      var bob = reduceMotion ? 0 : Math.round(Math.sin(S.t * 1.7 + P.bob) * 1.2);
      var talking = P.speaker && S.mode === "play" && S.lineGap <= 0 && !(state === "look" || state === "tell") && S.chars < (S.lines[S.lineIdx % S.lines.length] || "").length;
      var mouthOpen = talking && Math.sin(S.t * 22) > 0;

      var popS = 1 + (reduceMotion ? 0 : easeOutBack(1 - P.pop) * 0 + P.pop * 0.08);
      ctx.save();
      ctx.translate(cx, baseY);
      ctx.scale(popS, popS);
      ctx.translate(-cx, -baseY);

      var ox = Math.round(cx - 6 * CELL + jitter * 2), oy = Math.round(baseY - 23 * CELL + bob);
      function c(x, y, w, h, col) { ctx.fillStyle = col; ctx.fillRect(ox + x * CELL, oy + y * CELL, w * CELL, h * CELL); }
      var bx = Math.round(cx - 6 * CELL), by = Math.round(baseY - 23 * CELL); // body doesn't jitter
      function cb(x, y, w, h, col) { ctx.fillStyle = col; ctx.fillRect(bx + x * CELL, by + y * CELL, w * CELL, h * CELL); }

      // body + outline
      cb(-6, 14, 24, 10, COL.ink);
      cb(-5, 15, 22, 9, ch.shirt);
      cb(-4, 14, 20, 1, COL.ink);
      cb(-4, 15, 20, 1, ch.shirt);
      cb(-5, 15, 1, 1, COL.ink); cb(16, 15, 1, 1, COL.ink);
      // neck
      cb(4, 12, 4, 4, COL.ink); cb(4.5, 12, 3, 4, skinD);
      // accessories on body
      if (ch.acc === "tie") { cb(5, 15, 2, 1, skin); cb(5, 16, 2, 6, ch.accC || COL.pink); cb(4, 15, 1, 1, COL.white); cb(7, 15, 1, 1, COL.white); }
      if (ch.acc === "bowtie") { cb(3, 15, 2, 2, ch.accC || COL.pink); cb(7, 15, 2, 2, ch.accC || COL.pink); cb(5, 15, 2, 2, shade(ch.accC || COL.pink, -0.3)); }
      if (ch.acc === "pearls") { for (var pz = 0; pz < 5; pz++) cb(2 + pz * 2, 15 + (pz === 0 || pz === 4 ? 0 : 1), 1, 1, COL.white); }
      if (ch.acc === "scarf") { cb(1, 14.5, 10, 2, ch.accC || COL.yellow); cb(8, 16, 2, 4, ch.accC || COL.yellow); }
      if (ch.acc === "sweater") { for (var sw = 0; sw < 6; sw++) cb(-4 + sw * 4, 19, 2, 2, COL.paper); cb(-5, 22, 22, 1, shade(ch.shirt, -0.3)); }

      // long hair behind head
      if (ch.hair === "long") { c(-2, 0, 16, 17, COL.ink); c(-1, 1, 14, 16, ch.hc); }
      if (ch.hair === "bun") { c(3, -4, 6, 4, COL.ink); c(4, -3, 4, 3, ch.hc); }
      // head outline + skin
      c(0, -1, 12, 15, COL.ink); c(-1, 0, 14, 13, COL.ink);
      c(1, 0, 10, 13, skin); c(0, 1, 12, 11, skin);
      // ears
      c(-1, 5, 1, 3, skin); c(12, 5, 1, 3, skin);
      // hair
      var hc = ch.hc;
      if (ch.hair === "bob") { c(-1, -1, 14, 4, COL.ink); c(0, 0, 12, 3, hc); c(-1, 2, 2, 9, hc); c(11, 2, 2, 9, hc); c(-2, 2, 1, 9, COL.ink); c(13, 2, 1, 9, COL.ink); }
      else if (ch.hair === "spiky") { c(-1, -1, 14, 4, COL.ink); c(0, -1, 12, 3, hc); c(1, -3, 2, 2, hc); c(5, -3, 2, 2, hc); c(9, -3, 2, 2, hc); c(3, -2, 2, 1, hc); c(7, -2, 2, 1, hc); }
      else if (ch.hair === "bald") { c(-1, 3, 2, 3, hc); c(11, 3, 2, 3, hc); c(3, 1, 3, 1, shade(skin, 0.12)); }
      else if (ch.hair === "flattop") { c(-1, -3, 14, 6, COL.ink); c(0, -2, 12, 4, hc); c(-1, 2, 1, 3, hc); c(12, 2, 1, 3, hc); }
      else if (ch.hair === "bun") { c(-1, -1, 14, 4, COL.ink); c(0, 0, 12, 3, hc); c(-1, 2, 1, 4, hc); c(12, 2, 1, 4, hc); }
      else if (ch.hair === "long") { c(0, -1, 12, 3, hc); c(0, 2, 2, 2, hc); c(10, 2, 2, 2, hc); }
      else if (ch.hair === "curly") {
        c(-2, -2, 16, 5, COL.ink);
        for (var cu = -1; cu < 13; cu += 2) { c(cu, -2 + (cu % 4 === 1 ? 0 : 1), 2, 2, hc); c(cu, 0, 2, 2, hc); }
        c(-2, 2, 2, 6, hc); c(12, 2, 2, 6, hc); c(-1, 1, 14, 2, hc);
      } else if (ch.hair === "cap") {
        var capC = ch.capC || COL.teal;
        c(-1, -2, 14, 5, COL.ink); c(0, -1, 12, 3, capC); c(-3, 2, 8, 1, shade(capC, -0.3)); c(5, 0, 2, 1, COL.white);
        c(11, 2, 1, 3, hc);
      }
      // eyes
      var eyY = stare ? 4 : 5, eyH = stare ? 3 : 2;
      if (squint) { eyY = 5; eyH = 2; }
      var glasses = ch.acc === "glasses" || ch.glasses;
      if (glasses) { c(1, 4, 5, 4, COL.ink); c(6, 4, 5, 4, COL.ink); c(0, 5, 1, 1, COL.ink); c(11, 5, 1, 1, COL.ink); }
      c(2, eyY, 3, eyH, COL.white); c(7, eyY, 3, eyH, COL.white);
      var pOff = look === 0 ? 1 : look < 0 ? 0 : 2;
      var pupH = stare && !squint ? 2 : eyH;
      var pupY = stare && !squint ? eyY + 0.5 : eyY;
      c(2 + pOff, pupY, 1, pupH, COL.ink); c(7 + pOff, pupY, 1, pupH, COL.ink);
      if (state === "stare") { c(2 + pOff, pupY, 1, 1, COL.pink); c(7 + pOff, pupY, 1, 1, COL.pink); }
      // brows
      if (squint) { c(2, 3, 3, 1, COL.ink); c(4, 4, 1, 1, COL.ink); c(7, 3, 3, 1, COL.ink); c(7, 4, 1, 1, COL.ink); }
      else { c(2, 3 - browL, 3, 1, ch.hair === "bald" || ch.hc === HAIR.white ? shade(ch.hc, -0.4) : COL.ink); c(7, 3 - browR, 3, 1, ch.hair === "bald" || ch.hc === HAIR.white ? shade(ch.hc, -0.4) : COL.ink); }
      // nose
      c(5, 7, 2, 2, skinD);
      // mouth
      if (mouthOpen) { c(4, 10, 4, 2, COL.ink); c(5, 11, 2, 1, COL.pink); }
      else if (state === "stare") { c(4, 10, 4, 1, COL.ink); c(3, 11, 1, 1, COL.ink); c(8, 11, 1, 1, COL.ink); }
      else if (stare) { c(5, 10, 2, 2, COL.ink); }
      else { c(4, 10, 4, 1, COL.ink); if (!P.speaker) c(8, 9, 1, 1, COL.ink); }
      // cheeks
      c(1, 8, 1, 1, "rgba(255,46,136,.35)"); c(10, 8, 1, 1, "rgba(255,46,136,.35)");

      ctx.restore();
    }

    // markers ("?", "!", sight line) drawn after the bubble and table so nothing hides them
    function drawMarkers(P, cx, baseY) {
      var state = P.state, st = P.st;
      var bob = reduceMotion ? 0 : Math.round(Math.sin(S.t * 1.7 + P.bob) * 1.2);
      var oy = Math.round(baseY - 23 * CELL + bob);
      if (state === "tell") {
        var tellP = clamp(st / P.tellDur, 0, 1);
        var qs = easeOutBack(clamp(st / 0.18, 0, 1));
        var qx = cx + 34, qy = oy - 10;
        ctx.save(); ctx.translate(qx, qy); ctx.scale(qs, qs); ctx.rotate(reduceMotion ? 0 : Math.sin(st * 30) * 0.12);
        rect(-12, -14, 24, 26, COL.ink); rect(-10, -12, 20, 22, COL.yellow);
        text("?", 0, 0, F_PIXEL, 14, COL.ink, "center", "middle");
        ctx.restore();
        // wind-up ring shrinking toward the look
        ctx.strokeStyle = COL.pink; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(cx, oy + 26, 34 + (1 - tellP) * 26, 0, Math.PI * 2); ctx.globalAlpha = 0.25 + tellP * 0.6; ctx.stroke(); ctx.globalAlpha = 1;
      } else if (state === "look" || state === "stare") {
        var es = easeOutBack(clamp(st / 0.15, 0, 1));
        ctx.save(); ctx.translate(cx + 34, oy - 10); ctx.scale(es, es);
        rect(-12, -14, 24, 26, COL.ink); rect(-10, -12, 20, 22, COL.pink);
        text("!", 0, 0, F_PIXEL, 14, COL.ink, "center", "middle");
        ctx.restore();
        // sight line toward the player
        if (state === "look") {
          ctx.save(); ctx.setLineDash([6, 6]); ctx.lineDashOffset = -S.t * 40; ctx.strokeStyle = "rgba(255,46,136,.7)"; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(cx, oy + 24); ctx.lineTo(W / 2, PANEL_Y + 20); ctx.stroke(); ctx.restore();
        }
      }
    }

    // ---------- speech bubble ----------
    function drawBubble() {
      var sp = null;
      for (var q = 0; q < S.people.length; q++) if (S.people[q].speaker) sp = S.people[q];
      if (!sp || S.lineGap > 0) return;
      var line = S.lines[S.lineIdx % S.lines.length];
      var shown = S.mode === "play" || S.mode === "caught" ? line.slice(0, Math.ceil(S.chars)) : line;
      if (!shown) return;
      var fs = W < 600 ? 14 : 15;
      setFont(F_MONO, fs);
      var maxW = W < 600 ? 250 : 300;
      var lines = wrap(line, maxW - 24);
      var shownLines = wrap(shown, maxW - 24);
      var bw = 0; for (var i = 0; i < lines.length; i++) bw = Math.max(bw, ctx.measureText(lines[i]).width);
      bw = Math.ceil(bw) + 26;
      var lh = fs + 5, bh = lines.length * lh + 18;
      var sx = personX(sp.i);
      var bx = clamp(sx - (sp.i === 0 ? 30 : sp.i === 2 ? bw - 30 : bw / 2), 8, W - bw - 8);
      var by = Math.max(36, 140 - bh);
      // shadow + box
      rect(bx + 4, by + 4, bw, bh, COL.ink);
      rect(bx, by, bw, bh, COL.ink);
      rect(bx + 3, by + 3, bw - 6, bh - 6, COL.white);
      // tail
      var tx = clamp(sx + (sp.i === 0 ? 10 : sp.i === 2 ? -10 : 0), bx + 12, bx + bw - 24);
      for (var r = 0; r < 4; r++) { rect(tx - 1 + r * 2, by + bh - 3 + r * 3, 12 - r * 3, 4, COL.ink); }
      for (var r2 = 0; r2 < 3; r2++) { rect(tx + 2 + r2 * 2, by + bh - 4 + r2 * 3, 7 - r2 * 3, 3, COL.white); }
      for (var j = 0; j < shownLines.length; j++) text(shownLines[j], bx + 13, by + 12 + j * lh + fs * 0.8, F_MONO, fs, COL.ink, "left", "alphabetic");
    }

    // ---------- player eye ----------
    var EYE_C = 5, EYE_W = 26, EYE_H = 12;
    function eyeHalfWidth(j) { var y = (j + 0.5 - EYE_H / 2) / (EYE_H / 2); return (EYE_W / 2) * Math.pow(Math.max(0, 1 - y * y), 0.62); }
    function drawPlayerEye(cx, cy, se, dir, lidExtra, cellSize) {
      var cs = cellSize || EYE_C;
      var ox = Math.round(cx - (EYE_W / 2) * cs), oy = Math.round(cy - (EYE_H / 2) * cs);
      var irisX = EYE_W / 2 + dir * se * 6.6, irisY = EYE_H / 2 + 0.3 + se * 0.8;
      var lidRows = Math.round(se * 4.6 + (lidExtra || 0) * EYE_H);
      // outline
      ctx.fillStyle = COL.ink;
      for (var j = -1; j <= EYE_H; j++) {
        var hw = eyeHalfWidth(clamp(j, 0, EYE_H - 1)) + 1.2;
        ctx.fillRect(ox + Math.round(EYE_W / 2 - hw) * cs, oy + j * cs, Math.round(hw * 2) * cs, cs);
      }
      for (var y = 0; y < EYE_H; y++) {
        var h = eyeHalfWidth(y);
        var x0 = Math.round(EYE_W / 2 - h), x1 = Math.round(EYE_W / 2 + h);
        for (var x = x0; x < x1; x++) {
          var col;
          if (y < lidRows) col = y === lidRows - 1 ? COL.pink : "#6E2348";
          else {
            var dx = x + 0.5 - irisX, dy = y + 0.5 - irisY, dd = dx * dx + dy * dy;
            if (dd < 4.2 * 4.2) {
              col = dd < 2.1 * 2.1 ? COL.ink : COL.pink;
              if (Math.abs(dx + 1.1) < 0.6 && Math.abs(dy + 1.4) < 0.6) col = COL.white;
            } else col = COL.paper;
          }
          ctx.fillStyle = col; ctx.fillRect(ox + x * cs, oy + y * cs, cs, cs);
        }
      }
      // brow: lowers and tilts with side-eye
      var browY = oy - cs * (3.2 - se * 1.2);
      for (var b = 0; b < 14; b++) {
        var bxp = EYE_W / 2 - 7 + b;
        var tilt = dir * (b - 7) * se * 0.22;
        rect(ox + bxp * cs, Math.round(browY + tilt * cs), cs, Math.round(cs * 1.4), COL.pink);
      }
    }

    // ---------- HUD + panel ----------
    function drawHUD() {
      rect(0, 0, W, 30, COL.ink);
      rect(0, 28, W, 2, COL.pink);
      var sc = String(Math.floor(S.score)); while (sc.length < 5) sc = "0" + sc;
      text("SCORE", 10, 19, F_MONO, 11, COL.grey, "left", "middle");
      text(sc, 54, 19, F_PIXEL, 12, COL.yellow, "left", "middle");
      var remain = Math.max(0, (SCENES_PER_GAME - S.sceneIdx) * SCENE_LEN - S.sceneT);
      if (S.mode === "card") remain = (SCENES_PER_GAME - S.sceneIdx) * SCENE_LEN;
      var secs = Math.ceil(remain);
      var tstr = Math.floor(secs / 60) + ":" + (secs % 60 < 10 ? "0" : "") + (secs % 60);
      text((S.setting ? S.setting.short : "") + "  " + tstr, W / 2 + (W < 600 ? 10 : 0), 19, F_MONO, W < 600 ? 10 : 12, COL.paper, "center", "middle");
      // strikes: little eyes
      for (var i = 0; i < 3; i++) {
        var x = W - 22 - i * 24, y = 15, used = i < S.strikes;
        rect(x - 9, y - 5, 18, 10, used ? COL.grey : COL.paper);
        rect(x - 7, y - 7, 14, 2, used ? COL.grey : COL.paper);
        rect(x - 7, y + 5, 14, 2, used ? COL.grey : COL.paper);
        if (!used) rect(x + 1, y - 3, 6, 6, COL.pink);
        else { rect(x - 9, y - 1, 18, 2, COL.ink); }
      }
      // scene progress
      var prog = S.mode === "card" ? 0 : clamp(S.sceneT / SCENE_LEN, 0, 1);
      rect(0, 30, W, 3, "rgba(20,20,20,.25)");
      rect(0, 30, W * prog, 3, COL.teal);
    }

    function drawPanel() {
      rect(0, PANEL_Y, W, H - PANEL_Y, COL.ink);
      rect(0, PANEL_Y, W, 3, COL.pink);
      if (halftone) { ctx.save(); ctx.globalAlpha = 0.25; ctx.fillStyle = "#2a2a2a"; ctx.restore(); }
      var dir = 1;
      for (var q = 0; q < S.people.length; q++) if (S.people[q].speaker) dir = S.people[q].i === 0 ? -1 : 1;
      var caughtLid = S.mode === "caught" ? 0 : 0;
      var shakeEye = S.mode === "caught" && !reduceMotion ? Math.sin(S.t * 60) * 2 : 0;
      drawPlayerEye(W / 2 + shakeEye, PANEL_Y + 62, S.se, dir, caughtLid);
      // left: hint + multiplier
      var narrow = W < 600;
      var lx = narrow ? 12 : 24;
      if (S.mode === "play" || S.mode === "caught") {
        if (S.requireRepress && S.mode === "play") text("LET GO, THEN", lx, PANEL_Y + 16, F_MONO, 10, COL.grey, "left", "middle");
        text(S.holding ? "SIDE-EYEING" : "HOLD TO", lx, PANEL_Y + 32, F_MONO, narrow ? 12 : 13, S.holding ? COL.pink : COL.paper, "left", "middle");
        text(S.holding ? "LOOKS FINE" : "SIDE-EYE", lx, PANEL_Y + 50, F_MONO, narrow ? 12 : 13, S.holding ? COL.grey : COL.paper, "left", "middle");
        if (!narrow) text("[SPACE] / CLICK / TOUCH", lx, PANEL_Y + 68, F_MONO, 9, COL.grey, "left", "middle");
      }
      // right: meter
      var mx = narrow ? W - 112 : W - 170, my = PANEL_Y + 26, mw = narrow ? 100 : 146, mh = 16;
      text("SIDE-EYE METER", mx, my - 6, F_MONO, 9, COL.grey, "left", "alphabetic");
      rect(mx, my, mw, mh, COL.paper);
      rect(mx + 2, my + 2, mw - 4, mh - 4, "#2A2A2A");
      var fill = clamp(S.holdTime / 3, 0, 1);
      var fc = S.mult === 3 ? COL.pink : S.mult === 2 ? COL.yellow : COL.teal;
      rect(mx + 2, my + 2, (mw - 4) * fill, mh - 4, fc);
      rect(mx + (mw - 4) * (1.4 / 3) + 2, my, 2, mh, COL.ink);
      text("x" + S.mult, mx, my + 40, F_PIXEL, narrow ? 14 : 18, fc, "left", "middle");
      if (S.mult === 3 && S.holding && !reduceMotion) {
        var pulse = 0.5 + 0.5 * Math.sin(S.t * 14);
        text("MAX SHADE", mx + (narrow ? 38 : 50), my + 40, F_MONO, narrow ? 9 : 11, "rgba(255,46,136," + (0.5 + pulse * 0.5) + ")", "left", "middle");
      }
    }

    function drawPops() {
      for (var i = 0; i < S.pops.length; i++) {
        var p = S.pops[i], a = p.t / p.life;
        var sc = reduceMotion ? 1 : easeOutBack(clamp(p.t / 0.2, 0, 1));
        ctx.save();
        ctx.globalAlpha = 1 - Math.max(0, a - 0.6) / 0.4;
        ctx.translate(p.x, p.y - (reduceMotion ? 0 : a * 22));
        ctx.scale(sc, sc);
        setFont(F_MONO, p.size);
        var tw = ctx.measureText(p.txt).width + 14;
        rect(-tw / 2 + 3, -p.size * 0.75 + 3, tw, p.size * 1.5, COL.ink);
        rect(-tw / 2, -p.size * 0.75, tw, p.size * 1.5, p.color);
        text(p.txt, 0, 1, F_MONO, p.size, COL.ink, "center", "middle");
        ctx.restore();
      }
    }

    function sticker(str, x, y, rot, bg, fg, font, size, pad) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
      setFont(font, size);
      var tw = ctx.measureText(str).width + (pad || 16) * 2, th = size * 1.7;
      rect(-tw / 2 + 5, -th / 2 + 5, tw, th, COL.ink);
      rect(-tw / 2, -th / 2, tw, th, COL.ink);
      rect(-tw / 2 + 3, -th / 2 + 3, tw - 6, th - 6, bg);
      text(str, 0, 1, font, size, fg, "center", "middle");
      ctx.restore();
    }

    function drawScene() {
      var set = S.setting || SETTINGS[settingRotation % SETTINGS.length];
      drawWall(set);
      for (var i = 0; i < S.people.length; i++) drawBust(S.people[i], personX(i), TABLE_Y + 12);
      drawTable(set);
      drawBubble();
      for (var m = 0; m < S.people.length; m++) drawMarkers(S.people[m], personX(m), TABLE_Y + 12);
    }

    // ---------- screens ----------
    function drawTitle() {
      rect(0, 0, W, H, COL.paper);
      if (halftone) { ctx.save(); ctx.globalAlpha = 0.07; ctx.fillStyle = halftone; ctx.fillRect(0, 0, W, H); ctx.restore(); }
      rect(0, 0, W, 30, COL.ink);
      var narrow = W < 600;
      text("SIDE EYE ARCADE · CABINET No. 2", 12, 19, F_MONO, 10, COL.paper, "left", "middle");
      if (!narrow) text("FORM 27-B: NONVERBAL DISAPPROVAL", W - 12, 19, F_MONO, 10, COL.grey, "right", "middle");
      // big eye
      var ex = W / 2, ey = narrow ? 104 : 108;
      rect(ex - 110, ey - 56, 220, 112, COL.ink);
      var dir = Math.sin(S.t * 0.8) > 0 ? 1 : -1;
      drawPlayerEye(ex, ey + 6, S.se, dir, S.blink > 0 ? 1 : 0, 6.5);
      // title
      ctx.save(); ctx.translate(W / 2, narrow ? 198 : 202); ctx.rotate(-0.03);
      var ts = narrow ? 34 : 46;
      text("DON'T GET", 4, 4, F_DISPLAY, ts, COL.ink, "center", "alphabetic");
      text("DON'T GET", 0, 0, F_DISPLAY, ts, COL.ink, "center", "alphabetic");
      text("CAUGHT", 5, ts + 5, F_DISPLAY, ts * 1.18, COL.ink, "center", "alphabetic");
      text("CAUGHT", 0, ts, F_DISPLAY, ts * 1.18, COL.pink, "center", "alphabetic");
      ctx.restore();
      // instructions
      var iy = narrow ? 290 : 300;
      if (narrow) {
        text("HOLD to give the side eye.", W / 2, iy - 8, F_MONO, 14, COL.ink, "center", "middle");
        text("LET GO before they look.", W / 2, iy + 10, F_MONO, 14, COL.ink, "center", "middle");
        text("A “?” means someone's turning around.", W / 2, iy + 28, F_MONO, 11, COL.grey, "center", "middle");
        iy += 10;
      } else {
        text("HOLD to give the side eye. LET GO before they look.", W / 2, iy, F_MONO, 13, COL.ink, "center", "middle");
        text("A “?” means someone's turning around.", W / 2, iy + 18, F_MONO, 11, COL.grey, "center", "middle");
      }
      // start blink
      if (Math.floor(S.t * 2) % 2 === 0 || reduceMotion) sticker("PRESS START / TAP TO PLAY", W / 2, iy + 50, 0.02, COL.yellow, COL.ink, F_PIXEL, narrow ? 9 : 11, 12);
      text("BEST: " + best, 12, 50, F_MONO, narrow ? 12 : 11, COL.ink, "left", "alphabetic");
      text(narrow ? "*Several guests were judged." : "*No guests were harmed. Several were judged.", W - 12, H - 12, F_MONO, narrow ? 10 : 9, COL.grey, "right", "alphabetic");
    }

    function drawCard() {
      var p = clamp(S.cardT / CARD_LEN, 0, 1);
      var slide = reduceMotion ? 1 : easeOutBack(clamp(S.cardT / 0.35, 0, 1));
      var out = S.cardT > CARD_LEN - 0.25 ? (S.cardT - (CARD_LEN - 0.25)) / 0.25 : 0;
      ctx.save();
      ctx.globalAlpha = 1 - out;
      rect(0, 34, W, PANEL_Y - 34, "rgba(20,20,20,.78)");
      var narrow = W < 600;
      ctx.translate((1 - slide) * -W, 0);
      sticker("SCENE " + (S.sceneIdx + 1) + " OF " + SCENES_PER_GAME, W / 2, 86, -0.04, COL.pink, COL.ink, F_PIXEL, narrow ? 10 : 12, 12);
      text(S.setting.name, W / 2 + 3, 146, F_DISPLAY, narrow ? 26 : 34, COL.ink, "center", "middle");
      text(S.setting.name, W / 2, 143, F_DISPLAY, narrow ? 26 : 34, COL.paper, "center", "middle");
      text(S.setting.sub, W / 2, 180, F_MONO, narrow ? 9 : 11, COL.yellow, "center", "middle");
      var nw = S.people.filter(function (x) { return x.watcher; }).length;
      if (S.cameo) text(S.cameo.card, W / 2, 204, F_MONO, narrow ? 9 : 11, COL.pink, "center", "middle");
      else text("SUSPICIOUS GUESTS: " + nw, W / 2, 204, F_MONO, narrow ? 10 : 11, COL.paper, "center", "middle");
      if (S.cardBonus) text("LAST SCENE: NEVER CAUGHT  +" + S.cardBonus, W / 2, 228, F_MONO, narrow ? 10 : 12, COL.teal, "center", "middle");
      else if (S.sceneIdx === 0) text("GET READY…", W / 2, 228, F_MONO, 12, COL.teal, "center", "middle");
      if (S.setting.foot) text(S.setting.foot, W / 2, 247, F_MONO, narrow ? 9 : 10, "#B9B2A8", "center", "middle");
      ctx.restore();
      void p;
    }

    function drawCaughtOverlay() {
      var t = S.caughtT;
      if (S.flash > 0) { rect(0, 0, W, H, "rgba(255,46,136," + (S.flash * 0.45) + ")"); }
      var narrow = W < 600;
      var s = reduceMotion ? 1 : lerp(1.8, 1, easeOutBack(clamp(t / 0.22, 0, 1)));
      ctx.save(); ctx.translate(W / 2, 150); ctx.rotate(-0.09); ctx.scale(s, s);
      var fs = narrow ? 44 : 60;
      setFont(F_DISPLAY, fs);
      var tw = ctx.measureText("CAUGHT!").width + 36;
      rect(-tw / 2 + 6, -fs * 0.72 + 6, tw, fs * 1.3, COL.ink);
      rect(-tw / 2, -fs * 0.72, tw, fs * 1.3, COL.ink);
      rect(-tw / 2 + 4, -fs * 0.72 + 4, tw - 8, fs * 1.3 - 8, COL.pink);
      text("CAUGHT!", 0, fs * 0.36, F_DISPLAY, fs, COL.ink, "center", "alphabetic");
      ctx.restore();
      if (t > 0.18) {
        setFont(F_MONO, narrow ? 12 : 14);
        var lines = wrap(S.caughtCap, W - 80);
        for (var i = 0; i < lines.length; i++) sticker(lines[i], W / 2, 212 + i * 30, 0.02, COL.yellow, COL.ink, F_MONO, narrow ? 12 : 14, 10);
        var sy2 = 212 + lines.length * 30 + 6;
        sticker("STRIKE " + S.strikes + " OF 3" + (S.caughtName ? "  ·  SPOTTED BY: " + S.caughtName : ""), W / 2, sy2 + 4, -0.02, COL.ink, COL.paper, F_MONO, narrow ? 10 : 11, 8);
      }
    }

    var F_SERIF = "'Fraunces', Georgia, serif";
    function topCatcher() {
      var bestN = 0, who = "";
      for (var nm in S.catchers) if (S.catchers[nm] > bestN) { bestN = S.catchers[nm]; who = nm; }
      return who;
    }
    function drawResults() {
      rect(0, 0, W, H, COL.paper);
      if (halftone) { ctx.save(); ctx.globalAlpha = 0.07; ctx.fillStyle = halftone; ctx.fillRect(0, 0, W, H); ctx.restore(); }
      var narrow = W < 600;
      rect(0, 0, W, 30, COL.ink);
      text("OFFICIAL FINDINGS", 12, 19, F_MONO, 11, COL.yellow, "left", "middle");
      text(S.ejected ? "STATUS: ASKED TO LEAVE THE TABLE" : "STATUS: SURVIVED ALL FOUR EVENTS", W - 12, 19, F_MONO, narrow ? 8 : 10, COL.paper, "right", "middle");
      var t = S.resultsT;
      var shown = Math.floor(S.score * clamp(t / 0.9, 0, 1));
      text("FINAL SCORE", W / 2, 46, F_MONO, 11, COL.grey, "center", "middle");
      text(String(shown), W / 2 + 4, 82, F_PIXEL, narrow ? 26 : 30, COL.ink, "center", "middle");
      text(String(shown), W / 2, 78, F_PIXEL, narrow ? 26 : 30, COL.pink, "center", "middle");
      if (t > 0.9) {
        var s = reduceMotion ? 1 : lerp(1.6, 1, easeOutBack(clamp((t - 0.9) / 0.25, 0, 1)));
        ctx.save(); ctx.translate(W / 2, 122); ctx.scale(s, s);
        sticker(S.rank.title, 0, 0, -0.035, COL.yellow, COL.ink, F_DISPLAY, narrow ? 17 : 22, 14);
        ctx.restore();
        // closing remark from one of tonight's guests, keyed to rank
        if (S.closer) {
          var qs = narrow ? 13 : 15;
          ctx.font = "italic 400 " + qs + "px " + F_SERIF;
          var ql = wrap("“" + S.closer.line + "”", W - 70);
          ctx.fillStyle = COL.ink; ctx.textAlign = "center"; ctx.textBaseline = "middle";
          for (var i = 0; i < ql.length; i++) ctx.fillText(ql[i], W / 2, 155 + i * (qs + 3));
          text("— " + S.closer.who, W / 2, 155 + ql.length * (qs + 3) + 2, F_MONO, narrow ? 9 : 10, COL.pinkDark, "center", "middle");
        }
      }
      // mock incident report
      var bx = narrow ? 12 : 26, bw = W - bx * 2, by = 206, bh = 94;
      rect(bx + 4, by + 4, bw, bh, COL.ink);
      rect(bx, by, bw, bh, COL.ink);
      rect(bx + 2, by + 2, bw - 4, bh - 4, "#FBF7EF");
      var fs = narrow ? 9 : 10;
      var repNo = String(1000 + ((S.score * 7 + 417) % 9000)) + "-B";
      text("INCIDENT REPORT No. " + repNo, bx + 10, by + 13, F_MONO, fs, COL.ink, "left", "middle");
      var filer = topCatcher();
      text("FILED BY: " + (filer || "NOBODY. CLEAN."), bx + bw - 10, by + 13, F_MONO, fs, COL.pinkDark, "right", "middle");
      rect(bx + 8, by + 22, bw - 16, 2, COL.ink);
      var survived = S.ejected ? S.sceneIdx : SCENES_PER_GAME;
      var brow = Math.min(9.9, 1.1 + Math.min(S.totalHeld, 60) * 0.09 + S.perfects * 0.15);
      var dolly = Math.min(10, S.score / 250);
      var stats = [
        ["SIDE-EYE HELD", S.totalHeld.toFixed(1) + " s"],
        ["EYEBROW ALTITUDE", brow.toFixed(1) + " cm"],
        ["CLEAN GETAWAYS", String(S.perfects)],
        ["DOLLY SCALE", dolly.toFixed(1) + " / 10"],
        ["TIMES CAUGHT", String(S.caughtCount)],
        ["GROUP CHATS ENTERED", String(S.caughtCount * 3)],
        ["EVENTS SURVIVED", survived + " OF " + SCENES_PER_GAME],
        ["CASSEROLE IDENTIFIED", "NO"]
      ];
      var cw = (bw - 20) / 2, gap = narrow ? 10 : 18;
      for (var j = 0; j < stats.length; j++) {
        var col = j % 2, row = (j / 2) | 0;
        var x0 = bx + 10 + col * cw + (col ? gap / 2 : 0), x1 = bx + 10 + (col + 1) * cw - (col ? 0 : gap / 2);
        var yy = by + 36 + row * 15;
        text(stats[j][0], x0, yy, F_MONO, fs, COL.grey, "left", "middle");
        text(stats[j][1], x1, yy, F_MONO, fs, COL.ink, "right", "middle");
      }
      text("*Filed in triplicate. Copy 3 was lost in the casserole.", W / 2, by + bh + 13, F_MONO, narrow ? 8 : 9, COL.grey, "center", "middle");
      text("BEST: " + best, W - 12, H - 12, F_MONO, 10, COL.ink, "right", "alphabetic");
      if (S.newBest && t > 1.1) sticker("NEW PERSONAL BEST", narrow ? W - 86 : W - 120, 64, 0.12, COL.teal, COL.ink, F_MONO, narrow ? 9 : 11, 8);
      if (t > 0.9) {
        var on = reduceMotion || Math.floor(t * 2) % 2 === 0;
        sticker("PLAY AGAIN", W / 2, 334, 0, on ? COL.pink : COL.paper, COL.ink, F_PIXEL, narrow ? 11 : 13, 18);
        text("SPACE / TAP", W / 2, 364, F_MONO, 9, COL.grey, "center", "middle");
      }
    }

    function drawPaused() {
      rect(0, 0, W, H, "rgba(20,20,20,.72)");
      sticker("PAUSED", W / 2, H / 2 - 16, -0.03, COL.yellow, COL.ink, F_PIXEL, 16, 18);
      text("Press space or tap to resume. Everyone is still talking.", W / 2, H / 2 + 30, F_MONO, W < 600 ? 10 : 12, COL.paper, "center", "middle");
    }

    function draw() {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = COL.ink; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(k * dpr, 0, 0, k * dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
      if (S.mode === "title") { drawTitle(); }
      else if (S.mode === "results") { drawResults(); }
      else {
        ctx.save();
        if (S.shake > 0) ctx.translate(Math.round((Math.random() - 0.5) * 16 * S.shake), Math.round((Math.random() - 0.5) * 12 * S.shake));
        drawScene();
        drawPanel();
        drawHUD();
        drawPops();
        if (S.mode === "card") drawCard();
        ctx.restore();
        if (S.mode === "caught") drawCaughtOverlay();
      }
      if (S.paused) drawPaused();
    }

    // ---------- loop + visibility ----------
    var raf = 0, last = 0, inView = true, docVisible = !document.hidden, destroyed = false;
    function frame(ts) {
      raf = 0;
      if (destroyed) return;
      var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016;
      last = ts;
      if (!S.paused) update(dt);
      draw();
      schedule();
    }
    function schedule() { if (!raf && !destroyed && inView && docVisible) raf = requestAnimationFrame(frame); }
    function haltLoop() { if (raf) cancelAnimationFrame(raf); raf = 0; last = 0; }
    function autoPause() {
      if (S.mode === "play" || S.mode === "caught" || S.mode === "card") { S.paused = true; }
      S.inputDown = false;
      haltLoop(); draw();
    }
    function onVis() {
      docVisible = !document.hidden;
      if (!docVisible) autoPause(); else schedule();
    }
    document.addEventListener("visibilitychange", onVis);
    var io = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(function (entries) {
        var e = entries[entries.length - 1];
        inView = e.isIntersecting;
        if (!inView) autoPause(); else schedule();
      }, { threshold: 0.15 });
      io.observe(container);
    }
    var ro = null;
    if ("ResizeObserver" in window) { ro = new ResizeObserver(function () { resize(); }); ro.observe(container); }
    else window.addEventListener("resize", resize);
    function onMQ(e) { reduceMotion = e.matches; }
    if (mq) { if (mq.addEventListener) mq.addEventListener("change", onMQ); else if (mq.addListener) mq.addListener(onMQ); }

    resize();
    schedule();

    return {
      destroy: function () {
        destroyed = true;
        haltLoop();
        document.removeEventListener("visibilitychange", onVis);
        if (io) io.disconnect();
        if (ro) ro.disconnect(); else window.removeEventListener("resize", resize);
        if (mq) { if (mq.removeEventListener) mq.removeEventListener("change", onMQ); else if (mq.removeListener) mq.removeListener(onMQ); }
        container.removeEventListener("keydown", onKeyDown);
        container.removeEventListener("keyup", onKeyUp);
        container.removeEventListener("blur", onBlur);
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointerup", onPointerUp);
        canvas.removeEventListener("pointercancel", onPointerUp);
        canvas.removeEventListener("lostpointercapture", onPointerUp);
        canvas.removeEventListener("contextmenu", onContext);
        muteBtn.removeEventListener("click", onMute);
        muteBtn.removeEventListener("pointerdown", stopProp);
        if (actx) { try { actx.close(); } catch (e) { /* ignore */ } actx = null; }
        container.innerHTML = "";
        container.classList.remove("hc-caught");
        container.removeAttribute("role");
        container.removeAttribute("aria-label");
      },
      // test hook (harmless): read-only snapshot of game state
      _debug: function () { return { mode: S.mode, score: Math.floor(S.score), strikes: S.strikes, sceneIdx: S.sceneIdx, people: S.people.map(function (p) { return p.state; }), tell: S.people.map(function (p) { return p.state === "tell" ? p.st / p.tellDur : 0; }), holding: S.holding, perfects: S.perfects, lineIdx: S.lineIdx, nLines: S.lines.length, sceneT: S.sceneT, setting: S.setting ? S.setting.key : "", cameoIdx: S.cameoIdx, cap: S.caughtCap, by: S.caughtName }; }
    };
  }

  window.HC_GAMES = window.HC_GAMES || {};
  window.HC_GAMES[ID] = {
    title: "DON'T GET CAUGHT",
    tagline: "Hold the side eye. Let go before they look.",
    mount: mount
  };
})();
