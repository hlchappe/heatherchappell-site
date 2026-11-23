# Online Issue 1: article extraction

Source of truth: the print PDF `/mnt/user-data/uploads/Side Eye_Issue 1/SIDE-EYE-Vol1-MedRes-Review.pdf` (111 pages; page images already rendered at /home/claude/site/issue1/pNNN.jpg, where NNN = PDF page number). Use `pdftotext -f N -l N -layout` per page, and LOOK at the page image (Read tool) whenever columns, sidebars, captions or pull quotes make reading order unclear. Cross-check against the final feature Google Docs on Drive (search Drive titles starting with "Final " and "SIDE EYE Vol. 1") when they exist, but the PRINT text wins if they differ.

Table of contents (page numbers printed in the issue; confirm against PDF page numbers):
UP FRONT: Can't Even Win The Sacko 04 · Letters to the AI Dead 05 · Ranked: Defeated Generals 07 · The Apocrypha Index 08 · Field Guide: How to Lose Like a Victorian 10 · The Dodo Was Framed! 12 · The Final Rose 14
THE FILES: Two Libraries 24 · Hannibal: Survived the Alps, Not the Audit 25 · The Civil War Ended in 1865. The Fight Over the Textbooks Didn't. 34 · Hatshepsut Didn't Pretend to Be a Man 44 · The Queen of Hawaii vs. the United States 49 · Stephen Won the Crown. Matilda Won the Next 800 Years. 59 · The Loser's Library 60 · Not a Loser. Not Short. Not Alone. 64 · Dress the Hire (cut-out) 71 · The Emus Didn't Win. The Newspapers Did. 72 · The Emu Box Score 79 · The Outsider Had the White House on Speed Dial 80 · How to Be a Secret Government Plant (Any Decade) 87 · Two Generals, One Printing Press 97 · The Losers League: Draft Your Losers 98
OUT BACK: History's Losers, Still Banging 100 · Report Card: The Spanish Armada 103 · A Quiz That Doesn't Like You 106 · Find the Outsider (word search) 108 · Crack the Losers' Code 109 · The Better Tape Lost 110

Write one JSON per piece to /home/claude/site/issue1_articles/<slug>.json (slug: short kebab-case, e.g. "emu-war", "hannibal-audit", "napoleon", "perot", "lost-cause-textbooks", "hatshepsut", "queen-of-hawaii", "stephen-matilda"):
{
 "slug": "...", "order": <print page number>, "section": "Up Front|The Files|Out Back",
 "kicker": "<small label above the headline, e.g. 'THE FILES · LOST THE CREDIT'>",
 "label": "Lost the fight|Lost the credit|Lost the story|null (the colored tab in the page corner, if any)",
 "title": "<headline exactly as printed>", "dek": "<subhead exactly as printed, or null>",
 "byline": "<as printed, e.g. 'Heather Chappell & Edwin Galloway', or null>",
 "pages": [first_pdf_page, last_pdf_page],
 "hero": "issue1/pNNN.jpg (the opening page image)",
 "summary": "<ONE sentence, plain and factual, written by you, for search/social description; ≤ 155 chars; no jokes>",
 "topics": ["Emu War", "Australia", "Keith Murdoch", ...],   // 3–6 entities/keywords actually in the piece
 "blocks": [ {"t":"p","text":"..."}, {"t":"h2","text":"..."}, {"t":"quote","text":"...","cite":"..."},
             {"t":"sidebar","title":"...","blocks":[...]}, {"t":"list","items":["..."]}, {"t":"caption","text":"..."},
             {"t":"table","rows":[["..",".."],...]} ],
 "sources": ["<each source/citation listed for the piece, if printed>"]
}
Rules: text VERBATIM from print (fix only extraction artifacts: hyphenation across lines, broken paragraphs, ligatures, running headers/footers/page numbers removed). Keep sidebars and pull quotes but don't duplicate a pull quote that repeats body text (mark it "quote" once at its place, or drop if purely repeated — prefer dropping duplicates). Interactive/visual pieces (cut-outs, word search, code, box scores, quizzes) still get a page: include their text content (questions, answers if printed, clues) and set "visual": true so the page also shows the page images. Never reproduce song lyrics; if a piece quotes copyrighted lyrics, replace that line with {"t":"p","text":"[lyric omitted]"} and note it. Validate each file with python json.load.
Final reply: table of slug → title → word count, plus any pieces you couldn't extract cleanly.
