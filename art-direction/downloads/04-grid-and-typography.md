# 04 Grid and Typography
Version 1.0 draft · November 24, 2026 · Owner: Ines Kerner, Art Director, Typography and Grid
Status: DRAFT for Heather's review
**Who this is for:** Any designer, vendor or AI agent who lays out SIDE EYE magazine pages, from a single caption to a full issue.
**Use it when:** You set up a layout file, build master pages, create paragraph and character styles, place type or images on the grid, or check a page before handoff.
**Related:** 03 Page and Spread Standards · 02 Cover Standards · 05 Art and Illustration Direction (with Midjourney Prompt Standards) · 07 Print Production and Prepress (Amazon KDP) · 08 Quality Checklists · 09 File Naming, Folders and Handoff Specs · 11 Templates · 13 Open Questions for Heather · Brand Standards hub (sections Visual identity, The magazine, Decision log) · SIDE EYE Design System v3: Neon Zine Print · SIDE EYE Design System v2 Core · SIDE EYE Design System v2 Addendum A: KDP Production Spec, 8.5 x 11

---

## 1. How to use this document

This document gives you the page geometry, the grid and the full type system for the printed magazine. Doc 03 tells you which page recipe to use. Doc 05 tells you how to make the art. Doc 07 owns press detail (color builds, ink limits, PDF export). This doc tells you where everything sits and how every word is set.

Where this doc and the Brand Standards hub disagree, the hub wins. Tell Heather. Where a rule waits on Heather, it says "until Heather decides" and the question is logged in 13 Open Questions for Heather.

### The rules at a glance

1. Build every page on the 12-column grid and the 13 pt baseline grid in this doc.
2. Body text is always horizontal, always on the grid, always on a clean paper panel.
3. Print with the free stand-in fonts until Heather records a license for the paid faces.
4. Never set type under 7 pt. Never set body text in caps.
5. No generated lettering anywhere. Every word is set in type or hand-lettered by a real hand and scanned.
6. One pink focus per page. Pink type is used only for that focus.
7. Headlines may run on every axis on LOUD openers only. One diagonal per spread at most. Never on QUIET pages.
8. Wood-type plates: two faces at most, one split fountain at most, set in layout.
9. Curly quotes and apostrophes everywhere. No em-dashes in headlines, decks, captions or Heather's copy.
10. Use the style names in section 15 exactly, so files hand off cleanly.

---

## 2. Page geometry

These numbers come from Addendum A and the hub's Print spec. Doc 07 owns how they print. This section owns how you lay out inside them.

| Item | Measure | Notes |
| :- | :- | :- |
| Trim | 8.5 × 11 in (216 × 279 mm) | Facing pages, perfect bound |
| Bleed | 0.125 in on top, bottom and outside edges | No bleed on the gutter (spine) edge |
| Document size with bleed | 8.625 × 11.25 in per page | Export single pages, not spreads (doc 07) |
| Margin, top | 0.5 in | Measured from the trim |
| Margin, bottom | 0.625 in | The extra room carries the folio |
| Margin, outside | 0.5 in | Holds the evidence rail band (section 5) |
| Margin, gutter (inside) | 0.375 in | Up to 150 pages. At 151 to 300 pages the gutter becomes 0.5 in and the grid must be rebuilt |
| Live area | 7.625 × 9.875 in | 549 × 711 pt |
| Text safety | 0.375 in inside the trim on top, bottom and outside | KDP's rule for books with bleed. Doc 07 explains why this replaces the 0.25 in in older docs |
| Gutter-clear zone | 0.5 in each side of the spine | Faces, headline letterforms and box-score figures never enter it |

### Set up the document

**InDesign:** File > New > Document. Width 8.5 in, height 11 in, Facing Pages on. Margins: top 0.5, bottom 0.625, inside 0.375, outside 0.5. Columns 12, gutter 0.125 in. Bleed: top 0.125, bottom 0.125, inside 0, outside 0.125. Slug 0.

**Affinity Publisher:** File > New > Print. Same page size, Facing Pages on, Start on right. Margins and bleed as above (inside bleed 0). Columns are set in Document > Guides Manager: 12 columns, gutter 0.125 in.

**Anything else** (Scribus, or an HTML and CSS build like Vol. 1): reproduce the same numbers exactly. Doc 07 lists which tools are accepted.

---

## 3. The 12-column grid

Every layout is built from groupings of 12 columns. Each column is 0.5208 in (37.5 pt). Each gutter is 0.125 in (9 pt).

### Spans

Width of a span of *n* columns = (n × 37.5 pt) + ((n − 1) × 9 pt).

| Columns | Width (in) | Width (pt) | Pixels wide at 300 dpi | Typical use |
| :-: | :-: | :-: | :-: | :- |
| 1 | 0.5208 | 37.5 | 157 | Icons, rail art |
| 2 | 1.1667 | 84 | 350 | Wide rail, small spots |
| 3 | 1.8125 | 130.5 | 544 | Spot art, mug shots, Cast cameos |
| 4 | 2.4583 | 177 | 738 | LOUD text column, sidebar, Box Score |
| 5 | 3.1042 | 223.5 | 932 | Pull quote, wide-rail text column |
| 6 | 3.7500 | 270 | 1,125 | QUIET text column, half-page art, pull quote |
| 8 | 5.0417 | 363 | 1,513 | Two-thirds art, deck |
| 9 | 5.6875 | 409.5 | 1,707 | Deck, wide art |
| 12 | 7.6250 | 549 | 2,288 | Full-width headline or image |

**Correction to Addendum A.** Addendum A gives a 4-column text column as 2.4167 in. The grid math gives 2.4583 in (4 × 0.5208 + 3 × 0.125). Three columns at 2.4167 in would leave 0.125 in of the live area unused. Use 2.4583 in. (Logged in 13.)

Full-bleed art sizes stay as Addendum A gives them: a full single page needs 2,588 × 3,375 px. A full spread with outside bleed on both sides is 17.25 × 11.25 in, which is 5,175 × 3,375 px. Doc 07 owns resolution rules.

### Column positions

Columns are counted 1 to 12 from left to right on every page, so column 1 always starts at the left margin (this matches doc 09). Positions are the left edge of each column, measured from the page's left trim edge.

| Column | Left page (verso) | Right page (recto) |
| :-: | :-: | :-: |
| 1 | 0.5000 | 0.3750 |
| 2 | 1.1458 | 1.0208 |
| 3 | 1.7917 | 1.6667 |
| 4 | 2.4375 | 2.3125 |
| 5 | 3.0833 | 2.9583 |
| 6 | 3.7292 | 3.6042 |
| 7 | 4.3750 | 4.2500 |
| 8 | 5.0208 | 4.8958 |
| 9 | 5.6667 | 5.5417 |
| 10 | 6.3125 | 6.1875 |
| 11 | 6.9583 | 6.8333 |
| 12 | 7.6042 | 7.4792 |
| Live area right edge | 8.1250 | 8.0000 |

On a left page the outside margin is on the left. On a right page it is on the right.

---

## 4. The baseline grid

Body text, captions and sidebars all key to one 13 pt baseline grid. Display type (headlines, decks, plates, cover lines, drop caps) is exempt.

### Set it up

- **InDesign:** Preferences > Grids. Baseline Grid Start 0 pt, Relative To: Top Margin, Increment Every 13 pt. View Threshold 75%.
- **Affinity Publisher:** Document > Baseline Grid Manager. Use baseline grid on, Spacing 13 pt, Start position at the top margin.
- The first grid line sits on the top margin (0.5 in from the top trim). The first body baseline is 13 pt below it.
- A full column holds **54 body lines** (54 × 13 pt = 702 pt, inside the 711 pt live depth).

### What sits on it

| Text | Size/leading | How it keys to the grid |
| :- | :- | :- |
| Body, LOUD | 9.5/13 | Every line on the 13 pt grid |
| Section heads, table rows, box headers | various/13 or /26 | Every line on the grid |
| Pull quotes | 18/26 or 16/26 | Every line on every second grid line |
| Captions | 7.5/10 | First line only on the grid |
| Sidebars | 8.5/12 | First line only on the grid |
| Marginalia and footnotes | 7/9 | First line only on the grid |
| Body, QUIET | 10/15 | Every line on a 15 pt grid (see below) |
| Classifieds | 7/9 | Every line on a 9 pt frame grid (see below) |

**First line only.** Captions, sidebars and marginalia have leading that does not divide into 13 pt. Pin their first line to the grid and let the rest run at their own leading. InDesign: Paragraph Styles > Indents and Spacing > Align to Grid: First Line Only. Affinity: Paragraph > Baseline Grid > Align first line only.

**QUIET pages get a 15 pt grid.** QUIET body is 10/15 (Addendum A), which cannot sit on 13 pt. Give QUIET text frames their own grid: same start (the top margin), 15 pt increment. InDesign: Object > Text Frame Options > Baseline Options > Use Custom Baseline Grid. Affinity: Text Frame panel > Baseline Grid > Use custom. A full QUIET column holds **47 lines**. Build this into the QUIET master pages so nobody sets it by hand.

**Classifieds get a 9 pt grid.** Classifieds are 7 pt mono set dense, like a newspaper back page. Their frames use a custom 9 pt grid starting at the top of the frame.

**Display type is exempt, but the body below it is not.** After a headline, deck or opener art, the next body line restarts on the 13 pt grid. Columns that sit side by side must share baselines.

---

## 5. The evidence rail

The evidence rail is the narrow outside strip that makes a SIDE EYE page recognizable at a glance. Design System v2 and v3 keep it. It carries, top to bottom: the filing tab (or tabs), the running section title, and on rail-variant spreads the marginalia, rail icons and vertical timelines.

The rail's width is an open question. The Vol. 1 guide gave it a 22 mm outside margin. Addendum A later set the outside margin to 0.5 in and filled the whole live area with the 12 columns. KDP's 0.375 in text safety (doc 07) leaves a 0.125 in band between the safety line and the live area. **Follow Addendum A's margins until Heather decides.** That gives two versions of the rail:

### 5.1 Standard rail (every feature page)

| Part | Geometry | Type |
| :- | :- | :- |
| Rail band | The outside margin. Type stays between 0.375 in and 0.5 in from the outside trim | Only rotated labels live here |
| Filing tab | A solid color block, 1.0 in tall, from the bleed edge to the live-area edge (0.625 in wide including bleed). Top edge on the top margin line (0.5 in from top trim). Two or three tabs stack downward with 0.125 in between | Label in SE-Tab-Label, rotated, centered in the band |
| Running section title | Starts 0.25 in below the last tab, rotated, in the band | SE-Rail-Title |
| Folio | Bottom margin, outside corner. Baseline 0.42 in above the bottom trim, aligned flush to the outside edge of the live area | SE-Folio, format `FILE 002 / P. 042` |

- **Tab colors:** Tab Red, Tab Blue and the gray tab, by the issue's tab legend. On LOUD pages, the tab is the full ink and the label is reversed in cream or white. On QUIET pages, the tab is a 30 to 60% tint of its color and the label is K100. The gray tab ink is not in the hub palette yet; use Addendum A's Tab Gray (K48) until the hub lists one (doc 07).
- **Rotated label direction:** labels read bottom to top on left pages and top to bottom on right pages, so they always read toward the spine (Vol. 1 guide, still in force).
- **Leave the rail off** covers, full-bleed image pages and full-bleed openers. Keep the folio off those pages too.

### 5.2 Wide rail (only when the art-direction doc calls for it)

Some recipes need room on the rail for real content: rail icons (the Vol. 1 kit has dozens), a vertical timeline strip, a strip of dates, or 7 pt marginalia with the hosts' initials. When a spread's art-direction doc asks for any of these:

- Columns 11 and 12 (right page) or 1 and 2 (left page) become the rail: 1.1667 in wide.
- The remaining 10 columns carry the body as **2 text columns of 5 grid columns** (3.1042 in each). This applies to LOUD and QUIET alike.
- Marginalia set in SE-Marginalia align their first line with the body line they comment on.
- Rail icons are 1 or 2 columns wide and sit on the baseline grid.
- Note the page count cost: 2 × 5 columns holds about 15% less text per page than 3 × 4.

Do not invent a third rail. If a page needs more room than this, it is a sidebar (4 columns) instead.

---

## 6. Column patterns by register and page type

Pick the page recipe from doc 03 first. Then build it from these patterns.

| Page or element | Pattern | Width | Body style |
| :- | :- | :- | :- |
| LOUD feature body | 3 text columns of 4 grid columns | 2.4583 in each | SE-Body-LOUD 9.5/13 |
| QUIET feature body | 2 text columns of 6 grid columns | 3.75 in each | SE-Body-QUIET 10/15 |
| Wide-rail spread (either register) | Rail 2 columns + 2 text columns of 5 | 3.1042 in each | Same as register |
| Sidebar, Box Score, case notes | 4 grid columns | 2.4583 in | SE-Sidebar-Body 8.5/12 |
| What We Can Prove / What We Can't box | 12 columns, split 6 + 6 | 3.75 in each half | SE-Proof-Item 8.5/12 |
| Full-width headline or image | 12 grid columns | 7.625 in | |
| Deck | 6 to 9 grid columns | 3.75 to 5.6875 in | SE-Head-Deck 16/20 |
| Pull quote | 5 or 6 grid columns, hung toward the outside margin | Hang no farther than the 0.375 in safety line (0.125 in past the live area) | SE-PullQuote |
| Classifieds | 3 text columns of 4 grid columns, 0.75 pt K100 rules in the gutters | 2.4583 in each | SE-Classified-Body 7/9 |
| Sources section | 2 text columns of 6, or the existing narrow center column (see 10.7) | 3.75 in | SE-Sources-Entry 7.5/10 |
| Colophon | 2 text columns of 6 | 3.75 in | SE-Colophon 7.5/10 |
| Contents | Poster layout per doc 03; entries on 4- or 6-column measures | | SE-Contents-Entry |
| AI Dead letter and reply | 2 text columns of 6 (letter left, reply right) | 3.75 in | SE-Body-LOUD |
| A-to-Z catalog entries | Drop cap and vertical label in 1 to 2 columns, entry text in the next 4 | | SE-Body-LOUD |

**QUIET pages get their white space from the type, not the margins.** Don't shrink the master margins or drop to one column on your own. The space comes from the 10/15 leading, a deeper sink on opener pages (start the text at least a quarter of the way down), no art in the outside margin, and no stacked furniture. If an art-direction doc asks for a single QUIET column, use 8 grid columns centered on the page and log it in the handoff note.

---

## 7. Images and captions on the grid

### Placing images

- Image frames start and end on column edges. Never stop a frame in the middle of a gutter.
- The top and bottom edges of a frame sit on baseline grid lines. Snap them; don't eyeball them.
- Standard sizes: spot (2 to 4 columns), half page (6 columns, any depth, or 12 columns, half depth), full page in the live area (12 columns, full depth), full bleed (to the bleed edge on top, bottom and outside), spread.
- **Full-bleed and spread art** goes to the bleed edge on the outside, top and bottom. Nothing bleeds into the gutter except art that crosses it on purpose.
- **Art across the gutter:** only where the middle of the image is unimportant, with 0.25 in of duplicated image on each side (Addendum A, doc 07). Faces, headline letters and box-score figures stay 0.5 in clear of the spine.
- **Body text never sits on art.** It sits on a clean paper panel (SE-Obj-Paper-Panel) pasted over the collage. The panel edge sits at least one gutter (0.125 in) outside the text.
- Illustrations never sit inside a period image, and period images never sit inside an illustration (hub).

### Placing captions

- Every image gets a caption in SE-Caption, starting with its figure number: `FIG. 014.` (Vol. 1 guide, still in force).
- Put the caption under its image. Its first line sits on the first grid line at least 6 pt below the image's bottom edge.
- Caption width: the image width, up to 4 columns. Under a wider image, keep the caption 4 columns wide and align it to the image's outside edge.
- Side captions are allowed in the column next to the image. Align the caption's first line with the image's top edge on the grid.
- **Captions for full-bleed art** go on a paper panel inside the live area, or on the facing page keyed by figure number: `FIG. 014 (OPPOSITE).` Keep them inside the 0.375 in safety.
- **Cast captions** (the playbill cameos) use SE-Caption-Cast: the prop name in caps, then one line. Example: `THE BOOT. Arthur Wellesley, later Duke of Wellington.`
- **Credit lines** use SE-Caption-Credit as the caption's last line when doc 06 says the image needs one on the page. The magazine's single Midjourney credit lives in the front matter and colophon (hub).
- QUIET captions: plain facts, no jokes (hub, v3).

---

## 8. The type system

### 8.1 Faces and roles

| Role | Print face (paid) | Free stand-in (use now) | Weights you need | Where it goes |
| :- | :- | :- | :- | :- |
| Masthead | The logo file | The logo file | n/a | Never typeset. Place the outlined logo from the logo pack (hub, Logo) |
| Headlines | Druk Condensed | Anton | Druk Condensed Heavy / Anton Regular | Feature headlines, openers, A-to-Z caps, drop caps, box-score figures, vertical theme title |
| Section heads | Druk | Big Shoulders Display | Black | Section heads inside features, sidebar titles, Classifieds head |
| Wood-type plates | Hamilton Wood Type faces, licensed (for example HWT Van Lanen, HWT American Chromatic) | Alfa Slab One, Rye, Ultra | Pick two per plate | Title plates, dividers, Box Score, contents, Case File and promo posters, back cover |
| Body | Tiempos Text | Source Serif 4 | Regular, Italic, Semibold | Body, decks, pull quotes, sidebars, the issue thesis line |
| Captions, labels, folios, tables | GT America Mono | IBM Plex Mono | Regular, Bold | Captions, case headers, tabs, rail, folios, classifieds, sources, colophon, tables |
| Cover lines | A licensed typewriter mono | Courier Prime | Regular, Bold | Cover lines on torn strips, photographed and pasted |
| Margin notes | Real hand lettering, scanned | None | n/a | Margin notes, arrows, circled words, signatures. Never a "handwriting" font |

**About the mono.** The hub allows IBM Plex Mono or Space Mono. Use IBM Plex Mono. Design System v3 names it, Vol. 1 printed with it, and the logo's tagline is drawn in it. Use one mono per issue, never both.

**About Source Serif 4.** If your copy has optical sizes, use the text size (SmText) for 8 to 11 pt, Caption below 8 pt and Subhead or Display at 16 pt and up. The variable font does this on its own.

### 8.2 Font licensing rule

**Use the free stand-ins until licenses are recorded.** The hub records no print license for Druk, Tiempos Text, GT America Mono or the Hamilton wood-type faces.

- All stand-ins are free for commercial print and PDF embedding: Anton, Big Shoulders Display, Source Serif 4, IBM Plex Mono, Alfa Slab One, Rye and Courier Prime under the SIL Open Font License, and Ultra under the Apache License 2.0. Keep each license file with the fonts (doc 09).
- **Switch a whole issue at once.** Never mix a paid face and its stand-in in one issue (Druk on one page, Anton on the next).
- When a license is recorded, the paid face takes the stand-in's style slot. Style names don't change (section 15).
- **Never use a face that isn't in the table above** without Heather's yes (hub, What always needs Heather's yes). That includes Archivo Black, which appears in the Vol. 1 files, and any system font that slips in as a fallback (doc 07).
- Never use a typeface cut from a named print shop's own blocks, or any shop's or magazine's lettering (v3).
- Buying fonts is spending money, so it needs Heather's yes. Cost notes are in section 18.

---

## 9. Paragraph styles

All sizes in points. Leading follows the slash. Tracking is in 1/1000 em (InDesign and Affinity use the same unit). "Grid" says how the style keys to the baseline grid. K100 means 100% black only, never rich black, and set to overprint (doc 07).

Stand-ins in brackets. When a paid face is licensed, swap the face and keep everything else.

### 9.1 Base styles (every other style is based on one of these)

| Style | Face | Size/leading | Tracking | Case | Align | Color | Grid |
| :- | :- | :- | :- | :- | :- | :- | :- |
| SE-00-Base-Serif | Tiempos Text Regular [Source Serif 4] | 9.5/13 | 0 | Sentence | Justify, last line left | K100 | All lines |
| SE-00-Base-Mono | GT America Mono Regular [IBM Plex Mono] | 7.5/10 | 0 | As set | Flush left | K100 | First line |
| SE-00-Base-Display | Druk Condensed Heavy [Anton] | 72/65 | -5 | All caps | Flush left | K100 | None |

Set the language to English: USA in all three.

### 9.2 Headlines and openers

| Style | Face | Size/leading | Tracking | Case | Align | Color | Grid | Notes |
| :- | :- | :- | :- | :- | :- | :- | :- | :- |
| SE-Head-Feature | Druk Condensed Heavy [Anton] | 60 to 96; leading 90% of size (60/54, 72/65, 96/86) | -10 to 0 | All caps | Flush left or as the layout needs | K100, cream reversed, or pink if it is the page's one focus | None | Two or three beats, one beat per line where possible. No hyphenation. One headline size per page |
| SE-Head-Deck | Tiempos Text Italic [Source Serif 4 Italic] | 16/20 | 0 | Sentence | Flush left, ragged right | K100 | None | One or two sentences. 6 to 9 columns wide. No hyphenation |
| SE-Head-Section | Druk [Big Shoulders Display Black] | 18/26 | +10 | All caps | Flush left | K100 | All lines | 13 pt space before. Keep with next 2 lines |
| SE-Head-Kicker | Mono Bold | 7.5/13 | +120 | All caps | Flush left | K100 | All lines | Section or column label above a headline |
| SE-Head-CaseHeader | Mono Bold | 7.5/13 | +100 | All caps | Flush left | K100 | All lines | `FILED UNDER: LOST THE STORY · 1769–1821 · STATUS: STILL TALKING`. 0.75 pt K100 rule above and below |
| SE-Byline | Mono Regular | 7/13 | +140 | All caps | Flush left | K100 | All lines | |
| SE-Cover-Thesis | Tiempos Text Italic [Source Serif 4 Italic] | Size per doc 02 | 0 | Sentence | Per doc 02 | K100 or cream | None | The issue thesis line under the issue title (hub) |
| SE-Cover-Theme | Druk Condensed Heavy [Anton] | Size per doc 02 | -5 | All caps | Rotated, one edge | Per doc 02 | None | The vertical theme title |
| SE-Cover-Line | Typewriter mono Bold [Courier Prime Bold] | 14 to 24 to start; doc 02 sets final sizes | 0 | As written | Flush left | K100 | None | Set, printed, torn and photographed (section 14). Four cover lines at most |

### 9.3 Body

| Style | Face | Size/leading | Tracking | Align | Indent | Grid | Notes |
| :- | :- | :- | :- | :- | :- | :- | :- |
| SE-Body-LOUD | Tiempos Text Regular [Source Serif 4] | 9.5/13 | 0 | Justify, last line left | First line 1 em (9.5 pt) | All lines, 13 pt | No space between paragraphs. Hyphenation on (section 16) |
| SE-Body-LOUD-First | Same | 9.5/13 | 0 | Same | None | All lines | First paragraph of a feature and after every head |
| SE-Body-LOUD-DropCap | Same | 9.5/13 | 0 | Same | None | All lines | Drop cap 4 lines, 1 character, character style SE-Char-DropCap |
| SE-Body-QUIET | Tiempos Text Regular [Source Serif 4] | 10/15 | 0 | Justify, last line left | First line 1 em (10 pt) | All lines, 15 pt frame grid | QUIET pages only |
| SE-Body-QUIET-First | Same | 10/15 | 0 | Same | None | All lines | |
| SE-Body-QUIET-DropCap | Same | 10/15 | 0 | Same | None | All lines | Drop cap 4 lines, K100 only |
| SE-Body-List | Based on SE-Body-LOUD | 9.5/13 | 0 | Flush left | Hanging 1 em, bullet ■ in K100 | All lines | |
| SE-Body-QA-Question | Mono Bold | 8.5/13 | 0 | Flush left | None | All lines | Q&A pages: SIDE EYE's questions in bold mono, answers in SE-Body-LOUD |

### 9.4 Sidebars, boxes and pull quotes

| Style | Face | Size/leading | Tracking | Case | Align | Color | Grid | Notes |
| :- | :- | :- | :- | :- | :- | :- | :- | :- |
| SE-Box-Header | Mono Bold | 7.5/13 | +120 | All caps | Flush left | Cream or white reversed out of a K100 bar | All lines | Paragraph shading K100, 13 pt deep, 4 pt left inset. Titles every sidebar, box and table |
| SE-Sidebar-Body | Tiempos Text Regular [Source Serif 4] | 8.5/12 | 0 | Sentence | Flush left, ragged right | K100 | First line | 4 columns. Light hyphenation |
| SE-Proof-Item | Tiempos Text Regular [Source Serif 4] | 8.5/12 | 0 | Sentence | Flush left, ragged right | K100 | First line | Hanging indent 1 em, bullet ■ K100 |
| SE-PullQuote-LOUD | Tiempos Text Italic [Source Serif 4 Italic] | 18/26 | 0 | Sentence | Flush left | K100, or pink if it is the page's one focus | Every second line | One per spread at most. 5 or 6 columns |
| SE-PullQuote-QUIET | Tiempos Text Regular [Source Serif 4] | 16/26 | 0 | Sentence | Flush left | K100 | Every second line | Large serif, never Druk (Vol. 1 guide) |
| SE-BoxScore-Figure | Druk Condensed Heavy [Anton] | 24 to 36, leading = size | 0 | Caps | As the table needs | K100 | None | Box-score numbers (Addendum A) |
| SE-Table-Head | Mono Bold | 7.5/13 | +100 | All caps | Flush left; number columns right | K100 | All lines | Heavy rule above the table: 2 pt K100 |
| SE-Table-Body | Mono Regular | 8/13 | 0 | As set | Text left, numbers right | K100 | All lines | Tabular lining figures. Alternating rows may take a Manila tint (doc 07 build) |

### 9.5 Captions, rail and folio

| Style | Face | Size/leading | Tracking | Case | Align | Color | Grid | Notes |
| :- | :- | :- | :- | :- | :- | :- | :- | :- |
| SE-Caption | Mono Regular [IBM Plex Mono] | 7.5/10 | 0 | Sentence; figure number in caps | Flush left, ragged right | K100 | First line | Starts with SE-Char-FigNo. No hyphenation |
| SE-Caption-Cast | Mono Regular | 7.5/10 | 0 | Prop name in caps | Flush left | K100 | First line | Prop name in SE-Char-CastName |
| SE-Caption-Credit | Mono Regular | 7/10 | 0 | Sentence | Flush left | K100 | First line | Last line of a caption |
| SE-Marginalia | Mono Regular | 7/9 | 0 | Sentence | Flush left, ragged right | K100 | First line | Wide rail only |
| SE-Footnote | Mono Regular | 7/9 | 0 | Sentence | Flush left | K100 | First line | |
| SE-Folio | Mono Regular | 7/7 | +80 | All caps | Outside edge | K100 | None | `FILE 002 / P. 042` |
| SE-Rail-Title | Mono Regular | 7/7 | +100 | All caps | Centered in the rail band | K100 | None | Rotated 90° (section 5.1) |
| SE-Tab-Label | Mono Bold | 8/8 | +100 | All caps | Centered | Cream reversed (LOUD) or K100 on tint (QUIET) | None | Rotated 90° |
| SE-CornerBar-Label | Mono Regular | 7/7 | +80 | All caps | Flush to the outside | Cream reversed out of K100 | None | Interim spec, see 10.5 |

### 9.6 Back of book and furniture

| Style | Face | Size/leading | Tracking | Case | Align | Grid | Notes |
| :- | :- | :- | :- | :- | :- | :- | :- |
| SE-Classified-Body | Mono Regular | 7/9 | 0 | As written; lead word in SE-Char-ClassLead | Flush left, ragged right, no hyphenation | All lines, 9 pt frame grid | 9 pt space between ads. No images |
| SE-Sources-Head | Mono Bold | 7.5/13 | +120 | All caps | Flush left | All lines | One head per feature |
| SE-Sources-Entry | Mono Regular | 7.5/10 | 0 | Sentence | Flush left, hanging indent 2.5 em for the entry number | First line | Numbers match the fact-check log one to one (hub) |
| SE-Colophon | Mono Regular | 7.5/10 | 0 | Sentence | Flush left | First line | |
| SE-Corrections | Mono Regular | 7.5/10, or the size of the original error | 0 | Sentence | Flush left | First line | Inside a 0.75 pt K100 box. See 10.8 |
| SE-Contents-Entry | Tiempos Text Regular [Source Serif 4] | 9.5/13 | 0 | Sentence | Flush left, page number right on a tab | All lines | Page numbers in SE-Char-Tabular, mono Bold |
| SE-AtoZ-Label | Mono Bold | 7.5/7.5 | +120 | All caps | Rotated, beneath the drop cap | None | The entry name set vertically (v2) |
| SE-AtoZ-Subtitle | Tiempos Text Regular [Source Serif 4] | 9.5/13 | 0 | Sentence | Flush left | All lines | One line beside the drop cap |
| SE-Stamp-FileNo | Mono Bold | 9 to 14, leading = size | +60 | All caps | Centered | None | Inside the stamp frame. See 10.4 |

---

## 10. Character styles and special elements

### 10.1 Character styles

| Style | What it does | Use |
| :- | :- | :- |
| SE-Char-DropCap | Druk Condensed Heavy [Anton], K100 | The drop cap. Pink only if it is the page's one focus. Black on QUIET |
| SE-Char-Italic | Tiempos Text Italic | Titles of works, foreign words, emphasis |
| SE-Char-Semibold | Tiempos Text Semibold | Rare emphasis. Never a whole sentence |
| SE-Char-Pink | Color Side Eye Pink only | The one pink focus. Using a style makes stray pink easy to find |
| SE-Char-Reversed | Color cream (or paper white) | Type on dark fields |
| SE-Char-FigNo | Mono Bold, caps | `FIG. 014.` |
| SE-Char-CastName | Mono Bold, caps | `THE BOOT.` |
| SE-Char-HostAside | Mono Bold, K100 | `[H.C.]` and `[E.G.]` asides (hub) |
| SE-Char-ClassLead | Mono Bold, caps | `FOR SALE`, `LOST`, `PERSONAL` |
| SE-Char-Tabular | Tabular lining figures | Tables, contents page numbers, box scores |
| SE-Char-NoBreak | No break | Names, dates, measurements, `5 ft 7 in`, `April 1, 1821` |
| SE-Char-Mono-Inline | Mono Regular at the size of the surrounding text minus 1 pt | IDs and codes inside body text |
| SE-Char-Foreign | Tiempos Italic, language set to the phrase's language | Latin and French phrases, checked by the fact-checker |

### 10.2 Drop caps

- Size: 4 lines deep, about 52 pt (Addendum A). Let the drop-cap setting size it; don't set the point size by hand.
- Face: Druk Condensed Heavy [Anton], all caps.
- Use one at the start of each feature's body, and one per letter in A-to-Z catalogs.
- A-to-Z format (v2): a big Druk capital, the entry name set vertically beneath it in SE-AtoZ-Label, and a one-line subtitle in SE-AtoZ-Subtitle beside it.
- QUIET pages may use drop caps. They are black only.

### 10.3 What We Can Prove / What We Can't box

Every feature has one (hub). It comes after the twist and before the other side.

- 12 columns wide, split into two 6-column halves. Left half: WHAT WE CAN PROVE. Right half: WHAT WE CAN'T.
- Each half opens with SE-Box-Header. Items in SE-Proof-Item.
- Frame: SE-Obj-Proof-Box, a 0.75 pt K100 stroke, 9 pt inset, on a clean paper panel.
- Rating words may appear as plain words in the text when the fact check uses them. Never as a stamp, badge or graphic.
- LOUD: black only unless the box is the page's one pink focus. QUIET: black and gray only.

### 10.4 FILE NO. stamp

- The stamp frame is art (a generated or drawn rubber-stamp impression with a blank center). The wording is always set in type inside it: `SIDE EYE` on one line, `FILE NO. 002` on the next, in SE-Stamp-FileNo.
- Set SIDE EYE here as plain capitals. Never make it look like the logo (hub, Logo).
- Rotate the stamp 4° to 8° counterclockwise (SE-Obj-Stamp). Apply the rubber-stamp texture as a mask over live type. Keep an unmasked copy on a hidden layer for edits.
- Pink only when the stamp is the page's one pink focus (covers may carry more color, doc 02). Otherwise K100.
- Never place a stamp over body text. Never on QUIET pages.
- Keep the wording at 9 pt or larger, because the texture eats letter edges.

### 10.5 Corner bars and coda marks

- **Corner bar:** a solid K100 bar for each recurring column (Letters to the AI Dead, Still Wrong, Apocrypha Index, Ranked, Field Guide, Report Card, Last Words). Its position and label face are an open question. Design System v2 puts it around the top outer corner with the column name in Druk. Addendum A, which says it wins over v2, puts the corner bar in the bottom margin with the folio, in 7 pt mono caps tracked +80. **Follow Addendum A until Heather decides:** bottom outer corner, label in SE-CornerBar-Label. Doc 03 shows the placement.
- **Coda marks:** every recurring column ends with its mark (the eye for most columns, the pixel icon for AI Dead letters, a tiny tombstone for Still Wrong). Place it as an inline graphic 1 em tall, one en space after the last word.

### 10.6 Classifieds

- 7 pt mono in three narrow columns, 0.75 pt K100 rules in the gutters, no images (hub, The Money Pages).
- No block over 120 words. Each ad readable in under 15 seconds.
- Head: CLASSIFIEDS (or the issue's title, such as PERSONALS) in SE-Head-Section.
- The classifieds are the last thing before the final spread.

### 10.7 Sources section

- One entry per claim, numbered to match the fact-check log one to one (hub).
- Grouped by feature, each group under SE-Sources-Head.
- Layout: the Vol. 1 guide sets it as a narrow center column in mono, black only. That look is tied to the section's current name, which is under review in the hub's Decision log. Keep the narrow center column until Heather rules on the name. If the name changes, use 2 text columns of 6.
- QUIET register: black only, no pink, no jokes.

### 10.8 Colophon and corrections

- **Colophon:** SE-Colophon. It carries the one Midjourney credit, image credits and the influence credit (hub). It is a QUIET page.
- **Corrections:** printed every issue, in the same size type as the original error (hub). A correction to body copy is set at 9.5 pt. A correction to a caption is 7.5 pt. A correction to a headline is set at the headline's size in its face. This is the only place a style's size may be overridden.

### 10.9 Host asides

Print uses short bracketed asides: `[H.C.]` for Heather and `[E.G.]` for Edwin (hub). Set the initials in SE-Char-HostAside, K100. The Vol. 1 guide set them in pink, but the one-pink-focus rule (Decision log) is newer, so they stay black.

---

## 11. Minimum sizes and legibility

| Rule | Minimum | Source |
| :- | :- | :- |
| Any type, anywhere, interior or cover | 7 pt | Hub, Addendum A |
| Reversed type (cream or white out of a dark field), regular weight | 8 pt | House setting |
| Reversed type, bold weight | 7 pt | House setting |
| Reversed type on rich black | 9 pt, sturdy weight | Doc 07 |
| Type in pink or any other color build | 9 pt | House setting: two-ink type blurs if the plates shift |
| Type in a tint of black (gray) | 9 pt, and never under 60% | House setting |
| Type in rich black or a four-color build | 18 pt | Doc 07 |
| Rules and lines | 0.75 pt | Doc 07 (KDP) |
| Text on a photo or collage | Display type only, on a clear area or solid field | Hub, v3 |

- Older documents call for 6 pt mono lines (a back cover rule and a disclaimer band in The Money Pages, whose volume labels predate the November 24, 2026 renumbering, and microtext on the SIDE EYE Bucks spread). Set them at 7 pt. The hub's minimum wins.
- Vol. 1 printed folios and tab labels below 7 pt. Don't copy the Vol. 1 files as a model for small type.
- Small black type overprints (doc 07). Never set text in rich black.

---

## 12. Type on every axis (LOUD openers)

This comes from the zines (v2, v3). It is one of the strongest signals in the book, so it is rationed.

- **Where:** LOUD feature openers, feature title pages and covers only. Never on QUIET pages. Never on interior body pages.
- **What may rotate:** headlines, section titles on openers, the theme title, rail labels and drop-cap labels.
- **Axes:** horizontal, vertical (90°) and diagonal. **One diagonal headline per spread, at most.**
- **What never rotates:** body text, decks, captions, sidebars, pull quotes. They stay horizontal and on the grid.
- Headlines may overlap images and each other. They never overlap body text, captions or another element's text.
- A vertical display headline may read up or down (the Napoleon opener runs NOT SHORT. up the right page). Small rotated labels follow the rail rule: toward the spine.
- Rotated and diagonal type stays inside the 0.375 in safety and 0.5 in clear of the gutter.
- **Across a spread:** a headline that spans both pages must break at the gutter, with each side at least 0.5 in from the spine. Split between words, never inside a word.
- **One typographic pun per LOUD feature** (v2), built by hand in layout.
- **One isometric headline per volume** (v2), built in vector.
- **One headline size per page.** Get contrast from scale jumps, not from mixing display faces. The exception is a WOOD TYPE plate, which mixes two wood faces by design.
- Use object styles SE-Obj-Rotate-90 and SE-Obj-Rotate-270 for vertical type, so rotations are exact and easy to find.

---

## 13. Wood-type plates

Plates are feature title plates, section dividers, the Box Score, the contents page, Case File posters, promo posters and the back cover (v3).

1. **Set every letter in layout from real wood-type digital fonts.** Never generated. Midjourney makes only the ink textures, split-fountain fields and woodcut cuts (doc 05).
2. **Two faces per plate, at most.** Mix a condensed face with a fat or extended one. Free pairs: Ultra with Alfa Slab One, or Rye with Alfa Slab One. Use Rye for one or two words only, because it is very ornamental.
3. **All caps.** Stacked lines, each a different size, each set to fill the plate's width. The one key word is biggest. On a Box Score, "VS." is biggest.
4. **One split fountain per plate, at most.** Pink to orange to yellow, or cyan to pink. Apply it in layout by placing the split-fountain field inside the letters. Split fountains appear only on WOOD TYPE plates.
5. **Ornaments:** heavy rules, stars, pointing hands, arrows and dingbat borders, from the house ornament library. No ornaments with letters in them.
6. **Ink texture:** add uneven inking, wood grain and edge squash in layout as a texture mask over the type. The type underneath stays live.
7. **Stock:** cream or kraft.
8. **One plate per spread.** Never on QUIET pages.
9. **Keep live type.** When the split fountain or texture needs outlined letters, outline a copy. Keep the live text on a hidden layer named `LIVE TYPE` so the words can be edited and checked.
10. Ink totals for split fountains are checked in doc 07.

---

## 14. Cover lines and hand lettering

### Cover lines

- Four cover lines at most, short, in typewriter mono on torn paper strips (v3, hub). Doc 02 owns the cover layout and sizes.
- **Preferred method:** set each line in SE-Cover-Line, print it on plain paper, tear the strip, photograph or scan it at 600 dpi, and place it.
- If you can't print and tear, set the line in live type over a torn-paper strip texture (a scan, or generated texture with no letters on it). The words must still be real type. Note the method in your handoff note.
- Never generate a cover line. Never use a "typewriter" effect font in place of a real typewriter mono.

### Hand lettering

- Margin notes, arrows, circled words and signatures are real handwriting, scanned. Never a handwriting font (hub, v3).
- Scan at 600 dpi grayscale (Addendum A), clean it up, and place it as one ink: K100, or pink if it is the page's one focus.
- Signatures are scanned from the hosts' own handwriting. Never draw or fake one.
- On QUIET pages, hand lettering is black only and never a joke.

---

## 15. Naming styles so files hand off cleanly

Use the style names in sections 9 and 10 exactly as written, including capitals and hyphens. A vendor or agent who opens your file should find the same names in the same order.

- **Prefix:** every style starts with `SE-`. Paragraph styles, character styles (`SE-Char-`) and object styles (`SE-Obj-`) each live in their own group.
- **Groups (InDesign style groups, Affinity style folders):** `00 Base`, `Heads`, `Body`, `Boxes`, `Captions and Rail`, `Back of Book`, `Cover`, `Characters`, `Objects`.
- **Based on:** every paragraph style is based on one of the three base styles. Change the face in a base style and the issue follows.
- **No local overrides.** Before handoff, clear overrides on body text (InDesign: Paragraph Styles panel > Clear Overrides; Affinity: Text Styles > Reset Formatting). The only allowed overrides are the corrections size (10.8) and manual tracking within -10 to +10 on a single line to fix a widow.
- **Object styles:** SE-Obj-Paper-Panel, SE-Obj-Caption, SE-Obj-Tab, SE-Obj-Rail-Title, SE-Obj-PullQuote, SE-Obj-Proof-Box, SE-Obj-Stamp, SE-Obj-Rotate-90, SE-Obj-Rotate-270, SE-Obj-Image-Grid, SE-Obj-Image-Bleed.
- **Swatches:** name them exactly as the hub names the inks (Toner Black, Side Eye Pink, Pale Cyan and so on). Doc 07 gives the builds.
- **Master pages (InDesign parent pages, Affinity master pages):** `A-LOUD` (3 × 4 columns), `B-QUIET` (2 × 6, 15 pt frame grid), `C-WideRail` (rail + 2 × 5), `D-Bleed` (no rail, no folio), `E-Classifieds` (3 × 4, 9 pt frame grid).
- **Affinity Publisher** opens IDML. Style names survive the trip only if they match exactly, so don't rename on import.
- **HTML and CSS builds** (Vol. 1 was built this way): name each class after its style in lower case, for example `se-body-loud`, `se-caption`, `se-char-figno`. CSS has no true baseline grid, so check every page against the grid by eye before export.
- Doc 09 owns file names, folders and packaging. Doc 11 holds the template files once they are built.

---

## 16. Hyphenation and justification

### Body text (SE-Body-LOUD, SE-Body-QUIET)

| Setting | Value |
| :- | :- |
| Alignment | Justify with last line aligned left |
| Composer | InDesign: Adobe Paragraph Composer. Affinity: default justification |
| Word spacing | Minimum 85%, desired 100%, maximum 133% |
| Letter spacing | Minimum -2%, desired 0%, maximum +2% |
| Glyph scaling | 100% (no scaling) |
| Hyphenation | On. Words of 6 letters or more. At least 3 letters before and 3 after the break |
| Hyphen limit | 2 hyphens in a row, at most |
| Don't hyphenate | Capitalized words, the last word of a paragraph, across a column or page break |
| Keep options | Keep first 2 and last 2 lines together. No single word alone on a paragraph's last line. No single line of a paragraph alone at the top of a column |

Turn on InDesign's Highlight H&J Violations (Preferences > Composition) while you set. Fix loose lines by asking the editor for a small rewrite, or by manual tracking within -10 to +10 on one line. Never stretch a whole paragraph.

### Everything else

- **Ragged right, no hyphenation:** headlines, decks, pull quotes, captions, credit lines, cover lines, classifieds, case headers, labels.
- **Ragged right, light hyphenation** (words of 7 letters or more, 1 hyphen in a row at most): sidebars, proof boxes, marginalia, sources.
- Never break a name, a date, a number with its unit, or a figure number across lines. Use SE-Char-NoBreak.

---

## 17. Numerals and punctuation

### Numerals

- **Body text:** lining figures, proportional (the font's default).
- **Tables, box scores, contents page numbers, folios:** tabular lining figures, numbers right-aligned in columns.
- **Druk and Anton:** lining only.
- **Fractions:** use the font's true fraction glyphs (5 ft 4½ in). Never type 1/2 in body text.
- **Ranges:** en dash, closed up, no spaces: `1769–1821`, `pp. 2–3`, `60–96 pt`.
- **Thousands:** commas: `20,000 emus`.
- **Money:** in the original currency with its symbol (£200). Check that every face you use has the symbol.
- **Ordinals:** never superscript.
- **Dates:** American style, `April 1, 1821` (hub).
- Set numbers as the edited copy gives them. Don't change words to figures or figures to words.

### Punctuation

- **Quotes and apostrophes:** curly in every face, including the mono and the typewriter mono. Turn on typographer's quotes. Check apostrophes at the start of a word: `’90s`, not `‘90s`.
- **Em-dashes:** the hub's no em-dash rule covers Heather's copy. The Vol. 1 guide (still in force) bans them in display type and captions. Whether the rule covers print design copy such as the classifieds and money pages is an open question in the hub's Decision log. **Until Heather decides:** no em-dashes in headlines, decks, captions, pull quotes or any of Heather's copy. In the classifieds and money pages, set the copy exactly as the editor supplies it. Never add or remove a dash yourself. If supplied copy has an em-dash, set the true character (Unicode 2014), spaced as supplied, and flag it in your handoff note.
- **En dash:** ranges only. **Hyphen:** compound words only. Never two hyphens in place of a dash.
- **Ellipsis:** the single ellipsis character.
- **Spaces:** one space after a full stop. No double spaces anywhere. Search for them before handoff.
- **Measurements:** written out (`5 ft 7 in`) with no-break spaces. Use true prime marks (′ ″) only if the copy uses symbols.
- **Brackets:** host asides only, as `[H.C.]` and `[E.G.]`.
- **Ampersand:** only inside a proper name.
- **Special letters:** the ʻokina in Liliʻuokalani, ʻIolani and Aloha ʻOe is its own character (Unicode 02BB). Never use an apostrophe in its place. Check accented letters (Résumé, Mémorial) in every face. If a glyph is missing, your layout tool will quietly swap in a fallback font. Fix it before export (doc 07).
- **Case:** all caps only in display faces and mono labels. Never set body text in caps. Decks and captions are sentence case.
- **Non-English text:** Latin and French phrases are checked by the fact-checker before setting. Japanese text only when a fluent reader writes and checks it. Never generated.

---

## 18. Font licensing: status and cost notes

| Face | Status | Cost note (checked November 24, 2026; confirm before buying) |
| :- | :- | :- |
| Druk Condensed (headlines), Druk (section heads) | No recorded license | One reseller lists a desktop license for a single Druk Condensed style at about $60. The foundry's direct price was not confirmed. The issue needs at least Druk Condensed Heavy, plus a Druk weight for section heads |
| Tiempos Text | No recorded license | No public price found. The foundry quotes desktop licenses by number of users. The issue needs Regular, Italic and Semibold |
| GT America Mono | No recorded license | No public price found. The foundry sells one-time desktop licenses priced by user count, in US dollars. The issue needs Regular and Bold |
| Hamilton Wood Type faces | No recorded license | Sold by several resellers. For example, HWT Van Lanen is listed from about $68 for two fonts. Hamilton Wood Type faces are also listed in the Adobe Fonts library, which Adobe says is cleared for commercial print and PDF embedding for Creative Cloud subscribers. Check which faces are included before relying on it |
| Typewriter mono for cover lines | None chosen | Courier Prime is free and fits the role |
| All free stand-ins | Free for commercial print | SIL Open Font License (Ultra: Apache 2.0). No cost |

The rule stays the same until Heather records a license: print with the free stand-ins. Buying fonts needs Heather's yes. When a license is bought, record the face, the license type, the number of users and who holds it in the issue's font list (doc 09). Paid font files never go into a package that leaves the team (doc 07, doc 09).

---

## 19. Where screen type touches print

The web, the brand hub and the internal tools use Anton for titles, IBM Plex Sans for reading text and IBM Plex Mono for labels (hub, Internal tools). Only three points touch print:

- **The logo** is drawn from Anton and IBM Plex Mono SemiBold, and the files are already outlined. Never retype the wordmark or tagline in any font, print or screen (hub, Logo).
- **IBM Plex Sans is screen-only.** Never use it in the magazine.
- **The Case File poster** is a WOOD TYPE plate that also serves as the YouTube thumbnail background (v3). Build it to the plate rules in section 13, even when its first use is on screen.

The darker screen pink and blue for small text on screens are screen values only. Print uses the CMYK builds in doc 07.

---

## 20. Open questions (summary)

These are logged in 13 Open Questions for Heather. Until she decides, follow the interim rule in the section named.

1. **Evidence rail width** (section 5). Interim: Addendum A margins, standard rail in the margin band, wide-rail variant on request.
2. **Paid font licenses** (sections 8.2 and 18). Interim: free stand-ins.
3. **Em-dashes in print design copy** (section 17). Interim: none in display type, decks, captions or Heather's copy; classifieds set as supplied.
4. **Corner bar position and label face** (section 10.5). Interim: Addendum A.
5. **Archivo Black,** used in the Vol. 1 files but not in the hub (section 8.2). Interim: don't use it.

---

## 21. Checklist before handoff

- [ ] Document set up to section 2: trim, facing pages, margins, bleed (none on the gutter), 12 columns with 0.125 in gutters.
- [ ] Baseline grid 13 pt from the top margin. QUIET frames on a 15 pt grid. Classifieds on a 9 pt grid.
- [ ] Body lines in neighboring columns share baselines.
- [ ] Every image frame starts and ends on column edges and grid lines.
- [ ] Nothing essential within 0.5 in of the gutter. All text at least 0.375 in inside the trim.
- [ ] Rail on every feature page except bleed pages and covers. Tabs, running title and folio in place.
- [ ] Only the faces in section 8.1. All free stand-ins unless a license is recorded. No fallback fonts.
- [ ] No paid face and its stand-in in the same issue.
- [ ] Every text block uses an SE- style. No stray overrides.
- [ ] No type under 7 pt. Pink and tinted type 9 pt or larger. Rules 0.75 pt or heavier.
- [ ] One pink focus per page. Pink type only through SE-Char-Pink.
- [ ] Headlines in caps, one headline size per page, one diagonal per spread at most, nothing rotated on QUIET pages.
- [ ] Wood-type plates: two faces at most, one split fountain at most, live type kept on a hidden layer.
- [ ] No generated lettering anywhere: plates, stamps, cover lines and labels are all set in type.
- [ ] Curly quotes and apostrophes. No double spaces. No em-dashes in headlines, decks, captions or Heather's copy.
- [ ] Every image has a FIG. caption. Every feature has a What We Can Prove / What We Can't box.
- [ ] Corrections set in the same size as the original error.

---

## Sources this is built on

- SIDE EYE Brand Standards hub (Visual identity, The magazine, For vendors, editors and AI agents, Decision log, Logo, Internal tools)
- SIDE EYE Design System v3: Neon Zine Print
- SIDE EYE Design System v2 Core
- SIDE EYE Design System v2 Addendum A: KDP Production Spec, 8.5 x 11
- SIDE EYE Front and Back Matter, Vols. 1–3: The Money Pages
- SIDE EYE Napoleon Art Direction
- Vol. 1 Art Direction and Brand Guidelines v1 (superseded; its unreplaced type rules still stand under v2's "anything not mentioned stays as written")
- Vol. 1 Graphic Elements Kit v1 (superseded; history)
- SIDE EYE Vol. 1 layout package (as-built reference only)
- 07 Print Production and Prepress (Amazon KDP), draft, for safety, line weight and color minimums
- 09 File Naming, Folders and Handoff Specs, draft, for column numbering and packaging
