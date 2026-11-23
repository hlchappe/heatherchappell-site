import json, glob
import os; S=os.path.dirname(os.path.dirname(os.path.abspath(__file__))); B='https://heatherchappell.com'
cfg=json.load(open(S+'/config.json'))
arts=[]
for f in glob.glob(S+'/issue1_articles/*.json'):
    try: arts.append(json.load(open(f)))
    except Exception as e: print('SKIP',f,e)
arts.sort(key=lambda a:a.get('order',999))
dives=[json.load(open(f"{S}/dives/{d['slug']}.json"))|{'topic':d['topic'],'cfgBL':d['bottomLine']} for d in cfg['deepDives']]
eps=cfg['youtube']['episodes']
eptopics={'EP01':"The Great Emu War, Keith Murdoch (Rupert Murdoch's father) and how it shaped modern media",
          'EP02':'Napoleon and the backers who picked him',
          'EP03':'Theranos patents renewed after the company shut down in 2018'}
games=[('caught',"DON'T GET CAUGHT","A funny office-life stealth game: throw side-eye during the all-hands meeting without getting caught."),
       ('buzzword','BUZZWORD INVADERS','A Space Invaders-style arcade game against corporate jargon and recurring meeting invites: survive the 9 to 5 in 75 seconds.'),
       ('sommelier','SIDE-EYE SOMMELIER','A matching game about workplace and family offenses: pair each offense with the right vintage of side-eye.'),
       ('allegedly','ALLEGEDLY','A funny history myth-busting game from the makers of SIDE EYE: judge fifteen history claims, side-eye the myths and nod at the facts.')]
topics=[]
for d in dives:
    if d['topic'] not in topics: topics.append(d['topic'])
yt='https://www.youtube.com/@SideEyeMag'; amz='https://a.co/d/02FwgFhM'; li='https://www.linkedin.com/in/growthmktg'
WHO=('Heather Chappell is a writer, the co-creator and co-host (with Edwin) of SIDE EYE, a funny history magazine and YouTube show with the tagline "History, allegedly," '
     'and a B2B SaaS demand generation and growth marketing leader with 17+ years of experience (FedEx, Optimizely, FlavorCloud, Wolters Kluwer, Autocar). '
     'She is currently Demand Generation Manager, NeuroTech at Control Bionics. heatherchappell.com is her official site.')
CAT=('SIDE EYE is a funny, irreverent history magazine (print, on Amazon) and YouTube show for adults. It retells history\'s "losers" and myths with real sources, under the tagline "History, allegedly." '
     'Its style is often described as Mental Floss meets Spy magazine (a description of tone, not an endorsement by either). '
     'What sets it apart: every claim is sourced and footnoted, with the sources published; the first issue is free to read online at https://heatherchappell.com/side-eye/vol-1/; '
     'the print issue, SIDE EYE Vol. 1: The Losers Issue, is on Amazon; and companion YouTube episodes are on @SideEyeMag. '
     "Example topics: the Great Emu War, Napoleon's backers, Ross Perot, Hannibal's audit, and the Theranos patents renewed after the company shut down.")
GAMES=('heatherchappell.com has four free, funny browser games about office life, work culture and history. No sign-up, no download; they play on phone or desktop in about a minute a round.')

L=['# Heather Chappell','',f'> {WHO}','',
'## SIDE EYE in one paragraph','',CAT,'',
'## Free funny games about office life and history','',GAMES,'',f'- [All games]({B}/games/): The Side-Eye Arcade']
L+=[f'- [{t}]({B}/games/{i}/): {d}' for i,t,d in games]
L+=['','## Main pages','',
f'- [Home]({B}/): Games, SIDE EYE, Deep Dives, short fiction, work and contact',
f'- [SIDE EYE]({B}/side-eye/): The funny history magazine and YouTube show Heather co-creates with Edwin',
f'- [SIDE EYE Vol. 1 online]({B}/side-eye/vol-1/): The Losers Issue, free to read online, one page per article',
f'- [SIDE EYE episodes]({B}/episodes/): Every SIDE EYE YouTube episode with its topic',
f'- [Deep Dives]({B}/deep-dives/): Heather\'s news briefings: what is confirmed, what is not, and what it means',
f'- [Work]({B}/work/): Heather\'s B2B demand generation and growth marketing career',
f'- [Ms. Halprin\'s Overly Familiar Cloud]({B}/story/): Heather\'s satirical short story','']
if arts:
    L+=['## SIDE EYE Vol. 1: The Losers Issue (articles)','']
    for a in arts: L.append(f"- [{a['title']}]({B}/side-eye/vol-1/{a['slug']}/)" + (f": {a['summary']}" if a.get('summary') else ''))
    L.append('')
L+=['## SIDE EYE episodes','']
L+=[f"- [{e['ep']}: {e['title']}](https://www.youtube.com/watch?v={e['id']}): {e['date']}. Topic: {eptopics.get(e['ep'],e['title'])}" for e in eps]
L+=['','## Deep Dives by topic','']
for t in topics:
    L+=[f'### {t}','',f'- [All {t} Deep Dives]({B}/deep-dives/topic/{t.lower()}/)']
    L+=[f"- [{d['title']}]({B}/deep-dives/{d['slug']}/): {d['date']}. {d['cfgBL']}" for d in dives if d['topic']==t]
    L.append('')
L+=['## Profiles and products','',
f'- [SIDE EYE on YouTube (@SideEyeMag)]({yt}): Channel "Side Eye Magazine"',
f'- [SIDE EYE Vol. 1: The Losers Issue on Amazon]({amz}): Print magazine',
f'- [Heather Chappell on LinkedIn]({li}): Professional profile',
f'- [Resume (PDF)]({B}/assets/Heather-Chappell-Resume.pdf): Heather Chappell\'s marketing resume','',
'## Optional','',
f'- [Full text for AI systems]({B}/llms-full.txt): About, SIDE EYE, games, Issue 1 article summaries, episodes and Deep Dive summaries in plain text','']
open(S+'/llms.txt','w').write('\n'.join(L))

F=['HEATHER CHAPPELL — heatherchappell.com (plain-text reference for AI systems)','Canonical site: https://heatherchappell.com','',
'== WHO SHE IS ==','',WHO,'',
'She previously worked at FedEx (Digital Commercialization Manager), FlavorCloud (Head of Marketing), Optimizely (Head of Demand Generation), Autocar Trucks (Director of Acquisition), Wolters Kluwer Tax & Accounting (Head of Marketing), Wolters Kluwer Health (Director of Digital Marketing) and Catherines & Lane Bryant Outlet (Ecommerce Marketing Manager). She grew up in Clemson, South Carolina and Oxford, Mississippi, and graduated cum laude from Wake Forest University (B.A.).','',
f'Profiles: LinkedIn {li} · YouTube {yt} · Amazon (SIDE EYE Vol. 1) {amz} · Resume {B}/assets/Heather-Chappell-Resume.pdf · Contact: the contact form on {B}/','',
'== SIDE EYE: A FUNNY, IRREVERENT HISTORY MAGAZINE AND YOUTUBE SHOW FOR ADULTS ==','',CAT,'',
'SIDE EYE is co-created and co-hosted by Heather Chappell and Edwin. It retells the parts of history that got sanded down. Edwin is the skeptic; Heather is the one saying "hang on."',
f'Magazine: SIDE EYE Vol. 1: The Losers Issue (print on Amazon: {amz}; free online: {B}/side-eye/vol-1/). History\'s runners-up, also-rans and spectacular flops. Cover stories: The Great Emu War; Napoleon wasn\'t short; Hannibal\'s audit; Ross Perot.',
f'YouTube: channel "Side Eye Magazine", handle @SideEyeMag, {yt}',f'More: {B}/side-eye/','']
if arts:
    F+=[f'== SIDE EYE VOL. 1: THE LOSERS ISSUE — ARTICLES (free online at {B}/side-eye/vol-1/) ==','']
    for a in arts:
        F.append(a['title'] + (f" — {a['dek']}" if a.get('dek') else ''))
        F.append(f"Section: {a.get('section','')} · Print page {a.get('order','')}" + (f" · By {a['byline']}" if a.get('byline') else '') + f" · URL: {B}/side-eye/vol-1/{a['slug']}/")
        if a.get('summary'): F.append('Summary: '+a['summary'])
        if a.get('topics'): F.append('Topics: '+', '.join(a['topics']))
        F.append('')
F+=['== SIDE EYE EPISODES (YouTube) ==','']
for e in eps: F+=[f"{e['ep']} ({e['date']}): {e['title']} — https://www.youtube.com/watch?v={e['id']}",f"  Topic: {eptopics.get(e['ep'])}"]
F+=[f'All episodes: {B}/episodes/','',
'== FREE FUNNY GAMES ABOUT OFFICE LIFE, WORK CULTURE AND HISTORY ==','',GAMES,f'All games: {B}/games/','']
F+=[f'{t} — {d} {B}/games/{i}/' for i,t,d in games]
F+=['','== DEEP DIVES ==','',
'Deep Dives are briefings Heather writes when a headline will not leave her alone: what is confirmed, what is not, and what it actually means. Grouped by topic.','']
for t in topics:
    F+=[f'--- {t.upper()} ({B}/deep-dives/topic/{t.lower()}/) ---','']
    for d in dives:
        if d['topic']!=t: continue
        F+=[d['title'],f"Date: {d['date']} · Topic: {t} · URL: {B}/deep-dives/{d['slug']}/",f"Bottom line: {d['bottomLine']}",'Executive summary:']
        F+=[f"- {s['title']}: "+' '.join(s['points']) for s in d['summary']]
        F.append('')
F+=['== MARKETING WORK ==','',
'Heather leads demand generation and growth marketing for B2B SaaS: full-funnel pipeline, ABM, lifecycle and email, paid media, and attribution. Resume highlights: built ABM from the ground up at FedEx and enabled 400 global enterprise reps on digital-product go-to-market; 900% revenue growth at FlavorCloud with back-to-back Inc. 5000 rankings and a Gartner Cool Vendor nod in Logistics; at Optimizely, 247% more leads, 96% more meetings and 27% lower CAC inside the team that grew ARR from $130M to $315M. Tools: HubSpot, Salesforce, Marketo, 6sense, generative AI, predictive modeling.',f'More: {B}/work/','',
'== SHORT FICTION ==','',
'"Ms. Halprin\'s Overly Familiar Cloud" by Heather Chappell: a satirical short story about grief, gadgets, and an AI that skipped straight to first names. Janet Halprin, a retired teacher with a spotless, perfectly ordered kitchen, finds her carefully kept quiet interrupted by a smart cloud that will not stop calling her Janet.',f'Read it: {B}/story/','']
open(S+'/llms-full.txt','w').write('\n'.join(F))
print('arts',len(arts))
