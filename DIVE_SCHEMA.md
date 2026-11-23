# Deep Dive → JSON conversion

Read the briefing PDF from Google Drive with the Drive read_file_content tool (fileId given in your task). If Drive tools are not available to you, stop immediately and say so.

Write /home/claude/site/dives/<slug>.json (UTF-8, valid JSON — check with `python3 -c "import json;json.load(open(PATH))"`).

The text is Heather's own writing. Reproduce it VERBATIM. Only fix PDF extraction artifacts:
- rejoin words/sentences split by page breaks or stray line breaks ("Sarbanes- Oxley" → "Sarbanes-Oxley", "records- integrity" → "records-integrity", a paragraph cut by a page break gets rejoined)
- remove markdown escapes ("S\\&P" → "S&P", "1\\." → drop the numbering, it's rendered by the page)
- fix run-together list items into separate array items (e.g. "What to watch" lines, career-highlight years, current involvements, sources)
Do not summarize, reorder, add or drop sentences.

Schema:
{
 "slug": "<given>",
 "date": "YYYY-MM-DD",
 "title": "<headline exactly as in the PDF header>",
 "words": <number from header>,
 "from": "<the FROM: line text, without 'FROM: ' and without ' — ORIGINAL STORY'>",
 "bottomLine": "<paragraph>",
 "summary": [ { "title": "<numbered item title, no number>", "points": ["<each sentence/claim of the summary paragraph as written, split at sentence ends>"], "plain": "<the 'In plain terms:' text without that prefix>" } ],
 "context": [ { "label": "Right now", "text": "..." }, ... ],      // Context at a glance blocks in order
 "sections": [ { "title": "<section title, no number>", "paragraphs": ["..."], "why": "<the closing 'Why it matters:' sentence without the prefix, if present; remove it from paragraphs>" } ],
 "watch": ["<each What to watch item>"],
 "people": [ { "name": "...", "role": "<CAPS role line, in normal case is fine as written>", "lede": "<first paragraph under the name>",
               "blocks": [ { "heading": "Who they are", "text": "..." }, { "heading": "Personality and style", "text": "..." },
                           { "heading": "Career highlights", "items": ["..."] }, { "heading": "Current involvements", "items": ["..."] },
                           { "heading": "Big wins", "items": ["..."] }, { "heading": "Controversies", "items": ["..."] }, { "heading": "Who they align with", "items": ["..."] } ] } ],
 "followups": [ { "q": "...", "paragraphs": ["..."], "subheads": "<optional: keep any subheads like 'Where the analogy strains' as their own paragraph prefixed with '## '>" } ],
 "sources": ["<each title in 'Sources the team read', in order>"],
 "links": ["<each distinct URL from the trailing URL list, in order, deduplicated>"]
}
Omit keys whose section doesn't exist in that briefing (e.g. no people, no followups).
Final reply: one line per file with slug + word count of the JSON's text.
