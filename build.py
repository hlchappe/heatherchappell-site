import json, re, html, pathlib, sys
D = pathlib.Path(__file__).parent
copy = json.loads((D/'copy.json').read_text())
cfg = (D/'config.json').read_text()
t = (D/'template.html').read_text()

def get(path):
    v = copy
    for p in path.split('.'):
        v = v[int(p)] if isinstance(v, list) else v[p]
    return v
t = t.replace('{{dd_count}}', str(len(json.loads(cfg).get('deepDives', []))))
t = re.sub(r'\{\{([\w.]+)\}\}', lambda m: html.escape(str(get(m.group(1))), quote=True), t)
t = t.replace('__CONFIG__', cfg.replace('</', '<\\/'))
t = t.replace('__COPYJSON__', json.dumps(copy, ensure_ascii=False).replace('</', '<\\/'))
story = (D/'story_section.html').read_text() if (D/'story_section.html').exists() else ''
t = t.replace('<!--__STORY__-->', story)
# PERF: games are NOT inlined. Each stays at games/<id>.js (upload the games/ folder)
# and loads only when its cabinet is opened. The page gets just the cabinet
# title/tagline (read from the module itself via node; fallback below) + a cache-busting src.
import hashlib, subprocess
GAME_IDS = ['caught', 'buzzword', 'allegedly', 'sommelier']
GAME_FALLBACK = {
    'caught': ("DON'T GET CAUGHT", 'Hold the side eye. Let go before they look.'),
    'buzzword': ('BUZZWORD INVADERS', 'Defend your calendar from descending jargon with one withering look.'),
    'allegedly': ('ALLEGEDLY', 'Side-eye the myths. Nod at the facts. Fifteen placards, no refunds.'),
    'sommelier': ('SIDE-EYE SOMMELIER', 'Pair the offense with the correct vintage of side-eye. Chef’s kiss optional.'),
}
NODE_META = r'''const vm=require("vm"),fs=require("fs"),out={};
for(const g of process.argv.slice(1)){const w={HC_GAMES:{}},n=()=>{},el=()=>({style:{},setAttribute:n,appendChild:n,addEventListener:n});
const c={window:w,self:w,document:{addEventListener:n,createElement:el,head:{appendChild:n},body:{appendChild:n}},navigator:{},
localStorage:{getItem:n,setItem:n},matchMedia:()=>({matches:false}),addEventListener:n,console:{log:n,warn:n,error:n}};c.globalThis=c;
try{vm.runInNewContext(fs.readFileSync(g,"utf8"),c,{timeout:2000});}catch(e){}
for(const k in w.HC_GAMES){out[k]={title:w.HC_GAMES[k].title,tagline:w.HC_GAMES[k].tagline};}}
process.stdout.write(JSON.stringify(out));'''
gfiles = [D/'games'/f'{g}.js' for g in GAME_IDS]
try:
    live = json.loads(subprocess.run(['node', '-e', NODE_META, *[str(f) for f in gfiles if f.exists()]],
                                     capture_output=True, text=True, timeout=20).stdout or '{}')
except Exception:
    live = {}
gmeta = {}
for g, f in zip(GAME_IDS, gfiles):
    if not f.exists():
        print('missing game', g, file=sys.stderr); continue
    v = hashlib.sha1(f.read_bytes()).hexdigest()[:8]
    m = live.get(g) or {}
    fb = GAME_FALLBACK.get(g, (g.upper(), ''))
    gmeta[g] = {'title': m.get('title') or fb[0], 'tagline': m.get('tagline') or fb[1], 'src': f'games/{g}.js?v={v}'}
games = '<script>window.HC_GAME_META=' + json.dumps(gmeta, ensure_ascii=False).replace('</', '<\\/') + ';</script>\n'
dv = {}
dd = D/'dives'
if dd.exists():
    for f in sorted(dd.glob('*.json')):
        try:
            j = json.loads(f.read_text()); dv[j.get('slug', f.stem)] = j
        except Exception as e:
            print('bad dive', f, e, file=sys.stderr)
# PERF: keep a .webp sibling next to every site image (smaller; the page asks for .webp first, falls back to the original)
try:
    from PIL import Image
    for folder in ['assets'] + [p.name for p in D.glob('issue*') if p.is_dir()]:
        for src in list((D/folder).glob('*.jpg')) + list((D/folder).glob('*.jpeg')) + list((D/folder).glob('*.png')):
            w = src.with_suffix('.webp')
            if not w.exists() or w.stat().st_mtime < src.stat().st_mtime:
                im = Image.open(src); im = im.convert('RGBA' if 'A' in im.getbands() else 'RGB')
                im.save(w, 'WEBP', quality=80, method=6)
                print('webp', w.relative_to(D))
except ImportError:
    print('PIL not installed: skipped .webp siblings (pages fall back to the .jpg files)', file=sys.stderr)
# PERF: full deep-dive texts go to dives.js (next to index.html), loaded only when a #dive-<slug>
# hash route is opened. The page itself carries a tiny stub per slug so links still know which dives exist.
dvjs = 'window.HC_DIVES=' + json.dumps(dv, ensure_ascii=False).replace('</', '<\\/') + ';\n'
(D/'dives.js').write_text(dvjs)
games += '<script>window.HC_DIVES_SRC="dives.js?v=' + hashlib.sha1(dvjs.encode()).hexdigest()[:8] + '";</script>\n'
t = t.replace('__DIVES__', json.dumps({k: {'_stub': 1} for k in dv}))
t = t.replace('<!--__GAMES__-->', games)
(D/'index.html').write_text(t)
print('built', len(t), 'bytes')
# SEO: real crawlable URLs (/deep-dives/<slug>/, /story/, /episodes/, /side-eye/, /work/, /side-eye/vol-1/...)
# written as <path>/index.html copies of index.html with the view pre-rendered. Also finalizes index.html's head.
# The full dive texts (dv) are passed from the dives/*.json files read above.
sys.path.insert(0, str(D))
from seo.prerender import prerender
PRERENDERED = prerender(t, D, json.loads(cfg), copy, dv)
print('prerendered', len(PRERENDERED), 'pages:', ' '.join(PRERENDERED))

# PERF (runs last): in every written page, point server-rendered <img> tags at the .webp sibling when
# it exists on disk (same URL the page script asks for, so no double download) and decode async.
# Images lazy-load, except the first image of the page's own view (its likely LCP image), which loads
# eagerly with fetchpriority="high". Homepage: no exception (its first screen is text + SVG only).
# Subpages are full copies of the homepage with the home sections hidden; lazy keeps those hidden
# images from downloading at all.
def _perf_imgs(doc, path):
    hero_at = -1
    if path == '/side-eye/':
        m = re.search(r'<section class="se band" id="side-eye"', doc); hero_at = m.start() if m else -1
    elif path != '/':
        m = re.search(r'<article id="divepage"', doc); hero_at = m.start() if m else -1
    done = [False]
    def fix(m, off):
        tag = m.group(0)
        s = re.search(r'\ssrc="([^"]+)"', tag)
        if s and not re.match(r'(https?:|data:|//)', s.group(1)) and re.search(r'\.(jpe?g|png)$', s.group(1), re.I):
            w = re.sub(r'\.(jpe?g|png)$', '.webp', s.group(1), flags=re.I)
            if (D / w.lstrip('/')).exists():
                tag = tag.replace(s.group(0), f' src="{w}"', 1)
        if ' decoding=' not in tag:
            tag = tag[:4] + ' decoding="async"' + tag[4:]
        if hero_at >= 0 and off + m.start() > hero_at and not done[0]:
            done[0] = True
            tag = tag.replace(' loading="lazy"', '')
            if ' fetchpriority=' not in tag:
                tag = tag[:4] + ' fetchpriority="high"' + tag[4:]
        elif ' loading=' not in tag and ' fetchpriority=' not in tag:
            tag = tag[:4] + ' loading="lazy"' + tag[4:]
        return tag
    out, off = [], 0
    for part in re.split(r'(<script\b.*?</script>)', doc, flags=re.S):   # leave <img> text inside scripts alone
        out.append(part if part.startswith('<script') else re.sub(r'<img\b[^>]*>', lambda m, o=off: fix(m, o), part))
        off += len(part)
    return ''.join(out)
for _p in sorted(set(['/'] + list(PRERENDERED))):
    _f = D / _p.strip('/') / 'index.html' if _p.strip('/') else D / 'index.html'
    if _f.exists():
        _f.write_text(_perf_imgs(_f.read_text(), _p))

# SEO: sitemaps (with image + video extensions) and llms.txt / llms-full.txt
from seo.sitemap import write_sitemaps
import seo.prerender as _pr
write_sitemaps(D, sorted(set(['/'] + list(PRERENDERED))), json.loads(cfg), dv, images=getattr(_pr, 'LAST_IMAGES', {}))
import subprocess, sys
subprocess.run([sys.executable, '-I', str(D / 'seo' / 'gen_llms.py')], check=True)
print('sitemap + llms files written')
