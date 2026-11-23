# heatherchappell.com: how it runs

This GitHub repository is the live site. DreamHost pulls it every 10 minutes, so a change pushed here goes live on its own.

- **Deep Dives:** a twice-daily Claude scheduled task finds new briefings in the Drive archive, adds them and pushes (see `MAINTAIN.md`).
- **YouTube:** the "YouTube feed" GitHub workflow saves new SIDE EYE videos into `data/youtube/` every 6 hours; the same Claude task turns them into episode pages.
- **Anything else:** ask Claude to change it, or edit `config.json` / `copy.json`, run `python3 build.py`, and push.

## Launch day (10 minutes, optional but speeds things up)
1. **Drive sharing:** set the magazine PDF and the SIDE EYE sources doc to "Anyone with the link → Viewer".
2. **Google:** add heatherchappell.com in Google Search Console (search.google.com/search-console) and submit `https://heatherchappell.com/sitemap.xml`.
3. **Bing (also feeds ChatGPT and Copilot search):** in Bing Webmaster Tools, choose "Import from Google Search Console". Optional: run `seo/indexnow_ping.sh` after each update.
More detail in `seo/SEO_LAUNCH.md`. Off-site ideas (YouTube About text, Amazon author page, LinkedIn link) are in `seo/AI_RECOMMENDATION_PLAN.md` and `seo/ENTITY_FACTS.md`, for whenever.

## Updating by hand (edit config.json, run `python3 build.py`, then push)
- **New SIDE EYE issue:** add an entry to `issues` with `"status": "out"`, plus its `pdf`, `amazon` and `sources` links. Placeholders use `"status": "soon"`.
- **New issue reader:** export the issue's pages as images into a folder like `issue2/` (Claude can do this from the PDF) and add a `reader` entry to that issue.
- **New episode:** add `{ "id": "VIDEO_ID", "ep": "EP02", "title": "…", "runtime": "24:10" }` to `youtube.episodes`. The id is the part after `watch?v=`. Newest goes last.
- **New Deep Dive:** each briefing gets its own page on the site (heatherchappell.com/deep-dives/nvidia-sec-probe/, etc.). To add one, ask Claude: "add my latest deep dive to the site". It pulls the full text from your Drive archive, adds the page, and features it at the top of the Reading section.
- Or just ask Claude: "add my latest deep dive / new episode to the site."

## Contact form (already set up; for reference)
The form is built in and posts to **Web3Forms** (free: 250 messages/month), with hCaptcha + a hidden honeypot + a 4-second "too fast to be human" check.
1. Go to web3forms.com, enter funkorama@gmail.com, and click Create Access Key. The key arrives by email.
2. In your Web3Forms dashboard turn on hCaptcha under spam protection.
3. Paste the key into `"web3formsKey": ""` in the config block of index.html (or ask Claude to do it).
Every message arrives from Web3Forms with the subject `[heatherchappell.com] <topic> — <name>`, and hitting Reply goes straight to the sender.
