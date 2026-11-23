#!/usr/bin/env bash
# Tell Bing, Yandex, Naver, Seznam etc. (via IndexNow) that heatherchappell.com changed.
# Run after each upload:   bash seo/indexnow_ping.sh
# Optional: ping only specific URLs:   bash seo/indexnow_ping.sh https://heatherchappell.com/deep-dives/new-slug/
# Needs: curl + python3. The key file <KEY>.txt must be live at https://heatherchappell.com/<KEY>.txt
set -euo pipefail
HOST="heatherchappell.com"
KEY="8de69610ebaea3e0ec62e5c9a53de56d"
KEY_LOCATION="https://${HOST}/${KEY}.txt"
SITEMAP_URL="https://${HOST}/sitemap.xml"

# 1. Sanity check: the key file must be reachable, or IndexNow rejects the ping (403).
if ! curl -fsS "$KEY_LOCATION" | grep -q "$KEY"; then
  echo "Key file not found at $KEY_LOCATION - upload ${KEY}.txt to the site root first." >&2
  exit 1
fi

# 2. URL list: arguments if given, otherwise every <loc> in the live sitemap.
if [ "$#" -gt 0 ]; then
  URLS=$(printf '%s\n' "$@")
else
  URLS=$(curl -fsS "$SITEMAP_URL" | python3 -c '
import sys, xml.etree.ElementTree as ET
ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
for loc in ET.fromstring(sys.stdin.buffer.read()).findall("s:url/s:loc", ns):
    print(loc.text.strip())')
fi

BODY=$(URLS="$URLS" python3 -c '
import json, os
urls = [u for u in os.environ["URLS"].splitlines() if u.strip()][:10000]
print(json.dumps({"host": "'"$HOST"'", "key": "'"$KEY"'", "keyLocation": "'"$KEY_LOCATION"'", "urlList": urls}))')

echo "Submitting $(printf '%s\n' "$URLS" | grep -c .) URLs to IndexNow..."
CODE=$(curl -sS -o /tmp/indexnow_resp.txt -w '%{http_code}' -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" --data "$BODY")
case "$CODE" in
  200|202) echo "OK ($CODE): search engines notified." ;;
  400) echo "400 Bad request - check the URL list." ;;
  403) echo "403 Key not valid - is ${KEY}.txt uploaded to the site root?" ;;
  422) echo "422 URLs don't match heatherchappell.com or the key." ;;
  429) echo "429 Too many requests - wait and try later." ;;
  *)   echo "Unexpected response $CODE:"; cat /tmp/indexnow_resp.txt ;;
esac
