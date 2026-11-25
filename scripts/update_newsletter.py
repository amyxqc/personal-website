"""Refresh the newsletter panel in index.html from the public Algorithmic Commons feed.

Shows the newest posts, newest first. To keep a post out of the panel, add its slug
(the last part of its web address) to EXCLUDE. Run it from this folder on your own computer
(Substack refuses requests from GitHub's servers), then commit index.html and img.
"""
import glob, html, io, os, re, sys, urllib.request
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime
from urllib.parse import urlparse
from zoneinfo import ZoneInfo
from PIL import Image, ImageOps

BASE = "https://algorithmiccommons.substack.com"
FEED = os.environ.get("NEWSLETTER_FEED", BASE + "/feed")
SHOW = 4
# Not shown: the placeholder post, and posts whose cover is someone else's image.
EXCLUDE = {"coming-soon", "matariki-and-the-mattering-problem", "roundup-of-recent-urban-planning",
           "on-the-home-and-the-world", "the-lawn-as-a-metaphor-for-urban"}
# Covers chosen by hand.
COVERS = {"the-changing-energy-landscape-from": "img/nl-energy.jpg",
          "the-confidence-gap-how-to-integrate": "img/nl-transit-ai.jpg",
          "urban-science-as-a-tree-of-questions": "img/nl-urban-science.jpg",
          "frank-gehry-in-memory-and-love": "img/nl-gehry.jpg"}
IMAGE_HOSTS = {"substackcdn.com", "substack-post-media.s3.amazonaws.com"}
CREDITED = re.compile(r"source|unsplash|getty|courtesy|©|credit|copyright", re.I)
CONTENT = "{http://purl.org/rss/1.0/modules/content/}encoded"


def get(url, limit):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (newsletter panel refresh)",
                                               "Accept": "application/rss+xml,image/jpeg,image/png,*/*;q=0.5"})
    with urllib.request.urlopen(req, timeout=40) as r:
        data = r.read(limit + 1)
    if len(data) > limit:
        raise ValueError("response too large")
    return data


def cover(slug, item):
    """Path to a local cover image, or None for a plain card."""
    if slug in COVERS:
        return COVERS[slug]
    out = f"img/nl-auto-{slug}.jpg"
    if os.path.exists(out):
        return out
    enc = item.find("enclosure")
    url = enc.get("url", "") if enc is not None else ""
    u = urlparse(url)
    cap = re.search(r"<figcaption[^>]*>(.*?)</figcaption>", item.findtext(CONTENT) or "", re.S)
    if u.scheme != "https" or u.hostname not in IMAGE_HOSTS or (cap and CREDITED.search(cap.group(1))):
        return None
    try:
        im = ImageOps.exif_transpose(Image.open(io.BytesIO(get(url, 25_000_000)))).convert("RGB")
        ImageOps.fit(im, (960, 600), Image.LANCZOS).save(out, quality=80, optimize=True, progressive=True)
        return out
    except Exception as e:
        print(f"cover skipped for {slug}: {e}")
        return None


def blurb(text):
    text = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", html.unescape(text or ""))).strip()
    if re.fullmatch(r"[A-Z][a-z]+ \d{1,2}, \d{4}", text):
        return ""
    return text if len(text) <= 150 else text[:150].rsplit(" ", 1)[0].rstrip(",;:.") + "…"


def posts():
    out = []
    for it in ET.fromstring(get(FEED, 5_000_000)).iter("item"):
        m = re.fullmatch(re.escape(BASE) + r"/p/([a-z0-9-]{1,120})", (it.findtext("link") or "").strip())
        title = re.sub(r"\s+", " ", it.findtext("title") or "").strip()
        if not m or not title or m.group(1) in EXCLUDE:
            continue
        when = parsedate_to_datetime(it.findtext("pubDate"))
        out.append((when, m.group(1), title, blurb(it.findtext("description")), it))
    return sorted(out, key=lambda p: p[0], reverse=True)[:SHOW]


def between(page, name, body):
    a, b = f"<!-- newsletter:{name} -->", f"<!-- /newsletter:{name} -->"
    if page.count(a) != 1 or page.count(b) != 1:
        sys.exit(f"markers for {name} not found; index.html left unchanged")
    return page[:page.index(a) + len(a)] + body + page[page.index(b):]


def main():
    found = posts()
    if len(found) < 2:
        sys.exit("fewer than two posts found; index.html left unchanged")
    e, slides, used = html.escape, [], set()
    for k, (when, slug, title, desc, item) in enumerate(found):
        img = cover(slug, item)
        used.add(img)
        pic = f'<img src="{img}" alt=""{"" if k == 0 else " loading=" + chr(34) + "lazy" + chr(34)}>' if img else ""
        ds = f'<span class="ds">{e(desc)}</span>' if desc else ""
        day = when.astimezone(ZoneInfo("America/New_York")).strftime("%b %Y")
        slides.append(f'      <a class="nl-slide{" on" if k == 0 else ""}" href="{BASE}/p/{slug}" target="_blank" rel="noopener">'
                      f'<span class="im">{pic}</span><span class="tx"><span class="dt">{day}</span><b>{e(title)}</b>{ds}</span></a>')
    n = len(found)
    dots = "".join(f'<button class="d" type="button" aria-label="Show essay {k + 1} of {n}" '
                   f'aria-current="{"true" if k == 0 else "false"}"></button>' for k in range(n))
    old = open("index.html", encoding="utf-8").read()
    new = between(between(old, "slides", "\n" + "\n".join(slides) + "\n"), "dots", dots)
    for f in glob.glob("img/nl-auto-*.jpg"):
        if f not in used:
            os.remove(f)
    if new != old:
        open("index.html", "w", encoding="utf-8").write(new)
    print("updated" if new != old else "no change", [p[1] for p in found])


try:
    main()
except Exception as err:  # shown on the workflow run page
    print(f"::error::Newsletter refresh failed, index.html left unchanged: {type(err).__name__}: {err}")
    sys.exit(1)
