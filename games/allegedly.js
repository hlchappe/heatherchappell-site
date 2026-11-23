/* ALLEGEDLY — a SIDE EYE reflex sorter for heatherchappell.com
   Side-eye the myths. Nod at the facts.
   Self-contained IIFE. Registers window.HC_GAMES["allegedly"]. */
(function () {
  "use strict";

  var ID = "allegedly";
  var BEST_KEY = "hc_" + ID + "_best";
  var ROUND = 15;

  /* ---------- CONTENT ----------
     t = the claim, real = true fact (NOD) or myth (SIDE-EYE), n = the follow-up line.
     Every item is mainstream, well-documented history. Corrections web-checked Nov 2026. */
  var CARDS = [
    // Myths
    { real: false, t: "Napoleon Bonaparte was unusually short.",
      n: "He was roughly 5'6\" to 5'7\", about average for his era. British cartoonists drew him tiny on purpose. It was the meanest thing a pencil could do." },
    { real: false, t: "Vikings wore horned helmets into battle.",
      n: "No horned Viking helmet has ever been found. A costume designer added the horns for Wagner's operas in 1876. Horns are terrible in a shield wall and worse in a doorway." },
    { real: false, t: "People in the Middle Ages believed the Earth was flat.",
      n: "Medieval universities taught from a 13th-century textbook titled On the Sphere. The flat-Earth story is mostly a 19th-century invention." },
    { real: false, t: "Albert Einstein failed math in school.",
      n: "He'd mastered calculus before 15. Shown the rumor in a 1935 newspaper column, he laughed and said he never failed in math. The rumor did not take the hint." },
    { real: false, t: "Marie Antoinette said, “Let them eat cake.”",
      n: "No record she ever said it. Rousseau wrote the line about an unnamed princess in 1765, when Marie Antoinette was nine. Also, it was brioche." },
    { real: false, t: "George Washington wore wooden false teeth.",
      n: "Hippo ivory, lead, and human and animal teeth. Wood was about the only material that never made it into his mouth." },
    { real: false, t: "The accused witches of Salem were burned at the stake.",
      n: "Nineteen were hanged, and Giles Corey was pressed to death under stones. Salem burned no one, which is less comforting than it sounds." },
    { real: false, t: "You can see the Great Wall of China from the Moon with the naked eye.",
      n: "You can't. It's long, but narrow, and roughly the color of everything around it. Astronauts have been asked this so often they have a face for it." },
    { real: false, t: "Columbus sailed west to prove the Earth was round.",
      n: "Educated Europeans already knew. The fight was about size, and Columbus lowballed the planet by thousands of miles. Luckily, a continent got in the way." },
    { real: false, t: "Thomas Edison invented the first electric light bulb.",
      n: "Inventors had glowing bulbs for decades. Edison's lab made one that lasted long enough to sell. He was, above all, an excellent closer." },
    { real: false, t: "Emperor Nero played the fiddle while Rome burned.",
      n: "The violin was about 1,450 years from existing. Tacitus puts Nero 35 miles away at Antium, then rushing back to open his gardens to refugees. Rude to make him look good." },
    { real: false, t: "The iron maiden was a common medieval torture device.",
      n: "No reliable medieval evidence exists. The famous ones were assembled in the 1800s for display. History's scariest gadget is mostly a 19th-century craft project." },
    { real: false, t: "Paul Revere rode through the night shouting, “The British are coming!”",
      n: "The mission depended on stealth, and the locals still considered themselves British. The warning was closer to “The Regulars are coming out.” Accurate. Not catchy." },
    { real: false, t: "Walt Disney's body was cryogenically frozen.",
      n: "He was cremated December 17, 1966. The first person ever cryonically preserved went in on January 12, 1967. Walt missed the cutoff by four weeks." },
    { real: false, t: "Betsy Ross designed the first American flag.",
      n: "Nothing from the period backs it. The story debuted in 1870, courtesy of her grandson, a source with famously no stake in the matter." },
    { real: false, t: "The Declaration of Independence was signed on July 4, 1776.",
      n: "Congress adopted it July 4. Most delegates signed on August 2, and a few even later. The founders were, like all of us, behind on paperwork." },
    { real: false, t: "Cinco de Mayo is Mexico's Independence Day.",
      n: "It marks an 1862 win over the French at the Battle of Puebla. Mexican Independence Day is September 16. Same country. Different party." },
    { real: false, t: "Abner Doubleday invented baseball in Cooperstown.",
      n: "A 1907 commission said so, leaning on one man's boyhood memories. Doubleday's papers never mention baseball. He was busy aiming the first Union return shot at Fort Sumter." },
    { real: false, t: "Ben Franklin formally proposed the turkey as America's national bird.",
      n: "He only griped in a 1784 letter to his daughter that the eagle was “a bird of bad moral character.” Nothing was proposed. He was just being Ben Franklin in a letter." },
    { real: false, t: "Sherlock Holmes says “Elementary, my dear Watson” in Conan Doyle's stories.",
      n: "Holmes says “Elementary” and “my dear Watson” in the books, never together. Later adaptations stitched the line together like a ransom note." },

    // True
    { real: true, t: "Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramid.",
      n: "The pyramid was already about 2,500 years old in her day. Apollo 11 came about 2,000 years after her. She'd have needed a tour guide too." },
    { real: true, t: "Oxford University is older than the Aztec capital, Tenochtitlan.",
      n: "Teaching at Oxford was underway by 1096. Tenochtitlan was founded around 1325, by which point Oxford had been grading papers for over two centuries." },
    { real: true, t: "In 1932, Australian soldiers with machine guns fought a “war” against emus. The emus largely won.",
      n: "Two machine guns, 10,000 rounds, a withdrawal within a week. The commanding major said the birds faced gunfire “with the invulnerability of tanks.”" },
    { real: true, t: "In the 1830s, Americans bought tomato pills as a cure-all.",
      n: "In 1835 a physician lectured that tomatoes treated indigestion. By 1837, “Compound Extract of Tomato” pills were on sale. Side effects: none, it was a tomato." },
    { real: true, t: "Sharks are older than trees.",
      n: "Sharks: about 450 million years ago. The first trees: about 385 million. Sharks have been unimpressed by forests ever since." },
    { real: true, t: "Woolly mammoths were still alive when the Great Pyramid was built.",
      n: "A small herd held out on Wrangel Island, off Siberia, until about 4,000 years ago. The pyramid is about 4,500. Nobody told the Egyptians." },
    { real: true, t: "Nintendo was founded in 1889.",
      n: "It started in Kyoto making hanafuda playing cards. In the 1960s it tried a taxi company and instant rice. Pivot, pivot, plumber." },
    { real: true, t: "The shortest war on record lasted less than an hour.",
      n: "The Anglo-Zanzibar War of 1896 took roughly 38 to 45 minutes. Shorter than most status meetings, with a clearer outcome." },
    { real: true, t: "Ancient Rome taxed urine.",
      n: "Launderers used it for the ammonia. When his son complained, Emperor Vespasian held a coin to his nose and asked if it smelled. Hence “money doesn't stink.”" },
    { real: true, t: "The fax machine was patented before the telephone.",
      n: "Alexander Bain patented an image-sending telegraph in 1843. Bell's telephone patent came in 1876. The fax still somehow lost." },
    { real: true, t: "Harvard University is older than calculus.",
      n: "Harvard: 1636. Newton and Leibniz worked out calculus decades later. The first Harvard students were spared an entire semester of suffering." },
    { real: true, t: "Abraham Lincoln is in the National Wrestling Hall of Fame.",
      n: "Inducted in 1992 as an Outstanding American. The Hall credits him with one recorded defeat in a dozen years. The Gettysburg Address was also decent." },
    { real: true, t: "Abraham Lincoln and Charles Darwin were born on the same day.",
      n: "February 12, 1809. A big day for future beards." },
    { real: true, t: "The Eiffel Tower was supposed to be temporary.",
      n: "It opened with a 20-year permit. It survived by becoming a giant radio antenna, the most engineer way possible to avoid getting let go." },
    { real: true, t: "Betty White was born before sliced bread went on sale.",
      n: "Betty White: January 1922. Commercially sliced bread: 1928. She was, technically, the greatest thing before it." },
    { real: true, t: "Mark Twain was born and died in years when Halley's Comet appeared.",
      n: "1835 and 1910. He predicted he would “go out with it,” then died the day after the comet's closest pass by the Sun. Show-off." },
    { real: true, t: "John Adams and Thomas Jefferson died on the same day.",
      n: "July 4, 1826, the Declaration's 50th anniversary, hours apart. Adams reportedly said, “Thomas Jefferson survives.” He had not, by about five hours." },
    { real: true, t: "Bubble wrap was first invented as wallpaper.",
      n: "In 1957, two engineers heat-sealed a pair of shower curtains and called it textured wallpaper. Then greenhouse insulation. Then everyone just popped it." },
    { real: true, t: "Play-Doh was first sold as a wallpaper cleaner.",
      n: "It lifted coal soot off wallpaper. When coal heat faded, it was remarketed to kids in the 1950s. Still not a snack, in either career." },
    { real: true, t: "Queen Elizabeth II trained as a mechanic during World War II.",
      n: "In 1945 she joined the Auxiliary Territorial Service as a second subaltern and learned to drive and repair military vehicles. Princess by birth. Mechanic by training." },
    { real: true, t: "The Hundred Years' War lasted 116 years.",
      n: "1337 to 1453, with breaks. Nobody went back and updated the branding." },
    { real: true, t: "Vikings reached North America roughly 500 years before Columbus.",
      n: "Tree rings show Norse settlers cutting wood at L'Anse aux Meadows, Newfoundland, in 1021. Columbus arrived in 1492 and got the credit anyway." }
  ];

  var DOCENT = "DR. BRAMBLE";

  var SOURCES = [
    "A GUY AT A PARTY INSISTS:",
    "A GUY AT A PARTY, NOW HOLDING YOUR ARM:",
    "PER THE GIFT-SHOP TOTE BAG ($34):",
    "A DINER PLACEMAT, SYRUP-STAINED:",
    "ENGRAVED IN BRASS, SO IT MUST BE TRUE:",
    "A BRASS PLAQUE, PARTLY COVERED IN GUM:",
    "MY UNCLE, A HISTORIAN, ONCE SAID:",
    "MY UNCLE (HISTORIAN) VIA MY AUNT (NOT):",
    "A 1974 FILMSTRIP, AT THE BEEP:",
    "YOUR UNCLE, MID-TURKEY, AT THANKSGIVING:",
    "AUDIO TOUR, TRACK 14 (1–13 ARE MISSING):",
    "A TRIVIA NAPKIN, 11:52 P.M.:",
    "A SUBSTITUTE TEACHER, FRIDAY, 7TH PERIOD:",
    "A REPLY-ALL TO 41 PEOPLE:",
    "AN EMAIL TITLED “FW: FW: FW: WOW!!”:",
    "A FRIDGE MAGNET AT A LAKE HOUSE:",
    "A MAN ON A TRAIN, UNPROMPTED:",
    "THE BACK OF A CEREAL BOX:",
    "A NARRATOR WITH A VERY DEEP VOICE:",
    "THE MUSEUM WEBSITE (UPDATED 2003):",
    "A TOUR BUS DRIVER, AT A RED LIGHT:",
    "A MAN IN A TRICORN HAT AT THE STATE FAIR:",
    "AN ENCYCLOPEDIA, VOLUME M ONLY:",
    "A CHAIN LETTER, FOURTH GENERATION:",
    "THE UNDERSIDE OF A BOTTLE CAP:",
    "A SCREENSAVER, CIRCA 2001:",
    "DR. BRAMBLE, LOWERING HIS VOICE:"
  ];

  /* Dr. Bramble's reactions. He gets more defensive every time you catch him. */
  var LINES = {
    caught: [
      ["A test. You passed my test. Which I set.", "Quite right. I was checking if you were awake.", "Hm. A labeling error. Not mine. Next."],
      ["That placard predates me. Spiritually.", "The intern printed that. We don't have an intern.", "Fine. That one came from the gift shop."],
      ["Who let you in. Was it Gary? It's always Gary.", "I have a degree. It's honorary, but it's framed.", "Everyone's a scholar until the museum closes."],
      ["My monocle is fogging. Unrelated.", "I'll be taking a personal day after this exhibit.", "I now doubt my own placards. Thank you so much."]
    ],
    uncle: { 2: "My uncle, a historian, will be hearing about this.",
             4: "My uncle IS a historian. He has a cardigan with elbow patches.",
             6: "My uncle was a historian in the sense that he was old." },
    fooled: [
      ["Splendid. You'll make a wonderful donor.", "Correct! I mean: yes. Obviously. Next.", "Exactly what the plaque says. Brass doesn't lie."],
      ["The gift shop is to your left. You'll love it.", "My uncle, a historian, would adore you.", "I'm putting you on the mailing list. Twice.", "Tell your friends. Tell them Bramble sent you."]
    ],
    nod: ["Correct. Even I couldn't have made that one up.", "Real. I checked. Under protest.", "True. Frankly, that one surprised me too.", "Yes. History occasionally behaves."],
    over: ["Ha! That one was real. Doubt cuts both ways.", "You side-eyed the truth. I'm framing this moment.", "Skepticism: admirable. Aim: developing.", "Real! I've waited all day to say that."],
    slow: ["I'll put you down as “enchanted.”", "Silence. My favorite form of agreement.", "Take your time. We close at five. Today."]
  };

  var RANKS = [
    { min: 0, title: "GIFT SHOP'S BEST CUSTOMER", line: "You'd buy the horned Viking helmet. In two sizes.",
      doc: "At last, a visitor who respects a placard." },
    { min: 4, title: "BELIEVES THE PLACEMAT", line: "Syrup-stained, but sincere.",
      doc: "Come again. Bring friends. Bring cash." },
    { min: 7, title: "RAISED ONE EYEBROW", line: "A flicker of doubt. Water it daily.",
      doc: "Adequate. You may touch one (1) exhibit on the way out." },
    { min: 10, title: "UNCLE-PROOF", line: "Thanksgiving is about to get very quiet.",
      doc: "Please don't tell my uncle about today." },
    { min: 13, title: "CERTIFIED SIDE-EYE", line: "Docents now lower their voices when you enter the lobby.",
      doc: "You're banned from the audio tour. For my safety." },
    { min: 15, title: "HISTORY, ALLEGEDLY", line: "The museum asked you to stop correcting the placards. You corrected the request.",
      doc: "I'm resigning. Someone please tell my uncle." }
  ];

  /* ---------- STYLE (scoped under .alg-) ---------- */
  var CSS = [
    ".alg-root{--ink:#141414;--paper:#F3ECDF;--pink:#FF2E88;--pinkd:#D41A6E;--yel:#FFE14D;--teal:#19C2B0;--grey:#6B6B6B;",
    "position:relative;width:100%;height:100%;box-sizing:border-box;overflow:hidden;background:var(--ink);color:var(--paper);",
    "border:3px solid var(--ink);font-family:'Space Mono',ui-monospace,monospace;container-type:inline-size;user-select:none;-webkit-user-select:none;",
    "-webkit-tap-highlight-color:transparent;}",
    ".alg-root *{box-sizing:border-box;}",
    ".alg-root:before{content:'';position:absolute;inset:0;pointer-events:none;opacity:.18;",
    "background-image:radial-gradient(var(--pink) 1px,transparent 1.4px);background-size:9px 9px;}",
    ".alg-scan{position:absolute;inset:0;pointer-events:none;z-index:50;",
    "background:repeating-linear-gradient(to bottom,rgba(0,0,0,0) 0,rgba(0,0,0,0) 2px,rgba(0,0,0,.16) 3px,rgba(0,0,0,0) 4px);mix-blend-mode:multiply;}",
    ".alg-screen{position:absolute;inset:0;display:flex;flex-direction:column;padding:clamp(8px,2.2cqw,18px);gap:clamp(6px,1.4cqw,12px);}",
    ".alg-center{align-items:center;justify-content:center;text-align:center;}",
    ".alg-btn{font-family:'Space Mono',monospace;font-weight:700;letter-spacing:.06em;cursor:pointer;border:3px solid var(--ink);",
    "background:var(--yel);color:var(--ink);box-shadow:4px 4px 0 var(--pink);padding:.55em 1.1em;font-size:clamp(12px,2.2cqw,17px);",
    "text-transform:uppercase;transition:transform .08s,box-shadow .08s;touch-action:manipulation;}",
    ".alg-btn:active,.alg-btn.alg-press{transform:translate(3px,3px);box-shadow:1px 1px 0 var(--pink);}",
    ".alg-btn:focus-visible{outline:3px solid var(--teal);outline-offset:2px;}",
    ".alg-logo{width:clamp(90px,24cqw,180px);height:auto;display:block;}",
    ".alg-pupil{animation:alg-glance 3.2s infinite ease-in-out;}",
    "@keyframes alg-glance{0%,18%{transform:translateX(0)}28%,62%{transform:translateX(-13px)}72%,100%{transform:translateX(0)}}",
    ".alg-h1{font-family:'Archivo Black',Impact,sans-serif;font-size:clamp(34px,10cqw,84px);line-height:.9;margin:0;color:var(--paper);",
    "letter-spacing:-.01em;text-shadow:4px 4px 0 var(--pink);}",
    ".alg-kicker{font-size:clamp(10px,1.8cqw,13px);letter-spacing:.18em;color:var(--teal);margin:0;}",
    ".alg-sub{font-family:'Fraunces',Georgia,serif;font-style:italic;font-size:clamp(14px,2.6cqw,20px);margin:0;max-width:34em;color:var(--paper);}",
    ".alg-how{display:flex;gap:clamp(8px,2cqw,18px);flex-wrap:wrap;justify-content:center;font-size:clamp(10px,1.8cqw,13px);}",
    ".alg-chip{border:2px solid var(--paper);padding:.3em .7em;}",
    ".alg-chip b{color:var(--pink);}",
    ".alg-chip.alg-t b{color:var(--teal);}",
    ".alg-blink{animation:alg-blink 1.1s steps(2,start) infinite;}",
    "@keyframes alg-blink{to{visibility:hidden}}",
    ".alg-small{font-size:clamp(9px,1.6cqw,12px);color:#bdb5a8;margin:0;letter-spacing:.06em;}",
    ".alg-sticker{position:absolute;top:clamp(10px,3cqw,26px);right:clamp(10px,3cqw,26px);background:var(--pink);color:var(--ink);",
    "font-family:'Archivo Black',sans-serif;font-size:clamp(9px,1.7cqw,13px);padding:.35em .7em;transform:rotate(6deg);border:2px solid var(--ink);",
    "box-shadow:3px 3px 0 var(--paper);}",
    /* HUD */
    ".alg-hud{display:flex;align-items:center;gap:clamp(6px,1.6cqw,14px);font-size:clamp(10px,1.9cqw,14px);letter-spacing:.06em;flex:0 0 auto;}",
    ".alg-hud .alg-sp{flex:1;}",
    ".alg-hud b{color:var(--yel);font-family:'Press Start 2P','Space Mono',monospace;font-weight:400;font-size:.92em;}",
    ".alg-combo{color:var(--ink);background:var(--teal);padding:.1em .45em;font-weight:700;transition:transform .15s;}",
    ".alg-combo.alg-hot{background:var(--pink);}",
    ".alg-combo.alg-bump{transform:scale(1.25) rotate(-4deg);}",
    ".alg-mute{background:transparent;border:2px solid var(--grey);color:var(--paper);font-family:'Space Mono',monospace;",
    "font-size:clamp(9px,1.6cqw,12px);padding:.2em .5em;cursor:pointer;letter-spacing:.06em;}",
    ".alg-mute:focus-visible{outline:2px solid var(--teal);}",
    ".alg-mute.alg-on{border-color:var(--teal);color:var(--teal);}",
    /* narrator */
    ".alg-narr{display:flex;align-items:flex-end;gap:clamp(6px,1.5cqw,12px);flex:0 0 auto;}",
    ".alg-doc{width:clamp(34px,7cqw,56px);height:auto;aspect-ratio:14/16;image-rendering:pixelated;image-rendering:crisp-edges;display:block;}",
    ".alg-src{background:var(--paper);color:var(--ink);font-size:clamp(9px,1.7cqw,13px);font-weight:700;letter-spacing:.08em;",
    "padding:.35em .7em;border:2px solid var(--ink);position:relative;margin-bottom:.4em;max-width:100%;line-height:1.3;}",
    ".alg-src:before{content:'';position:absolute;left:-9px;bottom:6px;border:5px solid transparent;border-right:6px solid var(--paper);}",
    /* card */
    ".alg-deck{position:relative;flex:1 1 auto;min-height:0;display:flex;align-items:stretch;justify-content:center;}",
    ".alg-card{position:relative;width:100%;max-width:760px;background:var(--paper);color:var(--ink);border:3px solid var(--ink);",
    "box-shadow:6px 6px 0 var(--pink);display:flex;flex-direction:column;padding:clamp(8px,2cqw,16px) clamp(10px,2.6cqw,22px) 0;",
    "touch-action:pan-y;cursor:grab;will-change:transform;}",
    ".alg-card.alg-enter{animation:alg-in .28s cubic-bezier(.2,1.4,.4,1);}",
    "@keyframes alg-in{from{transform:translateX(60%) rotate(5deg);opacity:0}to{transform:none;opacity:1}}",
    ".alg-card.alg-fly{transition:transform .32s ease-in,opacity .32s ease-in;}",
    ".alg-card.alg-snap{transition:transform .18s ease-out;}",
    ".alg-cardtop{display:flex;justify-content:space-between;font-size:clamp(9px,1.6cqw,12px);letter-spacing:.14em;font-weight:700;",
    "border-bottom:2px solid var(--ink);padding-bottom:.4em;}",
    ".alg-fact{flex:1;display:flex;align-items:center;justify-content:center;text-align:center;font-family:'Fraunces',Georgia,serif;",
    "font-weight:600;font-size:clamp(19px,3.9cqw,30px);line-height:1.2;padding:.4em .2em;margin:0;}",
    ".alg-timer{height:clamp(8px,1.6cqw,12px);margin:0 calc(-1 * clamp(10px,2.6cqw,22px));border-top:3px solid var(--ink);background:var(--ink);}",
    ".alg-timer i{display:block;height:100%;width:100%;background:var(--teal);transform-origin:left center;}",
    ".alg-timer i.alg-low{background:var(--pink);}",
    ".alg-stamp{position:absolute;top:22%;font-family:'Archivo Black',sans-serif;font-size:clamp(16px,4.2cqw,34px);padding:.1em .4em;",
    "border:4px solid currentColor;opacity:0;pointer-events:none;letter-spacing:.02em;background:rgba(243,236,223,.85);}",
    ".alg-stamp.alg-l{left:6%;color:var(--pinkd);transform:rotate(-10deg);}",
    ".alg-stamp.alg-r{right:6%;color:#0f8a7d;transform:rotate(10deg);}",
    /* feedback */
    ".alg-fb{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;",
    "padding:clamp(10px,3cqw,26px);gap:clamp(4px,1.2cqw,10px);border:3px solid var(--ink);box-shadow:6px 6px 0 var(--paper);cursor:pointer;}",
    ".alg-fb.alg-good{background:var(--teal);color:var(--ink);}",
    ".alg-fb.alg-bad{background:var(--pink);color:var(--ink);}",
    ".alg-fb.alg-show{animation:alg-pop .22s ease-out;}",
    "@keyframes alg-pop{from{transform:scale(.92);opacity:0}to{transform:none;opacity:1}}",
    ".alg-verdict{font-family:'Archivo Black',sans-serif;font-size:clamp(22px,6cqw,48px);line-height:1;margin:0;}",
    ".alg-label{font-weight:700;letter-spacing:.16em;font-size:clamp(10px,1.9cqw,14px);background:var(--ink);color:var(--paper);padding:.25em .7em;}",
    ".alg-note{font-family:'Fraunces',Georgia,serif;font-size:clamp(14px,2.9cqw,22px);line-height:1.3;margin:0;max-width:30em;}",
    ".alg-pts{font-family:'Press Start 2P','Space Mono',monospace;font-size:clamp(10px,1.9cqw,14px);}",
    ".alg-next{position:absolute;left:0;bottom:0;height:5px;background:var(--ink);width:100%;transform-origin:left center;}",
    /* controls */
    ".alg-ctrls{display:flex;gap:clamp(8px,2cqw,18px);flex:0 0 auto;}",
    ".alg-ctrl{flex:1;display:flex;align-items:center;justify-content:center;gap:.6em;min-height:clamp(46px,8cqw,64px);",
    "font-family:'Archivo Black',sans-serif;font-size:clamp(13px,2.6cqw,20px);letter-spacing:.02em;border:3px solid var(--ink);",
    "cursor:pointer;touch-action:manipulation;color:var(--ink);transition:transform .08s,box-shadow .08s;padding:0 .6em;}",
    ".alg-ctrl small{font-family:'Space Mono',monospace;font-size:.62em;font-weight:700;opacity:.75;}",
    ".alg-ctrl svg{width:2.2em;height:auto;flex:0 0 auto;}",
    ".alg-ctrl.alg-se{background:var(--pink);box-shadow:4px 4px 0 var(--paper);}",
    ".alg-ctrl.alg-nod{background:var(--teal);box-shadow:4px 4px 0 var(--paper);}",
    ".alg-ctrl:active,.alg-ctrl.alg-press{transform:translate(3px,3px);box-shadow:1px 1px 0 var(--paper);}",
    ".alg-ctrl:focus-visible{outline:3px solid var(--yel);outline-offset:2px;}",
    ".alg-ctrl[disabled]{opacity:.55;cursor:default;}",
    /* results */
    ".alg-res{background:var(--paper);color:var(--ink);border:3px solid var(--ink);box-shadow:6px 6px 0 var(--pink);",
    "padding:clamp(12px,3cqw,26px);width:min(100%,560px);display:flex;flex-direction:column;align-items:center;gap:clamp(4px,1.2cqw,10px);position:relative;}",
    ".alg-res .alg-kicker{color:var(--grey);}",
    ".alg-rank{font-family:'Archivo Black',sans-serif;font-size:clamp(22px,5.6cqw,42px);line-height:1;margin:0;background:var(--yel);padding:.08em .25em;}",
    ".alg-res .alg-sub{color:var(--ink);}",
    ".alg-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(4px,1cqw,10px);width:100%;margin-top:.3em;}",
    ".alg-stat{border:2px solid var(--ink);padding:.35em .2em;font-size:clamp(8px,1.5cqw,11px);letter-spacing:.1em;}",
    ".alg-stat b{display:block;font-family:'Press Start 2P','Space Mono',monospace;font-weight:400;font-size:clamp(11px,2.2cqw,17px);margin-top:.3em;}",
    ".alg-res .alg-mute{color:var(--ink);border-color:var(--ink);}.alg-res .alg-mute.alg-on{color:#0f8a7d;border-color:#0f8a7d;}",
    ".alg-docline{font-family:'Fraunces',Georgia,serif;font-style:italic;font-size:clamp(13px,2.4cqw,18px);margin:0;max-width:30em;}",
    ".alg-memo{font-size:clamp(9px,1.6cqw,12px);letter-spacing:.04em;margin:0;max-width:40em;border-top:2px dashed var(--ink);padding-top:.4em;}",
    ".alg-foot{font-size:clamp(8px,1.4cqw,11px);color:var(--grey);margin:.2em 0 0;}",
    ".alg-newbest{position:absolute;top:-12px;right:-10px;background:var(--pink);color:var(--ink);font-family:'Archivo Black',sans-serif;",
    "font-size:clamp(9px,1.6cqw,12px);padding:.3em .6em;border:2px solid var(--ink);transform:rotate(8deg);}",
    /* pause */
    ".alg-pause{position:absolute;inset:0;z-index:40;background:rgba(20,20,20,.86);display:flex;flex-direction:column;align-items:center;",
    "justify-content:center;gap:12px;text-align:center;cursor:pointer;}",
    "@container (max-width:460px){.alg-ctrl small{display:none}.alg-stats{grid-template-columns:repeat(2,1fr)}}",
    "@media (prefers-reduced-motion:reduce){.alg-pupil,.alg-blink{animation:none}.alg-card.alg-enter,.alg-fb.alg-show{animation:none}",
    ".alg-card.alg-fly{transition:opacity .2s}.alg-combo{transition:none}}"
  ].join("\n");

  var styleRefs = 0;
  function addStyle() {
    styleRefs++;
    if (document.getElementById("alg-style")) return;
    var s = document.createElement("style");
    s.id = "alg-style";
    s.textContent = CSS;
    document.head.appendChild(s);
  }
  function removeStyle() {
    styleRefs = Math.max(0, styleRefs - 1);
    if (styleRefs === 0) {
      var s = document.getElementById("alg-style");
      if (s && s.parentNode) s.parentNode.removeChild(s);
    }
  }

  var uid = 0;
  function eyeSVG(cls, look, lid) {
    // Almond eye, heavy lid, pupil pushed to one side. look: -1 left, 0 center, 1 right
    var id = "alg-clip-" + (++uid);
    var px = 32 + look * 13;
    return '<svg class="' + (cls || "") + '" viewBox="0 0 64 34" aria-hidden="true">' +
      '<defs><clipPath id="' + id + '"><path d="M3 17 Q32 -9 61 17 Q32 43 3 17Z"/></clipPath></defs>' +
      '<path d="M3 17 Q32 -9 61 17 Q32 43 3 17Z" fill="#F3ECDF"/>' +
      '<g clip-path="url(#' + id + ')"><g class="' + (lid ? "alg-pupil" : "") + '">' +
      '<circle cx="' + px + '" cy="19" r="10" fill="#141414"/><circle cx="' + (px - 3) + '" cy="16" r="2.4" fill="#F3ECDF"/></g>' +
      (lid ? '<rect x="0" y="0" width="64" height="10" fill="#FF2E88"/><path d="M0 10 H64" stroke="#141414" stroke-width="3"/>' : "") +
      '</g><path d="M3 17 Q32 -9 61 17 Q32 43 3 17Z" fill="none" stroke="#141414" stroke-width="3.2" stroke-linejoin="round"/></svg>';
  }
  function nodSVG() {
    return '<svg viewBox="0 0 40 40" aria-hidden="true">' +
      '<circle cx="20" cy="22" r="12" fill="#F3ECDF" stroke="#141414" stroke-width="3"/>' +
      '<path d="M14 21 q2 -3 4 0 M22 21 q2 -3 4 0" fill="none" stroke="#141414" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M15 27 q5 4 10 0" fill="none" stroke="#141414" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M34 6 v10 M31 13 l3 3 3 -3 M6 6 v10 M3 9 l3 -3 3 3" fill="none" stroke="#141414" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  /* ---------- pixel docent (14x16) ---------- */
  var DOC_BASE = [
    "....kkkkkk....",
    "...kssssssk...",
    "..kssssssssk..",
    ".kssssssssssk.",
    ".kssssssssssk.",
    ".ksEEssssFFsk.",
    ".kssssssssssk.",
    "kssssssrssssk.",
    ".kskkkkkkkksk.",
    ".kssssMMssssk.",
    "..kssssssssk..",
    "...kkkkkkkk...",
    "....p.kk.p....",
    "....pppppp....",
    "..kkkp.kpkkk..",
    ".kkkkkwwkkkkk."
  ];
  var DOC_COL = { k: "#141414", s: "#F2C29B", r: "#D9967A", p: "#FF2E88", w: "#F3ECDF", y: "#FFE14D", d: "#19C2B0" };
  function drawDocent(cv, st) {
    var g = cv.getContext("2d");
    g.clearRect(0, 0, 14, 16);
    for (var y = 0; y < 16; y++) {
      var row = DOC_BASE[y];
      for (var x = 0; x < 14; x++) {
        var c = row.charAt(x);
        if (c === "E" || c === "F") {
          var first = (c === "E") ? row.indexOf("E") === x : row.indexOf("F") === x;
          var pupilFirst = st.look < 0;
          if (st.blink) c = "k";
          else c = (first === pupilFirst) ? "k" : "w";
        } else if (c === "M") {
          c = st.talk ? "k" : (st.frown ? "k" : "s");
        }
        if (c === "." || !DOC_COL[c]) continue;
        g.fillStyle = DOC_COL[c];
        g.fillRect(x, y, 1, 1);
      }
    }
    // monocle (yellow ring around right eye)
    g.fillStyle = DOC_COL.y;
    g.fillRect(8, 4, 4, 1); g.fillRect(8, 6, 4, 1); g.fillRect(12, 5, 1, 1); g.fillRect(12, 6, 1, 3);
    if (st.brow) { g.fillStyle = DOC_COL.k; g.fillRect(3, 3, 2, 1); g.fillRect(9, 3, 2, 1); }
    if (st.sweat) { g.fillStyle = DOC_COL.d; g.fillRect(1, 3, 1, 2); g.fillRect(0, 4, 1, 1); }
  }

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function pickRound() {
    var myths = shuffle(CARDS.filter(function (c) { return !c.real; }));
    var trues = shuffle(CARDS.filter(function (c) { return c.real; }));
    var nm = 7 + Math.floor(Math.random() * 2); // 7 or 8 myths, rest true
    return shuffle(myths.slice(0, nm).concat(trues.slice(0, ROUND - nm)));
  }
  function pickFrom(pool, used) {
    var fresh = pool.filter(function (x) { return !used[x]; });
    if (!fresh.length) fresh = pool;
    var v = fresh[Math.floor(Math.random() * fresh.length)];
    used[v] = 1;
    return v;
  }
  function readBest() { try { return parseInt(localStorage.getItem(BEST_KEY), 10) || 0; } catch (e) { return 0; } }
  function writeBest(v) { try { localStorage.setItem(BEST_KEY, String(v)); } catch (e) { /* ignore */ } }
  function pad(n, w) { n = String(n); while (n.length < w) n = "0" + n; return n; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  var reduceMQ = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  function reduced() { return !!(reduceMQ && reduceMQ.matches); }

  /* ---------- MOUNT ---------- */
  function mount(container) {
    addStyle();
    container.innerHTML = "";
    container.setAttribute("tabindex", "0");
    container.setAttribute("role", "application");
    container.setAttribute("aria-label", "ALLEGEDLY: side-eye the myths, nod at the facts");
    container.style.outline = "none";

    var root = document.createElement("div");
    root.className = "alg-root";
    container.appendChild(root);
    var scan = document.createElement("div");
    scan.className = "alg-scan";

    var S = {
      mode: "title", // title | play | feedback | results
      paused: false, deck: [], i: 0, score: 0, streak: 0, maxStreak: 0, correct: 0,
      caught: 0, fooled: 0, over: 0, slow: 0, fooledCards: [], used: {},
      cardT: 0, cardDur: 6, fbT: 0, fbDur: 3, answered: false,
      best: readBest(), sound: false, visible: true, onscreen: true
    };
    var raf = 0, last = 0, destroyed = false;
    var el = {}; // play-screen refs
    var audio = null;
    var listeners = [];
    function on(t, ev, fn, opt) { t.addEventListener(ev, fn, opt); listeners.push([t, ev, fn, opt]); }

    /* sizing */
    function size() {
      var w = container.clientWidth || 320;
      var h = w < 560 ? Math.max(460, Math.round(w * 1.3)) : Math.round(w * 0.72);
      if (w < 560) h = Math.min(h, 620);
      container.style.height = h + "px";
    }
    size();
    var ro = window.ResizeObserver ? new ResizeObserver(size) : null;
    if (ro) ro.observe(container); else on(window, "resize", size);

    /* audio (off by default, created only on user toggle) */
    function blip(freq, dur, type, vol) {
      if (!S.sound || !audio) return;
      try {
        var t = audio.currentTime, o = audio.createOscillator(), g = audio.createGain();
        o.type = type || "square"; o.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(vol || 0.05, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g); g.connect(audio.destination); o.start(t); o.stop(t + dur + 0.02);
      } catch (e) { /* ignore */ }
    }
    function sfx(kind) {
      if (kind === "good") { blip(660, 0.08); setTimeout(function () { blip(990, 0.1); }, 70); }
      else if (kind === "bad") { blip(180, 0.22, "sawtooth", 0.04); }
      else if (kind === "tick") { blip(1200, 0.03, "square", 0.025); }
      else if (kind === "start") { blip(440, 0.07); setTimeout(function () { blip(660, 0.07); }, 80); setTimeout(function () { blip(880, 0.1); }, 160); }
    }
    function toggleSound() {
      S.sound = !S.sound;
      if (S.sound && !audio) {
        try { var AC = window.AudioContext || window.webkitAudioContext; if (AC) audio = new AC(); } catch (e) { audio = null; }
      }
      if (audio && audio.state === "suspended" && S.sound) { try { audio.resume(); } catch (e) { /* ignore */ } }
      root.querySelectorAll(".alg-mute").forEach(function (b) {
        b.textContent = S.sound ? "SOUND: ON" : "SOUND: OFF";
        b.classList.toggle("alg-on", S.sound);
        b.setAttribute("aria-pressed", S.sound ? "true" : "false");
      });
      if (S.sound) blip(880, 0.06);
    }
    function muteBtn() {
      return '<button type="button" class="alg-mute' + (S.sound ? " alg-on" : "") + '" aria-pressed="' + S.sound + '" data-act="mute">' +
        (S.sound ? "SOUND: ON" : "SOUND: OFF") + "</button>";
    }

    /* ---------- screens ---------- */
    function setScreen(html, cls) {
      root.innerHTML = "";
      var sc = document.createElement("div");
      sc.className = "alg-screen " + (cls || "");
      sc.innerHTML = html;
      root.appendChild(sc);
      root.appendChild(scan);
      return sc;
    }

    function showTitle() {
      S.mode = "title"; stopLoop();
      setScreen(
        '<div class="alg-sticker">A SIDE EYE GAME</div>' +
        eyeSVG("alg-logo", 0, true) +
        '<p class="alg-kicker">THE MUSEUM OF THINGS YOU WERE TOLD</p>' +
        '<h2 class="alg-h1">ALLEGEDLY</h2>' +
        '<p class="alg-sub">Your guide: Dr. Thaddeus Bramble, Docent Emeritus.* Fifteen placards. Some are history. Some are history, allegedly. You have seconds per placard.</p>' +
        '<div class="alg-how"><span class="alg-chip"><b>← SIDE-EYE</b> the myths</span>' +
        '<span class="alg-chip alg-t"><b>NOD →</b> at the facts</span><span class="alg-chip">swipe · tap · arrow keys</span></div>' +
        '<button type="button" class="alg-btn" data-act="start"><span class="alg-blink">▶</span> PRESS START</button>' +
        '<p class="alg-small">BEST: ' + pad(S.best, 5) + '  ·  ' + muteBtn() + '</p>' +
        '<p class="alg-small">*Emeritus status self-conferred. Monocle is load-bearing.</p>',
        "alg-center");
    }

    function startRound() {
      S.deck = pickRound(); S.i = 0; S.score = 0; S.streak = 0; S.maxStreak = 0; S.correct = 0; S.paused = false;
      S.caught = 0; S.fooled = 0; S.over = 0; S.slow = 0; S.fooledCards = []; S.used = {};
      var sc = setScreen(
        '<div class="alg-hud"><span>SCORE <b class="alg-score">00000</b></span><span class="alg-combo">×1</span>' +
        '<span class="alg-sp"></span><span>EXHIBIT <b class="alg-count">01</b>/' + ROUND + "</span>" + muteBtn() + "</div>" +
        '<div class="alg-narr"><canvas class="alg-doc" width="14" height="16" aria-hidden="true"></canvas><div class="alg-src">…</div></div>' +
        '<div class="alg-deck"></div>' +
        '<div class="alg-ctrls">' +
        '<button type="button" class="alg-ctrl alg-se" data-act="myth" aria-label="Side-eye: it is a myth">' + eyeSVG("", -1, true) + "SIDE-EYE <small>← MYTH</small></button>" +
        '<button type="button" class="alg-ctrl alg-nod" data-act="true" aria-label="Nod: it is true">' + nodSVG() + "NOD <small>TRUE →</small></button>" +
        "</div>");
      el.score = sc.querySelector(".alg-score");
      el.combo = sc.querySelector(".alg-combo");
      el.count = sc.querySelector(".alg-count");
      el.doc = sc.querySelector(".alg-doc");
      el.src = sc.querySelector(".alg-src");
      el.deck = sc.querySelector(".alg-deck");
      el.btnL = sc.querySelector(".alg-se");
      el.btnR = sc.querySelector(".alg-nod");
      sfx("start");
      dealCard();
      startLoop();
    }

    function dealCard() {
      var c = S.deck[S.i];
      S.mode = "play"; S.answered = false; S.cardT = 0;
      S.cardDur = 6.5 - 2.5 * (S.i / (ROUND - 1)); // 6.5s down to 4.0s
      el.count.textContent = pad(S.i + 1, 2);
      el.src.textContent = pickFrom(SOURCES, S.used);
      // he gets visibly rattled as you catch him out
      drawDocent(el.doc, { look: 1, talk: true, brow: S.caught >= 2, sweat: S.caught >= 4 });
      el.btnL.disabled = false; el.btnR.disabled = false;
      el.deck.innerHTML =
        '<div class="alg-card' + (reduced() ? "" : " alg-enter") + '">' +
        '<div class="alg-cardtop"><span>EXHIBIT ' + pad(S.i + 1, 2) + "</span><span>PLACARD · VERIFY?</span></div>" +
        '<p class="alg-fact">' + esc(c.t) + "</p>" +
        '<div class="alg-stamp alg-l">SIDE-EYE</div><div class="alg-stamp alg-r">NOD</div>' +
        '<div class="alg-timer"><i></i></div></div>';
      el.card = el.deck.querySelector(".alg-card");
      el.bar = el.deck.querySelector(".alg-timer i");
      el.stL = el.deck.querySelector(".alg-stamp.alg-l");
      el.stR = el.deck.querySelector(".alg-stamp.alg-r");
      bindSwipe(el.card);
    }

    function mult() { return Math.min(5, 1 + Math.floor(Math.max(0, S.streak - 1) / 2)); }

    function answer(saysTrue, timedOut) {
      if (S.mode !== "play" || S.answered || S.paused) return;
      S.answered = true;
      var c = S.deck[S.i];
      var right = !timedOut && (saysTrue === c.real);
      var pts = 0;
      if (right) {
        S.streak++; S.correct++; S.maxStreak = Math.max(S.maxStreak, S.streak);
        var frac = Math.max(0, 1 - S.cardT / S.cardDur);
        pts = Math.round((100 + 150 * frac) * mult());
        S.score += pts;
        sfx("good");
      } else {
        S.streak = 0; sfx("bad");
      }
      el.score.textContent = pad(S.score, 5);
      el.combo.textContent = "×" + mult();
      el.combo.classList.toggle("alg-hot", mult() >= 3);
      if (right && !reduced()) { el.combo.classList.add("alg-bump"); setTimeout(function () { if (el.combo) el.combo.classList.remove("alg-bump"); }, 160); }
      el.btnL.disabled = true; el.btnR.disabled = true;

      // docent reacts: if you side-eyed him, he sweats; if you fell for it, he looks smug
      drawDocent(el.doc, { look: -1, brow: !right || S.caught >= 2, sweat: (!saysTrue && !timedOut) || S.caught >= 4, frown: right && !c.real });
      var said;
      if (timedOut) { S.slow++; if (!c.real) { S.fooled++; S.fooledCards.push(c.t); } said = pickFrom(LINES.slow, S.used); }
      else if (right && !c.real) {
        S.caught++;
        said = LINES.uncle[S.caught] || pickFrom(LINES.caught[S.caught <= 1 ? 0 : S.caught <= 3 ? 1 : S.caught <= 5 ? 2 : 3], S.used);
      }
      else if (right) said = pickFrom(LINES.nod, S.used);
      else if (!c.real) { S.fooled++; S.fooledCards.push(c.t); said = pickFrom(LINES.fooled[S.fooled > 1 ? 1 : 0], S.used); }
      else { S.over++; said = pickFrom(LINES.over, S.used); }
      el.src.textContent = DOCENT + ": “" + said + "”";

      // fly the card
      var card = el.card;
      if (card) {
        card.classList.remove("alg-snap");
        card.classList.add("alg-fly");
        var dir = timedOut ? 0 : (saysTrue ? 1 : -1);
        if (reduced()) card.style.opacity = "0";
        else {
          card.style.transform = dir === 0 ? "translateY(30%) scale(.9)" : "translateX(" + (dir * 130) + "%) rotate(" + (dir * 18) + "deg)";
          card.style.opacity = "0";
        }
      }
      var verdict = timedOut ? "TOO SLOW." : (right ? (saysTrue ? "CORRECT. NOD." : "CORRECT. SIDE-EYE.") : (saysTrue ? "YOU BOUGHT IT." : "OVERTHOUGHT IT."));
      setTimeout(function () {
        if (destroyed || S.mode === "title" || S.mode === "results") return;
        var fb = document.createElement("div");
        fb.className = "alg-fb " + (right ? "alg-good" : "alg-bad") + (reduced() ? "" : " alg-show");
        fb.setAttribute("data-act", "next");
        fb.setAttribute("aria-live", "polite");
        fb.innerHTML =
          '<span class="alg-label">' + (c.real ? "TRUE, AS IT HAPPENS" : "MYTH. ALLEGEDLY.") + "</span>" +
          '<p class="alg-verdict">' + verdict + "</p>" +
          '<p class="alg-note">' + esc(c.n) + "</p>" +
          '<span class="alg-pts">' + (right ? "+" + pts + (mult() > 1 ? "  ×" + mult() + " COMBO" : "") : "COMBO RESET") + "</span>" +
          '<span class="alg-small" style="color:inherit;opacity:.7">TAP / ENTER TO CONTINUE</span>' +
          '<i class="alg-next"></i>';
        el.deck.innerHTML = "";
        el.deck.appendChild(fb);
        el.next = fb.querySelector(".alg-next");
        el.card = null;
      }, reduced() ? 60 : 220);
      S.mode = "feedback"; S.fbT = 0;
      S.fbDur = Math.min(5, 2.2 + c.n.length / 50);
    }

    function nextCard() {
      if (S.mode !== "feedback" || S.fbT < 0.35) return;
      S.i++;
      if (S.i >= ROUND) showResults();
      else dealCard();
    }

    function showResults() {
      S.mode = "results"; stopLoop();
      var newBest = S.score > S.best;
      if (newBest) { S.best = S.score; writeBest(S.best); }
      var rank = RANKS[0];
      for (var r = 0; r < RANKS.length; r++) if (S.correct >= RANKS[r].min) rank = RANKS[r];
      setScreen(
        '<div class="alg-res">' + (newBest ? '<span class="alg-newbest">NEW BEST</span>' : "") +
        '<p class="alg-kicker">OFFICIAL FINDING OF THE COMMITTEE</p>' +
        '<h3 class="alg-rank">' + rank.title + "</h3>" +
        '<p class="alg-sub">' + rank.line + "</p>" +
        '<p class="alg-docline">' + DOCENT + ": “" + esc(rank.doc) + "”</p>" +
        '<div class="alg-stats">' +
        '<div class="alg-stat">SCORE<b>' + S.score + "</b></div>" +
        '<div class="alg-stat">CORRECT<b>' + S.correct + "/" + ROUND + "</b></div>" +
        '<div class="alg-stat">BEST STREAK<b>' + S.maxStreak + "</b></div>" +
        '<div class="alg-stat">HIGH SCORE<b>' + S.best + "</b></div></div>" +
        '<p class="alg-memo">' + memo() + "</p>" +
        '<button type="button" class="alg-btn" data-act="start" style="margin-top:.4em">PLAY AGAIN</button>' +
        '<p class="alg-foot">*Every placard checked against sources sturdier than a placemat. Dr. Bramble\'s uncle was not consulted, despite making himself available. ' + muteBtn() + "</p></div>",
        "alg-center");
      sfx(rank.min >= 10 ? "start" : "tick");
    }

    function memo() {
      var comp = Math.max(0, Math.min(100, 100 - S.caught * 11.5 - S.slow * 1.2 + S.fooled * 3.7 + S.over * 2.4));
      var stat = "DOCENT COMPOSURE: " + comp.toFixed(1) + "% · MONOCLE ADJUSTMENTS: " + (S.caught + 1) + " (ONE RECREATIONAL)";
      var mem;
      if (S.fooledCards.length) {
        var t = S.fooledCards[0].replace(/[“”]/g, "'");
        if (t.length > 72) t = t.slice(0, 69).replace(/\s+\S*$/, "") + "…";
        mem = "YOU BELIEVED: “" + esc(t) + "” Dr. Bramble is having it laminated.";
      } else if (S.over) {
        mem = "YOU SIDE-EYED " + S.over + " TRUE FACT" + (S.over > 1 ? "S" : "") + ". Dr. Bramble has framed " + (S.over > 1 ? "them" : "it") + ".";
      } else {
        mem = "MYTHS BELIEVED: 0. Dr. Bramble has asked for your name, “for the newsletter.”";
      }
      return stat + "<br>" + mem;
    }

    /* ---------- pause ---------- */
    function pause() {
      if (S.paused || (S.mode !== "play" && S.mode !== "feedback")) return;
      S.paused = true; stopLoop();
      var p = document.createElement("div");
      p.className = "alg-pause"; p.setAttribute("data-act", "resume");
      p.innerHTML = '<h3 class="alg-h1" style="font-size:clamp(26px,7cqw,56px)">PAUSED</h3>' +
        '<p class="alg-sub">Dr. Bramble will wait. He has nowhere to be. He checked.</p><p class="alg-small alg-blink">TAP OR PRESS SPACE TO RESUME</p>';
      root.appendChild(p);
      el.pause = p;
    }
    function resume() {
      if (!S.paused) return;
      if (!S.visible || !S.onscreen) return;
      S.paused = false;
      if (el.pause && el.pause.parentNode) el.pause.parentNode.removeChild(el.pause);
      el.pause = null;
      startLoop();
    }

    /* ---------- loop ---------- */
    function startLoop() { if (!raf && !destroyed) { last = performance.now(); raf = requestAnimationFrame(tick); } }
    function stopLoop() { if (raf) cancelAnimationFrame(raf); raf = 0; }
    var lastTickSec = -1;
    function tick(now) {
      raf = 0;
      if (destroyed || S.paused) return;
      var dt = Math.min(0.1, (now - last) / 1000); last = now;
      if (S.mode === "play" && !S.answered) {
        S.cardT += dt;
        var f = Math.max(0, 1 - S.cardT / S.cardDur);
        if (el.bar) { el.bar.style.transform = "scaleX(" + f + ")"; el.bar.classList.toggle("alg-low", f < 0.3); }
        var rem = Math.ceil(S.cardT);
        if (f < 0.3 && rem !== lastTickSec) { lastTickSec = rem; sfx("tick"); }
        if (S.cardT >= S.cardDur) answer(false, true);
      } else if (S.mode === "feedback") {
        S.fbT += dt;
        if (el.next) el.next.style.transform = "scaleX(" + Math.max(0, 1 - S.fbT / S.fbDur) + ")";
        if (S.fbT >= S.fbDur) nextCard();
      }
      if (S.mode === "play" || S.mode === "feedback") raf = requestAnimationFrame(tick);
    }

    /* ---------- swipe ---------- */
    function bindSwipe(card) {
      var sx = 0, sy = 0, dx = 0, active = false, pid = null;
      function down(e) {
        if (S.mode !== "play" || S.answered || S.paused) return;
        if (e.pointerType === "mouse" && e.button !== 0) return;
        active = true; pid = e.pointerId; sx = e.clientX; sy = e.clientY; dx = 0;
        card.classList.remove("alg-snap", "alg-enter");
        try { card.setPointerCapture(pid); } catch (er) { /* ignore */ }
      }
      function move(e) {
        if (!active || e.pointerId !== pid) return;
        dx = e.clientX - sx;
        var dy = e.clientY - sy;
        if (Math.abs(dy) > Math.abs(dx) * 1.5 && Math.abs(dx) < 12) return;
        var w = card.offsetWidth || 300;
        card.style.transform = "translateX(" + dx + "px) rotate(" + (dx / w * 12) + "deg)";
        var a = Math.min(1, Math.abs(dx) / (w * 0.22));
        el.stL.style.opacity = dx < 0 ? a : 0;
        el.stR.style.opacity = dx > 0 ? a : 0;
        if (Math.abs(dx) > 8) drawDocent(el.doc, { look: dx < 0 ? -1 : 1, sweat: dx < -w * 0.1, brow: dx < -w * 0.1 });
      }
      function up(e) {
        if (!active || e.pointerId !== pid) return;
        active = false;
        var w = card.offsetWidth || 300;
        var th = Math.min(110, w * 0.2);
        if (dx <= -th) answer(false);
        else if (dx >= th) answer(true);
        else {
          card.classList.add("alg-snap");
          card.style.transform = "";
          el.stL.style.opacity = 0; el.stR.style.opacity = 0;
          drawDocent(el.doc, { look: 1, talk: true });
        }
      }
      card.addEventListener("pointerdown", down);
      card.addEventListener("pointermove", move);
      card.addEventListener("pointerup", up);
      card.addEventListener("pointercancel", up);
      // these listeners die with the card element; no global cleanup needed
    }

    function flash(btn) {
      if (!btn) return;
      btn.classList.add("alg-press");
      setTimeout(function () { btn.classList.remove("alg-press"); }, 110);
    }

    /* ---------- input ---------- */
    function onClick(e) {
      container.focus({ preventScroll: true });
      var t = e.target.closest ? e.target.closest("[data-act]") : null;
      if (!t || !root.contains(t)) {
        if (S.paused) resume();
        return;
      }
      var act = t.getAttribute("data-act");
      if (act === "mute") { toggleSound(); return; }
      if (act === "start") { startRound(); return; }
      if (act === "resume") { resume(); return; }
      if (S.paused) return;
      if (act === "myth") answer(false);
      else if (act === "true") answer(true);
      else if (act === "next") nextCard();
    }
    function onKey(e) {
      var k = e.key;
      var playing = S.mode === "play" || S.mode === "feedback";
      if (k === "m" || k === "M") { toggleSound(); return; }
      if (playing && (k === "ArrowLeft" || k === "ArrowRight" || k === "ArrowUp" || k === "ArrowDown" || k === " " || k === "Spacebar")) e.preventDefault();
      if (S.paused) { if (k === " " || k === "Enter" || k === "Spacebar") { e.preventDefault(); resume(); } return; }
      if (S.mode === "title" || S.mode === "results") {
        if (k === "Enter" || k === " " || k === "Spacebar") {
          // let a focused button (e.g. sound) handle its own activation
          if (document.activeElement && document.activeElement !== container && root.contains(document.activeElement)) return;
          e.preventDefault(); startRound();
        }
        return;
      }
      if (S.mode === "play") {
        if (k === "ArrowLeft" || k === "a" || k === "A") { flash(el.btnL); answer(false); }
        else if (k === "ArrowRight" || k === "d" || k === "D") { flash(el.btnR); answer(true); }
        else if (k === "Escape" || k === "p" || k === "P") pause();
      } else if (S.mode === "feedback") {
        if (k === "Enter" || k === " " || k === "Spacebar" || k === "ArrowLeft" || k === "ArrowRight") { e.preventDefault(); nextCard(); }
        else if (k === "Escape" || k === "p" || k === "P") pause();
      }
    }
    function onVis() {
      S.visible = !document.hidden;
      if (!S.visible) pause();
    }
    on(container, "click", onClick);
    on(container, "keydown", onKey);
    on(document, "visibilitychange", onVis);
    var io = null;
    if (window.IntersectionObserver) {
      io = new IntersectionObserver(function (ents) {
        var ent = ents[ents.length - 1];
        S.onscreen = ent.isIntersecting && ent.intersectionRatio > 0.25;
        if (!S.onscreen) pause();
      }, { threshold: [0, 0.25, 0.5] });
      io.observe(container);
    }

    showTitle();

    return {
      destroy: function () {
        destroyed = true;
        stopLoop();
        listeners.forEach(function (l) { l[0].removeEventListener(l[1], l[2], l[3]); });
        listeners = [];
        if (ro) ro.disconnect();
        if (io) io.disconnect();
        if (audio) { try { audio.close(); } catch (e) { /* ignore */ } audio = null; }
        container.innerHTML = "";
        container.style.height = "";
        container.removeAttribute("tabindex");
        container.removeAttribute("role");
        container.removeAttribute("aria-label");
        removeStyle();
      }
    };
  }

  window.HC_GAMES = window.HC_GAMES || {};
  window.HC_GAMES[ID] = {
    title: "ALLEGEDLY",
    tagline: "Side-eye the myths. Nod at the facts. Fifteen placards, no refunds.",
    mount: mount
  };
})();
