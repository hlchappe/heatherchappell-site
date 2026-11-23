"""Run by the GitHub 'YouTube feed' workflow (it has open internet; Claude's sandbox can't reach YouTube).
Reads data/youtube-feed.xml and, for each video not yet in data/youtube/, saves
data/youtube/<id>.json  {id, title, published, description, lengthSeconds}
data/youtube/<id>.jpg   (best available thumbnail)
"""
import json, os, re, sys, urllib.request, xml.etree.ElementTree as ET
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'data', 'youtube'); os.makedirs(OUT, exist_ok=True)
NS = {'a': 'http://www.w3.org/2005/Atom', 'yt': 'http://www.youtube.com/xml/schemas/2015', 'm': 'http://search.yahoo.com/mrss/'}
UA = {'User-Agent': 'Mozilla/5.0 (heatherchappell.com feed bot)', 'Accept-Language': 'en-US'}
def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30).read()
root = ET.parse(os.path.join(ROOT, 'data', 'youtube-feed.xml')).getroot()
for e in root.findall('a:entry', NS):
    vid = e.findtext('yt:videoId', namespaces=NS)
    jp = os.path.join(OUT, vid + '.json')
    if os.path.exists(jp):
        continue
    rec = {'id': vid, 'title': e.findtext('a:title', namespaces=NS), 'published': e.findtext('a:published', namespaces=NS),
           'description': e.findtext('m:group/m:description', namespaces=NS) or '', 'lengthSeconds': None}
    try:
        html = get(f'https://www.youtube.com/watch?v={vid}').decode('utf-8', 'replace')
        m = re.search(r'"lengthSeconds":"(\d+)"', html)
        if m: rec['lengthSeconds'] = int(m.group(1))
        m = re.search(r'"shortDescription":"((?:[^"\\]|\\.)*)"', html)
        if m: rec['description'] = json.loads('"' + m.group(1) + '"')
    except Exception as ex:
        print('watch page failed', vid, ex, file=sys.stderr)
    for size in ('maxresdefault', 'sddefault', 'hqdefault'):
        try:
            img = get(f'https://i.ytimg.com/vi/{vid}/{size}.jpg')
            if len(img) > 5000:
                open(os.path.join(OUT, vid + '.jpg'), 'wb').write(img); break
        except Exception:
            pass
    json.dump(rec, open(jp, 'w'), ensure_ascii=False, indent=1)
    print('saved', vid, rec['title'])
