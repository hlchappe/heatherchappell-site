"""Static, crawlable pages for heatherchappell.com.

prerender(index_html, site_dir, cfg, copy, dives) -> list[str]

Takes the built index.html and writes one copy per view as <site>/<path>/index.html, with the
view already rendered into the DOM and the body class set, so it shows with JavaScript off:

  /deep-dives/                     archive (all briefings)            page_type dives_index
  /deep-dives/topic/<topic-slug>/  one topic's briefings              page_type topic
  /deep-dives/<slug>/              full briefing text                 page_type dive
  /story/                          the short story, expanded          page_type story
  /episodes/                       every SIDE EYE episode             page_type episodes
  /side-eye/                       magazine + show sections           page_type side_eye
  /side-eye/vol-1/                 online table of contents           page_type issue_index
  /side-eye/vol-1/<slug>/          one magazine piece                 page_type issue_article
  /work/                           work + about sections              page_type work

It also rewrites index.html itself (canonical, per-page meta, JSON-LD, and the JS-rendered home
sections pre-filled so the homepage's links are in the HTML).

Every page gets a unique <title>, meta description, canonical + og:url (absolute https URL),
og tags, exactly one <h1>, and <base href="/"> so relative assets resolve from subfolders.
<html data-route="..."> tells the page script to keep the server-rendered view
(see route() in template.html).

Optional hooks (used when the modules exist):
  seo.meta.page_meta(page_type, ctx) -> dict(title, description[, og_title, og_description, og_image])
  seo.jsonld.jsonld(page_type, ctx)  -> str, inserted before </head>

The HTML fragments below mirror the JS renderers in template.html (renderDive, renderIndex,
renderEpisodes and the home-section renderers). If you change the markup there, change it here.

Module attribute LAST_IMAGES ({path: [image paths]}) holds page images for the sitemap after a run.
"""
import datetime
import html as _html
import importlib
import importlib.util
import json
import pathlib
import re
import sys

BASE = "https://heatherchappell.com"
ISSUE_DIR = "issue1_articles"
SECTIONS = ["Up Front", "The Files", "Out Back"]
EXT = 'target="_blank" rel="noopener"'
CUR = ' aria-current="page"'
PLAY = ('<span class="pl" aria-hidden="true"><svg width="20" height="22" viewBox="0 0 20 22">'
        '<path d="M0 0L20 11L0 22Z" fill="#fff"/></svg></span>')
LAST_IMAGES = {}


# ------------------------------------------------------------------ small helpers (match the JS)
def esc(s):
    s = "" if s is None else str(s)
    return (s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
             .replace('"', "&quot;").replace("'", "&#39;"))


def slugify(s):
    return re.sub(r"[^a-z0-9]+", "-", str(s or "").lower()).strip("-")


def _date(d):
    try:
        return datetime.date.fromisoformat(str(d)[:10])
    except ValueError:
        return None


def fmt(d):
    x = _date(d)
    return f"{x:%b} {x.day}, {x.year}" if x else ""


def mins(w):
    return f"{max(1, int((w or 0) / 230 + 0.5))} min read"


def week_label(d, year=True):
    x = _date(d)
    if not x:
        return ""
    wk = x - datetime.timedelta(days=(x.weekday() + 1) % 7)  # JS getDay(): Sunday = 0
    return f"Week of {wk:%b} {wk.day}" + (f", {wk.year}" if year else "")


def k_words(dd):
    return int(sum(d.get("words") or 0 for d in dd) / 1000 + 0.5)


def ep_date(e):
    return fmt(e["date"]) if e.get("date") else ""


def thumb(e):
    return e.get("thumb") or f"https://i.ytimg.com/vi/{e['id']}/maxresdefault.jpg"


def wurl(e):
    return f"https://www.youtube.com/watch?v={e['id']}"


def _img_size(site_dir, rel):
    try:
        from PIL import Image
        with Image.open(pathlib.Path(site_dir) / rel) as im:
            return im.size
    except Exception:
        return None


def _wh(site_dir, rel):
    s = _img_size(site_dir, rel)
    return f' width="{s[0]}" height="{s[1]}"' if s else ""


# ------------------------------------------------------------------ HTML surgery
def fill(doc, el_id, inner):
    """Put `inner` into the (empty) element with id=el_id."""
    pat = re.compile(r'(<(\w+)\b[^>]*\bid="' + re.escape(el_id) + r'"[^>]*>)\s*(</\2>)')
    new, n = pat.subn(lambda m: m.group(1) + inner + m.group(3), doc, count=1)
    if not n:
        print(f"prerender: #{el_id} not found or not empty", file=sys.stderr)
    return new


def set_attr(doc, el_id, attr, value):
    pat = re.compile(r'(<\w+\b[^>]*\bid="' + re.escape(el_id) + r'"[^>]*>)')
    def f(m):
        tag = m.group(1)
        if re.search(r'\s' + attr + r'="[^"]*"', tag):
            return re.sub(r'(\s' + attr + r'=)"[^"]*"', lambda x: x.group(1) + '"' + esc(value) + '"', tag, count=1)
        return tag[:-1] + f' {attr}="{esc(value)}">'
    return pat.sub(f, doc, count=1)


def keep(doc, el_id):
    return re.sub(r'(<\w+\b[^>]*\bid="' + re.escape(el_id) + r'")', r'\1 data-keep', doc, count=1)


def retag(doc, el_id, new_tag, add_class=None):
    """Change the tag name of the element with id=el_id (used to move the page's single <h1>)."""
    pat = re.compile(r'<(\w+)(\b[^>]*\bid="' + re.escape(el_id) + r'"[^>]*)>(.*?)</\1>', re.S)
    def f(m):
        attrs = m.group(2)
        if add_class:
            if re.search(r'\sclass="', attrs):
                attrs = re.sub(r'(\sclass=")', r'\1' + add_class + ' ', attrs, count=1)
            else:
                attrs += f' class="{add_class}"'
        return f"<{new_tag}{attrs}>{m.group(3)}</{new_tag}>"
    return pat.sub(f, doc, count=1)


def demote_hero_h1(doc):
    """The homepage hero headline is the home page's h1; on every other page it is hidden, and demoted."""
    m = re.search(r'<header class="hero"[^>]*>', doc)
    if not m:
        return doc
    i = m.end()
    j = doc.find("<h1", i)
    if j < 0:
        return doc
    k = doc.find("</h1>", j)
    return doc[:j] + "<p" + doc[j + 3:k] + "</p>" + doc[k + 5:]


def set_meta_tag(doc, key, value, attr="property"):
    pat = re.compile(r'<meta\s+(?:name|property)="' + re.escape(key) + r'"\s+content="[^"]*"\s*/?>')
    tag = f'<meta {attr}="{key}" content="{esc(value)}">'
    if pat.search(doc):
        return pat.sub(lambda m: tag, doc, count=1)
    return doc.replace("</head>", tag + "\n</head>", 1)


def set_head(doc, *, title, description, url, og_title=None, og_description=None, og_image=None,
             og_image_alt=None, og_type=None, base=True, extra=""):
    doc = re.sub(r"<title>.*?</title>", lambda m: f"<title>{esc(title)}</title>", doc, count=1, flags=re.S)
    doc = set_meta_tag(doc, "description", description, "name")
    doc = set_meta_tag(doc, "og:title", og_title or title)
    doc = set_meta_tag(doc, "og:description", og_description or description)
    doc = set_meta_tag(doc, "og:url", url)
    if og_image:
        doc = set_meta_tag(doc, "og:image", og_image)
        if og_image_alt:
            doc = set_meta_tag(doc, "og:image:alt", og_image_alt)
    if og_type:
        doc = set_meta_tag(doc, "og:type", og_type)
    for k in ("twitter:title", "twitter:description", "twitter:image"):
        if re.search(r'<meta\s+(?:name|property)="' + k + '"', doc):
            v = {"twitter:title": og_title or title, "twitter:description": og_description or description,
                 "twitter:image": og_image}[k]
            if v:
                doc = set_meta_tag(doc, k, v, "name")
    doc = re.sub(r'<link\s+rel="canonical"[^>]*>\s*', "", doc)
    doc = doc.replace("</head>", f'<link rel="canonical" href="{esc(url)}">\n{extra}</head>', 1)
    doc = re.sub(r'<base\s[^>]*>\s*', "", doc)
    if base:
        doc = re.sub(r'(<meta charset="[^"]*">)', r'\1\n<base href="/">', doc, count=1)
    return doc


def set_route(doc, route, body_class, online, ep_pages=None):
    def h(m):
        tag = re.sub(r'\sdata-(route|issue-online|ep-pages)="[^"]*"', "", m.group(0))[:-1]
        if ep_pages:
            tag += f' data-ep-pages="{esc(json.dumps(ep_pages, separators=(",", ":")))}"'
        if route:
            tag += f' data-route="{esc(route)}"'
        if online:
            tag += f' data-issue-online="{esc(online)}"'
        return tag + ">"
    doc = re.sub(r"<html\b[^>]*>", h, doc, count=1)
    if body_class:
        doc = re.sub(r"<body\b[^>]*>", f'<body class="{body_class}">', doc, count=1)
    return doc


def back_bar(href, label="← Back to the site"):
    return f'<div class="pg-back" data-keep><div class="wrap"><a href="{esc(href)}">{esc(label)}</a></div></div>'


# ------------------------------------------------------------------ fragments: home sections
def frag_issue(cfg, copy, online):
    iss = cfg.get("issues") or []
    cur = next((i for i in iss if i.get("status") == "out"), iss[0] if iss else None)
    if not cur:
        return ""
    se = copy.get("sideeye", {})
    cover = (f'<img src="{esc(cur["cover"])}" alt="SIDE EYE Vol. {esc(cur.get("vol"))} cover" onerror="this.remove()">'
             if cur.get("cover") else "")
    reader_attr = ' role="button" tabindex="0" aria-label="Open the issue reader" id="coverbtn"' if cur.get("reader") else ""
    acts = []
    if online:
        acts.append(f'<a class="btn pink" href="{esc(online)}">Read the issue online →</a>')
    if cur.get("reader"):
        acts.append(f'<button class="btn {"paper" if online else "pink"}" type="button" id="readbtn">'
                    f'{"Page through the print edition" if online else "Read the issue here →"}</button>')
    if cur.get("amazon"):
        acts.append(f'<a class="btn" href="{esc(cur["amazon"])}" {EXT}>{esc(se.get("amazon_cta"))} →</a>')
    if cur.get("sources"):
        acts.append(f'<a class="btn paper" href="{esc(cur["sources"])}" {EXT}>{esc(se.get("sources_cta"))}</a>')
    pdf = f' <a href="{esc(cur["pdf"])}" {EXT}>Prefer the PDF? Download it.</a>' if cur.get("pdf") else ""
    return f'''
 <div class="cover{' real' if cur.get('cover') else ''}"{reader_attr}>
  <svg class="eyeart" viewBox="0 0 200 120" aria-hidden="true"><path d="M5 60Q100-20 195 60Q100 140 5 60Z" fill="#F3ECDF"/><circle cx="150" cy="60" r="30" fill="#FF2E88"/><circle cx="156" cy="60" r="12" fill="#141414"/><path d="M5 60Q100-20 195 60" fill="none" stroke="#141414" stroke-width="10"/></svg>
  <div class="logo">SIDE<br>EYE</div><div class="tag">History, allegedly · Vol. {esc(cur.get('vol'))}</div>
  <div class="big">{esc(cur.get('title'))}</div>
  <div class="lines">{' · '.join(esc(x) for x in cur.get('coverlines') or [])}</div>{cover}
 </div>
 <div>
  <span class="kick" style="color:var(--pinkd)">Vol. {esc(cur.get('vol'))} · Out now</span>
  <h3>{esc(cur.get('title'))}</h3>
  <p>{esc(se.get('issue_blurb'))}</p>
  <div class="acts">
   {chr(10).join(acts)}
  </div>
  <p class="small"><a href="#contact" data-topic="SIDE EYE (tips, guests, press)">Got a tip or want to be on the show? Tell us.</a> {esc(se.get('sources_note'))}{pdf}</p>
 </div>'''


def episodes(cfg):
    return list(reversed((cfg.get("youtube") or {}).get("episodes") or []))


def frag_watch(cfg, epp=None):
    eps = episodes(cfg)
    epp = epp or {}
    href = lambda e: epp.get(e["id"]) or wurl(e)
    attrs = lambda e: "" if e["id"] in epp else f'{EXT} data-id="{esc(e["id"])}"'
    out = {}
    if eps:
        f = eps[0]
        out["wfeat"] = (f'<a class="wbig" href="{esc(wurl(f))}" {EXT} data-id="{esc(f["id"])}"><img src="{esc(thumb(f))}" alt="{esc(f["title"])}" '
                        f'onerror="this.src=\'https://i.ytimg.com/vi/{esc(f["id"])}/hqdefault.jpg\'">{PLAY}</a>'
                        f'<div class="wtx"><span class="kick" style="color:var(--yel)">Newest episode · {esc(f.get("ep", ""))}'
                        f'{" · " + esc(ep_date(f)) if f.get("date") else ""}</span>'
                        + (f'<h3><a href="{esc(epp[f["id"]])}" style="color:inherit;text-decoration:none">{esc(f["title"])}</a></h3>'
                           f'<a class="btn pink" href="{esc(epp[f["id"]])}" style="margin:0 10px 10px 0">Episode page →</a>' if f["id"] in epp else f'<h3>{esc(f["title"])}</h3>')
                        + f'<a class="btn" href="{esc(wurl(f))}" {EXT} data-id="{esc(f["id"])}">Watch it →</a></div>')
    out["eps"] = "".join(
        f'<a class="ep" href="{esc(href(e))}" {attrs(e)}><span class="th"><img src="{esc(thumb(e))}" alt="" loading="lazy" '
        f'onerror="this.src=\'https://i.ytimg.com/vi/{esc(e["id"])}/hqdefault.jpg\'">{PLAY}'
        f'{"<i>" + esc(e["runtime"]) + "</i>" if e.get("runtime") else ""}</span>'
        f'<span class="tx"><span>{esc(e.get("ep", ""))}{" · " + esc(ep_date(e)) if e.get("date") else ""}</span><b>{esc(e["title"])}</b></span></a>'
        for e in eps)
    out["eplinks"] = "".join(
        f'<li><a href="{esc(href(e))}" {attrs(e)}><span>{esc(e.get("ep", ""))}'
        f'{" · " + esc(ep_date(e)) if e.get("date") else ""}</span>{esc(e["title"])}</a></li>' for e in eps[1:3])
    return out


def dive_href(d, dv):
    return f"/deep-dives/{d['slug']}/" if d.get("slug") and d["slug"] in dv else d.get("url", "")


def dive_ext(d, dv):
    return "" if d.get("slug") and d["slug"] in dv else EXT


def dd_item(d, dv, cls=""):
    c = f' class="{cls}"' if cls is not None else ""
    return (f'<li{c}><a href="{esc(dive_href(d, dv))}" {dive_ext(d, dv)}><span class="d">{esc(fmt(d.get("date")))}</span>'
            f'<span><b>{esc(d.get("title"))}</b><i>{esc(d.get("bottomLine") or "")}</i></span>'
            f'<span class="t">{esc(d.get("topic") or "")} · {esc(mins(d.get("words")))}</span></a></li>')


def frag_reading(cfg, copy, dv):
    DD = cfg.get("deepDives") or []
    if not DD:
        return {}
    rd = copy.get("reading", {})
    f = DD[0]
    feat = (f'<div class="main"><div class="dl"><b>{esc(rd.get("featured_label"))}</b><span>{esc(fmt(f.get("date")))}</span>'
            f'<span>{esc(f.get("topic"))}</span><span>{esc(mins(f.get("words")))}</span></div>'
            f'<h3>{esc(f.get("title"))}</h3><p class="bl"><strong>Bottom line</strong>{esc(f.get("bottomLine"))}</p>'
            f'<a class="btn pink" href="{esc(dive_href(f, dv))}" {dive_ext(f, dv)} aria-label="{esc(rd.get("read_cta"))}: {esc(f.get("title"))}">{esc(rd.get("read_cta"))} →</a></div>'
            f'<div class="side"><div><div class="n">{len(DD)}</div><span>deep dives in the archive</span></div>'
            f'<div><div class="n" style="font-size:clamp(36px,4vw,52px)">{k_words(DD)}K</div><span>words of homework, and counting</span></div></div>')
    items, last = [], ""
    for n, d in enumerate(DD[1:5], 1):
        lab = week_label(d.get("date"), year=False)
        if lab != last:
            items.append(f'<li class="wk">{esc(lab)}</li>')
        last = lab
        items.append(dd_item(d, dv, "x" if n > 2 else ""))
    return {"feat": feat, "ddlist": '<ul class="dd">' + "".join(items) + "</ul>"}


def frag_work(cfg, copy):
    W = cfg.get("work") or {}
    stats = "".join(f'<div class="stat"><b class="{"long" if len(s["num"]) > 6 else ""}">{esc(s["num"])}</b><span>{esc(s["label"])}</span></div>'
                    for s in (copy.get("work") or {}).get("stats") or [])
    roles = "".join(f'<li><span class="yr">{esc(r.get("years"))}</span><div><b>{esc(r.get("org"))}</b><em>{esc(r.get("title"))}</em><p>{esc(r.get("note"))}</p></div></li>'
                    for r in W.get("roles") or [])
    chips = "".join(f"<span>{esc(s)}</span>" for s in W.get("skills") or [])
    return {"stats": stats, "roles": roles, "chips": chips}


def frag_about(cfg):
    A = cfg.get("about") or {}
    out = {"links": "".join(f'<a href="{esc(l["url"])}" {EXT}>{esc(l["label"])}</a>' for l in A.get("links") or [])}
    if A.get("headshot"):
        out["face"] = (f'<img src="{esc(A["headshot"])}" alt="Headshot of Heather Chappell, writer, SIDE EYE co-host and B2B growth marketer" '
                       'onerror="this.replaceWith(Object.assign(document.createElement(\'span\'),{className:\'ini\',textContent:\'HC\'}))">')
    return out


def fill_face(doc, inner):
    return re.sub(r'(<div class="face" id="face">).*?(</div>)', lambda m: m.group(1) + inner + m.group(2), doc, count=1, flags=re.S)


def fill_home_sections(doc, cfg, copy, dv, online, epp=None):
    """Pre-fill the JS-rendered home sections (the page script re-renders them with the same markup)."""
    doc = fill(doc, "cabs", frag_cabs())
    doc = fill(doc, "issue", frag_issue(cfg, copy, online))
    for k, v in frag_watch(cfg, epp).items():
        doc = fill(doc, k, v)
    yt = cfg.get("youtube") or {}
    doc = set_attr(doc, "subbtn", "href", (yt.get("channelUrl") or "https://www.youtube.com/@SideEyeMag") + "?sub_confirmation=1")
    for k, v in frag_reading(cfg, copy, dv).items():
        doc = fill(doc, k, v)
    for k, v in frag_work(cfg, copy).items():
        doc = fill(doc, k, v)
    W = cfg.get("work") or {}
    if W.get("resumePdf"):
        doc = set_attr(doc, "cvbtn", "href", W["resumePdf"])
    ab = frag_about(cfg)
    doc = fill(doc, "links", ab["links"])
    if ab.get("face"):
        doc = fill_face(doc, ab["face"])
    return doc


# ------------------------------------------------------------------ fragments: #divepage views
def pg(s):
    out = []
    for x in [y for y in re.split(r"\n+", s or "") if y]:
        if x.startswith("## "):
            out.append(f'<h4 style="font:700 13px/1.3 var(--mono);text-transform:uppercase;margin:20px 0 8px">{esc(x[3:])}</h4>')
        else:
            out.append(f"<p>{esc(x)}</p>")
    return "".join(out)


def render_dive(slug, d, DD, path):
    meta = next((x for x in DD if x.get("slug") == slug), {})
    i = next((k for k, x in enumerate(DD) if x.get("slug") == slug), -1)
    prev = DD[i - 1] if i > 0 else None
    nxt = DD[i + 1] if 0 <= i < len(DD) - 1 else None
    toc, h = [], ""
    h += f'<p class="dv-bl"><strong>Bottom line</strong>{esc(d.get("bottomLine"))}</p>'
    if d.get("summary"):
        toc.append(("dv-sum", "Executive summary"))
        h += '<h2 id="dv-sum">Executive summary</h2><div class="dv-sum">' + "".join(
            f'<div class="dv-card"><h3><span>{k + 1}</span>{esc(s.get("title"))}</h3><ul>{"".join("<li>" + esc(p) + "</li>" for p in s.get("points") or [])}</ul>'
            + (f'<div class="dv-plain"><strong>In plain terms</strong>{esc(s["plain"])}</div>' if s.get("plain") else "") + "</div>"
            for k, s in enumerate(d["summary"])) + "</div>"
    if d.get("context"):
        toc.append(("dv-ctx", "Context at a glance"))
        h += '<h2 id="dv-ctx">Context at a glance</h2><div class="dv-ctx">' + "".join(
            f'<div><b>{esc(c.get("label"))}</b>{esc(c.get("text"))}</div>' for c in d["context"]) + "</div>"
    for k, s in enumerate(d.get("sections") or []):
        toc.append((f"dv-s{k}", s.get("title")))
        h += (f'<h2 id="dv-s{k}"><span class="n">Part {k + 1}</span>{esc(s.get("title"))}</h2>'
              + "".join(f"<p>{esc(p)}</p>" for p in s.get("paragraphs") or [])
              + (f'<p class="dv-why"><strong>Why it matters</strong>{esc(s["why"])}</p>' if s.get("why") else ""))
    if d.get("watch"):
        toc.append(("dv-watch", "What to watch"))
        h += '<h2 id="dv-watch">What to watch</h2><ul class="dv-watch">' + "".join(f"<li>{esc(w)}</li>" for w in d["watch"]) + "</ul>"
    if d.get("people"):
        toc.append(("dv-people", "Key people"))
        h += '<h2 id="dv-people">Key people</h2>' + "".join(
            f'<details class="dv-person"><summary><h3>{esc(p.get("name"))}</h3><small>{esc(p.get("role"))}</small><em>{esc(p.get("lede") or "")}</em>'
            f'<span class="more">Full profile ↓</span></summary><div class="pb">'
            + "".join(f'<h4>{esc(b.get("heading"))}</h4>' + (f'<ul>{"".join("<li>" + esc(x) + "</li>" for x in b["items"])}</ul>' if b.get("items") else f'<p>{esc(b.get("text"))}</p>')
                      for b in p.get("blocks") or []) + "</div></details>"
            for p in d["people"])
    if d.get("followups"):
        toc.append(("dv-fu", "Follow-up questions"))
        h += '<h2 id="dv-fu">Follow-up questions</h2>' + "".join(
            f'<h3 style="font-size:20px;margin:0 0 12px">{esc(f.get("q"))}</h3>' + "".join(pg(x) for x in f.get("paragraphs") or [])
            for f in d["followups"])
    if d.get("sources") or d.get("links"):
        toc.append(("dv-src", "Sources"))
        src = d.get("sources") or []
        h += (f'<h2 id="dv-src">Sources</h2><details class="dv-src"><summary>{len(src)} sources read · show list</summary><ol>'
              + "".join(f"<li>{esc(s)}</li>" for s in src) + "</ol>"
              + (('<div class="lk">' + "".join(f'<a href="{esc(u)}" {EXT}>{esc(u)}</a>' for u in d["links"]) + "</div>") if d.get("links") else "")
              + "</details>")
    if meta.get("url"):
        h += f'<p class="dv-pdf"><a class="btn paper" href="{esc(meta["url"])}" {EXT}>Download this briefing (PDF) ↓</a></p>'
    nav = ""
    if prev:
        nav += f'<a href="{esc(dive_href(prev, {prev.get("slug"): 1}))}"><span>← Newer</span><b>{esc(prev.get("title"))}</b></a>'
    if nxt:
        nav += f'<a class="nx" href="{esc(dive_href(nxt, {nxt.get("slug"): 1}))}"><span>Older →</span><b>{esc(nxt.get("title"))}</b></a>'
    h += f'<nav class="dv-nav" aria-label="More deep dives">{nav}</nav>'
    words = d.get("words") or meta.get("words") or 0
    return (f'<header class="dv-top"><div class="wrap"><a class="dv-back" href="/deep-dives/">← All deep dives</a>'
            f'<div class="dv-meta"><b>Deep dive briefing</b><span>{esc(fmt(d.get("date") or meta.get("date")))}</span>'
            + (f'<span>{esc(meta["topic"])}</span>' if meta.get("topic") else "")
            + f'<span>{esc(mins(words))}</span><span>{words:,} words</span></div>'
            f'<h1>{esc(d.get("title") or meta.get("title"))}</h1>'
            + (f'<p class="dv-from">Prompted by: {esc(d["from"])}</p>' if d.get("from") else "")
            + f'</div></header><div class="wrap dv-grid"><div class="dv-body">{h}</div><aside class="dv-toc"><b>In this briefing</b>'
            + "".join(f'<a href="{esc(path)}#{i_}" data-jump="{i_}">{esc(l)}</a>' for i_, l in toc) + "</aside></div>")


def render_index(DD, copy, dv, topic=""):
    rd = copy.get("reading", {})
    topics = list(dict.fromkeys(d.get("topic") for d in DD if d.get("topic")))
    lst = [d for d in DD if not topic or d.get("topic") == topic]
    filt = "".join(
        f'<a href="{"/deep-dives/topic/" + slugify(x) + "/" if x else "/deep-dives/"}" class="{"on" if (topic or "") == x else ""}"'
        f'{CUR if (topic or "") == x else ""}>{esc(x or "All")}</a>' for x in [""] + topics)
    items, last = [], ""
    for d in lst:
        lab = week_label(d.get("date"))
        if lab != last:
            items.append(f'<li class="wk">{esc(lab)}</li>')
        last = lab
        items.append(dd_item(d, dv, None))
    h1 = f"{esc(topic)} deep dives" if topic else esc(rd.get("title"))
    return (f'<header class="dv-top"><div class="wrap"><a class="dv-back" href="/#reading">← Back to the site</a>'
            f'<div class="dv-meta"><b>Deep dives</b><span>{len(DD)} briefings</span><span>{k_words(DD)}K words</span></div>'
            f'<h1>{h1}</h1><p class="dv-from" style="text-transform:none;font:17px/1.55 var(--serif);color:#cfc6b8">{esc(rd.get("intro"))}</p></div></header>'
            f'<div class="wrap" style="padding-block:clamp(28px,4vw,56px)"><nav class="ddf" aria-label="Deep dives by topic">{filt}</nav>'
            f'<ul class="dd">{"".join(items)}</ul></div>')


def render_episodes(cfg, copy):
    eps = episodes(cfg)
    yt = cfg.get("youtube") or {}
    se = copy.get("sideeye", {})
    cards = "".join(
        f'<a class="ep" href="{esc(wurl(e))}" {EXT}><span class="th"><img src="{esc(thumb(e))}" alt="Thumbnail for SIDE EYE {esc(e.get("ep") or "episode")}: {esc(e["title"])}" loading="lazy" '
        f'onerror="this.src=\'https://i.ytimg.com/vi/{esc(e["id"])}/hqdefault.jpg\'">{PLAY}</span>'
        f'<span class="tx"><span>{esc(e.get("ep", ""))}{" · " + esc(ep_date(e)) if e.get("date") else ""}</span><b>{esc(e["title"])}</b></span></a>'
        for e in eps)
    return (f'<header class="dv-top"><div class="wrap"><a class="dv-back" href="/#watch">← Back to the site</a>'
            f'<div class="dv-meta"><b>SIDE EYE on YouTube</b><span>{len(eps)} episodes</span></div>'
            f'<h1>All episodes</h1><p class="dv-from" style="text-transform:none;font:17px/1.55 var(--serif);color:#cfc6b8">{esc(se.get("show_pitch"))}</p>'
            f'<p style="margin-top:20px"><a class="btn pink" href="{esc((yt.get("channelUrl") or "https://www.youtube.com/@SideEyeMag") + "?sub_confirmation=1")}" {EXT}>{esc(se.get("subscribe_cta"))}</a></p></div></header>'
            f'<div class="wrap" style="padding-block:clamp(28px,4vw,56px)"><div class="eps eps-page">{cards}</div></div>')


# ------------------------------------------------------------------ online issue
def load_articles(site_dir):
    d = pathlib.Path(site_dir) / ISSUE_DIR
    out = []
    for f in sorted(d.glob("*.json")) if d.exists() else []:
        try:
            a = json.loads(f.read_text(encoding="utf-8"))
        except ValueError as e:
            print(f"prerender: skipping bad article {f.name}: {e}", file=sys.stderr)
            continue
        if not isinstance(a, dict) or not a.get("title"):
            continue
        a.setdefault("slug", f.stem)
        a["slug"] = slugify(a["slug"]) or f.stem
        out.append(a)
    sec_rank = {s.lower(): k for k, s in enumerate(SECTIONS)}
    return sorted(out, key=lambda a: (sec_rank.get(str(a.get("section", "")).lower(), 9) if not isinstance(a.get("order"), int) else 0,
                                      a.get("order") if isinstance(a.get("order"), int) else 999, a["slug"]))


def _pages(a):
    p = a.get("pages") or []
    try:
        lo, hi = int(p[0]), int(p[-1])
        return lo, max(lo, hi)
    except (IndexError, TypeError, ValueError):
        return None, None


def _hero(a):
    if a.get("hero"):
        return a["hero"]
    lo, _ = _pages(a)
    return f"issue1/p{lo:03d}.jpg" if lo else ""


def _block_words(blocks):
    n = 0
    for b in blocks or []:
        n += len(str(b.get("text") or "").split()) + len(str(b.get("title") or "").split())
        n += sum(len(str(x).split()) for x in b.get("items") or [])
        n += sum(len(str(c).split()) for r in b.get("rows") or [] for c in r)
        n += _block_words(b.get("blocks"))
    return n


def xcard(href, img, kicker, title, sub="", extra="", img_alt=""):
    """Cross-link card (episode <-> magazine feature)."""
    im = f'<img src="{esc(img)}" alt="{esc(img_alt)}" loading="lazy">' if img else ""
    return (f'<div class="xcard"><a class="xc-main" href="{esc(href)}">{im}<span><small>{esc(kicker)}</small>'
            f'<b>{esc(title)}</b>{"<i>" + esc(sub) + "</i>" if sub else ""}</span></a>{extra}</div>')


def ep_xcard(e):
    rt = human_dur(e.get("duration")) or e.get("runtime") or ""
    return xcard(e["_path"], thumb(e), f"▶ Watch the episode · {e.get('ep', '')}" + (f" · {rt}" if rt else ""), e["title"],
                 e.get("summary") or "", f'<a class="xc-yt" href="{esc(wurl(e))}" {EXT}>Watch on YouTube →</a>',
                 f"Thumbnail for SIDE EYE {e.get('ep') or 'episode'}: {e['title']}")


def render_blocks(blocks, first=True):
    out = []
    for b in blocks or []:
        t = b.get("t")
        if t == "p" or (t not in ("h2", "h3", "quote", "sidebar", "list", "caption", "table") and b.get("text")):
            cls = ' class="ia-first"' if first and not out else ""
            out.append(f"<p{cls}>{esc(b.get('text'))}</p>")
        elif t in ("h2", "h3"):
            out.append(f"<{t}>{esc(b.get('text'))}</{t}>")
        elif t == "quote":
            cite = f"<cite>{esc(b['cite'])}</cite>" if b.get("cite") else ""
            out.append(f'<blockquote class="ia-q"><p>{esc(b.get("text"))}</p>{cite}</blockquote>')
        elif t == "sidebar":
            title = f"<h3>{esc(b['title'])}</h3>" if b.get("title") else ""
            out.append(f'<aside class="ia-side">{title}{render_blocks(b.get("blocks"), first=False)}</aside>')
        elif t == "list":
            tag = "ol" if b.get("ordered") else "ul"
            out.append(f'<{tag} class="ia-list">' + "".join(f"<li>{esc(x)}</li>" for x in b.get("items") or []) + f"</{tag}>")
        elif t == "caption":
            out.append(f'<p class="ia-cap">{esc(b.get("text"))}</p>')
        elif t == "table":
            rows = "".join("<tr>" + "".join(f"<td>{esc(c)}</td>" for c in r) + "</tr>" for r in b.get("rows") or [])
            out.append(f'<div class="ia-tw"><table class="ia-tbl"><tbody>{rows}</tbody></table></div>')
    return "".join(out)


def issue_meta(cfg):
    iss = cfg.get("issues") or []
    return next((i for i in iss if i.get("vol") == 1), iss[0] if iss else {})


def render_issue_index(arts, cfg, copy, site_dir, base_path, has_ep=()):
    cur = issue_meta(cfg)
    se = copy.get("sideeye", {})
    groups = []
    known = [s for s in SECTIONS if any(str(a.get("section", "")).lower() == s.lower() for a in arts)]
    other = [a for a in arts if str(a.get("section", "")).lower() not in [s.lower() for s in SECTIONS]]
    for s in known:
        groups.append((s, [a for a in arts if str(a.get("section", "")).lower() == s.lower()]))
    if other:
        groups.append(("More", other))
    items = []
    for s, lst in groups:
        items.append(f'<li class="wk">{esc(s)}</li>')
        for a in lst:
            pgn = f"p. {int(a['order']):02d}" if isinstance(a.get("order"), int) else ""
            dek = a.get("dek") or ""
            sub = dek if dek and len(dek) <= 220 else (a.get("summary") or dek)
            tag = a.get("label") or ("Play along" if a.get("visual") else "")
            epchip = '<br><span style="display:inline-block;margin-top:6px;background:var(--pink);color:#fff;padding:3px 6px">▶ Episode</span>' if a["slug"] in has_ep else ""
            items.append(f'<li><a href="{esc(base_path + a["slug"] + "/")}"><span class="d">{esc(pgn)}</span>'
                         f'<span><b>{esc(a["title"])}</b><i>{esc(sub)}</i></span><span class="t">{esc(tag)}{epchip}</span></a></li>')
    cover = cur.get("cover") or ((cur.get("reader") or {}).get("front")) or ""
    acts = []
    if cur.get("amazon"):
        acts.append(f'<a class="btn pink" href="{esc(cur["amazon"])}" {EXT}>{esc(se.get("amazon_cta") or "Buy the print issue")} →</a>')
    if cur.get("reader"):
        acts.append('<button class="btn paper" type="button" data-reader-page="0">Page through the print edition</button>')
    if cur.get("sources"):
        acts.append(f'<a class="btn paper" href="{esc(cur["sources"])}" {EXT}>{esc(se.get("sources_cta") or "See the sources")}</a>')
    cov = (f'<figure class="ia-cover" style="margin:0"><img src="{esc(cover)}" alt="Cover of SIDE EYE Vol. {esc(cur.get("vol"))}: {esc(cur.get("title"))}"{_wh(site_dir, cover)}></figure>'
           if cover else "")
    return (f'<header class="dv-top"><div class="wrap"><a class="dv-back" href="/side-eye/">← SIDE EYE</a>'
            f'<div class="dv-meta"><b>SIDE EYE · Vol. {esc(cur.get("vol"))}</b><span>Read online</span><span>{len(arts)} pieces</span></div>'
            f'<h1>Vol. {esc(cur.get("vol"))}: {esc(cur.get("title"))}</h1>'
            f'<p class="dv-from" style="text-transform:none;font:17px/1.55 var(--serif);color:#cfc6b8">{esc(se.get("issue_blurb"))}</p>'
            f'<div class="ia-acts">{"".join(acts)}</div></div></header>'
            f'<div class="wrap ia-toc">{cov}<div><h2 class="wall" style="font-size:22px;text-transform:uppercase;margin:0 0 14px">In this issue</h2>'
            f'<ul class="dd">{"".join(items)}</ul></div></div>')


LABEL_COL = {"lost the fight": "fight", "lost the credit": "credit", "lost the story": "story"}


def _fig_html(f, cur, title, i, site_dir):
    """One magazine figure (a crop from the print page)."""
    kind = "wide" if f.get("wide") else ("l" if i % 2 else "r")
    cls = f"ia-fig ia-fig-{kind}" + (" ia-g" if f.get("graphic") else " ia-art")
    wh = f' width="{f["w"]}" height="{f["h"]}"' if f.get("w") else _wh(site_dir, f["src"])
    pg = f'<span class="ia-pg">p. {int(f["page"]):02d}</span>' if f.get("page") else ""
    return (f'<figure class="{cls}"><img src="{esc(f["src"])}" alt="{esc(f.get("alt") or title)}" loading="lazy"{wh}>'
            f'{pg}</figure>')


def _place_figures(blocks, figs):
    """Spread figures through the text: before section heads where possible, else every few paragraphs."""
    if not figs:
        return {}
    n = len(blocks)
    anchors = [i for i, b in enumerate(blocks) if b.get("t") in ("h2", "sidebar") and i > 1]
    if len(anchors) < len(figs):
        ps = [i for i, b in enumerate(blocks) if b.get("t") == "p" and i > 0]
        step = max(1, len(ps) // (len(figs) + 1))
        anchors = sorted(set(anchors) | set(ps[step - 1::step]))
    if not anchors:
        anchors = [n]
    out = {}
    k = len(anchors)
    for j, f in enumerate(figs):
        pos = anchors[min(k - 1, round((j + 0.5) * k / len(figs) - 0.5))] if len(figs) <= k else anchors[j % k]
        # side figures go just after a section head so the text wraps around them; wide ones sit before it
        if not f.get("wide") and pos < n and blocks[pos].get("t") == "h2":
            pos += 1
        out.setdefault(pos, []).append(f)
    return out


def render_article(a, arts, cfg, copy, site_dir, base_path, eps_for=()):
    cur = issue_meta(cfg)
    se = copy.get("sideeye", {})
    k = next(i for i, x in enumerate(arts) if x["slug"] == a["slug"])
    prev = arts[k - 1] if k > 0 else None
    nxt = arts[k + 1] if k < len(arts) - 1 else None
    lo, hi = _pages(a)
    figs = list(a.get("figures") or [])
    hero_f = next((f for f in figs if f.get("hero")), None)
    rest = [f for f in figs if f is not hero_f]
    words = _block_words(a.get("blocks"))
    meta = [f'<b>SIDE EYE · Vol. {esc(cur.get("vol"))}</b>']
    if a.get("section"):
        meta.append(f"<span>{esc(a['section'])}</span>")
    if isinstance(a.get("order"), int):
        meta.append(f"<span>Page {a['order']:02d}</span>")
    if words:
        meta.append(f"<span>{esc(mins(words))}</span>")
    by = a.get("byline")
    if by and not re.match(r"(?i)by\b", by):
        by = "By " + by
    lab = a.get("label") or ("Play along" if a.get("visual") else "")
    labc = LABEL_COL.get(str(lab).lower(), "play")
    sticker = f'<span class="ia-stk ia-stk-{labc}">{esc(lab)}</span>' if lab else ""
    wide_hero = bool(hero_f and hero_f.get("w") and hero_f["w"] / max(1, hero_f["h"]) > 1.45)
    side = ""
    if hero_f and not wide_hero:
        side = (f'<figure class="ia-hero{" ia-g" if hero_f.get("graphic") else ""}">{sticker}'
                f'<img src="{esc(hero_f["src"])}" alt="{esc(hero_f.get("alt") or a["title"])}" width="{hero_f["w"]}" height="{hero_f["h"]}"></figure>')
    head = (f'<header class="dv-top ia-top{" ia-top-split" if side else ""}"><div class="wrap ia-topin"><div class="ia-toptx">'
            f'<a class="dv-back" href="{esc(base_path)}">← Vol. {esc(cur.get("vol"))} contents</a>'
            f'<div class="dv-meta">{"".join(meta)}</div>'
            + (f'<p class="ia-kick">{esc(a["kicker"])}</p>' if a.get("kicker") else "")
            + f'<h1>{esc(a["title"])}</h1>'
            + (f'<p class="ia-dek">{esc(a["dek"])}</p>' if a.get("dek") else "")
            + (f'<p class="ia-by">{esc(by)}</p>' if by else "")
            + (sticker if not side and not wide_hero else "")
            + f"</div>{side}</div></header>")
    if wide_hero:
        head += (f'<div class="wrap ia-splash"><figure class="ia-fig ia-fig-wide{" ia-g" if hero_f.get("graphic") else " ia-art"}">{sticker}'
                 f'<img src="{esc(hero_f["src"])}" alt="{esc(hero_f.get("alt") or a["title"])}" width="{hero_f["w"]}" height="{hero_f["h"]}"></figure></div>')
    epc = "".join(ep_xcard(e) for e in eps_for)
    blocks = a.get("blocks") or []
    if figs:  # printed captions are already inside the cropped art
        blocks = [b for b in blocks if b.get("t") != "caption"]
    # a sidebar that a graphic already shows: put the graphic in its place, keep its text one click away
    swap = {}
    for i, b in enumerate(blocks):
        if b.get("t") == "sidebar" and b.get("title"):
            tw = [w for w in re.findall(r"[a-z0-9]+", b["title"].lower()) if len(w) > 2]
            for f in rest:
                if id(f) in [id(x) for x in swap.values()] or not f.get("graphic"):
                    continue
                aw = set(re.findall(r"[a-z0-9]+", (f.get("alt") or "").lower()))
                if tw and sum(w in aw for w in tw) / len(tw) >= 0.6:
                    swap[i] = f
                    break
    rest = [f for f in rest if id(f) not in [id(x) for x in swap.values()]]
    place = _place_figures(blocks, rest)
    parts, first = [], True
    for i, b in enumerate(blocks):
        for f in place.get(i, []):
            parts.append(_fig_html(f, cur, a["title"], len(parts), site_dir))
        if i in swap:
            f = swap[i]
            parts.append(_fig_html(dict(f, wide=True), cur, a["title"], len(parts), site_dir)
                         + f'<details class="ia-txt"><summary>Read this as text</summary>{render_blocks([b], first=False)}</details>')
            continue
        h = render_blocks([b], first=first)
        if b.get("t") == "p" and first:
            first = False
        parts.append(h)
    for f in place.get(len(blocks), []):
        parts.append(_fig_html(f, cur, a["title"], len(parts), site_dir))
    body = (f'<div class="xcards" style="margin-bottom:28px">{epc}</div>' if epc else "") + "".join(parts)
    body = f'<div class="ia-flow">{body}</div>'
    if a.get("visual") and lo:
        imgs = "".join(f'<img src="issue1/p{n:03d}.jpg" alt="SIDE EYE Vol. {esc(cur.get("vol"))}, page {n}: {esc(a["title"])}" loading="lazy"{_wh(site_dir, f"issue1/p{n:03d}.jpg")}>'
                       for n in range(lo, hi + 1))
        body += (f'<details class="ia-print"><summary>See the full printed page{"s" if hi > lo else ""} (to print and play)</summary>'
                 f'<div class="ia-pages">{imgs}</div></details>')
    if a.get("sources"):
        body += ('<details class="ia-srcbox"><summary>Sources (' + str(len(a["sources"])) + ')</summary><ol class="ia-src">'
                 + "".join(f"<li>{esc(s)}</li>" for s in a["sources"]) + "</ol></details>")
    if epc:
        body += f'<h2>Watch the episode</h2><div class="xcards">{epc}</div>'
    cta = []
    if cur.get("amazon"):
        cta.append(f'<a class="btn pink" href="{esc(cur["amazon"])}" {EXT}>{esc(se.get("amazon_cta") or "Buy the print issue")} →</a>')
    cta.append(f'<a class="btn paper" href="{esc(base_path)}">All of Vol. {esc(cur.get("vol"))} online</a>')
    body += (f'<div class="ia-cta"><p>From <b>SIDE EYE Vol. {esc(cur.get("vol"))}: {esc(cur.get("title"))}</b>, the history magazine by Heather Chappell and Edwin. '
             f'History, allegedly.</p><div class="ia-acts" style="margin:0">{"".join(cta)}</div></div>')
    nav = ""
    if prev:
        nav += f'<a href="{esc(base_path + prev["slug"] + "/")}"><span>← Previous</span><b>{esc(prev["title"])}</b></a>'
    if nxt:
        nav += f'<a class="nx" href="{esc(base_path + nxt["slug"] + "/")}"><span>Next →</span><b>{esc(nxt["title"])}</b></a>'
    body += f'<nav class="dv-nav" aria-label="More from this issue">{nav}</nav>'
    aside = []
    hero = _hero(a)
    if hero:
        aside.append(f'<figure class="ia-inprint"><img src="{esc(hero)}" alt="Page {lo} of SIDE EYE Vol. {esc(cur.get("vol"))} in print: {esc(a["title"])}" loading="lazy"{_wh(site_dir, hero)}>'
                     f'<figcaption>In print · page {a.get("order") or lo}</figcaption></figure>')
    btns = []
    if cur.get("reader") and lo:
        btns.append(f'<button class="btn" type="button" data-reader-page="{lo}">Read it in the print layout</button>')
    if cur.get("amazon"):
        btns.append(f'<a class="btn pink" href="{esc(cur["amazon"])}" {EXT}>Buy the print issue →</a>')
    if btns:
        aside.append('<div style="display:grid;gap:12px">' + "".join(btns) + "</div>")
    return head + f'<div class="wrap dv-grid ia-grid"><div class="dv-body">{body}</div><aside class="ia-aside">{"".join(aside)}</aside></div>'


# ------------------------------------------------------------------ games
GAME_ORDER = ["caught", "buzzword", "allegedly", "sommelier"]
GAME_COL = {"caught": "#FF2E88", "buzzword": "#19C2B0", "allegedly": "#FFE14D", "sommelier": "#F3ECDF"}
# Plain descriptions for search and AI answers. Edit freely; titles/taglines fall back to these.
GAMES = {
    "caught": {
        "title": "DON'T GET CAUGHT", "name": "Don't Get Caught",
        "tagline": "Hold the side eye. Let go before they look.",
        "kind": "A free office-life stealth game",
        "blurb": "Give the side-eye during the all-hands, Thanksgiving dinner, the HOA meeting and the wedding toast "
                 "without getting caught. It's red light, green light for anyone who has ever sat through a meeting "
                 "that should have been an email.",
        "why": "Every scene is a monologue that gets a little more ridiculous line by line, and every listener has a tell "
               "before they turn around. The longer you hold the look, the more points you score, which is also how "
               "office politics works.",
        "how": ["Hold Space, the mouse button, or your finger on the screen to give the side-eye and rack up points.",
                "Watch the listeners. When one of them starts to turn, let go.",
                "Get caught mid-eye-roll and you lose your streak. Four scenes, about a minute of play.",
                "Your best score is saved in this browser. Nobody else has to know."],
    },
    "buzzword": {
        "title": "BUZZWORD INVADERS", "name": "Buzzword Invaders",
        "tagline": "Defend your calendar from descending jargon with one withering look.",
        "kind": "A free Space Invaders-style office satire",
        "blurb": "Shoot down corporate jargon like “circle back” and “quick sync (90 min)” between 9 and 5, "
                 "dodge recurring meeting invites, and whatever you do, don't shoot “lunch is on me.”",
        "why": "It's the arcade classic, except the aliens are phrases you have heard in a conference room this week "
               "and your only weapon is a withering look.",
        "how": ["Move with the arrow keys or A and D.", "Press Space to glare. A direct glare deletes the buzzword.",
                "On a phone or tablet, hold and drag to move and glare.",
                "Dodge the meeting invites they drop, and leave the good news alone."],
    },
    "allegedly": {
        "title": "ALLEGEDLY", "name": "Allegedly",
        "tagline": "Side-eye the myths. Nod at the facts.",
        "kind": "A free history myth-busting game",
        "blurb": "Famous history “facts” flash up one at a time. Side-eye the myths and nod at the true facts "
                 "while a pompous museum docent gets more and more defensive.",
        "why": "Napoleon's height, Viking horns, “let them eat cake”: every card is a claim you have probably "
               "repeated at dinner, followed by the real, sourced story, which is usually stranger.",
        "how": ["Read the claim on the placard.", "Myth? Swipe left, press the Left arrow, or tap SIDE-EYE.",
                "True? Swipe right, press the Right arrow, or tap NOD.",
                "Each answer shows the real story. Be quick: the round is short and the docent is watching."],
    },
    "sommelier": {
        "title": "SIDE-EYE SOMMELIER", "name": "Side-Eye Sommelier",
        "tagline": "Pair the offense with the correct vintage of side-eye.",
        "kind": "A free workplace and family etiquette game",
        "blurb": "Match the right degree of side-eye to everyday workplace and family offenses, from microwaved fish "
                 "at 10:47 a.m. to “bless your heart.”",
        "why": "Each offense gets a tasting note like a fine wine, and the five vintages run from a polite Glance all "
               "the way up to Bless Your Heart. Overreact or underreact and the sommelier will say so.",
        "how": ["Read the offense.", "A meter sweeps through five levels: Glance, Squint, Full Side-Eye, Side-Eye + Eyebrow, Bless Your Heart.",
                "Press Space or Enter, or tap, to lock in the level it deserves.",
                "Closer pairings score more. Press M to turn the sound on or off."],
    },
}


def frag_cabs():
    return "".join(
        f'<div class="cabw"><button class="cab" style="--c:{GAME_COL[g]}" data-g="{g}" aria-label="Play {esc(GAMES[g]["title"])}">'
        f'<span class="scr"></span><h3>{esc(GAMES[g]["title"])}</h3><p>{esc(GAMES[g]["tagline"])}</p>'
        f'<span class="meta"><span>Best: <span data-best="{g}">—</span></span><span class="play">▶ Play</span></span></button>'
        f'<a class="cablink" href="/games/{g}/">How to play {esc(GAMES[g]["title"])} →</a></div>' for g in GAME_ORDER)


def render_games_index(copy):
    gi = copy.get("games_intro") or {}
    cards = "".join(
        f'<article class="gm-card" style="--c:{GAME_COL[g]}"><span class="tg">{esc(GAMES[g]["kind"])}</span>'
        f'<h2><a href="/games/{g}/">{esc(GAMES[g]["name"])}</a></h2><p>{esc(GAMES[g]["blurb"])}</p>'
        f'<a class="btn pink" href="/games/{g}/">Play {esc(GAMES[g]["name"])} →</a></article>' for g in GAME_ORDER)
    return (f'<header class="dv-top"><div class="wrap"><a class="dv-back" href="/#games">← Back to the site</a>'
            f'<div class="dv-meta"><b>The Side-Eye Arcade</b><span>{len(GAME_ORDER)} free browser games</span><span>No sign-up</span><span>Phone or keyboard</span></div>'
            f'<h1>{esc(gi.get("title") or "The Side-Eye Arcade")}</h1>'
            f'<p class="dv-from" style="text-transform:none;font:17px/1.55 var(--serif);color:#cfc6b8">{esc(gi.get("sub"))}</p></div></header>'
            f'<div class="wrap" style="padding-block:clamp(28px,4vw,56px)"><div class="gm-grid">{cards}</div>'
            f'<p class="egg" style="margin-top:28px">{esc(gi.get("footnote"))}</p></div>')


def render_game(g):
    G = GAMES[g]
    others = [x for x in GAME_ORDER if x != g]
    k = GAME_ORDER.index(g)
    prev, nxt = GAME_ORDER[k - 1], GAME_ORDER[(k + 1) % len(GAME_ORDER)]
    body = (f'<div class="frame gm-frame"><header><b>{esc(G["title"])}</b></header>'
            f'<div class="gm-stage" id="gm-stage"><div><button class="btn pink" type="button" data-play-game="{g}">▶ Play {esc(G["name"])}</button>'
            f'<p>Free · No sign-up · Works on phones and keyboards</p>'
            f'<noscript><p>This game needs JavaScript turned on.</p></noscript></div></div>'
            f'<p class="hint">Click the screen to focus · Your best score stays in this browser</p></div>'
            f'<div class="dv-body"><h2>What it is</h2><p>{esc(G["kind"])} from the Side-Eye Arcade on heatherchappell.com. {esc(G["blurb"])}</p>'
            f'<p>{esc(G["why"])}</p>'
            f'<h2>How to play</h2><ol class="gm-how">' + "".join(f"<li>{esc(x)}</li>" for x in G["how"]) + "</ol>"
            f'<h2>More games</h2><div class="gm-grid">' + "".join(
                f'<article class="gm-card" style="--c:{GAME_COL[o]}"><span class="tg">{esc(GAMES[o]["kind"])}</span>'
                f'<h3 style="font-size:20px;margin:0"><a href="/games/{o}/" style="text-decoration:none">{esc(GAMES[o]["name"])}</a></h3>'
                f'<p>{esc(GAMES[o]["tagline"])}</p></article>' for o in others) + "</div>"
            f'<nav class="dv-nav" aria-label="More games"><a href="/games/{prev}/"><span>← Previous cabinet</span><b>{esc(GAMES[prev]["name"])}</b></a>'
            f'<a class="nx" href="/games/{nxt}/"><span>Next cabinet →</span><b>{esc(GAMES[nxt]["name"])}</b></a></nav></div>')
    return (f'<header class="dv-top"><div class="wrap"><a class="dv-back" href="/games/">← The Side-Eye Arcade</a>'
            f'<div class="dv-meta"><b>Side-Eye Arcade</b><span>Free browser game</span><span>About a minute a round</span></div>'
            f'<h1>{esc(G["name"])}</h1><p class="dv-from" style="text-transform:none;font:19px/1.5 var(--serif);color:#e6dccb">{esc(G["tagline"])}</p></div></header>'
            f'<div class="wrap" style="padding-block:clamp(28px,4vw,56px);max-width:1000px">{body}</div>')


# ------------------------------------------------------------------ episodes
EP_DIR = "episodes"


def secs(t):
    """Chapter/transcript time: int seconds, '1:02', '1:02:03' or '62s' -> int seconds."""
    if isinstance(t, (int, float)):
        return int(t)
    s = str(t or "").strip().rstrip("s")
    try:
        n = 0
        for part in s.split(":"):
            n = n * 60 + int(float(part))
        return n
    except ValueError:
        return 0


def human_dur(d):
    """'PT27M41S' -> '27:41'; anything else is returned as given."""
    m = re.fullmatch(r"P?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", str(d or "").strip(), re.I)
    if not d or not m or not any(m.groups()):
        return str(d or "")
    h, mi, s = (int(x or 0) for x in m.groups())
    return clock(h * 3600 + mi * 60 + s)


def clock(n):
    h, r = divmod(int(n), 3600)
    m, s = divmod(r, 60)
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m}:{s:02d}"


def load_episodes(site_dir, cfg):
    """episodes/<slug>.json merged with config youtube.episodes (by id), newest first."""
    d = pathlib.Path(site_dir) / EP_DIR
    data = {}
    for f in sorted(d.glob("*.json")) if d.exists() else []:
        try:
            j = json.loads(f.read_text(encoding="utf-8"))
        except ValueError as e:
            print(f"prerender: skipping bad episode {f.name}: {e}", file=sys.stderr)
            continue
        if isinstance(j, dict) and j.get("id"):
            j["slug"] = slugify(j.get("slug") or f.stem)
            data[j["id"]] = j
    out = []
    for e in episodes(cfg):
        j = data.pop(e["id"], None)
        if j:
            out.append({**e, **{k: v for k, v in j.items() if v not in (None, "", [])}, "thumb": e.get("thumb") or j.get("thumb")})
    out += sorted(data.values(), key=lambda x: x.get("date") or "", reverse=True)
    return out


def ep_card(e, page):
    groups = e.get("topic_groups") or []
    chips = ('<div class="chips">' + "".join(f'<a href="/episodes/topic/{slugify(g)}/">{esc(g)}</a>' for g in groups) + "</div>") if groups and page else ""
    href, attrs = (page, "") if page else (wurl(e), EXT)
    meta = esc(e.get("ep", "")) + (" · " + esc(ep_date(e)) if e.get("date") else "") + (" · " + esc(human_dur(e["duration"])) if e.get("duration") else "")
    card = (f'<a class="ep" href="{esc(href)}" {attrs}><span class="th"><img src="{esc(thumb(e))}" alt="Thumbnail for SIDE EYE {esc(e.get("ep") or "episode")}: {esc(e["title"])}" loading="lazy" '
            f'onerror="this.src=\'https://i.ytimg.com/vi/{esc(e["id"])}/hqdefault.jpg\'">{PLAY}</span>'
            f'<span class="tx"><span>{meta}</span><b>{esc(e["title"])}</b></span></a>')
    return f'<div class="ep-w">{card}{chips}</div>'


def render_ep_list(eps, epp, h1, intro, back, back_label, cfg, copy, extra_meta=""):
    yt = cfg.get("youtube") or {}
    se = copy.get("sideeye", {})
    groups = list(dict.fromkeys(g for e in eps for g in e.get("topic_groups") or []))
    nav = ('<nav class="ddf" aria-label="Episodes by topic"><a href="/episodes/">All</a>' + "".join(
        f'<a href="/episodes/topic/{slugify(g)}/">{esc(g)}</a>' for g in groups) + "</nav>") if groups else ""
    return (f'<header class="dv-top"><div class="wrap"><a class="dv-back" href="{esc(back)}">{esc(back_label)}</a>'
            f'<div class="dv-meta"><b>SIDE EYE on YouTube</b><span>{len(eps)} episode{"s" if len(eps) != 1 else ""}</span>{extra_meta}</div>'
            f'<h1>{h1}</h1><p class="dv-from" style="text-transform:none;font:17px/1.55 var(--serif);color:#cfc6b8">{esc(intro)}</p>'
            f'<p style="margin-top:20px"><a class="btn pink" href="{esc((yt.get("channelUrl") or "https://www.youtube.com/@SideEyeMag") + "?sub_confirmation=1")}" {EXT}>{esc(se.get("subscribe_cta"))}</a></p></div></header>'
            f'<div class="wrap" style="padding-block:clamp(28px,4vw,56px)">{nav}<div class="eps eps-page">'
            + "".join(ep_card(e, epp.get(e["id"])) for e in eps) + "</div></div>")


def render_episode(e, eps, path, arts_by_slug, dv, DD):
    vid = e["id"]
    lines = [esc(e.get("ep", ""))]
    if e.get("date"):
        lines.append(f'<time datetime="{esc(e["date"])}">{esc(fmt(e["date"]))}</time>')
    if e.get("duration"):
        lines.append(f'<time datetime="{esc(e["duration"])}">{esc(human_dur(e["duration"]))}</time>' if e["duration"].upper().startswith("PT") else esc(e["duration"]))
    elif e.get("runtime"):
        lines.append(esc(e["runtime"]))
    meta = '<b>SIDE EYE on YouTube</b>' + "".join(f"<span>{x}</span>" for x in lines if x)
    th = thumb(e)
    player = (f'<a class="ytf" href="{esc(wurl(e))}" {EXT} data-yt="{esc(vid)}" data-title="{esc(e["title"])}" aria-label="Play the episode: {esc(e["title"])}">'
              f'<img src="{esc(th)}" alt="Thumbnail for SIDE EYE {esc(e.get("ep") or "episode")}: {esc(e["title"])}" width="1280" height="720" '
              f'onerror="this.src=\'https://i.ytimg.com/vi/{esc(vid)}/hqdefault.jpg\'">{PLAY}</a>')
    b = player
    b += f'<p class="dv-pdf" style="margin:-8px 0 28px"><a class="btn paper" href="{esc(wurl(e))}" {EXT}>Watch on YouTube →</a></p>'
    toc = []
    if e.get("summary"):
        b += f'<p class="dv-bl"><strong>The short version</strong>{esc(e["summary"])}</p>'
    if e.get("chapters"):
        toc.append(("ep-ch", "Chapters"))
        b += '<h2 id="ep-ch">Chapters</h2><ol class="chap">' + "".join(
            f'<li><a href="{esc(path)}?t={secs(c.get("t"))}" data-yt-start="{secs(c.get("t"))}"><time>{clock(secs(c.get("t")))}</time><span>{esc(c.get("title"))}</span></a></li>'
            for c in e["chapters"]) + "</ol>"
    if e.get("description"):
        toc.append(("ep-about", "About this episode"))
        b += '<h2 id="ep-about">About this episode</h2>' + "".join(f"<p>{esc(x)}</p>" for x in re.split(r"\n\s*\n|\n", e["description"]) if x.strip())
    if e.get("topic_groups") or e.get("topics"):
        toc.append(("ep-topics", "Topics"))
        b += '<h2 id="ep-topics">Topics</h2>'
        if e.get("topic_groups"):
            b += '<div class="chips">' + "".join(f'<a href="/episodes/topic/{slugify(g)}/">{esc(g)}</a>' for g in e["topic_groups"]) + "</div>"
        if e.get("topics"):
            b += '<div class="chips">' + "".join(f"<span>{esc(x)}</span>" for x in e["topics"]) + "</div>"
    rel = [arts_by_slug[s] for s in e.get("related_articles") or [] if s in arts_by_slug]
    rdv = [s for s in e.get("related_dives") or [] if s in dv]
    if rel or rdv:
        toc.append(("ep-read", "Read more"))
        b += '<h2 id="ep-read">Read the magazine feature</h2>' if rel else '<h2 id="ep-read">Read more</h2>'
        b += '<div class="xcards">' + "".join(
            xcard(a["_path"], _hero(a), f"SIDE EYE Vol. 1 · {a.get('section') or 'Feature'}", a["title"], a.get("dek") or a.get("summary") or "",
                  img_alt=f"Opening page of {a['title']}") for a in rel) + "</div>"
        if rdv:
            b += '<h3 style="font-size:20px;margin:28px 0 12px">Related deep dives</h3><ul class="dd">'
        for s in rdv:
            m = next((x for x in DD if x.get("slug") == s), {})
            b += dd_item({**m, **{k: dv[s].get(k) for k in ("title", "bottomLine", "date") if dv[s].get(k)}, "slug": s}, dv, None)
        if rdv:
            b += "</ul>"
    if e.get("transcript"):
        toc.append(("ep-tr", "Transcript"))
        b += ('<h2 id="ep-tr">Transcript</h2><details class="dv-src tr"><summary>Show the full transcript</summary>'
              + "".join(f'<p><a href="{esc(path)}?t={secs(x.get("t"))}" data-yt-start="{secs(x.get("t"))}">{clock(secs(x.get("t")))}</a>{esc(x.get("text"))}</p>'
                        for x in e["transcript"]) + "</details>")
    k = next(i for i, x in enumerate(eps) if x["id"] == vid)
    newer = eps[k - 1] if k > 0 else None
    older = eps[k + 1] if k < len(eps) - 1 else None
    nav = ""
    if newer and newer.get("_path"):
        nav += f'<a href="{esc(newer["_path"])}"><span>← Newer</span><b>{esc(newer["title"])}</b></a>'
    if older and older.get("_path"):
        nav += f'<a class="nx" href="{esc(older["_path"])}"><span>Older →</span><b>{esc(older["title"])}</b></a>'
    b += f'<nav class="dv-nav" aria-label="More episodes">{nav}</nav>'
    return (f'<header class="dv-top"><div class="wrap"><a class="dv-back" href="/episodes/">← All episodes</a>'
            f'<div class="dv-meta">{meta}</div><h1>{esc(e["title"])}</h1>'
            + (f'<p class="ia-dek">{esc(e["summary"])}</p>' if e.get("summary") and False else "")
            + f'</div></header><div class="wrap dv-grid"><div class="dv-body">{b}</div><aside class="dv-toc"><b>On this page</b>'
            + "".join(f'<a href="{esc(path)}#{i_}" data-jump="{i_}">{esc(l)}</a>' for i_, l in toc) + "</aside></div>")


# ------------------------------------------------------------------ FAQ (seo/faq.json)
def load_faq(site_dir):
    f = pathlib.Path(site_dir) / "seo" / "faq.json"
    try:
        d = json.loads(f.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {}
    d["items"] = [x for x in d.get("items") or [] if x.get("q") and x.get("a")]
    return d if d["items"] else {}


def _linkify(text):
    """Escape, then turn 'heatherchappell.com/path/' mentions into site links (visible text unchanged)."""
    return re.sub(r"heatherchappell\.com(/[a-z0-9/-]*)", lambda m: f'<a href="{m.group(1)}">{m.group(0)}</a>', esc(text))


def faq_section(items, title, sec_id="faq", attrs=""):
    qa = "".join(f'<details class="faq-q"><summary><h3>{esc(x["q"])}</h3></summary><p>{_linkify(x["a"])}</p></details>' for x in items)
    return (f'<section class="faq band" id="{sec_id}" aria-labelledby="{sec_id}-h"{attrs}><div class="wrap">'
            f'<h2 id="{sec_id}-h">{esc(title)}</h2><div class="faq-list">{qa}</div></div></section>\n')


def faq_jsonld(items, url):
    data = {"@context": "https://schema.org", "@type": "FAQPage", "@id": url + "#faq", "url": url,
            "mainEntity": [{"@type": "Question", "name": x["q"], "acceptedAnswer": {"@type": "Answer", "text": x["a"]}} for x in items]}
    return '<script type="application/ld+json">\n' + json.dumps(data, ensure_ascii=False, indent=1).replace("</", "<\\/") + "\n</script>"


def faq_pick(items, kind):
    if kind == "side_eye":
        return [x for x in items if re.search(r"SIDE EYE|history magazine", x["q"])]
    if kind == "games":
        return [x for x in items if re.search(r"\bgames?\b", x["q"], re.I)]
    return items


# ------------------------------------------------------------------ hooks
def _hook(modname, fn):
    try:
        if importlib.util.find_spec(modname) is None:
            return None
        return getattr(importlib.import_module(modname), fn, None)
    except Exception as e:  # a broken teammate module must not break the build
        print(f"prerender: {modname} unavailable ({e})", file=sys.stderr)
        return None


def _call(f, page_type, ctx):
    if not f:
        return None
    try:
        return f(page_type, ctx)
    except Exception as e:
        print(f"prerender: {f.__module__}.{f.__name__}({page_type}) failed: {e}", file=sys.stderr)
        return None


def _desc(s, n=158):
    s = re.sub(r"\s+", " ", str(s or "")).strip()
    return s if len(s) <= n else s[:n - 1].rsplit(" ", 1)[0].rstrip(" ,;:—-") + "…"


def _abs(p):
    return p if re.match(r"https?://", p or "") else BASE + "/" + (p or "").lstrip("/")


# ------------------------------------------------------------------ main
def prerender(index_html: str, site_dir: pathlib.Path, cfg: dict, copy: dict, dives: dict) -> list:
    global LAST_IMAGES
    site_dir = pathlib.Path(site_dir)
    if str(site_dir) not in sys.path:
        sys.path.insert(0, str(site_dir))
    page_meta = _hook("seo.meta", "page_meta")
    jsonld = _hook("seo.jsonld", "jsonld")

    DD = cfg.get("deepDives") or []
    dv = dict(dives or {})
    merged = {s: {**next((x for x in DD if x.get("slug") == s), {}), **d} for s, d in dv.items()}
    arts = load_articles(site_dir)
    cur = issue_meta(cfg)
    vol = cur.get("vol") or 1
    issue_path = f"/side-eye/vol-{vol}/"
    online = issue_path if arts else ""
    eps = episodes(cfg)
    latest = re.sub(r"^ep-", "", pathlib.Path(eps[0].get("thumb") or "").stem) if eps else ""
    story_txt = site_dir / "story.txt"
    story_text = story_txt.read_text(encoding="utf-8") if story_txt.exists() else None
    fic = copy.get("fiction") or {}
    cover_abs = _abs(cur.get("cover") or "assets/cover-vol1.jpg")
    head_abs = _abs((cfg.get("about") or {}).get("headshot") or "assets/headshot.jpg")
    alt_for = {cover_abs: f"Cover of SIDE EYE Vol. {vol}: {cur.get('title', '')}, a history magazine co-created by Heather Chappell",
               head_abs: "Heather Chappell"}

    for a in arts:
        a["_path"] = f"{issue_path}{a['slug']}/"
    arts_by_slug = {a["slug"]: a for a in arts}
    eplist = load_episodes(site_dir, cfg)
    epp = {}
    for e in eplist:
        if e.get("slug"):
            e["_path"] = epp[e["id"]] = f"/episodes/{e['slug']}/"
    eps_for_art = {}
    for e in eplist:
        for s in e.get("related_articles") or []:
            if e.get("_path") and s in arts_by_slug:
                eps_for_art.setdefault(s, []).append(e)
    ep_groups = list(dict.fromkeys(g for e in eplist if e.get("_path") for g in e.get("topic_groups") or []))

    faq = load_faq(site_dir)
    faq_items = faq.get("items") or []
    faq_title = faq.get("title") or "Quick answers"
    base_doc = fill_home_sections(index_html, cfg, copy, dv, online, epp)
    written, images = [], {}

    def ctx_for(page_type, path, **kw):
        c = dict(page_type=page_type, path=path, url=BASE + path, cfg=cfg, copy=copy, dives=merged,
                 articles=arts, vol=vol, latest=latest, site_dir=str(site_dir))
        if story_text is not None:
            c["story_text"] = story_text
        c.update(kw)
        return c

    def emit(path, page_type, ctx, fallback, transform, route, body_class, og_type=None, head_extra=""):
        m = _call(page_meta, page_type, ctx) or {}
        title = m.get("title") or fallback["title"]
        desc = m.get("description") or fallback["description"]
        img = m.get("og_image") or fallback.get("image")
        img = _abs(img) if img else None
        ld = (_call(jsonld, page_type, ctx) or "") + (("\n" + head_extra) if head_extra else "")
        doc = transform(base_doc)
        if path != "/":
            doc = demote_hero_h1(doc)
        doc = set_route(doc, route, body_class, online, epp)
        doc = set_head(doc, title=title, description=desc, url=BASE + path, og_title=m.get("og_title"),
                       og_description=m.get("og_description"), og_image=img,
                       og_image_alt=alt_for.get(img) or (fallback.get("image_alt") if img == _abs(fallback.get("image") or "") else None),
                       og_type=og_type, base=path != "/", extra=(ld + "\n") if ld else "")
        n_h1 = len(re.findall(r"<h1\b", re.sub(r"<script\b.*?</script>", "", doc, flags=re.S)))
        if n_h1 != 1:
            print(f"prerender: {path} has {n_h1} <h1> elements", file=sys.stderr)
        out = site_dir / "index.html" if path == "/" else site_dir / path.strip("/") / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(doc, encoding="utf-8")
        if path != "/":
            written.append(path)

    divepage = lambda inner: (lambda d: fill(d, "divepage", inner))

    # deep dives: archive, topics, briefings
    if DD:
        emit("/deep-dives/", "dives_index", ctx_for("dives_index", "/deep-dives/"),
             {"title": "Deep Dives: News Briefings by Heather Chappell",
              "description": _desc((copy.get("reading") or {}).get("intro") or "Deep-dive news briefings by Heather Chappell."),
              "image": head_abs},
             divepage(render_index(DD, copy, dv)), "dives", "dive-on")
        for topic in dict.fromkeys(d.get("topic") for d in DD if d.get("topic")):
            p = f"/deep-dives/topic/{slugify(topic)}/"
            emit(p, "topic", ctx_for("topic", p, topic=topic, topic_slug=slugify(topic)),
                 {"title": f"{topic} Deep Dives · Heather Chappell",
                  "description": _desc(f"{topic} deep-dive briefings by Heather Chappell: what's confirmed, what isn't, and what to watch."),
                  "image": head_abs},
                 divepage(render_index(DD, copy, dv, topic)), f"topic:{slugify(topic)}", "dive-on")
    for slug, d in dv.items():
        p = f"/deep-dives/{slug}/"
        md = merged[slug]
        emit(p, "dive", ctx_for("dive", p, slug=slug, dive=md, topic=md.get("topic")),
             {"title": f"{d.get('title') or md.get('title')} · Heather Chappell", "description": _desc(d.get("bottomLine")), "image": head_abs},
             divepage(render_dive(slug, d, DD, p)), f"dive:{slug}", "dive-on", og_type="article")

    # story
    if 'id="story"' in base_doc:
        def story_t(doc):
            doc = retag(doc, "st-title", "h1")
            bar = '<div class="st-backbar"><a href="/#story">← Back to the site</a></div>'
            return re.sub(r'(<section id="story"[^>]*>)', lambda m: m.group(1) + bar, doc, count=1)
        emit("/story/", "story", ctx_for("story", "/story/"),
             {"title": f"{fic.get('title', 'Short story')} · Heather Chappell", "description": _desc(fic.get("sub")), "image": head_abs},
             story_t, "story", "story-on", og_type="article")

    # episodes: list, one page per episode (episodes/<slug>.json), topic-group pages
    if eplist:
        se = copy.get("sideeye") or {}
        emit("/episodes/", "episodes", ctx_for("episodes", "/episodes/", episodes=eplist),
             {"title": "SIDE EYE Episodes on YouTube · Heather Chappell",
              "description": _desc(se.get("show_pitch")), "image": cover_abs},
             divepage(render_ep_list(eplist, epp, "All episodes", se.get("show_pitch"), "/#watch", "← Back to the site", cfg, copy)),
             "episodes", "dive-on")
        for e in eplist:
            if not e.get("_path"):
                continue
            p = e["_path"]
            emit(p, "episode", ctx_for("episode", p, episode=e, slug=e["slug"], episodes=eplist),
                 {"title": f"{e['title']} | SIDE EYE", "description": _desc(e.get("summary") or e.get("description") or e["title"]),
                  "image": _abs(thumb(e)), "image_alt": f"Thumbnail for SIDE EYE {e.get('ep') or 'episode'}: {e['title']}"},
                 divepage(render_episode(e, eplist, p, arts_by_slug, dv, DD)), f"episode:{e['slug']}", "dive-on", og_type="video.episode")
            images[p] = [thumb(e)] if not thumb(e).startswith("http") else []
        for g in ep_groups:
            p = f"/episodes/topic/{slugify(g)}/"
            sub = [e for e in eplist if g in (e.get("topic_groups") or [])]
            emit(p, "episode_topic", ctx_for("episode_topic", p, topic=g, topic_slug=slugify(g), episodes=sub),
                 {"title": f"{g}: SIDE EYE Episodes · Heather Chappell",
                  "description": _desc(f"SIDE EYE YouTube episodes about {g.lower()}, from the history show by Heather Chappell and Edwin: "
                                       + "; ".join(e["title"] for e in sub)), "image": cover_abs},
                 divepage(render_ep_list(sub, epp, f"{esc(g)}: SIDE EYE episodes", se.get("show_pitch"), "/episodes/", "← All episodes", cfg, copy)),
                 f"episode-topic:{slugify(g)}", "dive-on")

    # games: arcade index + one page per game (playable in place)
    emit("/games/", "games", ctx_for("games", "/games/", game_info=GAMES),
         {"title": "Free Funny Browser Games: The Side-Eye Arcade · Heather Chappell",
          "description": _desc("Four free browser games about office life and history myths: Don't Get Caught, Buzzword Invaders, "
                               "Allegedly and Side-Eye Sommelier. No sign-up, works on phones."), "image": head_abs},
         divepage(render_games_index(copy) + (faq_section(faq_pick(faq_items, "games"), "Quick answers", "faq-games") if faq_pick(faq_items, "games") else "")), "games", "dive-on")
    for g in GAME_ORDER:
        p = f"/games/{g}/"
        G = GAMES[g]
        emit(p, "game", ctx_for("game", p, game_id=g, game_info=G),
             {"title": f"{G['name']}: {G['kind'].replace('A free ', 'Free ')}", "description": _desc(G["blurb"]), "image": head_abs},
             divepage(render_game(g)), f"game:{g}", "dive-on")

    # SIDE EYE landing: the magazine + show sections of the homepage, on their own
    def side_t(doc):
        doc = keep(keep(doc, "side-eye"), "watch")
        doc = retag(doc, "seh", "h1", "as-h2")
        bar = back_bar("/#side-eye")
        if online:
            bar = bar.replace("</a></div></div>", f'</a> <a href="{esc(online)}" style="margin-left:18px">Read Vol. {esc(vol)} online →</a></div></div>')
        doc = doc.replace('<section class="se band" id="side-eye"', bar + '\n<section class="se band" id="side-eye"', 1)
        se_faq = faq_pick(faq_items, "side_eye")
        if se_faq:
            doc = doc.replace('<section class="reading band"', faq_section(se_faq, "SIDE EYE: quick answers", "faq-se", " data-keep") + '<section class="reading band"', 1)
        return doc
    emit("/side-eye/", "side_eye", ctx_for("side_eye", "/side-eye/"),
         {"title": "SIDE EYE Magazine: History, Allegedly · Heather Chappell",
          "description": _desc((copy.get("sideeye") or {}).get("issue_blurb")), "image": cover_abs},
         side_t, "side-eye", "sec-on")

    # online issue
    if arts:
        emit(issue_path, "issue_index", ctx_for("issue_index", issue_path, issue=cur),
             {"title": f"SIDE EYE Vol. {vol}: {cur.get('title', '')} — Read Online",
              "description": _desc(f"Read SIDE EYE Vol. {vol}, {cur.get('title', '')}, online. " + ((copy.get('sideeye') or {}).get('issue_blurb') or "")),
              "image": cover_abs},
             divepage(render_issue_index(arts, cfg, copy, site_dir, issue_path, set(eps_for_art))), "issue", "dive-on")
        images[issue_path] = [cur.get("cover")] if cur.get("cover") else []
        for a in arts:
            p = f"{issue_path}{a['slug']}/"
            hero = _hero(a)
            emit(p, "issue_article", ctx_for("issue_article", p, article=a, slug=a["slug"], issue=cur),
                 {"title": f"{a['title']} | SIDE EYE Magazine", "description": _desc(a.get("summary") or a.get("dek") or a["title"]),
                  "image": hero or cover_abs, "image_alt": f"Opening page of {a['title']} in SIDE EYE Vol. {vol}"},
                 divepage(render_article(a, arts, cfg, copy, site_dir, issue_path, eps_for_art.get(a["slug"], []))), f"article:{a['slug']}", "dive-on", og_type="article")
            lo, hi = _pages(a)
            imgs = ([hero] if hero else []) + [f["src"] for f in a.get("figures") or []]
            if a.get("visual") and lo:
                imgs += [f"issue1/p{n:03d}.jpg" for n in range(lo, hi + 1) if f"issue1/p{n:03d}.jpg" != hero]
            images[p] = imgs

    # work: the resume sections on their own
    def work_t(doc):
        doc = keep(keep(doc, "work"), "about")
        doc = retag(doc, "wh", "h1", "as-h2")
        return doc.replace('<section class="work band" id="work"', back_bar("/#work") + '\n<section class="work band" id="work"', 1)
    emit("/work/", "work", ctx_for("work", "/work/"),
         {"title": "Heather Chappell — B2B Demand Generation & Growth Marketing",
          "description": _desc((copy.get("work") or {}).get("intro")), "image": head_abs},
         work_t, "work", "sec-on")

    # homepage last: canonical + meta + JSON-LD + pre-filled sections; no <base>, no route
    emit("/", "home", ctx_for("home", "/"),
         {"title": (copy.get("meta") or {}).get("title") or "Heather Chappell",
          "description": (copy.get("meta") or {}).get("description") or "", "image": cover_abs},
         (lambda d: d.replace('<section class="about band" id="about"', faq_section(faq_items, faq_title) + '<section class="about band" id="about"', 1)) if faq_items else (lambda d: d),
         "", "", head_extra=faq_jsonld(faq_items, BASE + "/") if faq_items else "")

    LAST_IMAGES = images
    return written
