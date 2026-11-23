"""Sitemap writer for heatherchappell.com.

write_sitemaps(site_dir, paths, cfg, dives) writes <site_dir>/sitemap.xml:
  - "/" plus every path in `paths` (e.g. /deep-dives/<slug>/, /deep-dives/, /story/, /episodes/)
  - absolute https://heatherchappell.com URLs, <lastmod> from dive / episode dates (else today)
  - <image:image> for the homepage cover + headshot (and episode thumbnails on /episodes/)
  - <video:video> for each config youtube.episodes entry, on /episodes/ and /side-eye/ (or "/" if neither)
  - issue cover image on "/" and /side-eye/; headshot on "/" and /work/
  - /side-eye/vol-1/ gets the issue front cover; article pages get the hero image(s) passed in
    via dict/tuple path entries or the `images` map (relative paths like issue1/p012.jpg are made absolute)
  - /deep-dives/topic/<topic-slug>/ lastmod = newest dive in that topic
The output is parsed back to check it is well-formed XML; returns the list of absolute URLs.
"""
import datetime
import pathlib
import xml.etree.ElementTree as ET
from xml.sax.saxutils import escape

BASE = "https://heatherchappell.com"
SHOW = "SIDE EYE"


def _abs(p):
    if p.startswith("http://") or p.startswith("https://"):
        return p
    return BASE + "/" + p.lstrip("/")


def _norm_path(p):
    p = "/" + p.strip().lstrip("/")
    if p != "/" and "." not in p.rsplit("/", 1)[-1] and not p.endswith("/"):
        p += "/"
    return p


def _slugify(text):
    import re
    return re.sub(r"[^a-z0-9]+", "-", (text or "").lower()).strip("-")


def _dive_dates(cfg, dives):
    dates = {}
    for d in (cfg or {}).get("deepDives", []) or []:
        if d.get("slug") and d.get("date"):
            dates[d["slug"]] = d["date"]
    items = dives.values() if isinstance(dives, dict) else (dives or [])
    for d in items:
        if isinstance(d, dict) and d.get("slug") and d.get("date"):
            dates[d["slug"]] = d["date"]
    return dates


def _video_xml(ep):
    vid = ep.get("id", "").strip()
    if not vid:
        return ""
    title = ep.get("title", "").strip() or f"{SHOW} episode"
    label = ep.get("ep", "").strip()
    desc = ep.get("description") or (
        f"{SHOW} {label}: {title}. A history show from Heather Chappell and Edwin "
        f"for people who suspected the story they were told was incomplete."
    ).replace("  ", " ")
    out = [
        "    <video:video>",
        f"      <video:thumbnail_loc>{escape(_abs(ep.get('thumb') or f'https://i.ytimg.com/vi/{vid}/hqdefault.jpg'))}</video:thumbnail_loc>",
        f"      <video:title>{escape(title[:100])}</video:title>",
        f"      <video:description>{escape(desc[:2048])}</video:description>",
        f"      <video:player_loc>https://www.youtube.com/embed/{escape(vid)}</video:player_loc>",
    ]
    rt = ep.get("runtime", "")
    if rt:
        try:
            secs = 0
            for part in rt.split(":"):
                secs = secs * 60 + int(part)
            if 0 < secs <= 28800:
                out.append(f"      <video:duration>{secs}</video:duration>")
        except ValueError:
            pass
    if ep.get("date"):
        out.append(f"      <video:publication_date>{escape(ep['date'])}</video:publication_date>")
    out.append("      <video:family_friendly>yes</video:family_friendly>")
    out.append("      <video:uploader info=\"https://www.youtube.com/@SideEyeMag\">Side Eye Magazine</video:uploader>")
    out.append("    </video:video>")
    return "\n".join(out)


def _image_xml(loc, title=""):
    return f"    <image:image>\n      <image:loc>{escape(_abs(loc))}</image:loc>\n    </image:image>"


def write_sitemaps(site_dir, paths, cfg, dives, images=None):
    """paths: list of str, or dicts {"path": "/side-eye/vol-1/emu-war/", "images": ["issue1/p012.jpg"],
    "lastmod": "YYYY-MM-DD"}, or (path, [images]) tuples.
    images: optional {path: [image paths]} map (e.g. article hero page images); merged with the above."""
    site_dir = pathlib.Path(site_dir)
    cfg = cfg or {}
    today = datetime.date.today().isoformat()
    dive_dates = _dive_dates(cfg, dives)
    episodes = ((cfg.get("youtube") or {}).get("episodes")) or []
    ep_dates = [e["date"] for e in episodes if e.get("date")]
    newest_dive = max(dive_dates.values()) if dive_dates else None
    newest_ep = max(ep_dates) if ep_dates else None

    ordered = ["/"]
    page_images, page_lastmod = {}, {}
    for k, v in (images or {}).items():
        page_images.setdefault(_norm_path(k), []).extend([v] if isinstance(v, str) else list(v))
    for p in paths or []:
        imgs, lm = [], None
        if isinstance(p, dict):
            imgs, lm, p = p.get("images") or ([p["image"]] if p.get("image") else []), p.get("lastmod"), p["path"]
        elif isinstance(p, (tuple, list)):
            p, imgs = p[0], (p[1] if len(p) > 1 else [])
        np_ = _norm_path(str(p))
        if isinstance(imgs, str):
            imgs = [imgs]
        page_images.setdefault(np_, []).extend(imgs)
        if lm:
            page_lastmod[np_] = lm
        if np_ not in ordered:
            ordered.append(np_)
    video_pages = [v for v in ("/episodes/", "/side-eye/") if v in ordered] or ["/"]
    cover_pages = ["/", "/side-eye/"]
    topic_dates = {}
    for d in (cfg.get("deepDives") or []):
        t = _slugify(d.get("topic", ""))
        if t and d.get("date"):
            topic_dates[t] = max(topic_dates.get(t, ""), d["date"])

    entries, urls = [], []
    for p in ordered:
        loc = _abs(p) if p != "/" else BASE + "/"
        lastmod = today
        extra = []
        if p.startswith("/deep-dives/topic/"):
            lastmod = topic_dates.get(p.strip("/").split("/")[-1], newest_dive or today)
        elif p.startswith("/deep-dives/") and p != "/deep-dives/":
            slug = p.strip("/").split("/")[-1]
            lastmod = dive_dates.get(slug, today)
        elif p == "/deep-dives/":
            lastmod = newest_dive or today
        elif p in ("/episodes/", "/side-eye/"):
            lastmod = max([x for x in (newest_ep, today if p == "/side-eye/" else None) if x] or [today])
        if p == "/side-eye/vol-1/":
            rd = ((cfg.get("issues") or [{}])[0].get("reader") or {})
            if rd.get("front"):
                extra.append(_image_xml(rd["front"]))
        seen = set()
        for img in page_images.get(p, []):
            if img and img not in seen:
                seen.add(img); extra.append(_image_xml(img))
        lastmod = page_lastmod.get(p, lastmod)
        if p in cover_pages:
            for issue in cfg.get("issues", []) or []:
                if issue.get("cover"):
                    extra.append(_image_xml(issue["cover"]))
        if p in ("/", "/work/"):
            head = (cfg.get("about") or {}).get("headshot")
            if head:
                extra.append(_image_xml(head))
        if p in video_pages:
            extra += [v for v in (_video_xml(e) for e in episodes) if v]
        block = [f"  <url>\n    <loc>{escape(loc)}</loc>\n    <lastmod>{lastmod}</lastmod>"]
        block += extra
        block.append("  </url>")
        entries.append("\n".join(block))
        urls.append(loc)

    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
        '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n'
        '        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n'
        + "\n".join(entries)
        + "\n</urlset>\n"
    )
    ET.fromstring(xml.encode("utf-8"))  # raises ParseError if not well-formed
    (site_dir / "sitemap.xml").write_text(xml, encoding="utf-8")
    return urls


if __name__ == "__main__":
    import json
    import sys
    d = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else pathlib.Path(__file__).resolve().parent.parent)
    c = json.loads((d / "config.json").read_text())
    dv = {}
    for f in sorted((d / "dives").glob("*.json")):
        j = json.loads(f.read_text()); dv[j.get("slug", f.stem)] = j
    ps = [f"/deep-dives/{s}/" for s in dv] + ["/deep-dives/", "/story/", "/episodes/", "/side-eye/", "/work/"] + sorted({f"/deep-dives/topic/{_slugify(x.get('topic',''))}/" for x in c.get("deepDives", []) if x.get("topic")})
    ps += ["/side-eye/vol-1/"]
    print("\n".join(write_sitemaps(d, ps, c, dv)))
