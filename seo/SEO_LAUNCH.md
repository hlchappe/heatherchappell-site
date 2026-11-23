# After you upload: get found (Google, Bing, AI search)

About an hour total, done once. Steps 9–10 repeat after each upload.
Upload these to the site root along with everything else: `sitemap.xml`, `robots.txt`, and the key file `8de69610ebaea3e0ec62e5c9a53de56d.txt`.

## A. Check the site before you tell Google

1. **WordPress isn't hiding the site.** WordPress admin → **Settings → Reading** → make sure **"Discourage search engines from indexing this site"** is *unchecked* → Save.
2. **No competing SEO plugin files.** If Yoast or Rank Math is installed, it makes its own sitemap (`/sitemap_index.xml`) and robots rules for the old WordPress pages.
   - Yoast: **Yoast SEO → Settings → Site features → XML sitemaps** → turn off.
   - Rank Math: **Rank Math → Dashboard → Modules → Sitemap** → turn off.
   - Then open `heatherchappell.com/sitemap.xml` and `heatherchappell.com/robots.txt` in a browser. You should see *our* files (the sitemap lists `/side-eye/`, `/deep-dives/`, etc.).
3. **Quick spot check.** Open `heatherchappell.com/side-eye/`, `/work/`, `/episodes/` and `/deep-dives/`. Each should load as its own page.

## B. Google Search Console (the big one)

4. **Find your registrar** (the company you pay for heatherchappell.com: GoDaddy, Namecheap, Squarespace Domains, Bluehost, etc.). Search your email for "heatherchappell.com renewal". If you're not sure, look the domain up at `lookup.icann.org` and read the "Registrar" line. If your host manages DNS ("nameservers" point to the host), make the change at the host instead.
5. **Add the site.** Go to `search.google.com/search-console` → **+ Add property** → **Domain** → type `heatherchappell.com` (no https, no www) → Continue. Google shows a TXT record that starts `google-site-verification=`. Copy it.
6. **Paste it at the registrar.** In its **DNS** settings, add a record: Type **TXT**, Host/Name **@** (or leave blank), Value = the code. Save. Back in Search Console click **Verify**. If it fails, wait an hour and click Verify again (or choose **Verify later**).
7. **Submit the sitemap.** Left menu → **Sitemaps** → type `sitemap.xml` → **Submit**.
8. **Ask Google to look now.** Top search bar (**URL Inspection**) → paste each URL below → **Request indexing**. Do one at a time; Google limits this to roughly 10 a day:
   - `https://heatherchappell.com/`
   - `https://heatherchappell.com/side-eye/`
   - `https://heatherchappell.com/work/`
   - `https://heatherchappell.com/episodes/`
   - `https://heatherchappell.com/deep-dives/`
   - `https://heatherchappell.com/side-eye/vol-1/`
   - the Vol. 1 articles on the Great Emu War, Napoleon and Ross Perot (open `/side-eye/vol-1/` and copy each article's address)
   - your newest Deep Dive (on day two if you hit the daily limit)

## C. Bing (which also feeds ChatGPT search and Copilot)

9. **Bing Webmaster Tools:** go to `bing.com/webmasters`, sign in, and choose **Import from Google Search Console**. That copies your verified site and sitemap. No DNS work needed.
10. **IndexNow (after every upload).** This tells Bing and the other IndexNow engines that pages changed. Ask Claude to run it, or in a terminal from the site folder run:
    `bash seo/indexnow_ping.sh` (or add specific URLs after it).
    "OK (200)" or "OK (202)" means it worked. A 403 means the key file isn't uploaded yet.

## D. Point your other profiles at the site (this is how Google and AI tools learn who you are)

11. **YouTube.** In **YouTube Studio → Customization → Profile**:
    - Description: say plainly that the channel is the video side of **SIDE EYE magazine**, made by Heather Chappell and Edwin.
    - **Links → Add link:** "SIDE EYE magazine" → `https://heatherchappell.com/side-eye/`. Click **Publish**.
    - In each video description, add a line near the top: `Read the magazine + more: https://heatherchappell.com/side-eye/`
12. **LinkedIn.** Go to **Edit intro → Website** and add `https://heatherchappell.com/work/`. Then go to **Add profile section → Recommended → Add featured → Add a link** and add `https://heatherchappell.com/work/`.
13. **Amazon Author Central** (`author.amazon.com`): claim SIDE EYE Vol. 1 (**Books → Add a book → "This is my book"**), then **Profile → Biography**. Amazon won't make links clickable, so type the address as text: "More at heatherchappell.com".
14. **Google Business Profile:** you don't need one. It's for physical businesses, and it would put a location on the map.
15. **Google Knowledge Panel (later).** Once Google shows an info box when you search "Heather Chappell SIDE EYE", click **Claim this knowledge panel** at the bottom. Then sign in with the Google account that owns the YouTube channel or Search Console. If the button isn't there yet, check back every month or two. Steps 8–13 are what make it appear.

## E. Watch it work

16. **Search Console → Performance** (wait 1–2 weeks): see which searches show your pages. Also check **Pages** for anything "not indexed" and why.
17. **Bing Webmaster Tools:** look at Search Performance, plus the AI/Copilot reports if they show up for your account.
18. **AI referrals:** in your analytics, look for visits from `chatgpt.com`, `perplexity.ai`, `copilot.microsoft.com`, `gemini.google.com` and `claude.ai`. That's people clicking through from AI answers.

## F. Analytics (privacy-friendly, no cookie banner needed)

19. Pick one:
    - **Cloudflare Web Analytics.** It's free and works without moving your DNS. Go to dash.cloudflare.com → Analytics & Logs → Web Analytics → Add a site, then copy the token.
    - **GoatCounter.** It's free for personal sites.
    - **Plausible.** It's paid and the most polished.
    Then ask Claude to paste the snippet just before `</head>` in `template.html` and rebuild. The Cloudflare snippet looks like this:
    `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "PASTE_TOKEN_HERE"}'></script>`
