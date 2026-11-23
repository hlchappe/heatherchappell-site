"""Per-page SEO metadata for heatherchappell.com.

page_meta(page_type, ctx) -> dict(title, description, og_title, og_description, og_image)

page_type: home | games | game | side_eye | episode | episode_topic | issue_index | issue_article | episodes | dives_index | topic | dive | story | work
ctx keys used:
  dive  -> ctx['slug'], ctx['dives']  (dict slug->dive json, or list of config deepDives entries)
  issue_article -> ctx['article'] (issue1_articles/<slug>.json, see ISSUE_SCHEMA.md)
  game -> ctx['game_id'] (caught | buzzword | allegedly | sommelier)
  episode -> ctx['episode'] (title, summary, topics; optional id/thumb), ctx['slug'] (emu-war | napoleon | theranos-patents)
  episode_topic -> ctx['topic'] (e.g. "Media & Propaganda")
  topic -> ctx['topic']  (e.g. "Markets"), optional ctx['dives'] to count/list briefings
Rules: titles <= 60 chars, descriptions 140-160 chars, plain and specific (no jokes),
absolute og_image URLs. Facts only from SEO_BRIEF.md.
"""
import re

SITE = "https://heatherchappell.com"
NAME = "Heather Chappell"
COVER = SITE + "/assets/cover-vol1.jpg"
HEADSHOT = SITE + "/assets/headshot.jpg"
EP_THUMB = {"emu": SITE + "/assets/ep-emu.jpg", "napoleon": SITE + "/assets/ep-napoleon.jpg",
            "theranos": SITE + "/assets/ep-theranos.jpg"}

TITLE_MAX, DESC_MIN, DESC_MAX = 60, 140, 160

# Hand-written short titles for briefings whose headline runs past 60 chars with the name.
DIVE_TITLES = {
    "nvidia-sec-probe": "Nvidia's SEC Probe and the AI Boom: A Briefing",
    "fbi-database-breach": "FBI Criminal Database Breach: What's Confirmed",
    "contractor-order": "Trump's Federal Contractor Order, Explained",
    "ncic-intrusion": "NCIC Intrusion: Unconfirmed Breach, Real Risk",
    "market-correction": "AI-Driven Market Correction: A Briefing",
    "iran-gulf-strikes": "Iran's Gulf Strikes: Hormuz, Bahrain and the U.S.",
    "baltic-ukraine-strikes": "Baltic and Ukraine Strikes Test NATO's Limits",
}

# Hand-written descriptions (140-160 chars) for current briefings; new ones fall back to the bottom line.
DIVE_DESCS = {
    "nvidia-sec-probe": "Heather Chappell's briefing on the reported SEC accounting probe into Nvidia: what is confirmed, the AI stock selloff, and who is exposed if the AI boom cracks.",
    "fbi-database-breach": "Heather Chappell's briefing on the reported FBI criminal database breach: credibly sourced, officially unconfirmed, scope and attacker still unknown.",
    "contractor-order": "Heather Chappell's briefing on Trump's federal contractor executive order: how termination, suspension and debarment pre-empt Democratic oversight in January.",
    "ncic-intrusion": "Heather Chappell's briefing on the reported NCIC intrusion at the FBI: an unconfirmed breach whose gravest risk is corrupted records police rely on.",
    "market-correction": "Heather Chappell's briefing on the November 2026 market correction: a confidence break in AI stocks plus a Bitcoin slide, while chip export policy stays put.",
    "iran-gulf-strikes": "Heather Chappell's briefing on Iran's strikes on Bahrain and tankers near the Strait of Hormuz: a calibrated drone and missile campaign testing U.S. restraint.",
    "baltic-ukraine-strikes": "Heather Chappell's briefing on escalating strikes in Ukraine and the Baltic Sea: how they test NATO's limits as the U.S.-led peace track weakens.",
}

GAMES = {
    "buzzword": ("Buzzword Invaders: A Free Office-Jargon Arcade Game",
                 "Buzzword Invaders is a free browser arcade game about corporate jargon: buzzwords descend on your "
                 "calendar and you shoot them down with a side-eye. No sign-up."),
    "caught": ("Don't Get Caught: A Funny Office-Life Stealth Game",
               "Don't Get Caught is a free stealth game: side-eye the all-hands meeting, Thanksgiving dinner, the "
               "HOA meeting and a wedding toast without getting caught."),
    "sommelier": ("Side-Eye Sommelier: A Funny Workplace Etiquette Game",
                  "Side-Eye Sommelier is a free workplace etiquette game: match each office or neighbor offense, "
                  "like a 4:45 p.m. Friday quick sync, to the right side-eye."),
    "allegedly": ("Allegedly: A Free History Myth-Busting Trivia Game",
                  "Allegedly is a free history trivia game from SIDE EYE: 15 claims a round. Side-eye the myths, "
                  "nod at the facts, and see how much of school history holds up."),
}

# Episode pages: topic keywords first. Hand-written fallbacks if the episode JSON summary is missing or too long.
EPISODES = {
    "emu-war": ("The Emu War & Keith Murdoch's Media Empire | SIDE EYE",
                "SIDE EYE video: how Keith Murdoch, Rupert Murdoch's father, and his newspapers turned "
                "Australia's 1932 Great Emu War into a story that shaped today's media.",
                "ry-CURU1r1k"),
    "napoleon": ("Napoleon Was Their Third Pick: His Backers | SIDE EYE",
                 "SIDE EYE video with Heather Chappell and Edwin on the backers behind Napoleon Bonaparte's "
                 "rise to power, who made him their third pick, and the two before him.",
                 "9Jd4LOEjBzo"),
    "theranos-patents": ("Who Renewed the Theranos Patents After 2018? | SIDE EYE",
                         "Theranos shut down in 2018, yet its patents were just renewed. Heather Chappell and Edwin "
                         "follow the paperwork to who renewed them, and why. A SIDE EYE video.",
                         "MAxg-0yCBug"),
}


# Short, keyword-first titles for issue articles whose printed headline runs long.
ISSUE_TITLES = {
    "hatshepsut": "Hatshepsut Didn't Pretend to Be a Man | SIDE EYE Magazine",
    "lost-cause-textbooks": "The Lost Cause and Civil War Textbooks | SIDE EYE Magazine",
    "final-rose": "History's Biggest Show-Business Flops | SIDE EYE Magazine",
    "stephen-matilda": "Empress Matilda vs. King Stephen | SIDE EYE Magazine",
    "queen-of-hawaii": "Queen Liliʻuokalani vs. the United States | SIDE EYE",
    "napoleon": "Napoleon Wasn't Short or Alone: The 1799 Coup | SIDE EYE",
    "perot": "Ross Perot Had the White House on Speed Dial | SIDE EYE",
}


def _config():
    import json, pathlib
    try:
        return json.loads((pathlib.Path(__file__).resolve().parent.parent / "config.json").read_text())
    except Exception:
        return {}


def _episode_thumb(ep, slug):
    vid = ep.get("id") or (EPISODES.get(slug) or (None, None, None))[2]
    thumb = ep.get("thumb")
    if not thumb:
        for e in (_config().get("youtube") or {}).get("episodes", []):
            if e.get("id") == vid:
                thumb = e.get("thumb")
                break
    if thumb:
        return thumb if thumb.startswith("http") else SITE + "/" + thumb.lstrip("/")
    return f"https://i.ytimg.com/vi/{vid}/maxresdefault.jpg" if vid else COVER


TOPIC_BLURB = {
    "markets": "stock market selloffs, AI stocks, Nvidia, the SEC, Bitcoin and investor risk",
    "cybersecurity": "data breaches, FBI and NCIC criminal database intrusions, and the risks to police records",
    "government": "executive orders, federal contractors, congressional oversight and the Trump administration",
    "world": "Iran, the Strait of Hormuz, the Gulf, NATO, Russia, Ukraine and the Baltic",
}


def _clean(s):
    return re.sub(r"\s+", " ", str(s or "")).strip()


def _title(*options):
    """First option that fits TITLE_MAX; else trim the last option at a word boundary."""
    for o in options:
        o = _clean(o)
        if o and len(o) <= TITLE_MAX:
            return o
    o = _clean(options[-1])
    cut = o[:TITLE_MAX + 1].rsplit(" ", 1)[0].rstrip(" ,:;—-|")
    return cut


def _desc(*parts):
    """Join parts until 140-160 chars; trim at a word boundary if needed."""
    out = ""
    for p in parts:
        p = _clean(p)
        if not p:
            continue
        cand = (out + " " + p).strip()
        if len(cand) <= DESC_MAX:
            out = cand
            if len(out) >= DESC_MIN:
                return out
        elif len(out) < DESC_MIN:
            room = DESC_MAX - len(out) - (1 if out else 0) - 1
            frag = p[:room + 1].rsplit(" ", 1)[0].rstrip(" ,:;—-")
            out = (out + " " + frag).strip() + "…"
            return out
    return out


def _pad(text, *extras):
    """Append whole extra clauses while they fit under DESC_MAX (never truncates text itself)."""
    out = _clean(text)
    for e in extras:
        if len(out) >= DESC_MIN:
            break
        cand = (out + " " + _clean(e)).strip()
        if len(cand) <= DESC_MAX:
            out = cand
    if len(out) > DESC_MAX:
        out = _desc(out)
    return out


def _slugify(s):
    return re.sub(r"[^a-z0-9]+", "-", str(s).lower()).strip("-")


def _find_dive(ctx):
    slug = ctx.get("slug")
    dives = ctx.get("dives") or {}
    if isinstance(dives, dict):
        return dives.get(slug) or {}
    for d in dives:
        if d.get("slug") == slug:
            return d
    return {}


def _first_sentence(s):
    s = _clean(s)
    m = re.match(r"(.+?[.!?])(\s|$)", s)
    return m.group(1) if m else s


def _pack(title, desc, image, og_title=None, og_desc=None):
    return dict(title=title, description=desc, og_title=og_title or title,
                og_description=og_desc or desc, og_image=image)


def page_meta(page_type, ctx=None):
    ctx = ctx or {}
    t = page_type

    if t == "home":
        return _pack(
            "Heather Chappell — Writer, SIDE EYE Host & Growth Marketer",
            "Heather Chappell: writer, co-host of SIDE EYE, the funny history magazine and YouTube "
            "show, and a B2B SaaS demand generation and growth marketing leader.",
            COVER,
            og_title="Heather Chappell — Writer, SIDE EYE Co-Host & Growth Marketer")

    if t == "side_eye":
        return _pack(
            "SIDE EYE: A Funny History Magazine & YouTube Show",
            "SIDE EYE is a funny, irreverent history magazine and YouTube show for adults. "
            "Vol. 1, The Losers Issue: the Emu War, Napoleon, Hannibal, Ross Perot.",
            COVER)

    if t == "games":
        return _pack(
            "Free Funny Office-Life & History Games | Heather Chappell",
            "Four free browser games from Heather Chappell and SIDE EYE: office jargon, office-life stealth, "
            "workplace etiquette and history myth-busting trivia. No sign-up.",
            COVER)

    if t == "game":
        gid = ctx.get("game_id")
        if gid not in GAMES:
            raise ValueError(f"unknown game_id: {gid}")
        title, desc = GAMES[gid]
        return _pack(title, desc, COVER)

    if t == "episode":
        ep = ctx.get("episode") or {}
        slug = ctx.get("slug") or ep.get("slug") or ""
        hand = EPISODES.get(slug)
        et = _clean(ep.get("title"))
        title = hand[0] if hand else _title(f"{et} | SIDE EYE", et)
        summ = _clean(ep.get("summary"))
        desc = ""
        if summ and len(summ) <= DESC_MAX:
            desc = _pad(summ, "A SIDE EYE video with Heather Chappell and Edwin.", "A SIDE EYE video.",
                        "Watch on YouTube.")
        if not (DESC_MIN <= len(desc) <= DESC_MAX):
            desc = hand[1] if hand else _desc(summ or et, "A SIDE EYE video with Heather Chappell and Edwin.")
        return _pack(title, desc, _episode_thumb(ep, slug), og_title=title)

    if t == "episode_topic":
        topic = _clean(ctx.get("topic")) or "History"
        return _pack(
            _title(f"{topic} History Videos | SIDE EYE", f"{topic} Videos | SIDE EYE"),
            _pad(f"SIDE EYE videos about {topic.lower()} in history, from Heather Chappell and Edwin: "
                 "the funny history magazine and YouTube show.",
                 "New episodes at @SideEyeMag.", "History, allegedly."),
            COVER)

    if t == "issue_index":
        return _pack(
            "SIDE EYE Vol. 1: The Losers Issue — Read Online",
            "Read the funny history magazine SIDE EYE online. Vol. 1, The Losers Issue: the Great "
            "Emu War, Hannibal, Napoleon, Ross Perot, Hatshepsut and more.",
            COVER, og_title="SIDE EYE Vol. 1: The Losers Issue — Read the History Magazine Online")

    if t == "issue_article":
        a = ctx.get("article") or {}
        at = _clean(a.get("title")).rstrip(".") or "SIDE EYE Vol. 1"
        short = ISSUE_TITLES.get(a.get("slug") or ctx.get("slug"))
        title = short or _title(f"{at} | SIDE EYE Magazine", f"{at} | SIDE EYE",
                                f"{_first_sentence(at).rstrip('.')} | SIDE EYE", at)
        summ = _clean(a.get("summary")) or _first_sentence(a.get("dek")) or at
        desc = summ
        for extra in ("From SIDE EYE Vol. 1: The Losers Issue.", "From the funny history magazine SIDE EYE.",
                      "From SIDE EYE Vol. 1.", "SIDE EYE Vol. 1."):
            if len(desc) >= DESC_MIN:
                break
            if len(desc) + 1 + len(extra) <= DESC_MAX:
                desc = desc + " " + extra
                break
        desc = _pad(desc, "Read it online.", "History, allegedly.")
        hero = _clean(a.get("hero"))
        img = (SITE + "/" + hero.lstrip("/")) if hero and not hero.startswith("http") else (hero or COVER)
        return _pack(title, desc, img, og_title=f"{at} | SIDE EYE Magazine")

    if t == "episodes":
        return _pack(
            "SIDE EYE Episodes on YouTube | Heather Chappell",
            "SIDE EYE on YouTube with Heather Chappell and Edwin: the Great Emu War and the "
            "Murdoch media empire, Napoleon's backers, and who renewed the Theranos patents.",
            EP_THUMB["theranos"] if ctx.get("latest") == "theranos" else COVER)

    if t == "dives_index":
        return _pack(
            "Deep Dives: News Briefings by Heather Chappell",
            "Deep-dive news briefings by Heather Chappell on markets, cybersecurity, government "
            "and world events, separating what's confirmed from what isn't.",
            HEADSHOT)

    if t == "topic":
        topic = _clean(ctx.get("topic")) or "Topic"
        blurb = TOPIC_BLURB.get(_slugify(topic), topic.lower() + " news and analysis")
        return _pack(
            _title(f"{topic} Deep Dives — Heather Chappell", f"{topic} Deep Dives"),
            _pad(f"{topic} deep-dive briefings by Heather Chappell covering {blurb}.",
                 "Confirmed facts, open questions, sources.", "Sources included.", "Updated as stories develop."),
            HEADSHOT)

    if t == "dive":
        d = _find_dive(ctx)
        slug = ctx.get("slug", "")
        full = _clean(d.get("title")) or "Deep Dive Briefing"
        short = DIVE_TITLES.get(slug, full)
        title = _title(f"{full} | {NAME}", f"{short} | {NAME}", full, short)
        if slug in DIVE_DESCS:
            return _pack(title, DIVE_DESCS[slug], HEADSHOT, og_title=full if len(full) <= 95 else title)
        bl = _first_sentence(d.get("bottomLine"))
        topic = _clean(d.get("topic"))
        lead = f"A {topic.lower()} deep dive by Heather Chappell:" if topic else "A deep dive by Heather Chappell:"
        desc = _desc(bl, f"Briefing by {NAME}: what's confirmed, what isn't, and what to watch.") \
            if len(bl) >= 90 else _desc(lead, bl, "What's confirmed, what isn't, key people, and what to watch next.")
        return _pack(title, desc, HEADSHOT, og_title=full if len(full) <= 95 else title)

    if t == "story":
        return _pack(
            "Ms. Halprin's Overly Familiar Cloud | Heather Chappell",
            "\"Ms. Halprin's Overly Familiar Cloud,\" a satirical short story by Heather "
            "Chappell: a retired teacher, grief, and a smart-home AI that calls her Janet.",
            HEADSHOT)

    if t == "work":
        return _pack(
            "Heather Chappell — B2B Demand Generation & Growth Marketing",
            "Heather Chappell, B2B SaaS demand generation and growth marketing leader: 17+ years of "
            "ABM and pipeline at FedEx, Optimizely, FlavorCloud and Wolters Kluwer.",
            HEADSHOT,
            og_title="Heather Chappell — B2B Demand Generation & Growth Marketing Leader")

    raise ValueError(f"unknown page_type: {page_type}")


if __name__ == "__main__":
    import json, pathlib
    D = pathlib.Path(__file__).resolve().parent.parent
    dives = {p.stem: json.loads(p.read_text()) for p in (D / "dives").glob("*.json")}
    cfg = json.loads((D / "config.json").read_text())
    for d in cfg.get("deepDives", []):
        dives.setdefault(d["slug"], {}).setdefault("topic", d.get("topic"))
    cases = [("home", {}), ("games", {}), ("side_eye", {}), ("episodes", {}), ("dives_index", {}),
             ("story", {}), ("work", {}), ("issue_index", {})]
    cases += [("game", {"game_id": g}) for g in GAMES]
    for e in EPISODES:
        ef = D / "episodes" / f"{e}.json"
        cases.append(("episode", {"slug": e, "episode": json.loads(ef.read_text()) if ef.exists() else {}}))
    cases += [("episode_topic", {"topic": x}) for x in ["Media & Propaganda", "Power & Money", "Science & Fraud"]]
    for ap in sorted((D / "issue1_articles").glob("*.json")):
        cases.append(("issue_article", {"article": json.loads(ap.read_text()), "slug": ap.stem}))
    cases += [("topic", {"topic": t, "dives": dives}) for t in sorted({d.get("topic") for d in cfg["deepDives"]})]
    cases += [("dive", {"slug": s, "dives": dives}) for s in sorted(dives)]
    bad = 0
    for pt, c in cases:
        m = page_meta(pt, c)
        ok = len(m["title"]) <= TITLE_MAX and DESC_MIN <= len(m["description"]) <= DESC_MAX and m["og_image"].startswith("https://")
        bad += not ok
        print(("OK " if ok else "BAD"), pt, c.get("slug") or c.get("topic") or "", f"[{len(m['title'])}/{len(m['description'])}]")
        print("   ", m["title"]); print("   ", m["description"])
    raise SystemExit(bad)
