"""JSON-LD structured data for heatherchappell.com.

jsonld(page_type, ctx) -> str of <script type="application/ld+json"> block(s).

page_type: home, dive, dives_index, topic, story, episodes, side_eye, work,
           issue_index, issue_article, episode, episode_topic, games, game
ctx keys:  cfg (config.json dict), copy (copy.json dict), dives (slug -> dive json),
           slug (dive pages), topic (topic pages: topic name), url (absolute page URL),
           article (issue_article pages: issue1_articles/<slug>.json dict),
           episode (episode pages: episodes/<slug>.json dict), game_id (game pages).
Optional:  articles (list/dict of issue articles; else read from issue1_articles/), vol (default 1),
           episode_details (list/dict of episode JSON; else read from episodes/*.json),
           games (id -> overrides, e.g. {'caught': {'image': 'assets/x.jpg'}}),
           story_text (else read from story.txt next to this package),
           paths (dict overriding default paths: dives_index, story, episodes, side_eye, work,
                  dive -> format string with {slug}, topic -> format string with {slug}).

One connected @graph per page with stable @ids. Only facts from config/copy/dive data
(no ratings, reviews, prices or invented numbers).
"""
import json
import pathlib
import re

BASE = "https://heatherchappell.com"
PERSON = BASE + "/#person"
WEBSITE = BASE + "/#website"
SIDEEYE = BASE + "/#sideeye"            # Organization (the brand) founded by Heather + Edwin
MAGAZINE = BASE + "/#sideeye-magazine"  # Periodical
SHOW = BASE + "/#sideeye-show"          # CreativeWorkSeries (YouTube show)
EDWIN = BASE + "/#edwin"
CONTROL_BIONICS = BASE + "/#control-bionics"
WAKE_FOREST = BASE + "/#wake-forest"
STORY = BASE + "/#story"

DEFAULT_PATHS = {
    "home": "/",
    "dives_index": "/deep-dives/",
    "dive": "/deep-dives/{slug}/",
    "topic": "/deep-dives/topic/{slug}/",
    "story": "/story/",
    "episodes": "/episodes/",
    "side_eye": "/side-eye/",
    "work": "/work/",
    "episode": "/episodes/{slug}/",
    "episode_topic": "/episodes/topic/{slug}/",
    "games": "/games/",
    "game": "/games/{slug}/",
    "issue_index": "/side-eye/vol-{vol}/",
    "issue_article": "/side-eye/vol-{vol}/{slug}/",
}
ISSUE_DATE = {1: "2026-10-24"}  # print publication date of each issue

YT_CHANNEL = "https://www.youtube.com/@SideEyeMag"
LINKEDIN = "https://www.linkedin.com/in/growthmktg"
STORY_TITLE = "Ms. Halprin's Overly Familiar Cloud"

KNOWS_ABOUT = [
    "Demand generation", "Growth marketing", "B2B SaaS marketing",
    "Account-based marketing (ABM)", "Lifecycle and email marketing", "Paid media",
    "Marketing analytics", "Marketing attribution", "Predictive modeling",
    "Generative AI in marketing", "Go-to-market strategy",
    "History", "Media history", "Investigative research", "Fiction writing", "Satire",
]
MARKETING_SKILLS = [
    "Demand generation", "Account-based marketing (ABM)", "Lifecycle and email marketing",
    "Paid media", "Marketing analytics and attribution", "Predictive modeling",
    "Generative AI in marketing", "HubSpot", "Salesforce", "Marketo", "6sense",
]


# ---------------------------------------------------------------- helpers
def _abs(p):
    if not p:
        return p
    if p.startswith("http://") or p.startswith("https://"):
        return p
    return BASE + "/" + p.lstrip("/")


def slugify(s):
    return re.sub(r"[^a-z0-9]+", "-", (s or "").lower()).strip("-")


def _path(ctx, key, **kw):
    p = dict(DEFAULT_PATHS, **(ctx.get("paths") or {}))[key]
    return _abs(p.format(**kw))


def _ref(i):
    return {"@id": i}


def _clean(o):
    """Drop None / empty values recursively."""
    if isinstance(o, dict):
        return {k: _clean(v) for k, v in o.items() if v not in (None, "", [], {})}
    if isinstance(o, list):
        return [_clean(v) for v in o if v not in (None, "", [], {})]
    return o


def _iso_duration(rt):
    try:
        secs = 0
        for part in str(rt).split(":"):
            secs = secs * 60 + int(part)
    except ValueError:
        return None
    if secs <= 0:
        return None
    h, rem = divmod(secs, 3600)
    m, s = divmod(rem, 60)
    return "PT" + (f"{h}H" if h else "") + (f"{m}M" if m else "") + (f"{s}S" if s else "")


def _words(text):
    return len(re.findall(r"[A-Za-z0-9’'\-]+", text or ""))


def _cfg_dives(ctx):
    return (ctx.get("cfg") or {}).get("deepDives", []) or []


def _dive_meta(ctx, slug):
    for d in _cfg_dives(ctx):
        if d.get("slug") == slug:
            return d
    return {}


def _issue(ctx):
    for i in (ctx.get("cfg") or {}).get("issues", []) or []:
        if i.get("status") == "out":
            return i
    return None


def _episodes(ctx):
    return (((ctx.get("cfg") or {}).get("youtube") or {}).get("episodes")) or []


# ---------------------------------------------------------------- entities
def person(ctx, full=True):
    cfg = ctx.get("cfg") or {}
    copy = ctx.get("copy") or {}
    roles = (cfg.get("work") or {}).get("roles") or []
    cur = roles[0] if roles else {}
    head = (cfg.get("about") or {}).get("headshot") or "assets/headshot.jpg"
    p = {
        "@type": "Person",
        "@id": PERSON,
        "name": "Heather Chappell",
        "url": BASE + "/",
        "image": {"@type": "ImageObject", "@id": BASE + "/#headshot", "url": _abs(head),
                  "caption": "Heather Chappell"},
        "description": ("Writer, co-creator and co-host of SIDE EYE (a history magazine and "
                        "YouTube show), and B2B SaaS demand generation and growth marketing "
                        "leader with 17 years of experience."),
        "jobTitle": cur.get("title") or "Demand Generation Manager, NeuroTech",
        "worksFor": {"@type": "Organization", "@id": CONTROL_BIONICS,
                     "name": cur.get("org") or "Control Bionics"},
        "alumniOf": {"@type": "CollegeOrUniversity", "@id": WAKE_FOREST,
                     "name": "Wake Forest University",
                     "sameAs": "https://en.wikipedia.org/wiki/Wake_Forest_University"},
        "sameAs": [LINKEDIN],
    }
    if full:
        p.update({
            "hasOccupation": [
                {"@type": "Occupation", "name": "Demand Generation & Growth Marketing Leader",
                 "occupationalCategory": "Marketing",
                 "description": (copy.get("work") or {}).get("intro"),
                 "skills": ", ".join(MARKETING_SKILLS)},
                {"@type": "Occupation", "name": "Writer"},
            ],
            "knowsAbout": KNOWS_ABOUT,
        })
    return _clean(p)


def edwin():
    return {"@type": "Person", "@id": EDWIN, "name": "Edwin Galloway",
            "description": "Co-creator and co-host of SIDE EYE"}


def website(ctx):
    meta = (ctx.get("copy") or {}).get("meta") or {}
    return _clean({
        "@type": "WebSite", "@id": WEBSITE, "url": BASE + "/",
        "name": "Heather Chappell",
        "alternateName": "heatherchappell.com",
        "description": meta.get("description"),
        "inLanguage": "en",
        "publisher": _ref(PERSON),
        "about": _ref(PERSON),
    })


def sideeye_org(ctx):
    return {
        "@type": "Organization", "@id": SIDEEYE,
        "name": "SIDE EYE",
        "alternateName": ["SIDE EYE Magazine", "Side Eye Magazine", "@SideEyeMag"],
        "slogan": "History, allegedly",
        "description": "A history magazine and YouTube show created and hosted by Heather Chappell and Edwin Galloway.",
        "url": _path(ctx, "side_eye"),
        "founder": [_ref(PERSON), _ref(EDWIN)],
        "sameAs": [YT_CHANNEL],
    }


def magazine(ctx):
    return {
        "@type": "Periodical", "@id": MAGAZINE,
        "name": "SIDE EYE",
        "alternateName": "SIDE EYE Magazine",
        "description": "History, allegedly. A print history magazine with every claim footnoted.",
        "url": _path(ctx, "side_eye"),
        "inLanguage": "en",
        "genre": "History",
        "publisher": _ref(SIDEEYE),
        "creator": [_ref(PERSON), _ref(EDWIN)],
    }


def issue_node(ctx):
    i = _issue(ctx)
    if not i:
        return None
    return _clean({
        "@type": "PublicationIssue",
        "@id": BASE + f"/#sideeye-vol{i.get('vol', 1)}",
        "name": f"SIDE EYE Vol. {i.get('vol', 1)}: {i.get('title', '')}".strip(),
        "alternateName": i.get("title"),
        "issueNumber": str(i.get("vol", 1)),
        "isPartOf": _ref(MAGAZINE),
        "author": [_ref(PERSON), _ref(EDWIN)],
        "publisher": _ref(SIDEEYE),
        "image": _abs(i.get("cover") or "assets/cover-vol1.jpg"),
        "description": ((ctx.get("copy") or {}).get("sideeye") or {}).get("issue_blurb"),
        "inLanguage": "en",
        "url": issue_url(ctx),
        "datePublished": ISSUE_DATE.get(int(i.get("vol", 1))),
        "sameAs": [i["amazon"]] if i.get("amazon") else None,
        "citation": i.get("sources"),
    })


def show(ctx):
    copy = (ctx.get("copy") or {}).get("sideeye") or {}
    return _clean({
        "@type": "CreativeWorkSeries", "@id": SHOW,
        "name": "SIDE EYE",
        "alternateName": "Side Eye Magazine on YouTube",
        "description": copy.get("show_pitch"),
        "url": YT_CHANNEL,
        "sameAs": [YT_CHANNEL],
        "genre": "History",
        "inLanguage": "en",
        "publisher": _ref(SIDEEYE),
        "creator": [_ref(PERSON), _ref(EDWIN)],
    })


def video_id(ep):
    return BASE + f"/#video-{ep.get('id')}"


def video(ep, page_url=None):
    vid = (ep.get("id") or "").strip()
    if not vid:
        return None
    title = (ep.get("title") or "").strip() or "SIDE EYE episode"
    label = (ep.get("ep") or "").strip()
    # Same wording as the video sitemap (seo/sitemap.py) so both sources agree.
    desc = ep.get("description") or (
        f"SIDE EYE {label}: {title}. A history show from Heather Chappell and Edwin "
        f"for people who suspected the story they were told was incomplete."
    ).replace("  ", " ")
    thumb = _abs(ep["thumb"]) if ep.get("thumb") else f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg"
    return _clean({
        "@type": "VideoObject", "@id": video_id(ep),
        "name": title,
        "description": desc,
        "thumbnailUrl": [thumb],
        "uploadDate": ep.get("date"),
        "duration": _iso_duration(ep.get("runtime")) if ep.get("runtime") else None,
        "embedUrl": f"https://www.youtube.com/embed/{vid}",
        "url": page_url or f"https://www.youtube.com/watch?v={vid}",
        "inLanguage": "en",
        "isFamilyFriendly": True,
        "isPartOf": _ref(SHOW),
        "partOfSeries": _ref(SHOW),
        "creator": [_ref(PERSON), _ref(EDWIN)],
        "publisher": _ref(SIDEEYE),
    })


def _episode_details(ctx):
    """Per-episode JSON (episodes/<slug>.json), keyed by YouTube id."""
    eps = ctx.get("episode_details")
    if eps is None:
        d = pathlib.Path(__file__).resolve().parent.parent / "episodes"
        eps = []
        for f in sorted(d.glob("*.json")) if d.exists() else []:
            try:
                eps.append(json.loads(f.read_text(encoding="utf-8")))
            except ValueError:
                pass
    if isinstance(eps, dict):
        eps = list(eps.values())
    if ctx.get("episode"):
        eps = [e for e in eps if e.get("id") != ctx["episode"].get("id")] + [ctx["episode"]]
    return {e["id"]: e for e in eps if e.get("id")}


def _merged_episode(ctx, cfg_ep, detail):
    ep = dict(cfg_ep or {})
    for k, v in (detail or {}).items():
        if v not in (None, "", [], {}) and k != "thumb":
            ep[k] = v
    if not ep.get("thumb") and detail and detail.get("thumb"):
        ep["thumb"] = detail["thumb"]
    if ep.get("duration") and not ep.get("runtime"):
        ep["runtime"] = ep["duration"]
    return ep


def _seconds(t):
    if isinstance(t, (int, float)):
        return int(t)
    try:
        secs = 0
        for part in str(t).split(":"):
            secs = secs * 60 + int(float(part))
        return secs
    except ValueError:
        return None


def _duration_iso(v):
    if not v:
        return None
    if isinstance(v, str) and v.startswith("PT"):
        return v
    secs = _seconds(v)
    return _iso_duration(f"{secs}") if secs else None


def episode_video(ctx, ep, full=False):
    """VideoObject for one merged episode; full=True adds chapters, topics, transcript."""
    slug = ep.get("slug")
    page = _path(ctx, "episode", slug=slug) if slug else None
    v = video(ep, page)
    if not v:
        return None
    if ep.get("summary") or ep.get("description"):
        v["description"] = ep.get("description") or ep.get("summary")
    dur = _duration_iso(ep.get("duration") or ep.get("runtime"))
    if dur:
        v["duration"] = dur
    topics = [t for t in (ep.get("topics") or []) if t]
    if topics:
        v["keywords"] = ", ".join(topics)
    if full:
        v["abstract"] = ep.get("summary")
        v["about"] = [{"@type": "Thing", "name": t} for t in topics]
        clips, chs = [], [c for c in (ep.get("chapters") or []) if c.get("title")]
        starts = [_seconds(c.get("t")) for c in chs]
        total = _seconds(ep.get("duration") or ep.get("runtime")) if not str(
            ep.get("duration") or "").startswith("PT") else None
        for i, c in enumerate(chs):
            st = starts[i]
            if st is None:
                continue
            clip = {"@type": "Clip", "name": c["title"], "startOffset": st,
                    "url": (f"{BASE}/episodes/{ep['slug']}/?t={st}" if ep.get("slug")
                            else f"https://www.youtube.com/watch?v={ep['id']}&t={st}s")}
            nxt = starts[i + 1] if i + 1 < len(starts) else total
            if nxt and nxt > st:
                clip["endOffset"] = nxt
            clips.append(clip)
        v["hasPart"] = clips
        tr = ep.get("transcript")
        if isinstance(tr, list):
            tr = "\n".join(x.get("text", "") for x in tr if isinstance(x, dict))
        v["transcript"] = tr
        if page:
            v["mainEntityOfPage"] = _ref(page + "#webpage")
    return _clean(v)


def videos(ctx, full_id=None):
    det = _episode_details(ctx)
    out = []
    for e in _episodes(ctx):
        ep = _merged_episode(ctx, e, det.get(e.get("id")))
        v = episode_video(ctx, ep, full=(e.get("id") == full_id))
        if v and v.get("uploadDate"):
            out.append(v)
    return out


def _episode_matches(ep, topic):
    names = list(ep.get("topics") or [])
    for g in ep.get("topic_groups") or []:
        names.append(g.get("name") or g.get("title") if isinstance(g, dict) else g)
    return any(slugify(n) == slugify(topic) for n in names if n)


# ---------------------------------------------------------------- games
GAMES = [  # order shown on the site; title/tagline are read from games/<id>.js when present
    {"id": "caught", "title": "Don't Get Caught", "genre": ["Stealth", "Comedy"],
     "about": "Office culture",
     "description": "Give the side-eye during an all-hands meeting and look away before anyone "
                    "catches you. A free comedy stealth game that runs in the browser."},
    {"id": "buzzword", "title": "Buzzword Invaders", "genre": ["Shooter", "Comedy"],
     "about": "Office culture",
     "description": "Defend your calendar by shooting down descending office jargon. "
                    "A free comedy arcade shooter about office culture that runs in the browser."},
    {"id": "allegedly", "title": "Allegedly", "genre": ["Trivia", "Educational"],
     "about": "History",
     "description": "Sort popular history claims into myth or fact. "
                    "A free history trivia game that runs in the browser."},
    {"id": "sommelier", "title": "Side-Eye Sommelier", "genre": ["Timing", "Comedy"],
     "description": "Pair each offense with the right vintage of side-eye, on time. "
                    "A free comedy timing game that runs in the browser."},
]


def _game_js_meta(gid):
    f = pathlib.Path(__file__).resolve().parent.parent / "games" / f"{gid}.js"
    if not f.exists():
        return {}
    src = f.read_text(encoding="utf-8", errors="ignore")
    m = re.search(r"HC_GAMES(?:\[[^\]]*\]|\.\w+)\s*=\s*\{\s*title:\s*([\"'])(.*?)\1\s*,\s*tagline:\s*([\"'])(.*?)\3", src, re.S)
    return {"js_title": m.group(2), "tagline": m.group(4)} if m else {}


def _games(ctx):
    over = ctx.get("games") or {}
    out = []
    for g in GAMES:
        g = dict(g, **_game_js_meta(g["id"]), **(over.get(g["id"]) or {}))
        out.append(g)
    return out


def game_node(ctx, g, full=True):
    url = _path(ctx, "game", slug=g["id"])
    n = {"@type": "VideoGame", "@id": url + "#game", "url": url, "name": g["title"]}
    if full:
        n.update({
            "description": g.get("description"),
            "alternativeHeadline": g.get("tagline"),
            "genre": g.get("genre"),
            "about": {"@type": "Thing", "name": g["about"]} if g.get("about") else None,
            "gamePlatform": "Web browser",
            "applicationCategory": "Game",
            "operatingSystem": "Any",
            "playMode": "SinglePlayer",
            "isAccessibleForFree": True,
            "inLanguage": "en",
            "image": _abs(g["image"]) if g.get("image") else None,
            "author": _ref(PERSON),
            "publisher": _ref(PERSON),
            "isPartOf": _ref(WEBSITE),
        })
    return _clean(n)


def webpage(ctx, typ, name, description=None, crumbs=False, **extra):
    url = ctx["url"]
    n = {
        "@type": typ, "@id": url + "#webpage", "url": url, "name": name,
        "description": description, "isPartOf": _ref(WEBSITE), "inLanguage": "en",
    }
    if crumbs:
        n["breadcrumb"] = _ref(url + "#breadcrumb")
    n.update(extra)
    return _clean(n)


def breadcrumb(ctx, trail):
    """trail: list of (name, url) — last item's url may be None (current page)."""
    items = []
    for i, (name, url) in enumerate(trail, 1):
        li = {"@type": "ListItem", "position": i, "name": name}
        if url:
            li["item"] = url
        items.append(li)
    return {"@type": "BreadcrumbList", "@id": ctx["url"] + "#breadcrumb", "itemListElement": items}


def item_list(ctx, name, urls_or_refs):
    els = []
    for i, x in enumerate(urls_or_refs, 1):
        li = {"@type": "ListItem", "position": i}
        if isinstance(x, dict):
            li["item"] = x
        else:
            li["url"] = x
        els.append(li)
    return {"@type": "ItemList", "@id": ctx["url"] + "#itemlist", "name": name,
            "numberOfItems": len(els), "itemListElement": els}


def dive_url(ctx, slug):
    return _path(ctx, "dive", slug=slug)


def dive_article(ctx, slug, url=None):
    d = (ctx.get("dives") or {}).get(slug) or {}
    m = _dive_meta(ctx, slug)
    url = url or dive_url(ctx, slug)
    topic = m.get("topic") or d.get("topic")
    people = [{"@type": "Person", "name": p["name"]} for p in d.get("people", []) if p.get("name")]
    links = d.get("links") or []
    return _clean({
        "@type": "Article", "@id": url + "#article",
        "headline": (d.get("title") or m.get("title") or "")[:110],
        "name": d.get("title") or m.get("title"),
        "genre": "analysis",
        "articleSection": topic,
        "datePublished": d.get("date") or m.get("date"),
        "author": {"@id": PERSON, "@type": "Person", "name": "Heather Chappell", "url": BASE + "/"},
        "publisher": _ref(PERSON),
        "wordCount": d.get("words") or m.get("words"),
        "abstract": d.get("bottomLine") or m.get("bottomLine"),
        "description": d.get("bottomLine") or m.get("bottomLine"),
        "about": [{"@type": "Thing", "name": topic}] if topic else None,
        "mentions": people,
        "citation": [{"@type": "CreativeWork", "url": u} for u in links[:20]],
        "mainEntityOfPage": _ref(url + "#webpage"),
        "isPartOf": _ref(WEBSITE),
        "inLanguage": "en",
        "isAccessibleForFree": True,
        "url": url,
    })


def dive_summary_ref(ctx, m):
    """Lightweight Article node used inside list pages."""
    url = dive_url(ctx, m["slug"])
    return _clean({"@type": "Article", "@id": url + "#article", "url": url,
                   "headline": m.get("title", "")[:110], "datePublished": m.get("date"),
                   "articleSection": m.get("topic"), "author": _ref(PERSON)})


def story_word_count(ctx):
    text = ctx.get("story_text")
    if text is None:
        f = pathlib.Path(__file__).resolve().parent.parent / "story.txt"
        text = f.read_text(encoding="utf-8") if f.exists() else ""
    body = "\n".join(l for l in text.splitlines()
                     if not re.match(r"\s*(TITLE:|AUTHOR:|\[\[.*\]\]\s*$)", l))
    return _words(body) or None


def story_node(ctx, url=None):
    fic = (ctx.get("copy") or {}).get("fiction") or {}
    url = url or _path(ctx, "story")
    return _clean({
        "@type": ["ShortStory", "CreativeWork"], "@id": STORY,
        "name": fic.get("title") or STORY_TITLE,
        "headline": fic.get("title") or STORY_TITLE,
        "description": fic.get("sub"),
        "author": _ref(PERSON),
        "publisher": _ref(PERSON),
        "genre": ["Satire", "Short fiction"],
        "inLanguage": "en",
        "isAccessibleForFree": True,
        "url": url,
    })


# ---------------------------------------------------------------- online issue
def _issue_articles(ctx):
    a = ctx.get("articles")
    if a is None:
        d = pathlib.Path(__file__).resolve().parent.parent / "issue1_articles"
        a = []
        for f in sorted(d.glob("*.json")) if d.exists() else []:
            try:
                a.append(json.loads(f.read_text(encoding="utf-8")))
            except ValueError:
                pass
    if isinstance(a, dict):
        a = list(a.values())
    return sorted([x for x in a if x.get("slug")], key=lambda x: (x.get("order") or 999, x["slug"]))


def _block_text(blocks):
    out = []
    for b in blocks or []:
        for k in ("text", "title", "cite"):
            if isinstance(b.get(k), str):
                out.append(b[k])
        out += [i for i in b.get("items", []) if isinstance(i, str)]
        for row in b.get("rows", []) or []:
            out += [c for c in row if isinstance(c, str)]
        out.append(_block_text(b.get("blocks")))
    return " ".join(out)


def _vol(ctx):
    i = _issue(ctx) or {}
    return int(ctx.get("vol") or i.get("vol") or 1)


def issue_url(ctx):
    return _path(ctx, "issue_index", vol=_vol(ctx))


def article_url(ctx, slug):
    return _path(ctx, "issue_article", vol=_vol(ctx), slug=slug)


def _authors_from_byline(byline):
    """Authors named in the printed byline (defaults to Heather)."""
    if not byline:
        return [_ref(PERSON)]
    out = []
    if "heather" in byline.lower() or "chappell" in byline.lower():
        out.append(_ref(PERSON))
    if "edwin" in byline.lower():
        out.append(_ref(EDWIN))
    return out or [_ref(PERSON)]


def issue_article(ctx, a, url=None, full=True):
    url = url or article_url(ctx, a["slug"])
    vol = _vol(ctx)
    topics = [t for t in (a.get("topics") or []) if t]
    node = {
        "@type": "Article", "@id": url + "#article", "url": url,
        "headline": (a.get("title") or "")[:110],
        "name": a.get("title"),
        "datePublished": ISSUE_DATE.get(vol),
        "author": _authors_from_byline(a.get("byline")),
        "isPartOf": _ref(BASE + f"/#sideeye-vol{vol}"),
        "image": _abs(a.get("hero")) if a.get("hero") else None,
    }
    if full:
        node.update({
            "alternativeHeadline": a.get("dek"),
            "description": a.get("summary"),
            "about": [{"@type": "Thing", "name": t} for t in topics],
            "keywords": ", ".join(topics) or None,
            "articleSection": a.get("section"),
            "genre": "History",
            "publisher": _ref(SIDEEYE),
            "pageStart": str(a["order"]) if a.get("order") else None,
            "wordCount": _words(_block_text(a.get("blocks"))) or None,
            "citation": [s for s in (a.get("sources") or []) if s],
            "mainEntityOfPage": _ref(url + "#webpage"),
            "inLanguage": "en",
            "isAccessibleForFree": True,
        })
    return _clean(node)


def _issue_with_parts(ctx, arts):
    n = issue_node(ctx)
    if not n:
        return None
    vol = _vol(ctx)
    n["url"] = issue_url(ctx)
    n["datePublished"] = ISSUE_DATE.get(vol)
    n["hasPart"] = [_ref(article_url(ctx, a["slug"]) + "#article") for a in arts]
    return _clean(n)


# ---------------------------------------------------------------- pages
def _base_nodes(ctx, full_person=True):
    return [person(ctx, full=full_person), edwin(), website(ctx), sideeye_org(ctx)]


def _sideeye_nodes(ctx):
    return [n for n in (magazine(ctx), issue_node(ctx), show(ctx)) if n]


def _page_home(ctx):
    meta = (ctx.get("copy") or {}).get("meta") or {}
    vids = videos(ctx)
    nodes = _base_nodes(ctx) + _sideeye_nodes(ctx) + vids + [story_node(ctx)]
    nodes.append(webpage(ctx, "ProfilePage", meta.get("title") or "Heather Chappell",
                         meta.get("description"), mainEntity=_ref(PERSON),
                         about=_ref(PERSON), primaryImageOfPage=_ref(BASE + "/#headshot"),
                         hasPart=[_ref(v["@id"]) for v in vids]))
    return nodes


def _page_work(ctx):
    copy = ctx.get("copy") or {}
    w = copy.get("work") or {}
    nodes = _base_nodes(ctx)
    nodes.append(webpage(ctx, "ProfilePage", f"Heather Chappell — {w.get('title') or 'Work'}",
                         w.get("intro"), crumbs=True, mainEntity=_ref(PERSON),
                         about=_ref(PERSON), primaryImageOfPage=_ref(BASE + "/#headshot")))
    nodes.append(breadcrumb(ctx, [("Home", BASE + "/"), ("Work", None)]))
    return nodes


def _page_dive(ctx):
    slug = ctx["slug"]
    d = (ctx.get("dives") or {}).get(slug) or {}
    m = _dive_meta(ctx, slug)
    title = d.get("title") or m.get("title") or slug
    nodes = _base_nodes(ctx, full_person=False)
    nodes.append(webpage(ctx, "WebPage", title, d.get("bottomLine") or m.get("bottomLine"),
                         crumbs=True, mainEntity=_ref(ctx["url"] + "#article"),
                         datePublished=d.get("date") or m.get("date"), author=_ref(PERSON)))
    nodes.append(dive_article(ctx, slug, ctx["url"]))
    nodes.append(breadcrumb(ctx, [("Home", BASE + "/"),
                                  ("Deep Dives", _path(ctx, "dives_index")), (title, None)]))
    return nodes


def _page_dives_index(ctx):
    r = (ctx.get("copy") or {}).get("reading") or {}
    ms = [m for m in _cfg_dives(ctx) if m.get("slug")]
    arts = [dive_summary_ref(ctx, m) for m in ms]
    nodes = _base_nodes(ctx, full_person=False)
    nodes.append(webpage(ctx, "CollectionPage", "Deep Dives by Heather Chappell", r.get("intro"),
                         crumbs=True, mainEntity=_ref(ctx["url"] + "#itemlist"),
                         author=_ref(PERSON)))
    nodes.append(item_list(ctx, "Deep Dives", [a["url"] for a in arts]))
    nodes += arts
    nodes.append(breadcrumb(ctx, [("Home", BASE + "/"), ("Deep Dives", None)]))
    return nodes


def _page_topic(ctx):
    topic = ctx["topic"]
    ms = [m for m in _cfg_dives(ctx) if m.get("slug") and
          slugify(m.get("topic")) == slugify(topic)]
    arts = [dive_summary_ref(ctx, m) for m in ms]
    nodes = _base_nodes(ctx, full_person=False)
    nodes.append(webpage(ctx, "CollectionPage", f"{topic} Deep Dives by Heather Chappell",
                         f"Heather Chappell's Deep Dive briefings on {topic.lower()}.",
                         crumbs=True, mainEntity=_ref(ctx["url"] + "#itemlist"),
                         about={"@type": "Thing", "name": topic}, author=_ref(PERSON)))
    nodes.append(item_list(ctx, f"{topic} Deep Dives", [a["url"] for a in arts]))
    nodes += arts
    nodes.append(breadcrumb(ctx, [("Home", BASE + "/"),
                                  ("Deep Dives", _path(ctx, "dives_index")), (topic, None)]))
    return nodes


def _page_story(ctx):
    sn = story_node(ctx, ctx["url"])
    sn["wordCount"] = story_word_count(ctx)
    sn["mainEntityOfPage"] = _ref(ctx["url"] + "#webpage")
    sn = _clean(sn)
    nodes = _base_nodes(ctx, full_person=False)
    nodes.append(webpage(ctx, "WebPage", f"{sn['name']} — a short story by Heather Chappell",
                         sn.get("description"), crumbs=True, mainEntity=_ref(STORY),
                         author=_ref(PERSON)))
    nodes.append(sn)
    nodes.append(breadcrumb(ctx, [("Home", BASE + "/"), (sn["name"], None)]))
    return nodes


def _page_episodes(ctx):
    vids = videos(ctx)
    nodes = _base_nodes(ctx, full_person=False) + [show(ctx)] + vids
    nodes.append(webpage(ctx, "CollectionPage", "SIDE EYE episodes",
                         ((ctx.get("copy") or {}).get("sideeye") or {}).get("show_pitch"),
                         crumbs=True, mainEntity=_ref(ctx["url"] + "#itemlist"),
                         about=_ref(SHOW)))
    nodes.append(item_list(ctx, "SIDE EYE episodes", [_ref(v["@id"]) for v in vids]))
    nodes.append(breadcrumb(ctx, [("Home", BASE + "/"), ("Episodes", None)]))
    return nodes


def _page_side_eye(ctx):
    se = (ctx.get("copy") or {}).get("sideeye") or {}
    vids = videos(ctx)
    nodes = _base_nodes(ctx, full_person=False) + _sideeye_nodes(ctx) + vids
    nodes.append(webpage(ctx, "WebPage", "SIDE EYE Magazine: History, allegedly",
                         se.get("pitch"), crumbs=True, mainEntity=_ref(SIDEEYE),
                         about=[_ref(SIDEEYE), _ref(MAGAZINE), _ref(SHOW)],
                         hasPart=[_ref(v["@id"]) for v in vids]))
    nodes.append(breadcrumb(ctx, [("Home", BASE + "/"), ("SIDE EYE", None)]))
    return nodes


def _page_issue_index(ctx):
    arts = _issue_articles(ctx)
    i = _issue(ctx) or {}
    title = f"SIDE EYE Vol. {_vol(ctx)}: {i.get('title', '')}".strip()
    nodes = _base_nodes(ctx, full_person=False) + [magazine(ctx), show(ctx)]
    issue = _issue_with_parts(ctx, arts)
    nodes.append(issue)
    nodes.append(webpage(ctx, "CollectionPage", title + " (read online)",
                         ((ctx.get("copy") or {}).get("sideeye") or {}).get("issue_blurb"),
                         crumbs=True, mainEntity=_ref(issue["@id"]) if issue else None,
                         primaryImageOfPage=issue.get("image") if issue else None))
    nodes += [issue_article(ctx, a, full=False) for a in arts]
    nodes.append(breadcrumb(ctx, [("Home", BASE + "/"), ("SIDE EYE", _path(ctx, "side_eye")),
                                  (f"Vol. {_vol(ctx)}", None)]))
    return nodes


def _page_issue_article(ctx):
    a = ctx["article"]
    art = issue_article(ctx, a, ctx["url"])
    nodes = _base_nodes(ctx, full_person=False) + [magazine(ctx)]
    nodes.append(_issue_with_parts(ctx, _issue_articles(ctx) or [a]))
    nodes.append(webpage(ctx, "WebPage", a.get("title"), a.get("summary"), crumbs=True,
                         mainEntity=_ref(art["@id"]), primaryImageOfPage=art.get("image"),
                         datePublished=art.get("datePublished")))
    nodes.append(art)
    nodes.append(breadcrumb(ctx, [("Home", BASE + "/"), ("SIDE EYE", _path(ctx, "side_eye")),
                                  (f"Vol. {_vol(ctx)}", issue_url(ctx)), (a.get("title"), None)]))
    return nodes


def _page_episode(ctx):
    ep_d = ctx["episode"]
    cfg_ep = next((e for e in _episodes(ctx) if e.get("id") == ep_d.get("id")), {})
    ep = _merged_episode(ctx, cfg_ep, ep_d)
    v = episode_video(ctx, ep, full=True)
    v["url"] = ctx["url"]
    v["mainEntityOfPage"] = _ref(ctx["url"] + "#webpage")
    nodes = _base_nodes(ctx, full_person=False) + [show(ctx), v]
    nodes.append(webpage(ctx, "WebPage", ep.get("title"), ep.get("summary") or v.get("description"),
                         crumbs=True, mainEntity=_ref(v["@id"]), datePublished=ep.get("date"),
                         primaryImageOfPage=(v.get("thumbnailUrl") or [None])[0]))
    nodes.append(breadcrumb(ctx, [("Home", BASE + "/"), ("Episodes", _path(ctx, "episodes")),
                                  (ep.get("title"), None)]))
    return nodes


def _page_episode_topic(ctx):
    topic = ctx["topic"]
    det = _episode_details(ctx)
    keep = {i for i, e in det.items() if _episode_matches(e, topic)}
    vids = [v for v in videos(ctx) if v["@id"].rsplit("#video-", 1)[-1] in keep]
    nodes = _base_nodes(ctx, full_person=False) + [show(ctx)] + vids
    nodes.append(webpage(ctx, "CollectionPage", f"SIDE EYE episodes about {topic}",
                         f"SIDE EYE episodes about {topic}, with Heather Chappell and Edwin Galloway.",
                         crumbs=True, mainEntity=_ref(ctx["url"] + "#itemlist"),
                         about={"@type": "Thing", "name": topic}))
    nodes.append(item_list(ctx, f"SIDE EYE episodes: {topic}", [_ref(v["@id"]) for v in vids]))
    nodes.append(breadcrumb(ctx, [("Home", BASE + "/"), ("Episodes", _path(ctx, "episodes")),
                                  (topic, None)]))
    return nodes


def _page_games(ctx):
    gi = (ctx.get("copy") or {}).get("games_intro") or {}
    gs = [game_node(ctx, g) for g in _games(ctx)]
    nodes = _base_nodes(ctx, full_person=False) + gs
    nodes.append(webpage(ctx, "CollectionPage", "The Side-Eye Arcade: free browser games",
                         gi.get("sub"), crumbs=True, mainEntity=_ref(ctx["url"] + "#itemlist")))
    nodes.append(item_list(ctx, "The Side-Eye Arcade", [_ref(g["@id"]) for g in gs]))
    nodes.append(breadcrumb(ctx, [("Home", BASE + "/"), ("Games", None)]))
    return nodes


def _page_game(ctx):
    g = next(x for x in _games(ctx) if x["id"] == ctx["game_id"])
    n = game_node(ctx, g)
    n["url"] = ctx["url"]
    n["mainEntityOfPage"] = _ref(ctx["url"] + "#webpage")
    nodes = _base_nodes(ctx, full_person=False) + [n]
    nodes.append(webpage(ctx, "WebPage", f"{g['title']}: a free browser game", g.get("description"),
                         crumbs=True, mainEntity=_ref(n["@id"])))
    nodes.append(breadcrumb(ctx, [("Home", BASE + "/"), ("Games", _path(ctx, "games")),
                                  (g["title"], None)]))
    return nodes


PAGES = {
    "episode": _page_episode, "episode_topic": _page_episode_topic,
    "games": _page_games, "game": _page_game,
    "issue_index": _page_issue_index, "issue_article": _page_issue_article,
    "home": _page_home, "work": _page_work, "dive": _page_dive,
    "dives_index": _page_dives_index, "topic": _page_topic, "story": _page_story,
    "episodes": _page_episodes, "side_eye": _page_side_eye,
}


def graph(page_type, ctx):
    if page_type not in PAGES:
        raise ValueError(f"unknown page_type {page_type!r}; expected one of {sorted(PAGES)}")
    ctx = dict(ctx)
    if not ctx.get("url"):
        if page_type == "issue_index":
            ctx["url"] = issue_url(ctx)
        elif page_type == "issue_article":
            ctx["url"] = article_url(ctx, ctx["article"]["slug"])
        elif page_type == "episode":
            ctx["url"] = _path(ctx, "episode", slug=ctx["episode"]["slug"])
        elif page_type == "episode_topic":
            ctx["url"] = _path(ctx, "episode_topic", slug=slugify(ctx["topic"]))
        elif page_type == "game":
            ctx["url"] = _path(ctx, "game", slug=ctx["game_id"])
        elif page_type not in ("dive", "topic"):
            ctx["url"] = _path(ctx, page_type)
    if page_type == "dive" and not ctx.get("url"):
        ctx["url"] = dive_url(ctx, ctx["slug"])
    if page_type == "topic" and not ctx.get("url"):
        ctx["url"] = _path(ctx, "topic", slug=slugify(ctx["topic"]))
    nodes = [n for n in PAGES[page_type](ctx) if n]
    return {"@context": "https://schema.org", "@graph": nodes}


def jsonld(page_type: str, ctx: dict) -> str:
    data = graph(page_type, ctx)
    s = json.dumps(data, ensure_ascii=False, indent=1)
    s = s.replace("</", "<\\/")  # never break out of the <script> element
    return f'<script type="application/ld+json">\n{s}\n</script>'
