# 07 Print Production and Prepress (Amazon KDP)
Version 1.0 draft · November 24, 2026 · Owner: Gus Pressley, Art Director, Production and Prepress
Status: DRAFT for Heather's review

**Who this is for:** Any designer, prepress vendor or AI agent who turns a laid-out SIDE EYE issue into files Amazon KDP will print, and anyone who checks those files.

**Use it when:** You set up a new issue document, convert art to print color, export PDFs, run preflight, upload to KDP, check a proof copy, or package an issue for the archive.

**Related:** 01 Issue Design Process: From Brief to Print-Ready Files · 02 Cover Standards · 03 Page and Spread Standards · 04 Grid and Typography · 05 Art and Illustration Direction (with Midjourney Prompt Standards) · 06 Imagery Sourcing, Rights and Credits · 08 Quality Checklists · 09 File Naming, Folders and Handoff Specs · 12 Decision Log · 13 Open Questions for Heather · Source docs: SIDE EYE Brand Standards hub (sections "Visual identity", "The magazine" and "Decision log") · SIDE EYE Design System v3: Neon Zine Print · SIDE EYE Design System v2 Addendum A: KDP Production Spec, 8.5 x 11

---

## 1. The short version

SIDE EYE is a perfect-bound paperback printed on demand by Amazon KDP. KDP prints full color on white paper with four process inks and nothing else. That one fact drives most rules in this doc.

Five rules you can't break:

1. **Build in CMYK, deliver in CMYK.** No RGB, no spot colors, no fluorescent inks. Every neon is a CMYK build.
2. **Keep total ink at 240% or less** anywhere on any page or cover.
3. **Every image is 300 ppi or more at its placed size.** Nothing under 200 ppi, ever.
4. **One interior PDF and one cover PDF**, fonts embedded, transparency flattened, no marks, single pages.
5. **Nothing goes live without Heather's yes.** Agents and vendors never click Publish or order anything that costs money on their own.

Where a number below comes from KDP's own help pages, it says "KDP." Where it comes from a house document, it names that document. Where the two differ, the stricter number is used, so both are met.

---

## 2. The print spec at a glance

| Item | Spec | Source |
|---|---|---|
| Format | Paperback, perfect bound | Addendum A |
| Trim size | 8.5 x 11 in (216 x 279 mm) | Addendum A, Brand Standards hub |
| Interior ink and paper | Premium color, white paper | Addendum A |
| Cover finish | Matte | Addendum A |
| Bleed | 0.125 in on top, bottom and outside edges. No bleed on the gutter edge | KDP, Addendum A |
| Interior page size with bleed | 8.625 x 11.25 in, every page | KDP, Addendum A |
| House margins (from trim) | Outside 0.5 in, top 0.5 in, bottom 0.625 in, gutter 0.375 in (up to 150 pages) | Addendum A, hub |
| Live text area | 7.625 x 9.875 in | Addendum A |
| Text and essential art safety | At least 0.375 in inside the trim on top, bottom and outside edges | KDP minimum for books with bleed (see note) |
| Gutter safety for essential art | Faces, headline letters and box-score figures 0.5 in clear of the gutter | Addendum A |
| Page count | Even. House plan is 116 to 132 pages including front and back matter | Addendum A |
| KDP page limits for this trim, premium color | 24 to 590 pages | KDP |
| Minimum type size | 7 pt anywhere, interior and cover | KDP, hub |
| Minimum line weight | 0.75 pt | KDP |
| Images | 300 ppi at placed size; 600 ppi for line art and document scans; nothing under 200 ppi | Addendum A, KDP |
| Color | CMYK only, total ink 240% or less | hub, Addendum A |
| Spine width | Page count x 0.002347 in | KDP, Addendum A |

**Note on safety.** The hub and Addendum A list a 0.25 in safety zone. KDP's own rule for books with bleed is at least 0.375 in between the trim and any text or essential art on the top, bottom and outside edges. Use 0.375 in. It meets both rules, and the house margins (0.5 in and wider) already sit inside it. It matters for things you might push toward the edge: folios, corner bars, filing-tab labels, cover lines on full-bleed openers and captions on bleed images. Filing tabs and color fields may bleed off the page. The words on them may not come closer than 0.375 in to the trim.

### 2.1 Gutter by page count

The house grid is built for books of 150 pages or fewer. If an issue goes past 150 pages, the gutter changes and the grid must be rebuilt (Addendum A). KDP's inside-margin table:

| Page count | Minimum inside (gutter) margin |
|---|---|
| 24 to 150 | 0.375 in (house standard) |
| 151 to 300 | 0.5 in (rebuild the 12-column grid first; ask the art director) |
| 301 to 500 | 0.625 in |
| 501 to 700 | 0.75 in |
| 701 to 828 | 0.875 in (above the 590-page limit for this trim) |

Lock the page count before you finalize the cover. Every 2 pages changes the spine.

### 2.2 Page count rules

- Deliver an even page count. Each sheet is two pages. Add a planned page (ads, notes, a colophon) rather than leaving KDP to add blanks.
- Number pages in sequence: even numbers on left pages, odd on right.
- Don't run blank pages in a row. KDP rejects more than 4 blank pages in a row at the start or middle, or more than 10 at the end. A blank sacrificial verso behind a cut-out page is fine (one page).
- The cover is never part of the interior PDF. Page 1 of the interior file is the first right-hand page inside the cover.

### 2.3 Spine and cover wrap

Build the cover to KDP's downloaded cover template for the final page count, never a guess (Addendum A). Get the template from KDP's cover calculator once the page count is locked, and put it in the issue's prepress folder.

Formulas (KDP):

- Spine width = page count x 0.002347 in (premium color, white paper)
- Cover width = 0.125 in bleed + 8.5 in back + spine + 8.5 in front + 0.125 in bleed
- Cover height = 0.125 in bleed + 11 in + 0.125 in bleed = 11.25 in

Worked sizes for the house page range:

| Pages | Spine (in) | Full cover width (in) | Full cover height (in) | Full cover at 300 ppi (px) |
|---|---|---|---|---|
| 96 | 0.2253 | 17.4753 | 11.25 | 5,243 x 3,375 |
| 112 | 0.2629 | 17.5129 | 11.25 | 5,254 x 3,375 |
| 116 | 0.2723 | 17.5223 | 11.25 | 5,257 x 3,375 |
| 120 | 0.2816 | 17.5316 | 11.25 | 5,259 x 3,375 |
| 124 | 0.2910 | 17.5410 | 11.25 | 5,262 x 3,375 |
| 128 | 0.3004 | 17.5504 | 11.25 | 5,265 x 3,375 |
| 132 | 0.3098 | 17.5598 | 11.25 | 5,268 x 3,375 |

Cover rules from KDP and Addendum A:

- Front and back cover text stays at least 0.25 in inside the trim (Addendum A). KDP's own minimum is 0.125 in, so 0.25 in meets both.
- No front or back text runs onto the spine.
- Spine text is allowed by KDP only at 79 pages or more. Keep at least 0.0625 in between spine text and each fold line, because the fold can shift that much either way.
- At SIDE EYE's page counts the spine is about a quarter inch wide. What the spine says is set in 02 Cover Standards (section 10). Addendum A called for a solid pink field with the volume number only, or no text; the printed Vol. 1 spine carried "SIDE EYE · VOL. 1 · THE LOSERS ISSUE" in mono caps, cream on Toner Black. 02 Cover Standards follows the printed Vol. 1 spine until Heather decides (open question; see 13 Open Questions for Heather). Production checks only the technical rules here: page count of 79 or more, 0.0625 in clear of each fold, 7 pt or larger.
- Run front and back background colors at least 0.0625 in past each fold into the spine, or match the spine color to the cover edge next to it, so fold drift never shows a sliver of the wrong color.
- Leave the barcode zone on the back cover empty: a white box 2 in wide by 1.2 in tall in the lower right corner, beside the spine (see 02 Cover Standards, section 11). KDP prints its barcode there. Check the zone against KDP's cover template. Vol. 1 used a white box in that corner.
- The cover is one page in one PDF: back, spine and front as one image.
- Cover art is 300 ppi at placed size. Total ink 240% or less, the same as the interior.

---

## 3. Paper, ink and what they do to color

### 3.1 Why premium color on white

KDP offers three paper and ink setups for this trim that matter to us. SIDE EYE uses premium color.

| Setup | Pages (8.5 x 11) | What it looks like | Use |
|---|---|---|---|
| Premium color, white paper | 24 to 590 | Richest color KDP prints, heavier white paper, best for full-page art | **House standard** (Addendum A) |
| Standard color, white paper | 72 to 600 | Lighter paper, flatter and less saturated color; neon builds look dull | Not for SIDE EYE |
| Black ink, white or cream paper | 24 to 590 | No color | Not for SIDE EYE |

Changing the setup changes the spine width, the cover template and every color decision. Don't change it without Heather's yes.

### 3.2 What white paper means for the house look

- **There is no cream paper in color printing at KDP.** Warm Cream is a printed tint, C4 M7 Y14 K0 (hub). Every LOUD page that wants the cream ground prints that tint edge to edge (bleed it). The hub note "on cream stock, knock out to the paper" applies only if the book ever moves to a printer with cream stock.
- **Newsprint Gray and Kraft are printed tints too.** Newsprint Gray is C4 M3 Y7 K8 (hub). Kraft has no approved CMYK build in any source yet (see 13 Open Questions for Heather). Until one is approved, convert Kraft from its screen hex #C9A27A with the house conversion in section 4.4, keep it under 240%, and flag every Kraft page for the proof.
- **Neon reads differently on a printed cream tint than on bare white.** Design System v3 judged the builds on "uncoated cream." Ours sit on a cream tint over white paper. Expect pink and cyan to look a little cooler and cleaner than on screen. Only a printed copy shows the truth.
- **Show-through.** Dark full-bleed pages show through to the facing side. Don't put full-bleed dark fields on both pages of a spread, and don't back a full-bleed dark page with a QUIET page of small type. Where a QUIET feature wants a dark field, use an 85% black tint rather than a solid (Addendum A).
- **Matte cover.** Matte lamination softens and slightly darkens color compared with gloss. Neon on the cover will look a step less electric than on screen. Push the cover's pink field to full strength and large size so it still reads loud (Addendum A, "Spot pink").

---

## 4. Color management

### 4.1 The rules

1. Work in CMYK from the start of layout. Set every swatch to the house build in 4.2 by number. Don't let software convert a hex value for you.
2. One pink focus per page in print (hub Decision log). Pink is the house's lead ink, so its build matters most.
3. Total ink 240% or less on every object, including where objects overlap.
4. Body text, captions and small type print in K100 only. Never set text under 18 pt in rich black or in a four-color build, because a tiny shift between inks blurs it.
5. Set K100 text and rules to overprint, so a slight shift never leaves a white gap.
6. Build grays as black tints (K only), never as mixes of C, M and Y. The house Newsprint Gray build is the one exception.
7. No spot colors, no Pantone swatches left in the file, no RGB swatches, no Lab swatches. Keep Pantone 806 C written in the notes only, for a future offset run (Addendum A).
8. Never recolor period art in pink or neon. Period images go to grayscale (K only) with coarse halftone, or keep full color on openers only (hub).

### 4.2 Ink builds for every house color

These are the hub's builds ("Print builds" in Visual identity), which match Design System v3. Design System v3 is the source of truth for builds (hub Decision log, 2026-09-29), so where Addendum A lists an older build, the table below wins.

| House color | Screen hex | CMYK build | Total ink | Where it's used | Notes |
|---|---|---|---|---|---|
| Toner Black (type, lines) | #1A1A1A | K100 | 100% | All text, line art, rules | Overprint |
| Toner Black (big fields) | #1A1A1A | C50 M40 Y40 K100 | 230% | Large black areas only | See 4.3, open question |
| Side Eye Pink | #FF48B0 | C0 M72 Y10 K0 | 82% | The one pink focus per page | Proof it |
| Warm Cream | #F2EBDD | C4 M7 Y14 K0 | 25% | Default page ground | Printed tint on white paper |
| Pale Cyan | #7FD6E8 | C50 M0 Y8 K0 | 58% | RELIEF fills, water, cloth | Proof it |
| Neon Orange | #FF7A1A | C0 M65 Y95 K0 | 160% | Split fountains, fire, war | Proof it |
| Acid Yellow | #F2E81E | C5 M0 Y90 K0 | 95% | Split fountains, money stories | Proof it |
| Tab Red | #E5484D | C0 M85 Y65 K0 | 150% | Filing tab, cover fields | Replaces Addendum A's C6 M83 Y70 K0 |
| Tab Blue | #0078BF | C95 M45 Y0 K0 | 140% | Filing tab, skies | Replaces Addendum A's C88 M50 Y0 K0 |
| Deep Navy | #1C2B5A | C100 M85 Y30 K25 | 240% | HYBRID opener fields, night | At the limit. Never overprint anything dark on it |
| Peach | #F4B393 | C0 M35 Y40 K0 | 75% | Skin on period cut-outs only | |
| Copy Paper | (none) | C3 M4 Y10 K0 | 17% | Paper scraps, panels | From Addendum A and hub |
| Manila | (none) | C7 M14 Y38 K0 | 59% | Folders, tabs | From Addendum A and hub |
| Newsprint Gray | #D9D6CF | C4 M3 Y7 K8 | 22% | QUIET pages, Out Back, tabloid | |
| Kraft | #C9A27A | No approved build | n/a | WOOD TYPE posters, Box Score | Open question; proof any build |
| QUIET dark field | (none) | K85 | 85% | Dark field on QUIET pages | Addendum A |

Screen-only colors (the darker pink #C8167A and darker blue #006AA8 for small text on screens) are not print colors. Don't use them in the magazine.

### 4.3 Rich black: follow the hub until Heather decides

Three sources disagree on the rich black build for big black areas:

| Source | Build | Total ink |
|---|---|---|
| Brand Standards hub (newest) | C50 M40 Y40 K100 | 230% |
| Design System v3 | C60 M50 Y50 K100 | 260% (over the 240% cap) |
| Addendum A | K100 plus C60 | 160% |

The hub's "Conflicts a vendor will hit" table says to follow the hub: **use C50 M40 Y40 K100 for big black fields until Heather decides** (open question, see 12 Decision Log and 13 Open Questions for Heather). Rules that go with it:

- Use rich black only for areas larger than about 1 in square. Use K100 for everything else.
- Never use rich black for text under 18 pt, hairlines or fine line art.
- Rich black is only for big fields behind a reversed logo when the logo is involved (hub, Logo, Print and merch). The logo itself is K100.
- Keep reversed (white or cream) type on rich black at 9 pt or larger and in a sturdy weight. Thin strokes fill in.

### 4.4 Converting images to CMYK

KDP prints from one color setup and does not publish a profile. Use one conversion setup for the whole issue so pages match.

1. Keep the RGB master of every image in the Links archive. Convert a copy.
2. Convert in Photoshop, Affinity Photo or another tool that shows total ink. House starting setup until a proof says otherwise: Edit > Convert to Profile, destination U.S. Web Coated (SWOP) v2, intent Relative Colorimetric, black point compensation on. Then check total ink (step 4).
3. Flat-ink art (RELIEF, WOOD TYPE, split fountains) is not converted by profile. Rebuild its colors to the exact house builds in 4.2, by number, so pink stays C0 M72 Y10 K0.
4. Check total ink after conversion. Shadows in converted photos often go over 240%. Fix with a custom CMYK setting that caps total ink at 240% (Photoshop: Color Settings > CMYK > Custom CMYK, Total Ink Limit 240%, Black Ink Limit 100%), or pull the shadows down by hand.
5. Grayscale images (period art, document scans, NEWSPRINT photos) go to Grayscale mode, which prints as K only. Don't leave grays as RGB or four-color.
6. Save converted images as TIFF or maximum-quality JPEG, flattened, with no alpha channels unless the layout needs a clipping path.
7. Never let the export step convert RGB for you in a CMYK layout tool. Conversion happens on purpose, image by image, before placing, so you can check each one. Convert once, never twice.
8. **HTML build route only:** browsers can't display CMYK images, so finals stay RGB (PNG) in the build, and the whole PDF is converted to CMYK once, at the end (section 7.1). Flat-ink colors must then be checked by number after conversion.

### 4.5 No true fluorescent: every neon build needs a proof

KDP prints CMYK only. There is no fluorescent pink, cyan, orange or yellow. Every neon here is a bright CMYK build, and it will never glow the way the screen does (hub, Design System v3).

- Flag every page that uses a neon build for the proof copy check (section 9).
- Don't adjust a build by eye on a monitor. Change a build only after looking at a printed copy, and log the change in 12 Decision Log.
- Design System v3's production checklist still lists "Order a KDP proof of the full ink set on cream, kraft-tint and newsprint-tint pages." Until that ink-set proof exists, treat every build as unconfirmed.

---

## 5. Images

### 5.1 Resolution

| Use | Minimum effective resolution | Pixel size needed |
|---|---|---|
| Full-bleed page | 300 ppi | 2,588 x 3,375 px (8.625 x 11.25 in) |
| Full-bleed spread across the gutter | 300 ppi | 5,325 x 3,375 px (17.75 x 11.25 in: two bleed pages plus 0.25 in duplicated on each side of the gutter) |
| Full cover wrap | 300 ppi | See the table in 2.3 |
| Front cover only | 300 ppi | 2,588 x 3,375 px |
| Line art, document scans, period engravings | 600 ppi, grayscale where possible | Placed size x 600 |
| Any image, absolute floor | 200 ppi | Never place anything lower, at any size |
| Upper limit | 600 ppi is enough | KDP advises no more than 600 ppi to keep files under 650 MB |

**Effective ppi** is the image's pixels divided by the inches it fills on the printed page. A 3,000 px wide image placed 5 in wide is 600 ppi. The same image placed 12 in wide is 250 ppi and fails. Check effective ppi in:

- InDesign: Links panel, "Effective PPI" column.
- Affinity Publisher: Resource Manager, "DPI" column for placed size.
- Any PDF: Acrobat Pro Preflight, "Images with resolution below 300 ppi" check; or the free command-line tool `pdfimages -list file.pdf`, whose x-ppi and y-ppi columns show effective resolution.

### 5.2 Getting Midjourney art to print size

Midjourney output is usually smaller than a full page at 300 ppi. To get there:

1. Generate with `--hd` for full-page and spread art (Design System v3).
2. Upscale inside Midjourney first, by hand. Don't automate Midjourney.
3. If still short, upscale with a dedicated image upscaler to the pixel size in 5.1, then check the result at 100% zoom for smeared texture or invented detail.
4. Sharpen after scaling, not before (Addendum A).
5. Convert to CMYK last (section 4.4), then place.

### 5.3 Halftone textures that survive print

The house look depends on coarse halftone, speckle and misregistration. Print can destroy all three if they are too fine.

- **Make halftone coarse.** Dots should be easy to see at 100% zoom at final printed size. Fine dots blur into a flat tint on a digital press. Design System v3 says "coarse halftone dots only."
- **Apply halftone at final size.** If an image with a halftone texture has to grow, re-run the halftone at the new size. Don't enlarge a dotted image; scaling smears the dots.
- **Don't stack two halftones.** A halftone image under a halftone overlay makes moiré (wavy interference patterns). KDP lists overlapping halftones as a known print problem. One halftone layer per area.
- **Descreen printed sources.** Period art scanned from a book, newspaper or magazine already has a printed dot. Descreen it in the scanner software or with a light blur before you add the house halftone.
- **The newsprint dot overlay** (12% halftone-dot overlay on the Newsprint Gray tint, Addendum A) is a vector or 600 ppi grayscale pattern. Proof it.
- **Misregistration is drawn, not real.** The slipped color in RELIEF art is part of the picture. Real ink in the file must still line up exactly.

### 5.4 Image file rules

- Every placed image is CMYK or Grayscale. No RGB, no Lab, no indexed color.
- Flatten layers. No live transparency in placed images except clipping paths or alpha the layout app flattens at export.
- Link images; don't paste them in. Every link must be current (no "modified" or "missing" links).
- No readable brand logos or personal information in found material (hub).
- Every image has a cleared rights line and a credit line before it goes to prepress (see 06 Imagery Sourcing, Rights and Credits).

---

## 6. Fonts

- Embed every font in both PDFs. A PDF with a missing or partly embedded font fails at KDP.
- Use licensed fonts only. The paid faces (Druk Condensed, Tiempos Text, GT America Mono) and the Hamilton wood-type faces have no recorded print license (hub, "Gaps to fill"). Until Heather records a license, print with the free stand-ins that carry the SIL Open Font License: Anton (display), Big Shoulders Display (section heads), Source Serif 4 (body), IBM Plex Mono or Space Mono (captions and labels), Courier Prime (cover lines), Alfa Slab One, Rye or Ultra (wood-type plates). See 04 Grid and Typography for the full stack.
- **No fallback fonts.** If a font lacks a character (an arrow, a star, a fraction, a special letter), the layout tool quietly swaps in a system font. Vol. 1 shipped with DejaVu Sans Mono, Liberation Sans and Liberation Serif in its files this way. Before export, list every font in the PDF (Acrobat: File > Properties > Fonts; or `pdffonts file.pdf`). Any font not on the house list is an error. Fix it by choosing a glyph the house font has, or drawing the symbol as art.
- 7 pt minimum for all type, including classifieds, folios, credits and legal lines.
- Convert no live body text to outlines. Outlining is fine for display lettering on art, and the logo files are already outlined.

---

## 7. Layout tools

Any tool is fine if its output passes sections 2 to 6 and the preflight in section 9. What matters is that the tool can hold CMYK swatches by number and export a CMYK PDF.

| Tool | Status | Notes |
|---|---|---|
| Adobe InDesign | Accepted | Exports PDF/X-1a directly. Preflight and Effective PPI built in |
| Affinity Publisher | Accepted | Exports PDF/X-1a directly. Preflight panel built in |
| Scribus | Accepted (free) | CMYK swatches and PDF/X export; check fonts carefully |
| HTML/CSS printed to PDF in a browser (how Vol. 1 was built) | Accepted only with a conversion step | Browsers export RGB PDFs. House CMYK builds can't be set by number, so pink lands wherever the conversion puts it. See 7.1 |

### 7.1 If you build in HTML

Vol. 1 was typeset as an HTML/CSS document by a script and printed to PDF in Chromium (see the Vol. 1 package README). Its output was RGB, PDF 1.4, with no PDF/X marking. If an issue is built this way again:

1. Convert the finished PDF to CMYK PDF/X-1a in Acrobat Pro (Print Production > Preflight > "Convert to PDF/X-1a") or a comparable tool, using the same conversion setup for every issue.
2. After conversion, open Acrobat's Output Preview and check the pink, cyan and navy areas by number. If they don't match the builds in 4.2, the art must be rebuilt in a CMYK tool or adjusted after conversion.
3. Check total ink at 240% (section 9.3).
4. Check fonts for fallbacks (section 6).
5. Check the page size: the Vol. 1 split files measured 8.627 in wide, a hair over 8.625 in. Set the page size exactly.

Whether future issues stay in the HTML pipeline or move to a CMYK layout tool is an open question for Heather (see 13 Open Questions for Heather).

---

## 8. PDF export settings

### 8.1 Interior PDF

| Setting | Value |
|---|---|
| Standard | PDF/X-1a:2001 (CMYK only, fonts embedded, transparency flattened). KDP's guidelines don't name a PDF/X standard; X-1a enforces every KDP requirement at once |
| Compatibility | Acrobat 4 (PDF 1.3), set automatically by X-1a |
| Pages | All pages, single pages in reading order. Never spreads |
| Page size | 8.625 x 11.25 in |
| Bleed | 0.125 in top, bottom and outside; 0 inside |
| Marks | None. No crop, trim, registration, color bars or page information |
| Slug | Off |
| Color conversion | Convert to destination, preserve numbers (so house builds stay exact). Destination: the same CMYK setup used in 4.4 |
| Images, color and grayscale | Bicubic downsample to 450 ppi for images above 600 ppi; JPEG maximum quality, or ZIP |
| Images, monochrome | 1,200 ppi, CCITT Group 4 |
| Fonts | Embedded, subset when less than 100% of characters are used |
| Transparency flattener | High Resolution |
| Security | None. No password, no encryption |
| Extras | No bookmarks, comments, form fields, layers, hyperlinks, hidden objects or placeholder text |
| File size | Under 650 MB (KDP limit). Aim for under 300 MB |

### 8.2 Cover PDF

Same as the interior, with these changes:

| Setting | Value |
|---|---|
| Pages | One page: back, spine and front together |
| Page size | Full cover size for the final page count (section 2.3), bleed included |
| Bleed | Already inside the page size. Don't add more at export |
| File size | KDP recommends 40 MB or less |

KDP's cover guide asks for no extra color profiles and no mixed color spaces. A PDF/X-1a file has one CMYK output intent, which KDP accepts. If KDP's previewer ever rejects the output intent, export again as a CMYK PDF with "Include profiles: Don't include" and the same other settings, and note it in the prepress log.

### 8.3 Keep the text searchable

The final Vol. 1 PDFs have no text layer, so their words can't be searched or reused. Every future issue keeps live text:

- Don't outline or rasterize body text, captions or headlines set in type. PDF/X-1a keeps live text with embedded fonts.
- Don't flatten whole pages to images. The transparency flattener should affect only areas with transparency; check a few pages in Acrobat by selecting text.
- Check before archiving: run `pdftotext file.pdf -` or use Acrobat's text select on 3 random pages. Text should come out readable.
- Also save a plain-text export of the final pages for the archive (InDesign: File > Export > Rich Text or Text Only, story by story; Affinity: copy stories to a text file; HTML route: the manuscript files the build reads, at their final version).

### 8.4 File names

Name files as set out in 09 File Naming, Folders and Handoff Specs. Working files carry a version number (SIDE-EYE-Vol2-Interior-KDP_v03.pdf). Only the exact files uploaded to KDP carry "-final" (SIDE-EYE-Vol2-Interior-KDP-final.pdf, SIDE-EYE-Vol2-Cover-KDP-final.pdf). Never upload a file with "draft," "review," "MedRes" or "LowRes" in its name.

---

## 9. Preflight

Run preflight twice: once in the layout tool before export, and once on the exported PDFs. Then run KDP's Print Previewer after upload. All three must pass.

### 9.1 What to check

The full yes/no list is the Stage 6 Prepress checklist in 08 Quality Checklists. In short:

- Page size, bleed, page count and page order
- Every text frame and essential art inside the 0.375 in safety and the house margins
- Nothing essential within 0.5 in of the gutter; gutter-crossing images duplicated 0.25 in each side
- Every image CMYK or Grayscale, 300 ppi or more (600 for line art), none under 200
- Total ink 240% or less everywhere
- Every swatch a house build, no spot colors, no RGB
- Small text K100 and overprinting
- Fonts embedded, all on the house list, no fallbacks, 7 pt or larger
- Lines 0.75 pt or heavier
- No transparency left live, no layers, no annotations, no marks
- No placeholder boxes (Vol. 1 marked unmade art as striped boxes labeled "V1-###"; none may remain)
- Cover matches the KDP template for the final page count

### 9.2 Tools

| Tool | What it does | How |
|---|---|---|
| InDesign Preflight | Live check while you work | Window > Output > Preflight. Make a "SIDE EYE KDP" profile: flag RGB and Lab, spot colors, images under 300 ppi, missing or modified links, missing fonts, overset text, text under 7 pt, bleed under 0.125 in, objects in the slug |
| Affinity Publisher Preflight | Live check while you work | Window > Preflight. Turn on resolution (300), color space (CMYK), bleed and font checks |
| Acrobat Pro Preflight | Checks the exported PDF | Print Production > Preflight > "Verify compliance with PDF/X-1a." Then run "Images with resolution below 300 ppi" and "List fonts" |
| Acrobat Pro Output Preview | Checks ink by number | Print Production > Output Preview. Tick "Total Area Coverage," set 240%, and look for highlighted areas. Hover over pink, cyan and navy to read their builds |
| Free command-line checks | For agents and non-Adobe builds | `pdfinfo -box file.pdf` (page and trim size), `pdffonts file.pdf` (fonts, embedded yes or no), `pdfimages -list file.pdf` (image color space and effective ppi) |
| KDP Print Previewer | KDP's own check, final word | Opens after upload. Fix every flagged page in the source file, export again and upload again. Never approve with a flag open (Addendum A) |

### 9.3 Total ink check

Total ink is checked on the exported PDF, not in the layout tool. In Acrobat Output Preview, set Total Area Coverage to 240%. Anything highlighted is over. Common causes: converted photo shadows, rich black over navy, black text on a colored field not set to overprint correctly, and stacked transparent color fields. Fix at the source and export again.

---

## 10. KDP upload

KDP accounts, listings, pricing and publishing belong to Heather. A vendor or agent prepares files and steps; Heather (or someone she names) signs in, uploads, approves the previewer and presses Publish. Uploading to the live listing, ordering proofs and publishing all need Heather's yes (hub, "What always needs Heather's yes").

### 10.1 Before you upload

- KDP doesn't accept "magazines or periodicals" as a product type. SIDE EYE is set up as a paperback book in a numbered series (for example "SIDE EYE, Vol. 1: The Losers Issue"). The word "magazine" stays out of the title fields.
- The title, subtitle, series name, volume number and contributor names on the cover and title page must match the KDP book details exactly. A mismatch is a common rejection.
- ISBN: the free KDP ISBN lists the imprint as "Independently published" and works only on KDP. Which ISBN route the series uses is Heather's call.
- KDP offers no pre-orders for paperbacks. A new paperback can be given a scheduled release date up to 90 days ahead, which keeps its page hidden until that date. Plan the launch for the day the book goes live (KDP, Schedule a Release).

### 10.2 Steps

1. Bookshelf > Create > Paperback (or open the issue's existing draft).
2. **Paperback Details:** language, title, subtitle, series and volume number, contributors, description, categories, keywords. Match the files exactly.
3. **Paperback Content:**
   - ISBN as Heather decides.
   - Print options: Premium color ink, white paper, trim 8.5 x 11 in, **Bleed (PDF only)**, cover finish **Matte**. A wrong bleed setting is a common cause of margin errors. Our files have bleed, so choose Bleed.
   - Upload the interior PDF.
   - Cover: "Upload a cover you already have," then upload the cover PDF. Confirm the barcode option matches the cover (KDP adds the barcode in the clear box).
   - Launch the Print Previewer. Page through every page and the cover. Fix every flag in the source file, export, upload again.
   - When the previewer is clean, approve it.
4. **Paperback Rights and Pricing:** Heather sets territories and price.
5. Before publishing, order a proof copy if Heather approves one (section 11). KDP lets you order proofs once the files pass its review, which can take up to about 72 hours.
6. Publish only on Heather's yes.

### 10.3 Common rejection reasons

| Problem | What KDP says or does | Fix |
|---|---|---|
| Page size wrong | Interior isn't 8.625 x 11.25 in, or pages differ | Set the document to 8.625 x 11.25 in, every page |
| Bleed setting mismatch | File has bleed but "No bleed" was chosen, or the reverse; margin errors follow | Choose "Bleed (PDF only)" for SIDE EYE |
| Bleed too short | Background or image doesn't reach 0.125 in past trim | Extend every bleed object to the bleed line |
| Text in the margins | Text or a blank text frame sits past the safety line or in the gutter | Move it inside 0.375 in safety; delete empty frames and stray spaces |
| Low-resolution images | Images under 300 ppi flagged | Replace or upscale (section 5) |
| Fonts not embedded | Upload fails or text substitutes | Embed all fonts; remove fallbacks |
| Transparency or layers | Errors in production | Flatten at export (PDF/X-1a does this) |
| Too many blank pages | More than 4 in a row at start or middle, more than 10 at end | Remove blanks or fill with planned content |
| Placeholder text left in | Template text, "lorem ipsum," "V1-###" art boxes | Remove every placeholder |
| Illegible text | Under 7 pt, overlapping, or blending into the background | Enlarge, move, or raise the contrast |
| Title mismatch | Cover or title page doesn't match book details | Match exactly, including small differences |
| Cover size wrong | Cover not built to the template for the final page count | Rebuild to the KDP template |
| Spine text on a short book | Spine text under 79 pages | Remove it |
| Cover has more than one page | | One page only |
| Crop marks or white edges on the cover | | Export with no marks; extend art to the bleed |
| Locked file | Password or encryption | Export with no security |
| Moiré | Interference patterns in print | Descreen sources; one halftone per area (section 5.3) |

---

## 11. The proof copy

A KDP proof is a real printed copy of the uploaded files, with a "Not for Resale" mark and no ISBN barcode. It is the only way to see the neon builds, the cream tint, show-through and the gutter on paper. Proofs cost a print fee plus shipping. KDP shows the delivery estimate at checkout; plan 10 business days per proof round (01 Issue Design Process).

**When a proof is ordered:** the hub says to order a proof copy for any neon build, and every SIDE EYE issue uses neon builds. Ordering spends money, so only Heather orders it. She may waive the printed proof for an issue in its Issue Brief. Until she sets a default for the series, follow the hub (one proof round per issue) unless the Issue Brief records her waiver (open question; see 01 Issue Design Process, Stage 7, and 13 Open Questions for Heather).

**If the proof is waived:**

- Use only ink builds already seen on a printed SIDE EYE copy. Mark any new build or new paper tint as untested in the prepress log and tell Heather before release.
- Check every page in KDP's Print Previewer at full size.
- Soft-proof in Acrobat Output Preview using the same CMYK setup used for conversion, and compare pages side by side with a printed copy of an earlier issue.
- The proof report records "waived" with the date of Heather's decision, and the Release Note says "released without a printed proof."

### 11.1 What to look at on paper

Use daylight or a daylight-balanced lamp. Look at every page. Note problems by page number with a photo. The full yes/no list is the Stage 7 Proof Copy checklist in 08 Quality Checklists.

- **Pink:** does Side Eye Pink read as loud and warm, not salmon or purple? Is there only one pink focus per page?
- **Cyan, orange, yellow:** do they read as bright, or muddy? Does yellow vanish on the cream tint?
- **Navy and rich black fields:** solid and even, or blotchy? Do they show through to the other side?
- **Cream, Newsprint Gray and Kraft tints:** the right warmth, even across the page, matching from page to page?
- **Type:** is 7 pt mono readable? Is reversed type on dark fields clean, not filled in?
- **Halftone and texture:** do dots read as dots? Any moiré?
- **Gutter:** are faces, headline letters and figures clear of the fold? Do spread images line up across it?
- **Trim:** is anything important trimmed off? Do folios and tab labels sit safely inside?
- **Cover:** spine centered on the spine, no spine color wrapping onto the front or back, cover lines safe, barcode clear, matte finish even.
- **Binding:** pages in order, none missing or doubled, first and last spreads usable even though they don't open flat.

### 11.2 After the proof

1. Log every problem with page number, photo and fix.
2. Fix in the source files, export, preflight again, upload again.
3. A changed ink build, a new paper tint or a cover change means a new proof, if Heather approves one.
4. Record any build change in 12 Decision Log with the date and the proof that justified it.

---

## 12. What Vol. 1 taught us

The Vol. 1 files and package (folders "Issue 1 to print" and "Packaged In Progress") show how the first issue went to print. These are the lessons. None of this is a judgment on anyone; it's what the next issue must do differently.

| What happened | Why it matters | Rule now |
|---|---|---|
| Layout was HTML/CSS printed to PDF in Chromium. Final cover and interior PDFs are RGB (PDF 1.4, no PDF/X) | KDP converted the color itself. House builds like C0 M72 Y10 K0 were never in the file | Deliver CMYK PDF/X-1a with house builds by number (sections 4, 7, 8) |
| System fallback fonts (DejaVu Sans Mono, Liberation Sans, Liberation Serif) were embedded alongside the house fonts | Characters printed in a font nobody chose | Check fonts in every export; no fallbacks (section 6) |
| Split interior files measured 8.627 in wide, not 8.625 in | Small size errors can trip KDP's checks | Set page size exactly; check with `pdfinfo` or Acrobat |
| Placed images ran around 880 ppi | Heavy files (the final interior was about 95 MB) for no print gain | Downsample anything over 600 ppi at export (section 8.1) |
| The Oct 1 build was 96 pages; the final first printing was 111 pages, and its cover was built for 111 | Page count grew late, so the spine and cover had to be redone (there are two cover files, Oct 23 and a "final" Oct 24) | Lock the page count before the cover; build the cover last from KDP's template |
| The final interior page count was odd (111) | Addendum A requires an even count | Deliver an even count (section 2.2) |
| The spine carried a full title line on black at about 0.26 in wide | Addendum A had called for a pink field with volume number only, or no text | Follow 02 Cover Standards, which keeps the Vol. 1 spine until Heather decides (section 2.3) |
| The interior was split into five PDFs "for upload" | KDP takes one interior PDF up to 650 MB | Upload one interior PDF; split files only for sharing |
| Unmade art was held by striped boxes labeled "V1-###" | A placeholder that slips through prints | Preflight for placeholders (section 9.1) |
| The final PDFs have no text layer | The text can't be searched or reused for corrections, the web or video | Keep live text in the export and archive a text copy (sections 8.3 and 14) |

---

## 13. Pages KDP can't print, and what replaces them

KDP print on demand can't do gatefolds, pull-out inserts, perforations, die cuts, stickers, deckle edges, spot inks or separate paper stocks. Planning for The Mating Issue hit this with a timeline gatefold, pull-out extras and perforated Valentines. Replace them with printed equivalents (Addendum A, section 5):

| Wanted | Print instead |
|---|---|
| Newsprint tabloid insert | A section printed on the Newsprint Gray tint with a 12% halftone-dot overlay, narrower margins and a mono-heavy type mix |
| Gatefold timeline | A two-page spread with the timeline across both pages, nothing critical within 0.5 in of the gutter |
| Spot pink | The pink build at full strength, in large fields |
| Deckle edges, die cuts, stickers | Printed trompe l'oeil: drawn perforation lines, drawn tape, drawn stamp edges |
| Perforated cut-out (like the Sacko certificate or Valentines) | A printed tear line: 1 pt dashed rule with 0.08 in dashes, a small scissors glyph at the upper left, the whole piece 0.5 in inside the trim on every side, on a right-hand page with a sacrificial page behind it |
| Pull-out extras | Printed pages in the book. Whether to add downloadable printables by QR code is Heather's call per issue |

---

## 14. Packaging the issue for the archive

When an issue is released, package it so anyone can rebuild or reprint it without asking. The package lives in the issue's "08 Package" folder, and every name follows 09 File Naming, Folders and Handoff Specs. The package holds:

| Part | Contents |
|---|---|
| README | A plain-text file: issue, version, date, page count, build route and tool version, how to rebuild on a clean machine, ink builds used, conversion setup used, any build changed after the proof, known issues |
| Layout | The live layout file (InDesign, Affinity or Scribus document, plus an IDML copy from InDesign), or for the HTML route the HTML, CSS, scripts and manuscript files the build reads |
| Links | Every placed image exactly as placed (the finals from 04 Art/09 Finals) |
| Masters | The RGB masters and upscales behind each final, for future re-conversion (or a pointer to 04 Art) |
| Fonts | Free-license fonts only, with their license files. Paid fonts are never copied; the README lists them and their stand-ins |
| Output | The "-final" interior and cover PDFs exactly as uploaded, a review PDF, and a text-searchable PDF or text export of the final pages |
| Prepress | The KDP cover template used, the preflight report, Output Preview screenshots of any flagged area, KDP Previewer notes (or a pointer to 07 KDP and Print) |
| Proof | The proof report and proof photos, or the "waived" record |
| Logs | The art-direction docs, the Prompt Log with approved Midjourney job links, and the Rights Log (see 05 and 06) |

Rules:

- Package from the final files after the last fix, never from an earlier build.
- Open the package on a second machine or in a clean folder and confirm it rebuilds with no missing links or fonts.
- Keep superseded builds in an "_Archive" subfolder, never mixed with final files.
- Don't put Midjourney prompt workbooks with account details, passwords or private notes in the package.

---

## 15. Final delivery spec

Hand this table to any vendor. A delivery passes only when every line is true.

| Item | Spec |
|---|---|
| Files | One interior PDF, one cover PDF |
| Standard | PDF/X-1a:2001 (or CMYK PDF with no profile if KDP rejects the output intent) |
| Interior page size | 8.625 x 11.25 in, every page, single pages in reading order |
| Interior page count | Even, matching the cover template; within KDP's 24 to 590 pages |
| Cover size | 0.125 + 8.5 + (page count x 0.002347) + 8.5 + 0.125 in wide, by 11.25 in high, from KDP's template |
| Bleed | 0.125 in top, bottom, outside; images and fields extend fully into it |
| Safety | Text and essential art 0.375 in inside trim (interior), 0.25 in (cover); 0.5 in clear of the gutter for faces, headline letters and figures |
| Spine | 0.0625 in clear of each fold for any spine text; spine design per 02 Cover Standards |
| Color | CMYK and Grayscale only; house builds by number; no spot, RGB or Lab |
| Total ink | 240% or less everywhere |
| Rich black | C50 M40 Y40 K100 for large fields only, until Heather decides |
| Small text | K100, overprinting, 7 pt or larger |
| Lines | 0.75 pt or heavier |
| Images | 300 ppi effective (600 for line art), none under 200, none over 600 after export |
| Fonts | All embedded, all on the house list, all licensed, no fallbacks |
| Transparency and layers | Flattened |
| Marks and extras | None: no crop marks, bleed marks, color bars, slug, comments, bookmarks, form fields, security |
| Placeholders | None |
| File size | Interior under 650 MB; cover 40 MB or less recommended |
| Checks | Layout preflight clean, Acrobat PDF/X-1a check clean, Output Preview total ink clean, KDP Print Previewer clean |
| Sign-off | Stage 6 and Stage 7 checklists in 08 Quality Checklists completed; Heather's yes before any order or publish |
| Package | Archive package per section 14, in the issue's 08 Package folder |

---

## Sources this is built on

- SIDE EYE Brand Standards hub (Visual identity: Color and Print builds; The magazine: Print spec; For vendors, editors and AI agents; Decision log)
- SIDE EYE Design System v3: Neon Zine Print
- SIDE EYE Design System v2 Addendum A: KDP Production Spec, 8.5 x 11
- SIDE EYE Design System v2 Core
- SIDE EYE art-direction skill (side-eye-art-direction)
- README: SIDE EYE Vol. 1 Package (Packaged In Progress folder)
- The Vol. 1 print files in the "Issue 1 to print" folder (interior and cover PDFs)
- 00 Issue Hub: SE-V02 The Mating Issue (pages KDP can't print) (titled before the November 24, 2026 renumbering; The Mating Issue is now Vol. 3)
- 01 Issue Design Process: From Brief to Print-Ready Files, 02 Cover Standards and 09 File Naming, Folders and Handoff Specs (this set, for stage names, spine and package)
- Amazon KDP help pages: Set Trim Size, Bleed, and Margins; Create a Paperback Cover; Paperback Submission Guidelines; Fix Paperback and Hardcover Formatting Issues; Proof and Author Copies; Schedule a Release
