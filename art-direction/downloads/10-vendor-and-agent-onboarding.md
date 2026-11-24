# 10 Vendor and Agent Onboarding Starter
Version 1.0 draft · November 24, 2026 · Owner: Wren Hale, Onboarding and Handoff
Status: DRAFT for Heather's review
**Who this is for:** New outside vendors (designers, illustrators, cover designers, prepress shops) and new AI agents working on a SIDE EYE magazine issue.
**Use it when:** It is your first day on SIDE EYE, you are setting up an AI agent for SIDE EYE work, or you need a term explained.
**Related:** 00 Start Here: How to Use the SIDE EYE Art Direction Standards; 01 Issue Design Process: From Brief to Print-Ready Files; 05 Art and Illustration Direction (with Midjourney Prompt Standards); 06 Imagery Sourcing, Rights and Credits; 08 Quality Checklists; 09 File Naming, Folders and Handoff Specs; 11 Templates (issue brief, flatplan, art-direction doc, handoff note); SIDE EYE Brand Standards (section For vendors, editors and AI agents; section AI files)

---

This doc builds on the Brand Standards hub, section For vendors, editors and AI agents. The hub's rules for everyone still apply. This doc adds what a magazine vendor or agent needs on top of them.

## 1. Your first hour

Do these in order. Tick each one.

| Minutes | Do this | Done when |
| :- | :- | :- |
| 0 to 10 | Read the hub's Start here and Brand core. | You can say the tagline and the five print processes. |
| 10 to 20 | Read 00 Start Here: How to Use the SIDE EYE Art Direction Standards, including the golden rules and the source-of-truth order. | You know which document wins when two disagree. |
| 20 to 25 | Skim the hub's Decision log and 12 Decision Log. | You know Heather's newest calls. |
| 25 to 35 | Read the docs in your row of the reading-order table in 00. Start with the one for your job (section 4 below). | You have opened every doc on your list. |
| 35 to 45 | Read your issue's Issue Hub doc and the issue brief. Find the flatplan, the Scorecards and the art log. | You know the issue's theme, art director and deadline. |
| 45 to 50 | AI agents: load the files in section 2. Vendors using AI tools: do the same for each tool. | The agent answers the check questions in section 2 correctly. |
| 50 to 60 | Write your first status note (section 6). List what you'll do first and any question you already have. | The art director has your note. |

If you have only ten minutes, read the golden rules in 00 and section 5 of this doc (who decides what).

## 2. Setting up an AI agent

### What to load

| Order | File | Where it goes | Why |
| :- | :- | :- | :- |
| 1 | SIDE-EYE-SYSTEM-PROMPT.md (from the hub, section AI files) | The instructions box of a Claude Project, custom GPT or Gemini Gem | The brand rules in short form |
| 2 | The starter block in section 3 below | Paste it under the hub prompt, in the same box | The magazine production rules in short form |
| 3 | SIDE-EYE-BRAND.md (from the hub, section AI files) | Upload as a knowledge file | The whole brand guide |
| 4 | This set, 00 to 13, as Markdown files | Upload as knowledge files | The design and production standards |
| 5 | The side-eye-art-direction skill (Claude only) | Install it as a skill | The art-direction method and prompt templates |
| 6 | The issue's brief, flatplan, Scorecards and manuscript | Attach for each job, not as standing files | The facts for this issue |

Other AIs can't load a skill. Paste the skill's rules into the instructions instead, as the hub's Skills section says.

### Known out-of-date rules to override

Installed skills lag behind Heather's decisions. Tell the agent these, in its instructions or at the start of the job. Each line comes from the hub's Skills section ("Rules inside skills that may be out of date") or its Decision log.

- **People:** older skill text says no faces or likenesses of real people. The current rule: generated likenesses of historical figures are allowed. Living people follow the sourced-public-facts-only rule. AI Dead figures are always skulls wearing a prop.
- **Pink:** "pink marks one thing" is a print rule. Print keeps one pink focus per page. In video, pink can be used freely.
- **AI video:** generated video only illustrates an idea and must pass the pause test (see the glossary). That rule is for video. Print art follows 05.
- **Prompt endings and settings:** use the templates in 05 exactly as written. If a skill's ending differs, 05 wins until Heather decides otherwise (see 13 Open Questions for Heather).

### Check questions

Ask the agent these before you give it real work. Every answer must match.

1. "How many inks can one print image use?" Black plus two, one pink focus per page, total ink under 240%.
2. "Can you put the word SIDE EYE into a Midjourney prompt so it prints on the cover?" No. No generated lettering. The logo is placed from the logo pack.
3. "Can you name a famous poster artist in a prompt to get the style?" No. Describe materials and methods only.
4. "A feature is about a massacre. Which register?" QUIET. No neon, no collage, no jokes.
5. "Can you mark the cover Approved?" No. Only Heather approves.

If the agent gets one wrong, fix its instructions and ask again.

## 3. Paste-in starter prompt

Paste this plain text into the instructions box, under the hub's short system prompt. It holds no private data. Don't add any.

```
SIDE EYE MAGAZINE: ART DIRECTION AND PRODUCTION RULES

You help make the SIDE EYE print magazine (8.5 x 11 in, Amazon KDP). The brand rules are in SIDE-EYE-BRAND.md. The design and production rules are in the SIDE EYE Art Direction Standards, documents 00 to 13. Read 00 Start Here and 10 Vendor and Agent Onboarding Starter before any work.

WHICH RULE WINS
1. Heather's newest dated decision (12 Decision Log and the brand file's Decision log).
2. The brand file.
3. The Art Direction Standards, 00 to 13.
4. Design System v3: Neon Zine Print.
5. Design System v2 Core and v2 Addendum A (KDP Production Spec).
6. Older docs and skills, for history only.
If sources still disagree, do not pick. Follow the rule the standards name, write "Following X until Heather decides," and list the question in your report.

THE LOOK
- Every image is one process: RELIEF, COLLAGE, WOOD TYPE, HYBRID or NEWSPRINT. Never invent a new look.
- Print: black plus two inks per image, one pink focus per page, total ink under 240%.
- QUIET pages (deaths, atrocities, real suffering): NEWSPRINT only, no neon, no collage, no jokes.
- No generated lettering anywhere. Never generate the logo.
- Never name an artist, studio, shop or magazine in a prompt.
- Never recolor period art. An illustration never imitates a period document or sits inside one.
- Generated likenesses of historical figures are allowed. Living people: sourced public facts only, never shown doing something we can't prove.

THE FACTS
- The feature's Scorecard binds the art. Never show anything on its Must NOT claim list, or any crime, deal or motive it can't prove.
- Every image needs a rights log row, an image ID, a cleared rights status and a credit line (document 06).

NUMBERS
- Trim 8.5 x 11 in. Bleed 0.125 in on top, bottom and outside only. Safety 0.25 in. Nothing essential within 0.5 in of the gutter.
- Body 9.5/13, QUIET body 10/15, captions 7.5/10. Never below 7 pt.
- Images 300 ppi at placed size, never below 200.
- Use the exact grid, type and print specs in documents 04 and 07. Don't round them.

FILES
- Use the folders, file names and image IDs in document 09. Never rename, move, share or delete a file you didn't make.
- If you can't run layout software, deliver a page spec (document 09, section 4, route 3), not a description.
- Midjourney is run by hand by a person. You write the prompts; you don't run the generator by automation.

NEVER
- Mark anything Approved or Published. Only Heather approves. The art director picks images.
- Publish, upload, post, send, buy, sign or spend.
- Share unpublished pages, art or text outside the SIDE EYE team.
- Put a host's last name, a phone number, an email, a home location or an account name in a file, a file name or a prompt.

HOW TO REPORT
End each work session with: Done, Next, Blocked, Questions. Write each question so it can be answered in one word, with the options and what you did in the meantime. Deliver every file with a handoff note (document 09, section 5).

When unsure, say so and ask.
```

## 4. Typical engagements

Find your job below. It tells you what you get, what you deliver and which docs to read first.

| Engagement | You receive | You deliver | Stages you work in (see 01) | Read first |
| :- | :- | :- | :- | :- |
| **Cover only** | Issue brief, cover lines, the cover concept if one exists, page count for the spine | Cover art-direction doc, COLLAGE prompts (A and B), the layered cover file, the cover PDF built on KDP's cover template | 2, 3, 4, 6 | 02, 05, 06, 07 (cover section), 08, 09 |
| **Illustrations only** | Art-direction doc or page briefs, Scorecards, the flatplan | Prompts (A and B per image), the picks, edited finals in 04 Art/09 Finals, an art log row and a rights log row per image | 2, 3 | 05, 06, 03 (your page recipes), 08, 09 |
| **Archival imagery and rights** | Flatplan, Scorecards, image wish list | Archival originals, working copies, rights evidence, rights log rows, credit lines | 3 | 06, 09, 08 |
| **Full layout** | Everything above, plus approved manuscript and final art | A layout package, an HTML build or page specs; review PDFs; a handoff note | 4, 5, 6 | 01, 04, 03, 02, 07, 08, 09 |
| **Prepress only** | Layout package and review sign-off | Preflighted interior and cover PDFs, KDP previewer notes | 6 | 07, 08, 09 |

In every engagement:

- **You never upload to KDP.** Heather uploads.
- **You never order a proof copy, buy a font, buy an image license or pay for any tool.** Spending money needs Heather's yes.
- **You work only inside the issue folders you were given,** in the stage folders for your job.
- **Style references** are SIDE EYE's own approved images. They are private. Ask the art director for them. Never upload anyone else's art as a style reference.

## 5. Who decides what

| Decision | You decide alone | Art director decides | Heather decides |
| :- | :- | :- | :- |
| Wording of a prompt inside a 05 template | Yes | | |
| Applying a fix from 05 when a prompt misbehaves | Yes | | |
| Which candidates to shortlist | Yes | | |
| File names, folders, versions (per 09) | Yes | | |
| Running checklists from 08 and reporting results | Yes | | |
| Taking the safer option while a question is open | Yes, and say so | | |
| Picking the image for a slot (status Picked) | | Yes | |
| Revisions inside an approved concept | | Yes | |
| Ink variant for a feature (per 05) | | Yes | |
| Page recipe for a page, inside the approved flatplan | | Yes | |
| Swapping a generated image for an archival one, or the reverse | | Yes | |
| Calling layout ready for review (end of Stage 4) | | Yes | |
| Passing every gate in 01, except where 01 names the art director | | | Yes |
| The cover, every opener and every image of a real person | | | Yes |
| Anything near a Scorecard's Must NOT claim list | | | Yes |
| A new logo use, color, font, format or page recipe | | | Yes |
| Spending money, signing, licensing | | | Yes |
| Uploading, publishing, ordering a proof | | | Yes |
| Sharing unpublished work outside the team | | | Yes |
| Changing a standard in this set | | | Yes |
| Any conflict listed in 13 Open Questions for Heather | | | Yes |

If the issue brief names no art director, Heather fills that role.

Never mark anything Approved. Leave the Approved by and Approved on cells blank. Heather, or the person she names, fills them.

## 6. How to report

### Where

- **Status of each image:** the Status cell in the art log.
- **Rights status of each image:** the Status cell in the rights log.
- **Each delivery:** a handoff note saved next to the files (09, section 5).
- **Issue-level questions:** the open items list in the Issue Hub doc.
- **Standards-level questions** (a rule that affects every issue): tell the art director. They go to 13 Open Questions for Heather.

### When

- At the end of every work session.
- At every gate, before it is asked for.
- **Right away** when you are blocked, when a check fails, or when an image might show something on a Must NOT claim list.

### Status words

Use only these words, so everyone reads them the same way.

| Where | Allowed values |
| :- | :- |
| Art log, Status | To run · Running · Picked · Needs rerun · Placed · Skip |
| Rights log, Status | Pending · Cleared · Blocked |
| Your status note, each item | Done · In progress · Blocked · Waiting on answer |

The art log made on November 24, 2026 starts new rows as "Not started." Treat that as the same as To run.

### The status note

Four headings, short lines, no filler:

```
Done: what you finished, with file names
Next: what you'll do next, in order
Blocked: what stops you, and who can unblock it
Questions: each one answerable in one word, with the options,
           what each costs, and what you did meanwhile
```

## 7. What to expect at each gate

01 Issue Design Process: From Brief to Print-Ready Files is the authority on gates. This table is a summary so you know what is coming.

| Stage | What gets checked | Who passes it | What you hand in |
| :- | :- | :- | :- |
| 0 Issue Brief | Theme, page count, schedule, who does what | Heather | Nothing, unless asked to draft |
| 1 Flatplan | Every page's piece, recipe, register and tab | Heather | Flatplan draft, if you are the art director |
| 2 Art Direction | Concepts, processes, inks, prompts, people rules, Scorecard limits | Heather for the cover and concepts; art director for revisions inside them | The art-direction doc (05, section 14) |
| 3 Art Production | Each image against the pick checklist in 05 and the rights checks in 06 | Art director picks each image; Heather approves the cover, openers and any real person (05, section 12.4) | Finals, art log rows, rights log rows, rights evidence |
| 4 Layout | Pages built to 03, 04 and 07; links and fonts; checks in 08 | Art director | Review PDF and your package, build or page specs |
| 5 Review and Legal Read | Every page against the Scorecards, the legal read, credits | Heather | Fixes and a new review PDF |
| 6 Prepress | KDP specs and previewer | Production for preflight; Heather for upload | Print-ready PDFs |
| 7 Proof Copy | The printed proof, when the brief calls for one | Heather | Proof notes, if asked |
| 8 Release and Archive | The live book and the closing package | Heather | The 08 Package folder (09) |

Expect notes at every gate. A gate can send work back. That is normal. Fix it, raise the version number, and hand it back with a new handoff note.

## 8. Your first assignment (a test)

Every new vendor or agent does this test before real issue work. It takes one to two hours. It uses a made-up test issue, so nothing you make goes into a real issue.

### The brief

- **Issue code:** SE-V00 (test only)
- **Piece:** a sidebar on the myth that people in the Middle Ages thought the Earth was flat.
- **Job:** one RELIEF spot illustration, square (1:1), printed about 3.4 in wide on a LOUD page.
- **Ink variant:** pink + pale cyan (the house default).
- **Pink:** on one object only, the punchline.
- **Type space:** leave plain paper across the top third.

### The practice Scorecard

This is a practice Scorecard written for this test. Treat it as binding for the test.

| Claim | Proof level |
| :- | :- |
| Educated people in medieval Europe knew the Earth was round. Standard textbooks of the time taught a round Earth. | PROVEN |
| Medieval kings held a royal orb, a round ball with a cross on top, as a symbol of the world. | PROVEN |
| The idea that "medieval people thought the world was flat" became popular in the 1800s, long after the Middle Ages. | LIKELY |

**Must NOT claim:**

- Don't show any real person, living or historical.
- Don't show anyone saying or teaching that the Earth is flat.
- Don't suggest the Church taught a flat Earth.
- Don't imitate a medieval manuscript, map or document.

### What to do

1. Read 05 sections 3.1 (RELIEF), 5 (the joke rule), 8 and 9.1 (the RELIEF template).
2. Write a one-line concept: the visual joke and what pink marks.
3. Write **Prompt A** (safer joke) and **Prompt B** (bolder joke) from the 05 RELIEF template. Change only the words in brackets. Keep the style reference as the placeholder `[RELIEF STYLE REFERENCE URL]`.
4. Check both prompts against the Must NOT list and the golden rules in 00.
5. Name the file the image will have once it is run and picked (09).
6. Fill one art log row and one rights log row (below).
7. Write a short handoff note (09, section 5).
8. Save everything in the test folder the art director gives you. If you have no folder, send the files with your status note.

You don't run Midjourney for this test. A person runs it by hand later, if the art director wants to see results.

### A sample answer

Use this to check your format, not to copy. Your joke can be different.

**Concept:** The royal orb, the round world in a king's hand, sits on a plate next to a flat pancake. Pink marks the orb.

**Prompt A (safer):**

```
flat three-ink relief print of a jeweled royal orb topped with a small cross resting on a plain plate beside a flat round pancake, the royal orb printed in fluorescent pink, bold simple shapes, thick uneven carved black outline, fluorescent pink and pale cyan ink, coarse halftone dot shading, speckled ink texture, slight misregistration, printed on bare warm cream paper, wide empty paper margins, plain empty paper across the top third, evenly lit, flat ink printed on paper --ar 1:1 --s 150 --c 0 --sref [RELIEF STYLE REFERENCE URL] --sw 60 --no text, letters, words, numbers, logo, watermark, skull, glow, gradient --raw --v 8.2
```

**Prompt B (bolder):**

```
flat three-ink relief print of a jeweled royal orb topped with a small cross sitting in a cast-iron frying pan, a gloved hand pressing down on it with a bent spatula, the orb still perfectly round, only hands and sleeves visible, the royal orb printed in fluorescent pink, bold simple shapes, thick uneven carved black outline, fluorescent pink and pale cyan ink, coarse halftone dot shading, speckled ink texture, slight misregistration, printed on bare warm cream paper, wide empty paper margins, plain empty paper across the top third, evenly lit, flat ink printed on paper --ar 1:1 --s 150 --c 10 --sref [RELIEF STYLE REFERENCE URL] --sw 60 --no text, letters, words, numbers, logo, watermark, skull, glow, gradient, faces --raw --v 8.2
```

Before you hand in, copy the ending from the current 05 template, not from this sample. 05 wins if they differ.

**File name once picked (09):** `SE-V00_p000_flat-earth-orb_RELIEF_A1_v01.png` (page p000 because the test has no page; A1 means Prompt A, grid image 1).

**Image ID (09 and 06):** `SE-V00-I01`

**Art log row:**

| Field | Entry |
| :- | :- |
| # | 1 |
| Image ID | SE-V00-I01 |
| Section | Test |
| Piece | Flat Earth myth sidebar |
| Page(s) | not placed |
| Art status | To run |
| Brief (what the art must show) | A round royal orb beside a flat pancake. Pink on the orb. No people, no lettering, no manuscript look. |
| Process / Midjourney prompt | RELIEF, pink + cyan. Prompt A and Prompt B as written in the handoff note. |
| Generations kept | none yet |
| Chosen file (in Selects) | none yet |
| File name | SE-V00_p000_flat-earth-orb_RELIEF_A1_v01.png (planned) |
| Source and license | Generated, Midjourney v8.2 |
| Credit line | Illustration generated with Midjourney and edited by SIDE EYE. |
| Pixel size | not yet run (needs at least 1,020 px wide for 3.4 in at 300 ppi) |
| 300 dpi at print size? | not yet run |
| Approved by | (blank) |
| Approved on | (blank) |
| Notes | Must NOT list checked: no person, no one teaching flat Earth, no Church, no period document. |

**Rights log row (06, section 5):** Image ID SE-V00-I01; Type I; Source "Midjourney v8.2"; Creator "SIDE EYE"; Status Pending (until it is generated, picked and checked); credit line as above.

### How the test is graded

The art director passes the test when every line is true.

- [ ] Both prompts use the 05 RELIEF template, with only the bracketed words changed.
- [ ] No artist, studio, shop or magazine name. No lettering asked for.
- [ ] Pink is on one object, and that object is the punchline.
- [ ] Nothing in either prompt breaks the Must NOT list.
- [ ] No period document, map or manuscript look.
- [ ] The file name, image ID and both log rows follow 09 and 06.
- [ ] Approved cells are blank.
- [ ] The handoff note answers the questions in 09, section 5.
- [ ] No em-dashes and no banned words or phrases (hub, section Voice and writing) in any text you wrote.

## 9. Privacy and confidentiality

- **Unreleased issues are confidential.** Don't share pages, art, text, themes or dates outside the SIDE EYE team until the issue is on sale.
- **Never post work in progress** anywhere public: no portfolio, no social post, no public gallery.
- **Generator galleries:** some image tools post your images to a public gallery by default. Before you generate art for an unreleased issue, ask the art director how the SIDE EYE account is set up (open question, see 13).
- **No personal data.** Never put a host's last name, a phone number, an email, a home location or an account user name on a page, in a file, in a file name, in a prompt or in a handoff note.
- **Rename downloads.** Image tools often put the account's user name in the file name. Rename every file per 09 before it goes into a shared folder.
- **Leave Drive as you found it.** Don't move, rename, share or delete files you didn't make. Don't change sharing settings. Don't make copies outside the issue folders.
- **The standards portal is unlisted.** Its address is given to you directly. Don't post it or link to it.
- **Private people in found material:** no readable names, addresses or personal details of private people (see 06).
- **When a job ends,** hand back everything in the issue folders and delete your local copies, unless the art director asks you to keep them.

## 10. Glossary

| Term | Meaning |
| :- | :- |
| **A and B prompts** | Two prompts per image. A is the safer joke, B the bolder one. See 05. |
| **AI Dead** | The column "Letters to the AI Dead." Its portraits are always a skull wearing the figure's defining prop, never a face. |
| **Archival image** | A public-domain or free-license period image. The only image type that can serve as proof. Type code H. |
| **Art log** | The issue's sheet with one row per image slot: brief, prompt, file, status, rights, credit. Lives in 04 Art. |
| **Black plus two** | Every print image uses black plus at most two inks. |
| **Bleed** | Art that runs past the trim edge by 0.125 in, on top, bottom and outside only. Never into the gutter. |
| **Box Score** | A WOOD TYPE fight-card plate on kraft paper, names stacked, with "VS." the biggest word. |
| **Cast cameo** | A small RELIEF portrait of a real person told through a prop, inside a plain round frame. |
| **Coda mark** | The small mark that ends a piece: the eye mark for most columns, a pixel icon for an AI Dead letter, a tiny tombstone for Still Wrong. |
| **COLLAGE** | Layered paper collage. Used for covers, section openers, the tabloid poster and one full-bleed opener per issue. |
| **Corner bar** | A solid black bar at the page corner carrying a column's name in reversed type. Its exact place is in 04. |
| **CURRENT / SUPERSEDED** | Words in Drive titles. CURRENT is the live version. SUPERSEDED is history; don't work from it. |
| **Evidence rail** | A narrow strip on the outer edge of a page that carries the filing tab, the running section title in mono type, and the folio as a file number. Sizes are in 04. |
| **Filing tab** | A colored tab (red, blue or gray) on the page edge. Each color has a meaning set per issue in the issue brief. |
| **Flatplan** | The page-by-page plan of the issue: what goes on each page, with its recipe, register and tab. |
| **Folio** | The page number line. |
| **Gate** | The approval point at the end of each stage in 01. Work can't move on until it passes. |
| **Gutter** | The inside edge where pages meet the spine. Keep anything essential 0.5 in away from it. |
| **Handoff note** | The note that goes with every delivery. Its contents are in 09, section 5. |
| **HYBRID** | A real period figure, cut out and placed into a RELIEF scene. Used for openers about a historical person. |
| **Image ID** | One ID per image, like SE-V02-H03, used in the art log, rights log and credit list. See 09 and 06. |
| **Ink variant** | The second ink beside pink: pale cyan (default), acid yellow (money), neon orange (fire, war, emergencies), or cyan + orange with no pink (a LOUD page next to a QUIET one). |
| **Issue code** | SE-V plus the two-digit volume, like SE-V02. |
| **KDP** | Amazon Kindle Direct Publishing, the print-on-demand service that prints and sells the magazine. |
| **LOUD** | The default register: neon inks, jokes, collage and wood type allowed. |
| **Money Pages** | The front and back matter: the two front spreads, the classifieds, the last spread and the back cover. Each reads in under 15 seconds. |
| **Must NOT claim list** | The part of a Scorecard that lists what the piece, and its art, may never say or show. |
| **NEWSPRINT** | Soft black ink on gray newsprint, coarse halftone, lots of empty space. Used for QUIET pages and Out Back. |
| **Out Back** | The back section of the issue, printed in the NEWSPRINT look. |
| **Page recipe** | The fixed layout pattern for a recurring page type. See 03. |
| **Page spec** | An exact, page-by-page build sheet with coordinates, from someone who can't run layout software. See 09. |
| **Pause test** | For AI video: if any paused frame could pass for real film of a real person, restyle it or cut it. |
| **Pink focus** | The one thing on a print page that carries pink. One per page. |
| **Proof levels** | PROVEN, LIKELY or NOT PROVEN, given to every claim in the research. They never print on the page. |
| **QUIET** | The register for serious subjects: deaths, atrocities, real suffering. NEWSPRINT only, no neon, no collage, no jokes. |
| **RELIEF** | The house illustration: a carved-block look, thick black outline, black plus two inks, halftone dots, cream paper, one visual joke. |
| **Rights log** | The issue's sheet with one row per image, recording source, license basis, credit line and rights status. See 06. |
| **Safety** | Keep text and key art 0.25 in inside the trim. |
| **Scorecard** | The research summary for each feature: claims with proof levels, the Must NOT claim list, corrections, the other side, and checks before print. It binds the art. |
| **Selects** | The candidates picked from the generations, kept untouched. |
| **Split fountain** | Two or three inks blended across one run of a print plate. Used with WOOD TYPE only. |
| **Style reference** | SIDE EYE's own approved image that guides Midjourney's look. Private. Ask the art director. |
| **Trim** | The final page size: 8.5 × 11 in. |
| **WOOD TYPE** | Big letterpress poster type, plates and woodcut cuts. Used for the Box Score, posters and contents. Letters are set in real type, never generated. |

Terms for the brand itself (the logo, colors, hosts, voice) are in the Brand Standards hub.

---

## Sources this is built on

- SIDE EYE Brand Standards (the Brand Standards hub), sections For vendors, editors and AI agents, AI files, Skills, Decision log, Privacy
- Design System v3: Neon Zine Print
- Design System v2 Core
- Design System v2 Addendum A: KDP Production Spec, 8.5 x 11
- Front and Back Matter, Vols 1-3 (The Money Pages)
- side-eye-art-direction (skill)
- 01 Issue Design Process: From Brief to Print-Ready Files (draft)
- 05 Art and Illustration Direction (with Midjourney Prompt Standards) (draft)
- 06 Imagery Sourcing, Rights and Credits (draft)
- 00 Art Log – SE-V02 The Mating Issue (column set) (titled before the November 24, 2026 renumbering; The Mating Issue is now Vol. 3)
- SIDE EYE – Midjourney Prompt Workbook v2 (V8.2-hardened, Oct 17) (status values)
