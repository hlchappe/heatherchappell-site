"""Find the countries a Deep Dive is about, from its own text. Used by build.py when a deepDives entry has no
"countries" list. To override, put "countries": ["Iran", "Israel"] on the entry in config.json."""
import re

# name -> (region, extra spellings)
C = {
 "United States": ("North America", ["U.S.", "US", "USA", "America", "American", "Americans", "Washington", "Pentagon", "Congress", "White House"]),
 "Canada": ("North America", ["Canadian", "Ottawa"]), "Mexico": ("North America", ["Mexican"]),
 "Brazil": ("Latin America", ["Brazilian"]), "Argentina": ("Latin America", ["Argentine"]), "Venezuela": ("Latin America", ["Venezuelan"]),
 "Colombia": ("Latin America", ["Colombian"]), "Chile": ("Latin America", ["Chilean"]), "Peru": ("Latin America", ["Peruvian"]), "Cuba": ("Latin America", ["Cuban"]),
 "Panama": ("Latin America", ["Panamanian"]), "Haiti": ("Latin America", ["Haitian"]),
 "United Kingdom": ("Europe", ["UK", "U.K.", "Britain", "British", "England", "London"]), "Ireland": ("Europe", ["Irish"]),
 "France": ("Europe", ["French", "Paris"]), "Germany": ("Europe", ["German", "Berlin"]), "Italy": ("Europe", ["Italian", "Rome"]),
 "Spain": ("Europe", ["Spanish", "Madrid"]), "Portugal": ("Europe", ["Portuguese"]), "Netherlands": ("Europe", ["Dutch"]),
 "Belgium": ("Europe", ["Belgian", "Brussels"]), "Switzerland": ("Europe", ["Swiss"]), "Austria": ("Europe", ["Austrian"]),
 "Poland": ("Europe", ["Polish", "Warsaw"]), "Ukraine": ("Europe", ["Ukrainian", "Kyiv", "Kiev"]), "Russia": ("Europe", ["Russian", "Moscow", "Kremlin"]),
 "Belarus": ("Europe", ["Belarusian", "Minsk"]), "Estonia": ("Europe", ["Estonian", "Tallinn"]), "Latvia": ("Europe", ["Latvian", "Riga"]),
 "Lithuania": ("Europe", ["Lithuanian", "Vilnius"]), "Finland": ("Europe", ["Finnish", "Helsinki"]), "Sweden": ("Europe", ["Swedish", "Stockholm"]),
 "Norway": ("Europe", ["Norwegian", "Oslo"]), "Denmark": ("Europe", ["Danish", "Copenhagen"]), "Greece": ("Europe", ["Greek", "Athens"]),
 "Hungary": ("Europe", ["Hungarian", "Budapest"]), "Romania": ("Europe", ["Romanian"]), "Serbia": ("Europe", ["Serbian"]), "Moldova": ("Europe", ["Moldovan"]),
 "Turkey": ("Middle East", ["Turkish", "Türkiye", "Ankara"]), "Iran": ("Middle East", ["Iranian", "Tehran"]), "Iraq": ("Middle East", ["Iraqi", "Baghdad"]),
 "Israel": ("Middle East", ["Israeli", "Jerusalem", "Tel Aviv"]), "Palestine": ("Middle East", ["Palestinian", "Gaza", "West Bank"]),
 "Lebanon": ("Middle East", ["Lebanese", "Beirut", "Hezbollah"]), "Syria": ("Middle East", ["Syrian", "Damascus"]), "Jordan": ("Middle East", ["Jordanian"]),
 "Saudi Arabia": ("Middle East", ["Saudi", "Riyadh"]), "United Arab Emirates": ("Middle East", ["UAE", "Emirati", "Abu Dhabi", "Dubai"]),
 "Qatar": ("Middle East", ["Qatari", "Doha"]), "Kuwait": ("Middle East", ["Kuwaiti"]), "Bahrain": ("Middle East", ["Bahraini"]), "Oman": ("Middle East", ["Omani"]),
 "Yemen": ("Middle East", ["Yemeni", "Houthi", "Houthis"]), "Egypt": ("Africa", ["Egyptian", "Cairo"]),
 "Libya": ("Africa", ["Libyan"]), "Sudan": ("Africa", ["Sudanese"]), "Ethiopia": ("Africa", ["Ethiopian"]), "Kenya": ("Africa", ["Kenyan"]),
 "Nigeria": ("Africa", ["Nigerian"]), "South Africa": ("Africa", ["South African"]), "Somalia": ("Africa", ["Somali"]),
 "Democratic Republic of the Congo": ("Africa", ["DRC", "Congolese"]), "Morocco": ("Africa", ["Moroccan"]),
 "China": ("Asia-Pacific", ["Chinese", "Beijing"]), "Taiwan": ("Asia-Pacific", ["Taiwanese", "Taipei"]), "Japan": ("Asia-Pacific", ["Japanese", "Tokyo"]),
 "South Korea": ("Asia-Pacific", ["South Korean", "Seoul"]), "North Korea": ("Asia-Pacific", ["North Korean", "Pyongyang"]),
 "India": ("Asia-Pacific", ["Indian", "New Delhi"]), "Pakistan": ("Asia-Pacific", ["Pakistani", "Islamabad"]), "Afghanistan": ("Asia-Pacific", ["Afghan", "Kabul", "Taliban"]),
 "Bangladesh": ("Asia-Pacific", ["Bangladeshi"]), "Indonesia": ("Asia-Pacific", ["Indonesian"]), "Philippines": ("Asia-Pacific", ["Philippine", "Filipino", "Manila"]),
 "Vietnam": ("Asia-Pacific", ["Vietnamese"]), "Thailand": ("Asia-Pacific", ["Thai"]), "Malaysia": ("Asia-Pacific", ["Malaysian"]), "Singapore": ("Asia-Pacific", ["Singaporean"]),
 "Myanmar": ("Asia-Pacific", ["Burma", "Burmese"]), "Australia": ("Asia-Pacific", ["Australian", "Canberra"]), "New Zealand": ("Asia-Pacific", ["New Zealander"]),
}
REGION = {k: v[0] for k, v in C.items()}
_pats = {k: re.compile(r"(?<![\w.])(" + "|".join(re.escape(x) for x in [k] + v[1]) + r")(?![\w])") for k, v in C.items()}


def _text(o):
    if isinstance(o, str):
        return o + " "
    if isinstance(o, dict):
        return "".join(_text(v) for k, v in o.items() if k not in ("sources", "links", "slug", "url"))
    if isinstance(o, list):
        return "".join(_text(x) for x in o)
    return ""


def detect(dive, top=4, title_weight=6):
    """Countries named most in a dive (title, bottom line and headings count extra)."""
    body = _text(dive)
    head = " ".join([str(dive.get("title") or ""), str(dive.get("from") or ""), str(dive.get("bottomLine") or "")])
    score = {}
    for k, p in _pats.items():
        n = len(p.findall(body)) + title_weight * len(p.findall(head))
        if n:
            score[k] = n
    if not score:
        return []
    best = max(score.values())
    keep = [k for k, n in sorted(score.items(), key=lambda kv: -kv[1]) if n >= max(4, best * 0.2)]
    return keep[:top]


def regions(countries):
    return list(dict.fromkeys(REGION.get(c, "Other") for c in countries))
