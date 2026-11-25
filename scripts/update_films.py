"""Refresh "Watching" in the Studio section of index.html from the public Letterboxd feed.

Shows the most recently watched films rated MIN stars or more: title, year, stars and a link.
Review text is never copied. To keep a film out, add its title to EXCLUDE.
"""
import html, os, re, sys, urllib.request
import xml.etree.ElementTree as ET
from urllib.parse import urlparse

FEED = os.environ.get("FILMS_FEED", "https://letterboxd.com/amyxqc/rss/")
LINK = re.compile(r"https://letterboxd\.com/amyxqc/film/[a-z0-9-]{1,120}/(\d{1,3}/)?")
MIN, SHOW = 4.5, 8
EXCLUDE = set()
N = "{https://letterboxd.com}"


def stars(x):
    return "★" * int(x) + ("½" if x % 1 else "")


def main():
    req = urllib.request.Request(FEED, headers={"User-Agent": "Mozilla/5.0 (personal site film list)"})
    with urllib.request.urlopen(req, timeout=40) as r:
        data = r.read(5_000_001)
    if len(data) > 5_000_000:
        raise ValueError("response too large")
    films, seen = [], set()
    for it in ET.fromstring(data).iter("item"):
        title, year, rating = (it.findtext(N + k) for k in ("filmTitle", "filmYear", "memberRating"))
        link = (it.findtext("link") or "").strip()
        if not title or not rating or float(rating) < MIN or title in EXCLUDE or not LINK.fullmatch(link):
            continue
        img = re.search(r'<img[^>]+src="([^"]+)"', it.findtext("description") or "")
        url = html.unescape(img.group(1)) if img else ""
        u = urlparse(url)
        url = url if u.scheme == "https" and u.hostname == "a.ltrbxd.com" else ""
        films.append((it.findtext(N + "watchedDate") or "", title, year or "", float(rating), link, url))
    films.sort(key=lambda f: f[0], reverse=True)
    films = [f for f in films if not (f[1] in seen or seen.add(f[1]))][:SHOW]
    if len(films) < 4:
        sys.exit("fewer than four films found; index.html left unchanged")
    e, out = html.escape, []
    for _, title, year, rating, link, url in films:
        pic = f'<img src="{e(url)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">' if url else ""
        out.append(f'      <a class="film" href="{link}" target="_blank" rel="noopener"><span class="po"><i>{e(title)}</i>{pic}</span>'
                   f'<b>{e(title)}</b><small>{e(year)} · <span aria-label="{rating:g} of 5 stars">{stars(rating)}</span></small></a>')
    old = open("index.html", encoding="utf-8").read()
    a, b = "<!-- studio:films -->", "<!-- /studio:films -->"
    if old.count(a) != 1 or old.count(b) != 1:
        sys.exit("film markers not found; index.html left unchanged")
    new = old[:old.index(a) + len(a)] + "\n" + "\n".join(out) + "\n" + old[old.index(b):]
    if new != old:
        open("index.html", "w", encoding="utf-8").write(new)
    print("films updated" if new != old else "films: no change", [f[1] for f in films])


try:
    main()
except Exception as err:
    print(f"Film refresh failed, index.html left unchanged: {type(err).__name__}: {err}")
    sys.exit(1)
